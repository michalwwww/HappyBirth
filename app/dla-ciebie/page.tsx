import type { Metadata } from 'next';
import { PageShell, Okruszki } from '@/components/site/page-shell';
import { HASLA_PUBLICZNE, Hasla, NajwazniejszeZmiany, Zrodla } from '@/components/site/wiedza-sekcje';

// Wiedza (dawniej Dla Ciebie): darmowa baza wiedzy z przepisów, które obowiązują każdą placówkę
// prowadzącą ciążę, poród i połóg. Dane ze Źródłownika HappyBirth (cytaty sprawdzone słowo w słowo).
// Poprawki z 04.11.2026: pełna baza (wszystkie hasła, kalendarz wizyt) przeniesiona do strefy kursantki
// (/strefa/wiedza), bo wiele terminów mogą źle ocenić algorytmy reklamowe. Tu zostają wybrane hasła
// (HASLA_PUBLICZNE), dopisek o strefie i przycisk RESZTĘ POKAZUJEMY W LEKCJACH bez ceny.
// Bez żółtej ramki na końcu (informacja medyczna stoi w stopce).

export const metadata: Metadata = {
  title: 'Wiedza: prawa i standard opieki okołoporodowej · HappyBirth',
  description:
    'Najważniejsze prawa i zasady ze standardu opieki okołoporodowej od 7 maja 2026: osoba bliska, plan porodu, wizyty domowe po porodzie. Prostym językiem, ze źródłem.',
  alternates: { canonical: 'https://happybirth.pl/dla-ciebie' },
};

export default function DlaCiebiePage() {
  return (
    <PageShell active="dla-ciebie">
      <section className="hb-strona-glowa">
        <div className="hb-wrap">
          <Okruszki biezaca="Wiedza" />
          <h1 className="hb-h1 hb-h1-linia">Dużo przydatnej wiedzy</h1>
          <p className="hb-lead">
            Zebraliśmy w jednym miejscu najważniejsze prawa i zasady ze standardu opieki okołoporodowej w brzmieniu od 7 maja 2026 roku
            i z ustawy o prawach pacjenta. Prostym językiem, każde hasło ze źródłem.
          </p>
        </div>
      </section>

      <NajwazniejszeZmiany ids={HASLA_PUBLICZNE} />
      <Hasla ids={HASLA_PUBLICZNE} />
      <Zrodla />

      <section aria-labelledby="wiecej-tyt" className="hb-sek hb-papier hb-wiecej">
        <div className="hb-wrap hb-wiecej-in">
          <h2 className="hb-h3" id="wiecej-tyt">Więcej przydatnej wiedzy w Strefie Kursantki</h2>
          <p className="hb-maly">
            Po dołączeniu do kursu czeka tam pełna baza haseł ze standardu, kalendarz wizyt w ciąży tydzień po tygodniu i wszystkie
            zmiany z 2026 roku.
          </p>
          <a className="hb-btn hb-btn-kup hb-duzy" href="/program">Resztę pokazujemy w lekcjach</a>
          <a className="hb-wiecej-link" href="/strefa/wiedza">Masz już dostęp? Przejdź do wiedzy w Strefie Kursantki</a>
        </div>
      </section>
    </PageShell>
  );
}
