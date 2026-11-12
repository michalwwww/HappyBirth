'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BuyButtonProps {
  className?: string;
  children?: React.ReactNode;
  courseId?: string;
}

export function BuyCourseButton({
  className = 'w-full py-4 rounded-full bg-[color:var(--hb-zol)] hover:bg-[color:var(--hb-p2)] text-[color:var(--hb-pil-ink)] font-bold text-base transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2',
  children,
}: BuyButtonProps) {
  const handleNavigateToCheckout = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        const el = document.getElementById('cena');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = '/#cena';
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigateToCheckout}
      className={className}
    >
      {children ? (
        children
      ) : (
        <>
          <span>Kup dostęp · 489,00 zł (BLIK / Karta)</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
