import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/strefa/login?error=missing_token', req.url));
  }

  try {
    // 1. Sprawdź ważność tokenu w Cloudflare D1
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

    // 2. Oznacz token jako zużyty
    await d1Run('UPDATE auth_tokens SET used = 1 WHERE token = ?', [token]);

    // 3. Pobierz lub utwórz użytkownika
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE email = ?',
      [tokenRecord.email]
    );

    if (!user) {
      const newUserId = crypto.randomUUID();
      await d1Run(
        'INSERT INTO users (id, email, role) VALUES (?, ?, ?)',
        [newUserId, tokenRecord.email, 'student']
      );
      user = { id: newUserId, email: tokenRecord.email, role: 'student' };
    }

    // 4. Utwórz sesyjne ciasteczko
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      role: user.role || 'student',
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
