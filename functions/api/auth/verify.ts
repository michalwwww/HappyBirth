import {
  createSignedSessionToken,
  formatSessionSetCookie,
  hasActiveCourseEntitlementD1,
  isLocalDevRequest,
  isTeamWhitelistedEmail,
  resolveEdgeSessionSecret,
} from '../../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

async function verifyMagicTokenAndIssueCookie(
  request: Request,
  token: string,
  env: Env
): Promise<{
  ok: boolean;
  status: number;
  error?: string;
  userId?: string;
  email?: string;
  setCookie?: string;
}> {
  if (!token) {
    return { ok: false, status: 400, error: 'Brak tokenu weryfikacyjnego.' };
  }

  const secret = resolveEdgeSessionSecret(env, request);
  if (!secret) {
    return { ok: false, status: 500, error: 'Błąd konfiguracji sesji serwera (SESSION_SECRET).' };
  }

  if (!env.DB) {
    return { ok: false, status: 500, error: 'Brak połączenia z bazą danych D1.' };
  }

  const tokenRow = await env.DB.prepare(
    `SELECT token, email, expires_at, used
     FROM auth_tokens
     WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')`
  )
    .bind(token)
    .first();

  if (!tokenRow?.email) {
    return {
      ok: false,
      status: 401,
      error: 'Link logowania wygasł lub został już wykorzystany. Wygeneruj nowy link.',
    };
  }

  const verifiedEmail = String(tokenRow.email).trim().toLowerCase();

  await env.DB.prepare('UPDATE auth_tokens SET used = 1 WHERE token = ?')
    .bind(token)
    .run();

  const userRow = await env.DB.prepare('SELECT id, role FROM users WHERE LOWER(email) = ? LIMIT 1')
    .bind(verifiedEmail)
    .first();

  let userId = userRow?.id ? String(userRow.id) : '';
  const isWhitelisted = isTeamWhitelistedEmail(verifiedEmail);
  const entitled =
    isWhitelisted || (await hasActiveCourseEntitlementD1(env.DB, userId || null, verifiedEmail));

  if (!entitled) {
    return {
      ok: false,
      status: 403,
      error: 'Brak aktywnego pakietu kursu dla tego konta.',
    };
  }

  if (!userId) {
    userId = crypto.randomUUID();
    const refCode = `MAMA-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await env.DB.prepare(
      `INSERT INTO users (id, email, referral_code, role) VALUES (?, ?, ?, 'student')`
    )
      .bind(userId, verifiedEmail, refCode)
      .run();
  }

  const signedCookieToken = await createSignedSessionToken(
    { userId, email: verifiedEmail, role: userRow?.role === 'partner' ? 'partner' : 'student' },
    secret
  );

  const host = request.headers.get('host') || '';
  return {
    ok: true,
    status: 200,
    userId,
    email: verifiedEmail,
    setCookie: formatSessionSetCookie(signedCookieToken, host),
  };
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  const isLocal = isLocalDevRequest(request);

  const res = await verifyMagicTokenAndIssueCookie(request, token, env);
  if (!res.ok || !res.setCookie) {
    const loginErrTarget = isLocal
      ? `/strefa/login?error=${encodeURIComponent(res.error || 'Błąd weryfikacji linku')}`
      : `https://strefa.happybirth.pl/login?error=${encodeURIComponent(res.error || 'Błąd weryfikacji linku')}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: loginErrTarget,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: isLocal ? '/strefa' : 'https://strefa.happybirth.pl/',
      'Set-Cookie': res.setCookie,
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const token = String(body.token || '').trim();

    const res = await verifyMagicTokenAndIssueCookie(request, token, env);
    if (!res.ok || !res.setCookie) {
      return new Response(
        JSON.stringify({ success: false, error: res.error || 'Błąd weryfikacji tokenu.' }),
        { status: res.status || 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        authenticated: true,
        user: { id: res.userId, email: res.email, role: 'student' },
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
