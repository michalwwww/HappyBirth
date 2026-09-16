import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { d1First } from '@/lib/d1';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // Pobierz dodatkowe dane o dostępie kursantki z Cloudflare D1
  const enrollment = await d1First<{ status: string; expires_at: string }>(
    'SELECT status, expires_at FROM enrollments WHERE user_id = ? AND status = ? LIMIT 1',
    [session.userId, 'active']
  );

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
      hasActiveCourse: !!enrollment || session.role === 'student' || session.role === 'partner',
      expiresAt: enrollment?.expires_at,
    },
  });
}
