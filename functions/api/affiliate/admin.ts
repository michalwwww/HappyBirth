import { getEdgeSession } from '../../_shared/session';
import { generateSmartPartnerCodeCandidates } from '../../../lib/brand-codes';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ADMIN_EMAILS?: string;
}

export const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

export function isEmailAdmin(email: string, envAdminEmails?: string): boolean {
  const clean = (email || '').trim().toLowerCase();
  if (!clean) return false;
  if (TEAM_WHITELIST_EMAILS.has(clean)) return true;
  if (envAdminEmails) {
    const extra = envAdminEmails
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (extra.includes(clean)) return true;
  }
  return false;
}

async function verifyAdminAccess(request: Request, env: Env): Promise<{ authorized: boolean; email: string | null }> {
  const session = await getEdgeSession(request, env);
  if (!session?.email) {
    return { authorized: false, email: null };
  }
  const cleanEmail = session.email.trim().toLowerCase();
  if (isEmailAdmin(cleanEmail, env.ADMIN_EMAILS) || session.role === 'admin') {
    return { authorized: true, email: cleanEmail };
  }
  if (env.DB) {
    try {
      const u = await env.DB.prepare(`SELECT role FROM users WHERE LOWER(email) = ? LIMIT 1`)
        .bind(cleanEmail)
        .first();
      if (u?.role === 'admin') {
        return { authorized: true, email: cleanEmail };
      }
    } catch {
      // Ignore DB lookup error
    }
  }
  return { authorized: false, email: cleanEmail };
}

