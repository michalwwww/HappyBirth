import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Afiliacyjny dla Położnych, Fizjoterapeutek i Twórców · HappyBirth.pl',
  description:
    'Dołącz do programu afiliacyjnego HappyBirth.pl: daj swoim odbiorczyniom 10% rabatu (440,10 zł zamiast 489,00 zł), a sama odbierz 20%–30% prowizji (+5% Broker Tier 2).',
};

export default function AfiliacjaLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512]">{children}</div>;
}
