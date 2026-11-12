'use client';

import React from 'react';
import Link from 'next/link';
import { SosContractionCounter } from '@/components/sos-contraction-counter';
import { ArrowLeft, ArrowRight, Clock, FileText } from 'lucide-react';

export default function StrefaLicznikPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] pb-6">
        <div className="space-y-2">
          <Link
            href="/strefa"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--hb-ink3)] hover:text-[color:var(--hb-ink)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wróć do kokpitu</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] text-[color:var(--hb-mag-t)]">
            <Clock className="w-3.5 h-3.5" /> Cyfrowy notatnik czasu · Reguła edukacyjna 5-1-1
          </div>
          <h1 className="font-brand-display font-semibold text-3xl sm:text-4xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
            Licznik Skurczów Porodowych
          </h1>
          <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] max-w-xl leading-relaxed">
            Zapisuj czas trwania skurczów oraz odstępy między kolejnymi pomiarami w spokojnym, przejrzystym stoperze edukacyjnym pomocnym podczas rozmowy telefonicznej z położną lub wybranym szpitalem.
          </p>
        </div>

        <Link
          href="/strefa/plan-porodu"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] hover:border-[color:var(--hb-mag)] text-xs font-semibold text-[color:var(--hb-ink)] shrink-0 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)]" />
          <span>Otwórz Kreator Planu Porodu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <SosContractionCounter />
    </div>
  );
}
