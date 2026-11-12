import React from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulamin Platformy · HappyBirth',
  description: 'Regulamin świadczenia usług drogą elektroniczną oraz sprzedaży dostępu do internetowej szkoły rodzenia HappyBirth (KLARSolutions sp. z o.o.).',
};

export default function RegulaminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF6] dark:bg-[#1B1424] text-[#4A3A5E] dark:text-[#F4EEF7]">
      <div className="hb-site"><SiteHeader /></div>
      <main className="flex-1" id="tresc" style={{ letterSpacing: 'var(--hb-trak)' }}>{children}</main>
      <div className="hb-site"><SiteFooter /></div>
    </div>
  );
}
