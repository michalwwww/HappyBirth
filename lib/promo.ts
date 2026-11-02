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

export interface SmartGeoOrderBumpResult {
  editionKey: string;
  countryCode: string;
  isAbroad: boolean;
  isPolishDiaspora: boolean;
  autoDetectedBadge: string;
  checkoutTitlePl: string;
  checkoutDescPl: string;
  editionConfig: OrderBumpEditionConfig;
}

export function inferCountryFromTimeZone(tz?: string | null): string {
  const cleanTz = (tz || '').trim();
  if (!cleanTz) return 'PL';
  if (cleanTz === 'Europe/Warsaw') return 'PL';
  if (cleanTz === 'Europe/London' || cleanTz === 'Europe/Belfast' || cleanTz === 'Europe/Jersey') return 'GB';
  if (cleanTz === 'Europe/Dublin') return 'IE';
  if (cleanTz === 'Europe/Berlin' || cleanTz === 'Europe/Busingen') return 'DE';
  if (cleanTz === 'Europe/Vienna') return 'AT';
  if (cleanTz === 'Europe/Zurich') return 'CH';
  if (cleanTz === 'Europe/Amsterdam') return 'NL';
  if (cleanTz === 'Europe/Brussels') return 'BE';
  if (cleanTz === 'Europe/Madrid' || cleanTz === 'Atlantic/Canary') return 'ES';
  if (cleanTz.startsWith('America/Mexico') || cleanTz === 'America/Monterrey' || cleanTz === 'America/Cancun') return 'MX';
  if (
    cleanTz === 'America/Sao_Paulo' ||
    cleanTz === 'America/Fortaleza' ||
    cleanTz === 'America/Recife' ||
    cleanTz === 'America/Bahia' ||
    cleanTz === 'America/Manaus'
  ) {
    return 'BR';
  }
  if (cleanTz.startsWith('Australia/')) return 'AU';
  if (cleanTz === 'Asia/Dubai' || cleanTz === 'Asia/Muscat' || cleanTz === 'Asia/Qatar') return 'AE';
  if (
    cleanTz === 'America/Toronto' ||
    cleanTz === 'America/Vancouver' ||
    cleanTz === 'America/Montreal' ||
    cleanTz === 'America/Edmonton' ||
    cleanTz === 'America/Winnipeg' ||
    cleanTz === 'America/Halifax'
  ) {
    return 'CA';
  }
  if (cleanTz.startsWith('America/')) return 'US';
  return 'PL';
}

export function readGeoCountryCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)hb_geo_country=([A-Z]{2})/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Inteligentne dopasowanie pakietu Order Bump do miejsca pobytu i języka klientki:
 * 1) Sprawdza ręczny wybór użytkowniczki (manualOverride / localStorage)
 * 2) Sprawdza nagłówek/ciasteczko geolokalizacji Cloudflare (`hb_geo_country` z `cf-ipcountry`)
 * 3) Sprawdza strefę czasową przeglądarki (`Intl.DateTimeFormat().resolvedOptions().timeZone`) oraz języki (`navigator.languages`)
 */
