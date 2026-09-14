import React from 'react';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka Prywatności i Plików Cookies · HappyBirth',
  description: 'Zasady przetwarzania danych osobowych (RODO) oraz polityka plików cookies w serwisie HappyBirth (KLARSolutions sp. z o.o.).',
};

export default function PolitykaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4] text-[#1A1512]">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
