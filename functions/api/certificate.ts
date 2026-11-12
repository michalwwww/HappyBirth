import { getEdgeSession } from '../_shared/session';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

const QUIZ_ANSWER_KEY: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 1,
  '4': 0,
  '5': 1,
  '6': 0,
  '7': 0,
  '8': 1,
  '9': 0,
  '10': 1,
};

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

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
    if (!session?.userId || !session?.email) {
      return new Response(
        JSON.stringify({
          passed: false,
          error: 'Zaloguj się do Strefy Kursantki, aby wygenerować imienny certyfikat.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = session.email.trim().toLowerCase();
    const isTeam = TEAM_WHITELIST_EMAILS.has(cleanEmail);
    let effectiveUserId = session.userId;

    if (env.DB) {
      const userByEmail = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1')
        .bind(cleanEmail)
        .first()
        .catch(() => null);
      if (userByEmail?.id) effectiveUserId = userByEmail.id;

      if (!isTeam) {
        const activeEnroll = await env.DB.prepare(
          `SELECT id FROM enrollments
           WHERE user_id = ?
             AND status = 'active'
             AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
           LIMIT 1`
        )
          .bind(effectiveUserId)
          .first()
          .catch(() => null);

        if (!activeEnroll?.id) {
          return new Response(
            JSON.stringify({
              passed: false,
              error: 'Certyfikat ukończenia jest dostępny wyłącznie dla kursantek z aktywnym dostępem do kursu.',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const body: any = await request.json().catch(() => ({}));
    const fullName = String(body.fullName || '')
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 120);

    if (!fullName || fullName.length < 2) {
      return new Response(
        JSON.stringify({
          passed: false,
          error: 'Podaj imię i nazwisko (lub imiona obojga rodziców), które ma znaleźć się na certyfikacie.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const submittedAnswers = body.answers;
    if (!submittedAnswers || typeof submittedAnswers !== 'object' || Array.isArray(submittedAnswers)) {
      return new Response(
        JSON.stringify({
          passed: false,
          error: 'Brak odpowiedzi z testu końcowego do weryfikacji.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const totalQuestions = 10;
    let correctAnswers = 0;
    for (const [qId, expectedIdx] of Object.entries(QUIZ_ANSWER_KEY)) {
      if (Number(submittedAnswers[qId]) === expectedIdx) {
        correctAnswers += 1;
      }
    }
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

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
          `INSERT INTO certificates (id, certificate_number, user_id, full_name, email, quiz_score, correct_answers, issued_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            certificateNumber,
            effectiveUserId,
            fullName,
            cleanEmail,
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
