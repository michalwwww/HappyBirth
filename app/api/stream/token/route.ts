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

async function issueStreamTokenResponse(uid: string, lang: string = 'pl') {
  if (!uid || !/^[a-f0-9]{20,40}$/i.test(uid)) {
    return NextResponse.json({ error: 'Nieprawidłowy identyfikator wideo (uid).' }, { status: 400 });
  }

  const session = await getSession();
  const signingKeyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;
  const signingKeySecret = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_SECRET;
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfStreamApiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;

  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + JWT_TTL_SECONDS; // 120 minut ważności

  // 1. Jeśli skonfigurowano lokalny klucz podpisujący RSA/HS256 Cloudflare Stream
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
      signed: true,
      defaultTextTrack: lang,
      expiresAt: new Date(expSec * 1000).toISOString(),
      ttlMinutes: 120,
      authenticated: Boolean(session),
      iframeUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${signedJwt}/iframe`,
      hlsManifestUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${signedJwt}/manifest/video.m3u8`,
    });
  }

  // 2. Jeśli skonfigurowano CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_STREAM_API_TOKEN (analogicznie do Edge Functions)
  if (cfAccountId && cfStreamApiToken) {
    try {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/stream/${encodeURIComponent(uid)}/token`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfStreamApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exp: expSec }),
        }
      );
      const cfData: any = await cfRes.json();
      if (cfRes.ok && cfData?.result?.token) {
        const apiSignedToken = String(cfData.result.token);
        return NextResponse.json({
          uid,
          token: apiSignedToken,
          signed: true,
          defaultTextTrack: lang,
          expiresAt: new Date(expSec * 1000).toISOString(),
          ttlMinutes: 120,
          authenticated: Boolean(session),
          iframeUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${apiSignedToken}/iframe`,
          hlsManifestUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${apiSignedToken}/manifest/video.m3u8`,
        });
      }
    } catch {
      // Fallback poniżej
    }
  }

  // 3. Bezpieczny fallback do bezpośredniego UID Cloudflare Stream (gdy requireSignedURLs = false)
  // Uwaga [TECH-01]: pole `token` MUSI zwracać `uid`, aby iframe Cloudflare Stream nie podstawiał lokalnego HMAC w ścieżce URL.
  const appSecret = process.env.AUTH_SECRET || 'happybirth-stream-jwt-secret-2026';
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: uid, exp: expSec, iat: nowSec, ttlMinutes: 120 };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', appSecret).update(`${encodedHeader}.${encodedPayload}`).digest();
  const appJwt = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(sig)}`;

  return NextResponse.json({
    uid,
    token: uid,
    appSessionToken: appJwt,
    signed: false,
    defaultTextTrack: lang,
    expiresAt: new Date(expSec * 1000).toISOString(),
    ttlMinutes: 120,
    authenticated: Boolean(session),
    iframeUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${uid}/iframe`,
    hlsManifestUrl: `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${uid}/manifest/video.m3u8`,
  });
}

/**
 * [C2] & [TECH-01] Obsługa GET oraz POST dla odtwarzacza Cloudflare Stream (4K HLS + Multi-Audio/Subtitles)
 */
export async function GET(req: NextRequest) {
  const uid = (req.nextUrl.searchParams.get('uid') || req.nextUrl.searchParams.get('videoUid') || '').trim();
  const lang = (req.nextUrl.searchParams.get('lang') || 'pl').trim().toLowerCase();
  return issueStreamTokenResponse(uid, lang);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const uid = String(body.videoUid || body.uid || '').trim();
    const lang = String(body.lang || 'pl').trim().toLowerCase();
    return issueStreamTokenResponse(uid, lang);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Błąd generowania tokenu strumienia wideo.' },
      { status: 500 }
    );
  }
}
