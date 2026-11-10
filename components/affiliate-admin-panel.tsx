'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { generateSmartPartnerCodeCandidates } from '@/lib/brand-codes';
import {
  ShieldCheck,
  Wallet,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Search,
  Download,
  Award,
  FileText,
  BookOpen,
  ExternalLink,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface AdminStats {
  totalAffiliates: number;
  activeAffiliates: number;
  stage1StudentsCount: number;
  stage2CreatorsCount: number;
  stage2MidwivesCount: number;
  pendingPayoutsCount: number;
  pendingPayoutsMinor: number;
  paidPayoutsCount: number;
  paidPayoutsMinor: number;
  totalOrdersCount: number;
  totalRevenueMinor: number;
  totalCommissionsEligibleMinor: number;
  totalCommissionsPendingMinor: number;
  totalCommissionsPaidMinor: number;
  motherReferralsCount: number;
  inquiriesCount: number;
}

interface AdminPayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  affiliatePromoCode: string;
  affiliateRoleCategory: string;
  amountGrossMinor: number;
  settlementType: string;
  legalName: string;
  nip: string;
  iban: string;
  address: string;
  invoiceNumber: string | null;
  status: 'PROCESSING' | 'PAID' | 'REJECTED' | string;
  requestedAt: string;
  paidAt: string | null;
}

interface AdminAffiliateItem {
  id: string;
  email: string;
  fullName: string;
  roleCategory: 'standard' | 'creator_publisher' | 'midwife_physio';
  specialization: string;
  profileUrl: string;
  promoCode: string;
  refSlug: string;
  tier1Rate: number;
  tier1RatePercent: number;
  tier2OverrideRatePercent: number;
  referredByBrokerId: string | null;
  brokerName: string | null;
  brokerPromoCode: string | null;
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
  settlementType: string;
  legalName: string;
  nip: string;
  iban: string;
  address: string;
  stats: {
    directSalesCount: number;
    brokerSalesCount: number;
    eligibleMinor: number;
    pendingMinor: number;
    paidMinor: number;
    totalEarnedMinor: number;
  };
}

interface AdminCommissionItem {
  id: string;
  orderId: string;
  stripeSessionId: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  affiliatePromoCode: string;
  brokerId: string | null;
  brokerName: string | null;
  brokerPromoCode: string | null;
  attributionSource: string;
  paidAmountGrossMinor: number;
  tier1RatePercent: number;
  tier1CommissionGrossMinor: number;
  tier2CommissionGrossMinor: number;
  status: 'PENDING' | 'ELIGIBLE' | 'PAID' | 'CANCELLED';
  firstContentAccessedAt: string | null;
  eligibleAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface AdminInquiryItem {
  id: string;
  channel: string;
  fullName: string;
  companyOrBrand: string;
  email: string;
  phone: string;
  roleOrArea: string;
  profileUrl: string;
  message: string;
  createdAt: string;
  affiliateId: string | null;
  affiliatePromoCode: string | null;
  affiliateRoleCategory: string | null;
  affiliateTier1RatePercent: number | null;
}

interface AdminMotherReferralItem {
  id: string;
  referrerUserId: string;
  referrerName: string;
  referrerEmail: string;
  referrerCode: string;
  referredEmail: string;
  rewardSlug: string;
  rewardUnlocked: boolean;
  unlockedAt: string;
}

function formatPln(minor: number): string {
  return `${(minor / 100).toFixed(2).replace('.', ',')} zł`;
}

function settlementLabel(type: string): string {
  if (type === 'b2b_invoice') return 'Faktura B2B (Firma)';
  if (type === 'unregistered_business') return 'Działalność nierejestrowana';
  return 'Osoba prywatna / Student';
}

export function AffiliateAdminPanel({ onRefreshParent }: { onRefreshParent?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [subTab, setSubTab] = useState<'payouts' | 'affiliates' | 'commissions' | 'inquiries' | 'mothers'>('payouts');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalAffiliates: 0,
    activeAffiliates: 0,
    stage1StudentsCount: 0,
    stage2CreatorsCount: 0,
    stage2MidwivesCount: 0,
    pendingPayoutsCount: 0,
    pendingPayoutsMinor: 0,
    paidPayoutsCount: 0,
    paidPayoutsMinor: 0,
    totalOrdersCount: 0,
    totalRevenueMinor: 0,
    totalCommissionsEligibleMinor: 0,
    totalCommissionsPendingMinor: 0,
    totalCommissionsPaidMinor: 0,
    motherReferralsCount: 0,
    inquiriesCount: 0,
  });

