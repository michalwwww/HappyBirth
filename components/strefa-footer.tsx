'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Mail, Heart, FileText } from 'lucide-react';
import { Logo } from '@/components/site/logo';

// Wygląd dopasowany do stopki strony v3: papier, wstęga czterech pasm, nagłówki kolumn
// drukowanymi, pas prawny w kolorze nocy. Teksty strefy bez zmian.
const LINK = 'text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] font-semibold hover:underline underline-offset-4 transition-colors';
const NAGLOWEK = 'font-sans text-[12px] font-extrabold uppercase tracking-[.15em] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]';

export function StrefaFooter() {
  return (
    <footer className="relative mt-20 font-sans transition-colors">
      <div className="bg-[color:var(--hb-papier)] dark:bg-[color:var(--hb-papier)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
            {/* Marka i opis */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                {/* logo w kolorach palety (runda X1); nazwa stoi obok tekstem, więc znak jest ozdobą */}
                <Logo className="hb-strefa-logo-stopka" />
                <div className="flex flex-col">
                  <span className="font-brand-display font-bold tracking-tight leading-tight text-xl">
                    HappyBirth
                  </span>
                  <span className="text-[10px] tracking-[.14em] uppercase text-[color:var(--hb-roz)] dark:text-[color:var(--hb-mag-t)] font-extrabold">
                    Strefa Rodziców
                  </span>
                </div>
              </div>
              <div className="hb-wstega-mini" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <p className="text-[13px] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] leading-relaxed">
                Szkoła rodzenia oparta o 4 Filary Spokoju HappyBirth. Dostęp dla dwojga przez 18 miesięcy (548 dni) od momentu zakupu.
              </p>
              <div className="flex items-center gap-2 text-[13px] text-[color:var(--hb-roz)] dark:text-[color:var(--hb-mag-t)] font-bold pt-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Dla naszych Mam, Ojców i Maluszków</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://instagram.com/happybirth.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] hover:border-[color:var(--hb-ink3)] text-[13px] font-bold transition-colors"
                >
                  <span>Instagram @happybirth.pl</span>
                </a>
              </div>
            </div>

            {/* Nawigacja dla Rodziców */}
            <div className="space-y-3.5">
              <h4 className={NAGLOWEK}>Nawigacja Strefy</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/strefa" className={LINK}>
                    Kokpit (8 Modułów ciąży, porodu i połogu)
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/lekcje" className={LINK}>
                    Pełny katalog 52 Lekcji VOD
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/partner" className={LINK}>
                    Strefa dla Taty (Wsparcie w Porodzie)
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/wiedza" className={LINK}>
                    Wiedza: prawa i standard opieki
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/plan-porodu" className={`${LINK} inline-flex items-center gap-1.5`}>
                    <FileText className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]" />
                    <span>Kreator Planu Porodu</span>
                    <span className="text-[9px] bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] px-1.5 py-0.5 rounded-full font-extrabold tracking-[.08em]">PDF</span>
                  </Link>
                </li>
                <li>
                  <Link href="/standard-merytoryczny" className={`${LINK} inline-flex items-center gap-1.5`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Standard merytoryczny & E-E-A-T</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Narzędzia i Materiały */}
            <div className="space-y-3.5">
              <h4 className={NAGLOWEK}>Narzędzia HappyBirth</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/strefa/plan-porodu" className={LINK}>
                    Plan Porodu (do druku PDF)
                  </Link>
                </li>
                <li>
                  <Link href="/kalkulator-wyprawki" className={LINK}>
                    Kalkulator Torby do Szpitala (PDF)
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/apteczka" className={LINK}>
                    Cyfrowa Apteczka SOS
                  </Link>
                </li>
                <li>
                  <Link href="/strefa/partner" className={LINK}>
                    Ściągi dla Taty na porodówkę
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pomoc techniczna i kontakt */}
            <div className="space-y-3.5">
              <h4 className={NAGLOWEK}>Wsparcie dla Rodziców</h4>
              <p className="text-[13px] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                Masz problem z odtwarzaniem lub dostępem? Napisz do naszego opiekuna technicznego:
              </p>
              <a
                href="mailto:pomoc@happybirth.pl"
                className="inline-flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-2xl border-[1.5px] border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] hover:border-[color:var(--hb-ink3)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]" />
                <span>pomoc@happybirth.pl</span>
              </a>
              <div className="pt-2 text-[12px] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
                <span>Prywatność medyczna: brak pikseli reklamowych w portalu</span>
              </div>
            </div>
          </div>

          {/* Czerwone Flagi / Medical Alert */}
          <div className="mt-8 p-5 rounded-2xl bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] border-[1.5px] border-[color:var(--hb-p1t)] dark:border-[color:var(--hb-p1t)] text-[13px] space-y-2">
            <div className="flex items-center gap-2 text-[color:var(--hb-roz)] dark:text-[color:var(--hb-mag-t)] font-extrabold tracking-[.06em] uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Kiedy nie oglądasz wideo, tylko natychmiast dzwonisz pod 112:</span>
            </div>
            <p className="text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] leading-relaxed">
              Krwawienie jasną krwią · odpływanie wód płodowych (zwłaszcza zielonych lub mętnych) · silny ból głowy z mroczkami przed oczami · nagłe, gwałtowne obrzęki twarzy i dłoni · brak wyczuwalnych ruchów dziecka przez 10 godzin · silny świąd dłoni i stóp w III trymestrze. <b>W każdej z tych sytuacji jedź natychmiast na Izbę Przyjęć lub wezwij karetkę pogotowia.</b>
            </p>
          </div>
        </div>
      </div>

      {/* Pas prawny */}
      <div className="bg-[color:var(--hb-noc)] dark:bg-[color:var(--hb-noc3)] text-white/85 px-4 sm:px-6 py-5">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px]">
          <div className="space-y-1">
            <div>
              Usługodawca: <strong className="text-white">KLARSOLUTIONS Sp. z o.o.</strong> · ul. Śląska 14, 60-614 Poznań · KRS: <strong className="text-white">0001268396</strong> · NIP: <strong className="text-white">7812118273</strong> · REGON: <strong className="text-white">545782779</strong> · Kapitał: 5 000,00 zł.
            </div>
            <div className="text-[10.5px] text-white/70">
              Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, VIII Wydz. Gospodarczy KRS · © {new Date().getFullYear()} HappyBirth. Materiały edukacyjne zgodne ze Standardem MZ.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
            <Link href="/regulamin" className="text-white hover:text-[color:var(--hb-p1t)] transition-colors underline underline-offset-4">
              Regulamin platformy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/polityka-prywatnosci" className="text-white hover:text-[color:var(--hb-p1t)] transition-colors underline underline-offset-4">
              Polityka prywatności (RODO)
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/odstap-od-umowy" className="text-[color:var(--hb-zol)] hover:text-white font-semibold transition-colors underline underline-offset-4">
              Odstąp od umowy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
