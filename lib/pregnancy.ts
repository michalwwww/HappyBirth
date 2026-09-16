import { Lesson } from './types';
import { stages } from './course-data';

export interface PregnancyProfile {
  dueDate: string; // Format YYYY-MM-DD
  dueDateSource: 'usg' | 'om' | 'gestational_week';
  lmpDate?: string; // Data ostatniej miesiączki
  babyName?: string;
  babyGender?: 'girl' | 'boy' | 'surprise' | 'twins';
  partnerName?: string;
  parity?: 'first_baby' | 'subsequent_baby';
  plannedBirthType?: 'natural' | 'cesarean' | 'vbac' | 'undecided';
  city?: string;
  hospital?: string;
  rodoConsent: boolean;
  updatedAt?: string;
}

export interface PregnancyState {
  currentWeek: number; // np. 31
  currentDayOfWeek: number; // np. 4 (czyli 31+4 tc)
  formattedWeek: string; // "31+4 tc"
  trimester: 1 | 2 | 3 | 'postpartum';
  trimesterLabel: string;
  daysUntilDue: number;
  isPastDue: boolean;
  babyComparison: {
    fruit: string;
    weight: string;
    length: string;
    description: string;
  };
  recommendedStageSlug: string;
  recommendedStageTitle: string;
}

// Tabela rozwoju dziecka tydzień po tygodniu (wybrane kluczowe kamienie milowe)
const weeklyMilestones: Record<number, { fruit: string; weight: string; length: string; description: string }> = {
  8: { fruit: 'Malina', weight: 'ok. 1 g', length: 'ok. 1.6 cm', description: 'Tworzą się zawiązki rączek i nóżek oraz bije małe serduszko.' },
  12: { fruit: 'Śliwka', weight: 'ok. 14 g', length: 'ok. 5.4 cm', description: 'Koniec I trymestru! Narządy są już uformowane, maleństwo zaczyna ssać kciuk.' },
  16: { fruit: 'Awokado', weight: 'ok. 100 g', length: 'ok. 11.5 cm', description: 'Dziecko słyszy Twój głos i bicie Twojego serca. Reaguje na dźwięki z zewnątrz.' },
  20: { fruit: 'Banan', weight: 'ok. 300 g', length: 'ok. 25 cm', description: 'Półmetek ciąży! Zaczynasz wyraźnie odczuwać pierwsze ruchy i kopnięcia.' },
  24: { fruit: 'Kolba kukurydzy', weight: 'ok. 600 g', length: 'ok. 30 cm', description: 'Dziecko intensywnie ćwiczy mięśnie mimiczne i reaguje na dotyk brzucha.' },
  28: { fruit: 'Bakłażan', weight: 'ok. 1.0 kg', length: 'ok. 37 cm', description: 'Początek III trymestru! Otwiera powieki i ma regularny rytm snu oraz czuwania.' },
  30: { fruit: 'Kapusta pekińska', weight: 'ok. 1.3 kg', length: 'ok. 40 cm', description: 'Szpik kostny produkuje krwinki. Czas zaplanować wyprawkę i torbę do szpitala.' },
  32: { fruit: 'Dynia piżmowa', weight: 'ok. 1.8 kg', length: 'ok. 42 cm', description: 'Intensywnie gromadzi tkankę tłuszczową i ćwiczy ruchy oddechowe.' },
  34: { fruit: 'Melon kantalupa', weight: 'ok. 2.2 kg', length: 'ok. 45 cm', description: 'Płuca osiągają pełną dojrzałość. Warto rozpocząć masaż krocza olejem.' },
  36: { fruit: 'Papaja', weight: 'ok. 2.6 kg', length: 'ok. 47 cm', description: 'Dziecko powoli schodzi do kanału rodnego. Czas na wymaz GBS i spakowanie torby.' },
  37: { fruit: 'Arbuz mały', weight: 'ok. 2.9 kg', length: 'ok. 48 cm', description: 'Ciąża donoszona! Każdy dzień to gotowość na rozpoczęcie akcji porodowej.' },
  38: { fruit: 'Por', weight: 'ok. 3.1 kg', length: 'ok. 49 cm', description: 'Obejrzyjcie z partnerem moduł o pozycjach porodowych i skurczach 5-1-1.' },
  39: { fruit: 'Arbuz', weight: 'ok. 3.3 kg', length: 'ok. 50 cm', description: 'Wszystkie zmysły są gotowe na spotkanie z Tobą. Zadbaj o głęboki relaks.' },
  40: { fruit: 'Dojrzała dynia', weight: 'ok. 3.5 kg', length: 'ok. 51 cm', description: 'Termin porodu! Pamiętaj, że tylko 5% dzieci rodzi się dokładnie w wyznaczonym dniu.' }
};

/**
 * Oblicza termin porodu z daty ostatniej miesiączki wg Reguły Naegelego (LMP + 280 dni)
 */
export function calculateDueDateFromLMP(lmpDateString: string): string {
  const lmp = new Date(lmpDateString);
  if (isNaN(lmp.getTime())) return '';
  const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  return due.toISOString().split('T')[0];
}

/**
 * Oblicza termin porodu na podstawie zadeklarowanego tygodnia ciąży (40 - tydzień)
 */
