'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  stages,
  lessons,
  getLessonsByStage,
  getStageDisplayTitle,
  getStageShortBadge,
  getStageFullDescription,
} from '@/lib/course-data';
import { useCourseProgress } from '@/lib/progress';
import { StageIcon } from '@/components/stage-icons';
import {
  PregnancyProfile,
  getSavedPregnancyProfile,
  savePregnancyProfile,
  calculatePregnancyState,
} from '@/lib/pregnancy';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { CloudflarePlayer } from '@/components/cloudflare-player';
import { StudentReferralBox } from '@/components/student-referral-box';
import { FinalQuizAndCertificate } from '@/components/final-quiz-certificate';
import { openPrintableLessonWorksheet } from '@/lib/printable-worksheets';
import {
  activateStudentAccessLocally,
  is100PercentPromo,
  detectClientOrderBumpEdition,
  isOrderBumpUnlockedLocally,
} from '@/lib/promo';
import { Lesson, Stage } from '@/lib/types';
import {
  Play,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  Download,
  BookOpen,
  Calendar,
  FileText,
  User,
  Heart,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

function StrefaDashboardContent() {
  const { role, changeRole, completedLessons, percentCompleted, toggleLessonCompletion } = useCourseProgress();
  const [pregnancyProfile, setPregnancyProfile] = useState<PregnancyProfile | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    email?: string;
    fullName?: string;
    orderNumber?: string | null;
    orderBumpIncluded?: boolean;
    expiresAt?: string;
    daysRemaining?: number;
    referralCode?: string;
  } | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasOrderBump, setHasOrderBump] = useState<boolean>(false);
  const [buyingOrderBump, setBuyingOrderBump] = useState<boolean>(false);
  const [smartOrderBump, setSmartOrderBump] = useState(() =>
    detectClientOrderBumpEdition({ countryCode: 'PL', uiLang: 'pl' })
  );

  const handleBuyStandaloneOrderBump = async () => {
    try {
      setBuyingOrderBump(true);
      try {
        localStorage.setItem('hb_order_bump_unlocked', 'true');
      } catch (_) {}
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onlyOrderBump: true,
          includeOrderBump: true,
          orderBumpEdition: smartOrderBump.editionKey,
          email: accountInfo?.email || undefined,
          termsAccepted: true,
          waiverArt38Accepted: true,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = '/#cena';
    } catch {
      window.location.href = '/#cena';
    } finally {
      setBuyingOrderBump(false);
    }
  };

  // Referencja do odtwarzacza wideo (do centrowania ekranu po płatności)
  const playerSectionRef = useRef<HTMLElement>(null);

  // Aktywna lekcja w kinie domowym na kokpicie
  const [activeLessonId, setActiveLessonId] = useState<string>('lekcja-01');
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  useEffect(() => {
    const localProfile = getSavedPregnancyProfile();
    setPregnancyProfile(localProfile);

    if (typeof window !== 'undefined') {
      const savedOverride = localStorage.getItem('hb_order_bump_edition_override');
      const detected = detectClientOrderBumpEdition({
        manualEditionOverride: savedOverride,
      });
      setSmartOrderBump(detected);
      if (isOrderBumpUnlockedLocally()) {
        setHasOrderBump(true);
      }
    }

    // Pobierz dane konta i profil ciąży z Cloudflare D1 (/api/auth/me)
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setAccountInfo({
            email: data.user.email,
            fullName: data.user.fullName,
            orderNumber: data.user.orderNumber,
            orderBumpIncluded: Boolean(data.user.orderBumpIncluded),
            expiresAt: data.user.expiresAt,
            daysRemaining: data.user.daysRemaining,
            referralCode: data.user.referralCode,
          });
          if (data.user.orderBumpIncluded) {
            setHasOrderBump(true);
            try {
              localStorage.setItem('hb_order_bump_unlocked', 'true');
            } catch (_) {}
          }
          if (data.user.pregnancy?.dueDate && !localProfile?.dueDate) {
            setPregnancyProfile(data.user.pregnancy);
            savePregnancyProfile(data.user.pregnancy);
          }
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const payment = params.get('payment');
      const promo = params.get('promo');
      // Lekcja wybrana przyciskiem Odtwórz na stronie Program przed zakupem
      // (components/site/program-explorer.tsx). Działa tylko po płatności i tylko wtedy, gdy adres nie podaje lekcji.
      let lekcjaPoZakupie: string | null = null;
      if (!params.get('lesson') && (sessionId || payment === 'success')) {
        try { lekcjaPoZakupie = sessionStorage.getItem('hb_lekcja_po_zakupie'); } catch { /* brak pamięci sesji */ }
      }
      const lessonParam = params.get('lesson') || lekcjaPoZakupie;
      const autoplayParam = params.get('autoplay');

      const isPromoOrSuccess =
        (sessionId && (sessionId.startsWith('promo_') || sessionId.startsWith('demo_') || sessionId.toLowerCase().includes('test') || sessionId.toLowerCase().includes('promo'))) ||
        payment === 'success' ||
        Boolean(promo) ||
        is100PercentPromo(promo);

      // Natychmiastowe odblokowanie dostępu lokalnie
      if (isPromoOrSuccess) {
        activateStudentAccessLocally(promo || 'TEST100');
        changeRole('student');
        setPaymentSuccess(true);
      }

      if (sessionId) {
        fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const bumpUnlocked = Boolean(data.orderBumpIncluded || data.user?.orderBumpIncluded);
              activateStudentAccessLocally(promo || 'TEST100', bumpUnlocked);
              if (bumpUnlocked) setHasOrderBump(true);
              changeRole('student');
              setPaymentSuccess(true);
              window.dispatchEvent(new Event('hb_progress_updated'));
            }
          })
          .catch((err) => console.error('Błąd weryfikacji płatności:', err));
      } else if (payment === 'success') {
        activateStudentAccessLocally(promo || 'TEST100');
        changeRole('student');
        setPaymentSuccess(true);
        window.dispatchEvent(new Event('hb_progress_updated'));
      }

      // Ustaw aktywną lekcję z parametru lub pierwszą nieukończoną
      if (lessonParam && lessons.some((l) => l.id === lessonParam)) {
        setActiveLessonId(lessonParam);
      } else {
        const nextUncompleted = lessons.find((l) => !completedLessons.includes(l.id));
        if (nextUncompleted) {
          setActiveLessonId(nextUncompleted.id);
        }
      }

      // Autoplay po płatności lub parametrze
      if (isPromoOrSuccess || autoplayParam === 'true') {
        setShouldAutoplay(true);
      }

      // Automatyczne płynne wycentrowanie ekranu na filmie po zapłaceniu / zniżce
      if (isPromoOrSuccess || payment === 'success' || sessionId) {
        const timer = setTimeout(() => {
          if (playerSectionRef.current) {
            playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [completedLessons]);

  // Wyznacz dane aktywnej lekcji i lekcji sąsiednich dla odtwarzacza
  const activeLessonIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson: Lesson = activeLessonIndex >= 0 ? lessons[activeLessonIndex] : lessons[0];
  const prevLesson = activeLessonIndex > 0 ? lessons[activeLessonIndex - 1] : undefined;
  const nextLesson = activeLessonIndex < lessons.length - 1 ? lessons[activeLessonIndex + 1] : undefined;
  const activeStage = stages.find((s) => s.id === activeLesson.stageId);
  const activeStageLessons = lessons.filter((l) => l.stageId === activeLesson.stageId);

  // Szacowany pozostały czas kursu
  const remainingMinutes = Math.round(
    lessons
      .filter((l) => !completedLessons.includes(l.id))
      .reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
  );
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  const handleSelectLesson = (lesson: Lesson, scrollToVideo = false) => {
    setActiveLessonId(lesson.id);
    setShouldAutoplay(true);
    if (scrollToVideo && playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectStage = (stage: Stage) => {
    const stageLessons = lessons.filter((l) => l.stageId === stage.id);
    const uncompletedInStage = stageLessons.find((l) => !completedLessons.includes(l.id));
    const target = uncompletedInStage || stageLessons[0];
    if (target) {
      handleSelectLesson(target, true);
    }
  };

  const pregnancyState = pregnancyProfile?.dueDate
    ? calculatePregnancyState(pregnancyProfile.dueDate)
    : null;

  const formattedExpiresDate = accountInfo?.expiresAt
    ? new Date(accountInfo.expiresAt).toLocaleDateString('pl-PL')
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. BANER STATUSU DOSTĘPU 18 MIESIĘCY (548 DNI) DLA DWOJGA ([C1]) */}
      <div className="rounded-2xl bg-gradient-to-r from-[color:var(--hb-noc2)] via-[color:var(--hb-noc2)] to-[color:var(--hb-noc3)] border border-[color:color-mix(in_srgb,var(--hb-mag)_50%,transparent)] p-4 sm:p-5 text-[color:var(--hb-cta-ink)] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] border border-[color:color-mix(in_srgb,var(--hb-mag)_40%,transparent)] text-[#FF9CC6] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#FF9CC6] uppercase tracking-wide flex flex-wrap items-center gap-1.5">
              <span>Aktywny Pakiet · Dostęp ważny przez 18 miesięcy (548 dni) od zakupu</span>
              {accountInfo?.email && (
                <span className="text-white/80 font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                  {accountInfo.email}
                </span>
              )}
              {accountInfo?.orderNumber && (
                <span className="text-emerald-300 font-mono text-[11px] bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  Zamówienie: {accountInfo.orderNumber}
                </span>
              )}
            </div>
            <h3 className="font-brand-display font-bold text-base sm:text-lg text-white">
              {accountInfo?.fullName ? `Witaj, ${accountInfo.fullName}! ` : ''}Pełny dostęp dla dwojga: 52 lekcje w jakości 4K, Notatnik Rodzica PDF oraz Strefa Taty.
            </h3>
          </div>
        </div>
        <span className="inline-block self-start sm:self-auto text-xs bg-emerald-500/20 text-emerald-200 px-3.5 py-1.5 rounded-full border border-emerald-500/40 font-semibold whitespace-nowrap">
          {formattedExpiresDate
            ? `Ważny do ${formattedExpiresDate} (${accountInfo?.daysRemaining ?? 548} dni)`
            : 'Dostęp aktywny (548 dni)'}
        </span>
      </div>

      {/* 2. GŁÓWNY PLAYER NA SAMEJ GÓRZE (Kino Domowe & Playlista) */}
      <section
        ref={playerSectionRef}
        id="odtwarzacz"
        className="space-y-3.5 scroll-mt-20 pt-1"
      >
        {/* Nagłówek sekcji odtwarzacza z czytelnym modułem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--hb-mag)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
              Odtwarzacz Kursu · 4K Master VOD
            </span>
            <span className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">·</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] text-[color:var(--hb-mag-t)] dark:bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] dark:text-[color:var(--hb-mag-t)]">
              {getStageDisplayTitle(activeStage)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
            <span>
              Lekcja <strong>{activeLesson.lessonNumber} z 52</strong> ({activeLesson.durationFormatted})
            </span>
            <Link
              href={`/strefa/lekcja/${activeLesson.id}`}
              className="font-semibold text-[color:var(--hb-mag-t)] hover:underline flex items-center gap-1"
              title="Otwórz lekcję w trybie pełnoekranowym"
            >
              <span>Pełny ekran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEWA KOLUMNA: WŁAŚCIWY ODTWARZACZ (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[color:var(--hb-ink2)] dark:border-[color:var(--hb-linia)] bg-[color:var(--hb-noc2)]">
              <CloudflarePlayer
                lesson={activeLesson}
                isCompleted={completedLessons.includes(activeLesson.id)}
                onToggleComplete={() => toggleLessonCompletion(activeLesson.id)}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                autoplay={shouldAutoplay}
                onSelectLesson={(l) => handleSelectLesson(l)}
              />
            </div>

            {/* Karta szczegółów aktualnie odtwarzanej lekcji */}
            <div className="bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] rounded-3xl p-5 sm:p-6 border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full shadow-xs"
                    style={{ backgroundColor: activeStage?.tint || '#F9E6EC', color: activeStage?.deep || '#C00265' }}
                  >
                    Moduł {parseInt(activeStage?.num || '1', 10)}: {getStageDisplayTitle(activeStage)}
                  </span>
                  <span className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                    Lekcja {activeLesson.lessonNumber} z 52 · {activeLesson.durationFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLessonCompletion(activeLesson.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] hover:text-[color:var(--hb-mag-t)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${completedLessons.includes(activeLesson.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-[color:var(--hb-ink3)]'}`} />
                    <span>
                      {completedLessons.includes(activeLesson.id) ? 'Ukończona ✓' : 'Oznacz jako ukończoną'}
                    </span>
                  </button>

                  {nextLesson && (
                    <button
                      onClick={() => handleSelectLesson(nextLesson)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Następna</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h1 className="font-brand-display font-semibold text-xl sm:text-2xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                  {activeLesson.title}
                </h1>
                <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-1.5 leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>

              {/* Materiały PDF do pobrania dla tej lekcji */}
              {activeLesson.attachments && activeLesson.attachments.length > 0 && (
                <div className="pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)]" /> Materiały do tej lekcji (PDF do druku):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2.5 rounded-xl bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-noc2)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] flex items-center justify-between gap-2.5 text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold text-[9px]">
                            PDF
                          </span>
                          <div>
                            <div className="font-semibold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] text-xs">{att.name}</div>
                            <div className="text-[10px] text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">{att.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => openPrintableLessonWorksheet(activeLesson, att.name)}
                          className="p-1 rounded-md bg-white dark:bg-[color:var(--hb-karta)] hover:bg-[color:var(--hb-mag)] hover:text-[color:var(--hb-cta-ink)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] transition-colors cursor-pointer text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]"
                          title="Otwórz i wydrukuj Kartę Pracy PDF"
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

          {/* PRAWA KOLUMNA: PLAYLISTA Z WYBOREM TEMATYCZNYM (4 cols) */}
          <div className="lg:col-span-4 bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] rounded-3xl p-4 sm:p-5 border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
                  Moduł {parseInt(activeStage?.num || '1', 10)} z 9
                </span>
                <h3 className="font-brand-display font-bold text-base text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] leading-tight">
                  {getStageDisplayTitle(activeStage)}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                {activeStageLessons.filter((l) => completedLessons.includes(l.id)).length}/{activeStageLessons.length}
              </span>
            </div>

            {/* Lista lekcji w aktywnym module */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {activeStageLessons.map((l) => {
                const isActive = l.id === activeLesson.id;
                const isDone = completedLessons.includes(l.id);

                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLesson(l)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] dark:bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] border-[color:var(--hb-mag)] shadow-xs'
                        : 'bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] hover:bg-[color:var(--hb-len)] dark:hover:bg-[color:var(--hb-noc)] border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]'
                    }`}
                  >
                    <div className="relative w-12 h-9 rounded-md overflow-hidden shrink-0 bg-black/20 flex items-center justify-center">
                      <Image
                        src={l.thumbnailUrl}
                        alt={l.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-[color:var(--hb-zol)] animate-ping" />
                        ) : (
                          <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                          Lekcja {l.lessonNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                            {l.durationFormatted}
                          </span>
                          {isDone && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </div>
                      </div>

                      <h4
                        className={`text-xs font-semibold line-clamp-2 leading-snug ${
                          isActive
                            ? 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)] font-bold'
                            : 'text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]'
                        }`}
                      >
                        {l.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Szybki wybór modułów tematycznych (bez tajemniczego "etap etap") */}
            <div className="pt-2.5 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] space-y-2">
              <span className="text-[11px] font-semibold text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] block">
                Zmień moduł tematyczny:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {stages.map((st) => {
                  const isCurrent = st.id === activeLesson.stageId;
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleSelectStage(st)}
                      className={`text-[10px] py-1.5 px-1 rounded-lg font-semibold transition-all truncate text-center cursor-pointer ${
                        isCurrent
                          ? 'bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] shadow-xs'
                          : 'bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] hover:bg-[color:var(--hb-linia)] dark:hover:bg-[color:var(--hb-linia)] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]'
                      }`}
                      title={getStageDisplayTitle(st)}
                    >
                      {getStageShortBadge(st)}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <Link
                  href="/strefa/lekcje"
                  className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[color:var(--hb-mag-t)] hover:underline py-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Katalog wszystkich 52 lekcji VOD &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KOMPAKTOWY PASEK STATUSU KURSANTKI I PROFILU CIĄŻY */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[color:var(--hb-noc2)] dark:bg-[color:var(--hb-papier)] text-[color:var(--hb-zol)] flex items-center justify-center shrink-0">
              {role === 'partner' ? <User className="w-5 h-5 text-[color:var(--hb-p4g)]" /> : <Heart className="w-5 h-5 text-[color:var(--hb-mag-t)]" />}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                Profil Kursantki i Status Konta {accountInfo?.email ? `(${accountInfo.email})` : ''}
              </div>
              <div className="font-brand-display font-semibold text-sm sm:text-base text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                {role === 'partner' ? 'Strefa dla Partnera / Taty aktywna' : 'Strefa dla Mamy aktywna'} · Dostęp ważny 18 miesięcy (548 dni) dla dwojga
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span><strong>{completedLessons.length}</strong> z 52 lekcji ukończonych ({percentCompleted}%)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
              <Clock className="w-4 h-4 text-[color:var(--hb-mag-t)]" />
              <span>Pozostało: <strong>{remainingHours}h {remainingMins}min</strong></span>
            </div>

            <button
              onClick={() => setWizardOpen(true)}
              className="text-xs font-semibold text-[color:var(--hb-mag-t)] hover:underline cursor-pointer flex items-center gap-1 border-l border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] pl-3"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{pregnancyProfile?.dueDate ? 'Edytuj dane i termin porodu' : 'Ustaw termin porodu i dane'}</span>
            </button>
          </div>
        </div>

        {/* Podsumowanie zapisanych danych ciążowych kursantki i partnera */}
        {pregnancyProfile?.dueDate && pregnancyState && (
          <div className="pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] flex flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)] font-bold">
                {pregnancyState.formattedWeek} · {pregnancyState.trimesterLabel}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
                Termin porodu: <strong>{pregnancyProfile.dueDate}</strong> ({pregnancyState.daysUntilDue >= 0 ? `za ${pregnancyState.daysUntilDue} dni` : 'po terminie'})
              </span>
              {pregnancyProfile.babyName && (
                <span className="px-2.5 py-1 rounded-full bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
                  Maluszek: <strong>{pregnancyProfile.babyName}</strong>
                </span>
              )}
              {pregnancyProfile.partnerName && (
                <span className="px-2.5 py-1 rounded-full bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
                  Partner / Tata: <strong>{pregnancyProfile.partnerName}</strong>
                </span>
              )}
              {pregnancyProfile.city && (
                <span className="px-2.5 py-1 rounded-full bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
                  Szpital / Miasto: <strong>{pregnancyProfile.city}</strong>
                </span>
              )}
            </div>
            <span className="text-[11px] text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
              Wielkość maluszka: <strong>{pregnancyState.babyComparison.fruit}</strong> ({pregnancyState.babyComparison.weight})
            </span>
          </div>
        )}
      </div>

      {/* 4. SZYBKIE NARZĘDZIA SOS (3 najważniejsze kafelki dla rodziców) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
              Praktyczny Niezbędnik Porodowy
            </span>
            <h2 className="font-brand-display font-semibold text-xl sm:text-2xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
              Narzędzia SOS na każdy dzień i noc
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Porodu */}
          <Link
            href="/strefa/plan-porodu"
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[color:var(--hb-mag)] to-[color:var(--hb-noc2)] text-[color:var(--hb-cta-ink)] flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  Dokument do Szpitala
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  PDF
                </span>
              </div>
              <h3 className="font-brand-display font-semibold text-xl mt-1.5 text-white">
                Kreator Planu Porodu
              </h3>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                Zgodny ze Standardem Opieki MZ. Zaznacz preferencje, wydrukuj i weź na izbę przyjęć.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/20 mt-3 text-xs font-semibold">
              <span>Wypełnij formularz planu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Cyfrowa Apteczka */}
          <Link
            href="/strefa/apteczka"
            className="p-5 sm:p-6 rounded-2xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--hb-mag-t)]">
                Szybka Pomoc 24/7
              </span>
              <h3 className="font-brand-display font-semibold text-xl mt-1.5 text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                Cyfrowa Apteczka SOS
              </h3>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-1 leading-relaxed">
                Wpisz dolegliwość (ból pleców, zgaga, wody, nawał) i przejdź do nagrania z instrukcją.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] mt-3 text-xs font-semibold text-[color:var(--hb-mag-t)]">
              <span>Szukaj objawu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Strefa dla Taty */}
          <Link
            href="/strefa/partner"
            className="p-5 sm:p-6 rounded-2xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--hb-p4g)]">
                Wsparcie w Porodzie
              </span>
              <h3 className="font-brand-display font-semibold text-xl mt-1.5 text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                Strefa dla Taty
              </h3>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-1 leading-relaxed">
                Pigułka wiedzy dla osoby towarzyszącej: masaż krzyżowy, prawa na izbie i sala porodowa.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] mt-3 text-xs font-semibold text-[color:var(--hb-p4g)]">
              <span>Ściąga dla partnera</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. PRZEJRZYSTA ŚCIEŻKA 9 MODUŁÓW KURSU (Zamiast tajemniczego "etap etap") */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
              Pełny Program Szkoły Rodzenia
            </span>
            <h2 className="font-brand-display font-semibold text-xl sm:text-2xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] mt-0.5">
              9 Tematycznych Modułów Programu
            </h2>
            <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-0.5">
              Kliknięcie modułu ładuje go w odtwarzaczu u góry z pierwszą nieukończoną lekcją.
            </p>
          </div>

          <Link
            href="/strefa/lekcje"
            className="text-xs font-semibold text-[color:var(--hb-mag-t)] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Katalog wszystkich 52 lekcji</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const stageLessons = getLessonsByStage(stage.id);
            const stageCompleted = stageLessons.filter((l) =>
              completedLessons.includes(l.id)
            ).length;
            const stagePercent = stageLessons.length > 0
              ? Math.round((stageCompleted / stageLessons.length) * 100)
              : 0;
            const totalStageMins = Math.round(
              stageLessons.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
            );

            const isCurrentModule = stage.id === activeLesson.stageId;

            return (
              <div
                key={stage.id}
                onClick={() => handleSelectStage(stage)}
                className={`group p-5 rounded-2xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border transition-all flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md ${
                  isCurrentModule
                    ? 'border-[color:var(--hb-mag)] ring-1 ring-[color:color-mix(in_srgb,var(--hb-mag)_50%,transparent)] shadow-xs'
                    : 'border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:color-mix(in_srgb,var(--hb-mag)_60%,transparent)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-10 h-10 transition-transform group-hover:scale-105 hb-kolor-danych"
                      style={{ '--kd': stage.deep } as React.CSSProperties}
                    >
                      <StageIcon id={stage.id} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: stage.tint, color: stage.deep }}
                      >
                        Moduł {stage.num}
                      </span>
                      {stagePercent === 100 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-brand-display font-semibold text-lg text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] mt-3 group-hover:text-[color:var(--hb-mag-t)] transition-colors leading-snug">
                    {getStageDisplayTitle(stage)}
                  </h3>
                  <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mt-1 line-clamp-2 leading-relaxed">
                    {getStageFullDescription(stage)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                    <span>
                      {stageLessons.length} lekcji · {totalStageMins} min
                    </span>
                    <span className="font-mono font-semibold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                      {stageCompleted}/{stageLessons.length} ({stagePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-[color:var(--hb-linia)] dark:bg-[color:var(--hb-noc)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stagePercent}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PLIKI I CHECKLISTY DO POBRANIA (PDF) */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
              Pliki do druku A4 i na telefon
            </span>
            <h2 className="font-brand-display font-semibold text-xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] mt-0.5">
              Materiały i szablony do pobrania (PDF)
            </h2>
          </div>
          <span className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
            Formaty PDF gotowe do druku
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          <div className="p-3.5 rounded-xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-mag)] transition-colors flex flex-col justify-between bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-noc2)]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[color:var(--hb-mag-t)] uppercase tracking-wider">
                PDF · 2 strony
              </span>
              <h4 className="text-sm font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">Plan Porodu (Standard MZ)</h4>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                16 kluczowych punktów do przekazania położnej na izbie przyjęć.
              </p>
            </div>
            <Link href="/strefa/plan-porodu" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--hb-mag-t)] hover:underline">
              <Download className="w-3.5 h-3.5" />
              <span>Otwórz wzór PDF</span>
            </Link>
          </div>

          <div className="p-3.5 rounded-xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-mag)] transition-colors flex flex-col justify-between bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-noc2)]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[color:var(--hb-mag-t)] uppercase tracking-wider">
                PDF · 3 strefy
              </span>
              <h4 className="text-sm font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">Torba do szpitala</h4>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                Pakowanie: dokumenty, strefa porodu, strefa połogu i noworodka.
              </p>
            </div>
            <Link
              href="/kalkulator-wyprawki"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] hover:text-[color:var(--hb-mag-t)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Otwórz checklistę PDF</span>
            </Link>
          </div>

          <div className="p-3.5 rounded-xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-mag)] transition-colors flex flex-col justify-between bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-noc2)]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[color:var(--hb-mag-t)] uppercase tracking-wider">
                PDF · Kalendarz
              </span>
              <h4 className="text-sm font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">Badania w ciąży</h4>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                Tabela badań laboratoryjnych i USG wg Standardu Opieki Okołoporodowej.
              </p>
            </div>
            <a
              href="/materialy/kalendarz-badan-w-ciazy-happybirth.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] hover:text-[color:var(--hb-mag-t)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz kalendarz PDF</span>
            </a>
          </div>

          <div className="p-3.5 rounded-xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-p4)] transition-colors flex flex-col justify-between bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-noc2)]">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-[color:var(--hb-p4g)] uppercase tracking-wider">
                  ✨ {smartOrderBump.autoDetectedBadge}
                </span>
                {hasOrderBump ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    ✓ Pakiet odblokowany
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[color:color-mix(in_srgb,var(--hb-mag)_15%,transparent)] text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]">
                    🔒 Dodatek Order Bump (+49 zł)
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                {smartOrderBump.checkoutTitlePl}
              </h4>
              <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                {smartOrderBump.checkoutDescPl}
              </p>
            </div>
            {hasOrderBump ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={`${smartOrderBump.editionConfig.url}&unlocked=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--hb-p4g)] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Otwórz pełny pakiet PDF ({smartOrderBump.editionConfig.languageLabel})</span>
                </a>
                <a
                  href="/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-uk&unlocked=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[color:color-mix(in_srgb,var(--hb-p4)_15%,transparent)] text-[color:var(--hb-p4g)] hover:bg-[color:color-mix(in_srgb,var(--hb-p4)_25%,transparent)]"
                >
                  🇵🇱🇬🇧 UK/IE
                </a>
                <a
                  href="/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-de&unlocked=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[color:color-mix(in_srgb,var(--hb-p4)_15%,transparent)] text-[color:var(--hb-p4g)] hover:bg-[color:color-mix(in_srgb,var(--hb-p4)_25%,transparent)]"
                >
                  🇵🇱🇩🇪 DACH
                </a>
                <a
                  href="/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html?edition=pl-nl&unlocked=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[color:color-mix(in_srgb,var(--hb-p4)_15%,transparent)] text-[color:var(--hb-p4g)] hover:bg-[color:color-mix(in_srgb,var(--hb-p4)_25%,transparent)]"
                >
                  🇵🇱🇳🇱 NL
                </a>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`${smartOrderBump.editionConfig.url}&preview=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--hb-p4g)] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Podgląd Karty #1 (Demo)</span>
                </a>
                <button
                  type="button"
                  onClick={handleBuyStandaloneOrderBump}
                  disabled={buyingOrderBump}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] text-[11px] font-bold hover:bg-[color:var(--hb-mag-h)] cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {buyingOrderBump
                      ? 'Otwieranie Stripe...'
                      : `Dokup pełny pakiet (${smartOrderBump.editionConfig.priceDisplay || '+49 zł'})`}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. [C4] STUDENT REFERRAL BOX (Poleć kurs przyjaciółce w ciąży -> -10% dla niej + E-book Kulinarny PDF dla Ciebie) */}
      <StudentReferralBox />

      {/* 8. [C3] KRÓTKI QUIZ KOŃCOWY + IMIENNY CERTYFIKAT UKOŃCZENIA SZKOŁY RODZENIA */}
      <FinalQuizAndCertificate />

      {/* MODAL ONBOARDINGU / PERSONALIZACJI TERMINU */}
      <OnboardingWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(p) => setPregnancyProfile(p)}
        initialProfile={pregnancyProfile}
      />
    </div>
  );
}

export default function StrefaDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
          <div className="w-10 h-10 border-4 border-[color:color-mix(in_srgb,var(--hb-mag)_30%,transparent)] border-t-[color:var(--hb-mag)] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Ładowanie Strefy Rodziców...</p>
        </div>
      }
    >
      <StrefaDashboardContent />
    </React.Suspense>
  );
}
