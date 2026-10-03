'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { 
  Loader2, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Accessibility,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n, Language } from '@/lib/i18n';
import { is100PercentPromo, activateStudentAccessLocally } from '@/lib/promo';

interface DictContent {
  ribbonTitle: string;
  ribbonDesc: string;
  a11yBtn: string;
  haveAccount: string;
  enterZone: string;
  ticker: string[];
  nav: {
    program: string;
    week: string;
    trailer: string;
    experts: string;
    faq: string;
    zone: string;
    cta: string;
  };
  hero: {
    title1: string;
    title2: string;
    lead: string;
    ctaBuy: string;
    ctaTrailer: string;
    facts: string[];
  };
  map: {
    kicker: string;
    title: string;
    lead: string;
    notice: string;
    sliderLabel: string;
    sliderFallback: string;
    stages: { title: string; range: string; m1: string; m2: string }[];
  };
  trailer: {
    kicker: string;
    title: string;
    lead: string;
    button: string;
    badge: string;
    points: string[];
    disclaimer: string;
    playerNote: string;
  };
  program: {
    kicker: string;
    title: string;
    titleSub: string;
    lead: string;
    topBtn: string;
    topSub: string;
    bottomTitle: string;
    bottomSub: string;
    bottomBtn: string;
    modules: { nr: number; title: string; meta: string; desc: string }[];
  };
  pricing: {
    kicker: string;
    title: string;
    titleSub: string;
    price: string;
    unit: string;
    features: string[];
    cta: string;
    promoTrigger: string;
    promoPlaceholder: string;
    promoApply: string;
    promoActive: string;
    trust: string;
    legal: string;
    whyTitle: string;
    reasons: { title: string; desc: string }[];
  };
  faq: {
    kicker: string;
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    desc: string;
    course: string;
    happybirth: string;
    docs: string;
    terms: string;
    privacy: string;
    cookies: string;
    affiliate: string;
    legalBar: string;
  };
}

