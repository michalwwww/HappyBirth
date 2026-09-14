import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Heart,
  Activity,
  Feather,
  Baby,
  Scale,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Standard Merytoryczny & E-E-A-T · Strefa HappyBirth',
  description:
    'Podstawy merytoryczne i prawne szkoły rodzenia HappyBirth: dorobek położnych Mama Gaja od 2012 r., Standard Opieki Okołoporodowej MZ, Ustawa o zawodach pielęgniarki i położnej oraz 4 Filary Spokoju.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function StandardMedycznyPage() {
  const fourPillars = [
    {
      num: '01',
      title: 'Filar I: Poród & Oddech',
      field: 'Położnictwo Fizjologiczne & Biomechanika',
      desc: 'Prowadzenie aktywnego porodu, pozycje wertykalne odciążające kręgosłup i ułatwiające wstawianie się główki w kanał rodny, ochrona tkanek krocza, techniki oddechowe i niefarmakologiczne łagodzenie bólu skurczowego.',
      ground: 'Standard Opieki Okołoporodowej (Rozp. MZ) – naturalny poród fizjologiczny.',
      icon: Feather,
      color: '#EC008C',
      bg: '#FAE3EB',
    },
    {
      num: '02',
      title: 'Filar II: Ciało & Dno Miednicy',
      field: 'Fizjoterapia Uroginekologiczna',
      desc: 'Przygotowanie mięśni dna miednicy, profilaktyka rozejścia mięśnia prostego brzucha (kresa biała), techniki masażu krzyżowego dla partnera, mobilizacja miednicy w trakcie skurczu oraz bezpieczna regeneracja w połogu.',
      ground: 'Zgodność z wytycznymi fizjoterapii okołoporodowej i profilaktyki dysfunkcji miednicy.',
      icon: Activity,
      color: '#98269C',
      bg: '#EAD5E5',
    },
    {
      num: '03',
      title: 'Filar III: Laktacja & Więź',
      field: 'Fizjologia Laktacji & Czułe Karmienie',
      desc: 'Prawidłowy mechanizm ssania, asymetryczne przystawianie do piersi, postępowanie w nawałach pokarmowych i bolesności brodawek, bezpieczny dobór laktatora oraz karmienie butelką z czułością i bez poczucia winy.',
      ground: 'Standardy wsparcia laktacyjnego oparte o fizjologię pokarmu kobiecego i kontakt skóra do skóry.',
      icon: Heart,
      color: '#0088BC',
      bg: '#D0EBF3',
    },
    {
      num: '04',
      title: 'Filar IV: Noworodek & Pierwszy Rok',
      field: 'Opieka Neonatologiczna & Zdrowy Rozsądek',
      desc: 'Pierwsza kąpiel krok po kroku, pielęgnacja kikuta pępowinowego, bezpieczny sen niemowlęcia (profilaktyka SIDS), pierwsza pomoc w zakrztuszeniu i gorączce oraz zdrowy rozsądek o 3:00 w nocy bez paniki.',
      ground: 'Wytyczne neonatologiczne i pediatryczne w opiece nad noworodkiem w domu.',
      icon: Baby,
      color: '#347A22',
      bg: '#DFEED4',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Powrót do kokpitu */}
      <div className="flex items-center space-x-2 text-xs text-[#867A72]">
        <Link href="/strefa" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do kokpitu kursantki</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-[#EC008C] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparentność merytoryczna & E-E-A-T</span>
        </div>

        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight leading-tight">
          Standard Merytoryczny, Doświadczenie i Podstawy Prawne HappyBirth
        </h1>

        <p className="text-base sm:text-lg text-[#544A44] leading-relaxed font-sans max-w-3xl">
          Edukacja okołoporodowa HappyBirth nie jest zbiorem przypadkowych porad z internetu ani akademickim żargonem medycznym. Opiera się na 14 latach praktyki szkoły rodzenia Mama Gaja (od 2012 roku), doświadczeniu ponad 18 000 szczęśliwych mam i par oraz obowiązujących przepisach prawa medycznego w Polsce.
        </p>
      </div>

      {/* 3 Kluczowe Filary Prawne i Doświadczenia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-brand-display font-bold text-lg text-[#1A1512]">
            Zawód Położnej w Polsce
          </h3>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Zgodnie z <em>Ustawą z dnia 15 lipca 2011 r. o zawodach pielęgniarki i położnej</em> (Dz.U. z 2022 r. poz. 551), zawód położnej jest <strong>samodzielnym zawodem medycznym</strong>. Położna posiada pełne uprawnienia do prowadzenia ciąży fizjologicznej, samodzielnego przyjęcia porodu fizjologicznego, opieki nad noworodkiem oraz prowadzenia edukacji przedporodowej.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAD5E5] text-[#98269C] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-brand-display font-bold text-lg text-[#1A1512]">
            Standard Opieki Okołoporodowej
          </h3>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Program HappyBirth ściśle realizuje założenia <em>Rozporządzenia Ministra Zdrowia z dnia 16 sierpnia 2018 r. w sprawie standardu organizacyjnego opieki okołoporodowej</em> oraz wytycznych Narodowego Funduszu Zdrowia (NFZ). Kładziemy nacisk na prawa pacjentki, intymność, niefarmakologiczne łagodzenie bólu, pozycje wertykalne i kontakt „skóra do skóry”.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D0EBF3] text-[#0088BC] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-brand-display font-bold text-lg text-[#1A1512]">
            Mama Gaja – Od 2012 Roku
          </h3>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Naszą bazą dydaktyczną jest 14 lat doświadczenia stacjonarnej szkoły rodzenia Mama Gaja. Przez ponad dekadę nasze położne i specjalistki przygotowały do porodu ponad <strong>18 000 mam i osób towarzyszących</strong>. Wiemy, co realnie działa na sali porodowej i o 3:00 nad ranem po powrocie ze szpitala.
          </p>
        </div>
      </div>

      {/* Kim jesteśmy, a kim nie jesteśmy */}
      <div className="p-8 rounded-3xl bg-[#FBF8F4] border border-[#EAE3DB] space-y-6">
        <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
          Nasza tożsamość: Ciepło, zdrowy rozsądek i zero straszenia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#544A44]">
          <div className="space-y-3 bg-white p-6 rounded-2xl border border-[#EAE3DB]">
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Czym jest HappyBirth?</span>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-[#544A44]">
              <li className="flex items-start gap-2">
                <span className="text-[#EC008C] font-bold">✓</span>
                <span>Praktycznym, 52-lekcyjnym programem przygotowującym oboje rodziców do porodu fizjologicznego i cięcia cesarskiego.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EC008C] font-bold">✓</span>
                <span>Przestrzenią wzmacniającą poczucie sprawczości, spokój i zaufanie do mądrości kobiecego ciała.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EC008C] font-bold">✓</span>
                <span>Konkretnym przewodnikiem dla partnera / taty (masaż krzyżowy, pozycje porodowe, obrona praw rodzącej na izbie przyjęć).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#EC008C] font-bold">✓</span>
                <span>Wsparciem laktacyjnym i noworodkowym opartym o czułość i zdrowy rozsądek, bez presji i poczucia winy.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-white p-6 rounded-2xl border border-[#EAE3DB]">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Czym NIE jest HappyBirth?</span>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-[#544A44]">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Nie jesteśmy szpitalnym oddziałem patologii ciąży ani kliniką leczenia powikłań medycznych.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Nie zastępujemy bezpośredniego badania USG, badań krwi ani osobistej opieki Twojego lekarza ginekologa i położnej POZ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Nie promujemy dogmatów ani akademickiego straszenia komplikacjami – wierzymy w edukację przynoszącą ulgę, a nie panikę.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>W sytuacjach alarmowych (krwawienie, brak ruchów, zielone wody) zawsze nakazujemy natychmiastowy kontakt z pogotowiem ratunkowym (112) lub izbą przyjęć.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 Filary Spokoju HappyBirth */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Struktura programu VOD
          </span>
          <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512] mt-1">
            4 Filary Spokoju HappyBirth
          </h2>
          <p className="text-xs sm:text-sm text-[#544A44] mt-1 max-w-2xl">
            Każda z 52 lekcji wideo w Strefie Kursantki została przypisana do jednego z 4 filarów, reprezentujących kluczowe obszary wiedzy położniczej i fizjoterapeutycznej.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fourPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold"
                      style={{ backgroundColor: pillar.bg, color: pillar.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#867A72]">
                      FILAR {pillar.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-brand-display font-bold text-lg text-[#1A1512]">
                      {pillar.title}
                    </h3>
                    <div
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: pillar.color }}
                    >
                      {pillar.field}
                    </div>
                  </div>

                  <p className="text-xs text-[#544A44] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE3DB]/70 mt-4 text-[11px] text-[#867A72]">
                  <strong>Podstawa merytoryczna:</strong> {pillar.ground}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ważne Oświadczenie Medyczne & Bezpieczeństwo */}
      <div className="p-8 rounded-3xl bg-[#250A24] text-[#EAD5E5] border border-[#461643] space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-[#EC008C] font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Oficjalne oświadczenie medyczne platformy HappyBirth</span>
        </div>

        <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
          Wspieramy, edukujemy i uspokajamy – ale nie zastępujemy bezpośredniego kontaktu medycznego
        </h3>

        <div className="space-y-3 text-xs leading-relaxed text-[#EAD5E5]/85">
          <p>
            Materiały wideo, checklisty, cyfrowa apteczka oraz kalkulatory dostępne na platformie <strong>HappyBirth (happybirth.pl / strefa.happybirth.pl)</strong> mają charakter wyłącznie edukacyjny i informacyjny. Ich celem jest podniesienie świadomości przyszłych rodziców, przygotowanie fizyczne i psychiczne do porodu oraz ułatwienie partnerskiej komunikacji z personelem medycznym na sali porodowej.
          </p>
          <p>
            Informacje prezentowane w kursie <strong>nie stanowią porady lekarskiej, diagnozy ani planu leczenia w rozumieniu ustawy o działalności leczniczej</strong>. Każda ciąża jest zjawiskiem unikalnym i wymaga indywidualnego nadzoru ze strony wybranego lekarza położnika-ginekologa lub położnej podstawowej opieki zdrowotnej (POZ). W przypadku jakichkolwiek wątpliwości dotyczących stanu zdrowia Twojego lub dziecka, zawsze zasięgnij bezpośredniej porady wykwalifikowanego personelu medycznego.
          </p>
        </div>

        <div className="pt-4 border-t border-[#461643] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#EAD5E5]/60">
          <span>Ostatnia aktualizacja merytoryczna: Wrzesień 2026 r.</span>
          <Link
            href="/strefa"
            className="inline-flex items-center gap-1.5 text-white bg-[#EC008C] hover:bg-[#c70077] px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
          >
            <span>Przejdź do lekcji w Strefie Kursantki</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
