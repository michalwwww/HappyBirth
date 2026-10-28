'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  Loader2,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Accessibility,
  FileText,
  Luggage,
  Gift,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { FreeLessonPreview } from '@/components/free-lesson-preview';
import { useI18n, Language } from '@/lib/i18n';
import {
  is100PercentPromo,
  is10PercentAffiliatePromo,
  activateStudentAccessLocally,
  OMNIBUS_LOWEST_30D_NOTICE_PL,
  ORDER_BUMP_TITLE_PL,
  ORDER_BUMP_DESC_PL,
} from '@/lib/promo';
import {
  CHECKBOX_2_ART38_WAIVER_TEXT,
} from '@/lib/legal-shield';

interface DictContent {
  ribbonTitle: string;
  ribbonDesc: string;
  a11yBtn: string;
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
    stages: { title: string; range: string; m1: string; m2: string; m3?: string }[];
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
    trust: string;
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
    withdrawal: string;
    affiliate: string;
    b2bPartners: string;
    legalBar: string;
  };
}

const DICT: Record<Language, DictContent> = {
  pl: {
    ribbonTitle: 'HappyBirth:',
    ribbonDesc: '52 lekcje 4K · Dostęp na 18 miesięcy dla dwojga',
    a11yBtn: 'Dostępność',
    enterZone: 'Strefa kursantki',
    ticker: [
      '52 krótkie lekcje 4K',
      'Położne ze szkoły Mama Gaja',
      '18 miesięcy dostępu',
      'Dostęp dla dwojga w cenie',
      '489 zł jednorazowo',
    ],
    nav: {
      program: 'Program',
      week: 'Twój tydzień',
      trailer: 'Bezpłatna lekcja',
      experts: 'O nas',
      faq: 'Pytania',
      zone: 'Strefa kursantki',
      cta: 'Kup kurs · 489 zł',
    },
    hero: {
      title1: 'Szkoła rodzenia online dla Twojego spokoju.',
      title2: 'Jeden tydzień naraz.',
      lead: '52 krótkie lekcje wideo (po 5–7 minut) nagrane z położnymi ze szkoły rodzenia Mama Gaja. Oglądasz we własnym tempie — od pierwszych tygodni ciąży do pierwszego roku z dzieckiem.',
      ctaBuy: 'Kup kurs · 489 zł',
      ctaTrailer: 'Obejrzyj lekcję za darmo',
      facts: [
        '52 lekcje po 5–7 min',
        '18 miesięcy dostępu dla dwojga',
        '489 zł jednorazowo · Bez abonamentu',
      ],
    },
    map: {
      kicker: 'Mapa programu',
      title: 'Sprawdź, od czego zacząć w Twoim tygodniu.',
      lead: 'Przesuń suwak na swój tydzień ciąży lub miesiąc z maluszkiem.',
      notice: 'Wszystkie 52 lekcje otrzymujesz od razu na 18 miesięcy od zakupu.',
      sliderLabel: 'Przesuń suwak na swój obecny tydzień ciąży',
      sliderFallback: 'Suwak podpowiada moduły dopasowane do Twojego etapu.',
      stages: [
        {
          title: 'Dwie kreski',
          range: 'tydzień 1–13',
          m1: 'Moduł 1. Twoja ciąża tydzień po tygodniu',
          m2: 'Moduł 2. Zdrowie i badania',
        },
        {
          title: 'Wreszcie lepiej',
          range: 'tydzień 14–27',
          m1: 'Moduł 3. Komfort, sen i bezpieczny ruch',
          m2: '',
        },
        {
          title: 'Torba spakowana',
          range: 'tydzień 28 do porodu',
          m1: 'Moduł 4. Wyprawka i kącik dziecka',
          m2: 'Moduł 5. Świadomy i aktywny poród',
        },
        {
          title: 'Pierwszy rok',
          range: 'od narodzin do 1. urodzin',
          m1: 'Moduł 6. Połóg i regeneracja mamy',
          m2: 'Moduł 7. Kąpiel, sen i pierwsza pomoc',
          m3: 'Moduł 8. Karmienie i laktacja',
        },
      ],
    },
    program: {
      kicker: 'Program',
      title: '52 lekcje w 8 modułach.',
      titleSub: 'Prawie 5 godzin esencji wideo.',
      lead: 'Każda lekcja trwa średnio 5–7 minut. Bez lania wody i bez dojazdów.',
      topBtn: 'Zobacz pełną listę 52 lekcji',
      topSub: 'Wszystkie tematy i czasy trwania bez logowania',
      bottomTitle: 'Pełny spis 52 lekcji z czasami trwania',
      bottomSub: 'Sprawdź program przed zakupem.',
      bottomBtn: 'Lista 52 lekcji',
      modules: [
        { nr: 1, title: 'Ciąża tydzień po tygodniu', meta: '5 lekcji · 18 min', desc: 'Rozwój dziecka, zmiany w ciele i spokój w pierwszych tygodniach.' },
        { nr: 2, title: 'Zdrowie i kalendarz badań', meta: '7 lekcji · 34 min', desc: 'Badania, dieta, codzienne dolegliwości i ważne sygnały.' },
        { nr: 3, title: 'Komfort, sen i ruch', meta: '6 lekcji · 38 min', desc: 'Ćwiczenia z fizjoterapeutką odciążające kręgosłup i miednicę.' },
        { nr: 4, title: 'Wyprawka bez przepłacania', meta: '7 lekcji · 44 min', desc: 'Wózek, fotelik, łóżeczko, apteczka i ubranka na start.' },
        { nr: 5, title: 'Aktywny poród i rola taty', meta: '9 lekcji · 54 min', desc: 'Plan porodu, torba, oddech, pozycje wertykalne i wsparcie partnera.' },
        { nr: 6, title: 'Połóg i regeneracja mamy', meta: '5 lekcji · 32 min', desc: 'Gojenie, emocje, powrót do sił i ćwiczenia dna miednicy.' },
        { nr: 7, title: 'Opieka nad noworodkiem', meta: '9 lekcji · 44 min', desc: 'Kąpiel krok po kroku, bezpieczny sen, szczepienia i pierwsza pomoc.' },
        { nr: 8, title: 'Karmienie i laktacja', meta: '4 lekcje · 24 min', desc: 'Wygodne pozycje, prawidłowy chwyt, laktator i łagodzenie kolek.' },
      ],
    },
    pricing: {
      kicker: 'Cena',
      title: 'Jedna prosta cena.',
      titleSub: 'Bez subskrypcji.',
      price: '489,00 zł',
      unit: 'jednorazowo',
      features: [
        '52 lekcje wideo 4K w 8 modułach (ok. 5h materiału)',
        'Dostęp na 18 miesięcy (548 dni) od zakupu',
        'Wspólny dostęp dla Ciebie i partnera (Strefa Taty)',
        'Notatnik Rodzica, Plan Porodu i checklisty PDF',
        'Działa na telefonie, laptopie i Smart TV',
      ],
      cta: 'Kup dostęp',
      promoTrigger: 'Masz kod rabatowy od położnej lub przyjaciółki?',
      promoPlaceholder: 'Wpisz kod (np. POLOZNA10)',
      promoApply: 'Zastosuj',
      trust: 'BLIK · Karta · Apple Pay / Google Pay · Natychmiastowy dostęp',
      whyTitle: 'Dlaczego rodzice wybierają HappyBirth?',
      reasons: [
        { title: '18 miesięcy dostępu.', desc: 'Kupujesz raz i korzystasz przez całą ciążę, poród oraz pierwszy rok dziecka.' },
        { title: 'Po 5–7 minut dziennie.', desc: 'Krótkie, konkretne odcinki, które obejrzysz nawet wieczorem na kanapie.' },
        { title: 'Partner wie, co robić.', desc: 'Praktyczne instrukcje masażu, pakowania torby i wsparcia na sali porodowej.' },
        { title: 'Spokój o 3:00 w nocy.', desc: 'Kąpiel, laktacja, kolki i pierwsza pomoc zawsze pod ręką w telefonie.' },
      ],
    },
    faq: {
      kicker: 'Pytania',
      title: 'Częste pytania',
      items: [
        { q: 'Czy kurs online zastąpi stacjonarną szkołę rodzenia?', a: 'Tak. Otrzymujesz kompletny program położnych ze szkoły rodzenia Mama Gaja — z tą przewagą, że do każdego ćwiczenia i instruktażu kąpieli możesz wrócić w dowolnej chwili.' },
        { q: 'Na jak długo otrzymuję dostęp?', a: 'Na pełne 18 miesięcy (548 dni) od dnia zakupu. Wystarczy na całą ciążę oraz pierwszy rok życia maluszka.' },
        { q: 'Czy partner płaci dodatkowo?', a: 'Nie. Dostęp dla dwojga (w tym dedykowana Strefa Taty) jest wliczony w cenę 489 zł.' },
        { q: 'Kiedy otrzymam dostęp po opłaceniu?', a: 'Natychmiast po płatności BLIK lub kartą zostaniesz przekierowana do Strefy ze wszystkimi 52 lekcjami.' },
        { q: 'Czy otrzymam fakturę VAT?', a: 'Tak, po zakupie wystawiamy fakturę VAT 23% (KLARSOLUTIONS Sp. z o.o.).' },
        { q: 'Kto prowadzi lekcje?', a: 'Dyplomowane położne, doradczyni laktacyjna i fizjoterapeutka uroginekologiczna z poznańskiej szkoły rodzenia Mama Gaja (działającej od 2012 r.).' },
      ],
    },
    footer: {
      desc: 'Szkoła rodzenia online. Nagrana z ekspertkami ze szkoły rodzenia Mama Gaja.',
      course: 'Kurs i Narzędzia',
      happybirth: 'Współpraca i O Nas',
      docs: 'Dokumenty',
      terms: 'Regulamin',
      privacy: 'Polityka prywatności',
      cookies: 'Polityka cookies',
      withdrawal: 'Odstąp od umowy',
      affiliate: 'Afiliacja (Położne i Twórczynie)',
      b2bPartners: 'Współpraca B2B (Marki i Kliniki)',
      legalBar: 'Materiały mają charakter edukacyjny i nie zastępują porady lekarskiej. W nagłych wypadkach dzwoń pod 112.',
    },
  },
  en: {
    ribbonTitle: 'HappyBirth:',
    ribbonDesc: '52 lessons in 4K · 18 months access for two',
    a11yBtn: 'Accessibility',
    enterZone: 'Member Zone',
    ticker: [
      '52 concise 4K lessons',
      'Certified midwives (Mama Gaja)',
      '18 months access',
      'Partner access included',
      '489 PLN one-time',
    ],
    nav: {
      program: 'Syllabus',
      week: 'Your week',
      trailer: 'Free lesson',
      experts: 'About us',
      faq: 'FAQ',
      zone: 'Member Zone',
      cta: 'Buy course · 489 PLN',
    },
    hero: {
      title1: 'Online birth school for your peace of mind.',
      title2: 'One week at a time.',
      lead: '52 short video lessons (5–7 min each) recorded with certified midwives from Mama Gaja birth school. Watch at your own pace through pregnancy and baby’s first year.',
      ctaBuy: 'Buy course · 489 PLN',
      ctaTrailer: 'Watch free lesson',
      facts: [
        '52 lessons, 5–7 min each',
        '18 months access for two',
        '489 PLN one-time · No subscription',
      ],
    },
    map: {
      kicker: 'Roadmap',
      title: 'See where to start in your week.',
      lead: 'Move the slider to your pregnancy week or baby’s month.',
      notice: 'All 52 lessons are unlocked immediately for 18 months from purchase.',
      sliderLabel: 'Move slider to your current pregnancy week',
      sliderFallback: 'The slider highlights modules for your stage.',
      stages: [
        { title: 'Early Pregnancy', range: 'week 1–13', m1: 'Module 1. Pregnancy week by week', m2: 'Module 2. Health and tests' },
        { title: 'Second Trimester', range: 'week 14–27', m1: 'Module 3. Comfort & safe movement', m2: '' },
        { title: 'Hospital Bag', range: 'week 28 to birth', m1: 'Module 4. Smart layette', m2: 'Module 5. Active labor' },
        { title: 'First Year', range: 'birth to 1st birthday', m1: 'Module 6. Postpartum recovery', m2: 'Module 7. Newborn care & safety', m3: 'Module 8. Feeding & lactation' },
      ],
    },
    program: {
      kicker: 'Syllabus',
      title: '52 lessons in 8 modules.',
      titleSub: 'Nearly 5 hours of video.',
      lead: 'Each lesson takes 5–7 minutes. Zero fluff, watchable anytime.',
      topBtn: 'See all 52 lessons',
      topSub: 'Full topic list without logging in',
      bottomTitle: 'Complete list of 52 lessons',
      bottomSub: 'Review all topics before buying.',
      bottomBtn: 'Full syllabus',
      modules: [
        { nr: 1, title: 'Pregnancy week by week', meta: '5 lessons · 18 min', desc: 'Baby development and body changes trimester by trimester.' },
        { nr: 2, title: 'Health and tests calendar', meta: '7 lessons · 34 min', desc: 'Medical checkups, nutrition and common symptoms.' },
        { nr: 3, title: 'Comfort and movement', meta: '6 lessons · 38 min', desc: 'Safe exercises for spine and pelvic relief.' },
        { nr: 4, title: 'Layette without overspending', meta: '7 lessons · 44 min', desc: 'Stroller, car seat, crib and starter clothes.' },
        { nr: 5, title: 'Active labor & partner role', meta: '9 lessons · 54 min', desc: 'Birth plan, hospital bag, breathing and positions.' },
        { nr: 6, title: 'Postpartum recovery', meta: '5 lessons · 32 min', desc: 'Healing, emotions and pelvic floor exercises.' },
        { nr: 7, title: 'Newborn care & safety', meta: '9 lessons · 44 min', desc: 'Step-by-step bathing, safe sleep and first aid.' },
        { nr: 8, title: 'Feeding and lactation', meta: '4 lessons · 24 min', desc: 'Latch technique, positions and soothing colic.' },
      ],
    },
    pricing: {
      kicker: 'Pricing',
      title: 'One transparent price.',
      titleSub: 'No subscription.',
      price: '489,00 PLN',
      unit: 'one-time',
      features: [
        '52 video lessons in 8 modules (4K)',
        '18 months (548 days) access from purchase',
        'Partner access included at no extra cost',
        'Parent Workbook, Birth Plan & PDF checklists',
        'Works on phone, laptop and Smart TV',
      ],
      cta: 'Get access',
      promoTrigger: 'Have a discount code?',
      promoPlaceholder: 'Enter code (e.g. POLOZNA10)',
      promoApply: 'Apply',
      trust: 'BLIK · Card · Apple Pay / Google Pay · Instant access',
      whyTitle: 'Why parents choose HappyBirth',
      reasons: [
        { title: '18 months access.', desc: 'Covers pregnancy, labor and your baby’s entire first year.' },
        { title: '5–7 minutes a day.', desc: 'Short, practical videos you can watch comfortably on the sofa.' },
        { title: 'Partner knows what to do.', desc: 'Clear massage, hospital bag and delivery room guidance.' },
        { title: 'Confidence at 3:00 AM.', desc: 'Bathing, feeding and first aid always in your phone.' },
      ],
    },
    faq: {
      kicker: 'FAQ',
      title: 'Common questions',
      items: [
        { q: 'Does this replace an in-person birth class?', a: 'Yes. It covers the full curriculum of certified midwives from Mama Gaja, and you can replay any lesson whenever needed.' },
        { q: 'How long does access last?', a: '18 months (548 days) from purchase.' },
        { q: 'Can my partner watch for free?', a: 'Yes, access for two is included in the 489 PLN price.' },
        { q: 'When do I get access?', a: 'Immediately after payment.' },
      ],
    },
    footer: {
      desc: 'Online birth school by Mama Gaja midwives.',
      course: 'Course & Tools',
      happybirth: 'Partners & About',
      docs: 'Legal',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      withdrawal: 'Withdraw from contract',
      affiliate: 'Affiliate Program',
      b2bPartners: 'B2B Partnerships',
      legalBar: 'Educational materials only; does not replace medical advice. In emergencies dial 112.',
    },
  },
  ru: {
    ribbonTitle: 'HappyBirth:',
    ribbonDesc: '52 урока 4K · 18 месяцев доступа для двоих',
    a11yBtn: 'Доступность',
    enterZone: 'Кабинет',
    ticker: [
      '52 коротких урока 4K',
      'Акушерки школы Mama Gaja',
      '18 месяцев доступа',
      'Доступ для двоих',
      '489 PLN единоразово',
    ],
    nav: {
      program: 'Программа',
      week: 'Ваша неделя',
      trailer: 'Бесплатный урок',
      experts: 'О нас',
      faq: 'Вопросы',
      zone: 'Кабинет',
      cta: 'Купить курс · 489 PLN',
    },
    hero: {
      title1: 'Онлайн-школа родов для вашего спокойствия.',
      title2: 'Неделя за неделей.',
      lead: '52 коротких видеоурока (по 5–7 минут) с дипломированными акушерками школы Mama Gaja. Смотрите в своем темпе — от первых недель беременности до года малыша.',
      ctaBuy: 'Купить курс · 489 PLN',
      ctaTrailer: 'Смотреть урок бесплатно',
      facts: [
        '52 урока по 5–7 мин',
        '18 месяцев доступа для двоих',
        '489 PLN разово · Без подписок',
      ],
    },
    map: {
      kicker: 'Карта курса',
      title: 'С чего начать на вашей неделе.',
      lead: 'Передвиньте ползунок на вашу неделю беременности.',
      notice: 'Все 52 урока открыты сразу на 18 месяцев с момента покупки.',
      sliderLabel: 'Передвиньте ползунок на вашу текущую неделю',
      sliderFallback: 'Ползунок подсказывает модули для вашего срока.',
      stages: [
        { title: 'Две полоски', range: 'недели 1–13', m1: 'Модуль 1. Беременность по неделям', m2: 'Модуль 2. Здоровье и анализы' },
        { title: 'Второй триместр', range: 'недели 14–27', m1: 'Модуль 3. Комфорт и движение', m2: '' },
        { title: 'Сумка в роддом', range: 'неделя 28 – роды', m1: 'Модуль 4. Приданое малыша', m2: 'Модуль 5. Активные роды' },
        { title: 'Первый год', range: 'от родов до 1 года', m1: 'Модуль 6. Восстановление мамы', m2: 'Модуль 7. Уход за новорожденным', m3: 'Модуль 8. Грудное вскармливание' },
      ],
    },
    program: {
      kicker: 'Программа',
      title: '52 урока в 8 модулях.',
      titleSub: 'Около 5 часов видео.',
      lead: 'Каждый урок длится 5–7 минут. Коротко и по делу.',
      topBtn: 'Список всех 52 уроков',
      topSub: 'Все темы без регистрации',
      bottomTitle: 'Полный список 52 уроков',
      bottomSub: 'Ознакомьтесь с программой.',
      bottomBtn: 'Все 52 урока',
      modules: [
        { nr: 1, title: 'Беременность по неделям', meta: '5 уроков · 18 мин', desc: 'Развитие малыша и изменения в организме.' },
        { nr: 2, title: 'Здоровье и анализы', meta: '7 уроков · 34 мин', desc: 'Календарь обследований и самочувствие.' },
        { nr: 3, title: 'Комфорт и движение', meta: '6 уроков · 38 мин', desc: 'Упражнения для спины и таза с физиотерапевтом.' },
        { nr: 4, title: 'Умное приданое', meta: '7 уроков · 44 min', desc: 'Коляска, автокресло, кроватка и аптечка.' },
        { nr: 5, title: 'Активные роды и партнер', meta: '9 уроков · 54 мин', desc: 'План родов, сумка, дыхание и вертикальные позы.' },
        { nr: 6, title: 'Послеродовой период', meta: '5 уроков · 32 мин', desc: 'Бережное восстановление мамы.' },
        { nr: 7, title: 'Уход за новорожденным', meta: '9 уроков · 44 мин', desc: 'Купание шаг за шагом, сон и первая помощь.' },
        { nr: 8, title: 'Грудное вскармливание', meta: '4 урока · 24 мин', desc: 'Прикладывание, позы и помощь при коликах.' },
      ],
    },
    pricing: {
      kicker: 'Цена',
      title: 'Одна понятная цена.',
      titleSub: 'Без подписок.',
      price: '489,00 PLN',
      unit: 'единоразово',
      features: [
        '52 видеоурока 4K в 8 модулях',
        '18 месяцев (548 дней) доступа с покупки',
        'Доступ для вас и партнера включен',
        'Рабочая тетрадь, План родов и чек-листы PDF',
        'На телефоне, ноутбуке и Smart TV',
      ],
      cta: 'Купить доступ',
      promoTrigger: 'Есть промокод на скидку?',
      promoPlaceholder: 'Введите код (например POLOZNA10)',
      promoApply: 'Применить',
      trust: 'BLIK · Карта · Apple Pay / Google Pay · Мгновенный доступ',
      whyTitle: 'Почему выбирают HappyBirth',
      reasons: [
        { title: '18 месяцев доступа.', desc: 'Хватит на всю беременность, роды и первый год малыша.' },
        { title: 'По 5–7 минут в день.', desc: 'Короткие понятные видео без воды.' },
        { title: 'Партнер знает, как помочь.', desc: 'Наглядные инструкции для папы в родах и дома.' },
        { title: 'Спокойствие ночью.', desc: 'Купание, лактация и первая помощь всегда под рукой.' },
      ],
    },
    faq: {
      kicker: 'Вопросы',
      title: 'Частые вопросы',
      items: [
        { q: 'Заменит ли курс очную школу родов?', a: 'Да. Вы получаете полную программу от акушерок Mama Gaja и можете пересматривать уроки в любое время.' },
        { q: 'Сколько действует доступ?', a: '18 месяцев (548 дней) с момента покупки.' },
        { q: 'Нужно ли доплачивать за партнера?', a: 'Нет, доступ для двоих включен в цену 489 PLN.' },
        { q: 'Как быстро открывается доступ?', a: 'Мгновенно после оплаты.' },
      ],
    },
    footer: {
      desc: 'Онлайн-школа родов от акушерок Mama Gaja.',
      course: 'Курс и Инструменты',
      happybirth: 'Партнерам и О нас',
      docs: 'Документы',
      terms: 'Правила',
      privacy: 'Конфиденциальность',
      cookies: 'Cookies',
      withdrawal: 'Отказ от договора',
      affiliate: 'Партнерская программа',
      b2bPartners: 'Сотрудничество B2B',
      legalBar: 'Материалы носят образовательный характер и не заменяют консультацию врача. В экстренных случаях звоните 112.',
    },
  },
};

