import React from 'react';
import { SectionHeading } from './section-heading';
import { testimonials as t } from './content';

/** Opinie jako cytaty redakcyjne. Bez gwiazdek: dowodem jest zdanie, nie ikonka. */
export function Testimonials() {
  return (
    <section className="wrap py-16 sm:py-20 lg:py-24" id="opinie">
      <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />

      <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {t.items.map((it, i) => (
          <figure
            key={it.author}
            className="r card p-6 sm:p-7 flex flex-col"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="w-8 h-1 rounded-full bg-stage-pierwszanoc" aria-hidden="true" />
            <blockquote className="se mt-6 text-[23px] sm:text-[25px] leading-[1.3] text-ink">„{it.quote}”</blockquote>
            <figcaption className="mt-auto pt-6 text-[15px]">
              <span className="block font-semibold text-ink">{it.author}</span>
              <span className="block text-ink-3">{it.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
