'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { ShieldCheck, Heart, ArrowUpRight, Sparkles, Users } from 'lucide-react';

export function Footer() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const partnerzyUrl = isDev ? '/partnerzy' : 'https://partnerzy.happybirth.pl';
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';

  return (
    <footer className="bg-[#20071F] text-[#EAD5E5] border-t border-[#461643] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Kolumna 1: Brand & Misja */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white/95 rounded-xl inline-block shadow-sm">
                <Logo className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-brand-display font-bold text-xl tracking-tight text-white leading-none">
                  HAPPYBIRTH
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#EC008C] tracking-wider mt-0.5">
                  szkoła rodzenia online
                </span>
              </div>
            </div>
            <p className="text-xs text-[#EAD5E5]/75 leading-relaxed">
              Czuła szkoła rodzenia online dla naszych mam i ojców. 52 filmowe lekcje wideo, sprawdzone patenty i wsparcie przez cały pierwszy rok życia dziecka.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#EAD5E5]/90 pt-1">
              <Sparkles className="w-4 h-4 text-[#FCD705]" />
              <span>Ponad 18 000 przygotowanych rodzin</span>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3 text-xs">
              <a
                href="https://instagram.com/happybirth.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#EC008C] text-white transition-all font-medium"
              >
                <span>Instagram @happybirth.pl</span>
              </a>
              <a
                href="https://tiktok.com/@happybirth_pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all font-medium"
              >
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Kolumna 2: Nawigacja Kursu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Odkryj HappyBirth
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a href="#filary" className="hover:text-white transition-colors">
                  4 Filary Spokoju
                </a>
              </li>
              <li>
                <a href="#etapy" className="hover:text-white transition-colors">
                  9 Etapów rodzicielstwa
                </a>
              </li>
              <li>
                <a href="#narzedzia" className="hover:text-white transition-colors">
                  Przewodnik & Notatnik Rodzica
                </a>
              </li>
              <li>
                <a href="#cena" className="hover:text-white transition-colors">
                  Cennik i gwarancja dostępu
                </a>
              </li>
              <li>
                <a href={strefaUrl} className="hover:text-[#EC008C] transition-colors font-medium">
                  Wejdź do Strefy Rodziców
                </a>
              </li>
              <li>
                <a href={`${strefaUrl}/standard-medyczny`} className="hover:text-white transition-colors">
                  Standard Rzetelnej Wiedzy
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Współpraca B2B & Afiliacja */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dla Profesjonalistów
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a
                  href={partnerzyUrl}
                  className="hover:text-[#EC008C] transition-colors flex items-center gap-1 font-semibold text-white"
                >
                  <Users className="w-3.5 h-3.5 text-[#EC008C]" />
                  <span>Strefa Partnera (Program Afiliacyjny)</span>
                  <ArrowUpRight className="w-3 h-3 text-[#EC008C]" />
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Dla Położnych i Praktyk
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Dla Gabinetów i Fizjoterapeutek
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Zamów bezpłatne materiały z kodem QR
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 4: Kontakt */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kontakt i pomoc
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a href="mailto:kontakt@happybirth.pl" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>kontakt@happybirth.pl</span>
                  <ArrowUpRight className="w-3 h-3 text-[#EC008C]" />
                </a>
              </li>
              <li>
                <span className="text-[#EAD5E5]/60">Dostęp aktywny 24/7 na telefonie i TV</span>
              </li>
              <li>
                <span className="text-[#EAD5E5]/60">Płatność jednorazowa BLIK / Karta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Notatka odpowiedzialności i dane prawne */}
        <div className="pt-6 border-t border-[#461643] text-xs text-[#EAD5E5]/60 space-y-3">
          <p>
            <strong className="text-white">Charakter edukacyjny platformy (E-learning):</strong> HappyBirth jest internetową platformą edukacyjną świadczącą usługi szkoleniowe w formule kursu wideo VOD. Wszystkie materiały, narzędzia oraz wskazówki mają wyłącznie charakter edukacyjny i przygotowawczy do roli rodzica. Usługa nie stanowi i nie zastępuje indywidualnych świadczeń zdrowotnych, diagnostyki ani porady lekarskiej.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] text-[#EAD5E5]/50 border-t border-[#461643]/50">
            <div>
              <span>Usługodawca: <strong>KLARSolutions sp. z o.o. (w organizacji)</strong>, ul. Śląska 14, 60-614 Poznań · © {new Date().getFullYear()} HappyBirth.</span>
            </div>
            <div className="flex items-center space-x-3 text-[#EAD5E5]/80">
              <Link href="/regulamin" className="hover:text-white transition-colors underline">
                Regulamin platformy
              </Link>
              <span>·</span>
              <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors underline">
                Polityka prywatności (RODO)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
