'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { BuyCourseButton } from './buy-button';
import { useSiteUrls } from '@/lib/site-urls';
import { STAGE_EVENT, stageToken } from '@/lib/brand';
import { nav as t } from '@/components/landing/content';

/**
 * Nawigacja strony marketingowej. Rejestr PRACA.
 * Tło pełne (nie półprzezroczyste), logotyp kolorowy tylko tutaj,
 * kropka przejmuje kolor etapu, jedno CTA.
 * Pełny znak ma minimum 120 px szerokości. Po przewinięciu belka
 * zwęża się i pokazuje sygnet z nazwą pisaną tekstem.
 */
export function MarketingNavbar() {
  const urls = useSiteUrls();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [dot, setDot] = useState<string>(stageToken('zanim').nav);
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 96);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onStage = (e: Event) => {
      const id = (e as CustomEvent<string | null>).detail;
      setDot(id ? stageToken(id).nav : stageToken('zanim').nav);
    };
    window.addEventListener(STAGE_EVENT, onStage);
    return () => window.removeEventListener(STAGE_EVENT, onStage);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open && headerRef.current) setMenuTop(headerRef.current.getBoundingClientRect().height);
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open, compact]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full bg-paper border-b border-line">
      <nav className="wrap flex items-center justify-between gap-6" aria-label="Główna">
        <Link
          href="/"
          className="flex items-center gap-3 py-3 shrink-0"
          aria-label="HAPPYBIRTH, strona główna"
          onClick={() => setOpen(false)}
        >
          {/* Pełny znak przy górze strony, sygnet i nazwa po przewinięciu */}
          <span
            className={`block overflow-hidden transition-[width,height,opacity] duration-500 ease-out ${
              compact ? 'w-0 h-0 opacity-0' : 'w-[120px] h-[97px] sm:w-[128px] sm:h-[104px] opacity-100'
            }`}
          >
            <Logo variant="color" decorative className="w-[120px] sm:w-[128px] h-auto block" />
          </span>
          <span
            className="flex items-center gap-2.5 overflow-hidden transition-[width,opacity] duration-500 ease-out"
            style={{ width: compact ? 'auto' : 0, opacity: compact ? 1 : 0 }}
            aria-hidden={!compact}
          >
            <Logo variant="sygnet" decorative className="w-9 h-9 text-stage-karmienie" />
            <span className="font-display font-medium text-[19px] tracking-[-0.03em] text-ink whitespace-nowrap">HAPPYBIRTH</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-[15.5px] font-medium text-ink-2">
          {t.links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="navdot" style={{ background: dot }} aria-hidden="true" title="Twój etap" />
          <a
            href={urls.strefa}
            className="hidden sm:inline-block text-[15px] font-medium text-ink-2 hover:text-ink transition-colors whitespace-nowrap"
          >
            {t.login}
          </a>
          <BuyCourseButton className="btn btn-primary btn-sm hidden sm:inline-flex">
            <span>{t.cta}</span>
          </BuyCourseButton>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden inline-flex w-11 h-11 rounded-full border border-line bg-paper items-center justify-center text-ink"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            aria-controls="hb-mobile-menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="hb-mobile-menu"
          className="lg:hidden fixed inset-x-0 bottom-0 bg-paper border-t border-line fade-up overflow-y-auto"
          style={{ top: menuTop }}
        >
          <div className="wrap py-6 flex flex-col gap-1">
            {t.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display font-medium text-[32px] tracking-[-0.03em] py-3 border-b border-line text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href={urls.strefa}
              onClick={() => setOpen(false)}
              className="font-display font-medium text-[32px] tracking-[-0.03em] py-3 border-b border-line text-ink-2"
            >
              {t.login}
            </a>
            <div className="pt-6 flex flex-col gap-3">
              <BuyCourseButton className="btn btn-primary btn-lg w-full">
                <span>{t.cta}</span>
              </BuyCourseButton>
              <a href={urls.partnerzy} onClick={() => setOpen(false)} className="text-center text-[15px] text-ink-3 py-2">
                Program partnerski dla położnych i gabinetów
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
