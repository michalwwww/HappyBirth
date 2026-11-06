'use client';

// HERO v3: karuzela na całą szerokość ze zdjęciami pod półprzezroczystym menu (klasa hb-pod-nav).
// Karuzela jest wspólna dla strony głównej i O nas (poprawki z 04.11.2026): każda strona podaje
// własne kadry i własny blok tekstu. Czytelność: ciepła kurtyna w kolorze atramentu tylko pod
// tekstem, tekst w lewym dolnym rogu. Przejścia sterowane końcem animacji paska postępu, więc pauza
// zatrzymuje oba naraz. Ruch ograniczony: start w pauzie. Pozostałe kadry dociągamy po pierwszym.
import React, { useCallback, useEffect, useState } from 'react';
import type { HomeCopy } from '@/lib/site-copy';
import { fill } from '@/lib/site-copy';
import { IconGraj, IconPauza } from './icons';

export type Slajd = {
  base: string;
  widths: number[];
  // fx i fy: punkt kadru na komputerze, fxm: kadr na telefonie
  fx: string;
  fy: string;
  fxm: string;
  w?: number;
  h?: number;
  // kadr tylko na telefonie i tablecie (na szerokim ekranie twarze zderzają się z tytułem)
  tylkoWaski?: boolean;
};

export type KaruzelaEtykiety = Pick<HomeCopy['hero'], 'karuzela' | 'kadr' | 'pokazKadr' | 'pauza' | 'wznow'>;

const SLAJDY_GLOWNA: Slajd[] = [
  { base: 'hero-1-para', widths: [640, 960, 1280, 1737], fx: '64%', fy: '72%', fxm: '72%' },
  { base: 'hero-2-oddech', widths: [640, 960, 1280, 1920, 2400], fx: '60%', fy: '35%', fxm: '63%' },
  { base: 'hero-3-tata', widths: [640, 960, 1280, 1920, 2040], fx: '62%', fy: '45%', fxm: '60%' },
  { base: 'hero-4-wieczor', widths: [640, 960, 1280, 1920, 2040], fx: '56%', fy: '60%', fxm: '58%', tylkoWaski: true },
];
const WASKI = '(max-width: 860px)';
// czas jednego kadru (X1: szybciej niż wcześniej 7 s, nadal spokojnie)
const CZAS_MS = 5200;

