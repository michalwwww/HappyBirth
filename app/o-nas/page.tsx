import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Okruszki } from '@/components/site/page-shell';
import { Karuzela, type Slajd } from '@/components/site/hero-carousel';
import { StatsBand } from '@/components/site/stats-band';
import { HOME, type LiczbyCopy } from '@/lib/site-copy';

// O nas v3 po poprawkach z 04.11.2026 (X1: tytuł w dwóch krojach i kolorach, bez kropek w tytułach): karuzela jak na stronie głównej, ale z własnymi kadrami
// (dłonie położnej i mamy na brzuchu, mama ubrana; wizualizacje AI w kolorach strony),
// tytuł bez podtytułu, opis w trzech zdaniach, DOŁĄCZ DO NASZEJ SPOŁECZNOŚCI i mniejszy odnośnik
// do programu. Pod zdjęciem cztery liczby przeniesione ze strony głównej (mniejsze kafle).
// Dalej tylko dwie sekcje: Happy Birth, doświadczenie mamy oraz Dlaczego warto skorzystać.
// Bez sześciu zasad, bez sekcji o sali i kursie, bez sekcji o osobie towarzyszącej.

export const metadata: Metadata = {
  title: 'O nas · HappyBirth',
  description:
    'Od 2012 roku tworzymy bezpieczną przestrzeń dla kobiet w ciąży. HappyBirth to kompletna szkoła rodzenia dla dwojga, teraz także online.',
  alternates: { canonical: 'https://happybirth.pl/o-nas' },
};

const SLAJDY: Slajd[] = [
  { base: 'onas-1-dlonie', widths: [640, 960, 1280, 1920, 2400], fx: '60%', fy: '45%', fxm: '60%', w: 2688, h: 1520 },
  { base: 'onas-2-sweter', widths: [640, 960, 1280, 1920, 2400], fx: '64%', fy: '50%', fxm: '74%', w: 2688, h: 1520 },
  { base: 'onas-3-len', widths: [640, 960, 1280, 1920, 2400], fx: '62%', fy: '40%', fxm: '68%', w: 2688, h: 1520 },
  { base: 'onas-4-notes', widths: [640, 960, 1280, 1920, 2400], fx: '58%', fy: '55%', fxm: '58%', w: 2688, h: 1520 },
  { base: 'onas-5-zegarek', widths: [640, 960, 1280, 1920, 2400], fx: '62%', fy: '60%', fxm: '66%', w: 2688, h: 1520 },
];

const ALTY = [
  'Wspierające dłonie spoczywają na brzuchu przyszłej mamy w beżowym swetrze',
  'Przyszła mama w kremowym swetrze trzyma dłonie na brzuchu w spokojnym geście wsparcia',
  'Wspólne spotkanie edukacyjne i wspierająca dłoń na brzuchu mamy w lnianej sukience',
  'Spokojna rozmowa z notatnikiem na kolanach i wspierająca dłoń obok przyszłej mamy',
  'Wspierające dłonie prowadzą dłonie przyszłej mamy podczas ćwiczeń oddechowych',
];

const LICZBY: LiczbyCopy = {
  label: 'HappyBirth w liczbach',
  stats: [
    { n: 18000, plus: true, label: 'uczestniczek' },
    { n: 14, plus: true, label: 'lat doświadczenia' },
    { n: 52, label: 'lekcje wideo' },
    { n: 24, tekst: '24/7', label: 'dostępność kursu' },
  ],
};

export default function ONasPage() {
  return (
    <PageShell active="o-nas">
      <Karuzela alty={ALTY} ariaLabelledby="o-nas-tyt" className="hb-hero-onas" etykiety={HOME.pl.hero} slajdy={SLAJDY}>
        <Okruszki biezaca="O nas" />
        <h1 id="o-nas-tyt"><span className="hb-d1">Od 2012 tworzymy</span> <span className="hb-d2">bezpieczną przestrzeń dla kobiet w ciąży</span></h1>
        <p className="hb-lead hb-linie">
          <span>HappyBirth to kompletna szkoła rodzenia dla dwojga. </span>
          <span>18 000 kobiet w ciąży uczestniczyło w naszych kursach stacjonarnych. </span>
          <span>Teraz dostępne są w wersji online, wzbogacone dodatkową wiedzą i dostępne dla Was, kiedy tylko chcecie.</span>
        </p>
        <div className="hb-hero-ctas hb-hero-ctas-pion">
          <a className="hb-btn hb-btn-kup hb-duzy" href="/#kup">Dołącz do naszej społeczności</a>
          <Link className="hb-hero-link" href="/program">Zapoznaj się z kompletnym programem</Link>
        </div>
      </Karuzela>

      <StatsBand lang="pl" male t={LICZBY} />

      {/* Happy Birth, doświadczenie mamy */}
      <section aria-labelledby="doswiadczenie" className="hb-sek hb-sek-po-liczbach">
        <div className="hb-wrap hb-onas-dosw">
          <h2 className="hb-h2" id="doswiadczenie">
            Happy Birth <span className="hb-kursywa">Doświadczenie mamy</span>
          </h2>
          <div className="hb-proza">
            <p>
              Merytoryczną bazą naszego kursu HappyBirth jest szkoła rodzenia stacjonarna, założona w 2012 roku w Poznaniu. Od tego
              czasu szkoła odnotowała ponad 18 000 urodzeń w rodzinach, które się w niej przygotowywały.
            </p>
            <p>
              Lekcje nagraliśmy z dyplomowanymi ekspertkami. Bazą jest niezwykle rozbudowany, uważany za wysoce profesjonalny standard
              polskiej opieki okołoporodowej. W kilku lekcjach o swoich doświadczeniach opowiadają nam również szczęśliwi rodzice.
            </p>
            <p>
              Jak powstaje program, opisujemy na stronie <Link href="/standard-merytoryczny">Standard merytoryczny</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Dlaczego warto skorzystać */}
      <section aria-labelledby="dlaczego-warto" className="hb-sek hb-papier">
        <div className="hb-wrap hb-onas-dosw">
          <h2 className="hb-h2" id="dlaczego-warto">Dlaczego warto skorzystać?</h2>
          <div className="hb-proza">
            <p>
              Połączenie doświadczenia z prowadzenia szkoły w świecie realnym, z prawdziwymi rozmowami i ćwiczeniami w grupach,
              przełożyliśmy na kurs dostępny dla Ciebie zawsze, kiedy tylko masz na to czas i ochotę lub kiedy naprawdę potrzebujesz
              szybko konkretnej i pewnej wiedzy.
            </p>
            <p>
              Kurs jest dla Was obojga. Wspólnie możecie oglądać wszystko, a w niektórych miejscach druga osoba ma swoje zadania.
              Dowiecie się, jak wspólnie ćwiczyć, na co zwracać uwagę, jak się spakować do szpitala i jak będzie w pierwszych
              miesiącach po powrocie do domu. Nauczycie się współpracować w domu i podczas samego rozwiązania.
            </p>
            <p>
              Dużo przydatnej, sprawdzonej wiedzy od profesjonalnych i doświadczonych ekspertek. Dodatkowo w Strefie Kursantki dajemy
              dużo dodatkowej cennej wiedzy, przydatnej każdej mamie. I to jest do Waszej dyspozycji w każdej chwili, na różnych
              urządzeniach i w jednej cenie.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
