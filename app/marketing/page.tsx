import React from 'react';
import { RevealObserver } from '@/components/brand/reveal';
import { Hero } from '@/components/landing/hero';
import { ProofStrip } from '@/components/landing/proof-strip';
import { SectionHeading } from '@/components/landing/section-heading';
import { StagesGrid } from '@/components/landing/stages-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Who } from '@/components/landing/who';
import { Tools } from '@/components/landing/tools';
import { Comparison } from '@/components/landing/comparison';
import { Testimonials } from '@/components/landing/testimonials';
import { Pricing } from '@/components/landing/pricing';
import { Faq } from '@/components/landing/faq';
import { stagesSection } from '@/components/landing/content';

/**
 * Strona główna HAPPYBIRTH.
 *
 * Kolejność sekcji według briefu strony (03-brief-strony.md), z treścią
 * dopasowaną do produktu w repozytorium (kurs VOD, 52 lekcje, 349 zł):
 *  1 nawigacja · 2 hero (radość) · 3 liczby · 4 dziewięć etapów (serce strony)
 *  5 jak to działa · 6 kto za tym stoi · 7 narzędzia · 8 dwa światy
 *  9 opinie · 10 cennik · 11 FAQ · stopka (praca, znak mono, „Dobrze, że jesteś.”)
 */
export default function MarketingPage() {
  return (
    <>
      <RevealObserver />

      <Hero />
      <ProofStrip />

      <section className="wrap py-16 sm:py-20 lg:py-24" id="etapy">
        <SectionHeading
          eyebrow={stagesSection.eyebrow}
          titleStart={stagesSection.titleStart}
          titleAccent={stagesSection.titleAccent}
          lead={stagesSection.lead}
        />
        <div className="mt-10 lg:mt-14">
          <StagesGrid />
        </div>
      </section>

      <HowItWorks />
      <Who />
      <Tools />
      <Comparison />
      <Testimonials />
      <Pricing />
      <Faq />
    </>
  );
}
