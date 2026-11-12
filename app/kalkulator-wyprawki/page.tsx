'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageShell, Okruszki } from '@/components/site/page-shell';
import {
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Printer,
  Loader2,
} from 'lucide-react';

interface LayetteItem {
  id: string;
  category: 'torba_mama' | 'torba_maluszek' | 'dom_start' | 'poczekaj';
  name: string;
  qty: string;
  midwifeNote: string;
  essentialOnStart: boolean;
}

const LAYETTE_ITEMS: LayetteItem[] = [
  {
    id: 'dok-1',
    category: 'torba_mama',
    name: 'Teczka z dokumentami (Karta ciąży, grupa krwi z Rh, GBS, ostatnie USG, Plan Porodu)',
    qty: '1 kpl.',
    midwifeNote: 'Położna Mama Gaja: Miej ją zawsze na samej górze torby porodowej.',
    essentialOnStart: true,
  },
  {
    id: 'mama-2',
    category: 'torba_mama',
    name: 'Koszule nocne rozpinane z przodu (do porodu i karmienia) + szlafrok i klapki pod prysznic',
    qty: '3 szt.',
    midwifeNote: 'Wybierz przewiewną 100% bawełnę umożliwiającą natychmiastowy kontakt skóra do skóry.',
    essentialOnStart: true,
  },
  {
    id: 'mama-3',
    category: 'torba_mama',
    name: 'Podkłady poporodowe wielkoformatowe, majtki siateczkowe wielorazowe i wkładki laktacyjne',
    qty: '2 op.',
    midwifeNote: 'Zapewniają swobodny przepływ powietrza i prawidłowe gojenie w połogu.',
    essentialOnStart: true,
  },
  {
    id: 'maluch-1',
    category: 'torba_maluszek',
    name: 'Body kopertowe (rozpinane na całej długości) i pajacyki bawełniane (rozm. 56 i 62)',
    qty: '4–5 kpl.',
    midwifeNote: 'W pierwszych tygodniach body kopertowe ułatwiają ubieranie bez przekładania przez główkę.',
    essentialOnStart: true,
  },
  {
    id: 'maluch-2',
    category: 'torba_maluszek',
    name: 'Pieluszki jednorazowe Newborn (2–5 kg), pieluszki tetrowe/muślinowe i chusteczki wodne (99% wody)',
    qty: '1 op. + 5 szt.',
    midwifeNote: 'Im krótszy skład chusteczek (woda + kropla łagodnego konserwantu), tym bezpieczniejsza bariera skóry.',
    essentialOnStart: true,
  },
  {
    id: 'dom-1',
    category: 'dom_start',
    name: 'Fotelik samochodowy RWF (0–13 kg) z testami ADAC / i-Size dopasowany do kanapy auta',
    qty: '1 szt.',
    midwifeNote: 'Niezbędny już w dniu wypisu ze szpitala. Przymierz przed porodem wraz z partnerem.',
    essentialOnStart: true,
  },
  {
    id: 'dom-2',
    category: 'dom_start',
    name: 'Łóżeczko ze średnio-twardym, płaskim materacem + 2 prześcieradła z gumką (bez poduszek i ochraniaczy)',
    qty: '1 kpl.',
    midwifeNote: 'Zgodnie z wytycznymi bezpiecznego snu niemowląt w łóżeczku nie umieszczamy luźnych poduszek.',
    essentialOnStart: true,
  },
  {
    id: 'dom-3',
    category: 'dom_start',
    name: 'Domowa apteczka noworodka: sól fizjologiczna w ampułkach, jałowe gaziki, termometr bezdotykowy, witamina D3',
    qty: '1 zestaw',
    midwifeNote: 'Kikut pępowinowy pielęgnujemy na sucho — nie kupuj na zapas spirytusu ani fioletu.',
    essentialOnStart: true,
  },
  {
    id: 'wait-1',
    category: 'poczekaj',
    name: 'Laktator elektryczny na dwie piersi, sterylizator parowy i podgrzewacz do butelek',
    qty: 'Kup w razie potrzeby',
    midwifeNote: 'Z czym warto poczekać: W większości szpitali laktator jest dostępny na oddziale. Dobierzesz go po ocenie laktacji z doradczynią.',
    essentialOnStart: false,
  },
  {
    id: 'wait-2',
    category: 'poczekaj',
    name: 'Zapas ubranek w rozmiarze 50, poduszki-kliny, bujaczki elektryczne i chodziki',
    qty: 'Oszczędność ~1 200 zł',
    midwifeNote: 'Z czym warto poczekać: Fizjoterapeutki uroginekologiczne i pediatryczne odradzają bujaczki w pierwszych tygodniach — najlepsza jest płaska mata.',
    essentialOnStart: false,
  },
];

export default function KalkulatorWyprawkiPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [season, setSeason] = useState<'wiosna_lato' | 'jesien_zima'>('jesien_zima');
  const [rodoConsent, setRodoConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Podaj prawidłowy adres e-mail.');
      return;
    }

    if (!rodoConsent) {
      setErrorMsg('Zaznacz zgodę RODO, aby wygenerować spersonalizowaną listę PDF.');
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          season,
          rodoConsent,
          toolSource: 'kalkulator-wyprawki',
        }),
      });
      setUnlocked(true);
    } catch {
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10">
        <div className="print:hidden">
          <Okruszki biezaca="Kalkulator wyprawki PDF" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9E6EC] dark:bg-[#3A2033] border border-[#EAADC0] dark:border-[#4E2840] text-xs font-bold text-[color:var(--hb-mag-t)]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bezpłatne Narzędzie z Modułu 4: Projekt „Gniazdo”</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[color:var(--hb-ink)] tracking-tight leading-tight">
            Interaktywny Kalkulator Wyprawki i Torby do Szpitala PDF:{' '}
            <span className="text-[color:var(--hb-mag-t)]">Co kupić na start, a z czym poczekać</span>
          </h1>

          <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] leading-relaxed max-w-2xl mx-auto">
            Lista zweryfikowana przez położne i fizjoterapeutki ze szkoły rodzenia <strong>Mama Gaja</strong>. Oszczędź średnio 1 200–1 800 zł na zbędnych gadżetach i spakuj torbę do szpitala w 3 przejrzystych strefach.
          </p>
        </div>

        {!unlocked ? (
          <div className="max-w-xl mx-auto bg-[color:var(--hb-karta)] rounded-3xl p-6 sm:p-10 border border-[color:var(--hb-linia)] shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[color:var(--hb-linia)] pb-5">
              <h2 className="font-brand-display font-bold text-xl text-[color:var(--hb-ink)]">
                Odblokuj spersonalizowany Kalkulator Wyprawki i Torby PDF
              </h2>
              <p className="text-xs text-[color:var(--hb-ink3)]">
                Podaj imię, adres e-mail oraz porę roku, aby dopasować listę tekstyliów i otrzymać mikro-poradnik położnej na swoją skrzynkę.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] block mb-1.5">
                    Twoje Imię
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Kasia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] block mb-1.5">
                    Adres e-mail (do wysyłki PDF)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] block mb-1.5">
                  Pora roku (dobór tekstyliów i śpiworka)
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
                >
                  <option value="jesien_zima">Jesień / Zima (ciepły śpiworek do fotelika i wełna merino)</option>
                  <option value="wiosna_lato">Wiosna / Lato (lekki muślin i oddychający bambus)</option>
                </select>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="wyprawka-rodo"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[color:var(--hb-mag-t)] focus:ring-[#DA0271]"
                />
                <label htmlFor="wyprawka-rodo" className="text-[11px] text-[color:var(--hb-ink2)] leading-relaxed">
                  Wyrażam zgodę na przetwarzanie mojego imienia i adresu e-mail przez KLARSOLUTIONS Sp. z o.o. w celu wygenerowania Kalkulatora Wyprawki PDF oraz przesyłania wskazówek edukacyjno-handlowych zgodnie z <Link href="/polityka-prywatnosci" className="underline">Polityką Prywatności</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generowanie listy wyprawkowej...</span>
                  </>
                ) : (
                  <>
                    <span>Otwórz Kalkulator Wyprawki i Torby PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[color:var(--hb-ink3)]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Bezpłatnie
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Chronione RODO
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <strong>Lista wyprawkowa dla {name || 'Ciebie'} ({season === 'jesien_zima' ? 'Jesień / Zima' : 'Wiosna / Lato'}) została wygenerowana!</strong> Zaznacz skompletowane pozycje i zapisz listę jako PDF.
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] text-white text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Drukuj / Zapisz Kalkulator jako PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {LAYETTE_ITEMS.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      item.essentialOnStart
                        ? isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60'
                          : 'bg-[color:var(--hb-karta)] border-[color:var(--hb-linia)]'
                        : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-[color:var(--hb-mag-t)]"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              item.essentialOnStart
                                ? 'bg-[#F9E6EC] dark:bg-[#3A2033] text-[color:var(--hb-mag-t)]'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {item.essentialOnStart ? 'Kup na start' : 'Z tym poczekaj (Oszczędność)'}
                          </span>
                          <h3 className="font-bold text-sm text-[color:var(--hb-ink)]">{item.name}</h3>
                        </div>
                        <p className="text-xs text-[color:var(--hb-ink2)]">{item.midwifeNote}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[color:var(--hb-ink3)] shrink-0">{item.qty}</span>
                  </div>
                );
              })}
            </div>

            {/* Sekcja edukacyjna: Standard Opieki Okołoporodowej 2026 */}
            <div className="p-6 rounded-3xl bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--hb-mag-t)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Twoje prawa na porodówce 2026 (Dz.U. 2025 poz. 1525)</span>
                </div>
                <p className="text-xs text-[color:var(--hb-ink2)]">
                  Sprawdź 21 praw przyszłej mamy i taty obowiązujących od 7 maja 2026 r.: gwarantowane 2 godziny kontaktu „skóra do skóry”, lekki posiłek w porodzie i opieka laktacyjna.
                </p>
              </div>
              <Link
                href="/dla-ciebie"
                className="px-5 py-2.5 rounded-full border border-[color:var(--hb-linia)] hover:border-[#DA0271] text-xs font-bold text-[color:var(--hb-ink)] shrink-0"
              >
                Dla Ciebie · Prawa i Wiedza 2026 →
              </Link>
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}
