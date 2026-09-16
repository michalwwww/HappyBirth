import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import { d1First, d1Run } from '@/lib/d1';
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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`❌ Błąd weryfikacji podpisu Stripe Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Obsługa zdarzenia udanej płatności
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = (session.customer_details?.email || session.customer_email || '').trim().toLowerCase();
    const customerName = session.customer_details?.name || 'Kursantka HappyBirth';
    const courseId = session.metadata?.courseId || 'kurs-glowny-happybirth';

    console.log(`✅ [Stripe Webhook] Otrzymano płatność! Sesja: ${session.id}, Email: ${customerEmail}`);

    if (customerEmail) {
      try {
        // 1. Sprawdź, czy użytkownik istnieje w bazie Cloudflare D1
        let user = await d1First<{ id: string; email: string }>(
          'SELECT id, email FROM users WHERE email = ?',
          [customerEmail]
        );

        let userId = user?.id;

        // 2. Jeśli nie istnieje – utwórz konto kursantki w D1
        if (!userId) {
          userId = crypto.randomUUID();
          await d1Run(
            'INSERT INTO users (id, email, full_name, role) VALUES (?, ?, ?, ?)',
            [userId, customerEmail, customerName, 'student']
          );
          console.log(`👤 Utworzono nowego użytkownika w Cloudflare D1: ${customerEmail} (ID: ${userId})`);
        }

        // 3. Nadaj dostęp do kursu w tabeli enrollments (12 miesięcy ważności)
        const enrollmentId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

        await d1Run(
          `INSERT INTO enrollments (id, user_id, course_id, stripe_session_id, stripe_customer_id, status, granted_at, expires_at)
           VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), ?)
           ON CONFLICT(stripe_session_id) DO UPDATE SET status = 'active'`,
          [enrollmentId, userId, courseId, session.id, stripeCustomerId, expiresAt]
        );

        console.log(`🎉 [Cloudflare D1] Pomyślnie nadano 12-miesięczny dostęp do kursu dla: ${customerEmail}`);

        // 4. Wygeneruj powitalny token dostępu (Magic Link)
        const welcomeToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dni

        await d1Run(
          'INSERT INTO auth_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)',
          [welcomeToken, customerEmail, tokenExpires]
        );

        const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://strefa.happybirth.pl';
        const accessUrl = `${origin}/api/auth/verify?token=${welcomeToken}`;

        console.log(`💌 Link powitalny z bezpośrednim wejściem do strefy: ${accessUrl}`);

        // 5. Jeśli skonfigurowany jest Resend, wyślij natychmiastowe powitanie z linkiem
        if (process.env.RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'HappyBirth <kontakt@happybirth.pl>',
              to: [customerEmail],
              subject: 'Gratulacje! Twój dostęp do Szkoły Rodzenia HappyBirth jest aktywny',
              html: `
                <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #1A1512;">
                  <h1 style="color: #EC008C; font-size: 24px;">Wspaniale, że jesteś z nami!</h1>
                  <p>Dziękujemy za dołączenie do kompleksowego kursu Szkoły Rodzenia <strong>HappyBirth</strong>.</p>
                  <p>Twój 12-miesięczny dostęp dla Ciebie i Twojego partnera jest już aktywny.</p>
                  <div style="margin: 32px 0;">
                    <a href="${accessUrl}" style="background-color: #EC008C; color: white; padding: 16px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block; font-size: 16px;">
                      Wejdź do Strefy Kursantki &rarr;
                    </a>
                  </div>
                  <p style="font-size: 13px; color: #777;">Możesz wracać do materiałów w każdej chwili z dowolnego urządzenia.</p>
                </div>
              `,
            }),
          });
        }
      } catch (dbError: any) {
        console.error('❌ Błąd zapisu do Cloudflare D1:', dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
