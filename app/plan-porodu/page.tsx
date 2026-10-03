'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { BirthPlanGenerator } from '@/components/birth-plan-generator';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Heart,
  Calendar,
  Lock,
  Download,
  Play,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { BuyCourseButton } from '@/components/buy-button';

export default function PublicPlanPoroduLeadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rodoConsent, setRodoConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Wprowadź prawidłowy adres e-mail.');
      return;
    }

    try {
      setLoading(true);

      // Pobierz parametry UTM z URL lub sessionStorage
      let utm: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const p = new URLSearchParams(window.location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ad_id'].forEach((k) => {
          const val = p.get(k) || sessionStorage.getItem(`hb_${k}`);
          if (val) utm[k] = val;
        });
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          dueDate,
          utm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUnlocked(true);
      } else {
        setErrorMsg(data.error || 'Wystąpił problem przy generowaniu planu.');
      }
    } catch (err) {
      console.error('Błąd zapisu leada:', err);
      // W razie problemów sieciowych odblokowujemy generator, aby nie blokować mamy
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512] flex flex-col selection:bg-[#EC008C]/20">
      {/* Czysty Header */}
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
            <div className="border-l border-[#EAE3DB] pl-2.5">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                Plan Porodu
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#867A72] font-semibold">
                standard mz 2024
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#544A44] hover:text-[#EC008C] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do HappyBirth</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10">
        {/* Wstęp merytoryczno-prawny (Sterylna Śluza dla bota Mety) */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-semibold text-[#EC008C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oficjalny Szablon Praw Pacjenta dla Szpitali</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight leading-tight">
            Interaktywny Kreator i Wzór{' '}
            <em className="font-brand-serif italic font-normal text-[#EC008C]">
              Planu Porodu (PDF)
            </em>
          </h1>

          <p className="text-sm sm:text-base text-[#544A44] leading-relaxed max-w-2xl mx-auto">
            Zgodnie ze Standardem Organizacyjnym Opieki Okołoporodowej w Polsce masz ustawowe prawo przedstawić personelowi medycznemu swoje świadome preferencje. Wygenerujcie dokument we dwoje, wydrukujcie i weźcie ze sobą do szpitala.
          </p>
        </div>

        {/* Faza 1: Sterylny Formularz Zapisu (Widoczny przed odblokowaniem) */}
        {!unlocked ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3DB] shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[#EAE3DB] pb-5">
              <h2 className="font-brand-display font-bold text-xl text-[#250A24]">
                Odbierz bezpłatny dostęp do kreatora i wzoru PDF
              </h2>
              <p className="text-xs text-[#867A72]">
                Wpisz poniższe dane, aby natychmiast odblokować interaktywny formularz oraz otrzymać kopię dokumentu i bezpłatną lekcję demonstracyjną na e-mail.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342D28] block">
                  Twoje Imię
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Anna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] focus:outline-none focus:ring-2 focus:ring-[#EC008C] text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342D28] block">
                  Adres e-mail (do wysyłki gotowego PDF)
                </label>
                <input
                  type="email"
                  required
                  placeholder="twoj.mail@domena.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] focus:outline-none focus:ring-2 focus:ring-[#EC008C] text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342D28] block">
                  Przewidywany termin porodu (opcjonalnie)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] focus:outline-none focus:ring-2 focus:ring-[#EC008C] text-sm text-[#544A44]"
                  />
                </div>
                <p className="text-[11px] text-[#867A72]">
                  Dzięki temu dopasujemy wskazówki i ściągi do aktualnego etapu ciąży.
                </p>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="rodo"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[#EC008C] focus:ring-[#EC008C]"
                />
                <label htmlFor="rodo" className="text-[11px] text-[#867A72] leading-tight">
                  Zgadzam się na przetwarzanie danych w celu wygenerowania Planu Porodu oraz otrzymania bezpłatnych materiałów edukacyjnych HappyBirth zgodnie z <Link href="/polityka-prywatnosci" className="underline hover:text-[#EC008C]">Polityką Prywatności</Link>.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-sm transition-all shadow-lg shadow-[#EC008C]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Odblokowywanie formularza...</span>
                    </>
                  ) : (
                    <>
                      <span>Odblokuj bezpłatny Kreator Planu Porodu</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#867A72]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Bezpłatnie</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bezpieczeństwo RODO</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Faza 2: Odsłonięty Pełny Kreator (Po wypełnieniu formularza) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <strong>Kreator został odblokowany!</strong> Wypełnij preferencje poniżej, a następnie kliknij <strong>Drukuj / Zapisz do PDF</strong>.
                </div>
              </div>
            </div>

            <BirthPlanGenerator />

            {/* Pasek Zachęty do Pełnego Kursu VOD */}
            <div className="rounded-3xl bg-gradient-to-r from-[#250A24] via-[#3B1038] to-[#20071F] p-8 sm:p-10 text-white border border-[#461643] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12 print:hidden">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
                  Kompleksowe Przygotowanie
                </span>
                <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-white">
                  Chcecie rodzić w pełnym spokoju?
                </h3>
                <p className="text-xs sm:text-sm text-[#EAD5E5]/80 max-w-xl">
                  52 filmowe lekcje 4K, techniki oddechowe, masaż dla partnera i wsparcie na pierwsze 12 miesięcy w domu.
                </p>
              </div>

              <BuyCourseButton className="px-8 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-sm transition-all shadow-xl shadow-[#EC008C]/30 hover:scale-105 shrink-0 cursor-pointer">
                <span>Dołącz do kursu · 489 zł</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </BuyCourseButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
