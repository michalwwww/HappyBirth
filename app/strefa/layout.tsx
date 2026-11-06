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
    <div className="min-h-screen flex flex-col bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] font-sans antialiased selection:bg-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)] selection:text-[color:var(--hb-mag-t)] transition-colors duration-200">
      <StrefaNavbar />
      <main className="flex-1">{children}</main>
      <StrefaFooter />
    </div>
  );
}
