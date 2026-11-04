import type { Metadata } from 'next';
import { StrefaNavbar } from '@/components/strefa-navbar';
import { StrefaFooter } from '@/components/strefa-footer';

export const metadata: Metadata = {
  title: 'Strefa Rodziców · HappyBirth VOD',
  description: 'Panel edukacyjny i 52 lekcje wideo w jakości HD dla naszych mam i ojców szkoły rodzenia HappyBirth.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function StrefaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4] dark:bg-[#120311] text-[#1A1512] dark:text-[#FBF8F4] font-sans antialiased selection:bg-[#DA0271]/20 selection:text-[#DA0271] transition-colors duration-200">
      <StrefaNavbar />
      <main className="flex-1">{children}</main>
      <StrefaFooter />
    </div>
  );
}
