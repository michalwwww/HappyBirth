import {
  buildEdgeCorsHeaders,
  createSignedSessionToken,
  formatSessionSetCookie,
  resolveEdgeSessionSecret,
} from '../../_shared/session';

interface Env {
  DB?: any;
  STRIPE_SECRET_KEY?: string;
  SESSION_SECRET?: string;
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: buildEdgeCorsHeaders(context.request, 'GET, OPTIONS'),
  });
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const corsHeaders = buildEdgeCorsHeaders(request, 'GET, OPTIONS');

  try {
    const url = new URL(request.url);
    const sessionId = (url.searchParams.get('session_id') || '').trim();

    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, error: 'Brak parametru session_id.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // [A4] Blokada fałszywych identyfikatorów spoza Stripe (prawdziwe sesje Stripe zaczynają się od cs_)
    const lowerId = sessionId.toLowerCase();
    if (
      lowerId === 'test' ||
      lowerId === 'test100' ||
      lowerId.startsWith('promo_') ||
      lowerId.startsWith('demo_') ||
      !sessionId.startsWith('cs_')
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Publiczne sesje bezpłatne są wyłączone. Wymagana jest opłacona sesja Stripe Checkout (cs_test_ / cs_live_).',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Brak konfiguracji klucza Stripe na serwerze.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const secret = resolveEdgeSessionSecret(env, request);
    if (!secret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Brak konfiguracji SESSION_SECRET na serwerze.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const sessionData: any = await stripeRes.json();
    if (
      sessionData.payment_status !== 'paid' &&
      sessionData.payment_status !== 'no_payment_required'
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          paymentStatus: sessionData.payment_status,
          error: 'Płatność nie została jeszcze potwierdzona.',
        }),
        { status: 402, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const email = String(
      sessionData.customer_details?.email || sessionData.customer_email || ''
    )
      .trim()
      .toLowerCase();
    const fullName = String(sessionData.customer_details?.name || 'Kursantka HappyBirth').trim();
    const isOnlyOrderBump = sessionData.metadata?.only_order_bump === 'true';
    const orderBumpIncluded =
      sessionData.metadata?.order_bump_included === 'true' || isOnlyOrderBump ? 1 : 0;
    let userId = `usr_${sessionId.slice(-10)}`;

    if (env.DB && email) {
      try {
        const existingUser = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1')
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

        if (isOnlyOrderBump) {
          await env.DB.prepare(
            `UPDATE enrollments SET order_bump_included = 1 WHERE user_id = ? AND status = 'active'`
          )
            .bind(userId)
            .run();
        } else {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO enrollments (
               id, user_id, course_id, stripe_session_id, status, order_bump_included, granted_at, expires_at
             ) VALUES (?, ?, 'kurs-glowny-happybirth', ?, 'active', ?, datetime('now'), datetime('now', '+548 days'))`
          )
            .bind(crypto.randomUUID(), userId, sessionId, orderBumpIncluded)
            .run();

          if (orderBumpIncluded) {
            await env.DB.prepare('UPDATE enrollments SET order_bump_included = 1 WHERE user_id = ?')
              .bind(userId)
              .run();
          }
        }
      } catch (e) {
        console.error('Błąd zapisu verify-session w D1:', e);
      }
    }

    const signedCookieToken = await createSignedSessionToken(
      { userId, email: email || 'student@happybirth.pl', role: 'student' },
      secret
    );
    const host = request.headers.get('host') || '';

    return new Response(
      JSON.stringify({
        success: true,
        paid: true,
        email,
        orderBumpIncluded: Boolean(orderBumpIncluded),
        expiresInDays: 548,
        message: 'Płatność zweryfikowana w Stripe. Dostęp na 18 miesięcy (548 dni) został aktywowany.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Set-Cookie': formatSessionSetCookie(signedCookieToken, host),
          ...corsHeaders,
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Błąd weryfikacji' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
