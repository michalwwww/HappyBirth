'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Check,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { detectClientOrderBumpEdition } from '@/lib/promo';

export type BirthPlanLangMode = 'pl' | 'pl-en' | 'pl-de' | 'pl-nl' | 'en' | 'es';

interface TranslatedOption {
  id: string;
  recommended?: boolean;
  pl: string;
  en: string;
  de: string;
  nl: string;
  es: string;
}

interface PlanSection {
  id: string;
  title: {
    pl: string;
    en: string;
    de: string;
    nl: string;
    es: string;
  };
  category: {
    pl: string;
    en: string;
    de: string;
    nl: string;
    es: string;
  };
  options: TranslatedOption[];
}

const MODE_LABELS: {
  key: BirthPlanLangMode;
  badge: string;
  legalNote: string;
  docTitle: string;
  docSubtitle: string;
  midwifeNotice?: string;
}[] = [
  {
    key: 'pl',
    badge: '🇵🇱 Polski (Standard MZ 2026)',
    legalNote: 'Zgodny ze Standardem Organizacyjnym Opieki Okołoporodowej (Rozp. MZ)',
    docTitle: 'Mój Plan Porodu',
    docSubtitle:
      'Niniejszy dokument przedstawia moje świadome preferencje dotyczące przebiegu porodu i opieki nad noworodkiem, sporządzone w porozumieniu z osobą towarzyszącą zgodnie z prawami pacjenta.',
  },
  {
    key: 'pl-en',
    badge: '🇵🇱🇬🇧 Dwujęzyczny PL + English (UK NHS / US)',
    legalNote: 'Simultaneous Bilingual Birth Plan (NICE CG190 NHS / ACOG & Polish Translation)',
    docTitle: 'My Birth Plan / Mój Plan Porodu (EN ↔ PL)',
    docSubtitle:
      'Informed birth preferences for the Midwife & L&D Team (with simultaneous Polish translation for parents).',
    midwifeNotice:
      '🇬🇧 Note for the Midwife / L&D Team: Polish is our first language. During strong contractions it may be harder for the mother to process medical terms in English — please speak slowly, wait until a contraction ends before asking for consent, and use the B.R.A.I.N. framework for non-emergency interventions.',
  },
  {
    key: 'pl-de',
    badge: '🇵🇱🇩🇪 Dwujęzyczny PL + Deutsch (Kreißsaal DE/AT/CH)',
    legalNote: 'Zweisprachiger Geburtsplan für den Kreißsaal (S3-Leitlinie Vaginalgeburt & Polnisch)',
    docTitle: 'Mein Geburtsplan / Mój Plan Porodu (DE ↔ PL)',
    docSubtitle:
      'Unsere Wünsche für die Geburt im Kreißsaal (mit simultaner polnischer Übersetzung für die Eltern).',
    midwifeNotice:
      '🇩🇪 Hinweis für die Hebamme & das Kreißsaal-Team: Polnisch ist unsere Muttersprache. Während starker Wehen fällt das Verstehen medizinischer Fachbegriffe auf Deutsch schwerer — bitte sprechen Sie langsam und warten Sie für Aufklärungen die Wehenpause ab.',
  },
  {
    key: 'pl-nl',
    badge: '🇵🇱🇳🇱 Dwujęzyczny PL + Nederlands (Holandia)',
    legalNote: 'Tweetalig Geboorteplan voor Verloskundige & Ziekenhuis (NL ↔ PL)',
    docTitle: 'Mijn Geboorteplan / Mój Plan Porodu (NL ↔ PL)',
    docSubtitle:
      'Onze geboortewensen voor de verloskundige en het ziekenhuisteam (met Poolse vertaling voor de ouders).',
    midwifeNotice:
      '🇳🇱 Bericht voor de Verloskundige & Verpleegkundige: Pools is onze moedertaal. Tijdens sterke weeën is het lastiger om medische termen in het Nederlands te volgen — spreek a.u.b. rustig en wacht tot na een wee voordat u om toestemming vraagt.',
  },
  {
    key: 'en',
    badge: '🇬🇧🇺🇸 English Only (NHS / US L&D)',
    legalNote: 'Aligned with NICE CG190 (UK NHS) & ACOG Clinical Guidelines (US/CA/AU)',
    docTitle: 'My Visual Birth Preferences (Plan A & Plan B)',
    docSubtitle:
      'Thank you for supporting our family today. These are our informed preferences while all observations remain reassuring.',
  },
  {
    key: 'es',
    badge: '🇪🇸🇲🇽 Español (Plan de Parto)',
    legalNote: 'Alineado con la Estrategia de Atención al Parto Normal (SNS España / NOM-007 México)',
    docTitle: 'Mi Plan de Parto y Nacimiento',
    docSubtitle:
      'Preferencias informadas para el equipo de matronas, ginecología y neonatología mientras el bienestar materno-fetal sea normal.',
  },
];

