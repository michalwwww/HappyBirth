// HappyBirth · teksty strony v3 (nagłówek, stopka, strona główna) w trzech językach.
// Źródło polskich tekstów: copy deck z 10 października 2026 (nasza wersja v1) i poprawki Maćka.
// Reguły: mówimy do dwojga, bez myślników, bez zdrobnień, bez obietnic przebiegu porodu,
// liczby kanoniczne (52 lekcje, 8 modułów, 489 zł, 18 miesięcy od zakupu jak w regulaminie,
// 14 lat i 18 000+ urodzeń wyłącznie jako dane stacjonarnej szkoły rodzenia założonej w 2012 roku).
// Poprawki z 13.10.2026: bez „Cudów nie obiecujemy”, bez „Happy Birth.” przed claimem, bez nazwy szkoły.
// Poprawki z 04.11.2026: hero „Szkoła rodzenia w Twoim domu”, bez paska z napisem w ruchu, menu
// O nas, Program, Wiedza, Pytania, Strefa kursu, przycisk DOŁĄCZ TERAZ, Ustawienia w jednym miejscu,
// oś czasu z pięcioma równymi obszarami, zakup na kolorze z zgodami, nowa stopka, bez pasa zakupu.
// Runda X1 (05.11.2026): menu O nas, Program, Dla Ciebie, Pytania, Strefa mamy; tytuły bez kropek;
// DOŁĄCZ DO NAS JUŻ DZISIAJ w hero; przykładowy bezpłatny odcinek; zakup: 489 zł, hasła jak tablica
// odlotów, NIEZBĘDNIK zamiast Pakietu PORODÓWKA, DOŁĄCZAM DZISIAJ, claim i trzy zdania z podpisem.

import type { Language } from '@/lib/i18n';

export const CENA = 489;

export interface ShellCopy {
  skip: string;
  nav: { oNas: string; program: string; wiedza: string; pytania: string; strefa: string; dolacz: string };
  navLabel: string;
  menuOpen: string;
  menuClose: string;
  ustawienia: { label: string; a11y: string; ciemny: string; jasny: string; jezyk: string; tryb: string; dzien: string; noc: string; paleta: string };
  homeLabel: string;
  footer: {
    claim: string;
    social: string;
    kolumny: { kurs: string; wspolpraca: string; dokumenty: string };
    linki: {
      lekcje: string;
      bezplatna: string;
      plan: string;
      kalkulator: string;
      strefa: string;
      oNas: string;
      afiliacja: string;
      b2b: string;
      regulamin: string;
      prywatnosc: string;
      cookies: string;
      odstap: string;
    };
    firma: string;
    uwaga: string;
  };
}

// tekst: wartość bez doliczania (np. 24/7), wtedy n służy tylko jako zapas dla czytników
export interface Stat { n: number; plus?: boolean; label: string; tekst?: string }
export type StageId = 'p1' | 'p2' | 'p3' | 'pn' | 'p4';
export interface Stage { id: StageId; tytul: string; zakres: string; hasla: string[] }
export interface Faq { q: string; a: string }

export interface LiczbyCopy { label: string; stats: Stat[] }

export interface HomeCopy {
  hero: {
    t1: string;
    t2: string;
    lead: string[];
    cta: string;
    karuzela: string;
    kadr: string;
    pokazKadr: string;
    pauza: string;
    wznow: string;
    alty: string[];
  };
  mapa: {
    tytul: string;
    etapy: Stage[];
    jednostki: { tydzien: string; miesiac: string; narodziny: string };
    suwakLabel: string;
    wartosc: string;
  };
  lekcja: { tytul: string; lead: string; punkty: string[]; odtworz: string; tytulWideo: string };
  // Zakup, runda X4 (05.11.2026): moduł według zrzutu z notatkami Macieja. Lewa kolumna: odznaka,
  // tytuł (runda X5: jedno zdanie kursywą, jak cytat), lead, karta z pięcioma punktami pakietu i karta
  // z położną. Prawa kolumna: podsumowanie zamówienia (cena, kod, waluta, Niezbędnik, zgody, przycisk,
  // płatność, sprzedawca).
  cena: {
    naglowek: string;
    odznaka: string;
    tytul: string;
    lead: string;
    pakietTyt: string;
    pakiet: { t: string; o: string }[];
    cytat: string;
    doswOpis: string;
    odRoku: string;
    chipy: string[];
    fotoAlt: string;
    podsumowanie: string;
    brutto: string;
    cenaOpis: [string, string, string];
    razem: string;
    bump: { dodatek: string; nazwa: string; dodaj: string; opis: string; wersja: string; zagranica: string };
    zgodyTyt: string;
    zgodaRegulamin: [string, string, string, string, string];
    zgodaArt38: string;
    wymagane: string;
    bladZgody: string;
    kup: string;
    kupZero: string;
    ladowanie: string;
    platnosc: string;
    platnoscZagranica: string;
    sprzedawca: string;
    bladPlatnosci: string;
    bladPolaczenia: string;
    kod: {
      pytanie: string;
      placeholder: string;
      zastosuj: string;
      pusty: string;
      ok: string;
      okZero: string;
      sprawdzimy: string;
      blad: string;
      regularna: string;
      omnibus: string;
      usun: string;
    };
    waluta: { pytanie: string; tyt: string };
    zagranica: { pakiet: string; dopasowano: string };
  };
  faq: { tytul: string; leadPrzed: string; leadPo: string; items: Faq[] };
}

