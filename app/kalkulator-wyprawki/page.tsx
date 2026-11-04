'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Printer,
  ArrowLeft,
  Loader2,
  Building2,
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

/**
 * [F3] Drugie Interaktywne Mikro-Narzędzie Webowe (Lead Magnet Engine):
 * Interaktywny Kalkulator Wyprawki i Torby do Szpitala PDF („Co kupić na start, a z czym poczekać” na bazie Modułu 4)
 */
export default function KalkulatorWyprawkiPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
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
          dueDate,
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
    <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512] flex flex-col">
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo className="h-9 w-auto object-contain" />
            <div className="border-l border-[#EAE3DB] pl-2.5">
              <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                Kalkulator Wyprawki i Torby PDF
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#DA0271] font-bold">
                Moduł 4 · Szkoła Rodzenia Mama Gaja
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#544A44] hover:text-[#DA0271] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do HappyBirth.pl</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-bold text-[#DA0271]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bezpłatne Narzędzie z Modułu 4: Projekt „Gniazdo”</span>
          </div>

          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight leading-tight">
            Interaktywny Kalkulator Wyprawki i Torby do Szpitala PDF:{' '}
            <span className="text-[#DA0271]">Co kupić na start, a z czym poczekać</span>
          </h1>

          <p className="text-sm sm:text-base text-[#544A44] leading-relaxed max-w-2xl mx-auto">
            Lista zweryfikowana przez położne i fizjoterapeutki ze szkoły rodzenia <strong>Mama Gaja</strong>. Oszczędź średnio 1 200–1 800 zł na zbędnych gadżetach i spakuj torbę do szpitala bez stresu.
          </p>
        </div>

        {!unlocked ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3DB] shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[#EAE3DB] pb-5">
              <h2 className="font-brand-display font-bold text-xl text-[#250A24]">
                Odblokuj spersonalizowany Kalkulator Wyprawki i Torby PDF
              </h2>
              <p className="text-xs text-[#867A72]">
                Podaj adres e-mail oraz przewidywany termin porodu (lub porę roku), aby dopasować listę ubranek i otrzymać mikro-poradnik położnej dla Twojego tygodnia ciąży.
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] block mb-1.5">
                    Twoje Imię
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Kasia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] block mb-1.5">
                    Adres e-mail (do wysyłki PDF)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:border-[#DA0271]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] block mb-1.5">
                    Przewidywany termin porodu
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm text-[#544A44] focus:outline-none focus:border-[#DA0271]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] block mb-1.5">
                    Pora roku narodzin
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm bg-white focus:outline-none focus:border-[#DA0271]"
                  >
                    <option value="jesien_zima">Jesień / Zima (ciepły śpiworek do fotelika)</option>
                    <option value="wiosna_lato">Wiosna / Lato (lekki muślin i bambus)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="wyprawka-rodo"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[#DA0271] focus:ring-[#DA0271]"
                />
                <label htmlFor="wyprawka-rodo" className="text-[11px] text-[#544A44] leading-relaxed">
                  Wyrażam wyraźną zgodę na przetwarzanie mojego adresu e-mail oraz podanego terminu porodu przez KLARSOLUTIONS Sp. z o.o. w celu wygenerowania spersonalizowanego Kalkulatora Wyprawki PDF oraz przesyłania dopasowanych do tygodnia ciąży wskazówek edukacyjno-handlowych zgodnie z <Link href="/polityka-prywatnosci" className="underline">Polityką Prywatności</Link>.
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
                    <span>Generowanie spersonalizowanej listy...</span>
                  </>
                ) : (
                  <>
                    <span>Otwórz Kalkulator Wyprawki i Torby PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#867A72]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Bezpłatnie
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Chronione RODO (zero pikseli)
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-emerald-950">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <strong>Lista wyprawkowa dla {name || 'Ciebie'} została wygenerowana!</strong> Zaznacz skompletowane pozycje i zapisz listę jako PDF.
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
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-white border-[#EAE3DB]'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-[#DA0271]"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              item.essentialOnStart
                                ? 'bg-[#FAE3EB] text-[#DA0271]'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {item.essentialOnStart ? 'Kup na start' : 'Z tym poczekaj (Oszczędność)'}
                          </span>
                          <h3 className="font-bold text-sm text-[#1A1512]">{item.name}</h3>
                        </div>
                        <p className="text-xs text-[#544A44]">{item.midwifeNote}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#867A72] shrink-0">{item.qty}</span>
                  </div>
                );
              })}
            </div>

            {/* Powierzchnia dla partnerów strategicznych z /partnerzy */}
            <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271]">
                  <Building2 className="w-4 h-4" />
                  <span>Strefa Partnerów Strategicznych HappyBirth.pl</span>
                </div>
                <p className="text-xs text-[#544A44]">
                  Jesteś producentem bezpiecznych artykułów dziecięcych lub wyprawkowych? Poznaj możliwości ekspozycji w Module 4 i materiałach PDF.
                </p>
              </div>
              <Link
                href="/partnerzy"
                className="px-5 py-2.5 rounded-full border border-[#EAE3DB] hover:border-[#DA0271] text-xs font-bold text-[#1A1512] shrink-0"
              >
                Współpraca dla Marek (/partnerzy) →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
