import type { Metadata } from 'next';
import { Hasla, KalendarzWizyt, NajwazniejszeZmiany, Zrodla } from '@/components/site/wiedza-sekcje';
import { Sierotki } from '@/components/site/sierotki';
import { STAN_PRAWNY } from '@/lib/dla-ciebie-data';

// Pełna baza wiedzy dla kursantek (poprawki z 04.11.2026): wszystkie hasła ze standardu opieki
// okołoporodowej i ustawy o prawach pacjenta, najważniejsze zmiany z 2026 roku i kalendarz wizyt.
// Przeniesiona ze strony publicznej Wiedza, bo strefa nie trafia do algorytmów reklamowych
// (bez pikseli, noindex z layoutu strefy). Odnośniki do lekcji otwierają odtwarzacz w strefie.

export const metadata: Metadata = {
  title: 'Wiedza · Strefa Rodziców · HappyBirth',
  description: 'Pełna baza wiedzy HappyBirth: prawa pacjentki, standard opieki okołoporodowej i kalendarz wizyt w ciąży.',
};

export default function StrefaWiedzaPage() {
  return (
    <div className="hb-site hb-w-strefie">
      <Sierotki korzenie=".hb-w-strefie" />
      <section className="hb-strona-glowa">
        <div className="hb-wrap">
          <h1 className="hb-h1 hb-h1-linia">Dużo przydatnej wiedzy</h1>
          <p className="hb-lead">
            Wszystko, co obowiązuje każdą placówkę prowadzącą ciążę, poród i połóg: standard opieki okołoporodowej w brzmieniu od
            7 maja 2026 roku, prawa pacjenta i kalendarz wizyt w ciąży. Każde hasło ma źródło, a przy wielu z nich jest odnośnik
            do lekcji, w której mówimy o tym więcej.
          </p>
          <nav aria-label="Na tej stronie" className="hb-chipy" style={{ marginTop: 26 }}>
            <a className="hb-chip" href="#zmiany">Najważniejsze zmiany</a>
            <a className="hb-chip" href="#hasla">Hasła</a>
            <a className="hb-chip" href="#kalendarz">Kalendarz wizyt</a>
            <a className="hb-chip" href="#zrodla">Źródła</a>
          </nav>
        </div>
      </section>

      <NajwazniejszeZmiany />
      <Hasla wStrefie />
      <KalendarzWizyt wStrefie />
      <Zrodla />

      <section className="hb-sek hb-ciasna hb-sek-koniec">
        <div className="hb-wrap">
          <p className="hb-uwaga">
            Materiały mają charakter edukacyjny i nie zastępują porady lekarza ani wykwalifikowanej specjalistki. Szczegóły Waszej opieki
            ustalacie z osobą prowadzącą ciążę. W sytuacji zagrożenia zdrowia lub życia dzwońcie pod numer 112. Stan prawny: {STAN_PRAWNY}.
          </p>
        </div>
      </section>
    </div>
  );
}
