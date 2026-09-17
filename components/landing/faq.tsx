import React from 'react';
import { Plus } from 'lucide-react';
import { SectionHeading } from './section-heading';
import { faq as t } from './content';

/** FAQ na natywnym <details>: dostępne z klawiatury, bez JS, z płynnym otwarciem. */
export function Faq() {
  return (
    <section className="wrap py-16 sm:py-20 lg:py-24" id="faq">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />
        </div>
        <div className="lg:col-span-8">
          <div className="r border-t border-line">
            {t.items.map((it, i) => (
              <details key={it.q} className="faq group border-b border-line" open={i === 0}>
                <summary className="flex items-center justify-between gap-6 py-5 text-[19px] sm:text-[21px] leading-snug text-ink font-display font-medium tracking-[-0.01em]">
                  <span>{it.q}</span>
                  <span className="faq-icon inline-flex w-9 h-9 rounded-full border border-line items-center justify-center shrink-0 text-ink group-hover:bg-paper-2">
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </span>
                </summary>
                <div className="faq-body pb-6 pr-0 sm:pr-16 text-[17px] leading-relaxed text-ink-2">{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
