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
      <div className="bg-gradient-to-r from-[#FAE3EB] via-white to-[#F6F2EC] rounded-3xl p-6 sm:p-8 border border-[#F3CAD9] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC008C]/10 text-[#EC008C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spersonalizuj swój program</span>
          </div>
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            W którym tygodniu ciąży jesteś?
          </h2>
          <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
            Podaj przewidywaną datę porodu lub datę miesiączki, a HappyBirth automatycznie wyróżni dla Ciebie kluczowe lekcje i uruchomi odliczanie do powitania maluszka.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="shrink-0 px-6 py-3.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 flex items-center gap-2 hover:scale-[1.02]"
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] shadow-sm space-y-6">
      {/* Górny wiersz: Tydzień ciąży + Odliczanie + Przycisk Edycji */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE3DB]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#FAE3EB] text-[#EC008C] text-xs font-bold uppercase tracking-wider">
              {state.trimesterLabel}
            </span>
            <span className="text-xs font-semibold text-[#867A72]">
              Termin: {new Date(profile.dueDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
            {state.trimester === 'postpartum' ? (
              <span>Witaj w okresie połogu! ❤️</span>
            ) : (
              <span>Jesteś w {state.currentWeek}. tygodniu ({state.formattedWeek})</span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FBF8F4] border border-[#EAE3DB] rounded-2xl px-4 py-2.5 text-right">
            <div className="text-[10px] uppercase font-bold text-[#867A72] tracking-wider">
              {state.daysUntilDue >= 0 ? `Do spotkania z ${babyLabel}:` : 'Maluszek na świecie:'}
            </div>
            <div className="font-brand-display font-black text-xl text-[#EC008C]">
              {state.daysUntilDue >= 0 ? `${state.daysUntilDue} dni` : `${Math.abs(state.daysUntilDue)} dni temu`}
            </div>
          </div>

          <button
            onClick={onOpenWizard}
            className="p-2.5 rounded-2xl border border-[#EAE3DB] text-[#867A72] hover:text-[#1A1512] hover:bg-[#F6F2EC] transition-colors"
            title="Edytuj dane ciąży"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Środkowy wiersz: Karta rozwoju maluszka (Wielkość owocu, waga, opis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-[#FBF8F4] rounded-2xl p-4 border border-[#EAE3DB] flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#867A72] uppercase font-bold tracking-wider">Wielkość maluszka</div>
              <div className="text-sm font-bold text-[#1A1512]">{state.babyComparison.fruit}</div>
            </div>
          </div>
          <div className="text-xs text-[#544A44] space-y-0.5">
            <div>Waga: <strong>{state.babyComparison.weight}</strong></div>
            <div>Długość: <strong>{state.babyComparison.length}</strong></div>
          </div>
          <p className="text-[11px] text-[#867A72] pt-2 border-t border-[#EAE3DB]/60 mt-2 leading-relaxed">
            {state.babyComparison.description}
          </p>
        </div>

        {/* Rekomendowane lekcje na ten tydzień */}
        <div className="md:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#544A44] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EC008C]" />
              <span>Rekomendowane lekcje na Twój obecny tydzień:</span>
            </div>
            <Link 
              href={`/strefa/lekcje?etap=${state.recommendedStageSlug}`}
              className="text-xs text-[#EC008C] hover:underline font-semibold flex items-center gap-1"
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
                className="group p-3 rounded-2xl bg-[#FBF8F4] hover:bg-[#FAE3EB]/40 border border-[#EAE3DB] hover:border-[#F3CAD9] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#867A72] mb-1">
                    <span>Lekcja {lesson.lessonNumber}</span>
                    <span className="text-[#EC008C] group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512] line-clamp-2 group-hover:text-[#EC008C] transition-colors">
                    {lesson.title}
                  </h4>
                </div>
                <div className="text-[10px] text-[#867A72] pt-2 mt-1">
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