  const [payoutRequests, setPayoutRequests] = useState<AdminPayoutRequest[]>([]);
  const [affiliates, setAffiliates] = useState<AdminAffiliateItem[]>([]);
  const [commissions, setCommissions] = useState<AdminCommissionItem[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiryItem[]>([]);
  const [motherReferrals, setMotherReferrals] = useState<AdminMotherReferralItem[]>([]);

  // Filters
  const [payoutFilter, setPayoutFilter] = useState<'ALL' | 'PROCESSING' | 'PAID' | 'REJECTED'>('ALL');
  const [affiliateSearch, setAffiliateSearch] = useState('');
  const [affiliateStageFilter, setAffiliateStageFilter] = useState<'ALL' | 'standard' | 'creator_publisher' | 'midwife_physio' | 'blocked'>('ALL');
  const [editingCodeMap, setEditingCodeMap] = useState<Record<string, string>>({});

  // Form: Add new affiliate manually
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    fullName: '',
    email: '',
    roleCategory: 'standard',
    preferredPromoCode: '',
    specialization: 'Student kierunku medycznego / Ambasador HappyBirth',
    profileUrl: '',
    brokerPromoCode: '',
  });
  const [creatingPartner, setCreatingPartner] = useState(false);

  // Form: Record manual commission
  const [showManualCommForm, setShowManualCommForm] = useState(false);
  const [manualComm, setManualComm] = useState({
    affiliateId: '',
    orderRef: '',
    paidAmountPln: '440.10',
    status: 'ELIGIBLE',
  });
  const [recordingComm, setRecordingComm] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/affiliate/admin');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setError(data.error || 'Brak dostępu do Panelu Administratora.');
        return;
      }
      setAdminEmail(data.adminEmail || '');
      if (data.adminStats) setAdminStats(data.adminStats);
      setPayoutRequests(Array.isArray(data.payoutRequests) ? data.payoutRequests : []);
      const affList: AdminAffiliateItem[] = Array.isArray(data.affiliates) ? data.affiliates : [];
      setAffiliates(affList);
      const codeMap: Record<string, string> = {};
      affList.forEach((a) => {
        codeMap[a.id] = a.promoCode;
      });
      setEditingCodeMap(codeMap);
      if (affList.length > 0 && !manualComm.affiliateId) {
        setManualComm((prev) => ({ ...prev, affiliateId: affList[0].id }));
      }
      setCommissions(Array.isArray(data.commissions) ? data.commissions : []);
      setInquiries(Array.isArray(data.inquiries) ? data.inquiries : []);
      setMotherReferrals(Array.isArray(data.motherReferrals) ? data.motherReferrals : []);
    } catch {
      setError('Błąd połączenia z endpointem administracyjnym /api/affiliate/admin.');
    } finally {
      setLoading(false);
    }
  }, [manualComm.affiliateId]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const runAdminAction = async (payload: Record<string, any>, itemKey: string) => {
    setFeedback(null);
    try {
      setBusyId(itemKey);
      const res = await fetch('/api/affiliate/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setFeedback({ type: 'err', text: data.error || 'Nie udało się wykonać operacji.' });
      } else {
        setFeedback({ type: 'ok', text: data.message || 'Operacja wykonana pomyślnie.' });
        await loadAdminData();
        if (onRefreshParent) onRefreshParent();
      }
    } catch {
      setFeedback({ type: 'err', text: 'Błąd komunikacji z serwerem.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleCreatePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      setCreatingPartner(true);
      const res = await fetch('/api/affiliate/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_affiliate',
          ...newPartner,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setFeedback({ type: 'err', text: data.error || 'Nie udało się utworzyć partnera.' });
      } else {
        setFeedback({ type: 'ok', text: data.message || 'Partner został dodany i otrzymał e-mail powitalny.' });
        setNewPartner({
          fullName: '',
          email: '',
          roleCategory: 'standard',
          preferredPromoCode: '',
          specialization: 'Student kierunku medycznego / Ambasador HappyBirth',
          profileUrl: '',
          brokerPromoCode: '',
        });
        setShowAddPartnerForm(false);
        await loadAdminData();
      }
    } catch {
      setFeedback({ type: 'err', text: 'Błąd połączenia z serwerem.' });
    } finally {
      setCreatingPartner(false);
    }
  };

  const handleRecordManualCommSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      setRecordingComm(true);
      const res = await fetch('/api/affiliate/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_manual_commission',
          affiliateId: manualComm.affiliateId,
          orderRef: manualComm.orderRef || `HB-MANUAL-${Date.now().toString().slice(-5)}`,
          paidAmountPln: Number(manualComm.paidAmountPln.replace(',', '.')),
          status: manualComm.status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setFeedback({ type: 'err', text: data.error || 'Nie udało się naliczyć prowizji.' });
      } else {
        setFeedback({ type: 'ok', text: data.message || 'Prowizja została dopisana.' });
        setManualComm((prev) => ({ ...prev, orderRef: '' }));
        setShowManualCommForm(false);
        await loadAdminData();
        if (onRefreshParent) onRefreshParent();
      }
    } catch {
      setFeedback({ type: 'err', text: 'Błąd połączenia z serwerem.' });
    } finally {
      setRecordingComm(false);
    }
  };

  const handleExportPendingPayoutsCsv = () => {
    const rowsToExport = payoutRequests.filter((p) =>
      payoutFilter === 'ALL' ? true : p.status === payoutFilter
    );
    if (rowsToExport.length === 0) return;

    const header = [
      'ID_Wyplaty',
      'Status',
      'Data_Zlecenia',
      'Odbiorca_Imie_Nazwisko_Lub_Firma',
      'Email_Partnera',
      'Kod_Afiliacyjny',
      'Typ_Rozliczenia',
      'NIP',
      'Numer_Faktury_Rachunku',
      'IBAN',
      'Kwota_Brutto_PLN',
      'Tytul_Przelewu',
    ];

    const lines = rowsToExport.map((r) => {
      const kwota = (r.amountGrossMinor / 100).toFixed(2).replace('.', ',');
      const tytul = `Wyplata prowizji afiliacyjnej HappyBirth ${r.id} (${r.affiliatePromoCode}) ${
        r.invoiceNumber ? `FV ${r.invoiceNumber}` : ''
      }`.trim();
      return [
        r.id,
        r.status,
        r.requestedAt,
        `"${(r.legalName || r.affiliateName || '').replace(/"/g, '""')}"`,
        r.affiliateEmail,
        r.affiliatePromoCode,
        r.settlementType,
        r.nip || '',
        `"${(r.invoiceNumber || '').replace(/"/g, '""')}"`,
        r.iban.replace(/\s+/g, ''),
        `"${kwota}"`,
        `"${tytul.replace(/"/g, '""')}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [header.join(';'), ...lines].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wyplaty-afiliacja-happybirth-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPayouts = payoutRequests.filter((p) =>
    payoutFilter === 'ALL' ? true : p.status === payoutFilter
  );

  const filteredAffiliates = affiliates.filter((a) => {
    if (affiliateStageFilter === 'blocked' && a.status !== 'blocked') return false;
    if (
      affiliateStageFilter !== 'ALL' &&
      affiliateStageFilter !== 'blocked' &&
      a.roleCategory !== affiliateStageFilter
    ) {
      return false;
    }
    if (!affiliateSearch.trim()) return true;
    const q = affiliateSearch.trim().toLowerCase();
    return (
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.promoCode.toLowerCase().includes(q) ||
      (a.specialization || '').toLowerCase().includes(q)
    );
  });

  if (loading && affiliates.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-[#EAE3DB] p-10 text-center space-y-3">
        <RefreshCw className="w-7 h-7 text-[#DA0271] animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#1A1512]">
          Ładowanie danych operacyjnych Panelu Administratora z bazy Cloudflare D1...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="font-bold text-base text-rose-900">{error}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BANER ADMINISTRATORA */}
      <div className="rounded-3xl bg-[#1A1512] text-white p-6 sm:p-8 border-2 border-[#FCD705]/60 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCD705] text-[#1A1512] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Administratora Afiliacji · KLARSOLUTIONS Sp. z o.o.</span>
          </div>
          <h2 className="font-brand-display font-bold text-2xl sm:text-3xl text-white">
            Zarządzanie Studentami, Partnerami Etapu 2, Prowizjami i Wypłatami
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            Zalogowano jako administrator: <strong className="text-[#FCD705]">{adminEmail}</strong>. Wszystkie operacje wykonują zapytania bezpośrednio na produkcyjnej bazie Cloudflare D1 oraz wysyłają powiadomienia transakcyjne Resend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSubTab('affiliates');
              setShowAddPartnerForm(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj Studenta / Partnera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('commissions');
              setShowManualCommForm(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FCD705]" />
            <span>Naliczenie ręczne prowizji</span>
          </button>

          <button
            type="button"
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-[#1A1512] hover:bg-[#FCD705] text-xs font-bold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Odśwież D1</span>
          </button>
        </div>
      </div>

      {/* POWIADOMIENIE O WYNIKU AKCJI */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-4 ${
            feedback.type === 'ok'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            Zamknij
          </button>
        </div>
      )}

      {/* 6 KART KPI GLOBALNYCH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-500/50 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Do wypłaty (Zlecenia)
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {formatPln(adminStats.pendingPayoutsMinor)}
          </div>
          <div className="text-[11px] text-[#867A72]">
            Oczekujące przelewy: <strong>{adminStats.pendingPayoutsCount}</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Wypłacono łącznie
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {formatPln(adminStats.paidPayoutsMinor)}
          </div>
          <div className="text-[11px] text-[#867A72]">
            Zrealizowane przelewy: <strong>{adminStats.paidPayoutsCount}</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#DA0271]">
            Partnerzy w bazie ({adminStats.totalAffiliates})
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {adminStats.stage1StudentsCount} <span className="text-xs font-normal text-[#867A72]">Etap 1 (20%)</span>
          </div>
          <div className="text-[11px] text-[#867A72]">
            Etap 2: <strong>{adminStats.stage2MidwivesCount}</strong> (30%) · <strong>{adminStats.stage2CreatorsCount}</strong> (25%)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#544A44]">
            Sprzedaż z afiliacji
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {formatPln(adminStats.totalRevenueMinor)}
          </div>
          <div className="text-[11px] text-[#867A72]">
            Opłacone kursy: <strong>{adminStats.totalOrdersCount}</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE3DB] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#544A44]">
            Salda na kontach (ELIGIBLE)
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {formatPln(adminStats.totalCommissionsEligibleMinor)}
          </div>
          <div className="text-[11px] text-[#867A72]">
            W buforze (PENDING): <strong>{formatPln(adminStats.totalCommissionsPendingMinor)}</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#544A44]">
            Polecenia Mam (Strefa)
          </div>
          <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
            {adminStats.motherReferralsCount}
          </div>
          <div className="text-[11px] text-[#867A72]">
            Prezent PDF (0,00 zł prowizji)
          </div>
        </div>
      </div>

      {/* NAWIGACJA WEWNĄTRZ PANELU ADMINISTRATORA */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EAE3DB]">
        {[
          {
            id: 'payouts',
            label: `1. Kolejka Wypłat IBAN (${adminStats.pendingPayoutsCount} oczekujących)`,
            icon: Wallet,
          },
          {
            id: 'affiliates',
            label: `2. Studenci i Partnerzy (${adminStats.totalAffiliates}) · Stawki 20%/25%/30%`,
            icon: Users,
          },
          {
            id: 'commissions',
            label: `3. Rejestr Prowizji i Naliczenia Ręczne (${commissions.length})`,
            icon: TrendingUp,
          },
          {
            id: 'inquiries',
            label: `4. Wnioski o Etap 2 i B2B (${adminStats.inquiriesCount})`,
            icon: FileText,
          },
          {
            id: 'mothers',
            label: `5. Polecenia Mam z Prezentem PDF (${adminStats.motherReferralsCount})`,
            icon: BookOpen,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#1A1512] text-[#FCD705] shadow-xs'
                  : 'bg-white text-[#544A44] hover:text-[#DA0271] border border-b-0 border-[#EAE3DB]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================
          POD-ZAKŁADKA 1: KOLEJKA WYPŁAT IBAN (PROCESSING -> PAID / REJECTED)
         ======================================================================== */}
      {subTab === 'payouts' && (
        <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                Dyspozycje wypłat prowizji od Studentów i Partnerów
              </h3>
              <p className="text-xs text-[#867A72]">
                Skopiuj numer IBAN jednym kliknięciem do bankowości KLARSOLUTIONS Sp. z o.o., a po wykonaniu przelewu kliknij „Zatwierdź jako WYPŁACONE” (system automatycznie wyśle potwierdzenie e-mail do studenta).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['ALL', 'PROCESSING', 'PAID', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setPayoutFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    payoutFilter === st
                      ? 'bg-[#DA0271] text-white'
                      : 'bg-[#FAF7F2] border border-[#EAE3DB] text-[#544A44]'
                  }`}
                >
                  {st === 'ALL'
                    ? 'Wszystkie'
                    : st === 'PROCESSING'
                      ? `Do przelewu (${adminStats.pendingPayoutsCount})`
                      : st === 'PAID'
                        ? 'Wypłacone'
                        : 'Odrzucone'}
                </button>
              ))}

              <button
                type="button"
                onClick={handleExportPendingPayoutsCsv}
                disabled={filteredPayouts.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Eksportuj CSV dla banku/księgowości</span>
              </button>
            </div>
          </div>

          {filteredPayouts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center text-xs text-[#544A44]">
              Brak zleceń wypłat w wybranym filtrze.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayouts.map((p) => {
                const transferTitle = `Wyplata prowizji HappyBirth ${p.id} (${p.affiliatePromoCode})${
                  p.invoiceNumber ? ` FV ${p.invoiceNumber}` : ''
                }`;
                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                      p.status === 'PROCESSING'
                        ? 'bg-amber-50/40 border-amber-300'
                        : p.status === 'PAID'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-stone-100 border-stone-200 opacity-75'
                    }`}
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#1A1512] text-[#FCD705]">
                          {p.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.status === 'PROCESSING'
                              ? 'bg-amber-200 text-amber-900'
                              : p.status === 'PAID'
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {p.status === 'PROCESSING'
                            ? 'OCZEKUJE NA PRZELEW'
                            : p.status === 'PAID'
                              ? `WYPŁACONO (${p.paidAt ? new Date(p.paidAt).toLocaleDateString('pl-PL') : ''})`
                              : 'ODRZUCONO'}
                        </span>
                        <span className="text-xs font-bold text-[#DA0271]">
                          {settlementLabel(p.settlementType)}
                        </span>
                        <span className="text-xs text-[#867A72]">
                          Zlecono: {new Date(p.requestedAt).toLocaleString('pl-PL')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                        <div>
                          <span className="text-[#867A72]">Odbiorca przelewu: </span>
                          <strong className="text-[#1A1512]">{p.legalName || p.affiliateName}</strong> ({p.affiliateEmail})
                        </div>
                        <div>
                          <span className="text-[#867A72]">Kod partnera: </span>
                          <strong className="font-mono text-[#DA0271]">{p.affiliatePromoCode}</strong>
                        </div>
                        {p.nip && (
                          <div>
                            <span className="text-[#867A72]">NIP: </span>
                            <strong className="font-mono">{p.nip}</strong>
                          </div>
                        )}
                        {p.invoiceNumber && (
                          <div>
                            <span className="text-[#867A72]">Nr faktury / rachunku: </span>
                            <strong className="font-mono text-[#1A1512]">{p.invoiceNumber}</strong>
                          </div>
                        )}
                        {p.address && (
                          <div className="sm:col-span-2">
                            <span className="text-[#867A72]">Adres: </span>
                            <span>{p.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Rachunek IBAN + szybkie kopiowanie do banku */}
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3DB] font-mono text-xs font-bold text-[#1A1512]">
                          IBAN: {p.iban}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(`iban-${p.id}`, p.iban.replace(/\s+/g, ''))}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3DB] hover:border-[#DA0271] text-xs font-bold text-[#DA0271] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `iban-${p.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Skopiowano IBAN</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopiuj IBAN</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(`title-${p.id}`, transferTitle)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3DB] hover:border-[#DA0271] text-xs font-semibold text-[#544A44] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `title-${p.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Skopiowano tytuł</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopiuj tytuł przelewu</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Kwota + przyciski decyzyjne Admina */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#EAE3DB]">
                      <div className="text-left lg:text-right">
                        <div className="text-[10px] font-bold uppercase text-[#867A72]">Kwota do przelewu</div>
                        <div className="font-brand-display font-bold text-2xl text-[#1A1512]">
                          {formatPln(p.amountGrossMinor)}
                        </div>
                      </div>

                      {p.status === 'PROCESSING' && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={busyId === `pay-${p.id}`}
                            onClick={() =>
                              runAdminAction(
                                { action: 'mark_payout_paid', payoutId: p.id },
                                `pay-${p.id}`
                              )
                            }
                            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {busyId === `pay-${p.id}`
                                ? 'Zatwierdzanie...'
                                : 'Zatwierdź jako WYPŁACONE'}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={busyId === `rej-${p.id}`}
                            onClick={() =>
                              runAdminAction(
                                { action: 'reject_payout', payoutId: p.id },
                                `rej-${p.id}`
                              )
                            }
                            className="px-3.5 py-2.5 rounded-full bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Odrzuć (zwróć saldo)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================
          POD-ZAKŁADKA 2: BAZA STUDENTÓW I PARTNERÓW + ZARZĄDZANIE STAWKAMI
         ======================================================================== */}
      {subTab === 'affiliates' && (
        <div className="space-y-6">
          {/* Formularz ręcznego dodawania Studenta / Partnera przez Administratora */}
          {showAddPartnerForm && (
            <div className="rounded-3xl bg-[#FAF7F2] border-2 border-[#DA0271] p-6 sm:p-8 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                    Ręczna rejestracja przez Administratora
                  </span>
                  <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                    Dodaj nowego Studenta, Ambasadora, Położną, Fizjoterapeutkę lub Mikroinfluencerkę
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPartnerForm(false)}
                  className="text-xs font-bold text-[#867A72] hover:text-[#1A1512] cursor-pointer"
                >
                  Zamknij ✕
                </button>
              </div>

              <form onSubmit={handleCreatePartnerSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPartner.fullName}
                    onChange={(e) => setNewPartner({ ...newPartner, fullName: e.target.value })}
                    placeholder="np. Kasia Nowak"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Adres e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="np. kasia@student.ump.edu.pl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Etap i Stawka Prowizyjna *
                  </label>
                  <select
                    value={newPartner.roleCategory}
                    onChange={(e) =>
                      setNewPartner({
                        ...newPartner,
                        roleCategory: e.target.value,
                        specialization:
                          e.target.value === 'midwife_physio'
                            ? 'Położna / Fizjoterapeutka (Etap 2 · 30%)'
                            : e.target.value === 'creator_publisher'
                              ? 'Mikroinfluencerka / Twórca (Etap 2 · 25%)'
                              : 'Student kierunku medycznego / Ambasador (Etap 1 · 20%)',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-bold"
                  >
                    <option value="standard">Etap 1: Student / Ambasador (20% = 88,02 zł)</option>
                    <option value="creator_publisher">Etap 2: Mikroinfluencerka / Twórca (25% = 110,03 zł)</option>
                    <option value="midwife_physio">Etap 2: Położna / Fizjoterapeutka (30% = 132,03 zł)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Semantyczny Kod Rabatowy -10% (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={newPartner.preferredPromoCode}
                    onChange={(e) =>
                      setNewPartner({ ...newPartner, preferredPromoCode: e.target.value.toUpperCase() })
                    }
                    placeholder="np. SPOKOJ-KASIA lub OD-KASI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-mono font-bold"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {generateSmartPartnerCodeCandidates(
                      newPartner.fullName || 'Kasia',
                      newPartner.roleCategory,
                      newPartner.email
                    )
                      .slice(0, 4)
                      .map((cand) => (
                        <button
                          key={cand.code}
                          type="button"
                          onClick={() => setNewPartner({ ...newPartner, preferredPromoCode: cand.code })}
                          title={cand.categoryLabel}
                          className="px-2 py-0.5 rounded-md bg-white border border-[#EAE3DB] hover:border-[#DA0271] text-[10px] font-mono font-bold text-[#1A1512] cursor-pointer"
                        >
                          {cand.code}
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Uczelnia / Specjalizacja / Opis
                  </label>
                  <input
                    type="text"
                    value={newPartner.specialization}
                    onChange={(e) => setNewPartner({ ...newPartner, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Kod Brokera nadrzędnego (opcjonalnie 5%)
                  </label>
                  <input
                    type="text"
                    value={newPartner.brokerPromoCode}
                    onChange={(e) =>
                      setNewPartner({ ...newPartner, brokerPromoCode: e.target.value.toUpperCase() })
                    }
                    placeholder="np. STUDENT-MAREK10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={creatingPartner}
                    className="px-6 py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    {creatingPartner
                      ? 'Tworzenie konta w D1...'
                      : 'Utwórz konto partnera i wyślij e-mail powitalny z dostępem →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Wyszukiwarka i filtry Partnerów */}
          <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#867A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={affiliateSearch}
                  onChange={(e) => setAffiliateSearch(e.target.value)}
                  placeholder="Szukaj po nazwisku, e-mailu, uczelni lub kodzie rabatowym..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EAE3DB] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'ALL', label: `Wszyscy (${affiliates.length})` },
                  { id: 'standard', label: `Etap 1: Studenci 20% (${adminStats.stage1StudentsCount})` },
                  { id: 'creator_publisher', label: `Etap 2: Twórcy 25% (${adminStats.stage2CreatorsCount})` },
                  { id: 'midwife_physio', label: `Etap 2: Położne/Fizjo 30% (${adminStats.stage2MidwivesCount})` },
                  { id: 'blocked', label: 'Zablokowani' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAffiliateStageFilter(f.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                      affiliateStageFilter === f.id
                        ? 'bg-[#250A24] text-white'
                        : 'bg-[#FAF7F2] border border-[#EAE3DB] text-[#544A44]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredAffiliates.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center text-xs text-[#544A44]">
                Brak partnerów spełniających kryteria wyszukiwania.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3DB] text-[#867A72] uppercase">
                      <th className="py-3 pr-3">Student / Partner</th>
                      <th className="py-3 pr-3">Kod Rabatowy (-10%)</th>
                      <th className="py-3 pr-3">Etap / Stawka Prowizji</th>
                      <th className="py-3 pr-3">Sprzedaż</th>
                      <th className="py-3 pr-3">Do wypłaty / Wypłacone</th>
                      <th className="py-3 pr-3">Dane IBAN / Rozliczenie</th>
                      <th className="py-3">Status i Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3DB]">
                    {filteredAffiliates.map((a) => (
                      <tr key={a.id} className={a.status === 'blocked' ? 'opacity-50 bg-rose-50/30' : ''}>
                        <td className="py-3.5 pr-3">
                          <div className="font-bold text-[#1A1512]">{a.fullName}</div>
                          <div className="text-[11px] text-[#544A44]">{a.email}</div>
                          <div className="text-[10px] text-[#867A72]">{a.specialization}</div>
                          {a.brokerPromoCode && (
                            <div className="text-[10px] text-[#DA0271] font-semibold">
                              Broker nadrzędny: {a.brokerName} ({a.brokerPromoCode})
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingCodeMap[a.id] ?? a.promoCode}
                              onChange={(e) =>
                                setEditingCodeMap({
                                  ...editingCodeMap,
                                  [a.id]: e.target.value.toUpperCase(),
                                })
                              }
                              className="w-32 px-2.5 py-1.5 rounded-lg border border-[#EAE3DB] bg-[#FAF7F2] font-mono font-bold text-xs text-[#DA0271]"
                            />
                            {editingCodeMap[a.id] && editingCodeMap[a.id] !== a.promoCode && (
                              <button
                                type="button"
                                onClick={() =>
                                  runAdminAction(
                                    {
                                      action: 'update_affiliate_tier',
                                      affiliateId: a.id,
                                      roleCategory: a.roleCategory,
                                      tier1Rate: a.tier1Rate,
                                      status: a.status,
                                      promoCode: editingCodeMap[a.id],
                                    },
                                    `code-${a.id}`
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#250A24] text-white text-[10px] font-bold cursor-pointer"
                              >
                                Zapisz
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 pr-3">
                          <select
                            value={a.roleCategory}
                            disabled={busyId === `tier-${a.id}`}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              const newRate =
                                newCat === 'midwife_physio'
                                  ? 0.3
                                  : newCat === 'creator_publisher'
                                    ? 0.25
                                    : 0.2;
                              runAdminAction(
                                {
                                  action: 'update_affiliate_tier',
                                  affiliateId: a.id,
                                  roleCategory: newCat,
                                  tier1Rate: newRate,
                                  status: a.status,
                                },
                                `tier-${a.id}`
                              );
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#EAE3DB] bg-[#FAF7F2] font-bold text-xs cursor-pointer"
                          >
                            <option value="standard">Etap 1: 20% (Student / Ambasador)</option>
                            <option value="creator_publisher">Etap 2: 25% (Mikroinfluencerka)</option>
                            <option value="midwife_physio">Etap 2: 30% (Położna / Fizjo)</option>
                          </select>
                        </td>

                        <td className="py-3.5 pr-3 font-mono">
                          <div className="font-bold text-[#1A1512]">
                            {a.stats.directSalesCount} własne
                          </div>
                          <div className="text-[10px] text-[#867A72]">
                            +{a.stats.brokerSalesCount} z sieci Broker 5%
                          </div>
                        </td>

                        <td className="py-3.5 pr-3 font-mono">
                          <div className="font-bold text-emerald-700">
                            ELIGIBLE: {formatPln(a.stats.eligibleMinor)}
                          </div>
                          <div className="text-[10px] text-[#867A72]">
                            Wypłacono: {formatPln(a.stats.paidMinor)}
                          </div>
                        </td>

                        <td className="py-3.5 pr-3">
                          <div className="text-[11px] font-semibold text-[#1A1512]">
                            {settlementLabel(a.settlementType)}
                          </div>
                          {a.iban ? (
                            <div className="font-mono text-[10px] text-[#544A44] truncate max-w-[170px]" title={a.iban}>
                              {a.iban}
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#867A72]">Brak podanego IBAN</span>
                          )}
                        </td>

                        <td className="py-3.5">
                          <button
                            type="button"
                            disabled={busyId === `status-${a.id}`}
                            onClick={() =>
                              runAdminAction(
                                {
                                  action: 'update_affiliate_tier',
                                  affiliateId: a.id,
                                  roleCategory: a.roleCategory,
                                  tier1Rate: a.tier1Rate,
                                  status: a.status === 'active' ? 'blocked' : 'active',
                                },
                                `status-${a.id}`
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer ${
                              a.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                                : 'bg-rose-200 text-rose-900 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            {a.status === 'active' ? 'Aktywny (Zablokuj)' : 'Zablokowany (Odblokuj)'}
                          </button>
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

      {/* ========================================================================
          POD-ZAKŁADKA 3: REJESTR PROWIZJI I RĘCZNE NALICZANIE SPRZEDAŻY
         ======================================================================== */}
      {subTab === 'commissions' && (
        <div className="space-y-6">
          {showManualCommForm && (
            <div className="rounded-3xl bg-[#FAF7F2] border-2 border-[#DA0271] p-6 sm:p-8 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                    Ręczna atrybucja zamówienia przez Administratora
                  </span>
                  <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                    Dopisz sprzedaż i nalicz prowizję dla Studenta / Partnera
                  </h3>
                  <p className="text-xs text-[#544A44]">
                    Użyj tego formularza, gdy klientka kupiła kurs i zapomniała wpisać kodu rabatowego studenta (lub opłaciła zamówienie przelewem tradycyjnym).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualCommForm(false)}
                  className="text-xs font-bold text-[#867A72] hover:text-[#1A1512] cursor-pointer"
                >
                  Zamknij ✕
                </button>
              </div>

              <form onSubmit={handleRecordManualCommSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Wybierz Studenta / Partnera *
                  </label>
                  <select
                    required
                    value={manualComm.affiliateId}
                    onChange={(e) => setManualComm({ ...manualComm, affiliateId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-bold"
                  >
                    <option value="">-- Wybierz partnera z listy --</option>
                    {affiliates.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.fullName} ({a.promoCode} · {a.tier1RatePercent}%) — {a.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Kwota zakupu brutto (PLN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualComm.paidAmountPln}
                    onChange={(e) => setManualComm({ ...manualComm, paidAmountPln: e.target.value })}
                    placeholder="440.10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Status początkowy prowizji
                  </label>
                  <select
                    value={manualComm.status}
                    onChange={(e) => setManualComm({ ...manualComm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-bold"
                  >
                    <option value="ELIGIBLE">ELIGIBLE (Od razu dostępne do wypłaty)</option>
                    <option value="PENDING">PENDING (W buforze weryfikacji)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-[#544A44] mb-1">
                    Numer zamówienia / Referencja (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={manualComm.orderRef}
                    onChange={(e) => setManualComm({ ...manualComm, orderRef: e.target.value })}
                    placeholder="np. HB-2026-8412"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3DB] bg-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end justify-end">
                  <button
                    type="submit"
                    disabled={recordingComm}
                    className="px-6 py-2.5 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    {recordingComm ? 'Zapisywanie w D1...' : 'Naliczenie prowizji na saldo partnera →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
                  Wszystkie prowizje w sieci afiliacyjnej ({commissions.length})
                </h3>
                <p className="text-xs text-[#867A72]">
                  Możesz ręcznie odblokować prowizję z bufora (`PENDING` → `ELIGIBLE`) lub anulować ją w przypadku zwrotu zamówienia (`CANCELLED`).
                </p>
              </div>
              {!showManualCommForm && (
                <button
                  type="button"
                  onClick={() => setShowManualCommForm(true)}
                  className="px-4 py-2 rounded-full bg-[#250A24] text-white text-xs font-bold cursor-pointer"
                >
                  + Dopisz prowizję ręcznie
                </button>
              )}
            </div>

            {commissions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center text-xs text-[#544A44]">
                Brak naliczonych prowizji w bazie D1.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3DB] text-[#867A72] uppercase">
                      <th className="py-3 pr-3">Data</th>
                      <th className="py-3 pr-3">Zamówienie</th>
                      <th className="py-3 pr-3">Partner Poziomu 1</th>
                      <th className="py-3 pr-3">Kwota zakupu</th>
                      <th className="py-3 pr-3">Prowizja T1</th>
                      <th className="py-3 pr-3">Broker T2 (5%)</th>
                      <th className="py-3">Status (Zmień na żywo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3DB]">
                    {commissions.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 pr-3 font-mono text-[#544A44]">
                          {new Date(c.createdAt).toLocaleDateString('pl-PL')}
                        </td>
                        <td className="py-3 pr-3 font-mono font-bold text-[#1A1512]">
                          {c.orderId}
                        </td>
                        <td className="py-3 pr-3">
                          <div className="font-bold text-[#1A1512]">{c.affiliateName}</div>
                          <div className="text-[10px] font-mono text-[#DA0271]">
                            {c.affiliatePromoCode} ({c.tier1RatePercent}%)
                          </div>
                        </td>
                        <td className="py-3 pr-3 font-mono">{formatPln(c.paidAmountGrossMinor)}</td>
                        <td className="py-3 pr-3 font-mono font-bold text-[#DA0271]">
                          +{formatPln(c.tier1CommissionGrossMinor)}
                        </td>
                        <td className="py-3 pr-3 font-mono">
                          {c.brokerId && c.tier2CommissionGrossMinor > 0 ? (
                            <span>
                              +{formatPln(c.tier2CommissionGrossMinor)} ({c.brokerPromoCode})
                            </span>
                          ) : (
                            <span className="text-[#867A72]">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          <select
                            value={c.status}
                            disabled={busyId === `comm-${c.id}`}
                            onChange={(e) =>
                              runAdminAction(
                                {
                                  action: 'update_commission_status',
                                  commissionId: c.id,
                                  newStatus: e.target.value,
                                },
                                `comm-${c.id}`
                              )
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer border ${
                              c.status === 'ELIGIBLE'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : c.status === 'PAID'
                                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                                  : c.status === 'CANCELLED'
                                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            <option value="PENDING">PENDING (W buforze)</option>
                            <option value="ELIGIBLE">ELIGIBLE (Gotowe do wypłaty)</option>
                            <option value="PAID">PAID (Wypłacone)</option>
                            <option value="CANCELLED">CANCELLED (Anulowane / Zwrot)</option>
                          </select>
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

      {/* ========================================================================
          POD-ZAKŁADKA 4: WNIOSKI O ETAP 2 (25%/30%) ORAZ ZAPYTANIA B2B
         ======================================================================== */}
      {subTab === 'inquiries' && (
        <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
              Zgłoszenia z formularzy rejestracyjnych i wnioski o stawkę Etapu 2 (25% / 30%)
            </h3>
            <p className="text-xs text-[#867A72]">
              Każda osoba rejestrująca się w formularzu startuje bezpiecznie ze stawką 20% (Etap 1). Jeśli jest położną, fizjoterapeutką lub mikroinfluencerką, tutaj jednym kliknięciem zatwierdzisz jej stawkę 30% lub 25%.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center text-xs text-[#544A44]">
              Brak zgłoszeń w tabeli <code>partnership_inquiries</code>.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.channel === 'partnerzy_b2b'
                            ? 'bg-[#250A24] text-[#FCD705]'
                            : 'bg-[#FAE3EB] text-[#DA0271]'
                        }`}
                      >
                        {inq.channel === 'partnerzy_b2b' ? 'Zapytanie B2B (partnerzy.happybirth.pl)' : 'Rejestracja Afiliacja'}
                      </span>
                      <strong className="text-sm text-[#1A1512]">{inq.fullName}</strong>
                      <span className="text-[#544A44]">({inq.email})</span>
                      {inq.phone && <span className="text-[#867A72]">· Tel: {inq.phone}</span>}
                      <span className="text-[#867A72]">
                        · {new Date(inq.createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>

                    <div className="text-[#1A1512] font-semibold">
                      Obszar / Rola: <span className="text-[#DA0271]">{inq.roleOrArea}</span>
                    </div>

                    {inq.profileUrl && (
                      <div>
                        Profil / Gabinet:{' '}
                        <a
                          href={inq.profileUrl.startsWith('http') ? inq.profileUrl : `https://${inq.profileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#DA0271] underline inline-flex items-center gap-1"
                        >
                          <span>{inq.profileUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {inq.message && <div className="text-[#544A44] italic">„{inq.message}”</div>}
                  </div>

                  {inq.affiliateId && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3DB] text-xs font-bold">
                        Aktualna stawka: {inq.affiliateTier1RatePercent}% ({inq.affiliatePromoCode})
                      </span>

                      {inq.affiliateTier1RatePercent !== 30 && (
                        <button
                          type="button"
                          disabled={busyId === `inq30-${inq.id}`}
                          onClick={() =>
                            runAdminAction(
                              {
                                action: 'update_affiliate_tier',
                                affiliateId: inq.affiliateId,
                                roleCategory: 'midwife_physio',
                                tier1Rate: 0.3,
                                status: 'active',
                              },
                              `inq30-${inq.id}`
                            )
                          }
                          className="px-3.5 py-2 rounded-full bg-[#250A24] hover:bg-[#DA0271] text-white text-xs font-bold cursor-pointer"
                        >
                          Zatwierdź 30% (Położna/Fizjo)
                        </button>
                      )}

                      {inq.affiliateTier1RatePercent !== 25 && (
                        <button
                          type="button"
                          disabled={busyId === `inq25-${inq.id}`}
                          onClick={() =>
                            runAdminAction(
                              {
                                action: 'update_affiliate_tier',
                                affiliateId: inq.affiliateId,
                                roleCategory: 'creator_publisher',
                                tier1Rate: 0.25,
                                status: 'active',
                              },
                              `inq25-${inq.id}`
                            )
                          }
                          className="px-3.5 py-2 rounded-full bg-white border border-[#DA0271] text-[#DA0271] hover:bg-[#FAE3EB] text-xs font-bold cursor-pointer"
                        >
                          Zatwierdź 25% (Twórca)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================
          POD-ZAKŁADKA 5: POLECENIA MAM W STREFIE RODZICÓW (PREZENT PDF)
         ======================================================================== */}
      {subTab === 'mothers' && (
        <div className="rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h3 className="font-brand-display font-bold text-xl text-[#1A1512]">
              Rejestr poleceń koleżance przez Mamy w Strefie Rodziców (Kody <code>MAMA-XXXX</code>)
            </h3>
            <p className="text-xs text-[#867A72]">
              Mamy są wyłączone z komercyjnego programu prowizyjnego. Każde polecenie poniżej dało koleżance zniżkę -10% (440,10 zł) i odblokowało polecającej Mamie Prezent PDF (E-book z przepisami 15-min) bez naliczania prowizji pieniężnej.
            </p>
          </div>

          {motherReferrals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE3DB] text-center text-xs text-[#544A44]">
              Brak zarejestrowanych poleceń z kodem <code>MAMA-XXXX</code>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAE3DB] text-[#867A72] uppercase">
                    <th className="py-3 pr-4">Data</th>
                    <th className="py-3 pr-4">Polecająca Mama</th>
                    <th className="py-3 pr-4">Kod Mamy (-10%)</th>
                    <th className="py-3 pr-4">Koleżanka (Kupująca)</th>
                    <th className="py-3 pr-4">Odblokowany Prezent</th>
                    <th className="py-3">Prowizja pieniężna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3DB]">
                  {motherReferrals.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 pr-4 font-mono text-[#544A44]">
                        {new Date(m.unlockedAt).toLocaleString('pl-PL')}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-[#1A1512]">{m.referrerName}</div>
                        <div className="text-[11px] text-[#867A72]">{m.referrerEmail}</div>
                      </td>
                      <td className="py-3 pr-4 font-mono font-bold text-[#DA0271]">
                        {m.referrerCode}
                      </td>
                      <td className="py-3 pr-4">{m.referredEmail || 'Zakup z kodem Mamy'}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          E-book PDF (Odblokowany)
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[#867A72]">0,00 zł (Program Prezentowy)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
