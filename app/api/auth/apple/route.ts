import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const clientId = process.env.APPLE_CLIENT_ID; // Services ID, np. 'pl.happybirth.web'
  const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${origin}/api/auth/apple/callback`;

  if (!clientId) {
    return NextResponse.redirect(
      new URL('/strefa/login?error=apple_not_configured', req.url)
    );
  }

  const state = crypto.randomBytes(16).toString('hex');
  const appleAuthUrl = new URL('https://appleid.apple.com/auth/authorize');
  appleAuthUrl.searchParams.set('client_id', clientId);
  appleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  appleAuthUrl.searchParams.set('response_type', 'code id_token');
  appleAuthUrl.searchParams.set('scope', 'name email');
  appleAuthUrl.searchParams.set('response_mode', 'form_post');
  appleAuthUrl.searchParams.set('state', state);

  const res = NextResponse.redirect(appleAuthUrl);
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minut
    path: '/',
  });
  return res;
}
