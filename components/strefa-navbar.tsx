'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCourseProgress } from '@/lib/progress';
import {
  Sparkles,
  Heart,
  User,
  Play,
  Menu,
  X,
  BookOpen,
  LogOut,
  ChevronRight,
  FileText,
  Library,
} from 'lucide-react';
import { lessons } from '@/lib/course-data';
import { Logo } from '@/components/site/logo';

import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

// Wygląd dopasowany do nagłówka strony v3: pasek w kolorze nocy, jasny nagłówek z rozmyciem,
// pigułki menu, magentowe wezwanie do działania. Teksty, logika ról i postępu bez zmian.
// Runda X1 (05.11.2026): pigułki i przycisk lekcji w szklanym stylu strony (klasa hb-szklo, kolory z palety)
const PIGULKA =
  'hb-szklo hb-strefa-pig inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-[12px] font-extrabold uppercase tracking-[.09em]';
const PIGULKA_ZWYKLA = '';
const PIGULKA_AKTYWNA = 'hb-strefa-pig-akt';

const WIERSZ =
  'px-4 py-3 rounded-2xl border-[1.5px] flex items-center justify-between font-brand-display text-[18px] font-bold transition-colors';
const WIERSZ_ZWYKLY =
  'bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-ink3)] dark:hover:border-[color:var(--hb-ink3)]';
const WIERSZ_AKTYWNY = 'bg-[color:var(--hb-noc)] border-[color:var(--hb-noc)] text-white';

