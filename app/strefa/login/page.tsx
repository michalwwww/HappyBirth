'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useCourseProgress } from '@/lib/progress';
import { BuyCourseButton } from '@/components/buy-button';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function StrefaLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { changeRole } = useCourseProgress();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setErrorMessage(decodeURIComponent(err));
    }

    const token = params.get('token');
    const emailParam = params.get('email') || '';
    const redirectParam = params.get('redirect') || '';
    const isSafeRedirect = redirectParam.startsWith('/') && !redirectParam.startsWith('//');
    const isStrefaHost = window.location.hostname.startsWith('strefa.');
    const defaultTarget = isStrefaHost ? '/' : '/strefa';

    if (token) {
      setLoadingProvider('email');
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: emailParam }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            changeRole('student');
            try {
              localStorage.setItem('hb_unlocked', 'true');
            } catch {}
            window.location.href = isSafeRedirect ? redirectParam : defaultTarget;
          } else {
            setErrorMessage(data.error || 'Link logowania wygasł lub został już wykorzystany.');
            setLoadingProvider(null);
          }
        })
        .catch(() => {
          setErrorMessage('Wystąpił błąd podczas weryfikacji linku logowania.');
          setLoadingProvider(null);
        });
    }
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);
    setLoadingProvider('email');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Wystąpił błąd podczas wysyłania linku.');
      } else {
        if (data.devMagicLink && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          window.location.href = data.devMagicLink;
          return;
        }
        setSent(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Wystąpił błąd połączenia.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <a href="https://happybirth.pl/" className="inline-block">
            <Logo className="h-12 w-auto mx-auto object-contain" priority />
          </a>
          <h1 className="font-semibold text-3xl text-[#4A3A5E] dark:text-[#FBF8F4]">
            Strefa Rodziców
          </h1>
          <p className="text-sm text-[#544A44] dark:text-[#D7CCC3]">
            Zaloguj się adresem e-mail z zamówienia, aby uzyskać dostęp do 52 lekcji VOD 4K i narzędzi okołoporodowych.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFDFA] dark:bg-[#1C081A] rounded-3xl p-8 border border-[#EADFD3] dark:border-[#3D0E39] shadow-lg space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl text-[#4A3A5E] dark:text-[#FBF8F4]">
                Sprawdź swoją skrzynkę!
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                Wysłaliśmy bezpieczny jednorazowy link logowania na adres <strong>{email}</strong>. Kliknij w link w wiadomości, aby wejść do kursu bez podawania hasła.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setErrorMessage(null);
                }}
                className="text-xs font-semibold text-[#DA0271] hover:underline cursor-pointer"
              >
                Wpisz inny adres e-mail
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#D7CCC3] mb-1.5">
                    Adres e-mail z zamówienia
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867A72]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj-email@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EADFD3] dark:border-[#3D0E39] focus:outline-none focus:ring-2 focus:ring-[#DA0271] text-sm text-[#2A2421] dark:text-white bg-[#FDFAF6] dark:bg-[#250A24]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingProvider === 'email'}
                  className="w-full py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B90260] text-white text-sm font-semibold transition-all shadow-md shadow-[#DA0271]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'email' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Wyślij bezpieczny link logowania</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="pt-4 border-t border-[#EADFD3] dark:border-[#3D0E39] flex items-center justify-between text-xs text-[#867A72] dark:text-[#C4ADC0]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bezpieczne szyfrowanie SSL</span>
            </div>

            <BuyCourseButton className="text-[#DA0271] font-semibold hover:underline bg-transparent border-0 p-0 text-xs cursor-pointer shadow-none">
              Kup kurs (489 zł) &rarr;
            </BuyCourseButton>
          </div>

          <div className="text-center">
            <Link
              href="https://happybirth.pl/#bezplatna-lekcja"
              className="text-xs text-[#867A72] dark:text-[#C4ADC0] hover:text-[#DA0271] underline"
            >
              Chcesz najpierw zobaczyć bezpłatną lekcję próbną? Przejdź na happybirth.pl &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
