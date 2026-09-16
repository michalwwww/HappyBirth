import React from 'react';
import MarketingPage from './marketing/page';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] transition-colors duration-200">
      <MarketingNavbar />
      <main className="flex-1">
        <MarketingPage />
      </main>
      <Footer />
    </div>
  );
}
