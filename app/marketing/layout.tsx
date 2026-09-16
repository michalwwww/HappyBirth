import React from 'react';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';


export default function MarketingLayout({
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
