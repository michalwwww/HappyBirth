'use client';

import React from 'react';
import Link from 'next/link';
import { StageIcon } from '@/components/stage-icons';
import { Play, Sparkles, Check, ArrowRight, ShieldCheck, Heart, AlertCircle, PhoneCall } from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

export default function MarketingPage() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';

  // Darmowy fragment lekcji 1: I Trymestr ciąży
  const previewUid = 'f8d8d8f24b917a32961efea785c9324b';
  const previewStreamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${previewUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${previewUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  const stagesData = [
    {
      id: 'e-zanim',
      no: '01',
      title: 'Zanim',
      sub: 'Staranie i przygotowanie',
      color: '#8F8D8D',
      tint: '#E9E6E2',
      deep: '#6B6969',
      kicker: '01 · Staranie i przygotowanie · przed ciążą',
      p: 'Co zrobić trzy miesiące wcześniej. Jakie badania mają sens. Dlaczego kwas foliowy zaczyna się przed testem, a nie po nim.',
    },
    {
      id: 'e-dwiekreski',
      no: '02',
      title: 'Dwie kreski',
      sub: 'Pierwszy trymestr',
      color: '#54BF39',
      tint: '#DFEED4',
      deep: '#347A22',
      kicker: '02 · Pierwszy trymestr · tydzień 1 do 13',
      p: 'Pierwsza wizyta i pierwsze badania. Mdłości. Strach, o którym nikt nie mówi. Lista objawów, przy których dzwonisz od razu.',
    },
    {
      id: 'e-lepiej',
      no: '03',
      title: 'Wreszcie lepiej',
      sub: 'Drugi trymestr',
      color: '#FCD705',
      tint: '#FBF2CB',
      deep: '#816E00',
      kicker: '03 · Drugi trymestr · tydzień 14 do 27',
      p: 'Energia wraca. Ruch, dieta, USG połówkowe, krzywa cukrowa. To najlepszy moment, żeby się przygotować.',
    },
    {
      id: 'e-torba',
      no: '04',
      title: 'Torba spakowana',
      sub: 'Trzeci trymestr',
      color: '#F57B14',
      tint: '#FAE3CE',
      deep: '#AA5003',
      kicker: '04 · Trzeci trymestr · tydzień 28 do 40',
      p: 'Trzy strefy w torbie. Plan porodu w szesnastu punktach. Wybór szpitala. Liczenie ruchów dziecka.',
    },
    {
      id: 'e-boli',
      no: '05',
      title: 'Kiedy zacznie boleć',
      sub: 'Poród',
      color: '#ED1C24',
      tint: '#F9D3D1',
      deep: '#D00B13',
      kicker: '05 · Poród · dzień zero',
      p: 'Reguła 5·1·1. Cztery okresy porodu. Pozycje wertykalne, oddech, TENS, znieczulenie. Kiedy jechać i co powiedzieć na izbie.',
    },
    {
      id: 'e-planb',
      no: '06',
      title: 'Gdy plan się posypie',
      sub: 'Cięcie i plan B',
      color: '#952999',
      tint: '#EAD5E5',
      deep: '#98269C',
      kicker: '06 · Cięcie i plan B · kiedykolwiek',
      p: 'Cięcie planowe i nagłe. Poród zabiegowy. Wcześniactwo. Oddział noworodkowy. Ten rozdział istnieje, bo dotyczy prawie połowy z Was.',
    },
    {
      id: 'e-pierwszanoc',
      no: '07',
      title: 'Pierwsza noc w domu',
      sub: 'Połóg',
      color: '#EC008C',
      tint: '#F8CEE2',
      deep: '#C80077',
      kicker: '07 · Połóg · doba 1 do 42',
      p: 'Odchody połogowe. Rana krocza albo blizna po cięciu. Baby blues i depresja poporodowa. I co robić o trzeciej w nocy.',
    },
    {
      id: 'e-karmienie',
      no: '08',
      title: 'Karmienie',
      sub: 'Laktacja',
      color: '#00ADEF',
      tint: '#D0EBF3',
      deep: '#00729D',
      kicker: '08 · Laktacja · od pierwszej godziny',
      p: 'Pierwsze przystawienie. Chwyt asymetryczny. Nawał, zastój, zapalenie. Butelka też jest tutaj. Nie ma jednego właściwego sposobu.',
    },
    {
      id: 'e-niespi',
      no: '09',
      title: 'Nie śpi',
      sub: 'Pierwszy rok',
      color: '#3B46A4',
      tint: '#DADAE6',
      deep: '#3844A7',
      kicker: '09 · Pierwszy rok · miesiąc 2 do 12',
      p: 'Sen. Kolki. Rozszerzanie diety. Kamienie milowe. Pierwsza gorączka. Do dnia 365, czyli do pierwszych urodzin.',
    },
  ];

  const experts = [
    {
      name: 'Ewa',
      role: 'Dyplomowana położna',
      desc: 'Noworodek i laktacja. Kąpiel, pępek, pierwsze przystawienie do piersi.',
      tint: '#F8CEE2',
      deep: '#C80077',
    },
    {
      name: 'Julia',
      role: 'Fizjoterapeutka uroginekologiczna',
      desc: 'Ciało, oddech, mięśnie dna miednicy. Pozycje, które realnie odciążają.',
      tint: '#D0EBF3',
      deep: '#00729D',
    },
    {
      name: 'Ania',
      role: 'Psychologia i emocje',
      desc: 'Oswajanie lęku przed porodem. Budowanie poczucia sprawczości.',
      tint: '#EAD5E5',
      deep: '#98269C',
    },
    {
      name: 'Marta',
      role: 'Logistyka i prawa pacjenta',
      desc: 'Procedury szpitalne i to, na co masz prawo się nie zgodzić.',
      tint: '#FAE3CE',
      deep: '#AA5003',
    },
  ];

  const quotes = [
    {
      text: '„Pozycje wertykalne i oddech uratowały mi poród. Wiedziałam, co się dzieje, na każdym etapie.”',
      author: 'Kasia · Poznań',
      tint: '#DADAE6',
    },
    {
      text: '„Warsztat masażu krzyżowego. Mąż wreszcie wiedział, co ze sobą zrobić na sali.”',
      author: 'Magda i Tomek · Wrocław',
      tint: '#FBF2CB',
    },
    {
      text: '„Praktyczne wskazówki bez akademickiego tonu. Dokładnie to, czego szukałam.”',
      author: 'Aleksandra · online',
      tint: '#D0EBF3',
    },
    {
      text: '„Format trzy razy dwie godziny idealnie wszedł mi w grafik. Obejrzałam wieczorami.”',
      author: 'Patrycja · Kraków',
      tint: '#DFEED4',
    },
  ];

  const faqs = [
    {
      q: 'W którym tygodniu ciąży zacząć?',
      a: 'Najlepiej między 20. a 30. tygodniem. Masz wtedy energię i jeszcze sporo czasu, żeby przećwiczyć oddech i pozycje. Kurs działa też, jeśli zaczynasz w 36. tygodniu. Wtedy zacznij od modułu drugiego.',
    },
    {
      q: 'Czy to zastępuje szkołę rodzenia w szpitalu?',
      a: 'Nie zastępuje opieki Twojej położnej ani lekarza prowadzącego. Zastępuje kurs stacjonarny. To ten sam program, który prowadzimy w Poznaniu i Wrocławiu od 2012 roku, tylko dostępny o trzeciej w nocy.',
    },
    {
      q: 'Rodzę przez cięcie. Czy ten kurs jest dla mnie?',
      a: 'Tak. Etap „Gdy plan się posypie” jest w całości o cięciu planowym i nagłym, porodzie zabiegowym i oddziale noworodkowym. Nie chowamy go w podstronie, bo dotyczy prawie połowy rodzących w Polsce.',
    },
    {
      q: 'Co jeśli nie będę karmić piersią?',
      a: 'Moduł o karmieniu obejmuje też butelkę i mieszankę. Technikę, dawkowanie, pozycje. Nie ma jednego właściwego sposobu i nie udajemy, że jest.',
    },
    {
      q: 'Czy partner musi kupować osobny dostęp?',
      a: 'Nie. W cenie jednego kursu dostajecie dwa niezależne dostępy.',
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO (z Netlify) */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto" id="top">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="text-xs sm:text-sm tracking-[0.14em] uppercase font-semibold text-[#867A72] mb-7 flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Szkoła rodzenia online</span>
            <span>·</span>
            <span>
              od Szkoły Rodzenia <b className="text-[#544A44] font-bold">Mama Gaja</b>
            </span>
            <span>·</span>
            <span>
              od <b className="text-[#544A44] font-bold">2012</b>
            </span>
          </div>

          {/* Big Headline with Instrument Serif italic */}
          <h1 className="font-brand-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[88px] text-[#1A1512] leading-[1.02] tracking-tight max-w-4xl">
            Poród nie jest{' '}
            <em className="font-brand-serif italic font-normal text-[#1A1512]">
              niespodzianką.
            </em>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl text-[#544A44] max-w-2xl mt-7 mb-9 leading-relaxed font-sans">
            Jest procesem, który da się poznać zawczasu. Prowadzimy Cię przez niego etap po etapie. Od dwóch kresek do pierwszych urodzin.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#cena"
              className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#250A24] hover:bg-[#EC008C] text-white text-base sm:text-lg font-semibold transition-all shadow-md hover:scale-[1.02]"
            >
              <span>Kup dostęp za 349 zł</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#mapa"
              className="inline-flex items-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-transparent hover:bg-black/5 text-[#1A1512] border-2 border-[#EAE3DB] hover:border-[#1A1512] text-base sm:text-lg font-semibold transition-all"
            >
              <span>Zobacz mapę kursu</span>
            </a>

            <a
              href={strefaUrl}
              className="inline-flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold text-[#544A44] hover:text-[#EC008C] transition-colors ml-auto sm:ml-2"
            >
              <span>Masz już konto? Zaloguj się</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Fine print */}
          <p className="text-xs sm:text-sm text-[#867A72] mt-6">
            Dostęp 12 miesięcy od terminu porodu. Dla Ciebie i partnera w cenie jednego. Ponad 32 000 przeszkolonych rodziców.
          </p>

          {/* Swatches: 9 Stage Color Bars */}
          <div className="flex gap-1.5 mt-10 sm:mt-14 max-w-xl">
            {stagesData.map((s) => (
              <span
                key={s.id}
                className="flex-1 h-2 rounded-full"
                style={{ backgroundColor: s.tint }}
                title={s.title}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROOF BAR (z Netlify) */}
      <section className="border-y border-[#EAE3DB] py-8 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            <div>
              <div className="font-brand-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1512]">
                32 000
              </div>
              <div className="text-xs sm:text-sm text-[#867A72] mt-1.5 leading-snug">
                przeszkolonych rodziców od 2012 roku
              </div>
            </div>

            <div>
              <div className="font-brand-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1512]">
                14 lat
              </div>
              <div className="text-xs sm:text-sm text-[#867A72] mt-1.5 leading-snug">
                praktyki w Poznaniu i Wrocławiu
              </div>
            </div>

            <div>
              <div className="font-brand-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1512]">
                52
              </div>
              <div className="text-xs sm:text-sm text-[#867A72] mt-1.5 leading-snug">
                lekcje wideo w 9 etapach
              </div>
            </div>

            <div>
              <div className="font-brand-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1512]">
                4
              </div>
              <div className="text-xs sm:text-sm text-[#867A72] mt-1.5 leading-snug">
                ekspertki, każda podpisana imieniem
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="font-brand-display text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1512]">
                6 h
              </div>
              <div className="text-xs sm:text-sm text-[#867A72] mt-1.5 leading-snug">
                konkretów. Zero lania wody
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARMOWY ZWIASTUN VOD CLOUDFLARE STREAM */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#250A24] to-[#180517] text-white border border-[#461643] shadow-xl">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
              Darmowy podgląd lekcji
            </span>
            <h2 className="font-brand-display font-medium text-2xl sm:text-4xl text-white mt-1">
              Zobacz jakość wideo przed zakupem
            </h2>
            <p className="text-sm sm:text-base text-[#EAD5E5]/80 mt-2">
              Lekcja 1: Pierwsza wizyta i USG w I trymestrze ciąży. Autorski materiał w jakości 4K zrealizowany z położną Ewą.
            </p>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 shadow-2xl border border-white/10">
            <iframe
              src={previewStreamUrl}
              className="w-full h-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              title="HappyBirth Preview"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#EAD5E5]/70">
            <div className="flex items-center gap-4">
              <span>✓ Jakość 4K Ultra HD</span>
              <span>✓ Działa na telefonie, laptopie i Smart TV</span>
              <span>✓ 52 pełne lekcje dostępne od razu po zakupie</span>
            </div>

            <a
              href="#cena"
              className="inline-flex items-center gap-1.5 text-white font-semibold hover:text-[#EC008C] transition-colors"
            >
              <span>Odblokuj wszystkie 52 lekcje · 349 zł</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. MAPA KURSU (9 Kafli z Netlify) */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto" id="mapa">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
          Mapa kursu
        </div>
        <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-xl">
          Dziewięć etapów. Każdy ma swój{' '}
          <em className="font-brand-serif italic font-normal text-[#1A1512]">
            kolor.
          </em>
        </h2>
        <p className="text-base sm:text-lg text-[#544A44] max-w-2xl mt-4">
          Nie musisz szukać, gdzie jesteś. Kolor mówi Ci to od razu. W kursie, w mailu, w pliku do wydruku i na okładce modułu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-10">
          {stagesData.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group p-6 sm:p-7 rounded-2xl min-h-[210px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: s.tint }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ color: s.deep }}
                >
                  <StageIcon name={s.id.replace('e-', '')} />
                </div>
                <span
                  className="font-mono text-xs font-bold tracking-widest opacity-40 group-hover:opacity-70"
                  style={{ color: s.deep }}
                >
                  {s.no}
                </span>
              </div>

              <div className="pt-8">
                <div className="font-brand-display font-medium text-2xl text-[#1A1512] leading-tight group-hover:text-black">
                  {s.title}
                </div>
                <div className="text-xs sm:text-sm text-[#544A44] mt-1.5 opacity-80">
                  {s.sub}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. BANDY (9 Szczegółowych pasów z Netlify) */}
      <section className="space-y-0" id="etapy">
        {stagesData.map((s, idx) => {
          const isAlt = idx % 2 === 1;
          return (
            <div
              key={s.id}
              id={s.id}
              className={`py-12 sm:py-16 px-4 sm:px-6 transition-colors scroll-mt-20 ${
                isAlt ? 'bg-[#FBF8F4]' : 'bg-[#F6F2EC]'
              }`}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 sm:gap-12">
                <div className="w-16 sm:w-24 shrink-0" style={{ color: s.color }}>
                  <StageIcon name={s.id.replace('e-', '')} />
                </div>

                <div className="flex-1 max-w-3xl">
                  <span
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2"
                    style={{ color: s.deep }}
                  >
                    {s.kicker}
                  </span>
                  <h3 className="font-brand-display font-medium text-2xl sm:text-4xl text-[#1A1512]">
                    {s.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#544A44] mt-3 leading-relaxed">
                    {s.p}
                  </p>
                </div>

                <div
                  className="hidden md:block font-brand-display text-7xl lg:text-9xl font-medium select-none pointer-events-none opacity-10"
                  style={{ color: s.color }}
                >
                  {s.no}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 6. CO DOSTAJESZ (Program kursu z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="program">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
          Co dostajesz
        </div>
        <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-2xl">
          Sześć godzin. Trzy moduły. Zero{' '}
          <em className="font-brand-serif italic font-normal text-[#1A1512]">
            wypełniacza.
          </em>
        </h2>

        {/* 3 Moduły */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-7">
            <span className="text-xs font-bold uppercase tracking-widest text-[#867A72] block mb-3">
              Moduł I · 2 h
            </span>
            <h4 className="font-brand-display font-semibold text-xl text-[#1A1512] mb-2.5">
              Ciało, oddech i prawa
            </h4>
            <p className="text-sm text-[#544A44] leading-relaxed">
              Adaptacja krążeniowa i hormonalna. Oddech przeponowy. Pozycje odciążające. Twoje prawa na sali porodowej, czarno na białym.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-7">
            <span className="text-xs font-bold uppercase tracking-widest text-[#867A72] block mb-3">
              Moduł II · 2 h
            </span>
            <h4 className="font-brand-display font-semibold text-xl text-[#1A1512] mb-2.5">
              Poród i ból
            </h4>
            <p className="text-sm text-[#544A44] leading-relaxed">
              Cztery okresy porodu. Pozycje wertykalne, piłka, masaż krzyżowy, TENS, imersja wodna, znieczulenie. Plan porodu w szesnastu punktach.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-7">
            <span className="text-xs font-bold uppercase tracking-widest text-[#867A72] block mb-3">
              Moduł III · 2 h
            </span>
            <h4 className="font-brand-display font-semibold text-xl text-[#1A1512] mb-2.5">
              Noworodek i połóg
            </h4>
            <p className="text-sm text-[#544A44] leading-relaxed">
              Pielęgnacja, kąpiel, pępek. Pierwsza pomoc pediatryczna i RKO. Start laktacyjny. Bezpieczny sen i profilaktyka SIDS.
            </p>
          </div>
        </div>

        {/* 4 Karty korzyści */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-6">
            <h4 className="font-brand-display font-semibold text-lg text-[#1A1512] mb-1.5">
              Dostęp 12 miesięcy
            </h4>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Na telefonie, tablecie i telewizorze. Wracasz, kiedy potrzebujesz. Także w nocy.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-6">
            <h4 className="font-brand-display font-semibold text-lg text-[#1A1512] mb-1.5">
              Dla dwojga
            </h4>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Partner dostaje własny dostęp. Bez dopłaty i bez dzielenia się hasłem.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-6">
            <h4 className="font-brand-display font-semibold text-lg text-[#1A1512] mb-1.5">
              Plan porodu i checklisty
            </h4>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Gotowe pliki do wydruku. Plan porodu, torba w trzech strefach, lista objawów alarmowych.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3DB] rounded-2xl p-6">
            <h4 className="font-brand-display font-semibold text-lg text-[#1A1512] mb-1.5">
              Zaświadczenie imienne
            </h4>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Do okazania w szpitalu albo u pracodawcy. Wystawiane po ukończeniu kursu.
            </p>
          </div>
        </div>
      </section>

      {/* 7. KTO TO MÓWI (Ekspertki z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F4F1EC]" id="zespol">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
            Kto to mówi
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-2xl">
            Cztery ekspertki. Każda podpisana{' '}
            <em className="font-brand-serif italic font-normal text-[#1A1512]">
              imieniem.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[#544A44] max-w-2xl mt-4">
            Nie anonimowa platforma. Za każdą lekcją stoi konkretna osoba z konkretnym dyplomem.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {experts.map((exp) => (
              <div
                key={exp.name}
                className="p-6 rounded-2xl flex flex-col justify-between min-h-[220px]"
                style={{ backgroundColor: exp.tint }}
              >
                <div>
                  <div className="font-brand-display font-medium text-3xl text-[#1A1512]">
                    {exp.name}
                  </div>
                  <div
                    className="text-xs font-bold mt-1.5 uppercase tracking-wide"
                    style={{ color: exp.deep }}
                  >
                    {exp.role}
                  </div>
                </div>

                <div className="text-sm text-[#544A44] mt-6 leading-relaxed">
                  {exp.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ZA DARMO, BEZ ZAPISU (Narzędzia nocne z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="narzedzia">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
          Za darmo, bez zapisu
        </div>
        <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-2xl">
          Zacznij od czegoś, co działa dziś{' '}
          <em className="font-brand-serif italic font-normal text-[#1A1512]">
            w nocy.
          </em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-10">
          {/* Tool 1: Licznik skurczów */}
          <div className="md:col-span-7 rounded-2xl p-7 sm:p-10 bg-[#ED1C24] text-white flex flex-col justify-between min-h-[280px]">
            <div>
              <h4 className="font-brand-display font-medium text-3xl sm:text-4xl">
                Licznik skurczów
              </h4>
              <p className="text-sm sm:text-base text-white/90 mt-3 max-w-md">
                Mierzy czas i odstępy. Analizuje rytm. Mówi wprost, czy to już reguła wyjazdu na porodówkę.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="font-brand-display text-5xl sm:text-6xl font-medium tracking-tight">
                5·1·1
              </div>
              <a
                href={strefaUrl ? `${strefaUrl}/licznik` : '/strefa/licznik'}
                className="px-6 py-3 rounded-full bg-white text-[#1A1512] font-semibold text-sm hover:scale-105 transition-transform"
              >
                Otwórz licznik
              </a>
            </div>
          </div>

          {/* Tool 2: Baza wiedzy */}
          <div className="md:col-span-5 rounded-2xl p-7 sm:p-10 bg-[#DFEED4] text-[#1A1512] flex flex-col justify-between min-h-[280px]">
            <div>
              <h4 className="font-brand-display font-medium text-3xl sm:text-4xl">
                Baza wiedzy SOS
              </h4>
              <p className="text-sm sm:text-base text-[#544A44] mt-3">
                Cztery przewodniki, które czyta się w pięć minut. Odejście wód, skurcze, pierwsza kąpiel, słownik pojęć szpitalnych.
              </p>
            </div>

            <div className="mt-8">
              <a
                href={strefaUrl ? `${strefaUrl}/apteczka` : '/strefa/apteczka'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border-2 border-[#1A1512]/30 hover:border-[#1A1512] text-[#1A1512] font-semibold text-sm transition-colors"
              >
                <span>Przejdź do bazy</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Czerwona flaga SOS (Kiedy nie czytasz, tylko dzwonisz) */}
        <div className="mt-6 rounded-2xl p-7 sm:p-8 bg-[#FBEDEA] border border-[#F0CCC6]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#B32218] mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Kiedy nie czytasz, tylko dzwonisz</span>
          </div>
          <p className="text-sm sm:text-base text-[#1A1512] leading-relaxed">
            Krwawienie jasną krwią · odpływanie wód płodowych, zwłaszcza zielonych · silny ból głowy z mroczkami przed oczami · nagłe obrzęki · brak wyczuwalnych ruchów dziecka przez 10 godzin · silny świąd dłoni i stóp po 35. tygodniu.{' '}
            <b className="font-bold">
              W każdej z tych sytuacji jedziesz do szpitala albo dzwonisz na 112. Nie czekasz do rana.
            </b>
          </p>
        </div>
      </section>

      {/* 9. CENA (w szlachetnym ciemnym fiolecie #250A24 z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto" id="cena">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
          Cena
        </div>
        <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-2xl">
          Jedna liczba. Bez formularza i bez{' '}
          <em className="font-brand-serif italic font-normal text-[#1A1512]">
            „zapytaj o ofertę”.
          </em>
        </h2>

        <div className="mt-10 rounded-3xl bg-[#250A24] text-[#F3EDE7] border border-[#461643] p-8 sm:p-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-2xl">
          <div className="md:col-span-7">
            <h3 className="font-brand-display font-medium text-3xl sm:text-4xl text-white mb-6">
              Szkoła rodzenia online
            </h3>
            <ul className="space-y-3.5 text-sm sm:text-base text-[#D7CCC3]">
              <li className="flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#FCD705] mt-1 shrink-0" />
                <span>52 lekcje wideo w 9 etapach. Ponad sześć godzin konkretów</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#FCD705] mt-1 shrink-0" />
                <span>Dostęp 12 miesięcy od terminu porodu dla Ciebie i partnera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#FCD705] mt-1 shrink-0" />
                <span>Plan porodu w 16 punktach, checklisty i lista objawów alarmowych</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#FCD705] mt-1 shrink-0" />
                <span>Zaświadczenie imienne o ukończeniu kursu do szpitala i ZUS</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded bg-[#FCD705] mt-1 shrink-0" />
                <span>Licznik skurczów 5-1-1 i baza wiedzy bezterminowo</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 text-left md:text-right border-t md:border-t-0 md:border-l border-[#461643] pt-8 md:pt-0 md:pl-10">
            <div className="font-brand-display text-7xl sm:text-8xl lg:text-9xl font-medium tracking-tight text-white leading-none">
              349<span className="font-brand-serif italic text-3xl sm:text-4xl align-super ml-1">zł</span>
            </div>

            <a
              href={strefaUrl}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-[#FCD705] hover:bg-[#ffe338] text-[#1A1512] font-bold text-base transition-all shadow-lg hover:scale-105"
            >
              <span>Kup dostęp teraz</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="text-xs sm:text-sm text-[#A2958C] mt-4">
              Płatność jednorazowa. Bez subskrypcji. BLIK / Karta.
            </div>
          </div>
        </div>
      </section>

      {/* 10. CO MÓWIĄ RODZICE (Opinie z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F6F2EC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
            Co mówią rodzice
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] max-w-2xl">
            Cztery zdania zamiast czterdziestu{' '}
            <em className="font-brand-serif italic font-normal text-[#1A1512]">
              gwiazdek.
            </em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {quotes.map((q) => (
              <div
                key={q.author}
                className="p-6 rounded-2xl flex flex-col justify-between min-h-[210px]"
                style={{ backgroundColor: q.tint }}
              >
                <p className="font-brand-serif text-xl sm:text-2xl text-[#1A1512] leading-snug">
                  {q.text}
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-[#867A72] mt-6 block">
                  {q.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ (Zanim kupisz z Netlify) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#867A72] mb-3">
          Pytania
        </div>
        <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] mb-10">
          Zanim{' '}
          <em className="font-brand-serif italic font-normal text-[#1A1512]">
            kupisz.
          </em>
        </h2>

        <div className="divide-y divide-[#EAE3DB]">
          {faqs.map((f, idx) => (
            <details key={f.q} className="py-6 group" open={idx === 0}>
              <summary className="font-brand-display font-medium text-xl sm:text-2xl text-[#1A1512] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{f.q}</span>
                <span className="w-5 h-5 flex items-center justify-center text-[#867A72] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3.5 text-sm sm:text-base text-[#544A44] leading-relaxed max-w-3xl">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
