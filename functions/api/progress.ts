import { getEdgeSession } from '../_shared/session';

const FREE_PREVIEW_LESSONS = new Set(['lekcja-01', 'lekcja-06', 'lekcja-26', 'lekcja-40']);

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
        positions: {},
        lessonPositions: {},
        pregnancyProfile: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // [C1] Weryfikacja statusu i 18-miesięcznego okresu dostępu (548 dni od zakupu)
    const enrollment = await env.DB.prepare(
      `SELECT status, expires_at FROM enrollments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
    )
      .bind(session.userId)
      .first();

    if (
      enrollment?.status === 'refunded' ||
      (enrollment?.expires_at && new Date(enrollment.expires_at).getTime() < Date.now())
    ) {
      return new Response(
        JSON.stringify({
          expired: true,
          error:
            enrollment?.status === 'refunded'
              ? 'Dostęp do kursu został wycofany w związku ze zwrotem zamówienia.'
              : 'Twój 18-miesięczny dostęp do kursu wygasł.',
          completedLessons: [],
          positions: {},
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
        positions: lessonPositions,
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
        positions: {},
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
    if (!session?.userId) {
      return new Response(JSON.stringify({ error: 'Wymagane zalogowanie.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: any = await request.json().catch(() => ({}));
    const { lessonId, completed, positionSeconds, lastPositionSeconds } = body;

    if (!lessonId) {
      return new Response(JSON.stringify({ error: 'Brak identyfikatora lekcji (lessonId).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, saved: true, mode: 'local_fallback' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanLessonId = String(lessonId).trim();
    const isCompleted = completed ? 1 : 0;
    const rawPos = typeof lastPositionSeconds === 'number' ? lastPositionSeconds : positionSeconds;
    const pos = typeof rawPos === 'number' ? Math.max(0, Math.floor(rawPos)) : 0;

    await env.DB.prepare(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, last_position_seconds, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         completed = CASE WHEN excluded.completed = 1 THEN 1 ELSE lesson_progress.completed END,
         last_position_seconds = CASE WHEN excluded.last_position_seconds > 0 THEN excluded.last_position_seconds ELSE lesson_progress.last_position_seconds END,
         updated_at = datetime('now')`
    )
      .bind(crypto.randomUUID(), session.userId, cleanLessonId, isCompleted, pos)
      .run();

    // [C1] + [E1] + [D2a] Wyłącznie płatne lekcje (>= 15 s lub ukończone) wygaszają prawo odstąpienia i uruchamiają 7-dniowy bufor prowizji (status pozostaje PENDING!)
    const isPaidConsumption = !FREE_PREVIEW_LESSONS.has(cleanLessonId) && (pos >= 15 || isCompleted === 1);
    if (isPaidConsumption) {
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
         WHERE user_id = ? OR LOWER(customer_email) = ?`
      )
        .bind(session.userId, session.email.toLowerCase())
        .run();

      await env.DB.prepare(
        `UPDATE affiliate_commissions
         SET first_content_accessed_at = COALESCE(first_content_accessed_at, datetime('now')),
             eligible_at = COALESCE(eligible_at, datetime('now', '+7 days'))
         WHERE status = 'PENDING'
           AND order_id IN (SELECT id FROM orders WHERE user_id = ? OR LOWER(customer_email) = ?)`
      )
        .bind(session.userId, session.email.toLowerCase())
        .run();
    }

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
