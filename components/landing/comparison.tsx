import React from 'react';
import { Check, Minus } from 'lucide-react';
import { SectionHeading } from './section-heading';
import { comparison as t } from './content';

/** Dwa światy: szkoła stacjonarna i online. Tabela redakcyjna, bez ozdobników. */
export function Comparison() {
  return (
    <section className="bg-paper-2 border-y border-line">
      <div className="wrap py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />

        <div className="mt-10 lg:mt-14 r card overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-line text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">
            <div className="col-span-3">{t.head[0]}</div>
            <div className="col-span-4">{t.head[1]}</div>
            <div className="col-span-5 text-ink">{t.head[2]}</div>
          </div>
          <ul>
            {t.rows.map(([label, a, b]) => (
              <li key={label} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-5 border-b border-line last:border-b-0">
                <div className="md:col-span-3 text-[12.5px] md:text-[16px] font-semibold uppercase md:normal-case tracking-[0.12em] md:tracking-normal text-ink-3 md:text-ink">
                  {label}
                </div>
                <div className="md:col-span-4 flex items-start gap-2.5 text-[16px] leading-snug text-ink-3">
                  <Minus className="w-4 h-4 mt-1 shrink-0" aria-hidden="true" />
                  <span>{a}</span>
                </div>
                <div className="md:col-span-5 flex items-start gap-2.5 text-[16px] leading-snug text-ink">
                  <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-accent text-ink items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>{b}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
