/**
 * Copy strony głównej HAPPYBIRTH. Jedno miejsce do redakcji tekstów.
 *
 * Zasady (paczka marki, 01-marka.md i 03-brief-strony.md):
 *  - druga osoba, zdania krótkie, konkret przed kontekstem
 *  - każde zdanie mówi, co jest albo co zrobić
 *  - zero myślników, dywizów i pauz w widocznym tekście; zakres słowem ("tydzień 1 do 14")
 *  - zero zdrobnień w treści merytorycznej, zero straszenia
 *  - nigdy obietnica przebiegu porodu. Życzenie dotyczy dziecka, nie dnia
 *  - żart jest w nazwie, treść jest poważna
 */

export const PRICE = 349;
export const PRICE_LABEL = '349 zł';

export const nav = {
  links: [
    { label: 'Etapy', href: '/#etapy' },
    { label: 'Jak to działa', href: '/#jak' },
    { label: 'Narzędzia', href: '/#narzedzia' },
    { label: 'Cena', href: '/#cena' },
    { label: 'FAQ', href: '/#faq' },
  ],
  login: 'Strefa rodziców',
  cta: `Dołącz · ${PRICE_LABEL}`,
};

export const hero = {
  eyebrow: 'Szkoła rodzenia online · 52 lekcje wideo · dla dwojga',
  titleStart: 'Poród nie jest',
  titleAccent: 'niespodzianką.',
  lead:
    'Szkoła rodzenia online, która pokazuje ci dokładnie ten etap, w którym jesteś. Od dwóch kresek do pierwszych urodzin, w krótkich lekcjach wideo. Dla ciebie i dla osoby, która będzie z tobą na sali.',
  ctaPrimary: `Dołącz za ${PRICE_LABEL}`,
  ctaSecondary: 'Obejrzyj lekcję 1 za darmo',
  note: 'Płacisz raz. Dostęp masz 12 miesięcy od terminu porodu, dla dwojga.',
};

export const calculator = {
  eyebrow: 'Twój etap',
  titleStart: 'Który to',
  titleAccent: 'tydzień?',
  help: 'Podaj termin porodu. Pokażemy ci, gdzie jesteś na drodze i które lekcje są teraz twoje.',
  labelDue: 'Termin porodu',
  labelLmp: 'Data ostatniej miesiączki',
  toggleToLmp: 'Znam tylko datę ostatniej miesiączki',
  toggleToDue: 'Znam termin porodu',
  footnote: 'Termin zostaje w twojej przeglądarce. Nic nie wysyłamy.',
  cta: 'Zobacz lekcje etapu',
  pastDue: 'Dziecko jest już z tobą. Zobacz lekcje o połogu, karmieniu i pierwszym roku.',
  empty: 'Bez terminu pokazujemy całą drogę. Dziewięć etapów, każdy ma swój kolor.',
};

export const proof = [
  { value: '18 000+', label: 'mam i ojców przygotowanych do porodu' },
  { value: '52', label: 'lekcje wideo w dziewięciu etapach' },
  { value: '12', label: 'miesięcy dostępu od terminu porodu' },
  { value: '2', label: 'osoby w jednej cenie, 349 zł' },
];

export const stagesSection = {
  eyebrow: 'Program kursu',
  titleStart: 'Każdy etap ma swój',
  titleAccent: 'kolor.',
  lead: 'Dziewięć etapów, od starania się o dziecko do pierwszych urodzin. Wybierz swój i zobacz, co jest w środku.',
  soon: 'lekcje wkrótce',
  freeBadge: 'jedna lekcja za darmo',
  panelCta: `Dołącz i obejrzyj · ${PRICE_LABEL}`,
  panelClose: 'Zwiń',
};

export const how = {
  eyebrow: 'Jak to działa',
  titleStart: 'Tydzień po tygodniu, nie wszystko',
  titleAccent: 'naraz.',
  steps: [
    {
      nr: '01',
      title: 'Podajesz termin porodu.',
      text: 'Kurs liczy twój tydzień i podpowiada etap. Nie musisz zgadywać, od czego zacząć.',
    },
    {
      nr: '02',
      title: 'Oglądasz swój etap.',
      text: 'Większość lekcji trwa od 3 do 8 minut. Da się je obejrzeć w poczekalni i o trzeciej w nocy.',
    },
    {
      nr: '03',
      title: 'Wracasz, kiedy trzeba.',
      text: 'Dostęp trwa 12 miesięcy od terminu porodu. Połóg, karmienie i pierwszy rok są w środku, nie za dopłatą.',
    },
  ],
  partner: {
    eyebrow: 'Dla partnera',
    title: 'Tata ma swoją strefę.',
    text: 'Co robić na sali porodowej, jak masować krzyż, co spakować i jak pomóc w pierwszych tygodniach w domu. Krótko i konkretnie.',
  },
};