const SHELL_PL: ShellCopy = {
  skip: 'Przejdź do treści',
  nav: { oNas: 'O nas', program: 'Program', wiedza: 'Dla Ciebie', pytania: 'Pytania', strefa: 'Strefa mamy', dolacz: 'Dołącz teraz' },
  navLabel: 'Główna',
  menuOpen: 'Otwórz menu',
  menuClose: 'Zamknij menu',
  ustawienia: { label: 'Ustawienia', a11y: 'Ułatwienia dostępu', ciemny: 'Tryb ciemny', jasny: 'Tryb jasny', jezyk: 'Język', tryb: 'Tryb', dzien: 'Dzień', noc: 'Noc', paleta: 'Paleta' },
  homeLabel: 'HappyBirth, strona główna',
  footer: {
    claim: 'Doświadczenie mamy',
    social: 'HappyBirth w mediach społecznościowych',
    kolumny: { kurs: 'Kurs i narzędzia', wspolpraca: 'Współpraca i o nas', dokumenty: 'Dokumenty' },
    linki: {
      lekcje: 'Zobacz pełną listę 52 lekcji',
      bezplatna: 'Przykładowy bezpłatny odcinek',
      plan: 'Plan Porodu PDF',
      kalkulator: 'Kalkulator Wyprawki PDF',
      strefa: 'Strefa mamy',
      oNas: 'O nas',
      afiliacja: 'Program Afiliacyjny (Studenci i Partnerzy)',
      b2b: 'Współpraca B2B (Marki i Kliniki)',
      regulamin: 'Regulamin',
      prywatnosc: 'Polityka prywatności',
      cookies: 'Polityka cookies',
      odstap: 'Odstąp od umowy',
    },
    firma:
      'KLAR SOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN · kontakt@happybirth.pl',
    uwaga:
      'Na stronie wykorzystujemy wizualizacje wytworzone z pomocą narzędzi AI. Materiały mają charakter edukacyjny i nie zastępują porady lekarskiej. W nagłych wypadkach zawsze dzwoń na numer 112.',
  },
};

const SHELL_EN: ShellCopy = {
  skip: 'Skip to content',
  nav: { oNas: 'About us', program: 'Programme', wiedza: 'For you', pytania: 'Questions', strefa: "Mum's area", dolacz: 'Join now' },
  navLabel: 'Main',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  ustawienia: { label: 'Settings', a11y: 'Accessibility', ciemny: 'Dark mode', jasny: 'Light mode', jezyk: 'Language', tryb: 'Mode', dzien: 'Day', noc: 'Night', paleta: 'Palette' },
  homeLabel: 'HappyBirth, home page',
  footer: {
    claim: 'We have experience',
    social: 'HappyBirth on social media',
    kolumny: { kurs: 'Course and tools', wspolpraca: 'Partnerships and about us', dokumenty: 'Documents' },
    linki: {
      lekcje: 'See all 52 lessons',
      bezplatna: 'Free sample episode',
      plan: 'Birth plan PDF',
      kalkulator: 'Baby essentials calculator PDF',
      strefa: "Mum's area",
      oNas: 'About us',
      afiliacja: 'Affiliate programme (students and partners)',
      b2b: 'B2B partnerships (brands and clinics)',
      regulamin: 'Terms of service',
      prywatnosc: 'Privacy policy',
      cookies: 'Cookie policy',
      odstap: 'Withdraw from the contract',
    },
    firma:
      'KLAR SOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań, Poland · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · share capital: PLN 5,000.00 · kontakt@happybirth.pl',
    uwaga:
      'This website uses visualisations created with AI tools. The materials are educational and do not replace medical advice. In an emergency, always call 112.',
  },
};

const SHELL_RU: ShellCopy = {
  skip: 'Перейти к содержанию',
  nav: { oNas: 'О нас', program: 'Программа', wiedza: 'Для вас', pytania: 'Вопросы', strefa: 'Зона мамы', dolacz: 'Присоединиться' },
  navLabel: 'Главное меню',
  menuOpen: 'Открыть меню',
  menuClose: 'Закрыть меню',
  ustawienia: { label: 'Настройки', a11y: 'Специальные возможности', ciemny: 'Тёмная тема', jasny: 'Светлая тема', jezyk: 'Язык', tryb: 'Режим', dzien: 'День', noc: 'Ночь', paleta: 'Палитра' },
  homeLabel: 'HappyBirth, главная страница',
  footer: {
    claim: 'Опыт у нас есть',
    social: 'HappyBirth в социальных сетях',
    kolumny: { kurs: 'Курс и инструменты', wspolpraca: 'Сотрудничество и о нас', dokumenty: 'Документы' },
    linki: {
      lekcje: 'Все 52 урока',
      bezplatna: 'Бесплатный пример урока',
      plan: 'План родов PDF',
      kalkulator: 'Калькулятор приданого PDF',
      strefa: 'Зона мамы',
      oNas: 'О нас',
      afiliacja: 'Партнёрская программа (студенты и партнёры)',
      b2b: 'Сотрудничество B2B (бренды и клиники)',
      regulamin: 'Правила',
      prywatnosc: 'Политика конфиденциальности',
      cookies: 'Политика cookies',
      odstap: 'Отказ от договора',
    },
    firma:
      'KLAR SOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Познань, Польша · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · уставный капитал: 5 000,00 PLN · kontakt@happybirth.pl',
    uwaga:
      'На сайте используются визуализации, созданные с помощью инструментов ИИ. Материалы носят образовательный характер и не заменяют консультацию врача. В экстренных случаях всегда звоните 112.',
  },
};

