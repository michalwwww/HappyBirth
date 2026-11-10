import {
  getEdgeSession,
  createSignedSessionToken,
  formatSessionSetCookie,
} from '../../_shared/session';
import {
  generateSmartPartnerCodeCandidates,
  isSemanticAffiliateCodePattern,
} from '../../../lib/brand-codes';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

const DEFAULT_SECRET = 'happybirth-edge-secret-key-2026-klarsolutions-production';
const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

async function ensureAffiliateTables(db: any) {
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
  } catch {
    // Table creation best-effort
  }
}

function sanitizeCodePart(input: string, fallback = 'PARTNER'): string {
  const cleaned = (input || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
  return cleaned || fallback;
}

async function resolveOrProvisionAffiliate(
  db: any,
  email: string,
  preferredName?: string,
  brokerSlug?: string | null
) {
  const cleanEmail = email.trim().toLowerCase();

  let affiliate = await db
    .prepare(
      `SELECT id, email, full_name, role_category, specialization,
              profile_or_practice_url, promo_code, ref_slug, tier1_rate,
              referred_by_broker_id, tier2_override_rate, status, created_at
       FROM affiliates WHERE email = ?`
    )
    .bind(cleanEmail)
    .first();

  const userRow = await db
    .prepare(`SELECT id, full_name, referral_code, role FROM users WHERE email = ?`)
    .bind(cleanEmail)
    .first();

  const enrollmentRow = userRow?.id
    ? await db
        .prepare(
          `SELECT id, status FROM enrollments WHERE user_id = ? AND status = 'active' LIMIT 1`
        )
        .bind(userRow.id)
        .first()
    : null;

  const isMother = Boolean(enrollmentRow?.id);
  const isTeam = TEAM_WHITELIST_EMAILS.has(cleanEmail);

  // Mamy (kursantki w Strefie Rodziców) są wyłączone z programu afiliacyjnego!
  // Automatycznie zakładamy konto dla zespołu administracyjnego z semantycznym kodem flagowym (bez losowych znaków hex).
  if (!affiliate && isTeam) {
    const teamPresetMap: Record<string, { name: string; code: string; slug: string; spec: string }> = {
      'mwspace@gmail.com': {
        name: 'Michał · Zespół HappyBirth',
        code: 'DOBRYSTART',
        slug: 'dobry-start',
        spec: 'Zespół Założycielski · Kampanie i Partnerstwa Akademickie',
      },
      'michal@happybirth.pl': {
        name: 'Michał · HappyBirth',
        code: 'DOBRYPOROD',
        slug: 'dobry-porod',
        spec: 'Zespół Założycielski · Kampanie Edukacyjne',
      },
      'maciej@happybirth.pl': {
        name: 'Maciej · HappyBirth',
        code: 'GOTOWY-TATA',
        slug: 'gotowy-tata',
        spec: 'Zespół Założycielski · Ścieżka Partnera i Produkt',
      },
      'kontakt@happybirth.pl': {
        name: 'Redakcja HappyBirth & Mama Gaja',
        code: 'SPOKOJNYPOROD',
        slug: 'spokojny-porod',
        spec: 'Kod Flagowy Marki HappyBirth & Mama Gaja',
      },
      'partner@happybirth.pl': {
        name: 'Zespół Partnerski HappyBirth',
        code: 'RAZEM-DO-PORODU',
        slug: 'razem-do-porodu',
        spec: 'Kampanie dla Par (18 miesięcy dla dwojga)',
      },
      'pomoc@happybirth.pl': {
        name: 'Wsparcie Rodziców HappyBirth',
        code: 'PIERWSZEDNI',
        slug: 'pierwsze-dni',
        spec: 'Wyprawka, Połóg i Pierwsze Dni z Noworodkiem',
      },
      'admin@happybirth.pl': {
        name: 'Koordynacja Akademicka HappyBirth',
        code: 'AKADEMIA-HB',
        slug: 'akademia-hb',
        spec: 'Koła Naukowe i Studenci Kierunków Medycznych',
      },
    };

    const preset = teamPresetMap[cleanEmail];
    const fullName =
      preferredName ||
      preset?.name ||
      userRow?.full_name ||
      cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const smartCandidates = generateSmartPartnerCodeCandidates(fullName, 'standard', cleanEmail);
    const promoCode = preset?.code || smartCandidates[0]?.code || 'SPOKOJNYPOROD';
    const refSlug = preset?.slug || promoCode.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    let brokerId: string | null = null;
    if (brokerSlug) {
      const cleanBroker = brokerSlug.trim();
      const brokerRow = await db
        .prepare(
          `SELECT id, email FROM affiliates
           WHERE (LOWER(ref_slug) = LOWER(?) OR UPPER(promo_code) = UPPER(?))
             AND status = 'active'
           LIMIT 1`
        )
        .bind(cleanBroker, cleanBroker)
        .first();
      if (brokerRow?.id && String(brokerRow.email).toLowerCase() !== cleanEmail) {
        brokerId = brokerRow.id;
      }
    }

    const newId = `aff_${crypto.randomUUID()}`;
    const initialRate = 0.2;

    await db
      .prepare(
        `INSERT INTO affiliates (
           id, email, full_name, role_category, specialization,
           profile_or_practice_url, promo_code, ref_slug, tier1_rate,
           referred_by_broker_id, tier2_override_rate, status
         ) VALUES (?, ?, ?, 'standard', ?, '', ?, ?, ?, ?, 0.05, 'active')
         ON CONFLICT(email) DO NOTHING`
      )
      .bind(
        newId,
        cleanEmail,
        fullName,
        preset?.spec || 'Student / Ambasador Akademicki',
        promoCode,
        refSlug,
        initialRate,
        brokerId
      )
      .run();

    affiliate = await db
      .prepare(
        `SELECT id, email, full_name, role_category, specialization,
                profile_or_practice_url, promo_code, ref_slug, tier1_rate,
                referred_by_broker_id, tier2_override_rate, status, created_at
         FROM affiliates WHERE email = ?`
      )
      .bind(cleanEmail)
      .first();
  } else if (affiliate && isTeam && /-[A-F0-9]{4}10$/i.test(String(affiliate.promo_code || ''))) {
    // Automatyczna migracja dawnego kodu losowego hex na koncie zespołu na czysty kod flagowy
    const fallbackTeamCode =
      cleanEmail === 'mwspace@gmail.com'
        ? 'DOBRYSTART'
        : cleanEmail === 'maciej@happybirth.pl'
          ? 'GOTOWY-TATA'
          : 'SPOKOJNYPOROD';
    const fallbackSlug = fallbackTeamCode.toLowerCase();
    await db
      .prepare(`UPDATE affiliates SET promo_code = ?, ref_slug = ? WHERE id = ?`)
      .bind(fallbackTeamCode, fallbackSlug, affiliate.id)
      .run()
      .catch(() => {});
    affiliate.promo_code = fallbackTeamCode;
    affiliate.ref_slug = fallbackSlug;
  }

  return {
    affiliate,
    isStudent: Boolean(affiliate),
    isMotherOnly: !affiliate && isMother,
    isAdmin: Boolean(isTeam || userRow?.role === 'admin'),
    userRow,
  };
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
    const url = new URL(request.url);
    const host = request.headers.get('host');
    const validateCode = (url.searchParams.get('validate_code') || '').trim().toUpperCase();
    if (validateCode) {
      let valid = isSemanticAffiliateCodePattern(validateCode) || /^MAMA-[A-Z0-9-]{2,16}$/.test(validateCode);
      if (!valid && env.DB) {
        try {
          const aff = await env.DB.prepare(
            "SELECT id FROM affiliates WHERE (UPPER(promo_code) = ? OR UPPER(ref_slug) = ?) AND status = 'active' LIMIT 1"
          )
            .bind(validateCode, validateCode)
            .first();
          const usr = await env.DB.prepare(
            "SELECT id FROM users WHERE UPPER(referral_code) = ? LIMIT 1"
          )
            .bind(validateCode)
            .first();
          valid = Boolean(aff?.id || usr?.id);
        } catch {}
      }
      return new Response(
        JSON.stringify({ valid, code: validateCode, discountPercent: valid ? 10 : 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const magicToken = url.searchParams.get('token');
    const brokerParam = url.searchParams.get('zaprasza') || url.searchParams.get('broker');
    const secret = env.SESSION_SECRET || DEFAULT_SECRET;

    let session = await getEdgeSession(request, env);
    let setCookieHeader: string | null = null;

    // Obsługa logowania bezpośredniego z tokenu Magic Link (?token=...) na subdomenie afiliacji
    if (magicToken) {
      let verifiedEmail: string | null = null;
      if (env.DB) {
        try {
          const row = await env.DB.prepare(
            `SELECT email, expires_at, used FROM auth_tokens WHERE token = ?`
          )
            .bind(magicToken)
            .first();
          if (row && !row.used && new Date(row.expires_at).getTime() >= Date.now()) {
            verifiedEmail = String(row.email).toLowerCase();
            await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`)
              .bind(magicToken)
              .run();
          }
        } catch {
          // Ignore token DB error
        }
      }

      if (verifiedEmail) {
        let userId = `usr_${verifiedEmail.replace(/[^a-z0-9]/g, '')}`;
        if (env.DB) {
          try {
            const u = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`)
              .bind(verifiedEmail)
              .first();
            if (u?.id) userId = u.id;
          } catch {}
        }
        const jwt = await createSignedSessionToken(
          { userId, email: verifiedEmail, role: 'student' },
          secret
        );
        setCookieHeader = formatSessionSetCookie(jwt, host || undefined);
        session = { userId, email: verifiedEmail, role: 'student', exp: Math.floor(Date.now() / 1000) + 30 * 86400 };
      }
    }

    if (!session?.email) {
      return new Response(
        JSON.stringify({
          authenticated: false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          authenticated: true,
          isStudent: true,
          affiliate: {
            id: 'aff_local',
            email: session.email,
            fullName: session.email.split('@')[0],
            roleCategory: 'standard',
            specialization: 'Kursantka / Ambasadorka HappyBirth',
            profileUrl: '',
            promoCode: 'MAMA-2026',
            refSlug: 'mama-2026',
            tier1Rate: 0.2,
            tier1RatePercent: 20,
            tier2OverrideRatePercent: 5,
            status: 'active',
          },
          payoutSettings: {
            settlementType: 'private_person',
            legalName: '',
            nip: '',
            iban: '',
            address: '',
          },
          stats: {
            eligibleMinor: 0,
            pendingMinor: 0,
            paidMinor: 0,
            totalEarnedMinor: 0,
            directSalesCount: 0,
            brokerSalesCount: 0,
            subAffiliatesCount: 0,
            studentReferralsCount: 0,
          },
          commissions: [],
          subAffiliates: [],
          payouts: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await ensureAffiliateTables(env.DB);

    const { affiliate, isStudent, isMotherOnly, isAdmin, userRow } = await resolveOrProvisionAffiliate(
      env.DB,
      session.email,
      undefined,
      brokerParam
    );

    if (!affiliate) {
      return new Response(
        JSON.stringify({
          authenticated: false,
          isMotherOnly: Boolean(isMotherOnly),
          motherEmail: isMotherOnly ? session.email : undefined,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // [D2a] Automatyczna aktualizacja statusu prowizji z PENDING -> ELIGIBLE,
    // gdy klientka rozpoczęła korzystanie z kursu (wygaszenie prawa odstąpienia z Art. 38 ust. 1 pkt 13 u.p.k.)
    try {
      await env.DB.prepare(
        `UPDATE affiliate_commissions
         SET status = 'ELIGIBLE',
             eligible_at = COALESCE(eligible_at, datetime('now'))
         WHERE (affiliate_id = ? OR broker_id = ?)
           AND status = 'PENDING'
           AND (
             first_content_accessed_at IS NOT NULL
             OR stripe_session_id IN (
               SELECT stripe_session_id FROM orders
               WHERE first_content_accessed_at IS NOT NULL AND status = 'paid'
             )
             OR stripe_session_id IN (
               SELECT stripe_session_id FROM enrollments
               WHERE first_content_accessed_at IS NOT NULL AND status = 'active'
             )
           )`
      )
        .bind(affiliate.id, affiliate.id)
        .run();
    } catch {
      // Non-fatal
    }

    // Pobierz ustawienia wypłat
    const payoutSettingsRow = await env.DB.prepare(
      `SELECT settlement_type, legal_name, nip, iban, address, updated_at
       FROM affiliate_settings WHERE affiliate_id = ?`
    )
      .bind(affiliate.id)
      .first()
      .catch(() => null);

    // Pobierz prowizje Poziomu 1 oraz Poziomu 2 (Broker)
    const commRowsResult = await env.DB.prepare(
      `SELECT id, order_id, stripe_session_id, affiliate_id, broker_id,
              attribution_source, paid_amount_gross, tier1_rate,
              tier1_commission_gross, tier2_commission_gross,
              status, first_content_accessed_at, eligible_at, paid_at, created_at
       FROM affiliate_commissions
       WHERE affiliate_id = ? OR broker_id = ?
       ORDER BY created_at DESC
       LIMIT 100`
    )
      .bind(affiliate.id, affiliate.id)
      .all()
      .catch(() => ({ results: [] }));

    const rawComms: any[] = commRowsResult?.results || [];

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

      const tail = String(row.stripe_session_id || row.order_id || '0000')
        .slice(-4)
        .toUpperCase();

      return {
        id: row.id,
        orderRef: `HB-****-${tail}`,
        type: isDirect ? 'tier1_direct' : 'tier2_broker',
        attributionSource: row.attribution_source || 'promo_code',
        paidAmountGrossMinor: Number(row.paid_amount_gross || 44010),
        commissionGrossMinor: commMinor,
        ratePercent: isDirect ? Math.round(Number(row.tier1_rate || 0.2) * 100) : 5,
        status: row.status || 'PENDING',
        createdAt: row.created_at,
        eligibleAt: row.eligible_at,
        paidAt: row.paid_at,
      };
    });

    // Pobierz sub-partnerów (Poziom 2 Broker Network)
    const subAffResult = await env.DB.prepare(
      `SELECT id, full_name, role_category, promo_code, created_at
       FROM affiliates
       WHERE referred_by_broker_id = ?
       ORDER BY created_at DESC
       LIMIT 50`
    )
      .bind(affiliate.id)
      .all()
      .catch(() => ({ results: [] }));

    const subAffiliates = (subAffResult?.results || []).map((s: any) => {
      const parts = String(s.full_name || 'Partner').trim().split(/\s+/);
      const maskedName =
        parts.length > 1
          ? `${parts[0]} ${parts[1].slice(0, 1)}.`
          : parts[0];
      return {
        id: s.id,
        maskedName,
        roleCategory: s.role_category || 'standard',
        promoCode: s.promo_code,
        joinedAt: s.created_at,
      };
    });

    // Pobierz historię wypłat
    const payoutsResult = await env.DB.prepare(
      `SELECT id, amount_gross_minor, settlement_type, legal_name, iban, invoice_number, status, requested_at, paid_at
       FROM affiliate_payouts
       WHERE affiliate_id = ?
       ORDER BY requested_at DESC
       LIMIT 30`
    )
      .bind(affiliate.id)
      .all()
      .catch(() => ({ results: [] }));

    const payouts = (payoutsResult?.results || []).map((p: any) => ({
      id: p.id,
      amountGrossMinor: Number(p.amount_gross_minor || 0),
      settlementType: p.settlement_type,
      legalName: p.legal_name,
      ibanMasked: p.iban ? `${String(p.iban).slice(0, 6)} **** ${String(p.iban).slice(-4)}` : '',
      invoiceNumber: p.invoice_number || null,
      status: p.status,
      requestedAt: p.requested_at,
      paidAt: p.paid_at,
    }));

    // Liczba poleceń studenckich z tabeli student_referrals
    let studentReferralsCount = 0;
    if (userRow?.id || affiliate.promo_code) {
      const sr = await env.DB.prepare(
        `SELECT COUNT(*) as cnt FROM student_referrals
         WHERE referrer_user_id = ? OR referrer_code = ?`
      )
        .bind(userRow?.id || '__NONE__', affiliate.promo_code)
        .first()
        .catch(() => null);
      studentReferralsCount = Number(sr?.cnt || 0);
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (setCookieHeader) {
      headers['Set-Cookie'] = setCookieHeader;
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        isStudent,
        isAdmin: Boolean(isAdmin),
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
          tier2OverrideRatePercent: Math.round(Number(affiliate.tier2_override_rate || 0.05) * 100),
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
          subAffiliatesCount: subAffiliates.length,
          studentReferralsCount,
        },
        commissions,
        subAffiliates,
        payouts,
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd pobierania danych kokpitu afiliacyjnego' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const session = await getEdgeSession(request, env);
    if (!session?.email) {
      return new Response(
        JSON.stringify({ error: 'Zaloguj się do Panelu Partnera, aby wykonać tę operację.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await ensureAffiliateTables(env.DB);
    const { affiliate, isAdmin, userRow } = await resolveOrProvisionAffiliate(env.DB, session.email);
    if (!affiliate) {
      return new Response(JSON.stringify({ error: 'Nie znaleziono konta partnerskiego.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: any = await request.json().catch(() => ({}));
    const action = body.action || 'update_profile';

    // 1. Personalizacja własnego kodu rabatowego -10% i linku ?ref=
    if (action === 'update_code') {
      const rawPromo = String(body.promoCode || '')
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9_-]/g, '');

      if (rawPromo.length < 4 || rawPromo.length > 20) {
        return new Response(
          JSON.stringify({
            error: 'Kod rabatowy musi mieć od 4 do 20 znaków (litery, cyfry lub myślnik, np. ANNA-10 lub STUDENT-KASIA).',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (
        ['TEST', 'TEST100', 'VIP100', 'FREE', 'ADMIN'].includes(rawPromo) ||
        rawPromo.startsWith('MAMA-')
      ) {
        return new Response(
          JSON.stringify({
            error: rawPromo.startsWith('MAMA-')
              ? 'Prefiks MAMA- jest zarezerwowany dla programu poleceń Mam w Strefie Rodziców. Wybierz własny kod partnerski (np. IMIE-10 lub STUDENT-IMIE).'
              : 'Ten kod jest zarezerwowany systemowo. Wybierz własny kod.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const rawSlug = String(body.refSlug || rawPromo)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 24);

      const conflict = await env.DB.prepare(
        `SELECT id FROM affiliates WHERE (UPPER(promo_code) = ? OR LOWER(ref_slug) = ?) AND id != ? LIMIT 1`
      )
        .bind(rawPromo, rawSlug, affiliate.id)
        .first();

      if (conflict?.id) {
        return new Response(
          JSON.stringify({
            error: 'Ten kod rabatowy lub identyfikator linku jest już zajęty przez innego partnera.',
          }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await env.DB.prepare(
        `UPDATE affiliates SET promo_code = ?, ref_slug = ? WHERE id = ?`
      )
        .bind(rawPromo, rawSlug, affiliate.id)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          promoCode: rawPromo,
          refSlug: rawSlug,
          message: `Twój kod rabatowy (-10%) został zmieniony na ${rawPromo}.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Zapis ustawień profilu biznesowego i danych do wypłat (IBAN / NIP / B2B)
    if (action === 'update_payout_settings') {
      const settlementType = ['b2b_invoice', 'unregistered_business', 'private_person'].includes(
        body.settlementType
      )
        ? body.settlementType
        : 'private_person';
      const legalName = String(body.legalName || affiliate.full_name || '').trim();
      const nip = String(body.nip || '').replace(/[^0-9A-Za-z-]/g, '').trim();
      const iban = String(body.iban || '').replace(/\s+/g, '').toUpperCase().trim();
      const address = String(body.address || '').trim();
      const specialization = String(body.specialization || affiliate.specialization || '').trim();
      const profileUrl = String(body.profileUrl || affiliate.profile_or_practice_url || '').trim();
      const requestedRole = body.roleCategory;

      let newRate = Number(affiliate.tier1_rate || 0.2);
      let newCategory = affiliate.role_category || 'standard';
      let stage2Notice = '';

      if (isAdmin) {
        if (requestedRole === 'midwife_physio') {
          newCategory = 'midwife_physio';
          newRate = 0.3;
        } else if (requestedRole === 'creator_publisher') {
          newCategory = 'creator_publisher';
          newRate = 0.25;
        } else if (requestedRole === 'standard') {
          newCategory = 'standard';
          newRate = 0.2;
        }
      } else if (
        (requestedRole === 'midwife_physio' || requestedRole === 'creator_publisher') &&
        requestedRole !== affiliate.role_category
      ) {
        // Zapisz wniosek o awans na Etap 2 (25% / 30%) dla Administratora bez samodzielnego podnoszenia stawki przez użytkownika
        const reqLabel =
          requestedRole === 'midwife_physio'
            ? '[WNIOSEK ETAP 2: 30% Położna / Fizjoterapeutka]'
            : '[WNIOSEK ETAP 2: 25% Mikroinfluencerka / Twórca]';
        stage2Notice =
          ' Wniosek o stawkę Etapu 2 został przekazany do akceptacji w Panelu Administratora.';
        try {
          await env.DB.prepare(
            `INSERT INTO partnership_inquiries (
               id, channel, full_name, company_or_brand, email, phone,
               role_or_area, profile_url, message, rodo_consent
             ) VALUES (?, 'afiliacja', ?, ?, ?, '', ?, ?, 'Wniosek z Kokpitu Partnera o zmianę stawki na Etap 2', 1)`
          )
            .bind(
              `inq_${crypto.randomUUID()}`,
              legalName || affiliate.full_name,
              nip || null,
              affiliate.email,
              `${reqLabel} ${specialization}`,
              profileUrl || ''
            )
            .run();
        } catch {}
      }

      await env.DB.prepare(
        `INSERT INTO affiliate_settings (
           affiliate_id, settlement_type, legal_name, nip, iban, address, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(affiliate_id) DO UPDATE SET
           settlement_type = excluded.settlement_type,
           legal_name = excluded.legal_name,
           nip = excluded.nip,
           iban = excluded.iban,
           address = excluded.address,
           updated_at = datetime('now')`
      )
        .bind(affiliate.id, settlementType, legalName, nip, iban, address)
        .run();

      await env.DB.prepare(
        `UPDATE affiliates
         SET full_name = COALESCE(NULLIF(?, ''), full_name),
             specialization = ?,
             profile_or_practice_url = ?,
             role_category = ?,
             tier1_rate = ?
         WHERE id = ?`
      )
        .bind(legalName, specialization, profileUrl, newCategory, newRate, affiliate.id)
        .run();

      return new Response(
        JSON.stringify({
          success: true,
          tier1RatePercent: Math.round(newRate * 100),
          roleCategory: newCategory,
          message: `Dane rozliczeniowe i profil partnera zostały zapisane.${stage2Notice}`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Zlecenie wypłaty dostępnych środków (ELIGIBLE)
    if (action === 'request_payout') {
      const settingsRow = await env.DB.prepare(
        `SELECT settlement_type, legal_name, nip, iban, address
         FROM affiliate_settings WHERE affiliate_id = ?`
      )
        .bind(affiliate.id)
        .first();

      const iban = String(body.iban || settingsRow?.iban || '')
        .replace(/\s+/g, '')
        .toUpperCase()
        .trim();
      const legalName = String(body.legalName || settingsRow?.legal_name || affiliate.full_name || '').trim();
      const settlementType = body.settlementType || settingsRow?.settlement_type || 'private_person';
      const nip = String(body.nip || settingsRow?.nip || '').trim();
      const invoiceNumber = String(body.invoiceNumber || '').trim() || null;

      if (!iban || iban.length < 15 || !legalName) {
        return new Response(
          JSON.stringify({
            error: 'Uzupełnij imię i nazwisko / nazwę firmy oraz poprawny numer konta IBAN w zakładce Wypłaty.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const commRowsResult = await env.DB.prepare(
        `SELECT id, affiliate_id, broker_id, tier1_commission_gross, tier2_commission_gross
         FROM affiliate_commissions
         WHERE (affiliate_id = ? OR broker_id = ?) AND status = 'ELIGIBLE'`
      )
        .bind(affiliate.id, affiliate.id)
        .all();

      const eligibleRows: any[] = commRowsResult?.results || [];
      let totalEligibleMinor = 0;
      for (const r of eligibleRows) {
        totalEligibleMinor +=
          r.affiliate_id === affiliate.id
            ? Number(r.tier1_commission_gross || 0)
            : Number(r.tier2_commission_gross || 0);
      }

      if (totalEligibleMinor <= 0) {
        return new Response(
          JSON.stringify({
            error: 'Brak zatwierdzonych środków (ELIGIBLE) dostępnych obecnie do wypłaty.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const payoutId = `pay_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      await env.DB.prepare(
        `INSERT INTO affiliate_payouts (
           id, affiliate_id, amount_gross_minor, settlement_type,
           legal_name, nip, iban, invoice_number, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PROCESSING')`
      )
        .bind(
          payoutId,
          affiliate.id,
          totalEligibleMinor,
          settlementType,
          legalName,
          nip || null,
          iban,
          invoiceNumber
        )
        .run();

      await env.DB.prepare(
        `UPDATE affiliate_commissions
         SET status = 'PAID', paid_at = datetime('now')
         WHERE (affiliate_id = ? OR broker_id = ?) AND status = 'ELIGIBLE'`
      )
        .bind(affiliate.id, affiliate.id)
        .run();

      const formattedPln = `${(totalEligibleMinor / 100).toFixed(2).replace('.', ',')} zł`;

      if (env.RESEND_API_KEY) {
        const fromAddress = env.RESEND_FROM || 'Program Partnerski HappyBirth <kontakt@happybirth.pl>';
        await Promise.allSettled([
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [affiliate.email],
              subject: `Potwierdzenie zlecenia wypłaty prowizji (${formattedPln}) — HappyBirth.pl`,
              html: `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px; color: #1A1512;">
                  <h2 style="margin-top: 0; color: #20071E;">Zlecenie wypłaty przyjęte (${payoutId})</h2>
                  <p style="font-size: 14px; color: #544A44; line-height: 1.6;">
                    Przyjęliśmy Twoje dyspozycję wypłaty prowizji partnerskiej w kwocie <strong>${formattedPln}</strong> na rachunek <strong>${iban.slice(0, 6)}...${iban.slice(-4)}</strong>.
                  </p>
                  <p style="font-size: 12px; color: #867A72;">Dział rozliczeń KLARSOLUTIONS Sp. z o.o. realizuje przelewy w ciągu 3–5 dni roboczych.</p>
                </div>
              `,
            }),
          }),
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: ['kontakt@happybirth.pl'],
              subject: `[WYPŁATA AFILIACJA ${payoutId}] ${legalName} — ${formattedPln}`,
              html: `
                <div style="font-family: sans-serif; font-size: 13px; color: #1A1512;">
                  <h3>Nowe zlecenie wypłaty prowizji (${payoutId})</h3>
                  <p><strong>Partner:</strong> ${legalName} (${affiliate.email})</p>
                  <p><strong>Kwota brutto:</strong> ${formattedPln}</p>
                  <p><strong>Typ rozliczenia:</strong> ${settlementType}</p>
                  <p><strong>NIP:</strong> ${nip || '-'}</p>
                  <p><strong>Nr faktury/rachunku:</strong> ${invoiceNumber || '-'}</p>
                  <p><strong>IBAN:</strong> ${iban}</p>
                </div>
              `,
            }),
          }),
        ]);
      }

      return new Response(
        JSON.stringify({
          success: true,
          payoutId,
          amountGrossMinor: totalEligibleMinor,
          message: `Zlecenie wypłaty ${formattedPln} (${payoutId}) zostało przekazane do realizacji.`,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Nieznana akcja.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd zapisu w kokpicie afiliacyjnym' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
