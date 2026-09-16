import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import { d1First, d1Run } from '@/lib/d1';
import { signSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Brak session_id' }, { status: 400 });
  }

  try {
    // Pobierz dane sesji bezpośrednio z oficjalnego API Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Płatność nie została jeszcze oznaczona jako opłacona.' },
        { status: 400 }
      );
    }

    const customerEmail = (
      session.customer_details?.email ||
      session.customer_email ||
      ''
    )
      .trim()
      .toLowerCase();
    const customerName = session.customer_details?.name || 'Kursantka HappyBirth';
    const courseId = session.metadata?.courseId || 'kurs-glowny-happybirth';

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Brak adresu e-mail przypisanego do sesji Stripe.' },
        { status: 400 }
      );
    }

    // 1. Sprawdź lub utwórz użytkownika w Cloudflare D1
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE email = ?',
      [customerEmail]
    );

    let userId = user?.id;

    if (!userId) {
      userId = crypto.randomUUID();
      await d1Run(
        'INSERT INTO users (id, email, full_name, role) VALUES (?, ?, ?, "student")',
        [userId, customerEmail, customerName]
      );
    } else {
      await d1Run('UPDATE users SET role = "student" WHERE id = ?', [userId]);
    }

    // 2. Dodaj lub zaktualizuj 12-miesięczny dostęp w tabeli enrollments
    const enrollmentId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

    await d1Run(
      `INSERT INTO enrollments (id, user_id, course_id, stripe_session_id, stripe_customer_id, status, granted_at, expires_at)
       VALUES (?, ?, ?, ?, ?, 'active', datetime('now'), ?)
       ON CONFLICT(stripe_session_id) DO UPDATE SET status = 'active'`,
      [enrollmentId, userId, courseId, session.id, stripeCustomerId, expiresAt]
    );

    // 3. Utwórz kryptograficzne ciasteczko sesyjne HMAC
    const sessionToken = signSession({
      userId,
      email: customerEmail,
      role: 'student',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: customerEmail,
        role: 'student',
        hasActiveCourse: true,
      },
    });

    response.cookies.set('hb_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
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