export const SHELL: Record<Language, ShellCopy> = { pl: SHELL_PL, en: SHELL_EN, ru: SHELL_RU };

const HOME_PL: HomeCopy = {
  hero: {
    t1: 'Szkoła rodzenia',
    t2: 'w Twoim domu',
    lead: [
      'Od 2012 roku edukujemy i wspieramy przyszłych rodziców.',
      'Już od pierwszych dni ciąży aż do pierwszych urodzin dziecka.',
      'Oglądać możecie wspólnie, kiedy tylko macie czas i ochotę.',
    ],
    cta: 'Dołącz do nas już dzisiaj',
    karuzela: 'Kadry z kursu HappyBirth',
    kadr: 'Kadr {n} z {razem}',
    pokazKadr: 'Pokaż kadr {n}',
    pauza: 'Zatrzymaj pokaz zdjęć',
    wznow: 'Wznów pokaz zdjęć',
    alty: [
      'Para na kanapie ogląda razem lekcję na tablecie',
      'Partner siedzi za partnerką na piłce i masuje jej ramiona',
      'Ojciec w fotelu trzyma śpiące niemowlę przy piersi',
      'Para przy stole ogląda wieczorem lekcję na laptopie',
    ],
  },
  mapa: {
    tytul: 'Od pierwszego dnia do pierwszych urodzin',
    etapy: [
      { id: 'p1', tytul: 'Dwie kreski', zakres: 'Tydzień 1 do 13', hasla: ['Kalendarz badań', 'Samopoczucie', 'Sygnały, które warto znać'] },
      { id: 'p2', tytul: 'Złoty trymestr', zakres: 'Tydzień 14 do 27', hasla: ['Ruchy dziecka', 'Bezpieczny ruch', 'Zdrowy sen'] },
      { id: 'p3', tytul: 'Czas przygotowań', zakres: 'Tydzień 28 do porodu', hasla: ['Wyprawka', 'Plan porodu', 'Torba do szpitala'] },
      { id: 'pn', tytul: 'Dzień narodzin', zakres: 'Poród i pierwsze godziny', hasla: ['Oddech i pozycje', 'Wsparcie osoby towarzyszącej', 'Pierwsza godzina z dzieckiem'] },
      { id: 'p4', tytul: 'Pierwszy rok', zakres: 'Od noworodka do pierwszych urodzin', hasla: ['Połóg i regeneracja', 'Karmienie i pielęgnacja', 'Bezpieczny sen'] },
    ],
    jednostki: { tydzien: 'Tydzień {n}', miesiac: 'Miesiąc {n}', narodziny: 'Dzień narodzin' },
    suwakLabel: 'Przesuńcie suwak na swój tydzień ciąży albo miesiąc z dzieckiem',
    wartosc: '{punkt}, {etap}',
  },
  lekcja: {
    tytul: 'Przykładowy bezpłatny odcinek',
    lead: 'Już teraz obejrzyj jeden z naszych filmów',
    punkty: ['Bez konta ani podawania adresu e-mail', 'Posłuchaj profesjonalnych ekspertek', 'Konkretna, rzetelna wiedza w kilka minut', 'Przekonaj się, ile możesz zyskać'],
    odtworz: 'Odtwórz przykładowy odcinek',
    tytulWideo: 'Przykładowy bezpłatny odcinek kursu HappyBirth',
  },
  cena: {
    naglowek: 'Dołącz do kursu',
    odznaka: 'Szkoła rodzenia online · Dostęp dla dwojga',
    tytul: 'Dziecko, które nosisz pod\u00A0sercem, to cały świat',
    lead: 'Kompletny program od pierwszych tygodni ciąży, przez aktywny poród, aż po pierwszy rok z dzieckiem.',
    pakietTyt: 'Co dokładnie otrzymujesz w cenie kursu ({cena}):',
    pakiet: [
      { t: '52 lekcje wideo w jakości 4K (8 modułów)', o: 'Krótkie, konkretne odcinki, średnio około 5 minut, bez lania wody i dojazdów.' },
      { t: '18 miesięcy pełnego dostępu (548 dni)', o: 'Wystarcza na całą ciążę, poród, połóg oraz pierwszy rok życia dziecka.' },
      { t: 'Wspólny dostęp dla dwojga w cenie', o: 'Jedno konto dla Ciebie i partnera.' },
      { t: 'Narzędzia PDF i aplikacje w pakiecie', o: 'Kreator Planu Porodu, Notatnik Rodzica, Licznik Skurczów i checklisty.' },
      { t: 'Zero abonamentu i ukrytych opłat', o: 'Płacisz tylko raz. Brak automatycznego odnawiania subskrypcji.' },
    ],
    cytat: 'Z nami poznasz konkretne odpowiedzi na większość pytań.',
    doswOpis: 'Dotychczas zaufało nam ponad 18\u00A0000 mam i par w naszej stacjonarnej szkole rodzenia. Wszystkie lekcje nagrały dyplomowane ekspertki.',
    odRoku: 'Od 2012 roku',
    chipy: ['18\u00A0000+ przygotowanych rodzin', 'Standard Opieki MZ 2026 (ISAP)'],
    fotoAlt: 'Spokojna rozmowa z notatnikiem i wspierająca dłoń na brzuchu przyszłej mamy',
    podsumowanie: 'Podsumowanie zamówienia',
    brutto: 'Cena brutto (z 23% VAT)',
    cenaOpis: ['jednorazowo · bez abonamentu', '18 miesięcy dostępu dla dwojga', 'Natychmiastowe odblokowanie 24/7'],
    razem: 'kurs {kurs} + Niezbędnik {bump}',
    bump: {
      dodatek: '+ Dodatek specjalny · {cena}',
      nazwa: 'Niezbędnik',
      dodaj: '(Dodaj w PDF za +{cena})',
      opis: '4 karty dla Taty na salę porodową z instrukcjami krok po kroku, punkty ucisku krzyżowego, matryca decyzyjna B.R.A.I.N. oraz lista 3 reklamówek do szpitala. Wszystko w PDF, gotowe do wydruku.',
      wersja: '{rynek}: {tytul}',
      zagranica: 'Rodzisz za granicą? Dopasuj pakiet (UK/DE/NL)',
    },
    zgodyTyt: 'Wymagane zgody formalne przed przejściem do płatności:',
    zgodaRegulamin: ['Akceptuję ', 'Regulamin', ' oraz ', 'Politykę Prywatności', ''],
    zgodaArt38:
      'Tak, chcę otrzymać dostęp do kursu natychmiast po opłaceniu i zgodnie z art. 38 ust. 1 pkt 13 u.p.k. zgadzam się na utratę 14-dniowego prawa do odstąpienia od umowy',
    wymagane: 'pole wymagane',
    bladZgody: 'Zaznacz akceptację Regulaminu i zgodę na natychmiastowy dostęp, aby przejść do płatności.',
    kup: 'Kupuję dostęp teraz',
    kupZero: 'Odbierz dostęp · 0 zł',
    ladowanie: 'Łączymy z płatnością…',
    platnosc: 'Bezpieczna płatność Stripe: BLIK\u00A0· Karta\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    platnoscZagranica: 'Bezpieczna płatność Stripe: Karta\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    sprzedawca: 'Sprzedawca: KLARSOLUTIONS Sp. z o.o. (KRS\u00A00001268396) · Automatyczna faktura VAT\u00A023%',
    bladPlatnosci: 'Nie udało się otworzyć płatności. Spróbuj ponownie za chwilę.',
    bladPolaczenia: 'Brak połączenia z bramką płatności. Spróbuj ponownie za chwilę.',
    kod: {
      pytanie: 'Masz kod rabatowy? (-10%)',
      placeholder: 'Wpisz kod',
      zastosuj: 'Zastosuj',
      pusty: 'Wpisz kod rabatowy.',
      ok: 'Kod {kod} aktywny: kurs 10% taniej.',
      okZero: 'Kod {kod} aktywny. Do zapłaty: 0 zł.',
      sprawdzimy: 'Kod {kod} sprawdzimy przy płatności. Jeśli jest aktywny, cenę z rabatem zobaczysz na stronie płatności.',
      blad: 'Ten kod nie działa. Sprawdź pisownię albo usuń kod i przejdź do płatności bez niego.',
      regularna: 'Cena regularna kursu: {cena}.',
      omnibus: 'Najniższa cena z 30 dni przed obniżką: {cena}.',
      usun: 'Usuń kod',
    },
    waluta: { pytanie: 'Waluta: PLN / GBP / EUR / USD', tyt: 'Waluta płatności' },
    zagranica: { pakiet: 'Wersja Niezbędnika', dopasowano: 'Pakiet dopasowany do kraju: {rynek}' },
  },
  faq: {
    tytul: 'Pytania, które zadajecie najczęściej',
    leadPrzed: 'Masz inne ważne pytania? Pisz śmiało do nas na adres ',
    leadPo: '.',
    items: [
      { q: 'Czy kurs zastępuje szkołę rodzenia na sali?', a: 'Kurs obejmuje przygotowanie do porodu i do pierwszych miesięcy z dzieckiem, w formie lekcji wideo. Nie zastępuje spotkań na żywo ani wizyt kontrolnych. Możecie łączyć go z zajęciami na sali.' },
      { q: 'Ile trwa kurs i jak długo mamy dostęp?', a: '52 lekcje to prawie 5 godzin materiału wideo. Dostęp trwa 18 miesięcy od dnia zakupu. Do każdej lekcji możecie wracać dowolnie wiele razy.' },
      { q: 'Kiedy najlepiej zacząć?', a: 'Kiedy chcecie. Oś czasu na górze strony podpowiada, które lekcje przydają się w danym okresie, ale wszystkie są dostępne od pierwszego dnia. W lekcji 6 ekspertka wyjaśnia, dlaczego warto zacząć około 21. tygodnia ciąży.' },
      { q: 'Czy osoba towarzysząca ma dostęp?', a: 'Tak. Dostęp dla dwojga jest w cenie, bez dopłat.' },
      { q: 'Na czym oglądamy lekcje?', a: 'W przeglądarce na telefonie, tablecie albo komputerze. Wystarczy połączenie z internetem. Na telewizorze otworzycie kurs w jego przeglądarce albo przeniesiecie na niego obraz z telefonu lub tabletu funkcją dublowania ekranu.' },
      { q: 'Ile kosztuje kurs?', a: '489 zł, płatność jednorazowa, bez abonamentu i bez automatycznego odnawiania.' },
      { q: 'Jak szybko dostaniemy dostęp?', a: 'Od razu po płatności. Po opłaceniu zamówienia przechodzicie prosto do strefy kursu.' },
      { q: 'Czy kurs zastępuje konsultację z lekarzem lub wykwalifikowaną specjalistką?', a: 'Nie. Materiały mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej specjalistki. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112.' },
      { q: 'Kto przygotował lekcje?', a: 'Lekcje nagraliśmy z dyplomowanymi ekspertkami, na bazie wytycznych polskiej opieki okołoporodowej. Merytoryczną bazą jest szkoła rodzenia stacjonarna, założona w 2012 roku.' },
    ],
  },
};

