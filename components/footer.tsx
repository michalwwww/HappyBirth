'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { ShieldCheck, Heart, ArrowUpRight, Sparkles, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { getMarketingTranslations } from '@/lib/marketing-i18n';

export function Footer() {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const partnerzyUrl = isDev ? '/partnerzy' : 'https://partnerzy.happybirth.pl';
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';
  const { lang } = useI18n();
  const t = getMarketingTranslations(lang);

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
                  {lang === 'pl' ? 'szkoła rodzenia online' : lang === 'en' ? 'online birthing school' : 'онлайн школа родов'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#EAD5E5]/75 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#EAD5E5]/90 pt-1">
              <Sparkles className="w-4 h-4 text-[#FCD705]" />
              <span>{t.footer.familyCount}</span>
            </div>

            {/* Social media links z wektorowymi ikonami */}
            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
              <a
                href="https://instagram.com/happybirth.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#EC008C] text-white transition-all font-medium group"
                aria-label="Instagram HappyBirth"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#FCD705] group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@happybirth_pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#00ADEF] text-white transition-all font-medium group"
                aria-label="TikTok HappyBirth"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#00ADEF] group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47 6.14 6.14 0 0 0 1.83-4.47V8.62a8.27 8.27 0 0 0 4.89 1.57V6.76c-.33 0-.66-.02-.99-.07z"/>
                </svg>
                <span>TikTok</span>
              </a>
              <a
                href="https://youtube.com/@happybirth_pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#ED1C24] text-white transition-all font-medium group"
                aria-label="YouTube HappyBirth"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#ED1C24] group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Kolumna 2: Nawigacja Kursu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a href="#filary" className="hover:text-white transition-colors">
                  {t.nav.links.pillars}
                </a>
              </li>
              <li>
                <a href="#etapy" className="hover:text-white transition-colors">
                  {t.nav.links.stages}
                </a>
              </li>
              <li>
                <a href="#narzedzia" className="hover:text-white transition-colors">
                  {t.nav.links.tools}
                </a>
              </li>
              <li>
                <a href="#cena" className="hover:text-white transition-colors">
                  {t.nav.links.price}
                </a>
              </li>
              <li>
                <a href={strefaUrl} className="hover:text-[#EC008C] transition-colors font-medium">
                  {t.nav.zoneBtn}
                </a>
              </li>
              <li>
                <a href={`${strefaUrl}/standard-medyczny`} className="hover:text-white transition-colors">
                  {lang === 'pl' ? 'Standard Rzetelnej Wiedzy' : lang === 'en' ? 'Evidence-Based Standard' : 'Медицинский стандарт'}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Współpraca B2B & Afiliacja */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dla Profesjonalistów
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a
                  href={partnerzyUrl}
                  className="hover:text-[#EC008C] transition-colors flex items-center gap-1 font-semibold text-white"
                >
                  <Users className="w-3.5 h-3.5 text-[#EC008C]" />
                  <span>Strefa Partnera (Program Afiliacyjny)</span>
                  <ArrowUpRight className="w-3 h-3 text-[#EC008C]" />
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Dla Położnych i Praktyk
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Dla Gabinetów i Fizjoterapeutek
                </a>
              </li>
              <li>
                <a href={partnerzyUrl} className="hover:text-white transition-colors">
                  Zamów bezpłatne materiały z kodem QR
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 4: Kontakt */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kontakt i pomoc
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD5E5]/80">
              <li>
                <a href="mailto:kontakt@happybirth.pl" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>kontakt@happybirth.pl</span>
                  <ArrowUpRight className="w-3 h-3 text-[#EC008C]" />
                </a>
              </li>
              <li>
                <span className="text-[#EAD5E5]/60">Dostęp aktywny 24/7 na telefonie i TV</span>
              </li>
              <li>
                <span className="text-[#EAD5E5]/60">Płatność jednorazowa BLIK / Karta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Notatka odpowiedzialności i dane prawne */}
        <div className="pt-6 border-t border-[#461643] text-xs text-[#EAD5E5]/60 space-y-3">
          <p>
            <strong className="text-white">
              {lang === 'pl' ? 'Charakter edukacyjny platformy (E-learning): ' : lang === 'en' ? 'Educational character (E-learning): ' : 'Образовательный характер платформы (E-learning): '}
            </strong>
            {t.footer.legalNote}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] text-[#EAD5E5]/50 border-t border-[#461643]/50">
            <div className="space-y-1 leading-relaxed">
              <div>
                Usługodawca: <strong>KLARSolutions sp. z o.o.</strong> · ul. Śląska 14, 60-614 Poznań · KRS: <strong>0001268396</strong> · NIP: <strong>7812118273</strong> · REGON: <strong>545782779</strong> · Kapitał zakładowy: 5 000,00 zł.
              </div>
              <div className="text-[10px] text-[#EAD5E5]/50">
                Sąd Rejonowy Poznań - Nowe Miasto i Wilda w Poznaniu, VIII Wydz. Gospodarczy KRS · © {new Date().getFullYear()} HappyBirth. Wszelkie prawa zastrzeżone.
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[#EAD5E5]/80">
              <Link href="/regulamin" className="hover:text-white transition-colors underline">
                Regulamin platformy
              </Link>
              <span>·</span>
              <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors underline">
                Polityka prywatności (RODO)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
