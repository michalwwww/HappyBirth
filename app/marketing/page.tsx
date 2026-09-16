'use client';

import React from 'react';
import Link from 'next/link';
import { StageIcon } from '@/components/stage-icons';
import { BuyCourseButton } from '@/components/buy-button';
import { DailyTipCard } from '@/components/daily-tip-card';
import {
  Play,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Heart,
  Clock,
  Users,
  Smartphone,
  Tv,
  Star,
  CheckCircle2,
  FileText,
  Activity,
  Baby,
  Feather,
  Instagram,
  BookOpen,
  Award,
} from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

export default function MarketingPage() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';
  const partnerzyUrl = isDev ? '/partnerzy' : 'https://partnerzy.happybirth.pl';

  // Darmowy podgląd lekcji 1 w Cloudflare Stream
  const previewUid = 'f8d8d8f24b917a32961efea785c9324b';
  const previewStreamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${previewUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${previewUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  // 4 Filary Spokoju HappyBirth (esencjonalne, zwięzłe opisy)
  const fourPillars = [
    {
      num: '01',
      title: 'Poród & Oddech',
      subtitle: 'Współpraca z ciałem i naturalny rytm',
      desc: 'Świadomy oddech, wygodne pozycje wertykalne i spokój. Uczymy, jak zaufać ciału i zachować pewność siebie krok po kroku.',
      accent: '#EC008C',
      bg: '#FAE3EB',
      icon: Feather,
    },
    {
      num: '02',
      title: 'Ciało & Spokojny Ruch',
      subtitle: 'Komfort, mobilność i czuły powrót do sił',
      desc: 'Praktyczne ćwiczenia rozluźniające, masaż dla taty oraz bezpieczna domowa regeneracja dla świeżo upieczonej mamy.',
      accent: '#98269C',
      bg: '#EAD5E5',
      icon: Activity,
    },
    {
      num: '03',
      title: 'Czułe Karmienie & Więź',
      subtitle: 'Bliskość bez presji i bez oceniania',
      desc: 'Wygodne pozycje i spokojny start – zarówno przy karmieniu piersią, jak i butelką. Bezpiecznie i z pełnym zrozumieniem.',
      accent: '#0088BC',
      bg: '#D0EBF3',
      icon: Heart,
    },
    {
      num: '04',
      title: 'Maluszek w Domu',
      subtitle: 'Pewność siebie o 3:00 w nocy',
      desc: 'Kąpiel bez stresu, bezpieczny sen, noszenie i uspokajanie maluszka. Praktyczny spokój w pierwszych tygodniach w domu.',
      accent: '#347A22',
      bg: '#DFEED4',
      icon: Baby,
    },
  ];

  const stagesOverview = [
    { num: '01', name: 'Zanim', desc: 'Świadome przygotowanie i spokój w głowie', color: '#8F8D8D' },
    { num: '02', name: 'Dwie kreski', desc: 'I Trymestr – emocje, ciało i pierwsze chwile', color: '#54BF39' },
    { num: '03', name: 'Wreszcie lepiej', desc: 'II Trymestr – nowa energia, ruch i siła', color: '#FCD705' },
    { num: '04', name: 'Torba spakowana', desc: 'III Trymestr – sprytna wyprawka i organizacja', color: '#F57B14' },
    { num: '05', name: 'Wielki Dzień', desc: 'Ciało w ruchu, oddech i spokój we dwoje', color: '#ED1C24' },
    { num: '06', name: 'Plan B bez stresu', desc: 'Świadome narodziny w każdym scenariuszu', color: '#952999' },
    { num: '07', name: 'Pierwsza noc w domu', desc: 'Czuły połóg i regeneracja sił mamy', color: '#EC008C' },
    { num: '08', name: 'Karmienie z miłością', desc: 'Pierś i butelka bez presji i poczucia winy', color: '#00ADEF' },
    { num: '09', name: 'Razem przez 1. rok', desc: 'Sen, rozwój maluszka i bezpieczeństwo', color: '#3B46A4' },
  ];

  const comparison = [
    {
      feature: 'Format nauki',
      traditional: 'Sztywne wykłady w sali, dojazdy po pracy',
      happybirth: 'Nowoczesny e-learning VOD na kanapie w telefonie lub TV',
    },
    {
      feature: 'Zaangażowanie taty',
      traditional: 'Często czuje się biernym obserwatorem z boku',
      happybirth: 'Dedykowana Strefa dla Taty: masaż relaksacyjny i konkretne zadania',
    },
    {
      feature: 'Dostęp po narodzinach',
      traditional: 'Kurs kończy się przed porodem – po powrocie zostajecie sami',
      happybirth: 'Dostęp na 12 miesięcy od terminu porodu – powrót do lekcji w domu',
    },
    {
      feature: 'Pomoce dydaktyczne',
      traditional: 'Zeszyt z notatkami, który gubi się w stresie',
      happybirth: 'Cyfrowy Notatnik Rodzica PDF, wideo-patenty i ściągi dla taty',
    },
    {
      feature: 'Podejście edukacyjne',
      traditional: 'Sztywne dogmaty budzące presję i poczucie winy',
      happybirth: 'Ciepło, zero oceniania i zaufanie do Waszych wyborów',
    },
  ];

  const testimonials = [
    {
      quote: '„Największa wartość to spokój mojego męża. Nie stał bezradnie – dokładnie wiedział, jak masować plecy i wspierać mnie oddechem.”',
      author: 'Katarzyna i Michał',
      meta: 'Córeczka Pola · Wrocław',
    },
    {
      quote: '„Lekcje o pierwszych dobach w domu uratowały nasz spokój. O 2:30 w nocy po prostu włączyliśmy wideo z telefonu. Zero paniki, same konkrety.”',
      author: 'Aleksandra i Tomasz',
      meta: 'Syn Leon · Poznań',
    },
    {
      quote: '„Obejrzeliśmy cały kurs wieczorami przy herbacie. Piękne, filmowe ujęcia, ciepły język i zero akademickiego żargonu. Prawdziwa przystań.”',
      author: 'Magdalena i Piotr',
      meta: 'Bliźniaki Jan i Tymon · Kraków',
    },
  ];

  const faqs = [
    {
      q: 'Kiedy najlepiej dołączyć do kursu?',
      a: 'Większość rodziców dołącza między 16. a 28. tygodniem ciąży. Dostęp trwa 12 miesięcy od terminu porodu, więc materiały służą Wam przez cały pierwszy rok życia maluszka.',
    },
    {
      q: 'Czy tata potrzebuje osobnego konta?',
      a: 'Nie. Dostęp jest dla dwojga w jednej cenie. Tata może logować się na swoim telefonie i korzystać z dedykowanej Strefy dla Taty.',
    },
    {
      q: 'Czy kurs przygotowuje na różne scenariusze narodzin?',
      a: 'Tak. Pokazujemy każdy wariant narodzin. Tata wie, jak towarzyszyć mamie, a Wy zyskujecie pełny spokój bez względu na przebieg sytuacji.',
    },
    {
      q: 'Co jeśli wybierzemy karmienie butelką?',
      a: 'W HappyBirth nie ma oceniania. Uczymy karmienia piersią, ale z równą czułością pokazujemy karmienie butelką i bezpieczne pozycje bliskości.',
    },
    {
      q: 'Jak szybko po zakupie otrzymamy dostęp?',
      a: 'Natychmiast. Po opłaceniu zamówienia przez BLIK, Apple Pay lub kartę konto w Strefie Rodziców aktywuje się automatycznie w kilkadziesiąt sekund.',
    },
  ];

  return (
    <div className="space-y-0 text-[#1A1512] selection:bg-[#EC008C]/20">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Lewa kolumna */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] dark:bg-[#370E35] border border-[#F3CAD9] dark:border-[#5E1E5A] text-xs font-semibold text-[#EC008C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Edukacyjny Online dla Rodziców · 52 Lekcje VOD</span>
            </div>

            <h1 className="font-brand-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#1A1512] dark:text-white leading-[1.08] tracking-tight">
              Spokojny, świadomy poród.{' '}
              <em className="font-brand-serif italic font-normal text-[#EC008C]">
                Edukacyjny kurs dla dwojga.
              </em>
            </h1>

            <p className="text-base sm:text-lg text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed font-sans max-w-2xl">
              52 filmowe lekcje edukacyjne i sprawdzone patenty w formule e-learningu dla dwojga. Zamiast sprzecznych rad z forów – rzetelny program szkoleniowy, opieka i spokój dla całej rodziny.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <BuyCourseButton className="inline-flex items-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-base font-semibold transition-all shadow-xl shadow-[#EC008C]/25 hover:scale-105 cursor-pointer">
                <span>Dołącz do kursu · 349 zł</span>
                <ArrowRight className="w-4 h-4" />
              </BuyCourseButton>

              <a
                href="#zwiastun"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white dark:bg-[#1C081A] hover:bg-stone-50 text-[#1A1512] dark:text-white border border-[#EAE3DB] dark:border-[#461643] text-sm font-semibold transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#EC008C] fill-current" />
                <span>Zobacz bezpłatną lekcję demonstracyjną</span>
              </a>
            </div>

            {/* Gwarancje zaufania */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#867A72] dark:text-[#EAD5E5]/70">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certyfikat ukończenia kursu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>E-learning na 12 miesięcy</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dostęp dla dwojga w cenie</span>
              </div>
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
                  title="HappyBirth - Przykładowa Lekcja"
                />
              </div>

              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EC008C] block">
                    Lekcja próbna
                  </span>
                  <div className="font-brand-display font-medium text-white text-sm sm:text-base mt-0.5">
                    Pierwsza wizyta i USG w ciąży
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#370E35] text-[#EAD5E5] px-2.5 py-1 rounded-full font-mono text-[11px] shrink-0">
                  <Play className="w-3 h-3 fill-current text-[#FCD705]" />
                  <span>Jakość 4K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PASEK SPOŁECZNEGO DOWODU */}
      <section className="border-y border-[#EAE3DB] dark:border-[#461643] py-6 px-4 sm:px-6 bg-[#FAF7F2] dark:bg-[#1C081A]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-white">
              18 000+
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#EAD5E5]/70 mt-0.5">
              przygotowanych mam i ojców
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-white">
              52 lekcje
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#EAD5E5]/70 mt-0.5">
              filmowej wiedzy w 9 etapach
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-white">
              12 msc
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#EAD5E5]/70 mt-0.5">
              dostępu od terminu porodu
            </div>
          </div>
          <div>
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512] dark:text-white">
              349 zł
            </div>
            <div className="text-xs text-[#867A72] dark:text-[#EAD5E5]/70 mt-0.5">
              jednorazowo dla dwojga
            </div>
          </div>
        </div>
      </section>

      {/* 3. WIDGET INTELIGENTNY: PATENT DNIA HAPPYBIRTH */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Wiedza, której nie znajdziesz na forach
          </span>
          <h2 className="font-brand-display font-medium text-2xl sm:text-4xl text-[#1A1512] dark:text-white">
            Codzienne Złote Patenty HappyBirth
          </h2>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#EAD5E5]/70 max-w-xl mx-auto">
            Próbka konkretnych trików, które wyciągamy z 52 lekcji VOD. Kliknij poniżej, aby wylosować patent na dziś.
          </p>
        </div>

        <DailyTipCard />
      </section>

      {/* 4. 4 FILARY SPOKOJU (Zwięzłe, esencjonalne) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="filary">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Program Szkoleniowy
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-white">
            4 Filary Edukacji i Spokoju HappyBirth
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#EAD5E5]/70">
            Kompleksowa wiedza e-learningowa: od przygotowania ciała po spokojny sen malucha w domu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fourPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-6 rounded-3xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643] flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: pillar.bg, color: pillar.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#867A72]">
                      {pillar.num}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                      {pillar.title}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#EC008C]">
                      {pillar.subtitle}
                    </div>
                  </div>
                  <p className="text-xs text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <div className="text-xs font-semibold text-[#867A72] dark:text-[#EAD5E5]/70 inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#EC008C]" />
            <span>Autorski program edukacyjny opracowany we współpracy z certyfikowanymi edukatorami rodzicielstwa</span>
          </div>
        </div>
      </section>

      {/* 5. 9 ETAPÓW PODRÓŻY */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="etapy">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Sylabus kursu
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-white">
            9 Modułów Edukacyjnych Twojej Podróży
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#EAD5E5]/70">
            Przejrzysty program szkoleniowy podzielony na etapy: od testu, przez poród, po 1. rok malucha.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stagesOverview.map((stage) => (
            <div
              key={stage.num}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643] flex items-start gap-3.5 shadow-sm"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: stage.color }}
              >
                {stage.num}
              </div>
              <div>
                <h4 className="font-brand-display font-bold text-sm sm:text-base text-[#1A1512] dark:text-white">
                  {stage.name}
                </h4>
                <p className="text-xs text-[#544A44] dark:text-[#EAD5E5]/70 mt-0.5 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NARZĘDZIA RODZINNE (Notatnik, Strefa dla Taty, Patenty) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="narzedzia">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Praktyczne wsparcie
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-white">
            Narzędzia, do których wracacie w dzień i w nocy
          </h2>
          <p className="text-sm text-[#544A44] dark:text-[#EAD5E5]/70">
            Gotowe do użycia w telefonie – w drodze i po powrocie do domu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FAE3EB] dark:bg-[#370E35] border border-[#F3CAD9] dark:border-[#5E1E5A] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EC008C] text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-white">
              Cyfrowy Notatnik Rodzica (PDF)
            </h3>
            <p className="text-xs text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed">
              Przejrzysty dokument dla Was obojga. Uporządkujcie swoje życzenia: obecność partnera, muzykę, kangurowanie i pierwsze chwile z maluchem.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#EAD5E5] dark:bg-[#250A24] border border-[#D5B8CF] dark:border-[#461643] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#98269C] text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-white">
              Dedykowana Strefa dla Taty
            </h3>
            <p className="text-xs text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed">
              Krótkie wideo-ściągi bez zbędnych słów: relaksacyjny masaż pleców, wsparcie mamy i gotowość na każdą minutę.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#D0EBF3] dark:bg-[#004A66] border border-[#B3DFEB] dark:border-[#006085] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0088BC] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512] dark:text-white">
              Wyszukiwarka Złotych Patentów
            </h3>
            <p className="text-xs text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed">
              Wpisz dowolne wyzwanie (sen, kąpiel, płacz, noszenie) i błyskawicznie otrzymaj sprawdzoną instrukcję wideo z kursu.
            </p>
          </div>
        </div>
      </section>

      {/* 7. PORÓWNANIE: SZKOŁA TRADYCYJNA VS HAPPYBIRTH */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-brand-display font-medium text-2xl sm:text-3xl text-[#1A1512] dark:text-white">
            Dlaczego rodzice wybierają HappyBirth?
          </h2>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643] overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-[#F6F2EC] dark:bg-[#250A24] p-4 text-xs font-bold uppercase tracking-wider border-b border-[#EAE3DB] dark:border-[#461643]">
            <div className="col-span-4 text-[#867A72]">Cecha</div>
            <div className="col-span-4 text-[#867A72]">Tradycyjna szkoła</div>
            <div className="col-span-4 text-[#EC008C]">HappyBirth Online</div>
          </div>

          {comparison.map((item, idx) => (
            <div
              key={item.feature}
              className={`grid grid-cols-12 p-4 text-xs items-center gap-2 ${
                idx % 2 === 1 ? 'bg-[#FAF7F2] dark:bg-white/5' : ''
              }`}
            >
              <div className="col-span-4 font-semibold text-[#1A1512] dark:text-white">
                {item.feature}
              </div>
              <div className="col-span-4 text-[#867A72] dark:text-[#EAD5E5]/70">
                {item.traditional}
              </div>
              <div className="col-span-4 font-semibold text-[#EC008C] dark:text-pink-300">
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
              Bądźmy w kontakcie na Instagramie
            </h3>
            <p className="text-xs text-[#EAD5E5]/80 max-w-md">
              Codzienne patenty, kulisy nagrań i ciepłe wsparcie dla naszych mam i ojców. Napisz do nas w DM!
            </p>
          </div>

          <a
            href="https://instagram.com/happybirth.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 shrink-0"
          >
            Obserwuj @happybirth.pl
          </a>
        </div>
      </section>

      {/* 9. OPINIE RODZICÓW */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto" id="opinie">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Głosy naszych rodzin
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512] dark:text-white">
            Historie mam i ojców po porodzie
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643] flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed italic">
                  {t.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE3DB] dark:border-[#461643] mt-4">
                <div className="font-bold text-xs text-[#1A1512] dark:text-white">
                  {t.author}
                </div>
                <div className="text-[11px] text-[#867A72] dark:text-[#EAD5E5]/60">
                  {t.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
            Odpowiedzi na pytania
          </span>
          <h2 className="font-brand-display font-medium text-2xl sm:text-3xl text-[#1A1512] dark:text-white">
            Często zadawane pytania (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643]"
            >
              <h4 className="font-brand-display font-bold text-sm sm:text-base text-[#1A1512] dark:text-white mb-1.5">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. CENA & GWARANCJA (FINAL CTA) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center" id="cena">
        <div className="rounded-3xl bg-gradient-to-br from-[#250A24] via-[#3B1038] to-[#20071F] text-white p-8 sm:p-12 border border-[#461643] shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#EAD5E5]">
            <span>Dostęp dla dwojga bez subskrypcji</span>
          </div>

          <h2 className="font-brand-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Dołącz do HappyBirth już dziś
          </h2>

          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-extrabold text-[#FCD705] font-mono">
              349 zł
            </div>
            <div className="text-xs text-[#EAD5E5]/70">
              Płatność jednorazowa · Dostęp na 12 miesięcy od terminu porodu
            </div>
          </div>

          <div className="pt-2">
            <BuyCourseButton className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-base font-semibold shadow-xl shadow-[#EC008C]/30 hover:scale-105 transition-all cursor-pointer">
              <span>Kup dostęp dla dwojga · 349 zł</span>
              <ArrowRight className="w-4 h-4" />
            </BuyCourseButton>
          </div>

          <p className="text-[11px] text-[#EAD5E5]/60 max-w-md mx-auto">
            Bezpieczne płatności Stripe, BLIK i Apple Pay. Dostęp do Strefy Rodziców aktywuje się natychmiast na Twój adres e-mail.
          </p>

          {/* Pasek Pelerynki Edukacyjnej */}
          <div className="pt-2 border-t border-white/10">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center max-w-xl mx-auto space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FCD705]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Status: Usługa Edukacyjno-Szkoleniowa (E-learning VOD)</span>
              </div>
              <p className="text-[11px] text-[#EAD5E5]/75 leading-relaxed">
                HappyBirth to internetowy kurs przygotowania do rodzicielstwa. Materiały mają charakter wyłącznie edukacyjny i informacyjny. Usługa nie stanowi świadczenia zdrowotnego ani konsultacji medycznej.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
