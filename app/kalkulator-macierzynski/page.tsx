import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calculator, Lock, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';
import { MaternityLeaveCalculator } from '@/components/maternity-leave-calculator';

export const metadata: Metadata = {
  title: 'Kalkulator Urlopu i Zasiłku Macierzyńskiego 2026 (81,5% vs 100%/70%) · HappyBirth.pl',
  description:
    'Bezpłatny kalkulator urlopu macierzyńskiego i rodzicielskiego 2026. Porównaj wariant 81,5% z 100% + 70%, zaplanuj 9 tygodni dla drugiego rodzica i 2 tygodnie ojcowskiego. Działa lokalnie w przeglądarce bez rejestracji.',
  category: 'education',
  alternates: {
    canonical: 'https://happybirth.pl/kalkulator-macierzynski',
  },
  openGraph: {
    title: 'Kalkulator Macierzyńskiego i Rodzicielskiego 2026 · HappyBirth.pl',
    description:
      'Porównaj zasiłek 81,5% vs 100% + 70% oraz 9 tygodni urlopu dla drugiego rodzica. 100% lokalnie w przeglądarce.',
    url: 'https://happybirth.pl/kalkulator-macierzynski',
    siteName: 'HappyBirth.pl',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function KalkulatorMacierzynskiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://happybirth.pl/kalkulator-macierzynski#app',
        name: 'Kalkulator Urlopu i Zasiłku Macierzyńskiego 2026 HappyBirth.pl',
        url: 'https://happybirth.pl/kalkulator-macierzynski',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PLN',
        },
        provider: {
          '@type': 'Organization',
          name: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
          taxID: '7812118273',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'HappyBirth.pl',
            item: 'https://happybirth.pl/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Kalkulator Macierzyńskiego 2026',
            item: 'https://happybirth.pl/kalkulator-macierzynski',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Header */}
      <header className="border-b border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4]/95 dark:bg-[#1A0619]/95 sticky top-0 z-40 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" priority />
            <div className="border-l border-[#EAE3DB] dark:border-[#3A1038] pl-2.5">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] dark:text-white block leading-none">
                Kalkulator Macierzyńskiego 2026
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#0097DB] font-bold">
                Pracownia Formalności · 100% w przeglądarce
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#544A44] dark:text-[#EAD5E5] hover:text-[#DA0271] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do HappyBirth.pl</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Hero wprowadzające z kadrem redakcyjnym */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] dark:bg-[#09273B] border border-[#7DD3FC]/60 text-xs font-bold text-[#0C4A6E] dark:text-[#7DD3FC]">
              <Calculator className="w-3.5 h-3.5" />
              <span>Polskie zasady urlopów i zasiłków 2026 · Bez rejestracji</span>
            </div>

            <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] dark:text-white tracking-tight leading-[1.08]">
              Urlop macierzyński i rodzicielski{' '}
              <em className="font-brand-serif italic font-normal text-[#0097DB]">
                81,5% czy 100% + 70%?
              </em>
            </h1>

            <p className="text-sm sm:text-base text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Policzcie wspólnie wysokość miesięcznego zasiłku, sprawdźcie zasadę 21 dni na długi wniosek oraz podział wspólnej puli i <strong>9 tygodni nieprzenoszalnego urlopu dla drugiego rodzica</strong> — wszystko natychmiast na ekranie.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-[#544A44] dark:text-[#C4ADC0]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                Zero wysyłki kwot na serwer
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0097DB]" />
                Uwzględnia etat, JDG i Kosiniakowe
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hb-kadr-editorial hb-kadr-ramka aspect-[4/3]">
              <img
                src="/img/editorial/hb-mama-nauka-online-laptop-dom.jpg"
                alt="Przyszła mama spokojnie planuje budżet i uczy się w domu na laptopie"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Kalkulator */}
        <MaternityLeaveCalculator />
      </main>

      {/* Stopka */}
      <footer className="border-t border-[#EAE3DB] dark:border-[#3A1038] py-8 px-4 sm:px-6 text-center text-xs text-[#867A72] dark:text-[#A2958C] space-y-2 print:hidden">
        <p>
          KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ · ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link href="/" className="hover:text-[#DA0271] underline">
            Strona główna (489,00 zł · 18 miesięcy / 548 dni)
          </Link>
          <Link href="/dla-ciebie" className="hover:text-[#DA0271] underline">
            Dla Ciebie · Baza Wiedzy
          </Link>
          <Link href="/plan-porodu" className="hover:text-[#DA0271] underline">
            Plan Porodu PDF
          </Link>
          <Link href="/kalkulator-wyprawki" className="hover:text-[#DA0271] underline">
            Kalkulator Wyprawki PDF
          </Link>
          <Link href="/regulamin" className="hover:text-[#DA0271] underline">
            Regulamin
          </Link>
          <Link href="/polityka-prywatnosci" className="hover:text-[#DA0271] underline">
            Polityka prywatności
          </Link>
        </div>
      </footer>
    </div>
  );
}
