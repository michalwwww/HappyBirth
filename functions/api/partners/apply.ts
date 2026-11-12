import {
  createSignedSessionToken,
  formatSessionSetCookie,
  resolveEdgeSessionSecret,
} from '../../_shared/session';
import { generateSmartPartnerCodeCandidates } from '../../../lib/brand-codes';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const host = request.headers.get('host');
    const body: any = await request.json().catch(() => ({}));
    const fullName = (body.fullName || body.contactName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const channel = body.channel || (body.inquiryType === 'b2b_brand' ? 'partnerzy_b2b' : 'afiliacja');
    const companyOrBrand = (body.companyOrBrand || body.companyOrPracticeName || '').trim() || null;
    const phone = (body.phone || '').trim() || null;
    const roleCategory = body.roleCategory || 'standard';
    const roleOrArea = (
      body.roleOrArea ||
      body.cooperationModel ||
      'Student kierunku medycznego / Ambasador HappyBirth'
    ).trim();
    const profileUrl = (body.profileUrl || body.websiteOrSocial || '').trim() || null;
    const message = (body.message || '').trim() || null;
    const brokerRef = (body.brokerRef || '').trim() || null;
    const rodoConsent = body.rodoConsent === false ? 0 : 1;

    if (!fullName || !email || !email.includes('@') || !rodoConsent) {
      return new Response(
        JSON.stringify({ error: 'Podaj imię i nazwisko, poprawny adres e-mail oraz zaznacz zgodę RODO.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = `inq_${crypto.randomUUID()}`;
    let promoCode: string | null = null;
    let refSlug: string | null = null;
    let tier1Rate = 0.2;

    if (channel === 'afiliacja') {
      // Każde nowe konto startuje bezpiecznie w Etapie 1 ze stawką bazową 20% (0.20).
      // Jeśli wybrano profil z Etapu 2 (25% lub 30%), wniosek trafia do weryfikacji w Panelu Administratora.
      tier1Rate = 0.2;
      const smartCandidates = generateSmartPartnerCodeCandidates(fullName, roleCategory, email);
      const userPreferred = String(body.preferredPromoCode || '')
        .trim()
        .toUpperCase()
        .replace(/^MAMA[-_]?/i, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9_-]/g, '');

      const candidateCodes: string[] = [];
      if (userPreferred.length >= 4 && userPreferred.length <= 24) {
        candidateCodes.push(userPreferred.includes('-') ? userPreferred : `SPOKOJ-${userPreferred}`);
      }
      for (const s of smartCandidates) {
        if (!candidateCodes.includes(s.code)) candidateCodes.push(s.code);
      }

      promoCode = candidateCodes[0] || 'SPOKOJ-PARTNER';
      if (env.DB) {
        for (const cand of candidateCodes) {
          const taken = await env.DB.prepare(
            `SELECT email FROM affiliates WHERE UPPER(promo_code) = ? LIMIT 1`
          )
            .bind(cand)
            .first()
            .catch(() => null);
          if (!taken || String(taken.email).toLowerCase() === email) {
            promoCode = cand;
            break;
          }
        }
      }
      refSlug = promoCode.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    }

    if (env.DB) {
      try {
        const inquiryRoleLabel =
          roleCategory === 'midwife_physio'
            ? `[WNIOSEK ETAP 2: 30% Położna/Fizjo] ${roleOrArea}`
            : roleCategory === 'creator_publisher'
              ? `[WNIOSEK ETAP 2: 25% Twórca] ${roleOrArea}`
              : roleOrArea;

        await env.DB.prepare(
          `INSERT INTO partnership_inquiries (
             id, channel, full_name, company_or_brand, email, phone,
             role_or_area, profile_url, message, rodo_consent
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            id,
            channel === 'partnerzy_b2b' ? 'partnerzy_b2b' : 'afiliacja',
            fullName,
            companyOrBrand,
            email,
            phone,
            inquiryRoleLabel,
            profileUrl,
            message,
            rodoConsent
          )
          .run();

        if (channel === 'afiliacja' && promoCode && refSlug) {
          const cat = 'standard';

          let brokerId: string | null = null;
          if (brokerRef) {
            const brokerRow = await env.DB.prepare(
              `SELECT id, email FROM affiliates
               WHERE (LOWER(ref_slug) = LOWER(?) OR UPPER(promo_code) = UPPER(?))
                 AND status = 'active'
               LIMIT 1`
            )
              .bind(brokerRef, brokerRef)
              .first()
              .catch(() => null);
            if (brokerRow?.id && String(brokerRow.email).toLowerCase() !== email) {
              brokerId = brokerRow.id;
            }
          }

          await env.DB.prepare(
            `INSERT INTO affiliates (
               id, email, full_name, role_category, specialization,
               profile_or_practice_url, promo_code, ref_slug, tier1_rate,
               referred_by_broker_id, tier2_override_rate, status
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.05, 'active')
             ON CONFLICT(email) DO UPDATE SET
               full_name = excluded.full_name,
               role_category = excluded.role_category,
               specialization = excluded.specialization,
               profile_or_practice_url = COALESCE(NULLIF(excluded.profile_or_practice_url, ''), affiliates.profile_or_practice_url),
               tier1_rate = MAX(affiliates.tier1_rate, excluded.tier1_rate)`
          )
            .bind(
              `aff_${crypto.randomUUID()}`,
              email,
              fullName,
              cat,
              roleOrArea,
              profileUrl || '',
              promoCode,
              refSlug,
              tier1Rate,
              brokerId
            )
            .run();

          const savedAff = await env.DB.prepare(
            `SELECT promo_code, ref_slug, tier1_rate FROM affiliates WHERE email = ?`
          )
            .bind(email)
            .first()
            .catch(() => null);

          if (savedAff?.promo_code) {
            promoCode = savedAff.promo_code;
            refSlug = savedAff.ref_slug;
            tier1Rate = Number(savedAff.tier1_rate || tier1Rate);
          }
        }
      } catch (e) {
        console.error('Błąd zapisu zgłoszenia partnerskiego w D1:', e);
      }
    }

    // Powiadomienie e-mail do Partnera oraz do Zespołu KLARSOLUTIONS Sp. z o.o.
    if (env.RESEND_API_KEY) {
      const fromAddress = env.RESEND_FROM || 'Program Partnerski HappyBirth <kontakt@happybirth.pl>';
      await Promise.allSettled([
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject:
              channel === 'afiliacja'
                ? `Twoje konto afiliacyjne HappyBirth.pl (${promoCode}) jest aktywne!`
                : 'Potwierdzenie zgłoszenia współpracy B2B — HappyBirth.pl',
            html: `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                <h2 style="margin-top: 0; color: #20071E;">Witamy w Programie Partnerskim, ${fullName}!</h2>
                ${
                  channel === 'afiliacja'
                    ? `<p style="font-size: 14px; color: #544A44; line-height: 1.6;">Twoje konto w Programie Afiliacyjnym HappyBirth zostało aktywowane (stawka prowizji: <strong>${Math.round(tier1Rate * 100)}%</strong> + 5% Broker Override).</p>
                       <p style="font-size: 14px; color: #544A44; line-height: 1.6;">Twój semantyczny kod rabatowy (-10% dla przyszłych rodziców): <strong>${promoCode}</strong><br/>Twój krótki link polecający: <strong>https://happybirth.pl/poleca/${refSlug}</strong><br/>Link z kodem w koszyku: <strong>https://happybirth.pl/?kod=${promoCode}</strong></p>
                       <div style="margin: 20px 0;">
                         <a href="https://afiliacja.happybirth.pl" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 13px; display: inline-block;">Otwórz Kokpit Biznesowy Partnera &rarr;</a>
                       </div>`
                    : `<p style="font-size: 14px; color: #544A44; line-height: 1.6;">Twoje zapytanie B2B zostało przekazane do opiekuna partnerstw w KLARSOLUTIONS Sp. z o.o. Skontaktujemy się z Tobą w ciągu 1 dnia roboczego.</p>`
                }
                <p style="font-size: 11.5px; color: #867A72; margin-top: 20px;">KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396</p>
              </div>
            `,
          }),
        }),
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: ['kontakt@happybirth.pl'],
            subject: `[Nowe zgłoszenie ${channel.toUpperCase()}] ${fullName} (${email})`,
            html: `
              <div style="font-family: sans-serif; font-size: 13px; color: #1A1512;">
                <h3>Nowe zgłoszenie partnerskie (${channel})</h3>
                <p><strong>Imię i nazwisko:</strong> ${fullName}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Firma / Gabinet:</strong> ${companyOrBrand || '-'}</p>
                <p><strong>Telefon:</strong> ${phone || '-'}</p>
                <p><strong>Specjalizacja / Obszar:</strong> ${roleOrArea}</p>
                <p><strong>Profil / WWW:</strong> ${profileUrl || '-'}</p>
                <p><strong>Kod afiliacyjny:</strong> ${promoCode || '-'}</p>
                <p><strong>Wiadomość:</strong> ${message || '-'}</p>
              </div>
            `,
          }),
        }),
      ]);
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    // Natychmiastowe zalogowanie partnera do Kokpitu Afiliacyjnego po rejestracji
    if (channel === 'afiliacja') {
      const secret = resolveEdgeSessionSecret(env, request, host || undefined);
      if (secret) {
        const token = await createSignedSessionToken(
          {
            userId: `usr_${email.replace(/[^a-z0-9]/g, '')}`,
            email,
            role: 'student',
          },
          secret
        );
        headers['Set-Cookie'] = formatSessionSetCookie(token, host || undefined);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inquiryId: id,
        channel,
        promoCode,
        refSlug,
        tier1RatePercent: Math.round(tier1Rate * 100),
        suggestedPromoCode: promoCode,
        suggestedAffiliateLink: refSlug ? `https://happybirth.pl/poleca/${refSlug}` : null,
        message:
          channel === 'afiliacja'
            ? 'Twoje konto w Programie Afiliacyjnym zostało aktywowane! Zostałaś automatycznie zalogowana do Kokpitu Biznesowego.'
            : 'Twoje zapytanie B2B zostało zarejestrowane. Opiekun partnerstw KLARSOLUTIONS Sp. z o.o. skontaktuje się z Tobą w ciągu 1 dnia roboczego.',
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd wysyłki formularza' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
