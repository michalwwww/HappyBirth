'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { useCourseProgress } from '@/lib/progress';
import { Sparkles, Heart, User, AlertCircle, ArrowRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { role, changeRole, percentCompleted, completedLessons } = useCourseProgress();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Luxury Announcement Ribbon (Ciemnofioletowy / Purpurowy aksamit) */}
      <div className="bg-[#250A24] text-[#EAD5E5] border-b border-[#461643] px-4 py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
            <span className="font-semibold text-white/95 tracking-wide">
              strefa.happybirth.pl
            </span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-[#EAD5E5]/80 hidden md:inline">
              52 lekcje wideo VOD w jakości 4K · 12 msc od terminu porodu dla dwojga
            </span>
          </div>

          {/* Subtelny przełącznik profilu w tonacji purpurowej */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-[#EAD5E5]/60 hidden sm:inline">Tryb widoku:</span>
            <div className="inline-flex rounded-full bg-[#180517] p-0.5 border border-[#461643]">
              <button
                onClick={() => changeRole('student')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-medium ${
                  role === 'student'
                    ? 'bg-[#EC008C] text-white shadow-sm'
                    : 'text-[#EAD5E5]/70 hover:text-white'
                }`}
                title="Widok zalogowanej kursantki"
              >
                <Heart className="w-2.5 h-2.5" /> Kursantka
              </button>
              <button
                onClick={() => changeRole('partner')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-medium ${
                  role === 'partner'
                    ? 'bg-[#98269C] text-white shadow-sm'
                    : 'text-[#EAD5E5]/70 hover:text-white'
                }`}
                title="Widok dla partnera / taty"
              >
                <User className="w-2.5 h-2.5" /> Partner
              </button>
              <button
                onClick={() => changeRole('guest')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-medium ${
                  role === 'guest'
                    ? 'bg-[#b45309] text-white shadow-sm'
                    : 'text-[#EAD5E5]/70 hover:text-white'
                }`}
                title="Widok przed zakupem"
              >
                Gość (Zakup)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Główny pasek nawigacyjny z Netlify: ciepłe tło paper #FBF8F4, border #EAE3DB */}
      <nav className="glass-nav border-b border-[#EAE3DB] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3.5 group">
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

          {/* Linki nawigacyjne (Styl Netlify: czyste fonty, hover z podkreśleniem #EC008C) */}
          <div className="hidden md:flex items-center space-x-7 text-[15px] font-medium text-[#544A44]">
            <Link
              href="/#etapy"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 ${
                pathname === '/#etapy' ? 'border-[#EC008C] text-[#1A1512]' : 'border-transparent'
              }`}
            >
              9 Etapów
            </Link>
            <Link
              href="/lekcje"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 ${
                pathname.startsWith('/lekcj') ? 'border-[#EC008C] text-[#1A1512]' : 'border-transparent'
              }`}
            >
              52 Lekcje VOD
            </Link>
            <Link
              href="/apteczka"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname === '/apteczka' ? 'border-[#EC008C] text-[#1A1512]' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EC008C]" />
              Cyfrowa Apteczka
            </Link>
            <Link
              href="/partner"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 ${
                pathname === '/partner' ? 'border-[#EC008C] text-[#1A1512]' : 'border-transparent'
              }`}
            >
              Dla Partnera
            </Link>
            <Link
              href="/licznik"
              className={`hover:text-rose-600 transition-colors py-1 border-b-2 flex items-center gap-1 font-semibold text-rose-600 ${
                pathname === '/licznik' ? 'border-rose-500' : 'border-transparent'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              Licznik 5-1-1
            </Link>
          </div>

          {/* Prawa strona: status kursantki lub przycisk dołączenia */}
          <div className="flex items-center space-x-3">
            {role !== 'guest' ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#1A1512]">
                    {completedLessons.length} z 52 ukończonych
                  </span>
                  <div className="w-28 bg-[#EAE3DB] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#EC008C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentCompleted}%` }}
                    />
                  </div>
                </div>

                <Link
                  href="/lekcja/lekcja-01"
                  className="inline-flex items-center space-x-1.5 bg-[#EC008C] hover:bg-[#D0007A] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 hover:shadow-lg"
                >
                  <span>Strefa VOD</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/#cennik"
                  className="inline-flex items-center space-x-1.5 bg-[#EC008C] hover:bg-[#D0007A] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 hover:shadow-lg"
                >
                  <span>Dołącz · 349 zł</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