export default function RootPage() {
  const { lang } = useI18n();
  const t = DICT[lang] || DICT.pl;

  const [loading, setLoading] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<0 | 10 | 100>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const [includeOrderBump, setIncludeOrderBump] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [waiverArt38Accepted, setWaiverArt38Accepted] = useState(false);
  const [checkboxError, setCheckboxError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const promoParam = params.get('promo');
    if (promoParam) {
      const normalized = promoParam.trim().toUpperCase();
      setPromoCodeInput(normalized);
      setShowPromoInput(true);
      if (is10PercentAffiliatePromo(normalized)) {
        setAppliedPromo(normalized);
        setAppliedDiscountPercent(10);
      } else if (is100PercentPromo(normalized)) {
        setAppliedPromo(normalized);
        setAppliedDiscountPercent(100);
      }
    }
  }, []);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setPromoError(lang === 'pl' ? 'Wpisz kod rabatowy.' : 'Enter promo code.');
      return;
    }

    if (is10PercentAffiliatePromo(code)) {
      setAppliedPromo(code);
      setAppliedDiscountPercent(10);
      setPromoError(null);
      return;
    }

    if (is100PercentPromo(code)) {
      setAppliedPromo(code);
      setAppliedDiscountPercent(100);
      setPromoError(null);
      activateStudentAccessLocally(code);
      return;
    }

    setAppliedPromo(null);
    setAppliedDiscountPercent(0);
    setPromoError(
      lang === 'pl'
        ? 'Nieprawidłowy kod rabatowy.'
        : 'Invalid promo code.'
    );
  };

  const baseCoursePln = appliedDiscountPercent === 100 ? 0 : appliedDiscountPercent === 10 ? 440.1 : 489.0;
  const orderBumpPln = includeOrderBump && appliedDiscountPercent !== 100 ? 49.0 : 0;
  const finalTotalPln = baseCoursePln + orderBumpPln;
  const formattedFinalPrice = `${finalTotalPln.toFixed(2).replace('.', ',')} zł`;

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!termsAccepted || !waiverArt38Accepted) {
      setCheckboxError(
        'Zaznacz oba oświadczenia powyżej, aby przejść do płatności.'
      );
      return;
    }
    setCheckboxError(null);

    try {
      setLoading(true);
      const currentPromo = (appliedPromo || promoCodeInput).trim().toUpperCase();

      if (is100PercentPromo(currentPromo)) {
        activateStudentAccessLocally(currentPromo);
        window.location.href = `/strefa?session_id=promo_test_100&payment=success&promo=${encodeURIComponent(currentPromo)}`;
        return;
      }

      const utmParams: Record<string, string> = {};
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
          includeOrderBump,
          termsAccepted: true,
          waiverArt38Accepted: true,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckboxError(data.error || 'Wystąpił problem przy inicjalizacji płatności.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Błąd checkoutu:', err);
      setCheckboxError('Nie udało się połączyć z bramką płatności.');
      setLoading(false);
    }
  };

  return (
    <>
      <a className="skok" href="#tresc">Przejdź do treści</a>

      {/* Kompaktowy pasek narzędziowy */}
      <div className="bg-[#20071E] dark:bg-[#0F020E] text-[#EAD5E5] border-b border-[#3D0E39] px-3 sm:px-6 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#DA0271]"></span>
            <span className="font-semibold text-white">{t.ribbonTitle}</span>
            <span className="text-[#EAD5E5]/80 hidden sm:inline">{t.ribbonDesc}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hb_open_a11y'));
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#461643] bg-[#180517]/90 hover:bg-[#3D0E39] text-[#EAD5E5] hover:text-white transition-all font-semibold cursor-pointer"
              title="Ułatwienia dostępu (WCAG 2.1 AA)"
              aria-label="Ułatwienia dostępu"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#FCD705]" />
              <span className="hidden sm:inline">{t.a11yBtn}</span>
            </button>
            <Link
              href="/strefa"
              className="inline-flex items-center font-bold text-white bg-[#DA0271] hover:bg-[#B5005E] px-3 py-1 rounded-full transition-all text-xs"
            >
              {t.enterZone}
            </Link>
          </div>
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
            <a href="#bezplatna-lekcja">{t.nav.trailer}</a>
            <Link href="/o-nas">{t.nav.experts}</Link>
            <a href="#faq">{t.nav.faq}</a>
            <Link href="/strefa" className="text-[#DA0271] font-semibold hover:underline">{t.nav.zone}</Link>
          </nav>
          <details className="menu">
            <summary aria-label="Menu"><i /></summary>
            <nav aria-label="Menu mobilne">
              <a href="#program">{t.nav.program}</a>
              <a href="#mapa">{t.nav.week}</a>
              <a href="#bezplatna-lekcja">{t.nav.trailer}</a>
              <Link href="/program">{t.program.topBtn}</Link>
              <Link href="/o-nas">{t.nav.experts}</Link>
              <Link href="/plan-porodu">Plan Porodu PDF</Link>
              <Link href="/kalkulator-wyprawki">Kalkulator Wyprawki PDF</Link>
              <a href="#faq">{t.nav.faq}</a>
              <Link href="/strefa">{t.nav.zone}</Link>
              <a href="#cena">{t.nav.cta}</a>
            </nav>
          </details>
          <a className="btn kup" href="#cena">{t.nav.cta}</a>
        </div>
      </header>

      <main id="tresc">
        {/* 1. HERO */}
        <section className="hero">
          <div className="wrap g">
            <div className="hero-tekst">
              <h1>
                {t.hero.title1}{' '}
                <span className="kursywa">{t.hero.title2}</span>
              </h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="ctas">
                <a className="btn zolty" href="#bezplatna-lekcja">
                  <span aria-hidden="true" className="graj" />
                  {t.hero.ctaTrailer}
                </a>
                <a className="btn kup" href="#cena">{t.hero.ctaBuy}</a>
              </div>
              <ul className="fakty">
                {t.hero.facts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </div>

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
                  alt="Partner wspiera przyszłą mamę"
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
                  alt="Tata trzyma śpiące niemowlę"
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
                  alt="Spokojna nauka wieczorem"
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

        {/* 2. MAPA PROGRAMU ZE SUWAKIEM */}
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
                    opisWstegi: "Wstęga czterech pasm: Dwie kreski, Wreszcie lepiej, Torba spakowana, Pierwszy rok.",
                    wstega: { odstep: 3, kreska: 4 },
                    dniRazem: 645,
                    pasma: [
                      { id: "p1", waga: 91, kolor: "#DD7C9D", kolorCzysty: "#DA0271", tytul: "Dwie kreski, tydzień 1–13" },
                      { id: "p2", waga: 98, kolor: "#E9C46A", kolorCzysty: "#FECB22", tytul: "Wreszcie lepiej, tydzień 14–27" },
                      { id: "p3", waga: 91, kolor: "#E79A62", kolorCzysty: "#E87322", tytul: "Torba spakowana, tydzień 28 do porodu" },
                      { id: "zero", waga: 1, kreska: true, kolor: "var(--ink)", tytul: "Dzień zero, termin porodu" },
                      { id: "p4", waga: 365, kolor: "#7FB3CC", kolorCzysty: "#0097DB", tytul: "Pierwszy rok z dzieckiem" },
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
                          { tytul: t.map.stages[3].m3 || "Moduł 8. Karmienie i laktacja", meta: "4 lekcje · 24 min" },
                        ],
                      },
                    ],
                    skala: lang === 'pl' ? ["Tydzień 1", "Poród", "1. urodziny"] : lang === 'en' ? ["Week 1", "Birth", "1st Birthday"] : ["Неделя 1", "Роды", "1 год"],
                    teksty: {
                      etykieta: t.map.sliderLabel,
                      meta: lang === 'pl' ? "{podpis} · etap {nr} z 4" : lang === 'en' ? "{podpis} · stage {nr} of 4" : "{podpis} · этап {nr} из 4",
                      stopka: lang === 'pl' ? "Suwak działa w przeglądarce — nie zapisujemy żadnych danych o zdrowiu." : "Runs locally in your browser.",
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
                      <li><a href={`#modul-${idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 4 : 6}`}>{stage.m1}</a></li>
                      {stage.m2 && <li><a href={`#modul-${idx === 0 ? 2 : idx === 2 ? 5 : 7}`}>{stage.m2}</a></li>}
                      {stage.m3 && <li><a href="#modul-8">{stage.m3}</a></li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. BEZPŁATNA LEKCJA BEZ LOGOWANIA ([B2]) */}
        <FreeLessonPreview />

        {/* 4. PROGRAM: 52 LEKCJE W 8 MODUŁACH */}
        <section aria-labelledby="program-tyt" className="sek papier" id="program">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">{t.program.kicker}</p>
              <h2 className="h2 duzy" id="program-tyt">{t.program.title} <span className="kursywa">{t.program.titleSub}</span></h2>
              <p className="lead">{t.program.lead}</p>

              <div className="pt-3 pb-1">
                <Link href="/program" className="btn-program-top">
                  <BookOpen className="w-5 h-5 text-[#DA0271]" />
                  <span>{t.program.topBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
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

            {/* 2 kompaktowe kafelki bezpłatnych narzędzi PDF ([F3]) */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/plan-porodu"
                className="p-5 rounded-2xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#DA0271]">
                    <FileText className="w-3.5 h-3.5" /> Bezpłatne narzędzie #1
                  </span>
                  <h3 className="font-brand-display font-bold text-base sm:text-lg text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271]">
                    Kreator Planu Porodu PDF (w 3 minuty)
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DA0271] shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/kalkulator-wyprawki"
                className="p-5 rounded-2xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#E87322]">
                    <Luggage className="w-3.5 h-3.5" /> Bezpłatne narzędzie #2
                  </span>
                  <h3 className="font-brand-display font-bold text-base sm:text-lg text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271]">
                    Kalkulator Torby do Szpitala PDF (3 strefy)
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DA0271] shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
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
              <div className="oferta">
                <div className="space-y-1">
                  <p className="kwota">
                    {formattedFinalPrice}
                    <small>
                      {appliedDiscountPercent === 10
                        ? 'z kodem -10%'
                        : includeOrderBump
                        ? 'kurs + karty PDF'
                        : t.pricing.unit}
                    </small>
                  </p>

                  {appliedDiscountPercent === 10 && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold space-y-0.5 pt-1">
                      <div>
                        Cena regularna: <span className="line-through opacity-75">489,00 zł</span> · Z kodem <strong>{appliedPromo}</strong>: <strong>440,10 zł</strong>
                      </div>
                      <div className="text-[11px] text-[#867A72] dark:text-[#C4ADC0] font-normal">
                        {OMNIBUS_LOWEST_30D_NOTICE_PL}
                      </div>
                    </div>
                  )}
                </div>

                <ul>
                  {t.pricing.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>

                {/* [B3] Kompaktowy Order Bump (+49,00 zł) */}
                <div className="mt-4 p-3.5 rounded-2xl border border-[#DA0271]/40 bg-[#FDF7FA] dark:bg-[#2A0B28] text-left">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOrderBump}
                      onChange={(e) => setIncludeOrderBump(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#DA0271] rounded shrink-0 cursor-pointer"
                    />
                    <div className="space-y-0.5 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5 font-bold text-[#250A24] dark:text-white">
                        <Gift className="w-3.5 h-3.5 text-[#DA0271] shrink-0" />
                        <span>Dodaj: {ORDER_BUMP_TITLE_PL}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#DA0271] text-white text-[10px] font-bold">
                          +49 zł
                        </span>
                      </div>
                      <p className="text-[11px] text-[#544A44] dark:text-[#D7CCC3]">
                        {ORDER_BUMP_DESC_PL}
                      </p>
                    </div>
                  </label>
                </div>

                {/* [B5] Kod rabatowy (domyślnie zwinięty) */}
                <div className="mt-4 pt-3 border-t border-[#EAE3DB] dark:border-[#3A1038] text-left">
                  {!showPromoInput && !appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs font-semibold text-[#544A44] dark:text-[#D7CCC3] hover:text-[#DA0271] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-[#DA0271]" />
                      <span>{t.pricing.promoTrigger}</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t.pricing.promoPlaceholder}
                          value={promoCodeInput}
                          onChange={(e) => {
                            setPromoCodeInput(e.target.value.toUpperCase());
                            setPromoError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyPromo();
                            }
                          }}
                          className="flex-1 px-3 py-2 text-xs font-semibold uppercase rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FDFAF6] dark:bg-[#250A24] text-[#1A1512] dark:text-white focus:outline-none focus:border-[#DA0271]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3.5 py-2 rounded-xl bg-[#250A24] dark:bg-[#3D0E39] text-white text-xs font-bold hover:bg-[#DA0271] transition-colors cursor-pointer"
                        >
                          {t.pricing.promoApply}
                        </button>
                      </div>

                      {appliedPromo && (
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Kod {appliedPromo} (-{appliedDiscountPercent}%) aktywny!</span>
                        </p>
                      )}

                      {promoError && (
                        <p className="text-xs text-rose-500 font-semibold">{promoError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* [E1] Dwa zwięzłe checkboxy wymagane prawnie */}
                <div className="mt-4 pt-3 border-t border-[#EAE3DB] dark:border-[#3A1038] text-left space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-[#250A24] dark:text-[#EAD5E5]">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked && waiverArt38Accepted) setCheckboxError(null);
                      }}
                      className="mt-0.5 w-4 h-4 accent-[#DA0271] rounded shrink-0 cursor-pointer"
                    />
                    <span>
                      Akceptuję <Link href="/regulamin" className="underline font-semibold">Regulamin</Link> i{' '}
                      <Link href="/polityka-prywatnosci" className="underline font-semibold">Politykę Prywatności</Link>. *
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer text-xs text-[#250A24] dark:text-[#EAD5E5]">
                    <input
                      type="checkbox"
                      checked={waiverArt38Accepted}
                      onChange={(e) => {
                        setWaiverArt38Accepted(e.target.checked);
                        if (termsAccepted && e.target.checked) setCheckboxError(null);
                      }}
                      className="mt-0.5 w-4 h-4 accent-[#DA0271] rounded shrink-0 cursor-pointer"
                    />
                    <span className="text-[11.5px] leading-snug">
                      {CHECKBOX_2_ART38_WAIVER_TEXT} *
                    </span>
                  </label>

                  {checkboxError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-400/50 text-rose-700 dark:text-rose-200 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{checkboxError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-oferta-zakup mt-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Przekierowanie do Stripe...</span>
                    </span>
                  ) : (
                    <span>
                      {t.pricing.cta} · {formattedFinalPrice}
                    </span>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#867A72] dark:text-[#A2958C]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t.pricing.trust}</span>
                </div>
              </div>

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
                <li><a href="#bezplatna-lekcja">{t.nav.trailer}</a></li>
                <li><Link href="/plan-porodu">Plan Porodu PDF</Link></li>
                <li><Link href="/kalkulator-wyprawki">Kalkulator Wyprawki PDF</Link></li>
                <li><Link href="/strefa">{t.nav.zone}</Link></li>
              </ul>
            </div>
            <div>
              <h2>{t.footer.happybirth}</h2>
              <ul>
                <li><Link href="/o-nas">{t.nav.experts}</Link></li>
                <li><Link href="/standard-merytoryczny">Standard merytoryczny</Link></li>
                <li><Link href="/afiliacja">{t.footer.affiliate}</Link></li>
                <li><Link href="/partnerzy">{t.footer.b2bPartners}</Link></li>
                <li><a href="https://www.instagram.com/happybirth.pl/" rel="noreferrer" target="_blank">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h2>{t.footer.docs}</h2>
              <ul>
                <li><Link href="/regulamin">{t.footer.terms}</Link></li>
                <li><Link href="/polityka-prywatnosci">{t.footer.privacy}</Link></li>
                <li><Link href="/polityka-cookies">{t.footer.cookies}</Link></li>
                <li><Link href="/odstap-od-umowy" className="font-semibold text-[#FCD705]">{t.footer.withdrawal}</Link></li>
              </ul>
            </div>
          </div>

          <div className="dane">
            <p>
              KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN · kontakt@happybirth.pl
            </p>
          </div>
        </div>
      </footer>

      <div className="pasek-prawny">
        <p>{t.footer.legalBar}</p>
      </div>

      <Script src="/assets/hb.82f00762a8.js" strategy="afterInteractive" />
    </>
  );
}