async function ensureAdminAffiliateTables(db: any) {
  if (!db) return;
  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS affiliate_settings (
          affiliate_id TEXT PRIMARY KEY,
          settlement_type TEXT NOT NULL DEFAULT 'private_person',
          legal_name TEXT,
          nip TEXT,
          iban TEXT,
          address TEXT,
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`
      )
      .run();

    await db
      .prepare(
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
      )
      .run();

    // Zadbaj o obecność flagowych kodów Zespołu HappyBirth w bazie D1
    const teamSeeds = [
      {
        id: 'aff_team_michal',
        email: 'mwspace@gmail.com',
        name: 'Michał · Zespół HappyBirth',
        code: 'DOBRYSTART',
        slug: 'dobry-start',
        spec: 'Zespół Założycielski · Kampanie i Partnerstwa Akademickie',
      },
      {
        id: 'aff_team_maciej',
        email: 'maciej@happybirth.pl',
        name: 'Maciej · Zespół HappyBirth',
        code: 'GOTOWY-TATA',
        slug: 'gotowy-tata',
        spec: 'Zespół Założycielski · Ścieżka Partnera i Produkt',
      },
      {
        id: 'aff_team_redakcja',
        email: 'kontakt@happybirth.pl',
        name: 'Redakcja HappyBirth & Mama Gaja',
        code: 'SPOKOJNYPOROD',
        slug: 'spokojny-porod',
        spec: 'Kod Flagowy Marki HappyBirth & Mama Gaja',
      },
      {
        id: 'aff_team_razem',
        email: 'partner@happybirth.pl',
        name: 'Zespół Partnerski HappyBirth',
        code: 'RAZEM-DO-PORODU',
        slug: 'razem-do-porodu',
        spec: 'Kampanie dla Par (18 miesięcy dla dwojga)',
      },
      {
        id: 'aff_team_pierwszedni',
        email: 'pomoc@happybirth.pl',
        name: 'Wsparcie Rodziców HappyBirth',
        code: 'PIERWSZEDNI',
        slug: 'pierwsze-dni',
        spec: 'Wyprawka, Połóg i Pierwsze Dni z Noworodkiem',
      },
    ];

    for (const seed of teamSeeds) {
      await db
        .prepare(
          `INSERT INTO affiliates (
             id, email, full_name, role_category, specialization,
             profile_or_practice_url, promo_code, ref_slug, tier1_rate,
             referred_by_broker_id, tier2_override_rate, status
           ) VALUES (?, ?, ?, 'standard', ?, 'https://happybirth.pl', ?, ?, 0.20, NULL, 0.05, 'active')
           ON CONFLICT(email) DO NOTHING`
        )
        .bind(seed.id, seed.email, seed.name, seed.spec, seed.code, seed.slug)
        .run()
        .catch(() => {});
    }
  } catch {
    // Best-effort
  }
}

function sanitizeCodePart(input: string, fallback = 'STUDENT'): string {
  const cleaned = (input || '')
    .toUpperCase()
    .replace(/^MAMA[-_]?/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
  return cleaned || fallback;
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const auth = await verifyAdminAccess(request, env);

    if (!auth.authorized) {
      return new Response(
        JSON.stringify({ error: 'Brak uprawnień administratora do tego zasobu.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          authorized: true,
          adminEmail: auth.email,
          adminStats: {
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
          },
          payoutRequests: [],
          affiliates: [],
          commissions: [],
          inquiries: [],
          motherReferrals: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureAdminAffiliateTables(env.DB);

    // 1. Pobierz wszystkich partnerów afiliacyjnych wraz z ustawieniami wypłat i zagregowaną sprzedażą
    const affiliatesRes = await env.DB.prepare(
      `SELECT
         a.id,
         a.email,
         a.full_name,
         a.role_category,
         a.specialization,
         a.profile_or_practice_url,
         a.promo_code,
         a.ref_slug,
         a.tier1_rate,
         a.referred_by_broker_id,
         a.tier2_override_rate,
         a.status,
         a.created_at,
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
    )
      .all()
      .catch(() => ({ results: [] }));

    const rawAffiliates: any[] = affiliatesRes?.results || [];

    // 2. Pobierz wszystkie prowizje z danymi partnerów
    const commissionsRes = await env.DB.prepare(
      `SELECT
         c.id,
         c.order_id,
         c.stripe_session_id,
         c.affiliate_id,
         c.broker_id,
         c.attribution_source,
         c.paid_amount_gross,
         c.tier1_rate,
         c.tier1_commission_gross,
         c.tier2_commission_gross,
         c.status,
         c.first_content_accessed_at,
         c.eligible_at,
         c.paid_at,
         c.created_at,
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
    )
      .all()
      .catch(() => ({ results: [] }));

    const rawCommissions: any[] = commissionsRes?.results || [];

    // Policz statystyki per partner oraz globalnie
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
      const st = String(c.status || 'PENDING');

      if (st !== 'CANCELLED') {
        totalOrdersCount += 1;
        totalRevenueMinor += paidGross;
      }

      if (st === 'ELIGIBLE') {
        totalCommissionsEligibleMinor += t1 + t2;
      } else if (st === 'PENDING') {
        totalCommissionsPendingMinor += t1 + t2;
      } else if (st === 'PAID') {
        totalCommissionsPaidMinor += t1 + t2;
      }

      if (affId) {
        const cur = perAffiliateStats.get(affId) || {
          directSalesCount: 0,
          brokerSalesCount: 0,
          eligibleMinor: 0,
          pendingMinor: 0,
          paidMinor: 0,
          totalEarnedMinor: 0,
        };
        if (st !== 'CANCELLED') cur.directSalesCount += 1;
        if (st === 'ELIGIBLE') cur.eligibleMinor += t1;
        else if (st === 'PENDING') cur.pendingMinor += t1;
        else if (st === 'PAID') cur.paidMinor += t1;
        cur.totalEarnedMinor = cur.eligibleMinor + cur.pendingMinor + cur.paidMinor;
        perAffiliateStats.set(affId, cur);
      }

      if (brokId && t2 > 0) {
        const curB = perAffiliateStats.get(brokId) || {
          directSalesCount: 0,
          brokerSalesCount: 0,
          eligibleMinor: 0,
          pendingMinor: 0,
          paidMinor: 0,
          totalEarnedMinor: 0,
        };
        if (st !== 'CANCELLED') curB.brokerSalesCount += 1;
        if (st === 'ELIGIBLE') curB.eligibleMinor += t2;
        else if (st === 'PENDING') curB.pendingMinor += t2;
        else if (st === 'PAID') curB.paidMinor += t2;
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

    // 3. Pobierz wszystkie zlecenia wypłat (Pełny IBAN dla administratora!)
    const payoutsRes = await env.DB.prepare(
      `SELECT
         p.id,
         p.affiliate_id,
         p.amount_gross_minor,
         p.settlement_type,
         p.legal_name,
         p.nip,
         p.iban,
         p.invoice_number,
         p.status,
         p.requested_at,
         p.paid_at,
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
    )
      .all()
      .catch(() => ({ results: [] }));

    const rawPayouts: any[] = payoutsRes?.results || [];
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

    // 4. Lista prowizji sformatowana dla tabeli admina
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

    // 5. Wnioski partnerskie i zapytania B2B (partnership_inquiries)
    const inquiriesRes = await env.DB.prepare(
      `SELECT
         i.id,
         i.channel,
         i.full_name,
         i.company_or_brand,
         i.email,
         i.phone,
         i.role_or_area,
         i.profile_url,
         i.message,
         i.created_at,
         a.id AS affiliate_id,
         a.promo_code AS affiliate_promo_code,
         a.role_category AS affiliate_role_category,
         a.tier1_rate AS affiliate_tier1_rate
       FROM partnership_inquiries i
       LEFT JOIN affiliates a ON LOWER(a.email) = LOWER(i.email)
       ORDER BY i.created_at DESC
       LIMIT 150`
    )
      .all()
      .catch(() => ({ results: [] }));

    const inquiries = (inquiriesRes?.results || []).map((i: any) => ({
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

    // 6. Polecenia Mam w Strefie Rodziców (student_referrals — MAMA-XXXX)
    const motherRefRes = await env.DB.prepare(
      `SELECT
         sr.id,
         sr.referrer_user_id,
         sr.referrer_code,
         sr.referred_email,
         sr.stripe_session_id,
         sr.reward_unlocked,
         sr.reward_slug,
         sr.unlocked_at,
         u.email AS referrer_email,
         u.full_name AS referrer_name
       FROM student_referrals sr
       LEFT JOIN users u ON u.id = sr.referrer_user_id
       ORDER BY sr.unlocked_at DESC
       LIMIT 100`
    )
      .all()
      .catch(() => ({ results: [] }));

    const motherReferrals = (motherRefRes?.results || []).map((m: any) => ({
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

    return new Response(
      JSON.stringify({
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
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd pobierania danych Panelu Administratora.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const auth = await verifyAdminAccess(request, env);

    if (!auth.authorized) {
      return new Response(
        JSON.stringify({ error: 'Brak uprawnień administratora do wykonania tej operacji.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Baza danych Cloudflare D1 nie jest podłączona w tym środowisku.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureAdminAffiliateTables(env.DB);
    const body: any = await request.json().catch(() => ({}));
    const action = String(body.action || '');

    // =========================================================================
    // 1. ZATWIERDZENIE WYPŁATY PRZEZ ADMINISTRATORA (PROCESSING -> PAID)
    // =========================================================================
    if (action === 'mark_payout_paid') {
      const payoutId = String(body.payoutId || '').trim();
      if (!payoutId) {
        return new Response(JSON.stringify({ error: 'Brak identyfikatora wypłaty (payoutId).' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const payoutRow = await env.DB.prepare(
        `SELECT p.*, a.email AS affiliate_email, a.full_name AS affiliate_name
         FROM affiliate_payouts p
         LEFT JOIN affiliates a ON a.id = p.affiliate_id
         WHERE p.id = ? LIMIT 1`
      )
        .bind(payoutId)
        .first();

      if (!payoutRow) {
        return new Response(JSON.stringify({ error: 'Nie znaleziono zlecenia wypłaty o podanym ID.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await env.DB.prepare(
        `UPDATE affiliate_payouts
         SET status = 'PAID', paid_at = datetime('now')
         WHERE id = ?`
      )
        .bind(payoutId)
        .run();

      const formattedPln = `${(Number(payoutRow.amount_gross_minor || 0) / 100)
        .toFixed(2)
        .replace('.', ',')} zł`;

      if (env.RESEND_API_KEY && payoutRow.affiliate_email) {
        const fromAddress = env.RESEND_FROM || 'Program Partnerski HappyBirth <kontakt@happybirth.pl>';
        const ibanStr = String(payoutRow.iban || '');
        const ibanMasked = ibanStr.length > 8 ? `${ibanStr.slice(0, 6)}...${ibanStr.slice(-4)}` : ibanStr;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [payoutRow.affiliate_email],
            subject: `Przelew prowizji ${formattedPln} (${payoutId}) został zrealizowany — HappyBirth.pl`,
            html: `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px; color: #1A1512;">
                <h2 style="margin-top: 0; color: #20071E;">Twoja wypłata została zrealizowana!</h2>
                <p style="font-size: 14px; color: #544A44; line-height: 1.6;">
                  Zlecenie wypłaty <strong>${payoutId}</strong> na kwotę <strong>${formattedPln}</strong> zostało przekazane przelewem bankowym na rachunek <strong>${ibanMasked}</strong>.
                </p>
                <p style="font-size: 12px; color: #867A72;">Dziękujemy za współpracę w Programie Partnerskim HappyBirth.pl · KLARSOLUTIONS Sp. z o.o.</p>
              </div>
            `,
          }),
        }).catch(() => {});
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Wypłata ${payoutId} (${formattedPln}) została oznaczona jako WYPŁACONA.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 2. ODRZUCENIE WYPŁATY I ZWROT ŚRODKÓW NA SALDO DOSTĘPNE (ELIGIBLE)
    // =========================================================================
    if (action === 'reject_payout') {
      const payoutId = String(body.payoutId || '').trim();
      if (!payoutId) {
        return new Response(JSON.stringify({ error: 'Brak identyfikatora wypłaty.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const payoutRow = await env.DB.prepare(
        `SELECT id, affiliate_id, amount_gross_minor, status FROM affiliate_payouts WHERE id = ? LIMIT 1`
      )
        .bind(payoutId)
        .first();

      if (!payoutRow) {
        return new Response(JSON.stringify({ error: 'Nie znaleziono zlecenia wypłaty.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await env.DB.prepare(`UPDATE affiliate_payouts SET status = 'REJECTED' WHERE id = ?`)
        .bind(payoutId)
        .run();

      // Przywróć prowizje partnera oznaczone jako PAID z powrotem na ELIGIBLE
      await env.DB.prepare(
        `UPDATE affiliate_commissions
         SET status = 'ELIGIBLE', paid_at = NULL
         WHERE (affiliate_id = ? OR broker_id = ?) AND status = 'PAID'`
      )
        .bind(payoutRow.affiliate_id, payoutRow.affiliate_id)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          message: `Zlecenie wypłaty ${payoutId} zostało odrzucone, a środki wróciły na saldo ELIGIBLE partnera.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 3. ZMIANA STAWKI / KATEGORII (ETAP 1 <-> ETAP 2), KODU LUB STATUSU PARTNERA
    // =========================================================================
    if (action === 'update_affiliate_tier') {
      const affiliateId = String(body.affiliateId || '').trim();
      if (!affiliateId) {
        return new Response(JSON.stringify({ error: 'Brak identyfikatora partnera (affiliateId).' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const existing = await env.DB.prepare(`SELECT * FROM affiliates WHERE id = ? LIMIT 1`)
        .bind(affiliateId)
        .first();

      if (!existing) {
        return new Response(JSON.stringify({ error: 'Nie znaleziono partnera w bazie D1.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
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

      let newPromo = existing.promo_code;
      let newSlug = existing.ref_slug;
      if (body.promoCode && String(body.promoCode).trim().toUpperCase() !== existing.promo_code) {
        const candidate = String(body.promoCode)
          .trim()
          .toUpperCase()
          .replace(/^MAMA[-_]?/i, '')
          .replace(/[^A-Z0-9_-]/g, '');
        if (candidate.length >= 4 && candidate.length <= 24) {
          const conflict = await env.DB.prepare(
            `SELECT id FROM affiliates WHERE UPPER(promo_code) = ? AND id != ? LIMIT 1`
          )
            .bind(candidate, affiliateId)
            .first();
          if (!conflict?.id) {
            newPromo = candidate;
            newSlug = candidate.toLowerCase();
          }
        }
      }

      const specialization =
        body.specialization !== undefined
          ? String(body.specialization).trim()
          : existing.specialization;

      await env.DB.prepare(
        `UPDATE affiliates
         SET role_category = ?,
             tier1_rate = ?,
             status = ?,
             promo_code = ?,
             ref_slug = ?,
             specialization = ?
         WHERE id = ?`
      )
        .bind(roleCategory, tier1Rate, newStatus, newPromo, newSlug, specialization, affiliateId)
        .run();

      const ratePct = Math.round(tier1Rate * 100);

      // Jeśli nastąpił awans stawki (np. z 20% na 25% lub 30%), wyślij powiadomienie e-mail
      if (env.RESEND_API_KEY && tier1Rate > Number(existing.tier1_rate || 0.2) && existing.email) {
        const fromAddress = env.RESEND_FROM || 'Program Partnerski HappyBirth <kontakt@happybirth.pl>';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [existing.email],
            subject: `Twoja stawka prowizyjna w HappyBirth.pl została podniesiona do ${ratePct}%!`,
            html: `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px; color: #1A1512;">
                <h2 style="margin-top: 0; color: #20071E;">Gratulacje, ${existing.full_name}!</h2>
                <p style="font-size: 14px; color: #544A44; line-height: 1.6;">
                  Administrator Programu Partnerskiego HappyBirth.pl zaktualizował Twoją stawkę prowizyjną Poziomu 1 do <strong>${ratePct}%</strong> (<strong>${((440.1 * tier1Rate)).toFixed(2).replace('.', ',')} zł</strong> za każdy kurs sprzedany z Twoim kodem <strong>${newPromo}</strong> + 5% Broker Override).
                </p>
                <div style="margin: 20px 0;">
                  <a href="https://afiliacja.happybirth.pl" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 13px; display: inline-block;">Przejdź do Kokpitu Partnera &rarr;</a>
                </div>
              </div>
            `,
          }),
        }).catch(() => {});
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Zaktualizowano konto partnera ${existing.full_name} (stawka: ${ratePct}%, kod: ${newPromo}, status: ${newStatus}).`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 4. RĘCZNE DODANIE NOWEGO STUDENTA / PARTNERA PRZEZ ADMINISTRATORA
    // =========================================================================
    if (action === 'create_affiliate') {
      const fullName = String(body.fullName || '').trim();
      const email = String(body.email || '')
        .trim()
        .toLowerCase();
      const roleCategory = ['standard', 'creator_publisher', 'midwife_physio'].includes(body.roleCategory)
        ? body.roleCategory
        : 'standard';

      if (!fullName || !email || !email.includes('@')) {
        return new Response(
          JSON.stringify({ error: 'Podaj imię i nazwisko oraz poprawny adres e-mail nowego partnera.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const tier1Rate =
        roleCategory === 'midwife_physio'
          ? 0.3
          : roleCategory === 'creator_publisher'
            ? 0.25
            : 0.2;

      const defaultSpec =
        roleCategory === 'midwife_physio'
          ? 'Położna / Fizjoterapeutka (Etap 2 · 30%)'
          : roleCategory === 'creator_publisher'
            ? 'Mikroinfluencerka / Twórca (Etap 2 · 25%)'
            : 'Student / Ambasador HappyBirth (Etap 1 · 20%)';
      const specialization = String(body.specialization || defaultSpec).trim();
      const profileUrl = String(body.profileUrl || '').trim();

      let promoCode = String(body.preferredPromoCode || '')
        .trim()
        .toUpperCase()
        .replace(/^MAMA[-_]?/i, '')
        .replace(/[^A-Z0-9_-]/g, '');

      const smartCandidates = generateSmartPartnerCodeCandidates(fullName, roleCategory, email);
      if (!promoCode || promoCode.length < 4) {
        promoCode = smartCandidates[0]?.code || 'SPOKOJ-PARTNER';
        for (const cand of smartCandidates) {
          const taken = await env.DB.prepare(
            `SELECT email FROM affiliates WHERE UPPER(promo_code) = ? LIMIT 1`
          )
            .bind(cand.code)
            .first()
            .catch(() => null);
          if (!taken || String(taken.email).toLowerCase() === email) {
            promoCode = cand.code;
            break;
          }
        }
      } else if (!promoCode.includes('-')) {
        promoCode = `SPOKOJ-${promoCode}`;
      }

      const refSlug = promoCode.toLowerCase().replace(/[^a-z0-9_-]/g, '');

      let brokerId: string | null = null;
      if (body.brokerPromoCode) {
        const cleanBroker = String(body.brokerPromoCode).trim();
        const brokerRow = await env.DB.prepare(
          `SELECT id FROM affiliates WHERE UPPER(promo_code) = UPPER(?) OR LOWER(ref_slug) = LOWER(?) LIMIT 1`
        )
          .bind(cleanBroker, cleanBroker)
          .first()
          .catch(() => null);
        if (brokerRow?.id) brokerId = brokerRow.id;
      }

      const newId = `aff_${crypto.randomUUID()}`;
      await env.DB.prepare(
        `INSERT INTO affiliates (
           id, email, full_name, role_category, specialization,
           profile_or_practice_url, promo_code, ref_slug, tier1_rate,
           referred_by_broker_id, tier2_override_rate, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.05, 'active')
         ON CONFLICT(email) DO UPDATE SET
           full_name = excluded.full_name,
           role_category = excluded.role_category,
           specialization = excluded.specialization,
           tier1_rate = excluded.tier1_rate,
           status = 'active'`
      )
        .bind(
          newId,
          email,
          fullName,
          roleCategory,
          specialization,
          profileUrl,
          promoCode,
          refSlug,
          tier1Rate,
          brokerId
        )
        .run();

      const saved = await env.DB.prepare(`SELECT promo_code, ref_slug, tier1_rate FROM affiliates WHERE email = ?`)
        .bind(email)
        .first();

      const finalPromo = saved?.promo_code || promoCode;
      const finalRatePct = Math.round(Number(saved?.tier1_rate || tier1Rate) * 100);

      // Wyślij token Magic Link + powitalny e-mail do nowo utworzonego studenta/partnera
      if (env.RESEND_API_KEY) {
        const token = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO auth_tokens (token, email, expires_at, used)
           VALUES (?, ?, datetime('now', '+72 hours'), 0)`
        )
          .bind(token, email)
          .run()
          .catch(() => {});

        const directCockpitUrl = `https://afiliacja.happybirth.pl/?token=${token}&email=${encodeURIComponent(email)}`;
        const fromAddress = env.RESEND_FROM || 'Program Partnerski HappyBirth <kontakt@happybirth.pl>';

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `Zaproszenie do Kokpitu Partnerskiego HappyBirth.pl (Kod: ${finalPromo}, Stawka: ${finalRatePct}%)`,
            html: `
              <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px; color: #1A1512;">
                <h2 style="margin-top: 0; color: #20071E;">Witaj w zespole partnerskim HappyBirth, ${fullName}!</h2>
                <p style="font-size: 14px; color: #544A44; line-height: 1.6;">
                  Twoje konto w Programie Partnerskim zostało utworzone z indywidualną stawką prowizji <strong>${finalRatePct}%</strong> (+ 5% Broker Override).
                </p>
                <p style="font-size: 14px; color: #544A44; line-height: 1.6;">
                  Twój kod rabatowy (-10% dla przyszłych rodziców): <strong>${finalPromo}</strong>
                </p>
                <div style="margin: 22px 0;">
                  <a href="${directCockpitUrl}" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 13px; display: inline-block;">
                    Wejdź bezpośrednio do Kokpitu Partnera &rarr;
                  </a>
                </div>
              </div>
            `,
          }),
        }).catch(() => {});
      }

      return new Response(
        JSON.stringify({
          success: true,
          promoCode: finalPromo,
          message: `Utworzono konto dla ${fullName} (${email}) z kodem ${finalPromo} i stawką ${finalRatePct}%.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 5. ZMIANA STATUSU POJEDYNCZEJ PROWIZJI (PENDING / ELIGIBLE / PAID / CANCELLED)
    // =========================================================================
    if (action === 'update_commission_status') {
      const commissionId = String(body.commissionId || '').trim();
      const newStatus = String(body.newStatus || '').trim().toUpperCase();

      if (!commissionId || !['PENDING', 'ELIGIBLE', 'PAID', 'CANCELLED'].includes(newStatus)) {
        return new Response(
          JSON.stringify({ error: 'Podaj poprawne ID prowizji oraz docelowy status.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await env.DB.prepare(
        `UPDATE affiliate_commissions
         SET status = ?,
             eligible_at = CASE WHEN ? = 'ELIGIBLE' THEN COALESCE(eligible_at, datetime('now')) ELSE eligible_at END,
             paid_at = CASE WHEN ? = 'PAID' THEN COALESCE(paid_at, datetime('now')) ELSE paid_at END
         WHERE id = ?`
      )
        .bind(newStatus, newStatus, newStatus, commissionId)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          message: `Status prowizji ${commissionId} został zmieniony na ${newStatus}.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 6. RĘCZNE NALICZENIE PROWIZJI DLA STUDENTA / PARTNERA PRZEZ ADMINA
    // =========================================================================
    if (action === 'record_manual_commission') {
      const affiliateId = String(body.affiliateId || '').trim();
      const orderRef = String(body.orderRef || `MANUAL-${Date.now()}`).trim();
      const paidAmountPln = Number(body.paidAmountPln || 440.1);
      const initialStatus = ['ELIGIBLE', 'PENDING', 'PAID'].includes(body.status)
        ? body.status
        : 'ELIGIBLE';

      if (!affiliateId || isNaN(paidAmountPln) || paidAmountPln <= 0) {
        return new Response(
          JSON.stringify({ error: 'Wybierz partnera i podaj poprawną kwotę zamówienia brutto.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const affRow = await env.DB.prepare(
        `SELECT id, full_name, promo_code, tier1_rate, referred_by_broker_id, tier2_override_rate
         FROM affiliates WHERE id = ? LIMIT 1`
      )
        .bind(affiliateId)
        .first();

      if (!affRow) {
        return new Response(JSON.stringify({ error: 'Nie znaleziono wybranego partnera.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const paidMinor = Math.round(paidAmountPln * 100);
      const t1Rate = Number(affRow.tier1_rate || 0.2);
      const t1CommMinor = Math.round(paidMinor * t1Rate);
      const brokerId = affRow.referred_by_broker_id || null;
      const t2Rate = Number(affRow.tier2_override_rate || 0.05);
      const t2CommMinor = brokerId ? Math.round(paidMinor * t2Rate) : 0;

      const commId = `comm_${crypto.randomUUID()}`;
      const sessionKey = `manual_${crypto.randomUUID().slice(0, 12)}`;

      await env.DB.prepare(
        `INSERT INTO affiliate_commissions (
           id, order_id, stripe_session_id, affiliate_id, broker_id,
           attribution_source, paid_amount_gross, tier1_rate,
           tier1_commission_gross, tier2_commission_gross,
           status, eligible_at
         ) VALUES (?, ?, ?, ?, ?, 'promo_code', ?, ?, ?, ?, ?, CASE WHEN ? = 'ELIGIBLE' THEN datetime('now') ELSE NULL END)`
      )
        .bind(
          commId,
          orderRef,
          sessionKey,
          affRow.id,
          brokerId,
          paidMinor,
          t1Rate,
          t1CommMinor,
          t2CommMinor,
          initialStatus,
          initialStatus
        )
        .run();

      const commPln = `${(t1CommMinor / 100).toFixed(2).replace('.', ',')} zł`;
      return new Response(
        JSON.stringify({
          success: true,
          message: `Dopisano prowizję ${commPln} (${initialStatus}) dla partnera ${affRow.full_name} (${affRow.promo_code}).`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Nieznana akcja administracyjna.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd wykonania operacji administracyjnej.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
