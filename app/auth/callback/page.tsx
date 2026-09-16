'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCourseProgress } from '@/lib/progress';
import { Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { changeRole } = useCourseProgress();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMsg(errorDescription || error || 'Wystąpił błąd podczas autoryzacji.');
      return;
    }

    const token = searchParams.get('token');
    const nextUrl = searchParams.get('next') || '/strefa';

    if (token) {
      window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}`;
      return;
    }

    changeRole('student');
    router.replace(nextUrl);
  }, [searchParams, router, changeRole]);

  if (errorMsg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-brand-display font-bold text-xl text-[#1A1512]">
            Nie udało się zalogować
          </h2>
          <p className="text-xs text-[#544A44] leading-relaxed">
            {errorMsg}
          </p>
          <div className="pt-2">
            <Link
              href="/strefa/login"
              className="inline-block px-6 py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-md shadow-[#EC008C]/25"
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
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EAE3DB] shadow-lg text-center space-y-5">
        <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#FAE3EB] border-t-[#EC008C] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#EC008C]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-brand-display font-bold text-xl text-[#1A1512]">
            Logowanie do Strefy Rodziców...
          </h2>
          <p className="text-xs text-[#544A44]">
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
          <div className="w-10 h-10 rounded-full border-4 border-[#FAE3EB] border-t-[#EC008C] animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
