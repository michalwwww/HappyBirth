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
    category: 'porod',
    categoryLabel: 'Sprytny Poród',
    categoryColor: '#EC008C',
    categoryBg: '#FAE3EB',
    title: 'Zasada luźnej żuchwy a szyjka macicy',
    shortDesc: 'Mięśnie żuchwy i mięśnie dna miednicy są ze sobą połączone powięziowo. Kiedy zaciskasz zęby, blokujesz szyjkę macicy. Luźne usta, wydmuchiwanie powietrza „na świeczkę” i dźwięczne „aaaa” przyspieszają rozwieranie o kilkadziesiąt minut.',
    lessonId: 'lekcja-21',
    lessonTitle: 'Lekcja 21: Aktywny oddech porodowy',
    authorNote: 'Złota zasada z sali porodowej',
  },
  {
    id: 'tip-02',
    category: 'tata',
    categoryLabel: 'Patent dla Taty',
    categoryColor: '#98269C',
    categoryBg: '#EAD5E5',
    title: 'Trik z piłeczką tenisową w trakcie skurczu',
    shortDesc: 'Nie używaj kciuków do masażu krzyżowego, bo po 15 minutach opadniesz z sił. Weź do torby twardą piłeczkę tenisową lub do lacrosse. Dociskaj ją nasadą dłoni w dołki biodrowe mamy podczas każdego skurczu – ulga jest natychmiastowa.',
    lessonId: 'lekcja-24',
    lessonTitle: 'Lekcja 24: Masaż krzyżowy dla partnera',
    authorNote: 'Ulubiony patent naszych ojców',
  },
  {
    id: 'tip-03',
    category: 'polog',
    categoryLabel: 'Czuły Połóg',
    categoryColor: '#F57B14',
    categoryBg: '#FAE3CE',
    title: 'Mrożone kompresy z naparem z kory dębu',
    shortDesc: 'Przed terminem porodu zaparz mocny napar z kory dębu (lub rumianku). Skrop nim czyste podkłady poporodowe i zamroź w woreczkach. W pierwszych 48h po porodzie taki chłodny kompres działa przeciwobrzękowo i przynosi natychmiastowe ukojenie.',
    lessonId: 'lekcja-36',
    lessonTitle: 'Lekcja 36: Regeneracja krocza w pierwszych dobach',
    authorNote: 'Domowy kompres ratunkowy',
  },
  {
    id: 'tip-04',
    category: 'karmienie',
    categoryLabel: 'Karmienie bez łez',
    categoryColor: '#0088BC',
    categoryBg: '#D0EBF3',
    title: 'Asymetryczny chwyt: celuj brodawką w nos',
    shortDesc: 'Nie wkładaj brodawki prosto do buzi dziecka. Skieruj ją w stronę jego noska. Maluch odchyli główkę w tył, szeroko otworzy usta jak do ziewnięcia i zassie pierś od dołu z dużą częścią otoczki. Zero bólu i popękanych brodawek.',
    lessonId: 'lekcja-41',
    lessonTitle: 'Lekcja 41: Mechanizm prawidłowego przystawienia',
    authorNote: 'Sekret bezbolesnej laktacji',
  },
  {
    id: 'tip-05',
    category: 'maluszek',
    categoryLabel: 'Spokój Maluszka',
    categoryColor: '#347A22',
    categoryBg: '#DFEED4',
    title: 'Pozycja „na leniwca” przy wieczornym niepokoju',
    shortDesc: 'Gdy maluszek pręży się wieczorem, połóż go brzuszkiem na swoim przedramieniu, z główką bezpiecznie opartą w zgięciu Twojego łokcia. Ciepło Twojego ciała i delikatny ucisk brzuszka rozluźniają gazy w jelitach w kilka minut.',
    lessonId: 'lekcja-47',
    lessonTitle: 'Lekcja 47: Spokojny wieczór i usypianie noworodka',
    authorNote: 'Ratunek przy kolkach o 20:00',
  },
  {
    id: 'tip-06',
    category: 'porod',
    categoryLabel: 'Sprytny Poród',
    categoryColor: '#EC008C',
    categoryBg: '#FAE3EB',
    title: 'Woda i prysznic – naturalne znieczulenie',
    shortDesc: 'Ciepły strumień prysznica skierowany na odcinek lędźwiowy lub dół brzucha potrafi obniżyć odczuwanie skurczu o 40%. Woda stymuluje wydzielanie endorfin i działa rozkurczająco na mięśnie dna miednicy.',
    lessonId: 'lekcja-22',
    lessonTitle: 'Lekcja 22: Hydroterapia i woda na porodówce',
    authorNote: 'Niefarmakologiczna ulga',
  },
  {
    id: 'tip-07',
    category: 'tata',
    categoryLabel: 'Patent dla Taty',
    categoryColor: '#98269C',
    categoryBg: '#EAD5E5',
    title: 'Rola strażnika spokoju na izbie przyjęć',
    shortDesc: 'Na izbie przyjęć mama ma prawo być skupiona na swoim ciele. To Twoja rola: trzymaj teczkę z badaniami (GBS, grupa krwi, karta ciąży) na samej górze torby, odpowiadaj na pytania formalne i pilnuj realizacji Waszego Planu Porodu.',
    lessonId: 'lekcja-18',
    lessonTitle: 'Lekcja 18: Przyjęcie do szpitala krok po kroku',
    authorNote: 'Zadanie specjalne dla partnera',
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
