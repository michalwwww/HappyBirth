import { getEdgeSession } from '../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const session = await getEdgeSession(request, env);

  if (session && env.DB) {
    try {
      const row = await env.DB.prepare(
        `SELECT certificate_number, full_name, quiz_score, correct_answers, issued_at
         FROM certificates
         WHERE user_id = ?
         ORDER BY issued_at DESC
         LIMIT 1`
      )
        .bind(session.userId)
        .first();

      if (row) {
        const issuedDateFormatted = row.issued_at
          ? new Date(row.issued_at).toLocaleDateString('pl-PL')
          : new Date().toLocaleDateString('pl-PL');
        return new Response(
          JSON.stringify({
            certificate: {
              certificateNumber: row.certificate_number,
              certificateCode: row.certificate_number,
              fullName: row.full_name,
              scorePercent: Number(row.quiz_score || 100),
              correctAnswers: Number(row.correct_answers || 10),
              totalQuestions: 10,
              issuedAt: row.issued_at,
              issuedDateFormatted,
              courseTitle: 'Szkoła Rodzenia Online HappyBirth.pl (52 lekcje 4K w 8 modułach · 288 min)',
              academicPartner: 'Szkoła Rodzenia Mama Gaja w Poznaniu (od 2012 r.)',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error('Błąd odczytu certyfikatu z D1:', e);
    }
  }

  return new Response(JSON.stringify({ certificate: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const session = await getEdgeSession(request, env);
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
        let effectiveUserId = session?.userId || null;
        if (effectiveUserId) {
          const existingUser = await env.DB.prepare('SELECT id FROM users WHERE id = ?')
            .bind(effectiveUserId)
            .first();
          if (!existingUser) {
            effectiveUserId = null;
          }
        }
        if (!effectiveUserId && session?.email) {
          const byEmail = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
            .bind(session.email)
            .first();
          if (byEmail?.id) {
            effectiveUserId = byEmail.id;
          }
        }
        if (!effectiveUserId) {
          // Upewnij się, że techniczny rekord użytkownika istnieje, aby zachować spójność klucza obcego w D1
          effectiveUserId = 'usr_cert_guest';
          await env.DB.prepare(
            `INSERT OR IGNORE INTO users (id, email, full_name, role)
             VALUES ('usr_cert_guest', 'certyfikat@happybirth.pl', ?, 'student')`
          )
            .bind(fullName)
            .run();
        }

        await env.DB.prepare(
          `INSERT INTO certificates (id, certificate_number, user_id, full_name, quiz_score, correct_answers, issued_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            certificateNumber,
            effectiveUserId,
            fullName,
            scorePercent,
            correctAnswers,
            issuedAt
          )
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
