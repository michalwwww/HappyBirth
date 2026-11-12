'use client';

// Wideo: przykładowy bezpłatny odcinek na stronie głównej i zwiastun w hero strony Program.
// Docelowo zwiastun zmontowany z najlepszych fragmentów lekcji; do tego czasu przykładowa lekcja 6
// („Szkoła rodzenia online, Twój bezpieczny i wygodny start”, w danych strefy oznaczona jako bezpłatny
// podgląd). Odtwarzacz Cloudflare Stream ładuje się dopiero po kliknięciu, więc do tego czasu strona
// nie łączy się z serwerem wideo. Zwiastun w hero Programu ma osobną stałą ZWIASTUN, więc jego podmiana
// nie zmienia przykładowego odcinka na stronie głównej.
// Runda X1 (05.11.2026): na kadrze sam szklany przycisk PLAY w kolorze palety (nazwa dla czytników
// ekranu w aria-label), a na stronie Program wideo jest całym hero z tytułem i leadem, które znikają
// po uruchomieniu filmu.
import React, { useState } from 'react';

const WIDEO = 'https://customer-6d9sm694eja9tkvc.cloudflarestream.com/ab0d90bf8a42fcf4d7e4debf10509f73/iframe?autoplay=true&letterboxColor=transparent';
// do czasu zmontowania zwiastuna gra ta sama lekcja 6; po montażu wpisać tu adres iframe zwiastuna
const ZWIASTUN = WIDEO;

function Odtwarzacz({ tytul, src = WIDEO }: { tytul: string; src?: string }) {
  return (
    <iframe
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      src={src}
      title={tytul}
    />
  );
}

export function Trailer({ tytul, etykieta = 'Odtwórz film' }: { tytul: string; etykieta?: string }) {
  const [gra, setGra] = useState(false);
  return (
    <div className="hb-wideo">
      {gra ? (
        <Odtwarzacz tytul={tytul} />
      ) : (
        <>
          {/* kadr z 5. sekundy lekcji 6, pobrany z miniatur Cloudflare Stream i trzymany lokalnie */}
          <img
            alt=""
            height={720}
            loading="lazy"
            sizes="(max-width: 900px) 92vw, 680px"
            src="/img/lekcja-6-kadr-960.webp"
            srcSet="/img/lekcja-6-kadr-640.webp 640w, /img/lekcja-6-kadr-960.webp 960w, /img/lekcja-6-kadr-1280.webp 1280w"
            width={1280}
          />
          <button aria-label={etykieta} className="hb-szklo hb-play hb-wideo-play" onClick={() => setGra(true)} title={etykieta} type="button">
            <i aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

// Hero strony Program: powiększony zwiastun na całą szerokość pod półprzezroczystym menu,
// na nim tytuł w dwóch krojach, lead i sam przycisk PLAY. Po kliknięciu tekst znika, a w hero gra film.
export function ZwiastunHero({
  id,
  d1,
  d2,
  okruszki,
  lead,
  etykieta,
  tytulWideo,
}: {
  id: string;
  d1: string;
  d2: string;
  okruszki?: React.ReactNode;
  lead: React.ReactNode;
  etykieta: string;
  tytulWideo: string;
}) {
  const [gra, setGra] = useState(false);
  return (
    <section aria-labelledby={id} className={`hb-hero hb-pod-nav hb-hero-zwiastun${gra ? ' hb-gra' : ''}`}>
      <div className="hb-hero-slajdy">
        <figure className="hb-hero-slajd hb-akt">
          {/* kadr 1080p z miniatur Cloudflare Stream (lekcja 6), trzymany lokalnie */}
          <img
            alt=""
            decoding="async"
            fetchPriority="high"
            height={1080}
            sizes="100vw"
            src="/img/zwiastun-kadr-1280.webp"
            srcSet="/img/zwiastun-kadr-960.webp 960w, /img/zwiastun-kadr-1280.webp 1280w, /img/zwiastun-kadr-1920.webp 1920w"
            width={1920}
          />
        </figure>
      </div>
      {gra && (
        <div className="hb-zwiastun-wideo">
          <Odtwarzacz src={ZWIASTUN} tytul={tytulWideo} />
        </div>
      )}
      <div aria-hidden={gra || undefined} className="hb-hero-in">
        <div className="hb-hero-tekst">
          {okruszki}
          <h1 id={id}>
            <span className="hb-d1">{d1}</span>{' '}
            <span className="hb-d2">{d2}</span>
          </h1>
          <div className="hb-lead hb-linie">{lead}</div>
          <div className="hb-hero-ctas">
            <button aria-label={etykieta} className="hb-szklo hb-play hb-play-hero" onClick={() => setGra(true)} tabIndex={gra ? -1 : undefined} title={etykieta} type="button">
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