const HOME_EN: HomeCopy = {
  hero: {
    t1: 'Antenatal classes',
    t2: 'in your own home',
    lead: [
      'Since 2012 we have been teaching and supporting expectant parents.',
      'From the very first days of pregnancy to your child’s first birthday.',
      'Watch together, whenever you have the time and feel like it.',
    ],
    cta: 'Join us today',
    karuzela: 'Scenes from the HappyBirth course',
    kadr: 'Scene {n} of {razem}',
    pokazKadr: 'Show scene {n}',
    pauza: 'Pause the slideshow',
    wznow: 'Resume the slideshow',
    alty: [
      'A couple on the sofa watching a lesson together on a tablet',
      'A partner sits behind the expectant mother on a ball and massages her shoulders',
      'A father in an armchair holds a sleeping newborn to his chest',
      'A couple at the table watching a lesson on a laptop in the evening',
    ],
  },
  mapa: {
    tytul: 'From day one to the first birthday',
    etapy: [
      { id: 'p1', tytul: 'Two lines', zakres: 'Weeks 1 to 13', hasla: ['Check-up calendar', 'Well-being', 'Signs worth knowing'] },
      { id: 'p2', tytul: 'Golden trimester', zakres: 'Weeks 14 to 27', hasla: ['Baby’s movements', 'Safe activity', 'Healthy sleep'] },
      { id: 'p3', tytul: 'Time to prepare', zakres: 'Week 28 to birth', hasla: ['Baby essentials', 'Birth plan', 'Hospital bag'] },
      { id: 'pn', tytul: 'Birth day', zakres: 'Labour and the first hours', hasla: ['Breathing and positions', 'Support from your birth partner', 'The first hour with your baby'] },
      { id: 'p4', tytul: 'First year', zakres: 'From newborn to first birthday', hasla: ['Recovery after birth', 'Feeding and care', 'Safe sleep'] },
    ],
    jednostki: { tydzien: 'Week {n}', miesiac: 'Month {n}', narodziny: 'Birth day' },
    suwakLabel: 'Move the slider to your week of pregnancy or month with your baby',
    wartosc: '{punkt}, {etap}',
  },
  lekcja: {
    tytul: 'Free sample episode',
    lead: 'Watch one of our films right now (in Polish)',
    punkty: ['No account and no email address needed', 'Listen to professional experts', 'Specific, reliable knowledge in a few minutes', 'See how much you can gain'],
    odtworz: 'Play the sample episode',
    tytulWideo: 'Free sample episode from the HappyBirth course',
  },
  cena: {
    naglowek: 'Join the course',
    odznaka: 'Online antenatal school · Access for two',
    tytul: 'The baby you are carrying is your whole world',
    lead: 'A complete programme from the first weeks of pregnancy, through active labour, to the first year with your baby.',
    pakietTyt: 'What exactly you get for the course price ({cena}):',
    pakiet: [
      { t: '52 video lessons in 4K (8 modules)', o: 'Short, focused episodes, around 5 minutes on average, with no waffle and no travel.' },
      { t: '18 months of full access (548 days)', o: 'Enough for the whole pregnancy, the birth, the postpartum period and your baby’s first year.' },
      { t: 'Shared access for two included', o: 'One account for you and your partner.' },
      { t: 'PDF tools and apps included', o: 'Birth Plan Creator, Parent’s Notebook, Contraction Counter and checklists.' },
      { t: 'No subscription and no hidden fees', o: 'You pay once. No automatic subscription renewal.' },
    ],
    cytat: 'With us you will find clear answers to most of your questions.',
    doswOpis: 'So far more than 18,000 mums and couples have trusted our in-person antenatal school. All lessons were recorded by qualified experts.',
    odRoku: 'Since 2012',
    chipy: ['18,000+ families prepared', 'Polish Ministry of Health Care Standard 2026 (ISAP)'],
    fotoAlt: 'A midwife with a notebook on her lap rests her hand gently on the belly of an expectant mother sitting beside her',
    podsumowanie: 'Order summary',
    brutto: 'Gross price (incl. 23% VAT)',
    cenaOpis: ['one-off · no subscription', '18 months of access for two', 'Instant unlock 24/7'],
    razem: 'course {kurs} + Essentials {bump}',
    bump: {
      dodatek: '+ Special add-on · {cena}',
      nazwa: 'Essentials',
      dodaj: '(Add the PDF for +{cena})',
      opis: '4 cards for Dad in the delivery room with step by step instructions, sacral counterpressure points, the B.R.A.I.N. decision matrix and a list of 3 bags for the hospital. All in PDF, ready to print.',
      wersja: '{rynek}: {tytul}',
      zagranica: 'Giving birth abroad? Match the pack (UK/DE/NL)',
    },
    zgodyTyt: 'Formal consents required before going to payment:',
    zgodaRegulamin: ['I accept the ', 'Terms of Service', ' and the ', 'Privacy Policy', ''],
    zgodaArt38:
      'Yes, I want access to the course immediately after payment and, in accordance with Article 38(1)(13) of the Polish Consumer Rights Act, I agree to lose my 14-day right of withdrawal',
    wymagane: 'required',
    bladZgody: 'Please accept the Terms of Service and agree to immediate access to continue to payment.',
    kup: 'Buy access now',
    kupZero: 'Claim access · 0 PLN',
    ladowanie: 'Connecting to payment…',
    platnosc: 'Secure Stripe payment: BLIK\u00A0· Card\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    platnoscZagranica: 'Secure Stripe payment: Card\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    sprzedawca: 'Seller: KLARSOLUTIONS Sp. z o.o. (KRS\u00A00001268396) · Automatic 23% VAT invoice',
    bladPlatnosci: 'We could not open the payment. Please try again in a moment.',
    bladPolaczenia: 'No connection to the payment gateway. Please try again in a moment.',
    kod: {
      pytanie: 'Have a discount code? (-10%)',
      placeholder: 'Enter code',
      zastosuj: 'Apply',
      pusty: 'Please enter a discount code.',
      ok: 'Code {kod} applied: 10% off the course.',
      okZero: 'Code {kod} applied. Amount due: 0 PLN.',
      sprawdzimy: 'We will check code {kod} at payment. If it is active, you will see the discounted price on the payment page.',
      blad: 'This code does not work. Check the spelling or remove the code and continue to payment without it.',
      regularna: 'Regular course price: {cena}.',
      omnibus: 'Lowest price in the 30 days before the discount: {cena}.',
      usun: 'Remove code',
    },
    waluta: { pytanie: 'Currency: PLN / GBP / EUR / USD', tyt: 'Payment currency' },
    zagranica: { pakiet: 'Essentials edition', dopasowano: 'Pack matched to: {rynek}' },
  },
  faq: {
    tytul: 'The questions you ask most often',
    leadPrzed: 'Have another important question? Feel free to write to us at ',
    leadPo: '.',
    items: [
      { q: 'Does the course replace classroom antenatal classes?', a: 'The course prepares you for birth and for the first months with your child, in the form of video lessons. It does not replace live meetings or check-ups. You can combine it with classroom sessions.' },
      { q: 'How long is the course and how long do we have access?', a: '52 lessons make almost 5 hours of video. Access lasts 18 months from the date of purchase. You can return to every lesson as often as you like.' },
      { q: 'When is the best time to start?', a: 'Whenever you want. The timeline at the top of the page suggests which lessons are useful at each stage, but all of them are available from day one. In lesson 6 an expert explains why it is worth starting around week 21 of pregnancy.' },
      { q: 'Does the birth partner get access?', a: 'Yes. Access for two is included in the price, with no extra charge.' },
      { q: 'What do we watch the lessons on?', a: 'In the browser on a phone, tablet or computer. An internet connection is all you need. On a TV, open the course in its browser or mirror your phone or tablet screen to it.' },
      { q: 'How much does the course cost?', a: '489 PLN, a single payment, with no subscription and no automatic renewal.' },
      { q: 'How quickly do we get access?', a: 'Right after payment. Once the order is paid, you go straight to the course area.' },
      { q: 'Does the course replace a consultation with a doctor or a qualified specialist?', a: 'No. The materials are educational and do not replace advice from a doctor or a qualified specialist. In a health or life emergency, call 112.' },
      { q: 'Who prepared the lessons?', a: 'We recorded the lessons with qualified experts, based on Polish perinatal care guidelines. The content is grounded in a classroom antenatal school founded in 2012.' },
    ],
  },
};

