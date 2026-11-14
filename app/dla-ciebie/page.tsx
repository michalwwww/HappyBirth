import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Scale,
  BookOpen,
  FileText,
  Luggage,
  Play,
  Award,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Users,
  Info,
  Calculator,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import {
  DlaCiebieExplorer,
  type KnowledgeEntry,
} from '@/components/dla-ciebie-explorer';

export const metadata: Metadata = {
  title: 'Wiedza dla Rodziców: Prawa i Standard Organizacyjny 2026 · HappyBirth.pl',
  description:
    'Kompendium edukacyjno-prawne i baza 33 haseł dla przyszłych rodziców i bliskich: 21 praw ze Standardu Organizacyjnego Opieki Okołoporodowej (od 7 maja 2026 r., Dz.U. 2025 poz. 1525) oraz 12 haseł praktycznych ze stemplami weryfikacji (FAKT, MIT, SPÓR, NIE WIADOMO).',
  category: 'education',
  alternates: {
    canonical: 'https://happybirth.pl/dla-ciebie',
  },
  openGraph: {
    title: 'Wiedza dla Rodziców: Prawa i Standard Organizacyjny 2026 · HappyBirth.pl',
    description:
      '33 hasła dla rodziców i bliskich: 21 praw ze Standardu 2026 oraz 12 haseł praktycznych ze stemplami wiedzy (FAKT, MIT, SPÓR, NIE WIADOMO).',
    url: 'https://happybirth.pl/dla-ciebie',
    siteName: 'HappyBirth Edukacja Online',
    locale: 'pl_PL',
    type: 'article',
  },
  other: {
    classification: 'Education, Consumer & Patient Rights, Parenting Preparation (PKD 85.59.B)',
    'content-nature': 'Non-clinical Educational & Legal Reference Guide',
  },
};

const CATEGORIES: string[] = [
  'Prawa pacjentki',
  'Ciąża i badania',
  'Edukacja przedporodowa',
  'Plan porodu',
  'Poród',
  'Noworodek',
  'Karmienie',
  'Połóg',
  'Dostępność',
  'Ruch, forma i żywienie',
  'Urlopy i zasiłki 2026',
  'Ściąga dla dziadków',
];

const ISAP_STANDARD_2018 = 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20180001756';
const ISAP_NOWELIZACJA_2025 = 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001525';
const ISAP_USTAWA_PP = 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20090520417';