const DICT: Record<Language, DictContent> = {
  pl: {
    ribbonTitle: 'Platforma Edukacyjna dla Kobiet w Ciąży:',
    ribbonDesc: '52 lekcje e-learning VOD · Twój spokój krok po kroku · Dostęp na 12 miesięcy',
    a11yBtn: 'Dostępność',
    haveAccount: 'Masz już konto?',
    enterZone: 'Wejdź do Strefy',
    ticker: [
      '52 profesjonalne lekcje wideo',
      'Spokój tydzień po tygodniu',
      'Oglądasz we własnym tempie',
      'Dostęp na 12 miesięcy',
      'Dyplomowane ekspertki i położne',
      'Wsparcie dla Ciebie i partnera',
    ],
    nav: {
      program: 'Co zyskujesz',
      week: 'Twój tydzień',
      trailer: 'Zwiastun kursu',
      experts: 'Opieka ekspertek',
      faq: 'Odpowiedzi na pytania',
      zone: 'Strefa kursantki',
      cta: 'Zadbaj o swój spokój · 489 zł',
    },
    hero: {
      title1: 'Szkoła rodzenia online dla Twojego spokoju.',
      title2: 'Krok po kroku, tydzień po tygodniu.',
      lead: '52 krótkie lekcje wideo nagrane z dyplomowanymi ekspertkami i położnymi. Od pierwszych tygodni ciąży, przez spokojny i świadomy poród, aż po pierwszy rok z maluszkiem. Oglądasz we własnym tempie, kiedy tylko masz siłę – a Twój partner może dołączyć w każdej chwili bez żadnych dopłat.',
      ctaBuy: 'Zadbaj o swój spokój · 489 zł',
      ctaTrailer: 'Zobacz zwiastun kursu',
      facts: [
        '52 konkretne lekcje po 5–7 minut',
        'Dostęp na 12 miesięcy dla Ciebie i partnera',
        '489 zł jednorazowo · Bez abonamentu',
      ],
    },
    map: {
      kicker: 'Mapa programu',
      title: 'Od pierwszych tygodni do pierwszych urodzin.',
      lead: 'Każdy etap ciąży przynosi inne pytania. Przesuń suwak na swój tydzień – podpowiemy Ci, od którego filmu zacząć, aby zachować spokój i pewność.',
      notice: 'To nie jest sztywny harmonogram. Wszystkie 52 lekcje otrzymujesz odblokowane od razu na 12 miesięcy i wracasz do nich w dowolnej kolejności.',
      sliderLabel: 'Przesuń suwak na swój obecny tydzień ciąży',
      sliderFallback: 'Suwak podpowiada, od którego filmu warto zacząć w danym tygodniu ciąży.',
      stages: [
        {
          title: 'Dwie kreski',
          range: 'tydzień 1 do 13',
          m1: 'Moduł 1. Twoja ciąża tydzień po tygodniu',
          m2: 'Moduł 2. Zdrowie, profilaktyka i samopoczucie',
        },
        {
          title: 'Wreszcie lepiej',
          range: 'tydzień 14 do 27',
          m1: 'Moduł 3. Komfort i aktywność na co dzień',
          m2: '',
        },
        {
          title: 'Torba spakowana',
          range: 'tydzień 28 do porodu',
          m1: 'Moduł 4. Projekt „Gniazdo”, wyprawka i pokój dziecka',
          m2: 'Moduł 5. Godzina „Zero”, świadomy i aktywny poród',
        },
        {
          title: 'Pierwszy rok',
          range: 'od dnia zero do pierwszych urodzin',
          m1: 'Moduł 6. Połóg, regeneracja i fizjoterapia mamy',
          m2: 'Moduł 7. Opieka nad noworodkiem i bezpieczeństwo',
        },
      ],
    },
    trailer: {
      kicker: 'Zwiastun kursu',
      title: 'Zobacz, jak wygląda kurs od środka.',
      lead: 'Krótki zwiastun złożony z fragmentów lekcji. Zobacz jakość nagrań w 4K, ciepły i spokojny sposób przekazywania wiedzy przez nasze dyplomowane ekspertki oraz atmosferę bezpieczeństwa, którą dla Ciebie stworzyłyśmy.',
      button: 'Odtwórz oficjalny zwiastun kursu',
      badge: 'Oficjalny zwiastun HappyBirth: Zobacz jakość nagrań i atmosferę lekcji',
      points: [
        'Dyplomowane położne i doradczynie z wieloletnim doświadczeniem szpitalnym',
        'Rzetelna wiedza medyczna bez straszenia i bez chaosu z internetu',
        'Krótkie lekcje po 5–7 minut dopasowane do Twojego dnia',
      ],
      disclaimer: 'Materiały edukacyjne przygotowane zgodnie ze Standardem Opieki Okołoporodowej. W sytuacji zagrożenia zdrowia lub życia dzwoń pod 112.',
      playerNote: 'Odtwarzacz Cloudflare Stream ładuje się dopiero po kliknięciu, szanując Twoją prywatność i szybkość transferu.',
    },
    program: {
      kicker: 'Program',
      title: '52 lekcje w 8 modułach.',
      titleSub: 'Prawie 5 godzin materiału wideo.',
      lead: 'Lekcje nagrane z dyplomowanymi ekspertkami i położnymi. Średni czas trwania to około 5 do 7 minut – oglądasz wtedy, kiedy masz wolną chwilę.',
      topBtn: 'Przejrzyj pełny program 52 lekcji dla siebie',
      topSub: 'Wszystkie 52 tematy i czasy trwania – sprawdź szczegółowo bez logowania',
      bottomTitle: 'Pełna lista 52 lekcji z czasem trwania',
      bottomSub: 'Każdy tytuł, długość i moduł dostępny bez logowania.',
      bottomBtn: 'Przejrzyj pełny program',
      modules: [
        { nr: 1, title: 'Twoja ciąża tydzień po tygodniu', meta: '5 lekcji · 18 min', desc: 'Jak zmienia się Twoje ciało i jak rozwija się dziecko, trymestr po trymestrze. Pierwsze decyzje, emocje, dzielenie się nowiną i przełamywanie mitów.' },
        { nr: 2, title: 'Zdrowie, profilaktyka i samopoczucie', meta: '7 lekcji · 34 min', desc: 'Kalendarz badań, samopoczucie na co dzień, radzenie sobie z dolegliwościami i sygnały, o których warto wiedzieć wcześniej.' },
        { nr: 3, title: 'Komfort i aktywność na co dzień', meta: '6 lekcji · 38 min', desc: 'Spokojny sen, bezpieczny ruch, ćwiczenia z fizjoterapeutką odciążające kręgosłup i miednicę oraz podróże w ciąży.' },
        { nr: 4, title: 'Projekt „Gniazdo”, wyprawka i kącik dziecka', meta: '7 lekcji · 44 min', desc: 'Świadome wybory: bezpieczny wózek, fotelik, łóżeczko, domowa apteczka i ubranka. Co warto kupić na start, a z czym poczekać.' },
        { nr: 5, title: 'Godzina „Zero”, świadomy i aktywny poród', meta: '9 lekcji · 54 min', desc: 'Plan porodu, torba do szpitala, zwiastuny rozpoczęcia akcji, oddech, pozycje wertykalne i konkretna rola osoby towarzyszącej.' },
        { nr: 6, title: 'Połóg, regeneracja i fizjoterapia mamy', meta: '5 lekcji · 32 min', desc: 'Pierwsze tygodnie po porodzie: czuła regeneracja, emocje, bezpieczny powrót do sprawności i szczere doświadczenia innych mam.' },
        { nr: 7, title: 'Opieka nad noworodkiem i bezpieczeństwo', meta: '9 lekcji · 44 min', desc: 'Pierwsze dni maluszka, instruktaż kąpieli i pielęgnacji krok po kroku, bezpieczny sen, profilaktyka zdrowia i pierwsza pomoc.' },
        { nr: 8, title: 'Karmienie, laktacja i wsparcie', meta: '4 lekcje · 24 min', desc: 'Technika przystawienia, wygodne pozycje, komfort brodawek, dobór akcesoriów i sprawdzone sposoby na trudniejsze wieczory.' },
      ],
    },
    pricing: {
      kicker: 'Cena',
      title: 'Jedna przejrzysta cena.',
      titleSub: 'Bez abonamentu.',
      price: '489 zł',
      unit: 'jednorazowo',
      features: [
        '52 filmowe lekcje w 8 modułach, prawie 5 godzin materiału wideo',
        'Dostęp dla Ciebie i osoby towarzyszącej bez żadnych dopłat',
        '12 miesięcy nielimitowanego dostępu od terminu porodu',
        'Notatnik Rodzica PDF, karty pracy i checklisty wyprawkowe',
        'Na telefonie, tablecie, komputerze i TV w przeglądarce',
      ],
      cta: 'Chcę zyskać spokój i pewność · 489 zł',
      promoTrigger: 'Masz kod rabatowy lub promocyjny?',
      promoPlaceholder: 'Wpisz kod (np. TEST100)',
      promoApply: 'Zastosuj',
      promoActive: 'Kod aktywny: Rabat 100% (cena końcowa: 0 zł)!',
      trust: 'BLIK · Karta płatnicza · Szybki przelew · Natychmiastowy dostęp',
      legal: 'Zgodnie z art. 38 pkt 13 Ustawy o prawach konsumenta, wyrażenie zgody na rozpoczęcie świadczenia przed upływem terminu do odstąpienia od umowy powoduje utratę prawa do odstąpienia. Faktura VAT 23% na życzenie.',
      whyTitle: 'Cztery powody, dla których to się zwraca.',
      reasons: [
        { title: 'Twój tydzień, Twoje tempo.', desc: 'Oglądasz dokładnie to, co przydaje się na Twoim obecnym etapie, a nie co akurat przerabia grupa na sali.' },
        { title: 'Krótki wieczór wystarczy.', desc: 'Lekcje trwają od 5 do 7 minut. Zmieścisz je nawet w dniu, w którym czujesz zmęczenie i brak sił.' },
        { title: 'Wsparcie osoby towarzyszącej.', desc: 'Pozycje, masaż, plan porodu i pakowanie torby. Partner ogląda te same lekcje bez dodatkowych opłat i wie, jak Ci pomóc.' },
        { title: 'Nie kończy się na porodzie.', desc: 'Bezpieczna kąpiel, opieka nad noworodkiem, karmienie i spokojny sen w pierwszym roku są w tym samym kursie.' },
      ],
    },
    faq: {
      kicker: 'Pytania',
      title: 'Odpowiedzi na najczęstsze pytania.',
      items: [
        { q: 'Czy kurs przygotuje mnie do porodu równie dobrze jak szkoła stacjonarna?', a: 'Tak. Kurs obejmuje kompletne przygotowanie do porodu, połogu i opieki nad noworodkiem w formie zwięzłych lekcji wideo z dyplomowanymi ekspertkami. Możesz uczyć się w domowym zaciszu, bez dojazdów i wracać do trudniejszych tematów tyle razy, ile potrzebujesz.' },
        { q: 'Kiedy najlepiej zacząć oglądać lekcje?', a: 'W dowolnym momencie. Wszystkie 52 lekcje otrzymujesz odblokowane od pierwszego dnia. Mapa programu na suwaku podpowiada, od czego zacząć w Twoim trymestrze, a dostęp trwa aż 12 miesięcy od przewidywanego terminu porodu.' },
        { q: 'Czy mój partner może oglądać kurs ze mną?', a: 'Oczywiście. Dostęp dla dwojga jest wliczony w cenę. Partner może logować się z własnego urządzenia i przerabiać dedykowane wskazówki dotyczące wsparcia w porodzie i opieki nad maluszkiem.' },
        { q: 'Na jakich urządzeniach mogę oglądać lekcje?', a: 'W dowolnej przeglądarce: na smartfonie, tablecie, laptopie oraz Smart TV. Odtwarzacz pamięta Twój postęp, więc możesz zacząć na telefonie, a dokończyć wieczorem na telewizorze.' },
        { q: 'Ile kosztuje kurs i czy są ukryte opłaty?', a: 'Cena to 489 zł płatne jednorazowo. Nie ma żadnych subskrypcji, automatycznych odnowień ani ukrytych opłat.' },
        { q: 'Jak szybko uzyskam dostęp po zakupie?', a: 'Automatycznie i natychmiast. Po zatwierdzeniu płatności BLIK, kartą lub kodem rabatowym zostaniesz od razu przekierowana do Strefy z pełnym dostępem do wszystkich 52 lekcji.' },
        { q: 'Czy kurs zastępuje wizytę u lekarza lub położnej?', a: 'Nie. HappyBirth to platforma edukacyjna przygotowująca do świadomego porodu i rodzicielstwa. Nie zastępuje indywidualnych badań lekarskich ani pilnej pomocy medycznej. W nagłych wypadkach dzwoń pod numer 112.' },
        { q: 'Kto przygotował lekcje merytorycznie?', a: 'Lekcje nagrałyśmy z dyplomowanymi położnymi, doradczyniami laktacyjnymi oraz fizjoterapeutkami z poznańskiej szkoły rodzenia Mama Gaja, działającej nieprzerwanie od 2012 roku.' },
      ],
    },
    footer: {
      desc: 'Szkoła rodzenia online dla Twojego spokoju. Od szkoły rodzenia Mama Gaja.',
      course: 'Kurs',
      happybirth: 'HappyBirth',
      docs: 'Dokumenty prawne',
      terms: 'Regulamin platformy',
      privacy: 'Polityka prywatności',
      cookies: 'Polityka cookies',
      affiliate: 'Strefa Partnera (Afiliacja B2B)',
      legalBar: 'Materiały HappyBirth mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej położnej. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112.',
    },
  },
  en: {
    ribbonTitle: 'Educational Platform for Expectant Mothers:',
    ribbonDesc: '52 VOD e-learning lessons · Calm step by step · 12 months access',
    a11yBtn: 'Accessibility',
    haveAccount: 'Already have an account?',
    enterZone: 'Enter Member Zone',
    ticker: [
      '52 professional video lessons',
      'Peace of mind week by week',
      'Watch at your own comfortable pace',
      '12 months unlimited access',
      'Certified midwives and specialists',
      'Full support for you and your partner',
    ],
    nav: {
      program: 'What you gain',
      week: 'Your week',
      trailer: 'Course trailer',
      experts: 'Expert care',
      faq: 'Questions & answers',
      zone: 'Student zone',
      cta: 'Secure your peace · 489 PLN',
    },
    hero: {
      title1: 'Online birth education for your peace of mind.',
      title2: 'Step by step, week by week.',
      lead: '52 concise video lessons recorded with certified midwives and specialists. From early pregnancy weeks, through calm and informed labor, to the first year with your baby. Learn at your own pace whenever you have energy – partner access is included at no extra charge.',
      ctaBuy: 'Secure your peace · 489 PLN',
      ctaTrailer: 'Watch course trailer',
      facts: [
        '52 concise lessons, 5–7 min each',
        '12 months access for you and partner',
        '489 PLN one-time · No subscription',
      ],
    },
    map: {
      kicker: 'Program Roadmap',
      title: 'From early pregnancy to the first birthday.',
      lead: 'Every pregnancy stage brings unique questions. Move the slider to your week – we will guide you on which video to start with for complete confidence.',
      notice: 'This is not a rigid schedule. All 52 lessons are unlocked from day one for 12 months, watchable in any order.',
      sliderLabel: 'Move slider to your current pregnancy week',
      sliderFallback: 'The slider recommends which lesson to start with for your specific week.',
      stages: [
        { title: 'Early Pregnancy', range: 'week 1 to 13', m1: 'Module 1. Pregnancy week by week', m2: 'Module 2. Health and wellness' },
        { title: 'Second Trimester', range: 'week 14 to 27', m1: 'Module 3. Daily comfort and movement', m2: '' },
        { title: 'Hospital Bag Packed', range: 'week 28 to birth', m1: 'Module 4. Nursery setup & essentials', m2: 'Module 5. Hour Zero: active labor' },
        { title: 'The First Year', range: 'day zero to 1st birthday', m1: 'Module 6. Postpartum recovery', m2: 'Module 7. Newborn care & safety' },
      ],
    },
    trailer: {
      kicker: 'Course Trailer',
      title: 'See what HappyBirth looks like inside.',
      lead: 'A short reel of lesson snippets. Discover our 4K video quality, the calm and compassionate teaching style of our certified specialists, and the safe atmosphere created for you.',
      button: 'Play official course trailer',
      badge: 'Official HappyBirth Trailer: 4K UHD video quality & reassuring atmosphere',
      points: [
        'Certified hospital-practicing midwives and lactation specialists',
        'Evidence-based knowledge without fear-mongering or internet chaos',
        'Short 5–7 minute bite-sized lessons suited to your daily routine',
      ],
      disclaimer: 'Educational materials in compliance with perinatal standards. In health emergencies call 112.',
      playerNote: 'Cloudflare Stream player loads only upon clicking, preserving your privacy and bandwidth.',
    },
    program: {
      kicker: 'Syllabus',
      title: '52 lessons in 8 modules.',
      titleSub: 'Nearly 5 hours of premium video.',
      lead: 'Recorded with certified experts and midwives. Each lesson lasts about 5 to 7 minutes – watch whenever you have a quiet moment.',
      topBtn: 'Explore the full 52-lesson syllabus',
      topSub: 'All 52 topics and durations – review freely without logging in',
      bottomTitle: 'Complete list of 52 lessons with durations',
      bottomSub: 'Every title, duration and module available without account.',
      bottomBtn: 'Explore full syllabus',
      modules: [
        { nr: 1, title: 'Your pregnancy week by week', meta: '5 lessons · 18 min', desc: 'How your body changes and your baby develops, trimester by trimester.' },
        { nr: 2, title: 'Health, prevention and well-being', meta: '7 lessons · 34 min', desc: 'Complete medical tests calendar, nutrition, managing common symptoms.' },
        { nr: 3, title: 'Comfort and active routine', meta: '6 lessons · 38 min', desc: 'Restful sleep, safe movement, pelvic and spine physical therapy exercises.' },
        { nr: 4, title: 'Nursery, layette and equipment', meta: '7 lessons · 44 min', desc: 'Smart essentials: safe stroller, car seat, crib, nursery setup and clothes.' },
        { nr: 5, title: 'Hour Zero: active & informed labor', meta: '9 lessons · 54 min', desc: 'Birth plan, hospital bag, breathing techniques, upright positions and partner role.' },
        { nr: 6, title: 'Postpartum recovery and physical therapy', meta: '5 lessons · 32 min', desc: 'First weeks after birth: gentle recovery, hormonal balance and honest experiences.' },
        { nr: 7, title: 'Newborn care, bathing & safety', meta: '9 lessons · 44 min', desc: 'Step-by-step bathing tutorial, umbilical cord care, safe sleep and first aid.' },
        { nr: 8, title: 'Feeding, lactation and support', meta: '4 lessons · 24 min', desc: 'Latch technique, comfortable positions, nipple comfort and soothing colics.' },
      ],
    },
    pricing: {
      kicker: 'Pricing',
      title: 'One transparent price.',
      titleSub: 'No subscription.',
      price: '489 PLN',
      unit: 'one-time',
      features: [
        '52 cinematic lessons in 8 modules, nearly 5 hours of video',
        'Full access for you and your partner with zero extra charges',
        '12 months unlimited access from baby due date',
        'Parent Workbook PDF, practical worksheets and checklists',
        'Stream on mobile, tablet, laptop and Smart TV in browser',
      ],
      cta: 'Secure peace of mind · 489 PLN',
      promoTrigger: 'Have a discount or promo code?',
      promoPlaceholder: 'Enter promo code (e.g. TEST100)',
      promoApply: 'Apply',
      promoActive: 'Promo code active: 100% discount (final: 0 PLN)!',
      trust: 'BLIK · Credit Card · Instant Bank Transfer · Immediate Access',
      legal: 'Pursuant to consumer protection laws, consent to begin digital performance results in loss of withdrawal right. VAT invoice available upon request.',
      whyTitle: 'Four reasons why this pays for itself.',
      reasons: [
        { title: 'Your week, your pace.', desc: 'Learn exactly what applies to your current week instead of what a physical group class covers.' },
        { title: 'A short evening is enough.', desc: 'Lessons last 5–7 minutes. Watchable even on days when you feel exhausted.' },
        { title: 'Partner gets clear actionable guidance.', desc: 'Breathing, massage, hospital bag and birth plan. Partner learns alongside you.' },
        { title: 'Does not end at delivery.', desc: 'Newborn bath, feeding, safe sleep and postpartum healing are included in the same course.' },
      ],
    },
    faq: {
      kicker: 'FAQ',
      title: 'Frequently asked questions.',
      items: [
        { q: 'Does this prepare me as well as an in-person birth class?', a: 'Yes. The curriculum covers comprehensive preparation for labor, postpartum, and newborn care in bite-sized video lessons by certified midwives. You learn comfortably at home and can re-watch any lesson whenever needed.' },
        { q: 'When should I start watching?', a: 'Whenever you wish. All 52 lessons are available from day one. The roadmap slider suggests where to start based on your trimester, with access lasting 12 months from your due date.' },
        { q: 'Can my partner watch with me?', a: 'Absolutely. Access for two is included in the price. Your partner can log in from their own device to watch dedicated partner guidance.' },
        { q: 'What devices can I watch on?', a: 'Any browser on your phone, tablet, computer or Smart TV. The player remembers your progress automatically.' },
        { q: 'How much does it cost and are there hidden fees?', a: '489 PLN one-time payment. Zero subscriptions, zero auto-renewals, zero hidden fees.' },
        { q: 'How quickly do I get access after payment?', a: 'Instantly. Once payment or promo code is verified, you are redirected immediately to your Member Zone.' },
        { q: 'Does this replace medical advice?', a: 'No. HappyBirth is an educational program. It does not replace medical consultation or urgent medical care. In emergencies call 112.' },
        { q: 'Who created the course content?', a: 'Recorded with certified midwives, lactation consultants and pelvic physical therapists from Mama Gaja birth school in Poznan, operating since 2012.' },
      ],
    },
    footer: {
      desc: 'Online birth school for your peace of mind. By Mama Gaja birth school.',
      course: 'Course',
      happybirth: 'HappyBirth',
      docs: 'Legal Documents',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      affiliate: 'Affiliate Partner Zone',
      legalBar: 'HappyBirth educational materials do not replace consultation with a physician or certified midwife. In medical emergencies, dial 112.',
    },
  },
  ru: {
    ribbonTitle: 'Образовательная платформа для беременных:',
    ribbonDesc: '52 видеоурока VOD · Ваше спокойствие шаг за шагом · Доступ на 12 месяцев',
    a11yBtn: 'Доступность',
    haveAccount: 'Уже есть аккаунт?',
    enterZone: 'Войти в кабинет',
    ticker: [
      '52 профессиональных видеоурока',
      'Спокойствие неделя за неделей',
      'Просмотр в вашем собственном темпе',
      '12 месяцев неограниченного доступа',
      'Дипломированные акушерки и эксперты',
      'Поддержка для вас и вашего партнера',
    ],
    nav: {
      program: 'Что вы получаете',
      week: 'Ваша неделя',
      trailer: 'Трейлер курса',
      experts: 'Забота экспертов',
      faq: 'Вопросы и ответы',
      zone: 'Кабинет ученицы',
      cta: 'Обрести спокойствие · 489 PLN',
    },
    hero: {
      title1: 'Онлайн-школа родов для вашего спокойствия.',
      title2: 'Шаг за шагом, неделя за неделей.',
      lead: '52 емких видеоурока с дипломированными акушерками. От первых недель беременности, через осознанные и спокойные роды, до первого года с малышом. Смотрите в удобном темпе – партнер подключается бесплатно.',
      ctaBuy: 'Обрести спокойствие · 489 PLN',
      ctaTrailer: 'Смотреть трейлер курса',
      facts: [
        '52 практических урока по 5–7 минут',
        '12 месяцев доступа для двоих',
        '489 PLN единоразово · Без подписок',
      ],
    },
    map: {
      kicker: 'Карта программы',
      title: 'От первых недель до первого дня рождения.',
      lead: 'Каждый этап беременности приносит свои вопросы. Передвиньте ползунок на вашу неделю – мы подскажем, с какого урока начать для полной уверенности.',
      notice: 'Это не жесткий график. Все 52 урока доступны сразу на 12 месяцев в любом порядке.',
      sliderLabel: 'Передвиньте ползунок на вашу текущую неделю беременности',
      sliderFallback: 'Ползунок подсказывает, с какого урока лучше начать на вашем сроке.',
      stages: [
        { title: 'Две полоски', range: 'недели 1–13', m1: 'Модуль 1. Беременность по неделям', m2: 'Модуль 2. Здоровье и самочувствие' },
        { title: 'Второй триместр', range: 'недели 14–27', m1: 'Модуль 3. Комфорт и активность', m2: '' },
        { title: 'Сумка в роддом', range: 'неделя 28 – роды', m1: 'Модуль 4. Приданое и детская комната', m2: 'Модуль 5. Час Ноль: активные роды' },
        { title: 'Первый год', range: 'от родов до 1 года', m1: 'Модуль 6. Послеродовое восстановление', m2: 'Модуль 7. Уход за новорожденным' },
      ],
    },
    trailer: {
      kicker: 'Трейлер курса',
      title: 'Посмотрите, как устроен курс изнутри.',
      lead: 'Короткий ролик из фрагментов уроков. Оцените качество 4K, доброжелательную и спокойную подачу материала нашими экспертами и атмосферу безопасности.',
      button: 'Воспроизвести официальный трейлер',
      badge: 'Официальный трейлер HappyBirth: Качество 4K и спокойная атмосфера',
      points: [
        'Дипломированные практикующие акушерки и консультанты по лактации',
        'Доказательная медицина без запугивания и хаоса из интернета',
        'Короткие уроки по 5–7 минут, удобные для повседневного ритма',
      ],
      disclaimer: 'Образовательные материалы в соответствии со стандартами перинатальной помощи. При экстренных ситуациях звоните 112.',
      playerNote: 'Плеер Cloudflare Stream загружается только по клику, экономя ваш трафик и защищая приватность.',
    },
    program: {
      kicker: 'Программа',
      title: '52 урока в 8 модулях.',
      titleSub: 'Около 5 часов полезного видео.',
      lead: 'Уроки записаны с дипломированными акушерками. Каждый длится от 5 до 7 минут – смотрите в любую свободную минуту.',
      topBtn: 'Изучить полную программу 52 уроков',
      topSub: 'Все 52 темы и длительность – ознакомьтесь без входа',
      bottomTitle: 'Полный список 52 уроков с длительностью',
      bottomSub: 'Все названия и модули доступны без регистрации.',
      bottomBtn: 'Открыть полную программу',
      modules: [
        { nr: 1, title: 'Беременность неделя за неделей', meta: '5 уроков · 18 мин', desc: 'Как меняется тело и развивается малыш по триместрам.' },
        { nr: 2, title: 'Здоровье, анализы и самочувствие', meta: '7 уроков · 34 мин', desc: 'Календарь обследований, рацион, профилактика недомоганий.' },
        { nr: 3, title: 'Комфорт и активность каждый день', meta: '6 уроков · 38 мин', desc: 'Здоровый сон, упражнения для спины и таза с физиотерапевтом.' },
        { nr: 4, title: 'Приданое, покупки и детская комната', meta: '7 уроков · 44 min', desc: 'Коляска, автокресло, кроватка, аптечка и список одежды.' },
        { nr: 5, title: 'Час «Ноль»: осознанные и активные роды', meta: '9 уроков · 54 мин', desc: 'План родов, сумка, дыхание, вертикальные позы и помощь партнера.' },
        { nr: 6, title: 'Послеродовой период и восстановление мамы', meta: '5 уроков · 32 мин', desc: 'Первые недели: заботливое восстановление, гормоны и поддержка.' },
        { nr: 7, title: 'Уход за новорожденным и безопасность', meta: '9 уроков · 44 мин', desc: 'Купание шаг за шагом, уход за пупком, безопасный сон и первая помощь.' },
        { nr: 8, title: 'Грудное вскармливание и поддержка', meta: '4 урока · 24 мин', desc: 'Техника прикладывания, позы, комфорт и решение проблем с коликами.' },
      ],
    },
    pricing: {
      kicker: 'Стоимость',
      title: 'Одна понятная цена.',
      titleSub: 'Без подписок.',
      price: '489 PLN',
      unit: 'единоразово',
      features: [
        '52 кинематографичных урока в 8 модулях, почти 5 часов видео',
        'Доступ для вас и партнера без каких-либо доплат',
        '12 месяцев неограниченного доступа со срока родов',
        'Рабочая тетрадь PDF, чек-листы и памятки',
        'Просмотр на смартфоне, планшете, компьютере и Smart TV',
      ],
      cta: 'Обрести спокойствие · 489 PLN',
      promoTrigger: 'Есть промокод на скидку?',
      promoPlaceholder: 'Введите промокод (например TEST100)',
      promoApply: 'Применить',
      promoActive: 'Промокод активирован: Скидка 100% (к оплате: 0 PLN)!',
      trust: 'BLIK · Банковская карта · Быстрый перевод · Моментальный доступ',
      legal: 'Согласно закону о защите прав потребителей, согласие на немедленный доступ влечет утрату права на возврат цифрового контента. Счет с НДС 23% по запросу.',
      whyTitle: 'Четыре причины, почему это окупается.',
      reasons: [
        { title: 'Ваша неделя, ваш ритм.', desc: 'Изучайте то, что актуально прямо сейчас, а не то, что по расписанию у группы.' },
        { title: 'Достаточно короткого вечера.', desc: 'Уроки по 5–7 минут. Легко посмотреть даже при сильной усталости.' },
        { title: 'Понятные задачи для партнера.', desc: 'Массаж, дыхание, сумка и поддержка в родах. Партнер смотрит бесплатно.' },
        { title: 'Курс не заканчивается родами.', desc: 'Купание, сон, уход за младенцем и восстановление мамы включены в курс.' },
      ],
    },
    faq: {
      kicker: 'Вопросы',
      title: 'Часто задаваемые вопросы.',
      items: [
        { q: 'Подготовит ли курс к родам так же хорошо, как очная школа?', a: 'Да. Программа охватывает полную подготовку к родам, восстановлению и уходу за младенцем в формате емких видеоуроков от акушерок. Вы учитесь дома в спокойствии и можете пересматривать уроки в любой момент.' },
        { q: 'Когда лучше начинать просмотр?', a: 'В любое время. Все 52 урока открыты с первого дня. Ползунок подскажет урок для вашего триместра, а доступ действует 12 месяцев со срока родов.' },
        { q: 'Может ли партнер смотреть вместе со мной?', a: 'Конечно. Доступ для двоих включен в стоимость. Партнер может заходить со своего телефона и смотреть практические советы.' },
        { q: 'На каких устройствах работает курс?', a: 'В любом браузере на телефоне, планшете, ноутбуке или Smart TV. Плеер сохраняет ваш прогресс.' },
        { q: 'Сколько стоит курс и есть ли скрытые платежи?', a: '489 PLN единоразово. Никаких автоматических продлений и скрытых списаний.' },
        { q: 'Как быстро я получу доступ после оплаты?', a: 'Мгновенно. Сразу после подтверждения оплаты или промокода вы перейдете в личный кабинет со всеми 52 уроками.' },
        { q: 'Заменяет ли курс консультацию врача?', a: 'Нет. HappyBirth – это образовательная платформа. Она не заменяет врачебные осмотры. В экстренных случаях звоните 112.' },
        { q: 'Кто разработал уроки?', a: 'Уроки подготовлены практикующими акушерками и консультантами школы родов Mama Gaja из Познани, работающей с 2012 года.' },
      ],
    },
    footer: {
      desc: 'Онлайн-школа родов для вашего спокойствия. От школы Mama Gaja.',
      course: 'Курс',
      happybirth: 'HappyBirth',
      docs: 'Юридические документы',
      terms: 'Правила платформы',
      privacy: 'Политика конфиденциальности',
      cookies: 'Политика файлов cookie',
      affiliate: 'Партнерская программа',
      legalBar: 'Материалы HappyBirth носят образовательный характер и не заменяют консультацию врача или акушерки. В экстренных ситуациях звоните 112.',
    },
  },
};

