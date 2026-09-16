import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

// GET: Pobierz ukończone lekcje dla zalogowanego użytkownika
export async function GET() {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ completedLessons: [] });
  }

  const rows = await d1All<{ lesson_id: string }>(
    'SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND completed = 1',
    [session.userId]
  );

  const completedLessons = rows.map((r) => r.lesson_id);
  return NextResponse.json({ completedLessons });
}

// POST: Zapisz stan ukończenia lekcji w Cloudflare D1
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.userId) {
    // Niezalogowany użytkownik - działa tylko w localStorage
    return NextResponse.json({ saved: false, reason: 'unauthenticated' });
  }

  try {
    const { lessonId, completed } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Brak lessonId' }, { status: 400 });
    }

    const completedInt = completed ? 1 : 0;
    const progressId = crypto.randomUUID();

    await d1Run(
      `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         completed = excluded.completed,
         updated_at = datetime('now')`,
      [progressId, session.userId, lessonId, completedInt]
    );

    return NextResponse.json({ saved: true, lessonId, completed: !!completed });
  } catch (err: any) {
    console.error('Błąd zapisu postępu w Cloudflare D1:', err);
    return NextResponse.json({ error: 'Błąd bazy danych' }, { status: 500 });
  }
}
