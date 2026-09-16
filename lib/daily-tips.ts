export interface DailyTip {
  id: string;
  category: 'porod' | 'tata' | 'polog' | 'karmienie' | 'maluszek';
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  shortDesc: string;
  lessonId?: string;
  lessonTitle?: string;
  authorNote?: string;
}

export const HAPPYBIRTH_DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip-01',
    category: 'tata',
    categoryLabel: 'Patent dla Taty',
    categoryColor: '#98269C',
    categoryBg: '#EAD5E5',
    title: 'Bidon z rurką i małe łyki co 20 minut',
    shortDesc: 'Mama ma być skupiona na swoim ciele i oddechu. Nie pytaj jej „chcesz pić?”, tylko po prostu delikatnie podsuwaj bidon ze słomką co 20 minut. Wolne ręce i stałe nawodnienie to potężne źródło energii.',
    lessonId: 'lekcja-24',
    lessonTitle: 'Lekcja 24: Rola taty i partnera',
    authorNote: 'Ulubiony patent naszych ojców',
  },
  {
    id: 'tip-02',
    category: 'porod',
    categoryLabel: 'Świadomy Poród',
    categoryColor: '#EC008C',
    categoryBg: '#FAE3EB',
    title: 'Zasada luźnych ust i dźwięcznego wydechu',
    shortDesc: 'Napięcie w ciele zaczyna się od zaciśniętych zębów. Kiedy rozluźniasz usta i wydychasz powietrze długim, spokojnym „ssss” lub „aaaa”, całe ciało automatycznie opada z napięcia i miękko współpracuje.',
    lessonId: 'lekcja-21',
    lessonTitle: 'Lekcja 21: Świadomy oddech w ruchu',
    authorNote: 'Złoty patent na spokój',
  },
  {
    id: 'tip-03',
    category: 'polog',
    categoryLabel: 'Czuły Połóg',
    categoryColor: '#F57B14',
    categoryBg: '#FAE3CE',
    title: 'Zasada 5 dni w łóżku dla świeżo upieczonej mamy',
    shortDesc: 'Pierwszy tydzień w domu to czas regeneracji, tulenia skóra do skóry i poznawania malucha. Zero sprzątania, zero gotowania i zero wizyt gości. Partner przejmuje logistykę, mama odpoczywa.',
    lessonId: 'lekcja-36',
    lessonTitle: 'Lekcja 36: Czuły połóg i regeneracja',
    authorNote: 'Ochrona spokoju rodziny',
  },
  {
    id: 'tip-04',
    category: 'karmienie',
    categoryLabel: 'Czułe Karmienie',
    categoryColor: '#0088BC',
    categoryBg: '#D0EBF3',
    title: 'Zanim przystawisz malucha – podeprzyj swoje plecy',
    shortDesc: 'Nigdy nie pochylaj się do dziecka. Przysuń maluszka do siebie na wysokość piersi lub butelki, używając poduszki. Wygodne oparcie dla Twoich stóp i ramion to gwarancja relaksu bez bólu karku.',
    lessonId: 'lekcja-41',
    lessonTitle: 'Lekcja 41: Wygodne pozycje do karmienia',
    authorNote: 'Komfort dla mamy i dziecka',
  },
  {
    id: 'tip-05',
    category: 'maluszek',
    categoryLabel: 'Spokój Maluszka',
    categoryColor: '#347A22',
    categoryBg: '#DFEED4',
    title: 'Chwyt na przedramieniu na wieczorny niepokój',
    shortDesc: 'Kiedy maluszek pręży się i marudzi o zmierzchu, ułóż go brzuszkiem na swoim przedramieniu, z główką bezpiecznie opartą w łokciu. Ciepło Twojej dłoni i delikatne kołysanie przynoszą ulgę w kilka chwil.',
    lessonId: 'lekcja-47',
    lessonTitle: 'Lekcja 47: Wieczorne rytuały i usypianie',
    authorNote: 'Sprawdzony sposób na spokojny sen',
  },
  {
    id: 'tip-06',
    category: 'tata',
    categoryLabel: 'Patent dla Taty',
    categoryColor: '#98269C',
    categoryBg: '#EAD5E5',
    title: 'Magiczne zdanie: „Jestem z Tobą, świetnie sobie radzisz”',
    shortDesc: 'W chwilach zwątpienia mama nie potrzebuje skomplikowanych rad. Potrzebuje Twojego spokojnego spojrzenia, ciepłej dłoni i pewnego głosu: „Oddycham z Tobą, dasz radę, jestem obok”. To daje niesamowitą siłę.',
    lessonId: 'lekcja-25',
    lessonTitle: 'Lekcja 25: Wsparcie emocjonalne mamy',
    authorNote: 'Kotwica bezpieczeństwa',
  },
  {
    id: 'tip-07',
    category: 'porod',
    categoryLabel: 'Sprytna Wyprawka',
    categoryColor: '#EC008C',
    categoryBg: '#FAE3EB',
    title: 'Zasada 3 toreb: nie bierz wszystkiego na raz',
    shortDesc: 'Spakuj małą torbę podręczną na pierwsze godziny, osobną walizkę na pobyt w sali poporodowej i zostaw w domu ubranka na wyjście. Tata przyniesie je w dniu powrotu – zero dźwigania i zero bałaganu.',
    lessonId: 'lekcja-17',
    lessonTitle: 'Lekcja 17: Logistyka i sprytna wyprawka',
    authorNote: 'Porządek i zero stresu',
  },
];

export function getTodayTip(): DailyTip {
  if (typeof window === 'undefined') return HAPPYBIRTH_DAILY_TIPS[0];
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return HAPPYBIRTH_DAILY_TIPS[dayOfYear % HAPPYBIRTH_DAILY_TIPS.length];
}

export function getRandomTip(excludeId?: string): DailyTip {
  const filtered = HAPPYBIRTH_DAILY_TIPS.filter((t) => t.id !== excludeId);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
