import type { Metadata } from 'next';
// Fonty hostowane lokalnie (bez zapytań do Google Fonts: RODO, brak zależności sieciowej przy buildzie)
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/instrument-serif/index.css';
import '@fontsource/instrument-serif/400-italic.css';
import './globals.css';
import { CookieBanner } from '@/components/cookie-banner';
import { I18nProvider } from '@/lib/i18n';
import { AccessibilityToolbar } from '@/components/accessibility-toolbar';
import { StageSymbolSprite } from '@/components/stage-icons';

export const metadata: Metadata = {
  title: 'HAPPYBIRTH · Szkoła rodzenia online, 52 lekcje wideo',
  description:
    'Certyfikowany kurs edukacyjny online dla przyszłych mam i ojców. 52 filmowe lekcje e-learning VOD, sprawdzone patenty i edukacja rodzicielska dla dwojga.',
  metadataBase: new URL('https://happybirth.pl'),
  category: 'education',
  keywords: [
    'kurs edukacyjny',
    'szkoła rodzenia online',
    'kurs online dla rodziców',
    'edukacja rodzicielska',
    'e-learning',
    'lekcje vod',
    'przygotowanie do porodu kurs',
  ],
  openGraph: {
    title: 'HAPPYBIRTH · Szkoła rodzenia online, 52 lekcje wideo',
    description: 'Program edukacyjny dla mam i ojców. 52 lekcje wideo w dziewięciu etapach, dostęp 12 miesięcy dla dwojga.',
    url: 'https://happybirth.pl',
    siteName: 'HappyBirth Edukacja',
    locale: 'pl_PL',
    type: 'website',
  },
  other: {
    classification: 'Education, Parenting Training, E-learning',
    'target-audience': 'Parents, Expectant Parents',
    subject: 'Edukacja i kursy online przygotowania do rodzicielstwa',
  },
};

const educationalJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://happybirth.pl/#organization',
      name: 'HappyBirth Edukacja Online',
      url: 'https://happybirth.pl',
      description:
        'Ogólnopolska platforma edukacyjna e-learning oferująca kursy wideo VOD i materiały szkoleniowe przygotowujące do świadomego rodzicielstwa.',
      sameAs: ['https://instagram.com/happybirth.pl'],
    },
    {
      '@type': 'Course',
      '@id': 'https://happybirth.pl/#course',
      name: 'Edukacyjny Kurs Przygotowania do Porodu i Rodzicielstwa Online',
      description:
        'Kompleksowy program edukacyjny online w formule e-learning VOD dla mam i ojców. 52 filmowe lekcje w 9 modułach tematycznych.',
      provider: {
        '@id': 'https://happybirth.pl/#organization',
      },
      educationalCredentialAwarded: 'Certyfikat ukończenia programu edukacyjnego HappyBirth',
      occupationalCategory: 'Edukacja Rodzicielska / Parenting Education',
      inLanguage: 'pl-PL',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'PT15H',
      },
      offers: {
        '@type': 'Offer',
        price: '349',
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
        category: 'Education / E-learning Course',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="scroll-smooth">
      <head>
        {/* Klasa js przed pierwszym malowaniem: bez JS elementy .r pozostają widoczne */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] antialiased">
        <StageSymbolSprite />
        <I18nProvider>
          {children}
          <CookieBanner />
          <AccessibilityToolbar />
        </I18nProvider>
      </body>
    </html>
  );
}

