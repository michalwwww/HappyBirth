'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { stages, lessons } from '@/lib/course-data';
import { emitStage, stageClass } from '@/lib/brand';
import { StageIcon } from '@/components/stage-icons';
import { BuyCourseButton } from '@/components/buy-button';
import { FreeLessonButton } from './free-lesson-button';
import { SELECT_STAGE_EVENT } from './week-calculator';
import { stagesSection as t } from './content';

function formatMinutes(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} godz ${r} min` : `${h} godz`;
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few;
  return many;
}

/**
 * Serce strony: dziewięć kafli, każdy na tincie własnego koloru.
 * Najazd wypełnia pełnym nasyceniem, symbol obraca się o dziewięć stopni.
 * Kliknięcie otwiera pasmo etapu z listą lekcji. Kropka w nawigacji przejmuje kolor.
 */
export function StagesGrid() {
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const byStage = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    for (const s of stages) map.set(s.id, []);
    for (const l of lessons) map.get(l.stageId)?.push(l);
    return map;
  }, []);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setActive(id);
    };
    window.addEventListener(SELECT_STAGE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_STAGE_EVENT, onSelect);
  }, []);

  useEffect(() => {
    if (!active) return;
    emitStage(active);
  }, [active]);

  const activeStage = active ? stages.find((s) => s.id === active) || null : null;
  const activeLessons = activeStage ? byStage.get(activeStage.id) || [] : [];
  const activeSeconds = activeLessons.reduce((a, l) => a + l.durationSeconds, 0);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" role="list">
        {stages.map((s, i) => {
          const list = byStage.get(s.id) || [];
          const seconds = list.reduce((a, l) => a + l.durationSeconds, 0);
          const isActive = active === s.id;
          const hasFree = list.some((l) => l.isFreePreview);
          return (
            <button
              key={s.id}
              type="button"
              role="listitem"
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls="hb-stage-panel"
              onClick={() => setActive(isActive ? null : s.id)}
              className={`tile r ${stageClass(s.id)} p-4 sm:p-5 min-h-[168px] sm:min-h-[196px]`}
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="w-9 h-9 sm:w-11 sm:h-11" style={{ color: isActive ? 'currentColor' : 'var(--c)' }}>
                  <StageIcon id={s.id} className="w-full h-full" />
                </span>
                <span className="tnum muted text-[12.5px] font-semibold tracking-[0.1em]">{s.num}</span>
              </div>
              <div className="mt-auto pt-5">
                <h3 className="text-[20px] sm:text-[24px] leading-tight">{s.title}</h3>
                <p className="muted mt-1 text-[14px] sm:text-[15px] leading-snug">{s.weeks}</p>
                <p className="muted mt-2 text-[13px] tnum">
                  {list.length
                    ? `${list.length} ${plural(list.length, 'lekcja', 'lekcje', 'lekcji')} · ${formatMinutes(seconds)}`
                    : t.soon}
                  {hasFree ? <span className="hidden sm:inline"> · {t.freeBadge}</span> : null}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pasmo etapu: symbol z lewej, tekst, wielki wyciszony numer z prawej */}
      <div
        id="hb-stage-panel"
        ref={panelRef}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeStage ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}
        aria-live="polite"
      >
        <div className="overflow-hidden">
          {activeStage ? (
            <div
              key={activeStage.id}
              className={`relative overflow-hidden rounded-hb-lg ${stageClass(activeStage.id)} fade-up`}
              style={{ background: 'var(--tint)', color: 'var(--deep)' }}
            >
              <span
                className="big-nr absolute right-4 top-2 text-[120px] sm:text-[200px] select-none"
                aria-hidden="true"
                style={{ color: 'var(--c)', opacity: 0.16 }}
              >
                {activeStage.num}
              </span>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
                <div className="lg:col-span-5 flex flex-col">
                  <span className="w-14 h-14 sm:w-16 sm:h-16 sym" style={{ color: 'var(--c)' }}>
                    <StageIcon id={activeStage.id} className="w-full h-full" />
                  </span>
                  <span className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.12em]">
                    etap {activeStage.num} · {activeStage.weeks}
                  </span>
                  <h3 className="mt-2 text-[34px] sm:text-[44px] leading-none">{activeStage.title}</h3>
                  <p className="mt-2 text-[17px] font-medium text-ink">{activeStage.subtitle}</p>
                  <p className="mt-4 text-[16px] leading-relaxed text-ink-2 max-w-[44ch]">{activeStage.description}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <BuyCourseButton className="btn btn-ink">
                      <span>{t.panelCta}</span>
                    </BuyCourseButton>
                    <button
                      type="button"
                      onClick={() => setActive(null)}
                      className="btn btn-ghost bg-paper/60 border-transparent hover:bg-paper"
                    >
                      {t.panelClose}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  {activeLessons.length ? (
                    <>
                      <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-ink/10">
                        <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]">
                          {activeLessons.length} {plural(activeLessons.length, 'lekcja', 'lekcje', 'lekcji')}
                        </span>
                        <span className="tnum text-[13px] text-ink-2">{formatMinutes(activeSeconds)} łącznie</span>
                      </div>
                      <ol className="divide-y divide-ink/10">
                        {activeLessons.map((l) => (
                          <li key={l.id} className="flex items-center gap-4 py-3">
                            <span className="tnum w-7 text-[13px] font-semibold">
                              {String(l.lessonNumber).padStart(2, '0')}
                            </span>
                            <span className="flex-1 min-w-0 text-[16px] leading-snug text-ink">{l.title}</span>
                            {l.isFreePreview ? (
                              <FreeLessonButton
                                lessonId={l.id}
                                compact
                                label="za darmo"
                                className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink shrink-0"
                              />
                            ) : (
                              <span className="inline-flex items-center gap-1.5 tnum text-[13px] text-ink-2 shrink-0">
                                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                                {l.durationFormatted}
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    <div className="h-full flex flex-col justify-center rounded-hb bg-paper/60 p-6 text-[16px] text-ink-2">
                      <p>Ten etap zaczyna się przed ciążą. Na razie masz tu kalkulator tygodnia i checklistę przygotowań w Strefie. Lekcje wideo dołączą wkrótce.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
