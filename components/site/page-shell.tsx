// Szkielet podstron v3: nagłówek, okruszki, stopka. Podstrony mówią po polsku.
// Poprawki z 04.11.2026: bez pasa „Cały program w jednej cenie” na wszystkich stronach.
// Strona może podać własne zakończenie przed stopką przez `koniec` (Dla ciebie: ramka z informacją).
import React from 'react';
import Link from 'next/link';
import { SiteHeader, type SiteSection } from './site-header';
import { SiteFooter } from './site-footer';

export function PageShell({ active = null, koniec, children }: { active?: SiteSection; koniec?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="hb-site">
      <SiteHeader active={active} />
      <main id="tresc">
        {children}
        {koniec}
      </main>
      <SiteFooter />
    </div>
  );
}

export function Okruszki({ biezaca }: { biezaca: string }) {
  return (
    <nav aria-label="Okruszki">
      <ol className="hb-okruszki">
        <li><Link href="/">Strona główna</Link></li>
        <li aria-current="page">{biezaca}</li>
      </ol>
    </nav>
  );
}
