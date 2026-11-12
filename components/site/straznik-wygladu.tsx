'use client';

// Strażnik wyglądu (runda X2, 05.11.2026). Paletę, tryb nocny i język ustawia skrypt w <head>
// przed pierwszym malowaniem. Jeśli hydracja się nie uda, React renderuje stronę od nowa i czyści
// atrybuty <html>, a strona wraca do palety domyślnej w dzień (tak było na podglądzie Netlify po
// przejściu na /#kup z podstrony). Strażnik przywraca zapisany wybór przed malowaniem
// (useLayoutEffect) i pilnuje go przy każdej późniejszej zmianie atrybutów <html>.
import { useEffect, useLayoutEffect } from 'react';
import { przywrocWyglad, wygladZgodny } from '@/lib/wyglad';

const useWczesnyEfekt = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function StraznikWygladu() {
  useWczesnyEfekt(() => {
    przywrocWyglad();
    const obs = new MutationObserver(() => { if (!wygladZgodny()) przywrocWyglad(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-paleta'] });
    return () => obs.disconnect();
  }, []);
  return null;
}
