'use client';

// Oś czasu „Od pierwszego dnia do pierwszych urodzin” (runda X1, 05.11.2026).
// Pięć równych obszarów: Dwie kreski, Złoty trymestr, Czas przygotowań, Dzień narodzin, Pierwszy rok,
// pod nimi pięć ramek z opisami. Gałka sama, spokojnie przesuwa się od początku do końca i od nowa
// (pełne przejście około 50 sekund, po 10 na obszar); ramka obszaru, w którym stoi, podświetla się
// jak po kliknięciu. Najechanie na odcinek paska albo na ramkę przenosi gałkę do tego okresu
// i zatrzymuje ją; po zjechaniu ruch wraca. Fokus z klawiatury, przeciąganie i dotyk też zatrzymują.
// Kształt gałki zmienia się w czasie: na początku białe kółko z czerwonym obrysem i dwiema kreskami
// (test ciążowy), potem kółko wypełnia się czerwienią i około 7. tygodnia staje się serduszkiem
// (wtedy u zarodka kształtuje się serce), które rośnie do dnia narodzin i jeszcze trochę w pierwszym
// roku. Skala wzrostu jest pokazowa: łagodna krzywa zamiast prawdziwej proporcji masy serca.
// Ruch ograniczony (system albo ułatwienia dostępu): gałka stoi, bez animacji.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { HomeCopy } from '@/lib/site-copy';
import { fill } from '@/lib/site-copy';

// dni w obszarach: 1..91, 92..189, 190..280, dzień narodzin 281, 282..645 (do pierwszych urodzin)
const ZAKRESY: [number, number][] = [[1, 91], [92, 189], [190, 280], [281, 281], [282, 645]];
const NARODZINY = 281;
const OSTATNI = 645;
const START = 63;
const ETAP_DZIEN = [63, 147, 238, NARODZINY, 400];
const ILE = ZAKRESY.length;
const KROK = 1000 / ILE;
const KOLORY = ['var(--hb-p1c)', 'var(--hb-p2c)', 'var(--hb-p3c)', 'var(--hb-pnc)', 'var(--hb-p4c)'];
const PETLA_MS = 50000;
const POSTOJ_MS = 1800;

function etapDnia(d: number): number {
  const i = ZAKRESY.findIndex(([a, b]) => d >= a && d <= b);
  return i < 0 ? ILE - 1 : i;
}

function dzienNaWartosc(d: number): number {
  const i = etapDnia(d);
  const [a, b] = ZAKRESY[i];
  if (a === b) return i * KROK + KROK / 2;
  return i * KROK + ((d - a + 0.5) / (b - a + 1)) * KROK;
}

// miesiąc z dzieckiem dla dnia po narodzinach i pierwszy dzień danego miesiąca (miesiąc ma 30,4 dnia)
const miesiac = (d: number) => Math.min(12, Math.ceil((d - NARODZINY) / 30.4));
const poczatekMiesiaca = (m: number) => NARODZINY + Math.floor((m - 1) * 30.4) + 1;

function wartoscNaDzien(v: number): number {
  const i = Math.min(ILE - 1, Math.max(0, Math.floor(v / KROK)));
  const [a, b] = ZAKRESY[i];
  if (a === b) return a;
  const t = (v - i * KROK) / KROK;
  return Math.min(b, a + Math.floor(t * (b - a + 1)));
}

