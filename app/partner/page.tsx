'use client';

import React from 'react';
import { PartnerGuide } from '@/components/partner-guide';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
          <HeartHandshake className="w-3.5 h-3.5" /> Dostęp dla dwojga
        </span>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512]">
          Strefa Partnera
        </h1>
        <p className="text-base text-[#544A44] leading-relaxed">
          Praktyczne instruktaże, techniki masażu krzyżowego, zasady postępowania na izbie przyjęć i rola taty w pierwszych dobach życia noworodka.
        </p>
      </div>

      <PartnerGuide />
    </div>
  );
}
