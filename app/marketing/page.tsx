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

      {/* 7. PORÓWNANIE: SZKOŁA TRADYCYJNA VS HAPPYBIRTH */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C] dark:text-[#F472B6]">
            {t.comparison.tag}
          </span>
          <h2 className="font-brand-display font-medium text-2xl sm:text-3xl text-[#1A1512] dark:text-[#FBF8F4]">
            {t.comparison.title}
          </h2>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#20081E] border border-[#EAE3DB] dark:border-[#461643] overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-[#F6F2EC] dark:bg-[#250A24] p-4 text-xs font-bold uppercase tracking-wider border-b border-[#EAE3DB] dark:border-[#3A1038]">
            <div className="col-span-4 text-[#867A72] dark:text-[#A2958C]">{t.comparison.colFeature}</div>
            <div className="col-span-4 text-[#867A72] dark:text-[#A2958C]">{t.comparison.colTraditional}</div>
            <div className="col-span-4 text-[#EC008C] dark:text-[#F472B6]">{t.comparison.colHappyBirth}</div>
          </div>

          {t.comparison.items.map((item, idx) => (
            <div
              key={item.feature}
              className={`grid grid-cols-12 p-4 text-xs items-center gap-2 border-b border-[#EAE3DB]/50 dark:border-[#3A1038]/50 last:border-b-0 ${
                idx % 2 === 1 ? 'bg-[#FAF7F2] dark:bg-white/[0.02]' : ''
              }`}
            >
              <div className="col-span-4 font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
                {item.feature}
              </div>
              <div className="col-span-4 text-[#867A72] dark:text-[#A2958C]">
                {item.traditional}
              </div>
              <div className="col-span-4 font-semibold text-[#EC008C] dark:text-[#F472B6]">
                {item.happybirth}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SOCIAL MEDIA STRIP: INSTAGRAM */}
      <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#250A24] to-[#3B1038] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#461643] shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs text-[#EC008C] font-semibold">
              <Instagram className="w-4 h-4" />
              <span>@happybirth.pl</span>
            </div>
            <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
              {lang === 'pl' ? 'Bądźmy w kontakcie na Instagramie' : lang === 'en' ? 'Stay connected on Instagram' : 'Оставайтесь на связи в Instagram'}
            </h3>
            <p className="text-xs text-[#EAD5E5]/80 max-w-md">
              {lang === 'pl'
                ? 'Codzienne patenty, kulisy nagrań i ciepłe wsparcie dla naszych mam i ojców. Napisz do nas w DM!'
                : lang === 'en'
                ? 'Daily tips, behind-the-scenes, and supportive advice for growing families. Drop us a DM!'
                : 'Ежедневные лайфхаки, закулисье съемок и поддержка будущих родителей. Пишите нам в DM!'}
            </p>
          </div>

          <a
            href="https://instagram.com/happybirth.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 shrink-0"
          >
            {lang === 'pl' ? 'Obserwuj @happybirth.pl' : lang === 'en' ? 'Follow @happybirth.pl' : 'Подписаться @happybirth.pl'}
          </a>
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
