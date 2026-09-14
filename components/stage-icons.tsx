import React from 'react';

export function StageIcon({
  id,
  name,
  className = "w-10 h-10",
}: {
  id?: string;
  name?: string;
  className?: string;
}) {
  const raw = (id || name || '').toLowerCase().replace(/^(stage-|s-|e-)/, '');

  switch (raw) {
    case '01':
    case 'zanim':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <circle cx="22" cy="50" r="9" />
          <circle cx="50" cy="50" r="13" />
          <circle cx="80" cy="50" r="7" />
        </svg>
      );
    case '02':
    case 'dwiekreski':
    case 'dwie-kreski':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <rect x="30" y="16" width="14" height="68" rx="7" />
          <rect x="58" y="22" width="13" height="62" rx="6.5" />
        </svg>
      );
    case '03':
    case 'lepiej':
    case 'wreszcie-lepiej':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <circle cx="50" cy="50" r="21" />
          <g stroke="currentColor" strokeWidth="8.5" strokeLinecap="round" fill="none">
            <path d="M 78.5 50.0 L 90.0 50.0" />
            <path d="M 70.2 70.2 L 78.3 78.3" />
            <path d="M 50.0 78.5 L 50.0 90.0" />
            <path d="M 29.8 70.2 L 21.7 78.3" />
            <path d="M 21.5 50.0 L 10.0 50.0" />
            <path d="M 29.8 29.8 L 21.7 21.7" />
            <path d="M 50.0 21.5 L 50.0 10.0" />
            <path d="M 70.2 29.8 L 78.3 21.7" />
          </g>
        </svg>
      );
    case '04':
    case 'torba':
    case 'torba-spakowana':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path d="M 33 38 v -6 a 17 17 0 0 1 34 0 v 6" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
          <path d="M 14 40 h 72 a 6 6 0 0 1 6 6.6 l -5 36 a 12 12 0 0 1 -12 10.4 h -50 a 12 12 0 0 1 -12 -10.4 l -5 -36 a 6 6 0 0 1 6 -6.6 z" />
        </svg>
      );
    case '05':
    case 'boli':
    case 'kiedy-zacznie-bolec':
    case 'zaczelo-sie':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path d="M 8 62 Q 25 26 42 62 T 76 62" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
          <circle cx="88" cy="62" r="7" />
        </svg>
      );
    case '06':
    case 'planb':
    case 'gdy-plan-sie-posypie':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path d="M 58 8 L 26 50 L 48 50 L 40 92 L 76 46 L 53 46 Z" />
        </svg>
      );
    case '07':
    case 'pierwszanoc':
    case 'pierwsza-noc':
    case 'pierwsza-noc-w-domu':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M12 50a38 38 0 1 0 76 0a38 38 0 1 0-76 0 M36 45a32 32 0 1 0 64 0a32 32 0 1 0-64 0" />
        </svg>
      );
    case '08':
    case 'karmienie':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path d="M 50 10 C 68 34 80 47 80 60 a 30 30 0 0 1 -60 0 C 20 47 32 34 50 10 Z" />
        </svg>
      );
    case '09':
    case 'niespi':
    case 'nie-spi':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
          <path d="M 30 12 C 34 30 42 38 60 42 C 42 46 34 54 30 72 C 26 54 18 46 0 42 C 18 38 26 30 30 12 Z" transform="translate(6,4)" />
          <path d="M 76 46 C 78 57 83 62 94 64 C 83 66 78 71 76 82 C 74 71 69 66 58 64 C 69 62 74 57 76 46 Z" />
        </svg>
      );
    default:
      return null;
  }
}
