/**
 * SYSTEM SEMANTYCZNYCH KODÓW RABATOWYCH I LINKÓW REKOMENDACYJNYCH HAPPYBIRTH
 * =========================================================================
 * Zamiast generycznych kodów typu "ANNA-8F2A10" (imię + losowe znaki hex),
 * system buduje kody, które już samą swoją nazwą wykonują pracę marketingową:
 * - niosą obietnicę spokoju i wsparcia (SPOKOJ-KASIA, DOBRYSTART-ANNA, BEZSTRESU),
 * - podkreślają osobiste polecenie i relację (POLECA-MARTA, OD-KASI, BLISKO-OLA),
 * - budują autorytet edukacyjny i akademicki (AKADEMIA-KASIA, WIEDZA-MAREK),
 * - aktywują przyszłych ojców i pary (GOTOWY-TATA, RAZEM-DO-PORODU, WSPARCIE-TATY).
 */

export interface BrandCodeSuggestion {
  code: string;
  slug: string;
  categoryLabel: string;
  marketingPitch: string;
}

export interface TeamFlagshipCode {
  code: string;
  slug: string;
  owner: string;
  role: string;
  targetAudience: string;
  headline: string;
}

/**
 * 1. KODY FLAGOWE ZESPOŁU HAPPYBIRTH & REDAKCJI MAMA GAJA (-10% -> 440,10 zł)
 */
export const TEAM_FLAGSHIP_CODES: TeamFlagshipCode[] = [
  {
    code: 'SPOKOJNYPOROD',
    slug: 'spokojny-porod',
    owner: 'Zespół HappyBirth & Mama Gaja',
    role: 'Kod Flagowy Marki',
    targetAudience: 'Przyszłe mamy szukające spokoju, wiedzy i opanowania przed porodem',
    headline: 'Spokojny Poród (-10%) — bo wiedza zamienia lęk w spokój',
  },
  {
    code: 'DOBRYSTART',
    slug: 'dobry-start',
    owner: 'Michał · Strategia & Rozwój',
    role: 'Kampanie Główne i Partnerstwa',
    targetAudience: 'Pary w I i II trymestrze kompletujące wiedzę i plan działania',
    headline: 'Dobry Start (-10%) — pełne przygotowanie krok po kroku',
  },
  {
    code: 'GOTOWY-TATA',
    slug: 'gotowy-tata',
    owner: 'Maciej · Ścieżka Partnera & Produkt',
    role: 'Kampanie dla Przyszłych Ojców',
    targetAudience: 'Przyszli ojcowie i partnerzy przygotowujący się do porodu rodzinnego',
    headline: 'Gotowy Tata (-10%) — konkretna wiedza dla partnera na porodówkę',
  },
  {
    code: 'RAZEM-DO-PORODU',
    slug: 'razem-do-porodu',
    owner: 'Michał & Maciej · Zespół Założycielski',
    role: 'Kampanie dla Par (18 mies. dla dwojga)',
    targetAudience: 'Rodzice przygotowujący się wspólnie wieczorami w domu',
    headline: 'Razem do Porodu (-10%) — jeden dostęp dla obojga rodziców na 18 miesięcy',
  },
  {
    code: 'PIERWSZEDNI',
    slug: 'pierwsze-dni',
    owner: 'Redakcja Merytoryczna',
    role: 'Wyprawka, Połóg i Pierwsze Dni w Domu',
    targetAudience: 'III trymestr, pakowanie torby do szpitala, laktacja i opieka nad noworodkiem',
    headline: 'Pierwsze Dni (-10%) — spokojny powrót ze szpitala do domu',
  },
  {
    code: 'DOBRYPOROD',
    slug: 'dobry-porod',
    owner: 'Michał · Kampanie Edukacyjne',
    role: 'Narzędzia PDF (Plan Porodu & Wyprawka)',
    targetAudience: 'Mamy pobierające Plan Porodu PDF zgodny ze Standardem MZ 2026',
    headline: 'Dobry Poród (-10%) — świadomy plan porodu i znajomość swoich praw',
  },
  {
    code: 'WSPARCIE-TATY',
    slug: 'wsparcie-taty',
    owner: 'Maciej · Moduł Partnera',
    role: 'Ściąga Partnera i Niezbędnik na Salę Porodową',
    targetAudience: 'Partnerzy chcący realnie pomóc w I i II okresie porodu',
    headline: 'Wsparcie Taty (-10%) — partner, który wie dokładnie co robić',
  },
  {
    code: 'MAMAGAJA',
    slug: 'mama-gaja',
    owner: 'Szkoła Rodzenia Mama Gaja (od 2012 r.)',
    role: 'Autorytet Stacjonarny',
    targetAudience: 'Rodzice z polecenia absolwentek stacjonarnej szkoły rodzenia',
    headline: 'Mama Gaja (-10%) — doświadczenie tysięcy porodów od 2012 roku',
  },
  {
    code: 'BEZSTRESU',
    slug: 'bez-stresu',
    owner: 'Zespół HappyBirth',
    role: 'Webinary, Q&A i Lekcje Pokazowe',
    targetAudience: 'Osoby po obejrzeniu 4 bezpłatnych lekcji pokazowych',
    headline: 'Bez Stresu (-10%) — kontynuuj pełny kurs 52 lekcji wideo',
  },
  {
    code: 'AKADEMIA-HB',
    slug: 'akademia-hb',
    owner: 'Koordynacja Akademicka HappyBirth',
    role: 'Koła Naukowe i Uczelnie Medyczne',
    targetAudience: 'Społeczność akademicka i polecenia studenckie',
    headline: 'Akademia HappyBirth (-10%) — wiedza zgodna z aktualnym standardem medycznym',
  },
];

