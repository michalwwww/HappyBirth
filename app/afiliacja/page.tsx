'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { AffiliateAdminPanel } from '@/components/affiliate-admin-panel';
import {
  generateSmartPartnerCodeCandidates,
  TEAM_FLAGSHIP_CODES,
} from '@/lib/brand-codes';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  Lock,
  Building2,
  Copy,
  Check,
  Wallet,
  TrendingUp,
  Link2,
  QrCode,
  FileText,
  LogOut,
  LogIn,
  RefreshCw,
  ExternalLink,
  Printer,
  Share2,
  CreditCard,
  Mail,
  BookOpen,
} from 'lucide-react';

interface AffiliateProfile {
  id: string;
  email: string;
  fullName: string;
  roleCategory: 'midwife_physio' | 'creator_publisher' | 'standard';
  specialization: string;
  profileUrl: string;
  promoCode: string;
  refSlug: string;
  tier1Rate: number;
  tier1RatePercent: number;
  tier2OverrideRatePercent: number;
  status: string;
  createdAt?: string;
}

interface PayoutSettings {
  settlementType: 'private_person' | 'unregistered_business' | 'b2b_invoice';
  legalName: string;
  nip: string;
  iban: string;
  address: string;
}

interface AffiliateStats {
  eligibleMinor: number;
  pendingMinor: number;
  paidMinor: number;
  totalEarnedMinor: number;
  directSalesCount: number;
  brokerSalesCount: number;
  subAffiliatesCount: number;
  studentReferralsCount: number;
}

interface CommissionItem {
  id: string;
  orderRef: string;
  type: 'tier1_direct' | 'tier2_broker';
  attributionSource: string;
  paidAmountGrossMinor: number;
  commissionGrossMinor: number;
  ratePercent: number;
  status: 'PENDING' | 'ELIGIBLE' | 'PAID' | 'CANCELLED';
  createdAt: string;
}

interface SubAffiliateItem {
  id: string;
  maskedName: string;
  roleCategory: string;
  promoCode: string;
  joinedAt: string;
}

interface PayoutItem {
  id: string;
  amountGrossMinor: number;
  settlementType: string;
  legalName: string;
  ibanMasked: string;
  invoiceNumber: string | null;
  status: string;
  requestedAt: string;
  paidAt?: string | null;
}

function formatPln(minor: number): string {
  return `${(minor / 100).toFixed(2).replace('.', ',')} zł`;
}

