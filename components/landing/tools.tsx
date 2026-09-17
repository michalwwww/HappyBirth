'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteUrls } from '@/lib/site-urls';
import { stageClass } from '@/lib/brand';
import { StageIcon } from '@/components/stage-icons';
import { DailyTipCard } from '@/components/daily-tip-card';
import { SectionHeading } from './section-heading';
import { tools as t } from './content';

/** Narzędzia rodzinne. Kafle na tintach etapów, symbol dziedziczy kolor. */
export function Tools() {
  const urls = useSiteUrls();
  return (
    <section className="wrap py-16 sm:py-20 lg:py-24" id="narzedzia">
      <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} lead={t.lead} />

      <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {t.items.map((it, i) => (
          <a
            key={it.title}
            href={urls.strefaPath(it.path)}
            className={`r tile ${stageClass(it.stage)} p-6 sm:p-7 min-h-[280px] group`}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="w-12 h-12 sym" style={{ color: 'var(--c)' }}>
              <StageIcon id={it.stage} className="w-full h-full" />
            </span>
            <h3 className="mt-auto pt-10 text-[24px] leading-tight">{it.title}</h3>
            <p className="muted mt-2 text-[15.5px] leading-relaxed">{it.text}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold">
              Otwórz w Strefie
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-4 sm:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        <div className="r lg:col-span-4 e-lepiej rounded-hb-lg p-6 sm:p-7 flex flex-col text-ink" style={{ background: 'var(--tint2)' }}>
          <span className="eyebrow">{t.tip.eyebrow}</span>
          <span className="mt-6 w-12 h-12" style={{ color: 'var(--c)' }}>
            <StageIcon id="lepiej" className="w-full h-full" />
          </span>
          <h3 className="mt-auto pt-8 text-[26px] leading-tight">{t.tip.title}</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{t.tip.text}</p>
        </div>
        <div className="r lg:col-span-8" style={{ transitionDelay: '70ms' }}>
          <DailyTipCard className="h-full" />
        </div>
      </div>
    </section>
  );
}
