import crypto from 'crypto';

/**
 * ============================================================================
 * TARCZA PRAWNA HAPPYBIRTH.PL ([E1] + [E2] + [E5])
 * Operator: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań
 * NIP: 7812118273 | KRS: 0001268396 | REGON: 545782779
 * ============================================================================
 */

export const OPERATOR_LEGAL_DATA = {
  fullName: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  shortName: 'KLARSOLUTIONS Sp. z o.o.',
  address: 'ul. Śląska 14, 60-614 Poznań',
  nip: '7812118273',
  krs: '0001268396',
  regon: '545782779',
  court: 'Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego',
  shareCapital: '5 000,00 PLN',
  contactEmail: 'kontakt@happybirth.pl',
  supportEmail: 'pomoc@happybirth.pl',
};

/**
 * [E1] Dwa osobne, niezaznaczone domyślnie checkboxy w koszyku
 */
export const CHECKBOX_1_TERMS_TEXT =
  'Akceptuję Regulamin Sklepu happybirth.pl (operator: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań) oraz zapoznałam/em się z Polityką Prywatności.';

export const CHECKBOX_2_ART38_WAIVER_TEXT =
  'Żądam natychmiastowego rozpoczęcia dostarczania treści cyfrowych przed upływem 14-dniowego terminu do odstąpienia od umowy i przyjmuję do wiadomości, że z chwilą uzyskania dostępu do platformy kursowej tracę prawo do odstąpienia od umowy zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.';

export const TERMS_VERSION_ID = '2026-10-27-v2.0-18M';

export function getTermsSha256Hash(): string {
  const canonicalTermsSummary = `${OPERATOR_LEGAL_DATA.fullName}|NIP:${OPERATOR_LEGAL_DATA.nip}|KRS:${OPERATOR_LEGAL_DATA.krs}|PRICE:489.00_PLN_GROSS|ACCESS:18_MONTHS_548_DAYS|MODULES:8_LESSONS:52|WAIVER_ART38:${CHECKBOX_2_ART38_WAIVER_TEXT}|VERSION:${TERMS_VERSION_ID}`;
  return crypto.createHash('sha256').update(canonicalTermsSummary, 'utf8').digest('hex');
}

/**
 * [E1] Generowanie wiadomości e-mail stanowiącej potwierdzenie na TRWAŁYM NOŚNIKU
 * (Durable Medium Mailer) wraz ze specyfikacją VAT 23% i załącznikiem Regulaminu.
 */
