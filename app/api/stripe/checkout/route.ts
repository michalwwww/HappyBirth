import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, courseId = 'kurs-glowny-happybirth' } = body;

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    // Sprawdź czy klucz Stripe API jest zdefiniowany
    if (!process.env.STRIPE_SECRET_KEY) {
      // W trybie deweloperskim bez kluczy Stripe przekieruj do symulacji sukcesu
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          url: `${origin}/strefa?payment=success&demo=true`,
          sessionId: 'demo_session_123',
        });
      }
      return NextResponse.json(
        { error: 'Brak skonfigurowanego STRIPE_SECRET_KEY w środowisku serwera.' },
        { status: 500 }
      );
    }

    // Dynamiczny dobór pozycji: jeśli brak zdefiniowanego price_id, generujemy pozycję dynamicznie (349 zł brutto)
    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Edukacyjny Kurs Online HappyBirth (52 Lekcje VOD dla Dwojga)',
              description: 'Dostęp edukacyjny e-learning na 12 miesięcy dla dwojga: 52 lekcje wideo, Notatnik Rodzica PDF i Strefa dla Taty.',
            },
            unit_amount: 34900, // 349.00 PLN
          },
          quantity: 1,
        };

    const sessionParams: any = {
      mode: 'payment',
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [lineItem],
      allow_promotion_codes: true,
      metadata: {
        courseId,
        platform: 'HappyBirth',
        category: 'Education / E-learning Course',
        mcc: '8299',
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
      { error: error.message || 'Wystąpił błąd przy inicjalizacji płatności Stripe.' },
      { status: 500 }
    );
  }
}
