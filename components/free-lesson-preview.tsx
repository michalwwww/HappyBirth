'use client';

import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, Sparkles, ShieldCheck, Users } from 'lucide-react';
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
    id: 'preview-oddech-partner',
    number: 30,
    moduleLabel: 'Moduł 5 · Godzina „Zero”, aktywny poród',
    title: 'Oddech przeponowy, pozycje wertykalne i rola partnera w porodzie',
    duration: '6:12 min',
    uid: 'f8d8d8f24b917a32961efea785c9324b',
    summary:
      'Praktyczny instruktaż z dyplomowaną położną Mama Gaja: jak oddychać w trakcie skurczu i jak partner może realnie przynieść ulgę masażem okolicy krzyżowej.',
  },
  {
    id: 'preview-pierwsze-tygodnie',
    number: 1,
    moduleLabel: 'Moduł 1 · Twoja ciąża tydzień po tygodniu',
    title: 'I trymestr: początek nowego życia, emocje i pierwsze tygodnie',
    duration: '5:33 min',
    uid: '623626ec3109eb70565d790c97e9a980',
    summary:
      'Spokojne wprowadzenie do pierwszych tygodni ciąży bez straszenia i bez chaosu z forów internetowych — co warto zaplanować na starcie.',
  },
];

/**
 * [B2] Otwarta Lekcja Próbna bez Rejestracji (Zero-Friction Preview)
 * Umożliwia odtworzenie pełnowartościowej lekcji wideo w 4K bezpośrednio na stronie głównej
 * bez konieczności zakładania konta i bez podawania adresu e-mail.
 */
export function FreeLessonPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const active = PREVIEW_LESSONS[selectedIdx] || PREVIEW_LESSONS[0];
  const iframeSrc = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${active.uid}/iframe?autoplay=true&preload=metadata&letterboxColor=transparent`;
  const posterUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${active.uid}/thumbnails/thumbnail.jpg?time=4s&height=720`;

  return (
    <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3D0E39] bg-white dark:bg-[#1C081A] p-5 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE3DB] dark:border-[#3D0E39] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Otwarta Lekcja Próbna 4K · Bez rejestracji i bez podawania e-maila</span>
          </div>
          <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
            Sprawdź jakość kursu przed zakupem — włącz pełną lekcję jednym kliknięciem
          </h3>
        </div>

        {/* Przełącznik wyboru lekcji próbnej */}
        <div className="flex flex-wrap gap-2 shrink-0">
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
                  ? 'bg-[#DA0271] text-white border-[#DA0271] shadow-sm'
                  : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] border-[#EAE3DB] dark:border-[#461643] hover:border-[#DA0271]'
              }`}
            >
              Lekcja #{item.number} ({item.duration})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Odtwarzacz Wideo 16:9 */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1A0619] border border-[#461643] shadow-lg">
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
                  className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180517]/90 via-[#180517]/40 to-transparent" />

                <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#DA0271] group-hover:bg-[#B8005F] text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 mb-3">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </div>

                <span className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  Odtwórz pełną lekcję #{active.number} za darmo ({active.duration})
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Opis otwartej lekcji */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
            {active.moduleLabel}
          </div>
          <h4 className="font-brand-display text-lg sm:text-xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
            Lekcja {active.number}: {active.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
            {active.summary}
          </p>

          <ul className="space-y-2 text-xs text-[#544A44] dark:text-[#D7CCC3] pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero formularzy — oglądasz od razu bez podawania e-maila</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DA0271] shrink-0" />
              <span>Skondensowany micro-learning (5–7 min w jakości 4K)</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0097DB] shrink-0" />
              <span>W pełnym kursie otrzymujesz 52 takie lekcje na 18 miesięcy dla dwojga</span>
            </li>
          </ul>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#867A72] dark:text-[#A2958C]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nagrane z dyplomowanymi położnymi ze szkoły rodzenia Mama Gaja (od 2012 r.).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
