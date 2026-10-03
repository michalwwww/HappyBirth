'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { stages, lessons, getLessonsByStage } from '@/lib/course-data';
import { useCourseProgress } from '@/lib/progress';
import { StageIcon } from '@/components/stage-icons';
import { PregnancyProfile, getSavedPregnancyProfile } from '@/lib/pregnancy';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { PregnancyTrackerCard } from '@/components/pregnancy-tracker-card';
import { CloudflarePlayer } from '@/components/cloudflare-player';
import { DailyTipCard } from '@/components/daily-tip-card';
import { activateStudentAccessLocally, is100PercentPromo } from '@/lib/promo';
import { Lesson } from '@/lib/types';
import {
  Play,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  User,
  Clock,
  ArrowRight,
  Download,
  BookOpen,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Heart,
  Feather,
  Activity,
  Baby,
  FileText,
  Tv,
} from 'lucide-react';

function StrefaDashboardContent() {
  const { role, changeRole, completedLessons, percentCompleted, toggleLessonCompletion } = useCourseProgress();
  const [pregnancyProfile, setPregnancyProfile] = useState<PregnancyProfile | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Aktywna lekcja w kinie domowym na kokpicie
  const [activeLessonId, setActiveLessonId] = useState<string>('lekcja-01');
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  useEffect(() => {
    setPregnancyProfile(getSavedPregnancyProfile());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const payment = params.get('payment');
      const promo = params.get('promo');
      const lessonParam = params.get('lesson');
      const autoplayParam = params.get('autoplay');

      const isPromoOrSuccess =
        (sessionId && (sessionId.startsWith('promo_') || sessionId.startsWith('demo_') || sessionId.toLowerCase().includes('test') || sessionId.toLowerCase().includes('promo'))) ||
        payment === 'success' ||
        Boolean(promo) ||
        is100PercentPromo(promo);

      // Natychmiastowe synchroniczne odblokowanie bez czekania na sieć
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
              activateStudentAccessLocally(promo || 'TEST100');
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

      // Ustaw aktywną lekcję z URL lub domyślnie pierwszą nieukończoną
      if (lessonParam && lessons.some((l) => l.id === lessonParam)) {
        setActiveLessonId(lessonParam);
      } else {
        const nextUncompleted = lessons.find((l) => !completedLessons.includes(l.id));
        if (nextUncompleted) {
          setActiveLessonId(nextUncompleted.id);
        }
      }

      // Autoplay jeśli po płatności lub jawnie w parametrze
      if (isPromoOrSuccess || autoplayParam === 'true') {
        setShouldAutoplay(true);
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

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setShouldAutoplay(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Baner sukcesu po płatności Stripe / kodzie testowym */}
      {paymentSuccess && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-500/40 p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Dostęp natychmiastowy aktywowany
            </div>
            <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
              Wspaniale! Twój dostęp do HappyBirth jest w 100% aktywny 🎉
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-sans">
              Odblokowaliśmy wszystkie 52 lekcje wideo w jakości 4K, materiały PDF i dedykowaną Strefę dla Partnera. Dostęp jest ważny przez 12 miesięcy dla Ciebie i Twojego partnera.
            </p>
          </div>
        </div>
      )}

      {/* 0. INTELIGENTNY TRACKER CIĄŻY I PERSONALIZACJA */}
      {role === 'student' && (
        <PregnancyTrackerCard 
          profile={pregnancyProfile} 
          onOpenWizard={() => setWizardOpen(true)} 
        />
      )}

      {/* 1. HERO GREETING & PROGRESS CARD (Luksusowy fiolet #20071E / dark #180517) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#20071E] via-[#2A0B28] to-[#3A1038] dark:from-[#180517] dark:via-[#1F071D] dark:to-[#2A0B28] text-white p-6 sm:p-10 border border-[#461643] dark:border-[#3D0E39] shadow-xl relative overflow-hidden">
        {/* Dekoracyjne tło */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#DA0271]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DA0271] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#EAD5E5]/80">
                {role === 'partner' ? 'Strefa dla Taty / Osoby Towarzyszącej' : 'Strefa dla Mamy'}
              </span>
            </div>

            <h1 className="font-serif font-normal text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {role === 'partner'
                ? 'Witaj w Strefie dla Taty!'
                : 'Cześć! Spokojnego dnia.'}
            </h1>

            <p className="text-sm sm:text-base text-[#EAD5E5]/80 leading-relaxed font-sans">
              Program szkoły rodzenia oparty o 4 Filary Spokoju HappyBirth i Standard Opieki Okołoporodowej. Czuła wiedza dla Ciebie i Twojej rodziny, do której wracacie w dowolnym momencie.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#EAD5E5]/70">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DD7C9D]" />
                Pozostało do ukończenia: {remainingHours}h {remainingMins}min
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FCD705]" />
                {completedLessons.length} z 52 lekcji ukończonych
              </span>
            </div>
          </div>

          {/* Duży wskaźnik ukończenia */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-6 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#DA0271] transition-all duration-1000 ease-out"
                  strokeDasharray={`${percentCompleted}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-lg text-white">
                {percentCompleted}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-[#EAD5E5]/70 font-semibold">
                Twój postęp
              </div>
              <div className="font-semibold text-xl text-white">
                {completedLessons.length === 52 ? 'Kurs ukończony!' : `${52 - completedLessons.length} lekcji przed Tobą`}
              </div>
              <div className="text-[11px] text-[#EAD5E5]/70">
                Certyfikat imienny po 100%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tip Widget */}
      <DailyTipCard />

      {/* 2. GŁÓWNY ODTWARZACZ VOD (Kino Domowe HappyBirth & Interaktywna Playlista Etapu) */}
      <section id="odtwarzacz" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DA0271] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Kino Domowe HappyBirth · Odtwarzacz VOD
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#544A44] dark:text-[#D7CCC3]">
            <span className="hidden md:inline">
              Odtwarzasz: <strong>Lekcja {activeLesson.lessonNumber} z 52</strong> ({activeLesson.durationFormatted})
            </span>
            <Link
              href={`/strefa/lekcja/${activeLesson.id}`}
              className="font-semibold text-[#DA0271] hover:underline flex items-center gap-1"
            >
              <span>Pełny ekran lekcji</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEWA KOLUMNA: GŁÓWNY ODTWARZACZ VOD (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#461643] dark:border-[#3D0E39] bg-[#20071E]">
              <CloudflarePlayer
                lesson={activeLesson}
                isCompleted={completedLessons.includes(activeLesson.id)}
                onToggleComplete={() => toggleLessonCompletion(activeLesson.id)}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                autoplay={shouldAutoplay}
                onSelectLesson={handleSelectLesson}
              />
            </div>

            {/* Karta szczegółów aktualnie odtwarzanej lekcji */}
            <div className="bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-6 sm:p-7 border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: activeStage?.tint, color: activeStage?.deep }}
                  >
                    Etap {activeStage?.number}: {activeStage?.title}
                  </span>
                  <span className="text-xs text-[#867A72] dark:text-[#C4ADC0]">
                    Lekcja {activeLesson.lessonNumber} z 52 · {activeLesson.durationFormatted}
                  </span>
                </div>

                <button
                  onClick={() => toggleLessonCompletion(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] hover:text-[#DA0271] border border-[#EAE3DB] dark:border-[#3D0E39]'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${completedLessons.includes(activeLesson.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#867A72]'}`} />
                  <span>
                    {completedLessons.includes(activeLesson.id) ? 'Lekcja ukończona ✓' : 'Oznacz jako ukończoną'}
                  </span>
                </button>
              </div>

              <div>
                <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-[#250A24] dark:text-[#FBF8F4]">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-[#544A44] dark:text-[#D7CCC3] mt-2 leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>

              {/* Materiały PDF do pobrania dla tej lekcji */}
              {activeLesson.attachments && activeLesson.attachments.length > 0 && (
                <div className="pt-4 border-t border-[#EAE3DB] dark:border-[#3D0E39] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#867A72] dark:text-[#C4ADC0] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#DA0271]" /> Materiały do tej lekcji (PDF)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-2xl bg-[#FBF8F4] dark:bg-[#220820] border border-[#EAE3DB] dark:border-[#3D0E39] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold text-[10px]">
                            PDF
                          </div>
                          <div>
                            <div className="font-semibold text-[#250A24] dark:text-[#FBF8F4]">{att.name}</div>
                            <div className="text-[11px] text-[#867A72] dark:text-[#C4ADC0]">{att.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Pobieranie materiału: ${att.name}`)}
                          className="p-1.5 rounded-lg bg-white dark:bg-[#1C081A] hover:bg-[#DA0271] hover:text-white border border-[#EAE3DB] dark:border-[#3D0E39] transition-colors cursor-pointer text-[#250A24] dark:text-[#FBF8F4]"
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

          {/* PRAWA KOLUMNA: PLAYLISTA ETAPU (4 cols) */}
          <div className="lg:col-span-4 bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-5 sm:p-6 border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DB] dark:border-[#3D0E39]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DA0271]">
                  Playlista Etapu {activeStage?.number}
                </span>
                <h3 className="font-brand-display font-bold text-lg text-[#250A24] dark:text-[#FBF8F4] leading-tight">
                  {activeStage?.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#867A72] dark:text-[#C4ADC0]">
                {activeStageLessons.filter((l) => completedLessons.includes(l.id)).length}/{activeStageLessons.length}
              </span>
            </div>

            {/* Lista lekcji w aktywnym etapie */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {activeStageLessons.map((l) => {
                const isActive = l.id === activeLesson.id;
                const isDone = completedLessons.includes(l.id);

                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLesson(l)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#DA0271]/10 dark:bg-[#DA0271]/20 border-[#DA0271] shadow-sm'
                        : 'bg-[#FBF8F4] dark:bg-[#250A24] hover:bg-[#F3EBE3] dark:hover:bg-[#2F0D2E] border-[#EAE3DB] dark:border-[#3D0E39]'
                    }`}
                  >
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-black/20 flex items-center justify-center">
                      <Image
                        src={l.thumbnailUrl}
                        alt={l.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {isActive ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FCD705] animate-ping" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-[#867A72] dark:text-[#C4ADC0]">
                          Lekcja {l.lessonNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-[#867A72] dark:text-[#C4ADC0]">
                            {l.durationFormatted}
                          </span>
                          {isDone && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </div>
                      </div>

                      <h4
                        className={`text-xs font-semibold line-clamp-2 leading-snug ${
                          isActive
                            ? 'text-[#DA0271] dark:text-[#FF4BA8] font-bold'
                            : 'text-[#250A24] dark:text-[#FBF8F4]'
                        }`}
                      >
                        {l.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Szybki przełącznik między etapami */}
            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] space-y-2">
              <span className="text-[11px] font-medium text-[#867A72] dark:text-[#C4ADC0] block">
                Przełącz na inny etap kursu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((st) => {
                  const isCurrentStage = st.id === activeLesson.stageId;
                  const firstLessonOfStage = lessons.find((l) => l.stageId === st.id);

                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        if (firstLessonOfStage) handleSelectLesson(firstLessonOfStage);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        isCurrentStage
                          ? 'bg-[#250A24] text-white dark:bg-[#DA0271] shadow-xs'
                          : 'bg-[#FBF8F4] dark:bg-[#250A24] hover:bg-[#EAE3DB] dark:hover:bg-[#3D0E39] text-[#544A44] dark:text-[#D7CCC3] border border-[#EAE3DB] dark:border-[#3D0E39]'
                      }`}
                      title={st.title}
                    >
                      Etap {st.number}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/strefa/lekcje"
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#DA0271] hover:underline py-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Katalog wszystkich 52 lekcji &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SZYBKI DOSTĘP SOS (Licznik 5-1-1, Apteczka, Partner) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Niezbędnik na każdy dzień i noc
            </span>
            <h2 className="font-brand-display font-semibold text-2xl sm:text-3xl text-[#250A24] dark:text-[#FBF8F4] mt-0.5">
              Narzędzia SOS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Porodu (PDF) */}
          <Link
            href="/strefa/plan-porodu"
            className="p-6 rounded-2xl bg-gradient-to-br from-[#DA0271] to-[#250A24] text-white flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-xl transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                  Dokument do Szpitala
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  PDF
                </span>
              </div>
              <h3 className="font-brand-display font-semibold text-2xl mt-2 text-white">
                Kreator Planu Porodu
              </h3>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Zgodny ze Standardem MZ. Zaznacz preferencje, wydrukuj i weź ze sobą na izbę przyjęć.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-4 text-xs font-semibold">
              <span>Wypełnij plan porodu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Cyfrowa Apteczka SOS */}
          <Link
            href="/strefa/apteczka"
            className="p-6 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] text-[#1A1512] dark:text-[#FBF8F4] flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#DA0271]">
                Szybka Pomoc
              </span>
              <h3 className="font-brand-display font-semibold text-2xl mt-2 text-[#250A24] dark:text-[#FBF8F4]">
                Cyfrowa Apteczka
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-2 leading-relaxed">
                Wpisz dolegliwość (ból pleców, zgaga, wody, nawał) i przejdź bezpośrednio do instrukcji.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-4 text-xs font-semibold text-[#DA0271]">
              <span>Szukaj objawu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Strefa dla Taty */}
          <Link
            href="/strefa/partner"
            className="p-6 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] text-[#1A1512] dark:text-[#FBF8F4] flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#7FB3CC]">
                Wsparcie w Porodzie
              </span>
              <h3 className="font-brand-display font-semibold text-2xl mt-2 text-[#250A24] dark:text-[#FBF8F4]">
                Strefa dla Taty
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-2 leading-relaxed">
                Pigułka wiedzy dla partnera: masaż krzyżowy, torba, prawa na izbie i zadania na sali.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-4 text-xs font-semibold text-[#250A24] dark:text-[#FBF8F4]">
              <span>Otwórz ściągę dla taty</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. KOKPIT 9 ETAPÓW (Interaktywne kafelki postępu) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#867A72] dark:text-[#C4ADC0]">
              Ścieżka edukacyjna
            </span>
            <h2 className="font-brand-display font-semibold text-2xl sm:text-3xl text-[#250A24] dark:text-[#FBF8F4] mt-0.5">
              9 Etapów Twojej Ciąży i Porodu
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] mt-1">
              Kliknij dowolny etap, aby zobaczyć lekcje wideo dopasowane do Twojego trymestru.
            </p>
          </div>

          <Link
            href="/strefa/lekcje"
            className="text-xs font-semibold text-[#DA0271] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pokaż całą listę 52 lekcji</span>
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

            return (
              <Link
                key={stage.id}
                href={`/strefa/lekcje?stage=${stage.id}`}
                className="group p-6 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 transition-transform group-hover:scale-110"
                      style={{ color: stage.deep }}
                    >
                      <StageIcon name={stage.id.replace('e-', '')} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: stage.tint, color: stage.deep }}
                      >
                        Etap {stage.number}
                      </span>
                      {stagePercent === 100 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-brand-display font-semibold text-xl text-[#250A24] dark:text-[#FBF8F4] mt-4 group-hover:text-[#DA0271] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-1 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#867A72] dark:text-[#C4ADC0]">
                    <span>
                      {stageLessons.length} lekcji · {totalStageMins} min
                    </span>
                    <span className="font-mono font-semibold text-[#250A24] dark:text-[#FBF8F4]">
                      {stageCompleted}/{stageLessons.length} ({stagePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#EAE3DB] dark:bg-[#2C0C2B] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stagePercent}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. 4 FILARY SPOKOJU HAPPYBIRTH & STANDARD MEDYCZNY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FBF8F4] dark:bg-[#170516] border border-[#EAE3DB] dark:border-[#3D0E39] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DA0271]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                Metodologia i fundament opieki
              </span>
            </div>
            <h2 className="font-brand-display font-semibold text-2xl sm:text-3xl text-[#250A24] dark:text-[#FBF8F4] mt-1">
              4 Filary Spokoju HappyBirth
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] mt-1">
              Oparte o 14 lat doświadczenia szkoły rodzenia Mama Gaja (od 2012 r.), 18 000 porodów i Standard Opieki Okołoporodowej MZ.
            </p>
          </div>

          <Link
            href="/standard-merytoryczny"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#B90260] text-white text-xs font-semibold transition-all shrink-0 shadow-md shadow-[#DA0271]/25 hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 text-[#FCD705]" />
            <span>Standard merytoryczny & E-E-A-T</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/strefa/lekcje?stage=stage-05"
            className="p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DD7C9D] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FCF4F6] dark:bg-[#DA0271]/20 text-[#DD7C9D] flex items-center justify-center font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72] dark:text-[#C4ADC0]">FILAR 01</span>
                <h3 className="font-brand-display font-semibold text-base text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271] transition-colors">
                  Poród & Oddech
                </h3>
              </div>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Pozycje wertykalne, oddech przeponowy, niefarmakologiczne łagodzenie bólu i ochrona krocza.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-[11px] font-semibold text-[#DA0271] flex items-center justify-between">
              <span>Zobacz lekcje porodu</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-03"
            className="p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#E9C46A] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FDF9EE] dark:bg-[#E9C46A]/20 text-[#E9C46A] flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72] dark:text-[#C4ADC0]">FILAR 02</span>
                <h3 className="font-brand-display font-semibold text-base text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271] transition-colors">
                  Ciało & Dno Miednicy
                </h3>
              </div>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Fizjoterapia uroginekologiczna, masaż krzyżowy z partnerem, mobilność miednicy i bezpieczny połóg.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-[11px] font-semibold text-[#250A24] dark:text-[#FBF8F4] flex items-center justify-between">
              <span>Lekcje fizjoterapii</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-08"
            className="p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#E79A62] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FCF5EF] dark:bg-[#E79A62]/20 text-[#E79A62] flex items-center justify-center font-bold">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72] dark:text-[#C4ADC0]">FILAR 03</span>
                <h3 className="font-brand-display font-semibold text-base text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271] transition-colors">
                  Laktacja & Więź
                </h3>
              </div>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Fizjologia karmienia, asymetryczny chwyt, nawały pokarmowe oraz czułe karmienie bez presji.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-[11px] font-semibold text-[#E79A62] flex items-center justify-between">
              <span>Lekcje laktacji</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-09"
            className="p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#7FB3CC] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F3F8FB] dark:bg-[#7FB3CC]/20 text-[#7FB3CC] flex items-center justify-center font-bold">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72] dark:text-[#C4ADC0]">FILAR 04</span>
                <h3 className="font-brand-display font-semibold text-base text-[#250A24] dark:text-[#FBF8F4] group-hover:text-[#DA0271] transition-colors">
                  Noworodek & I Rok
                </h3>
              </div>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Kąpiel noworodka, kikut pępowinowy, bezpieczny sen, pierwsza pomoc i zdrowy rozsądek o 3:00 w nocy.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-[11px] font-semibold text-[#7FB3CC] flex items-center justify-between">
              <span>Opieka nad dzieckiem</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 6. PLIKI I CHECKLISTY DO POBRANIA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3DB] dark:border-[#3D0E39]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Pliki do druku i na telefon
            </span>
            <h2 className="font-brand-display font-semibold text-2xl text-[#250A24] dark:text-[#FBF8F4] mt-0.5">
              Materiały do pobrania
            </h2>
          </div>
          <span className="text-xs text-[#867A72] dark:text-[#C4ADC0]">
            Formaty PDF przygotowane do druku A4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 2 strony
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Plan Porodu (Standard MZ)</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                16 kluczowych punktów do przekazania położnej na izbie przyjęć.
              </p>
            </div>
            <Link href="/strefa/plan-porodu" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#DA0271] hover:underline">
              <Download className="w-3.5 h-3.5" />
              <span>Otwórz wzór PDF</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 3 strefy
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Torba do szpitala</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Pakowanie: dokumenty, strefa porodu, strefa połogu i noworodka.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#250A24] dark:text-[#FBF8F4] hover:text-[#DA0271] cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz checklistę</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · Kalendarz
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Badania w ciąży</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Tabela badań laboratoryjnych i USG wg Standardu Opieki Okołoporodowej.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#250A24] dark:text-[#FBF8F4] hover:text-[#DA0271] cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz kalendarz</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#7FB3CC] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#7FB3CC] uppercase tracking-wider">
                PDF · Ściąga
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Ściąga dla Taty</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Ściąga na porodówkę: punkty ucisku, pozycje i zadania osoby towarzyszącej.
              </p>
            </div>
            <Link href="/strefa/partner" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7FB3CC] hover:underline">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz ściągę</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL ONBOARDINGU / PERSONALIZACJI */}
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
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#867A72] dark:text-[#C4ADC0]">
          <div className="w-10 h-10 border-4 border-[#DA0271]/30 border-t-[#DA0271] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Ładowanie Strefy Rodziców...</p>
        </div>
      }
    >
      <StrefaDashboardContent />
    </React.Suspense>
  );
}
