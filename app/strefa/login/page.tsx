'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
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

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoadingProvider(provider);
    setErrorMessage(null);
    changeRole('student');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'mwspace@gmail.com' }),
      });
      const data = await res.json();
      if (data.devMagicLink) {
        window.location.href = data.devMagicLink;
        return;
      }
    } catch {}
    router.push('/strefa');
  };

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
            <Logo className="h-12 w-auto mx-auto object-contain" priority />
          </Link>
          <h1 className="font-brand-display font-bold text-3xl text-[#1A1512]">
            Strefa Kursantki
          </h1>
          <p className="text-sm text-[#544A44]">
            Zaloguj się, aby uzyskać dostęp do 52 lekcji VOD, personalizowanego harmonogramu i Licznika 5-1-1.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#EAE3DB] shadow-lg space-y-6">
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
              <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                Sprawdź swoją skrzynkę!
              </h3>
              <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                Wysłaliśmy bezpieczny Magic Link na adres <strong>{email}</strong>. Kliknij w link w mailu, aby natychmiast wejść do kursu bez podawania hasła.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleQuickDemo('student')}
                  className="w-full py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-md shadow-[#EC008C]/25"
                >
                  Przejdź od razu do panelu kursantki (Demo)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Przyciski Google i Apple ID */}
              <div className="space-y-2.5">
                {/* Apple ID */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={loadingProvider !== null}
                  className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.7-13.98-5.87-8.91-10.4-19.16-13.58-30.75-3.18-11.59-4.78-22.75-4.78-33.48 0-14.12 3.63-26.04 10.89-35.75 7.26-9.71 16.32-14.67 27.18-14.89 4.35 0 9.38 1.14 15.09 3.42 5.71 2.28 9.38 3.47 11.02 3.58 1.85 0 5.82-1.25 11.91-3.75 6.09-2.5 11.36-3.64 15.8-3.42 11.74.87 21.08 5.43 28.02 13.68-10.22 6.2-15.22 14.78-15 25.74.22 8.7 3.59 16.03 10.11 22 6.52 5.98 14.18 9.34 22.98 10.09-2.17 6.74-4.89 13.37-8.15 19.89zM119.22 31.09c0-7.17 2.61-13.91 7.82-20.22 5.22-6.3 11.74-10.22 19.56-11.74.65 1.74.98 3.48.98 5.22 0 7.17-2.72 14.02-8.15 20.54-5.43 6.52-12.06 10.33-19.89 11.41-.21-1.74-.32-3.47-.32-5.21z" />
                  </svg>
                  <span>{loadingProvider === 'apple' ? 'Łączenie z Apple ID...' : 'Kontynuuj z Apple ID'}</span>
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loadingProvider !== null}
                  className="w-full py-3 px-4 rounded-2xl border border-[#EAE3DB] bg-white hover:bg-[#FBF8F4] text-[#1A1512] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>{loadingProvider === 'google' ? 'Łączenie z kontem Google...' : 'Kontynuuj z kontem Google'}</span>
                </button>
              </div>

              {/* Rozdzielacz */}
              <div className="relative py-2 text-center text-[11px] text-[#867A72]">
                <span className="bg-white px-3 relative z-10 font-bold uppercase tracking-wider">LUB PRZEZ E-MAIL</span>
                <div className="absolute inset-0 top-1/2 border-t border-[#EAE3DB]" />
              </div>

              {/* Formularz Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                    Adres e-mail z zamówienia
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867A72]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj-email@domena.pl"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-[#EC008C]/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <span>Wyślij Magiczny Link do logowania</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Szybki dostęp demo */}
              <div className="pt-2">
                <div className="relative py-2 text-center text-[10px] text-[#867A72]">
                  <span className="bg-white px-2 relative z-10 font-medium uppercase tracking-wider">SZYBKI PODGLĄD DEMO</span>
                  <div className="absolute inset-0 top-1/2 border-t border-[#EAE3DB]" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="py-2.5 px-3 rounded-xl bg-[#FAE3EB] hover:bg-[#EC008C] text-[#EC008C] hover:text-white border border-[#F3CAD9] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Jako Kursantka</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('partner')}
                    className="py-2.5 px-3 rounded-xl bg-[#EAD5E5] hover:bg-[#98269C] text-[#98269C] hover:text-white border border-[#D5B8CF] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Jako Partner</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#EAE3DB] flex items-center justify-between text-xs text-[#867A72]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bezpieczne szyfrowanie SSL</span>
            </div>

            <BuyCourseButton className="text-[#EC008C] font-semibold hover:underline bg-transparent border-0 p-0 text-xs cursor-pointer shadow-none">
              Kup kurs (349 zł) &rarr;
            </BuyCourseButton>
          </div>
        </div>
      </div>
    </div>
  );
}
