import {
  buildEdgeCorsHeaders,
  getEdgeSession,
} from '../../_shared/session';

interface Env {
  DB?: any;
  STRIPE_SECRET_KEY?: string;
  SESSION_SECRET?: string;
  NEXT_PUBLIC_STRIPE_PRICE_ID?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

const CHECKBOX_2_ART38_WAIVER_TEXT =
  'Tak, chcę otrzymać dostęp do kursu natychmiast po opłaceniu i zgodnie z art. 38 ust. 1 pkt 13 u.p.k. zgadzam się na utratę 14-dniowego prawa do odstąpienia od umowy';

const TERMS_VERSION_SHA256 = 'baac2cea8e6c1d1bbeff5827cbb4eee13414180e36c4730d270821b6f3bad619';

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

type EdgeCurrency = 'pln' | 'gbp' | 'eur' | 'usd' | 'aud' | 'aed';

const EDGE_PRICING_TABLE: Record<
  EdgeCurrency,
  { base: string; discounted10: string; bump: string; locale: string }
> = {
  pln: { base: '48900', discounted10: '44010', bump: '4900', locale: 'pl' },
  gbp: { base: '11900', discounted10: '10710', bump: '1500', locale: 'en-GB' },
  eur: { base: '13900', discounted10: '12510', bump: '1700', locale: 'en' },
  usd: { base: '17900', discounted10: '16110', bump: '2700', locale: 'en' },
  aud: { base: '21900', discounted10: '19710', bump: '2900', locale: 'en' },
  aed: { base: '64900', discounted10: '58410', bump: '8900', locale: 'en' },
};

const OFFICIAL_PROMO_ALLOWLIST = new Set([
  'SPOKOJNYPOROD',
  'SPOKOJNY-POROD',
  'DOBRYSTART',
  'DOBRY-START',
  'GOTOWY-TATA',
  'GOTOWYTATA',
  'RAZEM-DO-PORODU',
  'RAZEMDOPORODU',
  'PIERWSZEDNI',
  'PIERWSZE-DNI',
  'DOBRYPOROD',
  'DOBRY-POROD',
  'WSPARCIE-TATY',
  'WSPARCIETATY',
  'MAMAGAJA',
  'MAMAGAJA10',
  'BEZSTRESU',
  'BEZ-STRESU',
  'AKADEMIA-HB',
  'SPOKOJ-W-DOMU',
  'DOMOWASZKOLA',
  'SZKOLARODZENIA',
  'PLANPORODU',
  'WYPRAWKA10',
  'TORBA10',
  'POLOZNA10',
  'FIZJO10',
  'LAKTACJA10',
  'PARTNER10',
  'HAPPY10',
  'SPOKOJ10',
  'KOWALSKA10',
  'NOWAK10',
  'MAMA-2026',
  'STUDENT10',
  'STUDENT-2026',
  'AMBASADOR10',
]);

const SEMANTIC_PREFIX_REGEX =
  /^(?:SPOKOJ|SPOKOJNA|SPOKOJNY|POLECA|DOBRYSTART|DOBRYPOROD|BLISKO|Z-SERCA|ZSERCA|OD|RAZEM|GOTOWI|GOTOWY|AKADEMIA|WIEDZA|MED|KAMPUS|KOLO|GABINET|PRAKTYKA|FIZJO|ODDECH|TULIMY|WYPRAWKA|RODZIMY|PARTNER|STUDENT|AMBASADOR|HB|POLOZNA)-[A-Z0-9_-]{2,20}$/;

function parseCookie(cookieHeader: string | null, name: string): string {
  if (!cookieHeader) return '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

async function isAuthorized10PercentPromo(code: string, db?: any): Promise<boolean> {
  if (!code) return false;
  if (OFFICIAL_PROMO_ALLOWLIST.has(code)) {
    return true;
  }

  if (db) {
    try {
      const aff = await db
        .prepare(
          `SELECT id FROM affiliates WHERE (UPPER(promo_code) = ? OR UPPER(ref_slug) = ?) AND status = 'active' LIMIT 1`
        )
        .bind(code, code)
        .first();
      if (aff?.id) return true;

      const usr = await db
        .prepare(`SELECT id FROM users WHERE UPPER(referral_code) = ? LIMIT 1`)
        .bind(code)
        .first();
      if (usr?.id) return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: buildEdgeCorsHeaders(context.request, 'POST, OPTIONS'),
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const corsHeaders = buildEdgeCorsHeaders(context.request, 'POST, OPTIONS');
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
      onlyOrderBump = false,
      termsAccepted = false,
      waiverArt38Accepted = false,
      currency = 'pln',
      locale,
    } = body;

    // [E1] Walidacja zgód konsumenckich (obydwie zgody muszą zostać wyraźnie przekazane jako true)
    if (termsAccepted !== true || waiverArt38Accepted !== true) {
      return new Response(
        JSON.stringify({
          error:
            'Aby przejść do płatności, zaznacz akceptację Regulaminu oraz zgodę na natychmiastowe dostarczenie treści cyfrowych (art. 38 ust. 1 pkt 13 u.p.k.).',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const isStandaloneOrderBump = Boolean(onlyOrderBump);
    let authenticatedEmailOverride = '';

    // [DRM-01] Samodzielny zakup Order Bumpa (+49 zł) dozwolony wyłącznie dla zalogowanych posiadaczek aktywnego kursu
    if (isStandaloneOrderBump) {
      const session = await getEdgeSession(request, env);
      if (!session?.userId || !session?.email) {
        return new Response(
          JSON.stringify({
            error: 'Zaloguj się do Strefy Kursantki, aby dokupić Pakiet Kart na Porodówkę dla Taty (+49 zł).',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      authenticatedEmailOverride = session.email.trim().toLowerCase();
      const isTeam = TEAM_WHITELIST_EMAILS.has(authenticatedEmailOverride);
      if (!isTeam) {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ error: 'Brak dostępu do bazy uprawnień.' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        const activeEnrollment = await env.DB.prepare(
          `SELECT id, expires_at FROM enrollments
           WHERE user_id = ? AND status = 'active'
           ORDER BY created_at DESC LIMIT 1`
        )
          .bind(session.userId)
          .first();
        const notExpired =
          activeEnrollment?.id &&
          (!activeEnrollment.expires_at ||
            isNaN(new Date(activeEnrollment.expires_at).getTime()) ||
            new Date(activeEnrollment.expires_at).getTime() >= Date.now());
        if (!notExpired) {
          return new Response(
            JSON.stringify({
              error: 'Pakiet dodatkowy (+49 zł) jest dostępny wyłącznie dla posiadaczek aktywnego kursu głównego HappyBirth.pl.',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
      }
    }

    const cleanPromo = (promoCode || '').toString().trim().toUpperCase();
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || `${url.protocol}//${url.host}`;

    // [A4] Bezwzględna blokada publicznego kodu TEST (100%)
    if (cleanPromo === 'TEST' || cleanPromo === 'TEST100' || cleanPromo === 'FREE' || cleanPromo === '100%') {
      return new Response(
        JSON.stringify({
          error:
            'Kod testowy jest wyłączony. Możesz skorzystać z autoryzowanego kodu rabatowego (-10%) od swojej położnej, partnera lub koleżanki.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const isVip100 = cleanPromo === 'VIP100';
    const has10Discount = cleanPromo && !isVip100 ? await isAuthorized10PercentPromo(cleanPromo, env.DB) : false;
    if (cleanPromo && !has10Discount && !isVip100) {
      return new Response(
        JSON.stringify({
          error: 'Podany kod rabatowy jest nieaktywny lub nieprawidłowy. Sprawdź pisownię kodu.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Brak skonfigurowanego STRIPE_SECRET_KEY na serwerze.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let vipPromoStripeId = '';
    if (isVip100) {
      const promoLookupRes = await fetch(
        'https://api.stripe.com/v1/promotion_codes?code=VIP100&active=true&limit=1',
        {
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
            'Stripe-Version': '2024-06-20',
          },
        }
      );
      const promoLookupData: any = await promoLookupRes.json();
      const foundPromo = promoLookupData?.data?.[0];
      if (
        !foundPromo ||
        !foundPromo.active ||
        (foundPromo.max_redemptions && (foundPromo.times_redeemed || 0) >= foundPromo.max_redemptions)
      ) {
        return new Response(
          JSON.stringify({
            error: 'Kod rabatowy VIP100 wykorzystał już maksymalny limit 10 użyć.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      vipPromoStripeId = foundPromo.id;
    }

    const normCurrency = (String(currency || 'pln').trim().toLowerCase() as EdgeCurrency);
    const activePricing = EDGE_PRICING_TABLE[normCurrency] || EDGE_PRICING_TABLE.pln;
    const activeCurrency: EdgeCurrency = EDGE_PRICING_TABLE[normCurrency] ? normCurrency : 'pln';
    const isPln = activeCurrency === 'pln';
    const activeLocale = String(locale || activePricing.locale || 'pl');
    const activeCourseAmount = has10Discount ? activePricing.discounted10 : activePricing.base; // Domyślnie PLN: 44010 lub 48900 (440,10 zł lub 489,00 zł brutto)
    const activeBumpAmount = activePricing.bump; // Domyślnie PLN: 4900 (49,00 zł brutto)

    const buyerIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '0.0.0.0';
    const buyerCountry = (request.headers.get('cf-ipcountry') || 'PL').toUpperCase();
    const cookieRef = parseCookie(request.headers.get('cookie'), 'hb_aff_ref') || utm?.ref || '';
    const waiverTimestamp = new Date().toISOString();

    const shouldIncludeBumpItem = Boolean(includeOrderBump || isStandaloneOrderBump);

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('locale', activeLocale);
    if (vipPromoStripeId) {
      params.append('discounts[0][promotion_code]', vipPromoStripeId);
    } else {
      // Kody rabatowe walidujemy wyłącznie przez nasz walidator Omnibus / D1 przed startem sesji Stripe
      params.append('allow_promotion_codes', 'false');
    }
    params.append('invoice_creation[enabled]', 'true');
    params.append('tax_id_collection[enabled]', 'true');
    params.append(
      'success_url',
      'https://strefa.happybirth.pl/?session_id={CHECKOUT_SESSION_ID}&payment=success'
    );
    params.append('cancel_url', isStandaloneOrderBump ? `${origin}/strefa` : `${origin}/#cena`);

    const priceId = env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    let lineItemIndex = 0;

    if (!isStandaloneOrderBump) {
      if (priceId && !has10Discount && isPln) {
        params.append(`line_items[${lineItemIndex}][price]`, priceId);
        params.append(`line_items[${lineItemIndex}][quantity]`, '1');
      } else {
        params.append(`line_items[${lineItemIndex}][price_data][currency]`, activeCurrency);
        params.append(`line_items[${lineItemIndex}][price_data][unit_amount]`, activeCourseAmount);
        params.append(
          `line_items[${lineItemIndex}][price_data][product_data][name]`,
          isPln
            ? has10Discount
              ? `Kurs Szkoły Rodzenia Online HappyBirth.pl (Rabat -10%: ${cleanPromo})`
              : 'Kurs Szkoły Rodzenia Online HappyBirth.pl (52 Lekcje 4K dla Dwojga)'
            : has10Discount
              ? `HappyBirth Online Antenatal & Childbirth Course (52 4K Lessons · -10%: ${cleanPromo})`
              : 'HappyBirth Online Antenatal & Childbirth Course (52 4K Lessons for Two)'
        );
        params.append(
          `line_items[${lineItemIndex}][price_data][product_data][description]`,
          isPln
            ? 'Dostęp na 18 miesięcy (548 dni) od momentu zakupu dla dwojga: 52 lekcje 4K w 8 modułach (288 min), Notatnik Rodzica PDF i checklisty.'
            : '18-month (548 days) full access for both parents: 52 4K VOD lessons (288 min), Interactive Birth Plan, Contraction Timer & Partner Toolkit PDF.'
        );
        params.append(`line_items[${lineItemIndex}][price_data][product_data][tax_code]`, 'txcd_10000000');
        params.append(`line_items[${lineItemIndex}][price_data][tax_behavior]`, 'inclusive');
        params.append(`line_items[${lineItemIndex}][quantity]`, '1');
      }
      lineItemIndex++;
    }

    // [B3] Pozycja Order Bump (+49,00 zł brutto / £15 / €17 / $27) z edycją krajową
    const requestedEditionKey = String(body.orderBumpEdition || utm?.order_bump_edition || 'pl')
      .trim()
      .toLowerCase();
    if (shouldIncludeBumpItem) {
      params.append(`line_items[${lineItemIndex}][price_data][currency]`, activeCurrency);
      params.append(`line_items[${lineItemIndex}][price_data][unit_amount]`, activeBumpAmount);
      params.append(
        `line_items[${lineItemIndex}][price_data][product_data][name]`,
        isPln
          ? `Pakiet Kart Sytuacyjnych na Porodówkę dla Taty & Słownik Skurczowy PDF (Edycja: ${requestedEditionKey.toUpperCase()})`
          : `Partner Labour Ward Action Cards, B.R.A.I.N. & Hospital Checklist PDF (${requestedEditionKey.toUpperCase()})`
      );
      params.append(
        `line_items[${lineItemIndex}][price_data][product_data][description]`,
        isPln
          ? 'Dodatek komplementarny (Order Bump): 4 karty sytuacyjne na salę porodową, matryca B.R.A.I.N., protokół siary i dwujęzyczny słownik.'
          : 'Complementary Add-On (Order Bump): 4 step-by-step labour room partner cards, B.R.A.I.N. matrix, colostrum log & hospital checklist PDF.'
      );
      params.append(`line_items[${lineItemIndex}][price_data][product_data][tax_code]`, 'txcd_10000000');
      params.append(`line_items[${lineItemIndex}][price_data][tax_behavior]`, 'inclusive');
      params.append(`line_items[${lineItemIndex}][quantity]`, '1');
    }

    params.append('metadata[courseId]', courseId);
    params.append('metadata[platform]', 'HappyBirth');
    params.append('metadata[category]', 'Education / E-learning Course');
    params.append('metadata[mcc]', '8299');
    params.append('metadata[access_duration_days]', '548');
    params.append('metadata[access_duration_months]', '18');
    params.append('metadata[currency]', activeCurrency.toUpperCase());
    params.append('metadata[locale]', activeLocale);
    params.append('metadata[buyer_country]', buyerCountry);
    params.append('metadata[order_bump_included]', shouldIncludeBumpItem ? 'true' : 'false');
    params.append('metadata[only_order_bump]', isStandaloneOrderBump ? 'true' : 'false');
    params.append('metadata[order_bump_edition]', requestedEditionKey);
    params.append('metadata[promo_code]', (has10Discount || isVip100) && !isStandaloneOrderBump ? cleanPromo : '');
    params.append('metadata[affiliate_ref_cookie]', isStandaloneOrderBump ? '' : String(cookieRef).slice(0, 80));
    params.append(
      'metadata[attribution_priority]',
      isStandaloneOrderBump
        ? 'post_purchase_upsell'
        : has10Discount
          ? 'promo_code'
          : cookieRef
            ? 'ref_cookie'
            : 'direct'
    );
    params.append('metadata[waiver_art38_accepted]', 'true');
    params.append('metadata[waiver_art38_timestamp]', waiverTimestamp);
    params.append('metadata[buyer_ip]', String(buyerIp).slice(0, 64));
    params.append('metadata[terms_sha256]', TERMS_VERSION_SHA256);
    params.append('metadata[waiver_checkbox_text]', CHECKBOX_2_ART38_WAIVER_TEXT.slice(0, 480));

    if (authenticatedEmailOverride) {
      params.append('customer_email', authenticatedEmailOverride);
    } else if (email && typeof email === 'string' && email.includes('@')) {
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
      return new Response(
        JSON.stringify({ error: sessionData.error?.message || 'Błąd inicjalizacji Stripe' }),
        {
          status: stripeRes.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    return new Response(JSON.stringify({ url: sessionData.url, sessionId: sessionData.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Wewnętrzny błąd serwera płatności.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
