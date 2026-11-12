import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';
import { PageShell, Okruszki } from '@/components/site/page-shell';

export default function PolitykaPrywatnosciPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <Okruszki biezaca="Polityka prywatności" />

        {/* Header */}
        <div className="space-y-4 border-b border-[color:var(--hb-linia)] pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFEED4] border border-[#C5E1B3] text-xs font-semibold text-[#347A22]">
            <Lock className="w-3.5 h-3.5" />
            <span>Ochrona danych osobowych (RODO / UK GDPR / CCPA)</span>
          </div>
          <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[color:var(--hb-ink)] tracking-tight">
            Polityka Prywatności i Plików Cookies
          </h1>
          <p className="text-sm sm:text-base text-[color:var(--hb-ink2)] leading-relaxed">
            Szanujemy Twoją prywatność. Poniższy dokument wyjaśnia w przejrzysty sposób, jakie dane zbieramy, w jakim celu je przetwarzamy oraz jak dbamy o ich bezpieczeństwo zgodnie z Rozporządzeniem RODO.
          </p>
        </div>

        {/* Treść */}
        <div className="space-y-8 text-sm sm:text-base text-[color:var(--hb-ink)] leading-relaxed font-sans">
          {/* 1. Administrator */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              1. Administrator Danych Osobowych
            </h2>
            <p>
              Administratorem Twoich danych osobowych w rozumieniu art. 4 pkt 7 RODO jest:
            </p>
            <div className="p-5 rounded-2xl bg-[color:var(--hb-karta)] border border-[color:var(--hb-linia)] space-y-1.5 text-sm">
              <p><strong>KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong> (skrót: <strong>KLARSOLUTIONS Sp. z o.o.</strong>)</p>
              <p>Adres siedziby: ul. Śląska 14, 60-614 Poznań, Polska</p>
              <p>KRS: <strong>0001268396</strong> · NIP: <strong>7812118273</strong> · REGON: <strong>545782779</strong></p>
              <p>Sąd Rejestrowy: Sąd Rejonowy Poznań - Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy KRS</p>
              <p>Kapitał zakładowy: 5 000,00 PLN</p>
              <p>E-mail kontaktowy: <strong>kontakt@happybirth.pl</strong></p>
              <p>E-mail ds. prywatności i RODO: <strong>pomoc@happybirth.pl</strong></p>
            </div>
          </section>

          {/* 2. Cele i podstawy prawne przetwarzania */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              2. Cele, Zakres i Podstawy Prawne Przetwarzania
            </h2>
            <p>Przetwarzamy Twoje dane w następujących celach:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Realizacja zamówienia i dostęp do Strefy Kursantki</strong> (art. 6 ust. 1 lit. b RODO – niezbędność do wykonania umowy): przetwarzamy Twój adres e-mail, imię, dane transakcji oraz rejestr dowodowy zgód konsumenckich w celu udostępnienia kursu na okres <strong>18 miesięcy (548 dni) od momentu zakupu</strong>.
              </li>
              <li>
                <strong>Wypełnienie obowiązków prawno-podatkowych (w tym VAT OSS / Stripe Tax)</strong> (art. 6 ust. 1 lit. c RODO): wystawianie faktur, prowadzenie księgowości i archiwizacja dokumentów rozliczeniowych.
              </li>
              <li>
                <strong>Obsługa zapytań i wsparcie techniczne</strong> (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes Administratora): kontakt w sprawach związanych z obsługą konta lub zgłoszeniami reklamacyjnymi.
              </li>
              <li>
                <strong>Program Partnerski B2B i Program Afiliacyjny</strong> (art. 6 ust. 1 lit. b, c i f RODO): przetwarzanie danych położnych, fizjoterapeutek, twórców oraz firm B2B (imię, nazwisko, e-mail, kod afiliacyjny, dane rozliczeniowe B2B/PIT i rachunek IBAN do wypłaty prowizji) oraz ewidencja poleceń w programie dla mam (<code>student_referrals</code>).
              </li>
              <li>
                <strong>Bezpłatne narzędzia publiczne (Plan Porodu PDF / Kalkulator Wyprawki PDF) oraz sekwencja e-mailowa</strong> (art. 6 ust. 1 lit. a i f RODO): dostarczenie wybranego narzędzia PDF wraz z edukacyjną sekwencją e-mailową za wyraźną zgodą (z możliwością natychmiastowej rezygnacji jednym kliknięciem — RFC 8058 One-Click Unsubscribe).
              </li>
              <li>
                <strong>Dobrowolna personalizacja profilu ciąży wewnątrz Strefy Kursantki</strong> (art. 9 ust. 2 lit. a RODO — wyraźna zgoda osoby, której dane dotyczą): wyłącznie po dobrowolnym wypełnieniu kreatora w Strefie Kursantki i zaznaczeniu odrębnej zgody RODO zapisujemy termin porodu lub wybrane preferencje okołoporodowe, aby dopasować kolejność lekcji. W każdej chwili możesz te dane usunąć lub cofnąć zgodę.
              </li>
            </ul>
          </section>

          {/* 3. Prywatność medyczna */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              3. Ochrona Prywatności Medycznej (Brak Pikseli w Strefie Kursantki)
            </h2>
            <div className="p-5 rounded-2xl bg-[#F9E6EC] dark:bg-[#3A2033] border border-[#EAADC0] dark:border-[#4E2840] text-sm text-[color:var(--hb-ink)] space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[color:var(--hb-mag-t)]" />
                Zasada zerowej inwigilacji wewnątrz kursu:
              </p>
              <p>
                Wiemy, jak intymnym okresem jest ciąża i narodziny dziecka. Dlatego wewnątrz Strefy Kursantki (<strong>strefa.happybirth.pl</strong>) obowiązuje całkowity zakaz stosowania pikseli śledzących podmiotów trzecich (takich jak Meta Pixel czy Google Ads Remarketing).
              </p>
              <p>
                Twoje postępy w oglądaniu lekcji, wybrane preferencje w Planie Porodu czy przeglądanie apteczki nie są przekazywane żadnym sieciom reklamowym ani profilowane komercyjnie.
              </p>
            </div>
          </section>

          {/* 4. Odbiorcy danych */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              4. Odbiorcy Danych (Podmioty Przetwarzające)
            </h2>
            <p>Twoje dane mogą być powierzane zaufanym podmiotom technicznym:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Cloudflare Inc.</strong> (USA / UE) – bezpieczny hosting na serwerach Cloudflare Pages, baza Cloudflare D1 oraz streaming wideo Cloudflare Stream (z zachowaniem Standardowych Klauzul Umownych SCC);</li>
              <li><strong>Stripe Payments Europe Ltd.</strong> (UE / USA, SCC) – bezpieczne procesowanie transakcji BLIK, kart płatniczych, Klarna, Apple Pay i Google Pay oraz obsługa podatku VAT OSS / Stripe Tax;</li>
              <li><strong>Resend Inc.</strong> (USA, Standardowe Klauzule Umowne SCC) – wysyłka transakcyjnych potwierdzeń zakupu (trwały nośnik), jednorazowych linków logowania (Magic Link) oraz edukacyjnych wiadomości e-mail dla subskrybentek narzędzi PDF;</li>
              <li><strong>Biuro rachunkowo-księgowe</strong> – w celu obsługi faktur i rozliczeń podatkowych.</li>
            </ul>
          </section>

          {/* 5. Pliki Cookies i LocalStorage */}
          <section className="space-y-3" id="cookies">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              5. Pliki Cookies i Pamięć Lokalna (LocalStorage)
            </h2>
            <p>
              1. Serwis wykorzystuje pamięć lokalną przeglądarki (<strong>localStorage</strong>) oraz techniczne pliki cookies wyłącznie do celów funkcjonalnych:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ciasteczko sesji logowania <code>hb_session</code> (podpisane kryptograficznie HMAC-SHA256, <code>HttpOnly</code>) – niezbędne do utrzymania zalogowanej sesji w Strefie Kursantki i Panelu Partnera;</li>
              <li>Zapamiętywanie oznaczonych jako ukończone lekcji oraz pozycji odtwarzania wideo;</li>
              <li>Zapamiętanie wybranego trybu widoku (Dla Mamy / Dla Taty) oraz wybranego wariantu językowo-krajowego Planu Porodu i Pakietu Kart Sytuacyjnych;</li>
              <li>Techniczne dopasowanie waluty i edycji językowo-krajowej (ciasteczka funkcjonalne <code>hb_country</code>, <code>hb_geo_country</code> oraz <code>hb_locale</code> przechowujące wyłącznie 2-literowy kod kraju ISO bez gromadzenia dokładnej lokalizacji GPS);</li>
              <li>Zapisanie decyzji z banera cookies (ciasteczko <code>hb_cookie_consent</code> oraz <code>localStorage</code>);</li>
              <li>Opcjonalne ciasteczko atrybucji partnerskiej <code>hb_aff_ref</code> (ważne 30 dni, <code>HttpOnly</code>) – zapisywane wyłącznie po wejściu z linku polecającego i wyłączane w przypadku wyboru opcji „Tylko niezbędne” w banerze cookies.</li>
            </ul>
            <p>
              2. Niezbędne pliki techniczne nie wymagają uprzedniej zgody. Szczegółową tabelę mechanizmów znajdziesz w <Link href="/polityka-cookies" className="underline text-[color:var(--hb-mag-t)]">Polityce Cookies</Link>.
            </p>
          </section>

          {/* 5a. Okresy przechowywania danych (Retencja) */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              5a. Okresy Przechowywania Danych (Art. 13 ust. 2 lit. a RODO)
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Dane zamówienia, rejestr dowodowy art. 38 pkt 13 u.p.k. i dokumentacja księgowa:</strong> przez okres realizacji umowy (18 miesięcy / 548 dni dostępu) oraz przez <strong>5 lat podatkowych</strong> liczonych od końca roku kalendarzowego, w którym upłynął termin płatności podatku (obowiązek ustawowy);</li>
              <li><strong>Dobrowolne dane profilu ciąży w Strefie Kursantki (Art. 9 RODO):</strong> do czasu usunięcia ich przez Kursantkę, cofnięcia zgody lub wygaśnięcia 18-miesięcznego dostępu do konta;</li>
              <li><strong>Dane kontaktowe leadów narzędzi PDF:</strong> do momentu wypisania się (kliknięcie linku rezygnacji w wiadomości e-mail) lub zgłoszenia sprzeciwu, maksymalnie przez 24 miesiące od ostatniej aktywności;</li>
              <li><strong>Dane rozliczeniowe partnerów afiliacyjnych:</strong> przez okres trwania współpracy oraz ustawowy okres przedawnienia roszczeń i archiwizacji podatkowej (5 lat podatkowych);</li>
              <li><strong>Techniczne logi zabezpieczenia anty-spam (rate limiting):</strong> automatycznie wygasają po upływie 15 minut.</li>
            </ul>
          </section>

          {/* 6. Prawa Użytkownika */}
          <section className="space-y-3">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
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

          {/* 7. International Privacy Notice (UK GDPR, CCPA/CPRA, LGPD) */}
          <section className="space-y-3 pt-4 border-t border-[color:var(--hb-linia)]">
            <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[color:var(--hb-ink)]">
              7. International Privacy & Health Data Protection Notice (UK GDPR / US CCPA / Brazil LGPD)
            </h2>
            <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)]">
              For users accessing HappyBirth from the United Kingdom (UK GDPR & Data Protection Act 2018), the United States (including California CCPA/CPRA), Australia (Privacy Act 1988), and Brazil (LGPD Lei nº 13.709/2018): <strong>KLARSOLUTIONS Sp. z o.o. does NOT sell, rent, or share sensitive pregnancy or health-related data with any third-party advertising networks (such as Meta, TikTok, or Google Ads).</strong> Interactive public checklists store preferences locally in your browser, while optional pregnancy personalization inside the Student Zone is synced encrypted to your account only upon your explicit Art. 9 GDPR consent. The Student Zone (<code>/strefa/*</code>) operates under a strict zero-advertising-pixel policy.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
