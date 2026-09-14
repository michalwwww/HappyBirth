import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, Mail } from 'lucide-react';

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#867A72] hover:text-[#EC008C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wróć do strony głównej</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-[#EAE3DB] pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFEED4] border border-[#C5E1B3] text-xs font-semibold text-[#347A22]">
          <Lock className="w-3.5 h-3.5" />
          <span>Ochrona danych osobowych (RODO)</span>
        </div>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
          Polityka Prywatności i Plików Cookies
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Szanujemy Twoją prywatność. Poniższy dokument wyjaśnia w przejrzysty sposób, jakie dane zbieramy, w jakim celu je przetwarzamy oraz jak dbamy o ich bezpieczeństwo zgodnie z Rozporządzeniem RODO.
        </p>
      </div>

      {/* Treść */}
      <div className="space-y-8 text-sm sm:text-base text-[#342D28] leading-relaxed font-sans">
        {/* 1. Administrator */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            1. Administrator Danych Osobowych
          </h2>
          <p>
            Administratorem Twoich danych osobowych w rozumieniu art. 4 pkt 7 RODO jest:
          </p>
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1 text-sm">
            <p><strong>KLARSolutions sp. z o.o. (w organizacji)</strong></p>
            <p>Adres siedziby: ul. Śląska 14, 60-614 Poznań</p>
            <p>E-mail kontaktowy: <strong>kontakt@happybirth.pl</strong></p>
            <p>E-mail Inspektora / ds. prywatności: <strong>pomoc@happybirth.pl</strong></p>
          </div>
        </section>

        {/* 2. Cele i podstawy prawne przetwarzania */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            2. Cele, Zakres i Podstawy Prawne Przetwarzania
          </h2>
          <p>Przetwarzamy Twoje dane w następujących celach:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Realizacja zamówienia i dostęp do Strefy Kursantki</strong> (art. 6 ust. 1 lit. b RODO – niezbędność do wykonania umowy): przetwarzamy Twój adres e-mail, imię, dane transakcji oraz opcjonalnie przewidywaną datę porodu w celu naliczenia 12-miesięcznego okresu dostępu.
            </li>
            <li>
              <strong>Wypełnienie obowiązków prawno-podatkowych</strong> (art. 6 ust. 1 lit. c RODO): wystawianie faktur, prowadzenie księgowości i archiwizacja dokumentów rozliczeniowych.
            </li>
            <li>
              <strong>Obsługa zapytań i wsparcie techniczne</strong> (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes Administratora): kontakt w sprawach związanych z obsługą konta lub zgłoszeniami reklamacyjnymi.
            </li>
            <li>
              <strong>Program Partnerski B2B</strong> (art. 6 ust. 1 lit. b i f RODO): przetwarzanie danych położnych i gabinetów w celu nawiązania współpracy i wysyłki materiałów promocyjnych.
            </li>
          </ul>
        </section>

        {/* 3. Prywatność medyczna */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            3. Ochrona Prywatności Medycznej (Brak Pikseli w Strefie Kursantki)
          </h2>
          <div className="p-5 rounded-2xl bg-[#FAE3EB] border border-[#F3CAD9] text-sm text-[#541235] space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#EC008C]" />
              Zasada zerowej inwigilacji wewnątrz kursu:
            </p>
            <p>
              Wiemy, jak intymnym okresem jest ciąża i narodziny dziecka. Dlatego wewnątrz Strefy Kursantki (<strong>strefa.happybirth.pl</strong>) obowiązuje całkowity zakaz stosowania pikseli śledzących podmiotów trzecich (takich jak Meta Pixel czy Google Ads Remarketing).
            </p>
            <p>
              Twoje postępy w oglądaniu lekcji, korzystanie z licznika skurczów 5-1-1 czy przeglądanie apteczki nie są przekazywane żadnym sieciom reklamowym ani profilowane komercyjnie.
            </p>
          </div>
        </section>

        {/* 4. Odbiorcy danych */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            4. Odbiorcy Danych (Podmioty Przetwarzające)
          </h2>
          <p>Twoje dane mogą być powierzane zaufanym podmiotom technicznym:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Cloudflare Inc.</strong> (USA / UE) – bezpieczny hosting na serwerach Cloudflare Pages oraz streaming wideo Cloudflare Stream (z zachowaniem Standardowych Klauzul Umownych SCC);</li>
            <li><strong>Operatorzy płatności elektronicznych</strong> (np. Stripe Payments Europe Ltd.) – w celu bezpiecznego procesowania transakcji BLIK i kart;</li>
            <li><strong>Biuro rachunkowo-księgowe</strong> – w celu obsługi faktur i rozliczeń podatkowych.</li>
          </ul>
        </section>

        {/* 5. Pliki Cookies i LocalStorage */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            5. Pliki Cookies i Pamięć Lokalna (LocalStorage)
          </h2>
          <p>
            1. Serwis wykorzystuje pamięć lokalną przeglądarki (<strong>localStorage</strong>) wyłącznie do celów funkcjonalnych:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Zapamiętywanie oznaczonych jako ukończone lekcji;</li>
            <li>Zapamiętanie wybranego trybu widoku (Kursantka / Partner);</li>
            <li>Zapisanie statusu zgody na baner cookies.</li>
          </ul>
          <p>
            2. Niezbędne pliki techniczne nie wymagają uprzedniej zgody. Użytkownik w każdej chwili może wyczyścić pliki cookies i pamięć podręczną w ustawieniach swojej przeglądarki.
          </p>
        </section>

        {/* 6. Prawa Użytkownika */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            6. Twoje Prawa Zgodnie z RODO
          </h2>
          <p>Przysługuje Ci prawo do:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dostępu do swoich danych oraz otrzymania ich kopii (art. 15 RODO);</li>
            <li>Sprostowania (poprawienia) swoich danych (art. 16 RODO);</li>
            <li>Usunięcia danych („prawo do bycia zapomnianym”, art. 17 RODO);</li>
            <li>Ograniczenia przetwarzania danych (art. 18 RODO);</li>
            <li>Przenoszenia danych (art. 20 RODO);</li>
            <li>Wniesienia sprzeciwu wobec przetwarzania danych (art. 21 RODO);</li>
            <li>Wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (PUODO, ul. Stawki 2, 00-193 Warszawa).</li>
          </ul>
          <p>
            W celu realizacji powyższych praw wystarczy wysłać wiadomość e-mail na adres: <strong>pomoc@happybirth.pl</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
