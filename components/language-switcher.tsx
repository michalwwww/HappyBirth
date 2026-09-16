'use client';

import React from 'react';
import { useI18n, Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

function PolishFlag() {
  return (
    <svg className="w-3.5 h-2.5 rounded-[2px] shadow-sm overflow-hidden shrink-0 border border-white/20" viewBox="0 0 16 12">
      <rect width="16" height="6" fill="#FFFFFF" />
      <rect y="6" width="16" height="6" fill="#DC143C" />
    </svg>
  );
}

function BritishFlag() {
  return (
    <svg className="w-3.5 h-2.5 rounded-[2px] shadow-sm overflow-hidden shrink-0 border border-white/20" viewBox="0 0 60 30">
      <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}

function RussianFlag() {
  return (
    <svg className="w-3.5 h-2.5 rounded-[2px] shadow-sm overflow-hidden shrink-0 border border-white/20" viewBox="0 0 16 12">
      <rect width="16" height="4" fill="#FFFFFF" />
      <rect y="4" width="16" height="4" fill="#0039A6" />
      <rect y="8" width="16" height="4" fill="#D52B1E" />
    </svg>
  );
}

export function LanguageSwitcher({ className = '', variant = 'compact' }: LanguageSwitcherProps) {
  const { lang, setLang } = useI18n();

  const languages: { id: Language; Flag: React.ComponentType; label: string; code: string }[] = [
    { id: 'pl', Flag: PolishFlag, label: 'Polski', code: 'PL' },
    { id: 'en', Flag: BritishFlag, label: 'English', code: 'EN' },
    { id: 'ru', Flag: RussianFlag, label: 'Русский', code: 'RU' },
  ];

  return (
    <div className={`inline-flex items-center rounded-full bg-[#180517]/90 p-0.5 border border-[#461643] text-xs ${className}`}>
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
          <l.Flag />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {variant === 'full' ? l.label : l.code}
          </span>
        </button>
      ))}
    </div>
  );
}
