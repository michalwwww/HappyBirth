import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, courseId = 'kurs-glowny-happybirth' } = body;

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Brak skonfigurowanego NEXT_PUBLIC_STRIPE_PRICE_ID w zmiennych środowiskowych.' },
        { status: 500 }
      );
    }

    const sessionParams: any = {
      mode: 'payment',
      managed_payments: { enabled: false },
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        courseId,
        platform: 'HappyBirth',
      },
      locale: 'pl',
      success_url: `${origin}/strefa?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${origin}/#cena`,
    };

    if (email && typeof email === 'string' && email.includes('@')) {
      sessionParams.customer_email = email.trim();
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Błąd podczas tworzenia sesji Stripe Checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd przy inicjalizacji płatności.' },
      { status: 500 }
    );
  }
}
