// Współdzielony moduł kryptograficzny Web Crypto API dla Cloudflare Pages Functions
// Obsługuje bezstanowe, podpisane HMAC-SHA256 ciasteczka sesyjne HttpOnly (hb_session),
// weryfikację uprawnień D1, ogranicznik zapytań (Rate Limiting) oraz bezpieczne nagłówki CORS.

export interface EdgeSessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number; // Unix timestamp (seconds)
}

const COOKIE_NAME = 'hb_session';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 dni
const ACCESS_DURATION_MS = 548 * 24 * 60 * 60 * 1000; // 548 dni
const LOCAL_DEV_FALLBACK_SECRET = 'happybirth-local-dev-only-secret-2026';

export const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

export function isTeamWhitelistedEmail(email?: string | null): boolean {
  const clean = String(email || '').trim().toLowerCase();
  return Boolean(clean && TEAM_WHITELIST_EMAILS.has(clean));
}

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

export async function sha256HexEdge(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = String(aHex || '').trim().toLowerCase();
  const b = String(bHex || '').trim().toLowerCase();
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
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
    if (!timingSafeEqualHex(sig, expectedSig)) return null;
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

export function appendClearSessionCookies(headers: Headers, host?: string): void {
  const cleanHost = (host || '').toLowerCase().split(':')[0];
  const secureAttr = cleanHost === 'localhost' || cleanHost === '127.0.0.1' ? '' : '; Secure';
  headers.append('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly${secureAttr}; SameSite=Lax`);
  if (cleanHost === 'happybirth.pl' || cleanHost.endsWith('.happybirth.pl')) {
    headers.append(
      'Set-Cookie',
      `${COOKIE_NAME}=; Max-Age=0; Path=/; Domain=.happybirth.pl; HttpOnly${secureAttr}; SameSite=Lax`
    );
  }
}

export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ALLOWED_STATIC_ORIGINS = new Set([
  'https://happybirth.pl',
  'https://www.happybirth.pl',
  'https://strefa.happybirth.pl',
  'https://afiliacja.happybirth.pl',
  'https://partnerzy.happybirth.pl',
]);

export function resolveAllowedCorsOrigin(request?: Request | null): string {
  const origin = (request?.headers?.get('origin') || '').trim();
  if (!origin) return 'https://happybirth.pl';
  if (ALLOWED_STATIC_ORIGINS.has(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+\.happybirth(-[a-z0-9]+)?\.pages\.dev$/i.test(origin)) {
    return origin;
  }
  if (isLocalDevRequest(request ?? undefined, origin.replace(/^https?:\/\//i, ''))) {
    return origin;
  }
  return 'https://happybirth.pl';
}

export function buildEdgeCorsHeaders(
  request?: Request | null,
  methods = 'GET, POST, OPTIONS'
): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': resolveAllowedCorsOrigin(request),
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

export function extractClientIp(request?: Request | null): string {
  if (!request) return '0.0.0.0';
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0'
  ).slice(0, 64);
}

export async function checkRateLimitD1(
  db: any,
  bucketKey: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  if (!db) return true;
  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS rate_limits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bucket_key TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`
      )
      .run();
    await db
      .prepare("DELETE FROM rate_limits WHERE created_at < datetime('now', '-1 day')")
      .run()
      .catch(() => {});
    const modifier = `-${Math.max(1, Math.floor(windowMinutes))} minutes`;
    const row = (await db
      .prepare(
        "SELECT COUNT(*) AS cnt FROM rate_limits WHERE bucket_key = ? AND created_at >= datetime('now', ?)"
      )
      .bind(bucketKey, modifier)
      .first()) as { cnt?: number } | null;
    if (Number(row?.cnt || 0) >= maxRequests) {
      return false;
    }
    await db
      .prepare('INSERT INTO rate_limits (bucket_key) VALUES (?)')
      .bind(bucketKey)
      .run();
    return true;
  } catch {
    return true;
  }
}

export async function hasActiveCourseEntitlementD1(
  db: any,
  userId?: string | null,
  email?: string | null
): Promise<boolean> {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (cleanEmail && TEAM_WHITELIST_EMAILS.has(cleanEmail)) {
    return true;
  }
  if (!db) return false;

  try {
    let effectiveUserId = String(userId || '').trim();
    if (cleanEmail || effectiveUserId) {
      const userRow = await db
        .prepare('SELECT id FROM users WHERE id = ? OR LOWER(email) = ? LIMIT 1')
        .bind(effectiveUserId || '__NONE__', cleanEmail || '__NONE__')
        .first()
        .catch(() => null);
      if (userRow?.id) {
        effectiveUserId = String(userRow.id);
      }
    }

    if (effectiveUserId) {
      const latestEnrollment = await db
        .prepare(
          `SELECT status, expires_at
           FROM enrollments
           WHERE user_id = ?
           ORDER BY created_at DESC
           LIMIT 1`
        )
        .bind(effectiveUserId)
        .first()
        .catch(() => null);

      if (latestEnrollment) {
        if (latestEnrollment.status !== 'active') {
          return false;
        }
        if (latestEnrollment.expires_at) {
          const expMs = new Date(latestEnrollment.expires_at).getTime();
          if (!Number.isNaN(expMs) && expMs < Date.now()) {
            return false;
          }
        }
        return true;
      }
    }

    const latestOrder = await db
      .prepare(
        `SELECT status, created_at
         FROM orders
         WHERE user_id = ? OR LOWER(customer_email) = ?
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .bind(effectiveUserId || '__NONE__', cleanEmail || '__NONE__')
      .first()
      .catch(() => null);

    if (latestOrder && (latestOrder.status === 'paid' || latestOrder.status === 'partially_refunded')) {
      if (latestOrder.created_at) {
        const createdMs = new Date(latestOrder.created_at).getTime();
        if (!Number.isNaN(createdMs) && Date.now() - createdMs <= ACCESS_DURATION_MS) {
          return true;
        }
      } else {
        return true;
      }
    }
  } catch (err) {
    console.error('Błąd weryfikacji dostępu w D1:', err);
  }

  return false;
}
