import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { d1First, d1Run } from '@/lib/d1';

const LOCAL_DEV_UNSUB_SECRET = 'happybirth-local-dev-only-secret-2026';

export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = String(aHex || '').trim().toLowerCase();
  const b = String(bHex || '').trim().toLowerCase();
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
  } catch {
    return false;
  }
}

export function getUnsubscribeSecret(): string | null {
  const configured =
    process.env.SESSION_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV !== 'production') return LOCAL_DEV_UNSUB_SECRET;
  return null;
}

export function signUnsubscribeTokenNode(email: string): string {
  const secret = getUnsubscribeSecret() || LOCAL_DEV_UNSUB_SECRET;
  const cleanEmail = String(email || '').trim().toLowerCase();
  return crypto.createHmac('sha256', secret).update(`unsub:${cleanEmail}`).digest('hex');
}

export function verifyUnsubscribeTokenNode(email: string, sig: string): boolean {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanSig = String(sig || '').trim();
  if (!cleanEmail || !cleanSig) return false;
  const secret = getUnsubscribeSecret();
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`unsub:${cleanEmail}`).digest('hex');
  return timingSafeEqualHex(expected, cleanSig);
}

export function extractNodeClientIp(req?: NextRequest | null): string {
  if (!req) return '0.0.0.0';
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0'
  ).slice(0, 64);
}

export async function checkRateLimitNodeD1(
  bucketKey: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  try {
    await d1Run(
      `CREATE TABLE IF NOT EXISTS rate_limits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bucket_key TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    );
    await d1Run("DELETE FROM rate_limits WHERE created_at < datetime('now', '-1 day')").catch(() => {});
    const modifier = `-${Math.max(1, Math.floor(windowMinutes))} minutes`;
    const row = await d1First<{ cnt?: number }>(
      "SELECT COUNT(*) AS cnt FROM rate_limits WHERE bucket_key = ? AND created_at >= datetime('now', ?)",
      [bucketKey, modifier]
    );
    if (Number(row?.cnt || 0) >= maxRequests) {
      return false;
    }
    await d1Run('INSERT INTO rate_limits (bucket_key) VALUES (?)', [bucketKey]);
    return true;
  } catch {
    return true;
  }
}
