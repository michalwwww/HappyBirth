import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

/**
 * [A5] + [E1] + [E2] Ujednolicony Regulamin Świadczenia Usług i Sprzedaży Kursu Online:
 * - Operator: KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ (KRS 0001268396, NIP 7812118273, REGON 545782779)
 * - Cena bazowa: 489,00 zł brutto (płatność jednorazowa, VAT 23%)
 * - Okres dostępu: 18 miesięcy (548 dni) od momentu zakupu
 * - Struktura: 8 modułów w 4 etapach fizjologicznych (52 lekcje wideo 4K, 288 minut)
 * - Synergia Art. 38 ust. 1 pkt 13 u.p.k. ([E1]) z elektronicznym przyciskiem „Odstąp od umowy” (/odstap-od-umowy [E2])
 */
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
          <span>Dokument prawny · Wersja zaktualizowana 27.10.2026 r.</span>
        </div>
        <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] tracking-tight">
          Regulamin Świadczenia Usług i Sprzedaży Kursu Online HappyBirth.pl
        </h1>
        <p className="text-sm sm:text-base text-[#544A44] leading-relaxed">
          Niniejszy regulamin określa zasady korzystania z platformy internetowej HappyBirth.pl oraz warunki zakupu 18-miesięcznego dostępu do materiałów edukacyjnych VOD.
        </p>
      </div>

      {/* Treść Regulaminu */}
      <div className="space-y-8 text-sm sm:text-base text-[#342D28] leading-relaxed font-sans">
        {/* § 1 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 1. Postanowienia ogólne i dane Usługodawcy
          </h2>
          <p>
            1. Właścicielem, operatorem prawnym i administratorem platformy internetowej dostępnej pod adresem{' '}
            <strong>happybirth.pl</strong> oraz <strong>strefa.happybirth.pl</strong> (zwanej dalej „Platformą” lub „Serwisem”) jest:
          </p>
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1.5 text-sm">
            <p>
              <strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong> (skrót:{' '}
              <strong>KLARSOLUTIONS Sp. z o.o.</strong>)
            </p>
            <p>Adres siedziby: ul. Śląska 14, 60-614 Poznań, Polska</p>
            <p>
              KRS: <strong>0001268396</strong> · NIP: <strong>7812118273</strong> · REGON: <strong>545782779</strong>
            </p>
            <p>
              Sąd Rejestrowy: Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego
            </p>
            <p>Kapitał zakładowy: 5 000,00 PLN (opłacony w całości)</p>
            <p>
              Adres poczty elektronicznej (e-mail): <strong>kontakt@happybirth.pl</strong>
            </p>
            <p>
              Adres e-mail ds. reklamacji i obsługi kursantek: <strong>pomoc@happybirth.pl</strong>
            </p>
          </div>
          <p>
            2. Niniejszy Regulamin skierowany jest zarówno do Konsumentów, Przedsiębiorców na prawach konsumenta, jak i Przedsiębiorców korzystających z Serwisu.
          </p>
        </section>

        {/* § 2 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 2. Definicje
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Usługodawca / Sprzedawca</strong> – KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Poznaniu (ul. Śląska 14, 60-614 Poznań), KRS: 0001268396, NIP: 7812118273, REGON: 545782779.
            </li>
            <li>
              <strong>Klient / Kursantka</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna zawierająca Umowę ze Sprzedawcą.
            </li>
            <li>
              <strong>Kurs / Treść Cyfrowa</strong> – kompleksowy program szkoły rodzenia online nagrany z położnymi i ekspertkami ze szkoły rodzenia Mama Gaja (od 2012 r.), obejmujący <strong>52 lekcje wideo 4K (288 minut / ~5h) w 8 modułach tematycznych (podzielonych na 4 etapy fizjologiczne)</strong> oraz Notatnik Rodzica PDF i checklisty.
            </li>
            <li>
              <strong>Dodatek Komplementarny (Order Bump)</strong> – opcjonalny pakiet dodatkowy dostępny w koszyku za <strong>+49,00 zł brutto</strong> (Indywidualny Pakiet Dokumentów Szpitalnych i Kreator Planu Porodu + Checklista Wyprawkowa PDF).
            </li>
          </ul>
        </section>

        {/* § 3 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 3. Przedmiot Usługi, Struktura 8 Modułów i 18-Miesięczny Okres Dostępu
          </h2>
          <p>
            1. Przedmiotem umowy jest odpłatne udzielenie dostępu do Treści Cyfrowych – kursu szkoły rodzenia online składającego się z <strong>52 lekcji wideo 4K (łącznie 288 minut) zgrupowanych w 8 modułach i 4 etapach fizjologicznych</strong> (Etap I: Moduły 1–2; Etap II: Moduł 3; Etap III: Moduły 4–5; Etap IV: Moduły 6–8).
          </p>
          <p>
            2. Dostęp do wszystkich materiałów w Strefie Kursantki udzielany jest na okres{' '}
            <strong>18 miesięcy (548 dni) liczonych od momentu zakupu</strong>. W cenę kursu wliczony jest bezpłatny dostęp dla osoby towarzyszącej (partnera).
          </p>
          <p>
            3. Do prawidłowego korzystania z Platformy wymagane jest urządzenie z dostępem do Internetu, aktualna przeglądarka internetowa oraz aktywny adres poczty elektronicznej (e-mail).
          </p>
        </section>

        {/* § 4 */}
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
              Materiały zawarte na Platformie HappyBirth.pl mają charakter wyłącznie edukacyjny i informacyjny, wspierający przygotowanie do porodu i rodzicielstwa w oparciu o Standard Organizacyjny Opieki Okołoporodowej.
            </p>
            <p>
              Materiały te nie stanowią indywidualnej porady lekarskiej, diagnozy ani terapii i nie zastępują bezpośredniego badania ani opieki lekarza lub położnej prowadzącej ciążę. W sytuacji zagrożenia zdrowia lub życia należy niezwłocznie zadzwonić pod numer alarmowy 112 lub zgłosić się do najbliższego szpitala.
            </p>
          </div>
        </section>

        {/* § 5 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 5. Ceny, Dyrektywa Omnibus i Płatności
          </h2>
          <p>
            1. Cena bazowa kursu wynosi <strong>489,00 zł brutto</strong> (płatność jednorazowa, zawiera podatek VAT 23%; brak ukrytych subskrypcji).
          </p>
          <p>
            2. W przypadku zastosowania autoryzowanego kodu rabatowego (np. <strong>-10%</strong> od położnej, partnera lub koleżanki, obniżającego cenę kursu do <strong>440,10 zł brutto</strong>), obok ceny promocyjnej zawsze prezentowana jest informacja o najniższej cenie z 30 dni przed obniżką zgodnie z Dyrektywą Omnibus.
          </p>
          <p>
            3. Płatności realizowane są za pośrednictwem operatora Stripe (BLIK, karty płatnicze, szybkie przelewy, Apple Pay, Google Pay). Po opłaceniu zamówienia Klient otrzymuje potwierdzenie zawarcia umowy na trwałym nośniku (wiadomość e-mail) wraz z fakturą VAT 23%.
          </p>
        </section>

        {/* § 6 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 6. Prawo Odstąpienia od Umowy (Art. 38 ust. 1 pkt 13 u.p.k.) oraz Przycisk „Odstąp od umowy”
          </h2>
          <p>
            1. Co do zasady, Konsumentowi przysługuje prawo do odstąpienia od umowy zawartej na odległość w terminie 14 dni bez podawania przyczyny. Elektroniczny formularz odstąpienia od umowy dostępny jest bez konieczności logowania pod stałym adresem:{' '}
            <Link href="/odstap-od-umowy" className="text-[#DA0271] font-bold underline">
              https://happybirth.pl/odstap-od-umowy
            </Link>
            .
          </p>
          <p>
            2. <strong>Zgodnie z art. 38 ust. 1 pkt 13 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta</strong>, prawo odstąpienia od umowy zawartej na odległość <strong>nie przysługuje</strong> Konsumentowi w odniesieniu do umów o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym, za które konsument jest zobowiązany do zapłaty ceny, jeżeli:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              przedsiębiorca rozpoczął świadczenie za wyraźną i uprzednią zgodą Konsumenta, który został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez przedsiębiorcę utraci prawo odstąpienia od umowy, i przyjął to do wiadomości, a
            </li>
            <li>
              przedsiębiorca przekazał Konsumentowi potwierdzenie zawarcia umowy i udzielenia zgody na trwałym nośniku (wiadomość e-mail po zakupie).
            </li>
          </ul>
          <p>
            3. W przypadku złożenia zgłoszenia przez formularz <code>/odstap-od-umowy</code> po wyrażeniu powyższej zgody i po rozpoczęciu korzystania z kursu (otwarciu materiałów w Strefie Kursantki), system automatycznie przesyła potwierdzenie wpływu zgłoszenia wraz z informacją prawną o wygaśnięciu prawa odstąpienia w zakresie kursu głównego. Konsument zachowuje możliwość częściowego odstąpienia od niewykorzystanego dodatku z Order Bumpa (+49,00 zł) lub pełnego odstąpienia, jeżeli dostęp do kursu nie został jeszcze uruchomiony.
          </p>
        </section>

        {/* § 7 */}
        <section className="space-y-3">
          <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512]">
            § 7. Reklamacje i Wsparcie Techniczne
          </h2>
          <p>
            1. Reklamacje dotyczące działania Platformy należy kierować na adres e-mail: <strong>pomoc@happybirth.pl</strong>. Usługodawca rozpatruje reklamację w terminie do 14 dni kalendarzowych.
          </p>
        </section>
      </div>
    </div>
  );
}
