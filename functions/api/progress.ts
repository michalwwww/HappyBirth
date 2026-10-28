import { getEdgeSession } from '../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const session = await getEdgeSession(request, env);

  if (!session || !env.DB) {
    return new Response(
      JSON.stringify({
        completedLessons: [],
        lessonPositions: {},
        pregnancyProfile: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // [C1] Weryfikacja 18-miesięcznego okresu dostępu (548 dni od zakupu)
    const enrollment = await env.DB.prepare(
      `SELECT status, expires_at FROM enrollments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
    )
      .bind(session.userId)
      .first();

    if (enrollment?.expires_at && new Date(enrollment.expires_at).getTime() < Date.now()) {
      return new Response(
        JSON.stringify({
          expired: true,
          error: 'Twój 18-miesięczny dostęp do kursu wygasł.',
          completedLessons: [],
          lessonPositions: {},
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rows = await env.DB.prepare(
      `SELECT lesson_id, completed, last_position_seconds FROM lesson_progress WHERE user_id = ?`
    )
      .bind(session.userId)
      .all();

    const completedLessons: string[] = [];
    const lessonPositions: Record<string, number> = {};

    for (const r of rows?.results || []) {
      if (r.completed) completedLessons.push(r.lesson_id);
      if (typeof r.last_position_seconds === 'number' && r.last_position_seconds > 0) {
        lessonPositions[r.lesson_id] = r.last_position_seconds;
      }
    }

    const userRow = await env.DB.prepare(
      `SELECT full_name, due_date, baby_name, baby_gender, partner_name, parity, planned_birth_type, city, hospital
       FROM users WHERE id = ?`
    )
      .bind(session.userId)
      .first();

    return new Response(
      JSON.stringify({
        completedLessons,
        lessonPositions,
        pregnancyProfile: userRow || null,
        expiresAt: enrollment?.expires_at || null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({
        completedLessons: [],
        lessonPositions: {},
        pregnancyProfile: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const session = await getEdgeSession(request, env);
    const body: any = await request.json().catch(() => ({}));
    const { lessonId, completed, positionSeconds } = body;

    if (!session || !env.DB || !lessonId) {
      return new Response(JSON.stringify({ success: true, mode: 'local_fallback' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isCompleted = completed ? 1 : 0;
    const pos = typeof positionSeconds === 'number' ? Math.max(0, Math.floor(positionSeconds)) : 0;

    await env.DB.prepare(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, last_position_seconds, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         completed = CASE WHEN excluded.completed = 1 THEN 1 ELSE lesson_progress.completed END,
         last_position_seconds = CASE WHEN excluded.last_position_seconds > 0 THEN excluded.last_position_seconds ELSE lesson_progress.last_position_seconds END,
         updated_at = datetime('now')`
    )
      .bind(crypto.randomUUID(), session.userId, String(lessonId), isCompleted, pos)
      .run();

    // [C1] + [E1] + [D2a] Zapisz pierwsze otwarcie lekcji (wygaszenie prawa do odstąpienia Art. 38 pkt 13 + odblokowanie prowizji ELIGIBLE)
    await env.DB.prepare(
      `UPDATE enrollments
       SET first_content_accessed_at = COALESCE(first_content_accessed_at, datetime('now'))
       WHERE user_id = ?`
    )
      .bind(session.userId)
      .run();

    await env.DB.prepare(
      `UPDATE orders
       SET first_content_accessed_at = COALESCE(first_content_accessed_at, datetime('now'))
       WHERE user_id = ? OR customer_email = ?`
    )
      .bind(session.userId, session.email)
      .run();

    await env.DB.prepare(
      `UPDATE affiliate_commissions
       SET status = 'ELIGIBLE',
           first_content_accessed_at = COALESCE(first_content_accessed_at, datetime('now')),
           eligible_at = COALESCE(eligible_at, datetime('now', '+7 days'))
       WHERE status = 'PENDING'
         AND order_id IN (SELECT id FROM orders WHERE user_id = ? OR customer_email = ?)`
    )
      .bind(session.userId, session.email)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Błąd zapisu postępu' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
