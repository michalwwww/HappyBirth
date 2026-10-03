interface Env {
  STRIPE_SECRET_KEY?: string;
  NEXT_PUBLIC_STRIPE_PRICE_ID?: string;
  NEXT_PUBLIC_APP_URL?: string;
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
    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Brak skonfigurowanego STRIPE_SECRET_KEY na serwerze.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { email, courseId = 'kurs-glowny-happybirth', utm = {}, promoCode } = body;
    const cleanPromo = (promoCode || '').toString().trim().toUpperCase();
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || `${url.protocol}//${url.host}`;

    // Błyskawiczna obsługa 100% kodu zniżkowego dla trybu testowego
    if (cleanPromo === 'TEST100' || cleanPromo === 'HAPPY100') {
      return new Response(
        JSON.stringify({
          url: `${origin}/strefa?session_id=promo_test_100&payment=success&promo=${cleanPromo}`,
          sessionId: 'promo_test_100',
          success: true,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('locale', 'pl');
    params.append('allow_promotion_codes', 'true');
    params.append('invoice_creation[enabled]', 'true');
    params.append('tax_id_collection[enabled]', 'true');
    params.append('success_url', `${origin}/strefa?session_id={CHECKOUT_SESSION_ID}&payment=success`);
    params.append('cancel_url', `${origin}/#cena`);

    // Pozycja: kurs HappyBirth 489 zł brutto z 23% VAT wliczonym w cenę (tax_behavior: inclusive)
    const priceId = env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1UMYzCEOuqHV8SrMz33uW4Un';
    if (priceId) {
      params.append('line_items[0][price]', priceId);
      params.append('line_items[0][quantity]', '1');
    } else {
      params.append('line_items[0][price_data][currency]', 'pln');
      params.append('line_items[0][price_data][unit_amount]', '48900');
      params.append('line_items[0][price_data][product_data][name]', 'Edukacyjny Kurs Online HappyBirth (52 Lekcje VOD dla Dwojga)');
      params.append(
        'line_items[0][price_data][product_data][description]',
        'Dostęp edukacyjny e-learning na 12 miesięcy dla dwojga: 52 lekcje wideo, Notatnik Rodzica PDF i Strefa dla Taty.'
      );
      params.append('line_items[0][price_data][product_data][tax_code]', 'txcd_10000000');
      params.append('line_items[0][price_data][tax_behavior]', 'inclusive');
      params.append('line_items[0][quantity]', '1');
    }

    params.append('metadata[courseId]', courseId);
    params.append('metadata[platform]', 'HappyBirth');
    params.append('metadata[category]', 'Education / E-learning Course');
    params.append('metadata[mcc]', '8299');
    params.append('metadata[legal_consent_art38]', 'true');

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
