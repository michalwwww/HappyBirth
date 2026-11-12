import type { Metadata } from 'next';
import { PageShell, Okruszki } from '@/components/site/page-shell';
import { ProgramExplorer } from '@/components/site/program-explorer';
import { ZwiastunHero } from '@/components/site/trailer';

// Program v3: przykładowa lekcja na górze (docelowo zwiastun z najlepszych fragmentów lekcji),
// potem sylabus 52 lekcji z wyszukiwarką, filtrem pasm, rozwijanymi modułami i przyciskami Odtwórz,
// które prowadzą do konkretnego filmu w strefie kursu. Tytuły publiczne z program.json strony v1.
// Poprawki z 13.10.2026: bez etykiety z kropkami, bez podpisu pod wideo, bez żółtej ramki
// (komunikat medyczny stoi w fioletowym pasku stopki).
// Poprawki z 04.11.2026: grupy jak obszary osi czasu, sam znak play, bez etykiet modułów,
// na dole przycisk CAŁY PROGRAM W JEDNEJ CENIE (bez kwoty), jak przycisk na stronie Wiedza.
// Runda X1 (05.11.2026): hero to powiększony zwiastun z tytułem „52 lekcje / w 8 modułach”, leadem
// i samym przyciskiem PLAY (tekst znika po uruchomieniu filmu); na dole DOŁĄCZ DO NAS JUŻ DZISIAJ.

export const metadata: Metadata = {
  title: 'Program kursu: 52 lekcje w 8 modułach · HappyBirth',
  description:
    'Pełna lista 52 lekcji szkoły rodzenia online HappyBirth z czasem trwania: ciąża, poród, połóg, noworodek i karmienie. Prawie 5 godzin materiału wideo.',
  alternates: { canonical: 'https://happybirth.pl/program' },
};

export default function ProgramPage() {
  return (
    <PageShell active="program">
      <ZwiastunHero
        d1="52 lekcje"
        d2="w 8 modułach"
        etykieta="Odtwórz zwiastun kursu"
        id="program-tyt"
        lead={
          <>
            <span>Prawie 5 godzin materiału wideo. Lekcje nagraliśmy z dyplomowanymi ekspertkami. </span>
            <span>Moduły ułożone są w kolejności od pierwszego dnia ciąży do pierwszych urodzin dziecka, a oglądać możecie je w dowolnej kolejności.</span>
          </>
        }
        okruszki={<Okruszki biezaca="Program" />}
        tytulWideo="Zwiastun kursu HappyBirth"
      />

      <section aria-label="Spis lekcji" className="hb-sek hb-papier hb-sek-program">
        <div className="hb-wrap">
          <ProgramExplorer />
          {/* na końcu listy przycisk bez ceny, prowadzi do przycisku zakupu na stronie głównej */}
          <div className="hb-cta-srodek">
            <a className="hb-btn hb-btn-kup hb-duzy" href="/#kup">Dołącz do nas już dzisiaj</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
