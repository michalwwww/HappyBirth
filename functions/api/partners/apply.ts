interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
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
            ? 'Twoje zgłoszenie do Programu Afiliacyjnego HappyBirth zostało przyjęte. W ciągu 24h prześlemy aktywny kod rabatowy (-10%) oraz bezpłatny dostęp recenzencki do 52 lekcji.'
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
