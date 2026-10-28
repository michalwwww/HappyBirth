interface Env {
  DB?: any;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

const CHECKBOX_2_ART38_WAIVER_TEXT =
  'Żądam natychmiastowego rozpoczęcia dostarczania treści cyfrowych przed upływem 14-dniowego terminu do odstąpienia od umowy i przyjmuję do wiadomości, że z chwilą uzyskania dostępu do platformy kursowej tracę prawo do odstąpienia od umowy (art. 38 ust. 1 pkt 13 u.p.k.).';

const TERMS_VERSION_SHA256 = 'a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447';

async function verifyStripeSignature(
  rawBody: string,
  sigHeader: string | null,
  webhookSecret: string
): Promise<boolean> {
  if (!sigHeader || !webhookSecret) return false;
  try {
    const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, item) => {
      const [k, v] = item.split('=');
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    }, {});
    const timestamp = parts['t'];
    const signature = parts['v1'];
    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${rawBody}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return expectedSig === signature;
  } catch {
    return false;
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const rawBody = await request.text();
  const sigHeader = request.headers.get('stripe-signature');

  if (env.STRIPE_WEBHOOK_SECRET) {
    const valid = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid Stripe webhook signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data?.object || {};
    if (session.payment_status && session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true, status: 'awaiting_payment' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = String(session.id || '');
    const customerEmail = String(
      session.customer_details?.email || session.customer_email || ''
    )
      .trim()
      .toLowerCase();
    const customerName = String(session.customer_details?.name || 'Kursantka HappyBirth').trim();
    const amountTotal = Number(session.amount_total || 48900);
    const metadata = session.metadata || {};
    const orderBumpIncluded = metadata.order_bump_included === 'true' ? 1 : 0;
    const promoCode = String(metadata.promo_code || '').toUpperCase();
    const refCookie = String(metadata.affiliate_ref_cookie || '');
    const buyerIp = String(metadata.buyer_ip || '0.0.0.0');
    const waiverTimestamp = String(metadata.waiver_art38_timestamp || new Date().toISOString());
    const orderNumber = `HB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${sessionId.slice(-6).toUpperCase()}`;

    if (env.DB && customerEmail && sessionId) {
      try {
        // 1. Idempotencja — sprawdź, czy zamówienie już istnieje
        const existingOrder = await env.DB.prepare(
          'SELECT id FROM orders WHERE stripe_session_id = ?'
        )
          .bind(sessionId)
          .first();

        if (existingOrder) {
          return new Response(JSON.stringify({ received: true, idempotent: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // 2. Użytkownik w tabeli users
        let userRow = await env.DB.prepare('SELECT id, referral_code FROM users WHERE email = ?')
          .bind(customerEmail)
          .first();
        const userId = userRow?.id || crypto.randomUUID();
        const userReferralCode =
          userRow?.referral_code ||
          `MAMA-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

        if (!userRow) {
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, referral_code, role) VALUES (?, ?, ?, ?, 'student')`
          )
            .bind(userId, customerEmail, customerName, userReferralCode)
            .run();
        }

        // 3. Dostęp 18 miesięcy (548 dni) w tabeli enrollments ([C1])
        await env.DB.prepare(
          `INSERT OR IGNORE INTO enrollments (
             id, user_id, course_id, stripe_session_id, status, order_bump_included,
             granted_at, expires_at
           ) VALUES (?, ?, 'kurs-glowny-happybirth', ?, 'active', ?, datetime('now'), datetime('now', '+548 days'))`
        )
          .bind(crypto.randomUUID(), userId, sessionId, orderBumpIncluded)
          .run();

        // 4. Dowodowy rejestr zamówienia i tarczy prawnej Art. 38 ust. 1 pkt 13 ([E1])
        const orderId = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO orders (
             id, order_number, stripe_session_id, user_id, customer_email, customer_name,
             amount_total, currency, order_bump_included, promo_code,
             waiver_art38_accepted, waiver_art38_timestamp, buyer_ip,
             waiver_checkbox_text, terms_sha256, durable_medium_sent_at, status
           ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PLN', ?, ?, 1, ?, ?, ?, ?, datetime('now'), 'paid')`
        )
          .bind(
            orderId,
            orderNumber,
            sessionId,
            userId,
            customerEmail,
            customerName,
            amountTotal,
            orderBumpIncluded,
            promoCode || null,
            waiverTimestamp,
            buyerIp,
            CHECKBOX_2_ART38_WAIVER_TEXT,
            TERMS_VERSION_SHA256
          )
          .run();

        // 5. [C4] Jeśli użyto kodu polecającego innej kursantki (MAMA-XXXX) -> natychmiast odblokuj jej e-book PDF
        if (promoCode.startsWith('MAMA-')) {
          const referrerUser = await env.DB.prepare(
            'SELECT id FROM users WHERE referral_code = ?'
          )
            .bind(promoCode)
            .first();
          if (referrerUser?.id) {
            await env.DB.prepare(
              `INSERT OR IGNORE INTO student_referrals (
                 id, referrer_user_id, referrer_code, referred_email, stripe_session_id, reward_unlocked
               ) VALUES (?, ?, ?, ?, ?, 1)`
            )
              .bind(crypto.randomUUID(), referrerUser.id, promoCode, customerEmail, sessionId)
              .run();
          }
        }

        // 6. [D1b] + [D2] Rozliczenie prowizji afiliacyjnej (Kod rabatowy nadrzędny wobec ?ref= cookie)
        const lookupKey = promoCode || refCookie;
        if (lookupKey) {
          const affiliate = await env.DB.prepare(
            `SELECT id, tier1_rate, referred_by_broker_id, tier2_override_rate
             FROM affiliates
             WHERE (promo_code = ? OR ref_slug = ?) AND status = 'active'`
          )
            .bind(promoCode || '__NONE__', refCookie || '__NONE__')
            .first();

          if (affiliate?.id) {
            const courseNetBase = promoCode ? 44010 : 48900;
            const tier1Rate = Number(affiliate.tier1_rate || 0.2);
            const tier1Comm = Math.round(courseNetBase * tier1Rate);
            const tier2Comm = affiliate.referred_by_broker_id
              ? Math.round(courseNetBase * Number(affiliate.tier2_override_rate || 0.05))
              : 0;

            await env.DB.prepare(
              `INSERT OR IGNORE INTO affiliate_commissions (
                 id, order_id, stripe_session_id, affiliate_id, broker_id,
                 attribution_source, paid_amount_gross, tier1_rate,
                 tier1_commission_gross, tier2_commission_gross, status
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`
            )
              .bind(
                crypto.randomUUID(),
                orderId,
                sessionId,
                affiliate.id,
                affiliate.referred_by_broker_id || null,
                promoCode ? 'promo_code' : 'ref_cookie',
                courseNetBase,
                tier1Rate,
                tier1Comm,
                tier2Comm
              )
              .run();
          }
        }

        // 7. Token Magic Link + Wysyłka potwierdzenia na trwałym nośniku ([E1])
        const magicToken = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO auth_tokens (token, email, expires_at, used)
           VALUES (?, ?, datetime('now', '+7 days'), 0)`
        )
          .bind(magicToken, customerEmail)
          .run();

        if (env.RESEND_API_KEY) {
          const loginUrl = `https://strefa.happybirth.pl/login?token=${magicToken}&email=${encodeURIComponent(customerEmail)}`;
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>',
              to: [customerEmail],
              subject: `Potwierdzenie zamówienia ${orderNumber} (Trwały Nośnik) i dostęp do kursu HappyBirth.pl`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                  <h1 style="font-size: 20px; color: #20071E;">Dziękujemy za zakup kursu HappyBirth.pl!</h1>
                  <p style="font-size: 14px; color: #544A44;">Twoje zamówienie <strong>${orderNumber}</strong> zostało opłacone. Twój dostęp do wszystkich 52 lekcji 4K jest aktywny przez <strong>18 miesięcy (548 dni)</strong>.</p>
                  <div style="margin: 20px 0; text-align: center;">
                    <a href="${loginUrl}" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
                      Wejdź do Strefy Rodziców (1 kliknięcie) &rarr;
                    </a>
                  </div>
                  <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 14px; font-size: 12px; color: #544A44;">
                    <strong>Potwierdzenie zawarcia umowy na trwałym nośniku (art. 38 ust. 1 pkt 13 u.p.k.):</strong><br/>
                    • Data i czas zgody UTC: ${waiverTimestamp}<br/>
                    • Treść zgody: „${CHECKBOX_2_ART38_WAIVER_TEXT}”<br/>
                    • Suma kontrolna Regulaminu SHA-256: ${TERMS_VERSION_SHA256}<br/>
                    • Operator: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań (KRS 0001268396, NIP 7812118273)
                  </div>
                </div>
              `,
            }),
          }).catch(() => {});
        }
      } catch (dbErr) {
        console.error('Błąd zapisu webhooka Stripe w D1:', dbErr);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
