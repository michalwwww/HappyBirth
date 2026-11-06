'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { stages, lessons } from '@/lib/course-data';
import { LessonCard } from '@/components/lesson-card';
import { useCourseProgress } from '@/lib/progress';
import { BuyCourseButton } from '@/components/buy-button';
import { Search, Filter, Sparkles, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { isCourseUnlockedLocally } from '@/lib/promo';
import {
  DODATKOWE_SLOWO_KLUCZOWE_LEKCJI,
  czyTekstPasuje,
  rozpoznajNumerLekcji,
} from '@/lib/search-utils';

function StrefaLessonsContent() {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get('stage') || 'all';

  const [selectedStage, setSelectedStage] = useState<string>(initialStage);
  const [search, setSearch] = useState<string>('');
  const { completedLessons, percentCompleted, role } = useCourseProgress();

  const isCourseUnlocked =
    role === 'student' ||
    role === 'partner' ||
    isCourseUnlockedLocally();

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      setSelectedStage(stageParam);
    }
  }, [searchParams]);

  const nrSzukany = rozpoznajNumerLekcji(search);
  const filteredLessons = lessons.filter((l) => {
    const matchesStage = selectedStage === 'all' || l.stageId === selectedStage;
    const matchesSearch =
      !search.trim() ||
      (nrSzukany !== null && l.lessonNumber === nrSzukany) ||
      czyTekstPasuje(
        search,
        l.title,
        l.description,
        DODATKOWE_SLOWO_KLUCZOWE_LEKCJI[l.lessonNumber]
      );
    return matchesStage && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] pb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] mb-2">
            <Link href="/strefa" className="hover:text-[color:var(--hb-ink)] dark:hover:text-[color:var(--hb-ink)] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Wróć do kokpitu</span>
            </Link>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
            Kompletny program edukacyjny
          </span>
          <h1 className="font-brand-display font-semibold text-3xl sm:text-5xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] mt-1">
            52 Lekcje VOD
          </h1>
          <p className="text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-2 max-w-xl">
            Od badań w I trymestrze, przez aktywny poród i pozycje wertykalne, aż po karmienie piersią i pierwszą pomoc noworodka.
          </p>
        </div>

        {/* Progress Box */}
        <div className="p-4 rounded-2xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-sm flex items-center space-x-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] text-[color:var(--hb-mag-t)] flex items-center justify-center font-bold font-mono text-sm">
            {percentCompleted}%
          </div>
          <div>
            <div className="text-xs font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">Twój postęp kursu</div>
            <div className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
              Ukończono {completedLessons.length} z 52 lekcji
            </div>
          </div>
        </div>
      </div>

      {/* Guest Notice & Buy CTA */}
      {!isCourseUnlocked && (
        <div className="rounded-2xl bg-gradient-to-r from-[color:var(--hb-noc2)] via-[color:var(--hb-noc2)] to-[color:var(--hb-noc)] dark:from-[color:var(--hb-papier)] dark:via-[color:var(--hb-karta)] dark:to-[color:var(--hb-noc)] border border-[color:var(--hb-ink2)] dark:border-[color:var(--hb-linia)] p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] border border-[color:color-mix(in_srgb,var(--hb-mag)_40%,transparent)] text-[color:var(--hb-mag-t)] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[color:var(--hb-zol)] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Lekcja 1 jest bezpłatna dla każdego
              </div>
              <p className="text-xs text-[#E8DEF0]/90 mt-0.5">
                Dostęp do pozostałych 51 filmów VOD, apteczki i planu porodu odblokujesz po zakupie kursu.
              </p>
            </div>
          </div>

          <BuyCourseButton className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs font-bold transition-all shadow-md shadow-[color:color-mix(in_srgb,var(--hb-mag)_30%,transparent)] hover:scale-105 shrink-0 flex items-center justify-center gap-2 cursor-pointer">
            <span>Kup pełny dostęp · 489 zł</span>
          </BuyCourseButton>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj lekcji (np. oddech, kąpiel, ZZO)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--hb-mag)]"
          />
        </div>

        {/* Stage Filter */}
        <div className="w-full sm:w-auto flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedStage === 'all'
                ? 'bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] shadow-sm shadow-[color:color-mix(in_srgb,var(--hb-mag)_25%,transparent)]'
                : 'bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] hover:border-[color:var(--hb-mag)]'
            }`}
          >
            Wszystkie (52)
          </button>
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStage === st.id
                  ? 'text-white shadow-sm'
                  : 'bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] hover:border-[color:var(--hb-mag)]'
              }`}
              style={selectedStage === st.id ? { backgroundColor: st.color } : {}}
            >
              {st.num} · {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={completedLessons.includes(lesson.id)}
            />
          ))
        ) : (
          <div className="p-12 text-center text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] rounded-2xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
            Nie znaleziono lekcji dla podanych kryteriów wyszukiwania.
          </div>
        )}
      </div>
    </div>
  );
}

export default function StrefaLessonsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
        Ładowanie 52 lekcji VOD...
      </div>
    }>
      <StrefaLessonsContent />
    </Suspense>
  );
}
