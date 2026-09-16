'use client';

import React from 'react';
import Link from 'next/link';
import { Lesson } from '@/lib/types';
import { Play, CheckCircle2, Clock, Sparkles, Lock } from 'lucide-react';

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

  return (
    <Link
      href={`${prefix}/lekcja/${lesson.id}${autoplay ? '?autoplay=true' : ''}`}
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-white border-[#EC008C] shadow-md ring-1 ring-[#EC008C]'
          : 'bg-white/80 border-[#EAE3DB] hover:border-[#867A72]/40 hover:bg-white hover:shadow-sm'
      }`}
    >
      <div className="flex items-start sm:items-center space-x-3.5 w-full sm:w-auto">
        {/* Play Icon / Number Container */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : isActive
              ? 'bg-[#EC008C] text-white shadow-sm'
              : 'bg-[#FBF8F4] text-[#544A44] border border-[#EAE3DB] group-hover:bg-[#EC008C] group-hover:text-white group-hover:border-[#EC008C]'
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
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Bezpłatna lekcja
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[#867A72] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#EC008C]" /> Pełny kurs
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-[#1A1512] group-hover:text-[#EC008C] transition-colors line-clamp-1">
            {lesson.title}
          </h4>

          <p className="text-xs text-[#867A72] line-clamp-1 mt-0.5">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Meta duration */}
      <div className="flex items-center space-x-2 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE3DB] w-full sm:w-auto justify-between sm:justify-end text-xs text-[#867A72] shrink-0">
        <div className="flex items-center space-x-1 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{lesson.durationFormatted}</span>
        </div>
      </div>
    </Link>
  );
}
