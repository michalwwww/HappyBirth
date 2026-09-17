'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { stages, lessons } from '@/lib/course-data';
import { calculateDueDateFromLMP, calculatePregnancyState, getSavedPregnancyProfile } from '@/lib/pregnancy';
import { STAGE_TOKENS, emitStage, stageClass, stageToken } from '@/lib/brand';
import { StageIcon } from '@/components/stage-icons';
import { calculator as t } from './content';

const STORAGE_KEY = 'hb_pregnancy_profile';
export const SELECT_STAGE_EVENT = 'hb:select-stage';

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

const TRIMESTER: Record<string, string> = {
  '1': 'pierwszy trymestr',
  '2': 'drugi trymestr',
  '3': 'trzeci trymestr',
  postpartum: 'po porodzie',
};

export function WeekCalculator() {
  const [mode, setMode] = useState<'due' | 'lmp'>('due');
  const [date, setDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getSavedPregnancyProfile();
    if (saved?.dueDate) {
      setDate(saved.dueDate);
      setMode('due');
    }
  }, []);

  const dueDate = useMemo(() => {
    if (!date) return '';
    return mode === 'lmp' ? calculateDueDateFromLMP(date) : date;
  }, [date, mode]);

  const state = useMemo(() => (dueDate ? calculatePregnancyState(dueDate) : null), [dueDate]);

  const stage = useMemo(() => {
    if (!state) return null;
    const found = stages.find((s) => s.slug === state.recommendedStageSlug);
    return found || null;
  }, [state]);

  const stageLessons = useMemo(() => (stage ? lessons.filter((l) => l.stageId === stage.id) : []), [stage]);
  const stageSeconds = stageLessons.reduce((a, l) => a + l.durationSeconds, 0);

  // Zapis w przeglądarce i sygnał dla nawigacji (kropka przejmuje kolor etapu)
  useEffect(() => {
    if (!mounted) return;
    if (!dueDate || !stage) {
      emitStage(null);
      return;
    }
    try {
      const prev = getSavedPregnancyProfile();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...(prev || {}),
          dueDate,
          dueDateSource: mode === 'lmp' ? 'om' : 'usg',
          lmpDate: mode === 'lmp' ? date : prev?.lmpDate,
          rodoConsent: prev?.rodoConsent ?? false,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // brak localStorage: liczymy tylko w pamięci
    }
    emitStage(stage.id);
  }, [dueDate, stage, mode, date, mounted]);

  const goToStage = () => {
    if (!stage) return;
    window.dispatchEvent(new CustomEvent(SELECT_STAGE_EVENT, { detail: stage.id }));
    document.getElementById('etapy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeKey = stage ? stageToken(stage.id).key : null;
  const week = state ? Math.min(Math.max(state.currentWeek, 0), 42) : null;
  const isPast = state?.trimester === 'postpartum';
  // Po porodzie liczymy do dnia 365: od terminu do pierwszych urodzin
  const daysToBirthday = state ? Math.max(0, 365 + state.daysUntilDue) : 0;

  return (
    <div className={`card relative overflow-hidden p-6 sm:p-7 ${stage ? stageClass(stage.id) : 'e-zanim'}`}>
      <span className="eyebrow">{t.eyebrow}</span>
      <h3 className="h-card mt-3">
        {t.titleStart} <em className="se">{t.titleAccent}</em>
      </h3>
      <p className="mt-2 text-[16px] text-ink-2 leading-relaxed">{t.help}</p>

      <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="hb-date" className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
          {mode === 'due' ? t.labelDue : t.labelLmp}
        </label>
        <input
          id="hb-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="tnum mt-1.5 w-full h-[52px] rounded-hb border border-line bg-paper px-4 text-[17px] text-ink focus:border-ink focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'due' ? 'lmp' : 'due'));
            setDate('');
          }}
          className="mt-2 text-[14px] text-ink-3 underline underline-offset-4 decoration-line hover:text-ink hover:decoration-ink transition-colors"
        >
          {mode === 'due' ? t.toggleToLmp : t.toggleToDue}
        </button>
      </form>

      {state && stage ? (
        <div className="mt-5 fade-up" key={stage.id + week}>
          <div className="flex items-end gap-4">
            <div className="tnum font-display font-medium text-[72px] leading-[0.85] tracking-[-0.04em] text-ink">
              {isPast ? daysToBirthday : week}
            </div>
            <div className="pb-1 text-[15px] leading-snug text-ink-2">
              {isPast ? (
                <>
                  <div className="font-semibold text-ink">
                    {plural(daysToBirthday, 'dzień', 'dni', 'dni')} do pierwszych urodzin
                  </div>
                  <div>liczymy od terminu porodu</div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-ink">
                    tydzień {week}, dzień {state.currentDayOfWeek}
                  </div>
                  <div>
                    {TRIMESTER[String(state.trimester)]}
                    {state.daysUntilDue > 0 ? ` · zostało ${state.daysUntilDue} dni` : ' · termin dzisiaj'}
                  </div>
                </>
              )}
            </div>
          </div>

          {isPast ? <p className="mt-3 text-[15px] text-ink-2">{t.pastDue}</p> : null}

          <button
            type="button"
            onClick={goToStage}
            className="mt-4 w-full flex items-center gap-4 rounded-hb-lg p-4 text-left text-ink transition-transform hover:-translate-y-0.5"
            style={{ background: 'var(--tint2)' }}
          >
            <span className="w-12 h-12 shrink-0" style={{ color: 'var(--c)' }}>
              <StageIcon id={stage.id} className="w-12 h-12" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-2">
                etap {stage.num} · twoje lekcje na teraz
              </span>
              <span className="block font-display text-[22px] leading-tight truncate">{stage.title}</span>
              <span className="block text-[14px] text-ink-2">
                {stageLessons.length} {plural(stageLessons.length, 'lekcja', 'lekcje', 'lekcji')} · {formatMinutes(stageSeconds)}
              </span>
            </span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>
        </div>
      ) : (
        <p className="mt-5 text-[15px] text-ink-2">{t.empty}</p>
      )}

      {/* Dziewięć segmentów drogi. Aktywny etap rośnie. */}
      <div className="mt-6 flex items-end gap-1.5" aria-hidden="true">
        {STAGE_TOKENS.map((s) => (
          <span
            key={s.key}
            className="flex-1 rounded-full transition-all duration-500 ease-out"
            style={{
              height: activeKey === s.key ? 14 : 6,
              background: s.c,
              opacity: activeKey && activeKey !== s.key ? 0.35 : 1,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-ink-3 tnum">
        <span>zanim</span>
        <span>dzień zero</span>
        <span>pierwsze urodziny</span>
      </div>

      <p className="mt-4 text-[13px] text-ink-3">{t.footnote}</p>
    </div>
  );
}
