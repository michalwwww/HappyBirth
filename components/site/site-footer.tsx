'use client';

// Wspólna stopka stron publicznych v3: jeden kolor, cały tekst i logo w bieli.
// Znak: logo, claim DOŚWIADCZENIE MAMY wersalikami i oś czasu jako część logo w białych kreskach,
// pod nim kolorowe znaki Instagrama, TikToka i Facebooka. Trzy kolumny odnośników, dane spółki w jednej linii.
import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { SHELL } from '@/lib/site-copy';
import { SocialLinks } from './social';
import { Logo } from './logo';

export function SiteFooter({ multilingual = false }: { multilingual?: boolean }) {
  const { lang } = useI18n();
  const t = SHELL[multilingual ? lang : 'pl'] || SHELL.pl;
  const f = t.footer;
  const l = f.linki;
  const [firma, email] = f.firma.split(' · kontakt@happybirth.pl');

  return (
    <footer className="hb-stopka">
      <div className="hb-wrap hb-wrap-szeroki">
        <div className="hb-stopka-g">
          <div className="hb-stopka-znak">
            <Link aria-label={`${t.homeLabel}. ${f.claim}`} className="hb-sygnet" href="/">
              <Logo />
              <span aria-hidden="true" className="hb-sygnet-claim">{f.claim}</span>
              <span aria-hidden="true" className="hb-wstega-mini"><i /><i /><i /><i /></span>
            </Link>
            <SocialLinks label={f.social} />
          </div>
          <div>
            <h2>{f.kolumny.kurs}</h2>
            <ul>
              <li><Link href="/program">{l.lekcje}</Link></li>
              <li><a href="/#bezplatna-lekcja">{l.bezplatna}</a></li>
              <li><Link href="/plan-porodu">{l.plan}</Link></li>
              <li><Link href="/kalkulator-wyprawki">{l.kalkulator}</Link></li>
              <li><a href="/strefa">{l.strefa}</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.kolumny.wspolpraca}</h2>
            <ul>
              <li><Link href="/o-nas">{l.oNas}</Link></li>
              <li><a href="https://afiliacja.happybirth.pl">{l.afiliacja}</a></li>
              <li><a href="https://partnerzy.happybirth.pl">{l.b2b}</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.kolumny.dokumenty}</h2>
            <ul>
              <li><Link href="/regulamin">{l.regulamin}</Link></li>
              <li><Link href="/polityka-prywatnosci">{l.prywatnosc}</Link></li>
              <li><Link href="/polityka-cookies">{l.cookies}</Link></li>
              <li><Link href="/odstap-od-umowy">{l.odstap}</Link></li>
            </ul>
          </div>
        </div>
        <p className="hb-dane">
          {firma}
          {email !== undefined && <> · <a href="mailto:kontakt@happybirth.pl">kontakt@happybirth.pl</a>{email}</>}
        </p>
        <p className="hb-stopka-uwaga">{f.uwaga}</p>
      </div>
    </footer>
  );
}
