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

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setErrorMessage(decodeURIComponent(err));
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
              {/* Formularz Magic Link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
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
