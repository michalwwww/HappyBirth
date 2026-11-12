import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Okruszki } from '@/components/site/page-shell';

// Standard merytoryczny: treść z naszej wersji v1 (24.09.2026), przeniesiona ze statycznego
// public/standard-merytoryczny.html do wspólnego układu v3. Zmienione tylko zdania sprzeczne
// z okresem dostępu z regulaminu (18 miesięcy od zakupu).
// Poprawki z 13.10.2026: bez etykiety z kropkami, bez nazwy szkoły. Od 04.11.2026 bez pasa zakupu.

export const metadata: Metadata = {
  title: 'Standard merytoryczny · HappyBirth',
  description: 'Na czym opieramy program HappyBirth, jak powstają lekcje i czego nie robimy.',
  alternates: { canonical: 'https://happybirth.pl/standard-merytoryczny' },
};

export default function StandardPage() {
  return (
    <PageShell>
      <section className="hb-strona-glowa">
        <div className="hb-wrap">
          <Okruszki biezaca="Standard merytoryczny" />
          <h1 className="hb-h1">Standard merytoryczny</h1>
          <p className="hb-lead">Na czym opieramy program, jak powstają lekcje i czego nie robimy.</p>
        </div>
      </section>
      <section className="hb-sek hb-papier" style={{ paddingTop: 48 }}>
        <div className="hb-wrap">
          <div className="hb-proza">
            <h2>Na czym opieramy program</h2>
            <p>
              Lekcje HappyBirth nagraliśmy z dyplomowanymi ekspertkami, na bazie wytycznych polskiej opieki okołoporodowej. Punktem odniesienia
              jest standard organizacyjny opieki okołoporodowej, czyli rozporządzenie Ministra Zdrowia z 16 sierpnia 2018 roku.
            </p>
            <p>
              Od 7 maja 2026 roku obowiązuje zmienione brzmienie tego standardu, wprowadzone rozporządzeniem Ministra Zdrowia z 23 października
              2025 roku (Dz.U. 2025 poz. 1525). Najważniejsze zapisy prostym językiem zebraliśmy na stronie <Link href="/dla-ciebie">Dla Ciebie</Link>.
            </p>
            <p>Merytoryczną bazą kursu jest szkoła rodzenia stacjonarna, założona w 2012 roku.</p>

            <h2>Jak powstają lekcje</h2>
            <ul>
              <li>
                Program ma 52 lekcje w 8 modułach, prawie 5 godzin materiału wideo, dokładnie 4 h 48 min. Każda lekcja ma stały numer, tytuł
                i czas trwania, a pełna lista jest na stronie <Link href="/program">Program</Link>.
              </li>
              <li>Lekcje nagraliśmy z dyplomowanymi ekspertkami. W kilku lekcjach o swoich doświadczeniach opowiadają rodzice.</li>
              <li>
                Kolejność lekcji pochodzi z programu kursu. Na stronie publicznej część tytułów jest zredagowana ogólniej, bez nazw procedur
                medycznych, a moduły opisujemy bez zaleceń zdrowotnych.
              </li>
            </ul>

            <h2>Czego nie robimy</h2>
            <ul>
              <li>Nie jesteśmy placówką medyczną i nie udzielamy porad medycznych.</li>
              <li>Nie obiecujemy przebiegu porodu ani efektów zdrowotnych.</li>
              <li>Narzędzia w strefie kursu niczego nie diagnozują i nie interpretują objawów.</li>
              <li>Nie pokazujemy wygenerowanych ekspertów ani opinii. Zdjęcia na stronie to wizualizacje AI.</li>
            </ul>

            <h2>Dane o zdrowiu</h2>
            <p>
              Dostęp do kursu trwa 18 miesięcy od dnia zakupu. Danych o zdrowiu
              nie przekazujemy do narzędzi reklamowych.
            </p>

            <h2>Zgłaszanie poprawek</h2>
            <p>
              Jeśli w lekcji albo na stronie znajdziecie coś, co wymaga poprawki, napiszcie na{' '}
              <a href="mailto:kontakt@happybirth.pl">kontakt@happybirth.pl</a>.
            </p>

            <h2>Źródła</h2>
            <ul>
              <li>Rozporządzenie Ministra Zdrowia z dnia 16 sierpnia 2018 r. w sprawie standardu organizacyjnego opieki okołoporodowej</li>
              <li>
                <a href="https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001525" rel="noreferrer" target="_blank">
                  Rozporządzenie Ministra Zdrowia z dnia 23 października 2025 r. zmieniające rozporządzenie w sprawie standardu organizacyjnego
                  opieki okołoporodowej, Dz.U. 2025 poz. 1525
                </a>
              </li>
            </ul>
            <p className="hb-maly">Ostatnia aktualizacja strony: 13 października 2026.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
