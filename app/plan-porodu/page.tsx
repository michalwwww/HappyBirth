'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageShell, Okruszki } from '@/components/site/page-shell';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Printer,
  Loader2,
} from 'lucide-react';
import { BuyCourseButton } from '@/components/buy-button';

const STERILE_BIRTH_PLAN_SECTIONS = [
  {
    id: 'sec-1',
    category: '1. Przyjęcie do szpitala i warunki na sali',
    items: [
      'Obecność wybranej osoby towarzyszącej przez cały czas pobytu na sali',
      'Przygaszone światło, spokój oraz poszanowanie intymności i prywatności',
      'Możliwość korzystania z własnego ubrania podczas pobytu',
      'Omawianie każdego proponowanego kroku i wyrażanie świadomej zgody (Standard MZ 2026)',
    ],
  },
  {
    id: 'sec-2',
    category: '2. Aktywność, ruch i komfort',
    items: [
      'Swoboda poruszania się, zmiany pozycji oraz korzystania z piłki, worka sako i prysznica',
      'Możliwość picia wody oraz spożywania lekkostrawnych posiłków zgodnie z nowym Standardem 2026',
      'Wsparcie niefarmakologiczne z udziałem osoby towarzyszącej (oddech, masaż pleców, chusta Rebozo)',
      'Indywidualne wsparcie położnej w doborze najwygodniejszych pozycji wertykalnych',
    ],
  },
  {
    id: 'sec-3',
    category: '3. Pierwsze chwile z dzieckiem („Złota Godzina”)',
    items: [
      'Nieprzerwany kontakt „skóra do skóry” przez minimum 2 pełne godziny (Dz.U. 2025 poz. 1525)',
      'Odpępowienie po ustaniu tętnienia pępowiny (zgodnie z wytycznymi WHO)',
      'Pierwsze przystawienie maluszka do piersi jeszcze w trakcie kontaktu skóra do skóry',
      'Wykonywanie pierwszych pomiarów (ważenie, mierzenie) po zakończeniu 2-godzinnego kontaktu',
    ],
  },
  {
    id: 'sec-4',
    category: '4. Pobyt na oddziale położniczym i wsparcie laktacyjne',
    items: [
      'System rooming-in (stałe przebywanie mamy razem z dzieckiem)',
      'Praktyczny instruktaż przystawiania do piersi i wsparcie doradczyni laktacyjnej',
      'Pierwsza kąpiel maluszka w domu (pozostawienie naturalnej mazi płodowej w pierwszych dobach)',
      'Obecność obojga rodziców przy badaniach lekarskich noworodka',
    ],
  },
];

export default function PublicPlanPoroduLeadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rodoConsent, setRodoConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>(
    STERILE_BIRTH_PLAN_SECTIONS.flatMap((s) => s.items)
  );

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Wprowadź prawidłowy adres e-mail.');
      return;
    }
    if (!rodoConsent) {
      setErrorMsg('Zaznacz wymaganą zgodę RODO, aby wygenerować i otrzymać Plan Porodu PDF.');
      return;
    }

    try {
      setLoading(true);

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
        setErrorMsg(data.error || 'Wystąpił problem przy generowaniu planu.');
      }
    } catch (err) {
      console.error('Błąd zapisu leada:', err);
      setErrorMsg('Wystąpił błąd połączenia. Spróbuj ponownie za chwilę.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10">
        <div className="print:hidden">
          <Okruszki biezaca="Plan porodu PDF" />
        </div>

        {/* Wstęp merytoryczno-prawny (Sterylna Śluza zgodna z politykami reklamowymi i RODO Art. 9) */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9E6EC] dark:bg-[#3A2033] border border-[#EAADC0] dark:border-[#4E2840] text-xs font-semibold text-[color:var(--hb-mag-t)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oficjalny Szablon Praw Pacjenta · Standard MZ 2026</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[color:var(--hb-ink)] tracking-tight leading-tight">
            Interaktywny Kreator i Wzór{' '}
            <em className="font-brand-serif italic font-normal text-[color:var(--hb-mag-t)]">
              Planu Porodu (PDF)
            </em>
          </h1>

          <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] leading-relaxed max-w-2xl mx-auto">
            Zgodnie ze Standardem Organizacyjnym Opieki Okołoporodowej Ministra Zdrowia (Dz.U. 2025 poz. 1525) masz ustawowe prawo przedstawić w szpitalu swoje świadome preferencje. Pobierz wzór PDF i przygotuj dokument we dwoje.
          </p>
        </div>

        {/* Faza 1: Sterylny Formularz Zapisu (Zero pytań o dane medyczne / termin porodu wg Art. 9 RODO) */}
        {!unlocked ? (
          <div className="max-w-xl mx-auto bg-[color:var(--hb-karta)] rounded-3xl p-6 sm:p-10 border border-[color:var(--hb-linia)] shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[color:var(--hb-linia)] pb-5">
              <h2 className="font-brand-display font-bold text-xl text-[color:var(--hb-ink)]">
                Odbierz bezpłatny dostęp do kreatora i wzoru PDF
              </h2>
              <p className="text-xs text-[color:var(--hb-ink3)]">
                Wpisz imię oraz adres e-mail, aby natychmiast otworzyć szablon Planu Porodu A4 do druku oraz otrzymać kopię wskazówek położnej na swoją skrzynkę.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[color:var(--hb-ink)] block">
                  Twoje Imię
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Anna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] focus:outline-none focus:ring-2 focus:ring-[#DA0271] text-base sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[color:var(--hb-ink)] block">
                  Adres e-mail (do wysyłki gotowego PDF)
                </label>
                <input
                  type="email"
                  required
                  placeholder="twoj.mail@domena.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] focus:outline-none focus:ring-2 focus:ring-[#DA0271] text-base sm:text-sm"
                />
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="rodo"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[color:var(--hb-mag-t)] focus:ring-[#DA0271]"
                />
                <label htmlFor="rodo" className="text-[11px] text-[color:var(--hb-ink2)] leading-tight">
                  Zgadzam się na przetwarzanie mojego imienia i adresu e-mail przez KLARSOLUTIONS Sp. z o.o. w celu wygenerowania Planu Porodu PDF oraz otrzymania bezpłatnych materiałów edukacyjnych HappyBirth zgodnie z <Link href="/polityka-prywatnosci" className="underline hover:text-[#DA0271]">Polityką Prywatności</Link>.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white font-semibold text-sm transition-all shadow-lg shadow-[#DA0271]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Odblokowywanie szablonu...</span>
                    </>
                  ) : (
                    <>
                      <span>Otwórz bezpłatny Wzór Planu Porodu PDF</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[color:var(--hb-ink3)]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Bezpłatnie</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ochrona prywatności RODO</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Faza 2: Sterylny Szablon A4 do druku + przejście do pełnego kreatora w Strefie Kursantki */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <strong>Szablon Planu Porodu dla {name || 'Ciebie'} jest gotowy!</strong> Zaznacz wybrane preferencje i kliknij <strong>Drukuj / Zapisz jako PDF</strong>.
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] text-white text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Drukuj / Zapisz jako PDF (A4)</span>
              </button>
            </div>

            <div className="bg-[color:var(--hb-karta)] rounded-3xl p-6 sm:p-10 border border-[color:var(--hb-linia)] shadow-sm space-y-6">
              <div className="border-b border-[color:var(--hb-linia)] pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-mag-t)]">
                    Dokument do Katalogu Dokumentacji Szpitalnej
                  </span>
                  <h2 className="font-brand-display font-bold text-2xl text-[color:var(--hb-ink)]">
                    Plan Porodu — {name || 'Przyszła Mama'}
                  </h2>
                </div>
                <span className="text-xs text-[color:var(--hb-ink3)]">
                  Zgodny z Rozporządzeniem Ministra Zdrowia (Dz.U. 2025 poz. 1525)
                </span>
              </div>

              <div className="space-y-6">
                {STERILE_BIRTH_PLAN_SECTIONS.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <h3 className="font-bold text-base text-[color:var(--hb-ink)]">
                      {sec.category}
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {sec.items.map((item) => {
                        const checked = checkedItems.includes(item);
                        return (
                          <label
                            key={item}
                            className="flex items-start gap-3 p-3.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] cursor-pointer text-xs sm:text-sm text-[color:var(--hb-ink)]"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleItem(item)}
                              className="mt-0.5 w-4 h-4 rounded text-[color:var(--hb-mag-t)]"
                            />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasek Zachęty do Pełnego Kursu VOD */}
            <div className="rounded-3xl bg-gradient-to-r from-[#3F3054] via-[#55406E] to-[#3F3054] p-8 sm:p-10 text-white border border-[#6E5C7D] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12 print:hidden">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF9CC6]">
                  Kompleksowe Przygotowanie i Rozszerzony Kreator w Strefie Kursantki
                </span>
                <h3 className="font-brand-display font-bold text-2xl sm:text-3xl text-white">
                  Chcecie rodzić w pełnym spokoju?
                </h3>
                <p className="text-xs sm:text-sm text-[#E8DEF0]/80 max-w-xl">
                  W zamkniętej Strefie Kursantki czekają na Was 52 filmowe lekcje 4K (w tym Lekcja 26 w całości poświęcona Planowi Porodu), rozszerzony 6-języczny generator szpitalny oraz 18 miesięcy dostępu.
                </p>
              </div>

              <BuyCourseButton className="px-8 py-4 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white font-semibold text-sm transition-all shadow-xl shadow-[#DA0271]/30 hover:scale-105 shrink-0 cursor-pointer">
                <span>Dołącz do kursu · 489 zł</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </BuyCourseButton>
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}
