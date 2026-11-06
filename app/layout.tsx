import type { Metadata } from 'next';
import './globals.css';
import './site.css';
import './palety.css';
import { CookieBanner } from '@/components/cookie-banner';
import { I18nProvider } from '@/lib/i18n';
import { AccessibilityToolbar } from '@/components/accessibility-toolbar';
import { LogoSprite } from '@/components/site/logo';
import { StraznikWygladu } from '@/components/site/straznik-wygladu';
import { SKRYPT_WYGLADU } from '@/lib/wyglad-skrypt';

// Kroje strony v3 (SOFT & COSY): Besley i Nunito, pliki lokalne w /public/f, bez Google Fonts.
// Dawny arkusz /assets/hb.e90a1fdd5e.css nie jest już wpinany globalnie: strona główna i podstrony
// mają własny system w app/site.css, strefa korzysta z Tailwind.

export const metadata: Metadata = {
  title: 'Szkoła rodzenia online dla dwojga · HappyBirth',
  description:
    '52 lekcje wideo z dyplomowanymi ekspertkami, prawie 5 godzin nagrań. Od pierwszych tygodni ciąży do pierwszego roku z dzieckiem. Dostęp dla dwojga, 489 zł.',
  metadataBase: new URL('https://happybirth.pl'),
  category: 'education',
  keywords: [
    'szkoła rodzenia online',
    'kurs online dla przyszłych rodziców',
    'szkoła rodzenia dla dwojga',
    'przygotowanie do porodu',
    'lekcje wideo',
    'edukacja przedporodowa',
  ],
  openGraph: {
    title: 'HappyBirth. Szkoła rodzenia online dla dwojga',
    description: 'Doświadczenie mamy. 52 lekcje wideo dla dwojga, od pierwszych tygodni ciąży do pierwszych urodzin dziecka.',
    url: 'https://happybirth.pl',
    siteName: 'HappyBirth',
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'HappyBirth. Szkoła rodzenia online dla dwojga. Doświadczenie mamy.' }],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/icon-192.png',
  },
  manifest: '/site.webmanifest',
  other: {
    classification: 'Education, Parenting Training, E-learning',
  },
};

// Dane strukturalne: liczby kanoniczne (8 modułów, 52 lekcje, 4 h 48 min, 489 zł).
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://happybirth.pl/#organization',
      name: 'HappyBirth',
      url: 'https://happybirth.pl',
      logo: 'https://happybirth.pl/logo.png',
      slogan: 'Doświadczenie mamy.',
      description: 'Szkoła rodzenia online dla dwojga. Kurs wideo dla przyszłych rodziców, oparty na doświadczeniu stacjonarnej szkoły rodzenia założonej w 2012 roku.',
      sameAs: ['https://www.instagram.com/happybirth.pl/', 'https://www.tiktok.com/@happybirth_pl'],
      email: 'kontakt@happybirth.pl',
      taxID: '7812118273',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Śląska 14',
        postalCode: '60-614',
        addressLocality: 'Poznań',
        addressCountry: 'PL',
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://happybirth.pl/#course',
      name: 'HappyBirth. Szkoła rodzenia online dla dwojga',
      description:
        'Kurs wideo dla przyszłych rodziców: 52 lekcje w 8 modułach, od pierwszych tygodni ciąży, przez poród, do pierwszych urodzin dziecka. Dostęp dla dwojga przez 18 miesięcy od zakupu.',
      provider: { '@id': 'https://happybirth.pl/#organization' },
      educationalCredentialAwarded: 'Certyfikat ukończenia kursu HappyBirth',
      timeRequired: 'PT4H48M',
      inLanguage: 'pl-PL',
      numberOfLessons: 52,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'PT4H48M',
      },
      offers: {
        '@type': 'Offer',
        price: '489',
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
        url: 'https://happybirth.pl/#kup',
        category: 'Paid',
        description: 'Płatność jednorazowa, bez abonamentu. Dostęp dla dwojga przez 18 miesięcy (548 dni) od zakupu.',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link as="font" crossOrigin="" href="/f/besley-latin-wght-normal.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/besley-latin-ext-wght-normal.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/nunito-latin-wght-normal.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/nunito-latin-ext-wght-normal.woff2" rel="preload" type="font/woff2" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* paleta i tryb nocny przed pierwszym malowaniem (lib/wyglad-skrypt.ts) */}
        <script dangerouslySetInnerHTML={{ __html: SKRYPT_WYGLADU }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink)] antialiased transition-colors duration-200">
        <LogoSprite />
        {/* przywraca paletę i tryb, gdyby React po błędzie hydracji wyczyścił atrybuty <html> */}
        <StraznikWygladu />
        <I18nProvider>
          {children}
          <CookieBanner />
          <AccessibilityToolbar />
        </I18nProvider>
      </body>
    </html>
  );
}
