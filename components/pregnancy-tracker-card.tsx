'use client';

import React from 'react';
import Link from 'next/link';
import { PregnancyProfile, calculatePregnancyState, getRecommendedLessonsForWeek } from '@/lib/pregnancy';
import { lessons } from '@/lib/course-data';
import { 
  Baby, 
  Calendar, 
  Clock, 
  Sparkles, 
  Settings, 
  ArrowRight, 
  PlayCircle,
  Heart
} from 'lucide-react';

interface PregnancyTrackerCardProps {
  profile: PregnancyProfile | null;
  onOpenWizard: () => void;
}

export function PregnancyTrackerCard({ profile, onOpenWizard }: PregnancyTrackerCardProps) {
  if (!profile || !profile.dueDate) {
    return (
      <div className="bg-gradient-to-r from-[#FCF4F6] via-[#FFFDFA] to-[#F7F0E7] dark:from-[#250A24] dark:via-[#1C081A] dark:to-[#220721] rounded-3xl p-6 sm:p-8 border border-[#DD7C9D]/30 dark:border-[#461643] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DA0271]/10 dark:bg-[#DA0271]/20 text-[#DA0271] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spersonalizuj swój program</span>
          </div>
          <h2 className="font-semibold text-xl sm:text-2xl text-[#250A24] dark:text-[#FBF8F4]">
            W którym tygodniu ciąży jesteś?
          </h2>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
            Podaj przewidywaną datę porodu lub datę miesiączki, a HappyBirth automatycznie wyróżni dla Ciebie kluczowe lekcje i uruchomi odliczanie do powitania maluszka.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="shrink-0 px-6 py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B90260] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#DA0271]/25 flex items-center gap-2 hover:scale-[1.02]"
        >
          <Calendar className="w-4 h-4" />
          <span>Ustaw termin porodu i poznajmy się</span>
        </button>
      </div>
    );
  }

  const state = calculatePregnancyState(profile.dueDate);
  const recommendedLessons = getRecommendedLessonsForWeek(state, lessons);
  const babyLabel = profile.babyName ? profile.babyName : (profile.babyGender === 'girl' ? 'córeczką' : profile.babyGender === 'boy' ? 'synkiem' : 'Twoim maleństwem');

  return (
    <div className="bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm space-y-6">
      {/* Górny wiersz: Tydzień ciąży + Odliczanie + Przycisk Edycji */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE3DB] dark:border-[#3D0E39]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#FCF4F6] dark:bg-[#DA0271]/20 text-[#DA0271] text-xs font-bold uppercase tracking-wider">
              {state.trimesterLabel}
            </span>
            <span className="text-xs font-semibold text-[#867A72] dark:text-[#C4ADC0]">
              Termin: {new Date(profile.dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h2 className="font-semibold text-2xl sm:text-3xl text-[#250A24] dark:text-[#FBF8F4]">
            {state.trimester === 'postpartum' ? (
              <span>Witaj w okresie połogu! ❤️</span>
            ) : (
              <span>Jesteś w {state.currentWeek}. tygodniu ({state.formattedWeek})</span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] rounded-2xl px-4 py-2.5 text-right">
            <div className="text-[10px] uppercase font-bold text-[#867A72] dark:text-[#C4ADC0] tracking-wider">
              {state.daysUntilDue >= 0 ? `Do spotkania z ${babyLabel}:` : 'Maluszek na świecie:'}
            </div>
            <div className="font-bold text-xl text-[#DA0271]">
              {state.daysUntilDue >= 0 ? `${state.daysUntilDue} dni` : `${Math.abs(state.daysUntilDue)} dni temu`}
            </div>
          </div>

          <button
            onClick={onOpenWizard}
            className="p-2.5 rounded-2xl border border-[#EAE3DB] dark:border-[#3D0E39] text-[#867A72] dark:text-[#C4ADC0] hover:text-[#250A24] dark:hover:text-white hover:bg-[#FBF8F4] dark:hover:bg-[#250A24] transition-colors"
            title="Edytuj dane ciąży"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Środkowy wiersz: Karta rozwoju maluszka (Wielkość owocu, waga, opis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-[#FBF8F4] dark:bg-[#220820] rounded-2xl p-4 border border-[#EAE3DB] dark:border-[#3D0E39] flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FCF4F6] dark:bg-[#DA0271]/20 text-[#DA0271] flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#867A72] dark:text-[#C4ADC0] uppercase font-bold tracking-wider">Wielkość maluszka</div>
              <div className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">{state.babyComparison.fruit}</div>
            </div>
          </div>
          <div className="text-xs text-[#544A44] dark:text-[#D7CCC3] space-y-0.5">
            <div>Waga: <strong>{state.babyComparison.weight}</strong></div>
            <div>Długość: <strong>{state.babyComparison.length}</strong></div>
          </div>
          <p className="text-[11px] text-[#867A72] dark:text-[#C4ADC0] pt-2 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-2 leading-relaxed">
            {state.babyComparison.description}
          </p>
        </div>

        {/* Rekomendowane lekcje na ten tydzień */}
        <div className="md:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#D7CCC3] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DA0271]" />
              <span>Rekomendowane lekcje na Twój obecny tydzień:</span>
            </div>
            <Link 
              href={`/strefa/lekcje?etap=${state.recommendedStageSlug}`}
              className="text-xs text-[#DA0271] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Zobacz moduł</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recommendedLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/strefa/lekcja/${lesson.id}`}
                className="group p-3 rounded-2xl bg-[#FBF8F4] dark:bg-[#220820] hover:bg-[#FCF4F6] dark:hover:bg-[#2C0C2B] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DD7C9D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#867A72] dark:text-[#C4ADC0] mb-1">
                    <span>Lekcja {lesson.lessonNumber}</span>
                    <span className="text-[#DA0271] group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#250A24] dark:text-[#FBF8F4] line-clamp-2 group-hover:text-[#DA0271] transition-colors">
                    {lesson.title}
                  </h4>
                </div>
                <div className="text-[10px] text-[#867A72] dark:text-[#C4ADC0] pt-2 mt-1">
                  {lesson.durationFormatted}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
