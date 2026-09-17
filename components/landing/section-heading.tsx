import React from 'react';

/**
 * Nagłówek sekcji: etykieta, tytuł z ostatnim słowem w szeryfie, lead.
 * Wzorzec przełamania nagłówka zaakceptowany w paczce marki:
 * ostatnie słowo w <em class="se">, reszta w kroju displayowym.
 */
export function SectionHeading({
  eyebrow,
  titleStart,
  titleAccent,
  lead,
  align = 'left',
  as: Tag = 'h2',
  size = 'section',
  className = '',
}: {
  eyebrow?: string;
  titleStart: string;
  titleAccent: string;
  lead?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display' | 'section';
  className?: string;
}) {
  const alignCls = align === 'center' ? 'text-center mx-auto items-center' : '';
  return (
    <div className={`flex flex-col gap-4 max-w-[46ch] ${alignCls} ${className}`}>
      {eyebrow ? <span className="eyebrow r">{eyebrow}</span> : null}
      <Tag className={`${size === 'display' ? 'h-display' : 'h-section'} r`}>
        {titleStart} <em className="se">{titleAccent}</em>
      </Tag>
      {lead ? <p className="lead r max-w-[52ch]">{lead}</p> : null}
    </div>
  );
}
