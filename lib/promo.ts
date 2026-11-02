export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountPercent: number; // np. 10 dla kodu -10%
  basePricePln: number; // 489.00
  discountedCoursePricePln: number; // 440.10 przy -10%
  omnibusNotice: string;
  sourceType: 'affiliate' | 'student_referral' | 'dev_test' | 'invalid';
  errorMessage?: string;
}

export const BASE_COURSE_PRICE_PLN = 489.0;
export const BASE_COURSE_PRICE_GROSZE = 48900;
export const ORDER_BUMP_PRICE_PLN = 49.0;
export const ORDER_BUMP_PRICE_GROSZE = 4900;
export const ACCESS_DURATION_DAYS = 548; // 18 miesięcy (548 dni) od momentu zakupu
export const ACCESS_DURATION_MONTHS = 18;
export const OMNIBUS_LOWEST_30_DAYS_TEXT = 'Najniższa cena z 30 dni przed obniżką: 489,00 zł';
export const OMNIBUS_LOWEST_30D_NOTICE_PL = OMNIBUS_LOWEST_30_DAYS_TEXT;
export const ORDER_BUMP_TITLE_PL =
  'Pakiet Kart na Porodówkę dla Taty (PDF)';
export const ORDER_BUMP_DESC_PL =
  '4 karty krok po kroku na salę porodową, punkty ucisku i lista 3 reklamówek do szpitala.';

export type SupportedCurrency = 'pln' | 'gbp' | 'eur' | 'usd' | 'aud' | 'aed';

export interface CurrencyPricingConfig {
  currency: SupportedCurrency;
  baseMinorUnits: number; // np. 48900 gr (489,00 PLN), 11900 p (£119.00 GBP), 13900 c (139,00 EUR), 17900 c ($179.00 USD)
  discounted10MinorUnits: number; // cena po kodzie -10% (44010 gr / 10710 p / 12510 c / 16110 c)
  orderBumpMinorUnits: number; // np. 4900 gr (49,00 PLN), 1500 p (£15.00 GBP), 1700 c (17,00 EUR), 2700 c ($27.00 USD)
  stripeLocale: 'pl' | 'en-GB' | 'en' | 'de';
  displayBase: string;
  displayDiscounted: string;
  displayOrderBump: string;
  omnibusText: string;
}

export const GLOBAL_PRICING_CONFIG: Record<SupportedCurrency, CurrencyPricingConfig> = {
  pln: {
    currency: 'pln',
    baseMinorUnits: BASE_COURSE_PRICE_GROSZE, // 48900 (489,00 zł brutto)
    discounted10MinorUnits: 44010, // 440,10 zł brutto
    orderBumpMinorUnits: ORDER_BUMP_PRICE_GROSZE, // 4900 (49,00 zł brutto)
    stripeLocale: 'pl',
    displayBase: '489,00 zł',
    displayDiscounted: '440,10 zł',
    displayOrderBump: '49,00 zł',
    omnibusText: OMNIBUS_LOWEST_30_DAYS_TEXT,
  },
  gbp: {
    currency: 'gbp',
    baseMinorUnits: 11900, // £119.00 GBP
    discounted10MinorUnits: 10710, // £107.10 GBP
    orderBumpMinorUnits: 1500, // £15.00 GBP
    stripeLocale: 'en-GB',
    displayBase: '£119.00',
    displayDiscounted: '£107.10',
    displayOrderBump: '£15.00',
    omnibusText: 'Lowest price in the 30 days prior to discount: £119.00',
  },
  eur: {
    currency: 'eur',
    baseMinorUnits: 13900, // 139,00 EUR
    discounted10MinorUnits: 12510, // 125,10 EUR
    orderBumpMinorUnits: 1700, // 17,00 EUR
    stripeLocale: 'en',
    displayBase: '139,00 €',
    displayDiscounted: '125,10 €',
    displayOrderBump: '17,00 €',
    omnibusText: 'Lowest price in the 30 days prior to discount: 139,00 €',
  },
  usd: {
    currency: 'usd',
    baseMinorUnits: 17900, // $179.00 USD
    discounted10MinorUnits: 16110, // $161.10 USD
    orderBumpMinorUnits: 2700, // $27.00 USD
    stripeLocale: 'en',
    displayBase: '$179.00',
    displayDiscounted: '$161.10',
    displayOrderBump: '$27.00',
    omnibusText: 'Regular price: $179.00 USD',
  },
  aud: {
    currency: 'aud',
    baseMinorUnits: 21900, // $219.00 AUD
    discounted10MinorUnits: 19710, // $197.10 AUD
    orderBumpMinorUnits: 2900, // $29.00 AUD
    stripeLocale: 'en',
    displayBase: '$219.00 AUD',
    displayDiscounted: '$197.10 AUD',
    displayOrderBump: '$29.00 AUD',
    omnibusText: 'Regular price: $219.00 AUD',
  },
  aed: {
    currency: 'aed',
    baseMinorUnits: 64900, // 649.00 AED
    discounted10MinorUnits: 58410, // 584.10 AED
    orderBumpMinorUnits: 8900, // 89.00 AED
    stripeLocale: 'en',
    displayBase: '649.00 AED',
    displayDiscounted: '584.10 AED',
    displayOrderBump: '89.00 AED',
    omnibusText: 'Regular price: 649.00 AED',
  },
};

