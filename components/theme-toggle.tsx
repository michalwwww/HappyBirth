'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { IconKsiezyc, IconSlonce } from '@/components/site/icons';
import { ustawTryb } from '@/lib/wyglad';

interface ThemeToggleProps {
  className?: string;
  /** 'ribbon': ciemny pasek strefy (dotychczasowy wygląd), 'site': ikona w nagłówku strony v3,
   *  'wiersz': wiersz w panelu Ustawienia strony v3 */
  variant?: 'ribbon' | 'site' | 'wiersz';
  labels?: { dark: string; light: string };
}

export function ThemeToggle({ className = '', variant = 'ribbon', labels }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // stan z klasy html.dark, którą ustawia skrypt w <head> (ciasteczko wspólne dla subdomen albo localStorage)
    const handleSync = () => setIsDark(document.documentElement.classList.contains('dark'));
    handleSync();
    window.addEventListener('hb_theme_updated', handleSync);
    return () => window.removeEventListener('hb_theme_updated', handleSync);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    ustawTryb(nextDark);
  };

  if (variant === 'wiersz') {
    // wiersz w panelu Ustawienia: stała nazwa „Tryb ciemny” i przełącznik pokazujący stan (aria-pressed)
    return (
      <button type="button" onClick={toggleTheme} className={`hb-ustaw-wiersz ${className}`} aria-pressed={isDark}>
        {isDark ? <IconSlonce /> : <IconKsiezyc />}
        <span>{labels?.dark ?? 'Tryb ciemny'}</span>
        <i aria-hidden="true" className="hb-przelacznik" />
      </button>
    );
  }

  if (variant === 'site') {
    const label = isDark ? (labels?.light ?? 'Włącz tryb jasny') : (labels?.dark ?? 'Włącz tryb ciemny');
    return (
      <button type="button" onClick={toggleTheme} className={`hb-ikona ${className}`} title={label} aria-label={label} aria-pressed={isDark}>
        {isDark ? <IconSlonce /> : <IconKsiezyc />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 rounded-full border border-[color:var(--hb-ink2)] bg-[color:color-mix(in_srgb,var(--hb-noc3)_90%,transparent)] text-[#E8DEF0] hover:text-white hover:bg-white/10 transition-all ${className}`}
      title={isDark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
      aria-label={isDark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#E8DEF0] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
