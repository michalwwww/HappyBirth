import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/cookie-banner';
import { I18nProvider } from '@/lib/i18n';
import { AccessibilityToolbar } from '@/components/accessibility-toolbar';

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
  title: 'HAPPYBIRTH · Szkoła Rodzenia Online dla Dwojga — 52 Lekcje VOD',
  description:
    'Czuła szkoła rodzenia online dla naszych mam i ojców. 52 filmowe lekcje VOD, sprawdzone złote patenty i wsparcie dla dwojga przez cały pierwszy rok życia dziecka.',
  metadataBase: new URL('https://happybirth.pl'),
  openGraph: {
    title: 'HAPPYBIRTH · Szkoła Rodzenia Online dla Dwojga — 52 Lekcje VOD',
    description: 'Czuła szkoła rodzenia online dla naszych mam i ojców. 52 filmowe lekcje VOD, sprawdzone złote patenty i wsparcie dla dwojga.',
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
      <body className="min-h-screen flex flex-col bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] antialiased selection:bg-[#EC008C]/20">
        <I18nProvider>
          {children}
          <CookieBanner />
          <AccessibilityToolbar />
        </I18nProvider>
      </body>
    </html>
  );
}

