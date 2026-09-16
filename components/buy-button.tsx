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
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
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
