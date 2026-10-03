'use client';

import React from 'react';
import Link from 'next/link';
import { Lesson } from '@/lib/types';
import { Play, CheckCircle2, Clock, Sparkles, Lock } from 'lucide-react';
import { useCourseProgress } from '@/lib/progress';
import { isCourseUnlockedLocally } from '@/lib/promo';

import { usePathname } from 'next/navigation';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isActive?: boolean;
  autoplay?: boolean;
}

export function LessonCard({ lesson, isCompleted, isActive = false, autoplay = true }: LessonCardProps) {
  const pathname = usePathname();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';
  const { role } = useCourseProgress();
  const isCourseUnlocked =
    role === 'student' ||
    role === 'partner' ||
    isCourseUnlockedLocally();

  return (
    <Link
      href={`${prefix}/lekcja/${lesson.id}${autoplay ? '?autoplay=true' : ''}`}
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-[#FFFDFA] dark:bg-[#250A24] border-[#DA0271] shadow-md ring-1 ring-[#DA0271]'
          : 'bg-[#FFFDFA] dark:bg-[#1C081A] border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271]/60 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start sm:items-center space-x-3.5 w-full sm:w-auto">
        {/* Play Icon / Number Container */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : isActive
              ? 'bg-[#DA0271] text-white shadow-sm'
              : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] border border-[#EAE3DB] dark:border-[#3D0E39] group-hover:bg-[#DA0271] group-hover:text-white group-hover:border-[#DA0271]'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isActive ? (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          ) : (
            <span className="text-xs font-bold font-mono">{lesson.lessonNumber}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-0.5">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
              style={{ backgroundColor: `${lesson.stageColor}15`, color: lesson.stageColor }}
            >
              {lesson.stageTitle}
            </span>

            {lesson.isFreePreview ? (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Bezpłatna lekcja
              </span>
            ) : isCourseUnlocked ? (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> W pakiecie
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[#867A72] dark:text-[#C4ADC0] bg-[#F7F0E7] dark:bg-[#250A24] px-1.5 py-0.5 rounded border border-[#EADFD3] dark:border-[#3D0E39] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#DA0271]" /> Pełny kurs
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271] transition-colors line-clamp-1">
            {lesson.title}
          </h4>

          <p className="text-xs text-[#867A72] dark:text-[#C4ADC0] line-clamp-1 mt-0.5">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Meta duration */}
      <div className="flex items-center space-x-2 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE3DB] dark:border-[#3D0E39] w-full sm:w-auto justify-between sm:justify-end text-xs text-[#867A72] dark:text-[#C4ADC0] shrink-0">
        <div className="flex items-center space-x-1 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{lesson.durationFormatted}</span>
        </div>
      </div>
    </Link>
  );
}
