'use client';

import React, { useState, useEffect } from 'react';
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
  FileText,
} from 'lucide-react';
import { lessons } from '@/lib/course-data';

import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

export function StrefaNavbar() {
  const pathname = usePathname();
  const { role, changeRole, percentCompleted, completedLessons } = useCourseProgress();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; hasActiveCourse: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          if (data.user.role && !localStorage.getItem('hb_current_role')) {
            changeRole(data.user.role as any);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Find next uncompleted lesson
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0];

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Top Luxury Announcement Ribbon (Głęboki fiolet #20071E / dark #0F020E zgodny z landing page) */}
      <div className="bg-[#20071E] dark:bg-[#0F020E] text-[#EAD5E5] border-b border-[#461643] dark:border-[#3D0E39] px-3 sm:px-4 py-1.5 sm:py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#DA0271] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide whitespace-nowrap">
              {t('brandTitle')}
            </span>
            <span className="text-[#EAD5E5]/40 hidden xl:inline">|</span>
            <span className="text-[#EAD5E5]/80 hidden xl:inline truncate max-w-md">
              {t('ribbonSubtitle')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Przełącznik języków z flagami PL / EN / RU */}
            <LanguageSwitcher />

            {/* Przełącznik Motywu Light / Dark */}
            <ThemeToggle />

            {/* Zbalansowany przełącznik perspektywy: Dla Mamy / Dla Taty */}
            <div className="flex items-center space-x-1.5 text-[11px] border-l border-[#521D50] pl-2">
              <span className="text-[#EAD5E5]/70 hidden md:inline">{t('viewMode')}</span>
              <div className="inline-flex rounded-full bg-[#350F33] dark:bg-[#1C081A] p-0.5 border border-[#521D50] dark:border-[#3D0E39]">
                <button
                  onClick={() => changeRole('student')}
                  className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-semibold whitespace-nowrap ${
                    role === 'student'
                      ? 'bg-[#DA0271] text-white shadow-sm'
                      : 'text-[#EAD5E5]/80 hover:text-white'
                  }`}
                  title="Widok dla Mamy"
                >
                  <Heart className="w-2.5 h-2.5" /> {t('roleStudent')}
                </button>
                <button
                  onClick={() => changeRole('partner')}
                  className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-semibold whitespace-nowrap ${
                    role === 'partner'
                      ? 'bg-[#7FB3CC] text-[#120311] shadow-sm'
                      : 'text-[#EAD5E5]/80 hover:text-white'
                  }`}
                  title="Widok dla Taty"
                >
                  <User className="w-2.5 h-2.5" /> {t('rolePartner')}
                </button>
              </div>
            </div>

            {/* Stan konta / Wyloguj */}
            <div className="flex items-center space-x-2 border-l border-[#521D50] pl-2.5 text-[11px]">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#EAD5E5]/80 hidden lg:inline truncate max-w-[110px]">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={() => {
                      fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                        window.location.href = '/strefa/login';
                      });
                    }}
                    className="text-rose-300 hover:text-rose-200 flex items-center gap-1 font-semibold"
                    title={t('btnLogout')}
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('btnLogout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/strefa/login"
                  className="text-[#FCD705] hover:underline font-semibold whitespace-nowrap"
                >
                  {t('btnLogin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Strefa Navbar */}
      <nav className="border-b border-[#EAE3DB] dark:border-[#3D0E39] bg-[#FBF8F4]/95 dark:bg-[#120311]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Logo & Zone Badge */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <Link href="/strefa" className="flex items-center space-x-3 group">
              <Logo className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform" priority />
              <div className="flex flex-col border-l border-[#EAE3DB] dark:border-[#3D0E39] pl-2.5 py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm sm:text-base tracking-tight text-[#250A24] dark:text-[#FBF8F4] leading-tight">
                    {t('schoolTitle')}
                  </span>
                  <span className="bg-[#DA0271] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
                    {t('vodZone')}
                  </span>
                </div>
                <span className="text-[10px] font-medium tracking-wide uppercase text-[#867A72] dark:text-[#C4ADC0] hidden sm:inline">
                  {t('vodSubtitle')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[14px] font-medium text-[#544A44] dark:text-[#D7CCC3] shrink-0">
            <Link
              href="/strefa"
              className={`whitespace-nowrap hover:text-[#250A24] dark:hover:text-[#FBF8F4] transition-colors py-1 border-b-2 ${
                pathname === '/strefa' || pathname === '/' ? 'border-[#DA0271] text-[#250A24] dark:text-[#FBF8F4] font-semibold' : 'border-transparent'
              }`}
            >
              {t('navDashboard')}
            </Link>
            <Link
              href="/strefa/lekcje"
              className={`whitespace-nowrap hover:text-[#250A24] dark:hover:text-[#FBF8F4] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/lekcj') ? 'border-[#DA0271] text-[#250A24] dark:text-[#FBF8F4] font-semibold' : 'border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#DA0271]" />
              {t('navLessons')}
            </Link>
            <Link
              href="/strefa/apteczka"
              className={`whitespace-nowrap hover:text-[#250A24] dark:hover:text-[#FBF8F4] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/apteczka') ? 'border-[#DA0271] text-[#250A24] dark:text-[#FBF8F4] font-semibold' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#DA0271]" />
              {t('navCabinet')}
            </Link>
            <Link
              href="/strefa/partner"
              className={`whitespace-nowrap hover:text-[#250A24] dark:hover:text-[#FBF8F4] transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/partner') ? 'border-[#7FB3CC] text-[#250A24] dark:text-[#FBF8F4] font-semibold' : 'border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-[#7FB3CC]" />
              {t('navPartner')}
            </Link>
            <Link
              href="/strefa/plan-porodu"
              className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 font-semibold text-[#DA0271] ${
                pathname.includes('/plan-porodu') ? 'border-[#DA0271]' : 'border-transparent hover:text-[#B90260]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#DA0271]" />
              {t('navPlan')}
            </Link>
          </div>

          {/* Right Section: Progress & Next Lesson CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[11px] font-bold text-[#250A24] dark:text-[#FBF8F4]">
                  {completedLessons.length}/52 {t('completedOf')}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#DA0271]">
                  ({percentCompleted}%)
                </span>
              </div>
              <div className="w-32 bg-[#EAE3DB] dark:bg-[#2C0C2B] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-[#DD7C9D] via-[#E9C46A] to-[#7FB3CC] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <Link
              href={`/strefa/lekcja/${nextLesson.id}`}
              className="inline-flex items-center space-x-1.5 bg-[#DA0271] hover:bg-[#B90260] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm shadow-[#DA0271]/25 hover:shadow-md group"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#FCD705] group-hover:scale-110 transition-transform" />
              <span>{t('nextLesson')}</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#544A44] dark:text-[#D7CCC3] hover:text-[#250A24] dark:hover:text-white rounded-lg border border-[#EAE3DB] dark:border-[#3D0E39] bg-white dark:bg-[#1C081A]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE3DB] dark:border-[#3D0E39] bg-[#FFFDFA] dark:bg-[#1C081A] px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 text-[#1A1512] dark:text-[#FBF8F4]">
            {/* Progress Bar Mobile */}
            <div className="p-3 bg-[#FBF8F4] dark:bg-[#250A24] rounded-xl border border-[#EAE3DB] dark:border-[#3D0E39] space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#250A24] dark:text-[#FBF8F4]">{t('courseProgress')}</span>
                <span className="text-[#DA0271] font-mono">{completedLessons.length} / 52 ({percentCompleted}%)</span>
              </div>
              <div className="w-full bg-[#EAE3DB] dark:bg-[#3D0E39] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#DD7C9D] via-[#E9C46A] to-[#7FB3CC] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 pt-1 text-sm font-medium">
              <Link
                href="/strefa"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname === '/strefa' ? 'bg-[#DA0271]/10 text-[#DA0271] dark:bg-[#DA0271]/20 dark:text-[#FF4BA8] font-semibold' : 'hover:bg-[#FBF8F4] dark:hover:bg-[#250A24]'
                }`}
              >
                <span>{t('navDashboard')}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/lekcje"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/lekcj') ? 'bg-[#DA0271]/10 text-[#DA0271] dark:bg-[#DA0271]/20 dark:text-[#FF4BA8] font-semibold' : 'hover:bg-[#FBF8F4] dark:hover:bg-[#250A24]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#DA0271]" />
                  <span>{t('navLessons')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/apteczka"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/apteczka') ? 'bg-[#DA0271]/10 text-[#DA0271] dark:bg-[#DA0271]/20 dark:text-[#FF4BA8] font-semibold' : 'hover:bg-[#FBF8F4] dark:hover:bg-[#250A24]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DA0271]" />
                  <span>{t('navCabinet')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/partner"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/partner') ? 'bg-[#7FB3CC]/10 text-[#7FB3CC] dark:bg-[#7FB3CC]/20 font-semibold' : 'hover:bg-[#FBF8F4] dark:hover:bg-[#250A24]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7FB3CC]" />
                  <span>{t('navPartner')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/plan-porodu"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg flex items-center justify-between bg-[#DA0271]/10 text-[#DA0271] dark:bg-[#DA0271]/20 dark:text-[#FF4BA8] font-semibold"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#DA0271]" />
                  <span>{t('navPlan')}</span>
                </div>
                <span className="text-[10px] bg-[#DA0271] text-white px-2 py-0.5 rounded-full uppercase">PDF</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#EAE3DB] dark:border-[#3D0E39]">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-[#DA0271] hover:bg-[#B90260] text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-[#DA0271]/25 transition-all"
              >
                <Play className="w-4 h-4 text-[#FCD705] fill-current" />
                <span>{t('goToLesson')} {nextLesson.lessonNumber}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