const HOME_RU: HomeCopy = {
  hero: {
    t1: 'Школа подготовки к родам',
    t2: 'у вас дома',
    lead: [
      'С 2012 года мы обучаем и поддерживаем будущих родителей.',
      'С первых дней беременности до первого дня рождения ребёнка.',
      'Смотрите вместе, когда есть время и желание.',
    ],
    cta: 'Присоединяйтесь уже сегодня',
    karuzela: 'Кадры из курса HappyBirth',
    kadr: 'Кадр {n} из {razem}',
    pokazKadr: 'Показать кадр {n}',
    pauza: 'Остановить показ фотографий',
    wznow: 'Продолжить показ фотографий',
    alty: [
      'Пара на диване вместе смотрит урок на планшете',
      'Партнёр сидит за будущей мамой на мяче и массирует ей плечи',
      'Отец в кресле держит спящего новорождённого у груди',
      'Пара за столом вечером смотрит урок на ноутбуке',
    ],
  },
  mapa: {
    tytul: 'От первого дня до первого дня рождения',
    etapy: [
      { id: 'p1', tytul: 'Две полоски', zakres: 'Недели с 1 по 13', hasla: ['Календарь обследований', 'Самочувствие', 'Сигналы, которые важно знать'] },
      { id: 'p2', tytul: 'Золотой триместр', zakres: 'Недели с 14 по 27', hasla: ['Движения ребёнка', 'Безопасная активность', 'Здоровый сон'] },
      { id: 'p3', tytul: 'Время подготовки', zakres: 'С 28 недели до родов', hasla: ['Приданое', 'План родов', 'Сумка в роддом'] },
      { id: 'pn', tytul: 'День родов', zakres: 'Роды и первые часы', hasla: ['Дыхание и позы', 'Поддержка партнёра', 'Первый час с малышом'] },
      { id: 'p4', tytul: 'Первый год', zakres: 'От новорождённого до первого дня рождения', hasla: ['Восстановление после родов', 'Кормление и уход', 'Безопасный сон'] },
    ],
    jednostki: { tydzien: 'Неделя {n}', miesiac: 'Месяц {n}', narodziny: 'День родов' },
    suwakLabel: 'Передвиньте ползунок на свою неделю беременности или месяц с ребёнком',
    wartosc: '{punkt}, {etap}',
  },
  lekcja: {
    tytul: 'Бесплатный пробный выпуск',
    lead: 'Посмотрите один из наших фильмов уже сейчас (на польском языке)',
    punkty: ['Без регистрации и без адреса электронной почты', 'Послушайте профессиональных специалисток', 'Конкретные, надёжные знания за несколько минут', 'Убедитесь, сколько вы можете получить'],
    odtworz: 'Смотреть пробный выпуск',
    tytulWideo: 'Бесплатный пробный выпуск курса HappyBirth',
  },
  cena: {
    naglowek: 'Присоединяйтесь к курсу',
    odznaka: 'Онлайн-школа подготовки к родам · Доступ для двоих',
    tytul: 'Ребёнок, которого вы носите под\u00A0сердцем, это целый мир',
    lead: 'Полная программа с первых недель беременности, через активные роды, до первого года с ребёнком.',
    pakietTyt: 'Что именно вы получаете за стоимость курса ({cena}):',
    pakiet: [
      { t: '52 видеоурока в качестве 4K (8 модулей)', o: 'Короткие, конкретные эпизоды, в среднем около 5 минут, без воды и без поездок.' },
      { t: '18 месяцев полного доступа (548 дней)', o: 'Хватает на всю беременность, роды, послеродовой период и первый год жизни ребёнка.' },
      { t: 'Общий доступ для двоих в стоимости', o: 'Один аккаунт для вас и партнёра.' },
      { t: 'PDF-инструменты и приложения в комплекте', o: 'Конструктор плана родов, Блокнот родителя, Счётчик схваток и чек-листы.' },
      { t: 'Никакой подписки и скрытых платежей', o: 'Платите один раз. Без автоматического продления подписки.' },
    ],
    cytat: 'С нами вы найдёте конкретные ответы на большинство вопросов.',
    doswOpis: 'Нашей очной школе подготовки к родам уже доверились более 18\u00A0000 мам и пар. Все уроки записали дипломированные специалистки.',
    odRoku: 'С 2012 года',
    chipy: ['18\u00A0000+ подготовленных семей', 'Стандарт помощи Минздрава Польши 2026 (ISAP)'],
    fotoAlt: 'Спокойная беседа с блокнотом и поддерживающая ладонь на животе будущей мамы',
    podsumowanie: 'Итог заказа',
    brutto: 'Цена брутто (с 23% НДС)',
    cenaOpis: ['разово · без подписки', '18 месяцев доступа для двоих', 'Мгновенная разблокировка 24/7'],
    razem: 'курс {kurs} + Набор {bump}',
    bump: {
      dodatek: '+ Специальное дополнение · {cena}',
      nazwa: 'Набор',
      dodaj: '(Добавить PDF за +{cena})',
      opis: '4 карточки для папы в родзале с пошаговыми инструкциями, точки крестцового давления, матрица решений B.R.A.I.N. и список 3 пакетов в роддом. Всё в PDF, готово к печати.',
      wersja: '{rynek}: {tytul}',
      zagranica: 'Рожаете за границей? Подберите пакет (UK/DE/NL)',
    },
    zgodyTyt: 'Обязательные формальные согласия перед переходом к оплате:',
    zgodaRegulamin: ['Я принимаю ', 'Правила', ' и ', 'Политику конфиденциальности', ''],
    zgodaArt38:
      'Да, я хочу получить доступ к курсу сразу после оплаты и в соответствии со ст. 38 п. 1 пп. 13 польского закона о правах потребителей соглашаюсь на утрату 14-дневного права на отказ от договора',
    wymagane: 'обязательное поле',
    bladZgody: 'Примите Правила и согласие на немедленный доступ, чтобы перейти к оплате.',
    kup: 'Покупаю доступ сейчас',
    kupZero: 'Получить доступ · 0 зл',
    ladowanie: 'Подключаем оплату…',
    platnosc: 'Безопасная оплата Stripe: BLIK\u00A0· Карта\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    platnoscZagranica: 'Безопасная оплата Stripe: Карта\u00A0· Apple\u00A0Pay / Google\u00A0Pay',
    sprzedawca: 'Продавец: KLARSOLUTIONS Sp. z o.o. (KRS\u00A00001268396) · Автоматический счёт-фактура с НДС\u00A023%',
    bladPlatnosci: 'Не удалось открыть оплату. Попробуйте ещё раз через минуту.',
    bladPolaczenia: 'Нет связи с платёжным шлюзом. Попробуйте ещё раз через минуту.',
    kod: {
      pytanie: 'Есть промокод? (-10%)',
      placeholder: 'Введите код',
      zastosuj: 'Применить',
      pusty: 'Введите промокод.',
      ok: 'Код {kod} применён: курс на 10% дешевле.',
      okZero: 'Код {kod} применён. К оплате: 0 зл.',
      sprawdzimy: 'Код {kod} проверим при оплате. Если он действует, цену со скидкой вы увидите на странице оплаты.',
      blad: 'Этот код не действует. Проверьте написание или удалите код и перейдите к оплате без него.',
      regularna: 'Обычная цена курса: {cena}.',
      omnibus: 'Самая низкая цена за 30 дней до скидки: {cena}.',
      usun: 'Удалить код',
    },
    waluta: { pytanie: 'Валюта: PLN / GBP / EUR / USD', tyt: 'Валюта оплаты' },
    zagranica: { pakiet: 'Версия набора', dopasowano: 'Пакет подобран для: {rynek}' },
  },
  faq: {
    tytul: 'Вопросы, которые задают чаще всего',
    leadPrzed: 'Есть другие важные вопросы? Смело пишите нам на ',
    leadPo: '.',
    items: [
      { q: 'Заменяет ли курс очные занятия в школе для будущих родителей?', a: 'Курс готовит к родам и первым месяцам с ребёнком в формате видеоуроков. Он не заменяет живые встречи и плановые визиты. Его можно совмещать с занятиями в зале.' },
      { q: 'Сколько длится курс и как долго действует доступ?', a: '52 урока это почти 5 часов видео. Доступ действует 18 месяцев со дня покупки. К каждому уроку можно возвращаться сколько угодно раз.' },
      { q: 'Когда лучше начать?', a: 'Когда захотите. Шкала времени вверху страницы подсказывает, какие уроки полезны на каждом этапе, но все они доступны с первого дня. В уроке 6 специалистка объясняет, почему стоит начать примерно с 21 недели беременности.' },
      { q: 'Есть ли доступ у партнёра?', a: 'Да. Доступ для двоих входит в цену, без доплат.' },
      { q: 'На чём смотреть уроки?', a: 'В браузере на телефоне, планшете или компьютере. Нужен только интернет. На телевизоре курс можно открыть в его браузере или вывести на него изображение с телефона или планшета через повтор экрана.' },
      { q: 'Сколько стоит курс?', a: '489 зл, единоразовый платёж, без подписки и без автоматического продления.' },
      { q: 'Как быстро мы получим доступ?', a: 'Сразу после оплаты. После оплаты заказа вы переходите прямо в учебную зону.' },
      { q: 'Заменяет ли курс консультацию врача или квалифицированного специалиста?', a: 'Нет. Материалы носят образовательный характер и не заменяют консультацию врача или квалифицированного специалиста. При угрозе здоровью или жизни звоните 112.' },
      { q: 'Кто подготовил уроки?', a: 'Мы записали уроки с дипломированными специалистками на основе польских стандартов перинатальной помощи. Основа содержания это очная школа подготовки к родам, основанная в 2012 году.' },
    ],
  },
};

export const HOME: Record<Language, HomeCopy> = { pl: HOME_PL, en: HOME_EN, ru: HOME_RU };

export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
