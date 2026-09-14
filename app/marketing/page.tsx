'use client';

import React from 'react';
import Link from 'next/link';
import { StageIcon } from '@/components/stage-icons';
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
  Smile,
  Star,
  CheckCircle2,
  Lock,
  Compass,
  Activity,
  Baby,
  Feather,
} from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

export default function MarketingPage() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';
  const partnerzyUrl = isDev ? '/partnerzy' : 'https://partnerzy.happybirth.pl';

  // Darmowy podgląd lekcji 1 w Cloudflare Stream
  const previewUid = 'f8d8d8f24b917a32961efea785c9324b';
  const previewStreamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${previewUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${previewUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  // 4 Filary Spokoju HappyBirth (zamiast byłych pracowników i pseudonimów)
  const fourPillars = [
    {
      num: '01',
      title: 'Poród & Oddech',
      subtitle: 'Fizjologia, ruch i ochrona krocza',
      desc: 'Jak współpracować ze swoim ciałem, a nie z nim walczyć. Pozycje wertykalne, oddech przeponowy, techniki niefarmakologicznego łagodzenia bólu oraz świadome przejście przez wszystkie fazy skurczów.',
      accent: '#EC008C',
      bg: '#FAE3EB',
      icon: Feather,
    },
    {
      num: '02',
      title: 'Ciało & Dno Miednicy',
      subtitle: 'Fizjoterapia i przygotowanie tkanek',
      desc: 'Praktyczne przygotowanie miednicy do porodu. Pozycje odciążające kręgosłup, techniki masażu krzyżowego dla partnera, bezpieczna praca z oddechem oraz łagodna regeneracja w pierwszych tygodniach połogu.',
      accent: '#98269C',
      bg: '#EAD5E5',
      icon: Activity,
    },
    {
      num: '03',
      title: 'Laktacja & Więź',
      subtitle: 'Czułe karmienie bez presji',
      desc: 'Wszystko o pierwszym przystawieniu, asymetrycznym chwycie, nawałach i doborze pozycji. Bez oceniania, bez dogmatów i bez poczucia winy – z pełnym wsparciem zarówno dla karmienia piersią, jak i butelką.',
      accent: '#0088BC',
      bg: '#D0EBF3',
      icon: Heart,
    },
    {
      num: '04',
      title: 'Noworodek & Pierwszy Rok',
      subtitle: 'Zdrowy rozsądek i spokój o 3:00 w nocy',
      desc: 'Pierwsza kąpiel krok po kroku, pielęgnacja pępka, rytm snu malucha i oswajanie kolek. Praktyczna pierwsza pomoc pediatryczna i wiedza, która daje Wam poczucie pewności po powrocie ze szpitala do domu.',
      accent: '#347A22',
      bg: '#DFEED4',
      icon: Baby,
    },
  ];

  const stagesOverview = [
    { num: '01', name: 'Zanim', desc: 'Świadome przygotowanie i spokój w głowie', color: '#8F8D8D', tint: '#E9E6E2' },
    { num: '02', name: 'Dwie kreski', desc: 'I Trymestr – badania, aplikacje i pierwsze emocje', color: '#54BF39', tint: '#DFEED4' },
    { num: '03', name: 'Wreszcie lepiej', desc: 'II Trymestr – energia, ruch, USG i ciało', color: '#FCD705', tint: '#FBF2CB' },
    { num: '04', name: 'Torba spakowana', desc: 'III Trymestr – 3 strefy wyprawki i plan porodu', color: '#F57B14', tint: '#FAE3CE' },
    { num: '05', name: 'Kiedy zacznie boleć', desc: 'Aktywny poród – skurcze, pozycje i oddech', color: '#ED1C24', tint: '#F9D3D1' },
    { num: '06', name: 'Gdy plan się posypie', desc: 'Spokojne cesarskie cięcie i plan B bez lęku', color: '#952999', tint: '#EAD5E5' },
    { num: '07', name: 'Pierwsza noc w domu', desc: 'Czuły połóg, regeneracja i powrót do sił', color: '#EC008C', tint: '#F8CEE2' },
    { num: '08', name: 'Karmienie', desc: 'Laktacja z czułością – pierś, butelka, nawał', color: '#00ADEF', tint: '#D0EBF3' },
    { num: '09', name: 'Nie śpi', desc: 'Pierwszy rok życia – sen, rozwój i bezpieczeństwo', color: '#3B46A4', tint: '#DADAE6' },
  ];

  const comparison = [
    {
      feature: 'Czas i wygoda',
      traditional: 'Sztywne godziny (np. wtorki o 18:00), dojazdy w korkach po pracy',
      happybirth: 'Oglądacie o dowolnej porze na kanapie, w telefonie lub na Smart TV',
    },
    {
      feature: 'Rola partnera',
      traditional: 'Często czuje się biernym obserwatorem i nie wie, jak pomóc',
      happybirth: 'Dedykowana Strefa dla Taty: masaż krzyżowy, pozycje i gotowe zadania',
    },
    {
      feature: 'Powrót do wiedzy',
      traditional: 'Kurs kończy się przed porodem – po powrocie do domu zostajecie sami',
      happybirth: 'Dostęp przez 12 miesięcy od terminu porodu – wracacie do lekcji w połogu',
    },
    {
      feature: 'Praktyczne narzędzia',
      traditional: 'Notatki w zeszycie, które gubią się w drodze do szpitala',
      happybirth: 'Licznik skurczów 5-1-1 na telefonie, checklisty wyprawki i Plan Porodu',
    },
    {
      feature: 'Podejście do rodzicielstwa',
      traditional: 'Często sztywne dogmaty, które wywołują poczucie winy i presję',
      happybirth: 'Ciepło, zero oceniania, zaufanie do Waszych wyborów i zdrowy rozsądek',
    },
  ];

  const testimonials = [
    {
      quote: '„Największa wartość to spokój mojego męża. Na porodówce nie stał bezradnie pod ścianą – wiedział, gdzie uciskać miednicę przy każdym skurczu. Położna na sali pytała, skąd mamy tak świetne przygotowanie.”',
      author: 'Katarzyna i Michał',
      meta: 'Córeczka Pola · Wrocław',
      color: '#FAE3EB',
    },
    {
      quote: '„Lekcje o pierwszych dobach w domu uratowały naszą laktację. O 2:30 w nocy, gdy pojawił się nawał, po prostu włączyłam wideo w telefonie. Zero paniki, konkretne wskazówki, pełne ukojenie.”',
      author: 'Aleksandra i Tomasz',
      meta: 'Syn Leon · Poznań',
      color: '#FBF2CB',
    },
    {
      quote: '„Pracujemy w nieregularnych godzinach i żadna tradycyjna szkoła nie wchodziła w grę. HappyBirth obejrzeliśmy wieczorami przy herbacie. Pięknie zrealizowane, filmowe ujęcia i żadnego akademickiego lania wody.”',
      author: 'Magdalena i Piotr',
      meta: 'Bliźniaki Jan i Tymon · Kraków',
      color: '#D0EBF3',
    },
  ];

  const faqs = [
    {
      q: 'Kiedy najlepiej dołączyć do kursu?',
      a: 'Większość przyszłych rodziców dołącza między 16. a 28. tygodniem ciąży, aby na spokojnie przećwiczyć oddech, pozycje i skompletować wyprawkę. Dzięki podziałowi na 9 Etapów kurs jest jednak przydatny zarówno na samym początku ciąży, jak i tuż przed planowanym terminem.',
    },
    {
      q: 'Czy mój partner musi kupować osobny dostęp?',
      a: 'Nie. Dostęp jest dla dwojga w jednej cenie. Partner może zalogować się tym samym kontem na swoim smartfonie i korzystać z dedykowanych ściąg dla taty w dowolnym momencie.',
    },
    {
      q: 'Dlaczego dostęp trwa 12 miesięcy od terminu porodu, a nie od dnia zakupu?',
      a: 'Ponieważ wiemy, że najwięcej pytań i wątpliwości pojawia się dopiero po narodzinach dziecka – w pierwszych tygodniach karmienia, pielęgnacji, powrotu mamy do formy i budowania rytmu snu malucha. Chcemy, aby nasza wiedza służyła Wam przez cały pierwszy rok życia dziecka.',
    },
    {
      q: 'Czy kurs przygotowuje również do cesarskiego cięcia?',
      a: 'Tak, w pełni. Poświęciliśmy temu cały dedykowany Etap 06 („Gdy plan się posypie”). Tłumaczymy krok po kroku procedurę planowanego i nagłego cięcia, przygotowanie psychiczne, rolę partnera na bloku operacyjnym oraz bezpieczną pielęgnację blizny i pionizację w połogu.',
    },
    {
      q: 'Co jeśli nie będę mogła lub chciała karmić piersią?',
      a: 'W HappyBirth nie ma miejsca na presję ani ocenianie. Uczymy techniki karmienia piersią, radzenia sobie z nawałem i zastojami, ale z równą troską i profesjonalizmem pokazujemy karmienie butelką, dobór mieszanek i pozycje wspierające bliskość z dzieckiem.',
    },
    {
      q: 'Jak szybko po zakupie otrzymam dostęp?',
      a: 'Natychmiast. Po opłaceniu zamówienia przez BLIK, Apple Pay lub kartę system automatycznie aktywuje Twoje konto w Strefie Kursantki w 30 sekund.',
    },
  ];

  return (
    <div className="space-y-0 text-[#1A1512] selection:bg-[#EC008C]/20">
      {/* 1. HERO: CIEPŁY, LIFESTYLOWY, EMOCJONALNY */}
      <section className="pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto" id="top">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Lewa kolumna: Copywriting sprzedażowo-lifestylowy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-semibold text-[#EC008C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Szkoła rodzenia online dla dwojga · Ponad 18 000 mam</span>
            </div>

            {/* Główny nagłówek z obietnicą spokoju */}
            <h1 className="font-brand-display font-medium text-4xl sm:text-6xl lg:text-[72px] text-[#1A1512] leading-[1.04] tracking-tight">
              Spokojny, świadomy poród.{' '}
              <em className="font-brand-serif italic font-normal text-[#EC008C]">
                Razem, we własnym rytmie.
              </em>
            </h1>

            {/* Podtytuł budujący pragnienie */}
            <p className="text-lg sm:text-xl text-[#544A44] leading-relaxed font-sans max-w-2xl">
              52 filmowe lekcje wideo, które krok po kroku przygotują Was na najpiękniejszy dzień w życiu. Zamiast sprzecznych rad z internetu – czuła wiedza, opieka i doświadczenie 18 000 porodów w jednym miejscu.
            </p>

            {/* Przyciski CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <a
                href="#cena"
                className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-base sm:text-lg font-semibold transition-all shadow-xl shadow-[#EC008C]/25 hover:shadow-[#EC008C]/40 hover:scale-[1.03]"
              >
                <span>Dołącz do kursu · 349 zł</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#zwiastun"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-4 rounded-full bg-white hover:bg-stone-50 text-[#1A1512] border border-[#EAE3DB] text-base font-semibold transition-all shadow-sm hover:border-[#EC008C]"
              >
                <Play className="w-4 h-4 text-[#EC008C] fill-current" />
                <span>Zobacz bezpłatną lekcję</span>
              </a>
            </div>

            {/* Gwarancje zaufania */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#867A72]">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dostęp dla dwojga w cenie</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>12 msc od terminu porodu</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Płatność jednorazowa BLIK</span>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Estetyczna karta wideo z akcentem lifestylowym */}
          <div className="lg:col-span-5 relative" id="zwiastun">
            <div className="relative rounded-3xl overflow-hidden bg-[#250A24] text-white p-3 shadow-2xl border border-[#461643] group">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/80">
                <iframe
                  src={previewStreamUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title="HappyBirth - Przykładowa Lekcja"
                />
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EC008C] block">
                    Bezpłatna lekcja próbna
                  </span>
                  <div className="font-brand-display font-medium text-white text-sm sm:text-base mt-0.5">
                    Pierwsza wizyta i USG w ciąży
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#370E35] text-[#EAD5E5] px-3 py-1.5 rounded-full font-mono text-[11px] shrink-0">
                  <Play className="w-3 h-3 fill-current text-[#FCD705]" />
                  <span>Jakość 4K</span>
                </div>
              </div>
            </div>

            {/* Dekoracyjna plakietka społeczna */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white rounded-2xl p-3.5 border border-[#EAE3DB] shadow-xl text-xs font-semibold text-[#1A1512]">
              <div className="w-9 h-9 rounded-xl bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center font-bold">
                ★ 4.9
              </div>
              <div>
                <div>Ponad 18 000 rodziców</div>
                <div className="text-[11px] text-[#867A72] font-normal">Świadome, spokojne porody od 2012 r.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PASEK SPOŁECZNEGO DOWODU (Social Proof Bar) */}
      <section className="border-y border-[#EAE3DB] py-7 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512]">
              18 000+
            </div>
            <div className="text-xs sm:text-sm text-[#867A72]">
              przygotowanych mam i partnerów
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512]">
              14 lat
            </div>
            <div className="text-xs sm:text-sm text-[#867A72]">
              ciągłego doświadczenia od 2012 roku
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512]">
              52 lekcje
            </div>
            <div className="text-xs sm:text-sm text-[#867A72]">
              filmowej wiedzy w 9 etapach
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-brand-display text-3xl sm:text-4xl font-semibold text-[#1A1512]">
              1 cena
            </div>
            <div className="text-xs sm:text-sm text-[#867A72]">
              dostęp dla dwojga bez ukrytych opłat
            </div>
          </div>
        </div>
      </section>

      {/* 3. STORYTELLING: PROBLEM VS ROZWIĄZANIE (Dlaczego HappyBirth?) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-semibold text-[#EC008C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nowoczesne przygotowanie dla dwojga</span>
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] leading-tight">
            Szkoła rodzenia, która{' '}
            <em className="font-brand-serif italic font-normal text-[#EC008C]">
              dopasowuje się do Was.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[#544A44] leading-relaxed max-w-2xl mx-auto">
            Porównaj tradycyjne kursy stacjonarne z podejściem HappyBirth. Zobacz, dlaczego ponad 18 000 par wybrało spokój we własnym salonie.
          </p>
        </div>

        {/* Karty Porównawcze: Dwa Światy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Karta 1: Tradycyjna Szkoła Stacjonarna */}
          <div className="rounded-3xl bg-[#F6F2EC] border border-[#E5DFD7] p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Header Karty */}
              <div className="space-y-2 border-b border-[#E5DFD7] pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE4DC] text-[#786D65] text-xs font-semibold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tradycyjna szkoła stacjonarna</span>
                </div>
                <h3 className="font-brand-display font-semibold text-2xl sm:text-3xl text-[#2C2420]">
                  Sztywny grafik i pośpiech w korkach
                </h3>
                <p className="text-xs sm:text-sm text-[#786D65] leading-relaxed">
                  Często kosztuje 600–900 zł, a po narodzinach dziecka zostajecie sami bez dostępu do wiedzy.
                </p>
              </div>

              {/* Lista punktów */}
              <ul className="space-y-4 text-xs sm:text-sm text-[#544A44]">
                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Wtorki o 18:00 na drugim końcu miasta</strong>
                    <span className="text-[#786D65] leading-relaxed">
                      Dojazdy w korkach po pracy, pośpiech i zmęczenie w zaawansowanej ciąży. Gdy nie dotrzesz – lekcja bezpowrotnie przepada.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Partner jako bierny widz z tyłu sali</strong>
                    <span className="text-[#786D65] leading-relaxed">
                      Siedzi skrępowany na niewygodnym krześle. Brak czasu na indywidualne przećwiczenie technik masażu i realnych chwytów.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Koniec kursu tuż przed porodem</strong>
                    <span className="text-[#786D65] leading-relaxed">
                      Zajęcia kończą się przed narodzinami. Po powrocie ze szpitala o 3:00 w nocy przy pierwszych wyzwaniach zostajecie zdani na fora internetowe.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Notatki w zeszycie, które gubią się w torbie</strong>
                    <span className="text-[#786D65] leading-relaxed">
                      Stosy kartek i kserówek, których nikt nie czyta w trakcie akcji porodowej ani w szpitalnej sali.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Sztywne dogmaty i presja</strong>
                    <span className="text-[#786D65] leading-relaxed">
                      Narzucanie jednego idealnego scenariusza, który budzi poczucie winy, gdy poród lub laktacja potoczą się inaczej.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E5DFD7] text-xs text-[#867A72] flex items-center justify-between">
              <span>Brak powrotu do materiałów</span>
              <span className="font-semibold">Ograniczony czas</span>
            </div>
          </div>

          {/* Karta 2: HappyBirth Online (Hero Lifestyle Card) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white via-[#FFFBFD] to-[#FDF2F7] border-2 border-[#EC008C] p-8 sm:p-10 shadow-2xl shadow-[#EC008C]/15 flex flex-col justify-between space-y-8 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#EC008C]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Karty */}
              <div className="space-y-2 border-b border-[#F3CAD9] pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EC008C] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#FCD705]" />
                  <span>HappyBirth Online · Dla Dwojga</span>
                </div>
                <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
                  Spokój, czułość i pełna wolność
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                  52 filmowe lekcje 4K, do których wracacie przez 12 miesięcy po porodzie – na Smart TV i telefonie.
                </p>
              </div>

              {/* Lista punktów */}
              <ul className="space-y-4 text-xs sm:text-sm text-[#342D28]">
                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Ciepła herbata, kanapa i własny salon</strong>
                    <span className="text-[#544A44] leading-relaxed">
                      Oglądacie we dwoje o dowolnej porze na Smart TV lub smartfonie. Pauzujecie, wracacie i rozmawiacie we własnym rytmie, bez stresu i dojazdów.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Dedykowana Strefa dla Taty</strong>
                    <span className="text-[#544A44] leading-relaxed">
                      Praktyczne wideo-instrukcje dla partnera: masaż krzyżowy, techniki łagodzenia skurczu chustą Rebozo, gotowe zadania i pewność na porodówce.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Dostęp przez 12 miesięcy od narodzin malucha</strong>
                    <span className="text-[#544A44] leading-relaxed">
                      Najwięcej wątpliwości pojawia się po powrocie do domu. Włączacie lekcje o laktacji, kąpieli, śnie czy pierwszej pomocy dokładnie wtedy, gdy ich potrzebujecie.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Narzędzia nocne w telefonie (Licznik 5-1-1 & Apteczka)</strong>
                    <span className="text-[#544A44] leading-relaxed">
                      Licznik skurczów z algorytmem wyjazdu do szpitala, 16-punktowy Plan Porodu oraz błyskawiczna wyszukiwarka SOS na wyciągnięcie ręki.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#EC008C] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <strong className="text-[#1A1512] block mb-0.5">Czułość, zero dogmatów i akceptacja</strong>
                    <span className="text-[#544A44] leading-relaxed">
                      Wspieramy każdą drogę rodzicielstwa: poród naturalny i cesarskie cięcie, karmienie piersią i butelką – bez poczucia winy, z pełnym zrozumieniem.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Dolna belka z przyciskiem w karcie */}
            <div className="relative z-10 pt-6 border-t border-[#F3CAD9] mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#867A72] block">Płatność jednorazowa za dwoje:</span>
                <span className="font-brand-display text-2xl font-bold text-[#1A1512]">349 zł</span>
                <span className="text-xs text-[#EC008C] font-semibold ml-2">pełny pakiet na rok</span>
              </div>

              <a
                href="#cena"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 hover:scale-105"
              >
                <span>Wybierz HappyBirth</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CZTERY FILARY SPOKOJU HAPPYBIRTH (Zamiast nazwisk dawnych położnych) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F6F2EC]" id="filary">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
              Kompleksowa opieka
            </span>
            <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512]">
              Cztery Filary Spokoju HappyBirth
            </h2>
            <p className="text-base sm:text-lg text-[#544A44] leading-relaxed">
              HappyBirth to metodyka i esencja wiedzy wypracowana przez 14 lat i 18 000 porodów. Zamiast sprzecznych opinii, otrzymujesz cztery spójne obszary opieki oparte na zdrowym rozsądku i zaufaniu do kobiecego ciała.
            </p>
          </div>

          {/* 4 Karty Filarów z autorskimi awatarami/symbolami */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fourPillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="p-7 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[320px] group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: pillar.bg, color: pillar.accent }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-[#867A72]">
                        {pillar.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-brand-display font-medium text-2xl text-[#1A1512]">
                        {pillar.title}
                      </h3>
                      <div
                        className="text-xs font-semibold mt-1"
                        style={{ color: pillar.accent }}
                      >
                        {pillar.subtitle}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE3DB] mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#1A1512]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wiedza i ćwiczenia wideo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DZIEWIĘĆ ETAPÓW JAKO PRZEWODNIK PRZEZ MACIERZYŃSTWO */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="etapy">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
            Oś Czasu
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512]">
            Dziewięć etapów. Zawsze wiesz, gdzie jesteś.
          </h2>
          <p className="text-base sm:text-lg text-[#544A44]">
            Od planowania i dwóch kresek, przez aktywny poród na sali, aż po pierwsze urodziny Twojego dziecka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stagesOverview.map((st) => (
            <div
              key={st.num}
              className="p-6 rounded-2xl border border-[#EAE3DB] hover:border-[#1A1512]/30 transition-all flex flex-col justify-between min-h-[170px]"
              style={{ backgroundColor: st.tint }}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10" style={{ color: st.color }}>
                  <StageIcon id={st.num} />
                </div>
                <span className="font-mono text-xs font-bold tracking-widest opacity-50">
                  {st.num}
                </span>
              </div>

              <div>
                <h3 className="font-brand-display font-medium text-xl text-[#1A1512]">
                  {st.name}
                </h3>
                <p className="text-xs text-[#544A44] mt-1">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NARZĘDZIA NA KAŻDĄ NOC (Licznik 5-1-1 & Baza pytań) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="narzedzia">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
            Bezpieczeństwo 24/7
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512]">
            Narzędzia, które działają dziś w nocy
          </h2>
          <p className="text-base sm:text-lg text-[#544A44]">
            Masz skurcze o 2:00 w nocy? Nasze cyfrowe narzędzia natychmiast mówią, co robić.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Licznik skurczów */}
          <div className="md:col-span-7 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#ED1C24] to-[#B00F15] text-white flex flex-col justify-between min-h-[280px] shadow-lg">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                Na Porodówkę
              </span>
              <h3 className="font-brand-display font-medium text-3xl sm:text-4xl mt-1">
                Licznik skurczów 5·1·1
              </h3>
              <p className="text-sm sm:text-base text-white/90 mt-3 max-w-md leading-relaxed">
                Mierz odstępy i czas trwania skurczu. Algorytm analizuje rytm i mówi prosto: czy to jeszcze skurcze przepowiadające, czy czas jechać do szpitala.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="font-brand-display text-5xl font-medium tracking-tight">
                5·1·1
              </div>
              <a
                href={strefaUrl ? `${strefaUrl}/licznik` : '/strefa/licznik'}
                className="px-6 py-3 rounded-full bg-white text-[#1A1512] font-semibold text-sm hover:scale-105 transition-transform"
              >
                Wypróbuj licznik za darmo
              </a>
            </div>
          </div>

          {/* Strefa dla taty */}
          <div className="md:col-span-5 rounded-3xl p-8 sm:p-10 bg-[#EAD5E5] text-[#1A1512] flex flex-col justify-between min-h-[280px] border border-[#D5B8CF]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#98269C]">
                Dla Dwojga
              </span>
              <h3 className="font-brand-display font-medium text-3xl mt-1">
                Ściąga dla Taty
              </h3>
              <p className="text-sm text-[#544A44] mt-3 leading-relaxed">
                Pigułka wiedzy dla osoby towarzyszącej: punkty ucisku łagodzące ból, chwyt Rebozo, pilnowanie praw na sali porodowej i formalności po narodzinach.
              </p>
            </div>

            <div className="pt-6">
              <a
                href={strefaUrl ? `${strefaUrl}/partner` : '/strefa/partner'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#98269C] hover:bg-[#801D84] text-white font-semibold text-sm transition-all shadow-md shadow-[#98269C]/25 hover:scale-105"
              >
                <span>Zobacz ściągę dla taty</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OFERTA SPRZEDAŻOWA (High-Converting Pricing Box) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="cena">
        <div className="rounded-3xl bg-[#250A24] text-[#F3EDE7] border border-[#461643] p-8 sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#EC008C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC008C]/20 border border-[#EC008C]/40 text-xs font-semibold text-[#EAD5E5]">
                <Sparkles className="w-3.5 h-3.5 text-[#FCD705]" />
                <span>Dostęp dla dwojga · Płatność jednorazowa</span>
              </div>

              <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-white leading-tight">
                Zainwestuj w spokój i pewność siebie na sali porodowej
              </h2>

              <p className="text-sm sm:text-base text-[#D7CCC3] leading-relaxed">
                W cenie jednej prywatnej konsultacji zyskujesz pełny dostęp do 52 filmowych lekcji, które będą wspierać Was przez całą ciążę, poród i pierwszy rok życia malucha.
              </p>

              <ul className="space-y-3 text-sm text-[#EAD5E5]">
                <li className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded bg-[#FCD705] text-[#1A1512] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                  <span><strong>52 lekcje wideo</strong> w 9 etapach zrealizowane w filmowej jakości 4K</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded bg-[#FCD705] text-[#1A1512] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                  <span><strong>12 miesięcy dostępu od terminu porodu</strong> dla Ciebie i Twojego partnera</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded bg-[#FCD705] text-[#1A1512] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                  <span>Plan Porodu w 16 punktach, checklista torby szpitalnej i kalendarz badań</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded bg-[#FCD705] text-[#1A1512] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                  <span>Dedykowana Strefa dla Taty z praktycznymi technikami masażu</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded bg-[#FCD705] text-[#1A1512] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                  <span>Licznik skurczów 5-1-1 i baza wiedzy bezterminowo</span>
                </li>
              </ul>
            </div>

            {/* Box płatności */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md text-center space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#EAD5E5]/70 font-semibold block">
                Płatność jednorazowa · Bez subskrypcji
              </span>

              <div className="font-brand-display text-7xl sm:text-8xl font-medium tracking-tight text-white leading-none">
                349<span className="font-brand-serif italic text-3xl align-super ml-1">zł</span>
              </div>

              <div className="text-xs text-[#D7CCC3]">
                Dostęp do Strefy Kursantki w 30 sekund na maila
              </div>

              <a
                href={strefaUrl}
                className="w-full py-4 rounded-full bg-[#FCD705] hover:bg-[#ffe338] text-[#1A1512] font-bold text-base transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Kup dostęp · BLIK / Karta</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#A2958C]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Szybka i bezpieczna płatność
                </span>
                <span>·</span>
                <span>Doświadczenie 18 000 mam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OPINIE MAM I TATUSIÓW (Social Proof) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F6F2EC]" id="opinie">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#867A72]">
              Doświadczenia rodziców
            </span>
            <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512]">
              Historie, które dodają odwagi
            </h2>
            <p className="text-base text-[#544A44]">
              Zobacz, jak wiedza i spokój zmieniły doświadczenie porodu u par, które były w tym samym miejscu co Wy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm flex flex-col justify-between min-h-[260px]"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400 text-sm">
                    ★★★★★
                  </div>
                  <p className="font-brand-serif text-lg sm:text-xl text-[#1A1512] leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EAE3DB] mt-6">
                  <div className="font-brand-display font-bold text-sm text-[#1A1512]">
                    {t.author}
                  </div>
                  <div className="text-xs text-[#867A72] mt-0.5">
                    {t.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ: PYTANIA PRZED ZAKUPEM */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#867A72]">
            Wątpliwości?
          </span>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512]">
            Często zadawane pytania
          </h2>
          <p className="text-base text-[#544A44]">
            Wszystko, co warto wiedzieć przed dołączeniem do kursu.
          </p>
        </div>

        <div className="divide-y divide-[#EAE3DB] bg-white rounded-3xl border border-[#EAE3DB] p-6 sm:p-10 shadow-sm">
          {faqs.map((f, idx) => (
            <details key={f.q} className="py-5 group" open={idx === 0}>
              <summary className="font-brand-display font-medium text-lg sm:text-xl text-[#1A1512] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{f.q}</span>
                <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs text-[#867A72] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3.5 text-sm sm:text-base text-[#544A44] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
