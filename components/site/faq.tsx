// Pytania: akordeon na natywnych details i summary (działa bez skryptu). Po poprawkach z 04.11.2026
// jedna karta z cienkimi liniami między pytaniami, pytania pogrubione i nieco mniejsze.
import React from 'react';
import type { Faq as FaqItem } from '@/lib/site-copy';

export function Faq({ items, idPrefix = 'faq' }: { items: FaqItem[]; idPrefix?: string }) {
  return (
    <div className="hb-faq">
      {items.map((it, i) => (
        <details key={it.q} id={`${idPrefix}-${i + 1}`}>
          <summary>{it.q}<i aria-hidden="true" /></summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}
