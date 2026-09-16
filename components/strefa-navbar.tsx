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
    <header className="sticky top-0 z-50 w-full">
      {/* Top Luxury Announcement Ribbon (Ciemnofioletowy aksamit #250A24) */}
      <div className="bg-[#250A24] dark:bg-[#140513] text-[#EAD5E5] border-b border-[#461643] px-4 py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              {t('brandTitle')}
            </span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-[#EAD5E5]/80 hidden md:inline">
              {t('ribbonSubtitle')}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Przełącznik języków z flagami PL / EN / RU */}
            <LanguageSwitcher />

            {/* Przełącznik Motywu Light / Dark */}
            <ThemeToggle />

            {/* Role switcher */}
            <div className="flex items-center space-x-2 text-[11px] border-l border-[#461643] pl-2.5">
              <span className="text-[#EAD5E5]/60 hidden sm:inline">{t('viewMode')}</span>
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
                  <Heart className="w-2.5 h-2.5" /> {t('roleStudent')}
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
                  <User className="w-2.5 h-2.5" /> {t('rolePartner')}
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
                  {t('roleGuest')}
                </button>
              </div>
            </div>

            {/* Stan konta / Wyloguj */}
            <div className="flex items-center space-x-2.5 border-l border-[#461643] pl-3 text-[11px]">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#EAD5E5]/80 hidden md:inline truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={() => {
                      fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                        window.location.href = '/strefa/login';
                      });
                    }}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    title={t('btnLogout')}
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('btnLogout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/strefa/login"
                  className="text-[#FCD705] hover:underline font-semibold"
                >
                  {t('btnLogin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Strefa Navbar */}
      <nav className="glass-nav border-b border-[#EAE3DB] dark:border-[#461643] bg-[#FBF8F4]/95 dark:bg-[#1C081A]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & Zone Badge */}
          <div className="flex items-center space-x-3.5">
            <Link href="/strefa" className="flex items-center space-x-3 group">
              <Logo className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" priority />
              <div className="flex flex-col border-l border-[#EAE3DB] dark:border-[#461643] pl-3 py-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-brand-display font-bold text-sm sm:text-base tracking-tight text-[#1A1512] dark:text-[#FBF8F4] leading-tight">
                    {t('schoolTitle')}
                  </span>
                  <span className="bg-[#EC008C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm shadow-[#EC008C]/20">
                    {t('vodZone')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase text-[#867A72] dark:text-[#EAD5E5]/70">
                  {t('vodSubtitle')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-[14px] font-medium text-[#544A44] dark:text-[#EAD5E5]/80">
            <Link
              href="/strefa"
              className={`hover:text-[#1A1512] dark:hover:text-white transition-colors py-1 border-b-2 ${
                pathname === '/strefa' || pathname === '/' ? 'border-[#EC008C] text-[#1A1512] dark:text-white font-semibold' : 'border-transparent'
              }`}
            >
              {t('navDashboard')}
            </Link>
            <Link
              href="/strefa/lekcje"
              className={`hover:text-[#1A1512] dark:hover:text-white transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/lekcj') ? 'border-[#EC008C] text-[#1A1512] dark:text-white font-semibold' : 'border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#EC008C]" />
              {t('navLessons')}
            </Link>
            <Link
              href="/strefa/apteczka"
              className={`hover:text-[#1A1512] dark:hover:text-white transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/apteczka') ? 'border-[#EC008C] text-[#1A1512] dark:text-white font-semibold' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#EC008C]" />
              {t('navCabinet')}
            </Link>
            <Link
              href="/strefa/partner"
              className={`hover:text-[#1A1512] dark:hover:text-white transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                pathname.includes('/partner') ? 'border-[#98269C] text-[#98269C] dark:text-pink-400 font-semibold' : 'border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-[#98269C] dark:text-pink-400" />
              {t('navPartner')}
            </Link>
            <Link
              href="/strefa/licznik"
              className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 ${
                pathname.includes('/licznik') ? 'border-rose-500' : 'border-transparent hover:text-rose-700 dark:hover:text-rose-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              {t('navCounter')}
            </Link>
          </div>

          {/* Right Section: Progress & Next Lesson CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[11px] font-bold text-[#1A1512] dark:text-[#FBF8F4]">
                  {completedLessons.length}/52 {t('completedOf')}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#EC008C]">
                  ({percentCompleted}%)
                </span>
              </div>
              <div className="w-32 bg-[#EAE3DB] dark:bg-[#3A1038] h-2 rounded-full overflow-hidden mt-1">
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
              <span>{t('nextLesson')}</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#544A44] dark:text-[#EAD5E5] hover:text-[#1A1512] dark:hover:text-white rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#250A24]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#1C081A] px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 text-[#1A1512] dark:text-[#FBF8F4]">
            {/* Progress Bar Mobile */}
            <div className="p-3 bg-[#FBF8F4] dark:bg-[#250A24] rounded-xl border border-[#EAE3DB] dark:border-[#461643] space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>{t('courseProgress')}</span>
                <span className="text-[#EC008C] font-mono">{completedLessons.length} / 52 ({percentCompleted}%)</span>
              </div>
              <div className="w-full bg-[#EAE3DB] dark:bg-[#3A1038] h-2 rounded-full overflow-hidden">
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
                  pathname === '/strefa' ? 'bg-[#FAE3EB] dark:bg-[#461643] text-[#EC008C] font-semibold' : 'hover:bg-stone-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{t('navDashboard')}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/lekcje"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/lekcj') ? 'bg-[#FAE3EB] dark:bg-[#461643] text-[#EC008C] font-semibold' : 'hover:bg-stone-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#EC008C]" />
                  <span>{t('navLessons')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/apteczka"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/apteczka') ? 'bg-[#FAE3EB] dark:bg-[#461643] text-[#EC008C] font-semibold' : 'hover:bg-stone-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EC008C]" />
                  <span>{t('navCabinet')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/partner"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between ${
                  pathname.includes('/partner') ? 'bg-[#EAD5E5] dark:bg-[#461643] text-[#98269C] dark:text-pink-300 font-semibold' : 'hover:bg-stone-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#98269C] dark:text-pink-300" />
                  <span>{t('navPartner')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/licznik"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg flex items-center justify-between bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>{t('navCounter')}</span>
                </div>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">SOS</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#EAE3DB] dark:border-[#461643]">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-[#EC008C] hover:bg-[#D0007A] text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-[#EC008C]/25 transition-all"
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
