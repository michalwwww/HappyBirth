import {
  getEdgeSession,
  hasActiveCourseEntitlementD1,
  isTeamWhitelistedEmail,
} from '../../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

const ACCESS_DURATION_DAYS = 548;

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const session = await getEdgeSession(request, env);

  if (!session) {
    return new Response(
      JSON.stringify({
        authenticated: false,
        user: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }

  let userRow: any = null;
  let enrollmentRow: any = null;
  let orderRow: any = null;
  let referralRewardRow: any = null;
  let expired = false;
  const cleanSessionEmail = String(session.email || '').trim().toLowerCase();
  const isWhitelisted = isTeamWhitelistedEmail(cleanSessionEmail);

  if (env.DB) {
    try {
      userRow = await env.DB.prepare(
        `SELECT id, email, full_name, avatar_url, role, referral_code,
                due_date, due_date_source, lmp_date, baby_name, baby_gender,
                partner_name, parity, planned_birth_type, city, hospital
         FROM users
         WHERE id = ? OR LOWER(email) = ?
         LIMIT 1`
      )
        .bind(session.userId, cleanSessionEmail)
        .first();

      const effectiveUserId = userRow?.id || session.userId;

      if (userRow && !userRow.referral_code) {
        const generatedCode = `MAMA-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
        await env.DB.prepare('UPDATE users SET referral_code = ? WHERE id = ?')
          .bind(generatedCode, userRow.id)
          .run();
        userRow.referral_code = generatedCode;
      }

      enrollmentRow = await env.DB.prepare(
        `SELECT status, granted_at, expires_at, order_bump_included, first_content_accessed_at
         FROM enrollments
         WHERE user_id = ?
         ORDER BY created_at DESC LIMIT 1`
      )
        .bind(effectiveUserId)
        .first();

      orderRow = await env.DB.prepare(
        `SELECT order_number, amount_total, order_bump_included, promo_code, status, created_at
         FROM orders
         WHERE user_id = ? OR LOWER(customer_email) = ?
         ORDER BY created_at DESC LIMIT 1`
      )
        .bind(effectiveUserId, cleanSessionEmail)
        .first();

      referralRewardRow = await env.DB.prepare(
        `SELECT id, unlocked_at
         FROM student_referrals
         WHERE referrer_user_id = ? AND reward_unlocked = 1
         LIMIT 1`
      )
        .bind(effectiveUserId)
        .first();

      if (enrollmentRow?.expires_at && new Date(enrollmentRow.expires_at).getTime() < Date.now()) {
        expired = true;
      }
    } catch (e) {
      console.error('Błąd odczytu /api/auth/me w D1:', e);
    }
  }

  const hasValidEnrollment = Boolean(
    enrollmentRow && enrollmentRow.status === 'active' && !expired
  );
  const hasValidPaidOrder = Boolean(
    !enrollmentRow &&
      orderRow &&
      (orderRow.status === 'paid' || orderRow.status === 'partially_refunded')
  );
  const hasActiveCourse = isWhitelisted || hasValidEnrollment || hasValidPaidOrder;

  if (!hasActiveCourse) {
    return new Response(
      JSON.stringify({
        authenticated: false,
        expired,
        user: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }

  const defaultExpiresAt = new Date(Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const expiresAtIso = enrollmentRow?.expires_at || defaultExpiresAt;
  const expiresTime = new Date(expiresAtIso).getTime();
  const daysRemaining = isNaN(expiresTime)
    ? ACCESS_DURATION_DAYS
    : Math.max(0, Math.ceil((expiresTime - Date.now()) / (24 * 60 * 60 * 1000)));

  return new Response(
    JSON.stringify({
      authenticated: true,
      expired: false,
      user: {
        id: userRow?.id || session.userId,
        email: userRow?.email || cleanSessionEmail,
        fullName: userRow?.full_name || '',
        avatarUrl: userRow?.avatar_url || '',
        role: userRow?.role || session.role || 'student',
        hasActiveCourse: true,
        expiresAt: expiresAtIso,
        daysRemaining,
        firstContentAccessedAt: enrollmentRow?.first_content_accessed_at || null,
        orderNumber: orderRow?.order_number || null,
        orderBumpIncluded: Boolean(enrollmentRow?.order_bump_included || orderRow?.order_bump_included),
        referralCode: userRow?.referral_code || 'MAMA-2026',
        referralBonusUnlocked: Boolean(referralRewardRow),
        pregnancy: userRow?.due_date
          ? {
              dueDate: userRow.due_date,
              dueDateSource: userRow.due_date_source || 'usg',
              lmpDate: userRow.lmp_date || undefined,
              babyName: userRow.baby_name || undefined,
              babyGender: userRow.baby_gender || 'surprise',
              partnerName: userRow.partner_name || undefined,
              parity: userRow.parity || 'first_baby',
              plannedBirthType: userRow.planned_birth_type || 'natural',
              city: userRow.city || undefined,
              hospital: userRow.hospital || undefined,
              rodoConsent: true,
            }
          : null,
      },
      enrollment: enrollmentRow,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
  );
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const session = await getEdgeSession(request, env);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const entitled = await hasActiveCourseEntitlementD1(env.DB, session.userId, session.email);
    if (!entitled) {
      return new Response(JSON.stringify({ error: 'Brak aktywnego dostępu do kursu' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, mode: 'local_only' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: any = await request.json().catch(() => ({}));
    const {
      fullName,
      dueDate,
      dueDateSource,
      lmpDate,
      babyName,
      babyGender,
      partnerName,
      parity,
      plannedBirthType,
      city,
      hospital,
    } = body;

    await env.DB.prepare(
      `UPDATE users SET
         full_name = COALESCE(?, full_name),
         due_date = ?,
         due_date_source = ?,
         lmp_date = ?,
         baby_name = ?,
         baby_gender = ?,
         partner_name = ?,
         parity = ?,
         planned_birth_type = ?,
         city = ?,
         hospital = ?,
         updated_at = datetime('now')
       WHERE id = ? OR LOWER(email) = ?`
    )
      .bind(
        fullName ? String(fullName).trim() : null,
        dueDate || null,
        dueDateSource || 'usg',
        lmpDate || null,
        babyName || null,
        babyGender || 'surprise',
        partnerName || null,
        parity || 'first_baby',
        plannedBirthType || 'natural',
        city || null,
        hospital || null,
        session.userId,
        String(session.email || '').trim().toLowerCase()
      )
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Nie udało się zapisać profilu w D1' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
