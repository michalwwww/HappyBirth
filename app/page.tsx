import type { Metadata } from 'next';
import { HomePage } from '@/components/site/home-page';

export const metadata: Metadata = {
  title: 'Szkoła rodzenia online w Twoim domu · HappyBirth',
  description:
    'Od 2012 roku edukujemy i wspieramy przyszłych rodziców. 52 lekcje wideo dla dwojga, od pierwszych dni ciąży do pierwszych urodzin dziecka. 489 zł, bez abonamentu.',
  alternates: { canonical: 'https://happybirth.pl/' },
  openGraph: {
    title: 'HappyBirth. Szkoła rodzenia w Twoim domu',
    description: 'Doświadczenie mamy. 52 lekcje wideo dla dwojga, od pierwszych tygodni ciąży do pierwszych urodzin dziecka.',
    url: 'https://happybirth.pl/',
    siteName: 'HappyBirth',
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'HappyBirth. Szkoła rodzenia online dla dwojga. Doświadczenie mamy.' }],
  },
};

export default function Page() {
  return <HomePage />;
}
