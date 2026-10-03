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
  Check
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function RootPage() {
  const [loading, setLoading] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'TEST100' || code === 'HAPPY100') {
      setAppliedPromo(code);
      setPromoError(null);
    } else if (code.length === 0) {
      setPromoError('Wpisz kod rabatowy.');
    } else {
      setPromoError('Nieprawidłowy kod rabatowy.');
    }
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const currentPromo = (appliedPromo || promoCodeInput).trim().toUpperCase();

      // Jeśli wpisano kod rabatowy 100% (np. TEST100 lub HAPPY100), bezpośrednio odblokuj Strefę bez pytania o kartę
      if (currentPromo === 'TEST100' || currentPromo === 'HAPPY100') {
        window.location.href = `/strefa?session_id=promo_test_100&payment=success&promo=${currentPromo}`;
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

      {/* 0. PASEK NARZĘDZIOWY: Dostępność UE, Tryb Ciemny/Jasny, Język, Logowanie */}
      <div className="bg-[#20071E] dark:bg-[#120311] text-[#EAD5E5] border-b border-[#3D0E39] px-3 sm:px-6 py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#DA0271] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              Platforma Edukacyjna dla Kobiet w Ciąży:
            </span>
            <span className="text-[#EAD5E5]/80 hidden md:inline truncate">
              52 lekcje e-learning VOD · Twój spokój krok po kroku · Dostęp na 12 miesięcy
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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#461643] bg-[#180517]/90 text-[#EAD5E5] hover:text-white hover:bg-white/10 transition-all font-semibold cursor-pointer"
              title="Udogodnienia cyfrowe i deklaracja dostępności (WCAG 2.1 AA / EAA)"
              aria-label="Udogodnienia cyfrowe i deklaracja dostępności (WCAG 2.1 AA / EAA)"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#FCD705]" />
              <span className="hidden sm:inline">Udogodnienia UE</span>
            </button>

            <a
              href="https://instagram.com/happybirth.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EAD5E5]/70 hover:text-white hidden lg:flex items-center gap-1 border-l border-[#461643] pl-2.5 transition-colors"
              title="Obserwuj nas na Instagramie"
            >
              <span>@happybirth.pl</span>
            </a>

            <span className="text-[#EAD5E5]/60 hidden lg:inline border-l border-[#461643] pl-2.5">
              Masz już konto?
            </span>
            <Link
              href="/strefa"
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#EC008C] transition-colors whitespace-nowrap"
            >
              <span>Wejdź do Strefy</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pasek biegunkowy u góry z komunikatem korzyści */}
      <div className="pasek">
        <div className="pasek-in">
          <span className="sr">Edukacyjny kurs szkoły rodzenia HappyBirth</span>
          <span aria-hidden="true" className="pasek-tor">
            <span className="pasek-grupa">
              <b>52 profesjonalne lekcje wideo</b>
              <b>Spokój tydzień po tygodniu</b>
              <b>Oglądasz we własnym tempie</b>
              <b>Dostęp na 12 miesięcy</b>
              <b>Dyplomowane ekspertki i położne</b>
              <b>Wsparcie dla Ciebie i partnera</b>
            </span>
            <span className="pasek-grupa">
              <b>52 profesjonalne lekcje wideo</b>
              <b>Spokój tydzień po tygodniu</b>
              <b>Oglądasz we własnym tempie</b>
              <b>Dostęp na 12 miesięcy</b>
              <b>Dyplomowane ekspertki i położne</b>
              <b>Wsparcie dla Ciebie i partnera</b>
            </span>
          </span>
        </div>
      </div>

      {/* Nawigacja */}
      <header className="nav">
        <div className="in">
          <Link aria-label="HappyBirth, strona główna" className="znak" href="/">
            <img alt="HappyBirth" height={75} src="/logo.svg" width={92} />
          </Link>
          <nav aria-label="Główna" className="linki">
            <a href="#program">Co zyskujesz</a>
            <a href="#mapa">Twój tydzień</a>
            <a href="#zwiastun">Zwiastun kursu</a>
            <Link href="/o-nas">Opieka ekspertek</Link>
            <a href="#faq">Odpowiedzi na pytania</a>
            <Link href="/strefa" className="text-[#DA0271] font-semibold hover:underline">Strefa kursantki</Link>
          </nav>
          <details className="menu">
            <summary aria-label="Menu"><i /></summary>
            <nav aria-label="Menu mobilne">
              <a href="#program">Co zyskujesz (Program)</a>
              <a href="#mapa">Twój tydzień ciąży</a>
              <a href="#zwiastun">Zwiastun kursu</a>
              <Link href="/program">Pełna lista 52 lekcji</Link>
              <Link href="/o-nas">Opieka ekspertek (O nas)</Link>
              <a href="#faq">Odpowiedzi na pytania</a>
              <Link href="/strefa">Wejdź do Strefy kursantki</Link>
              <a href="#cena">Zadbaj o swój spokój · 489 zł</a>
            </nav>
          </details>
          <a className="btn kup" href="#cena">Zadbaj o swój spokój · 489 zł</a>
        </div>
      </header>

      {/* Główna treść */}
      <main id="tresc">
        {/* 1. HERO */}
        <section className="hero">
          <div className="wrap g">
            <div className="hero-tekst">
              <h1>
                Szkoła rodzenia online dla Twojego spokoju.{' '}
                <span className="kursywa">Krok po kroku, tydzień po tygodniu.</span>
              </h1>
              <p className="lead">
                52 krótkie lekcje wideo nagrane z dyplomowanymi ekspertkami i położnymi. Od pierwszych tygodni ciąży, przez spokojny i świadomy poród, aż po pierwszy rok z maluszkiem. Oglądasz we własnym tempie, kiedy tylko masz siłę – a Twój partner może dołączyć w każdej chwili bez żadnych dopłat.
              </p>
              <div className="ctas">
                <a className="btn kup" href="#cena">Zadbaj o swój spokój · 489 zł</a>
                <a className="btn zolty" href="#zwiastun">
                  <span aria-hidden="true" className="graj" />
                  Zobacz zwiastun kursu
                </a>
              </div>
              <ul className="fakty">
                <li>52 konkretne lekcje po 5–7 minut</li>
                <li>Dostęp na 12 miesięcy dla Ciebie i partnera</li>
                <li>489 zł jednorazowo · Bez abonamentu</li>
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
                  <p className="kicker">Mapa programu</p>
                  <h2 className="h3" id="mapa-tyt">Od pierwszych tygodni do pierwszych urodzin.</h2>
                </div>
                <p className="maly">Każdy etap ciąży przynosi inne pytania. Przesuń suwak na swój tydzień – podpowiemy Ci, od którego filmu zacząć, aby zachować spokój i pewność.</p>
              </div>
              <p className="uwaga">To nie jest sztywny harmonogram. Wszystkie 52 lekcje otrzymujesz odblokowane od razu na 12 miesięcy i wracasz do nich w dowolnej kolejności.</p>

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
                        nazwa: "Dwie kreski",
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: "Tydzień {n} ciąży",
                        zakresTekst: "tydzień 1 do 13",
                        moduly: [
                          { tytul: "Moduł 1. Twoja ciąża tydzień po tygodniu", meta: "5 lekcji · 18 min" },
                          { tytul: "Moduł 2. Zdrowie, profilaktyka i samopoczucie", meta: "7 lekcji · 34 min" },
                        ],
                      },
                      {
                        do: 189,
                        pasmo: "p2",
                        zakres: [92, 189],
                        nazwa: "Wreszcie lepiej",
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: "Tydzień {n} ciąży",
                        zakresTekst: "tydzień 14 do 27",
                        moduly: [
                          { tytul: "Moduł 3. Komfort i aktywność na co dzień", meta: "6 lekcji · 38 min" },
                        ],
                      },
                      {
                        do: 280,
                        pasmo: "p3",
                        zakres: [190, 280],
                        nazwa: "Torba spakowana",
                        jednostka: "tydzien",
                        baza: 0,
                        podpis: "Tydzień {n} ciąży",
                        zakresTekst: "tydzień 28 do porodu",
                        moduly: [
                          { tytul: "Moduł 4. Projekt „Gniazdo”, wyprawka i pokój dziecka", meta: "7 lekcji · 44 min" },
                          { tytul: "Moduł 5. Godzina „Zero”, świadomy i aktywny poród", meta: "9 lekcji · 54 min" },
                        ],
                      },
                      {
                        do: 645,
                        pasmo: "p4",
                        zakres: [281, 645],
                        nazwa: "Pierwszy rok",
                        jednostka: "miesiac",
                        baza: 280,
                        podpis: "Miesiąc {n} z dzieckiem",
                        zakresTekst: "od dnia zero do pierwszych urodzin",
                        moduly: [
                          { tytul: "Moduł 6. Połóg, regeneracja i fizjoterapia mamy", meta: "5 lekcji · 32 min" },
                          { tytul: "Moduł 7. Opieka nad noworodkiem i bezpieczeństwo", meta: "9 lekcji · 44 min" },
                          { tytul: "Moduł 8. Karmienie, laktacja i wsparcie", meta: "4 lekcje · 24 min" },
                        ],
                      },
                    ],
                    skala: ["Tydzień 1", "Dzień zero", "Pierwsze urodziny"],
                    teksty: {
                      etykieta: "Przesuń suwak na swój obecny tydzień ciąży",
                      meta: "{podpis} · etap {nr} z 4",
                      stopka: "Suwak działa bezpośrednio w Twojej przeglądarce. Nie pytamy o termin i nie zapisujemy danych wrażliwych.",
                    },
                    synchronizuj: "[data-etap]",
                  }),
                }}
              />

              <div className="se" id="suwak">
                <div className="se-zapas">
                  <p className="se-nazwa">Cztery etapy: Dwie kreski, Wreszcie lepiej, Torba spakowana, Pierwszy rok.</p>
                  <p className="se-opis">Suwak podpowiada, od którego filmu warto zacząć w danym tygodniu ciąży.</p>
                </div>
              </div>

              <div className="pasma" id="pasma">
                <div className="pasmo p1" data-etap="1">
                  <h3>Dwie kreski</h3>
                  <p className="zakres">tydzień 1 do 13</p>
                  <ul>
                    <li><a href="#modul-1">Moduł 1. Twoja ciąża tydzień po tygodniu</a></li>
                    <li><a href="#modul-2">Moduł 2. Zdrowie, profilaktyka i samopoczucie</a></li>
                  </ul>
                </div>
                <div className="pasmo p2" data-etap="2">
                  <h3>Wreszcie lepiej</h3>
                  <p className="zakres">tydzień 14 do 27</p>
                  <ul>
                    <li><a href="#modul-3">Moduł 3. Komfort i aktywność na co dzień</a></li>
                  </ul>
                </div>
                <div className="pasmo p3" data-etap="3">
                  <h3>Torba spakowana</h3>
                  <p className="zakres">tydzień 28 do porodu</p>
                  <ul>
                    <li><a href="#modul-4">Moduł 4. Projekt „Gniazdo”, wyprawka i pokój dziecka</a></li>
                    <li><a href="#modul-5">Moduł 5. Godzina „Zero”, świadomy i aktywny poród</a></li>
                  </ul>
                </div>
                <div className="pasmo p4" data-etap="4">
                  <h3>Pierwszy rok</h3>
                  <p className="zakres">od dnia zero do pierwszych urodzin</p>
                  <ul>
                    <li><a href="#modul-6">Moduł 6. Połóg, regeneracja i fizjoterapia mamy</a></li>
                    <li><a href="#modul-7">Moduł 7. Opieka nad noworodkiem i bezpieczeństwo</a></li>
                    <li><a href="#modul-8">Moduł 8. Karmienie, laktacja i wsparcie</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ZWIASTUN KURSU (ZAMIAST BEZPŁATNEJ LEKCJI) */}
        <section aria-labelledby="zwiastun-tyt" className="sek" id="zwiastun">
          <div className="wrap lekcja">
            <div className="wideo">
              <div aria-hidden="true" className="plakat">
                <span className="plakat-nr">4K</span>
                <span className="plakat-t">Oficjalny zwiastun HappyBirth: Zobacz jakość nagrań i atmosferę lekcji</span>
                <span className="plakat-w"><i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" /></span>
              </div>
              <button
                className="wideo-start"
                data-tytul="Oficjalny zwiastun kursu HappyBirth"
                data-wideo="https://customer-6d9sm694eja9tkvc.cloudflarestream.com/f8d8d8f24b917a32961efea785c9324b/iframe?autoplay=true&letterboxColor=transparent"
                type="button"
              >
                <span><i aria-hidden="true" />Odtwórz oficjalny zwiastun kursu</span>
              </button>
            </div>
            <div>
              <p className="kicker">Zwiastun kursu</p>
              <h2 className="h2" id="zwiastun-tyt">Zobacz, jak wygląda kurs od środka.</h2>
              <p className="lead">
                Krótki zwiastun złożony z fragmentów lekcji. Zobacz jakość nagrań w 4K, ciepły i spokojny sposób przekazywania wiedzy przez nasze dyplomowane ekspertki oraz atmosferę bezpieczeństwa, którą dla Ciebie stworzyłyśmy.
              </p>
              <ul className="space-y-2 text-sm text-[#544A44] dark:text-[#D7CCC3] py-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dyplomowane położne i doradczynie z wieloletnim doświadczeniem szpitalnym</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Rzetelna wiedza medyczna bez straszenia i bez chaosu z internetu</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Krótkie lekcje po 5–7 minut dopasowane do Twojego dnia</span>
                </li>
              </ul>
              <p className="maly zastrzezenie-lekcji">
                Materiały edukacyjne przygotowane zgodnie ze Standardem Opieki Okołoporodowej. W sytuacji zagrożenia zdrowia lub życia dzwoń pod 112.
              </p>
              <p className="maly">
                Odtwarzacz Cloudflare Stream ładuje się dopiero po kliknięciu, szanując Twoją prywatność i szybkość transferu.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM: 52 LEKCJE W 8 MODUŁACH */}
        <section aria-labelledby="program-tyt" className="sek papier" id="program">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Program</p>
              <h2 className="h2 duzy" id="program-tyt">52 lekcje w 8 modułach. <span className="kursywa">Prawie 5 godzin materiału wideo.</span></h2>
              <p className="lead">Lekcje nagrane z dyplomowanymi ekspertkami i położnymi. Średni czas trwania to około 5 do 7 minut – oglądasz wtedy, kiedy masz wolną chwilę.</p>
              
              {/* WYEKSPONOWANY PRZYCISK NA POCZĄTKU MODUŁU PROGRAMU */}
              <div className="pt-4 pb-2">
                <Link
                  href="/program"
                  className="btn-program-top"
                >
                  <BookOpen className="w-5 h-5 text-[#DA0271]" />
                  <span>Przejrzyj pełny program 52 lekcji dla siebie</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <p className="text-xs text-[#867A72] dark:text-[#A2958C] mt-2">
                  Wszystkie 52 tematy i czasy trwania – sprawdź szczegółowo bez logowania
                </p>
              </div>
            </div>

            <div className="moduly">
              <article className="modul p1" id="modul-1">
                <span className="nr">1</span>
                <h3>Twoja ciąża tydzień po tygodniu</h3>
                <p className="meta">5 lekcji · 18 min</p>
                <p>Jak zmienia się Twoje ciało i jak rozwija się dziecko, trymestr po trymestrze. Pierwsze decyzje, emocje, dzielenie się nowiną i przełamywanie mitów.</p>
              </article>
              <article className="modul p1" id="modul-2">
                <span className="nr">2</span>
                <h3>Zdrowie, profilaktyka i samopoczucie</h3>
                <p className="meta">7 lekcji · 34 min</p>
                <p>Kalendarz badań, samopoczucie na co dzień, radzenie sobie z dolegliwościami i sygnały, o których warto wiedzieć wcześniej.</p>
              </article>
              <article className="modul p2" id="modul-3">
                <span className="nr">3</span>
                <h3>Komfort i aktywność na co dzień</h3>
                <p className="meta">6 lekcji · 38 min</p>
                <p>Spokojny sen, bezpieczny ruch, ćwiczenia z fizjoterapeutką odciążające kręgosłup i miednicę oraz podróże w ciąży.</p>
              </article>
              <article className="modul p3" id="modul-4">
                <span className="nr">4</span>
                <h3>Projekt „Gniazdo”, wyprawka i kącik dziecka</h3>
                <p className="meta">7 lekcji · 44 min</p>
                <p>Świadome wybory: bezpieczny wózek, fotelik, łóżeczko, domowa apteczka i ubranka. Co warto kupić na start, a z czym poczekać.</p>
              </article>
              <article className="modul p3" id="modul-5">
                <span className="nr">5</span>
                <h3>Godzina „Zero”, świadomy i aktywny poród</h3>
                <p className="meta">9 lekcji · 54 min</p>
                <p>Plan porodu, torba do szpitala, zwiastuny rozpoczęcia akcji, oddech, pozycje wertykalne i konkretna rola osoby towarzyszącej.</p>
              </article>
              <article className="modul p4" id="modul-6">
                <span className="nr">6</span>
                <h3>Połóg, regeneracja i fizjoterapia mamy</h3>
                <p className="meta">5 lekcji · 32 min</p>
                <p>Pierwsze tygodnie po porodzie: czuła regeneracja, emocje, bezpieczny powrót do sprawności i szczere doświadczenia innych mam.</p>
              </article>
              <article className="modul p4" id="modul-7">
                <span className="nr">7</span>
                <h3>Opieka nad noworodkiem i bezpieczeństwo</h3>
                <p className="meta">9 lekcji · 44 min</p>
                <p>Pierwsze dni maluszka, instruktaż kąpieli i pielęgnacji krok po kroku, bezpieczny sen, profilaktyka zdrowia i pierwsza pomoc.</p>
              </article>
              <article className="modul p4" id="modul-8">
                <span className="nr">8</span>
                <h3>Karmienie, laktacja i wsparcie</h3>
                <p className="meta">4 lekcje · 24 min</p>
                <p>Technika przystawienia, wygodne pozycje, komfort brodawek, dobór akcesoriów i sprawdzone sposoby na trudniejsze wieczory.</p>
              </article>
            </div>

            <div className="pelna-lista">
              <div>
                <b>Pełna lista 52 lekcji z czasem trwania</b>
                <span>Każdy tytuł, długość i moduł dostępny bez logowania.</span>
              </div>
              <Link className="btn cta" href="/program">Przejrzyj pełny program</Link>
            </div>
          </div>
        </section>

        {/* 5. CENA I ZAKUP STRIPE ZE ZINTEGROWANYM PRZYCISKIEM W BIAŁEJ KARCIE */}
        <section aria-labelledby="cena-tyt" className="sek" id="cena">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Cena</p>
              <h2 className="h2" id="cena-tyt">Jedna przejrzysta cena. <span className="kursywa mniejsza">Bez abonamentu.</span></h2>
            </div>
            <div className="cena dalej">
              {/* BIAŁA KARTA OFERTY ZE ZINTEGROWANYM PRZYCISKIEM KUPNA I KODEM RABATOWYM */}
              <div className="oferta">
                <p className="kwota">
                  {appliedPromo ? '0 zł' : '489 zł'}
                  <small>{appliedPromo ? 'rabat 100%' : 'jednorazowo'}</small>
                </p>

                <ul>
                  <li>52 filmowe lekcje w 8 modułach, prawie 5 godzin materiału wideo</li>
                  <li>Dostęp dla Ciebie i osoby towarzyszącej bez żadnych dopłat</li>
                  <li>12 miesięcy nielimitowanego dostępu od terminu porodu</li>
                  <li>Notatnik Rodzica PDF, karty pracy i checklisty wyprawkowe</li>
                  <li>Na telefonie, tablecie, komputerze i TV w przeglądarce</li>
                </ul>

                {/* GŁÓWNY PRZYCISK ZAKUPU WBUDOWANY BEZPOŚREDNIO W BIAŁĄ KARTĘ */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-oferta-zakup mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Łączenie z płatnością...</span>
                    </span>
                  ) : appliedPromo ? (
                    <span>Odbierz pełny dostęp (kod 100%: 0 zł)</span>
                  ) : (
                    <span>Chcę zyskać spokój i pewność · 489 zł</span>
                  )}
                </button>

                {/* SEKCJA KODU RABATOWEGO / TESTOWEGO 100% */}
                <div className="mt-4 pt-4 border-t border-[#EAE3DB] dark:border-[#3A1038] text-left">
                  {!showPromoInput && !appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs font-semibold text-[#867A72] dark:text-[#A2958C] hover:text-[#DA0271] underline cursor-pointer"
                    >
                      Masz kod rabatowy lub promocyjny?
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Wpisz kod (np. TEST100)"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 text-xs uppercase rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#250A24] text-[#1A1512] dark:text-white focus:outline-none focus:border-[#DA0271]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-4 py-2 rounded-xl bg-[#250A24] dark:bg-[#3D0E39] text-white text-xs font-bold hover:bg-[#DA0271] transition-colors"
                        >
                          Zastosuj
                        </button>
                      </div>
                      {appliedPromo && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Kod {appliedPromo} aktywny: Rabat 100% (cena końcowa: 0 zł)!
                        </p>
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
                  <span>BLIK · Karta płatnicza · Szybki przelew · Natychmiastowy dostęp</span>
                </div>

                <p className="info mt-3 text-[11.5px] text-[#867A72] dark:text-[#A2958C] leading-relaxed">
                  Zgodnie z art. 38 pkt 13 Ustawy o prawach konsumenta, wyrażenie zgody na rozpoczęcie świadczenia przed upływem terminu do odstąpienia od umowy powoduje utratę prawa do odstąpienia. Faktura VAT 23% na życzenie. Szczegóły w <Link href="/regulamin" className="underline">regulaminie</Link>.
                </p>
              </div>

              {/* FIOLETOWA KARTA ARGUMENTÓW OBOK */}
              <div className="argumenty">
                <p className="kicker">Dlaczego warto</p>
                <h3>Cztery powody, dla których to się zwraca.</h3>
                <ul className="arg">
                  <li>
                    <b>Twój tydzień, Twoje tempo.</b>
                    <span>Oglądasz dokładnie to, co przydaje się na Twoim obecnym etapie, a nie co akurat przerabia grupa na sali.</span>
                  </li>
                  <li>
                    <b>Krótki wieczór wystarczy.</b>
                    <span>Lekcje trwają od 5 do 7 minut. Zmieścisz je nawet w dniu, w którym czujesz zmęczenie i brak sił.</span>
                  </li>
                  <li>
                    <b>Wsparcie osoby towarzyszącej.</b>
                    <span>Pozycje, masaż, plan porodu i pakowanie torby. Partner ogląda te same lekcje bez dodatkowych opłat i wie, jak Ci pomóc.</span>
                  </li>
                  <li>
                    <b>Nie kończy się na porodzie.</b>
                    <span>Bezpieczna kąpiel, opieka nad noworodkiem, karmienie i spokojny sen w pierwszym roku są w tym samym kursie.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section aria-labelledby="faq-tyt" className="sek len" id="faq">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Pytania</p>
              <h2 className="h2" id="faq-tyt">Odpowiedzi na najczęstsze pytania.</h2>
            </div>
            <div className="faq">
              <details>
                <summary>Czy kurs przygotuje mnie do porodu równie dobrze jak szkoła stacjonarna?</summary>
                <p>Tak. Kurs obejmuje kompletne przygotowanie do porodu, połogu i opieki nad noworodkiem w formie zwięzłych lekcji wideo z dyplomowanymi ekspertkami. Możesz uczyć się w domowym zaciszu, bez dojazdów i wracać do trudniejszych tematów tyle razy, ile potrzebujesz.</p>
              </details>
              <details>
                <summary>Kiedy najlepiej zacząć oglądać lekcje?</summary>
                <p>W dowolnym momencie. Wszystkie 52 lekcje otrzymujesz odblokowane od pierwszego dnia. Mapa programu na suwaku podpowiada, od czego zacząć w Twoim trymestrze, a dostęp trwa aż 12 miesięcy od przewidywanego terminu porodu.</p>
              </details>
              <details>
                <summary>Czy mój partner może oglądać kurs ze mną?</summary>
                <p>Oczywiście. Dostęp dla dwojga jest wliczony w cenę. Partner może logować się z własnego urządzenia i przerabiać dedykowane wskazówki dotyczące wsparcia w porodzie i opieki nad maluszkiem.</p>
              </details>
              <details>
                <summary>Na jakich urządzeniach mogę oglądać lekcje?</summary>
                <p>W dowolnej przeglądarce: na smartfonie, tablecie, laptopie oraz Smart TV. Odtwarzacz pamięta Twój postęp, więc możesz zacząć na telefonie, a dokończyć wieczorem na telewizorze.</p>
              </details>
              <details>
                <summary>Ile kosztuje kurs i czy są ukryte opłaty?</summary>
                <p>Cena to 489 zł płatne jednorazowo. Nie ma żadnych subskrypcji, automatycznych odnowień ani ukrytych opłat.</p>
              </details>
              <details>
                <summary>Jak szybko uzyskam dostęp po zakupie?</summary>
                <p>Automatycznie i natychmiast. Po zatwierdzeniu płatności BLIK, kartą lub kodem rabatowym zostaniesz od razu przekierowana do Strefy z pełnym dostępem do wszystkich 52 lekcji.</p>
              </details>
              <details>
                <summary>Czy kurs zastępuje wizytę u lekarza lub położnej?</summary>
                <p>Nie. HappyBirth to platforma edukacyjna przygotowująca do świadomego porodu i rodzicielstwa. Nie zastępuje indywidualnych badań lekarskich ani pilnej pomocy medycznej. W nagłych wypadkach dzwoń pod numer 112.</p>
              </details>
              <details>
                <summary>Kto przygotował lekcje merytorycznie?</summary>
                <p>Lekcje nagrałyśmy z dyplomowanymi położnymi, doradczyniami laktacyjnymi oraz fizjoterapeutkami z poznańskiej szkoły rodzenia Mama Gaja, działającej nieprzerwanie od 2012 roku.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* STOPKA */}
      <footer className="stopka">
        <div className="wrap">
          <div className="g">
            <div>
              <Link aria-label="HappyBirth, strona główna" className="znak" href="/">
                <img alt="HappyBirth" height={136} loading="lazy" src="/logo.svg" width={168} />
              </Link>
              <p className="opis">Szkoła rodzenia online dla Twojego spokoju. Od szkoły rodzenia Mama Gaja.</p>
              <div aria-hidden="true" className="wstega-mini">
                <i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" />
              </div>
            </div>
            <div>
              <h2>Kurs</h2>
              <ul>
                <li><Link href="/program">Pełny program 52 lekcji</Link></li>
                <li><a href="#zwiastun">Zwiastun kursu</a></li>
                <li><a href="#cena">Cena i dostęp (489 zł)</a></li>
                <li><a href="#faq">Pytania i odpowiedzi</a></li>
                <li><Link href="/strefa">Strefa kursantki (Logowanie)</Link></li>
              </ul>
            </div>
            <div>
              <h2>HappyBirth</h2>
              <ul>
                <li><Link href="/o-nas">O nas i ekspertki</Link></li>
                <li><Link href="/partnerzy">Strefa Partnera (Afiliacja B2B)</Link></li>
                <li><a href="https://www.instagram.com/happybirth.pl/" rel="noreferrer" target="_blank">Instagram @happybirth.pl</a></li>
                <li><a href="https://www.tiktok.com/@happybirth_pl" rel="noreferrer" target="_blank">TikTok @happybirth_pl</a></li>
              </ul>
            </div>
            <div>
              <h2>Dokumenty</h2>
              <ul>
                <li><Link href="/regulamin">Regulamin platformy</Link></li>
                <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
                <li><Link href="/polityka-cookies">Polityka cookies</Link></li>
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
        <p>Materiały HappyBirth mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej specjalistki. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112.</p>
      </div>

      {/* Skrypt interaktywny (suwak etapów z dynamiczną rekomendacją, karuzela, wideo zwiastun) */}
      <Script src="/assets/hb.82f00762a8.js" strategy="afterInteractive" />
    </>
  );
}
