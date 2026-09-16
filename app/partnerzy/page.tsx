'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import {
  Users,
  CheckCircle2,
  Gift,
  QrCode,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
  Mail,
  ChevronRight,
  Lock,
  Percent,
} from 'lucide-react';

export default function PartnerzyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Położna środowiskowa / szpitalna',
    city: '',
    email: '',
    phone: '',
    freePack: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-0">
      {/* Header B2B */}
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <div className="border-l border-[#EAE3DB] pl-3">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                Strefa Partnera
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#867A72] font-semibold">
                program afiliacyjny b2b
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-semibold text-[#544A44] hover:text-[#EC008C] transition-colors"
            >
              ← Wróć do HappyBirth
            </Link>
            <a
              href="#formularz"
              className="px-5 py-2 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-sm shadow-[#EC008C]/25 hover:scale-105"
            >
              Dołącz do programu
            </a>
          </div>
        </div>
      </header>

      {/* Hero B2B */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-semibold text-[#EC008C]">
            <Users className="w-3.5 h-3.5" />
            <span>Dedykowany program dla Położnych, Gabinetów i Fizjoterapeutek</span>
          </div>

          <h1 className="font-brand-display font-medium text-4xl sm:text-6xl text-[#1A1512] leading-tight">
            Wspieraj przyszłe mamy i buduj{' '}
            <em className="font-brand-serif italic font-normal text-[#EC008C]">
              dodatkowy przychód.
            </em>
          </h1>

          <p className="text-base sm:text-xl text-[#544A44] leading-relaxed">
            Polecaj nowoczesną szkołę rodzenia online, której możesz zaufać. Przyszłe mamy zyskują <strong>rabat -30 zł</strong>, a Ty otrzymujesz <strong>20% prowizji (ok. 70 zł)</strong> od każdej poleconej rodziny.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#formularz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-[#EC008C]/25 hover:scale-105"
            >
              <span>Zarejestruj się i odbierz pakiet startowy</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#jak-to-dziala"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#EAE3DB] bg-white hover:bg-stone-50 text-sm font-semibold text-[#1A1512] transition-colors"
            >
              <span>Jak to działa?</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3 Filary Programu Partnerskiego (Model Win-Win) */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#EAE3DB]" id="jak-to-dziala">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
              Korzyści dla Ciebie i Rodzin
            </span>
            <h2 className="font-brand-display font-medium text-3xl sm:text-4xl text-[#1A1512]">
              Dlaczego warto współpracować z HappyBirth?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Karta 1: Przyszła Mama */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center font-bold">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-medium text-2xl text-[#1A1512]">
                Dla Przyszłej Mamy: Zniżka -30 zł
              </h3>
              <p className="text-sm text-[#544A44] leading-relaxed">
                Każda mama, której przekażesz swoją wizytówkę lub link, otrzymuje kod rabatowy obniżający cenę kursu z 349 zł do 319 zł. Dajesz jej realną korzyść i sprawdzoną opiekę.
              </p>
            </div>

            {/* Karta 2: Prowizja */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D0EBF3] text-[#0088BC] flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-medium text-2xl text-[#1A1512]">
                Dla Ciebie: 20% Prowizji (70 zł)
              </h3>
              <p className="text-sm text-[#544A44] leading-relaxed">
                Zarabiasz ok. 70 zł od każdego zakupu z Twojego polecenia. Przy 20 mamach miesięcznie to ponad <strong>1 400 zł dodatkowego przychodu</strong>, wypłacanego regularnie co miesiąc.
              </p>
            </div>

            {/* Karta 3: Transparentność */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DFEED4] text-[#347A22] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-brand-display font-medium text-2xl text-[#1A1512]">
                Dedykowany Kod i Panel
              </h3>
              <p className="text-sm text-[#544A44] leading-relaxed">
                Otrzymujesz swój unikalny kod rabatowy (np. <code>KOWALSKA30</code>) oraz dostęp do panelu, w którym widzisz liczbę zamówień i stan swoich prowizji w czasie rzeczywistym.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symulator Zarobków */}
      <section className="py-16 px-4 sm:px-6 bg-[#250A24] text-white">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
              Kalkulator partnerski
            </span>
            <h2 className="font-brand-display font-medium text-3xl sm:text-5xl">
              Ile możesz zyskać polecając HappyBirth?
            </h2>
            <p className="text-sm text-[#EAD5E5]/80 max-w-xl mx-auto">
              Wypłacamy 20% od każdej zrealizowanej transakcji przelewem na konto bankowe raz w miesiącu na podstawie faktury lub rachunku.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs text-[#EAD5E5]/70 uppercase tracking-wider">10 mam / msc</div>
              <div className="font-brand-display text-4xl font-bold text-[#FCD705]">~700 zł</div>
              <div className="text-xs text-[#EAD5E5]/60">miesięcznie dodatkowego zysku</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#EC008C]/20 border border-[#EC008C] space-y-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#EC008C] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                Średnia dla gabinetu
              </span>
              <div className="text-xs text-[#EAD5E5]/70 uppercase tracking-wider">25 mam / msc</div>
              <div className="font-brand-display text-4xl font-bold text-[#FCD705]">~1 750 zł</div>
              <div className="text-xs text-[#EAD5E5]/60">miesięcznie dodatkowego zysku</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs text-[#EAD5E5]/70 uppercase tracking-wider">50 mam / msc</div>
              <div className="font-brand-display text-4xl font-bold text-[#FCD705]">~3 500 zł</div>
              <div className="text-xs text-[#EAD5E5]/60">miesięcznie dodatkowego zysku</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formularz Rejestracji B2B */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto" id="formularz">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE3DB] shadow-lg space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC008C]">
              Krok do współpracy
            </span>
            <h2 className="font-brand-display font-medium text-3xl text-[#1A1512]">
              Dołącz do Programu Partnerskiego
            </h2>
            <p className="text-xs sm:text-sm text-[#544A44]">
              Wypełnij krótki formularz. W ciągu 24 godzin wygenerujemy Twój unikalny kod i prześlemy dostęp do panelu partnerskiego.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                Dziękujemy za zgłoszenie!
              </h3>
              <p className="text-sm text-[#544A44] max-w-md mx-auto leading-relaxed">
                Skontaktujemy się z Tobą pod adresem <strong>{formData.email}</strong> z Twoim kodem partnerskim oraz potwierdzeniem wysyłki bezpłatnego pakietu materiałów do gabinetu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Imię i Nazwisko
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="np. Anna Kowalska"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Zawód / Specjalizacja
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C] bg-white"
                  >
                    <option>Położna środowiskowa / szpitalna</option>
                    <option>Fizjoterapeutka uroginekologiczna</option>
                    <option>Gabinety ginekologiczne / NZOZ</option>
                    <option>Certyfikowana Doradczyni Laktacyjna (CDL/IBCLC)</option>
                    <option>Doula / Instruktorka hipnoporodu</option>
                    <option>Twórczyni internetowa / Influencerka</option>
                    <option>Inne</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kontakt@twojgabinet.pl"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                  Miasto i adres do wysyłki bezpłatnego pakietu materiałów
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="np. Warszawa, ul. Medyczna 12/4"
                  className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-[#544A44]">
                <input
                  type="checkbox"
                  id="pack"
                  checked={formData.freePack}
                  onChange={(e) => setFormData({ ...formData, freePack: e.target.checked })}
                  className="w-4 h-4 rounded text-[#EC008C] focus:ring-[#EC008C]"
                />
                <label htmlFor="pack">
                  Chcę bezpłatnie otrzymać fizyczny stojak na biurko oraz pakiet wizytówek z kodem QR do gabinetu
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-sm transition-all shadow-md shadow-[#EC008C]/25 mt-4 hover:scale-[1.01]"
              >
                Wyślij zgłoszenie do programu
              </button>

              <div className="text-center text-[11px] text-[#867A72] pt-2">
                Rejestracja w programie jest całkowicie bezpłatna i nie zobowiązuje do wyłączności.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Stopka B2B */}
      <footer className="border-t border-[#EAE3DB] py-8 text-center text-xs text-[#867A72] bg-white">
        <p>© {new Date().getFullYear()} HappyBirth B2B. Wszelkie prawa zastrzeżone. Program Partnerski dla Profesjonalistów.</p>
      </footer>
    </div>
  );
}
