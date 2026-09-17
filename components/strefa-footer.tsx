'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { RedFlag } from './red-flag';
import { ShieldCheck, PhoneCall, AlertTriangle, Mail, Heart, Sparkles, ExternalLink, FileText } from 'lucide-react';

export function StrefaFooter() {
  return (
    <footer className="bg-[#20071F] text-[#D8C7D5] border-t border-[#461643] mt-20 pt-14 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#461643]/70">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-auto object-contain brightness-125" />
              <div className="flex flex-col">
                <span className="font-brand-display font-bold text-white tracking-tight leading-tight">
                  HappyBirth
                </span>
                <span className="text-[10px] tracking-wider uppercase text-[#EC008C] font-semibold">
                  Strefa Rodziców
                </span>
              </div>
            </div>
            <p className="text-xs text-[#D8C7D5]/80 leading-relaxed">
              Szkoła rodzenia oparta o 4 Filary Spokoju HappyBirth. Dostęp dla dwojga przez 12 miesięcy od terminu porodu.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EC008C] font-semibold pt-1">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Dla naszych Mam, Ojców i Maluszków</span>
            </div>
            <div className="pt-2">
              <a
                href="https://instagram.com/happybirth.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#EC008C] text-white text-xs transition-all font-medium"
              >
                <span>Instagram @happybirth.pl</span>
              </a>
            </div>
          </div>

          {/* Nawigacja dla Rodziców */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Nawigacja Strefy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/strefa" className="hover:text-white transition-colors">
                  Kokpit (9 Etapów ciąży i porodu)
                </Link>
              </li>
              <li>
                <Link href="/strefa/lekcje" className="hover:text-white transition-colors">
                  Pełny katalog 52 Lekcji VOD
                </Link>
              </li>
              <li>
                <Link href="/strefa/partner" className="hover:text-white transition-colors">
                  Strefa dla Taty (Wsparcie w Porodzie)
                </Link>
              </li>
              <li>
                <Link href="/strefa/plan-porodu" className="hover:text-[#EC008C] font-medium transition-colors flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#EC008C]" />
                  <span>Kreator Planu Porodu</span>
                  <span className="text-[9px] bg-[#EC008C] text-white px-1.5 py-0.2 rounded font-bold">PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/strefa/standard-medyczny" className="hover:text-white transition-colors flex items-center gap-1 text-[#EAD5E5]/70">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Standard merytoryczny & E-E-A-T</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Narzędzia i Materiały */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Narzędzia HappyBirth</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/strefa/plan-porodu" className="text-[#D8C7D5]/80 hover:text-white transition-colors">
                  Plan Porodu (do druku PDF)
                </Link>
              </li>
              <li>
                <Link href="/strefa/apteczka" className="text-[#D8C7D5]/80 hover:text-white transition-colors">
                  Cyfrowa Apteczka SOS
                </Link>
              </li>
              <li>
                <Link href="/strefa/partner" className="text-[#D8C7D5]/80 hover:text-white transition-colors">
                  Ściągi dla Taty na porodówkę
                </Link>
              </li>
            </ul>
          </div>

          {/* Pomoc techniczna i kontakt */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Wsparcie dla Rodziców</h4>
            <p className="text-xs text-[#D8C7D5]/80">
              Masz problem z odtwarzaniem lub dostępem? Napisz do naszego opiekuna technicznego:
            </p>
            <a
              href="mailto:pomoc@happybirth.pl"
              className="inline-flex items-center gap-1.5 text-xs text-white bg-[#370E35] hover:bg-[#EC008C] px-3.5 py-2 rounded-lg border border-[#5E1E5A] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#EC008C]" />
              <span className="font-semibold">pomoc@happybirth.pl</span>
            </a>
            <div className="pt-2 text-[11px] text-[#D8C7D5]/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Prywatność medyczna: brak pikseli reklamowych w portalu</span>
            </div>
          </div>
        </div>

        {/* Moduł red flag: stała forma (components/red-flag.tsx), bez ilustracji i koloru etapu */}
        <div className="mt-8">
          <RedFlag
            title="Kiedy nie oglądasz lekcji, tylko dzwonisz pod 112"
            items={[
              'Krwawienie jasną krwią',
              'Odpływanie wód płodowych, zwłaszcza zielonych lub mętnych',
              'Silny ból głowy z mroczkami przed oczami',
              'Nagłe, gwałtowne obrzęki twarzy i dłoni',
              'Brak wyczuwalnych ruchów dziecka przez 10 godzin',
              'Silny świąd dłoni i stóp w trzecim trymestrze',
            ]}
            footer="W każdej z tych sytuacji jedź natychmiast na izbę przyjęć albo wezwij pogotowie (112 lub 999)."
          />
        </div>

        {/* Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#D8C7D5]/60">
          <div>
            Usługodawca: <strong>KLARSolutions sp. z o.o. (w organizacji)</strong>, ul. Śląska 14, 60-614 Poznań · © {new Date().getFullYear()} HappyBirth. Materiały edukacyjne zgodne ze Standardem MZ.
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://happybirth.pl/regulamin" className="hover:text-white transition-colors underline">
              Regulamin platformy
            </a>
            <span>·</span>
            <a href="https://happybirth.pl/polityka-prywatnosci" className="hover:text-white transition-colors underline">
              Polityka prywatności (RODO)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
