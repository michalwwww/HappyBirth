import {
  createSignedSessionToken,
  formatSessionSetCookie,
} from '../../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const token = String(body.token || '').trim();
    const emailParam = String(body.email || '')
      .trim()
      .toLowerCase();

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Brak tokenu weryfikacyjnego.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let verifiedEmail = emailParam;
    let userId = `usr_${token.slice(0, 8)}`;

    if (env.DB) {
      const tokenRow = await env.DB.prepare(
        `SELECT token, email, expires_at, used
         FROM auth_tokens
         WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')`
      )
        .bind(token)
        .first();

      if (!tokenRow) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Link logowania wygasł lub został już wykorzystany. Wygeneruj nowy link.',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
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
      { userId, email: verifiedEmail, role: 'student' },
      env.SESSION_SECRET
    );

    return new Response(
      JSON.stringify({
        success: true,
        authenticated: true,
        user: { id: userId, email: verifiedEmail, role: 'student' },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': formatSessionSetCookie(signedCookieToken),
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
