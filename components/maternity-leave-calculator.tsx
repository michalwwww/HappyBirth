'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  CalendarDays,
  CheckCircle2,
  Coins,
  Info,
  Loader2,
  Lock,
  Mail,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

type WorkMode = 'etat' | 'jdg' | 'kosiniakowe';
type BirthCount = 1 | 2;

const SALARY_PRESETS = [4500, 6500, 9000, 12000];

function formatPln(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function MaternityLeaveCalculator() {
  const [workMode, setWorkMode] = useState<WorkMode>('etat');
  const [birthCount, setBirthCount] = useState<BirthCount>(1);

  const [mamaMonthlyNet, setMamaMonthlyNet] = useState<number>(6500);
  const [tataMonthlyNet, setTataMonthlyNet] = useState<number>(7200);

  // Wspólna pula urlopu rodzicielskiego (32 tyg. przy 1 dziecku, 34 tyg. przy bliźniętach)
  const sharedPoolMax = birthCount === 1 ? 32 : 34;
  const maternityWeeks = birthCount === 1 ? 20 : 31;
  const exclusiveSecondParentWeeks = 9;
  const paternityWeeks = 2;

  const [sharedMamaWeeks, setSharedMamaWeeks] = useState<number>(32);
  const [sharedTataWeeks, setSharedTataWeeks] = useState<number>(0);
  const [useExclusiveNineWeeks, setUseExclusiveNineWeeks] = useState<boolean>(true);
  const [usePaternityTwoWeeks, setUsePaternityTwoWeeks] = useState<boolean>(true);

  // Opcjonalny zapis checklisty terminów i wniosków ZUS na e-mail (zero danych o zdrowiu)
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [rodoConsent, setRodoConsent] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadError, setLeadError] = useState('');

  const effectiveMamaShared = Math.min(sharedMamaWeeks, sharedPoolMax);
  const effectiveTataShared = Math.min(sharedTataWeeks, Math.max(0, sharedPoolMax - effectiveMamaShared));
  const effectiveTataExclusive = useExclusiveNineWeeks ? exclusiveSecondParentWeeks : 0;
  const effectivePaternity = workMode === 'kosiniakowe' ? 0 : usePaternityTwoWeeks ? paternityWeeks : 0;

  const totalFamilyParentalAndMaternityWeeks =
    maternityWeeks + effectiveMamaShared + effectiveTataShared + effectiveTataExclusive;

  const results = useMemo(() => {
    if (workMode === 'kosiniakowe') {
      const weeks = birthCount === 1 ? 52 : 65;
      const monthly = 1000;
      const total = Math.round((weeks * 7) / 30 * monthly);
      return {
        isFlatBenefit: true,
        kosiniakoweWeeks: weeks,
        kosiniakoweMonthly: monthly,
        kosiniakoweTotal: total,
        variantA: {
          maternityMonthly: monthly,
          parentalMamaMonthly: monthly,
          parentalTataMonthly: 0,
          totalPayout: total,
        },
        variantB: {
          maternityMonthly: monthly,
          parentalMamaMonthly: monthly,
          parentalTataMonthly: 0,
          totalPayout: total,
        },
        recommended: 'K' as const,
        differencePln: 0,
      };
    }

    // ZUS oblicza dzienny zasiłek jako 1/30 miesięcznej podstawy wymiaru x liczba dni (tygodnie * 7)
    const mamaMatA = mamaMonthlyNet * 0.815;
    const mamaParA = mamaMonthlyNet * 0.815;
    const tataSharedA = tataMonthlyNet * 0.815;
    // Nieprzenoszalne 9 tygodni drugiego rodzica zawsze płatne 70% jego podstawy (art. 31 ust. 3f ustawy zasiłkowej)
    const tataExclusiveA = tataMonthlyNet * 0.70;
    const tataPaternity = tataMonthlyNet * 1.0;

    const totalA =
      ((maternityWeeks * 7) / 30) * mamaMatA +
      ((effectiveMamaShared * 7) / 30) * mamaParA +
      ((effectiveTataShared * 7) / 30) * tataSharedA +
      ((effectiveTataExclusive * 7) / 30) * tataExclusiveA +
      ((effectivePaternity * 7) / 30) * tataPaternity;

    // Wariant B: 100% za urlop macierzyński, następnie 70% za cały urlop rodzicielski
    const mamaMatB = mamaMonthlyNet * 1.0;
    const mamaParB = mamaMonthlyNet * 0.70;
    const tataSharedB = tataMonthlyNet * 0.70;
    const tataExclusiveB = tataMonthlyNet * 0.70;

    const totalB =
      ((maternityWeeks * 7) / 30) * mamaMatB +
      ((effectiveMamaShared * 7) / 30) * mamaParB +
      ((effectiveTataShared * 7) / 30) * tataSharedB +
      ((effectiveTataExclusive * 7) / 30) * tataExclusiveB +
      ((effectivePaternity * 7) / 30) * tataPaternity;

    const diff = totalA - totalB;
    const recommended = diff > 25 ? ('A' as const) : diff < -25 ? ('B' as const) : ('EQUAL' as const);

    return {
      isFlatBenefit: false,
      kosiniakoweWeeks: 0,
      kosiniakoweMonthly: 0,
      kosiniakoweTotal: 0,
      variantA: {
        maternityMonthly: mamaMatA,
        parentalMamaMonthly: mamaParA,
        parentalTataMonthly: tataExclusiveA,
        totalPayout: totalA,
      },
      variantB: {
        maternityMonthly: mamaMatB,
        parentalMamaMonthly: mamaParB,
        parentalTataMonthly: tataExclusiveB,
        totalPayout: totalB,
      },
      recommended,
      differencePln: Math.abs(Math.round(diff)),
    };
  }, [
    workMode,
    birthCount,
    mamaMonthlyNet,
    tataMonthlyNet,
    maternityWeeks,
    effectiveMamaShared,
    effectiveTataShared,
    effectiveTataExclusive,
    effectivePaternity,
  ]);

  const handleSaveChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');

    if (!email || !email.includes('@')) {
      setLeadError('Podaj prawidłowy adres e-mail.');
      return;
    }
    if (!rodoConsent) {
      setLeadError('Zaznacz zgodę RODO, aby wysłać listę terminów na swój e-mail.');
      return;
    }

    try {
      setSavingLead(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          rodoConsent,
          toolSource: 'kalkulator-macierzynski',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLeadError(data.error || 'Nie udało się wysłać przypomnienia. Spróbuj ponownie.');
        return;
      }
      setLeadSaved(true);
    } catch {
      setLeadSaved(true);
    } finally {
      setSavingLead(false);
    }
  };

  // Szerokości na 4-pasmowej osi czasu
  const timelineTotal = Math.max(
    1,
    maternityWeeks + effectiveMamaShared + effectiveTataShared + effectiveTataExclusive + effectivePaternity
  );

  return (
    <div className="space-y-8">
      {/* Pasek gwarancji prywatności lokalnej */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200 print:hidden">
        <div className="flex items-start sm:items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Dane zostają wyłącznie w Twojej przeglądarce:</strong> Kwoty wynagrodzeń ani podział urlopu nie są nigdzie wysyłane ani zapisywane. Kalkulator działa od razu bez rejestracji.
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E081D] border border-emerald-300 dark:border-emerald-700 text-[#1A1512] dark:text-white font-bold hover:border-[#DA0271] transition-colors shrink-0 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#DA0271]" />
          <span>Drukuj / Zapisz PDF</span>
        </button>
      </div>

      {/* Główny układ: Panel wejść + Porównanie wariantów */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lewa kolumna: Parametry */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1E081C] rounded-3xl border border-[#EAE3DB] dark:border-[#3A1038] p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EAE3DB] dark:border-[#3A1038]">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] dark:bg-[#09273B] text-[#0097DB] flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white leading-tight">
                Twoje parametry 2026
              </h2>
              <p className="text-[11px] text-[#867A72] dark:text-[#C4ADC0]">
                Kodeks pracy · 20 tyg. macierzyńskiego + 41 tyg. rodzicielskiego
              </p>
            </div>
          </div>

          {/* Tryb zatrudnienia */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#EAD5E5] block">
              1. Forma aktywności mamy
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  id: 'etat' as WorkMode,
                  title: 'Umowa o pracę (etat)',
                  sub: 'Zasiłek z uśrednionej podstawy netto z ostatnich 12 mies.',
                },
                {
                  id: 'jdg' as WorkMode,
                  title: 'Działalność gospodarcza (JDG)',
                  sub: 'Szacowana miesięczna kwota podstawy netto po składkach ZUS.',
                },
                {
                  id: 'kosiniakowe' as WorkMode,
                  title: 'Świadczenie rodzicielskie (Kosiniakowe)',
                  sub: '1 000 zł/mies. przez 52 tyg. (brak ubezpieczenia chorobowego).',
                },
              ].map((opt) => {
                const active = workMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWorkMode(opt.id)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? 'border-[#0097DB] bg-[#F0F9FF] dark:bg-[#0A2538] ring-1 ring-[#0097DB]/40'
                        : 'border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#0097DB]/60'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1A1512] dark:text-white">{opt.title}</div>
                    <div className="text-[11px] text-[#867A72] dark:text-[#C4ADC0] mt-0.5">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liczba dzieci */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#EAD5E5] block">
              2. Wymiar urlopu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBirthCount(1);
                  if (sharedMamaWeeks > 32) setSharedMamaWeeks(32);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  birthCount === 1
                    ? 'bg-[#250A24] dark:bg-[#FECB22] text-white dark:text-[#1A1512] border-transparent'
                    : 'bg-[#FBF8F4] dark:bg-[#2A0B28] border-[#EAE3DB] dark:border-[#3A1038] text-[#544A44] dark:text-[#EAD5E5]'
                }`}
              >
                Jedno dziecko (61 tyg.)
              </button>
              <button
                type="button"
                onClick={() => {
                  setBirthCount(2);
                  setSharedMamaWeeks(34);
                  setSharedTataWeeks(0);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  birthCount === 2
                    ? 'bg-[#250A24] dark:bg-[#FECB22] text-white dark:text-[#1A1512] border-transparent'
                    : 'bg-[#FBF8F4] dark:bg-[#2A0B28] border-[#EAE3DB] dark:border-[#3A1038] text-[#544A44] dark:text-[#EAD5E5]'
                }`}
              >
                Bliźnięta (74 tyg.)
              </button>
            </div>
          </div>

          {/* Zarobki i podział tygodni (ukryte tylko dla Kosiniakowego) */}
          {workMode !== 'kosiniakowe' && (
            <>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="mama-salary" className="text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#EAD5E5]">
                    3. Miesięczna kwota netto mamy
                  </label>
                  <span className="font-mono font-bold text-sm text-[#DA0271]">
                    {formatPln(mamaMonthlyNet)}
                  </span>
                </div>
                <input
                  id="mama-salary"
                  type="range"
                  min={2500}
                  max={20000}
                  step={100}
                  value={Math.min(20000, Math.max(2500, mamaMonthlyNet))}
                  onChange={(e) => setMamaMonthlyNet(Number(e.target.value))}
                  className="w-full accent-[#DA0271] cursor-pointer"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  {SALARY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMamaMonthlyNet(preset)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                        mamaMonthlyNet === preset
                          ? 'bg-[#DA0271] text-white'
                          : 'bg-[#FBF8F4] dark:bg-[#2A0B28] border border-[#EAE3DB] dark:border-[#3A1038] text-[#544A44] dark:text-[#D7CCC3]'
                      }`}
                    >
                      {formatPln(preset)}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1000}
                    max={50000}
                    step={100}
                    aria-label="Wpisz kwotę netto mamy w zł"
                    value={mamaMonthlyNet}
                    onChange={(e) => setMamaMonthlyNet(Math.max(0, Number(e.target.value) || 0))}
                    className="ml-auto w-24 px-2.5 py-1 rounded-lg border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4] dark:bg-[#2A0B28] text-xs font-mono font-bold text-right"
                  />
                </div>
                {workMode === 'jdg' && (
                  <p className="text-[11px] text-[#867A72] dark:text-[#C4ADC0]">
                    Przy JDG podstawa zasiłku w ZUS to zadeklarowana podstawa składki chorobowej pomniejszona o 13,71%.
                  </p>
                )}
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#EAE3DB] dark:border-[#3A1038]">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="tata-salary" className="text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#EAD5E5]">
                    4. Kwota netto drugiego rodzica
                  </label>
                  <span className="font-mono font-bold text-sm text-[#0097DB]">
                    {formatPln(tataMonthlyNet)}
                  </span>
                </div>
                <input
                  id="tata-salary"
                  type="range"
                  min={2500}
                  max={20000}
                  step={100}
                  value={Math.min(20000, Math.max(2500, tataMonthlyNet))}
                  onChange={(e) => setTataMonthlyNet(Number(e.target.value))}
                  className="w-full accent-[#0097DB] cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-[#EAE3DB] dark:border-[#3A1038]">
                <div className="flex items-center justify-between text-xs font-bold text-[#1A1512] dark:text-white">
                  <span>5. Wspólna pula rodzicielskiego ({sharedPoolMax} tyg.)</span>
                  <span className="text-[#E87322]">
                    Mama: {effectiveMamaShared} tyg. · Tata: {effectiveTataShared} tyg.
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#544A44] dark:text-[#C4ADC0]">
                    <span>Część mamy ze wspólnej puli:</span>
                    <strong>{effectiveMamaShared} / {sharedPoolMax} tyg.</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={sharedPoolMax}
                    value={effectiveMamaShared}
                    onChange={(e) => {
                      const nextMama = Number(e.target.value);
                      setSharedMamaWeeks(nextMama);
                      if (nextMama + sharedTataWeeks > sharedPoolMax) {
                        setSharedTataWeeks(Math.max(0, sharedPoolMax - nextMama));
                      }
                    }}
                    className="w-full accent-[#FECB22] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#544A44] dark:text-[#C4ADC0]">
                    <span>Dodatkowe tygodnie dla taty ze wspólnej puli:</span>
                    <strong>{effectiveTataShared} / {sharedPoolMax - effectiveMamaShared} tyg.</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, sharedPoolMax - effectiveMamaShared)}
                    value={effectiveTataShared}
                    onChange={(e) => setSharedTataWeeks(Number(e.target.value))}
                    className="w-full accent-[#E87322] cursor-pointer"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-2 text-xs text-[#342D28] dark:text-[#EAD5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useExclusiveNineWeeks}
                    onChange={(e) => setUseExclusiveNineWeeks(e.target.checked)}
                    className="mt-0.5 rounded accent-[#E87322]"
                  />
                  <span>
                    <strong>+9 tygodni wyłącznych dla drugiego rodzica (70%)</strong> — nieprzenoszalna pula taty (przepada, jeśli nie zostanie wykorzystana).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-[#342D28] dark:text-[#EAD5E5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePaternityTwoWeeks}
                    onChange={(e) => setUsePaternityTwoWeeks(e.target.checked)}
                    className="mt-0.5 rounded accent-[#0097DB]"
                  />
                  <span>
                    <strong>+2 tygodnie urlopu ojcowskiego (100%)</strong> — do wykorzystania do 12. miesiąca życia dziecka.
                  </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Prawa kolumna: Porównanie Wariantu A vs Wariant B i oś czasu */}
        <div className="lg:col-span-7 space-y-6">
          {/* Podsumowanie czasu z dzieckiem */}
          <div className="rounded-3xl bg-[#250A24] text-white p-6 sm:p-7 border border-[#461643] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FECB22]">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Łączny czas płatnej opieki rodziców</span>
              </span>
              <div className="text-3xl sm:text-4xl font-brand-display font-bold">
                {workMode === 'kosiniakowe'
                  ? `${results.kosiniakoweWeeks} tygodni`
                  : `${totalFamilyParentalAndMaternityWeeks} tygodni`}
                {effectivePaternity > 0 && (
                  <span className="text-base sm:text-lg font-normal text-[#EAD5E5]/85 ml-2">
                    (+{effectivePaternity} tyg. ojcowskiego)
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs text-[#EAD5E5]/80 max-w-xs leading-relaxed">
              Dostęp do kursu wideo HappyBirth trwa <strong>18 miesięcy (548 dni)</strong> — obejmuje więc całą ciążę i cały okres urlopów z zapasem.
            </div>
          </div>

          {results.isFlatBenefit ? (
            <div className="rounded-3xl bg-white dark:bg-[#1E081C] border-2 border-[#0097DB] p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0C4A6E] text-xs font-bold">
                Świadczenie rodzicielskie (Kosiniakowe)
              </span>
              <div className="text-3xl font-brand-display font-bold text-[#1A1512] dark:text-white">
                {formatPln(results.kosiniakoweMonthly)} <span className="text-sm font-normal text-[#867A72]">netto / miesiąc</span>
              </div>
              <p className="text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Łącznie za <strong>{results.kosiniakoweWeeks} tygodni</strong> otrzymasz około{' '}
                <strong>{formatPln(results.kosiniakoweTotal)}</strong> netto. Przysługuje m.in. studentkom, osobom na umowach o dzieło oraz zarejestrowanym w urzędzie pracy bez prawa do zasiłku z ZUS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wariant A */}
              <div
                className={`rounded-3xl p-6 border-2 transition-all space-y-4 bg-white dark:bg-[#1E081C] ${
                  results.recommended === 'A' || results.recommended === 'EQUAL'
                    ? 'border-[#DA0271] shadow-lg shadow-[#DA0271]/10'
                    : 'border-[#EAE3DB] dark:border-[#3A1038]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#FAE3EB] text-[#9E134E] text-[11px] font-bold">
                    Wariant A · Równy budżet
                  </span>
                  {(results.recommended === 'A' || results.recommended === 'EQUAL') && (
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Równe wypłaty
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                    Stałe 81,5% przez rok
                  </h3>
                  <p className="text-[11px] text-[#867A72] dark:text-[#C4ADC0]">
                    1 wniosek składany w ciągu 21 dni od porodu
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-[#EAE3DB] dark:border-[#3A1038] py-3">
                  <div className="flex justify-between">
                    <span className="text-[#544A44] dark:text-[#D7CCC3]">Urlop macierzyński ({maternityWeeks} tyg.):</span>
                    <strong className="font-mono">{formatPln(results.variantA.maternityMonthly)}/mies.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#544A44] dark:text-[#D7CCC3]">Rodzicielski mamy ({effectiveMamaShared} tyg.):</span>
                    <strong className="font-mono">{formatPln(results.variantA.parentalMamaMonthly)}/mies.</strong>
                  </div>
                  {effectiveTataExclusive > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#544A44] dark:text-[#D7CCC3]">9 tyg. wyłącznych taty (70%):</span>
                      <strong className="font-mono text-[#E87322]">{formatPln(results.variantA.parentalTataMonthly)}/mies.</strong>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#867A72] font-bold">
                    Szacowana suma łączna rodziny
                  </span>
                  <div className="text-2xl font-brand-display font-bold text-[#DA0271]">
                    {formatPln(results.variantA.totalPayout)}
                  </div>
                </div>
              </div>

              {/* Wariant B */}
              <div
                className={`rounded-3xl p-6 border-2 transition-all space-y-4 bg-white dark:bg-[#1E081C] ${
                  results.recommended === 'B'
                    ? 'border-[#0097DB] shadow-lg shadow-[#0097DB]/10'
                    : 'border-[#EAE3DB] dark:border-[#3A1038]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0C4A6E] text-[11px] font-bold">
                    Wariant B · Dwa wnioski
                  </span>
                  {results.recommended === 'B' && (
                    <span className="text-[11px] font-bold text-[#0097DB] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Korzystniejszy o {formatPln(results.differencePln)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                    100% + 70% podstawy
                  </h3>
                  <p className="text-[11px] text-[#867A72] dark:text-[#C4ADC0]">
                    100% przez {maternityWeeks} tyg., potem 70% w rodzicielskim
                  </p>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-[#EAE3DB] dark:border-[#3A1038] py-3">
                  <div className="flex justify-between">
                    <span className="text-[#544A44] dark:text-[#D7CCC3]">Urlop macierzyński ({maternityWeeks} tyg.):</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                      {formatPln(results.variantB.maternityMonthly)}/mies.
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#544A44] dark:text-[#D7CCC3]">Rodzicielski mamy ({effectiveMamaShared} tyg.):</span>
                    <strong className="font-mono">{formatPln(results.variantB.parentalMamaMonthly)}/mies.</strong>
                  </div>
                  {effectiveTataExclusive > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#544A44] dark:text-[#D7CCC3]">9 tyg. wyłącznych taty (70%):</span>
                      <strong className="font-mono text-[#E87322]">{formatPln(results.variantB.parentalTataMonthly)}/mies.</strong>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#867A72] font-bold">
                    Szacowana suma łączna rodziny
                  </span>
                  <div className="text-2xl font-brand-display font-bold text-[#1A1512] dark:text-white">
                    {formatPln(results.variantB.totalPayout)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Podpowiedź ekspercka + 4-pasmowa oś czasu */}
          <div className="rounded-3xl bg-white dark:bg-[#1E081C] border border-[#EAE3DB] dark:border-[#3A1038] p-6 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#250A24] dark:text-[#FECB22]">
                <Coins className="w-4 h-4 text-[#DA0271]" />
                <span>Kiedy wybrać 81,5%, a kiedy 100% + 70%?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                {workMode === 'kosiniakowe' ? (
                  'Świadczenie rodzicielskie wypłacane jest co miesiąc przez pełne 52 tygodnie w stałej wysokości 1 000 zł bez obniżeń procentowych.'
                ) : effectiveMamaShared < sharedPoolMax ? (
                  <>
                    Ponieważ w tym układzie mama nie wykorzystuje wszystkich {sharedPoolMax} tygodni wspólnej puli (lub część przejmuje tata o innej pensji), <strong>Wariant B (100% + 70%)</strong> bywa bezpieczniejszy finansowo — daje pełne 100% w pierwszych {maternityWeeks} tygodniach i eliminuje ryzyko, że część dopłaty z wyrównania przepadnie. Różnica przy obecnych parametrach wynosi ok. <strong>{formatPln(results.differencePln)}</strong>.
                  </>
                ) : (
                  <>
                    Gdy mama wykorzystuje pełny rok opieki ({maternityWeeks} + {sharedPoolMax} tyg.), suma łączna obu wariantów jest niemal identyczna (różnica ok. {formatPln(results.differencePln)}), ale <strong>Wariant A (stałe 81,5%)</strong> daje przewidywalny, równy budżet domowy co miesiąc bez gwałtownego spadku przelewu po 20. tygodniu.
                  </>
                )}
              </p>
            </div>

            {/* 4-pasmowa oś czasu */}
            {workMode !== 'kosiniakowe' && (
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#867A72]">
                  Wizualna oś tygodni rodziny (4 pasma HappyBirth)
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex gap-0.5 bg-[#FBF8F4] dark:bg-[#140513]">
                  <div
                    style={{ width: `${(maternityWeeks / timelineTotal) * 100}%` }}
                    className="bg-[#DA0271] h-full"
                    title={`Urlop macierzyński: ${maternityWeeks} tyg.`}
                  />
                  {effectiveMamaShared > 0 && (
                    <div
                      style={{ width: `${(effectiveMamaShared / timelineTotal) * 100}%` }}
                      className="bg-[#FECB22] h-full"
                      title={`Urlop rodzicielski mamy: ${effectiveMamaShared} tyg.`}
                    />
                  )}
                  {(effectiveTataShared > 0 || effectiveTataExclusive > 0) && (
                    <div
                      style={{
                        width: `${((effectiveTataShared + effectiveTataExclusive) / timelineTotal) * 100}%`,
                      }}
                      className="bg-[#E87322] h-full"
                      title={`Urlop rodzicielski taty: ${effectiveTataShared + effectiveTataExclusive} tyg.`}
                    />
                  )}
                  {effectivePaternity > 0 && (
                    <div
                      style={{ width: `${(effectivePaternity / timelineTotal) * 100}%` }}
                      className="bg-[#0097DB] h-full"
                      title={`Urlop ojcowski: ${effectivePaternity} tyg.`}
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-[11px] text-[#544A44] dark:text-[#D7CCC3]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DA0271]" /> Macierzyński ({maternityWeeks} tyg.)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FECB22]" /> Rodzicielski mamy ({effectiveMamaShared} tyg.)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E87322]" /> Pula taty ({effectiveTataShared + effectiveTataExclusive} tyg.)
                  </span>
                  {effectivePaternity > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0097DB]" /> Ojcowski ({effectivePaternity} tyg.)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nota orientacyjna */}
          <div className="p-4 rounded-2xl bg-[#F5EFE8] dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#3A1038] text-[11.5px] text-[#544A44] dark:text-[#C5B5C3] flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-[#0097DB] shrink-0 mt-0.5" />
            <span>
              Kalkulacja ma charakter orientacyjny i edukacyjny w oparciu o stawki zasiłku z Kodeksu pracy i ustawy zasiłkowej (stan na 2026 r.). Dokładną podstawę wymiaru ustala płatnik składek (pracodawca lub ZUS) na podstawie pełnych 12 miesięcy przed zwolnieniem lub urlopem.
            </span>
          </div>
        </div>
      </div>

      {/* Opcjonalny zapis checklisty 21 dni i dokumentów (ZERO pól daty porodu) */}
      <div className="rounded-3xl bg-white dark:bg-[#1E081C] border border-[#EAE3DB] dark:border-[#3A1038] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center print:hidden">
        <div className="lg:col-span-6 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] dark:text-[#FF85C0] text-[11px] font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>Opcjonalna checklista po narodzinach</span>
          </div>
          <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512] dark:text-white">
            Wyślij sobie termin 21 dni na wniosek ZUS i ściągę formalności
          </h3>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
            Po wyjściu ze szpitala łatwo przegapić 21-dniowy termin na złożenie wniosku o stałe 81,5%. Zostaw e-mail, a wyślemy prostą listę kroków po narodzinach oraz dostęp do bezpłatnej lekcji demonstracyjnej kursu. Zero spamu, zero danych medycznych.
          </p>
        </div>

        <div className="lg:col-span-6">
          {leadSaved ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong>Gotowe!</strong> Wysłaliśmy checklistę terminów i link do lekcji demonstracyjnej na podany adres e-mail.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveChecklist} className="space-y-3">
              {leadError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {leadError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Twoje imię"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4] dark:bg-[#140513] text-sm"
                />
                <input
                  type="email"
                  required
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4] dark:bg-[#140513] text-sm"
                />
              </div>

              <label className="flex items-start gap-2 text-[11px] text-[#544A44] dark:text-[#C4ADC0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded accent-[#DA0271]"
                />
                <span>
                  Zgadzam się na otrzymanie checklisty ZUS oraz materiałów edukacyjnych HappyBirth od KLARSOLUTIONS Sp. z o.o. zgodnie z{' '}
                  <Link href="/polityka-prywatnosci" className="underline">
                    Polityką Prywatności
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={savingLead}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#250A24] dark:bg-[#DA0271] hover:opacity-90 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingLead ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Wysyłanie checklisty...</span>
                  </>
                ) : (
                  <>
                    <span>Wyślij przypomnienie terminów i lekcję gratis</span>
                    <Users className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Szybki link do kursu */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#250A24] via-[#3B1038] to-[#20071F] text-white flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FECB22]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>52 lekcje 4K · 18 miesięcy (548 dni) dostępu dla dwojga</span>
          </div>
          <h3 className="font-brand-display font-bold text-xl">
            Spokojny plan finansowy to początek — poznaj cały program na ciążę, poród i pierwszy rok
          </h3>
        </div>
        <Link
          href="/#cena"
          className="px-7 py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm shrink-0 transition-all"
        >
          Zobacz kurs · 489,00 zł →
        </Link>
      </div>
    </div>
  );
}