export const who = {
  eyebrow: 'Kto za tym stoi',
  titleStart: 'Wiedza od położnych, nie z',
  titleAccent: 'forum.',
  text:
    'HAPPYBIRTH powstał na bazie 14 lat praktyki Szkoły Rodzenia Mama Gaja, prowadzonej od 2012 roku, i doświadczenia ponad 18 000 mam i par. Lekcje są zgodne ze Standardem Opieki Okołoporodowej. Tam, gdzie zdania są podzielone, mówimy to wprost.',
  points: [
    'Zgodność ze Standardem Opieki Okołoporodowej',
    'Szkoła stacjonarna działa od 2012 roku, w Poznaniu i Wrocławiu',
    'Materiały mają charakter edukacyjny. Nie zastępują opieki lekarza i położnej',
  ],
  link: 'Zobacz standard merytoryczny',
};

export const tools = {
  eyebrow: 'Narzędzia',
  titleStart: 'Na dzień i na',
  titleAccent: 'noc.',
  lead: 'Rzeczy, do których wracasz w telefonie, także w drodze do szpitala.',
  items: [
    {
      stage: 'boli',
      title: 'Kreator planu porodu',
      text: 'Odpowiadasz na kilka pytań i dostajesz dokument zgodny ze standardem, gotowy do wydruku i zabrania na izbę przyjęć.',
      path: '/plan-porodu',
    },
    {
      stage: 'karmienie',
      title: 'Cyfrowa apteczka',
      text: 'Wpisujesz, co cię boli albo niepokoi, i dostajesz konkretną lekcję. Bez przeszukiwania godzin nagrań.',
      path: '/apteczka',
    },
    {
      stage: 'planb',
      title: 'Strefa dla taty',
      text: 'Krótkie ściągi na salę porodową i pierwsze tygodnie w domu. Masaż, pozycje, torba, zadania.',
      path: '/partner',
    },
  ],
  tip: {
    eyebrow: 'Patent dnia',
    title: 'Jeden konkret z 52 lekcji.',
    text: 'Codziennie inny. Wylosuj kolejny albo przejdź do lekcji, z której pochodzi.',
  },
};

export const comparison = {
  eyebrow: 'Stacjonarnie czy online',
  titleStart: 'Szkoła stacjonarna czy',
  titleAccent: 'online?',
  head: ['', 'Szkoła stacjonarna', 'HAPPYBIRTH online'],
  rows: [
    ['Format', 'Wykłady w sali, dojazd po pracy', 'Krótkie lekcje wideo w telefonie albo na telewizorze'],
    ['Partner', 'Zwykle siedzi z boku', 'Ma własną strefę i konkretne zadania'],
    ['Po porodzie', 'Kurs kończy się przed porodem', 'Dostęp trwa 12 miesięcy od terminu, także w połogu'],
    ['Materiały', 'Zeszyt z notatkami', 'Plan porodu PDF, cyfrowa apteczka, ściągi dla taty'],
    ['Ton', 'Presja i gotowe dogmaty', 'Konkret, bez oceniania twoich wyborów'],
  ],
};

export const testimonials = {
  eyebrow: 'Co mówią rodzice',
  titleStart: 'Głosy po',
  titleAccent: 'porodzie.',
  items: [
    {
      quote:
        'Największa wartość to spokój mojego męża. Nie stał bezradnie. Dokładnie wiedział, jak masować plecy i jak wspierać mnie oddechem.',
      author: 'Katarzyna i Michał',
      meta: 'córka Pola, Wrocław',
    },
    {
      quote:
        'Lekcje o pierwszych dobach w domu uratowały nasz spokój. O 2:30 w nocy po prostu włączyliśmy wideo z telefonu. Zero paniki, same konkrety.',
      author: 'Aleksandra i Tomasz',
      meta: 'syn Leon, Poznań',
    },
    {
      quote:
        'Obejrzeliśmy cały kurs wieczorami przy herbacie. Piękne ujęcia, ciepły język i zero akademickiego żargonu.',
      author: 'Magdalena i Piotr',
      meta: 'bliźniaki Jan i Tymon, Kraków',
    },
  ],
};

