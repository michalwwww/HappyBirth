import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'O nas i Ekspertki Szkoły Rodzenia Mama Gaja · HappyBirth.pl',
  description:
    'Poznaj zespół dyplomowanych położnych, doradczyń laktacyjnych i fizjoterapeutek uroginekologicznych z poznańskiej szkoły rodzenia Mama Gaja (działającej od 2012 r.). Operator prawny: KLARSOLUTIONS Sp. z o.o. (KRS 0001268396).',
};

/**
 * [A1] + [A2] + [A6] Server Component (SSR/SSG) dla podstrony /o-nas
 * Zawiera biogramy i kwalifikacje ekspertek Mama Gaja, pełne dane operatora KLARSOLUTIONS Sp. z o.o.,
 * parametry oferty (489,00 zł brutto, 18 miesięcy / 548 dni od zakupu) oraz znaczniki Schema.org
 * (Organization, Person, Course, FAQPage) w surowym kodzie HTML.
 */
export default function AboutPage() {
  const experts = [
    {
      name: 'Zespół Położnych Klinicznych i Środowiskowych Mama Gaja',
      role: 'Dyplomowane Położne (Moduły 1, 2, 4, 5, 6, 7)',
      credentials: 'Prawo Wykonywania Zawodu Położnej · Ponad 12 lat praktyki na sali porodowej i w edukacji okołoporodowej (od 2012 r.)',
      bio: 'Czynne zawodowo położne z poznańskiej szkoły rodzenia Mama Gaja, które od 2012 roku przygotowały do porodu i rodzicielstwa ponad 18 000 rodzin. W kursie prowadzą przyszłych rodziców przez fizjologię ciąży, aktywny poród, pozycje wertykalne, rolę partnera oraz kąpiel i pierwszą pomoc u noworodka.',
    },
    {
      name: 'Specjalistki Fizjoterapii Uroginekologicznej Mama Gaja',
      role: 'Fizjoterapeutki Uroginekologiczne (Moduły 3, 5, 6)',
      credentials: 'Magister Fizjoterapii · Certyfikowane terapeutki uroginekologiczne i okołoporodowe',
      bio: 'Odpowiadają za bezpieczną aktywność w ciąży, odciążanie kręgosłupa i miednicy, przygotowanie mięśni dna miednicy do porodu, pracę z oddechem przeponowym oraz bezpieczną regenerację poporodową (mobilizacja blizny i kontrola rozejścia mięśnia prostego brzucha).',
    },
    {
      name: 'Certyfikowane Doradczynie Laktacyjne (CDL) Mama Gaja',
      role: 'Specjalistki Laktacji i Żywienia Noworodka (Moduły 7, 8)',
      credentials: 'Dyplomowane Położne i Doradczynie Laktacyjne',
      bio: 'Przekazują praktyczną wiedzę o pierwszej godzinie po narodzinach, prawidłowej technice głębokiego przystawiania dziecka do piersi, wygodnych pozycjach do karmienia, dbaniu o komfort brodawek oraz spokojnym radzeniu sobie z nawałem pokarmu i wieczornym niepokojem maluszka.',
    },
  ];

  const schemaOrgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://happybirth.pl/#organizacja',
        name: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
        alternateName: ['KLARSOLUTIONS Sp. z o.o.', 'HappyBirth.pl', 'Szkoła Rodzenia Mama Gaja Online'],
        url: 'https://happybirth.pl',
        email: 'kontakt@happybirth.pl',
        taxID: '7812118273',
        vatID: 'PL7812118273',
        foundingDate: '2012',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Śląska 14',
          postalCode: '60-614',
          addressLocality: 'Poznań',
          addressCountry: 'PL',
        },
      },
      ...experts.map((exp, idx) => ({
        '@type': 'Person',
        '@id': `https://happybirth.pl/o-nas#ekspertka-${idx + 1}`,
        name: exp.name,
        jobTitle: exp.role,
        description: `${exp.credentials}. ${exp.bio}`,
        worksFor: { '@id': 'https://happybirth.pl/#organizacja' },
      })),
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Kto przygotował merytorycznie kurs HappyBirth.pl?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Wszystkie 52 lekcje wideo 4K zostały nagrane z dyplomowanymi położnymi, certyfikowanymi doradczyniami laktacyjnymi i fizjoterapeutkami uroginekologicznymi z poznańskiej szkoły rodzenia Mama Gaja, działającej nieprzerwanie od 2012 roku.',
            },
          },
          {
            '@type': 'Question',
            name: 'Kto jest operatorem prawnym platformy HappyBirth.pl?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Operatorem prawnym i sprzedawcą jest KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Poznaniu, ul. Śląska 14, 60-614 Poznań (KRS: 0001268396, NIP: 7812118273, REGON: 545782779).',
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] border border-[#F3CAD9] dark:border-[#52134C] text-xs font-semibold text-[#EC008C] dark:text-[#F472B6]">
            <Heart className="w-3.5 h-3.5" />
            <span>Szkoła Rodzenia Mama Gaja (od 2012 r.) · Ponad 18 000 przygotowanych rodzin</span>
          </div>

          <h1 className="font-brand-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1512] dark:text-[#FBF8F4]">
            Opieka ekspertek, spokój i rzetelna wiedza medyczna dla Waszej rodziny
          </h1>

          <p className="text-base sm:text-lg text-[#544A44] dark:text-[#D7CCC3] leading-relaxed max-w-2xl mx-auto">
            HappyBirth.pl powstało z połączenia 14-letniego dorobku stacjonarnej szkoły rodzenia <strong>Mama Gaja z Poznania</strong> z nowoczesną formą micro-learningu w jakości 4K. Oferujemy <strong>52 lekcje (288 min) w 8 modułach</strong> z dostępem na aż <strong>18 miesięcy (548 dni) od momentu zakupu</strong> w jednorazowej cenie <strong>489,00 zł brutto</strong>.
          </p>
        </div>

        {/* 3 filary zaufania */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1512] dark:text-[#FBF8F4]">Doświadczenie od 2012 roku</h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Merytoryczną bazą HappyBirth.pl jest poznańska szkoła rodzenia Mama Gaja, w której do narodzin dziecka przygotowało się już ponad 18 000 rodzin.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1512] dark:text-[#FBF8F4]">18 miesięcy dostępu i 0% reklam</h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Jako jedyni dajemy aż 18 miesięcy (548 dni) dostępu od zakupu — na całą ciążę, poród, połóg i pełny pierwszy rok życia maluszka, bez ukrytego lokowania suplementów.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1512] dark:text-[#FBF8F4]">Standard Opieki Okołoporodowej</h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Program jest w 100% zgodny z aktualnym polskim Standardem Organizacyjnym Opieki Okołoporodowej. Wspiera przyszłych rodziców wiedzą praktyczną, nie zastępując opieki lekarza ani położnej.
            </p>
          </div>
        </div>

        {/* Biogramy i kwalifikacje zespołu eksperckiego Mama Gaja */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DA0271]">
              <GraduationCap className="w-4 h-4" />
              <span>Kadra dydaktyczna i kliniczna</span>
            </div>
            <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
              Zespół ekspertek Szkoły Rodzenia Mama Gaja
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {experts.map((exp, idx) => (
              <article
                key={idx}
                className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 sm:p-8 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
                    {exp.name}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] dark:text-[#FF4BA8] text-xs font-bold">
                    {exp.role}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{exp.credentials}</span>
                </p>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                  {exp.bio}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Dane rejestrowe podmiotu */}
        <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1C081A] p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3]">
          <h3 className="font-bold text-[#1A1512] dark:text-[#FBF8F4] text-base">
            Oficjalne dane operatora prawnego i wydawcy platformy
          </h3>
          <p className="leading-relaxed">
            Usługodawcą, właścicielem i administratorem platformy HappyBirth.pl jest <strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong> z siedzibą w Poznaniu, ul. Śląska 14, 60-614 Poznań, wpisana do rejestru przedsiębiorców przez Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego, o kapitale zakładowym 5 000,00 PLN.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-[#867A72] dark:text-[#A2958C]">
            <div>KRS: 0001268396</div>
            <div>NIP: 7812118273</div>
            <div>REGON: 545782779</div>
            <div>Kontakt: kontakt@happybirth.pl</div>
          </div>
        </div>
      </main>
    </div>
  );
}