export default function RootPage() {
  const { lang } = useI18n();
  const t = DICT[lang] || DICT.pl;

  const [loading, setLoading] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setPromoError(lang === 'pl' ? 'Wpisz kod rabatowy.' : lang === 'en' ? 'Enter promo code.' : 'Введите промокод.');
      return;
    }

    if (is100PercentPromo(code)) {
      setAppliedPromo(code);
      setPromoError(null);
      activateStudentAccessLocally(code);
    } else {
      setPromoError(
        lang === 'pl'
          ? 'Nieprawidłowy kod. Dostępne kody testowe: TEST100, HAPPY100, PROMO100, TEST.'
          : lang === 'en'
          ? 'Invalid promo code. Try TEST100 or PROMO100.'
          : 'Неверный промокод. Попробуйте TEST100.'
      );
    }
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const currentPromo = (appliedPromo || promoCodeInput).trim().toUpperCase();

      // Jeśli wpisano kod rabatowy 100% (np. TEST100, HAPPY100, TEST, FREE, PROMO itp.), bezpośrednio odblokuj Strefę bez pytania o kartę
      if (is100PercentPromo(currentPromo)) {
        activateStudentAccessLocally(currentPromo);
        window.location.href = `/strefa?session_id=promo_test_100&payment=success&promo=${encodeURIComponent(currentPromo)}`;
        return;
      }

      // Zbierz parametry śledzenia i atrybucji marketingowej z URL oraz pamięci sesji
      let utmParams: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id', 'fbclid', 'gclid', 'ref'];

        keys.forEach((key) => {
          const val = urlParams.get(key);
          if (val) {
            utmParams[key] = val;
            try {
              sessionStorage.setItem(`hb_${key}`, val);
            } catch (_) {}
          }
        });

        keys.forEach((key) => {
          if (!utmParams[key]) {
            try {
              const saved = sessionStorage.getItem(`hb_${key}`);
              if (saved) utmParams[key] = saved;
            } catch (_) {}
          }
        });
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'kurs-glowny-happybirth',
          utm: utmParams,
          promoCode: currentPromo || undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Wystąpił problem przy inicjalizacji płatności.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Błąd checkoutu:', err);
      alert('Nie udało się połączyć z bramką płatności.');
      setLoading(false);
    }
  };

  return (
    <>
      <a className="skok" href="#tresc">Przejdź do treści</a>

      {/* 0. PASEK NARZĘDZIOWY: Dostępność WCAG, Tryb Ciemny/Jasny, Język, Logowanie */}
      <div className="bg-[#20071E] dark:bg-[#0F020E] text-[#EAD5E5] border-b border-[#3D0E39] px-3 sm:px-6 py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#DA0271] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              {t.ribbonTitle}
            </span>
            <span className="text-[#EAD5E5]/80 hidden md:inline truncate">
              {t.ribbonDesc}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hb_open_a11y'));
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#461643] bg-[#180517]/90 hover:bg-[#3D0E39] text-[#EAD5E5] hover:text-white transition-all font-semibold cursor-pointer"
              title="Ułatwienia dostępu i kontrast (WCAG 2.1 AA)"
              aria-label="Ułatwienia dostępu i kontrast (WCAG 2.1 AA)"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#FCD705]" />
              <span className="hidden sm:inline">{t.a11yBtn}</span>
            </button>

            <a
              href="https://instagram.com/happybirth.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EAD5E5]/70 hover:text-white hidden lg:flex items-center gap-1 border-l border-[#461643] pl-2.5 transition-colors"
              title="Instagram @happybirth.pl"
            >
              <span>@happybirth.pl</span>
            </a>

            <span className="text-[#EAD5E5]/60 hidden lg:inline border-l border-[#461643] pl-2.5">
              {t.haveAccount}
            </span>
            <Link
              href="/strefa"
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#EC008C] transition-colors whitespace-nowrap"
            >
              <span>{t.enterZone}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pasek biegunkowy u góry z komunikatem korzyści */}
      <div className="pasek">
        <div className="pasek-in">
          <span className="sr">{t.ribbonTitle}</span>
          <span aria-hidden="true" className="pasek-tor">
            <span className="pasek-grupa">
              {t.ticker.map((item, idx) => (
                <b key={idx}>{item}</b>
              ))}
            </span>
            <span className="pasek-grupa">
              {t.ticker.map((item, idx) => (
                <b key={`repeat-${idx}`}>{item}</b>
              ))}
            </span>
          </span>
        </div>
      </div>

      {/* Nawigacja */}
      <header className="nav">
        <div className="in">
          <Link aria-label="HappyBirth" className="znak" href="/">
            <img alt="HappyBirth" height={75} src="/logo.svg" width={92} />
          </Link>
          <nav aria-label="Główna" className="linki">
            <a href="#program">{t.nav.program}</a>
            <a href="#mapa">{t.nav.week}</a>
            <a href="#zwiastun">{t.nav.trailer}</a>
            <Link href="/o-nas">{t.nav.experts}</Link>
            <a href="#faq">{t.nav.faq}</a>
            <Link href="/strefa" className="text-[#DA0271] font-semibold hover:underline">{t.nav.zone}</Link>
          </nav>
          <details className="menu">
            <summary aria-label="Menu"><i /></summary>
            <nav aria-label="Menu mobilne">
              <a href="#program">{t.nav.program}</a>
              <a href="#mapa">{t.nav.week}</a>
              <a href="#zwiastun">{t.nav.trailer}</a>
              <Link href="/program">{t.program.topBtn}</Link>
              <Link href="/o-nas">{t.nav.experts}</Link>
              <a href="#faq">{t.nav.faq}</a>
              <Link href="/strefa">{t.nav.zone}</Link>
              <a href="#cena">{t.nav.cta}</a>
            </nav>
          </details>
          <a className="btn kup" href="#cena">{t.nav.cta}</a>
        </div>
      </header>

      {/* Główna treść */}
      <main id="tresc">
        {/* 1. HERO */}
        <section className="hero">
          <div className="wrap g">
            <div className="hero-tekst">
              <h1>
                {t.hero.title1}{' '}
                <span className="kursywa">{t.hero.title2}</span>
              </h1>
              <p className="lead">
                {t.hero.lead}
              </p>
              <div className="ctas">
                <a className="btn kup" href="#cena">{t.hero.ctaBuy}</a>
                <a className="btn zolty" href="#zwiastun">
                  <span aria-hidden="true" className="graj" />
                  {t.hero.ctaTrailer}
                </a>
              </div>
              <ul className="fakty">
                {t.hero.facts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </div>

            {/* Karuzela kadrów */}
            <div aria-label="Kadry z kursu HappyBirth" aria-roledescription="karuzela" className="kar" data-karuzela="" id="karuzela">
              <figure aria-label="Kadr 1 z 4" className="kar-slajd akt">
                <img
                  alt="Kobieta w ciąży odpoczywa i ogląda lekcję na tablecie"
                  decoding="async"
                  fetchPriority="high"
                  height={853}
                  sizes="(max-width: 920px) 100vw, 48vw"
                  src="/img/kar-1-para-1280.webp"
                  srcSet="/img/kar-1-para-640.webp 640w, /img/kar-1-para-800.webp 800w, /img/kar-1-para-960.webp 960w, /img/kar-1-para-1280.webp 1280w, /img/kar-1-para-1600.webp 1600w"
                  width={1280}
                />
              </figure>
              <figure aria-label="Kadr 2 z 4" className="kar-slajd" hidden>
                <img
                  alt="Partner wspiera przyszłą mamę i masuje jej ramiona"
                  data-src="/img/kar-2-oddech-1280.webp"
                  data-srcset="/img/kar-2-oddech-640.webp 640w, /img/kar-2-oddech-800.webp 800w, /img/kar-2-oddech-960.webp 960w, /img/kar-2-oddech-1280.webp 1280w, /img/kar-2-oddech-1600.webp 1600w"
                  decoding="async"
                  fetchPriority="low"
                  height={853}
                  sizes="(max-width: 920px) 100vw, 48vw"
                  width={1280}
                />
              </figure>
              <figure aria-label="Kadr 3 z 4" className="kar-slajd" hidden>
                <img
                  alt="Tata trzyma śpiące niemowlę w ramionach"
                  data-src="/img/kar-3-tata-1280.webp"
                  data-srcset="/img/kar-3-tata-640.webp 640w, /img/kar-3-tata-800.webp 800w, /img/kar-3-tata-960.webp 960w, /img/kar-3-tata-1280.webp 1280w, /img/kar-3-tata-1600.webp 1600w"
                  decoding="async"
                  fetchPriority="low"
                  height={853}
                  sizes="(max-width: 920px) 100vw, 48vw"
                  width={1280}
                />
              </figure>
              <figure aria-label="Kadr 4 z 4" className="kar-slajd" hidden>
                <img
                  alt="Spokojna nauka i planowanie wyprawki wieczorem"
                  data-src="/img/kar-4-wieczor-1280.webp"
                  data-srcset="/img/kar-4-wieczor-640.webp 640w, /img/kar-4-wieczor-800.webp 800w, /img/kar-4-wieczor-960.webp 960w, /img/kar-4-wieczor-1280.webp 1280w, /img/kar-4-wieczor-1600.webp 1600w"
                  decoding="async"
                  fetchPriority="low"
                  height={853}
                  sizes="(max-width: 920px) 100vw, 48vw"
                  width={1280}
                />
              </figure>
            </div>
          </div>
        </section>

        {/* 2. MAPA PROGRAMU ZE SUWAKIEM I DYNAMICZNĄ REKOMENDACJĄ FILMU */}
        <section aria-labelledby="mapa-tyt" className="kotwica" id="mapa">
          <div className="wrap">
            <div className="mapa">
              <div className="top">
                <div>
                  <p className="kicker">{t.map.kicker}</p>
                  <h2 className="h3" id="mapa-tyt">{t.map.title}</h2>
                </div>
                <p className="maly">{t.map.lead}</p>
              </div>
              <p className="uwaga">{t.map.notice}</p>

              <script
                id="konfig-suwak"
                type="application/json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    min: 1,
                    max: 645,
                    krok: 1,
                    start: 63,
                    opisWstegi: "Wstęga czterech pasm: Dwie kreski, Wreszcie lepiej, Torba spakowana, Pierwszy rok. Szerokość pasma odpowiada liczbie dni, dzień zero to kreska.",
                    wstega: { odstep: 3, kreska: 4 },
                    dniRazem: 645,
                    pasma: [
                      { id: "p1", waga: 91, kolor: "#DD7C9D", kolorCzysty: "#DA0271", tytul: "Dwie kreski, tydzień 1 do 13" },
                      { id: "p2", waga: 98, kolor: "#E9C46A", kolorCzysty: "#FECB22", tytul: "Wreszcie lepiej, tydzień 14 do 27" },
                      { id: "p3", waga: 91, kolor: "#E79A62", kolorCzysty: "#E87322", tytul: "Torba spakowana, tydzień 28 do porodu" },
                      { id: "zero", waga: 1, kreska: true, kolor: "var(--ink)", tytul: "Dzień zero, przewidywany termin porodu" },
                      { id: "p4", waga: 365, kolor: "#7FB3CC", kolorCzysty: "#0097DB", tytul: "Pierwszy rok, od dnia zero do pierwszych urodzin" },
                    ],
                    nici: [],
                    etapy: [
                      {
                        do: 91,
                        pasmo: "p1",
                        zakres: [1, 91],
                        nazwa: t.map.stages[0].title,
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: lang === 'pl' ? "Tydzień {n} ciąży" : lang === 'en' ? "Pregnancy week {n}" : "Неделя {n} беременности",
                        zakresTekst: t.map.stages[0].range,
                        moduly: [
                          { tytul: t.map.stages[0].m1, meta: "5 lekcji · 18 min" },
                          { tytul: t.map.stages[0].m2, meta: "7 lekcji · 34 min" },
                        ],
                      },
                      {
                        do: 189,
                        pasmo: "p2",
                        zakres: [92, 189],
                        nazwa: t.map.stages[1].title,
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: lang === 'pl' ? "Tydzień {n} ciąży" : lang === 'en' ? "Pregnancy week {n}" : "Неделя {n} беременности",
                        zakresTekst: t.map.stages[1].range,
                        moduly: [
                          { tytul: t.map.stages[1].m1, meta: "6 lekcji · 38 min" },
                        ],
                      },
                      {
                        do: 280,
                        pasmo: "p3",
                        zakres: [190, 280],
                        nazwa: t.map.stages[2].title,
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: lang === 'pl' ? "Tydzień {n} ciąży" : lang === 'en' ? "Pregnancy week {n}" : "Неделя {n} беременности",
                        zakresTekst: t.map.stages[2].range,
                        moduly: [
                          { tytul: t.map.stages[2].m1, meta: "7 lekcji · 44 min" },
                          { tytul: t.map.stages[2].m2, meta: "9 lekcji · 54 min" },
                        ],
                      },
                      {
                        do: 645,
                        pasmo: "p4",
                        zakres: [281, 645],
                        nazwa: t.map.stages[3].title,
                        jednostka: "miesiac",
                        baza: 280,
                        podpis: lang === 'pl' ? "Miesiąc {n} z dzieckiem" : lang === 'en' ? "Month {n} with baby" : "Месяц {n} с ребенком",
                        zakresTekst: t.map.stages[3].range,
                        moduly: [
                          { tytul: t.map.stages[3].m1, meta: "5 lekcji · 32 min" },
                          { tytul: t.map.stages[3].m2, meta: "9 lekcji · 44 min" },
                        ],
                      },
                    ],
                    skala: lang === 'pl' ? ["Tydzień 1", "Dzień zero", "Pierwsze urodziny"] : lang === 'en' ? ["Week 1", "Day Zero", "First Birthday"] : ["Неделя 1", "День Ноль", "Первый Год"],
                    teksty: {
                      etykieta: t.map.sliderLabel,
                      meta: lang === 'pl' ? "{podpis} · etap {nr} z 4" : lang === 'en' ? "{podpis} · stage {nr} of 4" : "{podpis} · этап {nr} из 4",
                      stopka: lang === 'pl' ? "Suwak działa bezpośrednio w Twojej przeglądarce. Nie pytamy o termin i nie zapisujemy danych wrażliwych." : "The slider runs entirely in your browser without saving any personal data.",
                    },
                    synchronizuj: "[data-etap]",
                  }),
                }}
              />

              <div className="se" id="suwak">
                <div className="se-zapas">
                  <p className="se-nazwa">{t.map.stages.map(s => s.title).join(', ')}</p>
                  <p className="se-opis">{t.map.sliderFallback}</p>
                </div>
              </div>

              <div className="pasma" id="pasma">
                {t.map.stages.map((stage, idx) => (
                  <div key={idx} className={`pasmo p${idx + 1}`} data-etap={String(idx + 1)}>
                    <h3>{stage.title}</h3>
                    <p className="zakres">{stage.range}</p>
                    <ul>
                      <li><a href={`#modul-${idx * 2 + 1}`}>{stage.m1}</a></li>
                      {stage.m2 && <li><a href={`#modul-${idx * 2 + 2}`}>{stage.m2}</a></li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ZWIASTUN KURSU */}
        <section aria-labelledby="zwiastun-tyt" className="sek" id="zwiastun">
          <div className="wrap lekcja">
            <div className="wideo">
              <div aria-hidden="true" className="plakat">
                <span className="plakat-nr">4K</span>
                <span className="plakat-t">{t.trailer.badge}</span>
                <span className="plakat-w"><i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" /></span>
              </div>
              <button
                className="wideo-start"
                data-tytul={t.trailer.title}
                data-wideo="https://customer-6d9sm694eja9tkvc.cloudflarestream.com/f8d8d8f24b917a32961efea785c9324b/iframe?autoplay=true&letterboxColor=transparent"
                type="button"
              >
                <span><i aria-hidden="true" />{t.trailer.button}</span>
              </button>
            </div>
            <div>
              <p className="kicker">{t.trailer.kicker}</p>
              <h2 className="h2" id="zwiastun-tyt">{t.trailer.title}</h2>
              <p className="lead">
                {t.trailer.lead}
              </p>
              <ul className="space-y-2 text-sm text-[#544A44] dark:text-[#D7CCC3] py-2">
                {t.trailer.points.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="maly zastrzezenie-lekcji">
                {t.trailer.disclaimer}
              </p>
              <p className="maly">
                {t.trailer.playerNote}
              </p>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM: 52 LEKCJE W 8 MODUŁACH */}
        <section aria-labelledby="program-tyt" className="sek papier" id="program">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">{t.program.kicker}</p>
              <h2 className="h2 duzy" id="program-tyt">{t.program.title} <span className="kursywa">{t.program.titleSub}</span></h2>
              <p className="lead">{t.program.lead}</p>
              
              {/* WYEKSPONOWANY PRZYCISK NA POCZĄTKU MODUŁU PROGRAMU */}
              <div className="pt-4 pb-2">
                <Link
                  href="/program"
                  className="btn-program-top"
                >
                  <BookOpen className="w-5 h-5 text-[#DA0271]" />
                  <span>{t.program.topBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <p className="text-xs text-[#867A72] dark:text-[#A2958C] mt-2">
                  {t.program.topSub}
                </p>
              </div>
            </div>

            <div className="moduly">
              {t.program.modules.map((mod) => (
                <article key={mod.nr} className={`modul p${Math.min(4, Math.ceil(mod.nr / 2))}`} id={`modul-${mod.nr}`}>
                  <span className="nr">{mod.nr}</span>
                  <h3>{mod.title}</h3>
                  <p className="meta">{mod.meta}</p>
                  <p>{mod.desc}</p>
                </article>
              ))}
            </div>

            <div className="pelna-lista">
              <div>
                <b>{t.program.bottomTitle}</b>
                <span>{t.program.bottomSub}</span>
              </div>
              <Link className="btn cta" href="/program">{t.program.bottomBtn}</Link>
            </div>
          </div>
        </section>

        {/* 5. CENA I ZAKUP STRIPE */}
        <section aria-labelledby="cena-tyt" className="sek" id="cena">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">{t.pricing.kicker}</p>
              <h2 className="h2" id="cena-tyt">{t.pricing.title} <span className="kursywa mniejsza">{t.pricing.titleSub}</span></h2>
            </div>
            <div className="cena dalej">
              {/* KARTA OFERTY ZE ZINTEGROWANYM PRZYCISKIEM KUPNA I KODEM RABATOWYM */}
              <div className="oferta">
                <p className="kwota">
                  {appliedPromo ? '0 zł' : t.pricing.price}
                  <small>{appliedPromo ? '-100%' : t.pricing.unit}</small>
                </p>

                <ul>
                  {t.pricing.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>

                {/* GŁÓWNY PRZYCISK ZAKUPU */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`btn-oferta-zakup mt-6 ${appliedPromo ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-500/30 ring-2 ring-emerald-400/50' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Ładowanie...</span>
                    </span>
                  ) : appliedPromo ? (
                    <span className="flex items-center justify-center gap-2 font-bold">
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                      <span>
                        {lang === 'pl'
                          ? 'Odbierz pełny dostęp (0 zł) · Wejdź do Strefy →'
                          : lang === 'en'
                          ? 'Claim Full Access (0 PLN) · Enter Zone →'
                          : 'Получить доступ (0 PLN) · Войти в кабинет →'}
                      </span>
                    </span>
                  ) : (
                    <span>{t.pricing.cta}</span>
                  )}
                </button>

                {/* SEKCJA KODU RABATOWEGO */}
                <div className="mt-4 pt-4 border-t border-[#EAE3DB] dark:border-[#3A1038] text-left">
                  {!showPromoInput && !appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs font-semibold text-[#867A72] dark:text-[#A2958C] hover:text-[#DA0271] underline cursor-pointer"
                    >
                      {t.pricing.promoTrigger}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t.pricing.promoPlaceholder}
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyPromo();
                            }
                          }}
                          className="flex-1 px-3 py-2 text-xs uppercase rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#250A24] text-[#1A1512] dark:text-white focus:outline-none focus:border-[#DA0271]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-4 py-2 rounded-xl bg-[#250A24] dark:bg-[#3D0E39] text-white text-xs font-bold hover:bg-[#DA0271] transition-colors cursor-pointer"
                        >
                          {t.pricing.promoApply}
                        </button>
                      </div>
                      {appliedPromo && (
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 space-y-2 mt-2">
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{t.pricing.promoActive}</span>
                          </p>
                          <button
                            type="button"
                            onClick={handleCheckout}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                          >
                            <span>
                              {lang === 'pl'
                                ? 'Przejdź od razu do panelu 52 lekcji →'
                                : lang === 'en'
                                ? 'Go to 52 video lessons now →'
                                : 'Перейти к 52 урокам →'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      {promoError && (
                        <p className="text-xs text-rose-500 font-semibold">
                          {promoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#867A72] dark:text-[#A2958C]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t.pricing.trust}</span>
                </div>

                <p className="info mt-3 text-[11.5px] text-[#867A72] dark:text-[#A2958C] leading-relaxed">
                  {t.pricing.legal} <Link href="/regulamin" className="underline">Regulamin</Link>.
                </p>
              </div>

              {/* KARTA ARGUMENTÓW OBOK */}
              <div className="argumenty">
                <p className="kicker">{t.pricing.kicker}</p>
                <h3>{t.pricing.whyTitle}</h3>
                <ul className="arg">
                  {t.pricing.reasons.map((r, idx) => (
                    <li key={idx}>
                      <b>{r.title}</b>
                      <span>{r.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section aria-labelledby="faq-tyt" className="sek len" id="faq">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">{t.faq.kicker}</p>
              <h2 className="h2" id="faq-tyt">{t.faq.title}</h2>
            </div>
            <div className="faq">
              {t.faq.items.map((item, idx) => (
                <details key={idx}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* STOPKA */}
      <footer className="stopka">
        <div className="wrap">
          <div className="g">
            <div>
              <Link aria-label="HappyBirth" className="znak" href="/">
                <img alt="HappyBirth" height={136} loading="lazy" src="/logo.svg" width={168} />
              </Link>
              <p className="opis">{t.footer.desc}</p>
              <div aria-hidden="true" className="wstega-mini">
                <i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" />
              </div>
            </div>
            <div>
              <h2>{t.footer.course}</h2>
              <ul>
                <li><Link href="/program">{t.program.topBtn}</Link></li>
                <li><a href="#zwiastun">{t.nav.trailer}</a></li>
                <li><a href="#cena">{t.nav.cta}</a></li>
                <li><a href="#faq">{t.faq.kicker}</a></li>
                <li><Link href="/strefa">{t.nav.zone}</Link></li>
              </ul>
            </div>
            <div>
              <h2>{t.footer.happybirth}</h2>
              <ul>
                <li><Link href="/o-nas">{t.nav.experts}</Link></li>
                <li><Link href="/partnerzy">{t.footer.affiliate}</Link></li>
                <li><a href="https://www.instagram.com/happybirth.pl/" rel="noreferrer" target="_blank">Instagram @happybirth.pl</a></li>
                <li><a href="https://www.tiktok.com/@happybirth_pl" rel="noreferrer" target="_blank">TikTok @happybirth_pl</a></li>
              </ul>
            </div>
            <div>
              <h2>{t.footer.docs}</h2>
              <ul>
                <li><Link href="/regulamin">{t.footer.terms}</Link></li>
                <li><Link href="/polityka-prywatnosci">{t.footer.privacy}</Link></li>
                <li><Link href="/polityka-cookies">{t.footer.cookies}</Link></li>
              </ul>
            </div>
          </div>

          <div className="dane">
            <p>
              Usługodawca: <strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong> (KLARSolutions sp. z o.o.), ul. Śląska 14, 60-614 Poznań. KRS: 0001268396, NIP: 7812118273, REGON: 545782779, kapitał zakładowy: 5 000,00 PLN.
            </p>
            <p>
              Sąd Rejestrowy: Sąd Rejonowy Poznań - Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy KRS. Kontakt: kontakt@happybirth.pl, pomoc: pomoc@happybirth.pl.
            </p>
            <p>
              Zdjęcia na stronie to profesjonalne wizualizacje edukacyjne. HappyBirth jest marką KLARSOLUTIONS sp. z o.o., © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      <div className="pasek-prawny">
        <p>{t.footer.legalBar}</p>
      </div>

      {/* Skrypt interaktywny (suwak etapów z dynamiczną rekomendacją, karuzela, wideo zwiastun) */}
      <Script src="/assets/hb.82f00762a8.js" strategy="afterInteractive" />
    </>
  );
}
