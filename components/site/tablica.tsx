'use client';

// Hasła przy cenie jak tablica odlotów (runda X1, 05.11.2026; układ słów runda X3): co kilka sekund
// następne hasło, litery „przeskakują” przez kilka przypadkowych znaków i kolejno, od lewej,
// układają się w nowe słowa. Chodzi o ruch tablicy, nie o jej wygląd: krój i kolory z palety strony.
// Runda X3: układ wiersza wyznacza od razu docelowe hasło (przypadkowe znaki leżą nad niewidoczną
// literą docelową), więc tekst nie skacze w trakcie animacji, a wiersz łamie się tylko między
// całymi słowami. Czytniki ekranu dostają całą listę haseł (ukrytą wizualnie), a animowany wiersz
// jest dla nich niewidoczny. Ruch ograniczony (system albo ułatwienia dostępu): zwykła lista haseł.
import React, { useEffect, useRef, useState } from 'react';

const DUZE = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ';
const MALE = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż';
const CYFRY = '0123456789';
// przypadkowy znak tej samej „rodziny” co docelowy (mała litera, wielka litera, cyfra)
function losuj(c: string): string {
  const zbior = /[0-9]/.test(c) ? CYFRY : c === c.toLowerCase() && c !== c.toUpperCase() ? MALE : DUZE;
  return zbior[Math.floor(Math.random() * zbior.length)];
}
const PAUZA_MS = 2900;
const TAKT_MS = 42;

export function Tablica({ hasla, label }: { hasla: string[]; label: string }) {
  const [ograniczony, setOgraniczony] = useState(false);
  const [cel, setCel] = useState(hasla[0]);
  // przypadkowy znak nad każdą literą hasła; null, gdy litera już się ułożyła
  const [los, setLos] = useState<(string | null)[]>([]);
  const ref = useRef<HTMLParagraphElement>(null);
  const widac = useRef(true);

  // zmiana języka: od razu pierwsze hasło w nowym języku
  useEffect(() => { setCel(hasla[0]); setLos([]); }, [hasla]);

  useEffect(() => {
    const sprawdz = () =>
      setOgraniczony(window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-reduce-motion'));
    sprawdz();
    const obs = new MutationObserver(sprawdz);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (ograniczony) return;
    let indeks = 0;
    let takt = 0;
    let zegar = 0;
    const io = new IntersectionObserver(([w]) => { widac.current = w.isIntersecting; }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);

    const nastepne = () => {
      if (!widac.current || document.hidden) { zegar = window.setTimeout(nastepne, 600); return; }
      indeks = (indeks + 1) % hasla.length;
      const nowe = hasla[indeks];
      const znaki = Array.from(nowe);
      // każdy znak ustala się w swoim takcie: od lewej, z kilkoma przeskokami przed właściwą literą
      const ustala = znaki.map((_, i) => 3 + Math.floor(i * 0.55));
      setCel(nowe);
      let n = 0;
      const krok = () => {
        n += 1;
        let gotowe = true;
        const wynik = znaki.map((c, i) => {
          if (n >= ustala[i] || !/[\p{L}\p{N}]/u.test(c)) return null;
          gotowe = false;
          return losuj(c);
        });
        setLos(wynik);
        if (!gotowe) takt = window.setTimeout(krok, TAKT_MS);
        else zegar = window.setTimeout(nastepne, PAUZA_MS);
      };
      krok();
    };
    zegar = window.setTimeout(nastepne, PAUZA_MS);
    return () => { window.clearTimeout(zegar); window.clearTimeout(takt); io.disconnect(); };
  }, [ograniczony, hasla]);

  if (ograniczony) {
    return (
      <ul aria-label={label} className="hb-tablica-lista">
        {hasla.map((h) => <li key={h}>{h}</li>)}
      </ul>
    );
  }

  // słowa jako niełamliwe bloki, między nimi zwykłe spacje: wiersz łamie się tylko między słowami
  const slowa = cel.split(' ');
  let pozycja = 0;
  return (
    <div className="hb-tablica">
      <ul aria-label={label} className="hb-sr">
        {hasla.map((h) => <li key={h}>{h}</li>)}
      </ul>
      <p aria-hidden="true" className="hb-tablica-wiersz" ref={ref}>
        <span className="hb-tablica-tekst">
          {slowa.map((slowo, si) => {
            const start = pozycja;
            pozycja += Array.from(slowo).length + 1;
            return (
              <React.Fragment key={si}>
                {si > 0 && ' '}
                <span className="hb-tablica-slowo">
                  {Array.from(slowo).map((c, ci) => {
                    const r = los[start + ci];
                    return (
                      <span className="hb-tablica-znak" key={ci}>
                        <span className={r ? 'hb-tablica-cel' : undefined}>{c}</span>
                        {r && <span className="hb-tablica-los">{r}</span>}
                      </span>
                    );
                  })}
                </span>
              </React.Fragment>
            );
          })}
        </span>
      </p>
    </div>
  );
}
