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
        <div className="flex items-center space-x-2 text-xs text-[#867A72]">
          <Link href="/strefa" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do kokpitu</span>
          </Link>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EC008C]/10 text-[#EC008C]">
          <Sparkles className="w-3.5 h-3.5" /> Szybka pomoc 24/7
        </span>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512]">
          Cyfrowa Apteczka Porodowa
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Gdy pojawia się niepokojący objaw, ból pleców, wątpliwość laktacyjna lub pytanie o pielęgnację noworodka — nie trać czasu na przeszukiwanie forów. Wpisz objaw i przejdź bezpośrednio do instrukcji wideo naszych ekspertek.
        </p>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#EAE3DB] shadow-sm">
        <DigitalMedicineCabinet />
      </div>
    </div>
  );
}
