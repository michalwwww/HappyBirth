'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { BuyCourseButton } from './buy-button';
import { ArrowRight, LogIn, Sparkles, Menu, X, Accessibility } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { useI18n } from '@/lib/i18n';
import { getMarketingTranslations } from '@/lib/marketing-i18n';

export function MarketingNavbar() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';
  const partnerzyUrl = isDev ? '/partnerzy' : 'https://partnerzy.happybirth.pl';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang } = useI18n();
  const t = getMarketingTranslations(lang).nav;

  const navLinks = [
    { label: t.links.pillars, href: '/#filary' },
    { label: t.links.stages, href: '/#etapy' },
    { label: t.links.tools, href: '/#narzedzia', icon: Sparkles },
    { label: t.links.reviews, href: '/#opinie' },
    { label: t.links.price, href: '/#cena' },
    { label: t.links.faq, href: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner w luksusowej śliwce */}
      <div className="bg-[#250A24] text-[#EAD5E5] border-b border-[#461643] px-3 sm:px-4 py-1.5 sm:py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#EC008C] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">{t.ribbonTitle}</span>
            <span className="text-[#EAD5E5]/80 hidden md:inline truncate">
              {t.ribbonDesc}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0">
            {/* Przełącznik języków z wektorowymi flagami PL / EN / RU */}
            <LanguageSwitcher />

            {/* Przełącznik Motywu Jasny / Ciemny */}
            <ThemeToggle />

            {/* Przycisk Udogodnień Cyfrowych UE / WCAG 2.1 */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hb_open_a11y'));
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#461643] bg-[#180517]/90 text-[#EAD5E5] hover:text-white hover:bg-white/10 transition-all font-medium cursor-pointer"
              title="Udogodnienia cyfrowe i deklaracja dostępności (WCAG 2.1 AA / EAA)"
              aria-label="Udogodnienia cyfrowe i deklaracja dostępności (WCAG 2.1 AA / EAA)"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#FCD705]" />
              <span className="hidden sm:inline font-semibold">{t.a11yBtn}</span>
            </button>

            {/* Social link: Instagram */}
            <a
              href="https://instagram.com/happybirth.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EAD5E5]/70 hover:text-white hidden md:flex items-center gap-1 border-l border-[#461643] pl-2.5 transition-colors"
              title="Obserwuj nas na Instagramie"
            >
              <span>@happybirth.pl</span>
            </a>

            <span className="text-[#EAD5E5]/60 hidden lg:inline border-l border-[#461643] pl-2.5">{t.haveAccount}</span>
            <a
              href={strefaUrl}
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#EC008C] transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3 h-3 text-[#EC008C]" />
              <span>{t.enterZone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar w ciepłym, eleganckim papierowym stylu / luksusowej ciemnej śliwce */}
      <nav className="glass-nav border-b border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4]/95 dark:bg-[#1A0619]/95 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <Logo className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" priority />
            <div className="hidden sm:flex flex-col border-l border-[#EAE3DB] dark:border-[#3A1038] pl-2.5 py-0.5">
              <span className="font-brand-display font-bold text-sm sm:text-base tracking-tight text-[#1A1512] dark:text-[#FBF8F4] leading-tight">
                {t.brandSubtitle1}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase text-[#867A72] dark:text-[#A2958C]">
                {t.brandSubtitle2}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-6 text-[14px] font-medium text-[#544A44] dark:text-[#D7CCC3] shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#1A1512] dark:hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {link.icon && <link.icon className="w-3.5 h-3.5 text-[#EC008C]" />}
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href={strefaUrl}
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-[#544A44] dark:text-[#D7CCC3] hover:text-[#EC008C] dark:hover:text-[#EC008C] px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              <span>{t.zoneBtn}</span>
            </a>

            <BuyCourseButton className="hidden sm:inline-flex items-center space-x-2 bg-[#EC008C] hover:bg-[#D0007A] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#EC008C]/25 hover:shadow-lg hover:scale-105 cursor-pointer whitespace-nowrap">
              <span>{t.joinBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </BuyCourseButton>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#250A24] text-[#1A1512] dark:text-white hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
              aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu nawigacyjne'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE3DB] dark:border-[#3A1038] bg-[#FBF8F4] dark:bg-[#1A0619] px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DB] dark:border-[#3A1038]">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#544A44] dark:text-[#D7CCC3] hover:bg-stone-100 dark:hover:bg-white/5 hover:text-[#1A1512] dark:hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={partnerzyUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#867A72] dark:text-[#A2958C] hover:bg-stone-100 dark:hover:bg-white/5 hover:text-[#1A1512] dark:hover:text-white transition-colors"
              >
                {t.partnerB2B}
              </a>
            </div>

            <div className="pt-3 border-t border-[#EAE3DB] dark:border-[#3A1038] space-y-2.5">
              <BuyCourseButton className="w-full py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#EC008C]/25 cursor-pointer">
                <span>{t.joinBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </BuyCourseButton>

              <a
                href={strefaUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full border border-[#EAE3DB] dark:border-[#3A1038] bg-white dark:bg-[#250A24] text-[#1A1512] dark:text-[#FBF8F4] text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[#EC008C] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#EC008C]" />
                <span>{t.enterZone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

