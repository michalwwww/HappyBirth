import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import {
  validatePromoCode,
  is100PercentPromo,
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

    const promoResult = validatePromoCode(cleanPromo);
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
    const pricing = resolvePricingForCurrency(currency, promoResult.valid);
    const isPln = pricing.currency === 'pln';
    const activeLocale = (locale || pricing.stripeLocale || 'pl').toString();
    const activeCourseAmountGrosze = isPln
      ? promoResult.valid
        ? 44010
        : BASE_COURSE_PRICE_GROSZE // 440,10 zł lub 489,00 zł brutto
      : pricing.activeCourseMinorUnits;
    const activeOrderBumpMinorUnits = isPln
      ? ORDER_BUMP_PRICE_GROSZE // 49,00 zł brutto
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

    // 1. Pozycja główna: Kurs HappyBirth 489,00 zł brutto (lub 440,10 zł z kodem -10%), 18 miesięcy (548 dni) od zakupu (lub waluta międzynarodowa GBP/EUR/USD/AUD/AED)
    const mainCourseLineItem =
      priceId && !promoResult.valid && isPln
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency: pricing.currency,
              product_data: {
                name: isPln
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
              unit_amount: activeCourseAmountGrosze,
              tax_behavior: 'inclusive' as const,
            },
            quantity: 1,
          };

    const lineItems: any[] = [mainCourseLineItem];

    // 2. [B3] Jednoklikowy dodatek w koszyku (Order Bump +49,00 zł brutto / £15 / €17 / $27) z edycją krajową
    const requestedEditionKey = String(body.orderBumpEdition || utm?.order_bump_edition || 'pl')
      .trim()
      .toLowerCase();
    const matchedBumpEdition =
      ORDER_BUMP_GLOBAL_CATALOG[requestedEditionKey] || ORDER_BUMP_GLOBAL_CATALOG.pl;

    if (includeOrderBump) {
      lineItems.push({
        price_data: {
          currency: pricing.currency,
          product_data: {
            name:
              requestedEditionKey !== 'pl'
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
          unit_amount: activeOrderBumpMinorUnits,
          tax_behavior: 'inclusive' as const,
        },
        quantity: 1,
      });
    }

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
      order_bump_included: includeOrderBump ? 'true' : 'false',
      order_bump_edition: matchedBumpEdition.editionKey,
      promo_code: promoResult.valid ? promoResult.code : '',
      promo_source_type: promoResult.valid ? promoResult.sourceType : 'none',
      affiliate_ref_cookie: String(cookieRef).slice(0, 80),
      attribution_priority: promoResult.valid ? 'promo_code' : cookieRef ? 'ref_cookie' : 'direct',
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

    const sessionParams: any = {
      mode: 'payment',
      line_items: lineItems,
      allow_promotion_codes: !promoResult.valid,
      invoice_creation: { enabled: true },
      tax_id_collection: { enabled: true },
      metadata,
      locale: activeLocale,
      success_url: `${origin}/strefa?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${origin}/#cena`,
    };

    if (email && typeof email === 'string' && email.includes('@')) {
      sessionParams.customer_email = email.trim();
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      currency: pricing.currency.toUpperCase(),
      amountGrossGrosze: activeCourseAmountGrosze + (includeOrderBump ? activeOrderBumpMinorUnits : 0),
    });
  } catch (error: any) {
    console.error('Błąd podczas tworzenia sesji Stripe Checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd przy inicjalizacji płatności Stripe.' },
      { status: 500 }
    );
  }
}
