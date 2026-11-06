'use client';

// Wygląd strony (runda X1, 05.11.2026): paleta (cztery wersje) i tryb dzień albo noc.
// Wybór trafia do localStorage i do ciasteczka na domenie .happybirth.pl, więc Strefa Mamy na subdomenie
// strefa.happybirth.pl otwiera się w tej samej palecie. Skrypt w <head> (app/layout.tsx) ustawia
// html[data-paleta] i klasę dark przed pierwszym malowaniem, bez mignięcia.
import { useEffect, useState } from 'react';

export type PaletaId = 'cieply' | 'naturalny' | 'sloneczny' | 'kolorowy';

export const DOMYSLNA_PALETA: PaletaId = 'sloneczny';

// kolejność i nazwy jak w poprawkach Macieja; probki to pięć barw z palety źródłowej,
// logo i tlo służą podglądowi w panelu Ustawienia (kolory jak w app/palety.css)
export const PALETY: { id: PaletaId; nazwa: string; zrodlo: string; probki: string[]; logo: { jasny: string[]; noc: string[] }; tlo: { jasny: string; noc: string } }[] = [
  { id: 'cieply', nazwa: 'Ciepły', zrodlo: 'Midnight luxury', probki: ["#14213D", "#FCA311", "#FFFFFF", "#6C757D", "#212529"], logo: { jasny: ["#14213D", "#E39A12", "#C08070", "#14213D"], noc: ["#F7F1E6", "#FCB43A", "#E3A795", "#F7F1E6"] }, tlo: { jasny: '#FFFFFF', noc: '#213459' } },
  { id: 'naturalny', nazwa: 'Naturalny', zrodlo: 'Earthy natural', probki: ["#264653", "#2A9D8F", "#E9C46A", "#E76F51", "#F4F1DE"], logo: { jasny: ["#E76F51", "#2A9D8F", "#D9A23A", "#264653"], noc: ["#F08A6C", "#4FC0B2", "#E9C46A", "#F4F1DE"] }, tlo: { jasny: '#FFFEF8', noc: '#23424E' } },
  { id: 'sloneczny', nazwa: 'Słoneczny', zrodlo: 'Soft pastel', probki: ["#F4ACB7", "#CDB4DB", "#A2D2FF", "#BDE0C5", "#FFF1E6"], logo: { jasny: ["#D6336C", "#3E9BE0", "#F0843F", "#F5B921"], noc: ["#FF6E9C", "#6CB8F2", "#FF9A5C", "#FFD15C"] }, tlo: { jasny: '#FFFDFB', noc: '#442D40' } },
  { id: 'kolorowy', nazwa: 'Kolorowy', zrodlo: 'Bold & creative', probki: ["#4361EE", "#7209B7", "#F72585", "#FF6B35", "#FFD60A"], logo: { jasny: ["#F72585", "#4361EE", "#FF6B35", "#FFBE0B"], noc: ["#FF4FA0", "#6F86FF", "#FF8A5C", "#FFD60A"] }, tlo: { jasny: '#FFFFFF', noc: '#431B37' } },
];

const ID = new Set<string>(PALETY.map((p) => p.id));

function ciasteczko(k: string): string | null {
  try {
    const r = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)'));
    return r ? decodeURIComponent(r[1]) : null;
  } catch { return null; }
}

