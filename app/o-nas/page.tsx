'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, Award, Users } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] selection:bg-[#EC008C]/20 transition-colors">
      {/* Top Header */}
      <header className="border-b border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4]/95 dark:bg-[#1A0619]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group text-sm font-semibold text-[#544A44] dark:text-[#EAD5E5] hover:text-[#DA0271]">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Wróć do strony głównej</span>
          </Link>

          <Link href="/" className="shrink-0">
            <Logo className="h-9 w-auto object-contain" priority />
          </Link>

          <Link
            href="/#cena"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white text-xs sm:text-sm font-bold transition-all shadow-none"
          >
            <span>Dołącz do kursu · 489 zł</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] border border-[#F3CAD9] dark:border-[#52134C] text-xs font-semibold text-[#EC008C] dark:text-[#F472B6]">
            <Heart className="w-3.5 h-3.5" />
            <span>Dyplomowane ekspertki i ponad dekada doświadczenia</span>
          </div>

          <h1 className="font-brand-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1512] dark:text-[#FBF8F4]">
            Opieka, spokój i rzetelna wiedza dla Ciebie
          </h1>

          <p className="text-base sm:text-lg text-[#544A44] dark:text-[#D7CCC3] leading-relaxed max-w-2xl mx-auto">
            HappyBirth powstało z myślą o kobietach, które w ciąży szukają spokojnego przewodnika, wolnego od chaosu forów internetowych i bez niepotrzebnego straszenia.
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
              Merytoryczną bazą HappyBirth jest szkoła rodzenia Mama Gaja z Poznania, która od ponad 12 lat wspiera tysiące kobiet w ciąży i młodych mam.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1512] dark:text-[#FBF8F4]">Dyplomowane położne</h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Wszystkie lekcje zostały nagrane z czynnymi zawodowo położnymi, certyfikowanymi doradczyniami laktacyjnymi oraz fizjoterapeutkami uroginekologicznymi.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#1E081C] p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1512] dark:text-[#FBF8F4]">Praktyka i szacunek</h2>
            <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
              Nie oceniamy Twoich wyborów. Tłumaczymy standardy medyczne, prawa pacjentki i dajemy Ci narzędzia, byś czuła się bezpiecznie w szpitalu i w domu.
            </p>
          </div>
        </div>

        {/* Dane rejestrowe podmiotu */}
        <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4] dark:bg-[#1C081A] p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3]">
          <h3 className="font-bold text-[#1A1512] dark:text-[#FBF8F4] text-base">
            Dane wydawcy platformy
          </h3>
          <p className="leading-relaxed">
            Usługodawcą i administratorem platformy HappyBirth jest <strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong> z siedzibą w Poznaniu, ul. Śląska 14, 60-614 Poznań.
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
