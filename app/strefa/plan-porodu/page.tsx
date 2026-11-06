'use client';

import React from 'react';
import Link from 'next/link';
import { BirthPlanGenerator } from '@/components/birth-plan-generator';
import { FileText, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

export default function StrefaPlanPoroduPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[color:var(--hb-ink3)] dark:text-[color:color-mix(in_srgb,var(--hb-ink2)_60%,transparent)] print:hidden">
        <Link href="/strefa" className="hover:text-[color:var(--hb-ink)] dark:hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do kokpitu</span>
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-3 print:hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] text-[color:var(--hb-mag-t)]">
          <FileText className="w-3.5 h-3.5" /> Narzędzie Porodowe HappyBirth
        </span>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
          Kreator Planu Porodu
        </h1>
        <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] dark:text-[color:color-mix(in_srgb,var(--hb-ink2)_80%,transparent)] leading-relaxed">
          Zgodnie ze Standardem Opieki Okołoporodowej w Polsce, masz prawo przedstawić personelowi medycznemu swoje świadome oczekiwania. Wypełnijcie formularz wspólnie, wydrukujcie i weźcie ze sobą do szpitala.
        </p>
      </div>

      <BirthPlanGenerator />
    </div>
  );
}
