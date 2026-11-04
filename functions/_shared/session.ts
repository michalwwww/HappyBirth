// Współdzielony moduł kryptograficzny Web Crypto API dla Cloudflare Pages Functions
// Obsługuje bezstanowe, podpisane HMAC-SHA256 ciasteczka sesyjne HttpOnly (hb_session)

export interface EdgeSessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number; // Unix timestamp (seconds)
}

const COOKIE_NAME = 'hb_session';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 dni

function base64UrlEncode(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded);
  return decodeURIComponent(
    Array.from(bin)
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

async function signHmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSignedSessionToken(
  payload: Omit<EdgeSessionPayload, 'exp'>,
  secret = 'happybirth-edge-secret-2026'
): Promise<string> {
  const fullPayload: EdgeSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = await signHmac(encoded, secret);
  return `${encoded}.${signature}`;
}

export async function verifySignedSessionToken(
  token: string,
  secret = 'happybirth-edge-secret-2026'
): Promise<EdgeSessionPayload | null> {
  try {
    if (!token || !token.includes('.')) return null;
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;
    const expectedSig = await signHmac(encoded, secret);
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(base64UrlDecode(encoded)) as EdgeSessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookieValue(cookieHeader: string | null, name = COOKIE_NAME): string {
  if (!cookieHeader) return '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export async function getEdgeSession(
  request: Request,
  env?: { SESSION_SECRET?: string }
): Promise<EdgeSessionPayload | null> {
  const rawToken = parseCookieValue(request.headers.get('cookie'), COOKIE_NAME);
  if (!rawToken) return null;
  return verifySignedSessionToken(rawToken, env?.SESSION_SECRET || 'happybirth-edge-secret-2026');
}

export function formatSessionSetCookie(token: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function formatClearSessionCookie(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}
