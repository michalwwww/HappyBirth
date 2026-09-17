import React from 'react';
import { stageToken, StageKey } from '@/lib/brand';

/**
 * Dziewięć symboli etapów HAPPYBIRTH (paczka marki, assets/symbole-etapow.svg).
 * Zasady rysowania: kształty pełne, nigdy konturowe (jedyny wyjątek to uchwyt torby),
 * zaokrąglone zakończenia, zero cieni i gradientów, lekka asymetria dozwolona.
 *
 * Symbole dziedziczą kolor przez currentColor. Sprite renderowany raz w layoucie,
 * ikony używają <use href="#sy-..."/>, więc ścieżki nie powtarzają się w HTML.
 */

const SYMBOLS: Record<StageKey, React.ReactNode> = {
  zanim: (
    <>
      <circle cx="22" cy="50" r="9" />
      <circle cx="50" cy="50" r="9" />
      <circle cx="78" cy="50" r="9" />
    </>
  ),
  dwiekreski: (
    <>
      <rect x="26" y="22" width="13" height="56" rx="6.5" />
      <rect x="61" y="22" width="13" height="56" rx="6.5" />
    </>
  ),
  lepiej: (
    <>
      <circle cx="50" cy="50" r="19" />
      <g>
        <rect x="46" y="6" width="8" height="15" rx="4" />
        <rect x="46" y="79" width="8" height="15" rx="4" />
        <rect x="6" y="46" width="15" height="8" rx="4" />
        <rect x="79" y="46" width="15" height="8" rx="4" />
        <rect x="46" y="6" width="8" height="15" rx="4" transform="rotate(45 50 50)" />
        <rect x="46" y="79" width="8" height="15" rx="4" transform="rotate(45 50 50)" />
        <rect x="6" y="46" width="15" height="8" rx="4" transform="rotate(45 50 50)" />
        <rect x="79" y="46" width="15" height="8" rx="4" transform="rotate(45 50 50)" />
      </g>
    </>
  ),
  torba: (
    <>
      <path d="M34 30h-8a3 3 0 0 0-3 2.6L15 82a4 4 0 0 0 4 4.5h62a4 4 0 0 0 4-4.5l-8-49.4A3 3 0 0 0 74 30H34z" />
      <path d="M36 32V24a14 14 0 0 1 28 0v8" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </>
  ),
  boli: (
    <>
      <path d="M6 62c9 0 11-26 20-26s11 26 20 26 11-38 20-38" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="86" cy="30" r="10" />
    </>
  ),
  planb: <path d="M58 6 26 52h20L40 94l34-50H52z" />,
  pierwszanoc: (
    <path fillRule="evenodd" d="M50 6a44 44 0 1 0 0 88 44 44 0 0 1 0-88zm10 8a36 36 0 1 1 0 72 36 36 0 0 0 0-72z" />
  ),
  karmienie: <path d="M50 8c14 20 28 33 28 48a28 28 0 0 1-56 0C22 41 36 28 50 8z" />,
  niespi: (
    <>
      <path d="M38 8c3 18 8 23 26 26-18 3-23 8-26 26-3-18-8-23-26-26 18-3 23-8 26-26z" />
      <path d="M76 52c2 12 5 15 17 17-12 2-15 5-17 17-2-12-5-15-17-17 12-2 15-5 17-17z" />
    </>
  ),
};

/** Sprite z dziewięcioma symbolami. Renderować raz, w layoucie. */
export function StageSymbolSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      {(Object.keys(SYMBOLS) as StageKey[]).map((key) => (
        <symbol key={key} id={`sy-${key}`} viewBox="0 0 100 100">
          {SYMBOLS[key]}
        </symbol>
      ))}
    </svg>
  );
}

/** Symbol etapu bez sprite'a (np. w e-mailach lub poza layoutem). */
export function StageSymbolInline({ stage, className = 'w-10 h-10' }: { stage: string; className?: string }) {
  const key = stageToken(stage).key;
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={`sym ${className}`} aria-hidden="true">
      {SYMBOLS[key]}
    </svg>
  );
}

export function StageIcon({
  id,
  name,
  className = 'w-10 h-10',
  inline = false,
}: {
  id?: string;
  name?: string;
  className?: string;
  /** Wymuś ścieżki inline zamiast <use> */
  inline?: boolean;
}) {
  const raw = (id || name || '').toLowerCase().replace(/^(s-|e-)/, '').replace(/-/g, '');
  const aliases: Record<string, StageKey> = {
    '01': 'zanim', stage01: 'zanim', zanim: 'zanim',
    '02': 'dwiekreski', stage02: 'dwiekreski', dwiekreski: 'dwiekreski',
    '03': 'lepiej', stage03: 'lepiej', lepiej: 'lepiej', wreszcielepiej: 'lepiej',
    '04': 'torba', stage04: 'torba', torba: 'torba', torbaspakowana: 'torba',
    '05': 'boli', stage05: 'boli', boli: 'boli', kiedyzaczniebolec: 'boli', zaczelosie: 'boli',
    '06': 'planb', stage06: 'planb', planb: 'planb', gdyplansieposypie: 'planb',
    '07': 'pierwszanoc', stage07: 'pierwszanoc', pierwszanoc: 'pierwszanoc', pierwszanocwdomu: 'pierwszanoc',
    '08': 'karmienie', stage08: 'karmienie', karmienie: 'karmienie',
    '09': 'niespi', stage09: 'niespi', niespi: 'niespi',
  };
  const key = aliases[raw];
  if (!key) return null;

  if (inline) return <StageSymbolInline stage={key} className={className} />;

  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={`sym ${className}`} aria-hidden="true">
      <use href={`#sy-${key}`} />
    </svg>
  );
}
