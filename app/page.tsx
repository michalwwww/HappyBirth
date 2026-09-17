import React from 'react';
import MarketingPage from './marketing/page';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';

export default function RootPage() {
  return (
    <div className="marketing-root min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1">
        <MarketingPage />
      </main>
      <Footer />
    </div>
  );
}
