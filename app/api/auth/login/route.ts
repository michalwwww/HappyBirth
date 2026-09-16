import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Sprawdź, czy użytkownik ma konto lub wykupiony dostęp w Cloudflare D1
    const user = await d1First<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE email = ?',
      [cleanEmail]
    );

    // 2. Wygeneruj jednorazowy token logowania (Magic Link)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minut

    await d1Run(
      'INSERT INTO auth_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)',
      [token, cleanEmail, expiresAt]
    );

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicLinkUrl = `${origin}/api/auth/verify?token=${token}`;

    console.log(`🔑 [Magic Link] Wygenerowano link logowania dla ${cleanEmail}: ${magicLinkUrl}`);

    // 3. Jeśli podpięty jest RESEND_API_KEY, wyślij prawdziwy e-mail
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'HappyBirth <kontakt@happybirth.pl>',
            to: [cleanEmail],
            subject: 'Twój link do logowania w HappyBirth',
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #EC008C;">Witaj w Strefie Kursantki HappyBirth!</h2>
                <p>Kliknij poniższy przycisk, aby bezpiecznie zalogować się do swoich materiałów:</p>
                <div style="margin: 30px 0;">
                  <a href="${magicLinkUrl}" style="background-color: #EC008C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">
                    Przejdź do kursu &rarr;
                  </a>
                </div>
                <p style="color: #777; font-size: 12px;">Link jest ważny przez 15 minut. Jeśli to nie Ty próbowałaś się zalogować, zignoruj tę wiadomość.</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Błąd wysyłki e-maila przez Resend:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Link logowania został wysłany.',
      // W środowisku dev zwracamy magic link do natychmiastowego testowania
      devMagicLink: process.env.NODE_ENV !== 'production' ? magicLinkUrl : undefined,
    });
  } catch (error: any) {
    console.error('Błąd logowania:', error);
    return NextResponse.json({ error: 'Wystąpił błąd serwera.' }, { status: 500 });
  }
}
