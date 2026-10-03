import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, dueDate, utm = {} } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Proszę podać poprawny adres e-mail.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Przyszła Mamo';
    const cleanDueDate = typeof dueDate === 'string' ? dueDate.trim() : null;

    // 1. Zapisz lub zaktualizuj w tabeli users w Cloudflare D1
    let user = await d1First<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE email = ?',
      [cleanEmail]
    );

    let userId = user?.id;

    if (!userId) {
      userId = crypto.randomUUID();
      await d1Run(
        `INSERT INTO users (id, email, full_name, due_date, role)
         VALUES (?, ?, ?, ?, 'lead')`,
        [userId, cleanEmail, cleanName, cleanDueDate]
      );
      console.log(`📥 [Lead Magnet] Zapisano nowego leada w D1: ${cleanEmail} (Termin: ${cleanDueDate})`);
    } else {
      if (cleanDueDate) {
        await d1Run(
          'UPDATE users SET due_date = COALESCE(due_date, ?) WHERE id = ?',
          [cleanDueDate, userId]
        );
      }
    }

    // 2. Opcjonalna wysyłka powitalnego e-maila przez Resend z materiałami PDF i darmową lekcją
    if (process.env.RESEND_API_KEY) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://happybirth.pl';
      const sampleLessonUrl = `${appUrl}/#zwiastun`;

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'HappyBirth <kontakt@happybirth.pl>',
          to: [cleanEmail],
          subject: 'Twój bezpłatny Plan Porodu PDF i próbka lekcji HappyBirth',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border-radius: 16px;">
              <h1 style="color: #EC008C; font-size: 24px; margin-bottom: 12px;">Cześć ${cleanName}!</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #544A44;">
                Dziękujemy za wygenerowanie Planu Porodu z HappyBirth. Zgodnie z polskim Standardem Organizacyjnym Opieki Okołoporodowej masz pełne prawo przedstawić swoje świadome oczekiwania personelowi medycznemu w szpitalu.
              </p>
              <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #250A24; font-size: 16px;">Co przygotowaliśmy dla Was?</h3>
                <ul style="font-size: 14px; color: #544A44; line-height: 1.6; padding-left: 20px;">
                  <li><strong>Szablon Planu Porodu</strong> do wpięcia w kartę ciąży.</li>
                  <li><strong>Bezpłatna lekcja wideo 4K:</strong> Pierwsza wizyta i USG w ciąży.</li>
                  <li><strong>Wskazówki dla partnera:</strong> Jak wspierać oddechem i masażem krzyżowym.</li>
                </ul>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${sampleLessonUrl}" style="background: #EC008C; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
                    Zobacz bezpłatną lekcję demonstracyjną
                  </a>
                </div>
              </div>
              <p style="font-size: 12px; color: #867A72; text-align: center; margin-top: 30px;">
                HappyBirth · Czuła szkoła rodzenia online dla dwojga · kontakt@happybirth.pl
              </p>
            </div>
          `,
        }),
      }).catch((mailErr) => console.error('Błąd wysyłki powitalnego maila leada:', mailErr));
    }

    return NextResponse.json({
      success: true,
      message: 'Plan porodu został pomyślnie wygenerowany i zapisany.',
      userId,
    });
  } catch (error: any) {
    console.error('Błąd w endpointcie /api/leads:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd podczas rejestracji leada.' },
      { status: 500 }
    );
  }
}