/**
 * Zbiór wszystkich oficjalnych kodów flagowych i semantycznych słów kluczowych (-10%)
 */
export const OFFICIAL_SEMANTIC_CODES = new Set<string>([
  ...TEAM_FLAGSHIP_CODES.map((c) => c.code),
  'SPOKOJNY-POROD',
  'DOBRY-START',
  'DOBRY-POROD',
  'PIERWSZE-DNI',
  'BEZ-STRESU',
  'GOTOWYTATA',
  'RAZEMDOPORODU',
  'WSPARCIETATY',
  'SPOKOJ-W-DOMU',
  'DOMOWASZKOLA',
  'SZKOLARODZENIA',
  'PLANPORODU',
  'WYPRAWKA10',
  'TORBA10',
  'MAMAGAJA10',
  'SPOKOJ10',
  'HAPPY10',
  'PARTNER10',
  'FIZJO10',
  'LAKTACJA10',
  'STUDENT10',
  'STUDENT-2026',
  'AMBASADOR10',
]);

/**
 * Dozwolone semantyczne prefiksy marketingowe dla kodów imiennych Studentów i Partnerów:
 * np. SPOKOJ-KASIA, POLECA-ANNA, DOBRYSTART-MARTA, OD-KASI, AKADEMIA-OLA, RAZEM-MAREK, GABINET-ANNA
 */
export const SEMANTIC_AFFILIATE_PREFIXES = [
  'SPOKOJ',
  'SPOKOJNA',
  'SPOKOJNY',
  'POLECA',
  'DOBRYSTART',
  'DOBRYPOROD',
  'BLISKO',
  'Z-SERCA',
  'ZSERCA',
  'OD',
  'RAZEM',
  'GOTOWI',
  'GOTOWY',
  'AKADEMIA',
  'WIEDZA',
  'MED',
  'KAMPUS',
  'KOLO',
  'GABINET',
  'PRAKTYKA',
  'FIZJO',
  'ODDECH',
  'TULIMY',
  'WYPRAWKA',
  'RODZIMY',
  'PARTNER',
  'STUDENT',
  'AMBASADOR',
  'HB',
] as const;

