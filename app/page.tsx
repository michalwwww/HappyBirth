import React from 'react';
import Link from 'next/link';
import { StageTimeline } from '@/components/stage-timeline';
import { DigitalMedicineCabinet } from '@/components/digital-medicine-cabinet';
import { SosContractionCounter } from '@/components/sos-contraction-counter';
import { Play, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight, Star, Clock, AlertTriangle, Users, Award } from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

export default function HomePage() {
  // Free preview video UID (Lekcja 1: I Trymestr ciąży)
  const previewUid = 'f8d8d8f24b917a32961efea785c9324b';
  const previewStreamUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${previewUid}/iframe?poster=https%3A%2F%2F${CLOUDFLARE_CUSTOMER_DOMAIN}%2F${previewUid}%2Fthumbnails%2Fthumbnail.jpg&preload=metadata`;

  const experts = [
    {
      name: 'Ewa',
      role: 'Położna z 18-letnim stażem',
      desc: 'Przyjęła ponad 2 400 porodów. Na sali porodowej stawia na spokój, pozycje wertykalne i ochronę krocza bez zbędnych nacięć.',
      color: '#EC008C',
      bg: '#FAE3EB',
    },
    {
      name: 'Julia',
      role: 'Fizjoterapeutka uroginekologiczna',
      desc: 'Uczy, jak przygotować miednicę do porodu, jak bezboleśnie pracować z oddechem oraz jak bezpiecznie regenerować mięśnie brzucha po połogu.',
      color: '#98269C',
      bg: '#EAD5E5',
    },
    {
      name: 'Ania',
      role: 'Doradczyni laktacyjna (IBCLC)',
      desc: 'Rozwiązuje problemy z nawałem, bolesnymi brodawkami i techniką przystawiania. Bez oceniania, bez presji, z pełnym wsparciem dla mamy.',
      color: '#0088BC',
      bg: '#D0EBF3',
    },
    {
      name: 'Marta',
      role: 'Lekarka rezydentka pediatrii',
      desc: 'Tłumaczy fizjologię noworodka, uczy pierwszej pomocy (RKO) i wyjaśnia, kiedy katar to tylko katar, a kiedy należy pilnie jechać na ostry dyżur.',
      color: '#347A22',
      bg: '#DFEED4',
    },
  ];

  const faqs = [
    {
      q: 'Czy kurs online zastępuje tradycyjną szkołę rodzenia?',
      a: 'Tak, i daje znacznie więcej. Otrzymujesz 52 lekcje wideo zgodne ze standardem opieki okołoporodowej PTGiP. Oglądasz je we własnym tempie na telefonie lub TV, powracasz do ujęć instruktażowych w dowolnej chwili i masz dostęp przez 12 miesięcy od terminu porodu.',
    },
    {
      q: 'Czy mój partner musi kupować osobny dostęp?',
      a: 'Nie. Dostęp jest dla dwojga w jednej cenie. Partner może zalogować się tym samym kontem na swoim telefonie lub otrzymać dedykowany Magic Link. Przygotowaliśmy też dla niego specjalną Strefę Partnera z pigułkami wiedzy na porodówkę.',
    },
    {
      q: 'Kiedy najlepiej dołączyć do kursu?',
      a: 'Większość mam dołącza między 16. a 26. tygodniem ciąży, ale dzięki podziałowi na 9 Etapów kurs jest przydatny od pierwszego dnia ciąży aż do pierwszych urodzin dziecka.',
    },
    {
      q: 'Dlaczego dostęp trwa 12 miesięcy od terminu porodu, a nie od dnia zakupu?',
      a: 'Ponieważ wiemy, że najtrudniejsze pytania (o karmienie piersią, pielęgnację kikuta, sen niemowlaka, kolki i pierwszą pomoc) pojawiają się dopiero po powrocie do domu. Chcemy, aby nasza Cyfrowa Apteczka służyła Wam przez cały pierwszy rok życia malucha.',
    },
  ];

  return (
    <div className="w-full space-y-24 pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Wierny klimat Netlify: typografia, 9-swatch, zwiastun)     */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Eyebrow z Netlify */}
          <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[#544A44]">POŁOŻNE</span>
            <span>·</span>
            <span className="text-[#544A44]">GINEKOLOG</span>
            <span>·</span>
            <span className="text-[#544A44]">FIZJOTERAPIA</span>
            <span>·</span>
            <span className="text-[#544A44]">PEDIATRA</span>
            <span>·</span>
            <span className="text-[#EC008C]">DLA OBOJGA RODZICÓW</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lewa kolumna: Główny nagłówek z Netlify */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-brand-display font-medium text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#1A1512] leading-[0.98]">
                Poród nie jest <em className="se text-[#EC008C]">niespodzianką.</em>
              </h1>

              <p className="text-lg sm:text-xl text-[#544A44] leading-relaxed max-w-2xl">
                Wszystko, co musisz wiedzieć o ciąży, porodzie i noworodku — bez straszenia, w 9 etapach. Oglądasz kiedy chcesz, z kim chcesz, wracasz ile razy potrzebujesz.
              </p>

              {/* Przyciski CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="#cennik"
                  className="px-8 py-4 rounded-full bg-[#20071F] hover:bg-[#EC008C] text-white font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Dołącz do kursu · 349 zł</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/lekcja/lekcja-01"
                  className="px-6 py-4 rounded-full bg-white hover:bg-neutral-50 text-[#1A1512] font-semibold text-base border border-[#EAE3DB] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4 text-[#EC008C] fill-current" />
                  <span>Darmowa lekcja próbna</span>
                </Link>
              </div>

              {/* Pasek 9 kolorów z Netlify (.hero-sw) */}
              <div className="pt-2">
                <div className="hero-sw max-w-lg">
                  <i style={{ backgroundColor: '#867A72' }} title="01 · Zanim" />
                  <i style={{ backgroundColor: '#15803d' }} title="02 · Dwie kreski" />
                  <i style={{ backgroundColor: '#b45309' }} title="03 · Wreszcie lepiej" />
                  <i style={{ backgroundColor: '#0369a1' }} title="04 · Torba spakowana" />
                  <i style={{ backgroundColor: '#EC008C' }} title="05 · Zaczęło się" />
                  <i style={{ backgroundColor: '#7e22ce' }} title="06 · Plan B" />
                  <i style={{ backgroundColor: '#be185d' }} title="07 · Pierwsza noc w domu" />
                  <i style={{ backgroundColor: '#0e7490' }} title="08 · Karmienie" />
                  <i style={{ backgroundColor: '#4338ca' }} title="09 · Nie śpi" />
                </div>
                <div className="text-xs text-[#867A72] mt-2 font-medium">
                  9 uspokajających etapów · Przewodnik tydzień po tygodniu
                </div>
              </div>
            </div>

            {/* Prawa kolumna: Kinowy zwiastun Cloudflare w purpurowej ramie */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#461643] bg-[#20071F]">
                <div className="aspect-[4/3] sm:aspect-video w-full relative">
                  <iframe
                    src={previewStreamUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    title="HappyBirth Zwiastun i Lekcja 1"
                  />
                </div>
                <div className="p-3.5 bg-[#250A24] text-[#EAD5E5] flex items-center justify-between text-xs border-t border-[#461643]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
                    <span className="font-semibold text-white">Lekcja 1 (Podgląd bezpłatny)</span>
                  </div>
                  <span className="font-mono text-[#EAD5E5]/70">5:33 min · Cloudflare Stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROOF BAR (.proof z Netlify)                                           */}
      {/* ========================================================================= */}
      <section className="border-y border-[#EAE3DB] py-8 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div>
              <div className="font-brand-display font-medium text-4xl sm:text-5xl text-[#1A1512] tracking-tight">
                32 000+
              </div>
              <div className="text-xs text-[#867A72] font-medium mt-1">
                Rodziców przygotowanych do porodu
              </div>
            </div>
            <div>
              <div className="font-brand-display font-medium text-4xl sm:text-5xl text-[#EC008C] tracking-tight">
                52
              </div>
              <div className="text-xs text-[#867A72] font-medium mt-1">
                Lekcje wideo VOD w jakości 4K
              </div>
            </div>
            <div>
              <div className="font-brand-display font-medium text-4xl sm:text-5xl text-[#1A1512] tracking-tight">
                4
              </div>
              <div className="text-xs text-[#867A72] font-medium mt-1">
                Ekspertki medyczne podpisane imieniem
              </div>
            </div>
            <div>
              <div className="font-brand-display font-medium text-4xl sm:text-5xl text-indigo-900 tracking-tight">
                12 msc
              </div>
              <div className="text-xs text-[#867A72] font-medium mt-1">
                Dostępu od terminu porodu dla dwojga
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DZIEWIĘĆ ETAPÓW (Nagłówek i styl z Netlify)                            */}
      {/* ========================================================================= */}
      <section id="etapy" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-2">
              MAPA KURSU
            </div>
            <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
              Dziewięć etapów. Każdy ma swój <em className="se text-[#EC008C]">kolor.</em>
            </h2>
            <p className="text-base text-[#544A44] max-w-xl mt-2">
              Koniec z szukaniem po omacku. Wybierz swój etap lub tydzień ciąży i oglądaj tylko to, co jest dla Ciebie ważne w tym momencie.
            </p>
          </div>

          <Link
            href="/lekcje"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#1A1512] hover:text-[#EC008C] transition-colors"
          >
            <span>Przeglądaj wszystkie 52 lekcje</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StageTimeline />
      </section>

      {/* ========================================================================= */}
      {/* 4. CZTERY EKSPERTKI (.exp z Netlify)                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-2">
            ZESPÓŁ MEDYCZNY
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
            Cztery ekspertki. Każda podpisana <em className="se text-[#EC008C]">imieniem.</em>
          </h2>
          <p className="text-base text-[#544A44] max-w-xl mt-2">
            Żadnych anonimowych poradników. Praktyczna wiedza od kobiet, które codziennie pracują na salach porodowych i oddziałach noworodkowych.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {experts.map((exp) => (
            <div
              key={exp.name}
              className="rounded-[14px] p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: exp.bg }}
            >
              <div>
                <h3 className="font-brand-display font-medium text-3xl text-[#1A1512]">
                  {exp.name}
                </h3>
                <div
                  className="text-xs font-bold tracking-wide uppercase mt-1 mb-3"
                  style={{ color: exp.color }}
                >
                  {exp.role}
                </div>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed mt-2">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NARZĘDZIA ZA DARMO: CYFROWA APTECZKA & LICZNIK 5-1-1                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-2">
            ZA DARMO DZIŚ W NOCY
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
            Zacznij od czegoś, co działa dziś <em className="se text-[#EC008C]">w nocy.</em>
          </h2>
          <p className="text-base text-[#544A44] max-w-2xl mt-2">
            Gdy dopada Cię niepokojący objaw lub zaczynają się pierwsze skurcze — nie musisz szukać po omacku. Skorzystaj z naszych darmowych narzędzi.
          </p>
        </div>

        {/* Apteczka Porodowa Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAE3EB]/50 border border-[#EC008C]/20">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EC008C] text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Cyfrowa Apteczka Porodowa
            </span>
            <h3 className="font-brand-display font-medium text-2xl sm:text-3xl text-[#1A1512]">
              Szybka wyszukiwarka objawów i pytań
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] mt-1.5">
              Wpisz hasło (np. <em>zgaga</em>, <em>skurcze</em>, <em>czop</em>, <em>nawał</em>, <em>kolki</em>, <em>RKO</em>) i przejdź do rzetelnej wiedzy medycznej.
            </p>
          </div>

          <DigitalMedicineCabinet />
        </div>

        {/* Licznik Skurczów Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Gotowe na poród
            </span>
            <h3 className="font-brand-display font-medium text-3xl text-[#1A1512]">
              Licznik skurczów 5-1-1 w Twoim telefonie
            </h3>
            <p className="text-sm text-[#544A44] leading-relaxed">
              Mierz czas trwania skurczu jednym dotknięciem ekranu. Aplikacja automatycznie wylicza odstępy i poinformuje Was, kiedy osiągniecie szpitalną regułę wyjazdu 5-1-1.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#EAE3DB] space-y-2 text-xs text-[#544A44]">
              <div className="flex items-center gap-2 text-[#1A1512] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Działa także w murach szpitala offline</span>
              </div>
              <p className="text-[#867A72]">
                Aplikacja zapamiętuje pomiary lokalnie w telefonie.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SosContractionCounter />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CENA (.price z Netlify: Purpurowy aksamit, złote ticki #FCD705)        */}
      {/* ========================================================================= */}
      <section id="cennik" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-2">
            CENA I WARUNKI
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
            Jedna liczba. Bez formularza i bez <em className="se text-[#EC008C]">„zapytaj o ofertę”.</em>
          </h2>
        </div>

        {/* Ciemnofioletowa / Purpurowa karta cennika z Netlify */}
        <div className="relative rounded-[14px] bg-[#20071F] text-[#F3EDE7] p-8 sm:p-12 shadow-2xl border border-[#461643] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EC008C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Lewa strona: Cena i CTA */}
            <div className="md:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#351034] text-[#EC008C] border border-[#EC008C]/30">
                Płatność jednorazowa · Zero ukrytych subskrypcji
              </span>

              <h3 className="font-brand-display font-medium text-2xl sm:text-3xl text-white">
                Pełny dostęp do platformy HappyBirth
              </h3>

              <div className="flex items-baseline space-x-2 py-2">
                <span className="font-brand-display font-medium text-6xl sm:text-7xl text-white tracking-tight">
                  349
                </span>
                <span className="font-brand-serif italic text-3xl text-[#EC008C]">
                  zł
                </span>
                <span className="text-xs text-[#EAD5E5]/70 ml-2">
                  za dwoje rodziców
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#EAD5E5]/80 leading-relaxed">
                Gwarancja dostępu na <strong>12 miesięcy od przewidywanego terminu porodu</strong>. Oglądacie w ciąży, w trakcie przygotowań i przez cały pierwszy rok życia dziecka.
              </p>

              <div className="pt-2">
                <Link
                  href="/lekcja/lekcja-01"
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-[#EC008C] hover:bg-[#C80077] text-white font-bold text-base transition-all shadow-xl hover:scale-105"
                >
                  <span>Kup teraz (BLIK, Karta, Apple Pay)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="text-[11px] text-[#EAD5E5]/60 mt-2">
                  Bezpieczna subdomena strefa.happybirth.pl · Natychmiastowy dostęp
                </div>
              </div>
            </div>

            {/* Prawa strona: Lista zalet z żółtymi punktami z Netlify (#FCD705) */}
            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#461643] pt-6 md:pt-0 md:pl-8">
              <ul className="tick-list text-xs sm:text-sm text-[#D7CCC3] space-y-3">
                <li>52 profesjonalne lekcje wideo VOD w 4K</li>
                <li>Dostęp dla dwojga (Partner bez dopłaty)</li>
                <li>Cyfrowa Apteczka Porodowa 24/7</li>
                <li>Licznik skurczów 5-1-1 działający offline</li>
                <li>Wzór Planu Porodu & Checklisty PDF</li>
                <li>Opieka merytoryczna 4 ekspertek medycznych</li>
                <li>12 miesięcy od terminu porodu</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQ (Zanim kupisz z Netlify)                                           */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#867A72] mb-2">
            PYTANIA I ODPOWIEDZI
          </div>
          <h2 className="font-brand-display font-medium text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
            Zanim <em className="se text-[#EC008C]">kupisz.</em>
          </h2>
        </div>

        <div className="divide-y divide-[#EAE3DB]">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5 space-y-2">
              <h3 className="font-brand-display font-semibold text-lg sm:text-xl text-[#1A1512]">
                {faq.q}
              </h3>
              <p className="text-sm text-[#544A44] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
