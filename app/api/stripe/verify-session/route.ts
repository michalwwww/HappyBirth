import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';
import { ACCESS_DURATION_DAYS } from '@/lib/promo';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = (req.nextUrl.searchParams.get('session_id') || '').trim();

  if (!sessionId) {
    return NextResponse.json({ error: 'Brak session_id' }, { status: 400 });
  }

  // [A4] Blokada fałszywych identyfikatorów spoza Stripe (prawdziwe sesje Stripe Test i Live zaczynają się od cs_test_ lub cs_live_)
  const lowerId = sessionId.toLowerCase();
  if (lowerId === 'dev_local_100' && process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      success: true,
      paid: true,
      user: { email: 'kursantka-dev@happybirth.pl', role: 'student' },
      expiresInDays: ACCESS_DURATION_DAYS,
      message: 'Lokalna sesja deweloperska aktywna',
    });
  }

  if (
    lowerId === 'test' ||
    lowerId === 'test100' ||
    lowerId.startsWith('promo_') ||
    lowerId.startsWith('demo_') ||
    !sessionId.startsWith('cs_')
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Publiczne sesje bezpłatne są wyłączone. Wymagana jest opłacona sesja Stripe Checkout.',
      },
      { status: 403 }
    );
  }

  try {
    // Pobierz dane sesji bezpośrednio z oficjalnego API Stripe (obsługuje zarówno cs_test_ jak i cs_live_)
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Płatność nie została jeszcze oznaczona jako opłacona.' },
        { status: 402 }
      );
    }

    const customerEmail = (
      session.customer_details?.email ||
      session.customer_email ||
      session.client_reference_id ||
      ''
    )
      .trim()
      .toLowerCase();
    const customerName = session.customer_details?.name || 'Mama HappyBirth';
    const courseId = session.metadata?.courseId || 'kurs-glowny-happybirth';
    const isOnlyOrderBump = session.metadata?.only_order_bump === 'true';
    const orderBumpIncluded = session.metadata?.order_bump_included === 'true' || isOnlyOrderBump ? 1 : 0;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Brak adresu e-mail przypisanego do sesji Stripe.' },
        { status: 400 }
      );
    }

    // 1. Sprawdź lub utwórz użytkownika w Cloudflare D1
    let user = await d1First<{ id: string; email: string; role: string; referral_code?: string }>(
      'SELECT id, email, role, referral_code FROM users WHERE email = ?',
      [customerEmail]
    );

    let userId = user?.id;
    const refCode = user?.referral_code || `MAMA-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    if (!userId) {
      userId = crypto.randomUUID();
      await d1Run(
        'INSERT INTO users (id, email, full_name, referral_code, role) VALUES (?, ?, ?, ?, "student")',
        [userId, customerEmail, customerName, refCode]
      );
    } else {
      await d1Run('UPDATE users SET role = "student", referral_code = COALESCE(referral_code, ?) WHERE id = ?', [
        refCode,
        userId,
      ]);
    }

    // 2. [C1] Dodaj lub zaktualizuj 18-miesięczny (548 dni) dostęp w tabeli enrollments (NIGDY przy samym Order Bumpie!)
    const enrollmentId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;
    let hasActiveCourse = true;

    if (isOnlyOrderBump) {
      const activeEnr = await d1First<{ id: string }>(
        `SELECT id FROM enrollments WHERE user_id = ? AND status = 'active' LIMIT 1`,
        [userId]
      );
      hasActiveCourse = Boolean(activeEnr?.id);
      if (hasActiveCourse) {
        await d1Run(`UPDATE enrollments SET order_bump_included = 1 WHERE user_id = ? AND status = 'active'`, [
          userId,
        ]);
      }
    } else {
      await d1Run(
        `INSERT INTO enrollments (id, user_id, course_id, stripe_session_id, stripe_customer_id, status, order_bump_included, granted_at, expires_at)
         VALUES (?, ?, ?, ?, ?, 'active', ?, datetime('now'), ?)
         ON CONFLICT(stripe_session_id) DO UPDATE SET status = 'active', order_bump_included = excluded.order_bump_included, expires_at = excluded.expires_at`,
        [enrollmentId, userId, courseId, session.id, stripeCustomerId, orderBumpIncluded, expiresAt]
      );

      if (orderBumpIncluded) {
        await d1Run('UPDATE enrollments SET order_bump_included = 1 WHERE user_id = ?', [userId]);
      }
    }

    // 3. Utwórz kryptograficzne ciasteczko sesyjne HMAC
    const sessionToken = signSession({
      userId,
      email: customerEmail,
      role: 'student',
    });

    const response = NextResponse.json({
      success: true,
      paid: true,
      email: customerEmail,
      orderBumpIncluded: Boolean(orderBumpIncluded),
      expiresInDays: ACCESS_DURATION_DAYS,
      user: {
        id: userId,
        email: customerEmail,
        role: 'student',
        hasActiveCourse,
        orderBumpIncluded: Boolean(orderBumpIncluded),
      },
    });

    response.cookies.set('hb_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_DURATION_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Błąd podczas weryfikacji sesji Stripe:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd przy weryfikacji sesji.' },
      { status: 500 }
    );
  }
}
