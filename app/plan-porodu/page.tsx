'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Logo } from '@/components/logo';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { BuyCourseButton } from '@/components/buy-button';

const DynamicBirthPlanGenerator = dynamic(
  () => import('@/components/birth-plan-generator').then((m) => m.BirthPlanGenerator),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 rounded-3xl bg-white border border-[#EAE3DB] text-center text-sm text-[#544A44]">
        Ładowanie interaktywnego kreatora dokumentu...
      </div>
    ),
  }
);

export default function PublicPlanPoroduLeadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rodoConsent, setRodoConsent] = useState(false);
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

    if (!rodoConsent) {
      setErrorMsg('Zaznacz zgodę RODO, aby odblokować bezpłatny kreator PDF.');
      return;
    }

    try {
      setLoading(true);

      // Pobierz parametry UTM z URL lub sessionStorage (bez danych o zdrowiu)
      const utm: Record<string, string> = {};
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
          rodoConsent,
          toolSource: 'plan-porodu',
          utm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUnlocked(true);
      } else {
        setErrorMsg(data.error || 'Wystąpił problem przy odblokowaniu kreatora.');
      }
    } catch (err) {
      console.error('Błąd zapisu leada:', err);
      // W razie problemów sieciowych odblokowujemy generator, aby nie blokować rodziców
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
                Plan Porodu PDF
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#867A72] font-semibold">
                Standard 2026 (Dz.U. 2025 poz. 1525)
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
            <span>Oficjalny Szablon Praw Rodziców dla Szpitali 2026</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight leading-tight">
            Interaktywny Kreator i Wzór{' '}
            <em className="font-brand-serif italic font-normal text-[#EC008C]">
              Planu Porodu (PDF)
            </em>
          </h1>

          <p className="text-sm sm:text-base text-[#544A44] leading-relaxed max-w-2xl mx-auto">
            Zgodnie ze Standardem Organizacyjnym Opieki Okołoporodowej (Dz.U. 2025 poz. 1525) macie ustawowe prawo przedstawić zespołowi opiekującemu się Wami swoje świadome preferencje organizacyjne. Wygenerujcie dokument we dwoje i zapiszcie go w PDF.
          </p>
        </div>

        {/* Faza 1: Sterylny Formularz Zapisu (Widoczny przed odblokowaniem) */}
        {!unlocked ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="hb-kadr-editorial hb-kadr-ramka aspect-[4/3]">
                <img
                  src="/img/editorial/hb-para-wsparcie-przy-oknie.jpg"
                  alt="Przyszli rodzice spokojnie rozmawiający razem przy oknie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3DB] text-xs text-[#544A44] leading-relaxed space-y-1">
                <p className="font-bold text-[#1A1512] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% prywatności w Twojej przeglądarce</span>
                </p>
                <p>
                  Kreator działa lokalnie w Twojej przeglądarce — na serwer nie trafiają żadne odpowiedzi medyczne ani termin porodu.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3DB] shadow-xl space-y-6">
              <div className="space-y-2 border-b border-[#EAE3DB] pb-5">
                <h2 className="font-brand-display font-bold text-xl text-[#250A24]">
                  Odbierz bezpłatny dostęp do kreatora i wzoru PDF
                </h2>
                <p className="text-xs text-[#867A72]">
                  Wpisz imię i adres e-mail, aby natychmiast odblokować interaktywny kreator dokumentu PDF oraz otrzymać bezpłatną lekcję demonstracyjną kursu (18 miesięcy / 548 dni dostępu w pełnej wersji).
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
                    Adres e-mail (do wysyłki materiałów i linku)
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
                    Zgadzam się na przetwarzanie mojego adresu e-mail przez KLARSOLUTIONS Sp. z o.o. w celu odblokowania kreatora PDF oraz otrzymania bezpłatnych materiałów edukacyjnych HappyBirth zgodnie z{' '}
                    <Link href="/polityka-prywatnosci" className="underline hover:text-[#EC008C]">
                      Polityką Prywatności
                    </Link>
                    .
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
                    <span>Zero pikseli i zero danych o zdrowiu</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Faza 2: Odsłonięty Pełny Kreator (Ładowany wyłącznie po odblokowaniu) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <strong>Kreator został odblokowany!</strong> Wybierz preferencje poniżej (wszystkie wybory zostają w Twojej przeglądarce), a następnie kliknij <strong>Drukuj / Zapisz do PDF</strong>.
                </div>
              </div>
            </div>

            <DynamicBirthPlanGenerator />

            {/* Pasek Zachęty do Pełnego Kursu VOD */}
            <div className="rounded-3xl bg-gradient-to-r from-[#250A24] via-[#3B1038] to-[#20071F] p-8 sm:p-10 text-white border border-[#461643] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12 print:hidden">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EC008C]">
                  Kompleksowe Przygotowanie
                </span>
                <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-white">
                  Chcecie przygotować się we własnym tempie?
                </h3>
                <p className="text-xs sm:text-sm text-[#EAD5E5]/80 max-w-xl">
                  52 filmowe lekcje 4K, techniki oddechowe, wsparcie dla partnera i dostęp przez 18 miesięcy (548 dni) od zakupu w jednorazowej cenie 489,00 zł brutto.
                </p>
              </div>

              <BuyCourseButton className="px-8 py-4 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-sm transition-all shadow-xl shadow-[#EC008C]/30 hover:scale-105 shrink-0 cursor-pointer">
                <span>Dołącz do kursu · 489,00 zł</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </BuyCourseButton>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#EAE3DB] bg-white/80 py-6 px-4 text-center text-[11px] text-[#867A72] space-y-1.5 print:hidden">
        <p>
          HappyBirth.pl — edukacyjny kurs szkoły rodzenia online (PKD 85.59.B), 52 lekcje 4K · 489,00 zł brutto · 18 miesięcy (548 dni) dostępu. Materiały mają charakter edukacyjny i nie stanowią porady medycznej.
        </p>
        <p>
          Usługodawca: <strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong>, ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779 · kapitał zakładowy: 5 000,00 PLN ·{' '}
          <Link href="/regulamin" className="underline hover:text-[#EC008C]">Regulamin</Link> ·{' '}
          <Link href="/polityka-prywatnosci" className="underline hover:text-[#EC008C]">Polityka prywatności</Link>
        </p>
      </footer>
    </div>
  );
}
