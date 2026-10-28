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
