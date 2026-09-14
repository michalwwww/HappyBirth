'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { stages, lessons } from '@/lib/course-data';
import { LessonCard } from '@/components/lesson-card';
import { useCourseProgress } from '@/lib/progress';
import { Search, Filter, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function StrefaLessonsContent() {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get('stage') || 'all';

  const [selectedStage, setSelectedStage] = useState<string>(initialStage);
  const [search, setSearch] = useState<string>('');
  const { completedLessons, percentCompleted } = useCourseProgress();

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      setSelectedStage(stageParam);
    }
  }, [searchParams]);

  const filteredLessons = lessons.filter((l) => {
    const matchesStage = selectedStage === 'all' || l.stageId === selectedStage;
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.lessonNumber.toString() === search.trim();
    return matchesStage && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE3DB] pb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#867A72] mb-2">
            <Link href="/strefa" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Wróć do kokpitu</span>
            </Link>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Kompletny program edukacyjny
          </span>
          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] mt-1">
            52 Lekcje VOD
          </h1>
          <p className="text-sm text-[#544A44] mt-2 max-w-xl">
            Od badań w I trymestrze, przez aktywny poród i pozycje wertykalne, aż po karmienie piersią i pierwszą pomoc noworodka.
          </p>
        </div>

        {/* Progress Box */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE3DB] shadow-sm flex items-center space-x-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#EC008C]/10 text-[#EC008C] flex items-center justify-center font-bold font-mono text-sm">
            {percentCompleted}%
          </div>
          <div>
            <div className="text-xs font-bold text-[#1A1512]">Twój postęp kursu</div>
            <div className="text-xs text-[#867A72]">
              Ukończono {completedLessons.length} z 52 lekcji
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867A72]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj lekcji (np. oddech, kąpiel, ZZO)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EAE3DB] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
          />
        </div>

        {/* Stage Filter */}
        <div className="w-full sm:w-auto flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStage === 'all'
                ? 'bg-[#250A24] text-white shadow-sm'
                : 'bg-white border border-[#EAE3DB] text-[#544A44] hover:border-[#867A72]'
            }`}
          >
            Wszystkie (52)
          </button>
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStage === st.id
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-[#EAE3DB] text-[#544A44] hover:border-[#867A72]'
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
          <div className="p-12 text-center text-[#867A72] bg-white rounded-2xl border border-[#EAE3DB]">
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#867A72]">
        Ładowanie 52 lekcji VOD...
      </div>
    }>
      <StrefaLessonsContent />
    </Suspense>
  );
}