export function Karuzela({
  slajdy,
  alty,
  etykiety,
  className = '',
  ariaLabelledby,
  children,
}: {
  slajdy: Slajd[];
  alty: string[];
  etykiety: KaruzelaEtykiety;
  className?: string;
  ariaLabelledby?: string;
  children: React.ReactNode;
}) {
  const [akt, setAkt] = useState(0);
  const [byly, setByly] = useState<number[]>([0]);
  const [pauza, setPauza] = useState(false);
  const [zaladuj, setZaladuj] = useState(false);
  const [ile, setIle] = useState(slajdy.length);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-reduce-motion');
    if (reduce) setPauza(true);
    const id = window.setTimeout(() => setZaladuj(true), 1200);
    const onVis = () => { if (document.hidden) setPauza(true); };
    document.addEventListener('visibilitychange', onVis);
    const mq = window.matchMedia(WASKI);
    const policz = () => setIle(mq.matches ? slajdy.length : slajdy.filter((s) => !s.tylkoWaski).length);
    policz();
    mq.addEventListener('change', policz);
    return () => { window.clearTimeout(id); document.removeEventListener('visibilitychange', onVis); mq.removeEventListener('change', policz); };
  }, [slajdy]);

  useEffect(() => { if (akt >= ile) setAkt(0); }, [akt, ile]);

  const idz = useCallback((i: number) => {
    setAkt(i);
    setByly((b) => (b.includes(i) ? b : [...b, i]));
  }, []);

  const dalej = useCallback(() => idz((akt + 1) % ile), [akt, ile, idz]);

  return (
    <section
      aria-label={ariaLabelledby ? undefined : etykiety.karuzela}
      aria-labelledby={ariaLabelledby}
      aria-roledescription="karuzela"
      className={`hb-hero hb-pod-nav${pauza ? ' hb-pauza' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="hb-hero-slajdy">
        {slajdy.map((s, i) => {
          const widoczny = i === 0 || zaladuj || byly.includes(i);
          const srcSet = s.widths.map((w) => `/img/${s.base}-${w}.webp ${w}w`).join(', ');
          const style = { ['--fx' as string]: s.fx, ['--fy' as string]: s.fy, ['--fxm' as string]: s.fxm } as React.CSSProperties;
          return (
            <figure
              aria-hidden={i !== akt}
              aria-label={fill(etykiety.kadr, { n: i + 1, razem: ile })}
              className={`hb-hero-slajd${i === akt ? ' hb-akt' : ''}${s.tylkoWaski ? ' hb-tylko-waski' : ''}`}
              key={s.base}
              role="group"
              style={style}
            >
              {widoczny && (
                <img
                  alt={alty[i] || ''}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  height={s.h || 1067}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                  src={`/img/${s.base}-1280.webp`}
                  srcSet={srcSet}
                  width={s.w || 1600}
                />
              )}
            </figure>
          );
        })}
      </div>

      <div className="hb-hero-in">
        <div className="hb-hero-tekst">{children}</div>
      </div>

      <div className="hb-hero-ster">
        <div className="hb-hero-odcinki">
          {slajdy.slice(0, ile).map((s, i) => (
            <button
              aria-current={i === akt ? 'true' : undefined}
              aria-label={fill(etykiety.pokazKadr, { n: i + 1 })}
              className={`hb-hero-odcinek${i === akt ? ' hb-akt' : ''}${i < akt ? ' hb-byl' : ''}`}
              key={`${s.base}-${i === akt ? akt : 'x'}`}
              onClick={() => idz(i)}
              type="button"
            >
              <i
                onAnimationEnd={i === akt ? dalej : undefined}
                style={{ ['--czas' as string]: `${CZAS_MS}ms` } as React.CSSProperties}
              />
            </button>
          ))}
        </div>
        <button
          aria-label={pauza ? etykiety.wznow : etykiety.pauza}
          className="hb-szklo hb-hero-pauza"
          onClick={() => setPauza((p) => !p)}
          title={pauza ? etykiety.wznow : etykiety.pauza}
          type="button"
        >
          {pauza ? <IconGraj /> : <IconPauza />}
        </button>
      </div>
    </section>
  );
}

// Strona główna: tytuł w dwóch liniach (dwa kroje i kolory), opis w trzech zdaniach i DOŁĄCZ DO NAS JUŻ DZISIAJ.
// Od 04.11.2026 bez liczb pod zdjęciem (przeniesione na O nas), więc hero kończy się niżej.
export function HeroCarousel({ t }: { t: HomeCopy['hero'] }) {
  return (
    <Karuzela alty={t.alty} className="hb-hero-glowna" etykiety={t} slajdy={SLAJDY_GLOWNA}>
      <h1>
        {/* długi tytuł (RU) może się łamać, krótki (PL, EN) stoi w jednej linii */}
        <span className={`hb-d1${t.t1.length > 26 ? ' hb-dlugi' : ''}`}>{t.t1}</span>{' '}
        <span className="hb-d2">{t.t2}</span>
      </h1>
      <p className="hb-lead hb-linie">
        {t.lead.map((zdanie, i) => <span key={i}>{zdanie}{i < t.lead.length - 1 ? ' ' : ''}</span>)}
      </p>
      <div className="hb-hero-ctas">
        {/* jedyne miejsce z DOŁĄCZ DO NAS JUŻ DZISIAJ: po przycisku płynnie przesuwa się blik */}
        <a className="hb-btn hb-btn-kup hb-duzy hb-blysk" href="#kup">{t.cta}</a>
      </div>
    </Karuzela>
  );
}
