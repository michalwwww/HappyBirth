import { formatClearSessionCookie } from '../../_shared/session';

export async function onRequestPost(): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': formatClearSessionCookie(),
    },
  });
}
