import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import { d1First, d1Run } from '@/lib/d1';
import { ACCESS_DURATION_DAYS, ORDER_BUMP_PRICE_GROSZE } from '@/lib/promo';
import {
  CHECKBOX_2_ART38_WAIVER_TEXT,
  getTermsSha256Hash,
  buildDurableMediumConfirmationEmail,
} from '@/lib/legal-shield';
import { calculateTwoTierCommission, AffiliatePartnerRecord } from '@/lib/affiliate';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Brak podpisu stripe-signature lub STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Brak podpisu webhooka lub klucza sekretnego' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Błąd weryfikacji podpisu Stripe Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // ============================================================================
  // 1. OBSŁUGA UDANEJ PŁATNOŚCI (checkout.session.completed)
  // ============================================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = (session.customer_details?.email || session.client_reference_id || '').trim().toLowerCase();
    const customerName = session.customer_details?.name || 'Mama HappyBirth';
    const courseId = session.metadata?.courseId || 'kurs-glowny-happybirth';
    const orderBumpIncluded = session.metadata?.order_bump_included === 'true';
    const promoCode = (session.metadata?.promo_code || '').trim().toUpperCase();
    const refCookie = (session.metadata?.affiliate_ref_cookie || session.metadata?.ref || '').trim();
    const waiverTimestamp = session.metadata?.waiver_art38_timestamp || new Date().toISOString();
    const buyerIp = session.metadata?.buyer_ip || '0.0.0.0';
    const termsSha256 = session.metadata?.terms_sha256 || getTermsSha256Hash();
    const waiverCheckboxText = session.metadata?.waiver_checkbox_text || CHECKBOX_2_ART38_WAIVER_TEXT;
    const amountTotalGrosze = session.amount_total || 48900;

    console.log(`✅ [Stripe Webhook] Otrzymano płatność! Sesja: ${session.id}, Email: ${customerEmail}`);

    if (customerEmail) {
      try {
        // 1. Sprawdź lub utwórz konto kursantki wraz z indywidualnym kodem polecającym MAMA-XXXX ([C4])
        let user = await d1First<{ id: string; email: string; referral_code?: string }>(
          'SELECT id, email, referral_code FROM users WHERE email = ?',
          [customerEmail]
        );

        let userId = user?.id;
        const generatedReferralCode =
          user?.referral_code || `MAMA-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        if (!userId) {
          userId = crypto.randomUUID();
          await d1Run(
            'INSERT INTO users (id, email, full_name, role, referral_code) VALUES (?, ?, ?, ?, ?)',
            [userId, customerEmail, customerName, 'student', generatedReferralCode]
          );
          console.log(`👤 Utworzono konto kursantki w D1: ${customerEmail} (Kod polecający: ${generatedReferralCode})`);
        } else if (!user?.referral_code) {
          await d1Run('UPDATE users SET referral_code = ?, role = ? WHERE id = ?', [
            generatedReferralCode,
            'student',
            userId,
          ]);
        }

        // 2. [A5] + [C1] Nadaj dostęp na 18 miesięcy (548 dni od momentu zakupu)
        const enrollmentId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

        await d1Run(
          `INSERT INTO enrollments (id, user_id, course_id, stripe_session_id, stripe_customer_id, status, order_bump_included, granted_at, expires_at)
           VALUES (?, ?, ?, ?, ?, 'active', ?, datetime('now'), ?)
           ON CONFLICT(stripe_session_id) DO UPDATE SET status = 'active', expires_at = excluded.expires_at`,
          [enrollmentId, userId, courseId, session.id, stripeCustomerId, orderBumpIncluded ? 1 : 0, expiresAt]
        );

        // 3. [E1] Zapisz pełny rejestr dowodowy w tabeli orders (Art. 38 ust. 1 pkt 13 u.p.k. + SHA-256 regulaminu)
        const orderId = crypto.randomUUID();
        const orderNumber = `HB-${new Date().getFullYear()}-${session.id.slice(-6).toUpperCase()}`;

        await d1Run(
          `INSERT INTO orders (
             id, order_number, stripe_session_id, user_id, customer_email, customer_name,
             amount_total, currency, order_bump_included, promo_code,
             waiver_art38_accepted, waiver_art38_timestamp, buyer_ip,
             waiver_checkbox_text, terms_sha256, durable_medium_sent_at, status
           ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PLN', ?, ?, 1, ?, ?, ?, ?, datetime('now'), 'paid')
           ON CONFLICT(stripe_session_id) DO NOTHING`,
          [
            orderId,
            orderNumber,
            session.id,
            userId,
            customerEmail,
            customerName,
            amountTotalGrosze,
            orderBumpIncluded ? 1 : 0,
            promoCode || null,
            waiverTimestamp,
            buyerIp,
            waiverCheckboxText,
            termsSha256,
          ]
        );

        // 4. [C4] Obsługa Boksu Poleceń Koleżeńskich (Kod MAMA-XXXX) -> Natychmiastowe (0 dni) odblokowanie Prezentu PDF
        if (promoCode.startsWith('MAMA-')) {
          const referrerUser = await d1First<{ id: string; email: string }>(
            'SELECT id, email FROM users WHERE referral_code = ?',
            [promoCode]
          );
          if (referrerUser && referrerUser.email.toLowerCase() !== customerEmail) {
            await d1Run(
              `INSERT INTO student_referrals (id, referrer_user_id, referrer_code, referred_email, stripe_session_id, reward_unlocked, reward_slug)
               VALUES (?, ?, ?, ?, ?, 1, 'ebook-obiady-15min-pdf')
               ON CONFLICT(stripe_session_id) DO NOTHING`,
              [crypto.randomUUID(), referrerUser.id, promoCode, customerEmail, session.id]
            );
            console.log(`🎁 [C4 Prezent za Polecenie] Odblokowano natychmiast e-book z przepisami dla kodu: ${promoCode}`);
          }
        }

        // 5. [D1b] + [D2] + [D2a] Atrybucja Afiliacyjna 2-Tier Capped CPA (nadrzędność kodu nad ?ref=)
        if (!promoCode.startsWith('MAMA-') && (promoCode || refCookie)) {
          const partnerByPromo = promoCode
            ? await d1First<any>('SELECT * FROM affiliates WHERE promo_code = ? AND status = ?', [promoCode, 'active'])
            : null;
          const partnerByRef = refCookie
            ? await d1First<any>('SELECT * FROM affiliates WHERE ref_slug = ? AND status = ?', [refCookie, 'active'])
            : null;

          const mapPartner = (row: any): AffiliatePartnerRecord | null =>
            row
              ? {
                  id: row.id,
                  email: row.email,
                  fullName: row.full_name,
                  roleCategory: row.role_category,
                  promoCode: row.promo_code,
                  refSlug: row.ref_slug,
                  tier1Rate: Number(row.tier1_rate || 0.2),
                  referredByBrokerId: row.referred_by_broker_id,
                  tier2OverrideRate: Number(row.tier2_override_rate || 0.05),
                  status: row.status,
                }
              : null;

          const courseOnlyGrossGrosze = Math.max(
            0,
            amountTotalGrosze - (orderBumpIncluded ? ORDER_BUMP_PRICE_GROSZE : 0)
          );

          const comm = calculateTwoTierCommission({
            buyerEmail: customerEmail,
            paidCourseGrossGrosze: courseOnlyGrossGrosze,
            enteredPromoCode: promoCode,
            cookieRefSlug: refCookie,
            partnerByPromoCode: mapPartner(partnerByPromo),
            partnerByRefCookie: mapPartner(partnerByRef),
          });

          if (comm.allowed && comm.tier1PartnerId) {
            await d1Run(
              `INSERT INTO affiliate_commissions (
                 id, order_id, stripe_session_id, affiliate_id, broker_id,
                 attribution_source, paid_amount_gross, tier1_rate,
                 tier1_commission_gross, tier2_commission_gross, status
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
               ON CONFLICT(stripe_session_id) DO NOTHING`,
              [
                crypto.randomUUID(),
                orderId,
                session.id,
                comm.tier1PartnerId,
                comm.tier2BrokerId,
                comm.attributionSource,
                comm.paidAmountGrossGrosze,
                comm.tier1Rate,
                comm.tier1CommissionGrossGrosze,
                comm.tier2CommissionGrossGrosze,
              ]
            );
          }
        }

        // 6. Wygeneruj powitalny token dostępu (Magic Link)
        const welcomeToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await d1Run('INSERT INTO auth_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)', [
          welcomeToken,
          customerEmail,
          tokenExpires,
        ]);

        const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://happybirth.pl';
        const accessUrl = `${origin}/api/auth/verify?token=${welcomeToken}`;

        // 7. [E1] Wysyłka potwierdzenia zawarcia umowy na TRWAŁYM NOŚNIKU (Durable Medium Mailer)
        if (process.env.RESEND_API_KEY) {
          const emailPayload = buildDurableMediumConfirmationEmail({
            customerName,
            customerEmail,
            orderNumber,
            amountGrossGrosze: amountTotalGrosze,
            orderBumpIncluded,
            waiverTimestampIso: waiverTimestamp,
            termsSha256,
            accessUrl,
            expiresAtIso: expiresAt,
          });

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'HappyBirth.pl <kontakt@happybirth.pl>',
              to: [customerEmail],
              subject: emailPayload.subject,
              html: emailPayload.html,
            }),
          });
        }

        // 8. [E5] Server-Side Conversions API (Meta CAPI Dispatcher — zero danych medycznych/ciążowych)
        const metaPixelId = process.env.META_PIXEL_ID;
        const metaToken = process.env.META_CAPI_ACCESS_TOKEN;

        if (metaPixelId && metaToken) {
          try {
            const hashedEmail = crypto.createHash('sha256').update(customerEmail).digest('hex');
            const eventTime = Math.floor(Date.now() / 1000);
            const fbclid = session.metadata?.fbclid;
            const amountTotalPln = amountTotalGrosze / 100;

            const capiPayload = {
              data: [
                {
                  event_name: 'Purchase',
                  event_time: eventTime,
                  event_id: session.id,
                  event_source_url: `${origin}/`,
                  action_source: 'website',
                  user_data: {
                    em: [hashedEmail],
                    ...(fbclid ? { fbc: `fb.1.${eventTime}.${fbclid}` } : {}),
                  },
                  custom_data: {
                    currency: 'PLN',
                    value: amountTotalPln,
                    content_name: 'HappyBirth - Edukacyjny Kurs Online VOD (18 mies.)',
                    content_type: 'product',
                    content_ids: [courseId],
                  },
                },
              ],
            };

            await fetch(`https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(capiPayload),
            });
          } catch (capiErr) {
            console.error('⚠️ [Meta CAPI] Błąd wysyłki zdarzenia do Meta Graph API:', capiErr);
          }
        }
      } catch (dbError: any) {
        console.error('❌ Błąd zapisu do Cloudflare D1:', dbError);
      }
    }
  }

  // ============================================================================
  // 2. [A7] + [D2] OBSŁUGA ZWROTU ŚRODKÓW (charge.refunded)
  // ============================================================================
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const customerEmail = charge.billing_details?.email?.trim().toLowerCase();

    console.log(`🔄 [Stripe Webhook] Otrzymano zdarzenie charge.refunded (${charge.id}) dla: ${customerEmail}`);

    try {
      if (customerEmail) {
        const user = await d1First<{ id: string }>('SELECT id FROM users WHERE email = ?', [customerEmail]);
        if (user?.id) {
          await d1Run("UPDATE enrollments SET status = 'refunded' WHERE user_id = ?", [user.id]);
          await d1Run("UPDATE orders SET status = 'refunded' WHERE user_id = ?", [user.id]);
        }
      }
      // Anuluj prowizje afiliacyjne powiązane ze zwróconym zamówieniem
      await d1Run(
        `UPDATE affiliate_commissions SET status = 'CANCELLED'
         WHERE order_id IN (SELECT id FROM orders WHERE status = 'refunded')`
      );
    } catch (refundErr) {
      console.error('❌ Błąd aktualizacji statusu zwrotu w D1:', refundErr);
    }
  }

  return NextResponse.json({ received: true });
}
