'use client';

import React from 'react';
import Link from 'next/link';
import { PartnerGuide } from '@/components/partner-guide';
import { HeartHandshake, ArrowLeft } from 'lucide-react';

export default function StrefaPartnerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#867A72]">
        <Link href="/strefa" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do kokpitu</span>
        </Link>
      </div>

      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
          <HeartHandshake className="w-3.5 h-3.5" /> Dostęp dla dwojga w cenie
        </span>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512]">
          Strefa Partnera
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Praktyczne instruktaże dla przyszłego taty: techniki masażu krzyżowego, zasady postępowania na izbie przyjęć, prawa pacjenta i rola partnera w pierwszych dobach życia noworodka.
        </p>
      </div>

      <PartnerGuide />
    </div>
  );
}
