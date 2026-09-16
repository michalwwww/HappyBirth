import { Language } from './i18n';

export interface PillarItem {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  accent: string;
  bg: string;
}

export interface StageItem {
  num: string;
  name: string;
  desc: string;
  color: string;
}

export interface ComparisonItem {
  feature: string;
  traditional: string;
  happybirth: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  city: string;
  avatar: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface MarketingContent {
  nav: {
    ribbonTitle: string;
    ribbonDesc: string;
    a11yBtn: string;
    haveAccount: string;
    enterZone: string;
    brandSubtitle1: string;
    brandSubtitle2: string;
    links: {
      pillars: string;
      stages: string;
      tools: string;
      reviews: string;
      price: string;
      faq: string;
    };
    zoneBtn: string;
    joinBtn: string;
    partnerB2B: string;
  };
  hero: {
    badge: string;
    title1: string;
    titlePink1: string;
    titlePink2: string;
    title2: string;
    desc: string;
    ctaBuy: string;
    ctaPreview: string;
    bullets: string[];
    stats: {
      lessons: string;
      hours: string;
      modules: string;
      rating: string;
    };
  };
  pillars: {
    tag: string;
    title: string;
    desc: string;
    items: PillarItem[];
  };
  stages: {
    tag: string;
    title: string;
    desc: string;
    items: StageItem[];
  };
  tools: {
    tag: string;
    title: string;
    desc: string;
    tipBadge: string;
    tipTitle: string;
    tipDesc: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  comparison: {
    tag: string;
    title: string;
    colFeature: string;
    colTraditional: string;
    colHappyBirth: string;
    items: ComparisonItem[];
  };
  testimonials: {
    tag: string;
    title: string;
    items: TestimonialItem[];
  };
  pricing: {
    badge: string;
    title: string;
    price: string;
    unit: string;
    features: string[];
    cta: string;
    statusBadge: string;
    statusText: string;
    guarantee: string;
  };
  faq: {
    tag: string;
    title: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    familyCount: string;
    navTitle: string;
    legalNote: string;
    rightsReserved: string;
  };
}

export const marketingTranslations: Record<Language, MarketingContent> = {
  pl: {
    nav: {
      ribbonTitle: 'Platforma Edukacyjna dla Rodziców:',
      ribbonDesc: '52 lekcje e-learning VOD · Dostęp dla dwojga na 12 miesięcy',
      a11yBtn: 'Udogodnienia UE',
      haveAccount: 'Masz już konto?',
      enterZone: 'Wejdź do Strefy',
      brandSubtitle1: 'Szkoła Rodzenia · Edukacja VOD',
      brandSubtitle2: 'kurs online dla dwojga',
      links: {
        pillars: '4 Filary Spokoju',
        stages: '9 Etapów',
        tools: 'Patenty & Narzędzia',
        reviews: 'Opinie rodziców',
        price: 'Cena 349 zł',
        faq: 'FAQ',
      },
      zoneBtn: 'Strefa Rodziców',
      joinBtn: 'Dołącz · 349 zł',
      partnerB2B: 'Strefa Partnera B2B (Afiliacja)',
    },
    hero: {
      badge: 'Program Edukacyjny Online dla Rodziców · 52 Lekcje VOD',
      title1: 'Szkoła rodzenia,',
      titlePink1: 'która daje',
      titlePink2: 'spokój',
      title2: 'i pewność siebie',
      desc: 'Wszystko, co musisz wiedzieć o narodzinach, skurczach, opiece nad noworodkiem i pierwszych tygodniach w domu. Bez medycznego żargonu, w tempie Twojej rodziny.',
      ctaBuy: 'Rozpocznij przygotowania · 349 zł',
      ctaPreview: 'Zobacz bezpłatny zwiastun',
      bullets: [
        'Dostęp na 12 miesięcy dla dwojga',
        '52 filmowe lekcje w jakości 4K',
        'Notatnik rodzica i ściągi PDF',
      ],
      stats: {
        lessons: '52 lekcje wideo',
        hours: '15+ godzin wiedzy',
        modules: '9 modułów tematycznych',
        rating: 'Ocena 4.9/5 od rodziców',
      },
    },
    pillars: {
      tag: 'Program Szkoleniowy',
      title: '4 Filary Edukacji i Spokoju HappyBirth',
      desc: 'Praktyczna wiedza, która przygotuje Was na każdy etap nowej drogi.',
      items: [
        {
          num: '01',
          title: 'Poród & Oddech',
          subtitle: 'Współpraca z ciałem i naturalny rytm',
          desc: 'Świadomy oddech, wygodne pozycje wertykalne i spokój. Uczymy, jak zaufać ciału i zachować pewność siebie krok po kroku.',
          accent: '#EC008C',
          bg: '#FAE3EB',
        },
        {
          num: '02',
          title: 'Ciało & Spokojny Ruch',
          subtitle: 'Komfort, mobilność i czuły powrót do sił',
          desc: 'Praktyczne ćwiczenia rozluźniające, masaż dla taty oraz bezpieczna domowa regeneracja dla świeżo upieczonej mamy.',
          accent: '#98269C',
          bg: '#EAD5E5',
        },
        {
          num: '03',
          title: 'Czułe Karmienie & Więź',
          subtitle: 'Bliskość bez presji i bez oceniania',
          desc: 'Wygodne pozycje i spokojny start – zarówno przy karmieniu piersią, jak i butelką. Bezpiecznie i z pełnym zrozumieniem.',
          accent: '#0088BC',
          bg: '#D0EBF3',
        },
        {
          num: '04',
          title: 'Maluszek w Domu',
          subtitle: 'Pewność siebie o 3:00 w nocy',
          desc: 'Kąpiel bez stresu, bezpieczny sen, noszenie i uspokajanie maluszka. Praktyczny spokój w pierwszych tygodniach w domu.',
          accent: '#347A22',
          bg: '#DFEED4',
        },
      ],
    },
    stages: {
      tag: 'Sylabus kursu',
      title: '9 Modułów Edukacyjnych Twojej Podróży',
      desc: 'Od pierwszych tygodni ciąży, przez poród, aż po pierwszy rok życia maluszka.',
      items: [
        { num: '01', name: 'Zanim', desc: 'Świadome przygotowanie i spokój w głowie', color: '#8F8D8D' },
        { num: '02', name: 'Dwie kreski', desc: 'I Trymestr – emocje, ciało i pierwsze chwile', color: '#54BF39' },
        { num: '03', name: 'Wreszcie lepiej', desc: 'II Trymestr – nowa energia, ruch i siła', color: '#FCD705' },
        { num: '04', name: 'Torba spakowana', desc: 'III Trymestr – sprytna wyprawka i organizacja', color: '#F57B14' },
        { num: '05', name: 'Wielki Dzień', desc: 'Ciało w ruchu, oddech i spokój we dwoje', color: '#ED1C24' },
        { num: '06', name: 'Plan B bez stresu', desc: 'Świadome narodziny w każdym scenariuszu', color: '#952999' },
        { num: '07', name: 'Pierwsza noc w domu', desc: 'Czuły połóg i regeneracja sił mamy', color: '#EC008C' },
        { num: '08', name: 'Karmienie z miłością', desc: 'Pierś i butelka bez presji i poczucia winy', color: '#00ADEF' },
        { num: '09', name: 'Razem przez 1. rok', desc: 'Sen, rozwój maluszka i bezpieczeństwo', color: '#3B46A4' },
      ],
    },
    tools: {
      tag: 'Patenty & Narzędzia',
      title: 'Praktyczne narzędzia i codzienne patenty',
      desc: 'Wszystko, co ułatwia codzienność przyszłej mamy i daje konkretne zadania tacie.',
      tipBadge: 'Patent Dnia HappyBirth',
      tipTitle: 'Codzienna dawka wiedzy',
      tipDesc: 'Krótki, sprawdzony trik od położnych i rodziców prosto z naszych 52 lekcji.',
      card1Title: 'Cyfrowy Notatnik Rodzica (PDF)',
      card1Desc: 'Gotowy arkusz do wpięcia w kartę ciąży: preferencje kangurowania, muzyki, oświetlenia i wsparcia partnera.',
      card2Title: 'Apteczka SOS & Wyprawka',
      card2Desc: 'Sprytna, bezstresowa lista tylko tego, co naprawdę potrzebne. Bez wydawania fortuny na zbędne gadżety.',
      card3Title: 'Ściągi wideo dla Taty',
      card3Desc: 'Krótkie 2-minutowe instrukcje: jak masować lędźwie, jak podtrzymać żonę pod prysznicem i co zrobić po powrocie ze szpitala.',
    },
    comparison: {
      tag: 'Dlaczego HappyBirth?',
      title: 'Tradycyjna szkoła rodzenia vs HappyBirth',
      colFeature: 'Obszar',
      colTraditional: 'Tradycyjna Szkoła Rodzenia',
      colHappyBirth: 'HappyBirth Online VOD',
      items: [
        {
          feature: 'Format nauki',
          traditional: 'Sztywne wykłady w sali, dojazdy po pracy',
          happybirth: 'Nowoczesny e-learning VOD na kanapie w telefonie lub TV',
        },
        {
          feature: 'Zaangażowanie taty',
          traditional: 'Często czuje się biernym obserwatorem z boku',
          happybirth: 'Dedykowana Strefa dla Taty: masaż relaksacyjny i konkretne zadania',
        },
        {
          feature: 'Dostęp po narodzinach',
          traditional: 'Kurs kończy się przed porodem – po powrocie zostajecie sami',
          happybirth: 'Dostęp na 12 miesięcy od terminu porodu – powrót do lekcji w domu',
        },
        {
          feature: 'Pomoce dydaktyczne',
          traditional: 'Zeszyt z notatkami, który gubi się w stresie',
          happybirth: 'Cyfrowy Notatnik Rodzica PDF, wideo-patenty i ściągi dla taty',
        },
        {
          feature: 'Podejście edukacyjne',
          traditional: 'Sztywne dogmaty budzące presję i poczucie winy',
          happybirth: 'Ciepło, zero oceniania i zaufanie do Waszych wyborów',
        },
      ],
    },
    testimonials: {
      tag: 'Głosy rodziców',
      title: 'Historie mam i ojców, którzy zaufali HappyBirth',
      items: [
        {
          quote: 'Oglądaliśmy lekcje wieczorami na telewizorze. Dzięki technikom oddechowym poród minął w pełnym spokoju, a mąż dokładnie wiedział, jak masować lędźwie.',
          author: 'Karolina i Piotr',
          role: 'Rodzice Leona',
          city: 'Warszawa',
          avatar: 'KP',
          rating: 5,
        },
        {
          quote: 'Najbardziej doceniam moduł o pierwszych dobach w domu. Kąpiel noworodka bez łez i lęku, pozycje do odbijania – te wideo uratowały nam noce.',
          author: 'Marta i Tomasz',
          role: 'Rodzice Zosi',
          city: 'Gdańsk',
          avatar: 'MT',
          rating: 5,
        },
        {
          quote: 'Strefa dla taty to majstersztyk. Żadnego lania wody, konkretne patenty: co spakować, jak rozmawiać w szpitalu, jak odciążyć żonę w połogu.',
          author: 'Jakub',
          role: 'Tata Tymona',
          city: 'Wrocław',
          avatar: 'JK',
          rating: 5,
        },
      ],
    },
    pricing: {
      badge: 'Jednorazowa opłata · Dostęp dla dwojga',
      title: 'Dostęp do pełnego programu edukacyjnego VOD',
      price: '349 zł',
      unit: 'jednorazowo',
      features: [
        '52 filmowe lekcje w jakości 4K (ponad 15 godzin materiałów)',
        'Dostęp dla dwojga na 12 miesięcy od terminu porodu',
        'Dedykowana Strefa dla Taty i wideo-ściągi',
        'Cyfrowy Notatnik Rodzica i szablony PDF do druku',
        'Aplikacja mobilna i odtwarzacz na Smart TV',
        'Certyfikat ukończenia programu edukacyjnego',
      ],
      cta: 'Dołącz do kursu · 349 zł',
      statusBadge: 'Status: Usługa Edukacyjno-Szkoleniowa (E-learning VOD)',
      statusText: 'Gwarancja 14 dni na zwrot bez zbędnych pytań',
      guarantee: '14 dni gwarancji satysfakcji. Jeśli kurs nie spełni Twoich oczekiwań, zwrócimy 100% wpłaty.',
    },
    faq: {
      tag: 'Często zadawane pytania',
      title: 'Wszystko, co warto wiedzieć przed dołączeniem',
      items: [
        {
          q: 'Na jak długo otrzymujemy dostęp do kursu?',
          a: 'Dostęp jest aktywny przez 12 miesięcy od przewidywanego terminu porodu. Oznacza to, że kurs służy Wam przez całą ciążę oraz przez cały pierwszy rok życia maluszka.',
        },
        {
          q: 'Czy partner może korzystać z kursu na osobnym urządzeniu?',
          a: 'Tak! Jedno konto pozwala na jednoczesne logowanie na telefonie mamy, taty, komputerze oraz na telewizorze Smart TV bez żadnych dopłat.',
        },
        {
          q: 'Kiedy jest najlepszy moment na rozpoczęcie nauki?',
          a: 'Polecamy dołączenie między 20. a 28. tygodniem ciąży, ale materiały są pomocne zarówno na samym początku (I trymestr), jak i w ostatnich tygodniach przed porodem.',
        },
        {
          q: 'Czy kurs zastępuje wizytę u lekarza lub położnej?',
          a: 'HappyBirth to program edukacyjny i szkoleniowy przygotowujący do roli rodzica. Uzupełnia standardową opiekę medyczną o praktyczną wiedzę, spokój i techniki domowe.',
        },
        {
          q: 'Jak wygląda płatność i czy otrzymam fakturę?',
          a: 'Płatność jest jednorazowa przez bezpieczne systemy Stripe, BLIK lub kartę. Natychmiast po opłaceniu otrzymujesz dostęp do platformy oraz automatyczną fakturę.',
        },
      ],
    },
    footer: {
      tagline: 'Czuła szkoła rodzenia online dla naszych mam i ojców. 52 filmowe lekcje wideo, sprawdzone patenty i wsparcie przez cały pierwszy rok życia dziecka.',
      familyCount: 'Ponad 18 000 przygotowanych rodzin',
      navTitle: 'Odkryj HappyBirth',
      legalNote: 'HappyBirth jest internetową platformą edukacyjną świadczącą usługi szkoleniowe w formule kursu wideo VOD. Wszystkie materiały mają wyłącznie charakter edukacyjny i przygotowawczy do roli rodzica. Usługa nie stanowi i nie zastępuje indywidualnych świadczeń zdrowotnych, diagnostyki ani porady lekarskiej.',
      rightsReserved: 'Wszelkie prawa zastrzeżone.',
    },
  },

  en: {
    nav: {
      ribbonTitle: 'Parent Educational Platform:',
      ribbonDesc: '52 e-learning VOD lessons · 12 months access for two',
      a11yBtn: 'EU Accessibility',
      haveAccount: 'Already have an account?',
      enterZone: 'Enter Zone',
      brandSubtitle1: 'Birthing School · VOD Education',
      brandSubtitle2: 'online course for two',
      links: {
        pillars: '4 Pillars of Calm',
        stages: '9 Stages',
        tools: 'Tips & Tools',
        reviews: "Parents' Reviews",
        price: 'Price 349 PLN',
        faq: 'FAQ',
      },
      zoneBtn: 'Parent Zone',
      joinBtn: 'Enroll · 349 PLN',
      partnerB2B: 'B2B Partner Zone (Affiliation)',
    },
    hero: {
      badge: 'Online Educational Program for Parents · 52 VOD Lessons',
      title1: 'Birthing school,',
      titlePink1: 'that brings',
      titlePink2: 'calm',
      title2: 'and true confidence',
      desc: 'Everything you need to know about birth, contractions, newborn care, and the first weeks at home. No clinical jargon, at your family’s own pace.',
      ctaBuy: 'Start Preparing · 349 PLN',
      ctaPreview: 'Watch Free Preview',
      bullets: [
        '12 months access for two',
        '52 cinema-grade 4K lessons',
        'Parent notebook & PDF cheatsheets',
      ],
      stats: {
        lessons: '52 video lessons',
        hours: '15+ hours of insights',
        modules: '9 thematic modules',
        rating: '4.9/5 rating by parents',
      },
    },
    pillars: {
      tag: 'Curriculum',
      title: '4 Pillars of HappyBirth Education & Calm',
      desc: 'Practical knowledge preparing you for every step of your new journey.',
      items: [
        {
          num: '01',
          title: 'Birth & Breathing',
          subtitle: 'Body harmony and natural flow',
          desc: 'Mindful breathing, upright positions, and deep calm. Learn to trust your body and stay confident step by step.',
          accent: '#EC008C',
          bg: '#FAE3EB',
        },
        {
          num: '02',
          title: 'Body & Gentle Motion',
          subtitle: 'Comfort, mobility, and tender recovery',
          desc: 'Practical release exercises, partner massage techniques, and safe postpartum recovery at home.',
          accent: '#98269C',
          bg: '#EAD5E5',
        },
        {
          num: '03',
          title: 'Loving Feeding & Bonding',
          subtitle: 'Closeness with zero guilt or pressure',
          desc: 'Comfortable latches and calm beginnings – whether breastfeeding or bottle feeding. Safe and compassionate.',
          accent: '#0088BC',
          bg: '#D0EBF3',
        },
        {
          num: '04',
          title: 'Baby at Home',
          subtitle: 'Confidence at 3:00 AM',
          desc: 'Tear-free bath times, safe sleep, soothing, and babywearing. Practical serenity in the early weeks at home.',
          accent: '#347A22',
          bg: '#DFEED4',
        },
      ],
    },
    stages: {
      tag: 'Course Syllabus',
      title: '9 Educational Modules of Your Journey',
      desc: 'From early pregnancy, through birth, to your baby’s entire first year.',
      items: [
        { num: '01', name: 'Before', desc: 'Mindful preparation and mental serenity', color: '#8F8D8D' },
        { num: '02', name: 'Two Lines', desc: '1st Trimester – emotions, body, and first steps', color: '#54BF39' },
        { num: '03', name: 'Feeling Better', desc: '2nd Trimester – renewed energy, mobility & strength', color: '#FCD705' },
        { num: '04', name: 'Hospital Bag', desc: '3rd Trimester – smart layette & organization', color: '#F57B14' },
        { num: '05', name: 'The Big Day', desc: 'Body in motion, steady breath & partner calm', color: '#ED1C24' },
        { num: '06', name: 'Plan B Without Stress', desc: 'Empowered birth in every scenario', color: '#952999' },
        { num: '07', name: 'First Night Home', desc: 'Tender postpartum recovery for mom', color: '#EC008C' },
        { num: '08', name: 'Feeding with Love', desc: 'Breast & bottle without pressure or guilt', color: '#00ADEF' },
        { num: '09', name: 'Together Year One', desc: 'Sleep, baby milestones, and family safety', color: '#3B46A4' },
      ],
    },
    tools: {
      tag: 'Tips & Tools',
      title: 'Practical tools and daily pro-tips',
      desc: 'Everything making daily life smoother for mom and giving clear, empowering tasks to dad.',
      tipBadge: 'HappyBirth Daily Pro-Tip',
      tipTitle: 'Daily bite of wisdom',
      tipDesc: 'A short, proven tip from midwives and experienced parents straight from our 52 lessons.',
      card1Title: 'Digital Parent Notebook (PDF)',
      card1Desc: 'Printable chart to insert into your pregnancy folder: preferences for skin-to-skin, music, dim lighting, and partner roles.',
      card2Title: 'SOS Cabinet & Layette Checklist',
      card2Desc: 'Smart, stress-free essentials checklist. Zero fortune spent on unnecessary baby gadgets.',
      card3Title: 'Video Cheatsheets for Dad',
      card3Desc: 'Concise 2-minute guides: lower back sacrum massage, supporting in the shower, and home transition support.',
    },
    comparison: {
      tag: 'Why HappyBirth?',
      title: 'Traditional Birthing School vs HappyBirth',
      colFeature: 'Area',
      colTraditional: 'Traditional Birthing School',
      colHappyBirth: 'HappyBirth Online VOD',
      items: [
        {
          feature: 'Learning Format',
          traditional: 'Rigid lectures in a classroom, commuting after work',
          happybirth: 'Modern e-learning VOD from your sofa on phone or TV',
        },
        {
          feature: 'Dad’s Engagement',
          traditional: 'Often feels like a passive bystander on the side',
          happybirth: 'Dedicated Dad Zone: massage techniques and actionable duties',
        },
        {
          feature: 'Access Post-Birth',
          traditional: 'Ends right before labor – left completely alone at home',
          happybirth: '12 months access from due date – rewatch whenever needed',
        },
        {
          feature: 'Learning Materials',
          traditional: 'Messy paper notes that get lost during high stress',
          happybirth: 'Digital Parent Notebook PDF, quick video hacks & cheatsheets',
        },
        {
          feature: 'Philosophy & Tone',
          traditional: 'Rigid dogmas triggering anxiety, guilt, and fear',
          happybirth: 'Warmth, zero judgment, and respect for your choices',
        },
      ],
    },
    testimonials: {
      tag: "Parents' Voices",
      title: 'Real stories of families who trusted HappyBirth',
      items: [
        {
          quote: 'We watched the lessons together on our TV in the evenings. The breathing techniques kept labor calm, and my husband knew exactly how to relieve lower back pain.',
          author: 'Caroline & Peter',
          role: 'Parents of Leo',
          city: 'Warsaw',
          avatar: 'CP',
          rating: 5,
        },
        {
          quote: 'The early home postpartum module was priceless. Bathing newborn without tears or fear, burping holds – these videos literally saved our nights.',
          author: 'Martha & Thomas',
          role: 'Parents of Sophie',
          city: 'Gdansk',
          avatar: 'MT',
          rating: 5,
        },
        {
          quote: 'The Dad Zone is a masterpiece. No fluff, straight to the point: what to pack, how to communicate with hospital staff, and supporting recovery.',
          author: 'James',
          role: 'Father to Tim',
          city: 'Wroclaw',
          avatar: 'JM',
          rating: 5,
        },
      ],
    },
    pricing: {
      badge: 'One-time fee · Access for two',
      title: 'Full Access to VOD Educational Program',
      price: '349 PLN',
      unit: 'one-time payment',
      features: [
        '52 cinema-grade 4K lessons (over 15 hours of video content)',
        'Access for two for 12 months from the estimated due date',
        'Dedicated Dad Zone & fast video cheatsheets',
        'Digital Parent Notebook and printable PDF templates',
        'Mobile web application and Smart TV player support',
        'Official Certificate of educational program completion',
      ],
      cta: 'Enroll Now · 349 PLN',
      statusBadge: 'Status: Educational Training Service (E-learning VOD)',
      statusText: '14-day hassle-free money-back guarantee',
      guarantee: '14-day satisfaction guarantee. If the course doesn’t meet your expectations, we refund 100% with no questions asked.',
    },
    faq: {
      tag: 'Frequently Asked Questions',
      title: 'Everything you should know before joining',
      items: [
        {
          q: 'How long does our access last?',
          a: 'Your access remains active for 12 months from your estimated due date. It supports you throughout pregnancy and your baby’s entire first year.',
        },
        {
          q: 'Can both partners log in on separate devices?',
          a: 'Yes! A single subscription lets both parents log in concurrently on phones, tablets, laptops, and Smart TVs without extra charge.',
        },
        {
          q: 'When is the ideal time to start the course?',
          a: 'We recommend joining between weeks 20 and 28 of pregnancy, but the materials provide immense value from week 6 up to the final days before birth.',
        },
        {
          q: 'Does this replace medical consultations?',
          a: 'HappyBirth is an educational e-learning program preparing you for parenthood. It complements healthcare with practical skills and domestic calm.',
        },
        {
          q: 'How does payment work and do I get an invoice?',
          a: 'Payment is one-time via secure Stripe, Apple Pay, Google Pay, or card. You get immediate access to all modules and an automatic invoice.',
        },
      ],
    },
    footer: {
      tagline: 'Loving online birthing school for moms and dads. 52 video lessons, proven tips, and support through baby’s entire first year.',
      familyCount: 'Over 18,000 prepared families',
      navTitle: 'Discover HappyBirth',
      legalNote: 'HappyBirth is an online educational platform offering training courses in VOD video format. All materials are purely educational and preparatory for parenthood. The service does not constitute or replace individual medical care, diagnosis, or physician advice.',
      rightsReserved: 'All rights reserved.',
    },
  },

  ru: {
    nav: {
      ribbonTitle: 'Образовательная Платформа для Родителей:',
      ribbonDesc: '52 видеоурока VOD · Доступ для двоих на 12 месяцев',
      a11yBtn: 'Доступность ЕС',
      haveAccount: 'Уже есть аккаунт?',
      enterZone: 'Войти в Зону',
      brandSubtitle1: 'Школа Родов · VOD Обучение',
      brandSubtitle2: 'онлайн курс для двоих',
      links: {
        pillars: '4 Столпа Спокойствия',
        stages: '9 Этапов',
        tools: 'Лайфхаки и Инструменты',
        reviews: 'Отзывы родителей',
        price: 'Цена 349 zł',
        faq: 'Частые вопросы',
      },
      zoneBtn: 'Зона Родителей',
      joinBtn: 'Купить курс · 349 zł',
      partnerB2B: 'Партнёрская Зона B2B (Аффилиация)',
    },
    hero: {
      badge: 'Образовательная Онлайн-Программа для Родителей · 52 Видеоурока VOD',
      title1: 'Школа родов,',
      titlePink1: 'которая дарит',
      titlePink2: 'спокойствие',
      title2: 'и уверенность в себе',
      desc: 'Всё, что вам нужно знать о родах, схватках, уходе за новорожденным и первых неделях дома. Без медицинского жаргона, в ритме вашей семьи.',
      ctaBuy: 'Начать подготовку · 349 zł',
      ctaPreview: 'Смотреть демо-урок',
      bullets: [
        'Доступ на 12 месяцев для двоих',
        '52 кинематографичных урока 4K',
        'Блокнот родителя и шпаргалки PDF',
      ],
      stats: {
        lessons: '52 видеоурока',
        hours: '15+ часов знаний',
        modules: '9 тематических модулей',
        rating: 'Оценка 4.9/5 от родителей',
      },
    },
    pillars: {
      tag: 'Учебный План',
      title: '4 Столпа Обучения и Спокойствия HappyBirth',
      desc: 'Практические знания, которые подготовят вас к каждому этапу нового пути.',
      items: [
        {
          num: '01',
          title: 'Роды и Дыхание',
          subtitle: 'Сотрудничество с телом и естественный ритм',
          desc: 'Осознанное дыхание, удобные вертикальные позы и спокойствие. Учимся доверять телу и сохранять уверенность шаг за шагом.',
          accent: '#EC008C',
          bg: '#FAE3EB',
        },
        {
          num: '02',
          title: 'Тело и Мягкое Движение',
          subtitle: 'Комфорт, мобильность и бережное восстановление',
          desc: 'Практические упражнения на расслабление, массаж от партнера и безопасная домашняя регенерация для мамы.',
          accent: '#98269C',
          bg: '#EAD5E5',
        },
        {
          num: '03',
          title: 'Заботливое Кормление и Связь',
          subtitle: 'Близость без давления и чувства вины',
          desc: 'Удобное прикладывание и спокойный старт – как при грудном вскармливании, так и при бутылочном. Безопасно и с пониманием.',
          accent: '#0088BC',
          bg: '#D0EBF3',
        },
        {
          num: '04',
          title: 'Малыш Дома',
          subtitle: 'Уверенность в 3 часа ночи',
          desc: 'Купание без слез, безопасный сон, ношение и успокоение малыша. Практическое спокойствие в первые недели дома.',
          accent: '#347A22',
          bg: '#DFEED4',
        },
      ],
    },
    stages: {
      tag: 'Программа курса',
      title: '9 Образовательных Модулей Вашего Пути',
      desc: 'От первых недель беременности, через роды, до первого года жизни малыша.',
      items: [
        { num: '01', name: 'До начала', desc: 'Осознанная подготовка и спокойствие в мыслях', color: '#8F8D8D' },
        { num: '02', name: 'Две полоски', desc: 'I Триместр – эмоции, тело и первые ощущения', color: '#54BF39' },
        { num: '03', name: 'Наконец лучше', desc: 'II Триместр – новая энергия, движение и силы', color: '#FCD705' },
        { num: '04', name: 'Сумка собрана', desc: 'III Триместр – умное приданое и сборы', color: '#F57B14' },
        { num: '05', name: 'Главный День', desc: 'Тело в движении, дыхание и спокойствие вдвоем', color: '#ED1C24' },
        { num: '06', name: 'План Б без паники', desc: 'Осознанное рождение в любом сценарии', color: '#952999' },
        { num: '07', name: 'Первая ночь дома', desc: 'Бережный послеродовой период и отдых мамы', color: '#EC008C' },
        { num: '08', name: 'Кормление с любовью', desc: 'Грудь и бутылочка без давления и вины', color: '#00ADEF' },
        { num: '09', name: 'Вместе 1-й год', desc: 'Сон, развитие малыша и безопасность', color: '#3B46A4' },
      ],
    },
    tools: {
      tag: 'Лайфхаки и Инструменты',
      title: 'Практические инструменты и ежедневные лайфхаки',
      desc: 'Всё, что облегчает будни мамы и дает четкие, понятные задачи папе.',
      tipBadge: 'Лайфхак Дня HappyBirth',
      tipTitle: 'Ежедневная порция мудрости',
      tipDesc: 'Короткий проверенный совет от акушерок и опытных родителей из наших 52 уроков.',
      card1Title: 'Цифровой Блокнот Родителя (PDF)',
      card1Desc: 'Готовый бланк для обменной карты: пожелания по контакту кожа-к-коже, музыке, свету и помощи партнера.',
      card2Title: 'Аптечка SOS и Списки в роддом',
      card2Desc: 'Умный список только самого необходимого. Без лишних трат на бесполезные гаджеты.',
      card3Title: 'Видеошпаргалки для Папы',
      card3Desc: 'Короткие 2-минутные инструкции: массаж крестца, поддержка в душе и первые шаги дома.',
    },
    comparison: {
      tag: 'Почему HappyBirth?',
      title: 'Традиционная школа родов vs HappyBirth',
      colFeature: 'Критерий',
      colTraditional: 'Традиционная Школа Родов',
      colHappyBirth: 'HappyBirth Онлайн VOD',
      items: [
        {
          feature: 'Формат обучения',
          traditional: 'Лекции в душных кабинетах, поездки после работы',
          happybirth: 'Современный VOD e-learning на диване в телефоне или на ТВ',
        },
        {
          feature: 'Участие папы',
          traditional: 'Часто чувствует себя лишним пассивным зрителем',
          happybirth: 'Специальная Зона для Папы: техники массажа и четкие задачи',
        },
        {
          feature: 'Доступ после родов',
          traditional: 'Курс заканчивается до родов – дома вы остаетесь одни',
          happybirth: 'Доступ на 12 месяцев с даты родов – возврат к урокам дома',
        },
        {
          feature: 'Материалы',
          traditional: 'Бумажная тетрадь, которая теряется в стрессе',
          happybirth: 'Цифровой Блокнот Родителя PDF, видео-лайфхаки и памятки',
        },
        {
          feature: 'Философия',
          traditional: 'Устаревшие догмы, вызывающие вину и тревогу',
          happybirth: 'Тепло, уважение к вашим решениям и ноль осуждения',
        },
      ],
    },
    testimonials: {
      tag: 'Голоса родителей',
      title: 'Истории семей, которые доверились HappyBirth',
      items: [
        {
          quote: 'Смотрели уроки по вечерам на телевизоре. Благодаря дыхательным техникам роды прошли спокойно, а муж точно знал, как снимать боль в пояснице.',
          author: 'Каролина и Петр',
          role: 'Родители Леона',
          city: 'Варшава',
          avatar: 'КП',
          rating: 5,
        },
        {
          quote: 'Больше всего ценю модуль о первых днях дома. Купание без слез и страха, позы для срыгивания – эти видео просто спасли наши ночи.',
          author: 'Марта и Томаш',
          role: 'Родители Софии',
          city: 'Гданьск',
          avatar: 'МТ',
          rating: 5,
        },
        {
          quote: 'Зона для папы — это шедевр. Никакой воды, всё по делу: что собрать, как общаться в роддоме, как разгрузить жену после родов.',
          author: 'Якуб',
          role: 'Папа Тимона',
          city: 'Вроцлав',
          avatar: 'ЯК',
          rating: 5,
        },
      ],
    },
    pricing: {
      badge: 'Единоразовая оплата · Доступ для двоих',
      title: 'Полный доступ к обучающей программе VOD',
      price: '349 zł',
      unit: 'единоразово',
      features: [
        '52 фильма в качестве 4K (более 15 часов материалов)',
        'Доступ для двоих на 12 месяцев с даты родов',
        'Специальная Зона для Папы и видеошпаргалки',
        'Цифровой Блокнот Родителя и шаблоны PDF для печати',
        'Мобильное веб-приложение и поддержка Smart TV',
        'Официальный сертификат об окончании программы',
      ],
      cta: 'Купить доступ · 349 zł',
      statusBadge: 'Статус: Образовательно-обучающая услуга (E-learning VOD)',
      statusText: '14 дней гарантии возврата без лишних вопросов',
      guarantee: '14 дней гарантии удовлетворения. Если курс вам не подойдет, вернем 100% средств.',
    },
    faq: {
      tag: 'Часто задаваемые вопросы',
      title: 'Всё, что важно знать перед началом',
      items: [
        {
          q: 'На какой срок мы получаем доступ к курсу?',
          a: 'Доступ действует 12 месяцев с предполагаемой даты родов. Это значит, что курс будет поддерживать вас всю беременность и весь первый год малыша.',
        },
        {
          q: 'Может ли партнер смотреть курс с другого устройства?',
          a: 'Да! Один аккаунт дает возможность параллельного входа на телефоне мамы, папы, планшете и на Smart TV без доплат.',
        },
        {
          q: 'Когда лучше всего начинать обучение?',
          a: 'Рекомендуем присоединяться между 20-й и 28-й неделей, но материалы принесут огромную пользу как на ранних сроках, так и прямо перед родами.',
        },
        {
          q: 'Заменяет ли курс консультацию врача или акушерки?',
          a: 'HappyBirth — это обучающая программа подготовки к родительству. Она дополняет медицинскую помощь практическими навыками и домашним спокойствием.',
        },
        {
          q: 'Как проходит оплата и получу ли я чек/счет?',
          a: 'Оплата единоразовая через Stripe, Apple Pay, Google Pay или карту. Доступ ко всем урокам открывается моментально, чек формируется автоматически.',
        },
      ],
    },
    footer: {
      tagline: 'Заботливая онлайн школа родов для мам и пап. 52 видеоурока, проверенные лайфхаки и поддержка на протяжении всего первого года малыша.',
      familyCount: 'Более 18 000 подготовленных семей',
      navTitle: 'Узнайте о HappyBirth',
      legalNote: 'HappyBirth — это онлайн-платформа, предоставляющая обучающие курсы в формате VOD-видео. Все материалы носят исключительно образовательный и подготовительный характер к родительству. Услуга не заменяет медицинской помощи, диагностики или консультации врача.',
      rightsReserved: 'Все права защищены.',
    },
  },
};

export function getMarketingTranslations(lang: Language): MarketingContent {
  return marketingTranslations[lang] || marketingTranslations.pl;
}
