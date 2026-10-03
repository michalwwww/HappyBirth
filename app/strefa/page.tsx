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
import { PregnancyProfile, getSavedPregnancyProfile } from '@/lib/pregnancy';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { CloudflarePlayer } from '@/components/cloudflare-player';
import { activateStudentAccessLocally, is100PercentPromo } from '@/lib/promo';
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
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Referencja do odtwarzacza wideo (do centrowania ekranu po płatności)
  const playerSectionRef = useRef<HTMLElement>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. ELEGANCKI BANER SUKCESU PO ZAKUPIE / KODZIE PROMOCYJNYM */}
      {paymentSuccess && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-500/40 p-4 sm:p-5 text-white shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dostęp natychmiastowy aktywowany
              </div>
              <h3 className="font-brand-display font-bold text-base sm:text-lg text-white">
                Wspaniale! Wszystkie 52 lekcje 4K są odblokowane dla Ciebie i Twojego partnera 🎉
              </h3>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs bg-emerald-500/20 text-emerald-200 px-3 py-1.5 rounded-full border border-emerald-500/30 font-medium">
            12 miesięcy bez limitu
          </span>
        </div>
      )}

      {/* 2. GŁÓWNY PLAYER NA SAMEJ GÓRZE (Kino Domowe & Playlista) */}
      <section
        ref={playerSectionRef}
        id="odtwarzacz"
        className="space-y-3.5 scroll-mt-20 pt-1"
      >
        {/* Nagłówek sekcji odtwarzacza z czytelnym modułem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DA0271] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Odtwarzacz Kursu · 4K Master VOD
            </span>
            <span className="text-xs text-[#867A72] dark:text-[#C4ADC0]">·</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DA0271]/10 text-[#DA0271] dark:bg-[#DA0271]/20 dark:text-[#FF4BA8]">
              {getStageDisplayTitle(activeStage)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#544A44] dark:text-[#D7CCC3]">
            <span>
              Lekcja <strong>{activeLesson.lessonNumber} z 52</strong> ({activeLesson.durationFormatted})
            </span>
            <Link
              href={`/strefa/lekcja/${activeLesson.id}`}
              className="font-semibold text-[#DA0271] hover:underline flex items-center gap-1"
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
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#461643] dark:border-[#3D0E39] bg-[#20071E]">
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
            <div className="bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-5 sm:p-6 border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full shadow-xs"
                    style={{ backgroundColor: activeStage?.tint || '#FAE3EB', color: activeStage?.deep || '#C80077' }}
                  >
                    Moduł {parseInt(activeStage?.num || '1', 10)}: {getStageDisplayTitle(activeStage)}
                  </span>
                  <span className="text-xs text-[#867A72] dark:text-[#C4ADC0]">
                    Lekcja {activeLesson.lessonNumber} z 52 · {activeLesson.durationFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLessonCompletion(activeLesson.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] hover:text-[#DA0271] border border-[#EAE3DB] dark:border-[#3D0E39]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${completedLessons.includes(activeLesson.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#867A72]'}`} />
                    <span>
                      {completedLessons.includes(activeLesson.id) ? 'Ukończona ✓' : 'Oznacz jako ukończoną'}
                    </span>
                  </button>

                  {nextLesson && (
                    <button
                      onClick={() => handleSelectLesson(nextLesson)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DA0271] hover:bg-[#B90260] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Następna</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h1 className="font-brand-display font-semibold text-xl sm:text-2xl text-[#250A24] dark:text-[#FBF8F4]">
                  {activeLesson.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] mt-1.5 leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>

              {/* Materiały PDF do pobrania dla tej lekcji */}
              {activeLesson.attachments && activeLesson.attachments.length > 0 && (
                <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#C4ADC0] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#DA0271]" /> Materiały do tej lekcji (PDF do druku):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2.5 rounded-xl bg-[#FBF8F4] dark:bg-[#220820] border border-[#EAE3DB] dark:border-[#3D0E39] flex items-center justify-between gap-2.5 text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold text-[9px]">
                            PDF
                          </span>
                          <div>
                            <div className="font-semibold text-[#250A24] dark:text-[#FBF8F4] text-xs">{att.name}</div>
                            <div className="text-[10px] text-[#867A72] dark:text-[#C4ADC0]">{att.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Pobieranie materiału: ${att.name}`)}
                          className="p-1 rounded-md bg-white dark:bg-[#1C081A] hover:bg-[#DA0271] hover:text-white border border-[#EAE3DB] dark:border-[#3D0E39] transition-colors cursor-pointer text-[#250A24] dark:text-[#FBF8F4]"
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

          {/* PRAWA KOLUMNA: PLAYLISTA Z WYBOREM TEMATYCZNYM (4 cols) */}
          <div className="lg:col-span-4 bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-4 sm:p-5 border border-[#EAE3DB] dark:border-[#3D0E39] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE3DB] dark:border-[#3D0E39]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DA0271]">
                  Moduł {parseInt(activeStage?.num || '1', 10)} z 9
                </span>
                <h3 className="font-brand-display font-bold text-base text-[#250A24] dark:text-[#FBF8F4] leading-tight">
                  {getStageDisplayTitle(activeStage)}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#867A72] dark:text-[#C4ADC0]">
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
                        ? 'bg-[#DA0271]/10 dark:bg-[#DA0271]/20 border-[#DA0271] shadow-xs'
                        : 'bg-[#FBF8F4] dark:bg-[#250A24] hover:bg-[#F3EBE3] dark:hover:bg-[#2F0D2E] border-[#EAE3DB] dark:border-[#3D0E39]'
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
                          <span className="w-2 h-2 rounded-full bg-[#FCD705] animate-ping" />
                        ) : (
                          <Play className="w-3 h-3 text-white fill-current ml-0.5" />
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
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
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

            {/* Szybki wybór modułów tematycznych (bez tajemniczego "etap etap") */}
            <div className="pt-2.5 border-t border-[#EAE3DB] dark:border-[#3D0E39] space-y-2">
              <span className="text-[11px] font-semibold text-[#867A72] dark:text-[#C4ADC0] block">
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
                          ? 'bg-[#DA0271] text-white shadow-xs'
                          : 'bg-[#FBF8F4] dark:bg-[#250A24] hover:bg-[#EAE3DB] dark:hover:bg-[#3D0E39] text-[#544A44] dark:text-[#D7CCC3] border border-[#EAE3DB] dark:border-[#3D0E39]'
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
                  className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[#DA0271] hover:underline py-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Katalog wszystkich 52 lekcji VOD &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KOMPAKTOWY PASEK STATUSU KURSANTKI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#20071E] dark:bg-[#250A24] text-[#FCD705] flex items-center justify-center shrink-0">
            {role === 'partner' ? <User className="w-5 h-5 text-[#7FB3CC]" /> : <Heart className="w-5 h-5 text-[#DA0271]" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#867A72] dark:text-[#C4ADC0]">
              Status Twojego Konta
            </div>
            <div className="font-brand-display font-semibold text-sm sm:text-base text-[#250A24] dark:text-[#FBF8F4]">
              {role === 'partner' ? 'Strefa dla Partnera / Taty aktywna' : 'Strefa dla Mamy aktywna'} · Dostęp ważny 12 miesięcy dla dwojga
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#544A44] dark:text-[#D7CCC3]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span><strong>{completedLessons.length}</strong> z 52 lekcji ukończonych ({percentCompleted}%)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#544A44] dark:text-[#D7CCC3]">
            <Clock className="w-4 h-4 text-[#DA0271]" />
            <span>Pozostało: <strong>{remainingHours}h {remainingMins}min</strong></span>
          </div>

          <button
            onClick={() => setWizardOpen(true)}
            className="text-xs font-semibold text-[#DA0271] hover:underline cursor-pointer flex items-center gap-1 border-l border-[#EAE3DB] dark:border-[#3D0E39] pl-3"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{pregnancyProfile?.dueDate ? 'Edytuj termin porodu' : 'Ustaw termin porodu'}</span>
          </button>
        </div>
      </div>

      {/* 4. SZYBKIE NARZĘDZIA SOS (3 najważniejsze kafelki dla rodziców) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Praktyczny Niezbędnik Porodowy
            </span>
            <h2 className="font-brand-display font-semibold text-xl sm:text-2xl text-[#250A24] dark:text-[#FBF8F4]">
              Narzędzia SOS na każdy dzień i noc
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Porodu */}
          <Link
            href="/strefa/plan-porodu"
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#DA0271] to-[#250A24] text-white flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-lg transition-all group"
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
            className="p-5 sm:p-6 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] text-[#1A1512] dark:text-[#FBF8F4] flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA0271]">
                Szybka Pomoc 24/7
              </span>
              <h3 className="font-brand-display font-semibold text-xl mt-1.5 text-[#250A24] dark:text-[#FBF8F4]">
                Cyfrowa Apteczka SOS
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-1 leading-relaxed">
                Wpisz dolegliwość (ból pleców, zgaga, wody, nawał) i przejdź do nagrania z instrukcją.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-xs font-semibold text-[#DA0271]">
              <span>Szukaj objawu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Strefa dla Taty */}
          <Link
            href="/strefa/partner"
            className="p-5 sm:p-6 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] text-[#1A1512] dark:text-[#FBF8F4] flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7FB3CC]">
                Wsparcie w Porodzie
              </span>
              <h3 className="font-brand-display font-semibold text-xl mt-1.5 text-[#250A24] dark:text-[#FBF8F4]">
                Strefa dla Taty
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-1 leading-relaxed">
                Pigułka wiedzy dla osoby towarzyszącej: masaż krzyżowy, prawa na izbie i sala porodowa.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 text-xs font-semibold text-[#7FB3CC]">
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#867A72] dark:text-[#C4ADC0]">
              Pełny Program Szkoły Rodzenia
            </span>
            <h2 className="font-brand-display font-semibold text-xl sm:text-2xl text-[#250A24] dark:text-[#FBF8F4] mt-0.5">
              9 Tematycznych Modułów Programu
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] mt-0.5">
              Kliknięcie modułu ładuje go w odtwarzaczu u góry z pierwszą nieukończoną lekcją.
            </p>
          </div>

          <Link
            href="/strefa/lekcje"
            className="text-xs font-semibold text-[#DA0271] hover:underline flex items-center gap-1 self-start sm:self-auto"
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
                className={`group p-5 rounded-2xl bg-[#FFFDFA] dark:bg-[#1C081A] border transition-all flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md ${
                  isCurrentModule
                    ? 'border-[#DA0271] ring-1 ring-[#DA0271]/50 shadow-xs'
                    : 'border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271]/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-10 h-10 transition-transform group-hover:scale-105"
                      style={{ color: stage.deep }}
                    >
                      <StageIcon name={stage.id.replace('e-', '')} />
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

                  <h3 className="font-brand-display font-semibold text-lg text-[#250A24] dark:text-[#FBF8F4] mt-3 group-hover:text-[#DA0271] transition-colors leading-snug">
                    {getStageDisplayTitle(stage)}
                  </h3>
                  <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-1 line-clamp-2 leading-relaxed">
                    {getStageFullDescription(stage)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3D0E39] mt-3 space-y-2">
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
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PLIKI I CHECKLISTY DO POBRANIA (PDF) */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#FFFDFA] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3D0E39] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-[#EAE3DB] dark:border-[#3D0E39]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Pliki do druku A4 i na telefon
            </span>
            <h2 className="font-brand-display font-semibold text-xl text-[#250A24] dark:text-[#FBF8F4] mt-0.5">
              Materiały i szablony do pobrania (PDF)
            </h2>
          </div>
          <span className="text-xs text-[#867A72] dark:text-[#C4ADC0]">
            Formaty PDF gotowe do druku
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          <div className="p-3.5 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 2 strony
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Plan Porodu (Standard MZ)</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                16 kluczowych punktów do przekazania położnej na izbie przyjęć.
              </p>
            </div>
            <Link href="/strefa/plan-porodu" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#DA0271] hover:underline">
              <Download className="w-3.5 h-3.5" />
              <span>Otwórz wzór PDF</span>
            </Link>
          </div>

          <div className="p-3.5 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 3 strefy
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Torba do szpitala</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Pakowanie: dokumenty, strefa porodu, strefa połogu i noworodka.
              </p>
            </div>
            <button
              onClick={() => alert('Pobieranie: Torba do szpitala (PDF)')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#250A24] dark:text-[#FBF8F4] hover:text-[#DA0271] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz checklistę</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · Kalendarz
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Badania w ciąży</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Tabela badań laboratoryjnych i USG wg Standardu Opieki Okołoporodowej.
              </p>
            </div>
            <button
              onClick={() => alert('Pobieranie: Badania w ciąży (PDF)')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#250A24] dark:text-[#FBF8F4] hover:text-[#DA0271] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz kalendarz</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] hover:border-[#7FB3CC] transition-colors flex flex-col justify-between bg-[#FBF8F4] dark:bg-[#220820]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#7FB3CC] uppercase tracking-wider">
                PDF · Ściąga
              </span>
              <h4 className="text-sm font-bold text-[#250A24] dark:text-[#FBF8F4]">Ściąga dla Taty</h4>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3]">
                Ściąga na porodówkę: punkty ucisku, pozycje i zadania osoby towarzyszącej.
              </p>
            </div>
            <Link href="/strefa/partner" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7FB3CC] hover:underline">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz ściągę</span>
            </Link>
          </div>
        </div>
      </section>

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
