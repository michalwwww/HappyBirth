'use client';

import React from 'react';
import Link from 'next/link';
import { BuyCourseButton } from '@/components/buy-button';
import { DailyTipCard } from '@/components/daily-tip-card';
import {
  Play,
  Sparkles,
  Check,
  ArrowRight,
  Heart,
  Users,
  FileText,
  Activity,
  Baby,
  Feather,
  Instagram,
  BookOpen,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';
import { useI18n } from '@/lib/i18n';
import { getMarketingTranslations } from '@/lib/marketing-i18n';

export default function MarketingPage() {
  const { lang } = useI18n();
  const t = getMarketingTranslations(lang);

  // Darmowy podgląd lekcji 1 w Cloudflare Stream
  const previewUid = 'f8d8d8f24b917a32961efea785c9324b';
  const previewStreamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${previewUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${previewUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  const pillarIcons = [Feather, Activity, Heart, Baby];

  return (
    <div className="space-y-0 text-[#1A1512] dark:text-[#FBF8F4] selection:bg-[#EC008C]/20 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Lewa kolumna */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] border border-[#F3CAD9] dark:border-[#52134C] text-xs font-semibold text-[#EC008C] dark:text-[#F472B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="font-brand-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#1A1512] dark:text-[#FBF8F4] leading-[1.08] tracking-tight">
              {t.hero.title1}{' '}
              <em className="font-brand-serif italic font-normal text-[#EC008C] dark:text-[#F472B6]">
                {t.hero.titlePink1}
              </em>
              <br className="hidden sm:inline" />
              <em className="font-brand-serif italic font-normal text-[#EC008C] dark:text-[#F472B6]">
                {t.hero.titlePink2}
              </em>{' '}
              {t.hero.title2}
            </h1>

            <p className="text-base sm:text-lg text-[#544A44] dark:text-[#D7CCC3] leading-relaxed font-sans max-w-2xl">
              {t.hero.desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <BuyCourseButton className="inline-flex items-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-base font-semibold transition-all shadow-xl shadow-[#EC008C]/25 hover:scale-105 cursor-pointer">
                <span>{t.hero.ctaBuy}</span>
                <ArrowRight className="w-4 h-4" />
              </BuyCourseButton>

              <a
                href="#zwiastun"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white dark:bg-[#250A24] hover:bg-stone-50 dark:hover:bg-white/5 text-[#1A1512] dark:text-[#FBF8F4] border border-[#EAE3DB] dark:border-[#461643] text-sm font-semibold transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#EC008C] fill-current" />
                <span>{t.hero.ctaPreview}</span>
              </a>
            </div>

            {/* Gwarancje zaufania */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#867A72] dark:text-[#A2958C]">
              {t.hero.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prawa kolumna: Wideo zwiastun */}
          <div className="lg:col-span-5 relative" id="zwiastun">
            <div className="relative rounded-3xl overflow-hidden bg-[#250A24] text-white p-3 shadow-2xl border border-[#461643]">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/80">
                <iframe
                  src={previewStreamUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title="HappyBirth Preview"
                />
              </div>

              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EC008C] block">
                    {lang === 'pl' ? 'Lekcja próbna' : lang === 'en' ? 'Sample Lesson' : 'Пробный урок'}
                  </span>
                  <div className="font-brand-display font-medium text-white text-sm sm:text-base mt-0.5">
                    {lang === 'pl' ? 'Pierwsza wizyta i USG w ciąży' : lang === 'en' ? 'First Ultrasound & Early Pregnancy' : 'Первый визит и УЗИ при беременности'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#370E35] text-[#EAD5E5] px-2.5 py-1 rounded-full font-mono text-[11px] shrink-0">
                  <Play className="w-3 h-3 fill-current text-[#FCD705]" />
                  <span>4K UHD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PASEK SPOŁECZNEGO DOWODU */}
      <section className="border-y border-[#EAE3DB] dark:border-[#3A1038] py-6 px-4 sm:px-6 bg-[#FAF7F2] dark:bg-[#1A0619]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
              18 000+
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#A2958C] mt-0.5">
              {t.hero.stats.rating}
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
              52
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#A2958C] mt-0.5">
              {t.hero.stats.lessons}
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
              15+ h
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#A2958C] mt-0.5">
              {t.hero.stats.hours}
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
              9
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#A2958C] mt-0.5">
              {t.hero.stats.modules}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WIDGET INTELIGENTNY: PATENT DNIA HAPPYBIRTH */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.tools.tipBadge}
          </span>
          <h2 className="font-brand-display font-medium text-2xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.tools.tipTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] max-w-xl mx-auto">
            {t.tools.tipDesc}
          </p>
        </div>

        <DailyTipCard />
      </section>

      {/* 4. 4 FILARY SPOKOJU */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="filary">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.pillars.tag}
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.pillars.title}
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#D7CCC3]">
            {t.pillars.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.pillars.items.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.num}
                className="p-6 rounded-3xl bg-white dark:bg-[#20081E] border border-[#EAE3DB] dark:border-[#461643] flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: pillar.bg, color: pillar.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#867A72] dark:text-[#A2958C]">
                      {pillar.num}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-[#FBF8F4]">
                      {pillar.title}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#EC008C] dark:text-[#F472B6]">
                      {pillar.subtitle}
                    </div>
                  </div>
                  <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <div className="text-xs font-semibold text-[#867A72] dark:text-[#A2958C] inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#EC008C]" />
            <span>
              {lang === 'pl'
                ? 'Autorski program edukacyjny opracowany we współpracy z certyfikowanymi edukatorami rodzicielstwa'
                : lang === 'en'
                ? 'Original educational curriculum developed with certified parenting and birth educators'
                : 'Авторская образовательная программа, разработанная совместно с сертифицированными экспертами'}
            </span>
          </div>
        </div>
      </section>

      {/* 5. 9 ETAPÓW PODRÓŻY */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="etapy">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.stages.tag}
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.stages.title}
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#D7CCC3]">
            {t.stages.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.stages.items.map((stage) => (
            <div
              key={stage.num}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#20081E] border border-[#EAE3DB] dark:border-[#461643] flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                style={{ backgroundColor: stage.color }}
              >
                {stage.num}
              </div>
              <div>
                <h4 className="font-brand-display font-bold text-sm sm:text-base text-[#1A1512] dark:text-[#FBF8F4]">
                  {stage.name}
                </h4>
                <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] mt-0.5 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NARZĘDZIA RODZINNE */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="narzedzia">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.tools.tag}
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.tools.title}
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#D7CCC3]">
            {t.tools.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#FAE3EB] dark:bg-[#341230] border border-[#F3CAD9] dark:border-[#52134C] space-y-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#EC008C] text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-[#FBF8F4]">
              {t.tools.card1Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              {t.tools.card1Desc}
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-[#EAD5E5] dark:bg-[#2A112F] border border-[#D5B8CF] dark:border-[#461643] space-y-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#98269C] text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-[#FBF8F4]">
              {t.tools.card2Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              {t.tools.card2Desc}
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-[#D0EBF3] dark:bg-[#0F2236] border border-[#B3DFEB] dark:border-[#1E3B5C] space-y-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#0088BC] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-[#FBF8F4]">
              {t.tools.card3Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              {t.tools.card3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 6B. ZAJRZYJ DO ŚRODKA: JAK WYGLĄDA PLATFORMA PO ZALOGOWANIU */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#FAF7F2] via-white to-[#FDF9F5] dark:from-[#220920] dark:via-[#1A0518] dark:to-[#160415] border border-[#EAE3DB] dark:border-[#461643] p-8 sm:p-12 shadow-xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
              {lang === 'pl' ? 'Przejrzysty i intuicyjny interfejs' : 'Clean and intuitive interface'}
            </span>
            <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
              {lang === 'pl' ? 'Wszystko w jednym miejscu. Na telefonie, laptopie i Smart TV' : 'Everything in one place. On mobile, desktop and Smart TV'}
            </h2>
            <p className="text-sm text-[#544A44] dark:text-[#D7CCC3]">
              {lang === 'pl'
                ? 'Zero chaosu, zero szukania w mailach. Logujesz się jednym kliknięciem (bez hasła) i natychmiast wracasz do momentu, w którym skończyliście.'
                : 'Zero chaos, no searching through emails. One-click passwordless login.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Karta 1: Kinowy Player 4K */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2A0D28] border border-[#EAE3DB] dark:border-[#461643] space-y-3 shadow-sm hover:border-[#EC008C] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#FAE3EB] dark:bg-[#3D1036] text-[#EC008C] flex items-center justify-center font-bold">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                52 Lekcje w Jakości 4K
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Krystaliczny obraz, profesjonalne ujęcia instruktarzowe, regulacja prędkości (1x, 1.25x, 1.5x) oraz zapamiętywanie momentu odtworzenia na każdym urządzeniu.
              </p>
            </div>

            {/* Karta 2: Licznik Skurczów SOS */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2A0D28] border border-[#EAE3DB] dark:border-[#461643] space-y-3 shadow-sm hover:border-[#EC008C] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D0EBF3] dark:bg-[#11273D] text-[#0088BC] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                Licznik Skurczów Porodowych SOS
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Zgodny ze szpitalną regułą 5-1-1. Jednym przyciskiem mierzycie czas trwania i częstotliwość fal, a algorytm podpowiada, kiedy czas ruszać na izbę przyjęć.
              </p>
            </div>

            {/* Karta 3: Dedykowana Strefa dla Taty */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#2A0D28] border border-[#EAE3DB] dark:border-[#461643] space-y-3 shadow-sm hover:border-[#EC008C] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#DFEED4] dark:bg-[#173016] text-[#347A22] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                Dedykowana Strefa dla Partnera
              </h3>
              <p className="text-xs text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Żadnego teoretyzowania. Konkretne wideo-ściągi: jak masować kość krzyżową, jak pomagać przy wstawaniu z wanny i co dokładnie zrobić w pierwszej dobie po powrocie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PORÓWNANIE: SZKOŁA TRADYCYJNA VS HAPPYBIRTH (Dwa Światy) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="porownanie">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] border border-[#F3CAD9] dark:border-[#52134C] text-xs font-semibold text-[#EC008C] dark:text-[#F472B6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.comparison.tag}</span>
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] dark:text-[#FBF8F4] leading-tight">
            {t.comparison.title1}{' '}
            <em className="font-brand-serif italic font-normal text-[#EC008C] dark:text-[#F472B6]">
              {t.comparison.titlePink}
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[#544A44] dark:text-[#D7CCC3] leading-relaxed max-w-2xl mx-auto">
            {t.comparison.desc}
          </p>
        </div>

        {/* Karty Porównawcze: Dwa Światy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Karta 1: Tradycyjna Szkoła Stacjonarna */}
          <div className="rounded-3xl bg-[#F6F2EC] dark:bg-[#20081E] border border-[#E5DFD7] dark:border-[#461643] p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-6">
              {/* Header Karty */}
              <div className="space-y-2 border-b border-[#E5DFD7] dark:border-[#461643] pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4DC] dark:bg-[#320C30] text-[#786D65] dark:text-[#EAD5E5]/70 text-xs font-semibold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.comparison.traditionalBadge}</span>
                </div>
                <h3 className="font-brand-display font-semibold text-2xl sm:text-3xl text-[#2C2420] dark:text-[#FBF8F4]">
                  {t.comparison.traditionalTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#786D65] dark:text-[#D7CCC3] leading-relaxed">
                  {t.comparison.traditionalSubtitle}
                </p>
              </div>

              {/* Lista punktów */}
              <ul className="space-y-4 text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3]">
                {t.comparison.traditionalPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-stone-200 dark:bg-white/10 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✕
                    </div>
                    <div>
                      <strong className="text-[#1A1512] dark:text-[#FBF8F4] block mb-0.5">
                        {pt.bold}
                      </strong>
                      <span className="text-[#786D65] dark:text-[#A2958C] leading-relaxed">
                        {pt.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E5DFD7] dark:border-[#461643] text-xs text-[#867A72] dark:text-[#A2958C] flex items-center justify-between">
              <span>{t.comparison.traditionalFoot1}</span>
              <span className="font-semibold">{t.comparison.traditionalFoot2}</span>
            </div>
          </div>

          {/* Karta 2: HappyBirth Online (Hero Lifestyle Card) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white via-[#FFFBFD] to-[#FDF2F7] dark:from-[#2A0B28] dark:via-[#20081E] dark:to-[#1A0518] border-2 border-[#EC008C] p-8 sm:p-10 shadow-2xl shadow-[#EC008C]/15 flex flex-col justify-between space-y-8 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#EC008C]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Karty */}
              <div className="space-y-2 border-b border-[#F3CAD9] dark:border-[#52134C] pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EC008C] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#FCD705]" />
                  <span>{t.comparison.happybirthBadge}</span>
                </div>
                <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512] dark:text-[#FBF8F4]">
                  {t.comparison.happybirthTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                  {t.comparison.happybirthSubtitle}
                </p>
              </div>

              {/* Lista punktów */}
              <ul className="space-y-4 text-xs sm:text-sm text-[#342D28] dark:text-[#EAD5E5]">
                {t.comparison.happybirthPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#1A1512] dark:text-[#FBF8F4] block mb-0.5">
                        {pt.bold}
                      </strong>
                      <span className="text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                        {pt.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dolna belka z przyciskiem w karcie */}
            <div className="relative z-10 pt-6 border-t border-[#F3CAD9] dark:border-[#52134C] mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#867A72] dark:text-[#A2958C] block">{t.comparison.priceLabel}</span>
                <span className="font-brand-display text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">{t.pricing.price}</span>
                <span className="text-xs text-[#EC008C] dark:text-[#F472B6] font-semibold ml-2">{t.comparison.priceSub}</span>
              </div>

              <BuyCourseButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 hover:scale-105 cursor-pointer">
                <span>{t.comparison.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </BuyCourseButton>
            </div>
          </div>
        </div>
      </section>

      {/* 8. KANAŁY SPOŁECZNOŚCIOWE I DOWÓD SPOŁECZNY */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#250A24] via-[#350B32] to-[#1C051A] text-white p-6 sm:p-10 border border-[#461643] shadow-xl space-y-6">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
              {lang === 'pl' ? 'Nasza Społeczność Rodziców' : lang === 'en' ? 'Our Parent Community' : 'Наше сообщество'}
            </span>
            <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-white">
              {lang === 'pl' ? 'Codzienne patenty, wiedza i wsparcie w social mediach' : lang === 'en' ? 'Daily tips, advice and warm support on social media' : 'Ежедневные лайфхаки и поддержка в соцсетях'}
            </h3>
            <p className="text-xs sm:text-sm text-[#EAD5E5]/80 max-w-2xl">
              {lang === 'pl'
                ? 'Dołącz do ponad 18 000 rodziców. Oglądaj krótkie triki położnych, kulisy nagrań oraz zadawaj pytania naszym ekspertkom w relacjach na żywo.'
                : 'Join over 18,000 parents. Watch quick midwife hacks, behind-the-scenes, and ask questions during live Q&As.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Instagram */}
            <a
              href="https://instagram.com/happybirth.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#EC008C] hover:bg-white/10 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#EC008C]/20 text-[#EC008C] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#EAD5E5]/60 group-hover:text-white">@happybirth.pl</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-white">Instagram</div>
                <p className="text-[11px] text-[#EAD5E5]/70 mt-0.5">Codzienne Q&A z położnymi i relacje</p>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@happybirth_pl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ADEF] hover:bg-white/10 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#00ADEF]/20 text-[#00ADEF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47 6.14 6.14 0 0 0 1.83-4.47V8.62a8.27 8.27 0 0 0 4.89 1.57V6.76c-.33 0-.66-.02-.99-.07z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-[#EAD5E5]/60 group-hover:text-white">@happybirth_pl</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-white">TikTok</div>
                <p className="text-[11px] text-[#EAD5E5]/70 mt-0.5">Szybkie wideo-triki i patenty wyprawkowe</p>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@happybirth_pl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ED1C24] hover:bg-white/10 transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-mono text-[#EAD5E5]/60 group-hover:text-white">@happybirth_pl</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-white">YouTube</div>
                <p className="text-[11px] text-[#EAD5E5]/70 mt-0.5">Darmowe lekcje demonstracyjne i wywiady</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 9. OPINIE RODZICÓW */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="opinie">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.testimonials.tag}
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#20081E] border border-[#EAE3DB] dark:border-[#461643] flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed italic">
                  &bdquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE3DB] dark:border-[#3A1038] mt-4">
                <div className="font-bold text-xs text-[#1A1512] dark:text-[#FBF8F4]">
                  {item.author}
                </div>
                <div className="text-[11px] text-[#867A72] dark:text-[#A2958C]">
                  {item.role} · {item.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ: CZYSTE HARMONIJKI (ACCORDION) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.faq.tag}
          </span>
          <h2 className="font-brand-display font-medium text-2xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.faq.title}
          </h2>
        </div>

        <div className="divide-y divide-[#EAE3DB] dark:divide-[#3A1038] bg-white dark:bg-[#20081E] rounded-3xl border border-[#EAE3DB] dark:border-[#461643] p-6 sm:p-10 shadow-sm">
          {t.faq.items.map((f, idx) => (
            <details key={f.q} className="py-5 group" open={idx === 0}>
              <summary className="font-brand-display font-medium text-base sm:text-lg text-[#1A1512] dark:text-[#FBF8F4] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{f.q}</span>
                <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-[#250A24] flex items-center justify-center text-xs text-[#867A72] dark:text-[#A2958C] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 11. CENA & GWARANCJA (FINAL CTA) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center" id="cena">
        <div className="rounded-3xl bg-gradient-to-br from-[#250A24] via-[#3B1038] to-[#20071F] text-white p-8 sm:p-12 border border-[#461643] shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#EAD5E5]">
            <span>{t.pricing.badge}</span>
          </div>

          <h2 className="font-brand-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            {t.pricing.title}
          </h2>

          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-extrabold text-[#FCD705] font-mono">
              {t.pricing.price}
            </div>
            <div className="text-xs text-[#EAD5E5]/70">
              {t.pricing.unit}
            </div>
          </div>

          <div className="pt-2">
            <BuyCourseButton className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-base font-semibold shadow-xl shadow-[#EC008C]/30 hover:scale-105 transition-all cursor-pointer">
              <span>{t.pricing.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </BuyCourseButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#EAD5E5]/80 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[#FCD705]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BLIK · Przelewy24 · Karta</span>
            </span>
            <span>·</span>
            <span>Dostęp natychmiastowy 24/7 dla dwojga</span>
            <span>·</span>
            <span>Faktura VAT 23% na życzenie</span>
          </div>

          <p className="text-[11px] text-[#EAD5E5]/60 max-w-md mx-auto">
            {t.pricing.guarantee}
          </p>

          {/* Pasek Pelerynki Edukacyjnej */}
          <div className="pt-2 border-t border-white/10">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center max-w-xl mx-auto space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FCD705]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.pricing.statusBadge}</span>
              </div>
              <p className="text-[11px] text-[#EAD5E5]/75 leading-relaxed">
                {t.pricing.statusText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
