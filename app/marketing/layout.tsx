import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'HAPPYBIRTH · Szkoła Rodzenia Online — od Szkoły Rodzenia Mama Gaja',
  description:
    'Poród nie jest niespodzianką. Prowadzimy Cię przez niego etap po etapie. Od dwóch kresek do pierwszych urodzin. Dostęp 12 miesięcy dla Ciebie i partnera w cenie 349 zł.',
  openGraph: {
    title: 'HAPPYBIRTH · Szkoła Rodzenia Online',
    description: 'Poród nie jest niespodzianką. Jest procesem, który da się poznać zawczasu.',
    url: 'https://happybirth.pl',
    siteName: 'HappyBirth',
    locale: 'pl_PL',
    type: 'website',
  },
};

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