export default function AfiliacjaPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMotherOnly, setIsMotherOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'cockpit' | 'landing'>('landing');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tools' | 'materials' | 'broker' | 'payouts' | 'admin'
  >('overview');

  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(null);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    settlementType: 'private_person',
    legalName: '',
    nip: '',
    iban: '',
    address: '',
  });
  const [stats, setStats] = useState<AffiliateStats>({
    eligibleMinor: 0,
    pendingMinor: 0,
    paidMinor: 0,
    totalEarnedMinor: 0,
    directSalesCount: 0,
    brokerSalesCount: 0,
    subAffiliatesCount: 0,
    studentReferralsCount: 0,
  });
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [subAffiliates, setSubAffiliates] = useState<SubAffiliateItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);

  // Login modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration form state
  const [submitted, setSubmitted] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [assignedCode, setAssignedCode] = useState<string | null>(null);
  const [brokerRef, setBrokerRef] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleCategory: 'standard',
    roleOrArea: 'Student kierunku medycznego / Ambasador HappyBirth (20%)',
    preferredPromoCode: '',
    profileUrl: '',
    message: '',
    rodoConsent: true,
  });

  // Cockpit actions state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customPromoInput, setCustomPromoInput] = useState('');
  const [customSlugInput, setCustomSlugInput] = useState('');
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [invoiceNumberInput, setInvoiceNumberInput] = useState('');
  const [payoutRequesting, setPayoutRequesting] = useState(false);

  // Interactive Business Profit Calculator state
  const [calcMonthlyCourses, setCalcMonthlyCourses] = useState(8);
  const [calcSubPartners, setCalcSubPartners] = useState(3);
  const [calcSubPartnerSales, setCalcSubPartnerSales] = useState(4);

  const loadDashboard = useCallback(async (tokenParam?: string | null, brokerParam?: string | null) => {
    try {
      setCheckingAuth(true);
      const q = new URLSearchParams();
      if (tokenParam) q.set('token', tokenParam);
      if (brokerParam) q.set('broker', brokerParam);
      const queryStr = q.toString() ? `?${q.toString()}` : '';

      const res = await fetch(`/api/affiliate/dashboard${queryStr}`);
      const data = await res.json().catch(() => ({}));

      if (data?.authenticated && data?.affiliate) {
        setAuthenticated(true);
        const adminFlag = Boolean(data?.isAdmin);
        setIsAdmin(adminFlag);
        setIsMotherOnly(false);
        setAffiliate(data.affiliate);
        setCustomPromoInput(data.affiliate.promoCode || '');
        setCustomSlugInput(data.affiliate.refSlug || '');
        if (data.payoutSettings) {
          setPayoutSettings(data.payoutSettings);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        setCommissions(Array.isArray(data.commissions) ? data.commissions : []);
        setSubAffiliates(Array.isArray(data.subAffiliates) ? data.subAffiliates : []);
        setPayouts(Array.isArray(data.payouts) ? data.payouts : []);
        setViewMode('cockpit');
        if (
          adminFlag &&
          typeof window !== 'undefined' &&
          (window.location.search.includes('admin=1') || window.location.hash === '#admin')
        ) {
          setActiveTab('admin');
        }

        if (tokenParam && typeof window !== 'undefined') {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
        }
      } else {
        setAuthenticated(false);
        setIsMotherOnly(Boolean(data?.isMotherOnly));
        setViewMode('landing');
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    let tokenParam: string | null = null;
    let brokerParam: string | null = null;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      tokenParam = params.get('token');
      const incomingBroker = params.get('zaprasza') || params.get('broker');
      brokerParam = incomingBroker || localStorage.getItem('hb_broker_ref');
      if (incomingBroker) {
        try {
          localStorage.setItem('hb_broker_ref', incomingBroker);
        } catch {}
      }
      setBrokerRef(brokerParam);
    }
    loadDashboard(tokenParam, brokerParam);
  }, [loadDashboard]);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginMessage(null);
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Podaj poprawny adres e-mail.');
      return;
    }
    try {
      setLoginLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          portal: 'afiliacja',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(
          data.error ||
            'Nie znaleziono konta dla tego adresu. Wypełnij formularz rejestracyjny poniżej, aby od razu otworzyć swój Kokpit Partnera.'
        );
      } else {
        setLoginMessage(
          data.message ||
            'Wysłaliśmy jednorazowy link logowania na Twój e-mail. Kliknij go, aby wejść do Kokpitu Partnera.'
        );
      }
    } catch {
      setLoginError('Błąd połączenia. Spróbuj ponownie za chwilę.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setAuthenticated(false);
    setAffiliate(null);
    setViewMode('landing');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRegLoading(true);
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'afiliacja',
          brokerRef,
          ...formData,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.promoCode) {
        setAssignedCode(data.promoCode);
      }
      setSubmitted(true);
      // Po rejestracji serwer wystawia ciasteczko sesyjne hb_session -> od razu ładujemy Kokpit Partnera!
      await loadDashboard(null, brokerRef);
    } catch {
      setSubmitted(true);
    } finally {
      setRegLoading(false);
    }
  };

  const handleSaveCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeFeedback(null);
    try {
      setCodeSaving(true);
      const res = await fetch('/api/affiliate/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_code',
          promoCode: customPromoInput,
          refSlug: customSlugInput,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setCodeFeedback({ type: 'err', text: data.error || 'Nie udało się zapisać kodu.' });
      } else {
        setCodeFeedback({ type: 'ok', text: data.message || 'Zapisano nowy kod rabatowy!' });
        if (affiliate) {
          setAffiliate({
            ...affiliate,
            promoCode: data.promoCode || customPromoInput.toUpperCase(),
            refSlug: data.refSlug || customSlugInput.toLowerCase(),
          });
        }
      }
    } catch {
      setCodeFeedback({ type: 'err', text: 'Błąd połączenia z serwerem.' });
    } finally {
      setCodeSaving(false);
    }
  };

  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsFeedback(null);
    try {
      setSettingsSaving(true);
      const res = await fetch('/api/affiliate/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_payout_settings',
          ...payoutSettings,
          roleCategory: affiliate?.roleCategory || 'standard',
          specialization: affiliate?.specialization || '',
          profileUrl: affiliate?.profileUrl || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setSettingsFeedback({ type: 'err', text: data.error || 'Błąd zapisu ustawień.' });
      } else {
        setSettingsFeedback({
          type: 'ok',
          text: data.message || 'Dane rozliczeniowe zostały zapisane.',
        });
        await loadDashboard();
      }
    } catch {
      setSettingsFeedback({ type: 'err', text: 'Błąd połączenia z serwerem.' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleRequestPayout = async () => {
    setSettingsFeedback(null);
    try {
      setPayoutRequesting(true);
      const res = await fetch('/api/affiliate/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_payout',
          ...payoutSettings,
          invoiceNumber: invoiceNumberInput,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setSettingsFeedback({ type: 'err', text: data.error || 'Nie udało się zlecić wypłaty.' });
      } else {
        setSettingsFeedback({
          type: 'ok',
          text: data.message || 'Zlecenie wypłaty zostało przyjęte do realizacji!',
        });
        setInvoiceNumberInput('');
        await loadDashboard();
      }
    } catch {
      setSettingsFeedback({ type: 'err', text: 'Błąd połączenia z serwerem.' });
    } finally {
      setPayoutRequesting(false);
    }
  };

  const handlePrintVoucherCards = () => {
    if (!affiliate || typeof window === 'undefined') return;
    const url = `https://happybirth.pl/?promo=${affiliate.promoCode}&ref=${affiliate.refSlug}`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>Wizytówki Rabatowe -10% (${affiliate.promoCode}) · HappyBirth.pl</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #1A1512; background: #fff; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 12px 18px; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 12px; }
    .btn { background: #DA0271; color: #fff; border: none; padding: 10px 20px; border-radius: 999px; font-weight: 700; cursor: pointer; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { border: 2px dashed #DA0271; border-radius: 18px; padding: 22px; background: #FBF8F4; page-break-inside: avoid; }
    .badge { display: inline-block; background: #DA0271; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em; }
    h2 { margin: 10px 0 6px; font-size: 20px; color: #20071E; }
    p { margin: 0 0 12px; font-size: 13px; color: #544A44; line-height: 1.45; }
    .code-box { background: #fff; border: 2px solid #20071E; border-radius: 12px; padding: 10px 14px; text-align: center; margin: 10px 0; }
    .code-label { font-size: 10px; text-transform: uppercase; color: #867A72; font-weight: 700; }
    .code-val { font-family: monospace; font-size: 22px; font-weight: 800; color: #DA0271; letter-spacing: 0.08em; }
    .foot { font-size: 10.5px; color: #867A72; margin-top: 8px; display: flex; justify-content: space-between; }
    @media print { .toolbar { display: none; } body { margin: 0; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>Arkusz 6 kart rabatowych (-10%) dla przyszłych mam</strong> · Kod: <code>${affiliate.promoCode}</code></div>
    <button class="btn" onclick="window.print()">Drukuj arkusz A4 / Zapisz PDF</button>
  </div>
  <div class="grid">
    ${Array.from({ length: 6 })
      .map(
        () => `
      <div class="card">
        <span class="badge">Prezent dla Przyszłych Rodziców · -10%</span>
        <h2>Szkoła Rodzenia Online HappyBirth.pl</h2>
        <p>52 lekcje wideo 4K z dyplomowanymi ekspertkami (od 2012 r.), Plan Porodu PDF, Kalkulator Wyprawki i dostęp dla dwojga na 18 miesięcy.</p>
        <div class="code-box">
          <div class="code-label">Twój kod rabatowy -10% (440,10 zł zamiast 489,00 zł):</div>
          <div class="code-val">${affiliate.promoCode}</div>
        </div>
        <div class="foot">
          <span>Wejdź na: <strong>happybirth.pl</strong></span>
          <span>Poleca: ${affiliate.fullName} (#współpraca)</span>
        </div>
      </div>`
      )
      .join('')}
  </div>
</body>
</html>`);
    win.document.close();
  };

  // Calculations for the interactive profit simulator
  const activeTierRate = affiliate?.tier1Rate || 0.2;
  const singleDirectCommPln = Math.round(44010 * activeTierRate) / 100;
  const singleBrokerCommPln = 22.0; // 5% of 440.10 PLN
  const monthlyDirectPln = calcMonthlyCourses * singleDirectCommPln;
  const monthlyBrokerPln = calcSubPartners * calcSubPartnerSales * singleBrokerCommPln;
  const monthlyTotalPln = monthlyDirectPln + monthlyBrokerPln;
  const yearlyTotalPln = monthlyTotalPln * 12;

  const promoCode = affiliate?.promoCode || 'SPOKOJNYPOROD';
  const refSlug = affiliate?.refSlug || 'spokojny-porod';
  const vanityAffiliateUrl = `https://happybirth.pl/poleca/${refSlug}`;
  const mainAffiliateUrl = `https://happybirth.pl/?kod=${promoCode}`;
  const birthPlanAffiliateUrl = `https://happybirth.pl/plan-porodu?kod=${promoCode}`;
  const layetteAffiliateUrl = `https://happybirth.pl/kalkulator-wyprawki?kod=${promoCode}`;
  const programAffiliateUrl = `https://happybirth.pl/program?kod=${promoCode}`;
  const brokerInviteUrl = `https://afiliacja.happybirth.pl/?zaprasza=${refSlug}`;

  const smartPartnerCodeSuggestions = generateSmartPartnerCodeCandidates(
    affiliate?.fullName || 'Kasia',
    affiliate?.roleCategory || 'standard',
    affiliate?.email
  );
  const registrationCodeSuggestions = generateSmartPartnerCodeCandidates(
    formData.fullName || 'Kasia Nowak',
    formData.roleCategory,
    formData.email
  );

  const marketingTemplates = [
    {
      id: 'tpl-whatsapp',
      badge: 'WhatsApp / Messenger / SMS (Rekomendacja bezpośrednia)',
      title: 'Krótka wiadomość z kodem -10% dla przyszłych rodziców',
      text: `Cześć! Polecam Wam merytoryczną szkołę rodzenia online HappyBirth.pl (52 konkretne lekcje wideo z położnymi i fizjoterapeutkami ze szkoły Mama Gaja, 18 miesięcy dostępu dla obojga rodziców). Z moim kodem partnerskim ${promoCode} macie 10% zniżki (440,10 zł zamiast 489,00 zł): ${mainAffiliateUrl} #współpraca`,
    },
    {
      id: 'tpl-ig',
      badge: 'Instagram Stories / Reels / Bio',
      title: 'Post lub relacja z poleceniem dla obserwujących mam',
      text: `Przyszłe mamy i przyszli tatusiowie! 🤰 Jeśli szukacie spokojnej, merytorycznej szkoły rodzenia online bez wychodzenia z domu (52 lekcje 4K zgodne ze Standardem Opieki MZ 2026, Plan Porodu PDF i Licznik Skurczów), to z kodem ${promoCode} macie -10% rabatu (440,10 zł zamiast 489 zł na 18 miesięcy dla dwojga) 👉 ${mainAffiliateUrl} #współpraca #reklama`,
    },
    {
      id: 'tpl-leadmagnet',
      badge: 'Grupy FB / Koła Naukowe / Darmowe Narzędzia PDF (30-dniowe ciasteczko)',
      title: 'Polecenie bezpłatnego Planu Porodu PDF i Kalkulatora Wyprawki',
      text: `Dziewczyny, tutaj możecie bezpłatnie wygenerować i wydrukować czysty Plan Porodu PDF zgodny z nowym Standardem Opieki Okołoporodowej MZ 2026: ${birthPlanAffiliateUrl} – a jeśli zdecydujecie się na pełny kurs 52 lekcji wideo, kod ${promoCode} obniża cenę o 10%! #współpraca`,
    },
    {
      id: 'tpl-midwife',
      badge: 'Gabinet / Praktyka / Fizjoterapia / Edukacja Okołoporodowa',
      title: 'Rekomendacja uzupełniająca po wizycie lub konsultacji',
      text: `Drodzy Rodzice, jako uzupełnienie naszego spotkania polecam Wam praktyczne materiały wideo w szkole rodzenia online HappyBirth.pl (ćwiczenia oddechowe, pozycje wertykalne, pielęgnacja noworodka i laktacja). Z moim kodem partnerskim ${promoCode} otrzymujecie 10% zniżki na 18-miesięczny dostęp dla dwojga: ${mainAffiliateUrl} #współpraca`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1A1512]">
      {/* HEADER */}
      <header className="border-b border-[#EAE3DB] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <Logo className="h-9 w-auto object-contain" />
              <div className="border-l border-[#EAE3DB] pl-3">
                <span className="font-brand-display font-bold text-sm text-[#1A1512] block leading-none">
                  HappyBirth Biznes &amp; Afiliacja
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#DA0271] font-bold">
                  Portal dla Studentów, Położnych, Fizjoterapeutek i Twórców
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            <a
              href="https://strefa.happybirth.pl/#polec-kolezance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#544A44] hover:text-[#DA0271] px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE3DB]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#DA0271]" />
              <span>Dla Mam: Poleć koleżance (Zniżka -10% + Prezent)</span>
            </a>

            <a
              href="https://happybirth.pl"
              className="hidden md:inline-flex text-xs font-semibold text-[#544A44] hover:text-[#DA0271]"
            >
              Strona główna
            </a>

            {authenticated && affiliate ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('cockpit');
                      setActiveTab('admin');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1A1512] text-[#FCD705] border border-[#FCD705]/50 text-xs font-bold cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panel Administratora</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'cockpit' ? 'landing' : 'cockpit')}
                  className="px-4 py-2 rounded-full border border-[#EAE3DB] bg-white hover:bg-stone-50 text-xs font-bold text-[#1A1512] cursor-pointer"
                >
                  {viewMode === 'cockpit' ? 'Zasady i stawki programu' : '← Wróć do Kokpitu Partnera'}
                </button>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#250A24] text-white text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5 text-[#FCD705]" />
                  <span>
                    {affiliate.fullName} ({affiliate.tier1RatePercent}%)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Wyloguj się"
                  className="p-2 rounded-full border border-[#EAE3DB] bg-white hover:bg-rose-50 text-[#544A44] hover:text-rose-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DA0271] bg-white hover:bg-[#FAE3EB]/40 text-[#DA0271] text-xs font-bold transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Zaloguj się do Kokpitu</span>
                </button>
                <a
                  href="#zgloszenie"
                  className="px-4 py-2 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Załóż konto partnera
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL LOGOWANIA BEZHASŁOWEGO (DLA STUDENTÓW, AMBASADORÓW I PARTNERÓW) */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#EAE3DB] shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => {
                setLoginModalOpen(false);
                setLoginError(null);
                setLoginMessage(null);
              }}
              className="absolute top-4 right-4 text-xs font-bold text-[#867A72] hover:text-[#1A1512] px-2.5 py-1 rounded-full bg-stone-100 cursor-pointer"
            >
              Zamknij ✕
            </button>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#DA0271]">
                Bezpieczne logowanie bez hasła
              </span>
              <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                Wejdź do Kokpitu Partnera
              </h3>
              <p className="text-xs text-[#544A44] leading-relaxed">
                Podaj adres e-mail zarejestrowany w Programie Afiliacyjnym (dla naszych Studentów, Ambasadorów, Położnych, Fizjoterapeutek i Mikroinfluencerek).
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                  Twój adres e-mail partnera
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="np. anna@uczelnia.pl"
                  className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {loginError}
                </div>
              )}

              {loginMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Sprawdź swoją skrzynkę e-mail!</span>
                  </div>
                  <p>{loginMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {loginLoading ? 'Wysyłanie linku logowania...' : 'Wyślij link logowania na e-mail →'}
              </button>
            </form>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3DB] text-[11px] text-[#544A44] leading-relaxed">
              <strong>Informacja dla Mam (Kursantek):</strong> Mamy korzystające z kursu są wyłączone z programu afiliacyjnego. Twój program poleceń dla koleżanki (zniżka -10% + prezent E-book PDF) jest dostępny bezpośrednio w{' '}
              <a href="https://strefa.happybirth.pl/#polec-kolezance" className="text-[#DA0271] font-bold underline">
                Strefie Rodziców (strefa.happybirth.pl)
              </a>
              .
            </div>

            <div className="pt-2 border-t border-[#EAE3DB] text-center space-y-1.5">
              <p className="text-xs text-[#867A72]">Jesteś naszym Studentem lub Partnerem i nie masz jeszcze konta?</p>
              <a
                href="#zgloszenie"
                onClick={() => setLoginModalOpen(false)}
                className="inline-block text-xs font-bold text-[#DA0271] hover:underline"
              >
                Załóż konto w 15 sekund i od razu otwórz Kokpit →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          WIDOK 1: PEŁNY KOKPIT BIZNESOWY STUDENTÓW I PARTNERÓW (PO ZALOGOWANIU)
         ========================================================================== */}
      {authenticated && affiliate && viewMode === 'cockpit' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* 1. GÓRNY BANER KOKPITU Z KODEM -10% I LINKIEM */}
          <div className="rounded-3xl bg-gradient-to-r from-[#250A24] via-[#310D2F] to-[#1A0519] text-white p-6 sm:p-8 shadow-xl border border-[#DA0271]/40">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#DA0271] text-white text-[11px] font-bold uppercase tracking-wider">
                    Kokpit Biznesowy Partnera · Aktywny
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#FCD705] text-[11px] font-bold">
                    Twoja prowizja: {affiliate.tier1RatePercent}% ({formatPln(Math.round(44010 * affiliate.tier1Rate))} / kurs) + 5% Broker
                  </span>
                </div>

                <h1 className="font-brand-display font-bold text-2xl sm:text-4xl text-white">
                  Witaj, {affiliate.fullName}!
                </h1>
                <p className="text-xs sm:text-sm text-[#EAD5E5]/90 leading-relaxed">
                  Każda osoba, która wpisze Twój kod <strong>{affiliate.promoCode}</strong> lub wejdzie z Twojego linku, otrzymuje <strong>10% zniżki (440,10 zł zamiast 489,00 zł)</strong>, a na Twoje saldo trafia <strong>{formatPln(Math.round(44010 * affiliate.tier1Rate))}</strong> prowizji od każdego opłaconego kursu.
                </p>
              </div>

              {/* Szybkie kafelki: Kod i Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#EAD5E5]">
                    Twój kod rabatowy (-10% dla mam)
                  </div>
                  <div className="font-mono font-bold text-xl text-[#FCD705] tracking-wider">
                    {affiliate.promoCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('top-code', affiliate.promoCode)}
                    className="w-full py-2 px-3 rounded-xl bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'top-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Skopiowano kod!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopiuj sam kod</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#EAD5E5]">
                    Twój link wizerunkowy (Kod -10% + Cookie 30 dni)
                  </div>
                  <div className="font-mono text-xs text-white truncate max-w-[230px]">
                    happybirth.pl/poleca/{refSlug}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('top-link', vanityAffiliateUrl)}
                    className="w-full py-2 px-3 rounded-xl bg-white text-[#250A24] hover:bg-[#FCD705] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'top-link' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Skopiowano link!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Kopiuj czysty link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PASEK ZAKŁADEK KOKPITU BIZNESOWEGO */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: '1. Pulpit i Finanse', icon: TrendingUp },
              { id: 'tools', label: '2. Własny Kod, Linki i Wizytówki QR', icon: QrCode },
              { id: 'materials', label: '3. Gotowe Posty i Wiadomości', icon: FileText },
              { id: 'broker', label: `4. Sieć Broker 5% (${stats.subAffiliatesCount})`, icon: Users },
              { id: 'payouts', label: '5. Wypłaty i Dane Rozliczeniowe', icon: CreditCard },
              ...(isAdmin
                ? [
                    {
                      id: 'admin',
                      label: '6. Panel Administratora (Wypłaty i Sieć)',
                      icon: ShieldCheck,
                    },
                  ]
                : []),
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#DA0271] text-white shadow-sm'
                      : 'bg-white border border-[#EAE3DB] text-[#544A44] hover:border-[#DA0271]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => loadDashboard()}
              title="Odśwież statystyki"
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#EAE3DB] text-xs font-semibold text-[#544A44] hover:text-[#DA0271] cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Odśwież</span>
            </button>
          </div>

          {/* ====================================================================
              ZAKŁADKA 1: PULPIT, KPI, KALKULATOR BIZNESOWY I HISTORIA PROWIZJI
             ==================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 4 KARTY KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white border-2 border-emerald-500/40 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span>Dostępne do wypłaty</span>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="font-brand-display font-bold text-3xl text-[#1A1512]">
                    {formatPln(stats.eligibleMinor)}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#867A72]">Status: ELIGIBLE</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('payouts')}
                      className="text-xs font-bold text-[#DA0271] hover:underline cursor-pointer"
                    >
                      Zleć wypłatę →
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase tracking-wider">
                    <span>W buforze weryfikacji</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="font-brand-display font-bold text-3xl text-[#1A1512]">
                    {formatPln(stats.pendingMinor)}
                  </div>
                  <p className="text-[11px] text-[#867A72]">
                    Odblokowuje się automatycznie po zalogowaniu klientki do kursu (Art. 38 pkt 13)
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#544A44] uppercase tracking-wider">
                    <span>Wypłacone łącznie</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-brand-display font-bold text-3xl text-[#1A1512]">
                    {formatPln(stats.paidMinor)}
                  </div>
                  <p className="text-[11px] text-[#867A72]">
                    Suma zarobiona od startu: <strong>{formatPln(stats.totalEarnedMinor)}</strong>
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#EAE3DB] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#DA0271] uppercase tracking-wider">
                    <span>Sprzedane kursy</span>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="font-brand-display font-bold text-3xl text-[#1A1512]">
                    {stats.directSalesCount + stats.brokerSalesCount}
                  </div>
                  <p className="text-[11px] text-[#867A72]">
                    Własne (Poziom 1): <strong>{stats.directSalesCount}</strong> · Sieć Broker (5%): <strong>{stats.brokerSalesCount}</strong>
                  </p>
                </div>
              </div>

              {/* INTERAKTYWNY KALKULATOR ZYSKU BIZNESOWEGO */}
              <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                      Symulator Przychodów Twojego Biznesu Afiliacyjnego
                    </span>
                    <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-[#1A1512] mt-0.5">
                      Oblicz swój miesięczny i roczny przychód (Stawka {affiliate.tier1RatePercent}% + 5% Broker)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Liczba poleconych przez Ciebie kursów miesięcznie:</span>
                        <span className="text-[#DA0271]">{calcMonthlyCourses} kursów / mies.</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={50}
                        value={calcMonthlyCourses}
                        onChange={(e) => setCalcMonthlyCourses(Number(e.target.value))}
                        className="w-full accent-[#DA0271] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Liczba zaproszonych partnerek/położnych w Twojej sieci (Poziom 2):</span>
                        <span className="text-[#DA0271]">{calcSubPartners} partnerek</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={25}
                        value={calcSubPartners}
                        onChange={(e) => setCalcSubPartners(Number(e.target.value))}
                        className="w-full accent-[#DA0271] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Średnia sprzedaż każdej zaproszonej partnerki miesięcznie:</span>
                        <span className="text-[#DA0271]">{calcSubPartnerSales} kursy / mies.</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={calcSubPartnerSales}
                        onChange={(e) => setCalcSubPartnerSales(Number(e.target.value))}
                        className="w-full accent-[#DA0271] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#867A72]">
                      Szacowany przychód miesięczny
                    </span>
                    <div className="font-brand-display font-bold text-3xl sm:text-4xl text-[#DA0271]">
                      {monthlyTotalPln.toFixed(2).replace('.', ',')} zł / mies.
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#544A44] border-t border-[#EAE3DB] pt-3">
                    <div className="flex justify-between">
                      <span>Twoja bezpośrednia prowizja ({affiliate.tier1RatePercent}%):</span>
                      <strong>{monthlyDirectPln.toFixed(2).replace('.', ',')} zł</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Prowizja pasywna Broker 5% (Poziom 2):</span>
                      <strong>{monthlyBrokerPln.toFixed(2).replace('.', ',')} zł</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#EAE3DB] text-sm font-bold text-[#1A1512]">
                      <span>Prognoza w skali 12 miesięcy:</span>
                      <span className="text-emerald-700">{yearlyTotalPln.toFixed(2).replace('.', ',')} zł / rok</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABELA TRANSAKCJI I PROWIZJI */}
              <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                      Historia naliczonych prowizji i konwersji
                    </h3>
                    <p className="text-xs text-[#867A72]">
                      Zgodnie z ochroną danych o zdrowiu (Art. 9 RODO) tabela wyświetla zanonimizowane numery zamówień bez danych osobowych kursantek.
                    </p>
                  </div>
                </div>

                {commissions.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center space-y-3">
                    <p className="text-sm font-bold text-[#1A1512]">
                      Brak zarejestrowanych transakcji na Twoim koncie.
                    </p>
                    <p className="text-xs text-[#544A44] max-w-lg mx-auto">
                      Skopiuj swój kod <strong>{affiliate.promoCode}</strong> lub gotową wiadomość z zakładki „Gotowe Posty i Wiadomości” i udostępnij przyszłym rodzicom. Każda sprzedaż pojawi się tutaj automatycznie w czasie rzeczywistym!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#EAE3DB] text-[#867A72] uppercase">
                          <th className="py-3 pr-4">Data</th>
                          <th className="py-3 pr-4">Zamówienie</th>
                          <th className="py-3 pr-4">Poziom i Atrybucja</th>
                          <th className="py-3 pr-4">Kwota zakupu</th>
                          <th className="py-3 pr-4">Twoja prowizja</th>
                          <th className="py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE3DB]">
                        {commissions.map((c) => (
                          <tr key={c.id}>
                            <td className="py-3 pr-4 font-mono text-[#544A44]">
                              {new Date(c.createdAt).toLocaleDateString('pl-PL')}
                            </td>
                            <td className="py-3 pr-4 font-mono font-bold text-[#1A1512]">
                              {c.orderRef}
                            </td>
                            <td className="py-3 pr-4">
                              {c.type === 'tier1_direct'
                                ? `Poziom 1 (${c.ratePercent}%) · ${
                                    c.attributionSource === 'promo_code' ? 'Kod -10%' : 'Link 30 dni'
                                  }`
                                : 'Poziom 2 · Broker Override (5%)'}
                            </td>
                            <td className="py-3 pr-4 font-mono">
                              {formatPln(c.paidAmountGrossMinor)}
                            </td>
                            <td className="py-3 pr-4 font-mono font-bold text-[#DA0271]">
                              +{formatPln(c.commissionGrossMinor)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.status === 'ELIGIBLE'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : c.status === 'PAID'
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {c.status === 'ELIGIBLE'
                                  ? 'Gotowe do wypłaty'
                                  : c.status === 'PAID'
                                    ? 'Wypłacone'
                                    : 'W buforze'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================================
              ZAKŁADKA 2: WŁASNY KOD -10%, DEEP LINKI I GENERATOR WIZYTÓWEK QR
             ==================================================================== */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Lewa kolumna: Personalizacja kodu i Deep Linki */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                      Personalizacja marki osobistej
                    </span>
                    <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                      Ustaw własny kod rabatowy -10% i identyfikator linku
                    </h3>
                    <p className="text-xs text-[#544A44] mt-1">
                      W HappyBirth nie używamy generycznych ciągów losowych cyfr i znaków. Twój kod i link powinny brzmieć jak ciepła, wiarygodna rekomendacja (np. <code>SPOKOJ-KASIA</code>, <code>POLECA-ANNA</code>, <code>OD-MARTY</code>, <code>DOBRYSTART-OLA</code>).
                    </p>
                  </div>

                  {/* INTELIGENTNE PROPOZYCJE KODÓW MARKI OSOBISTEJ (1-CLICK) */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#DA0271]">
                        Gotowe propozycje semantyczne dla Ciebie (kliknij, aby wybrać):
                      </span>
                      <span className="text-[11px] text-[#867A72]">
                        Zero losowych znaków · Wyższa konwersja
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {smartPartnerCodeSuggestions.map((suggestion) => {
                        const isSelected = customPromoInput.toUpperCase() === suggestion.code;
                        return (
                          <button
                            key={suggestion.code}
                            type="button"
                            onClick={() => {
                              setCustomPromoInput(suggestion.code);
                              setCustomSlugInput(suggestion.slug);
                            }}
                            title={suggestion.marketingPitch}
                            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#DA0271] text-white border-[#DA0271] shadow-xs'
                                : 'bg-white text-[#1A1512] border-[#EAE3DB] hover:border-[#DA0271]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold">{suggestion.code}</span>
                              <span
                                className={`text-[10px] font-semibold truncate ${
                                  isSelected ? 'text-white/90' : 'text-[#DA0271]'
                                }`}
                              >
                                /poleca/{suggestion.slug}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] mt-0.5 truncate ${
                                isSelected ? 'text-white/85' : 'text-[#867A72]'
                              }`}
                            >
                              {suggestion.categoryLabel}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <form onSubmit={handleSaveCustomCode} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                          Twój Kod Rabatowy (-10%)
                        </label>
                        <input
                          type="text"
                          value={customPromoInput}
                          onChange={(e) => setCustomPromoInput(e.target.value.toUpperCase())}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] font-mono font-bold text-sm"
                          placeholder="np. SPOKOJ-ANNA lub OD-ANI"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                          Końcówka czystego linku (/poleca/...)
                        </label>
                        <input
                          type="text"
                          value={customSlugInput}
                          onChange={(e) => setCustomSlugInput(e.target.value.toLowerCase())}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] font-mono text-sm"
                          placeholder="np. anna-kowalska"
                        />
                      </div>
                    </div>

                    {codeFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold ${
                          codeFeedback.type === 'ok'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {codeFeedback.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={codeSaving}
                      className="px-6 py-2.5 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {codeSaving ? 'Zapisywanie...' : 'Zapisz mój semantyczny kod i link'}
                    </button>
                  </form>
                </div>

                {/* 5 CZYSTYCH LINKÓW MARKETINGOWYCH */}
                <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                      Czyste Linki Marketingowe (30-dniowe ciasteczko + automatyczny rabat -10%)
                    </span>
                    <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                      Linki, które budują zaufanie już w podglądzie wiadomości i w bio
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'dl-vanity',
                        label: 'Krótki link wizerunkowy do bio (Instagram / TikTok / Wizytówka)',
                        url: vanityAffiliateUrl,
                      },
                      {
                        key: 'dl-home',
                        label: 'Strona główna z automatycznie włączonym kodem -10%',
                        url: mainAffiliateUrl,
                      },
                      {
                        key: 'dl-plan',
                        label: 'Bezpłatny Plan Porodu PDF (zapisuje kod -10% i 30-dniowe ciasteczko)',
                        url: birthPlanAffiliateUrl,
                      },
                      {
                        key: 'dl-layette',
                        label: 'Bezpłatny Kalkulator Wyprawki PDF (zapisuje kod -10% i 30-dniowe ciasteczko)',
                        url: layetteAffiliateUrl,
                      },
                      {
                        key: 'dl-prog',
                        label: 'Katalog wszystkich 52 lekcji z Twoim kodem -10%',
                        url: programAffiliateUrl,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1A1512]">{item.label}</div>
                          <div className="text-[11px] font-mono text-[#867A72] truncate">{item.url}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.key, item.url)}
                          className="px-4 py-2 rounded-full bg-white border border-[#EAE3DB] hover:border-[#DA0271] text-xs font-bold text-[#DA0271] shrink-0 flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedKey === item.key ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Skopiowano</span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5" />
                              <span>Kopiuj link</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prawa kolumna: Kod QR i Generator Wizytówek A6 do druku */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                      Materiały Offline &amp; Gabinet
                    </span>
                    <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                      Twój Kod QR i Karty Rabatowe do Druku
                    </h3>
                    <p className="text-xs text-[#544A44]">
                      Zeskanowanie kodu telefonem automatycznie otwiera HappyBirth.pl z naliczonym rabatem -10% (<code>{affiliate.promoCode}</code>).
                    </p>
                  </div>

                  <div className="mx-auto w-48 h-48 p-3 rounded-2xl bg-[#FAF7F2] border-2 border-[#250A24] flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&color=20071E&bgcolor=FAF7F2&data=${encodeURIComponent(
                        mainAffiliateUrl
                      )}`}
                      alt={`Kod QR dla ${affiliate.promoCode}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-xs">
                    <div className="text-[10px] uppercase font-bold text-[#867A72]">Kod podpięty pod QR:</div>
                    <div className="font-mono font-bold text-base text-[#DA0271]">{affiliate.promoCode}</div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintVoucherCards}
                    className="w-full py-3.5 px-5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Drukuj arkusz 6 wizytówek rabatowych (PDF / A4)</span>
                  </button>
                </div>

                {/* FLAGOWE KODY ZESPOŁU I KAMPANII HAPPYBIRTH */}
                <div className="rounded-3xl bg-[#250A24] text-white border border-[#DA0271]/40 p-6 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FCD705]">
                      Architektura Semantyczna HappyBirth
                    </span>
                    <h4 className="font-brand-display font-bold text-base text-white">
                      Flagowe kody kampanijne naszego zespołu (-10%)
                    </h4>
                    <p className="text-[11px] text-[#EAD5E5]/85 leading-relaxed">
                      Każdy kod w ekosystemie niesie obietnicę emocjonalną dla przyszłych rodziców zamiast sztucznych ciągów znaków:
                    </p>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {TEAM_FLAGSHIP_CODES.slice(0, 6).map((fc) => (
                      <div
                        key={fc.code}
                        className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-[#FCD705]">{fc.code}</div>
                          <div className="text-[10px] text-[#EAD5E5]/90 truncate">
                            {fc.owner} · {fc.headline}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(`fc-${fc.code}`, `https://happybirth.pl/?kod=${fc.code}`)}
                          className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-[#DA0271] text-white text-[10px] font-bold shrink-0 cursor-pointer"
                        >
                          {copiedKey === `fc-${fc.code}` ? 'Skopiowano' : 'Kopiuj link'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              ZAKŁADKA 3: GOTOWE MATERIAŁY MARKETINGOWE (COPY & PASTE ZGODNE Z UOKiK)
             ==================================================================== */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="max-w-3xl space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                    Gotowe szablony sprzedażowe (zgodne z wytycznymi Prezesa UOKiK #współpraca)
                  </span>
                  <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                    Skopiuj gotowy tekst z Twoim kodem {affiliate.promoCode} i opublikuj jednym kliknięciem
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {marketingTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#FAE3EB] text-[#DA0271] text-[10px] font-bold uppercase tracking-wider">
                          {tpl.badge}
                        </span>
                        <h4 className="font-bold text-sm text-[#1A1512]">{tpl.title}</h4>
                        <div className="p-3.5 rounded-xl bg-white border border-[#EAE3DB] text-xs text-[#544A44] italic leading-relaxed select-all">
                          „{tpl.text}”
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(tpl.id, tpl.text)}
                        className="w-full py-2.5 px-4 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {copiedKey === tpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Skopiowano gotowy tekst!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopiuj tekst z moim kodem {affiliate.promoCode}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              ZAKŁADKA 4: SIEĆ PARTNERSKA POZIOMU 2 (BROKER 5% OVERRIDE)
             ==================================================================== */}
          {activeTab === 'broker' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                      Poziom 2 · Broker Override (5% prowizji pasywnej)
                    </span>
                    <h3 className="font-brand-display font-bold text-2xl text-[#1A1512]">
                      Zaproś innych studentów, położne, fizjoterapeutki lub mikroinfluencerki i odbieraj 5% (22,00 zł – 24,45 zł) od każdej ich sprzedaży
                    </h3>
                    <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                      Zaproś znajomego studenta z roku, położną środowiskową, fizjoterapeutkę lub mikroinfluencerkę za pomocą swojego poniższego linku Brokera. Za każdy sprzedany przez tę osobę kurs otrzymasz automatycznie 5% prowizji pasywnej (bez pomniejszania jej prowizji!).
                    </p>
                  </div>

                  <div className="lg:col-span-5 p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
                    <div className="text-xs font-bold text-[#1A1512]">
                      Twój unikalny link rekrutacyjny Brokera:
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#EAE3DB] font-mono text-xs text-[#DA0271] break-all">
                      {brokerInviteUrl}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('broker-link', brokerInviteUrl)}
                      className="w-full py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedKey === 'broker-link' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Skopiowano link rekrutacyjny!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Kopiuj link do zapraszania partnerów</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lista zaproszonych partnerów */}
                <div className="pt-4 border-t border-[#EAE3DB] space-y-3">
                  <h4 className="font-bold text-sm text-[#1A1512]">
                    Twoja sieć zaproszonych partnerów Poziomu 2 ({subAffiliates.length})
                  </h4>
                  {subAffiliates.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-xs text-[#544A44]">
                      Nie masz jeszcze przypisanych partnerów Poziomu 2. Wyślij powyższy link rekrutacyjny znajomym ze studiów, położnym, fizjoterapeutkom lub mikroinfluencerkom!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subAffiliates.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-[#1A1512]">{sub.maskedName}</div>
                            <div className="text-[11px] text-[#867A72]">
                              Kod: <span className="font-mono font-semibold">{sub.promoCode}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            +5% Override
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              ZAKŁADKA 5: WYPŁATY, FAKTURY I DANE ROZLICZENIOWE
             ==================================================================== */}
          {activeTab === 'payouts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                    Dane do przelewów i rozliczeń (KLARSOLUTIONS Sp. z o.o.)
                  </span>
                  <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                    Ustawienia wypłat i kategoria stawki partnerskiej
                  </h3>
                </div>

                <form onSubmit={handleSavePayoutSettings} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                        Forma rozliczenia
                      </label>
                      <select
                        value={payoutSettings.settlementType}
                        onChange={(e) =>
                          setPayoutSettings({
                            ...payoutSettings,
                            settlementType: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-xs font-semibold"
                      >
                        <option value="private_person">Osoba prywatna / Student (rozliczenie bez firmy)</option>
                        <option value="unregistered_business">Działalność nierejestrowana</option>
                        <option value="b2b_invoice">Faktura B2B (Firma / Gabinet położniczy lub fizjo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                        Twój profil partnerski (stawka)
                      </label>
                      <select
                        value={affiliate.roleCategory}
                        onChange={(e) =>
                          setAffiliate({
                            ...affiliate,
                            roleCategory: e.target.value as any,
                            tier1Rate:
                              e.target.value === 'midwife_physio'
                                ? 0.3
                                : e.target.value === 'creator_publisher'
                                  ? 0.25
                                  : 0.2,
                            tier1RatePercent:
                              e.target.value === 'midwife_physio'
                                ? 30
                                : e.target.value === 'creator_publisher'
                                  ? 25
                                  : 20,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-xs font-semibold"
                      >
                        <option value="standard">Etap 1: Student / Ambasador indywidualny (20%)</option>
                        <option value="creator_publisher">Etap 2: Mikroinfluencerka / Twórca treści (25%)</option>
                        <option value="midwife_physio">Etap 2: Położna / Fizjoterapeutka / CDL (30%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                        Imię i nazwisko lub Nazwa Firmy
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutSettings.legalName}
                        onChange={(e) =>
                          setPayoutSettings({ ...payoutSettings, legalName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm"
                        placeholder="np. Anna Kowalska"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                        NIP (opcjonalnie dla B2B)
                      </label>
                      <input
                        type="text"
                        value={payoutSettings.nip}
                        onChange={(e) =>
                          setPayoutSettings({ ...payoutSettings, nip: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm font-mono"
                        placeholder="np. 7812118273"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                      Numer konta bankowego (IBAN do przelewów prowizji)
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutSettings.iban}
                      onChange={(e) =>
                        setPayoutSettings({ ...payoutSettings, iban: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm font-mono"
                      placeholder="PL 00 0000 0000 0000 0000 0000 0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                      Adres rozliczeniowy / siedziba
                    </label>
                    <input
                      type="text"
                      value={payoutSettings.address}
                      onChange={(e) =>
                        setPayoutSettings({ ...payoutSettings, address: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm"
                      placeholder="Ulica, kod pocztowy i miejscowość"
                    />
                  </div>

                  {settingsFeedback && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold ${
                        settingsFeedback.type === 'ok'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {settingsFeedback.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-6 py-3 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {settingsSaving ? 'Zapisywanie...' : 'Zapisz ustawienia rozliczeniowe'}
                  </button>
                </form>
              </div>

              {/* Prawa kolumna: Zlecenie wypłaty + Historia wypłat */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl bg-[#250A24] text-white p-6 sm:p-8 shadow-xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FCD705]">
                    Wypłata na konto bankowe
                  </span>
                  <div className="font-brand-display font-bold text-3xl text-white">
                    Dostępne: {formatPln(stats.eligibleMinor)}
                  </div>
                  <p className="text-xs text-[#EAD5E5]/85 leading-relaxed">
                    Przelewy realizujemy w ciągu 3–5 dni roboczych na rachunek IBAN wskazany obok. Dane do faktury B2B: <strong>KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań, NIP: 7812118273</strong>.
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EAD5E5] mb-1">
                      Numer faktury / rachunku (opcjonalnie)
                    </label>
                    <input
                      type="text"
                      value={invoiceNumberInput}
                      onChange={(e) => setInvoiceNumberInput(e.target.value)}
                      placeholder="np. FV/2026/11/01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestPayout}
                    disabled={payoutRequesting || stats.eligibleMinor <= 0}
                    className="w-full py-3.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {payoutRequesting
                      ? 'Przetwarzanie dyspozycji...'
                      : `Zleć wypłatę ${formatPln(stats.eligibleMinor)} →`}
                  </button>
                </div>

                <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 shadow-xs space-y-3">
                  <h4 className="font-bold text-sm text-[#1A1512]">Historia zleconych wypłat</h4>
                  {payouts.length === 0 ? (
                    <p className="text-xs text-[#867A72]">Brak zleconych dotychczas wypłat.</p>
                  ) : (
                    <div className="space-y-2">
                      {payouts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3DB] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#1A1512]">{formatPln(p.amountGrossMinor)}</div>
                            <div className="text-[11px] text-[#867A72]">
                              {new Date(p.requestedAt).toLocaleDateString('pl-PL')} · {p.ibanMasked}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {p.status === 'PAID' ? 'Wypłacono' : 'W realizacji'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              ZAKŁADKA 6: PANEL ADMINISTRATORA AFILIACJI (TYLKO DLA ADMINA)
             ==================================================================== */}
          {activeTab === 'admin' && isAdmin && (
            <AffiliateAdminPanel onRefreshParent={() => loadDashboard()} />
          )}
        </main>
      ) : (
        /* ==========================================================================
           WIDOK 2: STRONA POWITALNA, ZASADY PROGRAMU I REJESTRACJA / LOGOWANIE
           ========================================================================== */
        <>
          {/* 1. HERO + SZYBKIE LOGOWANIE DLA STUDENTÓW, AMBASADORÓW I PARTNERÓW */}
          <section className="pt-12 sm:pt-16 pb-14 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
            {isMotherOnly && (
              <div className="rounded-3xl bg-[#250A24] text-white p-6 sm:p-8 border-2 border-[#DA0271] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DA0271] text-white text-xs font-bold uppercase tracking-wider">
                    Informacja dla zalogowanej Mamy (Kursantki)
                  </div>
                  <h2 className="font-brand-display font-bold text-xl sm:text-2xl text-white">
                    Twój Program Poleceń Koleżance (-10% zniżki + Prezent E-book PDF) czeka w Strefie Rodziców
                  </h2>
                  <p className="text-xs sm:text-sm text-[#EAD5E5]/90 leading-relaxed">
                    Mamy korzystające z kursu są obecnie wyłączone z komercyjnego programu afiliacyjnego na tej subdomenie. W ramach Twojego konta Mamy przygotowaliśmy dedykowany kod rabatowy <strong>-10% dla Twojej koleżanki (440,10 zł zamiast 489,00 zł)</strong> oraz natychmiastowy <strong>Prezent Bonusowy (E-book kulinarny PDF)</strong>.
                  </p>
                </div>
                <a
                  href="https://strefa.happybirth.pl/#polec-kolezance"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FCD705] hover:bg-white text-[#250A24] font-bold text-xs sm:text-sm transition-colors shrink-0"
                >
                  <span>Przejdź do mojego kodu i prezentu w Strefie Mamy →</span>
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAE3EB] border border-[#F3CAD9] text-xs font-bold text-[#DA0271]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Etap 1: Nasi Studenci i Ambasadorzy · Etap 2: Położne, Fizjoterapeutki i Mikroinfluencerki</span>
                </div>

                <h1 className="font-brand-display font-bold text-3xl sm:text-5xl text-[#1A1512] leading-tight">
                  Zbuduj własny biznes afiliacyjny z HappyBirth: <span className="text-[#DA0271]">10% rabatu</span> dla rodziców i{' '}
                  <span className="text-[#DA0271]">20%–30% prowizji</span> dla Ciebie.
                </h1>

                <p className="text-base sm:text-lg text-[#544A44] leading-relaxed">
                  Aktualny program afiliacyjny opieramy w pierwszym kroku na <strong>naszych Studentach</strong> (położnictwa, fizjoterapii, kierunków medycznych) oraz <strong>indywidualnych Ambasadorach</strong>, a w kolejnym kroku na <strong>Położnych, Fizjoterapeutkach uroginekologicznych i Mikroinfluencerkach</strong>. Przyszli rodzice kupują kurs za <strong>440,10 zł zamiast 489,00 zł (-10%)</strong>, a Ty zarabiasz <strong>od 88,02 zł do 132,03 zł</strong> od każdego kursu (+5% Broker).
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setLoginModalOpen(true)}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Zaloguj się do Kokpitu Partnera</span>
                  </button>
                  <a
                    href="#zgloszenie"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm transition-all shadow-md"
                  >
                    <span>Załóż konto studenta / partnera (15 sek.)</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Prawa karta w Hero: Szybki podgląd narzędzi w Kokpicie */}
              <div className="lg:col-span-5 rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#EAE3DB] pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DA0271]">
                      Twój Kokpit Biznesowy 24/7
                    </span>
                    <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                      Narzędzia dla Studentów i Partnerów:
                    </h3>
                  </div>
                  <Wallet className="w-7 h-7 text-[#DA0271]" />
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#544A44]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Własny kod rabatowy -10%</strong> (np. <code>STUDENT-KASIA</code>, <code>PARTNER-ANNA</code>) z edycją na żywo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>88,02 zł – 132,03 zł prowizji</strong> od każdego zakupu z wypłatą na rachunek IBAN (osoba prywatna / student lub B2B).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Generator Kodów QR i wizytówek A6</strong> do druku oraz gotowe szablony postów na WhatsApp i Instagram.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Program Broker 5% (Poziom 2):</strong> zaproś innego studenta, położną lub mikroinfluencerkę i odbieraj 22,00 zł – 24,45 zł pasywnej prowizji od każdej ich sprzedaży.
                    </span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="w-full py-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#FAE3EB] border border-[#DA0271]/40 text-[#DA0271] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Mam już konto partnerskie · Wyślij link logowania →
                </button>
              </div>
            </div>

            {/* DWUETAPOWAMAPA UCZESTNIKÓW PROGRAMU + WYŁĄCZENIE MAM (PREZENT / ZNIŻKA W STREFIE) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#DA0271] space-y-3 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAE3EB] text-[#DA0271] text-[11px] font-bold uppercase tracking-wider">
                  Etap 1 · Aktywny teraz (Priorytet)
                </div>
                <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                  Nasi Studenci i Indywidualni Ambasadorzy (20% + 5% Broker)
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                  Studenci położnictwa, fizjoterapii, pielęgniarstwa i kierunków lekarskich, członkowie kół naukowych oraz wybrane osoby współpracujące bezpośrednio z zespołem HappyBirth. Rozliczenie bez konieczności posiadania firmy (na konto prywatne IBAN).
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EAE3DB] space-y-3 shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D0EBF3] text-[#006A96] text-[11px] font-bold uppercase tracking-wider">
                  Etap 2 · Kolejny krok rozwojowy
                </div>
                <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                  Położne, Fizjoterapeutki (30%) oraz Mikroinfluencerki (25%)
                </h3>
                <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                  Położne środowiskowe i szpitalne, fizjoterapeutki uroginekologiczne, doradczynie laktacyjne (stawka 30% = 132,03 zł / kurs) oraz mikroinfluencerki i twórczynie parentingowe na Instagramie i TikToku (stawka 25% = 110,03 zł / kurs).
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-[#1A1512] text-[11px] font-bold uppercase tracking-wider">
                    Informacja dla Mam (Kursantek)
                  </div>
                  <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                    Jesteś Mamą? Polecaj kurs koleżankom z Prezentem i Zniżką -10%
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544A44] leading-relaxed">
                    Mamy są obecnie wyłączone z komercyjnego programu afiliacyjnego. Dla naszych Mam przygotowaliśmy dedykowany program w Strefie Rodziców: dajesz koleżance <strong>10% zniżki (440,10 zł)</strong> i od razu odbierasz w prezencie <strong>E-book kulinarny PDF</strong>.
                  </p>
                </div>
                <a
                  href="https://strefa.happybirth.pl/#polec-kolezance"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] hover:underline pt-1"
                >
                  <span>Przejdź do programu poleceń dla Mam w Strefie Rodziców →</span>
                </a>
              </div>
            </div>
          </section>

          {/* 2. MODEL PROWIZYJNY D1b: 2-TIER CAPPED CPA */}
          <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#EAE3DB]" id="stawki">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
                  Przejrzysty model finansowy (D1b)
                </span>
                <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512]">
                  Stawki prowizyjne 2-Tier Capped CPA
                </h2>
                <p className="text-sm text-[#544A44] leading-relaxed">
                  Cena regularna kursu wynosi <strong>489,00 zł brutto</strong>. Z Twoim kodem rabatowym <strong>-10%</strong> przyszła mama płaci <strong>440,10 zł brutto</strong> za 18 miesięcy dostępu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-7 rounded-3xl bg-[#FAF7F2] border-2 border-[#DA0271] space-y-3 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAE3EB] text-xs font-bold text-[#DA0271]">
                    Etap 1 · Nasi Studenci i Ambasadorzy (20%)
                  </div>
                  <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#1A1512]">
                    88,02 zł <span className="text-sm font-normal text-[#867A72]">/ kurs</span>
                  </div>
                  <p className="text-xs text-[#544A44] leading-relaxed">
                    Dla naszych studentów (położnictwo, fizjoterapia, kierunki medyczne) oraz indywidualnych ambasadorów (20% od kwoty 440,10 zł z kodem -10% + 5% Broker Override).
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D0EBF3] text-xs font-bold text-[#006A96]">
                    Etap 2 · Mikroinfluencerki i Twórcy (25%)
                  </div>
                  <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#1A1512]">
                    110,03 zł – 122,25 zł
                  </div>
                  <p className="text-xs text-[#544A44] leading-relaxed">
                    Dla mikroinfluencerek, twórczyń wideo i blogerek parentingowych (110,03 zł przy zakupie z kodem -10% lub 122,25 zł przy pełnej cenie 489 zł z linku).
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-[#250A24] text-white border border-[#EAE3DB] space-y-3 shadow-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DA0271] text-xs font-bold text-white">
                    Etap 2 · Położne i Fizjoterapeutki (30%)
                  </div>
                  <div className="font-brand-display text-3xl sm:text-4xl font-bold text-[#FCD705]">
                    132,03 zł <span className="text-sm font-normal text-[#EAD5E5]">/ kurs</span>
                  </div>
                  <p className="text-xs text-[#EAD5E5]/90 leading-relaxed">
                    Stawka specjalna dla położnych, fizjoterapeutek uroginekologicznych i doradczyń laktacyjnych (30% z kodem -10%).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. FORMULARZ NATYCHMIASTOWEJ REJESTRACJI I AKTYWACJI KOKPITU */}
          <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto" id="zgloszenie">
            <div className="bg-white rounded-3xl p-7 sm:p-12 border border-[#EAE3DB] shadow-xl space-y-6">
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DA0271]">
                  Natychmiastowa aktywacja konta (afiliacja.happybirth.pl)
                </span>
                <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-[#1A1512]">
                  Otwórz swoje Konto Studenta / Partnera i wejdź do Kokpitu
                </h2>
                <p className="text-xs sm:text-sm text-[#544A44]">
                  Po kliknięciu „Aktywuj konto” system od razu wygeneruje Twój kod rabatowy (-10%) i przeniesie Cię prosto do Twojego Kokpitu Biznesowego.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="np. Anna Kowalska"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="np. anna@uczelnia.pl"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Twoja rola / Etap programu
                    </label>
                    <select
                      value={formData.roleCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        const labelMap: Record<string, string> = {
                          standard: 'Student kierunku medycznego / Ambasador HappyBirth (20%)',
                          creator_publisher: 'Mikroinfluencerka / Twórca internetowy (25%)',
                          midwife_physio: 'Położna / Fizjoterapeutka / CDL (30%)',
                        };
                        setFormData({
                          ...formData,
                          roleCategory: val,
                          roleOrArea: labelMap[val] || 'Student / Ambasador HappyBirth',
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                    >
                      <option value="standard">Etap 1: Student / Chętny Ambasador (Stawka 20%)</option>
                      <option value="creator_publisher">Etap 2: Mikroinfluencerka / Twórca (Stawka 25%)</option>
                      <option value="midwife_physio">Etap 2: Położna / Fizjoterapeutka (Stawka 30%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Twój semantyczny kod rabatowy -10% (wybierz lub wpisz)
                    </label>
                    <input
                      type="text"
                      value={formData.preferredPromoCode}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredPromoCode: e.target.value.toUpperCase() })
                      }
                      placeholder="np. SPOKOJ-ANNA lub OD-ANI"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm font-mono font-bold focus:outline-none focus:border-[#DA0271]"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#867A72]">
                        Kliknij gotowy kod:
                      </span>
                      {registrationCodeSuggestions.slice(0, 5).map((cand) => (
                        <button
                          key={cand.code}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredPromoCode: cand.code })}
                          title={cand.marketingPitch}
                          className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold border cursor-pointer transition-all ${
                            formData.preferredPromoCode === cand.code
                              ? 'bg-[#DA0271] text-white border-[#DA0271]'
                              : 'bg-[#FAF7F2] text-[#1A1512] border-[#EAE3DB] hover:border-[#DA0271]'
                          }`}
                        >
                          {cand.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Telefon kontaktowy (opcjonalnie)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+48 000 000 000"
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1.5">
                      Link do Instagrama / TikToka / Gabinetu (opcjonalnie)
                    </label>
                    <input
                      type="text"
                      value={formData.profileUrl}
                      onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#DA0271]"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#544A44] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={formData.rodoConsent}
                    onChange={(e) => setFormData({ ...formData, rodoConsent: e.target.checked })}
                    className="mt-0.5 rounded border-[#EAE3DB] text-[#DA0271] focus:ring-[#DA0271]"
                  />
                  <span>
                    Akceptuję zasady Programu Afiliacyjnego HappyBirth.pl (zobowiązuję się do oznaczania treści <strong>#współpraca</strong> zgodnie z wytycznymi UOKiK) oraz wyrażam zgodę na obsługę mojego konta partnerskiego przez <strong>KLARSOLUTIONS Sp. z o.o.</strong> (KRS: 0001268396).
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-4 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
                >
                  {regLoading
                    ? 'Aktywowanie Twojego Kokpitu Biznesowego...'
                    : 'Aktywuj konto, odbierz kod -10% i otwórz Kokpit Partnera →'}
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="py-10 px-4 sm:px-6 border-t border-[#EAE3DB] bg-white text-center text-xs text-[#867A72] space-y-2">
        <p className="font-semibold text-[#1A1512]">
          Operator programu afiliacyjnego: KLARSOLUTIONS Sp. z o.o. · ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779
        </p>
        <p>
          Kontakt dla partnerów i rozliczeń: <a href="mailto:kontakt@happybirth.pl" className="underline">kontakt@happybirth.pl</a>
        </p>
      </footer>
    </div>
  );
}