export function buildDurableMediumConfirmationEmail(params: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  amountGrossGrosze: number;
  orderBumpIncluded: boolean;
  waiverTimestampIso: string;
  termsSha256: string;
  accessUrl: string;
  expiresAtIso: string;
}) {
  const grossPln = (params.amountGrossGrosze / 100).toFixed(2).replace('.', ',');
  const netPln = (params.amountGrossGrosze / 100 / 1.23).toFixed(2).replace('.', ',');
  const vatPln = (params.amountGrossGrosze / 100 - params.amountGrossGrosze / 100 / 1.23).toFixed(2).replace('.', ',');
  const expiresFormatted = new Date(params.expiresAtIso).toLocaleDateString('pl-PL');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 18px;">
      <div style="border-bottom: 1px solid #EAE3DB; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #DA0271; font-weight: 700;">Potwierdzenie zawarcia umowy na trwałym nośniku</span>
        <h1 style="color: #1A1512; font-size: 22px; margin: 6px 0 0 0;">Dziękujemy za zakup kursu HappyBirth.pl!</h1>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #342D28;">
        Cześć <strong>${params.customerName}</strong>,<br/>
        niniejsza wiadomość stanowi urzędowe potwierdzenie zawarcia umowy o dostarczanie treści cyfrowych na odległość na trwałym nośniku zgodnie z art. 21 ust. 1 oraz art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
      </p>

      <div style="margin: 24px 0; text-align: center;">
        <a href="${params.accessUrl}" style="background-color: #DA0271; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block; font-size: 15px;">
          Wejdź do Strefy Kursantki (52 lekcje 4K) &rarr;
        </a>
      </div>

      <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 14px; padding: 16px; margin-bottom: 18px; font-size: 13px; line-height: 1.6;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #1A1512;">1. Specyfikacja zamówienia i faktury VAT (23%)</h3>
        <div><strong>Numer zamówienia:</strong> ${params.orderNumber}</div>
        <div><strong>Produkt główny:</strong> Kurs Szkoły Rodzenia Online HappyBirth.pl (52 lekcje 4K w 8 modułach, 288 min + Notatnik Rodzica PDF + dostęp dla partnera)</div>
        ${params.orderBumpIncluded ? '<div><strong>Dodatek do zamówienia (Order Bump):</strong> Indywidualny Pakiet Dokumentów Szpitalnych i Kreator Planu Porodu + Checklista Wyprawkowa PDF (+49,00 zł brutto)</div>' : ''}
        <div><strong>Okres ważności dostępu:</strong> 18 miesięcy (548 dni) od momentu zakupu — ważny do <strong>${expiresFormatted}</strong></div>
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #EAE3DB;">
          <strong>Kwota brutto (z VAT 23%):</strong> ${grossPln} PLN | <strong>Kwota netto:</strong> ${netPln} PLN | <strong>Podatek VAT (23%):</strong> ${vatPln} PLN
        </div>
      </div>

      <div style="background: #FAE3EB; border: 1px solid #F3CAD9; border-radius: 14px; padding: 16px; margin-bottom: 18px; font-size: 12.5px; line-height: 1.55; color: #541235;">
        <strong>2. Potwierdzenie udzielenia zgody na utratę prawa do odstąpienia od umowy (Art. 38 ust. 1 pkt 13 u.p.k.):</strong><br/>
        Potwierdzamy, że przed złożeniem zamówienia w dniu <code>${params.waiverTimestampIso}</code> wyraziłaś/eś wyraźną i uprzednią zgodę o treści:<br/>
        <em>„${CHECKBOX_2_ART38_WAIVER_TEXT}”</em><br/>
        Suma kontrolna zaakceptowanego Regulaminu (SHA-256): <code>${params.termsSha256.slice(0, 24)}...</code>
      </div>

      <p style="font-size: 11.5px; color: #867A72; line-height: 1.5; border-top: 1px solid #EAE3DB; padding-top: 14px;">
        <strong>Sprzedawca i Operator Prawny:</strong> ${OPERATOR_LEGAL_DATA.fullName}, ${OPERATOR_LEGAL_DATA.address}, NIP: ${OPERATOR_LEGAL_DATA.nip}, KRS: ${OPERATOR_LEGAL_DATA.krs}, REGON: ${OPERATOR_LEGAL_DATA.regon}, ${OPERATOR_LEGAL_DATA.court}, kapitał zakładowy: ${OPERATOR_LEGAL_DATA.shareCapital}.<br/>
        W załączeniu przesyłamy pełną treść Regulaminu Świadczenia Usług na trwałym nośniku. Formularz odstąpienia od umowy dostępny jest pod adresem: https://happybirth.pl/odstap-od-umowy
      </p>
    </div>
  `;

  return {
    subject: `Potwierdzenie zawarcia umowy (${params.orderNumber}) i Twój dostęp na 18 miesięcy — HappyBirth.pl`,
    html,
  };
}

/**
 * [E2] Automatyczna logika obronna backendu dla przycisku „Odstąp od umowy” (/odstap-od-umowy)
 */
export interface WithdrawalEvaluationInput {
  scope: 'full_order' | 'order_bump_only';
  waiverArt38Accepted: boolean;
  firstContentAccessedAt: string | null;
  orderBumpIncluded: boolean;
}

export interface WithdrawalEvaluationResult {
  status: 'auto_rejected_art38' | 'approved_for_refund';
  autoRejectedDueToArt38: boolean;
  refundCourse: boolean;
  refundOrderBump: boolean;
  customerLegalNotice: string;
}

export function evaluateWithdrawalRequest(input: WithdrawalEvaluationInput): WithdrawalEvaluationResult {
  // Przypadek 1: Konsument odstępuje wyłącznie od niewykorzystanego dodatku z Order Bumpa (+49 zł)
  if (input.scope === 'order_bump_only' && input.orderBumpIncluded) {
    return {
      status: 'approved_for_refund',
      autoRejectedDueToArt38: false,
      refundCourse: false,
      refundOrderBump: true,
      customerLegalNotice:
        'Przyjęliśmy Twoje oświadczenie o częściowym odstąpieniu od umowy w zakresie pakietu dodatkowego (Order Bump +49,00 zł). Zwrot kwoty 49,00 zł zostanie przekazany na Twój rachunek płatniczy w terminie do 14 dni, a dostęp do kursu głównego pozostaje aktywny.',
    };
  }

  // Przypadek 2: Klientka wyraziła zgodę [E1] (waiver_art38_accepted = TRUE) i rozpoczęła korzystanie z kursu (first_content_accessed_at IS NOT NULL)
  if (input.waiverArt38Accepted && Boolean(input.firstContentAccessedAt)) {
    return {
      status: 'auto_rejected_art38',
      autoRejectedDueToArt38: true,
      refundCourse: false,
      refundOrderBump: false,
      customerLegalNotice: `Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Jednocześnie informujemy, że zgodnie z art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, prawo odstąpienia od umowy o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym wygasło z chwilą rozpoczęcia korzystania z kursu (odnotowane pierwsze otwarcie materiałów: ${input.firstContentAccessedAt}), po uprzednim wyrażeniu przez Ciebie wyraźnej zgody w koszyku przed dokonaniem płatności. Twój 18-miesięczny dostęp do platformy HappyBirth.pl pozostaje w pełni aktywny.`,
    };
  }

  // Przypadek 3: Dostęp do kursu nie został jeszcze w ogóle otwarty (first_content_accessed_at IS NULL)
  return {
    status: 'approved_for_refund',
    autoRejectedDueToArt38: false,
    refundCourse: true,
    refundOrderBump: input.orderBumpIncluded,
    customerLegalNotice:
      'Potwierdzamy wpływ Twojego oświadczenia o odstąpieniu od umowy na trwałym nośniku. Ponieważ materiały kursowe nie zostały jeszcze uruchomione na Twoim koncie, Twoje zgłoszenie zostało zakwalifikowane do pełnego zwrotu środków w terminie do 14 dni kalendarzowych.',
  };
}

/**
 * [E5] Sterylna Śluza Treści (Policy Scanner) — weryfikacja tekstów publicznych pod kątem 10 reguł Meta Ads / MDR
 */
const FORBIDDEN_MEDICAL_OR_AD_TERMS = [
  'gwarantowany poród bez bólu',
  '100% bez bólu',
  'zastępuje lekarza',
  'zastępuje położną',
  'diagnoza medyczna',
  'wyrób medyczny',
  'jedź natychmiast do szpitala',
  'nacięcie krocza',
  'krwotok',
  'standard mz 2024',
];

export function scanCopyForPolicyCompliance(text: string): { compliant: boolean; violations: string[] } {
  const lower = (text || '').toLowerCase();
  const violations = FORBIDDEN_MEDICAL_OR_AD_TERMS.filter((term) => lower.includes(term));
  return {
    compliant: violations.length === 0,
    violations,
  };
}
