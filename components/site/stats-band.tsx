'use client';

// Liczby pod hero: cztery kafle w kolorach pasm, nachodzą na dolną krawędź zdjęcia
// i doliczają się w górę, gdy wjeżdżają w widok. Bez skryptu i przy ograniczonym ruchu
// widać od razu wartości końcowe. Liczba stoi sama, słowo jest w opisie, bez przypisu.
// Od 04.11.2026 stoją na O nas (mniejsze kafle, wariant `male`), wartość może być tekstem (24/7).
import React, { useEffect, useRef, useState } from 'react';
import type { Language } from '@/lib/i18n';
import type { LiczbyCopy } from '@/lib/site-copy';

const LOCALE: Record<Language, string> = { pl: 'pl-PL', en: 'en-GB', ru: 'ru-RU' };
const CZAS = 1700;

export function StatsBand({ t, lang, male = false }: { t: LiczbyCopy; lang: Language; male?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [widac, setWidac] = useState(true);
  const [postep, setPostep] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-reduce-motion');
    if (reduce || !('IntersectionObserver' in window)) return;
    setWidac(false);
    setPostep(0);
    let raf = 0;
    const io = new IntersectionObserver((wpisy) => {
      if (!wpisy.some((w) => w.isIntersecting)) return;
      io.disconnect();
      setWidac(true);
      const start = performance.now();
      const krok = (teraz: number) => {
        const x = Math.min(1, (teraz - start) / CZAS);
        setPostep(1 - Math.pow(1 - x, 3));
        if (x < 1) raf = requestAnimationFrame(krok);
      };
      raf = requestAnimationFrame(krok);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const fmt = new Intl.NumberFormat(LOCALE[lang] || 'pl-PL');

  return (
    <div className={`hb-liczby${male ? ' hb-liczby-male' : ''}${widac ? ' hb-widac' : ''}`} ref={ref}>
      <div className="hb-wrap hb-wrap-szeroki">
        <h2 className="hb-sr">{t.label}</h2>
        <ul className="hb-liczby-l">
          {t.stats.map((s, i) => {
            const wartosc = Math.round(s.n * postep);
            const pelna = s.tekst || `${fmt.format(s.n)}${s.plus ? '+' : ''}`;
            return (
              <li className="hb-liczba" key={i}>
                <b>
                  <span className="hb-sr">{pelna}</span>
                  {s.tekst
                    ? <span aria-hidden="true">{s.tekst}</span>
                    : <span aria-hidden="true">{fmt.format(wartosc)}{s.plus && <span className="hb-plus">+</span>}</span>}
                </b>
                <span className="hb-liczba-opis">{s.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
