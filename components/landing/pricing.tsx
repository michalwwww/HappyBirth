import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { BuyCourseButton } from '@/components/buy-button';
import { SectionHeading } from './section-heading';
import { pricing as t } from './content';

/** Cennik. Atrament plus jeden akcent żółty. Jedna cena, bez wariantów, bez presji. */
export function Pricing() {
  return (
    <section className="wrap py-16 sm:py-20 lg:py-24" id="cena">
      <div className="r rounded-hb-lg bg-ink text-paper overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-7 sm:p-10 lg:p-14">
          <div className="lg:col-span-6 [&_.eyebrow]:text-paper/60">
            <SectionHeading eyebrow={t.eyebrow} titleStart={t.titleStart} titleAccent={t.titleAccent} />

            <div className="mt-8 flex items-end gap-4">
              <div className="tnum font-display font-medium text-[72px] sm:text-[96px] leading-[0.85] tracking-[-0.04em] text-accent">
                {t.price}
              </div>
              <div className="pb-2 text-[16px] leading-snug text-paper/70 max-w-[16ch]">{t.priceNote}</div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BuyCourseButton className="btn btn-primary btn-lg">
                <span>{t.cta}</span>
              </BuyCourseButton>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-paper/75 max-w-[52ch]">{t.payment}</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col">
            <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-paper/60">W cenie</div>
            <ul className="mt-4 divide-y divide-paper/10">
              {t.includes.map((it) => (
                <li key={it} className="flex items-start gap-3 py-3.5 text-[17px] leading-snug text-paper/90">
                  <span className="mt-0.5 inline-flex w-6 h-6 rounded-full bg-accent text-ink items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-[14px] leading-relaxed text-paper/70">
              {t.legal}{' '}
              <Link href="/regulamin" className="underline underline-offset-4 hover:text-paper">
                {t.legalLink}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
