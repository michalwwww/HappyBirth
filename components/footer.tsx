'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { useSiteUrls } from '@/lib/site-urls';
import { footer as t } from '@/components/landing/content';

/**
 * Stopka. Rejestr PRACA: znak mono, disclaimer, fraza domknięcia „Dobrze, że jesteś.”
 * Jedyne miejsce na stronie ze znakiem mono. Bez drugiego logotypu obok.
 */
export function Footer() {
  const urls = useSiteUrls();

  const resolve = (href: string) => {
    if (href === 'partnerzy') return urls.partnerzy;
    if (href.startsWith('strefa:')) return urls.strefaPath(href.slice('strefa:'.length));
    return href;
  };

  return (
    <footer className="bg-ink text-paper">
      <div className="wrap pt-16 pb-10 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo variant="mono" className="w-[132px] h-auto text-paper" />
            <p className="se mt-8 text-[40px] sm:text-[48px] leading-none text-paper">{t.closing}</p>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">{t.disclaimer}</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {t.columns.map((col) => (
              <div key={col.title}>
                <div className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-paper/65">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => {
                    const href = resolve(l.href);
                    const external = href.startsWith('http') || href.startsWith('mailto:');
                    return (
                      <li key={l.label}>
                        {external ? (
                          <a
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-[16px] text-paper/85 hover:text-paper transition-colors"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <a href={href} className="text-[16px] text-paper/85 hover:text-paper transition-colors">
                            {l.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/15 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13.5px] text-paper/65">
          <p>
            {t.company} · © {new Date().getFullYear()} HAPPYBIRTH
          </p>
          <div className="flex items-center gap-5">
            {t.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-paper transition-colors underline underline-offset-4 decoration-paper/30">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
