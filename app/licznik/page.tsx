'use client';

import React from 'react';
import { SosContractionCounter } from '@/components/sos-contraction-counter';
import { AlertCircle, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function LicznikPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Narzędzie Porodowe SOS
        </span>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512]">
          Licznik Skurczów 5-1-1
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Rejestruj czas trwania każdego skurczu oraz odstęp pomiędzy nimi. Aplikacja automatycznie wykryje moment, w którym należy udać się do szpitala.
        </p>
      </div>

      <SosContractionCounter />
    </div>
  );
}
