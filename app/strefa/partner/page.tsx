'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PartnerGuide } from '@/components/partner-guide';
import { HeartHandshake, ArrowLeft, Sparkles } from 'lucide-react';
import { getSavedPregnancyProfile, PregnancyProfile } from '@/lib/pregnancy';

export default function StrefaPartnerPage() {
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);

  useEffect(() => {
    setProfile(getSavedPregnancyProfile());
  }, []);

  const partnerName = profile?.partnerName;
  const babyLabel = profile?.babyName || 'Waszego maleństwa';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
        <Link href="/strefa" className="hover:text-[color:var(--hb-ink)] dark:hover:text-[color:var(--hb-ink)] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do kokpitu</span>
        </Link>
      </div>

      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[color:color-mix(in_srgb,var(--hb-p4)_10%,transparent)] text-[color:var(--hb-p4g)] border border-[color:color-mix(in_srgb,var(--hb-p4)_30%,transparent)]">
          <HeartHandshake className="w-3.5 h-3.5" /> Dostęp dla dwojga w cenie
        </span>
        
        {partnerName ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[color:var(--hb-p4g)] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedykowana ściąga dla Ciebie</span>
            </div>
            <h1 className="font-brand-display font-semibold text-3xl sm:text-5xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
              Cześć {partnerName}! Twoja rola przy narodzinach {babyLabel}
            </h1>
          </div>
        ) : (
          <h1 className="font-brand-display font-semibold text-3xl sm:text-5xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
            Strefa dla Taty i Partnera przy Porodzie
          </h1>
        )}

        <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] leading-relaxed">
          Praktyczne instruktaże dla przyszłego taty i osoby towarzyszącej: techniki masażu krzyżowego, zasady postępowania na izbie przyjęć, prawa pacjentki i konkretne zadania na sali porodowej oraz w pierwszych dobach życia noworodka.
        </p>
      </div>

      <PartnerGuide />
    </div>
  );
}
