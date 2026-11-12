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
const LOCAL_DEV_FALLBACK_SECRET = 'happybirth-local-dev-only-secret-2026';

export function isLocalDevRequest(request?: Request, hostOverride?: string): boolean {
  let rawHost = hostOverride || request?.headers.get('host') || '';
  if (!rawHost && request?.url) {
    try {
      rawHost = new URL(request.url).hostname;
    } catch {
      rawHost = '';
    }
  }
  const cleanHost = rawHost.toLowerCase().trim().split(':')[0];
  return (
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost === '[::1]' ||
    cleanHost.endsWith('.localhost')
  );
}

export function resolveEdgeSessionSecret(
  env?: { SESSION_SECRET?: string },
  request?: Request,
  hostOverride?: string
): string | null {
  const configured = env?.SESSION_SECRET?.trim();
  if (configured) return configured;
  if (isLocalDevRequest(request, hostOverride)) {
    return LOCAL_DEV_FALLBACK_SECRET;
  }
  return null;
}

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
  secret: string
): Promise<string> {
  if (!secret) {
    throw new Error('Brak skonfigurowanego klucza kryptograficznego SESSION_SECRET.');
  }
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
  secret: string
): Promise<EdgeSessionPayload | null> {
  try {
    if (!secret || !token || !token.includes('.')) return null;
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
  const secret = resolveEdgeSessionSecret(env, request);
  if (!secret) return null;
  return verifySignedSessionToken(rawToken, secret);
}

export function formatSessionSetCookie(token: string, host?: string): string {
  const cleanHost = (host || '').toLowerCase().split(':')[0];
  const domainAttr =
    cleanHost === 'happybirth.pl' || cleanHost.endsWith('.happybirth.pl')
      ? '; Domain=.happybirth.pl'
      : '';
  const secureAttr = cleanHost === 'localhost' || cleanHost === '127.0.0.1' ? '' : '; Secure';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${SESSION_TTL_SECONDS}; Path=/${domainAttr}; HttpOnly${secureAttr}; SameSite=Lax`;
}

export function formatClearSessionCookie(host?: string): string {
  const cleanHost = (host || '').toLowerCase().split(':')[0];
  const domainAttr =
    cleanHost === 'happybirth.pl' || cleanHost.endsWith('.happybirth.pl')
      ? '; Domain=.happybirth.pl'
      : '';
  const secureAttr = cleanHost === 'localhost' || cleanHost === '127.0.0.1' ? '' : '; Secure';
  return `${COOKIE_NAME}=; Max-Age=0; Path=/${domainAttr}; HttpOnly${secureAttr}; SameSite=Lax`;
}
