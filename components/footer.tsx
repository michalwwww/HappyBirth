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
              Nowoczesna szkoła rodzenia dla przyszłych mam i osób towarzyszących. 52 filmowe lekcje wideo, cztery filary spokoju i wsparcie przez cały pierwszy rok życia dziecka.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#EAD5E5]/90 pt-1">
              <Sparkles className="w-4 h-4 text-[#FCD705]" />
              <span>Doświadczenie ponad 18 000 mam od 2012 roku</span>
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
                  9 Etapów ciąży i porodu
                </a>
              </li>
              <li>
                <a href="#narzedzia" className="hover:text-white transition-colors">
                  Licznik skurczów 5-1-1
                </a>
              </li>
              <li>
                <a href="#cena" className="hover:text-white transition-colors">
                  Cennik i gwarancja dostępu
                </a>
              </li>
              <li>
                <a href={strefaUrl} className="hover:text-[#EC008C] transition-colors font-medium">
                  Wejdź do Strefy Kursantki
                </a>
              </li>
              <li>
                <a href={`${strefaUrl}/standard-medyczny`} className="hover:text-white transition-colors">
                  Standard opieki & E-E-A-T
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

        {/* Notatka odpowiedzialności */}
        <div className="pt-6 border-t border-[#461643] text-xs text-[#EAD5E5]/60 space-y-2">
          <p>
            <strong className="text-white">Materiały na platformie mają charakter edukacyjny i wspierający.</strong> Służą przygotowaniu do aktywnego, świadomego porodu w oparciu o 4 Filary Spokoju i dorobek położnych Mama Gaja od 2012 roku. Nie zastępują indywidualnej opieki położnej ani lekarza prowadzącego ciążę. <a href={`${strefaUrl}/standard-medyczny`} className="underline hover:text-white transition-colors">Zobacz Standard Merytoryczny & E-E-A-T</a>.
          </p>
          <p className="text-[11px] text-[#EAD5E5]/40 pt-2">
            © {new Date().getFullYear()} HappyBirth. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
