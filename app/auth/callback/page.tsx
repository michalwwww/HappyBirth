'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMsg(errorDescription || error || 'Wystąpił błąd podczas autoryzacji.');
      return;
    }

    const token = searchParams.get('token');
    if (token) {
      window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}`;
      return;
    }

    router.replace('/strefa/login');
  }, [searchParams, router]);

  if (errorMsg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#2C2240] rounded-3xl p-8 border border-rose-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-brand-display font-bold text-xl text-[#4A3A5E] dark:text-[#F4EEF7]">
            Nie udało się zalogować
          </h2>
          <p className="text-xs text-[#6E5C7D] dark:text-[#D5CAE0] leading-relaxed">
            {errorMsg}
          </p>
          <div className="pt-2">
            <Link
              href="/strefa/login"
              className="inline-block px-6 py-3 rounded-full bg-[#DA0271] hover:bg-[#C00265] text-white text-xs font-semibold transition-all shadow-md shadow-[#DA0271]/25"
            >
              Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#2C2240] rounded-3xl p-8 border border-[#EADFD3] dark:border-[#3B3050] shadow-lg text-center space-y-5">
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#F9E6EC] dark:border-[#3A2033] border-t-[#DA0271] animate-spin" />
          <Sparkles className="w-6 h-6 text-[color:var(--hb-mag-t)]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-brand-display font-bold text-xl text-[#4A3A5E] dark:text-[#F4EEF7]">
            Logowanie do Strefy Rodziców...
          </h2>
          <p className="text-xs text-[#6E5C7D] dark:text-[#D5CAE0]">
            Trwa bezpieczna weryfikacja Twojej sesji. Za chwilę nastąpi przekierowanie.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#F9E6EC] dark:border-[#3A2033] border-t-[#DA0271] animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
