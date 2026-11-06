'use client';

// Typografia składu: jednoliterowe spójniki i przyimki (a, i, o, u, w, z) nie zostają na końcu linii,
// a liczba nie rozstaje się ze słowem (52 lekcje, 489 zł, 18 miesięcy). Twarda spacja trafia do tekstu
// dopiero po wczytaniu strony, więc tekst z serwera i z hydratacji jest ten sam (bez błędów hydratacji).
// Treść dociągana później (wyszukiwanie, rozwijanie) poprawia obserwator zmian z opóźnieniem.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LITERY: Record<string, string> = { pl: 'aiouwzAIOUWZ', ru: 'авиксоуяАВИКСОУЯ' };
const KORZENIE = '#tresc, .hb-stopka';
const POMIN = 'script,style,textarea,input,select,code,pre,[contenteditable],mark,[data-podswietl]';

export function poprawSierotkiTekst(v: string, lang = 'pl'): string {
  const litery = LITERY[lang];
  const jednoliterowe = litery ? new RegExp(`(^|[\\s(„«"])([${litery}]) +`, 'g') : null;
  const liczby = /(\d) +(?=[^\s\d])/g;
  let n = v;
  if (jednoliterowe) {
    // dwa przebiegi: „i w domu” ma dwa jednoliterowe słowa obok siebie
    n = n.replace(jednoliterowe, '$1$2\u00A0').replace(jednoliterowe, '$1$2\u00A0');
  }
  return n.replace(liczby, '$1\u00A0');
}

export function useSierotki(lang: string, korzenie: string = KORZENIE) {
  const sciezka = usePathname();

  useEffect(() => {
    const przejdz = () => {
      document.querySelectorAll(korzenie).forEach((korzen) => {
        const w = document.createTreeWalker(korzen, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => {
            const r = n.parentElement;
            if (!r || r.closest(POMIN)) return NodeFilter.FILTER_REJECT;
            return / /.test(n.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          },
        });
        const wezly: Text[] = [];
        while (w.nextNode()) wezly.push(w.currentNode as Text);
        wezly.forEach((t) => {
          const v = t.nodeValue || '';
          const n = poprawSierotkiTekst(v, lang);
          if (n !== v) t.nodeValue = n;
        });
      });
    };

    przejdz();
    let zegar = 0;
    const obs = new MutationObserver(() => {
      window.clearTimeout(zegar);
      zegar = window.setTimeout(przejdz, 180);
    });
    document.querySelectorAll(korzenie).forEach((k) => obs.observe(k, { childList: true, subtree: true, characterData: true }));
    return () => { obs.disconnect(); window.clearTimeout(zegar); };
  }, [lang, sciezka, korzenie]);
}

// Ten sam skład na stronach poza PageShell (baza wiedzy w strefie kursantki ma własną nawigację).
export function Sierotki({ lang = 'pl', korzenie }: { lang?: string; korzenie: string }) {
  useSierotki(lang, korzenie);
  return null;
}
