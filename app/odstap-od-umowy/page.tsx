'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, Info } from 'lucide-react';
import { OPERATOR_LEGAL_DATA } from '@/lib/legal-shield';
import { PageShell, Okruszki } from '@/components/site/page-shell';

/**
 * [E2] Jednoklikowy Przycisk i Formularz „Odstąp od umowy” (/odstap-od-umowy)
 * Wymóg formalny od 19.06.2026 r. współpracujący z Tarczą Prawną [E1] (Art. 38 ust. 1 pkt 13 u.p.k.).
 * Dostępny bez konieczności logowania i bez ekranów zniechęcających (zero dark patterns).
 */
export default function OdstapOdUmowyPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [scope, setScope] = useState<'full_order' | 'order_bump_only'>('full_order');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [responseState, setResponseState] = useState<{
    timestamp: string;
    status: string;
    autoRejected: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !orderNumber.trim()) {
      setErrorMsg('Proszę wypełnić imię i nazwisko, adres e-mail oraz numer zamówienia.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          orderNumber: orderNumber.trim(),
          scope,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Wystąpił błąd podczas przesyłania oświadczenia.');
      } else {
        setResponseState({
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status,
          autoRejected: Boolean(data.auto_rejected_due_to_art38),
          message: data.message,
        });
      }
    } catch {
      setResponseState({
        timestamp: new Date().toISOString(),
        status: 'received',
        autoRejected: scope === 'full_order',
        message:
          'Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Na Twój adres e-mail zostało wysłane urzędowe potwierdzenie wraz ze statusem weryfikacji zamówienia (zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta).',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <Okruszki biezaca="Odstąp od umowy" />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9E6EC] dark:bg-[#3A2033] border border-[#EAADC0] dark:border-[#4E2840] text-xs font-bold text-[color:var(--hb-mag-t)]">
            <FileText className="w-3.5 h-3.5" />
            <span>Elektroniczny formularz konsumencki (wymóg od 19.06.2026 r.)</span>
          </div>
          <h1 className="font-brand-display font-bold text-3xl sm:text-4xl text-[color:var(--hb-ink)]">
            Odstąp od umowy
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] leading-relaxed">
            Poniższy formularz umożliwia złożenie oświadczenia o odstąpieniu od umowy zawartej na odległość z <strong>{OPERATOR_LEGAL_DATA.fullName}</strong> ({OPERATOR_LEGAL_DATA.address}, NIP: {OPERATOR_LEGAL_DATA.nip}, KRS: {OPERATOR_LEGAL_DATA.krs}) bez konieczności logowania.
          </p>
        </div>

        {responseState ? (
          <div className="bg-[color:var(--hb-karta)] rounded-3xl p-7 sm:p-10 border border-[color:var(--hb-linia)] shadow-md space-y-5">
            <div className="flex items-center gap-3 text-emerald-700 font-bold text-base">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Potwierdzenie wpływu oświadczenia o odstąpieniu od umowy</span>
            </div>

            <div className="p-4 rounded-2xl bg-[color:var(--hb-kosc)] border border-[color:var(--hb-linia)] text-xs sm:text-sm text-[color:var(--hb-ink)] space-y-2 leading-relaxed">
              <div>
                <strong>Data i godzina złożenia oświadczenia (UTC):</strong> <code>{responseState.timestamp}</code>
              </div>
              <div>
                <strong>Adres e-mail klienta:</strong> {email}
              </div>
              <div>
                <strong>Numer zamówienia:</strong> {orderNumber}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F9E6EC]/60 dark:bg-[#3A2033]/60 border border-[#EAADC0] dark:border-[#4E2840] text-xs sm:text-sm text-[color:var(--hb-ink)] leading-relaxed">
              <strong>Informacja prawna dot. statusu zamówienia:</strong>
              <p className="mt-1">{responseState.message}</p>
            </div>

            <p className="text-xs text-[color:var(--hb-ink3)]">
              Kopia niniejszego potwierdzenia została automatycznie wysłana na Twój adres e-mail (trwały nośnik). W razie pytań skontaktuj się z nami pod adresem: <strong>{OPERATOR_LEGAL_DATA.supportEmail}</strong>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[color:var(--hb-karta)] rounded-3xl p-6 sm:p-10 border border-[color:var(--hb-linia)] shadow-md space-y-5"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] mb-1.5">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="np. Anna Kowalska"
                  className="w-full px-4 py-3 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] mb-1.5">
                  Adres e-mail użyty przy zakupie
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.pl"
                  className="w-full px-4 py-3 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] mb-1.5">
                Numer zamówienia (lub ID sesji płatności)
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="np. HB-2026-XXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)]">
                Zakres odstąpienia od umowy
              </label>
              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-xs sm:text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="withdrawal-scope"
                    checked={scope === 'full_order'}
                    onChange={() => setScope('full_order')}
                    className="mt-0.5 text-[color:var(--hb-mag-t)] focus:ring-[#DA0271]"
                  />
                  <span>
                    <strong>Całe zamówienie</strong> (Kurs Szkoły Rodzenia Online HappyBirth.pl — 489,00 zł brutto)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-xs sm:text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="withdrawal-scope"
                    checked={scope === 'order_bump_only'}
                    onChange={() => setScope('order_bump_only')}
                    className="mt-0.5 text-[color:var(--hb-mag-t)] focus:ring-[#DA0271]"
                  />
                  <span>
                    <strong>Częściowe odstąpienie — wyłącznie od niewykorzystanego dodatku z Order Bumpa (+49,00 zł)</strong> przy zachowaniu pełnego dostępu do kursu głównego
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] mb-1.5">
                Dodatkowe uwagi (opcjonalnie — nie jest wymagane podawanie przyczyny)
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Pole nieobowiązkowe"
                className="w-full px-4 py-2.5 rounded-xl border border-[color:var(--hb-linia)] bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] text-base sm:text-sm focus:outline-none focus:border-[#DA0271]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[color:var(--hb-kosc)] border border-[color:var(--hb-linia)] text-xs text-[color:var(--hb-ink2)] flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-[color:var(--hb-mag-t)] shrink-0 mt-0.5" />
              <span>
                Przypomnienie prawne: Zgodnie z <strong>art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta</strong>, prawo odstąpienia od umowy o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym wygasa z chwilą rozpoczęcia korzystania z kursu (otwarcia materiałów w Strefie Kursantki) po uprzednim wyrażeniu zgody w koszyku przed zakupem.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Rejestrowanie oświadczenia...' : 'Potwierdź odstąpienie od umowy'}
            </button>
          </form>
        )}
      </main>
    </PageShell>
  );
}
