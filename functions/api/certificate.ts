interface Env {
  DB?: any;
}

export async function onRequestGet(): Promise<Response> {
  return new Response(JSON.stringify({ certificate: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const fullName = (body.fullName || '').trim();
    const scorePercent = Number(body.scorePercent || 0);

    if (!fullName || fullName.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Podaj imię (lub imiona dwojga rodziców), które ma znaleźć się na certyfikacie.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (scorePercent < 80) {
      return new Response(
        JSON.stringify({ error: 'Do wygenerowania certyfikatu wymagany jest wynik minimum 80% w krótkim quizie końcowym.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const certificateCode = `HB-CERT-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO certificates (id, user_id, full_name, quiz_score_percent, certificate_code, issued_at)
           VALUES (?, 'guest', ?, ?, ?, ?)`
        )
          .bind(crypto.randomUUID(), fullName, scorePercent, certificateCode, issuedAt)
          .run();
      } catch (e) {
        console.error('Błąd zapisu certyfikatu w D1:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        certificate: {
          fullName,
          scorePercent,
          certificateCode,
          issuedAt,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd generowania certyfikatu' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
