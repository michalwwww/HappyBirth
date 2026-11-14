import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';

export const runtime = 'nodejs';

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
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/strefa/login?error=missing_token', req.url));
  }

  try {
    const tokenRecord = await d1First<{ token: string; email: string; expires_at: string; used: number }>(
      'SELECT token, email, expires_at, used FROM auth_tokens WHERE token = ?',
      [token]
    );

    if (!tokenRecord || tokenRecord.used === 1) {
      return NextResponse.redirect(new URL('/strefa/login?error=invalid_token', req.url));
    }

    if (new Date(tokenRecord.expires_at).getTime() < Date.now()) {
      return NextResponse.redirect(new URL('/strefa/login?error=expired_token', req.url));
    }

    await d1Run('UPDATE auth_tokens SET used = 1 WHERE token = ?', [token]);

    const cleanEmail = tokenRecord.email.trim().toLowerCase();
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    let entitled = TEAM_WHITELIST_EMAILS.has(cleanEmail);
    if (!entitled && user?.id) {
      const enrollment = await d1First<{ status: string; expires_at?: string }>(
        'SELECT status, expires_at FROM enrollments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [user.id]
      );
      const expired =
        enrollment?.expires_at && new Date(enrollment.expires_at).getTime() < Date.now();
      entitled = Boolean(enrollment && enrollment.status === 'active' && !expired);
    }

    if (!entitled) {
      return NextResponse.redirect(new URL('/strefa/login?error=no_active_course', req.url));
    }

    if (!user) {
      const newUserId = crypto.randomUUID();
      await d1Run(
        'INSERT INTO users (id, email, role) VALUES (?, ?, ?)',
        [newUserId, cleanEmail, 'student']
      );
      user = { id: newUserId, email: cleanEmail, role: 'student' };
    }

    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      role: user.role === 'partner' ? 'partner' : 'student',
    });

    const response = NextResponse.redirect(new URL('/strefa', req.url));
    response.cookies.set('hb_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 dni
    });

    return response;
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    return NextResponse.redirect(new URL('/strefa/login?error=server_error', req.url));
  }
}
