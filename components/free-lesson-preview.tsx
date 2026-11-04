'use client';

import React, { useState } from 'react';
import { Play, CheckCircle2, Sparkles } from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

interface PreviewLessonItem {
  id: string;
  number: number;
  moduleLabel: string;
  title: string;
  duration: string;
  uid: string;
  summary: string;
}

const PREVIEW_LESSONS: PreviewLessonItem[] = [
  {
    id: 'preview-pierwsze-tygodnie',
    number: 1,
    moduleLabel: 'Moduł 1 · Początek ciąży',
    title: 'I trymestr: początek nowego życia i pierwsze tygodnie',
    duration: '5:33 min',
    uid: '623626ec3109eb70565d790c97e9a980',
    summary:
      'Spokojne wprowadzenie do pierwszych tygodni ciąży — bez straszenia i chaosu z internetu.',
  },
  {
    id: 'preview-oddech-partner',
    number: 30,
    moduleLabel: 'Moduł 5 · Aktywny poród',
    title: 'Oddech, pozycje i rola partnera w porodzie',
    duration: '6:12 min',
    uid: 'f8d8d8f24b917a32961efea785c9324b',
    summary:
      'Praktyczny instruktaż z położną Mama Gaja: jak oddychać podczas skurczu i jak partner może przynieść ulgę.',
  },
];

export function FreeLessonPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const active = PREVIEW_LESSONS[selectedIdx] || PREVIEW_LESSONS[0];
  const iframeSrc = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${active.uid}/iframe?autoplay=true&preload=metadata&letterboxColor=transparent`;
  const posterUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${active.uid}/thumbnails/thumbnail.jpg?time=4s&height=720`;

  return (
    <section aria-labelledby="zwiastun-tyt" className="sek" id="zwiastun">
      <div className="wrap" id="bezplatna-lekcja">
        <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3D0E39] bg-white dark:bg-[#1C081A] p-5 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3DB] dark:border-[#3D0E39] pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Bezpłatna lekcja bez logowania
              </span>
              <h2 id="zwiastun-tyt" className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4] mt-0.5">
                Zobacz, jak wyglądają nasze lekcje
              </h2>
            </div>

            <div className="flex gap-2 shrink-0">
              {PREVIEW_LESSONS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedIdx === idx
                      ? 'bg-[#DA0271] text-white border-[#DA0271]'
                      : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] border-[#EAE3DB] dark:border-[#461643]'
                  }`}
                >
                  Lekcja #{item.number} ({item.duration})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1A0619] border border-[#461643]">
                {isPlaying ? (
                  <iframe
                    key={active.uid}
                    src={iframeSrc}
                    title={active.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="group relative w-full h-full flex flex-col items-center justify-center text-center p-6 cursor-pointer overflow-hidden"
                    aria-label={`Odtwórz bezpłatną lekcję: ${active.title}`}
                  >
                    <img
                      src={posterUrl}
                      alt={active.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180517]/85 via-[#180517]/30 to-transparent" />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-[#DA0271] group-hover:bg-[#B8005F] text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110 mb-3">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                    <span className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold border border-white/20">
                      Odtwórz lekcję #{active.number} ({active.duration})
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                {active.moduleLabel}
              </div>
              <h3 className="font-brand-display text-lg sm:text-xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
                {active.title}
              </h3>
              <p className="text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                {active.summary}
              </p>

              <ul className="space-y-2 text-xs text-[#544A44] dark:text-[#D7CCC3] pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Oglądasz od razu — bez konta i bez podawania e-maila</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Krótkie odcinki po 5–7 minut w jakości 4K</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Położne i ekspertki ze szkoły rodzenia Mama Gaja</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
