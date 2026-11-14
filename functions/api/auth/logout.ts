import { appendClearSessionCookies } from '../../_shared/session';

export async function onRequestPost(context: { request: Request }): Promise<Response> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  appendClearSessionCookies(headers, context.request.headers.get('host') || '');
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });
}
