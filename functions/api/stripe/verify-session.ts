import {
  createSignedSessionToken,
  formatSessionSetCookie,
} from '../../_shared/session';

interface Env {
  DB?: any;
  STRIPE_SECRET_KEY?: string;
  SESSION_SECRET?: string;
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const sessionId = (url.searchParams.get('session_id') || '').trim();

    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, error: 'Brak parametru session_id.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // [A4] Blokada publicznych kodów testowych 100% na produkcji
    const lowerId = sessionId.toLowerCase();
    if (
      lowerId.includes('test') ||
      lowerId.startsWith('promo_') ||
      lowerId.startsWith('demo_') ||
      !sessionId.startsWith('cs_')
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Publiczne sesje testowe są wyłączone. Wymagana jest opłacona sesja Stripe Checkout.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Brak konfiguracji klucza Stripe na serwerze.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prawdziwa weryfikacja sesji bezpośrednio w API Stripe
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!stripeRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nie znaleziono sesji płatności w Stripe.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sessionData: any = await stripeRes.json();
    if (sessionData.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({
          success: false,
          paymentStatus: sessionData.payment_status,
          error: 'Płatność nie została jeszcze potwierdzona.',
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const email = String(
      sessionData.customer_details?.email || sessionData.customer_email || ''
    )
      .trim()
      .toLowerCase();
    const fullName = String(sessionData.customer_details?.name || 'Kursantka HappyBirth').trim();
    let userId = `usr_${sessionId.slice(-10)}`;

    if (env.DB && email) {
      try {
        const existingUser = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
          .bind(email)
          .first();
        if (existingUser?.id) {
          userId = existingUser.id;
        } else {
          userId = crypto.randomUUID();
          const refCode = `MAMA-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, referral_code, role) VALUES (?, ?, ?, ?, 'student')`
          )
            .bind(userId, email, fullName, refCode)
            .run();
        }

        await env.DB.prepare(
          `INSERT OR IGNORE INTO enrollments (
             id, user_id, course_id, stripe_session_id, status, granted_at, expires_at
           ) VALUES (?, ?, 'kurs-glowny-happybirth', ?, 'active', datetime('now'), datetime('now', '+548 days'))`
        )
          .bind(crypto.randomUUID(), userId, sessionId)
          .run();
      } catch (e) {
        console.error('Błąd zapisu verify-session w D1:', e);
      }
    }

    const signedCookieToken = await createSignedSessionToken(
      { userId, email: email || 'student@happybirth.pl', role: 'student' },
      env.SESSION_SECRET
    );

    return new Response(
      JSON.stringify({
        success: true,
        paid: true,
        email,
        expiresInDays: 548,
        message: 'Płatność zweryfikowana w Stripe. Dostęp na 18 miesięcy (548 dni) został aktywowany.',
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
    return new Response(JSON.stringify({ success: false, error: err.message || 'Błąd weryfikacji' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
