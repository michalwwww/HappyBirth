import {
  escapeHtml,
  verifyUnsubscribeToken,
} from '../_shared/session';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  SESSION_SECRET?: string;
  AUTH_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

async function processUnsubscribe(email: string, env: Env): Promise<number> {
  let cancelledCount = 0;
  if (!env.DB) return 0;
  try {
    await env.DB.prepare('ALTER TABLE leads ADD COLUMN unsubscribed_at TEXT').run().catch(() => {});
    await env.DB.prepare('ALTER TABLE leads ADD COLUMN resend_scheduled_ids TEXT').run().catch(() => {});

    const leadRowsRes = await env.DB.prepare(
      'SELECT id, resend_scheduled_ids FROM leads WHERE LOWER(email) = ?'
    )
      .bind(email)
      .all();
    const leadRows: any[] = leadRowsRes?.results || [];

    const allIds = new Set<string>();
    for (const row of leadRows) {
      if (row?.resend_scheduled_ids) {
        try {
          const parsed = JSON.parse(String(row.resend_scheduled_ids));
          if (Array.isArray(parsed)) {
            parsed.forEach((id) => {
              if (id) allIds.add(String(id));
            });
          }
        } catch {
          // Ignore malformed JSON
        }
      }
    }

    if (env.RESEND_API_KEY && allIds.size > 0) {
      const results = await Promise.allSettled(
        Array.from(allIds).map((id) =>
          fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}/cancel`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
          })
        )
      );
      cancelledCount = results.filter((r) => r.status === 'fulfilled').length;
    }

    await env.DB.prepare(
      `UPDATE leads
       SET unsubscribed_at = COALESCE(unsubscribed_at, datetime('now')),
           marketing_consent = 0,
           resend_scheduled_ids = '[]'
       WHERE LOWER(email) = ?`
    )
      .bind(email)
      .run();

    await env.DB.prepare(
      `UPDATE users SET marketing_consent = 0 WHERE LOWER(email) = ?`
    )
      .bind(email)
      .run()
      .catch(() => {});
  } catch (err) {
    console.error('Błąd wypisania z subskrypcji (Edge):', err);
  }
  return cancelledCount;
}

function buildHtmlConfirmationPage(email: string): string {
  const safeEmail = escapeHtml(email);
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Wypisano z komunikacji e-mail — HappyBirth.pl</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FBF8F4; color: #1A1512; margin: 0; padding: 40px 16px; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #EAE3DB; border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #FAE3EB; color: #DA0271; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { font-size: 22px; margin: 14px 0 10px; }
    p { font-size: 14px; line-height: 1.6; color: #544A44; }
    .btn { display: inline-block; margin-top: 18px; padding: 12px 24px; border-radius: 999px; background: #250A24; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; }
    .footer { margin-top: 24px; font-size: 11px; color: #867A72; border-top: 1px solid #EAE3DB; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Zgoda cofnięta (RFC 8058)</span>
    <h1>Twój adres został wypisany</h1>
    <p>Adres e-mail <strong>${safeEmail}</strong> został usunięty z edukacyjnej i marketingowej listy wysyłkowej <strong>HappyBirth.pl</strong> oraz zaplanowanych wiadomości przypominających.</p>
    <p>Jeśli posiadasz aktywny dostęp do kursu, wiadomości ściśle transakcyjne (linki logowania i potwierdzenia zakupu) pozostają obsługiwane zgodnie z umową.</p>
    <a class="btn" href="https://happybirth.pl/">Wróć na stronę główną HappyBirth.pl</a>
    <div class="footer">Operator: KLARSOLUTIONS Sp. z o.o. · ul. Śląska 14, 60-614 Poznań · KRS: 0001268396</div>
  </div>
</body>
</html>`;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  const sig = (url.searchParams.get('sig') || '').trim();

  const valid = await verifyUnsubscribeToken(email, sig, env, request);
  if (!valid) {
    return new Response('Nieprawidłowy lub wygasły podpis linku wypisu.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  await processUnsubscribe(email, env);
  return new Response(buildHtmlConfirmationPage(email), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  const sig = (url.searchParams.get('sig') || '').trim();

  const valid = await verifyUnsubscribeToken(email, sig, env, request);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid unsubscribe signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cancelledCount = await processUnsubscribe(email, env);
  return new Response(
    JSON.stringify({ success: true, unsubscribed: true, email, cancelledScheduledEmails: cancelledCount }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