export const pricing = {
  eyebrow: 'Cena',
  titleStart: 'Jedna cena. Dwoje',
  titleAccent: 'rodziców.',
  price: PRICE_LABEL,
  priceNote: 'płatność jednorazowa, bez subskrypcji',
  includes: [
    '52 lekcje wideo w 9 etapach',
    'Dostęp 12 miesięcy od terminu porodu',
    'Konto dla ciebie i dla partnera',
    'Kreator planu porodu i cyfrowa apteczka',
    'Strefa dla taty',
    'Certyfikat ukończenia kursu',
  ],
  cta: `Kup dostęp za ${PRICE_LABEL}`,
  payment: 'BLIK, karta lub Przelewy24. Płatność obsługuje Stripe. Dostęp aktywuje się od razu, link przychodzi na twój e-mail.',
  legal:
    'HAPPYBIRTH to kurs edukacyjny. Materiały mają charakter edukacyjny i nie zastępują konsultacji z lekarzem ani położną.',
  legalLink: 'Regulamin',
};

export const faq = {
  eyebrow: 'Pytania',
  titleStart: 'Pytania, które słyszymy',
  titleAccent: 'najczęściej.',
  items: [
    {
      q: 'Kiedy najlepiej dołączyć?',
      a: 'Większość rodziców dołącza między 16 a 28 tygodniem ciąży. Dostęp trwa 12 miesięcy od terminu porodu, więc lekcje o połogu i pierwszym roku czekają na ciebie po porodzie.',
    },
    {
      q: 'Czy partner potrzebuje osobnego konta?',
      a: 'Nie. Dostęp jest dla dwojga w jednej cenie. Partner loguje się na swoim telefonie i ma własną strefę.',
    },
    {
      q: 'Co, jeśli poród pójdzie inaczej, niż planujemy?',
      a: 'Etap Plan B pokazuje cięcie cesarskie, znieczulenie i sytuacje nieplanowane. Wiesz, co się dzieje i o co pytać. Bez straszenia i bez obietnic, jak przebiegnie twój poród.',
    },
    {
      q: 'Karmimy butelką. Czy kurs jest dla nas?',
      a: 'Tak. Pokazujemy karmienie piersią i butelką. Nie ma tu jednego właściwego sposobu ani oceniania.',
    },
    {
      q: 'Jak szybko dostaniemy dostęp?',
      a: 'Od razu. Po opłaceniu przez BLIK, kartę lub Przelewy24 konto aktywuje się automatycznie, a link do Strefy przychodzi na e-mail.',
    },
    {
      q: 'Czy kurs zastępuje wizyty u lekarza?',
      a: 'Nie. HAPPYBIRTH to kurs edukacyjny. Nie diagnozujemy i nie prowadzimy konsultacji. W sytuacjach alarmowych kontaktuj się z lekarzem, położną albo izbą przyjęć.',
    },
  ],
};

export const footer = {
  closing: 'Dobrze, że jesteś.',
  columns: [
    {
      title: 'Kurs',
      links: [
        { label: 'Etapy', href: '/#etapy' },
        { label: 'Jak to działa', href: '/#jak' },
        { label: 'Narzędzia', href: '/#narzedzia' },
        { label: 'Cena', href: '/#cena' },
        { label: 'FAQ', href: '/#faq' },
      ],
    },
    {
      title: 'Dla profesjonalistów',
      links: [
        { label: 'Program partnerski', href: 'partnerzy' },
        { label: 'Standard merytoryczny', href: 'strefa:/standard-medyczny' },
      ],
    },
    {
      title: 'Kontakt',
      links: [
        { label: 'kontakt@happybirth.pl', href: 'mailto:kontakt@happybirth.pl' },
        { label: 'Instagram', href: 'https://instagram.com/happybirth.pl' },
        { label: 'TikTok', href: 'https://tiktok.com/@happybirth_pl' },
      ],
    },
  ],
  disclaimer:
    'HAPPYBIRTH to internetowy kurs przygotowania do porodu i rodzicielstwa. Materiały mają charakter edukacyjny. Nie zastępują świadczeń zdrowotnych, diagnostyki ani porady lekarskiej.',
  company: 'Usługodawca: KLARSolutions sp. z o.o. (w organizacji), ul. Śląska 14, 60-614 Poznań',
  legal: [
    { label: 'Regulamin', href: '/regulamin' },
    { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
  ],
};