export function calculateDueDateFromWeek(currentWeek: number): string {
  const weeksLeft = Math.max(0, 40 - currentWeek);
  const now = new Date();
  const due = new Date(now.getTime() + weeksLeft * 7 * 24 * 60 * 60 * 1000);
  return due.toISOString().split('T')[0];
}

/**
 * Oblicza bieżący stan ciąży, trymestr, dni do porodu i kamień milowy
 */
export function calculatePregnancyState(dueDateString: string): PregnancyState {
  const now = new Date();
  // Zerowanie godzin do dokładnego porównania dni
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDateString);
  const targetDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.round((targetDate.getTime() - today.getTime()) / msPerDay);
  
  // Wiek ciążowy: 280 dni (40 tc) - dni pozostałe do porodu
  const gestationalDays = Math.max(0, 280 - daysUntilDue);
  const currentWeek = Math.floor(gestationalDays / 7);
  const currentDayOfWeek = gestationalDays % 7;

  let trimester: 1 | 2 | 3 | 'postpartum';
  let trimesterLabel = '';
  let recommendedStageSlug = 'torba-spakowana';
  let recommendedStageTitle = 'Wyprawka i torba do szpitala';

  if (daysUntilDue < -14) {
    trimester = 'postpartum';
    trimesterLabel = 'Połóg i Noworodek';
    recommendedStageSlug = 'pierwsza-noc';
    recommendedStageTitle = 'Połóg – regeneracja i opieka';
  } else if (currentWeek < 14) {
    trimester = 1;
    trimesterLabel = 'I Trymestr';
    recommendedStageSlug = 'dwie-kreski';
    recommendedStageTitle = 'Dwie kreski – fundament ciąży';
  } else if (currentWeek < 28) {
    trimester = 2;
    trimesterLabel = 'II Trymestr';
    recommendedStageSlug = 'wreszcie-lepiej';
    recommendedStageTitle = 'Wreszcie lepiej – profilaktyka i ruch';
  } else if (currentWeek < 37) {
    trimester = 3;
    trimesterLabel = 'III Trymestr';
    recommendedStageSlug = 'torba-spakowana';
    recommendedStageTitle = 'Wyprawka, torba i przygotowanie do porodu';
  } else {
    trimester = 3;
    trimesterLabel = 'III Trymestr (Tuż przed porodem)';
    recommendedStageSlug = 'zaczelo-sie';
    recommendedStageTitle = 'Zaczęło się – akcja porodowa i oddech';
  }

  // Dobór najbliższego opisu kamienia milowego
  const availableWeeks = Object.keys(weeklyMilestones).map(Number).sort((a, b) => a - b);
  let closestWeek = availableWeeks[0];
  for (const w of availableWeeks) {
    if (w <= currentWeek) {
      closestWeek = w;
    }
  }
  const milestone = weeklyMilestones[closestWeek] || weeklyMilestones[40];

  return {
    currentWeek,
    currentDayOfWeek,
    formattedWeek: `${currentWeek}+${currentDayOfWeek} tc`,
    trimester,
    trimesterLabel,
    daysUntilDue,
    isPastDue: daysUntilDue < 0,
    babyComparison: milestone,
    recommendedStageSlug,
    recommendedStageTitle
  };
}

/**
 * Dobiera rekomendowane lekcje z bazy 52 wideo na podstawie tygodnia ciąży
 */
export function getRecommendedLessonsForWeek(state: PregnancyState, allLessons: Lesson[]): Lesson[] {
  if (state.trimester === 'postpartum') {
    return allLessons.filter(l => l.stageId === 'stage-07' || l.stageId === 'stage-08' || l.stageId === 'stage-09').slice(0, 3);
  }

  if (state.currentWeek >= 37) {
    // Tuż przed porodem: skurcze, wody, znieczulenie, partner
    return allLessons.filter(l => l.stageId === 'stage-05' || l.stageId === 'stage-06').slice(0, 3);
  }

  if (state.currentWeek >= 28) {
    // III trymestr: torba, krocze, przygotowanie
    return allLessons.filter(l => l.stageId === 'stage-04' || l.stageId === 'stage-05').slice(0, 3);
  }

  if (state.currentWeek >= 14) {
    // II trymestr: badania, dno miednicy, sen
    return allLessons.filter(l => l.stageId === 'stage-03').slice(0, 3);
  }

  // I trymestr
  return allLessons.filter(l => l.stageId === 'stage-02' || l.stageId === 'stage-01').slice(0, 3);
}

// Stała dla klucza w LocalStorage
const STORAGE_KEY = 'hb_pregnancy_profile';

/**
 * Pobiera zapisany profil ciąży z LocalStorage (zabezpieczone przed SSR)
 */
export function getSavedPregnancyProfile(): PregnancyProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PregnancyProfile;
  } catch {
    return null;
  }
}

/**
 * Zapisuje profil ciąży w LocalStorage
 */
export function savePregnancyProfile(profile: PregnancyProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    // Opcjonalna cicha synchronizacja z Cloudflare D1, jeśli sesja jest aktywna
    fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch(() => {});
  } catch (err) {
    console.error('Błąd zapisu profilu ciąży w localStorage:', err);
  }
}

/**
 * Czyści profil ciąży
 */
export function clearPregnancyProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Błąd usuwania profilu ciąży:', err);
  }
}
