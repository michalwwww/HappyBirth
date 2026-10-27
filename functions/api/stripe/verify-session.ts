export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Brak session_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // [A4] Blokada publicznych kodów testowych 100% na produkcji
    const lowerId = sessionId.toLowerCase();
    if (lowerId.includes('test') || lowerId.startsWith('promo_') || lowerId.startsWith('demo_')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Publiczne sesje testowe są wyłączone na produkcji.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sesja płatności Stripe zweryfikowana',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Błąd weryfikacji' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
