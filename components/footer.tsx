import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#20071F] text-[#EAD5E5] border-t border-[#461643] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Kolumna 1: Brand & Misja */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-white/95 rounded-xl inline-block shadow-sm">
                <Logo className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-brand-display font-bold text-xl tracking-tight text-white leading-none">
                  HAPPYBIRTH
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#EC008C] tracking-wider mt-0.5">
                  strefa.happybirth.pl
                </span>
              </div>
            </div>
            <p className="text-xs text-[#EAD5E5]/75 leading-relaxed">
              Szkoła rodzenia online dla przyszłych mam i partnerów. 52 profesjonalne lekcje wideo w 4K, 9 uspokajających etapów, Cyfrowa Apteczka Porodowa i wsparcie na sali porodowej.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#EAD5E5]/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hosting wideo Cloudflare Stream (CDN Warszawa)</span>
            </div>
          </div>

          {/* Kolumna 2: Nawigacja Kursu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Strefa kursantki
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <Link href="/#etapy" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>9 Etapów ciąży i porodu</span>
                </Link>
              </li>
              <li>
                <Link href="/lekcje" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Katalog 52 lekcji VOD</span>
                </Link>
              </li>
              <li>
                <Link href="/apteczka" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Cyfrowa Apteczka Porodowa</span>
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Dla Partnera (Rola taty)</span>
                </Link>
              </li>
              <li>
                <Link href="/licznik" className="hover:text-[#EC008C] transition-colors flex items-center gap-1 font-medium">
                  <span>Licznik skurczów 5-1-1</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Zasady & Bezpieczeństwo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Model i uprawnienia
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>Jednorazowa opłata: <strong className="text-white">349 zł</strong></li>
              <li>Dostęp: <strong className="text-white">12 miesięcy od terminu porodu</strong></li>
              <li>Dla dwojga: Partner bez dodatkowych opłat</li>
              <li>Płatności: Stripe (BLIK, Karta, Apple Pay)</li>
              <li>Bezpieczna subdomena: <span className="text-[#EC008C] font-mono">strefa.happybirth.pl</span></li>
            </ul>
          </div>

          {/* Kolumna 4: Kontakt i Social Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Społeczność i kontakt
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a href="mailto:kontakt@happybirth.pl" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Napisz do nas: kontakt@happybirth.pl</span>
                  <ArrowUpRight className="w-3 h-3 text-[#EC008C]" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Notatka medyczna z Netlify */}
        <div className="pt-6 border-t border-[#461643] text-xs text-[#EAD5E5]/60 space-y-2">
          <p>
            <strong className="text-white">Treści mają charakter edukacyjny i nie stanowią porady medycznej, diagnozy ani zalecenia terapeutycznego.</strong> Nie zastępują konsultacji z lekarzem prowadzącym ciążę ani z położną.
          </p>
          <p>
            W przypadku krwawienia, odpływania wód płodowych, silnego bólu głowy z mroczkami przed oczami, nagłych obrzęków lub braku ruchów dziecka skontaktuj się natychmiast z ochroną zdrowia lub jedź do szpitala. Numer alarmowy: <strong>112</strong>.
          </p>
          <p className="text-[11px] text-[#EAD5E5]/40 pt-2">
            Program zgodny ze standardem organizacyjnym opieki okołoporodowej i wytycznymi PTGiP. © {new Date().getFullYear()} HappyBirth. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
