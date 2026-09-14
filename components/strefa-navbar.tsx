'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { useCourseProgress } from '@/lib/progress';
import {
  Sparkles,
  Heart,
  User,
  AlertCircle,
  Play,
  Menu,
  X,
  BookOpen,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { lessons } from '@/lib/course-data';

export function StrefaNavbar() {
  const pathname = usePathname();
  const { role, changeRole, percentCompleted, completedLessons } = useCourseProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find next uncompleted lesson
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Luxury Announcement Ribbon (Ciemnofioletowy aksamit #250A24) */}
      <div className="bg-[#250A24] text-[#EAD5E5] border-b border-[#461643] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              Strefa Kursantki HappyBirth
            </span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-[#EAD5E5]/80 hidden md:inline">
              52 lekcje wideo w jakości Full HD · Dostęp aktywny: 12 msc od terminu porodu dla dwojga
            </span>
          </div>

          {/* Role switcher */}
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
                title="Widok dla partnera / taty na porodówce"
              >
                <User className="w-2.5 h-2.5" /> Dla Taty
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
                Gość
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Strefa Navbar */}
      <nav className="glass-nav border-b border-[#EAE3DB] bg-[#FBF8F4]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & Zone Badge */}
          <div className="flex items-center space-x-3.5">
            <Link href="/strefa" className="flex items-center space-x-3 group">
              <Logo className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" priority />
              <div className="flex flex-col border-l border-[#EAE3DB] pl-3 py-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-brand-display font-bold text-sm sm:text-base tracking-tight text-[#1A1512] leading-tight">
                    Szkoła Rodzenia
                  </span>
                  <span className="bg-[#EC008C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm shadow-[#EC008C]/20">
                    Strefa
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase text-[#867A72]">
                  panel edukacyjny vod
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-[14px] font-medium text-[#544A44]">
            <Link
              href="/strefa"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 ${
                pathname === '/strefa' || pathname === '/' ? 'border-[#EC008C] text-[#1A1512] font-semibold' : 'border-transparent'
              }`}
            >
              Pulpit (9 Etapów)
            </Link>
            <Link
              href="/strefa/lekcje"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/lekcj') ? 'border-[#EC008C] text-[#1A1512] font-semibold' : 'border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#EC008C]" />
              52 Lekcje VOD
            </Link>
            <Link
              href="/strefa/apteczka"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/apteczka') ? 'border-[#EC008C] text-[#1A1512] font-semibold' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#EC008C]" />
              Cyfrowa Apteczka SOS
            </Link>
            <Link
              href="/strefa/partner"
              className={`hover:text-[#1A1512] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/partner') ? 'border-[#98269C] text-[#98269C] font-semibold' : 'border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-[#98269C]" />
              Strefa dla Taty
            </Link>
            <Link
              href="/strefa/licznik"
              className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 font-bold text-rose-600 ${
                pathname.includes('/licznik') ? 'border-rose-500' : 'border-transparent hover:text-rose-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              Licznik 5-1-1
            </Link>
          </div>

          {/* Right Section: Progress & Next Lesson CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[11px] font-bold text-[#1A1512]">
                  {completedLessons.length}/52 ukończonych
                </span>
                <span className="text-[11px] font-mono font-bold text-[#EC008C]">
                  ({percentCompleted}%)
                </span>
              </div>
              <div className="w-32 bg-[#EAE3DB] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-[#EC008C] to-[#98269C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <Link
              href={`/strefa/lekcja/${nextLesson.id}`}
              className="inline-flex items-center space-x-1.5 bg-[#EC008C] hover:bg-[#D0007A] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm shadow-[#EC008C]/25 hover:shadow-md group"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#FCD705] group-hover:scale-110 transition-transform" />
              <span>Następna lekcja</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#544A44] hover:text-[#1A1512] rounded-lg border border-[#EAE3DB] bg-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE3DB] bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            {/* Progress Bar Mobile */}
            <div className="p-3 bg-[#FBF8F4] rounded-xl border border-[#EAE3DB] space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Twój postęp w kursie:</span>
                <span className="text-[#EC008C] font-mono">{completedLessons.length} z 52 ({percentCompleted}%)</span>
              </div>
              <div className="w-full bg-[#EAE3DB] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#EC008C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 pt-1 text-sm font-medium">
              <Link
                href="/strefa"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname === '/strefa' ? 'bg-[#FAE3EB] text-[#EC008C] font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <span>Pulpit (9 Etapów)</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/lekcje"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/lekcj') ? 'bg-[#FAE3EB] text-[#EC008C] font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#EC008C]" />
                  <span>52 Lekcje VOD</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/apteczka"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/apteczka') ? 'bg-[#FAE3EB] text-[#EC008C] font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EC008C]" />
                  <span>Cyfrowa Apteczka SOS</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/partner"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/partner') ? 'bg-[#EAD5E5] text-[#98269C] font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#98269C]" />
                  <span>Strefa dla Taty</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/licznik"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg flex items-center justify-between bg-rose-50 text-rose-700 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Licznik skurczów 5-1-1</span>
                </div>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">SOS</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#EAE3DB]">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-[#EC008C] hover:bg-[#D0007A] text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-[#EC008C]/25 transition-all"
              >
                <Play className="w-4 h-4 text-[#FCD705] fill-current" />
                <span>Przejdź do: Lekcja {nextLesson.lessonNumber}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
