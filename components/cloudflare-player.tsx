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
  Clock,
} from 'lucide-react';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';
import { useCourseProgress } from '@/lib/progress';
import { useI18n } from '@/lib/i18n';
import { BuyCourseButton } from '@/components/buy-button';
import { is100PercentPromo, activateStudentAccessLocally, isCourseUnlockedLocally } from '@/lib/promo';

interface CloudflarePlayerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  prevLesson?: Lesson;
  nextLesson?: Lesson;
  autoplay?: boolean;
  onSelectLesson?: (lesson: Lesson) => void;
}

export function CloudflarePlayer({
  lesson,
  isCompleted,
  onToggleComplete,
  prevLesson,
  nextLesson,
  autoplay,
  onSelectLesson,
}: CloudflarePlayerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';
  const { role, changeRole } = useCourseProgress();
  const { lang } = useI18n();
  const [hasServerAccess, setHasServerAccess] = useState(Boolean(lesson.isFreePreview));
  const [loadingAccess, setLoadingAccess] = useState(!lesson.isFreePreview);
  const [playerPromoInput, setPlayerPromoInput] = useState('');
  const [playerPromoError, setPlayerPromoError] = useState<string | null>(null);
  const [showPlayerPromo, setShowPlayerPromo] = useState(false);

  // [C2] Auto-Resume state & Signed Token
  const [savedPositionSeconds, setSavedPositionSeconds] = useState<number>(0);
  const [signedTokenOrUid, setSignedTokenOrUid] = useState<string>(
    lesson.isFreePreview ? lesson.cloudflareUid || '' : ''
  );
  const lastSavedSecRef = useRef<number>(0);

  const isLocalDevHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

  // Odblokowanie czysto lokalne (localStorage) działa wyłącznie w środowisku developerskim (localhost),
  // natomiast na domenach produkcyjnych dostęp do płatnych lekcji zawsze weryfikuje serwer (/api/auth/me).
  const isUnlockedLocally =
    isLocalDevHost &&
    (localStorage.getItem('hb_unlocked') === 'true' ||
      localStorage.getItem('hb_current_role') === 'student' ||
      localStorage.getItem('hb_current_role') === 'partner' ||
      isCourseUnlockedLocally());

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  // Czy film ma wystartować automatycznie
  const shouldAutoplay = autoplay ?? (searchParams?.get('autoplay') === 'true');

  // Wczytaj zapisaną sekundę odtwarzania z localStorage oraz serwera ([C2] Auto-Resume)
  useEffect(() => {
    setSignedTokenOrUid(lesson.isFreePreview ? lesson.cloudflareUid || '' : '');
    if (typeof window === 'undefined') return;
    const localPos = parseInt(localStorage.getItem(`hb_pos_${lesson.id}`) || '0', 10);
    if (localPos > 5) {
      setSavedPositionSeconds(localPos);
      lastSavedSecRef.current = localPos;
    } else {
      setSavedPositionSeconds(0);
      lastSavedSecRef.current = 0;
    }

    fetch('/api/progress')
      .then((r) => r.json())
      .then((data) => {
        const srvPos = data?.lessonPositions?.[lesson.id];
        if (typeof srvPos === 'number' && srvPos > Math.max(5, localPos)) {
          setSavedPositionSeconds(srvPos);
          lastSavedSecRef.current = srvPos;
          localStorage.setItem(`hb_pos_${lesson.id}`, String(srvPos));
        }
      })
      .catch(() => {});
  }, [lesson.id, lesson.cloudflareUid, lesson.isFreePreview]);

  useEffect(() => {
    if (lesson.isFreePreview) {
      setHasServerAccess(true);
      setLoadingAccess(false);
      return;
    }

    if (isLocalDevHost && (role === 'student' || role === 'partner' || isUnlockedLocally)) {
      setHasServerAccess(true);
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
            data.user?.role === 'admin' ||
            data.user?.role === 'student' ||
            data.user?.role === 'partner')
        ) {
          setHasServerAccess(true);
        } else {
          setHasServerAccess(false);
          if (!isLocalDevHost) {
            try {
              localStorage.removeItem('hb_unlocked');
            } catch {}
          }
        }
      })
      .catch(() => {
        setHasServerAccess(false);
      })
      .finally(() => setLoadingAccess(false));
  }, [lesson.isFreePreview, isLocalDevHost, role, searchParams, isUnlockedLocally]);

  const isUnlocked = Boolean(
    lesson.isFreePreview ||
      hasServerAccess ||
      (isLocalDevHost && (role === 'student' || role === 'partner' || isUnlockedLocally))
  );

  // [C2] Pobierz 120-minutowy Signed Token URL oraz zarejestruj first_content_accessed_at ([E1])
  useEffect(() => {
    if (!isUnlocked || !lesson.cloudflareUid) return;

    let cancelled = false;
    setSignedTokenOrUid(lesson.isFreePreview ? lesson.cloudflareUid : '');

    fetch('/api/stream/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lesson.id,
        videoUid: lesson.cloudflareUid,
        isFreePreview: Boolean(lesson.isFreePreview),
        lang,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data?.token) {
          setSignedTokenOrUid(data.token);
        } else if (!lesson.isFreePreview && !isLocalDevHost && (res.status === 401 || res.status === 403)) {
          setHasServerAccess(false);
          setSignedTokenOrUid('');
        } else if (isLocalDevHost && lesson.cloudflareUid) {
          setSignedTokenOrUid(lesson.cloudflareUid);
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (isLocalDevHost && lesson.cloudflareUid) {
          setSignedTokenOrUid(lesson.cloudflareUid);
        }
      });

    // Zapisz znacznik pierwszego dostępu do treści cyfrowej (Art. 38 ust. 1 pkt 13 u.p.k.)
    if (!lesson.isFreePreview) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'access', lessonId: lesson.id }),
      }).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [isUnlocked, lesson.id, lesson.cloudflareUid, lesson.isFreePreview, lang]);

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

  // Nasłuchiwanie zakończenia filmu ('ended') oraz Auto-Resume co 15 sekund ('timeupdate')
  useEffect(() => {
    if (!isUnlocked || !lesson.cloudflareUid) return;

    let player: any = null;
    let isCancelled = false;

    const saveCurrentPosition = (sec: number) => {
      const rounded = Math.floor(sec);
      if (rounded <= 0) return;
      if (Math.abs(rounded - lastSavedSecRef.current) < 15) return;
      lastSavedSecRef.current = rounded;
      try {
        localStorage.setItem(`hb_pos_${lesson.id}`, String(rounded));
      } catch {}
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'position',
          lessonId: lesson.id,
          lastPositionSeconds: rounded,
        }),
      }).catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (player && typeof player.currentTime === 'number') {
        saveCurrentPosition(player.currentTime);
      }
    };

    const handleVideoEnded = () => {
      try {
        localStorage.removeItem(`hb_pos_${lesson.id}`);
      } catch {}
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
          player.addEventListener('timeupdate', handleTimeUpdate);
          if (savedPositionSeconds > 5) {
            try {
              player.currentTime = savedPositionSeconds;
            } catch {}
          }
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
          player.removeEventListener('timeupdate', handleTimeUpdate);
        } catch {}
      }
    };
  }, [lesson.id, lesson.cloudflareUid, isUnlocked, isCompleted, nextLesson, onToggleComplete, savedPositionSeconds]);

  // Odliczanie do automatycznego przejścia do kolejnej lekcji
  useEffect(() => {
    if (autoNextCountdown === null) return;

    if (autoNextCountdown <= 0) {
      if (nextLesson) {
        if (onSelectLesson) {
          onSelectLesson(nextLesson);
        } else {
          router.push(`${prefix}/lekcja/${nextLesson.id}?autoplay=true`);
        }
      }
      setAutoNextCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setAutoNextCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextCountdown, nextLesson, prefix, router, onSelectLesson]);

  const activeStreamUid = lesson.isFreePreview
    ? signedTokenOrUid || lesson.cloudflareUid
    : signedTokenOrUid;

  // Budowa URL do iframe Cloudflare Stream z uwzględnieniem autoplay i Auto-Resume (startTime)
  const streamParams = new URLSearchParams({
    poster: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${activeStreamUid || lesson.cloudflareUid}/thumbnails/thumbnail.jpg`,
    preload: shouldAutoplay ? 'auto' : 'metadata',
  });

  if (shouldAutoplay) {
    streamParams.set('autoplay', 'true');
  }
  if (savedPositionSeconds > 5) {
    streamParams.set('startTime', `${savedPositionSeconds}s`);
  }
  if (lang && lang !== 'pl') {
    streamParams.set('defaultTextTrack', lang);
  }

  const streamUrl = activeStreamUid
    ? `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${activeStreamUid}/iframe?${streamParams.toString()}`
    : '';

  const formatMmSs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[color:var(--hb-noc2)] rounded-[18px] overflow-hidden shadow-2xl border border-[color:var(--hb-ink2)] text-white">
      {/* Top Video Header Bar */}
      <div className="px-5 py-3 bg-[color:var(--hb-noc2)] border-b border-[color:var(--hb-ink2)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: lesson.stageColor }}
          />
          <span className="font-semibold text-[#E8DEF0] uppercase tracking-wider">
            Lekcja {lesson.lessonNumber} · {lesson.stageTitle}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[#E8DEF0]/70">
          {savedPositionSeconds > 5 && (
            <span className="inline-flex items-center gap-1 text-[color:var(--hb-zol)] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Auto-Resume: {formatMmSs(savedPositionSeconds)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)]" /> Jakość 4K · HappyBirth VOD
          </span>
          <span>·</span>
          <span>Czas trwania: {lesson.durationFormatted} min</span>
        </div>
      </div>

      {/* Video Container (16:9 responsive) */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {loadingAccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <div className="w-10 h-10 border-4 border-[color:color-mix(in_srgb,var(--hb-mag)_30%,transparent)] border-t-[color:var(--hb-mag)] rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#E8DEF0]/80">Weryfikacja dostępu do lekcji...</p>
          </div>
        ) : isUnlocked ? (
          lesson.cloudflareUid && activeStreamUid ? (
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
                  <div className="w-14 h-14 rounded-full bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] border border-[color:var(--hb-mag)] flex items-center justify-center mb-3 text-2xl font-bold font-mono text-[color:var(--hb-mag-t)] animate-pulse">
                    {autoNextCountdown}
                  </div>
                  <h4 className="font-brand-display text-lg sm:text-xl font-bold">
                    Lekcja {lesson.lessonNumber} ukończona!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E8DEF0]/80 mt-1 max-w-sm leading-relaxed">
                    Za chwilę automatycznie włączy się kolejna lekcja: <br />
                    <strong className="text-white font-semibold">
                      Lekcja {nextLesson.lessonNumber}: {nextLesson.title}
                    </strong>
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => router.push(`${prefix}/lekcja/${nextLesson.id}?autoplay=true`)}
                      className="px-5 py-2 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs font-bold transition-all shadow-md shadow-[color:color-mix(in_srgb,var(--hb-mag)_30%,transparent)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Odtwórz teraz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setAutoNextCountdown(null)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#E8DEF0] text-xs font-medium border border-white/20 transition-colors cursor-pointer"
                    >
                      Zostań tutaj
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <PlayCircle className="w-12 h-12 text-[color:var(--hb-mag-t)] mb-3 animate-pulse" />
              <p className="text-sm font-medium text-[#E8DEF0]">Ładowanie lekcji wideo HappyBirth...</p>
            </div>
          )
        ) : (
          /* EKRAN BLOKADY / PAYWALL DLA PŁATNYCH LEKCJI */
          <div className="absolute inset-0 bg-gradient-to-b from-[color:color-mix(in_srgb,var(--hb-noc2)_95%,transparent)] via-[color:color-mix(in_srgb,var(--hb-noc3)_95%,transparent)] to-black/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
            <div className="max-w-lg space-y-4">
              {/* Ikona kłódki */}
              <div className="w-16 h-16 rounded-3xl bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] border border-[color:color-mix(in_srgb,var(--hb-mag)_40%,transparent)] text-[color:var(--hb-mag-t)] flex items-center justify-center mx-auto shadow-lg shadow-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)]">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--hb-mag-t)]">
                  Dostęp chroniony
                </span>
                <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
                  Ta lekcja jest dostępna w pełnym pakiecie
                </h3>
                <p className="text-xs sm:text-sm text-[#E8DEF0]/80 max-w-md mx-auto leading-relaxed">
                  Lekcja {lesson.lessonNumber}: <strong>„{lesson.title}”</strong> oraz pozostałe 51 filmów VOD, apteczka i plan porodu są dostępne przez 18 miesięcy (548 dni) od zakupu w Szkole Rodzenia HappyBirth.
                </p>
              </div>

              {/* Przycisk zakupu przez Stripe */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <BuyCourseButton className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] font-bold text-sm transition-all shadow-xl shadow-[color:color-mix(in_srgb,var(--hb-mag)_30%,transparent)] hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Kup dostęp · 489,00 zł (BLIK / Karta)</span>
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
              <div className="pt-1">
                <Link
                  href={`${prefix}/lekcja/lekcja-01`}
                  className="inline-flex items-center gap-1.5 text-xs text-[color:var(--hb-zol)] hover:underline font-medium"
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
      <div className="p-4 sm:p-5 bg-[color:var(--hb-noc2)] flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--hb-ink2)]">
        <div className="flex items-center space-x-3">
          {isUnlocked ? (
            <button
              onClick={onToggleComplete}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 hover:bg-emerald-900/80'
                  : 'bg-[color:var(--hb-noc)] text-[#E8DEF0] hover:bg-[color:var(--hb-mag)] hover:text-[color:var(--hb-cta-ink)] border border-[color:var(--hb-ink2)]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span>{isCompleted ? 'Lekcja ukończona ✓' : 'Oznacz jako ukończoną'}</span>
            </button>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 text-stone-400 border border-stone-800 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)]" />
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
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[color:var(--hb-noc)] hover:bg-[color:var(--hb-noc2)] text-[#E8DEF0] text-xs font-medium transition-colors border border-[color:var(--hb-ink2)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Poprzednia lekcja</span>
            </Link>
          ) : null}

          {nextLesson ? (
            <Link
              href={`${prefix}/lekcja/${nextLesson.id}?autoplay=true`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs font-semibold transition-all shadow-sm shadow-[color:color-mix(in_srgb,var(--hb-mag)_25%,transparent)] group"
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
