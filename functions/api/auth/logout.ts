import { formatClearSessionCookie } from '../../_shared/session';

export async function onRequestPost(context: { request: Request }): Promise<Response> {
  const host = context.request.headers.get('host') || undefined;
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': formatClearSessionCookie(host),
    },
  });
}
