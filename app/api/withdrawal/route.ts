import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';
import { evaluateWithdrawalRequest, OPERATOR_LEGAL_DATA } from '@/lib/legal-shield';
import { checkRateLimitNodeD1, escapeHtml, extractNodeClientIp } from '@/lib/security';

export const runtime = 'nodejs';

/**
 * [E2] Jednoklikowe odstąpienie od umowy (wymóg od 19.06.2026 r.)
 * współpracujące z Tarczą Prawną [E1] (Art. 38 ust. 1 pkt 13 u.p.k.).
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = extractNodeClientIp(req);
    const allowed = await checkRateLimitNodeD1(`withdrawal:${clientIp}`, 6, 15);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Zbyt wiele zgłoszeń z tego adresu IP. Odczekaj kilka minut i spróbuj ponownie.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      fullName,
      email,
      orderNumber,
      scope = 'full_order',
      reason = '',
    } = body;

    if (!fullName || !email || !email.includes('@') || !orderNumber) {
      return NextResponse.json(
        { error: 'Proszę wypełnić imię i nazwisko, adres e-mail użyty przy zakupie oraz numer zamówienia.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOrderNum = String(orderNumber).trim().toUpperCase();
    const cleanScope: 'full_order' | 'order_bump_only' =
      scope === 'order_bump_only' ? 'order_bump_only' : 'full_order';

    // 1. Wyszukaj zamówienie w bazie D1 (zgodność numeru zamówienia/sesji ORAZ adresu e-mail kupującego)
    const order = await d1First<{
      id: string;
      order_number: string;
      waiver_art38_accepted: number;
      first_content_accessed_at: string | null;
      order_bump_included: number;
    }>(
      `SELECT id, order_number, waiver_art38_accepted, first_content_accessed_at, order_bump_included
       FROM orders
       WHERE (order_number = ? OR stripe_session_id = ?) AND LOWER(customer_email) = ?
       ORDER BY created_at DESC LIMIT 1`,
      [cleanOrderNum, String(orderNumber).trim(), cleanEmail]
    );

    // Sprawdź także tabelę enrollments, jeśli first_content_accessed_at zapisano tam
    const enrollment = await d1First<{
      first_content_accessed_at: string | null;
      order_bump_included: number;
    }>(
      `SELECT e.first_content_accessed_at, e.order_bump_included
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       WHERE LOWER(u.email) = ?
       ORDER BY e.created_at DESC LIMIT 1`,
      [cleanEmail]
    );

    const firstAccessedAt =
      order?.first_content_accessed_at ||
      enrollment?.first_content_accessed_at ||
      null;

    const evaluation = evaluateWithdrawalRequest({
      scope: cleanScope,
      orderFound: Boolean(order),
      waiverArt38Accepted: order ? Boolean(order.waiver_art38_accepted) : false,
      firstContentAccessedAt: firstAccessedAt,
      orderBumpIncluded: Boolean(order?.order_bump_included || enrollment?.order_bump_included),
    });

    const requestId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    // 2. Zapisz zgłoszenie w tabeli withdrawal_requests
    await d1Run(
      `INSERT INTO withdrawal_requests (
         id, order_id, full_name, email, order_number, scope, reason,
         status, auto_rejected_due_to_art38, decision_explanation, confirmation_email_sent_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        order?.id || null,
        String(fullName).trim(),
        cleanEmail,
        cleanOrderNum,
        cleanScope,
        String(reason).slice(0, 500),
        evaluation.status,
        evaluation.autoRejectedDueToArt38 ? 1 : 0,
        evaluation.customerLegalNotice,
        nowIso,
      ]
    );

    // 3. Natychmiast wyślij potwierdzenie wpływu oświadczenia na trwałym nośniku (wymóg z 19.06.2026 r.) oraz alert operacyjny dla zespołu
    if (process.env.RESEND_API_KEY) {
      const safeFullName = escapeHtml(String(fullName).trim());
      const safeOrderNum = escapeHtml(cleanOrderNum);
      const safeNowIso = escapeHtml(nowIso);
      const safeNotice = escapeHtml(evaluation.customerLegalNotice);
      const safeEmail = escapeHtml(cleanEmail);
      const safeReason = escapeHtml(String(reason).slice(0, 500) || '-');
      const phonePart = OPERATOR_LEGAL_DATA.contactPhone.trim()
        ? ` | Tel.: ${escapeHtml(OPERATOR_LEGAL_DATA.contactPhone.trim())}`
        : '';

      const emailTasks: Promise<any>[] = [
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'HappyBirth.pl <pomoc@happybirth.pl>',
            to: [cleanEmail],
            subject: `Potwierdzenie wpływu zgłoszenia (${cleanOrderNum}) na trwałym nośniku — HappyBirth.pl`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                <h2 style="color: #1A1512; margin-top: 0;">Potwierdzenie otrzymania oświadczenia o odstąpieniu od umowy</h2>
                <p style="font-size: 14px; line-height: 1.6;">
                  Dzień dobry <strong>${safeFullName}</strong>,<br/>
                  zgodnie z wymogami ustawy o prawach konsumenta obowiązującymi od 19.06.2026 r. potwierdzamy na trwałym nośniku wpływ Twojego zgłoszenia z dnia <code>${safeNowIso}</code> dotyczącego zamówienia <strong>${safeOrderNum}</strong>.
                </p>
                <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 16px; margin: 18px 0; font-size: 13.5px; line-height: 1.6;">
                  <strong>Status weryfikacji zamówienia:</strong><br/>
                  ${safeNotice}
                </div>
                <p style="font-size: 11.5px; color: #867A72;">
                  ${OPERATOR_LEGAL_DATA.fullName}, ${OPERATOR_LEGAL_DATA.address}, ${OPERATOR_LEGAL_DATA.court}, NIP: ${OPERATOR_LEGAL_DATA.nip}, KRS: ${OPERATOR_LEGAL_DATA.krs}, kapitał zakładowy: ${OPERATOR_LEGAL_DATA.shareCapital}. Kontakt: ${OPERATOR_LEGAL_DATA.supportEmail}${phonePart}
                </p>
              </div>
            `,
          }),
        }),
      ];

      if (evaluation.status !== 'auto_rejected_art38') {
        emailTasks.push(
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'HappyBirth.pl <pomoc@happybirth.pl>',
              to: [OPERATOR_LEGAL_DATA.contactEmail],
              subject: `[ODSTĄPIENIE OD UMOWY: ${evaluation.status}] ${cleanOrderNum} (${cleanEmail})`,
              html: `
                <div style="font-family: sans-serif; font-size: 13px; color: #1A1512;">
                  <h3>Nowe zgłoszenie w formularzu /odstap-od-umowy</h3>
                  <p><strong>Status automatyczny:</strong> ${escapeHtml(evaluation.status)}</p>
                  <p><strong>Dopasowano w bazie orders:</strong> ${order ? `TAK (ID: ${escapeHtml(order.id)})` : 'NIE — wymagana ręczna weryfikacja'}</p>
                  <p><strong>Imię i nazwisko:</strong> ${safeFullName}</p>
                  <p><strong>E-mail klienta:</strong> ${safeEmail}</p>
                  <p><strong>Podany numer zamówienia:</strong> ${safeOrderNum}</p>
                  <p><strong>Zakres:</strong> ${escapeHtml(cleanScope)}</p>
                  <p><strong>Uwagi klienta:</strong> ${safeReason}</p>
                  <p><strong>Znacznik czasu UTC:</strong> ${safeNowIso}</p>
                </div>
              `,
            }),
          })
        );
      }

      await Promise.allSettled(emailTasks);
    }

    return NextResponse.json({
      success: true,
      requestId,
      timestamp: nowIso,
      status: evaluation.status,
      auto_rejected_due_to_art38: evaluation.autoRejectedDueToArt38,
      message: evaluation.customerLegalNotice,
    });
  } catch (err: any) {
    console.error('Błąd w /api/withdrawal:', err);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania zgłoszenia.' },
      { status: 500 }
    );
  }
}
