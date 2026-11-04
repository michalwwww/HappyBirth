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
  title: 'HAPPYBIRTH · Edukacyjny Kurs Szkoły Rodzenia Online — 52 Lekcje VOD',
  description:
    'Kompleksowy kurs edukacyjny online dla przyszłych mam i ojców. 52 filmowe lekcje e-learning VOD, sprawdzone patenty i edukacja rodzicielska dla dwojga.',
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
    title: 'HAPPYBIRTH · Edukacyjny Kurs Szkoły Rodzenia Online — 52 Lekcje VOD',
    description: 'Kompleksowy program edukacyjny dla mam i ojców. 52 filmowe lekcje e-learning VOD dla dwojga.',
    url: 'https://happybirth.pl',
    siteName: 'HappyBirth Edukacja',
    locale: 'pl_PL',
    type: 'website',
  },
  other: {
    classification: 'Education, Parenting Training, E-learning (PKD 85.59.B)',
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
      name: 'KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      alternateName: ['HappyBirth Edukacja Online', 'Szkoła Rodzenia Mama Gaja (od 2012 r.)'],
      url: 'https://happybirth.pl',
      email: 'kontakt@happybirth.pl',
      taxID: '7812118273',
      vatID: 'PL7812118273',
      foundingDate: '2012',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Śląska 14',
        postalCode: '60-614',
        addressLocality: 'Poznań',
        addressCountry: 'PL',
      },
      description:
        'Ogólnopolska platforma edukacyjna e-learning (PKD 85.59.B) oferująca kursy wideo VOD i materiały szkoleniowe przygotowujące do świadomego rodzicielstwa na bazie 14 lat doświadczenia szkoły rodzenia Mama Gaja w Poznaniu.',
      sameAs: ['https://instagram.com/happybirth.pl'],
    },
    {
      '@type': 'Course',
      '@id': 'https://happybirth.pl/#course',
      name: 'Edukacyjny Kurs Przygotowania do Porodu i Rodzicielstwa Online dla Dwojga',
      description:
        'Kompleksowy program edukacyjny online w formule e-learning VOD dla mam i ojców. 52 lekcje wideo w 8 modułach tematycznych (4 h 48 min / 288 min) z 18-miesięcznym dostępem od dnia zakupu.',
      provider: {
        '@id': 'https://happybirth.pl/#organization',
      },
      educationalCredentialAwarded: 'Certyfikat ukończenia programu edukacyjnego HappyBirth',
      occupationalCategory: 'Edukacja Rodzicielska / Parenting Education (PKD 85.59.B)',
      inLanguage: 'pl-PL',
      timeRequired: 'PT4H48M',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'PT4H48M',
      },
      offers: {
        '@type': 'Offer',
        price: '489.00',
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
        category: 'Education / E-learning Course',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://happybirth.pl/#pytania',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Czy kurs online zastępuje stacjonarną szkołę rodzenia na sali?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kurs obejmuje kompletny program edukacyjny przygotowujący do porodu i pierwszego roku z dzieckiem w formie 52 lekcji wideo (4 h 48 min) nagranych z dyplomowanymi ekspertkami ze szkoły rodzenia Mama Gaja (działającej od 2012 r.). Nie zastępuje spotkań na żywo ani wizyt kontrolnych, ale możecie łączyć go z zajęciami stacjonarnymi i wracać do nagrań dowolnie wiele razy przez 18 miesięcy.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kiedy najlepiej rozpocząć naukę w kursie według standardu od 7 maja 2026 roku?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Naukę możecie rozpocząć w dowolnym tygodniu ciąży — już od pierwszego trymestru. Zgodnie ze znowelizowanym Standardem Organizacyjnym Opieki Okołoporodowej obowiązującym od 7 maja 2026 r. (Dz.U. 2025 poz. 1525), edukacja przedporodowa przysługuje już od pierwszej wizyty potwierdzającej ciążę (do 10. tygodnia). Wszystkie 52 lekcje są otwarte od pierwszego dnia na 18 miesięcy.',
          },
        },
        {
          '@type': 'Question',
          name: 'Czy osoba towarzysząca (ojciec dziecka, partner, bliska osoba) ma dostęp w cenie?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tak. Dostęp dla dwojga jest wliczony w jedną cenę 489,00 zł brutto bez żadnych dopłat. Od 7 maja 2026 r. przepisy (Dz.U. 2025 poz. 1525) wprost obejmują edukacją przedporodową także ojca dziecka. W kursie druga osoba otrzymuje praktyczne instrukcje wsparcia, masażu, pakowania torby w 3 strefach oraz opieki nad noworodkiem.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kto przygotował lekcje i jakie doświadczenie stoi za programem HappyBirth?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wszystkie 52 lekcje wideo nagraliśmy z zespołem dyplomowanych ekspertek edukacji okołoporodowej, specjalistek laktacji i fizjoterapii z poznańskiej szkoły rodzenia Mama Gaja, która działa nieprzerwanie od 2012 roku (14 lat praktyki i ponad 18 000 przygotowanych rodzin). Program uwzględnia wytyczne polskiego Standardu Organizacyjnego Opieki Okołoporodowej.',
          },
        },
        {
          '@type': 'Question',
          name: 'Ile trwa cały kurs wideo i jak długo działa dostęp do platformy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kurs składa się z 52 lekcji w 8 modułach, co daje łącznie prawie 5 godzin (dokładnie 4 godziny i 48 minut) esencjonalnego materiału wideo. Pojedynczy odcinek trwa średnio 5 do 7 minut. Dostęp do całej platformy trwa 18 miesięcy (548 dni) od momentu zakupu, co obejmuje całą ciążę, poród i pierwszy rok z dzieckiem.',
          },
        },
        {
          '@type': 'Question',
          name: 'Na jakich urządzeniach możemy oglądać lekcje i jak szybko otwiera się dostęp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Lekcje oglądacie bezpośrednio w przeglądarce na telefonie, tablecie, laptopie lub telewizorze Smart TV — bez instalowania dodatkowych aplikacji. Dostęp do Strefy Kursantki otwiera się automatycznie natychmiast po zaksięgowaniu płatności BLIK, kartą płatniczą, Apple Pay lub Google Pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'Jakie bezpłatne narzędzia PDF i materiały są dostępne w ramach kursu i przed zakupem?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Już przed zakupem możecie bezpłatnie obejrzeć Lekcję 1 (5 min 33 s) bez zakładania konta, skorzystać z interaktywnego Kreatora Planu Porodu PDF, Kalkulatora Torby i Wyprawki PDF oraz Bazy Wiedzy i Praw Rodziców 2026 (21 haseł z Dziennika Ustaw). W Strefie Kursantki otrzymujecie dodatkowo karty pracy PDF i cyfrowy notatnik.',
          },
        },
        {
          '@type': 'Question',
          name: 'Czy musimy oglądać lekcje po kolei według sztywnego grafiku?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nie. To nie jest sztywny grafik zajęć grupowych. Wszystkie 52 lekcje w 8 modułach są odblokowane od pierwszego dnia. Interaktywny suwak na stronie podpowiada, które moduły pasują do Waszego obecnego tygodnia ciąży lub miesiąca z dzieckiem, ale oglądacie je w dowolnej kolejności i we własnym tempie.',
          },
        },
        {
          '@type': 'Question',
          name: 'Ile kosztuje kurs i czy jest to abonament odnawialny?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kurs kosztuje 489,00 zł brutto (w tym 23% VAT). Jest to płatność jednorazowa za pełne 18 miesięcy (548 dni) dostępu dla dwojga — bez abonamentu, bez subskrypcji i bez automatycznego odnawiania. Stosujemy stałą, uczciwą cenę zgodnie z dyrektywą Omnibus, bez sztucznych przekreśleń.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kto jest sprzedawcą kursu i czy otrzymamy fakturę VAT?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Operatorem prawnym i sprzedawcą jest polska spółka KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Poznaniu (ul. Śląska 14, 60-614 Poznań, KRS: 0001268396, NIP: 7812118273, REGON: 545782779, kapitał zakładowy 5 000,00 PLN). Po każdym zakupie automatycznie wystawiamy i przesyłamy na e-mail dokument sprzedaży (w tym fakturę VAT 23%).',
          },
        },
        {
          '@type': 'Question',
          name: 'Jak działa prawo odstąpienia od umowy przez 14 dni oraz zgoda na natychmiastowy start?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zgodnie z ustawą o prawach konsumenta konsumentowi przysługuje 14 dni na odstąpienie od umowy zawartej na odległość. Ponieważ kurs jest treścią cyfrową dostarczaną natychmiast, przed płatnością możecie wyrazić dobrowolną zgodę na udostępnienie lekcji od razu przed upływem 14 dni (zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta), co wiąże się z wygaśnięciem prawa odstąpienia z chwilą rozpoczęcia świadczenia.',
          },
        },
        {
          '@type': 'Question',
          name: 'Czy kurs zastępuje konsultację z lekarzem lub wykwalifikowaną specjalistką?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nie. Materiały HappyBirth stanowią pozaszkolną formę edukacji dorosłych (PKD 85.59.B). Mają wyłącznie charakter edukacyjny i organizacyjny — nie są świadczeniem zdrowotnym, nie zawierają diagnozy ani porady medycznej i nie zastępują opieki lekarza ani innej osoby wykonującej zawód medyczny prowadzącej ciążę. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer alarmowy 112.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      data-fonty="a"
      className={`scroll-smooth ${bricolage.variable} ${instrumentSerif.variable} ${inter.variable}`}
    >
      <head>
        <link rel="stylesheet" href="/assets/hb.e90a1fdd5e.css" />
        <link as="font" crossOrigin="" href="/f/hanken-lat.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/instrument-sans-rg-lat.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/instrument-serif-rg-lat.woff2" rel="preload" type="font/woff2" />
        <link as="font" crossOrigin="" href="/f/instrument-serif-it-lat.woff2" rel="preload" type="font/woff2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('hb_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                var l = localStorage.getItem('hb_lang');
                if (l && (l === 'pl' || l === 'en' || l === 'ru')) {
                  document.documentElement.lang = l;
                }
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF8F4] dark:bg-[#140513] text-[#1A1512] dark:text-[#FBF8F4] antialiased selection:bg-[#EC008C]/20 transition-colors duration-200">
        <I18nProvider>
          {children}
          <CookieBanner />
          <AccessibilityToolbar />
        </I18nProvider>
      </body>
    </html>
  );
}
