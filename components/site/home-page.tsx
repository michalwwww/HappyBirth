'use client';

// Strona główna v3 po poprawkach z 04.11.2026. Kolejność: hero z karuzelą, oś czasu (liczby przeniesione na O nas),
// przykładowy bezpłatny odcinek (cel odnośnika w stopce), zakup, pytania, stopka.
// Bez pasa „Cały program w jednej cenie” i z mniejszymi odstępami między sekcjami.
// Teksty w trzech językach z lib/site-copy.ts.
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { HOME } from '@/lib/site-copy';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { HeroCarousel } from './hero-carousel';
import { StageMap } from './stage-map';
import { Trailer } from './trailer';
import { PriceSection } from './price-section';
import { Faq } from './faq';

export function HomePage() {
  const { lang } = useI18n();
  const t = HOME[lang] || HOME.pl;

  return (
    <div className="hb-site">
      <SiteHeader multilingual />
      <main id="tresc">
        <HeroCarousel t={t.hero} />

        <section aria-labelledby="mapa-tyt" className="hb-sek hb-sek-mapa" id="mapa">
          <div className="hb-wrap hb-wrap-szeroki">
            <StageMap t={t.mapa} />
          </div>
        </section>

        <section aria-labelledby="lekcja-tyt" className="hb-sek hb-papier" id="bezplatna-lekcja">
          <div className="hb-wrap hb-lekcja-uklad">
            <Trailer etykieta={t.lekcja.odtworz} tytul={t.lekcja.tytulWideo} />
            <div className="hb-lekcja-tekst">
              <h2 className="hb-h3" id="lekcja-tyt">{t.lekcja.tytul}</h2>
              <p className="hb-lekcja-lead">{t.lekcja.lead}</p>
              <ul className="hb-lekcja-punkty">
                {t.lekcja.punkty.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="cena-tyt" className="hb-sek" id="cena">
          <div className="hb-wrap">
            <h2 className="hb-sr" id="cena-tyt">{t.cena.naglowek}</h2>
            <PriceSection lang={lang} t={t.cena} />
          </div>
        </section>

        <section aria-labelledby="pytania-tyt" className="hb-sek hb-papier" id="pytania">
          <div className="hb-wrap hb-pytania">
            <h2 className="hb-pytania-tyt" id="pytania-tyt">{t.faq.tytul}</h2>
            <p className="hb-pytania-lead">
              {t.faq.leadPrzed}<a href="mailto:kontakt@happybirth.pl">kontakt@happybirth.pl</a>{t.faq.leadPo}
            </p>
            <Faq items={t.faq.items} />
          </div>
        </section>
      </main>
      <SiteFooter multilingual />
    </div>
  );
}
