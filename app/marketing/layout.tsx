import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'HAPPYBIRTH · Szkoła rodzenia online, od dwóch kresek do pierwszych urodzin',
  description:
    'Poród nie jest niespodzianką. 52 lekcje wideo w dziewięciu etapach, dopasowane do twojego tygodnia ciąży. Dostęp 12 miesięcy od terminu porodu, dla ciebie i partnera, 349 zł.',
  openGraph: {
    title: 'HAPPYBIRTH · Szkoła rodzenia online',
    description: 'Poród nie jest niespodzianką. Dostajesz dokładnie ten etap, w którym jesteś. Od dwóch kresek do pierwszych urodzin.',
    url: 'https://happybirth.pl',
    siteName: 'HAPPYBIRTH',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-root min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
