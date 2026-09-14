'use client';

import React from 'react';
import Link from 'next/link';
import { stages, lessons } from '@/lib/course-data';
import { StageIcon } from './stage-icons';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useCourseProgress } from '@/lib/progress';

export function StageTimeline({ currentStageId }: { currentStageId?: string }) {
  const { completedLessons } = useCourseProgress();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {stages.map((stage) => {
          const stageLessons = lessons.filter((l) => l.stageId === stage.id);
          const completedInStage = stageLessons.filter((l) => completedLessons.includes(l.id));
          const isFinished = stageLessons.length > 0 && completedInStage.length === stageLessons.length;
          const isActive = currentStageId === stage.id;

          return (
            <Link
              key={stage.id}
              href={stageLessons.length > 0 ? `/lekcja/${stageLessons[0].id}` : '/#etapy'}
              className={`group relative rounded-[14px] p-6 min-h-[220px] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isActive
                  ? 'ring-2 ring-[#EC008C] shadow-md'
                  : ''
              }`}
              style={{
                backgroundColor: stage.accentBg,
                color: '#1A1512',
              }}
            >
              {/* Top row: Icon & Number */}
              <div className="flex items-start justify-between w-full">
                <div
                  className="w-13 h-13 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ color: stage.color }}
                >
                  <StageIcon id={stage.id} className="w-12 h-12" />
                </div>

                <span className="font-mono text-xs font-bold tracking-widest opacity-50 uppercase">
                  {stage.num}
                </span>
              </div>

              {/* Bottom text */}
              <div className="pt-6 mt-auto">
                <div className="text-[11px] font-semibold tracking-wider uppercase opacity-70 mb-1">
                  {stage.weeks}
                </div>

                <h3 className="font-brand-display text-2xl font-bold tracking-tight leading-snug group-hover:text-[#EC008C] transition-colors">
                  {stage.title}
                </h3>

                <p className="text-xs opacity-80 line-clamp-2 mt-1 leading-relaxed">
                  {stage.subtitle}
                </p>

                {/* Progress bar inside card */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 font-medium opacity-75">
                    {isFinished ? (
                      <span className="inline-flex items-center text-emerald-800 font-bold gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ukończony ({stageLessons.length})
                      </span>
                    ) : (
                      <span>
                        {stageLessons.length > 0 ? (
                          <>
                            <strong>{completedInStage.length}</strong> / {stageLessons.length} lekcji
                          </>
                        ) : (
                          'Materiały'
                        )}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center font-bold gap-1 group-hover:translate-x-1 transition-transform text-[#1A1512]">
                    <span>Przejdź</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
