import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

/**
 * [F4] Hiper-Personalizacja E-mail oparta na Tygodniu Ciąży (Etapy I–IV)
 * Wylicza aktualny tydzień ciąży lub etap fizjologiczny i dobiera właściwy mikro-poradnik
 * z domknięciem sprzedaży kursu w cenie 489,00 zł (18 miesięcy dostępu od zakupu).
 */
function buildPregnancyStageEmail(params: {
  name: string;
  gestationalWeek: number | null;
  toolSource: 'plan-porodu' | 'kalkulator-wyprawki';
}) {
  const week = params.gestationalWeek || 20;

  let stageBadge = 'Etap II (Tydz. 14–27 · „Wreszcie lepiej”)';
  let stageHeadline = 'Twój mikro-poradnik z Modułu 3: Komfort, kręgosłup, bezpieczna aktywność i oddech';
  let stageBody =
    'W drugim trymestrze warto zadbać o odciążenie miednicy i kręgosłupa oraz spokojny sen. W Module 3 kursu HappyBirth nasze fizjoterapeutki pokazują krok po kroku bezpieczne ćwiczenia na macie i piłce.';

  if (week <= 13) {
    stageBadge = 'Etap I (Tydz. 1–13 · „Dwie kreski”)';
    stageHeadline = 'Twój mikro-poradnik z Modułów 1–2: Kalendarz badań, spokój i 18 miesięcy dostępu';
    stageBody =
      'Początek ciąży to czas wielu pytań i pierwszych badań. Dzięki temu, że dostęp w HappyBirth.pl trwa aż 18 miesięcy (548 dni) od momentu zakupu, kurs kupiony już w I trymestrze posłuży Wam przez wszystkie trzy trymestry, poród oraz cały pierwszy rok życia maluszka!';
  } else if (week >= 28 && week <= 41) {
    stageBadge = 'Etap III (Tydz. 28–poród · „Torba spakowana”)';
    stageHeadline = 'Twój mikro-poradnik z Modułów 4–5: Wyprawka bez przepłacania, torba do szpitala i aktywny poród';
    stageBody =
      'Zbliżacie się do spotkania z maluszkiem! W Modułach 4 i 5 położne ze szkoły Mama Gaja omawiają co naprawdę kupić na start, jak spakować torbę do szpitala dla mamy i dziecka oraz jak partner może wspierać Cię oddechem i masażem w trakcie porodu.';
  } else if (week > 41) {
    stageBadge = 'Etap IV (Po porodzie · „Pierwszy rok”)';
    stageHeadline = 'Twój mikro-poradnik z Modułów 6–8: Połóg, kąpiel krok po kroku, pierwsza pomoc i laktacja';
    stageBody =
      'Pierwsze tygodnie z noworodkiem wymagają spokoju i sprawdzonych instrukcji. W Modułach 6–8 znajdziecie praktyczny instruktaż kąpieli, pielęgnacji pępka, bezpiecznego snu, pierwszej pomocy oraz techniki przystawiania do piersi z doradczynią laktacyjną.';
  }

  const toolTitle =
    params.toolSource === 'kalkulator-wyprawki'
      ? 'Interaktywny Kalkulator Wyprawki i Torby do Szpitala PDF'
      : 'Generator Planu Porodu PDF (zgodny ze Standardem Opieki Okołoporodowej)';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 26px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #DA0271; font-weight: 700;">${stageBadge}</span>
      <h1 style="color: #1A1512; font-size: 22px; margin: 8px 0 12px 0;">Cześć ${params.name}! Twój dokument i wskazówki są gotowe</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #544A44;">
        Dziękujemy za skorzystanie z bezpłatnego narzędzia <strong>${toolTitle}</strong> na HappyBirth.pl.
      </p>
      <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 14px; padding: 18px; margin: 18px 0;">
        <h3 style="margin-top: 0; color: #250A24; font-size: 15px;">${stageHeadline}</h3>
        <p style="font-size: 13.5px; color: #544A44; line-height: 1.6; margin-bottom: 14px;">
          ${stageBody}
        </p>
        <div style="padding: 12px; background: #FAE3EB; border-radius: 10px; font-size: 13px; color: #541235;">
          <strong>Pełny kurs Szkoły Rodzenia Online HappyBirth.pl:</strong> 52 lekcje 4K w 8 modułach (288 min) z położnymi Mama Gaja, bezpłatny dostęp dla partnera i aż <strong>18 miesięcy dostępu od zakupu</strong> w jednorazowej cenie <strong>489,00 zł brutto</strong>.
        </div>
        <div style="text-align: center; margin-top: 18px;">
          <a href="https://happybirth.pl/#cena" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
            Dołącz do kursu · 489,00 zł (18 mies. dostępu) &rarr;
          </a>
        </div>
      </div>
      <p style="font-size: 11.5px; color: #867A72; text-align: center; margin-top: 24px;">
        KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · kontakt@happybirth.pl
      </p>
    </div>
  `;

  return {
    subject: `${stageBadge}: Twój ${params.toolSource === 'kalkulator-wyprawki' ? 'Kalkulator Wyprawki PDF' : 'Plan Porodu PDF'} i wskazówki położnej`,
    html,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      email,
      name,
      dueDate,
      gestationalWeek,
      rodoConsent = true,
      toolSource = 'plan-porodu',
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Proszę podać poprawny adres e-mail.' },
        { status: 400 }
      );
    }

    if (!rodoConsent) {
      return NextResponse.json(
        { error: 'Wymagana jest zgoda RODO na wygenerowanie i przesłanie materiałów edukacyjnych.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Przyszła Mamo';
    const cleanDueDate = typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null;

    // Wylicz tydzień ciąży na podstawie dueDate lub podanego gestationalWeek ([F4])
    let computedWeek: number | null = typeof gestationalWeek === 'number' ? gestationalWeek : null;
    if (!computedWeek && cleanDueDate) {
      const dueTime = new Date(cleanDueDate).getTime();
      if (!isNaN(dueTime)) {
        const daysUntilDue = Math.round((dueTime - Date.now()) / (24 * 60 * 60 * 1000));
        computedWeek = Math.max(1, Math.min(42, Math.round((280 - daysUntilDue) / 7)));
      }
    }

    let user = await d1First<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE email = ?',
      [cleanEmail]
    );

    let userId = user?.id;

    if (!userId) {
      userId = crypto.randomUUID();
      await d1Run(
        `INSERT INTO users (id, email, full_name, due_date, rodo_consent, marketing_consent, role)
         VALUES (?, ?, ?, ?, 1, 1, 'lead')`,
        [userId, cleanEmail, cleanName, cleanDueDate]
      );
    } else if (cleanDueDate) {
      await d1Run('UPDATE users SET due_date = COALESCE(due_date, ?) WHERE id = ?', [
        cleanDueDate,
        userId,
      ]);
    }

    if (process.env.RESEND_API_KEY) {
      const mail = buildPregnancyStageEmail({
        name: cleanName,
        gestationalWeek: computedWeek,
        toolSource: toolSource === 'kalkulator-wyprawki' ? 'kalkulator-wyprawki' : 'plan-porodu',
      });

      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'HappyBirth.pl <kontakt@happybirth.pl>',
          to: [cleanEmail],
          subject: mail.subject,
          html: mail.html,
        }),
      }).catch((mailErr) => console.error('Błąd wysyłki maila Lead Magnet:', mailErr));
    }

    return NextResponse.json({
      success: true,
      message: 'Narzędzie zostało odblokowane.',
      userId,
      computedWeek: computedWeek || 20,
    });
  } catch (error: any) {
    console.error('Błąd w endpointcie /api/leads:', error);
    return NextResponse.json(
      { error: error.message || 'Wystąpił błąd podczas rejestracji.' },
      { status: 500 }
    );
  }
}
