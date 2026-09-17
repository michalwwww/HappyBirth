'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Zgoda na cookies. Rejestr PRACA: papier, atrament, dwa przyciski, krótki tekst.
 * Wybór trzymamy w localStorage (hb_cookie_consent).
 */
export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem('hb_cookie_consent');
      if (!consent) setVisible(true);
    } catch {
      // localStorage niedostępny
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    try {
      localStorage.setItem(
        'hb_cookie_consent',
        JSON.stringify({ level, timestamp: new Date().toISOString() })
      );
    } catch {
      // ignorujemy
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookies"
      className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none fade-up"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto bg-paper text-ink border border-line rounded-hb-lg shadow-[0_24px_48px_-24px_rgba(26,21,18,0.45)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <p className="text-[15px] leading-relaxed text-ink-2 max-w-[60ch]">
          <strong className="text-ink font-semibold">Cookies.</strong> Używamy niezbędnych plików cookies, żeby strona działała i pamiętała twoje postępy w lekcjach. Bez pikseli reklamowych w Strefie.{' '}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-4 hover:text-ink">
            Polityka prywatności
          </Link>
          .
        </p>
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button type="button" onClick={() => handleConsent('essential')} className="btn btn-ghost btn-sm flex-1 sm:flex-initial">
            Tylko niezbędne
          </button>
          <button type="button" onClick={() => handleConsent('all')} className="btn btn-ink btn-sm flex-1 sm:flex-initial">
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