export function StrefaNavbar() {
  const pathname = usePathname();
  const { role, changeRole, percentCompleted, completedLessons } = useCourseProgress();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: string;
    hasActiveCourse: boolean;
    expiresAt?: string | null;
    daysRemaining?: number | null;
  } | null>(null);

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

  const naKokpicie = pathname === '/strefa' || pathname === '/';
  const naLekcjach = pathname.includes('/lekcj');
  const wApteczce = pathname.includes('/apteczka');
  const uPartnera = pathname.includes('/partner');
  const wPlanie = pathname.includes('/plan-porodu');
  const wWiedzy = pathname.includes('/strefa/wiedza');

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Pasek strefy w kolorze nocy, jak pasek prawny strony v3 */}
      <div className="bg-[color:var(--hb-noc)] dark:bg-[color:var(--hb-noc3)] text-white/85 px-3 sm:px-4 py-1.5 sm:py-2 text-xs transition-colors">
        <div className="max-w-[1440px] mx-auto flex items-center justify-end md:justify-between gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span aria-hidden="true" className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9CC6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--hb-zol)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9AD4F0]" />
            </span>
            <span className="font-extrabold text-white uppercase tracking-[.12em] text-[11px] whitespace-nowrap">
              {t('brandTitle')}
            </span>
            <span className="text-white/35 hidden xl:inline">|</span>
            <span className="text-white/75 hidden xl:inline truncate max-w-md">
              {currentUser?.daysRemaining ? `Dostęp aktywny: pozostało ${currentUser.daysRemaining} dni (z 548 dni / 18 msc)` : t('ribbonSubtitle')}
            </span>
          </div>

          <div className="flex flex-wrap xl:shrink-0 items-center justify-end gap-x-2 sm:gap-x-2.5 gap-y-1.5">
            {/* Przełącznik języków z flagami PL / EN / RU */}
            <LanguageSwitcher />

            {/* Przełącznik Motywu Light / Dark */}
            <ThemeToggle />

            {/* Zbalansowany przełącznik perspektywy: Dla Mamy / Dla Taty */}
            <div className="flex items-center gap-1.5 text-[11px] border-l border-white/20 pl-2">
              <span className="text-white/70 hidden md:inline">{t('viewMode')}</span>
              <div className="inline-flex rounded-full bg-white/10 p-0.5 border border-white/20">
                <button
                  onClick={() => changeRole('student')}
                  className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                    role === 'student'
                      ? 'bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                  title="Widok dla Mamy"
                >
                  <Heart className="w-2.5 h-2.5" /> <span className="hidden sm:inline">{t('roleStudent')}</span>
                </button>
                <button
                  onClick={() => changeRole('partner')}
                  className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-bold whitespace-nowrap ${
                    role === 'partner'
                      ? 'bg-[#9AD4F0] text-[color:var(--hb-noc3)] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                  title="Widok dla Taty"
                >
                  <User className="w-2.5 h-2.5" /> <span className="hidden sm:inline">{t('rolePartner')}</span>
                </button>
              </div>
            </div>

            {/* Stan konta / Wyloguj */}
            <div className="flex items-center gap-2 border-l border-white/20 pl-2.5 text-[11px]">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/75 hidden lg:inline truncate max-w-[110px]">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={() => {
                      fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                        window.location.href = '/strefa/login';
                      });
                    }}
                    className="text-[color:var(--hb-p1t)] hover:text-white flex items-center gap-1 font-bold"
                    title={t('btnLogout')}
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('btnLogout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/strefa/login"
                  className="text-[color:var(--hb-zol)] hover:underline font-bold whitespace-nowrap"
                >
                  {t('btnLogin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Główny pasek strefy */}
      <nav className="border-b border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] bg-[color:color-mix(in_srgb,var(--hb-len)_90%,transparent)] dark:bg-[color:color-mix(in_srgb,var(--hb-kosc)_90%,transparent)] backdrop-blur-md backdrop-saturate-150 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 xl:gap-4">
          {/* Logo i znaczek strefy */}
          <div className="flex items-center shrink-0">
            <Link href="/strefa" className="flex items-center gap-3 group">
              <Logo className="hb-strefa-logo transition-transform group-hover:scale-105" />
              <div className="flex flex-col border-l border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] pl-3 py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand-display font-bold text-[15px] sm:text-[17px] tracking-tight text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] leading-tight">
                    {t('schoolTitle')}
                  </span>
                  <span className="max-[359px]:hidden bg-[color:var(--hb-noc)] dark:bg-[color:var(--hb-linia2)] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-[.12em] uppercase">
                    {t('vodZone')}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-[.12em] uppercase text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] hidden sm:inline">
                  {t('vodSubtitle')}
                </span>
              </div>
            </Link>
          </div>

          {/* Pigułki menu (szeroki ekran); ikony dopiero od 2xl, żeby sześć pigułek i przycisk lekcji zmieściły się przy 1280 px */}
          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            <Link
              href="/strefa"
              aria-current={naKokpicie ? 'page' : undefined}
              className={`${PIGULKA} ${naKokpicie ? PIGULKA_AKTYWNA : PIGULKA_ZWYKLA}`}
            >
              {t('navDashboard')}
            </Link>
            <Link
              href="/strefa/lekcje"
              aria-current={naLekcjach ? 'page' : undefined}
              className={`${PIGULKA} ${naLekcjach ? PIGULKA_AKTYWNA : PIGULKA_ZWYKLA}`}
            >
              <BookOpen className={`hidden 2xl:block w-4 h-4 ${naLekcjach ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
              {t('navLessons')}
            </Link>
            <Link
              href="/strefa/apteczka"
              aria-current={wApteczce ? 'page' : undefined}
              className={`${PIGULKA} ${wApteczce ? PIGULKA_AKTYWNA : PIGULKA_ZWYKLA}`}
            >
              <Sparkles className={`hidden 2xl:block w-4 h-4 ${wApteczce ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
              {t('navCabinet')}
            </Link>
            <Link
              href="/strefa/wiedza"
              aria-current={wWiedzy ? 'page' : undefined}
              className={`${PIGULKA} ${wWiedzy ? PIGULKA_AKTYWNA : PIGULKA_ZWYKLA}`}
            >
              <Library className={`hidden 2xl:block w-4 h-4 ${wWiedzy ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
              {t('navKnowledge')}
            </Link>
            <Link
              href="/strefa/partner"
              aria-current={uPartnera ? 'page' : undefined}
              className={`${PIGULKA} ${
                uPartnera ? 'hb-strefa-pig-p4' : PIGULKA_ZWYKLA
              }`}
            >
              <User className={`hidden 2xl:block w-4 h-4 ${uPartnera ? '' : 'text-[color:var(--hb-p4g)] dark:text-[color:var(--hb-p4g)]'}`} />
              {t('navPartner')}
            </Link>
            <Link
              href="/strefa/plan-porodu"
              aria-current={wPlanie ? 'page' : undefined}
              className={`${PIGULKA} ${
                wPlanie
                  ? 'hb-strefa-pig-cta'
                  : 'hb-strefa-pig-p1'
              }`}
            >
              <FileText className="hidden 2xl:block w-4 h-4" />
              {t('navPlan')}
            </Link>
          </div>

          {/* Postęp i następna lekcja */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="hidden md:flex xl:hidden 2xl:flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[11.5px] font-extrabold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] whitespace-nowrap">
                  {completedLessons.length}/52 {t('completedOf')}
                </span>
                <span className="text-[11.5px] font-extrabold text-[color:var(--hb-mag-t)] whitespace-nowrap">
                  ({percentCompleted}%)
                </span>
              </div>
              <div className="w-32 bg-[color:var(--hb-linia)] dark:bg-[color:var(--hb-noc)] h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-[color:var(--hb-p1)] via-[color:var(--hb-p2)] to-[color:var(--hb-p4)] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <Link
              href={`/strefa/lekcja/${nextLesson.id}`}
              className="hb-btn hb-btn-kup hb-strefa-cta group"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[color:var(--hb-zol)] group-hover:scale-110 transition-transform" />
              <span>{t('nextLesson')}</span>
            </Link>
          </div>

          {/* Przycisk menu (wąski ekran) */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid place-items-center w-12 h-12 rounded-[14px] border-[1.5px] border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] hover:border-[color:var(--hb-ink3)] transition-colors"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu rozwijane (wąski ekran) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[color:var(--hb-linia2)] dark:border-[color:var(--hb-linia2)] bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-kosc)] px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
            {/* Postęp */}
            <div className="p-3.5 bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] rounded-2xl border-[1.5px] border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span>{t('courseProgress')}</span>
                <span className="text-[color:var(--hb-mag-t)]">{completedLessons.length} / 52 ({percentCompleted}%)</span>
              </div>
              <div className="w-full bg-[color:var(--hb-linia)] dark:bg-[color:var(--hb-noc)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[color:var(--hb-p1)] via-[color:var(--hb-p2)] to-[color:var(--hb-p4)] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5 pt-1">
              <Link
                href="/strefa"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} ${pathname === '/strefa' ? WIERSZ_AKTYWNY : WIERSZ_ZWYKLY}`}
              >
                <span>{t('navDashboard')}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/lekcje"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} ${naLekcjach ? WIERSZ_AKTYWNY : WIERSZ_ZWYKLY}`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className={`w-4 h-4 ${naLekcjach ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
                  <span>{t('navLessons')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/apteczka"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} ${wApteczce ? WIERSZ_AKTYWNY : WIERSZ_ZWYKLY}`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${wApteczce ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
                  <span>{t('navCabinet')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/wiedza"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} ${wWiedzy ? WIERSZ_AKTYWNY : WIERSZ_ZWYKLY}`}
              >
                <div className="flex items-center gap-2.5">
                  <Library className={`w-4 h-4 ${wWiedzy ? '' : 'text-[color:var(--hb-mag-t)] dark:text-[color:var(--hb-mag-t)]'}`} />
                  <span>{t('navKnowledge')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/partner"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} ${
                  uPartnera ? 'bg-[color:var(--hb-p4g)] border-[color:var(--hb-p4g)] text-white dark:bg-[color:var(--hb-p4t)] dark:border-[color:var(--hb-p4t)]' : WIERSZ_ZWYKLY
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className={`w-4 h-4 ${uPartnera ? '' : 'text-[color:var(--hb-p4g)] dark:text-[color:var(--hb-p4g)]'}`} />
                  <span>{t('navPartner')}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/strefa/plan-porodu"
                onClick={() => setMobileMenuOpen(false)}
                className={`${WIERSZ} bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] border-[color:var(--hb-p1t)] dark:border-[color:var(--hb-p1t)] text-[color:var(--hb-roz)] dark:text-[color:var(--hb-mag-t)]`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>{t('navPlan')}</span>
                </div>
                <span className="font-sans text-[10px] font-extrabold tracking-[.1em] bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] px-2 py-0.5 rounded-full uppercase">PDF</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
              <Link
                href={`/strefa/lekcja/${nextLesson.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] min-h-[56px] rounded-2xl text-[13.5px] font-extrabold uppercase tracking-[.09em] transition-colors"
              >
                <Play className="w-4 h-4 text-[color:var(--hb-zol)] fill-current" />
                <span>{t('goToLesson')} {nextLesson.lessonNumber}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