function zapiszCiasteczko(k: string, v: string) {
  try {
    const host = window.location.hostname;
    const domena = host === 'happybirth.pl' || host.endsWith('.happybirth.pl') ? '; domain=.happybirth.pl' : '';
    const bezp = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${k}=${encodeURIComponent(v)}; path=/; max-age=31536000; SameSite=Lax${domena}${bezp}`;
  } catch { /* przeglądarka bez ciasteczek */ }
}

// zapisany wybór: najpierw ciasteczko wspólne dla subdomen, potem localStorage (jak skrypt w <head>)
function zapisana(k: string): string | null {
  try { return ciasteczko(k) || localStorage.getItem(k); } catch { return null; }
}

export function czytajPalete(): PaletaId {
  const p = zapisana('hb_paleta');
  return p && ID.has(p) ? (p as PaletaId) : DOMYSLNA_PALETA;
}

// To samo, co robi SKRYPT_WYGLADU w <head>. Gdy hydracja się nie uda (np. hosting dopisze komentarz
// do <head>, jak robi to Netlify, albo Cloudflare przepisze adresy e-mail), React renderuje stronę
// od nowa i czyści atrybuty <html>: znika data-paleta, klasa dark i lang, a strona wraca do palety
// domyślnej w trybie dziennym. StraznikWygladu w layoucie woła tę funkcję zaraz po takim renderze.
export function przywrocWyglad() {
  const d = document.documentElement;
  const p = zapisana('hb_paleta');
  if (p && ID.has(p) && d.getAttribute('data-paleta') !== p) d.setAttribute('data-paleta', p);
  // tryb tylko wtedy, gdy jest zapisany: bez pamięci przeglądarki przełącznik działa jak dotąd
  const t = zapisana('hb_theme');
  if ((t === 'dark' || t === 'light') && d.classList.contains('dark') !== (t === 'dark')) d.classList.toggle('dark', t === 'dark');
  try {
    const l = localStorage.getItem('hb_lang');
    if ((l === 'pl' || l === 'en' || l === 'ru') && d.lang !== l) d.lang = l;
  } catch { /* brak pamięci */ }
  window.dispatchEvent(new Event('hb_paleta_updated'));
  window.dispatchEvent(new Event('hb_theme_updated'));
}

// czy <html> zgadza się z zapisanym wyborem (strażnik sprawdza to przy każdej zmianie atrybutów)
export function wygladZgodny(): boolean {
  const d = document.documentElement;
  const p = zapisana('hb_paleta');
  if (p && ID.has(p) && d.getAttribute('data-paleta') !== p) return false;
  const t = zapisana('hb_theme');
  return !(t === 'dark' || t === 'light') || d.classList.contains('dark') === (t === 'dark');
}

export function ustawPalete(p: PaletaId) {
  document.documentElement.setAttribute('data-paleta', p);
  try { localStorage.setItem('hb_paleta', p); } catch { /* brak pamięci */ }
  zapiszCiasteczko('hb_paleta', p);
  window.dispatchEvent(new Event('hb_paleta_updated'));
}

export function czytajTryb(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function ustawTryb(ciemny: boolean) {
  document.documentElement.classList.toggle('dark', ciemny);
  try { localStorage.setItem('hb_theme', ciemny ? 'dark' : 'light'); } catch { /* brak pamięci */ }
  zapiszCiasteczko('hb_theme', ciemny ? 'dark' : 'light');
  window.dispatchEvent(new Event('hb_theme_updated'));
}

// bieżąca paleta i tryb z nasłuchem zmian (panel w nagłówku, menu na telefonie, strefa)
export function useWyglad(): { paleta: PaletaId; ciemny: boolean; setPaleta: (p: PaletaId) => void; setCiemny: (c: boolean) => void } {
  const [paleta, setP] = useState<PaletaId>(DOMYSLNA_PALETA);
  const [ciemny, setC] = useState(false);
  useEffect(() => {
    const odswiez = () => {
      const a = document.documentElement.getAttribute('data-paleta');
      setP(a && ID.has(a) ? (a as PaletaId) : DOMYSLNA_PALETA);
      setC(document.documentElement.classList.contains('dark'));
    };
    odswiez();
    window.addEventListener('hb_paleta_updated', odswiez);
    window.addEventListener('hb_theme_updated', odswiez);
    return () => { window.removeEventListener('hb_paleta_updated', odswiez); window.removeEventListener('hb_theme_updated', odswiez); };
  }, []);
  return { paleta, ciemny, setPaleta: ustawPalete, setCiemny: ustawTryb };
}
