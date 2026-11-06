// Ikony liniowe strony v3: zaokrąglone końcówki, grubość 2, pasują do Nunito.
import React from 'react';

type P = React.SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IconTarcza = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l7.5 3v5.6c0 4.4-3.1 8.2-7.5 9.4-4.4-1.2-7.5-5-7.5-9.4V6L12 3z" /><path d="M8.6 12.2l2.4 2.4 4.4-4.6" /></svg>
);
export const IconOsoba = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="8.2" r="3.7" /><path d="M4.8 20.2c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6" /></svg>
);
export const IconKsiezyc = (p: P) => (
  <svg {...base} {...p}><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6z" /></svg>
);
export const IconSlonce = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.6v2.1M12 19.3v2.1M4.7 4.7l1.5 1.5M17.8 17.8l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.7 19.3l1.5-1.5M17.8 6.2l1.5-1.5" /></svg>
);
export const IconDostep = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="4.6" r="1.8" /><path d="M4.5 8.4l7.5 1.6 7.5-1.6M12 10v4.4M8.6 21l3.4-6.6 3.4 6.6" /></svg>
);
export const IconMenu = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconZamknij = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconLupa = (p: P) => (
  <svg {...base} {...p}><circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.6 15.6L20.4 20.4" /></svg>
);
export const IconPauza = (p: P) => (
  <svg {...base} {...p}><path d="M9 6v12M15 6v12" /></svg>
);
export const IconGraj = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M8 5.6v12.8c0 .8.9 1.3 1.6.8l9.4-6.4c.6-.4.6-1.2 0-1.6L9.6 4.8C8.9 4.3 8 4.8 8 5.6z" /></svg>
);
export const IconStrzalka = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5" /></svg>
);
export const IconKoszyk = (p: P) => (
  <svg {...base} {...p}><path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
);
export const IconUstawienia = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2.2" /><circle cx="9" cy="17" r="2.2" /></svg>
);
export const IconStrzalkaDol = (p: P) => (
  <svg {...base} {...p}><path d="M6.5 9.5L12 15l5.5-5.5" /></svg>
);

// Koło zębate Ustawień (runda X1): osiem zębów i otwór w środku, ta sama kreska co pozostałe ikony
export const IconKolo = (p: P) => (
  <svg {...base} {...p}>
    <path d="M10.3 2.6h3.4l.5 2.6a7.4 7.4 0 0 1 1.9 1.1l2.5-.9 1.7 2.9-2 1.7a7.5 7.5 0 0 1 0 2.2l2 1.7-1.7 2.9-2.5-.9a7.4 7.4 0 0 1-1.9 1.1l-.5 2.6h-3.4l-.5-2.6a7.4 7.4 0 0 1-1.9-1.1l-2.5.9-1.7-2.9 2-1.7a7.5 7.5 0 0 1 0-2.2l-2-1.7 1.7-2.9 2.5.9a7.4 7.4 0 0 1 1.9-1.1l.5-2.6z" />
    <circle cx="12" cy="12" r="2.9" />
  </svg>
);
// uśmiech na przycisku DOŁĄCZAM DZISIAJ: okrągła buźka w kolorze napisu
export const IconUsmiech = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.2" /><path d="M8 14.2c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3" /><path d="M9 9.6v.6M15 9.6v.6" strokeWidth={2.6} /></svg>
);
// flagi w kółku (wybór języka w nagłówku): małe, z cienkim obrysem
export function Flaga({ kod }: { kod: 'pl' | 'en' | 'ru' }) {
  return (
    <svg aria-hidden="true" className="hb-flaga-svg" viewBox="0 0 24 24">
      {/* okrągły kształt daje CSS (border-radius na hb-flaga-svg), bez clipPath i powtarzanych id */}
      <g>
        {kod === 'pl' && (<><rect fill="#FFFFFF" height="12" width="24" /><rect fill="#DC143C" height="12" width="24" y="12" /></>)}
        {kod === 'ru' && (<><rect fill="#FFFFFF" height="8" width="24" /><rect fill="#0039A6" height="8" width="24" y="8" /><rect fill="#D52B1E" height="8" width="24" y="16" /></>)}
        {kod === 'en' && (
          <>
            <rect fill="#012169" height="24" width="24" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.8" />
            <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
          </>
        )}
      </g>
    </svg>
  );
}
