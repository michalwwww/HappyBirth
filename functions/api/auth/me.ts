import { getEdgeSession } from '../../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const session = await getEdgeSession(request, env);

  if (!session) {
    return new Response(
      JSON.stringify({
        authenticated: false,
        user: null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let enrollment: any = null;
  let expired = false;

  if (env.DB) {
    try {
      const row = await env.DB.prepare(
        `SELECT status, granted_at, expires_at, order_bump_included
         FROM enrollments
         WHERE user_id = ?
         ORDER BY created_at DESC LIMIT 1`
      )
        .bind(session.userId)
        .first();

      if (row) {
        enrollment = row;
        if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
          expired = true;
        }
      }
    } catch {
      // Fallback
    }
  }

  return new Response(
    JSON.stringify({
      authenticated: !expired,
      expired,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
      enrollment,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
