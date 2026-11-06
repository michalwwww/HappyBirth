'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/site/logo';
import { useCourseProgress } from '@/lib/progress';
import { BuyCourseButton } from '@/components/buy-button';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function StrefaLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
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
            router.push('/strefa?payment=success');
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
        if (data.devMagicLink) {
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

  const handleQuickDemo = async (role: 'student' | 'partner') => {
    changeRole(role);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: role === 'partner' ? 'partner@happybirth.pl' : 'mwspace@gmail.com' }),
      });
      const data = await res.json();
      if (data.devMagicLink) {
        window.location.href = data.devMagicLink;
        return;
      }
    } catch {}
    router.push('/strefa');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <Logo className="hb-strefa-logo-login" tytul="HappyBirth" />
          </Link>
          <h1 className="font-semibold text-3xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
            Strefa Rodziców
          </h1>
          <p className="text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
            Zaloguj się, aby uzyskać dostęp do 52 lekcji VOD, personalizowanego harmonogramu i Kreatora Planu Porodu.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] rounded-3xl p-8 border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] shadow-lg space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">
                Sprawdź swoją skrzynkę!
              </h3>
              <p className="text-xs sm:text-sm text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] leading-relaxed">
                Wysłaliśmy bezpieczny Magic Link na adres <strong>{email}</strong>. Kliknij w link w mailu, aby natychmiast wejść do kursu bez podawania hasła.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleQuickDemo('student')}
                  className="w-full py-3 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-xs font-semibold transition-all shadow-md shadow-[color:color-mix(in_srgb,var(--hb-mag)_25%,transparent)]"
                >
                  Wejdź od razu do panelu (Demo)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formularz Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] mb-1.5">
                    Adres e-mail z zamówienia
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj-email@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] focus:outline-none focus:ring-2 focus:ring-[color:var(--hb-mag)] text-sm text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-kosc)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingProvider === 'email'}
                  className="w-full py-3.5 rounded-full bg-[color:var(--hb-mag)] hover:bg-[color:var(--hb-mag-h)] text-[color:var(--hb-cta-ink)] text-sm font-semibold transition-all shadow-md shadow-[color:color-mix(in_srgb,var(--hb-mag)_25%,transparent)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

              {/* Szybki Dostęp Demo */}
              <div className="pt-4 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] space-y-2">
                <div className="text-[11px] text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] text-center relative">
                  <span className="bg-[color:var(--hb-karta)] dark:bg-[color:var(--hb-karta)] px-2 relative z-10 font-medium uppercase tracking-wider">SZYBKI PODGLĄD DEMO</span>
                  <div className="absolute inset-0 top-1/2 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="py-2.5 px-3 rounded-xl bg-[color:var(--hb-p1l)] dark:bg-[color:var(--hb-p1l)] hover:bg-[color:var(--hb-mag)] text-[color:var(--hb-mag-t)] hover:text-[color:var(--hb-cta-ink)] border border-[color:color-mix(in_srgb,var(--hb-p1)_40%,transparent)] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Dla Mamy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('partner')}
                    className="py-2.5 px-3 rounded-xl bg-[color:var(--hb-p2l)] dark:bg-[#3A321C] hover:bg-[color:var(--hb-p2)] dark:hover:bg-[color:var(--hb-p2t)] text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] hover:text-[color:var(--hb-ink)] dark:hover:text-[color:var(--hb-ink)] border border-[color:color-mix(in_srgb,var(--hb-p2)_50%,transparent)] dark:border-[color:color-mix(in_srgb,var(--hb-p2t)_50%,transparent)] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dla Taty</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] flex items-center justify-between text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bezpieczne szyfrowanie SSL</span>
            </div>

            <BuyCourseButton className="text-[color:var(--hb-mag-t)] font-semibold hover:underline bg-transparent border-0 p-0 text-xs cursor-pointer shadow-none">
              Kup kurs (489 zł) &rarr;
            </BuyCourseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
