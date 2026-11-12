import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1First, d1Run } from '@/lib/d1';
import { generateSmartPartnerCodeCandidates, isOfficialSemanticPromo } from '@/lib/brand-codes';

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
    const alterCols = [
      `ALTER TABLE affiliate_commissions ADD COLUMN tier1_status TEXT DEFAULT 'PENDING'`,
      `ALTER TABLE affiliate_commissions ADD COLUMN tier1_payout_id TEXT`,
      `ALTER TABLE affiliate_commissions ADD COLUMN tier2_status TEXT DEFAULT 'PENDING'`,
      `ALTER TABLE affiliate_commissions ADD COLUMN tier2_payout_id TEXT`,
    ];
    for (const stmt of alterCols) {
      await d1Run(stmt).catch(() => {});
    }
    await d1Run(
      `UPDATE affiliate_commissions
       SET tier1_status = COALESCE(NULLIF(tier1_status, ''), status, 'PENDING'),
           tier2_status = CASE WHEN broker_id IS NOT NULL THEN COALESCE(NULLIF(tier2_status, ''), status, 'PENDING') ELSE NULL END
       WHERE tier1_status IS NULL OR (broker_id IS NOT NULL AND tier2_status IS NULL)`
    ).catch(() => {});
  } catch {
    // Ignore
  }
}

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

