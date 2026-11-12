import { checkRateLimitD1, escapeHtml, extractClientIp } from '../_shared/session';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const clientIp = extractClientIp(request);
    if (env.DB) {
      const allowed = await checkRateLimitD1(env.DB, `withdrawal:${clientIp}`, 6, 15);
      if (!allowed) {
        return new Response(
          JSON.stringify({
            error: 'Zbyt wiele zgłoszeń z tego adresu IP. Odczekaj kilka minut i spróbuj ponownie.',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const body: any = await request.json().catch(() => ({}));
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const orderNumber = String(body.orderNumber || '').trim();
    const scope = body.scope === 'order_bump_only' ? 'order_bump_only' : 'full_order';
    const reason = String(body.reason || '').trim() || null;

    if (!fullName || !email || !email.includes('@') || !orderNumber) {
      return new Response(
        JSON.stringify({
          error: 'Proszę wypełnić imię i nazwisko, adres e-mail użyty przy zakupie oraz numer zamówienia.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isOrderBumpOnly = scope === 'order_bump_only';
    const nowIso = new Date().toISOString();
    const upperOrderNum = orderNumber.toUpperCase();
    let orderId: string | null = null;
    let orderFound = false;
    let orderBumpIncluded = false;
    let waiverAccepted = false;
    let firstAccessedAt: string | null = null;

    if (env.DB) {
      try {
        const orderRow = await env.DB.prepare(
          `SELECT id, first_content_accessed_at, waiver_art38_accepted, order_bump_included
           FROM orders
           WHERE (order_number = ? OR stripe_session_id = ?) AND LOWER(customer_email) = ?
           ORDER BY created_at DESC LIMIT 1`
        )
          .bind(upperOrderNum, orderNumber, email)
          .first();

        const enrollmentRow = await env.DB.prepare(
          `SELECT e.first_content_accessed_at, e.order_bump_included
           FROM enrollments e
           JOIN users u ON u.id = e.user_id
           WHERE LOWER(u.email) = ?
           ORDER BY e.created_at DESC LIMIT 1`
        )
          .bind(email)
          .first();

        if (orderRow) {
          orderFound = true;
          orderId = orderRow.id;
          orderBumpIncluded = Boolean(orderRow.order_bump_included || enrollmentRow?.order_bump_included);
          waiverAccepted = Boolean(orderRow.waiver_art38_accepted);
          firstAccessedAt =
            orderRow.first_content_accessed_at ||
            enrollmentRow?.first_content_accessed_at ||
            null;
        }
      } catch {
        // Fallback do weryfikacji ręcznej
      }
    }

    let decisionStatus: 'auto_rejected_art38' | 'approved_for_refund' | 'pending_manual_verification';
    let autoRejected = false;
    let message: string;

    if (!orderFound) {
      decisionStatus = 'pending_manual_verification';
      autoRejected = false;
      message =
        'Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Podany numer zamówienia lub adres e-mail nie został automatycznie dopasowany w rejestrze zamówień, dlatego Twoje oświadczenie zostało przekazane do indywidualnej weryfikacji przez Dział Obsługi Klienta (pomoc@happybirth.pl). Odpowiedź otrzymasz na podany adres e-mail niezwłocznie po sprawdzeniu danych płatności.';
    } else if (isOrderBumpOnly) {
      if (!orderBumpIncluded) {
        decisionStatus = 'pending_manual_verification';
        autoRejected = false;
        message =
          'Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. W automatycznym rejestrze dla wskazanego zamówienia nie odnotowano aktywnego pakietu dodatkowego (Order Bump +49,00 zł), dlatego zgłoszenie przekazaliśmy do weryfikacji przez Dział Obsługi Klienta (pomoc@happybirth.pl).';
      } else if (waiverAccepted && Boolean(firstAccessedAt)) {
        decisionStatus = 'auto_rejected_art38';
        autoRejected = true;
        message = `Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Jednocześnie informujemy, że zgodnie z art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, prawo odstąpienia od umowy o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym wygasło z chwilą rozpoczęcia korzystania z materiałów w Strefie Kursantki (odnotowane otwarcie: ${firstAccessedAt}), po uprzednim wyrażeniu wyraźnej zgody przed dokonaniem płatności.`;
      } else {
        decisionStatus = 'approved_for_refund';
        autoRejected = false;
        message =
          'Przyjęliśmy Twoje oświadczenie o częściowym odstąpieniu od umowy w zakresie niewykorzystanego pakietu dodatkowego (Order Bump +49,00 zł). Zwrot kwoty 49,00 zł zostanie przekazany w terminie do 14 dni kalendarzowych, a dostęp do kursu głównego pozostaje aktywny.';
      }
    } else if (waiverAccepted && Boolean(firstAccessedAt)) {
      decisionStatus = 'auto_rejected_art38';
      autoRejected = true;
      message = `Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Ponieważ przed zakupem wyrażono zgodę na natychmiastowe dostarczenie treści cyfrowych przed upływem 14 dni i rozpoczęto korzystanie z kursu (odnotowane otwarcie: ${firstAccessedAt}), prawo do odstąpienia od umowy wygasło na mocy art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta. Twój 18-miesięczny dostęp do platformy HappyBirth.pl pozostaje w pełni aktywny.`;
    } else {
      decisionStatus = 'approved_for_refund';
      autoRejected = false;
      message =
        'Potwierdzamy wpływ Twojego oświadczenia o odstąpieniu od umowy na trwałym nośniku. Ponieważ materiały kursowe nie zostały jeszcze uruchomione na Twoim koncie, zwrot środków nastąpi w terminie do 14 dni kalendarzowych.';
    }

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO withdrawal_requests (
             id, order_id, full_name, email, order_number, scope, reason,
             status, auto_rejected_due_to_art38, decision_explanation, confirmation_email_sent_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(
            crypto.randomUUID(),
            orderId,
            fullName,
            email,
            orderNumber,
            scope,
            reason,
            decisionStatus,
            autoRejected ? 1 : 0,
            message
          )
          .run();
      } catch (e) {
        console.error('Błąd zapisu withdrawal_requests w D1:', e);
      }
    }

    if (env.RESEND_API_KEY) {
      const fromAddress = env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>';
      const safeFullName = escapeHtml(fullName);
      const safeOrderNumber = escapeHtml(orderNumber);
      const safeNowIso = escapeHtml(nowIso);
      const safeMessage = escapeHtml(message);
      const safeEmail = escapeHtml(email);
      const safeScope = escapeHtml(scope);
      const safeReason = escapeHtml(reason || '-');
      const safeStatus = escapeHtml(decisionStatus);

      const emailTasks: Promise<any>[] = [
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `Potwierdzenie złożenia oświadczenia o odstąpieniu od umowy (${orderNumber})`,
            html: `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                <h2 style="margin-top: 0; color: #20071E;">Potwierdzenie otrzymania oświadczenia (Trwały Nośnik)</h2>
                <p style="font-size: 13.5px; color: #544A44;"><strong>Imię i nazwisko:</strong> ${safeFullName}<br/><strong>Zamówienie:</strong> ${safeOrderNumber}<br/><strong>Data i godzina złożenia:</strong> ${safeNowIso}</p>
                <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 14px; font-size: 13px; color: #1A1512; line-height: 1.6;">
                  ${safeMessage}
                </div>
                <p style="font-size: 11px; color: #867A72; margin-top: 18px;">KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy KRS · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN</p>
              </div>
            `,
          }),
        }),
      ];

      // Alert operacyjny do zespołu dla wszystkich zgłoszeń wymagających zwrotu lub ręcznej weryfikacji
      if (decisionStatus !== 'auto_rejected_art38') {
        emailTasks.push(
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: ['kontakt@happybirth.pl'],
              subject: `[ODSTĄPIENIE OD UMOWY: ${decisionStatus}] ${orderNumber} (${email})`,
              html: `
                <div style="font-family: sans-serif; font-size: 13px; color: #1A1512;">
                  <h3>Nowe zgłoszenie w formularzu /odstap-od-umowy</h3>
                  <p><strong>Status automatyczny:</strong> ${safeStatus}</p>
                  <p><strong>Dopasowano w bazie orders:</strong> ${orderFound ? `TAK (ID: ${escapeHtml(orderId || '')})` : 'NIE — wymagana ręczna weryfikacja'}</p>
                  <p><strong>Imię i nazwisko:</strong> ${safeFullName}</p>
                  <p><strong>E-mail klienta:</strong> ${safeEmail}</p>
                  <p><strong>Podany numer zamówienia:</strong> ${safeOrderNumber}</p>
                  <p><strong>Zakres:</strong> ${safeScope}</p>
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

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: nowIso,
        status: decisionStatus,
        auto_rejected_due_to_art38: autoRejected,
        message,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(JSON.stringify({ error: 'Błąd przetwarzania formularza.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
