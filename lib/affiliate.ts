/**
 * ============================================================================
 * SILNIK ATRYBUCJI I PROWIZJI AFILIACYJNYCH 2-TIER CAPPED CPA ([D1b] + [D2] + [D2a])
 * Model: „Daj 10% rabatu odbiorcom, odbierz 20%–30% prowizji (+ 5% Broker Tier 2)”
 * Bezwzględna izolacja danych wrażliwych RODO ([E5])
 * ============================================================================
 */

export type AffiliateRoleCategory = 'midwife_physio' | 'creator_publisher' | 'standard';

export const AFFILIATE_COOKIE_NAME = 'hb_aff_ref';
export const AFFILIATE_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 dni
export const ANTI_FRAUD_BUFFER_DAYS = 7; // 7–14 dni bufor techniczny po first_content_accessed_at

export interface AffiliatePartnerRecord {
  id: string;
  email: string;
  fullName: string;
  roleCategory: AffiliateRoleCategory;
  promoCode: string;
  refSlug: string;
  tier1Rate: number; // 0.20, 0.25 lub 0.30
  referredByBrokerId?: string | null; // Twarda blokada powyżej 2. poziomu (anty-MLM)
  tier2OverrideRate: number; // 0.05 (5%)
  status: 'active' | 'pending' | 'blocked';
}

export interface CommissionCalculationResult {
  allowed: boolean;
  rejectionReason?: string;
  attributionSource: 'promo_code' | 'ref_cookie' | 'none';
  paidAmountGrossGrosze: number;
  tier1PartnerId: string | null;
  tier1Rate: number;
  tier1CommissionGrossGrosze: number; // np. 8802 gr (88,02 zł), 11003 gr (110,03 zł), 13203 gr (132,03 zł)
  tier2BrokerId: string | null;
  tier2OverrideRate: number;
  tier2CommissionGrossGrosze: number; // np. 2200 gr (22,00 zł) przy 440,10 zł lub 2445 gr (24,45 zł) przy 489,00 zł
  companyRetainedMarginGrosze: number;
}

/**
 * Domyślna stawka Tier 1 na podstawie kategorii partnera zgodnie z sekcją [D1b]:
 * - 30% (132,03 zł z kodem -10%) — położne, fizjoterapeutki uroginekologiczne, doradczynie laktacyjne
 * - 25% (110,03 zł z kodem -10% / 122,25 zł przy pełnej cenie) — wydawcy treści, blogerzy, twórcy wideo
 * - 20% (88,02 zł z kodem -10%) — mikrotwórczynie i partnerzy standardowi
 */
export function getDefaultTier1Rate(category: AffiliateRoleCategory): number {
  switch (category) {
    case 'midwife_physio':
      return 0.3;
    case 'creator_publisher':
      return 0.25;
    case 'standard':
    default:
      return 0.2;
  }
}

/**
 * [D2] Podwójna Atrybucja Hybrydowa (Link + Kod) z nadrzędnością kodu wpisanego w koszyku
 * oraz regułami Anty-Fraud (zakaz kodu TEST, self-referral, wygasłych partnerów).
 */
