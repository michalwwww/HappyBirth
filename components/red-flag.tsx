import React from 'react';

/**
 * Moduł red flag. Stała, rozpoznawalna forma, pojawia się wszędzie tam,
 * gdzie tekst dotyka objawu. To komponent, nie akapit.
 * Rejestr PRACA: bez ilustracji, bez koloru etapu, bez logotypu.
 */
export function RedFlag({
  title = 'Kiedy nie oglądasz lekcji, tylko dzwonisz',
  items,
  footer = 'W każdej z tych sytuacji jedź natychmiast na izbę przyjęć albo dzwoń pod 112 lub 999.',
  className = '',
}: {
  title?: string;
  items: string[];
  footer?: string;
  className?: string;
}) {
  return (
    <aside className={`redflag ${className}`} role="note" aria-label="Sygnały alarmowe">
      <div className="flex items-center gap-2.5 text-alarm">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-alarm" aria-hidden="true" />
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]">Sygnał alarmowy</span>
      </div>
      <h3 className="mt-2 text-[22px] leading-tight">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-[16px] leading-snug text-ink-2 list-disc pl-5 marker:text-alarm">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      {footer ? <p className="mt-3 text-[16px] font-semibold text-ink">{footer}</p> : null}
    </aside>
  );
}
