import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'happybirth-secret-encryption-key-2026';
const COOKIE_NAME = 'hb_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

// Generowanie bezpiecznego tokenu HMAC dla ciasteczka sesyjnego
export function signSession(payload: Omit<SessionPayload, 'exp'>, daysValid: number = 30): string {
  const exp = Math.floor(Date.now() / 1000) + daysValid * 24 * 60 * 60;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encoded = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

// Weryfikacja i dekodowanie ciasteczka sesyjnego
export function verifySession(token: string): SessionPayload | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encoded)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    );

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Sesja wygasła
    }

    return payload;
  } catch {
    return null;
  }
}

// Pobranie bieżącej sesji z cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return verifySession(sessionCookie.value);
}

// Ustawienie ciasteczka sesyjnego
export async function setSessionCookie(payload: Omit<SessionPayload, 'exp'>) {
  const token = signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 dni
  });
}

// Usunięcie ciasteczka sesyjnego (Wylogowanie)
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
