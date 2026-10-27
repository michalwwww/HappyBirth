interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

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
          <strong>Pełny kurs Szkoły Rodzenia Online HappyBirth.pl:</strong> 52 lekcje 4K w 8 modułach (288 min) z położnymi Mama Gaja, bezpłatny dostęp dla partnera i aż <strong>18 miesięcy (548 dni) dostępu od zakupu</strong> w jednorazowej cenie <strong>489,00 zł brutto</strong>.
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

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const {
      email,
      name,
      dueDate,
      gestationalWeek,
      rodoConsent = true,
      toolSource = 'plan-porodu',
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Proszę podać poprawny adres e-mail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!rodoConsent) {
      return new Response(
        JSON.stringify({ error: 'Wymagana jest zgoda RODO na wygenerowanie i przesłanie materiałów edukacyjnych.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Przyszła Mamo';
    const cleanDueDate = typeof dueDate === 'string' && dueDate.trim() ? dueDate.trim() : null;
    const userId = crypto.randomUUID();

    let computedWeek: number | null = typeof gestationalWeek === 'number' ? gestationalWeek : null;
    if (!computedWeek && cleanDueDate) {
      const dueTime = new Date(cleanDueDate).getTime();
      if (!isNaN(dueTime)) {
        const daysUntilDue = Math.round((dueTime - Date.now()) / (24 * 60 * 60 * 1000));
        computedWeek = Math.max(1, Math.min(42, Math.round((280 - daysUntilDue) / 7)));
      }
    }

    if (env.DB) {
      try {
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(cleanEmail).first();
        if (!existing) {
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, due_date, role) VALUES (?, ?, ?, ?, 'lead')`
          ).bind(userId, cleanEmail, cleanName, cleanDueDate).run();
        } else if (cleanDueDate) {
          await env.DB.prepare('UPDATE users SET due_date = COALESCE(due_date, ?) WHERE id = ?')
            .bind(cleanDueDate, existing.id).run();
        }
      } catch (dbErr) {
        console.error('Błąd zapisu w D1:', dbErr);
      }
    }

    const emailContent = buildPregnancyStageEmail({
      name: cleanName,
      gestationalWeek: computedWeek,
      toolSource: toolSource === 'kalkulator-wyprawki' ? 'kalkulator-wyprawki' : 'plan-porodu',
    });

    if (env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>',
            to: [cleanEmail],
            subject: emailContent.subject,
            html: emailContent.html,
          }),
        });
      } catch (mailErr) {
        console.error('Błąd wysyłki maila Resend w Functions:', mailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        computedWeek,
        toolSource,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Błąd rejestracji leada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
