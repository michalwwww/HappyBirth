'use client';

import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useSiteUrls } from '@/lib/site-urls';
import { SectionHeading } from './section-heading';
import { who as t } from './content';

/** Dowody, nie obietnice. Rejestr PRACA: atrament i papier. */
export function Who() {
  const urls = useSiteUrls();
  return (
    <section className="bg-ink text-paper" id="kto">
      <div className="wrap py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-6 [&_.eyebrow]:text-paper/70 [&_.lead]:text-paper/75">
          <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />
          <p className="r mt-6 text-[18px] leading-relaxed text-paper/80 max-w-[54ch]">{t.text}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <ul className="space-y-4">
            {t.points.map((p, i) => (
              <li
                key={p}
                className="r flex items-start gap-4 border-t border-paper/15 pt-4 text-[17px] leading-snug text-paper/90"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="mt-0.5 inline-flex w-6 h-6 rounded-full bg-accent text-ink items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <a
            href={urls.strefaPath('/standard-medyczny')}
            className="r link-arrow mt-8 text-paper border-paper/0 hover:border-paper text-[16px]"
          >
            {t.link}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
