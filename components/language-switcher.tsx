'use client';

import React from 'react';
import { useI18n, Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageSwitcher({ className = '', variant = 'compact' }: LanguageSwitcherProps) {
  const { lang, setLang } = useI18n();

  const languages: { id: Language; flag: string; label: string; code: string }[] = [
    { id: 'pl', flag: '🇵🇱', label: 'Polski', code: 'PL' },
    { id: 'en', flag: '🇬🇧', label: 'English', code: 'EN' },
    { id: 'ru', flag: '🇷🇺', label: 'Русский', code: 'RU' },
  ];

  return (
    <div className={`inline-flex items-center rounded-full bg-[#180517]/90 dark:bg-black/60 p-0.5 border border-[#461643] text-xs ${className}`}>
      {languages.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 font-medium ${
            lang === l.id
              ? 'bg-[#EC008C] text-white shadow-sm scale-105'
              : 'text-[#EAD5E5]/70 hover:text-white hover:bg-white/5'
          }`}
          title={l.label}
          aria-label={`Zmień język na ${l.label}`}
        >
          <span className="text-sm leading-none">{l.flag}</span>
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {variant === 'full' ? l.label : l.code}
          </span>
        </button>
      ))}
    </div>
  );
}
