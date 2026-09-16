'use client';

import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  X, 
  Type, 
  Contrast, 
  Underline, 
  BookOpen, 
  PauseCircle, 
  RotateCcw,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface A11ySettings {
  fontSize: '100%' | '115%' | '130%';
  highContrast: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  fontSize: '100%',
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
  reduceMotion: false,
};

export function AccessibilityToolbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hb_a11y');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
          applySettings(parsed);
        }
      } catch {}
    }
  }, []);

  const applySettings = (s: A11ySettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Font size
    root.style.fontSize = s.fontSize === '100%' ? '' : s.fontSize;

    // High Contrast
    if (s.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Underline Links
    if (s.underlineLinks) {
      root.classList.add('a11y-underline-links');
    } else {
      root.classList.remove('a11y-underline-links');
    }

    // Readable font
    if (s.readableFont) {
      root.classList.add('a11y-readable-font');
    } else {
      root.classList.remove('a11y-readable-font');
    }

    // Reduce Motion
    if (s.reduceMotion) {
      root.classList.add('a11y-reduce-motion');
    } else {
      root.classList.remove('a11y-reduce-motion');
    }
  };

  const updateSetting = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    applySettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hb_a11y', JSON.stringify(updated));
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hb_a11y');
    }
  };

  return (
    <>
      {/* Przycisk wywołania dostępności w prawym dolnym rogu ekranu lub w nagłówku */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#250A24] text-[#EAD5E5] hover:text-white hover:bg-[#EC008C] border border-[#461643] shadow-2xl transition-all hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#EC008C]/50"
        title={t('a11yTitle')}
        aria-label={t('a11yTitle')}
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {/* Panel Dostępności (Modal / Popover) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#1C081A] rounded-3xl p-6 border border-[#EAE3DB] dark:border-[#461643] shadow-2xl space-y-6 text-[#1A1512] dark:text-[#FBF8F4]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DB] dark:border-[#461643]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EC008C]/10 text-[#EC008C] flex items-center justify-center">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-brand-display font-bold text-base leading-tight">
                    {t('a11yTitle')}
                  </h3>
                  <span className="text-[10px] text-[#867A72] dark:text-[#EAD5E5]/60 uppercase tracking-wider font-semibold">
                    Standard WCAG 2.1 AA · Dyrektywa UE
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-[#867A72] hover:text-[#1A1512] dark:hover:text-white transition-colors"
                aria-label="Zamknij ułatwienia dostępu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Opcje */}
            <div className="space-y-4 text-xs">
              {/* 1. Rozmiar tekstu */}
              <div className="space-y-1.5">
                <label className="font-semibold flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#EC008C]" />
                  <span>{t('a11yFontSize')}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['100%', '115%', '130%'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateSetting('fontSize', size)}
                      className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                        settings.fontSize === size
                          ? 'border-[#EC008C] bg-[#FAE3EB] dark:bg-[#EC008C]/20 text-[#EC008C] font-bold shadow-sm'
                          : 'border-[#EAE3DB] dark:border-[#461643] bg-neutral-50 dark:bg-black/40 hover:border-[#867A72]'
                      }`}
                    >
                      {size === '100%' ? t('a11yNormal') : size === '115%' ? t('a11yMedium') : t('a11yLarge')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Przełączniki funkcji */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3DB] dark:border-[#461643]">
                {/* Wysoki Kontrast */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <Contrast className="w-3.5 h-3.5 text-[#EC008C]" />
                    <span>{t('a11yContrast')}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    className="w-4 h-4 accent-[#EC008C] rounded cursor-pointer"
                  />
                </div>

                {/* Podkreślenie linków */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <Underline className="w-3.5 h-3.5 text-[#EC008C]" />
                    <span>{t('a11yUnderline')}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.underlineLinks}
                    onChange={(e) => updateSetting('underlineLinks', e.target.checked)}
                    className="w-4 h-4 accent-[#EC008C] rounded cursor-pointer"
                  />
                </div>

                {/* Czytelna czcionka dla dyslektyków */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#EC008C]" />
                    <span>{t('a11yDyslexic')}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.readableFont}
                    onChange={(e) => updateSetting('readableFont', e.target.checked)}
                    className="w-4 h-4 accent-[#EC008C] rounded cursor-pointer"
                  />
                </div>

                {/* Zatrzymanie animacji */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <PauseCircle className="w-3.5 h-3.5 text-[#EC008C]" />
                    <span>{t('a11yReduceMotion')}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                    className="w-4 h-4 accent-[#EC008C] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Footer / Reset & Deklaracja */}
            <div className="pt-4 border-t border-[#EAE3DB] dark:border-[#461643] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={resetSettings}
                className="text-[#867A72] hover:text-[#EC008C] flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('a11yReset')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeclaration(true)}
                className="text-[#EC008C] hover:underline font-semibold flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('a11yDeclaration')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Deklaracji Dostępności UE */}
      {showDeclaration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#1C081A] rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] dark:border-[#461643] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs text-[#544A44] dark:text-[#EAD5E5]/90">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DB] dark:border-[#461643]">
              <h3 className="font-brand-display font-bold text-lg text-[#1A1512] dark:text-white">
                Deklaracja Dostępności Cyfrowej (WCAG 2.1 AA / EAA)
              </h3>
              <button
                type="button"
                onClick={() => setShowDeclaration(false)}
                className="p-1 rounded-full text-[#867A72] hover:text-[#1A1512] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="leading-relaxed">
              Platforma edukacyjna <strong>HappyBirth</strong> (KLARSolutions sp. z o.o.) zobowiązuje się do zapewnienia dostępności swojej strony internetowej zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych oraz wytycznymi <strong>European Accessibility Act (EAA)</strong> i standardem <strong>WCAG 2.1 na poziomie AA</strong>.
            </p>

            <div className="space-y-2 bg-neutral-50 dark:bg-black/30 p-3.5 rounded-2xl border border-[#EAE3DB] dark:border-[#461643]">
              <h4 className="font-bold text-[#1A1512] dark:text-white">Zastosowane udogodnienia:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Pełna obsługa nawigacji za pomocą samej klawiatury (Focus outlines).</li>
                <li>Transkrypcje tekstowe i napisy dla materiałów wideo w odtwarzaczu Cloudflare Stream.</li>
                <li>Możliwość dynamicznego powiększenia tekstu do 130% bez utraty struktury strony.</li>
                <li>Tryb wysokiego kontrastu oraz czytelnej typografii dla osób z dysleksją.</li>
                <li>Ochrona przed miganiem elementów dla osób ze schorzeniami neurologicznymi.</li>
              </ul>
            </div>

            <p className="leading-relaxed">
              W przypadku problemów z dostępnością strony prosimy o kontakt:  
              <strong> e-mail: kontakt@happybirth.pl</strong>. Zgłoszenia rozpatrujemy niezwłocznie.
            </p>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowDeclaration(false)}
                className="px-5 py-2 rounded-full bg-[#EC008C] text-white font-semibold"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
