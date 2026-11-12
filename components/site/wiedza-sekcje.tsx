// Sekcje bazy wiedzy wspólne dla strony publicznej Wiedza (/dla-ciebie) i pełnej wersji w strefie
// kursantki (/strefa/wiedza). Od 04.11.2026 strona publiczna pokazuje tylko wybrane hasła bez terminów,
// które algorytmy reklamowe mogą źle ocenić; pełna baza, kalendarz wizyt i wszystkie zmiany są w strefie.
import React from 'react';
import Link from 'next/link';
import { KnowledgeExplorer } from './knowledge-explorer';
import { KARTY, NAJWAZNIEJSZE, OKRESY, ZRODLA } from '@/lib/dla-ciebie-data';

// Hasła na stronie publicznej: prawa, organizacja opieki, osoba bliska, edukacja, karmienie i połóg,
// bez nazw badań, chorób, leków i zabiegów (lista sprawdzona słownikiem, tytuł, treść i cytaty).
export const HASLA_PUBLICZNE = [
  'trzy-prawa-w-standardzie',
  'osoba-bliska-ustawa',
  'prawo-do-informacji',
  'rzecznik-praw-pacjenta',
  'dodatkowa-opieka-pielegnacyjna',
  'edukacja-od-poczatku',
  'wizyty-co-cztery-tygodnie',
  'edukacja-dla-dwojga',
  'edukacja-kto-prowadzi',
  'plan-porodu-zmienia-sie',
  'szacunek-i-decyzje',
  'wsparcie-osoby-bliskiej',
  'ruch-i-pozycje',
  'jedzenie-i-picie',
  'matka-z-dzieckiem',
  'wsparcie-w-karmieniu-w-szpitalu',
  'karmienie-w-domu',
  'wizyty-domowe-po-porodzie',
  'polog-szesc-tygodni',
  'wsparcie-dla-osoby-bliskiej-w-pologu',
  'dostepnosc-uslug',
];

const TYTUL = Object.fromEntries(KARTY.map((k) => [k.id, k.tytul]));
const ZMIANA = Object.fromEntries(KARTY.map((k) => [k.id, k.zmiana]));

export function NajwazniejszeZmiany({ ids }: { ids?: string[] }) {
  const lista = ids ? NAJWAZNIEJSZE.filter((n) => ids.includes(n.karta)) : NAJWAZNIEJSZE;
  if (!lista.length) return null;
  return (
    <section aria-labelledby="zmiany-tyt" className="hb-sek hb-papier" id="zmiany">
      <div className="hb-wrap">
        <div className="hb-glowa">
          <h2 className="hb-h2" id="zmiany-tyt">Najważniejsze zmiany <span className="hb-kursywa">w opiece okołoporodowej</span></h2>
        </div>
        <ul className="hb-nowosci">
          {lista.map((n) => (
            <li key={n.karta}>
              <a className="hb-nowosc" href={`#haslo-${n.karta}`}>
                <span className={`hb-znacznik${ZMIANA[n.karta] === 'zmienione' ? ' hb-z2' : ''}`}>{ZMIANA[n.karta] === 'zmienione' ? 'Zmiana' : 'Nowe'}</span>
                <b>{n.tekst}</b>
                <span className="hb-maly">Hasło: {TYTUL[n.karta]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Hasla({ ids, wStrefie = false }: { ids?: string[]; wStrefie?: boolean }) {
  return (
    <section aria-labelledby="hasla-tyt" className="hb-sek" id="hasla">
      <div className="hb-wrap">
        <div className="hb-glowa">
          <h2 className="hb-h2" id="hasla-tyt">Prawa, poród, połóg i karmienie <span className="hb-kursywa">prostym językiem</span></h2>
          <p className="hb-lead">Każde hasło to krótkie wyjaśnienie, cytat z przepisu i wskazanie, w której lekcji kursu mówimy o tym więcej.</p>
        </div>
        <KnowledgeExplorer ids={ids} wStrefie={wStrefie} />
      </div>
    </section>
  );
}

export function KalendarzWizyt({ wStrefie = false }: { wStrefie?: boolean }) {
  return (
    <section aria-labelledby="kalendarz-tyt" className="hb-sek hb-len" id="kalendarz">
      <div className="hb-wrap">
        <div className="hb-glowa">
          <h2 className="hb-h2" id="kalendarz-tyt">Co dzieje się na wizytach <span className="hb-kursywa">tydzień po tygodniu</span></h2>
          <p className="hb-lead">
            W skrócie, według tabeli z części II standardu. Pełną listę badań w każdym okresie ustalacie z osobą prowadzącą ciążę,
            a omawiamy ją w <Link href={wStrefie ? '/strefa/lekcja/lekcja-11' : '/program#lekcja-11'}>lekcji 11</Link>.
          </p>
        </div>
        <ol className="hb-kalendarz">
          {OKRESY.map((o) => (
            <li className="hb-okres" key={o.id}>
              <p className="hb-okres-tyg">{o.etykieta}<small>{o.naglowek}</small></p>
              <div>
                {o.pozycje.length > 0 && (
                  <ul>
                    {o.pozycje.map((p) => <li className={p.zmiana === 'nowe' ? 'hb-nowe' : undefined} key={p.tekst}>{p.tekst}</li>)}
                  </ul>
                )}
                {o.badania.razem > 0 && (
                  <p className="hb-okres-bad">
                    Badania w tym okresie: {o.badania.razem} {o.badania.razem === 1 ? 'pozycja' : o.badania.razem < 5 ? 'pozycje' : 'pozycji'}
                    {o.badania.zmiany > 0 ? `, w tym ${o.badania.zmiany} nowe albo zmienione w 2026 roku` : ''}.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Zrodla() {
  return (
    <section aria-labelledby="zrodla-tyt" className="hb-sek" id="zrodla">
      <div className="hb-wrap hb-dwie-kol" style={{ alignItems: 'start' }}>
        <div className="hb-glowa">
          <h2 className="hb-h2" id="zrodla-tyt">Skąd to wiemy</h2>
          <p className="hb-maly">
            Cytaty sprawdzamy słowo w słowo z tekstem źródła. Jeśli coś wymaga poprawki, napiszcie na{' '}
            <a href="mailto:kontakt@happybirth.pl">kontakt@happybirth.pl</a>.
          </p>
        </div>
        <ul className="hb-zrodla-l">
          {ZRODLA.map((z) => (
            <li key={z.id}>
              <a href={z.url} rel="noreferrer" target="_blank">{z.tytul}</a>
              {z.publikacja ? `. ${z.publikacja}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
