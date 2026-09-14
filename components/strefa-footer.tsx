'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { ShieldCheck, PhoneCall, AlertTriangle, Mail, Heart, Sparkles, ExternalLink } from 'lucide-react';

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
                <span className="text-[10px] tracking-wider uppercase text-[#EAD5E5]/70 font-semibold">
                  Strefa Kursantki
                </span>
              </div>
            </div>
            <p className="text-xs text-[#D8C7D5]/80 leading-relaxed">
              Szkoła rodzenia oparta o 4 Filary Spokoju HappyBirth i 14 lat doświadczenia położnych Mama Gaja od 2012 roku. Dostęp dla dwojga przez 12 miesięcy od terminu porodu.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EC008C] font-semibold pt-1">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Jesteśmy z Tobą na każdym etapie</span>
            </div>
          </div>

          {/* Szybka Nawigacja Kursantki */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Nawigacja kursu</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/strefa" className="hover:text-white transition-colors">
                  Pulpit (9 Etapów ciąży i porodu)
                </Link>
              </li>
              <li>
                <Link href="/strefa/lekcje" className="hover:text-white transition-colors">
                  Pełny katalog 52 Lekcji VOD
                </Link>
              </li>
              <li>
                <Link href="/strefa/apteczka" className="hover:text-white transition-colors">
                  Cyfrowa Apteczka SOS
                </Link>
              </li>
              <li>
                <Link href="/strefa/partner" className="hover:text-white transition-colors">
                  Strefa dla Taty (Wsparcie w Porodzie)
                </Link>
              </li>
              <li>
                <Link href="/strefa/standard-medyczny" className="hover:text-white transition-colors flex items-center gap-1 text-[#EC008C] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Standard merytoryczny & E-E-A-T</span>
                </Link>
              </li>
              <li>
                <Link href="/strefa/licznik" className="hover:text-rose-400 font-medium transition-colors flex items-center gap-1">
                  <span>Licznik skurczów 5-1-1</span>
                  <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">SOS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Narzędzia i Materiały */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Materiały do druku</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#D8C7D5]/80 hover:text-white transition-colors cursor-pointer">
                  Plan Porodu (Standard MZ / 16 punktów)
                </span>
              </li>
              <li>
                <span className="text-[#D8C7D5]/80 hover:text-white transition-colors cursor-pointer">
                  Torba do szpitala w 3 strefach
                </span>
              </li>
              <li>
                <span className="text-[#D8C7D5]/80 hover:text-white transition-colors cursor-pointer">
                  Kalendarz badań (Standard Opieki Okołoporodowej)
                </span>
              </li>
              <li>
                <span className="text-[#D8C7D5]/80 hover:text-white transition-colors cursor-pointer">
                  Ściąga dla Taty na porodówkę
                </span>
              </li>
              <li>
                <span className="text-[#D8C7D5]/80 hover:text-white transition-colors cursor-pointer">
                  Certyfikat ukończenia szkoły rodzenia
                </span>
              </li>
            </ul>
          </div>

          {/* Pomoc techniczna i medyczna */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Wsparcie kursantki</h4>
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

        {/* Czerwone Flagi / Medical Alert */}
        <div className="mt-8 p-4 rounded-xl bg-[#2D0A14] border border-[#781B2B] text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold tracking-wide uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Kiedy nie oglądasz wideo, tylko natychmiast dzwonisz pod 112:</span>
          </div>
          <p className="text-[#F1D0D5] leading-relaxed">
            Krwawienie jasną krwią · odpływanie wód płodowych (zwłaszcza zielonych lub mętnych) · silny ból głowy z mroczkami przed oczami · nagłe, gwałtowne obrzęki twarzy i dłoni · brak wyczuwalnych ruchów dziecka przez 10 godzin · silny świąd dłoni i stóp w III trymestrze. <b>W każdej z tych sytuacji jedź natychmiast na Izbę Przyjęć lub wezwij karetkę pogotowia.</b>
          </p>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#D8C7D5]/60">
          <div>
            © {new Date().getFullYear()} HappyBirth. Wszelkie prawa zastrzeżone. Materiały edukacyjne zgodne ze Standardem Organizacyjnym Opieki Okołoporodowej (Rozporządzenie MZ).
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-white transition-colors cursor-pointer">Regulamin platformy</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Polityka prywatności (RODO)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