const SECTIONS: PlanSection[] = [
  {
    id: 'atmosfera',
    title: {
      pl: '1. Warunki i atmosfera na sali porodowej',
      en: '1. Labour Room Environment & Communication',
      de: '1. Atmosphäre & Begleitung im Kreißsaal',
      nl: '1. Omgeving & Begeleiding in de Verloskamer',
      es: '1. Ambiente y Acompañamiento en Paritorio',
    },
    category: {
      pl: 'Otoczenie',
      en: 'Environment',
      de: 'Umgebung',
      nl: 'Omgeving',
      es: 'Entorno',
    },
    options: [
      {
        id: 'opt_partner',
        recommended: true,
        pl: 'Obecność partnera / osoby towarzyszącej przez cały czas trwania porodu (oraz podczas triażu i badań)',
        en: 'Continuous presence of my birth partner throughout triage, active labour and birth',
        de: 'Durchgehende Anwesenheit meines Partners während der Aufnahme, der Wehen und der Geburt',
        nl: 'Continue aanwezigheid van mijn geboortepartner tijdens triage, ontsluiting en bevalling',
        es: 'Presencia continua de mi acompañante durante todo el trabajo de parto y nacimiento',
      },
      {
        id: 'opt_swiatlo',
        recommended: true,
        pl: 'Przygaszone światło, cisza i ochrona prywatności (wsparcie naturalnej oksytocyny)',
        en: 'Dimmed lighting, quiet environment and minimal room interruptions to support natural oxytocin',
        de: 'Gedimmtes Licht, Ruhe und Schutz der Intimsphäre zur Förderung des natürlichen Oxytocins',
        nl: 'Gedimd licht, rust en minimale verstoringen om natuurlijke oxytocine te ondersteunen',
        es: 'Luz tenue, silencio y privacidad para favorecer la oxitocina endógena',
      },
      {
        id: 'opt_zgoda_po_skurczu',
        recommended: true,
        pl: 'Omawianie propozycji medycznych i pytanie o zgodę wyłącznie w przerwie między skurczami (nigdy na szczycie skurczu)',
        en: 'Please discuss medical options and ask for informed consent between contractions, never at the peak of a contraction',
        de: 'Bitte medizinische Maßnahmen und Aufklärungen nur in den Wehenpausen besprechen, niemals auf dem Höhepunkt einer Wehe',
        nl: 'Bespreek medische opties en toestemming a.u.b. tussen de weeën door, niet tijdens het hoogtepunt van een wee',
        es: 'Por favor, explicar procedimientos y solicitar consentimiento entre contracciones, nunca en el pico de dolor',
      },
      {
        id: 'opt_plyny',
        recommended: true,
        pl: 'Swobodne picie wody niegazowanej i napojów izotonicznych oraz drobne przekąski energetyczne',
        en: 'Freedom to drink water / isotonic fluids and eat light energy snacks during labour',
        de: 'Freies Trinken (Wasser / isotonische Getränke) und leichte Snacks während der Eröffnungsphase',
        nl: 'Vrij drinken van water / isotone dranken en lichte snacks tijdens de ontsluitingsfase',
        es: 'Libertad para beber agua y bebidas isotónicas durante el trabajo de parto',
      },
      {
        id: 'opt_wlasne_ubranie',
        recommended: true,
        pl: 'Możliwość rodzenia we własnej koszuli porodowej i słuchania własnej muzyki relaksacyjnej',
        en: 'Wearing my own birth gown/clothes and playing our own relaxation audio',
        de: 'Tragen eigener Geburtskleidung und Abspielen eigener Entspannungsmusik',
        nl: 'Dragen van eigen bevallingskleding en luisteren naar eigen ontspanningsmuziek',
        es: 'Uso de ropa propia cómoda y música relajante con auriculares o altavoz bajo',
      },
    ],
  },
  {
    id: 'faza1',
    title: {
      pl: '2. I Okres Porodu (Ruch, Monitoring i Łagodzenie Bólu)',
      en: '2. First Stage of Labour (Mobility, Monitoring & Pain Relief)',
      de: '2. Eröffnungsphase (Bewegung, CTG & Schmerzlinderung)',
      nl: '2. Ontsluitingsfase (Beweging, CTG & Pijnstilling)',
      es: '2. Dilatación (Movilidad, Monitorización y Analgesia)',
    },
    category: {
      pl: 'Ruch i Ulga',
      en: 'Mobility & Relief',
      de: 'Bewegung & Schmerz',
      nl: 'Beweging & Pijn',
      es: 'Movilidad y Alivio',
    },
    options: [
      {
        id: 'opt_ruch',
        recommended: true,
        pl: 'Swoboda poruszania się i zmian pozycji (piłka porodowa, worek sako, bezprzewodowe KTG / telemetria)',
        en: 'Freedom of movement, upright positions, birth ball / peanut ball and wireless / intermittent fetal monitoring',
        de: 'Freie Bewegung, aufrechte Positionen, Pezziball und kabelloses / intermittierendes CTG (Telemetrie)',
        nl: 'Bewegingsvrijheid, verticale houdingen, geboortebal en draadloos CTG',
        es: 'Libertad de movimiento, pelota de parto / cacahuete y monitorización fetal inalámbrica o intermitente',
      },
      {
        id: 'opt_woda',
        recommended: true,
        pl: 'Dostęp do ciepłego prysznica lub wanny porodowej (hydroterapia) oraz stymulatora TENS / grzebyka porodowego',
        en: 'Use of warm shower / birth pool (water immersion), TENS machine and birth comb acupressure',
        de: 'Nutzung von warmer Dusche oder Gebärwanne (Wassergeburt/Entspannungsbad), TENS-Gerät und Geburtskamm',
        nl: 'Gebruik van warme douche of bevalbad, TENS-apparaat en geboortekam',
        es: 'Uso de ducha tibia o bañera de dilatación (hidroterapia), TENS y peine de parto',
      },
      {
        id: 'opt_niefarm',
        recommended: true,
        pl: 'Ucisk krzyżowy (S1–S4) i Double-Hip Squeeze wykonywany przez partnera oraz gaz Entonox w razie potrzeby',
        en: 'Partner sacral counter-pressure (S1–S4), double-hip squeeze and Entonox (Gas & Air) on request',
        de: 'Kreuzbein-Gegendruck durch den Partner sowie Lachgas (Entonox) bei Bedarf',
        nl: 'Sacrale tegendruk door mijn partner en lachgas (Entonox) indien gewenst',
        es: 'Contrapresión sacra por mi acompañante y óxido nitroso (Entonox) si está disponible',
      },
      {
        id: 'opt_pecherz',
        recommended: true,
        pl: 'Ochrona pęcherza płodowego — brak rutynowej amniotomii (przebicia wód) oraz brak rutynowej oksytocyny przy prawidłowym KTG',
        en: 'Keep membranes intact — avoid routine artificial rupture of membranes (ARM) or Pitocin/Syntocinon augmentation if CTG is reassuring',
        de: 'Fruchtblase intakt lassen — keine routinemäßige Amniotomie oder Oxytocin-Gabe bei unauffälligem CTG',
        nl: 'Vliezen intact laten — geen routinematig breken van de vliezen (amniotomie) of bijstimulatie bij een goed CTG',
        es: 'Respetar la bolsa íntegra — evitar amniotomía rutinaria u oxitocina sintética si el registro CTG es normal',
      },
      {
        id: 'opt_wenflon',
        pl: 'Kaniulacja żyły (wenflon z koreczkiem) bez stałego podłączenia kroplówki ograniczającej ruch',
        en: 'Saline lock / capped IV cannula (heparin lock) without continuous IV tether so I can move freely',
        de: 'Abgestöpselter Venenzugang ohne dauerhafte Infusionsleitung für volle Bewegungsfreiheit',
        nl: 'Afgedopt waakinfuus zonder vaste infuuslijn zodat ik vrij kan bewegen',
        es: 'Vía venosa salinizada (obturada) sin suero continuo para conservar la movilidad',
      },
      {
        id: 'opt_zzo',
        pl: 'Otwartość na znieczulenie zewnątrzoponowe (ZZO / Epidural / PDA / Ruggenprik) na moją wyraźną prośbę + pozycje z Peanut Ball',
        en: 'Open to Epidural analgesia when I request it, combined with regular position changes using a Peanut Ball',
        de: 'Offen für eine Periduralanästhesie (PDA / Walking-PDA) auf meinen Wunsch',
        nl: 'Open voor epidurale pijnstilling (ruggenprik) op mijn verzoek',
        es: 'Abierta a analgesia epidural a petición mía (preferiblemente baja dosis / walking epidural con pelota cacahuete)',
      },
    ],
  },
  {
    id: 'faza2',
    title: {
      pl: '3. II Okres Porodu (Parcie, Pozycje Wertykalne i Ochrona Krocza)',
      en: '3. Second Stage (Pushing, Upright Positions & Perineal Protection)',
      de: '3. Austrittsphase (Pressen, Gebärpositionen & Dammschutz)',
      nl: '3. Uitdrijvingsfase (Persen, Houdingen & Perineumbescherming)',
      es: '3. Expulsivo (Pujos, Posiciones Verticales y Protección Perineal)',
    },
    category: {
      pl: 'Ochrona Krocza',
      en: 'Perineal Care',
      de: 'Dammschutz',
      nl: 'Perineum',
      es: 'Expulsivo',
    },
    options: [
      {
        id: 'opt_parcie_spontaniczne',
        recommended: true,
        pl: 'Parcie spontaniczne / wydechowe zgodne z odruchem ciała (bez wstrzymywania oddechu i odliczania do 10)',
        en: 'Mother-led, spontaneous / physiological breathing-down pushing (avoid purple coached counting unless clinically needed)',
        de: 'Spontanes, wehenbegleitendes Mitpressen / Ausatmen nach eigenem Körpergefühl (kein forciertes Zählen)',
        nl: 'Spontaan, ademend meepersen op geleide van mijn eigen persdrang',
        es: 'Pujos espontáneos y fisiológicos en espiración (evitar pujos dirigidos en apnea salvo indicación médica)',
      },
      {
        id: 'opt_wertykalne',
        recommended: true,
        pl: 'Poród w pozycji wertykalnej lub na boku (w klęku przy podniesionym wezgłowiu, na czworaka, stołek porodowy — unikamy leżenia płasko na plecach)',
        en: 'Birth in an upright, kneeling, all-fours or side-lying position (avoid flat lithotomy position on my back)',
        de: 'Geburt in aufrechter Position, im Vierfüßlerstand, kniend oder in Seitenlage (Rückenlage vermeiden)',
        nl: 'Bevallen in verticale houding, op handen en knieën, knielend of in zijligging',
        es: 'Expulsivo en posición vertical, cuadrupedia, de rodillas o decúbito lateral (evitar litotomía horizontal)',
      },
      {
        id: 'opt_ochrona_krocza',
        recommended: true,
        pl: 'Aktywna ochrona krocza ciepłymi kompresami i powolnym rodzeniem główki — brak rutynowego nacięcia krocza (episiotomii) oraz brak chwytu Kristellera',
        en: 'Active perineal protection with warm compresses and slow crowning — no routine episiotomy without explicit consent',
        de: 'Aktiver Dammschutz mit warmen Kompressen — kein routinemäßiger Dammschnitt (Episiotomie) und kein Kristeller-Handgriff',
        nl: 'Actieve perineumbescherming met warme kompressen — geen routinematige episiotomie (knip) zonder toestemming',
        es: 'Protección activa del periné con compresas tibias — sin episiotomía rutinaria y rechazo expreso a la maniobra de Kristeller',
      },
      {
        id: 'opt_pepowina_tata',
        recommended: true,
        pl: 'Odpępnienie odroczone (po całkowitym ustaniu tętnienia pępowiny, min. 1–3 minuty) oraz przecięcie pępowiny przez partnera',
        en: 'Optimal delayed cord clamping (wait until the cord is white and stops pulsing, 1–3+ min) with partner invited to cut the cord',
        de: 'Spätes Abnabeln nach vollständigem Auspulsieren der Nabelschnur (mind. 1–3 Min.) und Durchtrennen durch den Partner',
        nl: 'Laat afnavelen nadat de navelstreng volledig is uitgeklopt (min. 1–3 min.) en doorknippen door mijn partner',
        es: 'Pinzamiento tardío del cordón umbilical (tras dejar de latir, mín. 1–3 min) y corte por el acompañante',
      },
    ],
  },
  {
    id: 'kontakt',
    title: {
      pl: '4. Złota Godzina, Siara i Opieka nad Noworodkiem',
      en: '4. Golden Hour, Skin-to-Skin, Colostrum & Newborn Care',
      de: '4. Golden Hour, Bonding, Kolostrum & Neugeborenenpflege',
      nl: '4. Gouden Uur, Huid-op-Huid, Colostrum & Pasgeborene',
      es: '4. Hora Sagrada, Piel con Piel, Calostro y Recién Nacido',
    },
    category: {
      pl: 'Pierwsze Chwile',
      en: 'Golden Hour',
      de: 'Bonding',
      nl: 'Gouden Uur',
      es: 'Hora Sagrada',
    },
    options: [
      {
        id: 'opt_skora_do_skory',
        recommended: true,
        pl: 'Nieprzerwany kontakt „skóra do skóry” przez minimum 2 godziny po porodzie (ważenie i mierzenie odroczone po pierwszym karmieniu)',
        en: 'Uninterrupted skin-to-skin contact for at least 1–2 hours — delay routine weighing and measuring until after the first breastfeed',
        de: 'Ununterbrochener Haut-zu-Haut-Kontakt (Bonding) für mind. 1–2 Stunden — Wiegen und Messen erst nach dem ersten Stillen',
        nl: 'Ononderbroken huid-op-huidcontact gedurende minimaal 1–2 uur — wegen en meten uitstellen tot na de eerste voeding',
        es: 'Contacto piel con piel ininterrumpido durante al menos 2 horas — posponer peso y talla hasta después de la primera toma',
      },
      {
        id: 'opt_karmienie_siara',
        recommended: true,
        pl: 'Wyłączne karmienie piersią i naszą własną odciągniętą siarą w strzykawkach — brak dokarmiania mlekiem modyfikowanym i brak smoczka bez wskazań medycznych',
        en: 'Exclusive breastfeeding + use of our own antenatal harvested colostrum syringes — no formula top-ups or pacifiers without medical need and parent consent',
        de: 'Ausschließliches Stillen + Nutzung unserer mitgebrachten Kolostrum-Spritzen — keine Säuglingsnahrung (Pre-Nahrung) ohne Rücksprache',
        nl: 'Uitsluitend borstvoeding + gebruik van onze eigen meegebrachte colostrumspuitjes — geen kunstvoeding zonder overleg',
        es: 'Lactancia materna exclusiva + uso de nuestras jeringas de calostro prenatal — sin biberones de fórmula sin consentimiento',
      },
      {
        id: 'opt_badania_na_brzuchu',
        recommended: true,
        pl: 'Badania noworodka, podanie witaminy K i szczepienia wykonywane w obecności przynajmniej jednego rodzica (w trakcie ssania piersi lub kangurowania)',
        en: 'All newborn checks, Vitamin K and blood tests performed in the presence of a parent (ideally while skin-to-skin or feeding)',
        de: 'Alle Untersuchungen des Neugeborenen und Vitamin-K-Gabe im Beisein mindestens eines Elternteils (gerne im Hautkontakt)',
        nl: 'Alle controles van de baby en vitamine K-toediening in aanwezigheid van ten minste één ouder',
        es: 'Todas las exploraciones pediátricas y administración de vitamina K en presencia de los padres (preferiblemente en piel con piel)',
      },
      {
        id: 'opt_kapiel_odroczona',
        recommended: true,
        pl: 'Odroczona pierwsza kąpiel noworodka (zachowanie ochronnej mazi płodowej vernix przez min. 24–48h)',
        en: 'Delay first baby bath for at least 24–48 hours to preserve protective vernix caseosa',
        de: 'Erstes Babybad um mind. 24–48 Stunden verschieben, um die schützende Käseschmiere (Vernix) zu erhalten',
        nl: 'Eerste badje van de baby minimaal 24–48 uur uitstellen om het beschermende huidsmeer (vernix) te behouden',
        es: 'Posponer el primer baño del bebé al menos 24–48 horas para conservar el vérnix caseoso protector',
      },
    ],
  },
  {
    id: 'plan_b_cc',
    title: {
      pl: '5. Plan B — W razie konieczności Cięcia Cesarskiego (Gentle Cesarean)',
      en: '5. Plan B — Gentle / Family-Centered Cesarean Preferences',
      de: '5. Plan B — Sanfte Kaisergeburt (falls Kaiserschnitt medizinisch notwendig)',
      nl: '5. Plan B — Gentle Sectio (indien een keizersnede medisch nodig is)',
      es: '5. Plan B — Cesárea Humanizada / Centrada en la Familia (si es necesaria)',
    },
    category: {
      pl: 'Plan B (Cesarka)',
      en: 'Plan B (C-Section)',
      de: 'Plan B (Sectio)',
      nl: 'Plan B (Sectio)',
      es: 'Plan B (Cesárea)',
    },
    options: [
      {
        id: 'opt_cc_partner',
        recommended: true,
        pl: 'Obecność partnera na sali operacyjnej przy znieczuleniu podpajęczynówkowym oraz opuszczona kurtyna w momencie narodzin',
        en: 'Partner present in the operating theatre (under spinal/epidural) and surgical drape lowered at the moment of birth',
        de: 'Anwesenheit des Partners im OP-Saal (bei Regionalanästhesie) und kurzes Absenken des OP-Tuchs bei der Geburt (Kaisergeburt)',
        nl: 'Aanwezigheid van mijn partner op de operatiekamer en het laten zakken van het doek op het moment van geboorte',
        es: 'Presencia de mi acompañante en quirófano (Ley 11.108 / protocolo humanizado) y bajada del campo quirúrgico al nacer',
      },
      {
        id: 'opt_cc_kangurowanie',
        recommended: true,
        pl: 'Natychmiastowy kontakt „skóra do skóry” na klatce piersiowej mamy na sali operacyjnej, a w razie braku możliwości — nieprzerwane kangurowanie przez tatę i przekazanie siary',
        en: 'Immediate cheek-to-chest skin-to-skin with mother in theatre, or continuous skin-to-skin with partner + our colostrum syringes until mother is in recovery',
        de: 'Sofortiges Bonding auf der Brust der Mutter im OP, oder durchgehendes Känguruhen beim Vater + Gabe unserer Kolostrum-Spritzen',
        nl: 'Direct huid-op-huidcontact bij de moeder op de OK, of ononderbroken buidelen bij de partner + toedienen van ons colostrum',
        es: 'Contacto piel con piel inmediato con la madre en quirófano, o método canguro continuo con el padre + administración de nuestro calostro',
      },
    ],
  },
];

