import React from 'react';
import { LOGO_PATHS, LOGO_VIEWBOX, SYGNET_VIEWBOX } from './brand/logo-paths';

/**
 * Logotyp HAPPYBIRTH, wersja trzecia. Inline SVG, bez zapytań sieciowych.
 *
 * Reguły znaku (paczka marki, 02-system-wizualny.md):
 *  - pełny znak: minimum 120 px szerokości na ekranie, poniżej wyłącznie sygnet
 *  - pełny znak kolorowy stoi tylko na papierze, bieli albo atramencie, nigdy na własnych kolorach
 *  - na tłach barwnych obowiązuje wersja mono (currentColor)
 *  - na stronie: kolor tylko w nawigacji, mono tylko w stopce
 */
export type LogoVariant = 'color' | 'mono' | 'sygnet';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  /** Ukryj przed czytnikami ekranu, gdy obok jest tekstowa nazwa marki */
  decorative?: boolean;
  /** Zachowane dla zgodności ze starszym API (next/image). Bez efektu. */
  width?: number;
  height?: number;
  priority?: boolean;
}

let maskCounter = 0;

export function Logo({ className = 'h-11 w-auto', variant = 'color', decorative = false }: LogoProps) {
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img' as const, 'aria-label': 'HAPPYBIRTH' };

  if (variant === 'sygnet') {
    return (
      <svg viewBox={SYGNET_VIEWBOX} className={className} {...a11y}>
        {LOGO_PATHS.filter((p) => p.name === 'cyan').map((p, i) => (
          <path key={i} fill="currentColor" d={p.d} />
        ))}
      </svg>
    );
  }

  if (variant === 'mono') {
    const id = `hb-mono-${(maskCounter = (maskCounter + 1) % 1000)}`;
    const holes = LOGO_PATHS.filter((p) => p.name === 'white');
    const letters = LOGO_PATHS.filter((p) => p.name !== 'white');
    return (
      <svg viewBox={LOGO_VIEWBOX} className={className} {...a11y}>
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x="120.5" y="49.78" width="590.94" height="478.96">
            <rect x="120.5" y="49.78" width="590.94" height="478.96" fill="#fff" />
            {holes.map((p, i) => (
              <path key={i} fill="#000" d={p.d} />
            ))}
          </mask>
        </defs>
        <g fill="currentColor" mask={`url(#${id})`}>
          {letters.map((p, i) => (
            <path key={i} d={p.d} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} {...a11y}>
      {LOGO_PATHS.map((p, i) => (
        <path key={i} fill={p.fill} d={p.d} />
      ))}
    </svg>
  );
}