const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'informacja-i-swiadoma-zgoda',
    number: 1,
    category: 'Prawa pacjentki',
    title: 'Zrozumiała informacja i świadoma zgoda przed każdym działaniem',
    summary:
      'Masz ustawowe prawo wiedzieć, co jest proponowane, w jakim celu i jakie są alternatywne możliwości. Każde badanie i czynność w szpitalu wymaga Twojej uprzedniej, świadomej zgody albo może spotkać się z Twoją odmową.',
    practicalTip:
      'Gdy w sali pada niezrozumiały skrót lub propozycja, osoba towarzysząca może spokojnie zapytać: „Czy możemy prosić o krótkie wyjaśnienie, czemu służy to działanie i czy mamy czas na podjęcie decyzji?”.',
    legalAct: 'Ustawa o prawach pacjenta (Dz.U. 2009 nr 52 poz. 417) oraz Standard Organizacyjny',
    legalSection: 'Art. 9 i Art. 16 ustawy · Część II i V standardu',
    legalParaphrase:
      'Zgodnie z art. 9 i art. 16 Ustawy o prawach pacjenta oraz Częścią II Standardu, osoba sprawująca opiekę ma obowiązek przekazać przystępną informację o stanie organizacyjnym, proponowanych czynnościach oraz dających się przewidzieć następstwach, a następnie uzyskać świadomą zgodę przed podjęciem działania.',
    isapUrl: ISAP_USTAWA_PP,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 28, publicTitle: 'Rodzaje porodów: poród naturalny i przygotowanie na każdy scenariusz' },
    ],
  },
  {
    id: 'poszanowanie-intymnosci-i-godnosci',
    number: 2,
    category: 'Prawa pacjentki',
    title: 'Poszanowanie intymności, godności i zgoda na obecność osób uczących się',
    summary:
      'Podczas każdego spotkania, badania oraz na sali porodowej przysługuje Ci pełna ochrona prywatności. Obecność osób trzecich (np. studentów kierunków akademickich) wymaga Twojej wyraźnej zgody, którą możesz w każdej chwili wycofać.',
    practicalTip:
      'Wpiszcie w swoim Planie Porodu prośbę o ograniczenie liczby osób wchodzących do sali do niezbędnego personelu sprawującego bezpośrednią opiekę oraz o przygaszone światło.',
    legalAct: 'Ustawa o prawach pacjenta (Dz.U. 2009 nr 52 poz. 417)',
    legalSection: 'Art. 20 i Art. 22 ust. 2',
    legalParaphrase:
      'Art. 20 gwarantuje poszanowanie intymności i godności w czasie udzielania świadczeń. Zgodnie z art. 22 ust. 2 obecność osób innych niż personel niezbędny do realizacji świadczenia wymaga uprzedniej zgody osoby uprawnionej.',
    isapUrl: ISAP_USTAWA_PP,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
    ],
  },
  {
    id: 'obecnosc-osoby-bliskiej',
    number: 3,
    category: 'Prawa pacjentki',
    title: 'Obecność wybranej osoby bliskiej podczas porodu i pobytu w szpitalu',
    summary:
      'Masz prawo, aby towarzyszyła Ci wybrana przez Ciebie osoba bliska — mąż, partner, mama, siostra lub przyjaciółka. Nie trzeba pozostawać w formalnym związku, a za samą obecność osoby bliskiej przy porodzie rodzinnym szpital nie pobiera opłat.',
    practicalTip:
      'Przygotujcie dla osoby towarzyszącej wygodne ubranie na zmianę, obuwie zmienne, wodę i przekąski w pierwszej strefie torby do szpitala, aby mogła aktywnie wspierać Cię przez cały czas.',
    legalAct: 'Ustawa o prawach pacjenta oraz Standard Organizacyjny',
    legalSection: 'Art. 21 ustawy · Część II i V standardu',
    legalParaphrase:
      'Art. 21 Ustawy o prawach pacjenta oraz Część V Standardu potwierdzają prawo do obecności osoby bliskiej wskazanej przez rodzącą na każdym etapie porodu w warunkach zapewniających poszanowanie prywatności.',
    isapUrl: ISAP_USTAWA_PP,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
      { num: 32, publicTitle: 'Magia chusty Rebozo – techniki odciążania brzucha i pleców z partnerem' },
    ],
  },
  {
    id: 'rzecznik-praw-pacjenta-infolinia',
    number: 4,
    category: 'Prawa pacjentki',
    title: 'Gdzie uzyskać wsparcie prawne: bezpłatna infolinia 800 190 590',
    summary:
      'W razie pytań o zakres swoich praw organizacyjnych lub wątpliwości podczas pobytu w placówce możecie skorzystać z bezpłatnej Telefonicznej Informacji Pacjenta prowadzonej przez Rzecznika Praw Pacjenta wraz z Narodowym Funduszem Zdrowia.',
    practicalTip:
      'Zapiszcie numer 800 190 590 w telefonie osoby towarzyszącej jeszcze przed spakowaniem torby — daje to ogromne poczucie bezpieczeństwa formalnego.',
    legalAct: 'Ustawa o prawach pacjenta i Rzeczniku Praw Pacjenta',
    legalSection: 'Rozdział 11–12 · Infolinia RPP 800 190 590',
    legalParaphrase:
      'Rzecznik Praw Pacjenta jest centralnym organem administracji rządowej właściwym w sprawach ochrony praw określonych w ustawie oraz standardach organizacyjnych. Bezpłatna linia 800 190 590 zapewnia informację prawną i organizacyjną.',
    isapUrl: ISAP_USTAWA_PP,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
    ],
  },
  {
    id: 'wybor-osoby-prowadzacej-ciaze',
    number: 5,
    category: 'Ciąża i badania',
    title: 'Prowadzenie ciąży i harmonogram badań: przejrzysty kalendarz',
    summary:
      'Standard określa uporządkowany kalendarz wizyt i badań profilaktycznych w poszczególnych tygodniach ciąży. Przy prawidłowym przebiegu ciąży masz prawo do pełnej informacji o harmonogramie spotkań oraz o wyborze placówki i osoby sprawującej opiekę.',
    practicalTip:
      'Załóżcie jedną teczkę na dokumenty i wyniki badań w porządku chronologicznym — ta sama teczka pojedzie z Wami do szpitala w dniu porodu.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część II i Część III standardu',
    legalParaphrase:
      'Część II i III rozporządzenia określają organizację opieki profilaktycznej oraz przejrzysty harmonogram zalecanych spotkań i badań w kolejnych trymestrach ciąży, z poszanowaniem prawa do wyboru osoby sprawującej opiekę.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 1, publicTitle: 'I Trymestr – Początek nowego życia i pierwsze tygodnie', isFree: true },
      { num: 11, publicTitle: 'Spokojna ciąża – kalendarz zalecanych badań i spotkań' },
      { num: 12, publicTitle: 'Kiedy ruszać do szpitala? – sygnały, które warto znać dla spokoju' },
    ],
  },
  {
    id: 'edukacja-przedporodowa-od-pierwszej-wizyty',
    number: 6,
    category: 'Edukacja przedporodowa',
    badge2026: 'NOWE 2026',
    title: 'Edukacja przedporodowa już od pierwszej wizyty — także dla ojca dziecka',
    summary:
      'Od 7 maja 2026 roku informację o możliwości korzystania z edukacji przedporodowej otrzymujecie już podczas pierwszego spotkania potwierdzającego ciążę (do 10. tygodnia). Przepisy wprost wskazują, że edukacja przedporodowa obejmuje również ojca dziecka.',
    practicalTip:
      'Nie odkładajcie nauki na ostatnie tygodnie przed terminem — oglądanie krótkich, 5–7 minutowych odcinków we dwoje od pierwszego trymestru pozwala rozłożyć przygotowania bez pośpiechu.',
    legalAct: 'Rozporządzenie Ministra Zdrowia z 23.10.2025 r. (Dz.U. 2025 poz. 1525)',
    legalSection: 'Część III i Część IV · obowiązuje od 7 maja 2026 r.',
    legalParaphrase:
      'Nowelizacja rozporządzenia (Dz.U. 2025 poz. 1525) wprowadza przekazywanie informacji o edukacji przedporodowej już na etapie pierwszej wizyty (do 10. tygodnia ciąży) oraz potwierdza udział ojca dziecka w przygotowaniu edukacyjnym w formie indywidualnej lub grupowej.',
    isapUrl: ISAP_NOWELIZACJA_2025,
    lessons: [
      { num: 6, publicTitle: 'Szkoła rodzenia online – Twój bezpieczny i wygodny start', isFree: true },
      { num: 11, publicTitle: 'Spokojna ciąża – kalendarz zalecanych badań i spotkań' },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
    ],
  },
  {
    id: 'ramowy-zakres-tematow-edukacji',
    number: 7,
    category: 'Edukacja przedporodowa',
    title: 'Ramowy program edukacji przedporodowej określony w standardzie',
    summary:
      'Rozporządzenie precyzuje, jakie obszary tematyczne powinny znaleźć się w rzetelnym przygotowaniu rodziców: przebieg ciąży, styl życia i ergonomia, aktywny poród, rola osoby bliskiej, powrót do sił w połogu, karmienie piersią oraz opieka i pierwsza pomoc u noworodka.',
    practicalTip:
      'Program 52 lekcji HappyBirth w 8 modułach został ułożony dokładnie w takiej kolejności, w jakiej te tematy pojawiają się w Waszym życiu — od dwóch kresek na teście do pierwszych urodzin dziecka.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część IV ust. 4–5 standardu',
    legalParaphrase:
      'Część IV standardu definiuje zakres tematyczny edukacji przedporodowej obejmujący m.in. higienę i ruch w ciąży, przygotowanie planu porodu, niefarmakologiczne sposoby radzenia sobie ze skurczami, wsparcie laktacyjne oraz pielęgnację noworodka.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 1, publicTitle: 'I Trymestr – Początek nowego życia i pierwsze tygodnie', isFree: true },
      { num: 30, publicTitle: 'Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów' },
      { num: 44, publicTitle: 'Pierwsza kąpiel krok po kroku – bezpieczny chwyt i wieczorny rytuał' },
      { num: 49, publicTitle: 'Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt' },
    ],
  },
  {
    id: 'plan-porodu-w-dokumentacji',
    number: 8,
    category: 'Plan porodu',
    title: 'Plan porodu jest oficjalnym dokumentem dołączanym do dokumentacji',
    summary:
      'Plan porodu to nie luźna kartka z życzeniami, lecz dokument określający Twoje preferencje dotyczące warunków na sali, ruchu, obecności osoby bliskiej, kontaktu skóra do skóry i pierwszego karmienia. Szpital ma obowiązek zapoznać się z nim i dołączyć go do dokumentacji.',
    practicalTip:
      'Wypełnijcie nasz bezpłatny Kreator Planu Porodu PDF we dwoje, wydrukujcie w 2 egzemplarzach i połóżcie na samym wierzchu teczki z dokumentami do szpitala.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część IV i Część V ust. 4 standardu',
    legalParaphrase:
      'Zgodnie z Częścią IV i V standardu plan porodu obejmuje preferencje rodzącej dotyczące organizacji porodu i opieki po narodzinach. Po przyjęciu do placówki personel omawia plan z rodzącą i dołącza dokument do dokumentacji.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
    ],
  },
  {
    id: 'zapoznanie-z-miejscem-porodu',
    number: 9,
    category: 'Plan porodu',
    title: 'Prawo do wcześniejszego poznania zasad i warunków wybranego szpitala',
    summary:
      'Przed terminem porodu macie prawo zapoznać się z organizacją pracy wybranego oddziału, listą rzeczy wymaganych przez placówkę oraz dostępnymi udogodnieniami na sali porodowej (worki sako, piłki, prysznic, chusty).',
    practicalTip:
      'Sprawdźcie trasę dojazdu i wejście na izbę przyjęć jeszcze w 34.–36. tygodniu, aby w dniu porodu działać spokojnie i automatycznie.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część IV ust. 5 standardu',
    legalParaphrase:
      'Standard organizacyjny wskazuje na umożliwienie przyszłym rodzicom wcześniejszego zapoznania się z miejscem porodu, wyposażeniem sal oraz organizacją przyjęcia do placówki.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
    ],
  },
  {
    id: 'komfort-i-metody-lagodzenia-doznan-2026',
    number: 10,
    category: 'Poród',
    badge2026: 'ZMIANA 2026',
    title: 'Komfort w czasie porodu: metody niefarmakologiczne i jasne standardy szpitalne',
    summary:
      'Masz prawo korzystać z metod niefarmakologicznych (ruch, pozycje wertykalne, praca z oddechem, ciepły prysznic, masaż z osobą bliską, chusta Rebozo) oraz uzyskać pełną, zrozumiałą informację o metodach szpitalnych dostępnych w danej placówce zgodnie z nowelizacją z maja 2026 roku.',
    practicalTip:
      'W kursie ćwiczymy razem z partnerem konkretne chwyty masażu okolicy lędźwiowej, pracę z oddechem przeponowym oraz kołysanie chustą Rebozo — to narzędzia, które macie w swoich rękach od pierwszej minuty skurczów.',
    legalAct: 'Rozporządzenie Ministra Zdrowia z 23.10.2025 r. (Dz.U. 2025 poz. 1525)',
    legalSection: 'Część VI standardu · obowiązuje od 7 maja 2026 r.',
    legalParaphrase:
      'Część VI standardu w brzmieniu od 7 maja 2026 r. zobowiązuje placówki do publikowania i przekazywania rodzącej przejrzystej informacji o dostępnych metodach niefarmakologicznych i szpitalnych wspierających komfort rodzącej oraz do poszanowania jej wyborów.',
    isapUrl: ISAP_NOWELIZACJA_2025,
    lessons: [
      { num: 30, publicTitle: 'Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów' },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
      { num: 32, publicTitle: 'Magia chusty Rebozo – techniki odciążania brzucha i pleców z partnerem' },
      { num: 33, publicTitle: 'Metody łagodzenia bólu dostępne w szpitalu' },
    ],
  },
  {
    id: 'swoboda-ruchu-i-pozycje-wertykalne',
    number: 11,
    category: 'Poród',
    title: 'Swoboda ruchu i wybór pozycji dogodnych dla rodzącej',
    summary:
      'W trakcie porodu masz prawo do swobodnego poruszania się, chodzenia, kołysania biodrami na piłce, korzystania z worka sako i przyjmowania pozycji wertykalnych (pionowych), które sprzyjają naturalnej biomechanice ciała.',
    practicalTip:
      'Poznajcie w domu 4–5 podstawowych pozycji wertykalnych z lekcją 30 i 31 — w trakcie porodu ciało samo podpowie, która z nich daje największe odciążenie pleców.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część V ust. 7 i Część VI standardu',
    legalParaphrase:
      'Standard gwarantuje zachęcanie rodzącej do aktywności fizycznej i umożliwienie jej wyboru dogodnej pozycji w pierwszym i drugim okresie porodu, z wykorzystaniem udogodnień dostępnych na sali.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 30, publicTitle: 'Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów' },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
      { num: 32, publicTitle: 'Magia chusty Rebozo – techniki odciążania brzucha i pleców z partnerem' },
    ],
  },
  {
    id: 'lekkostrawne-posilki-i-plyny-w-porodzie-2026',
    number: 12,
    category: 'Poród',
    badge2026: 'ZMIANA 2026',
    title: 'Lekkostrawne posiłki i klarowne płyny w czasie porodu',
    summary:
      'Od 7 maja 2026 roku standard wprost doprecyzowuje nie tylko prawo do picia klarownych płynów, ale również możliwość spożywania lekkostrawnych posiłków w trakcie porodu, o ile osoba sprawująca opiekę nie stwierdzi indywidualnych przeciwwskazań.',
    practicalTip:
      'Spakujcie do pierwszej kieszeni torby porodowej wodę z ustnikiem, słomki oraz małe, lekkostrawne przekąski (np. musy owocowe w tubkach, wafle ryżowe, biszkopty).',
    legalAct: 'Rozporządzenie Ministra Zdrowia z 23.10.2025 r. (Dz.U. 2025 poz. 1525)',
    legalSection: 'Część V ust. 7 pkt 4 · obowiązuje od 7 maja 2026 r.',
    legalParaphrase:
      'Znowelizowany przepis Części V ust. 7 pkt 4 (Dz.U. 2025 poz. 1525) zastępuje wcześniejszy ogólny zapis wyraźnym prawem rodzącej do przyjmowania klarownych płynów oraz spożywania lekkostrawnych posiłków podczas porodu.',
    isapUrl: ISAP_NOWELIZACJA_2025,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
      { num: 30, publicTitle: 'Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów' },
    ],
  },
  {
    id: 'ograniczenie-rutynowych-czynnosci',
    number: 13,
    category: 'Poród',
    title: 'Brak rutynowych czynności organizacyjnych i zabiegowych bez uzasadnienia',
    summary:
      'Standard opiera się na zasadzie poszanowania naturalnego rytmu porodu. Czynności dodatkowe nie mogą być wykonywane „z przyzwyczajenia” ani rutynowo u każdej osoby — wymagają indywidualnego uzasadnienia oraz Twojej świadomej zgody.',
    practicalTip:
      'W naszym interaktywnym Kreatorze Planu Porodu PDF znajdziecie gotowe, kulturalne sformułowania dotyczące ochrony naturalnego rytmu porodu i rezygnacji z rutynowych działań.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część II ust. 2 i Część V standardu',
    legalParaphrase:
      'Zgodnie z Częścią II i V rozporządzenia ingerencja w naturalny proces porodu wiąże się z uzasadnionym wskazaniem, a rutynowe stosowanie czynności organizacyjnych nieznajdujących oparcia w ocenie indywidualnej jest wykluczone.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 28, publicTitle: 'Rodzaje porodów: poród naturalny i przygotowanie na każdy scenariusz' },
      { num: 34, publicTitle: 'Fazy narodzin – przewodnik po etapach porodu i kryzysie 7 cm' },
    ],
  },
  {
    id: 'kontakt-skora-do-skory-2-godziny',
    number: 14,
    category: 'Noworodek',
    title: 'Nieprzerwany kontakt „skóra do skóry” przez pełne 2 godziny po narodzinach',
    summary:
      'Bezpośrednio po narodzinach dziecko układane jest na nagiej piersi mamy i okrywane ciepłym ręcznikiem lub pieluszką. Ten nieprzerwany kontakt powinien trwać co najmniej 2 godziny, a ważenie i mierzenie wykonuje się dopiero po jego zakończeniu.',
    practicalTip:
      'Wybierz do porodu koszulę rozpinaną z przodu na całej długości lub z głębokim dekoltem kopertowym, aby ułatwić natychmiastowe ułożenie dziecka skóra do skóry.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część V ust. 10 i Część IX ust. 2 standardu',
    legalParaphrase:
      'Przepisy gwarantują bezpośredni, nieprzerwany kontakt noworodka z matką „skóra do skóry” trwający dwie godziny po porodzie, podczas którego następuje adaptacja dziecka i inicjacja pierwszego karmienia.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 40, publicTitle: 'Pierwsze chwile maluszka – wygląd noworodka, skala Apgar i dotyk', isFree: true },
      { num: 49, publicTitle: 'Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt' },
    ],
  },
  {
    id: 'kangurowanie-przez-ojca-lub-osobe-bliska',
    number: 15,
    category: 'Noworodek',
    title: 'Kangurowanie dziecka przez ojca lub osobę bliską',
    summary:
      'Jeżeli z przyczyn organizacyjnych lub sytuacyjnych bezpośredni kontakt z mamą w pierwszych minutach nie jest od razu możliwy, prawo do kangurowania dziecka „skóra do skóry” przejmuje ojciec lub wskazana osoba bliska.',
    practicalTip:
      'Niech partner spakuje do torby szpitalnej rozpinaną koszulę lub bluzę na zamek — dzięki temu w każdej chwili jest gotowy do kangurowania noworodka na własnej klatce piersiowej.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część IX standardu · Zasady kontaktu z osobą bliską',
    legalParaphrase:
      'Standard wspiera zachowanie ciągłości bliskości i ciepła poprzez umożliwienie osobie bliskiej kontaktu „skóra do skóry” z noworodkiem, gdy stan lub sytuacja organizacyjna nie pozwala na natychmiastowy kontakt z matką.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 28, publicTitle: 'Rodzaje porodów: poród naturalny i przygotowanie na każdy scenariusz' },
      { num: 31, publicTitle: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż' },
      { num: 40, publicTitle: 'Pierwsze chwile maluszka – wygląd noworodka, skala Apgar i dotyk', isFree: true },
    ],
  },
  {
    id: 'badania-noworodka-w-obecnosci-rodzica',
    number: 16,
    category: 'Noworodek',
    title: 'Badania i czynności u noworodka w obecności matki lub osoby bliskiej',
    summary:
      'Jako rodzice jesteście przedstawicielami ustawowymi swojego dziecka od pierwszej minuty jego życia. Wszystkie badania i czynności pielęgnacyjne u noworodka w szpitalu powinny odbywać się po udzieleniu Wam informacji i w Waszej obecności.',
    practicalTip:
      'Gdy mama odpoczywa w pierwszych godzinach po porodzie, tata może towarzyszyć dziecku przy każdym badaniu i ważeniu na oddziale.',
    legalAct: 'Standard Organizacyjny oraz Ustawa o prawach pacjenta',
    legalSection: 'Część IX ust. 5 standardu · Art. 9, 16 i 21 ustawy',
    legalParaphrase:
      'Część IX ust. 5 rozporządzenia stanowi, że obserwacja i badania noworodka odbywają się w obecności matki lub osoby bliskiej, po uprzednim poinformowaniu rodzica o celu i przebiegu czynności.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 40, publicTitle: 'Pierwsze chwile maluszka – wygląd noworodka, skala Apgar i dotyk', isFree: true },
      { num: 41, publicTitle: 'Odruchy i zachowania noworodka – co jest w pełni naturalne?' },
      { num: 45, publicTitle: 'Spokojne wizyty u pediatry – kalendarz profilaktyki i opieki' },
    ],
  },
  {
    id: 'wsparcie-w-pierwszym-karmieniu',
    number: 17,
    category: 'Karmienie',
    title: 'Praktyczny instruktaż i wsparcie w karmieniu od pierwszych godzin',
    summary:
      'Na oddziale przysługuje Ci życzliwa pomoc w prawidłowym przystawieniu dziecka do piersi, doborze wygodnej pozycji (klasycznej, krzyżowej, leżącej lub spod pachy) oraz rozpoznawaniu oznak głodu i skutecznego ssania.',
    practicalTip:
      'Obejrzyjcie przed porodem lekcje 49–51, aby poznać zasady głębokiego przystawienia i wygodnego ułożenia poduszek — na oddziale łatwiej wtedy poprosić o drobną korektę pozycji.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część IX i Część X standardu',
    legalParaphrase:
      'Część X standardu nakłada na placówkę obowiązek zapewnienia matce praktycznego instruktażu i wsparcia w zakresie prawidłowej techniki karmienia piersią oraz utrzymania laktacji.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 49, publicTitle: 'Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt' },
      { num: 50, publicTitle: 'Trudności w laktacji: najczęstsze sytuacje i jak sobie radzić' },
    ],
  },
  {
    id: 'poszanowanie-wyborow-zywieniowych',
    number: 18,
    category: 'Karmienie',
    title: 'Dokarmianie wyłącznie ze wskazań i za wiedzą oraz zgodą mamy',
    summary:
      'W pierwszych dobach życia podstawą żywienia jest pokarm mamy. Ewentualne podanie mleka modyfikowanego w szpitalu może nastąpić wyłącznie z uzasadnionych przyczyn lub zgodnie z Twoją wolą, po wcześniejszym omówieniu z Tobą.',
    practicalTip:
      'Pamiętajcie, że żołądek noworodka w 1. dobie ma wielkość małej wisienki (ok. 5–7 ml) — kilka kropel gęstej siary w zupełności mu wystarcza na start.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część X ust. 2 standardu',
    legalParaphrase:
      'Przepisy Części X wskazują na priorytet karmienia naturalnego i zastrzegają, że podawanie sztucznego pokarmu noworodkowi karmionemu piersią odbywa się wyłącznie ze wskazań i za zgodą matki.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 49, publicTitle: 'Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt' },
      { num: 51, publicTitle: 'Akcesoria do karmienia – laktatory, butelki i spokojne karmienie' },
    ],
  },
  {
    id: 'system-rooming-in-i-odpoczynek',
    number: 19,
    category: 'Połóg',
    title: 'Wspólny pobyt mamy z dzieckiem (rooming-in) oraz prawo do odpoczynku',
    summary:
      'Szpitale funkcjonują w systemie „matka z dzieckiem” (rooming-in), dzięki czemu jesteście razem przez całą dobę. Jednocześnie, jeśli po trudach porodu potrzebujesz snu lub chwili na prysznic, masz prawo poprosić personel o czasowe zaopiekowanie się maluszkiem.',
    practicalTip:
      'Nie bój się prosić o pomoc na oddziale o 2:00 w nocy — odpoczynek mamy w pierwszych dobach jest fundamentem regeneracji i spokojnego powrotu do domu.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część X i Część XI standardu',
    legalParaphrase:
      'Standard organizacyjny zapewnia organizację opieki w systemie umożliwiającym przebywanie matki razem z noworodkiem przy jednoczesnym wsparciu personelu w pielęgnacji i umożliwieniu matce regeneracji.',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 35, publicTitle: 'Pielęgnacja po porodzie: higiena i gojenie w pierwszych tygodniach' },
      { num: 36, publicTitle: 'Pierwsze tygodnie połogu – fizjologia, emocje i oswajanie Baby Blues' },
      { num: 40, publicTitle: 'Pierwsze chwile maluszka – wygląd noworodka, skala Apgar i dotyk', isFree: true },
    ],
  },
  {
    id: 'wizyty-patronazowe-w-domu',
    number: 20,
    category: 'Połóg',
    title: 'Co najmniej 4 wizyty patronażowe w domu (pierwsza w ciągu 48 godzin)',
    summary:
      'Po wypisie ze szpitala nie zostajecie sami. Standard gwarantuje co najmniej cztery wizyty patronażowe w Waszym domu, a pierwsza z nich odbywa się nie później niż w ciągu 48 godzin od zgłoszenia wypisu ze szpitala.',
    practicalTip:
      'Przed porodem przygotujcie listę codziennych pytań (kąpiel, pępek, temperatura w pokoju, spacery), aby podczas domowej wizyty spokojnie omówić każdy szczegół.',
    legalAct: 'Standard Organizacyjny Opieki Okołoporodowej (Dz.U. 2018 poz. 1756 ze zm.)',
    legalSection: 'Część XII ust. 2–4 standardu',
    legalParaphrase:
      'Część XII zobowiązuje do realizacji w miejscu pobytu matki i dziecka nie mniej niż czterech wizyt patronażowych (pierwszej w ciągu 48 godzin od otrzymania zgłoszenia urodzenia ze szpitala).',
    isapUrl: ISAP_STANDARD_2018,
    lessons: [
      { num: 36, publicTitle: 'Pierwsze tygodnie połogu – fizjologia, emocje i oswajanie Baby Blues' },
      { num: 45, publicTitle: 'Spokojne wizyty u pediatry – kalendarz profilaktyki i opieki' },
      { num: 46, publicTitle: 'Pierwsze dni w domu – naturalne adaptacje noworodka bez paniki' },
    ],
  },
  {
    id: 'dostepnosc-dla-kobiet-ze-szczegolnymi-potrzebami-2026',
    number: 21,
    category: 'Dostępność',
    badge2026: 'NOWE 2026',
    title: 'Nowy rozdział o dostępności dla kobiet ze szczególnymi potrzebami',
    summary:
      'Od 7 maja 2026 roku standard zawiera wyodrębnioną Część XIV poświęconą kobietom ze szczególnymi potrzebami — w tym dostępności architektonicznej, cyfrowej, materiałom w tekście łatwym do czytania (ETR), tłumaczowi Polskiego Języka Migowego (PJM) oraz wydłużonemu czasowi spotkań.',
    practicalTip:
      'Jeśli potrzebujesz komunikacji w PJM, asystenta lub szczególnych udogodnień w sali, wpisz tę informację w Planie Porodu i zgłoś ją przy pierwszym kontakcie z wybraną placówką.',
    legalAct: 'Rozporządzenie Ministra Zdrowia z 23.10.2025 r. (Dz.U. 2025 poz. 1525)',
    legalSection: 'Nowa Część XIV standardu · obowiązuje od 7 maja 2026 r.',
    legalParaphrase:
      'Dodana Część XIV (Dz.U. 2025 poz. 1525) wprowadza standardy dostępności informacyjno-komunikacyjnej, architektonicznej i organizacyjnej dla kobiet ze szczególnymi potrzebami na każdym etapie opieki okołoporodowej.',
    isapUrl: ISAP_NOWELIZACJA_2025,
    lessons: [
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
    ],
  },
  {
    id: 'ruch-150-minut-w-ciazy',
    number: 22,
    category: 'Ruch, forma i żywienie',
    stamp: 'FAKT',
    sourceCitation: 'PTGiP & PTMS 2023 · WHO 2020',
    title: 'Minimum 150 minut umiarkowanego ruchu tygodniowo w ciąży bez przeciwwskazań',
    summary:
      'Zdrowym kobietom w prawidłowo przebiegającej ciąży zaleca się co najmniej 150 minut aktywności tlenowej o umiarkowanej intensywności tygodniowo (np. po 30 minut przez 5 dni) — w tym szybki marsz, pływanie, pilates czy ćwiczenia z piłką.',
    practicalTip:
      'Jeśli przed ciążą nie trenowałaś regularnie, zacznij spokojnie i nie podkręcaj tempa — świetnie sprawdza się „test mowy”: podczas ruchu powinnaś móc swobodnie prowadzić rozmowę bez zadyszki.',
    legalAct: 'Wytyczne PTGiP i PTMS (2023) oraz WHO (2020)',
    legalSection: 'Rekomendacje aktywności fizycznej w okresie okołoporodowym',
    legalParaphrase:
      'Systematyczny, umiarkowany wysiłek w ciąży fizjologicznej wspiera kondycję układu krążenia, łagodzi dolegliwości pleców i nie zwiększa ryzyka przedwczesnego zakończenia ciąży.',
    isapUrl: 'https://www.who.int/publications/i/item/9789240015128',
    lessons: [
      { num: 16, publicTitle: 'Ulga dla kręgosłupa – bezpieczne ćwiczenia i rozluźnianie pleców' },
      { num: 17, publicTitle: 'Czas dla siebie – relaks, spacery i bezpieczne podróże' },
    ],
  },
  {
    id: 'mit-jedzenia-za-dwoje-i-limitu-140',
    number: 23,
    category: 'Ruch, forma i żywienie',
    stamp: 'MIT',
    sourceCitation: 'ACOG Opinion No. 804 · EFSA',
    title: 'Mit: W ciąży trzeba jeść za dwoje, a puls nie może przekroczyć 140 uderzeń/min',
    summary:
      'Oba popularne przekonania są nieaktualne. Zapotrzebowanie energetyczne rośnie nie razy dwa, lecz o ok. 340 kcal dziennie w II trymestrze i ok. 450 kcal w III trymestrze — liczy się gęstość odżywcza dla dwojga. Z kolei sztywny limit tętna 140 bpm został wycofany z wytycznych ACOG na rzecz subiektywnej oceny wysiłku.',
    practicalTip:
      'Zamiast drugiej porcji obiadu postaw na odżywczą przekąskę bogatą w białko i kwasy omega-3, a podczas spacerów i ćwiczeń na piłce kontroluj komfort oddechu zamiast obsesyjnie patrzeć na zegarek.',
    legalAct: 'ACOG Committee Opinion No. 804 & EFSA',
    legalSection: 'Stanowisko ds. aktywności fizycznej i norm żywienia',
    legalParaphrase:
      'Amerykańskie Kolegium Położników i Ginekologów rekomenduje ocenę intensywności wysiłku za pomocą skali RPE i testu mowy zamiast sztywnego limitu tętna 140/min, a normy EFSA potwierdzają umiarkowany wzrost kaloryczności w II i III trymestrze.',
    isapUrl: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period',
    lessons: [
      { num: 2, publicTitle: 'II Trymestr – Czas energii, zmysłów i pierwszych ruchów' },
      { num: 16, publicTitle: 'Ulga dla kręgosłupa – bezpieczne ćwiczenia i rozluźnianie pleców' },
    ],
  },
  {
    id: 'mit-podnoszenia-rak-i-plywania',
    number: 24,
    category: 'Ruch, forma i żywienie',
    stamp: 'MIT',
    sourceCitation: 'WHO 2020 · PTGiP & PTMS 2023',
    title: 'Mit: Pływanie, joga lub podnoszenie rąk do góry szkodzi prawidłowej ciąży',
    summary:
      'Umiarkowany ruch, pływanie czy sięganie rękami w górę podczas codziennych czynności nie zagraża prawidłowo przebiegającej ciąży. Wykluczamy jedynie dyscypliny z ryzykiem upadku lub urazu brzucha (sporty kontaktowe, jazda konna, narty), nurkowanie głębinowe oraz dłuższe leżenie płasko na plecach w III trymestrze.',
    practicalTip:
      'Wybierajcie wspólne spacery, basen i bezpieczną ergonomię domu z naszego modułu fizjoterapii, a cięższe zakupy i przenoszenie walizek przekazuj partnerowi.',
    legalAct: 'WHO Guidelines on Physical Activity & PTGiP 2023',
    legalSection: 'Bezpieczne formy ruchu i przeciwskazane dyscypliny',
    legalParaphrase:
      'Wytyczne międzynarodowe oraz polskie rekomendacje kliniczne potwierdzają bezpieczeństwo codziennego ruchu w ciąży fizjologicznej, wskazując jako przeciwwskazane wyłącznie aktywności urazowe, kontaktowe i przegrzewające.',
    isapUrl: 'https://www.who.int/publications/i/item/9789240015128',
    lessons: [
      { num: 17, publicTitle: 'Czas dla siebie – relaks, spacery i bezpieczne podróże' },
      { num: 18, publicTitle: 'Domowa przestrzeń – jak dbać o swoje siły i kręgosłup' },
    ],
  },
  {
    id: 'nawodnienie-suplementacja-i-bezpieczna-kuchnia',
    number: 25,
    category: 'Ruch, forma i żywienie',
    stamp: 'FAKT',
    sourceCitation: 'PTGiP & NCEZ PZH-PIB · EFSA',
    title: 'Nawodnienie, kluczowe składniki odżywcze i bezpieczna obróbka posiłków',
    summary:
      'W okresie oczekiwania na dziecko zapotrzebowanie na wodę rośnie do ok. 2,3–2,5 litra płynów na dobę, a podstawą profilaktyki są foliany, witamina D, jod i kwasy DHA w dawce dobranej z lekarzem. W kuchni kluczowe jest dokładne mycie warzyw, wybór pasteryzowanego nabiału oraz unikanie surowego mięsa, surowych jaj i niepasteryzowanych serów.',
    practicalTip:
      'Postawcie w domu dzbanek filtrowanej wody w zasięgu ręki, a podczas wizyty kontrolnej poproście o zapisanie dokładnych dawek witaminy D i DHA dopasowanych do wyników badań.',
    legalAct: 'Rekomendacje PTGiP & Narodowe Centrum Edukacji Żywieniowej',
    legalSection: 'Profilaktyka żywieniowa i suplementacja kobiet w ciąży',
    legalParaphrase:
      'Polskie Towarzystwo Ginekologów i Położników wskazuje na celowaną suplementację kwasem foliowym, witaminą D, jodem i DHA, a NCEZ PZH-PIB podkreśla znaczenie nawodnienia oraz higieny obróbki żywności.',
    isapUrl: 'https://ncez.pzh.gov.pl/',
    lessons: [
      { num: 2, publicTitle: 'II Trymestr – Czas energii, zmysłów i pierwszych ruchów' },
      { num: 11, publicTitle: 'Spokojna ciąża – kalendarz zalecanych badań i spotkań' },
    ],
  },
  {
    id: 'powrot-do-biegania-po-porodzie',
    number: 26,
    category: 'Ruch, forma i żywienie',
    stamp: 'NIE WIADOMO',
    sourceCitation: 'Goom, Donnelly, Brockwell 2019',
    title: 'Kiedy dokładnie wrócić do biegania i skoków po porodzie? Plan indywidualny',
    summary:
      'Nauka nie podaje jednego uniwersalnego dnia powrotu do sportów dynamicznych dla każdej mamy. Międzynarodowy konsensus fizjoterapeutek uroginekologicznych wskazuje, aby nie zaczynać biegania przed upływem ok. 12 tygodni po narodzinach i uzależnia ten krok od indywidualnej oceny siły mięśni głębokich, dna miednicy oraz powłok brzucha.',
    practicalTip:
      'Po zakończonym połogu umów wizytę u fizjoterapeutki uroginekologicznej. Do dynamicznych treningów przechodź stopniowo dopiero wtedy, gdy bez trudu zaliczysz testy stabilizacji i brak jest uczucia ciężkości.',
    legalAct: 'Goom T., Donnelly G., Brockwell E. (2019)',
    legalSection: 'Returning to running postnatal – clinical guidelines',
    legalParaphrase:
      'Wytyczne międzynarodowe zastępują sztywne daty kalendarzowe indywidualną oceną funkcjonalną po ok. 12 tygodniach regeneracji tkanek, podkreślając luki w badaniach dla uniwersalnych terminów powrotu do sportu wyczynowego.',
    isapUrl: 'https://www.who.int/publications/i/item/9789240015128',
    lessons: [
      { num: 16, publicTitle: 'Ulga dla kręgosłupa – bezpieczne ćwiczenia i rozluźnianie pleców' },
      { num: 18, publicTitle: 'Domowa przestrzeń – jak dbać o swoje siły i kręgosłup' },
    ],
  },
  {
    id: 'urlop-macierzynski-rodzicielski-i-9-tygodni',
    number: 27,
    category: 'Urlopy i zasiłki 2026',
    stamp: 'FAKT',
    sourceCitation: 'Kodeks pracy · Art. 180, Art. 182¹ᵃ, Art. 182³',
    title: 'Urlop macierzyński, 41 tygodni rodzicielskiego i 9 tygodni tylko dla drugiego rodzica',
    summary:
      'W aktualnym stanie prawnym przy narodzinach jednego dziecka przysługuje 20 tygodni urlopu macierzyńskiego oraz 41 tygodni urlopu rodzicielskiego do wykorzystania przez oboje rodziców. Spośród tych 41 tygodni aż 9 tygodni ma charakter niezbywalny wyłącznie dla drugiego rodzica (płatne 70%), a tata ma dodatkowo 2 tygodnie urlopu ojcowskiego (100%) do 12. miesiąca życia malucha.',
    practicalTip:
      'Sprawdźcie wspólnie nasz Kalkulator Macierzyńskiego 2026: zaplanujcie z wyprzedzeniem daty wniosków do kadr i sprawdźcie, kiedy tata odbierze swoje 9 tygodni opieki.',
    legalAct: 'Ustawa – Kodeks pracy (stan prawny 2026)',
    legalSection: 'Art. 180, Art. 182¹ᵃ oraz Art. 182³',
    legalParaphrase:
      'Kodeks pracy określa wymiar urlopu macierzyńskiego (20 tyg. przy jednym dziecku) oraz rodzicielskiego (41 tyg., z wyłącznym prawem każdego rodzica do nieprzenoszalnych 9 tygodni tego urlopu).',
    isapUrl: '/kalkulator-macierzynski',
    lessons: [
      { num: 6, publicTitle: 'Szkoła rodzenia online – Twój bezpieczny i wygodny start', isFree: true },
      { num: 26, publicTitle: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory', isFree: true },
    ],
  },
  {
    id: 'mit-81-5-procent-zabiera-urlop-tacie',
    number: 28,
    category: 'Urlopy i zasiłki 2026',
    stamp: 'MIT',
    sourceCitation: 'Ustawa zasiłkowa · Art. 30a ZUS',
    title: 'Mit: Wybór stałej stawki 81,5% dla mamy odbiera drugiemu rodzicowi 9 tygodni urlopu',
    summary:
      'Złożenie w ciągu 21 dni od porodu jednego wniosku o zasiłek macierzyński w wysokości 81,5% przez cały okres macierzyńskiego i rodzicielskiego (32 tygodnie rodzicielskiego dla mamy) NIE zamyka tacie drogi do jego 9 tygodni. Drugi rodzic zachowuje swoje wyłączne 9 tygodni urlopu rodzicielskiego wypłacanych w ZUS na poziomie 70%.',
    practicalTip:
      'Pamiętajcie jedynie o terminie 21 dni po narodzinach na złożenie „długiego wniosku” u pracodawcy lub w ZUS (PUE ZUS przy JDG), jeśli chcecie skorzystać z równej stawki 81,5%.',
    legalAct: 'Ustawa o świadczeniach pieniężnych z ubezpieczenia społecznego',
    legalSection: 'Art. 30a · zasady wypłaty zasiłku 81,5% i 70%',
    legalParaphrase:
      'Przepisy zasiłkowe pozwalają matce pobierać uśrednione 81,5% przez pierwsze 52 tygodnie, zachowując równolegle odrębne prawo ojca do nieprzenoszalnej części 9 tygodni na stawce 70%.',
    isapUrl: '/kalkulator-macierzynski',
    lessons: [
      { num: 6, publicTitle: 'Szkoła rodzenia online – Twój bezpieczny i wygodny start', isFree: true },
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
    ],
  },
  {
    id: 'spor-81-5-procent-czy-100-plus-70',
    number: 29,
    category: 'Urlopy i zasiłki 2026',
    stamp: 'SPÓR',
    sourceCitation: 'Kodeks pracy Art. 182¹ᵃ · Symulacja ZUS 2026',
    title: 'Wariant 81,5% od pierwszego dnia czy 100% przez 20 tygodni + 70% potem?',
    summary:
      'W perspektywie pełnych 52 tygodni dla jednej osoby suma obu wariantów jest niemal identyczna (średnio ok. 81,54% przy opcji 100%+70% vs równe 81,5%). Spór praktyczny dotyczy płynności budżetu: wariant 100% + 70% daje wyższe wypłaty w pierwszych 5 miesiącach (albo przy podziale urlopu z lepiej zarabiającym partnerem), a 81,5% chroni przed nagłym spadkiem budżetu pod koniec roku.',
    practicalTip:
      'Przeliczcie w naszym kalkulatorze swoje realne wynagrodzenie netto na etacie lub podstawę składek JDG, aby sprawdzić oba scenariusze miesiąc po miesiącu.',
    legalAct: 'Analiza porównawcza wariantów ZUS (2026)',
    legalSection: 'Art. 31 ustawy zasiłkowej · wybór stawki zasiłku',
    legalParaphrase:
      'Wybór pomiędzy stałą stawką 81,5% a stawkami zmiennymi 100%/70% zależy od planowanego podziału opieki między obojga rodziców oraz indywidualnej strategii domowego budżetu.',
    isapUrl: '/kalkulator-macierzynski',
    lessons: [
      { num: 6, publicTitle: 'Szkoła rodzenia online – Twój bezpieczny i wygodny start', isFree: true },
      { num: 24, publicTitle: 'Kompletna wyprawka domowa – ubranka, otulacze i tekstylia' },
    ],
  },
  {
    id: 'mit-przegrzewania-24-stopnie-i-czapeczka',
    number: 30,
    category: 'Ściąga dla dziadków',
    stamp: 'MIT',
    sourceCitation: 'AAP Safe Sleep 2022 · PTP',
    title: 'Mit: Noworodek musi spać w 24°C, mieć czapeczkę w domu i czekać miesiąc na spacer',
    summary:
      'Babcie i dziadkowie często pamiętają zalecenia sprzed dekad o szczelnym opatulaniu maluszka. Współczesna pediatria podkreśla, że przegrzanie jest dużo bardziej niebezpieczne niż lekki chłód: idealna temperatura do snu w pokoju to 18–20°C (w dzień ok. 20–21°C), w ogrzewanym mieszkaniu dziecko nie nosi czapeczki, a pierwszy spacer przy dobrej pogodzie można odbyć już w pierwszym tygodniu.',
    practicalTip:
      'Zamiast sprawdzać chłodne rączki lub stópki (u noworodka to naturalne), dotknij delikatnie karku dziecka — jeśli jest ciepły i suchy, maluch ma dokładnie właściwą temperaturę.',
    legalAct: 'American Academy of Pediatrics & Polskie Towarzystwo Pediatryczne',
    legalSection: 'Zalecenia termoregulacji i komfortu termicznego niemowląt',
    legalParaphrase:
      'Unikanie przegrzewania sypialni (zalecane 18–20°C), rezygnacja z czapeczek w domu oraz dostosowanie ubioru warstwowego do pogody zamiast wielotygodniowej izolacji domowej stanowią aktualny standard opieki.',
    isapUrl: 'https://pacjent.gov.pl/',
    lessons: [
      { num: 22, publicTitle: 'Bezpieczne łóżeczko – materac i zasady spokojnego snu maluszka' },
      { num: 24, publicTitle: 'Kompletna wyprawka domowa – ubranka, otulacze i tekstylia' },
    ],
  },
  {
    id: 'bezpieczny-sen-niemowlecia-abc',
    number: 31,
    category: 'Ściąga dla dziadków',
    stamp: 'FAKT',
    sourceCitation: 'AAP 2022 Safe Sleep · WHO',
    title: 'Tylko na plecach, na twardym materacu i w pustym łóżeczku — złote zasady snu',
    summary:
      'Dawniej dzieci układano często na brzuszku lub otaczano miękkimi poduszkami i ochraniaczami na szczebelki. Dziś każde towarzystwo pediatryczne zaleca zasadę bezpiecznego snu: układamy niemowlę wyłącznie na plecach, na płaskim i twardym materacu, bez poduszek, luźnych kocyków, ochraniaczy, kokonów i pluszaków (zamiast kołderki wybieramy dopasowany śpiworek).',
    practicalTip:
      'Pokażcie tę krótką zasadę bliskim, którzy będą pomagać w opiece lub usypiać wnuka w pierwszym roku życia — w pustym łóżeczku maluszek śpi najbezpieczniej.',
    legalAct: 'AAP Policy Statement: Safe Infant Sleeping Environment (2022)',
    legalSection: 'Zasada ABC bezpiecznego snu niemowląt',
    legalParaphrase:
      'Współczesne wytyczne pediatryczne zalecają spanie na plecach (Back), na oddzielnym płaskim i twardym podłożu bez miękkich obiektów w strefie snu (Bare Crib) oraz pokój rodziców przez co najmniej pierwsze 6 miesięcy.',
    isapUrl: 'https://pacjent.gov.pl/',
    lessons: [
      { num: 22, publicTitle: 'Bezpieczne łóżeczko – materac i zasady spokojnego snu maluszka' },
      { num: 42, publicTitle: 'Bezpieczny sen maluszka – złote zasady spokojnej nocy' },
    ],
  },
  {
    id: 'odwiedziny-bliskich-i-ochrona-noworodka',
    number: 32,
    category: 'Ściąga dla dziadków',
    stamp: 'SPÓR',
    sourceCitation: 'Standard 2026 · Profilaktyka zakażeń niemowląt',
    title: 'Pierwsze odwiedziny rodziny po powrocie do domu i całowanie maluszka',
    summary:
      'W wielu rodzinach ścierają się dwie potrzeby: chęć natychmiastowego powitania wnuka przez dziadków oraz potrzeba spokoju i ochrony niedojrzałego układu odpornościowego noworodka. Standard bezpieczeństwa jest prosty: odwiedziny odbywają się za zgodą rodziców, wyłącznie w pełnym zdrowiu (bez najmniejszego kataru czy opryszczki), po dokładnym umyciu rąk i bez całowania rączek oraz buzi dziecka.',
    practicalTip:
      'Podpowiedzcie dziadkom najlepszy prezent pierwszego tygodnia: ciepły domowy obiad przyniesiony w pojemnikach pod drzwi lub 20 minut pomocy przy zakupach zamiast długich posiedzeń przy łóżeczku.',
    legalAct: 'Profilaktyka zdrowotna noworodka w domu (Standard 2026)',
    legalSection: 'Ochrona adaptacyjna i higiena pierwszych tygodni życia',
    legalParaphrase:
      'Pierwsze tygodnie po narodzinach wymagają wyciszenia bodźców oraz ograniczania ekspozycji na drobnoustroje przenoszone drogą kropelkową i przez kontakt bezpośredni z dorosłymi.',
    isapUrl: ISAP_NOWELIZACJA_2025,
    lessons: [
      { num: 27, publicTitle: 'Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu' },
      { num: 46, publicTitle: 'Pierwsze dni w domu – naturalne adaptacje noworodka bez paniki' },
    ],
  },
  {
    id: 'dopajanie-woda-i-herbatki-koperkowe',
    number: 33,
    category: 'Ściąga dla dziadków',
    stamp: 'NIE WIADOMO',
    sourceCitation: 'WHO · PTGHiŻD · EMA',
    title: 'Czy podawać noworodkowi wodę lub herbatkę koperkową przy karmieniu piersią?',
    summary:
      'Babcie często pamiętają dopajanie wodą z glukozą lub herbatkami ziołowymi. Tymczasem przy wyłącznym karmieniu piersią w pierwszych 6 miesiącach mleko mamy składa się w ok. 87% z wody i w pełni zaspokaja pragnienie nawet latem. Natomiast dla naparów z kopru włoskiego u niemowląt brak ustalonych bezpiecznych dawek ze względu na obecność naturalnego estragolu, dlatego nie podaje się ich maluchom bez wskazania lekarza.',
    practicalTip:
      'W upalne dni po prostu przystawiaj dziecko do piersi częściej — mleko z początku karmienia ma rzadszą konsystencję i świetnie gasi pragnienie bez dodatkowych butelek z wodą czy ziołami.',
    legalAct: 'WHO Infant Feeding & Polskie Towarzystwo Gastroenterologii Dziecięcej',
    legalSection: 'Stanowisko w sprawie wyłącznego karmienia piersią do 6. miesiąca',
    legalParaphrase:
      'WHO oraz towarzystwa pediatryczne potwierdzają brak potrzeby podawania wody czy herbatek zdrowym niemowlętom karmionym wyłącznie piersią w pierwszym półroczu życia, a Europejska Agencja Leków (EMA) wskazuje na brak wystarczających danych o bezpieczeństwie estragolu z kopru włoskiego u małych dzieci.',
    isapUrl: 'https://www.who.int/health-topics/breastfeeding',
    lessons: [
      { num: 49, publicTitle: 'Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt' },
      { num: 51, publicTitle: 'Akcesoria do karmienia – laktatory, butelki i spokojne karmienie' },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Kiedy weszły w życie najnowsze zmiany w Standardzie Organizacyjnym Opieki Okołoporodowej?',
    a: 'Znowelizowane przepisy wynikające z Rozporządzenia Ministra Zdrowia z dnia 23 października 2025 r. (Dz.U. 2025 poz. 1525) obowiązują w polskich placówkach od 7 maja 2026 roku. Wprowadzają m.in. edukację przedporodową od pierwszej wizyty (także dla ojca dziecka), prawo do lekkostrawnych posiłków w czasie porodu oraz nowy rozdział o dostępności.',
  },
  {
    q: 'Czy Plan Porodu trzeba przynieść na urzędowym formularzu szpitala?',
    a: 'Nie istnieje jeden narzucony urzędowy formularz. Możecie przygotować własny, czytelny dokument (np. w bezpłatnym Kreatorze Planu Porodu PDF na HappyBirth.pl). Zgodnie z Częścią IV i V Standardu personel ma obowiązek zapoznać się z Waszym dokumentem i dołączyć go do dokumentacji.',
  },
  {
    q: 'Czy ojciec dziecka również ma prawo do edukacji przedporodowej?',
    a: 'Tak. Od 7 maja 2026 roku przepisy wprost wskazują, że edukacja przedporodowa obejmuje także ojca dziecka. W kursie HappyBirth.pl dostęp dla drugiej osoby (partnera, męża lub bliskiej osoby towarzyszącej) jest wliczony w jedną cenę 489,00 zł brutto na 18 miesięcy (548 dni).',
  },
  {
    q: 'Czy w trakcie porodu można pić wodę i zjeść lekki posiłek?',
    a: 'Tak. Zgodnie ze znowelizowanym brzmieniem Części V ust. 7 pkt 4 Standardu obowiązującym od 7 maja 2026 r., rodząca ma prawo do przyjmowania klarownych płynów oraz spożywania lekkostrawnych posiłków w trakcie porodu, o ile osoba sprawująca opiekę nie stwierdzi przeciwwskazań.',
  },
  {
    q: 'Ile trwa nieprzerwany kontakt „skóra do skóry” po narodzinach dziecka?',
    a: 'Standard organizacyjny gwarantuje nieprzerwany kontakt „skóra do skóry” trwający co najmniej 2 godziny bezpośrednio po narodzinach. Rutynowe ważenie i mierzenie noworodka wykonuje się dopiero po zakończeniu tego dwugodzinnego kontaktu i pierwszego karmienia.',
  },
  {
    q: 'Kto odpowiada za weryfikację merytoryczną bazy wiedzy HappyBirth.pl?',
    a: 'Bazę wiedzy opracował zespół dyplomowanych ekspertek edukacji okołoporodowej i specjalistek fizjoterapii z poznańskiej szkoły rodzenia Mama Gaja (działającej od 2012 r., ponad 18 000 przygotowanych rodzin). Wydawcą edukacyjnym (PKD 85.59.B) jest KLARSOLUTIONS Sp. z o.o. (KRS 0001268396).',
  },
];

export default function DlaCiebieKnowledgePage() {
  /**
   * Bezpieczny, 100% edukacyjno-prawny graf Schema.org (LearningResource + Legislation + FAQPage).
   * Pozycjonuje domenę w Google i Meta jako podmiot edukacyjny (EducationalOrganization / PKD 85.59.B)
   * oraz przewodnik po przepisach prawa (Legislation / LearningResource / DefinedTermSet / FAQPage).
   */
  const educationalSchemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://happybirth.pl/#organizacja',
        name: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
        alternateName: ['HappyBirth.pl Edukacja Online', 'Szkoła Rodzenia Mama Gaja (od 2012 r.)'],
        url: 'https://happybirth.pl',
        email: 'kontakt@happybirth.pl',
        taxID: '7812118273',
        vatID: 'PL7812118273',
        foundingDate: '2012',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Śląska 14',
          postalCode: '60-614',
          addressLocality: 'Poznań',
          addressCountry: 'PL',
        },
      },
      {
        '@type': ['CollectionPage', 'LearningResource'],
        '@id': 'https://happybirth.pl/dla-ciebie#resource',
        url: 'https://happybirth.pl/dla-ciebie',
        name: 'Wiedza dla Rodziców: Prawa i Standard Organizacyjny Opieki Okołoporodowej 2026',
        description:
          'Edukacyjny przewodnik po 21 prawach i zasadach organizacyjnych dla przyszłych mam i ojców, opracowany na podstawie Rozporządzenia Ministra Zdrowia (Dz.U. 2018 poz. 1756 ze zm. Dz.U. 2025 poz. 1525 od 7 maja 2026 r.) oraz Ustawy o prawach pacjenta.',
        inLanguage: 'pl-PL',
        learningResourceType: 'Educational Guide / Legal & Organizational Reference',
        educationalUse: 'Adult Continuing Education (PKD 85.59.B)',
        datePublished: '2026-05-07',
        dateModified: '2026-10-28',
        publisher: { '@id': 'https://happybirth.pl/#organizacja' },
        author: {
          '@type': 'Organization',
          name: 'Zespół Dyplomowanych Ekspertek Szkoły Rodzenia Mama Gaja (od 2012 r.)',
          url: 'https://happybirth.pl/o-nas',
        },
        isBasedOn: [
          {
            '@type': 'Legislation',
            name: 'Rozporządzenie Ministra Zdrowia z dnia 23 października 2025 r. zmieniające rozporządzenie w sprawie standardu organizacyjnego opieki okołoporodowej (Dz.U. 2025 poz. 1525)',
            legislationIdentifier: 'Dz.U. 2025 poz. 1525',
            legislationDate: '2025-10-23',
            url: ISAP_NOWELIZACJA_2025,
          },
          {
            '@type': 'Legislation',
            name: 'Rozporządzenie Ministra Zdrowia z dnia 16 sierpnia 2018 r. w sprawie standardu organizacyjnego opieki okołoporodowej (Dz.U. 2018 poz. 1756)',
            legislationIdentifier: 'Dz.U. 2018 poz. 1756',
            legislationDate: '2018-08-16',
            url: ISAP_STANDARD_2018,
          },
          {
            '@type': 'Legislation',
            name: 'Ustawa z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta (Dz.U. 2009 nr 52 poz. 417)',
            legislationIdentifier: 'Dz.U. 2009 nr 52 poz. 417',
            legislationDate: '2008-11-06',
            url: ISAP_USTAWA_PP,
          },
        ],
      },
      {
        '@type': 'DefinedTermSet',
        '@id': 'https://happybirth.pl/dla-ciebie#kompendium-21-hasel',
        name: '33 hasła: Standard Opieki Okołoporodowej 2026 oraz Baza Wiedzy ze Stemplami Weryfikacji',
        hasDefinedTerm: KNOWLEDGE_ENTRIES.map((entry) => ({
          '@type': 'DefinedTerm',
           '@id': `https://happybirth.pl/dla-ciebie#${entry.id}`,
          name: entry.title,
          description: entry.summary,
          termCode: `HB-STD-2026-${String(entry.number).padStart(2, '0')}`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://happybirth.pl/dla-ciebie#faq',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'HappyBirth.pl — Szkoła Rodzenia Online',
            item: 'https://happybirth.pl/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Dla Ciebie — Baza Wiedzy i Praw Rodziców 2026',
            item: 'https://happybirth.pl/dla-ciebie',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] selection:bg-[#EC008C]/20 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchemaJsonLd) }}
      />

      {/* Górna Nawigacja */}
      <header className="border-b border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4]/95 dark:bg-[#1A0619]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group text-xs sm:text-sm font-semibold text-[#544A44] dark:text-[#EAD5E5] hover:text-[#DA0271]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Wróć do strony głównej</span>
          </Link>

          <Link href="/" className="shrink-0">
            <Logo className="h-9 w-auto object-contain" priority />
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/program"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE3DB] dark:border-[#3A1038] text-xs font-bold text-[#250A24] dark:text-[#EAD5E5] hover:border-[#DA0271] transition-colors"
            >
              <span>Spis 52 lekcji</span>
            </Link>
            <Link
              href="/#cena"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white text-xs sm:text-sm font-bold transition-all"
            >
              <span>Kup kurs · 489,00 zł</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14">
        {/* Okruszki (Breadcrumbs) */}
        <nav aria-label="Ścieżka nawigacji" className="text-xs text-[#867A72] dark:text-[#A2958C] flex items-center gap-2">
          <Link href="/" className="hover:text-[#DA0271] underline">
            Strona główna
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#250A24] dark:text-[#EAD5E5]">
            Dla Ciebie · Wiedza i Prawa Rodziców 2026
          </span>
        </nav>

        {/* Sekcja Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3A1038] border border-[#F3CAD9] dark:border-[#5D1A59] text-xs font-bold text-[#DA0271] dark:text-[#FF85C0]">
              <Scale className="w-3.5 h-3.5" />
              <span>Kompendium Edukacyjno-Prawne · Stan prawny od 7 maja 2026 r.</span>
            </div>

            <h1 className="font-brand-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#250A24] dark:text-white tracking-tight leading-[1.08]">
              Dużo przydatnej wiedzy.{' '}
              <span className="font-brand-serif italic font-normal text-[#DA0271]">
                Twoje prawa i standard 2026 prostym językiem.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#544A44] dark:text-[#EAD5E5] leading-relaxed max-w-3xl">
              Zebraliśmy w jednym miejscu <strong>21 praw ze Standardu Organizacyjnego Opieki Okołoporodowej</strong> (obowiązującego od <strong>7 maja 2026 roku</strong>, Dz.U. 2025 poz. 1525) oraz <strong>12 praktycznych haseł</strong> z naszego cyklu sprawdzania faktów i mitów (oznaczonych 4 stemplami: <strong>FAKT, MIT, SPÓR, NIE WIADOMO</strong>) — łącznie 33 hasła dla rodziców i bliskich.
            </p>
          </div>

          <div className="lg:col-span-5">
            <figure className="hb-kadr-editorial hb-kadr-ramka aspect-[4/3]">
              <img
                src="/img/editorial/hb-mama-poranna-herbata-dom.jpg"
                alt="Przyszła mama spokojnie czyta poradnik przy porannej herbacie w domu"
                className="w-full h-full object-cover"
                loading="eager"
                width={1200}
                height={900}
              />
            </figure>
          </div>
        </section>

        {/* Box TL;DR (Answer-First dla GEO / AEO / AI Overviews i szybkiego skanowania przez rodziców) */}
        <section
          aria-labelledby="tldr-heading"
          className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 sm:p-8 border-2 border-[#250A24]/15 dark:border-[#FECB22]/30 shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="tldr-heading"
              className="font-brand-display font-bold text-lg sm:text-xl text-[#250A24] dark:text-[#FECB22] flex items-center gap-2"
            >
              <Info className="w-5 h-5 text-[#DA0271]" />
              <span>W skrócie (Podsumowanie dla przyszłych rodziców):</span>
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FBF8F4] dark:bg-[#270B25] text-[#6E625A] dark:text-[#C5B5C3]">
              Aktualizacja: 2026 (Dz.U. 2025 poz. 1525)
            </span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-[#4A403A] dark:text-[#EAD5E5]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DA0271] shrink-0 mt-0.5" />
              <span>
                <strong>Podstawa prawna w Polsce:</strong> Rozporządzenie Ministra Zdrowia z 16.08.2018 r. (Dz.U. 2018 poz. 1756) znowelizowane rozporządzeniem z 23.10.2025 r. (Dz.U. 2025 poz. 1525), obowiązującym od <strong>7 maja 2026 r.</strong>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DA0271] shrink-0 mt-0.5" />
              <span>
                <strong>Edukacja od 1. wizyty i dla taty:</strong> Od maja 2026 r. edukacja przedporodowa przysługuje już od potwierdzenia ciąży (do 10. tygodnia) i wprost obejmuje także ojca dziecka.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DA0271] shrink-0 mt-0.5" />
              <span>
                <strong>Plan Porodu i Osoba Bliska:</strong> Twój Plan Porodu jest dokumentem dołączanym do dokumentacji szpitalnej, a wybrana osoba bliska może towarzyszyć Ci bez opłat.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#DA0271] shrink-0 mt-0.5" />
              <span>
                <strong>Posiłek, Ruch i 2h Skóra do Skóry:</strong> Masz prawo do swobody ruchu, klarownych płynów i lekkostrawnego posiłku oraz 2 godzin nieprzerwanego kontaktu skóra do skóry po narodzinach.
              </span>
            </li>
          </ul>
        </section>

        {/* Karta Weryfikacji Merytorycznej i Redakcyjnej (E-E-A-T Shield) */}
        <section
          aria-label="Karta weryfikacji merytorycznej i redakcyjnej"
          className="bg-[#250A24] text-white rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FECB22] uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Standard Redakcyjny i Doświadczenie Dydaktyczne</span>
              </div>
              <h2 className="font-brand-display font-bold text-xl sm:text-2xl">
                Kto opracował i zweryfikował tę bazę wiedzy?
              </h2>
            </div>
            <Link
              href="/o-nas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors shrink-0 self-start md:self-auto"
            >
              <span>Poznaj zespół Mama Gaja (od 2012 r.)</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[#FECB22] font-bold block">14 lat praktyki · 18 000+ rodzin</span>
              <p className="text-white/85 leading-relaxed">
                Treści powstały na bazie doświadczenia poznańskiej szkoły rodzenia <strong>Mama Gaja</strong>, działającej nieprzerwanie od 2012 roku, oraz zespołu dyplomowanych ekspertek.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[#FECB22] font-bold block">Źródła pierwotne (ISAP Sejm RP)</span>
              <p className="text-white/85 leading-relaxed">
                Każde z 21 haseł odwołuje się bezpośrednio do aktów opublikowanych w Dzienniku Ustaw RP (Dz.U. 2018 poz. 1756, Dz.U. 2025 poz. 1525 oraz Dz.U. 2009 nr 52 poz. 417).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-[#FECB22] font-bold block">Wydawca Edukacyjny (PKD 85.59.B)</span>
              <p className="text-white/85 leading-relaxed">
                Operatorem platformy jest <strong>KLARSOLUTIONS Sp. z o.o.</strong> z siedzibą w Poznaniu (ul. Śląska 14, KRS: 0001268396, NIP: 7812118273).
              </p>
            </div>
          </div>
        </section>

        {/* Trzy najważniejsze zmiany od 7 maja 2026 roku + Tabela porównawcza GEO */}
        <section aria-labelledby="zmiany-2026-heading" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Nowelizacja Dz.U. 2025 poz. 1525
            </span>
            <h2
              id="zmiany-2026-heading"
              className="font-brand-display font-bold text-2xl sm:text-4xl text-[#250A24] dark:text-white"
            >
              Trzy kluczowe zmiany w prawie od 7 maja 2026 roku
            </h2>
            <p className="text-sm sm:text-base text-[#544A44] dark:text-[#C5B5C3]">
              Sprawdźcie, co dokładnie zmieniło się w Standardzie Organizacyjnym Opieki Okołoporodowej i jak przekłada się to na Wasze przygotowania.
            </p>
          </div>

          {/* 3 Karty zmian */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FECB22] text-[#1A1512] text-xs font-bold">
                  1. NOWE · Edukacja dla dwojga od startu
                </span>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white">
                  Edukacja przedporodowa od pierwszej wizyty, także dla ojca dziecka
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Informację o edukacji przedporodowej otrzymujecie już na pierwszej wizycie potwierdzającej ciążę (do 10. tygodnia), a przepisy wprost obejmują nią również ojca dziecka.
                </p>
              </div>
              <a
                href="#edukacja-przedporodowa-od-pierwszej-wizyty"
                className="text-xs font-bold text-[#DA0271] hover:underline pt-2 inline-flex items-center gap-1"
              >
                <span>Przejdź do hasła #06 →</span>
              </a>
            </div>

            <div className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FAE3EB] text-[#DA0271] text-xs font-bold">
                  2. ZMIANA · Energia i nawodnienie
                </span>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white">
                  Lekkostrawne posiłki i klarowne płyny w czasie porodu
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Wcześniejszy przepis mówił ogólnie o możliwości jedzenia za zgodą personelu. Od 7 maja 2026 r. standard wprost wymienia prawo do klarownych płynów i lekkostrawnych posiłków.
                </p>
              </div>
              <a
                href="#lekkostrawne-posilki-i-plyny-w-porodzie-2026"
                className="text-xs font-bold text-[#DA0271] hover:underline pt-2 inline-flex items-center gap-1"
              >
                <span>Przejdź do hasła #12 →</span>
              </a>
            </div>

            <div className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#D0EBF3] text-[#0078AD] text-xs font-bold">
                  3. NOWE · Część XIV Standardu
                </span>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white">
                  Pełna dostępność dla kobiet ze szczególnymi potrzebami
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Nowa Część XIV standardu wprowadza gwarancje dostępności architektonicznej, cyfrowej, materiałów w tekście łatwym do czytania (ETR) oraz tłumacza Polskiego Języka Migowego (PJM).
                </p>
              </div>
              <a
                href="#dostepnosc-dla-kobiet-ze-szczegolnymi-potrzebami-2026"
                className="text-xs font-bold text-[#DA0271] hover:underline pt-2 inline-flex items-center gap-1"
              >
                <span>Przejdź do hasła #21 →</span>
              </a>
            </div>
          </div>

          {/* Semantyczna tabela porównawcza dla wyszukiwarek AI (GEO / Featured Snippets) */}
          <div className="overflow-x-auto rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081D] shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#250A24] text-white">
                  <th className="p-4 font-bold">Obszar regulacji</th>
                  <th className="p-4 font-bold">Stan przed 7 maja 2026 r.</th>
                  <th className="p-4 font-bold text-[#FECB22]">Nowy standard od 7 maja 2026 r. (Dz.U. 2025 poz. 1525)</th>
                  <th className="p-4 font-bold">Co to oznacza dla Was w praktyce?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DB] dark:divide-[#3A1038] text-[#4A403A] dark:text-[#EAD5E5]">
                <tr>
                  <td className="p-4 font-bold text-[#250A24] dark:text-white">Moment rozpoczęcia edukacji przedporodowej</td>
                  <td className="p-4">Skierowanie i ramowa edukacja zwyczajowo od 21. tygodnia ciąży.</td>
                  <td className="p-4 font-semibold">Informacja o edukacji już na pierwszej wizycie (do 10. tygodnia ciąży), wprost także dla ojca dziecka.</td>
                  <td className="p-4">Możecie spokojnie przygotowywać się we dwoje od pierwszego trymestru (np. w kursie online dla dwojga).</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#250A24] dark:text-white">Posiłki i nawodnienie w trakcie porodu</td>
                  <td className="p-4">Ogólny zapis o przyjmowaniu płynów i pokarmu zależnie od decyzji w placówce.</td>
                  <td className="p-4 font-semibold">Wyraźne prawo do klarownych płynów i lekkostrawnych posiłków (przy braku indywidualnych przeciwwskazań).</td>
                  <td className="p-4">Warto spakować do torby porodowej wodę z ustnikiem i lekkie przekąski energetyczne.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#250A24] dark:text-white">Informacja o metodach wspierających komfort</td>
                  <td className="p-4">Ogólny obowiązek informacyjny po przyjęciu do szpitala.</td>
                  <td className="p-4 font-semibold">Obowiązek jawnego udostępniania przez szpital pełnej informacji o stosowanych metodach łagodzenia doznań.</td>
                  <td className="p-4">Jeszcze przed wyborem szpitala możecie sprawdzić standardy danej placówki i zapisać swoje preferencje w Planie Porodu.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#250A24] dark:text-white">Dostępność dla osób ze szczególnymi potrzebami</td>
                  <td className="p-4">Brak wyodrębnionego rozdziału w standardzie okołoporodowym.</td>
                  <td className="p-4 font-semibold">Nowa Część XIV: dostępność architektoniczna, cyfrowa, materiały ETR, tłumacz PJM i wydłużony czas wizyt.</td>
                  <td className="p-4">Prawo do zgłoszenia indywidualnych potrzeb komunikacyjnych i organizacyjnych już w Planie Porodu.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interaktywna Encyklopedia 33 Haseł (SSR + Client Filtering) */}
        <section aria-labelledby="encyklopedia-heading" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Encyklopedia Praw, Standardu 2026 i Stempla Wiedzy
            </span>
            <h2
              id="encyklopedia-heading"
              className="font-brand-display font-bold text-2xl sm:text-4xl text-[#250A24] dark:text-white"
            >
              33 hasła w 12 kategoriach — prawo 2026 i 4 stemple weryfikacji wiedzy
            </h2>
            <p className="text-sm sm:text-base text-[#544A44] dark:text-[#C5B5C3]">
              Filtrujcie hasła według kategorii, wyszukujcie interesujące Was sytuacje i zapisujcie najważniejsze punkty na własnej liście podręcznej.
            </p>
          </div>

          <DlaCiebieExplorer entries={KNOWLEDGE_ENTRIES} categories={CATEGORIES} />
        </section>

        {/* Most do bezpłatnych narzędzi praktycznych i lekcji demonstracyjnej */}
        <section
          aria-labelledby="narzedzia-heading"
          className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 sm:p-10 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm space-y-6"
        >
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Bezpłatne narzędzia dla przyszłych rodziców
            </span>
            <h2
              id="narzedzia-heading"
              className="font-brand-display font-bold text-2xl sm:text-3xl text-[#250A24] dark:text-white"
            >
              Przełóżcie swoje prawa na gotowy plan działania
            </h2>
            <p className="text-sm text-[#544A44] dark:text-[#C5B5C3]">
              Zamiast pisać dokumenty od zera, skorzystajcie z naszych bezpłatnych narzędzi przygotowanych przez ekspertki ze szkoły rodzenia Mama Gaja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/plan-porodu"
              className="group p-6 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAE3EB] text-[#DA0271] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white group-hover:text-[#DA0271] transition-colors">
                  Kreator Planu Porodu (PDF)
                </h3>
                <p className="text-xs text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Zaznaczcie swoje preferencje zgodne ze standardem 2026 i pobierzcie gotowy dokument PDF do teczki szpitalnej.
                </p>
              </div>
              <span className="text-xs font-bold text-[#DA0271] inline-flex items-center gap-1 pt-2">
                <span>Otwórz kreator PDF →</span>
              </span>
            </Link>

            <Link
              href="/kalkulator-wyprawki"
              className="group p-6 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                  <Luggage className="w-5 h-5" />
                </div>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white group-hover:text-[#DA0271] transition-colors">
                  Kalkulator Torby i Wyprawki
                </h3>
                <p className="text-xs text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Interaktywna lista pakowania torby do szpitala w 3 strefach (na salę porodową, na oddział dla mamy i dla dziecka).
                </p>
              </div>
              <span className="text-xs font-bold text-[#DA0271] inline-flex items-center gap-1 pt-2">
                <span>Sprawdź listę do szpitala →</span>
              </span>
            </Link>

            <Link
              href="/kalkulator-macierzynski"
              className="group p-6 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white group-hover:text-[#DA0271] transition-colors">
                  Kalkulator Macierzyńskiego 2026
                </h3>
                <p className="text-xs text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Porównajcie wariant 81,5% oraz 100% + 70%, sprawdźcie 9 tygodni dla taty i pobierzcie harmonogram PDF.
                </p>
              </div>
              <span className="text-xs font-bold text-[#DA0271] inline-flex items-center gap-1 pt-2">
                <span>Oblicz zasiłek i urlop →</span>
              </span>
            </Link>

            <Link
              href="/#bezplatna-lekcja"
              className="group p-6 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#D0EBF3] text-[#0078AD] flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white group-hover:text-[#DA0271] transition-colors">
                  Bezpłatna Lekcja 1 (5 min 33 s)
                </h3>
                <p className="text-xs text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  Obejrzyjcie pierwszą lekcję naszego kursu bez zakładania konta i zobaczcie, jak wyglądają nasze nagrania dla dwojga.
                </p>
              </div>
              <span className="text-xs font-bold text-[#DA0271] inline-flex items-center gap-1 pt-2">
                <span>Odtwórz lekcję 1 bezpłatnie →</span>
              </span>
            </Link>
          </div>
        </section>

        {/* Sekcja Pytań i Odpowiedzi (AEO / GEO FAQ) */}
        <section aria-labelledby="faq-dla-ciebie-heading" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Najczęstsze pytania przyszłych rodziców (FAQ)
            </span>
            <h2
              id="faq-dla-ciebie-heading"
              className="font-brand-display font-bold text-2xl sm:text-3xl text-[#250A24] dark:text-white"
            >
              Pytania o Standard Opieki Okołoporodowej 2026
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-[#1E081D] rounded-2xl border border-[#EAE3DB] dark:border-[#3A1038] p-5"
              >
                <summary className="font-brand-display font-bold text-sm sm:text-base text-[#250A24] dark:text-white cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-[#DA0271] font-bold text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 pt-3 border-t border-[#EAE3DB] dark:border-[#3A1038] text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Wykaz oficjalnych źródeł prawnych (Trustworthiness / Citation Anchors) */}
        <section
          aria-labelledby="zrodla-heading"
          className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] dark:border-[#3A1038] space-y-4"
        >
          <h2
            id="zrodla-heading"
            className="font-brand-display font-bold text-lg sm:text-xl text-[#250A24] dark:text-white flex items-center gap-2"
          >
            <Scale className="w-5 h-5 text-[#0097DB]" />
            <span>Oficjalne źródła aktów prawnych (ISAP Sejm RP i Rzecznik Praw Pacjenta)</span>
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3]">
            <li className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-[#0097DB] shrink-0 mt-0.5" />
              <a
                href={ISAP_NOWELIZACJA_2025}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#DA0271] underline"
              >
                Rozporządzenie Ministra Zdrowia z dnia 23 października 2025 r. zmieniające rozporządzenie w sprawie standardu organizacyjnego opieki okołoporodowej (Dz.U. 2025 poz. 1525 — obowiązuje od 7 maja 2026 r.)
              </a>
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-[#0097DB] shrink-0 mt-0.5" />
              <a
                href={ISAP_STANDARD_2018}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#DA0271] underline"
              >
                Rozporządzenie Ministra Zdrowia z dnia 16 sierpnia 2018 r. w sprawie standardu organizacyjnego opieki okołoporodowej (Dz.U. 2018 poz. 1756)
              </a>
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-[#0097DB] shrink-0 mt-0.5" />
              <a
                href={ISAP_USTAWA_PP}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#DA0271] underline"
              >
                Ustawa z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta (Dz.U. 2009 nr 52 poz. 417 ze zm.)
              </a>
            </li>
            <li className="flex items-start gap-2">
              <PhoneCall className="w-4 h-4 text-[#DA0271] shrink-0 mt-0.5" />
              <span>
                Telefoniczna Informacja Pacjenta (Rzecznik Praw Pacjenta / NFZ): bezpłatny numer{' '}
                <strong>800 190 590</strong>.
              </span>
            </li>
          </ul>
        </section>

        {/* Baner końcowy CTA do kursu */}
        <section className="rounded-3xl bg-[#250A24] text-white p-8 sm:p-12 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FECB22] text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Szkoła rodzenia online dla dwojga · 52 lekcje w 8 modułach</span>
          </div>
          <h2 className="font-brand-display font-bold text-2xl sm:text-4xl max-w-2xl mx-auto leading-tight">
            Chcecie przejść przez ciążę, poród i pierwszy rok spokojnie, tydzień po tygodniu?
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Wszystkie 52 lekcje wideo (prawie 5 godzin nagrań z dyplomowanymi ekspertkami ze szkoły rodzenia Mama Gaja) są dostępne od pierwszego dnia przez 18 miesięcy (548 dni) dla Was obojga.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/#cena"
              className="px-7 py-3.5 rounded-2xl bg-[#DA0271] hover:bg-[#C00265] text-white font-bold text-sm transition-all shadow-lg"
            >
              Kup dostęp dla dwojga · 489,00 zł
            </Link>
            <Link
              href="/program"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Zobacz pełną listę 52 lekcji
            </Link>
          </div>
        </section>

        {/* Pełne Zastrzeżenie Edukacyjne (Zgodne z 04-prawo/zastrzezenie-edukacyjne.md) */}
        <aside
          aria-label="Zastrzeżenie edukacyjne"
          className="p-6 rounded-2xl bg-[#F5EFE8] dark:bg-[#1E081D] border border-[#EAE3DB] dark:border-[#3A1038] text-xs text-[#544A44] dark:text-[#C5B5C3] leading-relaxed space-y-2"
        >
          <p className="font-bold text-[#250A24] dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DA0271]" />
            <span>Informacja o charakterze edukacyjnym materiałów (PKD 85.59.B):</span>
          </p>
          <p>
            Materiały HappyBirth mają charakter edukacyjny. Nie są świadczeniem zdrowotnym, nie zawierają diagnozy ani porady medycznej i nie zastępują opieki lekarza ani innej osoby wykonującej zawód medyczny, która prowadzi ciążę. Jeśli coś Cię niepokoi, skontaktuj się z lekarzem albo z osobą prowadzącą ciążę. W sytuacji zagrożenia zdrowia lub życia dzwoń pod numer <strong>112</strong>.
          </p>
        </aside>
      </main>

      {/* Stopka */}
      <footer className="border-t border-[#EAE3DB] dark:border-[#3A1038] py-8 px-4 sm:px-6 text-center text-xs text-[#867A72] dark:text-[#A2958C] space-y-2">
        <p>
          KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ · ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link href="/" className="hover:text-[#DA0271] underline">
            Strona główna
          </Link>
          <Link href="/program" className="hover:text-[#DA0271] underline">
            Program 52 lekcji
          </Link>
          <Link href="/o-nas" className="hover:text-[#DA0271] underline">
            O nas
          </Link>
          <Link href="/regulamin" className="hover:text-[#DA0271] underline">
            Regulamin
          </Link>
          <Link href="/polityka-prywatnosci" className="hover:text-[#DA0271] underline">
            Polityka prywatności
          </Link>
        </div>
      </footer>
    </div>
  );
}
