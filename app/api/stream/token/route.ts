import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

export const runtime = 'nodejs';

const JWT_TTL_SECONDS = 120 * 60; // [C2] Kryptograficzny token JWT ważny przez 120 minut (7200 s)

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * [C2] Generowanie Signed JWT URL dla strumieniowania HLS w jakości 4K (Cloudflare Stream)
 * Token wygasa automatycznie po 120 minutach.
 */
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid') || '';
  if (!uid || !/^[a-f0-9]{20,40}$/i.test(uid)) {
    return NextResponse.json({ error: 'Nieprawidłowy identyfikator wideo (uid).' }, { status: 400 });
  }

  const session = await getSession();
  const signingKeyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;
  const signingKeySecret = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_SECRET;

  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + JWT_TTL_SECONDS; // 120 minut ważności

  // Jeśli w środowisku produkcyjnym skonfigurowano klucz podpisujący Cloudflare Stream, podpisz token JWT
  if (signingKeyId && signingKeySecret) {
    const header = { alg: 'HS256', kid: signingKeyId, typ: 'JWT' };
    const payload = {
      sub: uid,
      kid: signingKeyId,
      exp: expSec,
      nbf: nowSec - 30,
      accessRules: [{ type: 'any', action: 'allow' }],
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = crypto
      .createHmac('sha256', signingKeySecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();
    const signedJwt = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`;

    return NextResponse.json({
      uid,
      token: signedJwt,
      expiresAt: new Date(expSec * 1000).toISOString(),
      ttlMinutes: 120,
      authenticated: Boolean(session),
      iframeUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${signedJwt}/iframe`,
      hlsManifestUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${signedJwt}/manifest/video.m3u8`,
    });
  }

  // Fallback podpisu aplikacyjnego (120 min) przy bezpośrednim UID Cloudflare Stream
  const appSecret = process.env.AUTH_SECRET || 'happybirth-stream-jwt-secret-2026';
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: uid, exp: expSec, iat: nowSec, ttlMinutes: 120 };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', appSecret).update(`${encodedHeader}.${encodedPayload}`).digest();
  const appJwt = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(sig)}`;

  return NextResponse.json({
    uid,
    token: appJwt,
    expiresAt: new Date(expSec * 1000).toISOString(),
    ttlMinutes: 120,
    authenticated: Boolean(session),
    iframeUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${uid}/iframe`,
    hlsManifestUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${uid}/manifest/video.m3u8`,
  });
}
