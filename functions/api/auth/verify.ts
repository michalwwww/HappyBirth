import {
  createSignedSessionToken,
  formatSessionSetCookie,
  resolveEdgeSessionSecret,
} from '../../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

async function verifyMagicTokenAndIssueCookie(
  token: string,
  emailFallback: string,
  env: Env,
  request: Request,
  host?: string
): Promise<{
  ok: boolean;
  error?: string;
  statusCode?: number;
  userId?: string;
  email?: string;
  role?: string;
  setCookie?: string;
}> {
  if (!token) {
    return { ok: false, statusCode: 400, error: 'Brak tokenu weryfikacyjnego.' };
  }

  const secret = resolveEdgeSessionSecret(env, request, host);
  if (!secret) {
    return {
      ok: false,
      statusCode: 500,
      error: 'Brak konfiguracji klucza sesji (SESSION_SECRET) na serwerze.',
    };
  }

  let verifiedEmail = emailFallback;
  let userId = `usr_${token.slice(0, 8)}`;
  let userRole = 'student';

  if (env.DB) {
    const tokenRow = await env.DB.prepare(
      `SELECT token, email, expires_at, used
       FROM auth_tokens
       WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')`
    )
      .bind(token)
      .first();

    if (!tokenRow) {
      return {
        ok: false,
        statusCode: 401,
        error: 'Link logowania wygasł lub został już wykorzystany. Wygeneruj nowy link.',
      };
    }

    verifiedEmail = String(tokenRow.email).toLowerCase();

    await env.DB.prepare('UPDATE auth_tokens SET used = 1 WHERE token = ?')
      .bind(token)
      .run();

    const userRow = await env.DB.prepare('SELECT id, role FROM users WHERE email = ?')
      .bind(verifiedEmail)
      .first();

    if (userRow?.id) {
      userId = userRow.id;
      userRole = userRow.role ? String(userRow.role) : 'student';
    } else {
      userId = crypto.randomUUID();
      const refCode = `MAMA-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
      await env.DB.prepare(
        `INSERT INTO users (id, email, referral_code, role) VALUES (?, ?, ?, 'student')`
      )
        .bind(userId, verifiedEmail, refCode)
        .run();
    }
  }

  const signedCookieToken = await createSignedSessionToken(
    { userId, email: verifiedEmail, role: userRole },
    secret
  );

  return {
    ok: true,
    userId,
    email: verifiedEmail,
    role: userRole,
    setCookie: formatSessionSetCookie(signedCookieToken, host),
  };
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = request.headers.get('host') || undefined;
  const token = (url.searchParams.get('token') || '').trim();
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();

  const res = await verifyMagicTokenAndIssueCookie(token, email, env, request, host);
  if (!res.ok || !res.setCookie) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/strefa/login?error=${encodeURIComponent(res.error || 'Błąd weryfikacji linku')}`,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/strefa?payment=success',
      'Set-Cookie': res.setCookie,
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const host = request.headers.get('host') || undefined;
    const body: any = await request.json().catch(() => ({}));
    const token = String(body.token || '').trim();
    const emailParam = String(body.email || '')
      .trim()
      .toLowerCase();

    const res = await verifyMagicTokenAndIssueCookie(token, emailParam, env, request, host);
    if (!res.ok || !res.setCookie) {
      return new Response(
        JSON.stringify({ success: false, error: res.error || 'Błąd weryfikacji tokenu.' }),
        { status: res.statusCode || 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        authenticated: true,
        user: { id: res.userId, email: res.email, role: res.role || 'student' },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': res.setCookie,
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Błąd weryfikacji logowania' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
