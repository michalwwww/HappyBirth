import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

async function ensureLocalAffiliateTables() {
  try {
    await d1Run(
      `CREATE TABLE IF NOT EXISTS affiliate_settings (
        affiliate_id TEXT PRIMARY KEY,
        settlement_type TEXT NOT NULL DEFAULT 'private_person',
        legal_name TEXT,
        nip TEXT,
        iban TEXT,
        address TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    );
    await d1Run(
      `CREATE TABLE IF NOT EXISTS affiliate_payouts (
        id TEXT PRIMARY KEY,
        affiliate_id TEXT NOT NULL,
        amount_gross_minor INTEGER NOT NULL,
        settlement_type TEXT NOT NULL,
        legal_name TEXT NOT NULL,
        nip TEXT,
        iban TEXT NOT NULL,
        invoice_number TEXT,
        status TEXT NOT NULL DEFAULT 'PROCESSING',
        requested_at TEXT NOT NULL DEFAULT (datetime('now')),
        paid_at TEXT
      )`
    );
  } catch {
    // Ignore
  }
}

export async function GET(req: NextRequest) {
  try {
    const validateCode = (req.nextUrl.searchParams.get('validate_code') || '').trim().toUpperCase();
    if (validateCode) {
      const aff = await d1First<any>(
        "SELECT id FROM affiliates WHERE UPPER(promo_code) = ? AND status = 'active' LIMIT 1",
        [validateCode]
      );
      const usr = await d1First<any>(
        "SELECT id FROM users WHERE UPPER(referral_code) = ? LIMIT 1",
        [validateCode]
      );
      const valid = Boolean(aff?.id || usr?.id);
      return NextResponse.json({ valid, code: validateCode, discountPercent: valid ? 10 : 0 });
    }
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ authenticated: false });
    }

    await ensureLocalAffiliateTables();
    const cleanEmail = session.email.toLowerCase();

    let affiliate = await d1First<any>(
      `SELECT id, email, full_name, role_category, specialization,
              profile_or_practice_url, promo_code, ref_slug, tier1_rate,
              referred_by_broker_id, tier2_override_rate, status, created_at
       FROM affiliates WHERE email = ?`,
      [cleanEmail]
    );

    const userRow = await d1First<any>(
      `SELECT id, full_name, referral_code, role FROM users WHERE email = ?`,
      [cleanEmail]
    );

    const enrollmentRow = userRow?.id
      ? await d1First<any>(
          `SELECT id FROM enrollments WHERE user_id = ? AND status = 'active' LIMIT 1`,
          [userRow.id]
        )
      : null;

    if (!affiliate) {
      return NextResponse.json({
        authenticated: false,
        isMotherOnly: Boolean(enrollmentRow?.id),
        motherEmail: enrollmentRow?.id ? cleanEmail : undefined,
      });
    }

    const payoutSettingsRow = await d1First<any>(
      `SELECT settlement_type, legal_name, nip, iban, address FROM affiliate_settings WHERE affiliate_id = ?`,
      [affiliate.id]
    );

    const rawComms = await d1All<any>(
      `SELECT * FROM affiliate_commissions WHERE affiliate_id = ? OR broker_id = ? ORDER BY created_at DESC LIMIT 100`,
      [affiliate.id, affiliate.id]
    );

    let eligibleMinor = 0;
    let pendingMinor = 0;
    let paidMinor = 0;
    let directSalesCount = 0;
    let brokerSalesCount = 0;

    const commissions = rawComms.map((row) => {
      const isDirect = row.affiliate_id === affiliate.id;
      const commMinor = isDirect
        ? Number(row.tier1_commission_gross || 0)
        : Number(row.tier2_commission_gross || 0);
      if (row.status !== 'CANCELLED') {
        if (isDirect) directSalesCount += 1;
        else brokerSalesCount += 1;
      }
      if (row.status === 'ELIGIBLE') eligibleMinor += commMinor;
      else if (row.status === 'PENDING') pendingMinor += commMinor;
      else if (row.status === 'PAID') paidMinor += commMinor;

      return {
        id: row.id,
        orderRef: `HB-****-${String(row.stripe_session_id || '0000').slice(-4).toUpperCase()}`,
        type: isDirect ? 'tier1_direct' : 'tier2_broker',
        attributionSource: row.attribution_source || 'promo_code',
        paidAmountGrossMinor: Number(row.paid_amount_gross || 44010),
        commissionGrossMinor: commMinor,
        ratePercent: isDirect ? Math.round(Number(row.tier1_rate || 0.2) * 100) : 5,
        status: row.status || 'PENDING',
        createdAt: row.created_at,
      };
    });

    const subAffRows = await d1All<any>(
      `SELECT id, full_name, role_category, promo_code, created_at FROM affiliates WHERE referred_by_broker_id = ?`,
      [affiliate.id]
    );
    const payoutsRows = await d1All<any>(
      `SELECT * FROM affiliate_payouts WHERE affiliate_id = ? ORDER BY requested_at DESC`,
      [affiliate.id]
    );

    return NextResponse.json({
      authenticated: true,
      isStudent: true,
      affiliate: {
        id: affiliate.id,
        email: affiliate.email,
        fullName: affiliate.full_name,
        roleCategory: affiliate.role_category || 'standard',
        specialization: affiliate.specialization || 'Kursantka / Ambasadorka HappyBirth',
        profileUrl: affiliate.profile_or_practice_url || '',
        promoCode: affiliate.promo_code,
        refSlug: affiliate.ref_slug,
        tier1Rate: Number(affiliate.tier1_rate || 0.2),
        tier1RatePercent: Math.round(Number(affiliate.tier1_rate || 0.2) * 100),
        tier2OverrideRatePercent: 5,
        status: affiliate.status || 'active',
        createdAt: affiliate.created_at,
      },
      payoutSettings: {
        settlementType: payoutSettingsRow?.settlement_type || 'private_person',
        legalName: payoutSettingsRow?.legal_name || affiliate.full_name || '',
        nip: payoutSettingsRow?.nip || '',
        iban: payoutSettingsRow?.iban || '',
        address: payoutSettingsRow?.address || '',
      },
      stats: {
        eligibleMinor,
        pendingMinor,
        paidMinor,
        totalEarnedMinor: eligibleMinor + pendingMinor + paidMinor,
        directSalesCount,
        brokerSalesCount,
        subAffiliatesCount: subAffRows.length,
        studentReferralsCount: 0,
      },
      commissions,
      subAffiliates: subAffRows.map((s) => ({
        id: s.id,
        maskedName: s.full_name,
        roleCategory: s.role_category || 'standard',
        promoCode: s.promo_code,
        joinedAt: s.created_at,
      })),
      payouts: payoutsRows.map((p) => ({
        id: p.id,
        amountGrossMinor: Number(p.amount_gross_minor || 0),
        settlementType: p.settlement_type,
        legalName: p.legal_name,
        ibanMasked: p.iban ? `${String(p.iban).slice(0, 6)} **** ${String(p.iban).slice(-4)}` : '',
        invoiceNumber: p.invoice_number || null,
        status: p.status,
        requestedAt: p.requested_at,
        paidAt: p.paid_at,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }
    await ensureLocalAffiliateTables();
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'update_profile';
    const affiliate = await d1First<any>(
      `SELECT * FROM affiliates WHERE email = ?`,
      [session.email.toLowerCase()]
    );
    if (!affiliate) {
      return NextResponse.json({ error: 'Brak konta partnera' }, { status: 404 });
    }

    if (action === 'update_code') {
      const rawPromo = String(body.promoCode || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_-]/g, '');
      const rawSlug = String(body.refSlug || rawPromo)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '');
      await d1Run(`UPDATE affiliates SET promo_code = ?, ref_slug = ? WHERE id = ?`, [
        rawPromo,
        rawSlug,
        affiliate.id,
      ]);
      return NextResponse.json({
        success: true,
        promoCode: rawPromo,
        refSlug: rawSlug,
        message: `Kod rabatowy zmieniono na ${rawPromo}.`,
      });
    }

    if (action === 'update_payout_settings') {
      await d1Run(
        `INSERT INTO affiliate_settings (affiliate_id, settlement_type, legal_name, nip, iban, address, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(affiliate_id) DO UPDATE SET
           settlement_type = excluded.settlement_type,
           legal_name = excluded.legal_name,
           nip = excluded.nip,
           iban = excluded.iban,
           address = excluded.address,
           updated_at = datetime('now')`,
        [
          affiliate.id,
          body.settlementType || 'private_person',
          body.legalName || '',
          body.nip || '',
          body.iban || '',
          body.address || '',
        ]
      );
      return NextResponse.json({
        success: true,
        message: 'Dane rozliczeniowe zostały zapisane.',
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Błąd serwera' }, { status: 500 });
  }
}
