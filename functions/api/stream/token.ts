import { getEdgeSession } from '../../_shared/session';

interface Env {
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

async function resolveEdgeStreamToken(
  request: Request,
  videoUid: string,
  lang: string,
  isFreePreviewFlag: boolean,
  env: Env
): Promise<Response> {
  const expiresAt = Math.floor(Date.now() / 1000) + 120 * 60; // 2 godziny TTL ([C2])

  if (!videoUid) {
    return new Response(JSON.stringify({ error: 'Brak identyfikatora wideo (videoUid).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isFreeVideo = isFreePreviewFlag || FREE_PREVIEW_VIDEO_UIDS.has(videoUid);
  if (!isFreeVideo) {
    const session = await getEdgeSession(request, env);
    if (!session && env.CLOUDFLARE_STREAM_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Wymagana autoryzacja sesji kursantki do odtworzenia pełnej lekcji.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
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
    const isFree = url.searchParams.get('free') === 'true';
    return resolveEdgeStreamToken(request, videoUid, lang, isFree, env);
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
    const isFree = Boolean(body.isFreePreview);
    return resolveEdgeStreamToken(request, videoUid, lang, isFree, env);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd tokenu wideo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
