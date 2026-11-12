import { generateMotherReferralCode } from '../../../lib/brand-codes';
import { escapeHtml, timingSafeEqualHex } from '../../_shared/session';

interface Env {
  DB?: any;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

const CHECKBOX_2_ART38_WAIVER_TEXT =
  'Tak, chcę otrzymać dostęp do kursu natychmiast po opłaceniu i zgodnie z art. 38 ust. 1 pkt 13 u.p.k. zgadzam się na utratę 14-dniowego prawa do odstąpienia od umowy';

const TERMS_VERSION_SHA256 = 'baac2cea8e6c1d1bbeff5827cbb4eee13414180e36c4730d270821b6f3bad619';
const WEBHOOK_TOLERANCE_SECONDS = 300; // 5 minut tolerancji na replay

async function cancelScheduledCrmEmailsEdge(db: any, email: string, resendApiKey?: string): Promise<void> {
  if (!db || !email) return;
  try {
    const leadRow = await db
      .prepare('SELECT id, resend_scheduled_ids FROM leads WHERE LOWER(email) = ? ORDER BY id DESC LIMIT 1')
      .bind(email)
      .first();
    if (leadRow?.resend_scheduled_ids && resendApiKey) {
      let ids: string[] = [];
      try {
        const parsed = JSON.parse(String(leadRow.resend_scheduled_ids));
        if (Array.isArray(parsed)) ids = parsed.map(String).filter(Boolean);
      } catch {
        ids = [];
      }
      await Promise.allSettled(
        ids.map((id) =>
          fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}/cancel`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendApiKey}` },
          })
        )
      );
    }
    await db
      .prepare(
        `UPDATE leads
         SET unsubscribed_at = COALESCE(unsubscribed_at, datetime('now')),
             resend_scheduled_ids = '[]'
         WHERE LOWER(email) = ?`
      )
      .bind(email)
      .run()
      .catch(() => {});
  } catch {
    // Nie przerywaj księgowania zamówienia przy braku tabeli leads w starszej bazie
  }
}

