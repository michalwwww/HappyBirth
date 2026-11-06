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
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('hb_open_a11y', handleOpen);
        return () => window.removeEventListener('hb_open_a11y', handleOpen);
      } catch {}
    }
  }, []);

  const applySettings = (s: A11ySettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Rozmiar tekstu: jedna klasa na <html> z powiększeniem całej strony (zoom w globals.css).
    // Bez zoomu w stylu inline i bez em na każdym elemencie, które się mnożyły (runda X1).
    root.classList.toggle('a11y-font-115', s.fontSize === '115%');
    root.classList.toggle('a11y-font-130', s.fontSize === '130%');
    (root.style as any).zoom = '';

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

  // okna: Escape zamyka, fokus trafia na przycisk zamknięcia (runda X1)
  useEffect(() => {
    if (!isOpen && !showDeclaration) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showDeclaration) setShowDeclaration(false); else setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => {
      const x = document.querySelectorAll<HTMLButtonElement>('.hb-a11y-x');
      x[x.length - 1]?.focus();
    }, 30);
    return () => { document.removeEventListener('keydown', onKey); window.clearTimeout(id); };
  }, [isOpen, showDeclaration]);

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

  const Przelacznik = ({ id, opis, ikona, wl }: { id: keyof A11ySettings; opis: string; ikona: React.ReactNode; wl: boolean }) => (
    <button aria-pressed={wl} className="hb-a11y-wiersz" onClick={() => updateSetting(id, !wl as never)} type="button">
      <span aria-hidden="true" className="hb-a11y-ikona">{ikona}</span>
      <span>{opis}</span>
      <i aria-hidden="true" className="hb-przelacznik" />
    </button>
  );

  return (
    <>
      {/* Okno ułatwień dostępu (runda X1): kolory i przyciski z bieżącej palety strony */}
      {isOpen && (
        <div className="hb-a11y-tlo" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
          <div aria-labelledby="hb-a11y-tyt" aria-modal="true" className="hb-a11y" data-a11y-modal="true" role="dialog">
            <div className="hb-a11y-glowa">
              <span aria-hidden="true" className="hb-szklo hb-a11y-znak"><Accessibility /></span>
              <div>
                <h3 id="hb-a11y-tyt">Ułatwienia dostępu</h3>
                <p>Standard WCAG 2.1 AA · Dostępność cyfrowa</p>
              </div>
              <button aria-label="Zamknij ułatwienia dostępu" className="hb-szklo hb-a11y-x" onClick={() => setIsOpen(false)} type="button">
                <X />
              </button>
            </div>

            <div className="hb-a11y-sekcja">
              <p className="hb-a11y-tyt"><Type aria-hidden="true" />Rozmiar tekstu</p>
              <div className="hb-a11y-rozmiary" role="group" aria-label="Rozmiar tekstu">
                {(['100%', '115%', '130%'] as const).map((size) => (
                  <button aria-pressed={settings.fontSize === size} className="hb-szklo" key={size} onClick={() => updateSetting('fontSize', size)} type="button">
                    {size === '100%' ? 'Domyślny' : size === '115%' ? 'Większy +15%' : 'Duży +30%'}
                  </button>
                ))}
              </div>
            </div>

            <div className="hb-a11y-sekcja">
              <Przelacznik id="highContrast" ikona={<Contrast />} opis="Wysoki kontrast (żółć i biel na czerni)" wl={settings.highContrast} />
              <Przelacznik id="underlineLinks" ikona={<Underline />} opis="Podkreślenie odnośników" wl={settings.underlineLinks} />
              <Przelacznik id="readableFont" ikona={<BookOpen />} opis="Prosty krój pisma (bezszeryfowy)" wl={settings.readableFont} />
              <Przelacznik id="reduceMotion" ikona={<PauseCircle />} opis="Zatrzymanie animacji i ruchu" wl={settings.reduceMotion} />
            </div>

            <div className="hb-a11y-stopka">
              <button className="hb-a11y-link" onClick={resetSettings} type="button"><RotateCcw aria-hidden="true" />Resetuj ustawienia</button>
              <button className="hb-a11y-link hb-a11y-mocny" onClick={() => setShowDeclaration(true)} type="button"><ShieldCheck aria-hidden="true" />{t('a11yDeclaration')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Deklaracja dostępności (EAA, WCAG 2.1 AA) */}
      {showDeclaration && (
        <div className="hb-a11y-tlo" onClick={(e) => { if (e.target === e.currentTarget) setShowDeclaration(false); }}>
          <div aria-labelledby="hb-dekl-tyt" aria-modal="true" className="hb-a11y hb-a11y-dekl" data-a11y-modal="true" role="dialog">
            <div className="hb-a11y-glowa">
              <span aria-hidden="true" className="hb-szklo hb-a11y-znak"><ShieldCheck /></span>
              <div><h3 id="hb-dekl-tyt">Deklaracja dostępności cyfrowej</h3><p>WCAG 2.1 AA · European Accessibility Act</p></div>
              <button aria-label="Zamknij deklarację" className="hb-szklo hb-a11y-x" onClick={() => setShowDeclaration(false)} type="button"><X /></button>
            </div>
            <p>
              Platforma edukacyjna <strong>HappyBirth</strong> (KLARSolutions sp. z o.o.) zobowiązuje się do zapewnienia dostępności swojej strony internetowej zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych oraz wytycznymi <strong>European Accessibility Act (EAA)</strong> i standardem <strong>WCAG 2.1 na poziomie AA</strong>.
            </p>
            <div className="hb-a11y-ramka">
              <h4>Zastosowane udogodnienia:</h4>
              <ul>
                <li>Pełna obsługa nawigacji za pomocą samej klawiatury (widoczny fokus).</li>
                <li>Transkrypcje tekstowe i napisy dla materiałów wideo w odtwarzaczu Cloudflare Stream.</li>
                <li>Możliwość powiększenia całej strony do 130% bez utraty struktury.</li>
                <li>Tryb wysokiego kontrastu oraz prosty krój pisma dla osób z dysleksją.</li>
                <li>Zatrzymanie animacji i ruchu, także karuzel i osi czasu.</li>
              </ul>
            </div>
            <p>W przypadku problemów z dostępnością strony prosimy o kontakt: <strong>kontakt@happybirth.pl</strong>. Zgłoszenia rozpatrujemy niezwłocznie.</p>
            <div className="hb-a11y-dol">
              <button className="hb-btn hb-btn-kup hb-maly-btn" onClick={() => setShowDeclaration(false)} type="button">Rozumiem</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
