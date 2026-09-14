'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLessonById, getAdjacentLessons, getLessonsByStage, getStageById, lessons } from '@/lib/course-data';
import { CloudflarePlayer } from '@/components/cloudflare-player';
import { LessonCard } from '@/components/lesson-card';
import { useCourseProgress } from '@/lib/progress';
import { FileText, Download, CheckCircle2, BookOpen, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params);
  const lesson = getLessonById(resolvedParams.id);

  if (!lesson) {
    notFound();
  }

  const { prev, next } = getAdjacentLessons(lesson.id);
  const { completedLessons, toggleLessonCompletion } = useCourseProgress();
  const stage = getStageById(lesson.stageId);
  const stageLessons = getLessonsByStage(lesson.stageId);
  const isCompleted = completedLessons.includes(lesson.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#867A72]">
        <div className="flex items-center space-x-2">
          <Link href="/lekcje" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog lekcji</span>
          </Link>
          <span>/</span>
          <span
            className="font-semibold"
            style={{ color: lesson.stageColor }}
          >
            {stage?.title}
          </span>
          <span>/</span>
          <span className="text-[#1A1512] font-semibold">Lekcja {lesson.lessonNumber}</span>
        </div>

        <div className="flex items-center space-x-2">
          {prev && (
            <Link
              href={`/lekcja/${prev.id}`}
              className="hover:text-[#1A1512] transition-colors flex items-center gap-1"
            >
              <span>Poprzednia</span>
            </Link>
          )}
          {prev && next && <span>·</span>}
          {next && (
            <Link
              href={`/lekcja/${next.id}`}
              className="hover:text-[#1A1512] transition-colors flex items-center gap-1 font-semibold text-[#EC008C]"
            >
              <span>Następna</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Stage Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (8 cols): Player & Lesson Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cloudflare Player */}
          <CloudflarePlayer
            lesson={lesson}
            isCompleted={isCompleted}
            onToggleComplete={() => toggleLessonCompletion(lesson.id)}
            prevLesson={prev}
            nextLesson={next}
          />

          {/* Lesson Title & Stage */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider"
                style={{ backgroundColor: `${lesson.stageColor}18`, color: lesson.stageColor }}
              >
                ETAP {stage?.num} · {stage?.title}
              </span>

              <span className="text-xs text-[#867A72] font-medium font-mono">
                Czas nagrania: {lesson.durationFormatted} min
              </span>
            </div>

            <h1 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512] leading-tight">
              {lesson.title}
            </h1>

            <p className="text-sm text-[#544A44] leading-relaxed">
              {lesson.description}
            </p>

            {/* Attachments Section */}
            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="pt-4 border-t border-[#EAE3DB] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#867A72] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#EC008C]" /> Materiały do pobrania (PDF)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-2xl bg-[#FBF8F4] border border-[#EAE3DB] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                          PDF
                        </div>
                        <div>
                          <div className="font-semibold text-[#1A1512]">{att.name}</div>
                          <div className="text-[11px] text-[#867A72]">{att.size}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Pobieranie materiału: ${att.name}`)}
                        className="p-2 rounded-lg bg-white hover:bg-[#1A1512] hover:text-white border border-[#EAE3DB] transition-colors"
                        title="Pobierz PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col (4 cols): Stage Lessons Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3DB] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DB]">
              <div>
                <h3 className="font-brand-display font-bold text-base text-[#1A1512]">
                  Lekcje w tym etapie
                </h3>
                <p className="text-xs text-[#867A72]">
                  {stage?.title} ({stageLessons.length} lekcji)
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {stageLessons.map((l) => (
                <LessonCard
                  key={l.id}
                  lesson={l}
                  isCompleted={completedLessons.includes(l.id)}
                  isActive={l.id === lesson.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
