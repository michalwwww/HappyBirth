import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { lessons } from '@/lib/course-data';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Program kursu: 52 lekcje 4K w 8 modułach (288 min) · HappyBirth.pl',
  description:
    'Pełny program Szkoły Rodzenia Online HappyBirth.pl: 52 lekcje wideo 4K (288 min) w 8 modułach nagrane z położnymi i ekspertkami ze szkoły Mama Gaja w Poznaniu. Cena 489,00 zł brutto, dostęp na 18 miesięcy (548 dni) od momentu zakupu.',
};

/**
 * [A2] + [A5] + [A6] Server Component (SSR/SSG) dla podstrony /program
 * Zawiera pełny spis 52 lekcji, opis 8 modułów (288 min), cenę 489,00 zł brutto,
 * okres 18 miesięcy (548 dni) od zakupu oraz znaczniki Schema.org (Course, Organization, FAQPage)
 * w 100% widoczne w surowym kodzie HTML dla crawlerów i wyszukiwarek AI.
 */
export default function ProgramPage() {
  const modules = [
    {
      nr: 1,
      stageLabel: 'Etap I: Tydz. 1–13 („Dwie kreski”)',
      title: 'Twoja ciąża tydzień po tygodniu',
      meta: '5 lekcji · 18 min',
      color: '#DA0271',
      desc: 'Jak zmienia się Twoje ciało i jak rozwija się maluszek trymestr po trymestrze. Pierwsze decyzje, emocje, dzielenie się nowiną i przełamywanie popularnych mitów.',
      lessons: lessons.slice(0, 5),
    },
    {
      nr: 2,
      stageLabel: 'Etap I: Tydz. 1–13 („Dwie kreski”)',
      title: 'Zdrowie, profilaktyka i samopoczucie',
      meta: '7 lekcji · 34 min',
      color: '#DA0271',
      desc: 'Kompletny kalendarz badań, codzienne nawyki wspierające odporność, samopoczucie oraz sygnały Twojego organizmu, które warto znać wcześniej.',
      lessons: lessons.slice(5, 12),
    },
    {
      nr: 3,
      stageLabel: 'Etap II: Tydz. 14–27 („Wreszcie lepiej”)',
      title: 'Komfort i aktywność na co dzień',
      meta: '6 lekcji · 38 min',
      color: '#FECB22',
      desc: 'Zdrowy sen, bezpieczny ruch, ćwiczenia z fizjoterapeutką odciążające kręgosłup i miednicę, podróże oraz bezpieczne funkcjonowanie na co dzień.',
      lessons: lessons.slice(12, 18),
    },
    {
      nr: 4,
      stageLabel: 'Etap III: Tydz. 28–poród („Torba spakowana”)',
      title: 'Projekt „Gniazdo”, wyprawka i kącik',
      meta: '7 lekcji · 44 min',
      color: '#E87322',
      desc: 'Świadome zakupy bez marketingowego chaosu: bezpieczny wózek, fotelik samochodowy, łóżeczko, materacyk, domowa apteczka oraz lista ubranek na start.',
      lessons: lessons.slice(18, 25),
    },
    {
      nr: 5,
      stageLabel: 'Etap III: Tydz. 28–poród (Filar Porodu)',
      title: 'Godzina „Zero”, aktywny poród',
      meta: '9 lekcji · 54 min',
      color: '#E87322',
      desc: 'Praktyczny plan porodu, zwiastuny rozpoczęcia akcji, pakowanie torby do szpitala, okresy porodu, oddech przeponowy, pozycje wertykalne i wsparcie osoby towarzyszącej.',
      lessons: lessons.slice(25, 34),
    },
    {
      nr: 6,
      stageLabel: 'Etap IV: Po porodzie („Pierwszy rok”)',
      title: 'Połóg, regeneracja i fizjoterapia',
      meta: '5 lekcji · 32 min',
      color: '#0097DB',
      desc: 'Pierwsze tygodnie po porodzie: fizjologia połogu, czuła regeneracja, emocje (Baby Blues), bezpieczny powrót do sprawności i szczere doświadczenia innych mam.',
      lessons: lessons.slice(34, 39),
    },
    {
      nr: 7,
      stageLabel: 'Etap IV: Po porodzie („Pierwszy rok”)',
      title: 'Opieka nad noworodkiem i bezpieczeństwo',
      meta: '9 lekcji · 44 min',
      color: '#0097DB',
      desc: 'Pierwsze dni maluszka, instruktaż kąpieli krok po kroku, pielęgnacja pępka i skóry, zasady bezpiecznego snu, profilaktyka zdrowotna i pierwsza pomoc.',
      lessons: lessons.slice(39, 48),
    },
    {
      nr: 8,
      stageLabel: 'Etap IV: Po porodzie („Pierwszy rok”)',
      title: 'Karmienie, laktacja i wsparcie',
      meta: '4 lekcje · 24 min',
      color: '#0097DB',
      desc: 'Technika prawidłowego przystawienia do piersi, wygodne pozycje, komfort brodawek, dobór akcesoriów i laktatora oraz sposoby na spokojniejsze wieczory.',
      lessons: lessons.slice(48, 52),
    },
  ];

  const schemaOrgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://happybirth.pl/#organizacja',
        name: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
        alternateName: 'HappyBirth.pl — Szkoła Rodzenia Online (Mama Gaja)',
        url: 'https://happybirth.pl',
        email: 'kontakt@happybirth.pl',
        taxID: '7812118273',
        vatID: 'PL7812118273',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Śląska 14',
          postalCode: '60-614',
          addressLocality: 'Poznań',
          addressCountry: 'PL',
        },
      },
      {
        '@type': 'Course',
        '@id': 'https://happybirth.pl/#kurs',
        name: 'HappyBirth.pl — Szkoła Rodzenia Online dla Dwojga (52 lekcje 4K w 8 modułach)',
        description:
          'Kompleksowy kurs szkoły rodzenia online nagrany z dyplomowanymi położnymi, doradczyniami laktacyjnymi i fizjoterapeutkami ze szkoły Mama Gaja w Poznaniu (od 2012 r.): 52 lekcje wideo 4K (288 minut) w 8 modułach + Notatnik Rodzica PDF. Dostęp na 18 miesięcy (548 dni) od momentu zakupu.',
        provider: { '@id': 'https://happybirth.pl/#organizacja' },
        inLanguage: 'pl',
        timeRequired: 'PT4H48M',
        numberOfCredits: 52,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT4H48M',
          inLanguage: 'pl',
        },
        offers: {
          '@type': 'Offer',
          price: '489.00',
          priceCurrency: 'PLN',
          availability: 'https://schema.org/InStock',
          validFrom: '2026-10-01',
          url: 'https://happybirth.pl/#cena',
          description: 'Płatność jednorazowa 489,00 zł brutto (23% VAT). Dostęp na 18 miesięcy (548 dni) od zakupu dla kursantki i partnera.',
        },
        syllabusSections: modules.map((m) => ({
          '@type': 'Syllabus',
          name: `Moduł ${m.nr}: ${m.title} (${m.meta})`,
          description: m.desc,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Ile trwa dostęp do kursu HappyBirth.pl i ile kosztuje?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kurs kosztuje 489,00 zł brutto (płatność jednorazowa, brak abonamentu), a pełny dostęp do wszystkich 52 lekcji 4K w 8 modułach (288 min) trwa 18 miesięcy (548 dni) od momentu zakupu — obejmuje również bezpłatny dostęp dla partnera.',
            },
          },
          {
            '@type': 'Question',
            name: 'Z ilu modułów i lekcji składa się program HappyBirth.pl?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Program obejmuje 8 modułów podzielonych na 4 etapy fizjologiczne (od I trymestru ciąży, przez poród i połóg, aż po pierwszy rok życia dziecka) — łącznie 52 lekcje wideo 4K o łącznym czasie 288 minut (~5 godzin) oraz Notatnik Rodzica PDF.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] selection:bg-[#EC008C]/20 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJsonLd) }}
      />

      {/* Top Header */}
      <header className="border-b border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4]/95 dark:bg-[#1A0619]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group text-sm font-semibold text-[#544A44] dark:text-[#EAD5E5] hover:text-[#DA0271]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Wróć do strony głównej</span>
          </Link>

          <Link href="/" className="shrink-0">
            <Logo className="h-9 w-auto object-contain" priority />
          </Link>

          <Link
            href="/#cena"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white text-xs sm:text-sm font-bold transition-all"
          >
            <span>Dołącz do kursu · 489,00 zł</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] border border-[#F3CAD9] dark:border-[#52134C] text-xs font-semibold text-[#EC008C] dark:text-[#F472B6]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pełny program merytoryczny · 8 Modułów · 52 Lekcje 4K · 288 Minut</span>
          </div>

          <h1 className="font-brand-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1512] dark:text-[#FBF8F4]">
            52 filmowe lekcje 4K w 8 modułach tematycznych (288 min)
          </h1>

          <p className="text-base sm:text-lg text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
            Nagrane z dyplomowanymi położnymi, doradczyniami laktacyjnymi i fizjoterapeutkami z poznańskiej szkoły rodzenia <strong>Mama Gaja (od 2012 r.)</strong>. Wszystkie 52 lekcje otrzymujesz odblokowane od pierwszego dnia na <strong>18 miesięcy (548 dni) od momentu zakupu</strong> — wraz z bezpłatnym dostępem dla partnera.
          </p>
        </div>

        {/* Lista 8 modułów */}
        <div className="space-y-8">
          {modules.map((mod) => (
            <section
              key={mod.nr}
              id={`modul-${mod.nr}`}
              className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 sm:p-8 space-y-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3DB] dark:border-[#3A1038]">
                <div className="space-y-1">
                  <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                    <span>Moduł {mod.nr} z 8</span>
                    <span>·</span>
                    <span>{mod.stageLabel}</span>
                    <span>·</span>
                    <span className="text-[#867A72] dark:text-[#A2958C]">{mod.meta}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
                    {mod.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                {mod.desc}
              </p>

              {/* Lista lekcji w module */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FBF8F4] dark:bg-[#260A24] border border-[#EAE3DB]/80 dark:border-[#461643] text-sm"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A0619] border border-[#EAE3DB] dark:border-[#461643] text-xs font-bold flex items-center justify-center shrink-0 text-[#DA0271]">
                        {lesson.lessonNumber}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#1A1512] dark:text-[#FBF8F4]">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-[#867A72] dark:text-[#A2958C]">
                          {lesson.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#867A72] dark:text-[#A2958C] shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lesson.durationFormatted}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Dolna karta CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-[#250A24] via-[#350E34] to-[#1F071D] text-white p-8 sm:p-12 text-center space-y-6 border border-[#461643]">
          <h2 className="text-2xl sm:text-4xl font-bold font-brand-display">
            Zyskaj pełny dostęp do wszystkich 52 lekcji na 18 miesięcy
          </h2>
          <p className="text-sm sm:text-base text-[#EAD5E5] max-w-2xl mx-auto leading-relaxed">
            Jednorazowa opłata <strong>489,00 zł brutto</strong> (bez subskrypcji). Dostęp na <strong>18 miesięcy (548 dni) od momentu zakupu</strong> dla Ciebie i Twojego partnera na telefonie, komputerze oraz Smart TV.
          </p>
          <div>
            <Link
              href="/#cena"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white font-bold text-base transition-all"
            >
              <span>Zadbaj o swój spokój · 489,00 zł (18 mies. dostępu)</span>
            </Link>
          </div>
          <div className="text-xs text-[#EAD5E5]/70 flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Operator prawny: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · NIP: 7812118273 · KRS: 0001268396</span>
          </div>
        </div>
      </main>
    </div>
  );
}
