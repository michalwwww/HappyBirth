'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { stages, lessons, getLessonsByStage } from '@/lib/course-data';
import { useCourseProgress } from '@/lib/progress';
import { StageIcon } from '@/components/stage-icons';
import { PregnancyProfile, getSavedPregnancyProfile } from '@/lib/pregnancy';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { PregnancyTrackerCard } from '@/components/pregnancy-tracker-card';
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
} from 'lucide-react';
import Image from 'next/image';
import { DailyTipCard } from '@/components/daily-tip-card';
import { activateStudentAccessLocally, is100PercentPromo } from '@/lib/promo';

export default function StrefaDashboardPage() {
  const { role, changeRole, completedLessons, percentCompleted } = useCourseProgress();
  const [pregnancyProfile, setPregnancyProfile] = useState<PregnancyProfile | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setPregnancyProfile(getSavedPregnancyProfile());
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const payment = params.get('payment');
      const promo = params.get('promo');

      const isPromoOrSuccess =
        (sessionId && (sessionId.startsWith('promo_') || sessionId.startsWith('demo_') || sessionId.toLowerCase().includes('test') || sessionId.toLowerCase().includes('promo'))) ||
        payment === 'success' ||
        Boolean(promo) ||
        is100PercentPromo(promo);

      // Natychmiastowe, synchroniczne odblokowanie bez czekania na sieć
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
    }
  }, []);

  // Znajdź następną nieukończoną lekcję
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0];
  const nextLessonStage = stages.find((s) => s.id === nextLesson.stageId);

  // Szacowany pozostały czas
  const remainingMinutes = Math.round(
    lessons
      .filter((l) => !completedLessons.includes(l.id))
      .reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
  );
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Baner sukcesu po płatności Stripe */}
      {paymentSuccess && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-500/40 p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Płatność BLIK / Karta zatwierdzona
            </div>
            <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
              Wspaniale! Twój dostęp do HappyBirth jest w 100% aktywny 🎉
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-sans">
              Odblokowaliśmy wszystkie 52 lekcje wideo, materiały PDF i dedykowaną Strefę dla Partnera. Dostęp jest ważny przez 12 miesięcy dla Ciebie i Twojego partnera.
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

      {/* 1. HERO GREETING & PROGRESS CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-[#55406E] via-[#4A3A5E] to-[#3F3054] text-white p-6 sm:p-10 border border-[#6E5C7D]/30 shadow-xl relative overflow-hidden">
        {/* Dekoracyjne tło */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#DA0271]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DA0271] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FDFAF6]/80">
                {role === 'partner' ? 'Strefa dla Taty / Osoby Towarzyszącej' : 'Strefa dla Mamy'}
              </span>
            </div>

            <h1 className="font-serif font-normal text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {role === 'partner'
                ? 'Witaj w Strefie dla Taty!'
                : 'Cześć! Spokojnego dnia.'}
            </h1>

            <p className="text-sm sm:text-base text-[#FDFAF6]/80 leading-relaxed font-sans">
              Program szkoły rodzenia oparty o 4 Filary Spokoju HappyBirth i Standard Opieki Okołoporodowej. Czuła wiedza dla Ciebie i Twojej rodziny, do której wracacie w dowolnym momencie.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#FDFAF6]/70">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DD7C9D]" />
                Pozostało do ukończenia: {remainingHours}h {remainingMins}min
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E9C46A]" />
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
              <div className="text-xs uppercase tracking-wider text-[#FDFAF6]/70 font-semibold">
                Twój postęp
              </div>
              <div className="font-semibold text-xl text-white">
                {completedLessons.length === 52 ? 'Kurs ukończony!' : `${52 - completedLessons.length} lekcji przed Tobą`}
              </div>
              <div className="text-[11px] text-[#FDFAF6]/70">
                Certyfikat imienny po 100%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tip Widget */}
      <DailyTipCard />

      {/* 2. KARTA "KONTYNUUJ NAUKĘ" (Następna nierozpoczęta lekcja) */}
      <div className="bg-[#FFFDFA] rounded-3xl border border-[#EADFD3] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DA0271]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Polecane do obejrzenia teraz
            </span>
          </div>

          <Link
            href="/strefa/lekcje"
            className="text-xs font-semibold text-[#544A44] hover:text-[#DA0271] flex items-center gap-1 transition-colors"
          >
            <span>Wszystkie 52 lekcje</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 relative aspect-video rounded-2xl overflow-hidden bg-stone-900 group shadow-md">
            <Image
              src={nextLesson.thumbnailUrl}
              alt={nextLesson.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}?autoplay=true`}
                className="w-12 h-12 rounded-full bg-[#DA0271] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </Link>
            </div>
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded font-mono font-medium">
              {nextLesson.durationFormatted}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: nextLessonStage?.tint, color: nextLessonStage?.deep }}
              >
                {nextLessonStage?.title}
              </span>
              <span className="text-xs text-[#867A72]">
                Lekcja {nextLesson.lessonNumber} z 52
              </span>
            </div>

            <h2 className="font-semibold text-xl sm:text-2xl text-[#4A3A5E]">
              {nextLesson.title}
            </h2>

            <p className="text-sm text-[#544A44] line-clamp-2 leading-relaxed">
              {nextLesson.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}?autoplay=true`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#B90260] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#DA0271]/25 hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#FCD705]" />
                <span>Odtwórz lekcję ({nextLesson.durationFormatted})</span>
              </Link>

              <Link
                href="/strefa/lekcje"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#EADFD3] hover:border-[#4A3A5E] text-xs sm:text-sm font-semibold text-[#544A44] hover:text-[#4A3A5E] transition-colors"
              >
                <span>Przeglądaj wg etapów</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SZYBKI DOSTĘP SOS (Licznik 5-1-1, Apteczka, Partner) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Niezbędnik na każdy dzień i noc
            </span>
            <h2 className="font-semibold text-2xl sm:text-3xl text-[#4A3A5E] mt-0.5">
              Narzędzia SOS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan Porodu (PDF) */}
          <Link
            href="/strefa/plan-porodu"
            className="p-6 rounded-2xl bg-gradient-to-br from-[#DA0271] to-[#55406E] text-white flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FDFAF6]/80">
                  Dokument do Szpitala
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  PDF
                </span>
              </div>
              <h3 className="font-semibold text-2xl mt-2 text-white">
                Kreator Planu Porodu
              </h3>
              <p className="text-xs text-[#FDFAF6]/90 mt-2 leading-relaxed">
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
            className="p-6 rounded-2xl bg-[#FCF4F6] text-[#2A2421] border border-[#DD7C9D]/40 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#DA0271]">
                Szybka Pomoc
              </span>
              <h3 className="font-semibold text-2xl mt-2 text-[#4A3A5E]">
                Cyfrowa Apteczka
              </h3>
              <p className="text-xs text-[#544A44] mt-2 leading-relaxed">
                Wpisz dolegliwość (ból pleców, zgaga, wody, nawał) i przejdź do instrukcji.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DD7C9D]/30 mt-4 text-xs font-semibold text-[#DA0271]">
              <span>Szukaj objawu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Strefa dla Taty */}
          <Link
            href="/strefa/partner"
            className="p-6 rounded-2xl bg-[#FDF9EE] text-[#2A2421] border border-[#E9C46A]/50 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-lg transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#6E5C7D]">
                Wsparcie w Porodzie
              </span>
              <h3 className="font-semibold text-2xl mt-2 text-[#4A3A5E]">
                Strefa dla Taty
              </h3>
              <p className="text-xs text-[#544A44] mt-2 leading-relaxed">
                Pigułka wiedzy dla osoby towarzyszącej: masaż krzyżowy, torba, prawa na izbie i zadania na sali.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E9C46A]/40 mt-4 text-xs font-semibold text-[#4A3A5E]">
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#867A72]">
              Ścieżka edukacyjna
            </span>
            <h2 className="font-semibold text-2xl sm:text-3xl text-[#4A3A5E] mt-0.5">
              9 Etapów Twojej Ciąży i Porodu
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44] mt-1">
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
                className="group p-6 rounded-2xl bg-[#FFFDFA] border border-[#EADFD3] hover:border-[#4A3A5E]/40 hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]"
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-xl text-[#4A3A5E] mt-4 group-hover:text-[#DA0271] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#544A44] mt-1 line-clamp-2">
                    {stage.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EADFD3] mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#867A72]">
                    <span>
                      {stageLessons.length} lekcji · {totalStageMins} min
                    </span>
                    <span className="font-mono font-semibold text-[#4A3A5E]">
                      {stageCompleted}/{stageLessons.length} ({stagePercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#EFE5D8] h-1.5 rounded-full overflow-hidden">
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F0E7] border border-[#EADFD3] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DA0271]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                Metodologia i fundament opieki
              </span>
            </div>
            <h2 className="font-semibold text-2xl sm:text-3xl text-[#4A3A5E] mt-1">
              4 Filary Spokoju HappyBirth
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44] mt-1">
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
            className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#EADFD3] hover:border-[#DD7C9D] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FCF4F6] text-[#DD7C9D] flex items-center justify-center font-bold">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72]">FILAR 01</span>
                <h3 className="font-semibold text-base text-[#4A3A5E] group-hover:text-[#DA0271] transition-colors">
                  Poród & Oddech
                </h3>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Pozycje wertykalne, oddech przeponowy, niefarmakologiczne łagodzenie bólu i ochrona krocza.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EADFD3] mt-3 text-[11px] font-semibold text-[#DA0271] flex items-center justify-between">
              <span>Zobacz lekcje porodu</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-03"
            className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#EADFD3] hover:border-[#E9C46A] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FDF9EE] text-[#E9C46A] flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72]">FILAR 02</span>
                <h3 className="font-semibold text-base text-[#4A3A5E] group-hover:text-[#4A3A5E] transition-colors">
                  Ciało & Dno Miednicy
                </h3>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Fizjoterapia uroginekologiczna, masaż krzyżowy z partnerem, mobilność miednicy i bezpieczny połóg.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EADFD3] mt-3 text-[11px] font-semibold text-[#4A3A5E] flex items-center justify-between">
              <span>Lekcje fizjoterapii</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-08"
            className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#EADFD3] hover:border-[#E79A62] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FCF5EF] text-[#E79A62] flex items-center justify-center font-bold">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72]">FILAR 03</span>
                <h3 className="font-semibold text-base text-[#4A3A5E] group-hover:text-[#E79A62] transition-colors">
                  Laktacja & Więź
                </h3>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Fizjologia karmienia, asymetryczny chwyt, nawały pokarmowe oraz czułe karmienie bez presji.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EADFD3] mt-3 text-[11px] font-semibold text-[#E79A62] flex items-center justify-between">
              <span>Lekcje laktacji</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/strefa/lekcje?stage=stage-09"
            className="p-5 rounded-2xl bg-[#FFFDFA] border border-[#EADFD3] hover:border-[#7FB3CC] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F3F8FB] text-[#7FB3CC] flex items-center justify-center font-bold">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#867A72]">FILAR 04</span>
                <h3 className="font-semibold text-base text-[#4A3A5E] group-hover:text-[#7FB3CC] transition-colors">
                  Noworodek & I Rok
                </h3>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Kąpiel noworodka, kikut pępowinowy, bezpieczny sen, pierwsza pomoc i zdrowy rozsądek o 3:00 w nocy.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EADFD3] mt-3 text-[11px] font-semibold text-[#7FB3CC] flex items-center justify-between">
              <span>Opieka nad dzieckiem</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 6. PLIKI I CHECKLISTY DO POBRANIA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFA] border border-[#EADFD3] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADFD3]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              Pliki do druku i na telefon
            </span>
            <h2 className="font-semibold text-2xl text-[#4A3A5E] mt-0.5">
              Materiały do pobrania
            </h2>
          </div>
          <span className="text-xs text-[#867A72]">
            Formaty PDF przygotowane do druku A4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl border border-[#EADFD3] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FDFAF6]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 2 strony
              </span>
              <h4 className="text-sm font-bold text-[#4A3A5E]">Plan Porodu (Standard MZ)</h4>
              <p className="text-xs text-[#544A44]">
                16 kluczowych punktów do przekazania położnej na izbie przyjęć.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3A5E] hover:text-[#DA0271]">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz wzór PDF</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#EADFD3] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FDFAF6]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · 3 strefy
              </span>
              <h4 className="text-sm font-bold text-[#4A3A5E]">Torba do szpitala</h4>
              <p className="text-xs text-[#544A44]">
                Pakowanie: dokumenty, strefa porodu, strefa połogu i noworodka.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3A5E] hover:text-[#DA0271]">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz checklistę</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#EADFD3] hover:border-[#DA0271] transition-colors flex flex-col justify-between bg-[#FDFAF6]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#DA0271] uppercase tracking-wider">
                PDF · Kalendarz
              </span>
              <h4 className="text-sm font-bold text-[#4A3A5E]">Badania w ciąży</h4>
              <p className="text-xs text-[#544A44]">
                Tabela badań laboratoryjnych i USG wg Standardu Opieki Okołoporodowej.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3A5E] hover:text-[#DA0271]">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz kalendarz</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#EADFD3] hover:border-[#7FB3CC] transition-colors flex flex-col justify-between bg-[#FDFAF6]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#7FB3CC] uppercase tracking-wider">
                PDF · Ściąga
              </span>
              <h4 className="text-sm font-bold text-[#4A3A5E]">Ściąga dla Taty</h4>
              <p className="text-xs text-[#544A44]">
                Ściąga na porodówkę: punkty ucisku, pozycje i zadania osoby towarzyszącej.
              </p>
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A3A5E] hover:text-[#7FB3CC]">
              <Download className="w-3.5 h-3.5" />
              <span>Pobierz ściągę</span>
            </button>
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
