import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft, Mail } from 'lucide-react';

export default function RegulaminPage() {
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-semibold text-[#EC008C]">
          <FileText className="w-3.5 h-3.5" />
          <span>Dokument prawny</span>
        </div>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
          Regulamin Świadczenia Usług i Sprzedaży Kursu Online
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Wersja obowiązująca od dnia 14 września 2026 r. Niniejszy regulamin określa zasady korzystania z platformy internetowej HappyBirth oraz warunki zakupu dostępu do materiałów edukacyjnych VOD.
        </p>
      </div>

      {/* Treść Regulaminu */}
      <div className="space-y-8 text-sm sm:text-base text-[#342D28] leading-relaxed font-sans">
        {/* § 1. Postanowienia ogólne i dane Sprzedawcy */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 1. Postanowienia ogólne i dane Usługodawcy
          </h2>
          <p>
            1. Właścicielem i administratorem platformy internetowej dostępnej pod adresem{' '}
            <strong>happybirth.pl</strong> oraz <strong>strefa.happybirth.pl</strong> (zwanej dalej „Platformą” lub „Serwisem”) jest:
          </p>
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1.5 text-sm">
            <p><strong>KLARSolutions sp. z o.o. (w organizacji)</strong></p>
            <p>Adres siedziby: ul. Śląska 14, 60-614 Poznań</p>
            <p>Kraj: Polska</p>
            <p>Adres poczty elektronicznej (e-mail): <strong>kontakt@happybirth.pl</strong></p>
            <p>Adres e-mail ds. reklamacji i obsługi kursantek: <strong>pomoc@happybirth.pl</strong></p>
          </div>
          <p>
            2. Niniejszy Regulamin skierowany jest zarówno do Konsumentów, jak i Przedsiębiorców korzystających z Serwisu i określa zasady korzystania ze sklepu internetowego oraz zasady i tryb zawierania Umów Sprzedaży na odległość.
          </p>
        </section>

        {/* § 2. Definicje */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 2. Definicje
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Usługodawca / Sprzedawca</strong> – KLARSolutions sp. z o.o. w organizacji z siedzibą w Poznaniu.</li>
            <li><strong>Klient / Użytkownik / Kursantka</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która zawiera Umowę ze Sprzedawcą.</li>
            <li><strong>Konsument</strong> – osoba fizyczna zawierająca ze Sprzedawcą umowę niezwiązaną bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
            <li><strong>Kurs / Treść Cyfrowa</strong> – pakiet materiałów edukacyjnych wideo VOD (52 lekcje w technologii Cloudflare Stream), materiałów PDF i narzędzi interaktywnych dostępnych w Strefie Kursantki.</li>
            <li><strong>Strefa Kursantki</strong> – zabezpieczony obszar Platformy dostępny pod adresem strefa.happybirth.pl po opłaceniu zamówienia.</li>
          </ul>
        </section>

        {/* § 3. Przedmiot Usługi i Wymagania Techniczne */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 3. Przedmiot Usługi i Wymagania Techniczne
          </h2>
          <p>
            1. Przedmiotem umowy jest odpłatne udzielenie dostępu do Treści Cyfrowych – kursu szkoły rodzenia online składającego się z 52 lekcji wideo w 9 etapach edukacyjnych.
          </p>
          <p>
            2. Dostęp do Strefy Kursantki udzielany jest na okres <strong>12 miesięcy liczonych od przewidywanego terminu porodu</strong> wskazanego przez Kursantkę (lub od dnia zakupu w przypadku braku wskazania daty).
          </p>
          <p>
            3. Do prawidłowego korzystania z Platformy i odtwarzania materiałów wideo wymagane są:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Urządzenie z dostępem do Internetu (smartfon, tablet, komputer PC/Mac lub Smart TV z przeglądarką);</li>
            <li>Standardowa, zaktualizowana przeglądarka internetowa (Chrome, Safari, Firefox, Edge) z włączoną obsługą JavaScript;</li>
            <li>Aktywny adres poczty elektronicznej (e-mail).</li>
          </ul>
        </section>

        {/* § 4. Charakter edukacyjny – Wyłączenie medyczne */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 4. Charakter Edukacyjny Materiałów (Nota Medyczna)
          </h2>
          <div className="p-5 rounded-2xl bg-[#FAE3EB] border border-[#F3CAD9] text-sm text-[#541235] space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#EC008C]" />
              Ważna informacja dla przyszłych rodziców:
            </p>
            <p>
              Materiały zawarte na Platformie HappyBirth mają charakter wyłącznie edukacyjny i informacyjny, wspierający przygotowanie do porodu w oparciu o Standard Organizacyjny Opieki Okołoporodowej (Rozporządzenie Ministra Zdrowia).
            </p>
            <p>
              Materiały te nie stanowią indywidualnej porady lekarskiej, diagnozy ani terapii i nie zastępują bezpośredniego badania ani opieki lekarza ginekologa-położnika lub położnej prowadzącej ciążę. W przypadku wystąpienia jakichkolwiek objawów nagłych lub budzących niepokój należy niezwłocznie skonsultować się z lekarzem prowadzącym, położną lub zgłosić się do najbliższej placówki ochrony zdrowia.
            </p>
          </div>
        </section>

        {/* § 5. Zawarcie Umowy, Płatność i Dostęp */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 5. Zawarcie Umowy, Ceny i Płatności
          </h2>
          <p>
            1. Ceny podane na Platformie są cenami brutto (zawierają podatek VAT) wyrażonymi w złotych polskich (PLN).
          </p>
          <p>
            2. Klient dokonuje zakupu poprzez kliknięcie przycisku zamówienia oraz opłacenie transakcji za pośrednictwem zintegrowanego operatora płatności elektronicznych (m.in. BLIK, szybkie przelewy online, karty płatnicze, Apple Pay, Google Pay).
          </p>
          <p>
            3. Dostęp do Strefy Kursantki zostaje uruchomiony automatycznie natychmiast po potwierdzeniu pomyślnej płatności przez operatora (zazwyczaj w ciągu kilkudziesięciu sekund).
          </p>
        </section>

        {/* § 6. Prawo Odstąpienia od Umowy – Treści Cyfrowe */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 6. Prawo Odstąpienia od Umowy a Treści Cyfrowe
          </h2>
          <p>
            1. Co do zasady, Konsumentowi przysługuje prawo do odstąpienia od umowy zawartej na odległość w terminie 14 dni bez podawania przyczyny.
          </p>
          <p>
            2. <strong>Zgodnie z art. 38 pkt 13 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta</strong>, prawo odstąpienia od umowy zawartej na odległość <strong>nie przysługuje</strong> Konsumentowi w odniesieniu do umów o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym, za które konsument jest zobowiązany do zapłaty ceny, jeżeli:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Usługodawca rozpoczął świadczenie usługi (umożliwił dostęp do materiałów VOD) za wyraźną i uprzednią zgodą Konsumenta;</li>
            <li>Konsument przed rozpoczęciem świadczenia został poinformowany o utracie prawa odstąpienia od umowy i przyjął to do wiadomości.</li>
          </ul>
          <p>
            3. W przypadku, gdy Klient nie wyraził zgody na natychmiastowe rozpoczęcie świadczenia przed upływem 14 dni, zachowuje pełne prawo do odstąpienia od umowy w terminie 14 dni od dnia zakupu, składając oświadczenie na adres: <strong>pomoc@happybirth.pl</strong>.
          </p>
        </section>

        {/* § 7. Procedura Reklamacji */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 7. Reklamacje i Wsparcie Techniczne
          </h2>
          <p>
            1. Wszelkie reklamacje dotyczące działania Platformy, problemów z dostępem do konta lub odtwarzaniem wideo należy kierować drogą elektroniczną na adres e-mail: <strong>pomoc@happybirth.pl</strong>.
          </p>
          <p>
            2. Zgłoszenie reklamacyjne powinno zawierać: adres e-mail użyty przy zakupie, opis problemu oraz ewentualne zrzuty ekranu ułatwiające diagnozę błędu.
          </p>
          <p>
            3. Usługodawca rozpatruje reklamację w terminie do <strong>14 dni kalendarzowych</strong> od momentu jej otrzymania i udziela odpowiedzi na adres e-mail składającego reklamację.
          </p>
        </section>

        {/* § 8. Prawa Autorskie */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 8. Własność Intelektualna i Prawa Autorskie
          </h2>
          <p>
            1. Wszelkie materiały wideo, teksty, grafiki, checklisty PDF oraz znaki towarowe udostępniane na Platformie podlegają ochronie prawa autorskiego przysługującej Usługodawcy.
          </p>
          <p>
            2. Zakupiony dostęp ma charakter licencji osobistej dla Kursantki i jej partnera (osoby towarzyszącej). Zabronione jest kopiowanie, nagrywanie ekranu, publiczne odtwarzanie, udostępnianie danych logowania osobom trzecim lub komercyjne rozpowszechnianie materiałów bez pisemnej zgody Sprzedawcy.
          </p>
        </section>

        {/* § 9. Postanowienia końcowe */}
        <section className="space-y-3 border-t border-[#EAE3DB] pt-6">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 9. Postanowienia Końcowe
          </h2>
          <p>
            1. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu Cywilnego, Ustawy o prawach konsumenta oraz Ustawy o świadczeniu usług drogą elektroniczną.
          </p>
          <p>
            2. Konsument ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in. za pośrednictwem platformy ODR dostępnej pod adresem: <code>http://ec.europa.eu/consumers/odr</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
