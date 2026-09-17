import React from 'react';
import { STAGE_TOKENS } from '@/lib/brand';
import { StageIcon } from '@/components/stage-icons';
import { BuyCourseButton } from '@/components/buy-button';
import { FreeLessonButton } from './free-lesson-button';
import { WeekCalculator } from './week-calculator';
import { hero as t } from './content';

/**
 * Hero. Rejestr RADOŚĆ: jedna myśl, nagłówek z ostatnim słowem szeryfowym,
 * dziewięć kropek palety jako zapowiedź systemu, symbole unoszące się w tle.
 * Jedyne CTA sprzedażowe plus darmowa lekcja.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden" id="top">
      {/* Symbole tła: rejestr radości, delikatny ruch w pętli, wyłączany przez prefers-reduced-motion */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="absolute right-[42%] top-[5%] w-[72px] text-stage-lepiej float opacity-90">
          <StageIcon id="lepiej" className="w-full h-auto" />
        </div>
        <div className="absolute right-[6%] top-[4%] w-[52px] text-stage-niespi float-slow opacity-90">
          <StageIcon id="niespi" className="w-full h-auto" />
        </div>
        <div className="absolute right-[2%] bottom-[10%] w-[64px] text-stage-karmienie float opacity-90" style={{ animationDelay: '-3s' }}>
          <StageIcon id="karmienie" className="w-full h-auto" />
        </div>
        <div className="absolute right-[40%] bottom-[6%] w-[56px] text-stage-pierwszanoc float-slow opacity-90" style={{ animationDelay: '-5s' }}>
          <StageIcon id="pierwszanoc" className="w-full h-auto" />
        </div>
      </div>

      <div className="wrap relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-10 sm:pt-14 lg:pt-20 pb-14 lg:pb-24">
        <div className="lg:col-span-7 max-w-[640px]">
          <span className="oko mb-7" aria-hidden="true">
            {STAGE_TOKENS.map((s, i) => (
              <i key={s.key} className="pop" style={{ background: s.c, animationDelay: `${120 + i * 55}ms` }} />
            ))}
          </span>

          <span className="eyebrow fade-up" style={{ animationDelay: '80ms' }}>
            {t.eyebrow}
          </span>

          <h1 className="h-display mt-4 fade-up" style={{ animationDelay: '140ms' }}>
            {t.titleStart} <em className="se text-stage-pierwszanoc">{t.titleAccent}</em>
          </h1>

          <p className="lead mt-6 max-w-[48ch] fade-up" style={{ animationDelay: '220ms' }}>
            {t.lead}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 fade-up" style={{ animationDelay: '300ms' }}>
            <BuyCourseButton className="btn btn-primary btn-lg">
              <span>{t.ctaPrimary}</span>
            </BuyCourseButton>
            <FreeLessonButton label={t.ctaSecondary} className="btn btn-ghost btn-lg pl-3" />
          </div>

          <p className="mt-5 text-[15px] text-ink-3 fade-up" style={{ animationDelay: '360ms' }}>
            {t.note}
          </p>
        </div>

        <div className="lg:col-span-5 fade-up" style={{ animationDelay: '260ms' }}>
          <WeekCalculator />
        </div>
      </div>
    </section>
  );
}
