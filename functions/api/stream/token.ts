export async function onRequestPost(context: { request: Request }): Promise<Response> {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const videoUid = body.videoUid || '';
    const expiresAt = Math.floor(Date.now() / 1000) + 120 * 60;
    return new Response(
      JSON.stringify({
        token: videoUid,
        expiresAt,
        ttlMinutes: 120,
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