// ---------- kształt gałki: koło przechodzi w serce (punkty w jednostkach -1..1) ----------
const N = 72;
const KOLO = Array.from({ length: N }, (_, i) => {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / N;
  return [Math.cos(a), Math.sin(a)];
});
const SERCE = (() => {
  // klasyczne serce parametryczne, przeskalowane do szerokości koła i wyśrodkowane w pionie
  const surowe = Array.from({ length: N }, (_, i) => {
    const t = (2 * Math.PI * i) / N;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [x, y];
  });
  const ys = surowe.map((p) => p[1]);
  const srodek = (Math.max(...ys) + Math.min(...ys)) / 2;
  return surowe.map(([x, y]) => [x / 15.2, (y - srodek) / 15.2]);
})();
const plynnie = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// pozycja na osi (0..1000) na wygląd gałki: f = wypełnienie czerwienią, m = koło w serce, s = skala
function wyglad(p: number) {
  const f = plynnie(34, 70, p);
  const m = plynnie(66, 106, p); // około 7. tygodnia serce jest gotowe
  const doNarodzin = plynnie(106, 700, p) ** 0.9;
  const poNarodzinach = plynnie(700, 1000, p);
  const s = 1 + 0.42 * doNarodzin + 0.22 * poNarodzinach;
  return { f, m, s };
}
function sciezka(m: number): string {
  let d = '';
  for (let i = 0; i < N; i++) {
    const x = KOLO[i][0] + (SERCE[i][0] - KOLO[i][0]) * m;
    const y = KOLO[i][1] + (SERCE[i][1] - KOLO[i][1]) * m;
    d += `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`;
  }
  return d + 'Z';
}

function ruchOgraniczony(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-reduce-motion');
}

