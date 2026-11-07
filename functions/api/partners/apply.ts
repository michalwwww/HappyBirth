interface Env {
  DB?: any;
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
    const body: any = await request.json().catch(() => ({}));
    const fullName = (body.fullName || body.contactName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const channel = body.channel || (body.inquiryType === 'b2b_brand' ? 'partnerzy_b2b' : 'afiliacja');
    const companyOrBrand = (body.companyOrBrand || body.companyOrPracticeName || '').trim() || null;
    const phone = (body.phone || '').trim() || null;
    const roleCategory = body.roleCategory || 'midwife_physio';
    const roleOrArea = (body.roleOrArea || body.cooperationModel || 'Położna / Twórca').trim();
    const profileUrl = (body.profileUrl || body.websiteOrSocial || '').trim() || null;
    const message = (body.message || '').trim() || null;
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
      tier1Rate =
        roleCategory === 'midwife_physio'
          ? 0.3
          : roleCategory === 'creator_publisher'
            ? 0.25
            : 0.2;
      const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();
      const baseCode = (body.preferredPromoCode || fullName)
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u306f]/g, '')
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6) || 'PARTNER';
      promoCode = `${baseCode}-${suffix}10`;
      refSlug = `${baseCode.toLowerCase()}-${suffix.toLowerCase()}`;
    }

    if (env.DB) {
      try {
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
            roleOrArea,
            profileUrl,
            message,
            rodoConsent
          )
          .run();

        if (channel === 'afiliacja' && promoCode && refSlug) {
          const cat =
            roleCategory === 'midwife_physio' || roleCategory === 'creator_publisher'
              ? roleCategory
              : 'standard';
          await env.DB.prepare(
            `INSERT INTO affiliates (
               id, email, full_name, role_category, specialization,
               profile_or_practice_url, promo_code, ref_slug, tier1_rate, status
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
             ON CONFLICT(email) DO NOTHING`
          )
            .bind(
              crypto.randomUUID(),
              email,
              fullName,
              cat,
              roleOrArea,
              profileUrl || '',
              promoCode,
              refSlug,
              tier1Rate
            )
            .run();
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
                ? `Twoje konto afiliacyjne HappyBirth.pl (${promoCode}) jest gotowe!`
                : 'Potwierdzenie zgłoszenia współpracy B2B — HappyBirth.pl',
            html: `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                <h2 style="margin-top: 0; color: #20071E;">Dziękujemy za zgłoszenie, ${fullName}!</h2>
                ${
                  channel === 'afiliacja'
                    ? `<p style="font-size: 14px; color: #544A44; line-height: 1.6;">Twoje zgłoszenie do Programu Afiliacyjnego HappyBirth zostało zarejestrowane. Twój indywidualny kod rabatowy (-10% dla przyszłych mam) to: <strong>${promoCode}</strong>, a Twój link polecający (30-dniowe ciasteczko): <strong>https://happybirth.pl/?ref=${refSlug}</strong>.</p>`
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

    return new Response(
      JSON.stringify({
        success: true,
        inquiryId: id,
        channel,
        promoCode,
        refSlug,
        tier1RatePercent: Math.round(tier1Rate * 100),
        suggestedPromoCode: promoCode,
        suggestedAffiliateLink: refSlug ? `https://happybirth.pl/?ref=${refSlug}` : null,
        message:
          channel === 'afiliacja'
            ? 'Twoje zgłoszenie do Programu Afiliacyjnego HappyBirth zostało przyjęte. Na Twój e-mail wysłaliśmy aktywny kod rabatowy (-10%) oraz link partnerski.'
            : 'Twoje zapytanie B2B zostało zarejestrowane. Opiekun partnerstw KLARSOLUTIONS Sp. z o.o. skontaktuje się z Tobą w ciągu 1 dnia roboczego.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd wysyłki formularza' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
