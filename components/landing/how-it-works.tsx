import React from 'react';
import { StageIcon } from '@/components/stage-icons';
import { SectionHeading } from './section-heading';
import { how as t } from './content';

/** USP: personalizacja czasowa. Konkurencja sprzedaje statyczny kurs. */
export function HowItWorks() {
  return (
    <section className="wrap py-16 sm:py-20 lg:py-24" id="jak">
      <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />

      <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <ol className="contents">
          {t.steps.map((s, i) => (
            <li
              key={s.nr}
              className="r card p-6 sm:p-7 flex flex-col min-h-[240px]"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="tnum font-display font-medium text-[44px] leading-none tracking-[-0.03em] text-ink">
                {s.nr}
              </span>
              <h3 className="mt-auto pt-8 text-[22px] leading-tight">{s.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>

        <aside className="r e-planb rounded-hb-lg p-6 sm:p-7 flex flex-col min-h-[240px] text-ink" style={{ background: 'var(--tint2)', transitionDelay: '210ms' }}>
          <span className="eyebrow">{t.partner.eyebrow}</span>
          <span className="mt-6 w-12 h-12" style={{ color: 'var(--c)' }}>
            <StageIcon id="planb" className="w-full h-full" />
          </span>
          <h3 className="mt-auto pt-8 text-[26px] leading-tight">{t.partner.title}</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{t.partner.text}</p>
        </aside>
      </div>
    </section>
  );
}
