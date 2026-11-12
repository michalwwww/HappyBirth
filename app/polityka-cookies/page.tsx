import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Okruszki } from '@/components/site/page-shell';

export const metadata: Metadata = {
  title: 'Polityka cookies · HappyBirth',
  description: 'Jakie pliki cookies i dane w pamięci przeglądarki zapisuje strona HappyBirth.',
  alternates: { canonical: 'https://happybirth.pl/polityka-cookies' },
};

export default function PolitykaCookiesPage() {
  return (
    <PageShell>
      <section className="hb-strona-glowa">
        <div className="hb-wrap">
          <Okruszki biezaca="Polityka cookies" />
          <h1 className="hb-h1">Polityka cookies HappyBirth</h1>
          <p className="hb-lead">
            Administratorem serwisu <strong>happybirth.pl</strong> oraz <strong>strefa.happybirth.pl</strong> jest{' '}
            <strong>KLARSOLUTIONS Sp. z o.o.</strong> z siedzibą w Poznaniu (ul. Śląska 14, 60-614 Poznań, KRS: 0001268396, NIP: 7812118273, REGON: 545782779).
          </p>
        </div>
      </section>
      <section className="hb-sek hb-papier" style={{ paddingTop: 48 }}>
        <div className="hb-wrap">
          <div className="hb-proza">
            <h2>1. Krótko</h2>
            <p>
              Strona happybirth.pl domyślnie korzysta wyłącznie z niezbędnych technicznych plików cookies zapewniających bezpieczeństwo i działanie sesji. Baner przy pierwszej wizycie pyta o zgodę i zapisuje
              Twój wybór. Wewnątrz zamkniętej Strefy Kursantki (<strong>strefa.happybirth.pl</strong>) obowiązuje całkowity zakaz ładowania pikseli reklamowych podmiotów trzecich.
            </p>
            <h2>2. Co może zapisać się w Twojej przeglądarce</h2>
            <div className="hb-tabela">
              <table>
                <thead>
                  <tr><th>Mechanizm</th><th>Kto</th><th>Po co</th><th>Czy wymaga zgody</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Techniczne pliki cookies bezpieczeństwa, na przykład __cf_bm</td>
                    <td>Cloudflare</td>
                    <td>ochrona przed ruchem automatycznym i atakami</td>
                    <td>nie, są niezbędne do działania i bezpieczeństwa strony</td>
                  </tr>
                  <tr>
                    <td>Plik cookie sesji logowania (<code>hb_session</code>)</td>
                    <td>HappyBirth (KLARSOLUTIONS Sp. z o.o.)</td>
                    <td>utrzymanie bezpiecznego zalogowania w strefie kursu i panelu partnera (podpis HMAC-SHA256, HttpOnly)</td>
                    <td>nie, jest niezbędny do korzystania ze strefy kursu</td>
                  </tr>
                  <tr>
                    <td>Plik cookie decyzji cookies (<code>hb_cookie_consent</code>)</td>
                    <td>HappyBirth (KLARSOLUTIONS Sp. z o.o.)</td>
                    <td>zapamiętanie wyboru z banera cookies (np. „Tylko niezbędne” wyłącza zapis <code>hb_aff_ref</code>)</td>
                    <td>nie, służy do egzekwowania Twoich preferencji prywatności</td>
                  </tr>
                  <tr>
                    <td>Pliki cookie lokalizacji walutowej (<code>hb_geo_country</code>)</td>
                    <td>HappyBirth / Cloudflare Edge</td>
                    <td>2-literowy kod kraju ISO do wyświetlenia właściwej waluty (PLN/EUR/GBP/USD) bez śledzenia użytkownika</td>
                    <td>nie, służy do technicznego dopasowania cennika</td>
                  </tr>
                  <tr>
                    <td>Plik cookie atrybucji polecenia (<code>hb_aff_ref</code>)</td>
                    <td>HappyBirth (KLARSOLUTIONS Sp. z o.o.)</td>
                    <td>opcjonalne zapamiętanie kodu polecającego partnera/położnej przez 30 dni (HttpOnly)</td>
                    <td>nie jest zapisywane, gdy w banerze wybierzesz „Tylko niezbędne”</td>
                  </tr>
                  <tr>
                    <td>Pamięć przeglądarki (localStorage)</td>
                    <td>HappyBirth</td>
                    <td>zapamiętanie wyboru w banerze, języka, trybu jasnego lub ciemnego, ustawień dostępności, postępu w lekcjach i treści przygotowanych w strefie kursu</td>
                    <td>nie, służy funkcjom, z których korzystasz</td>
                  </tr>
                  <tr>
                    <td>Odtwarzacz wideo</td>
                    <td>Cloudflare Stream</td>
                    <td>odtworzenie zwiastuna i lekcji, które uruchamiasz kliknięciem; odtwarzacz łączy się z serwerami Cloudflare Stream</td>
                    <td>nie, ładuje się dopiero na Twoje żądanie</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2>3. Statystyka bez cookies</h2>
            <p>Liczbę odwiedzin mierzymy narzędziem Cloudflare Web Analytics, które nie zapisuje plików cookies ani nie tworzy identyfikatorów użytkownika.</p>
            <h2>4. Jak zarządzać cookies</h2>
            <p>
              Pliki cookies i pamięć przeglądarki możesz w każdej chwili usunąć albo zablokować w ustawieniach przeglądarki. Zablokowanie
              mechanizmów niezbędnych może utrudnić korzystanie ze strefy kursu.
            </p>
            <h2>5. Kontakt</h2>
            <p>
              Pytania o cookies i dane osobowe: <a href="mailto:kontakt@happybirth.pl">kontakt@happybirth.pl</a>. Więcej w{' '}
              <Link href="/polityka-prywatnosci">polityce prywatności</Link>.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
