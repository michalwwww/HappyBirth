'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Download, Sparkles, Heart, Users } from 'lucide-react';

/**
 * [C4] Wbudowany Boks Poleceń Koleżance w Panelu Mamy (Kursantki)
 * - Mamy są wyłączone z programu afiliacyjnego (afiliacja.happybirth.pl)
 * - Program dla Mam opiera się na polecaniu kursu koleżankom wraz ze zniżką (-10%) oraz prezentem (E-book PDF)
 * - Koleżanka otrzymuje 10% zniżki (440,10 zł zamiast 489,00 zł)
 * - Mama polecająca otrzymuje natychmiastowe (0 dni czekania) odblokowanie prezentu (E-booka PDF) po opłaceniu kursu przez koleżankę
 */
export function StudentReferralBox() {
  const [referralCode, setReferralCode] = useState('MAMA-KASIA');
  const [referralsCount, setReferralsCount] = useState(0);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((data) => {
        if (data.referralCode) setReferralCode(data.referralCode);
        if (typeof data.referralsCount === 'number') setReferralsCount(data.referralsCount);
        if (typeof data.rewardUnlocked === 'boolean') setRewardUnlocked(data.rewardUnlocked);
      })
      .catch(() => {});

    // Sprawdź lokalne odblokowanie prezentu w przeglądarce
    if (typeof window !== 'undefined' && localStorage.getItem('hb_referral_reward_unlocked') === 'true') {
      setRewardUnlocked(true);
    }
  }, []);

  const shareText = `Z moim kodem ${referralCode} masz 10% zniżki (440,10 zł zamiast 489,00 zł) na szkołę rodzenia online HappyBirth.pl, a ja otrzymam w prezencie e-booka z przepisami na szybkie obiady #współpraca https://happybirth.pl/?kod=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    }
  };

  return (
    <section
      id="polec-kolezance"
      className="rounded-3xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] bg-gradient-to-br from-[color:var(--hb-karta)] via-[#FBF2F2] to-[color:var(--hb-papier)] dark:from-[color:var(--hb-noc2)] dark:via-[color:var(--hb-papier)] dark:to-[color:var(--hb-papier)] p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)] text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>Poleć Koleżance: Zniżka -10% + Prezent dla Ciebie</span>
          </div>
          <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
            Podaruj koleżance 10% zniżki na kurs i odbierz w prezencie E-book PDF
          </h3>
          <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] max-w-3xl leading-relaxed">
            Z Twoim osobistym kodem koleżanka w ciąży kupuje pełny kurs za <strong>440,10 zł zamiast 489,00 zł (-10% zniżki)</strong>, a Ty w podziękowaniu od razu otrzymujesz w prezencie nasz autorski E-book kulinarny PDF dla przyszłej mamy i na czas laktacji.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[color:var(--hb-kosc)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia2)] text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
              Twój kod rabatowy (-10%)
            </div>
            <div className="font-mono font-bold text-lg text-[color:var(--hb-mag-t)] tracking-wider">
              {referralCode}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Lewa kolumna: Kopiowanie wiadomości zgodnej z UOKiK (#współpraca) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[color:var(--hb-mag-t)]" />
                <span>Gotowa wiadomość ze zniżką -10% na WhatsApp / Messenger:</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Zgodne z wytycznymi UOKiK (#współpraca)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia2)] text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] italic leading-relaxed select-all">
              „{shareText}”
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Skopiowano wiadomość ze zniżką {referralCode}!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopiuj kod ze zniżką -10% dla koleżanki</span>
                </>
              )}
            </button>

            <span className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
              Polecone koleżanki: <strong>{referralsCount}</strong>
            </span>
          </div>
        </div>

        {/* Prawa kolumna: Sekcja „Twój Prezent Bonusowy” */}
        <div className="lg:col-span-5 rounded-2xl bg-[color:var(--hb-noc2)] text-white border border-[color:var(--hb-ink2)] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--hb-zol)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Twój Prezent za Polecenie</span>
            </div>
            <h4 className="font-brand-display text-base sm:text-lg font-bold text-white leading-snug">
              E-book PDF: „Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji”
            </h4>
            <p className="text-xs text-[#E8DEF0]/85 leading-relaxed">
              Przepisy bogate w żelazo, DHA i kwas foliowy + gotowe listy zakupów na cały tydzień.
            </p>
          </div>

          {rewardUnlocked ? (
            <div className="pt-2 space-y-2">
              <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Prezent odblokowany! Możesz pobrać swój e-book:</span>
              </div>
              <a
                href="/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[color:var(--hb-zol)] hover:bg-[color:var(--hb-zol)] text-[color:var(--hb-pil-ink)] dark:text-[color:var(--hb-ink)] font-bold text-xs sm:text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz swój Prezent (E-book PDF)</span>
              </a>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-[#E8DEF0]">
                🎁 Twój prezent odblokowuje się <strong>automatycznie</strong>, gdy pierwsza koleżanka skorzysta ze zniżki -10% z Twoim kodem <strong>{referralCode}</strong>.
              </div>
              <a
                href="/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[color:var(--hb-zol)] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Zobacz podgląd prezentu (e-booka z przepisami) →</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
