'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Download, Sparkles, Heart, Users } from 'lucide-react';

/**
 * [C4] Wbudowany Boks Poleceń w Panelu Kursantki — Model „Prezent za Polecenie” (Przepisy na Obiad PDF)
 * - 0% tarcia podatkowego (prezent cyfrowy zamiast prowizji pieniężnej)
 * - Koleżanka otrzymuje 10% zniżki (440,10 zł zamiast 489,00 zł)
 * - Natychmiastowe (0 dni czekania) odblokowanie e-booka PDF po opłaceniu kursu przez koleżankę
 * - Przycisk kopiujący wiadomość zawiera wbudowane oznaczenie #współpraca zgodne z UOKiK ([E4])
 */
export function StudentReferralBox() {
  const [referralCode, setReferralCode] = useState('MAMA-2026');
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

  const shareText = `Z moim kodem ${referralCode} masz 10% zniżki (440,10 zł zamiast 489,00 zł) na szkołę rodzenia online HappyBirth.pl, a ja otrzymam w prezencie e-booka z przepisami na szybkie obiady #współpraca https://happybirth.pl/?promo=${referralCode}`;

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
      className="rounded-3xl border border-[#EAE3DB] dark:border-[#3D0E39] bg-gradient-to-br from-[#FFFDFA] via-[#FDF6F9] to-[#FAF3EB] dark:from-[#1E081C] dark:via-[#250A24] dark:to-[#180517] p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE3DB] dark:border-[#3D0E39] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] dark:text-[#FF4BA8] text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>Program dla Kursantek · Prezent za Polecenie (0 dni czekania)</span>
          </div>
          <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
            Podaruj koleżance z grupy ciążowej -10% zniżki i odbierz e-book z przepisami PDF
          </h3>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] max-w-3xl leading-relaxed">
            Twoja koleżanka kupuje pełny kurs <strong>440,10 zł zamiast 489,00 zł (-10%)</strong>, a w tej samej sekundzie, w której opłaci zamówienie, w Twoim panelu automatycznie odblokowuje się ekskluzywny e-book kulinarny PDF.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#461643] text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#A2958C]">
              Twój kod dla koleżanki
            </div>
            <div className="font-mono font-bold text-lg text-[#DA0271] tracking-wider">
              {referralCode}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Lewa kolumna: Kopiowanie wiadomości zgodnej z UOKiK (#współpraca) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#1A0619] border border-[#EAE3DB] dark:border-[#3D0E39] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1A1512] dark:text-[#FBF8F4] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#DA0271]" />
                <span>Gotowa wiadomość do wysłania na WhatsApp / Messenger:</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Zgodne z wytycznymi UOKiK (#współpraca)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#461643] text-xs text-[#544A44] dark:text-[#D7CCC3] italic leading-relaxed select-all">
              „{shareText}”
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Skopiowano wiadomość z kodem {referralCode}!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopiuj mój kod dla koleżanki (-10%)</span>
                </>
              )}
            </button>

            <span className="text-xs text-[#867A72] dark:text-[#A2958C]">
              Polecone koleżanki: <strong>{referralsCount}</strong>
            </span>
          </div>
        </div>

        {/* Prawa kolumna: Sekcja „Twój Prezent Bonusowy” */}
        <div className="lg:col-span-5 rounded-2xl bg-[#250A24] text-white border border-[#461643] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FCD705]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Twój Prezent Bonusowy PDF</span>
            </div>
            <h4 className="font-brand-display text-base sm:text-lg font-bold text-white leading-snug">
              E-book PDF: „Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji”
            </h4>
            <p className="text-xs text-[#EAD5E5]/85 leading-relaxed">
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
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FCD705] hover:bg-[#ffe338] text-[#1A1512] font-bold text-xs sm:text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz / Otwórz E-book z Przepisami PDF</span>
              </a>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-[#EAD5E5]">
                🔒 Odblokowuje się <strong>natychmiast (w 1 sekundę)</strong>, gdy pierwsza koleżanka opłaci kurs z Twoim kodem <strong>{referralCode}</strong>.
              </div>
              <a
                href="/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FCD705] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Zobacz podgląd e-booka z przepisami i listą zakupów →</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
