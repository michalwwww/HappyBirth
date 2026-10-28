interface Env {
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_STREAM_API_TOKEN?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const videoUid = String(body.videoUid || '').trim();
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
              token: cfData.result.token,
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
        token: videoUid,
        expiresAt,
        ttlMinutes: 120,
        signed: false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd tokenu wideo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
