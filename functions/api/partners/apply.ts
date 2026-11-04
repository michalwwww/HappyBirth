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
    const roleOrArea = (body.roleOrArea || body.cooperationModel || 'Położna / Twórca').trim();
    const profileUrl = (body.profileUrl || body.websiteOrSocial || '').trim() || null;
    const message = (body.message || '').trim() || null;
    const rodoConsent = body.rodoConsent === false ? 0 : 1;

    if (!fullName || !email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Podaj imię i nazwisko oraz poprawny adres e-mail.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = `inq_${crypto.randomUUID()}`;

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
            channel,
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
      } catch (e) {
        console.error('Błąd zapisu zgłoszenia partnerskiego w D1:', e);
      }
    }

    let promoCode: string | null = null;
    if (channel === 'afiliacja') {
      const baseCode = (body.preferredPromoCode || fullName)
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 8);
      promoCode = `${baseCode || 'PARTNER'}10`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        inquiryId: id,
        channel,
        promoCode,
        suggestedPromoCode: promoCode,
        suggestedAffiliateLink: promoCode ? `https://happybirth.pl/?ref=${promoCode}` : null,
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
