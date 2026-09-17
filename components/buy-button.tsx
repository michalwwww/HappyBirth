'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface BuyButtonProps {
  className?: string;
  children?: React.ReactNode;
  courseId?: string;
}

/**
 * Przycisk zakupu: tworzy sesję Stripe Checkout i przekierowuje.
 * Błąd pokazujemy pod przyciskiem, bez alertów przeglądarki.
 */
export function BuyCourseButton({
  className = 'btn btn-primary',
  children,
  courseId = 'kurs-glowny-happybirth',
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
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
        setError(data.error || 'Nie udało się uruchomić płatności. Spróbuj ponownie za chwilę.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Błąd checkoutu:', err);
      setError('Brak połączenia z bramką płatności. Sprawdź internet i spróbuj ponownie.');
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={handleCheckout} disabled={loading} className={className} aria-busy={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Łączę z płatnością</span>
          </>
        ) : children ? (
          children
        ) : (
          <>
            <span>Kup dostęp · BLIK / karta</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>
      {error ? (
        <span role="alert" className="block basis-full text-[14px] leading-snug text-alarm">
          {error}
        </span>
      ) : null}
    </>
  );
}
