import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1Run } from '@/lib/d1';
import { computeCommissionEligibleDate } from '@/lib/affiliate';

export const runtime = 'nodejs';

const FREE_PREVIEW_LESSONS = new Set(['lekcja-01', 'lekcja-06', 'lekcja-26', 'lekcja-40']);

// GET: Pobierz ukończone lekcje oraz ostatnie pozycje sekundowe (Auto-Resume co 15s [C2])
export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ completedLessons: [], positions: {} });
  }

  const rows = await d1All<{ lesson_id: string; completed: number; last_position_seconds: number }>(
    'SELECT lesson_id, completed, last_position_seconds FROM lesson_progress WHERE user_id = ?',
    [session.userId]
  );

  const completedLessons = rows.filter((r) => r.completed === 1).map((r) => r.lesson_id);
  const positions: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.last_position_seconds && r.last_position_seconds > 0) {
      positions[r.lesson_id] = r.last_position_seconds;
    }
  });

  return NextResponse.json({ completedLessons, positions });
}

// POST: Zapisz stan ukończenia lekcji, sekundę Auto-Resume ([C2]) oraz first_content_accessed_at ([C1]/[E1]/[D2a])
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ error: 'Wymagane zalogowanie.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { lessonId, completed, lastPositionSeconds, positionSeconds } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Brak lessonId' }, { status: 400 });
    }

    const cleanLessonId = String(lessonId).trim();
    const progressId = crypto.randomUUID();
    const rawPos = typeof lastPositionSeconds === 'number' ? lastPositionSeconds : positionSeconds;
    const posInt = typeof rawPos === 'number' && rawPos >= 0 ? Math.floor(rawPos) : 0;
    const isCompleted = completed === true ? 1 : 0;

    if (typeof completed === 'boolean') {
      await d1Run(
        `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, last_position_seconds, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           completed = CASE WHEN excluded.completed = 1 THEN 1 ELSE lesson_progress.completed END,
           last_position_seconds = CASE WHEN excluded.last_position_seconds > 0 THEN excluded.last_position_seconds ELSE lesson_progress.last_position_seconds END,
           updated_at = datetime('now')`,
        [progressId, session.userId, cleanLessonId, isCompleted, posInt]
      );
    } else {
      // Aktualizacja samej sekundy oglądania (Auto-Resume co 15s)
      await d1Run(
        `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, last_position_seconds, updated_at)
         VALUES (?, ?, ?, 0, ?, datetime('now'))
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           last_position_seconds = CASE WHEN excluded.last_position_seconds > 0 THEN excluded.last_position_seconds ELSE lesson_progress.last_position_seconds END,
           updated_at = datetime('now')`,
        [progressId, session.userId, cleanLessonId, posInt]
      );
    }

    // [C1] + [E1] Wyłącznie płatne lekcje (>= 15 s lub ukończone) wygaszają prawo odstąpienia i uruchamiają 7-dniowy bufor prowizji (status pozostaje PENDING!)
    const isPaidConsumption = !FREE_PREVIEW_LESSONS.has(cleanLessonId) && (posInt >= 15 || isCompleted === 1);
    if (isPaidConsumption) {
      const nowIso = new Date().toISOString();
      await d1Run(
        `UPDATE enrollments
         SET first_content_accessed_at = COALESCE(first_content_accessed_at, ?)
         WHERE user_id = ?`,
        [nowIso, session.userId]
      );

      await d1Run(
        `UPDATE orders
         SET first_content_accessed_at = COALESCE(first_content_accessed_at, ?)
         WHERE user_id = ? OR LOWER(customer_email) = ?`,
        [nowIso, session.userId, session.email.toLowerCase()]
      );

      // [D2a] Prowizja pozostaje w statusie PENDING aż minie 7-dniowy bufor (eligible_at)
      const eligibleAtIso = computeCommissionEligibleDate(nowIso);
      await d1Run(
        `UPDATE affiliate_commissions
         SET first_content_accessed_at = COALESCE(first_content_accessed_at, ?),
             eligible_at = COALESCE(eligible_at, ?)
         WHERE status = 'PENDING'
           AND order_id IN (SELECT id FROM orders WHERE user_id = ? OR LOWER(customer_email) = ?)`,
        [nowIso, eligibleAtIso, session.userId, session.email.toLowerCase()]
      );
    }

    return NextResponse.json({
      saved: true,
      lessonId,
      completed: typeof completed === 'boolean' ? completed : undefined,
      lastPositionSeconds: posInt,
    });
  } catch (err: any) {
    console.error('Błąd zapisu postępu w Cloudflare D1:', err);
    return NextResponse.json({ error: 'Błąd bazy danych' }, { status: 500 });
  }
}
