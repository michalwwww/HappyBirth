'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Gift,
  Award,
  Users,
  Calendar,
  FileText,
} from 'lucide-react';

/**
 * [D4a-2] Podstrona https://happybirth.pl/partnerzy
 * Dedykowana, wizerunkowa wizytówka B2B dla marek, producentów wyprawki,
 * dystrybutorów, klinik medycznych, szpitali i pracodawców.
 * (Program prowizyjny dla położnych i twórców został wydzielony na /afiliacja).
 */
export default function PartnerzyB2BPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyOrBrand: '',
    fullName: '',
    email: '',
    phone: '',
    roleOrArea: 'Producent wyprawki / Ekspozycja w Module 4 i Kalkulatorze Wyprawki PDF',
    message: '',
    rodoConsent: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'partnerzy_b2b',
          ...formData,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512]">
      {/* Header B2B */}
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-auto object-contain" />
            <div className="border-l border-[#EAE3DB] pl-3">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                Partnerstwa Strategiczne B2B
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#867A72] font-bold">
                dla marek, producentów, klinik i pracodawców
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/afiliacja"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#DA0271] hover:underline"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Program dla Położnych i Twórców (/afiliacja) →</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-[#544A44] hover:text-[#DA0271]"
            >
              ← Strona główna
            </Link>
            <a
              href="#kontakt-b2b"
              className="px-5 py-2.5 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold transition-all"
            >
              Zapytaj o współpracę B2B
            </a>
          </div>
        </div>
      </header>

      {/* 1. NAGŁÓWEK HERO B2B */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-bold text-[#DA0271]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Współpraca dla Marek, Producentów Wyprawki, Dystrybutorów, Klinik i Sponsorów</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#1A1512] leading-tight">
            Zostań Partnerem Strategicznym HappyBirth.pl —{' '}
            <span className="text-[#DA0271]">
              dotrzyj do przyszłych rodziców w najbardziej decyzyjnym momencie ich życia.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#544A44] leading-relaxed max-w-3xl">
            Łączymy marki najwyższej jakości z rodzicami kompletującymi wyprawkę, wózek, fotelik, łóżeczko i domową apteczkę. Wszystkie rekomendacje przechodzą rygorystyczną selekcję jakościową położnych i fizjoterapeutek z poznańskiej szkoły rodzenia <strong>Mama Gaja (działającej od 2012 r.)</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#kontakt-b2b"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm sm:text-base transition-all shadow-lg"
            >
              <span>Porozmawiajmy o partnerstwie marki</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/afiliacja"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#EAE3DB] bg-white hover:bg-stone-50 text-xs sm:text-sm font-bold text-[#1A1512]"
            >
              <span>Szukasz programu prowizyjnego dla położnych i twórców? Przejdź do /afiliacja →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DLACZEGO MARKI WYBIERAJĄ WSPÓŁPRACĘ Z HAPPYBIRTH.PL */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#EAE3DB]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
              Przewaga Strategiczna B2B
            </span>
            <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512]">
              Dlaczego marki wybierają współpracę z HappyBirth.pl?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAE3EB] text-[#DA0271] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                1. Precyzyjny moment zakupowy
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                Docierasz bezpośrednio do rodziców podejmujących pierwsze decyzje zakupowe w ramach <strong>Modułu 4: Projekt „Gniazdo”, wyprawka i kącik</strong> oraz naszego interaktywnego <strong>Kalkulatora Wyprawki PDF</strong> (wózek, fotelik samochodowy, łóżeczko, materac, kosmetyki i apteczka).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D0EBF3] text-[#006A96] flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                2. Długofalowa relacja: 18 miesięcy dostępu
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                W przeciwieństwie do kursów wygasających po porodzie, <strong>18 miesięcy dostępu (548 dni)</strong> w HappyBirth.pl oznacza obecność Twojej marki w życiu rodziców od pierwszych tygodni ciąży aż do ukończenia 1. roku życia dziecka.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DFEED4] text-[#347A22] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                3. Zaufanie kliniczne i selekcja Mama Gaja
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                Nie prowadzimy agresywnego lokowania produktów w lekcjach. Współpracujemy wyłącznie z markami i producentami, których produkty spełniają rygorystyczne kryteria bezpieczeństwa położnych, doradczyń laktacyjnych i fizjoterapeutek ze szkoły <strong>Mama Gaja</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OBSZARY WSPÓŁPRACY DLA MAREK, PRODUCENTÓW I SPONSORÓW */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
            Formaty Partnerstwa
          </span>
          <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512]">
            Obszary współpracy dla marek, producentów i klinik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Format 1 · Ekspozycja Produktowa</span>
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
              Partnerstwo Merytoryczne i Produktowe
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Ekspozycja bezpiecznych, rekomendowanych produktów w materiałach dodatkowych PDF, Notatniku Rodzica, checklistach wyprawkowych (Moduł 4) oraz w publicznym Kalkulatorze Wyprawki PDF.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Format 2 · Strefa Benefitów</span>
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
              Strefa Benefitów i Rabatów dla Kursantek
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Umieszczenie dedykowanej oferty powitalnej lub kodu zniżkowego Twojej marki wewnątrz zamkniętej Strefy Kursantki dla zweryfikowanych rodziców, którzy zakupili kurs.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Format 3 · Licencje Korporacyjne i Medyczne</span>
            </div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
              Pakiety Licencyjne B2B dla Klinik, Szpitali i Pracodawców
            </h3>
            <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
              Pakiety 18-miesięcznych dostępów do kursu jako nowoczesny benefit pracowniczy dla przyszłych rodziców w firmach (HR Wellbeing) lub pakiet edukacyjny dla pacjentek klinik medycznych i centrów diagnostycznych.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FORMULARZ KONTAKTOWY DLA MAREK I SPONSORÓW */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto" id="kontakt-b2b">
        <div className="bg-white rounded-3xl p-7 sm:p-12 border border-[#EAE3DB] shadow-xl space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
              Kontakt bezpośredni z zarządem
            </span>
            <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
              Formularz Kontaktowy dla Marek, Klinik i Sponsorów
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44]">
              Zostaw krótki opis propozycji — odpowiemy z dopasowaną ofertą współpracy w ciągu 24 godzin roboczych.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                Dziękujemy za wiadomość!
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] max-w-md mx-auto leading-relaxed">
                Otrzymaliśmy Twoje zapytanie dotyczące marki <strong>{formData.companyOrBrand}</strong>. Skontaktujemy się z Tobą pod adresem <strong>{formData.email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Nazwa firmy / marki
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyOrBrand}
                    onChange={(e) => setFormData({ ...formData, companyOrBrand: e.target.value })}
                    placeholder="np. BabySafe Polska Sp. z o.o."
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Imię i nazwisko osoby reprezentującej
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="np. Jan Nowak"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    E-mail służbowy
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="imie.nazwisko@marka.pl"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Telefon kontaktowy
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                  Obszar współpracy
                </label>
                <select
                  value={formData.roleOrArea}
                  onChange={(e) => setFormData({ ...formData, roleOrArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm bg-white focus:outline-none focus:border-[#DA0271]"
                >
                  <option>Producent wyprawki / Ekspozycja w Module 4 i Kalkulatorze Wyprawki PDF</option>
                  <option>Sponsoring merytoryczny i partnerstwo strategiczne</option>
                  <option>Benefity i kody rabatowe dla kursantek w Strefie Rodziców</option>
                  <option>Licencje B2B dla klinik medycznych, szpitali i pracodawców</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                  Krótki opis propozycji
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Opisz krótko profil marki lub zakres planowanej współpracy..."
                  className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                />
              </div>

              <div className="pt-1 flex items-start gap-2.5 text-xs text-[#544A44]">
                <input
                  type="checkbox"
                  id="b2b-rodo"
                  required
                  checked={formData.rodoConsent}
                  onChange={(e) => setFormData({ ...formData, rodoConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-[#DA0271] focus:ring-[#DA0271]"
                />
                <label htmlFor="b2b-rodo">
                  Wyrażam zgodę na przetwarzanie danych kontaktowych przez KLARSOLUTIONS Sp. z o.o. (ul. Śląska 14, 60-614 Poznań) w celu obsługi zapytania B2B zgodnie z <Link href="/polityka-prywatnosci" className="underline">Polityką Prywatności</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Wysyłanie zapytania...' : 'Wyślij zapytanie o współpracę B2B →'}
              </button>
            </form>
          )}

          {/* Przycisk przekierowujący dla twórców i położnych */}
          <div className="pt-4 border-t border-[#EAE3DB] text-center">
            <Link
              href="/afiliacja"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] hover:underline"
            >
              <span>Szukasz programu prowizyjnego dla położnych i twórców? Przejdź do zakładki /afiliacja →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stopka */}
      <footer className="border-t border-[#EAE3DB] py-8 px-4 text-center text-xs text-[#867A72] bg-white space-y-2">
        <div>
          Operator prawny: <strong>KLARSOLUTIONS Sp. z o.o.</strong>, ul. Śląska 14, 60-614 Poznań · NIP: 7812118273 · KRS: 0001268396 · REGON: 545782779
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="underline hover:text-[#DA0271]">Strona główna</Link>
          <Link href="/afiliacja" className="underline hover:text-[#DA0271]">Program Afiliacyjny (/afiliacja)</Link>
          <Link href="/regulamin" className="underline hover:text-[#DA0271]">Regulamin</Link>
          <Link href="/odstap-od-umowy" className="underline hover:text-[#DA0271]">Odstąp od umowy</Link>
        </div>
      </footer>
    </div>
  );
}
