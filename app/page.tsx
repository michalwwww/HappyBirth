'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

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

      {/* Pasek biegunkowy u góry */}
      <div className="pasek">
        <a className="pasek-in" href="/#lekcja">
          <span className="sr">Odbierz bezpłatną lekcję</span>
          <span aria-hidden="true" className="pasek-tor">
            <span className="pasek-grupa">
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
            </span>
            <span className="pasek-grupa">
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
              <b>Odbierz bezpłatną lekcję</b>
            </span>
          </span>
        </a>
      </div>

      {/* Nawigacja */}
      <header className="nav">
        <div className="in">
          <Link aria-label="HappyBirth, strona główna" className="znak" href="/">
            <img alt="HappyBirth" height={75} src="/logo.svg" width={92} />
          </Link>
          <nav aria-label="Główna" className="linki">
            <a href="/#program">Program</a>
            <Link href="/o-nas">O nas</Link>
            <a href="/#faq">Pytania</a>
            <Link href="/strefa" className="text-[#DA0271] font-semibold hover:underline">Strefa Rodziców</Link>
          </nav>
          <details className="menu">
            <summary aria-label="Menu"><i /></summary>
            <nav aria-label="Menu mobilne">
              <a href="/#program">Program</a>
              <Link href="/program">Lista 52 lekcji</Link>
              <Link href="/o-nas">O nas</Link>
              <a href="/#faq">Pytania</a>
              <a href="/#lekcja">Bezpłatna lekcja</a>
              <Link href="/strefa">Wejdź do Strefy</Link>
              <a href="#cena">Kup kurs</a>
            </nav>
          </details>
          <a className="btn kup" href="#cena">Kup</a>
        </div>
      </header>

      {/* Główna treść */}
      <main id="tresc">
        {/* 1. HERO */}
        <section className="hero">
          <div className="wrap g">
            <div className="hero-tekst">
              <h1>
                Szkoła rodzenia online dla dwojga.{' '}
                <span className="kursywa">Jeden tydzień naraz.</span>
              </h1>
              <p className="lead">
                52 lekcje wideo nagrane z dyplomowanymi ekspertkami. Od pierwszych tygodni ciąży, przez poród, do pierwszego roku z dzieckiem. Oglądacie razem, kiedy macie siłę.
              </p>
              <div className="ctas">
                <a className="btn kup" href="#cena">Kup</a>
                <a className="btn zolty" href="#lekcja">
                  <span aria-hidden="true" className="graj" />
                  Zobaczcie bezpłatną lekcję
                </a>
              </div>
              <ul className="fakty">
                <li>Prawie 5 godzin materiału wideo</li>
                <li>Dostęp dla dwojga</li>
                <li>489 zł jednorazowo</li>
              </ul>
            </div>

            {/* Karuzela kadrów */}
            <div aria-label="Kadry z kursu HappyBirth" aria-roledescription="karuzela" className="kar" data-karuzela="" id="karuzela">
              <figure aria-label="Kadr 1 z 4" className="kar-slajd akt">
                <img
                  alt="Para na kanapie ogląda razem lekcję na tablecie"
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
                  alt="Partner siedzi za partnerką na piłce i masuje jej ramiona"
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
                  alt="Ojciec w fotelu trzyma śpiące niemowlę przy piersi"
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
                  alt="Para przy stole ogląda wieczorem lekcję na laptopie"
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
                  <p className="kicker">Mapa programu</p>
                  <h2 className="h3" id="mapa-tyt">Od pierwszych tygodni do pierwszych urodzin.</h2>
                </div>
                <p className="maly">Szerokość pasma to liczba dni. Pierwszy rok jest najdłuższy, dzień zero to cienka kreska.</p>
              </div>
              <p className="uwaga">To nie jest grafik. Mapą przesuwacie, a oglądać możecie wszystko: 52 lekcji jest dostępnych od pierwszego dnia, w dowolnej kolejności.</p>

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
                          { tytul: "Moduł 8. Karmienie, laktacja i kolki", meta: "4 lekcje · 24 min" },
                        ],
                      },
                    ],
                    skala: ["Tydzień 1", "Dzień zero", "Pierwsze urodziny"],
                    teksty: {
                      etykieta: "Przesuńcie suwak na swój tydzień",
                      meta: "{podpis} · pasmo {nr} z 4",
                      stopka: "Suwak liczy w przeglądarce. Nie pytamy o termin porodu i niczego nie zapisujemy.",
                    },
                    synchronizuj: "[data-etap]",
                  }),
                }}
              />

              <div className="se" id="suwak">
                <div className="se-zapas">
                  <p className="se-nazwa">Cztery pasma: Dwie kreski, Wreszcie lepiej, Torba spakowana, Pierwszy rok.</p>
                  <p className="se-opis">Suwak pokazuje, które moduły pasują do danego tygodnia. Lista pasm i modułów jest pod spodem.</p>
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
                    <li><a href="#modul-8">Moduł 8. Karmienie, laktacja i kolki</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BEZPŁATNA LEKCJA 1 */}
        <section aria-labelledby="lekcja-tyt" className="sek" id="lekcja">
          <div className="wrap lekcja">
            <div className="wideo">
              <div aria-hidden="true" className="plakat">
                <span className="plakat-nr">01</span>
                <span className="plakat-t">I trymestr: początek nowego życia i pierwsze tygodnie</span>
                <span className="plakat-w"><i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" /></span>
              </div>
              <button
                className="wideo-start"
                data-tytul="Lekcja 1. I trymestr: początek nowego życia i pierwsze tygodnie"
                data-wideo="https://customer-6d9sm694eja9tkvc.cloudflarestream.com/f8d8d8f24b917a32961efea785c9324b/iframe?autoplay=true&letterboxColor=transparent"
                type="button"
              >
                <span><i aria-hidden="true" />Odtwórz lekcję 1 · 5 min 33 s</span>
              </button>
            </div>
            <div>
              <p className="kicker">Bezpłatna lekcja</p>
              <h2 className="h2" id="lekcja-tyt">Zacznijcie od lekcji 1.</h2>
              <p className="lead">Moduł 1, lekcja 1: I trymestr, początek nowego życia i pierwsze tygodnie. Jak liczyć wiek ciąży i co dzieje się w ciele w pierwszych tygodniach.</p>
              <p className="maly zastrzezenie-lekcji">Materiały edukacyjne, nie porada medyczna. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod 112.</p>
              <p className="maly">Odtwarzacz Cloudflare Stream ładuje się dopiero po kliknięciu. Do tego czasu strona nie łączy się z serwerem wideo.</p>
            </div>
          </div>
        </section>

        {/* 4. PROGRAM: 52 LEKCJE W 8 MODUŁACH */}
        <section aria-labelledby="program-tyt" className="sek papier" id="program">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Program</p>
              <h2 className="h2 duzy" id="program-tyt">52 lekcje w 8 modułach. <span className="kursywa">Prawie 5 godzin materiału wideo.</span></h2>
              <p className="lead">Lekcje nagraliśmy z dyplomowanymi ekspertkami. Średni czas trwania to około 5 do 7 minut.</p>
            </div>
            <div className="moduly">
              <article className="modul p1" id="modul-1">
                <span className="nr">1</span>
                <h3>Twoja ciąża tydzień po tygodniu</h3>
                <p className="meta">5 lekcji · 18 min<span className="darmo">Lekcja 1 bezpłatna</span></p>
                <p>Jak zmienia się ciało i jak rozwija się dziecko, trymestr po trymestrze. Do tego nowina dla bliskich, aplikacje i mity.</p>
              </article>
              <article className="modul p1" id="modul-2">
                <span className="nr">2</span>
                <h3>Zdrowie, profilaktyka i samopoczucie</h3>
                <p className="meta">7 lekcji · 34 min</p>
                <p>Kalendarz badań, samopoczucie na co dzień i sygnały, o których warto wiedzieć wcześniej.</p>
              </article>
              <article className="modul p2" id="modul-3">
                <span className="nr">3</span>
                <h3>Komfort i aktywność na co dzień</h3>
                <p className="meta">6 lekcji · 38 min</p>
                <p>Sen, ruch, podróże i domowe obowiązki. Ćwiczenia pokazane krok po kroku.</p>
              </article>
              <article className="modul p3" id="modul-4">
                <span className="nr">4</span>
                <h3>Projekt „Gniazdo”, wyprawka i pokój dziecka</h3>
                <p className="meta">7 lekcji · 44 min</p>
                <p>Wózek, fotelik, łóżeczko, apteczka i ubrania. Co kupić na start, a z czym poczekać.</p>
              </article>
              <article className="modul p3" id="modul-5">
                <span className="nr">5</span>
                <h3>Godzina „Zero”, świadomy i aktywny poród</h3>
                <p className="meta">9 lekcji · 54 min</p>
                <p>Plan porodu, torba do szpitala, okresy porodu, ruch i oddech, rola osoby towarzyszącej i przygotowanie na każdy scenariusz.</p>
              </article>
              <article className="modul p4" id="modul-6">
                <span className="nr">6</span>
                <h3>Połóg, regeneracja i fizjoterapia mamy</h3>
                <p className="meta">5 lekcji · 32 min</p>
                <p>Pierwsze tygodnie po porodzie: regeneracja, emocje, bezpieczny powrót do ruchu i historie dwóch mam.</p>
              </article>
              <article className="modul p4" id="modul-7">
                <span className="nr">7</span>
                <h3>Opieka nad noworodkiem i bezpieczeństwo</h3>
                <p className="meta">9 lekcji · 44 min</p>
                <p>Pierwsze dni dziecka, kąpiel i pielęgnacja, bezpieczny sen, szczepienia i pierwsza pomoc.</p>
              </article>
              <article className="modul p4" id="modul-8">
                <span className="nr">8</span>
                <h3>Karmienie, laktacja i kolki</h3>
                <p className="meta">4 lekcje · 24 min</p>
                <p>Pozycje do karmienia, technika przystawienia, akcesoria i sposoby na trudniejsze wieczory.</p>
              </article>
            </div>
            <div className="pelna-lista">
              <div>
                <b>Pełna lista 52 lekcji z czasem</b>
                <span>Każdy tytuł i długość, moduł po module. Bez logowania.</span>
              </div>
              <Link className="btn cta" href="/program">Zobaczcie program</Link>
            </div>
          </div>
        </section>

        {/* 5. CENA I ZAKUP STRIPE */}
        <section aria-labelledby="cena-tyt" className="sek" id="cena">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Cena</p>
              <h2 className="h2" id="cena-tyt">Jedna cena. <span className="kursywa mniejsza">Bez abonamentu.</span></h2>
            </div>
            <div className="cena dalej">
              <div className="oferta">
                <p className="kwota">489 zł<small>jednorazowo</small></p>
                <ul>
                  <li>52 lekcje w 8 modułach, prawie 5 godzin materiału wideo</li>
                  <li>Dostęp dla dwojga, bez dopłat</li>
                  <li>12 miesięcy dostępu od terminu porodu</li>
                  <li>Bez abonamentu i bez automatycznego odnawiania</li>
                  <li>Na telefonie, tablecie, komputerze i TV w przeglądarce</li>
                </ul>
                <p className="maly dalej">Cena stała, bez sztucznych przecen. Faktura VAT 23% na życzenie.</p>
              </div>

              <div className="argumenty">
                <p className="kicker">Dlaczego warto</p>
                <h3>Cztery powody, dla których to się zwraca.</h3>
                <ul className="arg">
                  <li>
                    <b>Tydzień, który właśnie trwa.</b>
                    <span>Mapa programu pokazuje, co przydaje się teraz, a nie co akurat przerabia grupa na sali.</span>
                  </li>
                  <li>
                    <b>Wieczór wystarczy.</b>
                    <span>Lekcja trwa około 5 do 7 minut. Zmieści się także w dzień, w którym nie macie siły na nic.</span>
                  </li>
                  <li>
                    <b>Osoba towarzysząca dostaje zadania.</b>
                    <span>Pozycje, plan porodu, torba do szpitala. Ogląda te same lekcje, więc wie, co robić.</span>
                  </li>
                  <li>
                    <b>Nie kończy się na porodzie.</b>
                    <span>Kąpiel, fotelik, karmienie i sen w pierwszym roku są w tym samym kursie, w tej samej cenie.</span>
                  </li>
                </ul>
              </div>

              {/* Blok Kasy Zakupowej (Stripe Checkout) */}
              <div className="kasa szeroki kotwica" id="kasa">
                <div>
                  <h3>Dostęp od razu po zakupie.</h3>
                  <p>
                    Płatność <strong>BLIK</strong>, <strong>kartą</strong> lub <strong>szybkim przelewem</strong>. Dostęp do Strefy Rodziców otrzymujecie natychmiast po zatwierdzeniu wpłaty.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn kup"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin inline" />
                        <span>Łączenie ze Stripe...</span>
                      </span>
                    ) : (
                      <span>Kupuję kurs · 489 zł</span>
                    )}
                  </button>
                  <p className="info">
                    Przed płatnością zaakceptujesz <Link href="/regulamin">regulamin</Link>. Zgodnie z art. 38 pkt 13 Ustawy o prawach konsumenta, wyrażenie zgody na rozpoczęcie świadczenia przed upływem terminu do odstąpienia od umowy powoduje utratę prawa do odstąpienia. Szczegóły w <Link href="/regulamin">regulaminie</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section aria-labelledby="faq-tyt" className="sek len" id="faq">
          <div className="wrap">
            <div className="naglowek">
              <p className="kicker">Pytania</p>
              <h2 className="h2" id="faq-tyt">Pytania, które zadajecie najczęściej.</h2>
            </div>
            <div className="faq">
              <details>
                <summary>Czy kurs zastępuje szkołę rodzenia na sali?</summary>
                <p>Kurs obejmuje przygotowanie do porodu i do pierwszych miesięcy z dzieckiem, w formie lekcji wideo. Nie zastępuje spotkań na żywo ani wizyt kontrolnych. Możecie łączyć go z zajęciami na sali.</p>
              </details>
              <details>
                <summary>Ile trwa kurs i jak długo mamy dostęp?</summary>
                <p>52 lekcje to prawie 5 godzin materiału wideo. Dostęp trwa 12 miesięcy od przewidywanej daty porodu, a do każdej lekcji możecie wracać dowolnie wiele razy.</p>
              </details>
              <details>
                <summary>Kiedy najlepiej zacząć?</summary>
                <p>Kiedy chcecie. Mapa programu podpowiada, które moduły przydają się w danym okresie, ale wszystkie lekcje są dostępne od pierwszego dnia. W lekcji 6 ekspertka wyjaśnia, dlaczego warto zacząć około 21. tygodnia ciąży.</p>
              </details>
              <details>
                <summary>Czy osoba towarzysząca ma dostęp?</summary>
                <p>Tak. Dostęp dla dwojga jest w cenie, bez żadnych dopłat.</p>
              </details>
              <details>
                <summary>Na czym oglądamy lekcje?</summary>
                <p>W przeglądarce na telefonie, tablecie, komputerze albo Smart TV. Wystarczy połączenie z internetem.</p>
              </details>
              <details>
                <summary>Ile kosztuje kurs?</summary>
                <p>489 zł, płatność jednorazowa, bez ukrytych abonamentów i bez automatycznego odnawiania.</p>
              </details>
              <details>
                <summary>Jak szybko dostaniemy dostęp po opłaceniu?</summary>
                <p>Dostęp do Strefy Rodziców aktywuje się automatycznie natychmiast po potwierdzeniu płatności przez operatora Stripe (zwykle w kilkanaście sekund).</p>
              </details>
              <details>
                <summary>Czy kurs zastępuje konsultację z lekarzem lub wykwalifikowaną specjalistką?</summary>
                <p>Nie. Materiały mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej specjalistki. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112.</p>
              </details>
              <details>
                <summary>Kto przygotował lekcje?</summary>
                <p>Lekcje nagraliśmy z dyplomowanymi ekspertkami, na bazie wytycznych polskiej opieki okołoporodowej. Merytoryczną bazą jest szkoła rodzenia Mama Gaja, która działa od 2012 roku.</p>
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
              <p className="opis">Szkoła rodzenia online dla dwojga. Od szkoły rodzenia Mama Gaja.</p>
              <div aria-hidden="true" className="wstega-mini">
                <i className="p1" /><i className="p2" /><i className="p3" /><i className="p4" />
              </div>
            </div>
            <div>
              <h2>Kurs</h2>
              <ul>
                <li><Link href="/program">Program, 52 lekcje</Link></li>
                <li><a href="/#lekcja">Bezpłatna lekcja</a></li>
                <li><a href="/#cena">Cena (489 zł)</a></li>
                <li><a href="/#faq">Pytania i odpowiedzi</a></li>
                <li><Link href="/strefa">Strefa Rodziców (Logowanie)</Link></li>
              </ul>
            </div>
            <div>
              <h2>HappyBirth</h2>
              <ul>
                <li><Link href="/o-nas">O nas</Link></li>
                <li><Link href="/standard-merytoryczny">Standard merytoryczny</Link></li>
                <li><Link href="/partnerzy">Strefa Partnera (Afiliacja)</Link></li>
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
              Zdjęcia na stronie to wizualizacje AI. HappyBirth jest marką KLARSOLUTIONS sp. z o.o., © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      <div className="pasek-prawny">
        <p>Materiały HappyBirth mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej specjalistki. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112.</p>
      </div>

      {/* Skrypt interaktywny Macieja (suwak etapów, karuzela, wideo) */}
      <Script src="/assets/hb.82f00762a8.js" strategy="afterInteractive" />
    </>
  );
}