export function calculateTwoTierCommission(params: {
  buyerEmail: string;
  paidCourseGrossGrosze: number; // 44010 (z kodem -10%) lub 48900 (pełna cena)
  enteredPromoCode?: string | null;
  cookieRefSlug?: string | null;
  partnerByPromoCode?: AffiliatePartnerRecord | null;
  partnerByRefCookie?: AffiliatePartnerRecord | null;
}): CommissionCalculationResult {
  const cleanCode = (params.enteredPromoCode || '').trim().toUpperCase();

  // Reguła Anty-Fraud 1: Kody testowe 100% i zamówienia bezpłatne nie generują prowizji
  if (
    params.paidCourseGrossGrosze <= 0 ||
    cleanCode === 'TEST' ||
    cleanCode === 'TEST100' ||
    cleanCode.includes('100')
  ) {
    return {
      allowed: false,
      rejectionReason: 'Zamówienie testowe lub rabat 100% nie generuje prowizji.',
      attributionSource: 'none',
      paidAmountGrossGrosze: params.paidCourseGrossGrosze,
      tier1PartnerId: null,
      tier1Rate: 0,
      tier1CommissionGrossGrosze: 0,
      tier2BrokerId: null,
      tier2OverrideRate: 0,
      tier2CommissionGrossGrosze: 0,
      companyRetainedMarginGrosze: params.paidCourseGrossGrosze,
    };
  }

  // Reguła Nadrzędności Kodu [D2]: Imienny kod wpisany w koszyku ma ZAWSZE pierwszeństwo nad wcześniejszym linkiem ?ref=
  let activePartner: AffiliatePartnerRecord | null = null;
  let attributionSource: 'promo_code' | 'ref_cookie' | 'none' = 'none';

  if (params.partnerByPromoCode && params.partnerByPromoCode.status === 'active') {
    activePartner = params.partnerByPromoCode;
    attributionSource = 'promo_code';
  } else if (params.partnerByRefCookie && params.partnerByRefCookie.status === 'active') {
    activePartner = params.partnerByRefCookie;
    attributionSource = 'ref_cookie';
  }

  if (!activePartner) {
    return {
      allowed: false,
      rejectionReason: 'Brak aktywnego partnera afiliacyjnego dla zamówienia.',
      attributionSource: 'none',
      paidAmountGrossGrosze: params.paidCourseGrossGrosze,
      tier1PartnerId: null,
      tier1Rate: 0,
      tier1CommissionGrossGrosze: 0,
      tier2BrokerId: null,
      tier2OverrideRate: 0,
      tier2CommissionGrossGrosze: 0,
      companyRetainedMarginGrosze: params.paidCourseGrossGrosze,
    };
  }

  // Reguła Anty-Fraud 2: Blokada self-referral (zakup z własnego linku lub kodu)
  if (
    params.buyerEmail &&
    activePartner.email &&
    params.buyerEmail.trim().toLowerCase() === activePartner.email.trim().toLowerCase()
  ) {
    return {
      allowed: false,
      rejectionReason: 'Blokada self-referral: zakup z własnego kodu lub linku partnerskiego.',
      attributionSource: 'none',
      paidAmountGrossGrosze: params.paidCourseGrossGrosze,
      tier1PartnerId: null,
      tier1Rate: 0,
      tier1CommissionGrossGrosze: 0,
      tier2BrokerId: null,
      tier2OverrideRate: 0,
      tier2CommissionGrossGrosze: 0,
      companyRetainedMarginGrosze: params.paidCourseGrossGrosze,
    };
  }

  const tier1Rate = Math.min(0.3, Math.max(0.2, activePartner.tier1Rate || getDefaultTier1Rate(activePartner.roleCategory)));
  const tier1CommissionGrossGrosze = Math.round(params.paidCourseGrossGrosze * tier1Rate);

  // Poziom 2 (Tier 2 Broker Override 5%) — bezwzględnie odcięty na 2. poziomie (brak poziomu 3)
  const tier2BrokerId = activePartner.referredByBrokerId || null;
  const tier2OverrideRate = tier2BrokerId ? 0.05 : 0;
  const tier2CommissionGrossGrosze = tier2BrokerId
    ? Math.round(params.paidCourseGrossGrosze * tier2OverrideRate)
    : 0;

  const estimatedStripeFeeGrosze = Math.round(params.paidCourseGrossGrosze * 0.02);
  const companyRetainedMarginGrosze =
    params.paidCourseGrossGrosze - tier1CommissionGrossGrosze - tier2CommissionGrossGrosze - estimatedStripeFeeGrosze;

  return {
    allowed: true,
    attributionSource,
    paidAmountGrossGrosze: params.paidCourseGrossGrosze,
    tier1PartnerId: activePartner.id,
    tier1Rate,
    tier1CommissionGrossGrosze,
    tier2BrokerId,
    tier2OverrideRate,
    tier2CommissionGrossGrosze,
    companyRetainedMarginGrosze,
  };
}

/**
 * [D2a] Wyznacza datę przejścia prowizji w status ELIGIBLE zsynchronizowaną z Art. 38 ust. 1 pkt 13 u.p.k.
 * Gdy klientka otworzy pierwszą lekcję (firstContentAccessedAt), jej prawo odstąpienia wygasa,
 * więc prowizja odblokowuje się po krótkim buforze anty-fraud (7 dni).
 */
export function computeCommissionEligibleDate(firstContentAccessedAtIso: string): string {
  const accessedDate = new Date(firstContentAccessedAtIso);
  const eligibleDate = new Date(accessedDate.getTime() + ANTI_FRAUD_BUFFER_DAYS * 24 * 60 * 60 * 1000);
  return eligibleDate.toISOString();
}
