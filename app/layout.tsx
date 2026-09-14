import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/cookie-banner';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HAPPYBIRTH · Szkoła Rodzenia Online — 52 Lekcje VOD',
  description:
    'Nowoczesna szkoła rodzenia online dla przyszłych mam i partnerów. 9 etapów, 52 lekcje wideo Cloudflare Stream, cyfrowa apteczka porodowa i licznik skurczów 5-1-1.',
  metadataBase: new URL('https://happybirth.pl'),
  openGraph: {
    title: 'HAPPYBIRTH · Szkoła Rodzenia Online — 52 Lekcje VOD',
    description: 'Nowoczesna szkoła rodzenia online dla przyszłych mam i partnerów. 52 filmowe lekcje Cloudflare Stream dla dwojga.',
    url: 'https://happybirth.pl',
    siteName: 'HappyBirth',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      className={`scroll-smooth ${bricolage.variable} ${instrumentSerif.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FBF8F4] text-[#1A1512] antialiased selection:bg-[#EC008C]/20">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

