import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import {
  validatePromoCode,
  is100PercentPromo,
  DIAGNOSTIC_PROMO_SHA256,
  BASE_COURSE_PRICE_GROSZE,
  ORDER_BUMP_PRICE_GROSZE,
  resolvePricingForCurrency,
  ORDER_BUMP_GLOBAL_CATALOG,
} from '@/lib/promo';
import {
  CHECKBOX_2_ART38_WAIVER_TEXT,
  getTermsSha256Hash,
} from '@/lib/legal-shield';
import { AFFILIATE_COOKIE_NAME } from '@/lib/affiliate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      email,
      courseId = 'kurs-glowny-happybirth',
      utm = {},
      promoCode,
      includeOrderBump = false,
      onlyOrderBump = false,
      termsAccepted = true,
      waiverArt38Accepted = true,
      currency = 'pln',
      locale,
    } = body;

    // [E1] Serwerowa walidacja zgód konsumenckich (Regulamin + Art. 38 ust. 1 pkt 13 u.p.k.)
    if (termsAccepted === false || waiverArt38Accepted === false) {
      return NextResponse.json(
        {
          error:
            'Aby przejść do płatności, zaznacz akceptację Regulaminu oraz zgodę na natychmiastowe dostarczenie treści cyfrowych (art. 38 ust. 1 pkt 13 u.p.k.).',
        },
        { status: 400 }
      );
    }

    const cleanPromo = (promoCode || '').toString().trim().toUpperCase();
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // [A4] Bezwzględna blokada publicznego kodu TEST (100%) na produkcji
    if (cleanPromo === 'TEST' || cleanPromo === 'TEST100' || cleanPromo === 'FREE' || cleanPromo === '100%') {
      return NextResponse.json(
        {
          error:
            'Kod testowy jest wyłączony. Możesz skorzystać z kodu rabatowego (-10%) od swojej położnej, partnera lub koleżanki.',
        },
        { status: 400 }
      );
    }

    // Wyłącznie lokalny kod deweloperski w NODE_ENV === 'development'
    if (is100PercentPromo(cleanPromo)) {
      return NextResponse.json({
        url: `${origin}/strefa?session_id=dev_local_100&payment=success`,
        sessionId: 'dev_local_100',
        success: true,
      });
    }

    const promoSha = cleanPromo
      ? crypto.createHash('sha256').update(cleanPromo).digest('hex')
      : '';
    const isDiagnosticPromo = Boolean(
      cleanPromo &&
        (promoSha === DIAGNOSTIC_PROMO_SHA256 ||
          (process.env.DIAGNOSTIC_PROMO_CODE &&
            cleanPromo === process.env.DIAGNOSTIC_PROMO_CODE.trim().toUpperCase()))
    );

    const promoResult = isDiagnosticPromo
      ? {
          valid: true,
          code: 'DIAGNOSTIC_TEST',
          discountPercent: 0,
          basePricePln: 489,
          discountedCoursePricePln: 1,
          omnibusNotice: '',
          sourceType: 'dev_test' as const,
        }
      : validatePromoCode(cleanPromo);
    if (cleanPromo && !promoResult.valid) {
      return NextResponse.json(
        {
          error:
            promoResult.errorMessage ||
            'Podany kod rabatowy jest nieaktywny lub nieprawidłowy. Sprawdź pisownię kodu.',
        },
        { status: 400 }
      );
    }
    const isVip100 = cleanPromo === 'VIP100';
    const pricing = resolvePricingForCurrency(
      isDiagnosticPromo ? 'pln' : currency,
      promoResult.valid && promoResult.discountPercent === 10
    );
    const isPln = pricing.currency === 'pln';
    const activeLocale = isDiagnosticPromo ? 'pl' : (locale || pricing.stripeLocale || 'pl').toString();
    const activeCourseAmountGrosze = isDiagnosticPromo
      ? 100
      : isPln
        ? promoResult.valid && promoResult.discountPercent === 10
          ? 44010
          : BASE_COURSE_PRICE_GROSZE
        : pricing.activeCourseMinorUnits;
    const activeOrderBumpMinorUnits = isDiagnosticPromo
      ? 100
      : isPln
        ? ORDER_BUMP_PRICE_GROSZE
        : pricing.orderBumpMinorUnits;

    // Pobierz adres IP kupującego, kraj (Cloudflare IP Country) oraz ciasteczko afiliacyjne hb_aff_ref ([D2] & [E1] & [TECH-03])
    const buyerIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '0.0.0.0';
    const buyerCountry = (req.headers.get('cf-ipcountry') || 'PL').toUpperCase();
    const cookieRef = req.cookies.get(AFFILIATE_COOKIE_NAME)?.value || utm?.ref || '';
    const waiverTimestamp = new Date().toISOString();
    const termsSha256 = getTermsSha256Hash();

    if (!process.env.STRIPE_SECRET_KEY) {
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          url: `${origin}/strefa?payment=success&demo=true`,
          sessionId: 'demo_session_123',
        });
      }
      return NextResponse.json(
        { error: 'Brak skonfigurowanego STRIPE_SECRET_KEY w środowisku serwera.' },
        { status: 500 }
      );
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    const isStandaloneOrderBump = Boolean(onlyOrderBump);
    const shouldIncludeBumpItem = Boolean(includeOrderBump || isStandaloneOrderBump);

    const requestedEditionKey = String(body.orderBumpEdition || utm?.order_bump_edition || 'pl')
      .trim()
      .toLowerCase();
    const matchedBumpEdition =
      ORDER_BUMP_GLOBAL_CATALOG[requestedEditionKey] || ORDER_BUMP_GLOBAL_CATALOG.pl;

    // [D2] Reguła Nadrzędności Kodu nad linkiem ?ref= oraz [E1] Rejestr dowodowy w metadanych
    const metadata: Record<string, string> = {
      courseId,
      platform: 'HappyBirth',
      category: 'Education / E-learning Course',
      mcc: '8299',
      access_duration_days: '548',
      access_duration_months: '18',
      currency: pricing.currency.toUpperCase(),
      locale: activeLocale,
      buyer_country: buyerCountry,
      order_bump_included: shouldIncludeBumpItem ? 'true' : 'false',
      only_order_bump: isStandaloneOrderBump ? 'true' : 'false',
      order_bump_edition: matchedBumpEdition.editionKey,
      promo_code: promoResult.valid && !isStandaloneOrderBump ? promoResult.code : '',
      promo_source_type: promoResult.valid && !isStandaloneOrderBump ? promoResult.sourceType : 'none',
      affiliate_ref_cookie: isStandaloneOrderBump ? '' : String(cookieRef).slice(0, 80),
      attribution_priority: isStandaloneOrderBump
        ? 'post_purchase_upsell'
        : promoResult.valid
          ? 'promo_code'
          : cookieRef
            ? 'ref_cookie'
            : 'direct',
      waiver_art38_accepted: 'true',
      waiver_art38_timestamp: waiverTimestamp,
      buyer_ip: String(buyerIp).slice(0, 64),
      terms_sha256: termsSha256,
      waiver_checkbox_text: CHECKBOX_2_ART38_WAIVER_TEXT.slice(0, 480),
    };

    if (utm && typeof utm === 'object') {
      if (utm.utm_source) metadata.utm_source = String(utm.utm_source).slice(0, 100);
      if (utm.utm_medium) metadata.utm_medium = String(utm.utm_medium).slice(0, 100);
      if (utm.utm_campaign) metadata.utm_campaign = String(utm.utm_campaign).slice(0, 100);
      if (utm.utm_content) metadata.utm_content = String(utm.utm_content).slice(0, 100);
      if (utm.ad_id) metadata.ad_id = String(utm.ad_id).slice(0, 100);
      if (utm.ref) metadata.ref = String(utm.ref).slice(0, 100);
      if (utm.fbclid) metadata.fbclid = String(utm.fbclid).slice(0, 100);
    }

    const buildSessionPayload = (courseAmt: number, bumpAmt: number): any => {
      const mainItem =
        priceId && !promoResult.valid && !isDiagnosticPromo && isPln
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: pricing.currency,
                product_data: {
                  name: isDiagnosticPromo
                    ? 'Kurs Szkoły Rodzenia Online HappyBirth.pl (Transakcja Testowa Live)'
                    : isPln
                      ? promoResult.valid
                        ? `Kurs Szkoły Rodzenia Online HappyBirth.pl (Rabat -10%: ${promoResult.code})`
                        : 'Kurs Szkoły Rodzenia Online HappyBirth.pl (52 Lekcje 4K dla Dwojga)'
                      : promoResult.valid
                        ? `HappyBirth Online Antenatal & Childbirth Course (52 4K Lessons · -10%: ${promoResult.code})`
                        : 'HappyBirth Online Antenatal & Childbirth Course (52 4K Lessons for Two)',
                  description: isPln
                    ? 'Dostęp na 18 miesięcy (548 dni) od momentu zakupu dla dwojga: 52 lekcje 4K w 8 modułach (288 min), Notatnik Rodzica PDF i checklisty.'
                    : '18-month (548 days) full access for both parents: 52 4K VOD lessons (288 min), Interactive Birth Plan, Contraction Timer & Partner Toolkit PDF.',
                  tax_code: 'txcd_10000000',
                },
                unit_amount: courseAmt,
                tax_behavior: 'inclusive' as const,
              },
              quantity: 1,
            };

      const items: any[] = isStandaloneOrderBump ? [] : [mainItem];
      if (shouldIncludeBumpItem) {
        items.push({
          price_data: {
            currency: pricing.currency,
            product_data: {
              name: isDiagnosticPromo
                ? `Pakiet Kart na Porodówkę dla Taty PDF · Test Live (${matchedBumpEdition.editionKey.toUpperCase()})`
                : requestedEditionKey !== 'pl'
                  ? `${matchedBumpEdition.title} (${matchedBumpEdition.targetMarket})`
                  : isPln
                    ? 'Pakiet Dokumentów Szpitalnych i Kart na Porodówkę dla Taty (Edycja Polska MZ 2026)'
                    : matchedBumpEdition.title,
              description:
                requestedEditionKey !== 'pl'
                  ? matchedBumpEdition.description
                  : isPln
                    ? 'Dodatek komplementarny (Order Bump): 4 karty dla Taty, matryca B.R.A.I.N., protokół siary (37 tyg.) i system 3 reklamówek PDF.'
                    : matchedBumpEdition.description,
              tax_code: 'txcd_10000000',
            },
            unit_amount: bumpAmt,
            tax_behavior: 'inclusive' as const,
          },
          quantity: 1,
        });
      }

      const payload: any = {
        mode: 'payment',
        line_items: items,
        metadata: {
          ...metadata,
          promo_source_type: isDiagnosticPromo ? 'diagnostic_test' : metadata.promo_source_type,
          attribution_priority: isDiagnosticPromo ? 'diagnostic_test' : metadata.attribution_priority,
          affiliate_ref_cookie: isDiagnosticPromo ? '' : metadata.affiliate_ref_cookie,
        },
        locale: activeLocale,
        success_url: `${origin}/strefa?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: isStandaloneOrderBump ? `${origin}/strefa` : `${origin}/#cena`,
      };

      if (vipPromoId) {
        payload.discounts = [{ promotion_code: vipPromoId }];
      } else {
        payload.allow_promotion_codes = !promoResult.valid && !isStandaloneOrderBump && !isDiagnosticPromo;
      }

      if (email && typeof email === 'string' && email.includes('@')) {
        payload.customer_email = email.trim();
      }
      return payload;
    };

    let vipPromoId: string | null = null;
    if (isVip100) {
      const promoLookupRes = await fetch(
        'https://api.stripe.com/v1/promotion_codes?code=VIP100&active=true&limit=1',
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
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
        return NextResponse.json(
          { error: 'Kod rabatowy VIP100 wykorzystał już maksymalny limit 10 użyć.' },
          { status: 400 }
        );
      }
      vipPromoId = foundPromo.id;
    }

    let session: any;
    try {
      session = await stripe.checkout.sessions.create(
        buildSessionPayload(activeCourseAmountGrosze, activeOrderBumpMinorUnits)
      );
    } catch (stripeErr: any) {
      if (
        isDiagnosticPromo &&
        (stripeErr?.code === 'amount_too_small' ||
          /at least|minimum|2[.,]00/i.test(String(stripeErr?.message || '')))
      ) {
        const retryCourse = shouldIncludeBumpItem && !isStandaloneOrderBump ? 100 : 200;
        const retryBump = isStandaloneOrderBump ? 200 : 100;
        session = await stripe.checkout.sessions.create(
          buildSessionPayload(retryCourse, retryBump)
        );
      } else {
        throw stripeErr;
      }
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      currency: pricing.currency.toUpperCase(),
      amountTotalGrosze: session.amount_total,
      diagnosticMode: isDiagnosticPromo,
    });
  } catch (error: any) {
    console.error('Błąd podczas tworzenia sesji Stripe Checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd przy inicjalizacji płatności Stripe.' },
      { status: 500 }
    );
  }
}
