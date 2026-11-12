'use client';

import React from 'react';
import Link from 'next/link';
import { DigitalMedicineCabinet } from '@/components/digital-medicine-cabinet';
import { Sparkles, ShieldAlert, Heart, ArrowLeft } from 'lucide-react';

export default function StrefaApteczkaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center space-x-2 text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
          <Link href="/strefa" className="hover:text-[color:var(--hb-ink)] dark:hover:text-[color:var(--hb-ink)] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do kokpitu</span>
          </Link>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] text-[color:var(--hb-mag-t)]">
          <Sparkles className="w-3.5 h-3.5" /> Szybka pomoc 24/7
        </span>
        <h1 className="font-brand-display font-semibold text-3xl sm:text-5xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
          Cyfrowa Apteczka Porodowa
        </h1>
        <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] leading-relaxed">
          Gdy pojawia się niepokojący objaw, ból pleców, wątpliwość laktacyjna lub pytanie o pielęgnację noworodka — nie trać czasu na przeszukiwanie forów. Wpisz objaw i przejdź bezpośrednio do instrukcji wideo naszych ekspertek.
        </p>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-sm">
        <DigitalMedicineCabinet />
      </div>
    </div>
  );
}
