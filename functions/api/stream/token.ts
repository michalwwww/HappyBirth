import { getEdgeSession, isLocalDevRequest } from '../../_shared/session';

interface Env {
  DB?: any;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_STREAM_API_TOKEN?: string;
  SESSION_SECRET?: string;
}

const FREE_PREVIEW_VIDEO_UIDS = new Set([
  '5964ee4fb4fe81cd9adcd1b74d5aa05c', // Zwiastun główny
  'f8d8d8f24b917a32961efea785c9324b', // Lekcja 1 (free preview)
  'ab0d90bf8a42fcf4d7e4debf10509f73', // Lekcja 6 (free preview)
  'ea898b3a4f5e4b7e23d212d595b13f47', // Lekcja 26 (free preview)
  '21baa2cafef2f7731b4a36c6464ee6e8', // Lekcja 40 (free preview)
]);

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

async function resolveEdgeStreamToken(
  request: Request,
  videoUid: string,
  lang: string,
  env: Env
): Promise<Response> {
  const expiresAt = Math.floor(Date.now() / 1000) + 120 * 60; // 2 godziny TTL ([C2])

  if (!videoUid || !/^[a-f0-9]{20,40}$/i.test(videoUid)) {
    return new Response(JSON.stringify({ error: 'Nieprawidłowy identyfikator wideo (videoUid).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // [SECURITY] Nigdy nie ufamy fladze przesłanej przez klienta (?free=true / body.isFreePreview) — decyduje wyłącznie serwerowa biała lista UID
  const isFreeVideo = FREE_PREVIEW_VIDEO_UIDS.has(videoUid);
  if (!isFreeVideo) {
    const session = await getEdgeSession(request, env);
    const isLocalDev = isLocalDevRequest(request);

    if (!session) {
      if (!isLocalDev) {
        return new Response(
          JSON.stringify({ error: 'Wymagana autoryzacja sesji kursantki do odtworzenia pełnej lekcji.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (env.DB) {
      const cleanEmail = String(session.email || '').trim().toLowerCase();
      const isTeam = TEAM_WHITELIST_EMAILS.has(cleanEmail) || session.role === 'admin';
      if (!isTeam) {
        try {
          const entitlement = await env.DB.prepare(
            `SELECT u.id
             FROM users u
             LEFT JOIN enrollments e ON e.user_id = u.id
             LEFT JOIN orders o ON (o.user_id = u.id OR o.customer_email = u.email)
             WHERE (u.id = ? OR u.email = ?)
               AND (
                 (e.status = 'active' AND (e.expires_at IS NULL OR datetime(e.expires_at) > datetime('now')))
                 OR (e.id IS NULL AND o.status IN ('paid', 'partially_refunded') AND datetime(o.created_at, '+548 days') > datetime('now'))
                 OR u.role IN ('admin', 'partner')
               )
             LIMIT 1`
          )
            .bind(session.userId, cleanEmail)
            .first();

          if (!entitlement) {
            return new Response(
              JSON.stringify({
                error: 'Brak aktywnego lub ważnego (18 miesięcy / 548 dni) dostępu do pełnego kursu.',
              }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
          }
        } catch {
          // W razie przejściowego błędu D1 przepuszczamy zweryfikowaną kryptograficznie sesję HMAC
        }
      }
    }
  }

  if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_STREAM_API_TOKEN) {
    try {
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${encodeURIComponent(videoUid)}/token`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_STREAM_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exp: expiresAt }),
        }
      );
      const cfData: any = await cfRes.json();
      if (cfRes.ok && cfData?.result?.token) {
        return new Response(
          JSON.stringify({
            uid: videoUid,
            token: cfData.result.token,
            defaultTextTrack: lang,
            expiresAt,
            ttlMinutes: 120,
            signed: true,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch {
      // Fallback do videoUid poniżej
    }
  }

  return new Response(
    JSON.stringify({
      uid: videoUid,
      token: videoUid,
      defaultTextTrack: lang,
      expiresAt,
      ttlMinutes: 120,
      signed: false,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const videoUid = String(url.searchParams.get('uid') || url.searchParams.get('videoUid') || '').trim();
    const lang = String(url.searchParams.get('lang') || 'pl').trim().toLowerCase();
    return resolveEdgeStreamToken(request, videoUid, lang, env);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd tokenu wideo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const videoUid = String(body.videoUid || body.uid || '').trim();
    const lang = String(body.lang || 'pl').trim().toLowerCase();
    return resolveEdgeStreamToken(request, videoUid, lang, env);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd tokenu wideo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