export async function verifyStripeSignature(
  rawBody: string,
  sigHeader: string | null,
  webhookSecret: string,
  nowUnixSeconds: number = Math.floor(Date.now() / 1000)
): Promise<boolean> {
  if (!sigHeader || !webhookSecret) return false;
  try {
    let timestampStr = '';
    const v1Signatures: string[] = [];
    for (const part of sigHeader.split(',')) {
      const idx = part.indexOf('=');
      if (idx <= 0) continue;
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      if (!v) continue;
      if (k === 't' && !timestampStr) timestampStr = v;
      else if (k === 'v1') v1Signatures.push(v);
    }
    const timestampNum = Number(timestampStr);
    if (!timestampStr || !Number.isFinite(timestampNum) || v1Signatures.length === 0) {
      return false;
    }
    if (Math.abs(nowUnixSeconds - timestampNum) > WEBHOOK_TOLERANCE_SECONDS) {
      return false;
    }

    const signedPayload = `${timestampStr}.${rawBody}`;
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
    return v1Signatures.some((cand) => timingSafeEqualHex(expectedSig, cand));
  } catch {
    return false;
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const rawBody = await request.text();
  const sigHeader = request.headers.get('stripe-signature');

  // Fail-closed: brak sekretu webhooka lub podpisu musi odrzucać żądanie
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error('CRITICAL: Brak STRIPE_WEBHOOK_SECRET w zmiennych środowiskowych Cloudflare.');
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const valid = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid Stripe webhook signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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
    if (
      session.payment_status &&
      session.payment_status !== 'paid' &&
      session.payment_status !== 'no_payment_required'
    ) {
      return new Response(JSON.stringify({ received: true, status: 'awaiting_payment' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionId = String(session.id || '');
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || null;
    const customerEmail = String(
      session.customer_details?.email || session.customer_email || ''
    )
      .trim()
      .toLowerCase();
    const customerName = String(session.customer_details?.name || 'Kursantka HappyBirth').trim();
    const amountTotal =
      session.amount_total !== undefined && session.amount_total !== null
        ? Number(session.amount_total)
        : 48900;
    const metadata = session.metadata || {};
    const sessionCurrency = String(session.currency || metadata.currency || 'PLN').toUpperCase();
    const isOnlyOrderBump = metadata.only_order_bump === 'true';
    const orderBumpIncluded = metadata.order_bump_included === 'true' || isOnlyOrderBump ? 1 : 0;
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
        let userReferralCode = userRow?.referral_code || '';
        if (!userReferralCode) {
          const baseMotherCode = generateMotherReferralCode(customerName, customerEmail);
          const conflict = await env.DB.prepare('SELECT id FROM users WHERE referral_code = ? LIMIT 1')
            .bind(baseMotherCode)
            .first()
            .catch(() => null);
          userReferralCode = conflict?.id
            ? generateMotherReferralCode(customerName, customerEmail, Math.floor(10 + Math.random() * 89))
            : baseMotherCode;
        }

        if (!userRow) {
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, referral_code, role) VALUES (?, ?, ?, ?, 'student')`
          )
            .bind(userId, customerEmail, customerName, userReferralCode)
            .run();
        }

        // 3. Dostęp 18 miesięcy (548 dni) w tabeli enrollments ([C1]) — NIGDY przy samym Order Bumpie!
        if (isOnlyOrderBump) {
          await env.DB.prepare(
            `UPDATE enrollments SET order_bump_included = 1 WHERE user_id = ? AND status = 'active'`
          )
            .bind(userId)
            .run();
        } else {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO enrollments (
               id, user_id, course_id, stripe_session_id, status, order_bump_included,
               granted_at, expires_at
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

        // 4. Dowodowy rejestr zamówienia i tarczy prawnej Art. 38 ust. 1 pkt 13 ([E1] & [TECH-03])
        const orderId = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO orders (
             id, order_number, stripe_session_id, stripe_payment_intent, user_id, customer_email, customer_name,
             amount_total, currency, order_bump_included, promo_code,
             waiver_art38_accepted, waiver_art38_timestamp, buyer_ip,
             waiver_checkbox_text, terms_sha256, durable_medium_sent_at, status
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, datetime('now'), 'paid')`
        )
          .bind(
            orderId,
            orderNumber,
            sessionId,
            paymentIntentId,
            userId,
            customerEmail,
            customerName,
            amountTotal,
            sessionCurrency,
            orderBumpIncluded,
            isOnlyOrderBump ? null : promoCode || null,
            waiverTimestamp,
            buyerIp,
            CHECKBOX_2_ART38_WAIVER_TEXT,
            TERMS_VERSION_SHA256
          )
          .run();

        // 4b. Zatrzymaj ewentualną sekwencję CRM dla leada, który właśnie kupił kurs główny
        if (!isOnlyOrderBump) {
          await cancelScheduledCrmEmailsEdge(env.DB, customerEmail, env.RESEND_API_KEY);
        }

        // 5. [C4] Jeśli użyto kodu polecającego innej kursantki (MAMA-XXXX) -> natychmiast odblokuj jej e-book PDF (tylko dla kursu głównego)
        if (!isOnlyOrderBump && promoCode.startsWith('MAMA-')) {
          const referrerUser = await env.DB.prepare(
            'SELECT id, email FROM users WHERE referral_code = ?'
          )
            .bind(promoCode)
            .first();
          if (referrerUser?.id && String(referrerUser.email || '').toLowerCase() !== customerEmail) {
            await env.DB.prepare(
              `INSERT OR IGNORE INTO student_referrals (
                 id, referrer_user_id, referrer_code, referred_email, stripe_session_id, reward_unlocked
               ) VALUES (?, ?, ?, ?, ?, 1)`
            )
              .bind(crypto.randomUUID(), referrerUser.id, promoCode, customerEmail, sessionId)
              .run();
          }
        }

        // 6. [D1b] + [D2] Rozliczenie prowizji afiliacyjnej (spójne z ORDER_BUMP_PRICE_MINOR w checkout.ts)
        const bumpMinorByCurrency: Record<string, number> = {
          PLN: 4900,
          GBP: 1500,
          EUR: 1700,
          USD: 2700,
          AUD: 2900,
          AED: 8900,
        };
        const bumpMinor = orderBumpIncluded
          ? (bumpMinorByCurrency[sessionCurrency] ?? 4900)
          : 0;
        const courseNetBase = Math.max(0, amountTotal - bumpMinor);
        const isFreeOrTestCode =
          courseNetBase <= 0 ||
          promoCode === 'TEST' ||
          promoCode === 'TEST100' ||
          promoCode.includes('100');

        const lookupKey = promoCode || refCookie;
        // Mamy są wyłączone z programu afiliacyjnego — kody MAMA-* obsługują wyłącznie zniżkę -10% dla koleżanki i prezent PDF dla Mamy (sekcja 5 powyżej)
        if (!isOnlyOrderBump && !isFreeOrTestCode && lookupKey && !lookupKey.startsWith('MAMA-')) {
          const affiliate = await env.DB.prepare(
            `SELECT id, email, promo_code, tier1_rate, referred_by_broker_id, tier2_override_rate
             FROM affiliates
             WHERE (UPPER(promo_code) = UPPER(?) OR LOWER(ref_slug) = LOWER(?) OR UPPER(promo_code) = UPPER(?)) AND status = 'active'
             ORDER BY CASE WHEN UPPER(promo_code) = UPPER(?) THEN 0 ELSE 1 END
             LIMIT 1`
          )
            .bind(
              promoCode || '__NONE__',
              refCookie || '__NONE__',
              refCookie || '__NONE__',
              promoCode || '__NONE__'
            )
            .first();

          if (
            affiliate?.id &&
            String(affiliate.email || '').trim().toLowerCase() !== customerEmail
          ) {
            const matchedByPromo =
              Boolean(promoCode) &&
              String(affiliate.promo_code || '').toUpperCase() === promoCode;
            const tier1Rate = Math.min(0.3, Math.max(0.2, Number(affiliate.tier1_rate || 0.2)));
            const tier1Comm = Math.round(courseNetBase * tier1Rate);
            const tier2Comm = affiliate.referred_by_broker_id
              ? Math.round(courseNetBase * Number(affiliate.tier2_override_rate || 0.05))
              : 0;

            const tier2Status = affiliate.referred_by_broker_id && tier2Comm > 0 ? 'PENDING' : 'CANCELLED';
            await env.DB.prepare(
              `INSERT OR IGNORE INTO affiliate_commissions (
                 id, order_id, stripe_session_id, affiliate_id, broker_id,
                 attribution_source, paid_amount_gross, tier1_rate,
                 tier1_commission_gross, tier2_commission_gross, status, tier1_status, tier2_status
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING', ?)`
            )
              .bind(
                crypto.randomUUID(),
                orderId,
                sessionId,
                affiliate.id,
                affiliate.referred_by_broker_id || null,
                matchedByPromo ? 'promo_code' : 'ref_cookie',
                courseNetBase,
                tier1Rate,
                tier1Comm,
                tier2Comm,
                tier2Status
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
          const safeOrderNo = escapeHtml(orderNumber);
          const safeWaiverTs = escapeHtml(waiverTimestamp);
          const emailSubject = isOnlyOrderBump
            ? `Potwierdzenie zamówienia ${orderNumber} (Pakiet Kart dla Taty PDF) — HappyBirth.pl`
            : `Potwierdzenie zamówienia ${orderNumber} (Trwały Nośnik) i dostęp do kursu HappyBirth.pl`;
          const emailHeadline = isOnlyOrderBump
            ? 'Twój Pakiet Kart na Porodówkę dla Taty (PDF) jest gotowy!'
            : 'Dziękujemy za zakup kursu HappyBirth.pl!';
          const emailIntro = isOnlyOrderBump
            ? `Twoje zamówienie <strong>${safeOrderNo}</strong> na dodatek <strong>Pakiet Kart Sytuacyjnych na Porodówkę dla Taty (PDF)</strong> zostało opłacone i odblokowane na Twoim koncie.`
            : `Twoje zamówienie <strong>${safeOrderNo}</strong> zostało opłacone. Twój dostęp do wszystkich 52 lekcji 4K jest aktywny przez <strong>18 miesięcy (548 dni)</strong>.`;

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>',
              to: [customerEmail],
              subject: emailSubject,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
                  <h1 style="font-size: 20px; color: #20071E;">${emailHeadline}</h1>
                  <p style="font-size: 14px; color: #544A44;">${emailIntro}</p>
                  <div style="margin: 20px 0; text-align: center;">
                    <a href="${loginUrl}" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
                      Wejdź do Strefy Rodziców (1 kliknięcie) &rarr;
                    </a>
                  </div>
                  <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 14px; font-size: 12px; color: #544A44;">
                    <strong>Potwierdzenie zawarcia umowy na trwałym nośniku (art. 38 ust. 1 pkt 13 u.p.k.):</strong><br/>
                    • Data i czas zgody UTC: ${safeWaiverTs}<br/>
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
        console.error('CRITICAL: Błąd zapisu webhooka Stripe w D1:', dbErr);
        return new Response(
          JSON.stringify({ error: 'Database persistence failed; retry requested' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // [A7] + [D2] + [D5a] Obsługa zwrotów (charge.refunded) dopasowana po payment_intent
  if (event.type === 'charge.refunded') {
    const charge = event.data?.object || {};
    const paymentIntentId =
      typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id || null;
    const customerEmail = String(
      charge.billing_details?.email || charge.receipt_email || ''
    )
      .trim()
      .toLowerCase();
    const chargeAmount = Number(charge.amount || 0);
    const amountRefunded = Number(charge.amount_refunded || 0);
    const isPartialRefund =
      charge.refunded === false ||
      (chargeAmount > 0 && amountRefunded > 0 && amountRefunded < chargeAmount);

    if (env.DB) {
      try {
        let matchedOrder: any = null;
        if (paymentIntentId) {
          matchedOrder = await env.DB.prepare(
            `SELECT id, user_id, stripe_session_id, amount_total, order_bump_included
             FROM orders WHERE stripe_payment_intent = ? LIMIT 1`
          )
            .bind(paymentIntentId)
            .first();
        }
        if (!matchedOrder && customerEmail) {
          matchedOrder = await env.DB.prepare(
            `SELECT id, user_id, stripe_session_id, amount_total, order_bump_included
             FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC LIMIT 1`
          )
            .bind(customerEmail)
            .first();
        }

        if (matchedOrder?.id) {
          const isStandaloneBumpOrder = Number(matchedOrder.amount_total || 0) <= 6000;
          if (isPartialRefund || isStandaloneBumpOrder) {
            await env.DB.prepare(
              `UPDATE orders SET order_bump_included = 0, status = ? WHERE id = ?`
            )
              .bind(isPartialRefund ? 'partially_refunded' : 'refunded', matchedOrder.id)
              .run();
            if (matchedOrder.user_id) {
              await env.DB.prepare(
                `UPDATE enrollments SET order_bump_included = 0 WHERE user_id = ?`
              )
                .bind(matchedOrder.user_id)
                .run();
            }
          } else {
            await env.DB.prepare(
              `UPDATE orders SET status = 'refunded' WHERE id = ?`
            )
              .bind(matchedOrder.id)
              .run();
            if (matchedOrder.stripe_session_id) {
              const res = await env.DB.prepare(
                `UPDATE enrollments SET status = 'refunded' WHERE stripe_session_id = ?`
              )
                .bind(matchedOrder.stripe_session_id)
                .run();
              if (!res?.meta?.changes && matchedOrder.user_id) {
                await env.DB.prepare(
                  `UPDATE enrollments SET status = 'refunded' WHERE user_id = ? AND course_id = 'kurs-glowny-happybirth'`
                )
                  .bind(matchedOrder.user_id)
                  .run();
              }
            } else if (matchedOrder.user_id) {
              await env.DB.prepare(
                `UPDATE enrollments SET status = 'refunded' WHERE user_id = ? AND course_id = 'kurs-glowny-happybirth'`
              )
                .bind(matchedOrder.user_id)
                .run();
            }
            await env.DB.prepare(
              `UPDATE affiliate_commissions
               SET status = CASE WHEN status != 'PAID' THEN 'CANCELLED' ELSE status END,
                   tier1_status = CASE WHEN tier1_status != 'PAID' THEN 'CANCELLED' ELSE tier1_status END,
                   tier2_status = CASE WHEN tier2_status != 'PAID' THEN 'CANCELLED' ELSE tier2_status END
               WHERE order_id = ?`
            )
              .bind(matchedOrder.id)
              .run();
          }
        }
      } catch (refundErr) {
        console.error('CRITICAL: Błąd aktualizacji statusu zwrotu w D1:', refundErr);
        return new Response(
          JSON.stringify({ error: 'Refund persistence failed; retry requested' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
