'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';
import { useCourseProgress } from '@/lib/progress';
import { BuyCourseButton } from '@/components/buy-button';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';
  const { role } = useCourseProgress();
  const [hasServerAccess, setHasServerAccess] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(!lesson.isFreePreview);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  // Czy film ma wystartować automatycznie
  const shouldAutoplay = searchParams?.get('autoplay') === 'true';

  useEffect(() => {
    if (lesson.isFreePreview || role === 'student' || role === 'partner') {
      setLoadingAccess(false);
      return;
    }

    const sessionId = searchParams?.get('session_id');
    if (sessionId) {
      fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setHasServerAccess(true);
            setLoadingAccess(false);
            window.dispatchEvent(new Event('hb_progress_updated'));
          }
        })
        .catch(() => {})
        .finally(() => setLoadingAccess(false));
      return;
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (
          data.authenticated &&
          (data.user?.hasActiveCourse ||
            data.user?.role === 'student' ||
            data.user?.role === 'partner')
        ) {
          setHasServerAccess(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAccess(false));
  }, [lesson.isFreePreview, role, searchParams]);

  // Lekcja odblokowana jeśli:
  // 1. Jest to bezpłatna lekcja 1 (isFreePreview)
  // 2. Użytkownik ma aktywny zakup na serwerze Cloudflare D1 (hasServerAccess)
  // 3. Użytkownik ma rolę 'student' lub 'partner'
  const isUnlocked =
    lesson.isFreePreview || hasServerAccess || role === 'student' || role === 'partner';

  // Dołącz skrypt Cloudflare Stream SDK do nasłuchiwania zdarzeń odtwarzacza
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scriptId = 'cloudflare-stream-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Nasłuchiwanie zakończenia filmu ('ended')
  useEffect(() => {
    if (!isUnlocked || !lesson.cloudflareUid) return;

    let player: any = null;
    let isCancelled = false;

    const handleVideoEnded = () => {
      if (!isCompleted) {
        onToggleComplete();
      }
      if (nextLesson) {
        setAutoNextCountdown(3);
      }
    };

    const attachStreamListener = () => {
      if (isCancelled) return;
      const streamGlobal = (window as any).Stream;
      if (typeof streamGlobal === 'function' && iframeRef.current) {
        try {
          player = streamGlobal(iframeRef.current);
          player.addEventListener('ended', handleVideoEnded);
        } catch {
          // Błąd inicjalizacji ignorowany
        }
      }
    };

    const interval = setInterval(() => {
      if ((window as any).Stream && iframeRef.current) {
        attachStreamListener();
        clearInterval(interval);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      if (player && typeof player.removeEventListener === 'function') {
        try {
          player.removeEventListener('ended', handleVideoEnded);
        } catch {}
      }
    };
  }, [lesson.id, lesson.cloudflareUid, isUnlocked, isCompleted, nextLesson, onToggleComplete]);

  // Odliczanie do automatycznego przejścia do kolejnej lekcji
  useEffect(() => {
    if (autoNextCountdown === null) return;

    if (autoNextCountdown <= 0) {
      if (nextLesson) {
        router.push(`${prefix}/lekcja/${nextLesson.id}?autoplay=true`);
      }
      setAutoNextCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setAutoNextCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextCountdown, nextLesson, prefix, router]);

  // Budowa URL do iframe Cloudflare Stream z uwzględnieniem autoplay
  const streamParams = new URLSearchParams({
    poster: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${lesson.cloudflareUid}/thumbnails/thumbnail.jpg`,
    preload: shouldAutoplay ? 'auto' : 'metadata',
  });

  if (shouldAutoplay) {
    streamParams.set('autoplay', 'true');
  }

  const streamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${lesson.cloudflareUid}/iframe?${streamParams.toString()}`;

  return (
    <div className="w-full bg-[#20071F] rounded-[18px] overflow-hidden shadow-2xl border border-[#461643] text-white">
      {/* Top Video Header Bar */}
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
        {loadingAccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <div className="w-10 h-10 border-4 border-[#EC008C]/30 border-t-[#EC008C] rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#EAD5E5]/80">Weryfikacja dostępu do lekcji...</p>
          </div>
        ) : isUnlocked ? (
          lesson.cloudflareUid ? (
            <>
              <iframe
                key={`${lesson.id}-${shouldAutoplay}`}
                ref={iframeRef}
                src={streamUrl}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={lesson.title}
              />

              {/* Overlay odliczania do kolejnej lekcji po zakończeniu filmu */}
              {autoNextCountdown !== null && nextLesson && (
                <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-14 h-14 rounded-full bg-[#EC008C]/20 border border-[#EC008C] flex items-center justify-center mb-3 text-2xl font-bold font-mono text-[#EC008C] animate-pulse">
                    {autoNextCountdown}
                  </div>
                  <h4 className="font-brand-display text-lg sm:text-xl font-bold">
                    Lekcja {lesson.lessonNumber} ukończona!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#EAD5E5]/80 mt-1 max-w-sm leading-relaxed">
                    Za chwilę automatycznie włączy się kolejna lekcja: <br />
                    <strong className="text-white font-semibold">
                      Lekcja {nextLesson.lessonNumber}: {nextLesson.title}
                    </strong>
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => router.push(`${prefix}/lekcja/${nextLesson.id}?autoplay=true`)}
                      className="px-5 py-2 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-bold transition-all shadow-md shadow-[#EC008C]/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Odtwórz teraz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setAutoNextCountdown(null)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#EAD5E5] text-xs font-medium border border-white/20 transition-colors cursor-pointer"
                    >
                      Zostań tutaj
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <PlayCircle className="w-12 h-12 text-[#EC008C] mb-3 animate-pulse" />
              <p className="text-sm font-medium text-[#EAD5E5]">Ładowanie lekcji wideo HappyBirth...</p>
            </div>
          )
        ) : (
          /* EKRAN BLOKADY / PAYWALL DLA PŁATNYCH LEKCJI */
          <div className="absolute inset-0 bg-gradient-to-b from-[#20071F]/95 via-[#180517]/95 to-black/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
            <div className="max-w-lg space-y-4">
              {/* Ikona kłódki */}
              <div className="w-16 h-16 rounded-3xl bg-[#EC008C]/20 border border-[#EC008C]/40 text-[#EC008C] flex items-center justify-center mx-auto shadow-lg shadow-[#EC008C]/20">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#EC008C]">
                  Dostęp chroniony
                </span>
                <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
                  Ta lekcja jest dostępna w pełnym pakiecie
                </h3>
                <p className="text-xs sm:text-sm text-[#EAD5E5]/80 max-w-md mx-auto leading-relaxed">
                  Lekcja {lesson.lessonNumber}: <strong>„{lesson.title}”</strong> oraz pozostałe 51 filmów VOD, apteczka i plan porodu są dostępne po wykupieniu dostępu do Szkoły Rodzenia HappyBirth.
                </p>
              </div>

              {/* Przycisk zakupu przez Stripe */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <BuyCourseButton className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-bold text-sm transition-all shadow-xl shadow-[#EC008C]/30 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Kup dostęp · 349 zł (BLIK / Karta)</span>
                  <ArrowRight className="w-4 h-4" />
                </BuyCourseButton>

                <Link
                  href="/strefa/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                >
                  Masz już konto? Zaloguj się
                </Link>
              </div>

              {/* Link do darmowej lekcji 1 */}
              <div className="pt-2">
                <Link
                  href={`${prefix}/lekcja/lekcja-01`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#FCD705] hover:underline font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Możesz bezpłatnie obejrzeć Lekcję 1 bez logowania &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Control Bar & Progress Action */}
      <div className="p-4 sm:p-5 bg-[#250A24] flex flex-wrap items-center justify-between gap-4 border-t border-[#461643]">
        <div className="flex items-center space-x-3">
          {isUnlocked ? (
            <button
              onClick={onToggleComplete}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 hover:bg-emerald-900/80'
                  : 'bg-[#3A1238] text-[#EAD5E5] hover:bg-[#EC008C] hover:text-white border border-[#461643]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span>{isCompleted ? 'Lekcja ukończona ✓' : 'Oznacz jako ukończoną'}</span>
            </button>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 text-stone-400 border border-stone-800 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-[#EC008C]" />
              <span>Wymagany pełny dostęp</span>
            </div>
          )}

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
              href={`${prefix}/lekcja/${prevLesson.id}?autoplay=true`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#351034] hover:bg-[#461643] text-[#EAD5E5] text-xs font-medium transition-colors border border-[#461643]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Poprzednia lekcja</span>
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={`${prefix}/lekcja/${nextLesson.id}?autoplay=true`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-sm shadow-[#EC008C]/25 group"
            >
              <span className="hidden sm:inline">Następna lekcja</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