export function StageMap({ t }: { t: HomeCopy['mapa'] }) {
  const [dzien, setDzien] = useState(START);
  // podczas przeciągania wartość pola stoi dokładnie pod palcem
  const [v, setV] = useState<number | null>(null);
  const galkaRef = useRef<HTMLSpanElement>(null);
  const ksztaltRef = useRef<SVGPathElement>(null);
  const kreskiRef = useRef<SVGGElement>(null);
  const osRef = useRef<HTMLDivElement>(null);
  const pasekRef = useRef<HTMLDivElement>(null);
  const poz = useRef(dzienNaWartosc(START));
  const dzienRef = useRef(START);
  // powody zatrzymania: najechanie, fokus, przeciąganie, dotyk (z opóźnionym powrotem), poza ekranem
  const stan = useRef({ najechanie: false, fokus: false, ciagnie: false, dotyk: 0, widac: false, ograniczony: true, postoj: 0, cel: null as number | null });
  const ostatniEtapNajechania = useRef<number | null>(null);

  const rysuj = useCallback((p: number) => {
    const g = galkaRef.current;
    if (!g) return;
    const { f, m, s } = wyglad(p);
    g.style.left = `${p / 10}%`;
    g.style.setProperty('--s', s.toFixed(3));
    g.style.setProperty('--f', f.toFixed(3));
    g.style.setProperty('--kol', KOLORY[Math.min(ILE - 1, Math.floor(p / KROK))]);
    g.classList.toggle('hb-od-lewej', p < 70);
    g.classList.toggle('hb-od-prawej', p > 930);
    g.classList.toggle('hb-serce', m >= 0.999);
    ksztaltRef.current?.setAttribute('d', sciezka(m));
    kreskiRef.current?.setAttribute('opacity', (1 - f).toFixed(3));
  }, []);

  // ustawia pozycję i (tylko gdy zmienia się odczyt) dzień w stanie Reacta
  const ustawPoz = useCallback((p: number) => {
    poz.current = Math.min(1000, Math.max(0, p));
    rysuj(poz.current);
    const d = wartoscNaDzien(poz.current);
    if (d !== dzienRef.current) {
      const stary = dzienRef.current;
      dzienRef.current = d;
      const tydzien = (x: number) => (x < NARODZINY ? Math.ceil(x / 7) : x === NARODZINY ? -1 : 100 + miesiac(x));
      if (tydzien(stary) !== tydzien(d) || etapDnia(stary) !== etapDnia(d)) setDzien(d);
    }
  }, [rysuj]);

  const ustawDzien = useCallback((d: number) => {
    const dd = Math.min(OSTATNI, Math.max(1, d));
    setV(null);
    dzienRef.current = dd;
    setDzien(dd);
    poz.current = dzienNaWartosc(dd);
    rysuj(poz.current);
  }, [rysuj]);

  // pętla ruchu: requestAnimationFrame, bez przerysowania Reacta co klatkę
  useEffect(() => {
    const s = stan.current;
    s.ograniczony = ruchOgraniczony();
    if (s.ograniczony) { rysuj(poz.current); return; }
    poz.current = 0;
    dzienRef.current = 1;
    setDzien(1);
    rysuj(0);
    let ramka = 0;
    let poprzedni = performance.now();
    const krok = (teraz: number) => {
      const dt = Math.min(80, teraz - poprzedni);
      poprzedni = teraz;
      const stoi = s.najechanie || s.fokus || s.ciagnie || teraz < s.dotyk || !s.widac || document.hidden || document.documentElement.classList.contains('a11y-reduce-motion');
      if (s.cel !== null) {
        // przeskok do okresu wskazanego kursorem: krótkie, płynne dojście
        const roznica = s.cel - poz.current;
        if (Math.abs(roznica) < 0.6) { ustawPoz(s.cel); s.cel = null; } else ustawPoz(poz.current + roznica * Math.min(1, dt / 90));
      } else if (!stoi) {
        if (poz.current >= 1000) {
          if (!s.postoj) s.postoj = teraz + POSTOJ_MS;
          else if (teraz >= s.postoj) { s.postoj = 0; ustawPoz(0); }
        } else ustawPoz(poz.current + (1000 * dt) / PETLA_MS);
      }
      ramka = requestAnimationFrame(krok);
    };
    ramka = requestAnimationFrame(krok);
    // poza ekranem pętla stoi
    const obs = new IntersectionObserver(([w]) => { s.widac = w.isIntersecting; }, { threshold: 0.2 });
    if (osRef.current) obs.observe(osRef.current);
    return () => { cancelAnimationFrame(ramka); obs.disconnect(); };
  }, [rysuj, ustawPoz]);

  // najechanie na okres (odcinek paska albo ramka): gałka przeskakuje do niego i stoi
  const wskaz = (i: number) => {
    const s = stan.current;
    s.najechanie = true;
    if (ostatniEtapNajechania.current === i) return;
    ostatniEtapNajechania.current = i;
    const cel = dzienNaWartosc(ETAP_DZIEN[i]);
    if (s.ograniczony) { ustawDzien(ETAP_DZIEN[i]); return; }
    s.cel = cel;
  };
  const zjedz = () => { stan.current.najechanie = false; ostatniEtapNajechania.current = null; };

  const ruchNadPaskiem = (ev: React.PointerEvent<HTMLDivElement>) => {
    if (ev.pointerType !== 'mouse' || ev.buttons) return;
    const r = pasekRef.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.min(ILE - 1, Math.max(0, Math.floor(((ev.clientX - r.left) / r.width) * ILE)));
    wskaz(i);
  };

  const onInput = (x: number) => {
    stan.current.cel = null;
    setV(x);
    ustawPoz(x);
    setDzien(wartoscNaDzien(x));
  };

  const onKey = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    const k = ev.key;
    const dz = dzienRef.current;
    const et = etapDnia(dz);
    // każdy krok zmienia odczyt: tydzień w ciąży, dzień narodzin, miesiąc z dzieckiem
    let d = dz;
    if (k === 'ArrowRight' || k === 'ArrowUp') {
      if (dz < NARODZINY) d = Math.ceil(dz / 7) >= 40 ? NARODZINY : Math.min(NARODZINY - 1, dz + 7);
      else if (dz === NARODZINY) d = NARODZINY + 1;
      else d = miesiac(dz) >= 12 ? OSTATNI : poczatekMiesiaca(miesiac(dz) + 1);
    } else if (k === 'ArrowLeft' || k === 'ArrowDown') {
      if (dz > NARODZINY) d = miesiac(dz) <= 1 ? NARODZINY : poczatekMiesiaca(miesiac(dz) - 1);
      else if (dz === NARODZINY) d = NARODZINY - 1;
      else d = dz - 7;
    } else if (k === 'PageUp') d = et === ILE - 1 ? OSTATNI : ETAP_DZIEN[et + 1];
    else if (k === 'PageDown') d = et === 0 ? 1 : ETAP_DZIEN[et - 1];
    else if (k === 'Home') d = 1;
    else if (k === 'End') d = OSTATNI;
    else return;
    ev.preventDefault();
    ustawDzien(d);
  };

  const etap = etapDnia(dzien);
  const e = t.etapy[etap];
  const punkt =
    dzien === NARODZINY
      ? t.jednostki.narodziny
      : dzien < NARODZINY
        ? fill(t.jednostki.tydzien, { n: Math.max(1, Math.ceil(dzien / 7)) })
        : fill(t.jednostki.miesiac, { n: miesiac(dzien) });
  const wartosc = v ?? dzienNaWartosc(dzien);
  const startowy = wyglad(dzienNaWartosc(START));

  return (
    <div
      className="hb-os"
      onBlur={(ev) => { if (!ev.currentTarget.contains(ev.relatedTarget as Node)) stan.current.fokus = false; }}
      onFocus={() => { stan.current.fokus = true; }}
      ref={osRef}
    >
      <h2 className="hb-sr" id="mapa-tyt">{t.tytul}</h2>

      <div
        className="hb-os-suwak"
        onPointerDown={(ev) => { stan.current.ciagnie = true; if (ev.pointerType !== 'mouse') stan.current.dotyk = performance.now() + 8000; }}
        onPointerLeave={() => { stan.current.ciagnie = false; zjedz(); }}
        onPointerMove={ruchNadPaskiem}
        onPointerUp={(ev) => { stan.current.ciagnie = false; setV(null); if (ev.pointerType !== 'mouse') stan.current.dotyk = performance.now() + 8000; }}
      >
        <div aria-hidden="true" className="hb-os-pasek" ref={pasekRef}>
          {t.etapy.map((s, i) => <i className={`${s.id}${etap !== i ? ' hb-wyg' : ''}`} key={s.id} />)}
        </div>
        <span
          aria-hidden="true"
          className="hb-os-galka hb-serce"
          ref={galkaRef}
          style={{ left: `${dzienNaWartosc(START) / 10}%`, ['--s' as string]: startowy.s, ['--f' as string]: 1 } as React.CSSProperties}
        >
          <svg viewBox="-1.35 -1.35 2.7 2.7">
            <path className="hb-ksztalt" d={sciezka(1)} ref={ksztaltRef} />
            <g className="hb-kreski" opacity={0} ref={kreskiRef}>
              <rect height="1" rx="0.08" width="0.17" x="-0.36" y="-0.5" />
              <rect height="1" rx="0.08" width="0.17" x="0.19" y="-0.5" />
            </g>
          </svg>
          <b>{punkt}</b>
        </span>
        <input
          aria-label={t.suwakLabel}
          aria-valuetext={dzien === NARODZINY ? e.tytul : fill(t.wartosc, { punkt, etap: e.tytul })}
          max={1000}
          min={0}
          onChange={(ev) => onInput(Number(ev.target.value))}
          onKeyDown={onKey}
          step={1}
          type="range"
          value={Math.round(wartosc)}
        />
      </div>

      <ul className="hb-os-etapy">
        {t.etapy.map((s, i) => (
          <li
            className={`hb-os-etap ${s.id}${etap === i ? ' hb-akt' : ''}`}
            key={s.id}
            onPointerEnter={(ev) => { if (ev.pointerType === 'mouse') wskaz(i); }}
            onPointerLeave={(ev) => { if (ev.pointerType === 'mouse') zjedz(); }}
          >
            <h3>
              <button aria-pressed={etap === i} className="hb-etap-btn" onClick={() => { stan.current.dotyk = performance.now() + 8000; ustawDzien(ETAP_DZIEN[i]); }} type="button">
                {s.tytul}
              </button>
            </h3>
            <p className="hb-os-zakres">{s.zakres}</p>
            <ul className="hb-os-hasla">
              {s.hasla.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