export async function GET(req: NextRequest) {
  try {
    const validateCode = (req.nextUrl.searchParams.get('validate_code') || '').trim().toUpperCase();
    if (validateCode) {
      let valid = isOfficialSemanticPromo(validateCode);
      if (!valid) {
        const aff = await d1First<any>(
          "SELECT id FROM affiliates WHERE (UPPER(promo_code) = ? OR UPPER(ref_slug) = ?) AND status = 'active' LIMIT 1",
          [validateCode, validateCode]
        );
        const usr = await d1First<any>(
          "SELECT id FROM users WHERE UPPER(referral_code) = ? LIMIT 1",
          [validateCode]
        );
        valid = Boolean(aff?.id || usr?.id);
      }
      return NextResponse.json({ valid, code: validateCode, discountPercent: valid ? 10 : 0 });
    }
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ authenticated: false });
    }

    await ensureLocalAffiliateTables();
    const cleanEmail = session.email.toLowerCase();
    const isTeam = TEAM_WHITELIST_EMAILS.has(cleanEmail);

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

    if (!affiliate && isTeam) {
      const teamPresetMap: Record<string, { fullName: string; promoCode: string; refSlug: string; specialization: string }> = {
        'mwspace@gmail.com': {
          fullName: 'Michał · Zespół HappyBirth',
          promoCode: 'DOBRYSTART',
          refSlug: 'dobry-start',
          specialization: 'Zespół Założycielski · Kampanie i Partnerstwa Akademickie',
        },
        'michal@happybirth.pl': {
          fullName: 'Michał · HappyBirth',
          promoCode: 'DOBRYPOROD',
          refSlug: 'dobry-porod',
          specialization: 'Zespół Założycielski · Kampanie Edukacyjne',
        },
        'maciej@happybirth.pl': {
          fullName: 'Maciej · HappyBirth',
          promoCode: 'GOTOWY-TATA',
          refSlug: 'gotowy-tata',
          specialization: 'Zespół Założycielski · Ścieżka Partnera i Produkt',
        },
        'kontakt@happybirth.pl': {
          fullName: 'Redakcja HappyBirth & Mama Gaja',
          promoCode: 'SPOKOJNYPOROD',
          refSlug: 'spokojny-porod',
          specialization: 'Kod Flagowy Marki HappyBirth & Mama Gaja',
        },
        'partner@happybirth.pl': {
          fullName: 'Zespół Partnerski HappyBirth',
          promoCode: 'RAZEM-DO-PORODU',
          refSlug: 'razem-do-porodu',
          specialization: 'Kampanie dla Par (18 miesięcy dla dwojga)',
        },
        'pomoc@happybirth.pl': {
          fullName: 'Wsparcie Rodziców HappyBirth',
          promoCode: 'PIERWSZEDNI',
          refSlug: 'pierwsze-dni',
          specialization: 'Wyprawka, Połóg i Pierwsze Dni z Noworodkiem',
        },
        'admin@happybirth.pl': {
          fullName: 'Koordynacja Akademicka HappyBirth',
          promoCode: 'AKADEMIA-HB',
          refSlug: 'akademia-hb',
          specialization: 'Koła Naukowe i Studenci Kierunków Medycznych',
        },
      };
      const preset = teamPresetMap[cleanEmail];
      const fallbackCandidates = generateSmartPartnerCodeCandidates(
        userRow?.full_name || 'Zespół HappyBirth',
        'standard',
        cleanEmail
      );
      const promoCode = preset?.promoCode || fallbackCandidates[0]?.code || 'SPOKOJNYPOROD';
      const refSlug = preset?.refSlug || promoCode.toLowerCase();
      await d1Run(
        `INSERT INTO affiliates (
           id, email, full_name, role_category, specialization,
           profile_or_practice_url, promo_code, ref_slug, tier1_rate,
           referred_by_broker_id, tier2_override_rate, status
         ) VALUES (?, ?, ?, 'standard', ?, '', ?, ?, 0.20, NULL, 0.05, 'active')
         ON CONFLICT(email) DO NOTHING`,
        [
          `aff_${crypto.randomUUID()}`,
          cleanEmail,
          preset?.fullName || userRow?.full_name || 'Zespół HappyBirth',
          preset?.specialization || 'Administrator / Ambasador HappyBirth',
          promoCode,
          refSlug,
        ]
      );
      affiliate = await d1First<any>(`SELECT * FROM affiliates WHERE email = ?`, [cleanEmail]);
    }

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

    try {
      await d1Run(
        `UPDATE affiliate_commissions
         SET status = CASE WHEN status = 'PENDING' THEN 'ELIGIBLE' ELSE status END,
             tier1_status = CASE WHEN COALESCE(tier1_status, status) = 'PENDING' THEN 'ELIGIBLE' ELSE COALESCE(tier1_status, status) END,
             tier2_status = CASE WHEN broker_id IS NOT NULL AND COALESCE(tier2_status, status) = 'PENDING' THEN 'ELIGIBLE' ELSE tier2_status END
         WHERE (affiliate_id = ? OR broker_id = ?)
           AND status != 'CANCELLED'
           AND first_content_accessed_at IS NOT NULL
           AND eligible_at IS NOT NULL
           AND datetime(eligible_at) <= datetime('now')
           AND (status = 'PENDING' OR tier1_status = 'PENDING' OR tier2_status = 'PENDING')`,
        [affiliate.id, affiliate.id]
      );
    } catch {
      // Non-fatal
    }

    const rawComms = await d1All<any>(
      `SELECT * FROM affiliate_commissions WHERE affiliate_id = ? OR broker_id = ? ORDER BY created_at DESC LIMIT 100`,
      [affiliate.id, affiliate.id]
    );

    const nowMs = Date.now();
    let eligibleMinor = 0;
    let pendingMinor = 0;
    let processingMinor = 0;
    let paidMinor = 0;
    let directSalesCount = 0;
    let brokerSalesCount = 0;

    const commissions = rawComms.map((row) => {
      const isDirect = row.affiliate_id === affiliate.id;
      const commMinor = isDirect
        ? Number(row.tier1_commission_gross || 0)
        : Number(row.tier2_commission_gross || 0);
      let effectiveStatus = isDirect
        ? String(row.tier1_status || row.status || 'PENDING')
        : String(row.tier2_status || row.status || 'PENDING');

      if (row.status === 'CANCELLED') {
        effectiveStatus = 'CANCELLED';
      } else if (effectiveStatus === 'ELIGIBLE' && row.eligible_at) {
        const eligMs = Date.parse(String(row.eligible_at).replace(' ', 'T') + (String(row.eligible_at).includes('T') || String(row.eligible_at).endsWith('Z') ? '' : 'Z'));
        if (!Number.isNaN(eligMs) && eligMs > nowMs) {
          effectiveStatus = 'PENDING';
        }
      }

      if (effectiveStatus !== 'CANCELLED') {
        if (isDirect) directSalesCount += 1;
        else brokerSalesCount += 1;
      }
      if (effectiveStatus === 'ELIGIBLE') eligibleMinor += commMinor;
      else if (effectiveStatus === 'PENDING') pendingMinor += commMinor;
      else if (effectiveStatus === 'PROCESSING') processingMinor += commMinor;
      else if (effectiveStatus === 'PAID') paidMinor += commMinor;

      return {
        id: row.id,
        orderRef: `HB-****-${String(row.stripe_session_id || '0000').slice(-4).toUpperCase()}`,
        type: isDirect ? 'tier1_direct' : 'tier2_broker',
        attributionSource: row.attribution_source || 'promo_code',
        paidAmountGrossMinor: Number(row.paid_amount_gross || 44010),
        commissionGrossMinor: commMinor,
        ratePercent: isDirect ? Math.round(Number(row.tier1_rate || 0.2) * 100) : 5,
        status: effectiveStatus,
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
      isAdmin: Boolean(isTeam || userRow?.role === 'admin'),
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
        processingMinor,
        paidMinor,
        totalEarnedMinor: eligibleMinor + pendingMinor + processingMinor + paidMinor,
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

    if (action === 'request_payout') {
      const settingsRow = await d1First<any>(
        `SELECT settlement_type, legal_name, nip, iban FROM affiliate_settings WHERE affiliate_id = ?`,
        [affiliate.id]
      );
      const iban = String(body.iban || settingsRow?.iban || '').replace(/\s+/g, '').toUpperCase().trim();
      const legalName = String(body.legalName || settingsRow?.legal_name || affiliate.full_name || '').trim();
      const settlementType = body.settlementType || settingsRow?.settlement_type || 'private_person';
      const nip = String(body.nip || settingsRow?.nip || '').trim();
      const invoiceNumber = String(body.invoiceNumber || '').trim() || null;

      if (!iban || iban.length < 15 || !legalName) {
        return NextResponse.json(
          { error: 'Uzupełnij imię i nazwisko / nazwę firmy oraz poprawny numer konta IBAN.' },
          { status: 400 }
        );
      }

      const tier1Rows = await d1All<any>(
        `SELECT id, tier1_commission_gross
         FROM affiliate_commissions
         WHERE affiliate_id = ?
           AND status != 'CANCELLED'
           AND COALESCE(tier1_status, status) = 'ELIGIBLE'
           AND (eligible_at IS NULL OR datetime(eligible_at) <= datetime('now'))`,
        [affiliate.id]
      );
      const tier2Rows = await d1All<any>(
        `SELECT id, tier2_commission_gross
         FROM affiliate_commissions
         WHERE broker_id = ?
           AND status != 'CANCELLED'
           AND COALESCE(tier2_status, status) = 'ELIGIBLE'
           AND (eligible_at IS NULL OR datetime(eligible_at) <= datetime('now'))`,
        [affiliate.id]
      );

      let totalEligibleMinor = 0;
      for (const r of tier1Rows) totalEligibleMinor += Number(r.tier1_commission_gross || 0);
      for (const r of tier2Rows) totalEligibleMinor += Number(r.tier2_commission_gross || 0);

      if (totalEligibleMinor <= 0) {
        return NextResponse.json(
          { error: 'Brak zatwierdzonych środków (ELIGIBLE po 7-dniowym buforze) do wypłaty.' },
          { status: 400 }
        );
      }

      const payoutId = `pay_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      await d1Run(
        `INSERT INTO affiliate_payouts (id, affiliate_id, amount_gross_minor, settlement_type, legal_name, nip, iban, invoice_number, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PROCESSING')`,
        [payoutId, affiliate.id, totalEligibleMinor, settlementType, legalName, nip || null, iban, invoiceNumber]
      );

      if (tier1Rows.length > 0) {
        await d1Run(
          `UPDATE affiliate_commissions
           SET tier1_status = 'PROCESSING', tier1_payout_id = ?
           WHERE affiliate_id = ?
             AND status != 'CANCELLED'
             AND COALESCE(tier1_status, status) = 'ELIGIBLE'
             AND (eligible_at IS NULL OR datetime(eligible_at) <= datetime('now'))`,
          [payoutId, affiliate.id]
        );
      }
      if (tier2Rows.length > 0) {
        await d1Run(
          `UPDATE affiliate_commissions
           SET tier2_status = 'PROCESSING', tier2_payout_id = ?
           WHERE broker_id = ?
             AND status != 'CANCELLED'
             AND COALESCE(tier2_status, status) = 'ELIGIBLE'
             AND (eligible_at IS NULL OR datetime(eligible_at) <= datetime('now'))`,
          [payoutId, affiliate.id]
        );
      }

      return NextResponse.json({
        success: true,
        payoutId,
        amountGrossMinor: totalEligibleMinor,
        message: `Zlecenie wypłaty (${payoutId}) zostało przekazane do realizacji.`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Błąd serwera' }, { status: 500 });
  }
}
