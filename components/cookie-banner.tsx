'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, Check, X } from 'lucide-react';

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem('hb_cookie_consent');
      if (!consent) {
        setVisible(true);
      }
    } catch {
      // localStorage disabled or error
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    try {
      localStorage.setItem('hb_cookie_consent', JSON.stringify({
        level,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookies"
      className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="max-w-4xl mx-auto bg-[#250A24] text-[#EAD5E5] border border-[#461643] rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-lg pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-2xl bg-[#EC008C]/20 text-[#EC008C] flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Szanujemy Twoją prywatność</span>
              <span className="text-[10px] bg-[#381035] text-[#EAD5E5] px-2 py-0.5 rounded-full font-normal border border-[#581855]">
                RODO & ePrivacy
              </span>
            </div>
            <p className="text-[#D8C7D5]/90 text-xs leading-relaxed">
              Używamy pamięci podręcznej oraz niezbędnych plików cookies, aby zapamiętać Twoje postępy w oglądaniu 52 lekcji i zapewnić poprawne działanie platformy. W Strefie Rodziców{' '}
              <strong>nie stosujemy żadnych pikseli marketingowych Meta ani Google</strong>.{' '}
              <Link
                href="/polityka-prywatnosci"
                className="underline hover:text-white transition-colors"
              >
                Dowiedz się więcej w Polityce Prywatności
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={() => handleConsent('essential')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-[#461643] bg-[#320D30] hover:bg-[#431240] text-xs font-semibold text-[#EAD5E5] hover:text-white transition-colors text-center"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={() => handleConsent('all')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#EC008C] hover:bg-[#c80077] text-xs font-semibold text-white transition-all shadow-md hover:scale-[1.02] text-center"
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}