export function resolvePricingForCurrency(
  rawCurrency?: string | null,
  has10Discount: boolean = false
): CurrencyPricingConfig & { activeCourseMinorUnits: number } {
  const normalized = (rawCurrency || 'pln').toString().trim().toLowerCase() as SupportedCurrency;
  const cfg = GLOBAL_PRICING_CONFIG[normalized] || GLOBAL_PRICING_CONFIG.pln;
  return {
    ...cfg,
    activeCourseMinorUnits: has10Discount ? cfg.discounted10MinorUnits : cfg.baseMinorUnits,
  };
}

export interface OrderBumpEditionConfig {
  editionKey: string;
  targetMarket: string;
  languageLabel: string;
  currency: SupportedCurrency;
  priceDisplay: string;
  title: string;
  description: string;
  url: string;
}

export const ORDER_BUMP_GLOBAL_CATALOG: Record<string, OrderBumpEditionConfig> = {
  pl: {
    editionKey: 'pl',
    targetMarket: 'Polska (Standard MZ 2026)',
    languageLabel: 'Polski (PL)',
    currency: 'pln',
    priceDisplay: '49,00 zł',
    title: 'Pakiet Kart Sytuacyjnych dla Taty + Matryca B.R.A.I.N., Siara (37 tyg.) i System 3 Reklamówek',
    description:
      '4 karty krok po kroku na salę porodową, ucisk krzyżowy, matryca decyzyjna B.R.A.I.N., protokół odciągania siary i zawieszka na drzwi.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl',
  },
  'pl-uk': {
    editionKey: 'pl-uk',
    targetMarket: 'Polki w Wielkiej Brytanii i Irlandii (NHS / HSE)',
    languageLabel: 'Dwujęzyczny PL ↔ EN',
    currency: 'gbp',
    priceDisplay: '£15.00 / 17,00 €',
    title: 'Dwujęzyczny Niezbędnik na Porodówkę NHS/HSE (PL↔EN): Słownik Skurczowy + Plan Porodu + MAT B1',
    description:
      'Słownik skurczowy PL↔EN z gotowymi zdaniami do położnej, dwujęzyczny Birth Plan, zasady TENS/Entonox oraz checklista MAT B1, Child Benefit i paszportu RP.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-uk',
  },
  'pl-de': {
    editionKey: 'pl-de',
    targetMarket: 'Polki w Niemczech, Austrii i Szwajcarii (Kreißsaal)',
    languageLabel: 'Dwujęzyczny PL ↔ DE',
    currency: 'eur',
    priceDisplay: '17,00 €',
    title: 'Dwujęzyczny Niezbędnik na Kreißsaal (PL↔DE): Słownik Porodowy, Dekoder Mutterpass i Elterngeld',
    description:
      'Słownik skurczowy PL↔DE, dekoder skrótów w Mutterpass (SL/BEL/MM), dwujęzyczny Geburtsplan oraz checklista Standesamt, Elterngeld i Kindergeld.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-de',
  },
  'pl-nl': {
    editionKey: 'pl-nl',
    targetMarket: 'Polki w Holandii (Verloskundige & Kraamzorg)',
    languageLabel: 'Dwujęzyczny PL ↔ NL/EN',
    currency: 'eur',
    priceDisplay: '17,00 €',
    title: 'Dwujęzyczny Niezbędnik Porodowy Holandia (PL↔NL): Słownik Verloskundige, Geboorteplan i Kraamzorg',
    description:
      'Słownik PL↔NL na telefon do położnej, różnice poród polikliniczny vs medische indicatie, lista Kraampakket i rejestracja w Gemeente (w 3 dni!).',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-nl',
  },
  'en-uk': {
    editionKey: 'en-uk',
    targetMarket: 'United Kingdom & Ireland (NHS & HSE)',
    languageLabel: 'English (UK/IE)',
    currency: 'gbp',
    priceDisplay: '£15.00',
    title: 'Birth Partner Labour Ward Flashcards, B.R.A.I.N. Advocacy & Colostrum Harvesting Toolkit',
    description:
      '4 pocket labour cards, sacral counter-pressure guide, B.R.A.I.N. shift-change matrix, 36w+ colostrum harvesting log & 3-cube NHS hospital bag checklist.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=en-uk',
  },
  'en-us': {
    editionKey: 'en-us',
    targetMarket: 'United States & Canada (L&D Hospital)',
    languageLabel: 'English (US/CA)',
    currency: 'usd',
    priceDisplay: '$27.00',
    title: 'L&D Partner Coaching Flashcards, B.R.A.I.N. Advocacy, Visual Birth Plan & Hospital Bill Shield',
    description:
      '5-1-1 triage rule, peanut ball & counter-pressure cards, B.R.A.I.N. informed consent guide, $0 ACA breast pump checklist & itemized hospital bill audit.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=en-us',
  },
  'en-au-ae': {
    editionKey: 'en-au-ae',
    targetMarket: 'Australia (Medicare) & UAE / Dubai Expats',
    languageLabel: 'English (AU / UAE)',
    currency: 'aud',
    priceDisplay: '$29.00 AUD / 89 AED',
    title: 'Partner Labour Ward Flashcards, Visual Birth Plan & Medicare / UAE 120-Day Expat Visa Checklist',
    description:
      'Partner labour action cards, colostrum syringe log, Australian Medicare FA081 guide & Dubai DHA Guarantee of Payment (GOP) + 120-day newborn visa tracker.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=en-au-ae',
  },
  de: {
    editionKey: 'de',
    targetMarket: 'DACH (Deutschland, Österreich, Schweiz)',
    languageLabel: 'Deutsch (DE/AT/CH)',
    currency: 'eur',
    priceDisplay: '17,00 €',
    title: 'Kreißsaal-Spickzettel für Partner, B.R.A.I.N.-Entscheidungshilfe, Kolostrum-Guide & Geburtsplan',
    description:
      '4 Praxiskarten für den Kreißsaal, Kreuzbein-Gegendruck, B.R.A.I.N.-Fragen beim Schichtwechsel, Kolostrum-Gewinnung ab 37+0 SSW & Kliniktaschen-Checkliste.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=de',
  },
  es: {
    editionKey: 'es',
    targetMarket: 'España, México & US Hispanic',
    languageLabel: 'Español (ES/LATAM)',
    currency: 'eur',
    priceDisplay: '17,00 € / $19.00',
    title: 'Tarjetas de Acción para el Acompañante en Paritorio, Método B.R.A.I.N. y Plan de Parto Visual',
    description:
      '4 tarjetas paso a paso para dilatación y expulsivo, contrapresión sacra, matriz B.R.A.I.N., extracción prenatal de calostro y trámites postparto.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=es',
  },
  'pt-br': {
    editionKey: 'pt-br',
    targetMarket: 'Brasil (Rede Privada & SUS)',
    languageLabel: 'Português (PT-BR)',
    currency: 'usd',
    priceDisplay: 'R$ 47,00 / $15.00',
    title: 'Cartões de Ação para o Acompanhante, Escudo Lei 11.108/2005, Plano de Parto e Mala em 6 Saquinhos',
    description:
      '4 cartões práticos de sala de parto, proteção legal Lei do Acompanhante (inclusive na cesárea), método B.R.A.I.N. e checklist dos 6 saquinhos da maternidade.',
    url: '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pt-br',
  },
};