export function detectClientOrderBumpEdition(options?: {
  countryCode?: string | null;
  timeZone?: string | null;
  browserLangs?: readonly string[];
  uiLang?: string;
  manualEditionOverride?: string | null;
}): SmartGeoOrderBumpResult {
  // 1. Jeśli przekazano jawne nadpisanie edycji (np. z przełącznika lub localStorage)
  const overrideKey = (options?.manualEditionOverride || '').trim().toLowerCase();
  if (overrideKey && ORDER_BUMP_GLOBAL_CATALOG[overrideKey]) {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG[overrideKey];
    const isPl = overrideKey === 'pl';
    return {
      editionKey: overrideKey,
      countryCode: isPl ? 'PL' : overrideKey.toUpperCase(),
      isAbroad: !isPl,
      isPolishDiaspora: overrideKey.startsWith('pl-'),
      autoDetectedBadge: isPl
        ? '🇵🇱 Dopasowano: Polska (Standard MZ 2026)'
        : `🌍 Wybrana edycja: ${cfg.targetMarket} (${cfg.languageLabel})`,
      checkoutTitlePl: isPl ? ORDER_BUMP_TITLE_PL : cfg.title,
      checkoutDescPl: isPl ? ORDER_BUMP_DESC_PL : cfg.description,
      editionConfig: cfg,
    };
  }

  // 2. Odczyt kraju z opcji, ciasteczka Cloudflare Edge lub strefy czasowej przeglądarki
  const cookieCountry = readGeoCountryCookie();
  const browserTz =
    options?.timeZone ||
    (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/Warsaw');
  const country = (options?.countryCode || cookieCountry || inferCountryFromTimeZone(browserTz) || 'PL')
    .trim()
    .toUpperCase();

  const langs =
    options?.browserLangs ||
    (typeof navigator !== 'undefined' && navigator.languages ? navigator.languages : ['pl-PL']);
  const uiLang = (options?.uiLang || 'pl').toLowerCase();
  const speaksPolish =
    uiLang === 'pl' || langs.some((l) => l.toLowerCase().startsWith('pl'));

  // Domyślnie Polska (PL) -> 100% zgodności z polskim koszykiem 489 zł + 49 zł
  if (country === 'PL') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG.pl;
    return {
      editionKey: 'pl',
      countryCode: 'PL',
      isAbroad: false,
      isPolishDiaspora: false,
      autoDetectedBadge: '🇵🇱 Polska (Standard MZ 2026)',
      checkoutTitlePl: ORDER_BUMP_TITLE_PL,
      checkoutDescPl: ORDER_BUMP_DESC_PL,
      editionConfig: cfg,
    };
  }

  // Polka za granicą (lub klientka zagraniczna): dobierz właściwą edycję krajową
  if (country === 'GB' || country === 'UK' || country === 'IE') {
    const key = speaksPolish ? 'pl-uk' : 'en-uk';
    const cfg = ORDER_BUMP_GLOBAL_CATALOG[key];
    return {
      editionKey: key,
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge: speaksPolish
        ? '🇵🇱🇬🇧 Automatycznie dopasowano do UK/Irlandii (Pakiet Dwujęzyczny PL↔EN NHS/HSE)'
        : '🇬🇧🇮🇪 Auto-matched: UK & Ireland Edition (NHS / HSE)',
      checkoutTitlePl: cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'DE' || country === 'AT' || country === 'CH') {
    const key = speaksPolish ? 'pl-de' : 'de';
    const cfg = ORDER_BUMP_GLOBAL_CATALOG[key];
    return {
      editionKey: key,
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge: speaksPolish
        ? '🇵🇱🇩🇪 Automatycznie dopasowano do DE/AT/CH (Pakiet Dwujęzyczny PL↔DE Kreißsaal)'
        : '🇩🇪🇦🇹🇨🇭 Automatisch angepasst: DACH Kreißsaal-Edition',
      checkoutTitlePl: cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'NL' || country === 'BE') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG['pl-nl'];
    return {
      editionKey: 'pl-nl',
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: true,
      autoDetectedBadge: '🇵🇱🇳🇱 Automatycznie dopasowano do Holandii (Pakiet Dwujęzyczny PL↔NL Kraamzorg)',
      checkoutTitlePl: cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'US' || country === 'CA') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG['en-us'];
    return {
      editionKey: 'en-us',
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge: speaksPolish
        ? '🇵🇱🇺🇸 Automatycznie dopasowano do USA/Kanady (Szpital L&D + Darmowy Laktator ACA)'
        : '🇺🇸🇨🇦 Auto-matched: USA & Canada L&D Hospital Edition',
      checkoutTitlePl: speaksPolish
        ? 'Pakiet Porodowy USA/Kanada (L&D): Karty dla Taty, Matryca B.R.A.I.N., Darmowy Laktator ACA i Audyt Rachunku'
        : cfg.title,
      checkoutDescPl: speaksPolish
        ? 'Reguła 5-1-1, pozycje z Peanut Ball, pytania B.R.A.I.N. przed Pitocinem, odbiór darmowego laktatora z polisy ACA i ochrona przed zawyżonym rachunkiem szpitalnym.'
        : cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'AU' || country === 'NZ' || country === 'AE') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG['en-au-ae'];
    return {
      editionKey: 'en-au-ae',
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge:
        country === 'AE'
          ? '🇦🇪 Automatycznie dopasowano do ZEA/Dubaju (DHA GOP + Wiza 120 Dni)'
          : '🇦🇺 Automatycznie dopasowano do Australii (Medicare FA081 + MGP)',
      checkoutTitlePl: speaksPolish
        ? 'Pakiet Porodowy Australia & Dubaj (Expat): Karty na Salę, Siara 36w+, Medicare FA081 i Wiza 120 Dni'
        : cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'ES' || country === 'MX' || country === 'AR' || country === 'CO' || country === 'CL') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG.es;
    return {
      editionKey: 'es',
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge: '🇪🇸🇲🇽 Automatycznie dopasowano: Edycja Hiszpania / LatAm (Español)',
      checkoutTitlePl: cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  if (country === 'BR' || country === 'PT') {
    const cfg = ORDER_BUMP_GLOBAL_CATALOG['pt-br'];
    return {
      editionKey: 'pt-br',
      countryCode: country,
      isAbroad: true,
      isPolishDiaspora: speaksPolish,
      autoDetectedBadge: '🇧🇷 Automatycznie dopasowano: Edycja Brazylia (Parto Humanizado & Lei 11.108)',
      checkoutTitlePl: cfg.title,
      checkoutDescPl: cfg.description,
      editionConfig: cfg,
    };
  }

  // Pozostałe kraje zagraniczne -> domyślnie pakiet dwujęzyczny PL↔EN (najbardziej uniwersalny dla Polek za granicą)
  const fallbackKey = speaksPolish ? 'pl-uk' : 'en-uk';
  const fallbackCfg = ORDER_BUMP_GLOBAL_CATALOG[fallbackKey];
  return {
    editionKey: fallbackKey,
    countryCode: country,
    isAbroad: true,
    isPolishDiaspora: speaksPolish,
    autoDetectedBadge: `🌍 Automatycznie dopasowano do pobytu za granicą (${country}): Pakiet Dwujęzyczny PL↔EN`,
    checkoutTitlePl: fallbackCfg.title,
    checkoutDescPl: fallbackCfg.description,
    editionConfig: fallbackCfg,
  };
}

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
