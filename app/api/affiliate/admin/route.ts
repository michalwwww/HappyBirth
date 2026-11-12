import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

async function verifyLocalAdmin(): Promise<{ authorized: boolean; email: string | null }> {
  const session = await getSession();
  if (!session?.email) return { authorized: false, email: null };
  const cleanEmail = session.email.trim().toLowerCase();
  if (TEAM_WHITELIST_EMAILS.has(cleanEmail) || session.role === 'admin') {
    return { authorized: true, email: cleanEmail };
  }
  const extra = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (extra.includes(cleanEmail)) {
    return { authorized: true, email: cleanEmail };
  }
  try {
    const u = await d1First<any>(`SELECT role FROM users WHERE LOWER(email) = ? LIMIT 1`, [cleanEmail]);
    if (u?.role === 'admin') return { authorized: true, email: cleanEmail };
  } catch {}
  return { authorized: false, email: cleanEmail };
}

export async function GET() {
  try {
    const auth = await verifyLocalAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Brak uprawnień administratora.' }, { status: 403 });
    }

    const rawAffiliates = await d1All<any>(
      `SELECT
         a.*,
         b.full_name AS broker_name,
         b.promo_code AS broker_promo_code,
         s.settlement_type,
         s.legal_name,
         s.nip,
         s.iban,
         s.address
       FROM affiliates a
       LEFT JOIN affiliates b ON b.id = a.referred_by_broker_id
       LEFT JOIN affiliate_settings s ON s.affiliate_id = a.id
       ORDER BY a.created_at DESC
       LIMIT 500`
    );

    const rawCommissions = await d1All<any>(
      `SELECT
         c.*,
         a.full_name AS affiliate_name,
         a.email AS affiliate_email,
         a.promo_code AS affiliate_promo_code,
         b.full_name AS broker_name,
         b.promo_code AS broker_promo_code
       FROM affiliate_commissions c
       LEFT JOIN affiliates a ON a.id = c.affiliate_id
       LEFT JOIN affiliates b ON b.id = c.broker_id
       ORDER BY c.created_at DESC
       LIMIT 300`
    );

    const perAffiliateStats = new Map<
      string,
      {
        directSalesCount: number;
        brokerSalesCount: number;
        eligibleMinor: number;
        pendingMinor: number;
        paidMinor: number;
        totalEarnedMinor: number;
      }
    >();

    let totalRevenueMinor = 0;
    let totalCommissionsEligibleMinor = 0;
    let totalCommissionsPendingMinor = 0;
    let totalCommissionsPaidMinor = 0;
    let totalOrdersCount = 0;

    for (const c of rawCommissions) {
      const affId = c.affiliate_id;
      const brokId = c.broker_id;
      const t1 = Number(c.tier1_commission_gross || 0);
      const t2 = Number(c.tier2_commission_gross || 0);
      const paidGross = Number(c.paid_amount_gross || 0);
      const rowCancelled = String(c.status || 'PENDING') === 'CANCELLED';
      const t1St = rowCancelled ? 'CANCELLED' : String(c.tier1_status || c.status || 'PENDING');
      const t2St = rowCancelled ? 'CANCELLED' : String(c.tier2_status || c.status || 'PENDING');

      if (!rowCancelled) {
        totalOrdersCount += 1;
        totalRevenueMinor += paidGross;
      }

      if (affId) {
        if (t1St === 'ELIGIBLE') totalCommissionsEligibleMinor += t1;
        else if (t1St === 'PENDING' || t1St === 'PROCESSING') totalCommissionsPendingMinor += t1;
        else if (t1St === 'PAID') totalCommissionsPaidMinor += t1;

        const cur = perAffiliateStats.get(affId) || {
          directSalesCount: 0,
          brokerSalesCount: 0,
          eligibleMinor: 0,
          pendingMinor: 0,
          paidMinor: 0,
          totalEarnedMinor: 0,
        };
        if (t1St !== 'CANCELLED') cur.directSalesCount += 1;
        if (t1St === 'ELIGIBLE') cur.eligibleMinor += t1;
        else if (t1St === 'PENDING') cur.pendingMinor += t1;
        else if (t1St === 'PAID') cur.paidMinor += t1;
        cur.totalEarnedMinor = cur.eligibleMinor + cur.pendingMinor + cur.paidMinor;
        perAffiliateStats.set(affId, cur);
      }

      if (brokId && t2 > 0) {
        if (t2St === 'ELIGIBLE') totalCommissionsEligibleMinor += t2;
        else if (t2St === 'PENDING' || t2St === 'PROCESSING') totalCommissionsPendingMinor += t2;
        else if (t2St === 'PAID') totalCommissionsPaidMinor += t2;

        const curB = perAffiliateStats.get(brokId) || {
          directSalesCount: 0,
          brokerSalesCount: 0,
          eligibleMinor: 0,
          pendingMinor: 0,
          paidMinor: 0,
          totalEarnedMinor: 0,
        };
        if (t2St !== 'CANCELLED') curB.brokerSalesCount += 1;
        if (t2St === 'ELIGIBLE') curB.eligibleMinor += t2;
        else if (t2St === 'PENDING') curB.pendingMinor += t2;
        else if (t2St === 'PAID') curB.paidMinor += t2;
        curB.totalEarnedMinor = curB.eligibleMinor + curB.pendingMinor + curB.paidMinor;
        perAffiliateStats.set(brokId, curB);
      }
    }

    let activeAffiliates = 0;
    let stage1StudentsCount = 0;
    let stage2CreatorsCount = 0;
    let stage2MidwivesCount = 0;

    const affiliates = rawAffiliates.map((a) => {
      if (a.status === 'active') activeAffiliates += 1;
      if (a.role_category === 'midwife_physio') stage2MidwivesCount += 1;
      else if (a.role_category === 'creator_publisher') stage2CreatorsCount += 1;
      else stage1StudentsCount += 1;

      const st = perAffiliateStats.get(a.id) || {
        directSalesCount: 0,
        brokerSalesCount: 0,
        eligibleMinor: 0,
        pendingMinor: 0,
        paidMinor: 0,
        totalEarnedMinor: 0,
      };

      return {
        id: a.id,
        email: a.email,
        fullName: a.full_name,
        roleCategory: a.role_category || 'standard',
        specialization: a.specialization || 'Student / Ambasador HappyBirth',
        profileUrl: a.profile_or_practice_url || '',
        promoCode: a.promo_code,
        refSlug: a.ref_slug,
        tier1Rate: Number(a.tier1_rate || 0.2),
        tier1RatePercent: Math.round(Number(a.tier1_rate || 0.2) * 100),
        tier2OverrideRatePercent: Math.round(Number(a.tier2_override_rate || 0.05) * 100),
        referredByBrokerId: a.referred_by_broker_id || null,
        brokerName: a.broker_name || null,
        brokerPromoCode: a.broker_promo_code || null,
        status: a.status || 'active',
        createdAt: a.created_at,
        settlementType: a.settlement_type || 'private_person',
        legalName: a.legal_name || a.full_name,
        nip: a.nip || '',
        iban: a.iban || '',
        address: a.address || '',
        stats: st,
      };
    });

    const rawPayouts = await d1All<any>(
      `SELECT
         p.*,
         a.full_name AS affiliate_name,
         a.email AS affiliate_email,
         a.promo_code AS affiliate_promo_code,
         a.role_category AS affiliate_role_category,
         s.address AS affiliate_address
       FROM affiliate_payouts p
       LEFT JOIN affiliates a ON a.id = p.affiliate_id
       LEFT JOIN affiliate_settings s ON s.affiliate_id = p.affiliate_id
       ORDER BY
         CASE WHEN p.status = 'PROCESSING' THEN 0 ELSE 1 END ASC,
         p.requested_at DESC
       LIMIT 300`
    );

    let pendingPayoutsCount = 0;
    let pendingPayoutsMinor = 0;
    let paidPayoutsCount = 0;
    let paidPayoutsMinor = 0;

    const payoutRequests = rawPayouts.map((p) => {
      const amt = Number(p.amount_gross_minor || 0);
      if (p.status === 'PROCESSING') {
        pendingPayoutsCount += 1;
        pendingPayoutsMinor += amt;
      } else if (p.status === 'PAID') {
        paidPayoutsCount += 1;
        paidPayoutsMinor += amt;
      }
      return {
        id: p.id,
        affiliateId: p.affiliate_id,
        affiliateName: p.affiliate_name || p.legal_name,
        affiliateEmail: p.affiliate_email || '',
        affiliatePromoCode: p.affiliate_promo_code || '',
        affiliateRoleCategory: p.affiliate_role_category || 'standard',
        amountGrossMinor: amt,
        settlementType: p.settlement_type || 'private_person',
        legalName: p.legal_name,
        nip: p.nip || '',
        iban: p.iban || '',
        address: p.affiliate_address || '',
        invoiceNumber: p.invoice_number || null,
        status: p.status || 'PROCESSING',
        requestedAt: p.requested_at,
        paidAt: p.paid_at || null,
      };
    });

    const commissions = rawCommissions.map((c) => ({
      id: c.id,
      orderId: c.order_id,
      stripeSessionId: c.stripe_session_id,
      affiliateId: c.affiliate_id,
      affiliateName: c.affiliate_name || 'Partner',
      affiliateEmail: c.affiliate_email || '',
      affiliatePromoCode: c.affiliate_promo_code || '',
      brokerId: c.broker_id || null,
      brokerName: c.broker_name || null,
      brokerPromoCode: c.broker_promo_code || null,
      attributionSource: c.attribution_source || 'promo_code',
      paidAmountGrossMinor: Number(c.paid_amount_gross || 44010),
      tier1RatePercent: Math.round(Number(c.tier1_rate || 0.2) * 100),
      tier1CommissionGrossMinor: Number(c.tier1_commission_gross || 0),
      tier2CommissionGrossMinor: Number(c.tier2_commission_gross || 0),
      status: c.status || 'PENDING',
      firstContentAccessedAt: c.first_content_accessed_at || null,
      eligibleAt: c.eligible_at || null,
      paidAt: c.paid_at || null,
      createdAt: c.created_at,
    }));

    const rawInquiries = await d1All<any>(
      `SELECT
         i.*,
         a.id AS affiliate_id,
         a.promo_code AS affiliate_promo_code,
         a.role_category AS affiliate_role_category,
         a.tier1_rate AS affiliate_tier1_rate
       FROM partnership_inquiries i
       LEFT JOIN affiliates a ON LOWER(a.email) = LOWER(i.email)
       ORDER BY i.created_at DESC
       LIMIT 150`
    );

    const inquiries = rawInquiries.map((i) => ({
      id: i.id,
      channel: i.channel,
      fullName: i.full_name,
      companyOrBrand: i.company_or_brand || '',
      email: i.email,
      phone: i.phone || '',
      roleOrArea: i.role_or_area || '',
      profileUrl: i.profile_url || '',
      message: i.message || '',
      createdAt: i.created_at,
      affiliateId: i.affiliate_id || null,
      affiliatePromoCode: i.affiliate_promo_code || null,
      affiliateRoleCategory: i.affiliate_role_category || null,
      affiliateTier1RatePercent: i.affiliate_tier1_rate
        ? Math.round(Number(i.affiliate_tier1_rate) * 100)
        : null,
    }));

    const rawMotherRefs = await d1All<any>(
      `SELECT
         sr.*,
         u.email AS referrer_email,
         u.full_name AS referrer_name
       FROM student_referrals sr
       LEFT JOIN users u ON u.id = sr.referrer_user_id
       ORDER BY sr.unlocked_at DESC
       LIMIT 100`
    );

    const motherReferrals = rawMotherRefs.map((m) => ({
      id: m.id,
      referrerUserId: m.referrer_user_id,
      referrerName: m.referrer_name || 'Kursantka (Mama)',
      referrerEmail: m.referrer_email || '',
      referrerCode: m.referrer_code,
      referredEmail: m.referred_email || '',
      rewardSlug: m.reward_slug || 'ebook-obiady-15min-pdf',
      rewardUnlocked: Boolean(m.reward_unlocked),
      unlockedAt: m.unlocked_at,
    }));

    return NextResponse.json({
      authorized: true,
      adminEmail: auth.email,
      adminStats: {
        totalAffiliates: affiliates.length,
        activeAffiliates,
        stage1StudentsCount,
        stage2CreatorsCount,
        stage2MidwivesCount,
        pendingPayoutsCount,
        pendingPayoutsMinor,
        paidPayoutsCount,
        paidPayoutsMinor,
        totalOrdersCount,
        totalRevenueMinor,
        totalCommissionsEligibleMinor,
        totalCommissionsPendingMinor,
        totalCommissionsPaidMinor,
        motherReferralsCount: motherReferrals.length,
        inquiriesCount: inquiries.length,
      },
      payoutRequests,
      affiliates,
      commissions,
      inquiries,
      motherReferrals,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Błąd pobierania danych Panelu Administratora.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyLocalAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Brak uprawnień administratora.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || '');

    if (action === 'mark_payout_paid') {
      const payoutId = String(body.payoutId || '').trim();
      const row = await d1First<any>(`SELECT status FROM affiliate_payouts WHERE id = ?`, [payoutId]);
      if (!row) {
        return NextResponse.json({ error: 'Nie znaleziono wypłaty.' }, { status: 404 });
      }
      if (row.status !== 'PROCESSING') {
        return NextResponse.json(
          { error: `Wypłata ma już status ${row.status}.` },
          { status: 400 }
        );
      }
      await d1Run(`UPDATE affiliate_payouts SET status = 'PAID', paid_at = datetime('now') WHERE id = ? AND status = 'PROCESSING'`, [
        payoutId,
      ]);
      await d1Run(
        `UPDATE affiliate_commissions
         SET tier1_status = 'PAID',
             paid_at = COALESCE(paid_at, datetime('now')),
             status = CASE WHEN broker_id IS NULL OR tier2_status = 'PAID' THEN 'PAID' ELSE status END
         WHERE tier1_payout_id = ?`,
        [payoutId]
      );
      await d1Run(
        `UPDATE affiliate_commissions
         SET tier2_status = 'PAID',
             paid_at = COALESCE(paid_at, datetime('now')),
             status = CASE WHEN tier1_status = 'PAID' THEN 'PAID' ELSE status END
         WHERE tier2_payout_id = ?`,
        [payoutId]
      );
      return NextResponse.json({
        success: true,
        message: `Wypłata ${payoutId} została oznaczona jako WYPŁACONA.`,
      });
    }

    if (action === 'reject_payout') {
      const payoutId = String(body.payoutId || '').trim();
      const row = await d1First<any>(`SELECT affiliate_id, status FROM affiliate_payouts WHERE id = ?`, [payoutId]);
      if (!row) {
        return NextResponse.json({ error: 'Nie znaleziono wypłaty.' }, { status: 404 });
      }
      if (row.status !== 'PROCESSING') {
        return NextResponse.json(
          { error: `Można odrzucić wyłącznie wypłatę ze statusem PROCESSING (obecny: ${row.status}).` },
          { status: 400 }
        );
      }
      await d1Run(`UPDATE affiliate_payouts SET status = 'REJECTED' WHERE id = ? AND status = 'PROCESSING'`, [payoutId]);
      await d1Run(
        `UPDATE affiliate_commissions
         SET tier1_status = 'ELIGIBLE', tier1_payout_id = NULL,
             status = CASE WHEN status = 'CANCELLED' THEN 'CANCELLED' ELSE 'ELIGIBLE' END
         WHERE tier1_payout_id = ?`,
        [payoutId]
      );
      await d1Run(
        `UPDATE affiliate_commissions
         SET tier2_status = 'ELIGIBLE', tier2_payout_id = NULL
         WHERE tier2_payout_id = ?`,
        [payoutId]
      );
      return NextResponse.json({
        success: true,
        message: `Zlecenie wypłaty ${payoutId} zostało odrzucone, a środki wróciły na saldo ELIGIBLE.`,
      });
    }

    if (action === 'update_affiliate_tier') {
      const affiliateId = String(body.affiliateId || '').trim();
      const existing = await d1First<any>(`SELECT * FROM affiliates WHERE id = ?`, [affiliateId]);
      if (!existing) {
        return NextResponse.json({ error: 'Nie znaleziono partnera.' }, { status: 404 });
      }
      const roleCategory = ['standard', 'creator_publisher', 'midwife_physio'].includes(body.roleCategory)
        ? body.roleCategory
        : existing.role_category || 'standard';
      let tier1Rate = Number(body.tier1Rate);
      if (isNaN(tier1Rate) || tier1Rate <= 0 || tier1Rate > 0.5) {
        tier1Rate =
          roleCategory === 'midwife_physio'
            ? 0.3
            : roleCategory === 'creator_publisher'
              ? 0.25
              : 0.2;
      }
      const newStatus = ['active', 'blocked', 'pending'].includes(body.status)
        ? body.status
        : existing.status || 'active';
      const newPromo = body.promoCode
        ? String(body.promoCode).trim().toUpperCase().replace(/^MAMA[-_]?/i, '')
        : existing.promo_code;
      const newSlug = newPromo.toLowerCase();
      const specialization =
        body.specialization !== undefined ? String(body.specialization).trim() : existing.specialization;

      await d1Run(
        `UPDATE affiliates SET role_category = ?, tier1_rate = ?, status = ?, promo_code = ?, ref_slug = ?, specialization = ? WHERE id = ?`,
        [roleCategory, tier1Rate, newStatus, newPromo, newSlug, specialization, affiliateId]
      );
      return NextResponse.json({
        success: true,
        message: `Zaktualizowano konto partnera ${existing.full_name} (stawka: ${Math.round(tier1Rate * 100)}%, kod: ${newPromo}).`,
      });
    }

    if (action === 'create_affiliate') {
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '')
        .trim()
        .toLowerCase();
      const roleCategory = ['standard', 'creator_publisher', 'midwife_physio'].includes(body.roleCategory)
        ? body.roleCategory
        : 'standard';
      if (!fullName || !email || !email.includes('@')) {
        return NextResponse.json({ error: 'Podaj imię i nazwisko oraz e-mail.' }, { status: 400 });
      }
      const tier1Rate =
        roleCategory === 'midwife_physio'
          ? 0.3
          : roleCategory === 'creator_publisher'
            ? 0.25
            : 0.2;
      const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();
      const promoCode =
        String(body.preferredPromoCode || '')
          .trim()
          .toUpperCase()
          .replace(/^MAMA[-_]?/i, '') || `STUDENT-${suffix}10`;
      const refSlug = promoCode.toLowerCase();
      const specialization = String(
        body.specialization || 'Student / Ambasador HappyBirth'
      ).trim();

      await d1Run(
        `INSERT INTO affiliates (
           id, email, full_name, role_category, specialization,
           profile_or_practice_url, promo_code, ref_slug, tier1_rate,
           referred_by_broker_id, tier2_override_rate, status
         ) VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, NULL, 0.05, 'active')
         ON CONFLICT(email) DO UPDATE SET
           full_name = excluded.full_name,
           role_category = excluded.role_category,
           tier1_rate = excluded.tier1_rate,
           status = 'active'`,
        [
          `aff_${crypto.randomUUID()}`,
          email,
          fullName,
          roleCategory,
          specialization,
          promoCode,
          refSlug,
          tier1Rate,
        ]
      );
      return NextResponse.json({
        success: true,
        promoCode,
        message: `Utworzono konto dla ${fullName} (${email}) z kodem ${promoCode}.`,
      });
    }

    if (action === 'update_commission_status') {
      const commissionId = String(body.commissionId || '').trim();
      const newStatus = String(body.newStatus || '').trim().toUpperCase();
      if (!commissionId || !['PENDING', 'ELIGIBLE', 'PAID', 'CANCELLED'].includes(newStatus)) {
        return NextResponse.json({ error: 'Podaj poprawne ID prowizji oraz docelowy status.' }, { status: 400 });
      }
      await d1Run(
        `UPDATE affiliate_commissions
         SET status = ?,
             tier1_status = ?,
             tier2_status = CASE WHEN broker_id IS NOT NULL THEN ? ELSE tier2_status END,
             eligible_at = CASE WHEN ? = 'ELIGIBLE' THEN datetime('now') ELSE eligible_at END,
             paid_at = CASE WHEN ? = 'PAID' THEN COALESCE(paid_at, datetime('now')) ELSE paid_at END
         WHERE id = ?`,
        [newStatus, newStatus, newStatus, newStatus, newStatus, commissionId]
      );
      return NextResponse.json({
        success: true,
        message: `Status prowizji ${commissionId} zmieniony na ${newStatus}.`,
      });
    }

    if (action === 'record_manual_commission') {
      const affiliateId = String(body.affiliateId || '').trim();
      const orderRef = String(body.orderRef || `MANUAL-${Date.now()}`).trim();
      const paidAmountPln = Number(body.paidAmountPln || 440.1);
      const initialStatus = ['ELIGIBLE', 'PENDING', 'PAID'].includes(body.status)
        ? body.status
        : 'ELIGIBLE';

      const affRow = await d1First<any>(`SELECT * FROM affiliates WHERE id = ?`, [affiliateId]);
      if (!affRow) {
        return NextResponse.json({ error: 'Nie znaleziono wybranego partnera.' }, { status: 404 });
      }

      const paidMinor = Math.round(paidAmountPln * 100);
      const t1Rate = Number(affRow.tier1_rate || 0.2);
      const t1CommMinor = Math.round(paidMinor * t1Rate);
      const brokerId = affRow.referred_by_broker_id || null;
      const t2CommMinor = brokerId ? Math.round(paidMinor * 0.05) : 0;

      await d1Run(
        `INSERT INTO affiliate_commissions (
           id, order_id, stripe_session_id, affiliate_id, broker_id,
           attribution_source, paid_amount_gross, tier1_rate,
           tier1_commission_gross, tier2_commission_gross, status
         ) VALUES (?, ?, ?, ?, ?, 'promo_code', ?, ?, ?, ?, ?)`,
        [
          `comm_${crypto.randomUUID()}`,
          orderRef,
          `manual_${crypto.randomUUID().slice(0, 12)}`,
          affRow.id,
          brokerId,
          paidMinor,
          t1Rate,
          t1CommMinor,
          t2CommMinor,
          initialStatus,
        ]
      );
      return NextResponse.json({
        success: true,
        message: `Dopisano prowizję dla partnera ${affRow.full_name}.`,
      });
    }

    return NextResponse.json({ error: 'Nieznana akcja.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Błąd operacji.' }, { status: 500 });
  }
}