export function BirthPlanGenerator() {
  const [langMode, setLangMode] = useState<BirthPlanLangMode>('pl');
  const [motherName, setMotherName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [customNotes, setCustomNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Inicjalizacja domyślnych rekomendacji oraz inteligentnej detekcji języka dla Polek za granicą
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const detected = detectClientOrderBumpEdition({});
        if (detected.editionKey === 'pl-uk') setLangMode('pl-en');
        else if (detected.editionKey === 'pl-de') setLangMode('pl-de');
        else if (detected.editionKey === 'pl-nl') setLangMode('pl-nl');
        else if (
          detected.editionKey === 'en-uk' ||
          detected.editionKey === 'en-us' ||
          detected.editionKey === 'en-au' ||
          detected.editionKey === 'en-ae'
        ) {
          setLangMode('en');
        } else if (detected.editionKey === 'es') {
          setLangMode('es');
        }
      } catch {}

      try {
        const savedData = localStorage.getItem('hb_birth_plan_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setMotherName(parsed.motherName || '');
          setPartnerName(parsed.partnerName || '');
          setHospitalName(parsed.hospitalName || '');
          setDueDate(parsed.dueDate || '');
          if (parsed.langMode) setLangMode(parsed.langMode);
          if (parsed.selectedOptions && Object.keys(parsed.selectedOptions).length > 0) {
            setSelectedOptions(parsed.selectedOptions);
            setCustomNotes(parsed.customNotes || '');
            return;
          }
        }
      } catch {}

      const initial: Record<string, boolean> = {};
      SECTIONS.forEach((sec) => {
        sec.options.forEach((opt) => {
          if (opt.recommended) {
            initial[opt.id] = true;
          }
        });
      });
      setSelectedOptions(initial);
    }
  }, []);

  const toggleOption = (id: string) => {
    const updated = { ...selectedOptions, [id]: !selectedOptions[id] };
    setSelectedOptions(updated);
    saveData(updated, langMode);
  };

  const saveData = (opts = selectedOptions, mode = langMode) => {
    if (typeof window !== 'undefined') {
      const data = {
        motherName,
        partnerName,
        hospitalName,
        dueDate,
        langMode: mode,
        selectedOptions: opts,
        customNotes,
      };
      localStorage.setItem('hb_birth_plan_data', JSON.stringify(data));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const resetToDefault = () => {
    const initial: Record<string, boolean> = {};
    SECTIONS.forEach((sec) => {
      sec.options.forEach((opt) => {
        if (opt.recommended) initial[opt.id] = true;
      });
    });
    setSelectedOptions(initial);
    saveData(initial, langMode);
  };

  const handlePrint = () => {
    saveData(selectedOptions, langMode);
    window.print();
  };

  const activeMeta = MODE_LABELS.find((m) => m.key === langMode) || MODE_LABELS[0];
  const isBilingual = langMode === 'pl-en' || langMode === 'pl-de' || langMode === 'pl-nl';
  const primaryLang: 'pl' | 'en' | 'de' | 'nl' | 'es' =
    langMode === 'pl-en'
      ? 'en'
      : langMode === 'pl-de'
        ? 'de'
        : langMode === 'pl-nl'
          ? 'nl'
          : langMode;

  return (
    <div className="space-y-6">
      {/* Pasek Wyboru Języka / Kraju Porodu (Smart Bilingual Switcher) */}
      <div className="bg-white dark:bg-[#1C081A] rounded-2xl border border-[#EAE3DB] dark:border-[#461643] p-4 sm:p-5 space-y-3 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#250A24] dark:text-[#FBF8F4]">
            <Globe className="w-4 h-4 text-[#EC008C]" />
            <span>Wybierz język wydruku Planu Porodu (Polska lub Dwujęzyczny dla Szpitala za Granicą):</span>
          </div>

          <div className="flex items-center gap-2.5">
            {isSaved && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ Zapisano zmiany
              </span>
            )}
            <button
              onClick={resetToDefault}
              type="button"
              className="px-3 py-2 rounded-xl border border-[#EAE3DB] dark:border-[#461643] text-xs font-semibold text-[#867A72] hover:text-[#1A1512] dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Przywróć rekomendowane opcje położnicze"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Domyślne</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold shadow-md shadow-[#EC008C]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Drukuj / Pobierz PDF</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {MODE_LABELS.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => {
                setLangMode(mode.key);
                saveData(selectedOptions, mode.key);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                langMode === mode.key
                  ? 'bg-[#EC008C] text-white shadow-sm'
                  : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#EAD5E5] border border-[#EAE3DB] dark:border-[#461643] hover:border-[#EC008C]'
              }`}
            >
              {mode.badge}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#544A44] dark:text-[#EAD5E5]/80 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{activeMeta.legalNote}</span>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white dark:bg-[#1C081A] rounded-3xl border border-[#EAE3DB] dark:border-[#461643] p-6 sm:p-10 shadow-lg print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#EAE3DB] dark:border-[#461643] pb-6 mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#370E35] text-[#EC008C] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeMeta.badge}</span>
          </div>
          <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {activeMeta.docTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#867A72] dark:text-[#EAD5E5]/70 max-w-2xl mx-auto">
            {activeMeta.docSubtitle}
          </p>
        </div>

        {/* Notatka dla zagranicznej położnej w trybie dwujęzycznym */}
        {activeMeta.midwifeNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FEF3C7] dark:bg-[#3B2608] border border-[#F59E0B] text-[#78350F] dark:text-[#FDE68A] text-xs leading-relaxed font-medium">
            {activeMeta.midwifeNotice}
          </div>
        )}

        {/* Input Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#461643] mb-8">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              {isBilingual || primaryLang !== 'pl' ? 'Mother / Imię i Nazwisko Mamy:' : 'Imię i Nazwisko Mamy:'}
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => {
                setMotherName(e.target.value);
                saveData();
              }}
              placeholder="np. Anna Kowalska"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              {isBilingual || primaryLang !== 'pl' ? 'Birth Partner / Partner:' : 'Osoba Towarzysząca (Tata):'}
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => {
                setPartnerName(e.target.value);
                saveData();
              }}
              placeholder="np. Piotr Kowalski"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              {isBilingual || primaryLang !== 'pl' ? 'Hospital / Szpital:' : 'Planowany Szpital:'}
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => {
                setHospitalName(e.target.value);
                saveData();
              }}
              placeholder="np. St Mary's / Kreißsaal / Szpital"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              {isBilingual || primaryLang !== 'pl' ? 'Due Date (EDD) / Termin:' : 'Przewidywany Termin Porodu:'}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                saveData();
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>
        </div>

        {/* Plan Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAE3DB] dark:border-[#461643] pb-2">
                <div>
                  <h3 className="font-brand-display font-bold text-base sm:text-lg text-[#1A1512] dark:text-[#FBF8F4]">
                    {section.title[primaryLang]}
                  </h3>
                  {isBilingual && (
                    <p className="text-[11px] text-[#867A72] dark:text-[#EAD5E5]/65">
                      🇵🇱 {section.title.pl}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC008C] bg-[#FAE3EB] dark:bg-[#370E35] px-2.5 py-0.5 rounded-full">
                  {section.category[primaryLang]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {section.options.map((option) => {
                  const isChecked = !!selectedOptions[option.id];
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-[#FAE3EB]/40 dark:bg-[#EC008C]/10 border-[#EC008C] text-[#1A1512] dark:text-white font-medium'
                          : 'bg-white dark:bg-[#1C081A] border-[#EAE3DB] dark:border-[#461643] text-[#544A44] dark:text-[#EAD5E5]/70 opacity-75 hover:opacity-100 print:hidden'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#EC008C] text-white'
                            : 'border border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs leading-relaxed block font-semibold">
                          {option[primaryLang]}
                        </span>
                        {isBilingual && (
                          <span className="text-[11px] leading-snug text-[#544A44] dark:text-[#EAD5E5]/75 block font-normal">
                            🇵🇱 {option.pl}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Indywidualne Uwagi Rodziców */}
          <div className="space-y-2 pt-2">
            <h3 className="font-brand-display font-bold text-base text-[#1A1512] dark:text-[#FBF8F4]">
              {isBilingual
                ? '6. Additional Medical Notes & Allergies / Dodatkowe uwagi medyczne i alergie:'
                : primaryLang === 'en'
                  ? '6. Additional Medical Notes, Allergies & Special Preferences:'
                  : primaryLang === 'es'
                    ? '6. Notas médicas adicionales, alergias y preferencias especiales:'
                    : '6. Indywidualne uwagi, alergie i ważne informacje medyczne:'}
            </h3>
            <textarea
              value={customNotes}
              onChange={(e) => {
                setCustomNotes(e.target.value);
                saveData();
              }}
              placeholder="np. GBS ujemny / dodatni; cukrzyca ciążowa (mamy własną siarę w strzykawkach w zamrażarce); soczewki kontaktowe..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>
        </div>

        {/* Footer of the Document */}
        <div className="mt-8 pt-6 border-t border-[#EAE3DB] dark:border-[#461643] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#867A72] dark:text-[#EAD5E5]/60">
          <div>
            <span>
              Przygotowano w Kreatorze Planu Porodu <strong>HappyBirth.pl</strong>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>
              {isBilingual || primaryLang !== 'pl'
                ? 'Mother Signature / Podpis Mamy: ..............................'
                : 'Podpis Mamy: .......................................'}
            </span>
            <span>
              {isBilingual || primaryLang !== 'pl'
                ? 'Midwife / Położna: ..............................'
                : 'Podpis Położnej: .......................................'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
