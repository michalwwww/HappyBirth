interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const host = (request.headers.get('host') || '').toLowerCase();
    const isAffiliatePortal = body.portal === 'afiliacja' || host.startsWith('afiliacja.');

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          error: isAffiliatePortal
            ? 'Podaj poprawny adres e-mail swojego konta w Programie Afiliacyjnym.'
            : 'Podaj poprawny adres e-mail użyty podczas zakupu kursu.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isTeamEmail = TEAM_WHITELIST_EMAILS.has(email);
    const token = crypto.randomUUID();

    if (env.DB) {
      try {
        if (!isTeamEmail) {
          if (isAffiliatePortal) {
            const affiliateRow = await env.DB.prepare(
              `SELECT id FROM affiliates WHERE email = ? AND status != 'blocked' LIMIT 1`
            )
              .bind(email)
              .first()
              .catch(() => null);

            if (!affiliateRow) {
              const motherRow = await env.DB.prepare(
                `SELECT u.id FROM users u
                 LEFT JOIN enrollments e ON e.user_id = u.id
                 WHERE u.email = ? AND e.status = 'active' LIMIT 1`
              )
                .bind(email)
                .first()
                .catch(() => null);

              return new Response(
                JSON.stringify({
                  error: motherRow
                    ? 'Ten adres e-mail należy do konta Mamy (Kursantki). Mamy są wyłączone z programu afiliacyjnego — Twój program poleceń dla koleżanek (zniżka -10% + prezent E-book PDF) jest dostępny bezpośrednio w Strefie Rodziców (strefa.happybirth.pl).'
                    : 'Nie znaleźliśmy konta partnerskiego dla tego adresu e-mail. Jeśli jesteś naszym Studentem, Ambasadorem, Położną, Fizjoterapeutką lub Mikroinfluencerką — załóż konto w formularzu poniżej (15 sekund).',
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
              );
            }
          } else {
            const accessRow = await env.DB.prepare(
              `SELECT u.id
               FROM users u
               LEFT JOIN enrollments e ON e.user_id = u.id
               LEFT JOIN orders o ON (o.user_id = u.id OR o.customer_email = u.email)
               WHERE u.email = ?
                 AND (
                   (e.status = 'active' AND (e.expires_at IS NULL OR datetime(e.expires_at) > datetime('now')))
                   OR (e.id IS NULL AND o.status IN ('paid', 'partially_refunded') AND datetime(o.created_at, '+548 days') > datetime('now'))
                   OR u.role IN ('admin', 'partner')
                 )
               LIMIT 1`
            )
              .bind(email)
              .first();

            if (!accessRow) {
              return new Response(
                JSON.stringify({
                  error:
                    'Nie znaleźliśmy aktywnego kursu dla podanego adresu e-mail. Upewnij się, że wpisujesz adres użyty podczas zakupu lub kup dostęp do kursu.',
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
              );
            }
          }
        }

        await env.DB.prepare(
          `INSERT INTO auth_tokens (token, email, expires_at, used)
           VALUES (?, ?, datetime('now', '+24 hours'), 0)`
        )
          .bind(token, email)
          .run();
      } catch (e) {
        console.error('Błąd zapisu auth_tokens w D1:', e);
      }
    }

    const magicLink = isAffiliatePortal
      ? `https://afiliacja.happybirth.pl/?token=${token}&email=${encodeURIComponent(email)}`
      : `https://strefa.happybirth.pl/login?token=${token}&email=${encodeURIComponent(email)}`;

    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:
            env.RESEND_FROM ||
            (isAffiliatePortal
              ? 'Program Partnerski HappyBirth <kontakt@happybirth.pl>'
              : 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>'),
          to: [email],
          subject: isAffiliatePortal
            ? 'Twój link logowania do Kokpitu Biznesowego Partnera (afiliacja.happybirth.pl)'
            : 'Twój jednorazowy link logowania do Strefy Rodziców HappyBirth.pl',
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
              <h2 style="margin-top: 0; color: #20071E;">${
                isAffiliatePortal
                  ? 'Logowanie do Kokpitu Biznesowego Partnera (afiliacja.happybirth.pl)'
                  : 'Logowanie do Strefy Rodziców HappyBirth.pl'
              }</h2>
              <p style="font-size: 14px; color: #544A44; line-height: 1.6;">Kliknij poniższy przycisk, aby bezpiecznie zalogować się bez podawania hasła (link jest ważny przez 24 godziny):</p>
              <div style="margin: 22px 0; text-align: center;">
                <a href="${magicLink}" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
                  ${isAffiliatePortal ? 'Otwórz Kokpit Biznesowy Partnera &rarr;' : 'Zaloguj się do Strefy Rodziców &rarr;'}
                </a>
              </div>
              <p style="font-size: 11.5px; color: #867A72;">KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: isAffiliatePortal
          ? 'Wysłaliśmy jednorazowy link logowania do Kokpitu Partnera na podany adres e-mail.'
          : 'Wysłaliśmy jednorazowy link logowania na podany adres e-mail.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Błąd wysyłki linku logowania' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
