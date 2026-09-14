'use client';

import React, { useState } from 'react';
import { CheckCircle2, PlayCircle, ShieldCheck, Sparkles, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

interface CloudflarePlayerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  prevLesson?: Lesson;
  nextLesson?: Lesson;
}

export function CloudflarePlayer({
  lesson,
  isCompleted,
  onToggleComplete,
  prevLesson,
  nextLesson,
}: CloudflarePlayerProps) {
  const pathname = usePathname();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';

  // Direct Cloudflare Stream embed URL
  const streamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${lesson.cloudflareUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${lesson.cloudflareUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  return (
    <div className="w-full bg-[#20071F] rounded-[14px] overflow-hidden shadow-2xl border border-[#461643] text-white">
      {/* Top Video Header Bar (Ciemnofioletowy / Purpurowy) */}
      <div className="px-5 py-3 bg-[#250A24] border-b border-[#461643] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: lesson.stageColor }}
          />
          <span className="font-semibold text-[#EAD5E5] uppercase tracking-wider">
            Lekcja {lesson.lessonNumber} · {lesson.stageTitle}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[#EAD5E5]/70">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EC008C]" /> Jakość Full HD · HappyBirth VOD
          </span>
          <span>·</span>
          <span>Czas trwania: {lesson.durationFormatted} min</span>
        </div>
      </div>

      {/* Video Container (16:9 responsive) */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {lesson.cloudflareUid ? (
          <iframe
            src={streamUrl}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <PlayCircle className="w-12 h-12 text-[#EC008C] mb-3 animate-pulse" />
            <p className="text-sm font-medium text-[#EAD5E5]">Ładowanie lekcji wideo HappyBirth...</p>
          </div>
        )}
      </div>

      {/* Player Control Bar & Progress Action */}
      <div className="p-4 sm:p-5 bg-[#250A24] flex flex-wrap items-center justify-between gap-4 border-t border-[#461643]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleComplete}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 hover:bg-emerald-900/80'
                : 'bg-[#3A1238] text-[#EAD5E5] hover:bg-[#EC008C] hover:text-white border border-[#461643]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-neutral-400'}`} />
            <span>{isCompleted ? 'Lekcja ukończona ✓' : 'Oznacz jako ukończoną'}</span>
          </button>

          {lesson.isFreePreview && (
            <span className="inline-flex items-center text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
              <Sparkles className="w-3 h-3 mr-1" /> Bezpłatna lekcja próbna
            </span>
          )}
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center space-x-2">
          {prevLesson ? (
            <Link
              href={`${prefix}/lekcja/${prevLesson.id}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#351034] hover:bg-[#461643] text-[#EAD5E5] text-xs font-medium transition-colors border border-[#461643]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Poprzednia</span>
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={`${prefix}/lekcja/${nextLesson.id}`}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#EC008C] hover:bg-[#C80077] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <span>Następna lekcja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
