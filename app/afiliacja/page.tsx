'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Percent,
  Sparkles,
  Award,
  Heart,
  Lock,
  Building2,
} from 'lucide-react';

/**
 * [D4a-1] Podstrona https://happybirth.pl/afiliacja
 * Program Afiliacyjny dla Położnych, Fizjoterapeutek, Doradczyń Laktacyjnych i Twórców
 * Model [D1b]: 2-Tier Capped CPA („Daj 10%, Odbierz 20%–30% + 5% Broker”)
 */
export default function AfiliacjaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignedCode, setAssignedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleCategory: 'midwife_physio',
    roleOrArea: 'Położna środowiskowa / szpitalna',
    profileUrl: '',
    message: '',
    rodoConsent: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'afiliacja',
          ...formData,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.promoCode) {
        setAssignedCode(data.promoCode);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512]">
      {/* Header */}
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-auto object-contain" />
            <div className="border-l border-[#EAE3DB] pl-3">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                Program Afiliacyjny
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#DA0271] font-bold">
                dla położnych, ekspertek i twórców
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/partnerzy"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#544A44] hover:text-[#DA0271]"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Dla Marek i Sponsorów B2B (/partnerzy)</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-[#544A44] hover:text-[#DA0271]"
            >
              ← Strona główna
            </Link>
            <a
              href="#zgloszenie"
              className="px-5 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold transition-all shadow-sm"
            >
              Dołącz do programu
            </a>
          </div>
        </div>
      </header>

      {/* 1. HERO + DLA KOGO */}
      <section className="pt-12 sm:pt-20 pb-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-bold text-[#DA0271]">
            <Users className="w-3.5 h-3.5" />
            <span>Program Afiliacyjny 2-Tier Capped CPA · Rzetelna Edukacja Okołoporodowa</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1A1512] leading-tight">
            Daj przyszłym rodzicom <span className="text-[#DA0271]">10% rabatu</span>, a sama odbierz{' '}
            <span className="text-[#DA0271]">20%–30% prowizji</span> (+5% Broker).
          </h1>

          <p className="text-base sm:text-lg text-[#544A44] leading-relaxed max-w-3xl">
            Polecaj szkołę rodzenia online HappyBirth.pl nagraną z dyplomowanymi położnymi, doradczyniami laktacyjnymi i fizjoterapeutkami ze szkoły <strong>Mama Gaja w Poznaniu (od 2012 r.)</strong>. Przyszłe mamy zyskują kurs <strong>440,10 zł zamiast 489,00 zł</strong> i aż <strong>18 miesięcy dostępu od zakupu</strong>, a Ty otrzymujesz uczciwe wynagrodzenie za każde polecenie.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#zgloszenie"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm sm:text-base transition-all shadow-lg"
            >
              <span>Odbierz swój kod -10% i link partnerski</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#stawki"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#EAE3DB] bg-white hover:bg-stone-50 text-sm font-bold text-[#1A1512]"
            >
              <span>Sprawdź tabelę stawek (20%–30% + 5%)</span>
            </a>
          </div>
        </div>

        {/* Dla kogo jest program */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {[
            {
              title: 'Położne środowiskowe i szpitalne',
              desc: 'Stawka specjalna 30% (132,03 zł od każdego kursu z Twoim kodem -10%). Doskonałe uzupełnienie wizyt patronażowych i edukacji przedporodowej.',
            },
            {
              title: 'Fizjoterapeutki uroginekologiczne i CDL',
              desc: 'Stawka 30% (132,03 zł). Kurs wspiera Twoje zalecenia gabinetowe w zakresie pracy z dnem miednicy, oddechem, blizną i laktacją.',
            },
            {
              title: 'Wydawcy treści, blogerzy i twórcy dla ojców',
              desc: 'Stawka 25% (110,03 zł z kodem -10% lub 122,25 zł przy pełnej cenie 489 zł) dla twórców recenzji, wideo i portali parentingowych.',
            },
            {
              title: 'Mikrotwórczynie parentingowe',
              desc: 'Stawka bazowa 20% (88,02 zł od sprzedaży z kodem -10%). Cenimy autentyczne zaufanie społeczności wyżej niż puste zasięgi.',
            },
            {
              title: 'Lokalne szkoły rodzenia (bez własnego VOD)',
              desc: 'Zaoferuj swoim kursantkom dostęp do 52 lekcji wideo 4K i materiałów powtórkowych w domu na 18 miesięcy.',
            },
            {
              title: 'Liderki środowisk medycznych (Broker Tier 2)',
              desc: 'Zaproś do programu inne położne lub twórczynie i otrzymuj 5% pasywnej prowizji (22,00 zł–24,45 zł) od każdej ich sprzedaży.',
            },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-[#EAE3DB] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-[#DA0271] font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h3>{item.title}</h3>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. MODEL PROWIZYJNY D1b: 2-TIER CAPPED CPA */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#EAE3DB]" id="stawki">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
              Przejrzysty model finansowy (D1b)
            </span>
            <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512]">
              Jak działa model 2-Tier Capped CPA?
            </h2>
            <p className="text-sm text-[#544A44] leading-relaxed">
              Cena regularna kursu wynosi <strong>489,00 zł brutto</strong>. Z Twoim kodem rabatowym <strong>-10%</strong> przyszła mama płaci <strong>440,10 zł brutto</strong> za 18 miesięcy dostępu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-xs font-bold text-[#1A1512]">
                Poziom 1 · Stawka Bazowa (20%)
              </div>
              <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#1A1512]">
                88,02 zł <span className="text-sm font-normal text-[#867A72]">/ kurs</span>
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Dla mikrotwórczyń i partnerów standardowych (20% od kwoty 440,10 zł opłaconej z kodem rabatowym -10%).
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D0EBF3] text-xs font-bold text-[#006A96]">
                Poziom 1 · Twórcy i Wydawcy (25%)
              </div>
              <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#1A1512]">
                110,03 zł – 122,25 zł
              </div>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Dla wydawców treści, blogerów i twórców wideo (110,03 zł przy zakupie z kodem -10% lub 122,25 zł przy pełnej cenie 489 zł z linku).
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#250A24] text-white border-2 border-[#DA0271] space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DA0271] text-xs font-bold text-white">
                Poziom 1 · Położne i Fizjoterapeutki (30%)
              </div>
              <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#FCD705]">
                132,03 zł <span className="text-sm font-normal text-[#EAD5E5]">/ kurs</span>
              </div>
              <p className="text-xs text-[#EAD5E5]/90 leading-relaxed">
                Stawka specjalna dla zweryfikowanych położnych, fizjoterapeutek uroginekologicznych i doradczyń laktacyjnych (30% z kodem -10%).
              </p>
            </div>
          </div>

          {/* Poziom 2 Broker Override + Bezpieczniki Anty-MLM */}
          <div className="rounded-3xl bg-[#FBF8F4] border border-[#EAE3DB] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                <Award className="w-4 h-4" />
                <span>Poziom 2 · Broker Override (5% prowizji pasywnej)</span>
              </div>
              <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512]">
                22,00 zł (z kodem) lub 24,45 zł (cena pełna) od każdej sprzedaży zaproszonego partnera
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                Jeśli jesteś położną oddziałową, liderką środowiska medycznego lub prowadzisz agencję i zaprosisz do programu inne położne lub twórczynie, otrzymujesz 5% od każdej wygenerowanej przez nie sprzedaży.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-2 text-xs text-[#544A44]">
              <div className="font-bold text-[#1A1512] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Twarde bezpieczniki Anty-MLM i zasady atrybucji (D2 + D2a):</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><strong>Odcięcie na 2. poziomie:</strong> Brak poziomu 3 i kolejnych, 100% darmowe dołączenie, 0 zł za samą rekrutację partnera.</li>
                <li><strong>Podwójna atrybucja (Link 30 dni + Kod):</strong> Link partnerski <code>?ref=</code> działa w oknie 30 dni (ciasteczko First-Party <code>hb_aff_ref</code>), natomiast kod rabatowy świadomie wpisany w koszyku ma <strong>zawsze pierwszeństwo</strong>.</li>
                <li><strong>Szybkie odblokowanie prowizji (D2a):</strong> Prowizja przechodzi w status zatwierdzony (<code>ELIGIBLE</code>) z chwilą zalogowania się klientki do kursu (co wygasza prawo odstąpienia na mocy Art. 38 ust. 1 pkt 13 u.p.k.) + krótki bufor techniczny 7–14 dni.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ETYKA, UOKiK I IZOLACJA RODO (E4 + E5) */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE3DB] space-y-3">
            <h3 className="font-brand-display text-xl font-bold text-[#1A1512] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DA0271]" />
              <span>Zasady UOKiK i etyka komunikacji medycznej ([E4])</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Wszystkie publikacje z linkiem afiliacyjnym lub kodem rabatowym muszą zawierać czytelne oznaczenie <strong>#reklama</strong> lub <strong>#współpraca</strong> zgodnie z wytycznymi Prezesa UOKiK. Obowiązuje bezwzględny zakaz stosowania obietnic medycznych (np. „gwarantowany poród bez bólu”, „zastępuje opiekę lekarza/położnej”).
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE3DB] space-y-3">
            <h3 className="font-brand-display text-xl font-bold text-[#1A1512] flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>Ścisła izolacja RODO danych o ciąży ([E5])</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Ze względu na ochronę danych szczególnej kategorii (Art. 9 RODO) w zestawieniach afiliacyjnych partner widzi wyłącznie zagregowaną liczbę kliknięć, liczbę użyć kodu rabatowego oraz kwotę naliczonej prowizji — nigdy nie przekazujemy imion, adresów e-mail ani tygodnia ciąży kursantek.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ DLA PARTNERÓW AFILIACYJNYCH */}
      <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-center text-[#1A1512]">
          Najczęstsze pytania partnerów (/afiliacja)
        </h2>
        <div className="space-y-3">
          {[
            {
              q: 'Co ma pierwszeństwo: link afiliacyjny czy kod rabatowy wpisany w koszyku?',
              a: 'Zawsze pierwszeństwo ma imienny kod rabatowy wpisany przez klientkę w koszyku. Jeżeli klientka nie wpisze żadnego kodu, prowizja przypisywana jest do partnera z ostatniego kliknięcia linku ?ref= w oknie 30 dni.',
            },
            {
              q: 'Jak szybko zatwierdzana jest prowizja?',
              a: 'W momencie zakupu prowizja ma status PENDING. Gdy tylko klientka zaloguje się do kursu i otworzy pierwszą lekcję (co wygasza 14-dniowe prawo odstąpienia zgodnie z art. 38 ust. 1 pkt 13 u.p.k.) oraz minie krótki 7–14 dniowy bufor anty-fraud, prowizja przechodzi w status ELIGIBLE do wypłaty na koniec miesiąca.',
            },
            {
              q: 'Czy program wymaga wyłączności lub opłat startowych?',
              a: 'Nie. Udział w programie jest w 100% bezpłatny, nie wymaga wyłączności i możesz zrezygnować w dowolnym momencie.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1.5">
              <h4 className="font-bold text-sm text-[#1A1512]">{faq.q}</h4>
              <p className="text-xs text-[#544A44] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FORMULARZ ZGŁOSZENIOWY DO PROGRAMU AFILIACYJNEGO */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto" id="zgloszenie">
        <div className="bg-white rounded-3xl p-7 sm:p-12 border border-[#EAE3DB] shadow-xl space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
              Formularz rejestracyjny (/afiliacja)
            </span>
            <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
              Zgłoś się do Programu Afiliacyjnego HappyBirth.pl
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44]">
              Otrzymasz bezpłatny dostęp recenzencki do wszystkich 52 lekcji, swój kod rabatowy (-10% dla odbiorczyń) oraz link afiliacyjny.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                Dziękujemy za zgłoszenie do programu!
              </h3>
              {assignedCode && (
                <div className="inline-block px-5 py-3 rounded-2xl bg-[#FAE3EB] border border-[#F3CAD9] text-[#DA0271] text-sm font-bold">
                  Wstępnie zarezerwowany kod dla Ciebie: <span className="font-mono">{assignedCode}</span>
                </div>
              )}
              <p className="text-xs sm:text-sm text-[#544A44] max-w-md mx-auto leading-relaxed">
                Szczegóły aktywacji oraz dostęp recenzencki do kursu wyślemy na adres <strong>{formData.email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Imię i nazwisko / Nazwa
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="np. mgr Anna Kowalska"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="twoj@email.pl"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Rola / Specjalizacja (Stawka prowizji)
                  </label>
                  <select
                    value={formData.roleCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      const labelMap: Record<string, string> = {
                        midwife_physio: 'Położna / Fizjoterapeutka uroginekologiczna / CDL (30%)',
                        creator_publisher: 'Wydawca treści / Bloger / Twórca wideo (25%)',
                        standard: 'Mikrotwórczyni parentingowa / Partner standardowy (20%)',
                      };
                      setFormData({
                        ...formData,
                        roleCategory: val,
                        roleOrArea: labelMap[val] || val,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm bg-white focus:outline-none focus:border-[#DA0271]"
                  >
                    <option value="midwife_physio">Położna / Fizjoterapeutka / Doradczyni CDL (Stawka 30%)</option>
                    <option value="creator_publisher">Wydawca treści / Bloger / Twórca dla ojców (Stawka 25%)</option>
                    <option value="standard">Mikrotwórczyni parentingowa / Szkoła rodzenia (Stawka 20%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Link do profilu (IG/TikTok/WWW) lub miejsce praktyki
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.profileUrl}
                    onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                    placeholder="np. instagram.com/twojprofil lub Gabinet Poznań"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5 text-xs text-[#544A44]">
                <input
                  type="checkbox"
                  id="aff-rodo"
                  required
                  checked={formData.rodoConsent}
                  onChange={(e) => setFormData({ ...formData, rodoConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-[#DA0271] focus:ring-[#DA0271]"
                />
                <label htmlFor="aff-rodo">
                  Akceptuję <Link href="/polityka-prywatnosci" className="underline">Politykę Prywatności</Link> (operator: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań) i wyrażam zgodę na kontakt w celu uruchomienia współpracy afiliacyjnej.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Wysyłanie zgłoszenia...' : 'Wyślij zgłoszenie do programu /afiliacja →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Stopka */}
      <footer className="border-t border-[#EAE3DB] py-8 px-4 text-center text-xs text-[#867A72] bg-white space-y-2">
        <div>
          Operator prawny: <strong>KLARSOLUTIONS Sp. z o.o.</strong>, ul. Śląska 14, 60-614 Poznań · NIP: 7812118273 · KRS: 0001268396 · REGON: 545782779
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="underline hover:text-[#DA0271]">Strona główna</Link>
          <Link href="/partnerzy" className="underline hover:text-[#DA0271]">Współpraca dla Marek B2B (/partnerzy)</Link>
          <Link href="/regulamin" className="underline hover:text-[#DA0271]">Regulamin</Link>
          <Link href="/odstap-od-umowy" className="underline hover:text-[#DA0271]">Odstąp od umowy</Link>
        </div>
      </footer>
    </div>
  );
}
