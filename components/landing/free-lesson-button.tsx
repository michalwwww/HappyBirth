'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN, lessons } from '@/lib/course-data';

/**
 * Darmowa lekcja w oknie dialogowym. Odtwarzacz (iframe Cloudflare Stream)
 * ładuje się dopiero po kliknięciu: szybszy start strony i żadnych zapytań
 * do zewnętrznego serwera przed decyzją użytkowniczki.
 */
export function FreeLessonButton({
  label,
  className = 'btn btn-ghost',
  lessonId,
  compact = false,
}: {
  label: string;
  className?: string;
  /** Domyślnie pierwsza darmowa lekcja */
  lessonId?: string;
  /** Mniejsza ikona odtwarzania (lista lekcji) */
  compact?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const lesson =
    (lessonId ? lessons.find((l) => l.id === lessonId && l.isFreePreview) : undefined) ||
    lessons.find((l) => l.isFreePreview) ||
    lessons[0];
  const src = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${lesson.cloudflareUid}/iframe?preload=metadata&autoplay=true&poster=${encodeURIComponent(
    lesson.thumbnailUrl
  )}`;

  const show = useCallback(() => {
    setOpen(true);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    const d = dialogRef.current;
    if (d && d.open) d.close();
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setOpen(false);
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button type="button" onClick={show} className={className}>
        <span
          className={`inline-flex rounded-full bg-ink text-paper items-center justify-center shrink-0 ${
            compact ? 'w-6 h-6' : 'w-7 h-7'
          }`}
        >
          <Play className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-current`} />
        </span>
        <span>{label}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-ink/70 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto w-[min(96vw,1040px)] max-w-none open:flex flex-col"
        onClick={(e) => {
          if (e.target === dialogRef.current) hide();
        }}
        aria-label={`Darmowa lekcja: ${lesson.title}`}
      >
        <div className="card overflow-hidden bg-ink border-ink text-paper">
          <div className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-paper/70">
                Lekcja {lesson.lessonNumber} · za darmo
              </div>
              <div className="font-display text-[18px] leading-snug truncate">{lesson.title}</div>
            </div>
            <button
              type="button"
              onClick={hide}
              className="w-10 h-10 rounded-full bg-paper/10 hover:bg-paper/20 flex items-center justify-center shrink-0 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="aspect-video bg-black">
            {open ? (
              <iframe
                src={src}
                className="w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={lesson.title}
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
