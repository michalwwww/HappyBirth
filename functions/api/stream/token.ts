interface Env {
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_STREAM_API_TOKEN?: string;
}

async function resolveEdgeStreamToken(videoUid: string, lang: string, env: Env): Promise<Response> {
  const expiresAt = Math.floor(Date.now() / 1000) + 120 * 60; // 2 godziny TTL ([C2])

  if (!videoUid) {
    return new Response(JSON.stringify({ error: 'Brak identyfikatora wideo (videoUid).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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
    return resolveEdgeStreamToken(videoUid, lang, env);
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
    return resolveEdgeStreamToken(videoUid, lang, env);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd tokenu wideo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