export function is10PercentAffiliatePromo(code?: string | null): boolean {
  const res = validatePromoCode(code);
  return res.valid && res.discountPercent === 10;
}

/**
 * [A4] Kody 100% (TEST) są bezwzględnie wyłączone na produkcji.
 * Działają wyłącznie lokalnie w środowisku deweloperskim (NODE_ENV === 'development').
 */
export function is100PercentPromo(code?: string | null): boolean {
  if (!code) return false;
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  const clean = code.trim().toUpperCase();
  return clean === 'DEV100_LOCAL';
}

/**
 * Walidacja kodów rabatowych -10% (489,00 zł -> 440,10 zł brutto)
 * Obsługuje:
 * 1) Kody koleżeńskie kursantek [C4]: MAMA-XXXX (np. MAMA-ANNA, MAMA-2026)
 * 2) Kody położnych, fizjoterapeutek i twórców [D1b]: POLOZNA10, MAMAGAJA10, FIZJO10, PARTNER10, HB-*, POLOZNA-*, itp.
 */
export function validatePromoCode(rawCode?: string | null): PromoValidationResult {
  const clean = (rawCode || '').trim().toUpperCase();

  if (!clean) {
    return {
      valid: false,
      code: '',
      discountPercent: 0,
      basePricePln: BASE_COURSE_PRICE_PLN,
      discountedCoursePricePln: BASE_COURSE_PRICE_PLN,
      omnibusNotice: OMNIBUS_LOWEST_30_DAYS_TEXT,
      sourceType: 'invalid',
    };
  }

  // [A4] Blokada publicznego kodu TEST (100%)
  if (clean === 'TEST' || clean === 'TEST100' || clean === 'FREE' || clean === '100%') {
    return {
      valid: false,
      code: clean,
      discountPercent: 0,
      basePricePln: BASE_COURSE_PRICE_PLN,
      discountedCoursePricePln: BASE_COURSE_PRICE_PLN,
      omnibusNotice: OMNIBUS_LOWEST_30_DAYS_TEXT,
      sourceType: 'invalid',
      errorMessage: 'Ten kod testowy jest nieaktywny. Wpisz kod rabatowy (-10%) od swojej położnej, partnera lub koleżanki.',
    };
  }

  // 1. Kody poleceń koleżeńskich z panelu kursantki [C4] (np. MAMA-KASIA, MAMA-2026)
  if (/^MAMA-[A-Z0-9]{3,12}$/.test(clean)) {
    return {
      valid: true,
      code: clean,
      discountPercent: 10,
      basePricePln: BASE_COURSE_PRICE_PLN,
      discountedCoursePricePln: 440.1,
      omnibusNotice: OMNIBUS_LOWEST_30_DAYS_TEXT,
      sourceType: 'student_referral',
    };
  }

  // 2. Autoryzowane kody afiliacyjne -10% od położnych, fizjoterapeutek i partnerów [D1b]
  const knownAffiliateCodes = [
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

  const isAffiliatePattern =
    knownAffiliateCodes.includes(clean) ||
    /^HB-[A-Z0-9]{3,14}$/.test(clean) ||
    /^POLOZNA-[A-Z0-9]{3,14}$/.test(clean) ||
    /^FIZJO-[A-Z0-9]{3,14}$/.test(clean);

  if (isAffiliatePattern) {
    return {
      valid: true,
      code: clean,
      discountPercent: 10,
      basePricePln: BASE_COURSE_PRICE_PLN,
      discountedCoursePricePln: 440.1,
      omnibusNotice: OMNIBUS_LOWEST_30_DAYS_TEXT,
      sourceType: 'affiliate',
    };
  }

  return {
    valid: false,
    code: clean,
    discountPercent: 0,
    basePricePln: BASE_COURSE_PRICE_PLN,
    discountedCoursePricePln: BASE_COURSE_PRICE_PLN,
    omnibusNotice: OMNIBUS_LOWEST_30_DAYS_TEXT,
    sourceType: 'invalid',
    errorMessage: 'Podany kod rabatowy jest nieprawidłowy lub wygasł.',
  };
}

export function formatPlnPrice(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' zł';
}

export function activateStudentAccessLocally(promoCode: string = '') {
  if (typeof window === 'undefined') return;
  try {
    const clean = promoCode.trim().toUpperCase();
    const expiresAt = new Date(Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('hb_current_role', 'student');
    localStorage.setItem('hb_unlocked', 'true');
    localStorage.setItem('hb_access_expires_at', expiresAt);
    if (clean) localStorage.setItem('hb_active_promo', clean);
    localStorage.setItem('hb_payment_status', 'success');
    sessionStorage.setItem('hb_payment', 'success');
    window.dispatchEvent(new Event('hb_role_updated'));
    window.dispatchEvent(new Event('hb_progress_updated'));
  } catch (e) {
    console.error('Error activating student access:', e);
  }
}

/**
 * [A4] & [C1] Sprawdza rzeczywisty, ważny dostęp kursantki (18 miesięcy / 548 dni od zakupu).
 * Wyłączono bezwarunkowy dostęp testowy na produkcji.
 */
export function isCourseUnlockedLocally(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const unlocked = localStorage.getItem('hb_unlocked') === 'true';
    if (!unlocked) return false;
    const expiresAt = localStorage.getItem('hb_access_expires_at');
    if (expiresAt) {
      const expTime = new Date(expiresAt).getTime();
      if (!isNaN(expTime) && Date.now() > expTime) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
