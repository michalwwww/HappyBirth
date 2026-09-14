'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { ArrowRight, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export function MarketingNavbar() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner w szlachetnym ciemnym fiolecie */}
      <div className="bg-[#250A24] text-[#EAD5E5] border-b border-[#461643] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
            <span className="font-semibold text-white">Gwarancja dostępu:</span>
            <span className="text-[#EAD5E5]/80">
              12 miesięcy od przewidywanego terminu porodu dla dwojga
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-[#EAD5E5]/60 hidden sm:inline">Masz już dostęp?</span>
            <a
              href={strefaUrl}
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#EC008C] transition-colors"
            >
              <LogIn className="w-3 h-3 text-[#EC008C]" />
              <span>Zaloguj do Strefy Kursantki</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="glass-nav border-b border-[#EAE3DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/marketing" className="flex items-center space-x-3.5 group">
            <Logo className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" priority />
            <div className="hidden sm:flex flex-col border-l border-[#EAE3DB] pl-3 py-0.5">
              <span className="font-brand-display font-bold text-base tracking-tight text-[#1A1512] leading-tight">
                Szkoła Rodzenia
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#867A72]">
                online dla dwojga
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-[15px] font-medium text-[#544A44]">
            <a href="#mapa" className="hover:text-[#1A1512] transition-colors">
              Mapa kursu
            </a>
            <a href="#etapy" className="hover:text-[#1A1512] transition-colors">
              9 Etapów
            </a>
            <a href="#program" className="hover:text-[#1A1512] transition-colors">
              Program
            </a>
            <a href="#zespol" className="hover:text-[#1A1512] transition-colors">
              Położne
            </a>
            <a href="#narzedzia" className="hover:text-[#1A1512] transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#EC008C]" />
              Za darmo
            </a>
            <a href="#cena" className="hover:text-[#1A1512] transition-colors">
              Cena 349 zł
            </a>
            <a href="#faq" className="hover:text-[#1A1512] transition-colors">
              Pytania
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={strefaUrl}
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-[#544A44] hover:text-[#EC008C] px-3 py-2 transition-colors"
            >
              <span>Strefa Kursantki</span>
            </a>

            <Link
              href="/marketing#cennik"
              className="inline-flex items-center space-x-2 bg-[#250A24] hover:bg-[#EC008C] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span>Dołącz do kursu · 349 zł</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