/**
 * Oczyszcza ciąg znaków do czystego wielokoliterowego tokenu ASCII (A-Z, 0-9)
 */
export function normalizeAsciiToken(raw: string): string {
  return (raw || '')
    .trim()
    .toUpperCase()
    .replace(/Ł/g, 'L')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Naturalna odmiana polskich imion w dopełniaczu dla ciepłych kodów typu "OD-KASI", "OD-ANI", "OD-MARKA"
 */
const POLISH_GENITIVE_MAP: Record<string, string> = {
  KASIA: 'KASI',
  KATARZYNA: 'KASI',
  ANNA: 'ANI',
  ANIA: 'ANI',
  MARTA: 'MARTY',
  OLA: 'OLI',
  ALEKSANDRA: 'OLI',
  MAGDA: 'MAGDY',
  MAGDALENA: 'MAGDY',
  JULIA: 'JULII',
  JULKA: 'JULKI',
  ZUZIA: 'ZUZI',
  ZUZANNA: 'ZUZI',
  ZOSIA: 'ZOSI',
  ZOFIA: 'ZOSI',
  MAJA: 'MAI',
  NATALIA: 'NATALII',
  KAROLINA: 'KAROLINY',
  PAULINA: 'PAULINY',
  MONIKA: 'MONIKI',
  AGNIESZKA: 'AGNIESZKI',
  AGA: 'AGI',
  EWA: 'EWY',
  JOANNA: 'ASI',
  ASIA: 'ASI',
  KINGA: 'KINGI',
  WERONIKA: 'WERONIKI',
  PATRYCJA: 'PATRYCJI',
  DOMINIKA: 'DOMINIKI',
  SYLWIA: 'SYLWII',
  JUSTYNA: 'JUSTYNY',
  KAMILA: 'KAMILI',
  AGATA: 'AGATY',
  EMILIA: 'EMILII',
  HANIA: 'HANI',
  HANNA: 'HANI',
  ALICJA: 'ALICJI',
  ALA: 'ALI',
  MARTYNA: 'MARTYNY',
  KLAUDIA: 'KLAUDII',
  MICHAL: 'MICHALA',
  MACIEJ: 'MACIEJA',
  MACIEK: 'MACKA',
  MAREK: 'MARKA',
  PIOTR: 'PIOTRA',
  PAWEL: 'PAWLA',
  TOMASZ: 'TOMKA',
  TOMEK: 'TOMKA',
  JAKUB: 'KUBY',
  KUBA: 'KUBY',
  BARTOSZ: 'BARTKA',
  BARTEK: 'BARTKA',
  KAMIL: 'KAMILA',
  DAWID: 'DAWIDA',
  MATEUSZ: 'MATEUSZA',
  LUKASZ: 'LUKASZA',
  ADAM: 'ADAMA',
  KRZYSZTOF: 'KRZYSZTOFA',
  FILIP: 'FILIPA',
};

export function toPolishGenitiveName(firstNameAscii: string): string {
  const clean = normalizeAsciiToken(firstNameAscii);
  if (!clean) return 'PARTNERA';
  if (POLISH_GENITIVE_MAP[clean]) return POLISH_GENITIVE_MAP[clean];
  if (clean.endsWith('IA') || clean.endsWith('JA')) {
    return `${clean.slice(0, -1)}I`;
  }
  if (clean.endsWith('KA') || clean.endsWith('GA')) {
    return `${clean.slice(0, -1)}I`;
  }
  if (clean.endsWith('A')) {
    return `${clean.slice(0, -1)}Y`;
  }
  return `${clean}A`;
}

/**
 * Wyciąga czyste imię oraz inicjał nazwiska z pełnego imienia i nazwiska
 */
export function extractNameTokens(fullName?: string | null, email?: string | null): {
  firstName: string;
  lastName: string;
  lastInitial: string;
  genitiveFirst: string;
} {
  const rawSource = (fullName || '').trim() || (email || '').split('@')[0].replace(/[._0-9-]+/g, ' ');
  const parts = rawSource
    .split(/\s+/)
    .map((p) => normalizeAsciiToken(p))
    .filter((p) => p.length >= 2);

  const firstName = (parts[0] || 'PARTNER').slice(0, 11);
  const lastName = (parts[1] || '').slice(0, 12);
  const lastInitial = lastName ? lastName.slice(0, 1) : '';
  const genitiveFirst = toPolishGenitiveName(firstName);

  return { firstName, lastName, lastInitial, genitiveFirst };
}

/**
 * Generuje zestaw 6 gotowych, marketingowo pracujących propozycji kodów dla danej osoby
 * (Zero losowych znaków hex!)
 */
export function generateSmartPartnerCodeCandidates(
  fullName?: string | null,
  roleCategory: string = 'standard',
  email?: string | null
): BrandCodeSuggestion[] {
  const { firstName, lastName, lastInitial, genitiveFirst } = extractNameTokens(fullName, email);

  const suggestions: BrandCodeSuggestion[] = [
    {
      code: `SPOKOJ-${firstName}`,
      slug: `spokoj-${firstName.toLowerCase()}`,
      categoryLabel: 'Emocje i Spokój (Najwyższa konwersja)',
      marketingPitch: 'Od razu komunikuje przyszłej mamie obietnicę spokojnego porodu z Twojego polecenia.',
    },
    {
      code: `POLECA-${firstName}`,
      slug: `poleca-${firstName.toLowerCase()}`,
      categoryLabel: 'Osobiste Polecenie (Social Proof)',
      marketingPitch: 'Czytelny sygnał osobistego zaufania — idealny na Instagram Stories, WhatsApp i wizytówki.',
    },
    {
      code: `OD-${genitiveFirst}`,
      slug: `od-${genitiveFirst.toLowerCase()}`,
      categoryLabel: 'Ciepła Relacja (Naturalny język polski)',
      marketingPitch: `Brzmi jak prezent od bliskiej osoby („Kod zniżkowy -10% OD-${genitiveFirst}”).`,
    },
    {
      code: `DOBRYSTART-${firstName}`,
      slug: `dobrystart-${firstName.toLowerCase()}`,
      categoryLabel: 'Dobry Początek dla Rodziców',
      marketingPitch: 'Świetnie konwertuje u par w I i II trymestrze zaczynających kompletowanie wiedzy.',
    },
  ];

  if (roleCategory === 'midwife_physio') {
    suggestions.push(
      {
        code: `GABINET-${firstName}`,
        slug: `gabinet-${firstName.toLowerCase()}`,
        categoryLabel: 'Praktyka / Edukacja Okołoporodowa (Etap 2)',
        marketingPitch: 'Idealny do przekazywania parom po wizycie, konsultacji lub zajęciach.',
      },
      {
        code: `ODDECH-${firstName}`,
        slug: `oddech-${firstName.toLowerCase()}`,
        categoryLabel: 'Przygotowanie Ciała i Oddechu (Etap 2)',
        marketingPitch: 'Nawiązuje bezpośrednio do praktycznych ćwiczeń oddechowych i pozycji porodowych.',
      }
    );
  } else if (roleCategory === 'creator_publisher') {
    suggestions.push(
      {
        code: `TULIMY-${firstName}`,
        slug: `tulimy-${firstName.toLowerCase()}`,
        categoryLabel: 'Społeczność Parentingowa (Etap 2)',
        marketingPitch: 'Ciepły, zapadający w pamięć kod do rolek Reels, TikToka i bio na Instagramie.',
      },
      {
        code: `WYPRAWKA-${firstName}`,
        slug: `wyprawka-${firstName.toLowerCase()}`,
        categoryLabel: 'Promocja Narzędzi i Checklist PDF',
        marketingPitch: 'Doskonały przy polecaniu Kalkulatora Wyprawki i listy 3 toreb do szpitala.',
      }
    );
  } else {
    suggestions.push(
      {
        code: `AKADEMIA-${firstName}`,
        slug: `akademia-${firstName.toLowerCase()}`,
        categoryLabel: 'Autorytet Akademicki (Etap 1 · Studenci)',
        marketingPitch: 'Buduje prestiż i zaufanie merytoryczne wśród przyszłych rodziców.',
      },
      {
        code: `RAZEM-${firstName}`,
        slug: `razem-${firstName.toLowerCase()}`,
        categoryLabel: 'Dla Obojga Rodziców (Mama + Tata)',
        marketingPitch: 'Podkreśla wspólne oglądanie kursu przez parę przez 18 miesięcy.',
      }
    );
  }

  // Dodatkowe warianty bezkolizyjne (z inicjałem nazwiska lub pełnym nazwiskiem zamiast losowych znaków!)
  if (lastInitial) {
    suggestions.push({
      code: `SPOKOJ-${firstName}-${lastInitial}`,
      slug: `spokoj-${firstName.toLowerCase()}-${lastInitial.toLowerCase()}`,
      categoryLabel: 'Wariant z inicjałem nazwiska',
      marketingPitch: 'Unikalny wariant imienny bez losowych cyfr.',
    });
  }
  if (lastName && lastName.length >= 3) {
    suggestions.push({
      code: `POLECA-${lastName}`,
      slug: `poleca-${lastName.toLowerCase()}`,
      categoryLabel: 'Wariant z nazwiskiem',
      marketingPitch: 'Profesjonalny kod oparty o nazwisko.',
    });
  }

  return suggestions;
}

/**
 * Sprawdza, czy kod pasuje do naszego systemu semantycznych kodów partnerskich (-10%)
 */
export function isSemanticAffiliateCodePattern(rawCode: string): boolean {
  const clean = (rawCode || '').trim().toUpperCase();
  if (!clean || clean.length < 4 || clean.length > 26) return false;
  if (clean.startsWith('MAMA-')) return false; // Kody MAMA-* należą do programu prezentowego Mam w Strefie

  if (OFFICIAL_SEMANTIC_CODES.has(clean)) return true;

  // Sprawdź czy zaczyna się od jednego z naszych prefiksów marketingowych (np. SPOKOJ-KASIA, POLECA-ANNA, OD-KASI, AKADEMIA-MAREK)
  for (const prefix of SEMANTIC_AFFILIATE_PREFIXES) {
    if (clean.startsWith(`${prefix}-`) && clean.length >= prefix.length + 3) {
      return true;
    }
  }

  // Kompatybilność wsteczna dla wcześniejszych kodów zakończonych na "10" (np. KOWALSKA10, ANNA-10)
  if (/^[A-Z0-9]{2,14}-[A-Z0-9]{2,10}10$/.test(clean) || /^[A-Z]{3,14}10$/.test(clean)) {
    return true;
  }

  return false;
}

/**
 * Generuje ciepły, ludzki kod polecający dla Mamy w Strefie Rodziców (np. MAMA-KASIA zamiast MAMA-8F2A)
 */
export function generateMotherReferralCode(fullName?: string | null, email?: string | null, fallbackIndex?: number): string {
  const { firstName, lastInitial } = extractNameTokens(fullName, email);
  const cleanFirst = firstName && firstName !== 'PARTNER' ? firstName.slice(0, 9) : 'POLECA';
  if (fallbackIndex && fallbackIndex > 1) {
    return `MAMA-${cleanFirst}${fallbackIndex}`;
  }
  if (lastInitial) {
    return `MAMA-${cleanFirst}-${lastInitial}`;
  }
  return `MAMA-${cleanFirst}`;
}
