interface Env {
  STRIPE_SECRET_KEY?: string;
  NEXT_PUBLIC_STRIPE_PRICE_ID?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

const CHECKBOX_2_ART38_WAIVER_TEXT =
  'Żądam natychmiastowego rozpoczęcia dostarczania treści cyfrowych przed upływem 14-dniowego terminu do odstąpienia od umowy i przyjmuję do wiadomości, że z chwilą uzyskania dostępu do platformy kursowej tracę prawo do odstąpienia od umowy zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.';

const TERMS_VERSION_SHA256 = 'a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447';

function parseCookie(cookieHeader: string | null, name: string): string {
  if (!cookieHeader) return '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function isValid10PercentPromo(code: string): boolean {
  if (!code) return false;
  const known = [
    'MAMAGAJA10',
    'MAMAGAJA',
    'POLOZNA10',
    'FIZJO10',
    'LAKTACJA10',
    'PARTNER10',
    'HAPPY10',
    'SPOKOJ10',
    'KOWALSKA10',
    'NOWAK10',
  ];
  return (
    known.includes(code) ||
    code.startsWith('MAMA-') ||
    (code.startsWith('MAMA') && code.length >= 5) ||
    code.startsWith('HB-') ||
    code.startsWith('POLOZNA-') ||
    code.startsWith('FIZJO-') ||
    code.endsWith('10')
  );
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const {
      email,
      courseId = 'kurs-glowny-happybirth',
      utm = {},
      promoCode,
      includeOrderBump = false,
      termsAccepted = true,
      waiverArt38Accepted = true,
    } = body;

    // [E1] Walidacja zgód konsumenckich
    if (termsAccepted === false || waiverArt38Accepted === false) {
      return new Response(
        JSON.stringify({
          error:
            'Aby przejść do płatności, zaznacz akceptację Regulaminu oraz zgodę na natychmiastowe dostarczenie treści cyfrowych (art. 38 ust. 1 pkt 13 u.p.k.).',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const cleanPromo = (promoCode || '').toString().trim().toUpperCase();
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || `${url.protocol}//${url.host}`;

    // [A4] Bezwzględna blokada publicznego kodu TEST (100%)
    if (cleanPromo === 'TEST' || cleanPromo === 'TEST100' || cleanPromo === 'FREE' || cleanPromo === '100%') {
      return new Response(
        JSON.stringify({
          error:
            'Kod testowy jest wyłączony. Możesz skorzystać z kodu rabatowego (-10%) od swojej położnej, partnera lub koleżanki.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Brak skonfigurowanego STRIPE_SECRET_KEY na serwerze.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const has10Discount = isValid10PercentPromo(cleanPromo);
    const activeCourseAmount = has10Discount ? '44010' : '48900'; // 440,10 zł lub 489,00 zł brutto
    const buyerIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '0.0.0.0';
    const cookieRef = parseCookie(request.headers.get('cookie'), 'hb_aff_ref') || utm?.ref || '';
    const waiverTimestamp = new Date().toISOString();

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('locale', 'pl');
    params.append('allow_promotion_codes', has10Discount ? 'false' : 'true');
    params.append('invoice_creation[enabled]', 'true');
    params.append('tax_id_collection[enabled]', 'true');
    params.append('success_url', `${origin}/strefa?session_id={CHECKOUT_SESSION_ID}&payment=success`);
    params.append('cancel_url', `${origin}/#cena`);

    // Pozycja 0: Kurs główny 489,00 zł brutto (lub 440,10 zł z kodem -10%), dostęp na 18 miesięcy (548 dni) od zakupu
    const priceId = env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (priceId && !has10Discount) {
      params.append('line_items[0][price]', priceId);
      params.append('line_items[0][quantity]', '1');
    } else {
      params.append('line_items[0][price_data][currency]', 'pln');
      params.append('line_items[0][price_data][unit_amount]', activeCourseAmount);
      params.append(
        'line_items[0][price_data][product_data][name]',
        has10Discount
          ? `Kurs Szkoły Rodzenia Online HappyBirth.pl (Rabat -10%: ${cleanPromo})`
          : 'Kurs Szkoły Rodzenia Online HappyBirth.pl (52 Lekcje 4K dla Dwojga)'
      );
      params.append(
        'line_items[0][price_data][product_data][description]',
        'Dostęp na 18 miesięcy (548 dni) od momentu zakupu dla dwojga: 52 lekcje 4K w 8 modułach (288 min), Notatnik Rodzica PDF i checklisty.'
      );
      params.append('line_items[0][price_data][product_data][tax_code]', 'txcd_10000000');
      params.append('line_items[0][price_data][tax_behavior]', 'inclusive');
      params.append('line_items[0][quantity]', '1');
    }

    // [B3] Pozycja 1: Jednoklikowy Order Bump (+49,00 zł brutto)
    if (includeOrderBump) {
      params.append('line_items[1][price_data][currency]', 'pln');
      params.append('line_items[1][price_data][unit_amount]', '4900');
      params.append(
        'line_items[1][price_data][product_data][name]',
        'Pakiet Dokumentów Szpitalnych i Kreator Planu Porodu PDF + Checklista Wyprawkowa'
      );
      params.append(
        'line_items[1][price_data][product_data][description]',
        'Dodatek komplementarny (Order Bump): Rozszerzony pakiet dokumentów do szpitala, wzór planu porodu i lista zakupowa PDF.'
      );
      params.append('line_items[1][price_data][product_data][tax_code]', 'txcd_10000000');
      params.append('line_items[1][price_data][tax_behavior]', 'inclusive');
      params.append('line_items[1][quantity]', '1');
    }

    params.append('metadata[courseId]', courseId);
    params.append('metadata[platform]', 'HappyBirth');
    params.append('metadata[category]', 'Education / E-learning Course');
    params.append('metadata[mcc]', '8299');
    params.append('metadata[access_duration_days]', '548');
    params.append('metadata[access_duration_months]', '18');
    params.append('metadata[order_bump_included]', includeOrderBump ? 'true' : 'false');
    params.append('metadata[promo_code]', has10Discount ? cleanPromo : '');
    params.append('metadata[affiliate_ref_cookie]', String(cookieRef).slice(0, 80));
    params.append('metadata[attribution_priority]', has10Discount ? 'promo_code' : cookieRef ? 'ref_cookie' : 'direct');
    params.append('metadata[waiver_art38_accepted]', 'true');
    params.append('metadata[waiver_art38_timestamp]', waiverTimestamp);
    params.append('metadata[buyer_ip]', String(buyerIp).slice(0, 64));
    params.append('metadata[terms_sha256]', TERMS_VERSION_SHA256);
    params.append('metadata[waiver_checkbox_text]', CHECKBOX_2_ART38_WAIVER_TEXT.slice(0, 480));

    if (utm && typeof utm === 'object') {
      if (utm.utm_source) params.append('metadata[utm_source]', String(utm.utm_source).slice(0, 100));
      if (utm.utm_medium) params.append('metadata[utm_medium]', String(utm.utm_medium).slice(0, 100));
      if (utm.utm_campaign) params.append('metadata[utm_campaign]', String(utm.utm_campaign).slice(0, 100));
      if (utm.utm_content) params.append('metadata[utm_content]', String(utm.utm_content).slice(0, 100));
      if (utm.ad_id) params.append('metadata[ad_id]', String(utm.ad_id).slice(0, 100));
      if (utm.ref) params.append('metadata[ref]', String(utm.ref).slice(0, 100));
      if (utm.fbclid) params.append('metadata[fbclid]', String(utm.fbclid).slice(0, 100));
    }

    if (email && typeof email === 'string' && email.includes('@')) {
      params.append('customer_email', email.trim());
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const sessionData: any = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe API error:', sessionData);
      return new Response(
        JSON.stringify({ error: sessionData.error?.message || 'Błąd inicjalizacji Stripe' }),
        {
          status: stripeRes.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify({ url: sessionData.url, sessionId: sessionData.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Błąd checkoutu edge:', err);
    return new Response(JSON.stringify({ error: err.message || 'Wewnętrzny błąd serwera płatności.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
