import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';

export const runtime = 'nodejs';

async function handleAppleResponse(
  req: NextRequest, 
  code: string | null, 
  idToken: string | null, 
  state: string | null, 
  userJson: string | null, 
  error: string | null
) {
  if (error) {
    return NextResponse.redirect(new URL(`/strefa/login?error=${encodeURIComponent(error)}`, req.url));
  }

  const storedState = req.cookies.get('oauth_state')?.value;
  if (!idToken && !code) {
    return NextResponse.redirect(new URL('/strefa/login?error=missing_apple_token', req.url));
  }

  if (state && storedState && state !== storedState) {
    return NextResponse.redirect(new URL('/strefa/login?error=invalid_oauth_state', req.url));
  }

  try {
    let appleId = '';
    let email = '';
    let fullName = '';

    // Odczyt danych z opcjonalnego pola user (wysyłanego przez Apple tylko przy pierwszej rejestracji)
    if (userJson) {
      try {
        const parsed = JSON.parse(userJson);
        const first = parsed.name?.firstName || '';
        const last = parsed.name?.lastName || '';
        fullName = `${first} ${last}`.trim();
        if (parsed.email) {
          email = parsed.email.trim().toLowerCase();
        }
      } catch {}
    }

    // Dekodowanie ładunku id_token (JWT format: header.payload.signature)
    if (idToken) {
      const parts = idToken.split('.');
      if (parts.length >= 2) {
        const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
        const payload = JSON.parse(payloadJson);
        appleId = payload.sub || '';
        if (!email && payload.email) {
          email = payload.email.trim().toLowerCase();
        }
      }
    }

    if (!appleId && !email) {
      return NextResponse.redirect(new URL('/strefa/login?error=apple_payload_empty', req.url));
    }

    // Jeśli Apple ukryło e-mail i nie przekazało go w tokenie, użyj identyfikatora sub jako unikalnego adresu
    const effectiveEmail = email || `apple_${appleId}@privaterelay.appleid.com`;

    // 1. Sprawdź lub utwórz użytkownika w Cloudflare D1
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE apple_id = ? OR email = ? LIMIT 1',
      [appleId, effectiveEmail]
    );

    if (!user) {
      const newUserId = crypto.randomUUID();
      await d1Run(
        `INSERT INTO users (id, email, full_name, apple_id, auth_provider, role) 
         VALUES (?, ?, ?, ?, 'apple', 'student')`,
        [newUserId, effectiveEmail, fullName, appleId]
      );
      user = { id: newUserId, email: effectiveEmail, role: 'student' };
    } else {
      await d1Run(
        "UPDATE users SET apple_id = COALESCE(apple_id, ?), updated_at = datetime('now') WHERE id = ?",
        [appleId, user.id]
      );
    }

    // 2. Utwórz sesyjne ciasteczko hb_session
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
    console.error('Błąd weryfikacji Apple ID:', err);
    return NextResponse.redirect(new URL('/strefa/login?error=apple_auth_failed', req.url));
  }
}

// Apple domyślnie przy response_mode=form_post wysyła POST
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const code = formData.get('code') as string | null;
    const idToken = formData.get('id_token') as string | null;
    const state = formData.get('state') as string | null;
    const userJson = formData.get('user') as string | null;
    const error = formData.get('error') as string | null;

    return await handleAppleResponse(req, code, idToken, state, userJson, error);
  } catch (e) {
    console.error('Błąd parsowania żądania POST z Apple:', e);
    return NextResponse.redirect(new URL('/strefa/login?error=apple_post_failed', req.url));
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const idToken = url.searchParams.get('id_token');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  return await handleAppleResponse(req, code, idToken, state, null, error);
}
