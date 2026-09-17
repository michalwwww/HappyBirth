import React from 'react';
import { proof } from './content';

/** Pasek dowodów. Rejestr PRACA: liczba jako bohater, jeden wiersz, zero ozdobników. */
export function ProofStrip() {
  return (
    <section className="border-y border-line bg-paper-2" aria-label="Liczby o kursie">
      <div className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 py-9 lg:py-10">
        {proof.map((p) => (
          <div key={p.label} className="r">
            <div className="tnum font-display font-medium text-[38px] sm:text-[44px] leading-none tracking-[-0.03em] text-ink">
              {p.value}
            </div>
            <div className="mt-2 text-[15px] leading-snug text-ink-2 max-w-[22ch]">{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
