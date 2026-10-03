'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface BuyButtonProps {
  className?: string;
  children?: React.ReactNode;
  courseId?: string;
}

export function BuyCourseButton({
  className = 'w-full py-4 rounded-full bg-[#FCD705] hover:bg-[#ffe338] text-[#1A1512] font-bold text-base transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed',
  children,
  courseId = 'kurs-glowny-happybirth',
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Zbierz parametry śledzenia i atrybucji marketingowej z URL oraz pamięci sesji
      let utmParams: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id', 'fbclid', 'gclid', 'ref'];
        
        // Odczytaj najnowsze z URL
        keys.forEach((key) => {
          const val = urlParams.get(key);
          if (val) {
            utmParams[key] = val;
            try {
              sessionStorage.setItem(`hb_${key}`, val);
            } catch (_) {}
          }
        });

        // Jeśli brak w URL, odczytaj wcześniej zapamiętane w sesji
        keys.forEach((key) => {
          if (!utmParams[key]) {
            try {
              const saved = sessionStorage.getItem(`hb_${key}`);
              if (saved) utmParams[key] = saved;
            } catch (_) {}
          }
        });
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          utm: utmParams,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Wystąpił problem przy inicjalizacji płatności.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Błąd checkoutu:', err);
      alert('Nie udało się połączyć z bramką płatności.');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Łączenie ze Stripe...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          <span>Kup dostęp · BLIK / Karta</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
