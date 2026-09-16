import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const storedState = req.cookies.get('oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/strefa/login?error=${encodeURIComponent(error)}`, req.url));
  }

  if (!code || !state || (storedState && state !== storedState)) {
    return NextResponse.redirect(new URL('/strefa/login?error=invalid_oauth_state', req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/strefa/login?error=missing_google_credentials', req.url));
  }

  try {
    // 1. Wymiana kodu autoryzacyjnego na tokeny w Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Błąd pobierania tokenu Google:', tokenData);
      return NextResponse.redirect(new URL('/strefa/login?error=google_token_failed', req.url));
    }

    // 2. Pobranie danych profilu użytkownika
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    if (!userData.email) {
      return NextResponse.redirect(new URL('/strefa/login?error=no_email_provided', req.url));
    }

    const email = userData.email.trim().toLowerCase();
    const googleId = userData.sub;
    const fullName = userData.name || '';
    const avatarUrl = userData.picture || '';

    // 3. Sprawdź lub utwórz użytkownika w bazie Cloudflare D1
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE google_id = ? OR email = ? LIMIT 1',
      [googleId, email]
    );

    if (!user) {
      const newUserId = crypto.randomUUID();
      await d1Run(
        `INSERT INTO users (id, email, full_name, avatar_url, google_id, auth_provider, role) 
         VALUES (?, ?, ?, ?, ?, 'google', 'student')`,
        [newUserId, email, fullName, avatarUrl, googleId]
      );
      user = { id: newUserId, email, role: 'student' };
    } else {
      // Zaktualizuj google_id / avatar jeśli jeszcze nie ma
      await d1Run(
        "UPDATE users SET google_id = COALESCE(google_id, ?), avatar_url = COALESCE(avatar_url, ?), updated_at = datetime('now') WHERE id = ?",
        [googleId, avatarUrl, user.id]
      );
    }

    // 4. Utwórz sesję w ciasteczku hb_session
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      role: user.role || 'student',
    });

    const response = NextResponse.redirect(new URL('/strefa', req.url));
    response.cookies.delete('oauth_state');
    response.cookies.set('hb_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 dni
    });

    return response;
  } catch (err) {
    console.error('Błąd Google OAuth Callback:', err);
    return NextResponse.redirect(new URL('/strefa/login?error=google_auth_failed', req.url));
  }
}
