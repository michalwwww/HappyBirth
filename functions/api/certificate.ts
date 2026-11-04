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
    const totalQuestions = Number(body.totalQuestions || 10);
    const correctAnswers =
      typeof body.correctAnswers === 'number'
        ? Number(body.correctAnswers)
        : Math.round((Number(body.scorePercent || 0) / 100) * totalQuestions);
    const scorePercent =
      typeof body.scorePercent === 'number'
        ? Number(body.scorePercent)
        : Math.round((correctAnswers / Math.max(1, totalQuestions)) * 100);

    if (!fullName || fullName.length < 2) {
      return new Response(
        JSON.stringify({
          passed: false,
          error: 'Podaj imię i nazwisko (lub imiona obojga rodziców), które ma znaleźć się na certyfikacie.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (scorePercent < 80) {
      return new Response(
        JSON.stringify({
          passed: false,
          scorePercent,
          error: `Do wygenerowania certyfikatu wymagany jest wynik minimum 80% (8/10). Twój wynik: ${correctAnswers}/${totalQuestions} (${scorePercent}%).`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const certificateNumber = `HB-CERT-${dateStamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const issuedAt = now.toISOString();
    const issuedDateFormatted = now.toLocaleDateString('pl-PL');

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO certificates (id, certificate_number, user_id, full_name, quiz_score, correct_answers, issued_at)
           VALUES (?, ?, 'guest', ?, ?, ?, ?)`
        )
          .bind(crypto.randomUUID(), certificateNumber, fullName, scorePercent, correctAnswers, issuedAt)
          .run();
      } catch (e) {
        console.error('Błąd zapisu certyfikatu w D1:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        passed: true,
        certificate: {
          certificateNumber,
          certificateCode: certificateNumber,
          fullName,
          scorePercent,
          correctAnswers,
          totalQuestions,
          issuedAt,
          issuedDateFormatted,
          courseTitle: 'Szkoła Rodzenia Online HappyBirth.pl (52 lekcje 4K w 8 modułach · 288 min)',
          academicPartner: 'Szkoła Rodzenia Mama Gaja w Poznaniu (od 2012 r.)',
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ passed: false, error: err.message || 'Błąd generowania certyfikatu' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
