export async function onRequestGet(): Promise<Response> {
  return new Response(
    JSON.stringify({
      authenticated: false,
      user: null,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
