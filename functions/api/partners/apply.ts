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
    const {
      inquiryType = 'affiliate',
      companyOrPracticeName,
      contactName,
      email,
      phone,
      websiteOrSocial,
      cooperationModel,
      message,
      preferredPromoCode,
    } = body;

    if (!contactName || !email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Podaj imię i nazwisko oraz poprawny adres e-mail.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = `inq_${crypto.randomUUID()}`;
    const cleanEmail = email.trim().toLowerCase();

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO partnership_inquiries (
             id, inquiry_type, company_or_practice_name, contact_name, email, phone,
             website_or_social, cooperation_model, message, status
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`
        )
          .bind(
            id,
            inquiryType === 'b2b_brand' ? 'b2b_brand' : 'affiliate',
            companyOrPracticeName || null,
            contactName.trim(),
            cleanEmail,
            phone || null,
            websiteOrSocial || null,
            cooperationModel || null,
            message || null
          )
          .run();
      } catch (e) {
        console.error('Błąd zapisu zgłoszenia partnerskiego w D1:', e);
      }
    }

    let generatedRefCode: string | null = null;
    if (inquiryType === 'affiliate') {
      const baseCode = (preferredPromoCode || contactName)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 8);
      generatedRefCode = `${baseCode || 'PARTNER'}10`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        inquiryId: id,
        inquiryType,
        suggestedPromoCode: generatedRefCode,
        suggestedAffiliateLink: generatedRefCode
          ? `https://happybirth.pl/?ref=${generatedRefCode}`
          : null,
        message:
          inquiryType === 'affiliate'
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
