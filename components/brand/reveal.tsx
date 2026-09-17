'use client';

import { useEffect } from 'react';

/**
 * Odsłanianie przy scrollu. Elementy z klasą .r dostają .in, gdy wjeżdżają
 * w widok: przesunięcie 14 px w górę, 600 ms, opóźnienie kaskadowe 70 ms co czwarty.
 * prefers-reduced-motion wyłącza efekt w CSS (globals.css).
 */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.r'));
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
    );

    els.forEach((el, i) => {
      // Elementy widoczne od razu (nad linią zgięcia) pokazujemy bez opóźnienia
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        el.classList.add('in');
        return;
      }
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
