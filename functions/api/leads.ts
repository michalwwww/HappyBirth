import {
  buildEdgeCorsHeaders,
  checkRateLimitD1,
  escapeHtml,
  extractClientIp,
  signUnsubscribeToken,
} from '../_shared/session';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  SESSION_SECRET?: string;
  AUTH_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

interface CrmSequenceEmail {
  step: 1 | 2 | 3 | 4;
  subject: string;
  html: string;
  scheduledAt?: string;
}

async function ensureLeadsSchema(db: any): Promise<void> {
  if (!db) return;
  try {
    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          first_name TEXT,
          due_date TEXT,
          pregnancy_week INTEGER,
          hospital_city TEXT,
          source TEXT DEFAULT 'plan_porodu',
          rodo_consent INTEGER DEFAULT 1,
          marketing_consent INTEGER DEFAULT 0,
          ip_address TEXT,
          unsubscribed_at TEXT,
          resend_scheduled_ids TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
    await db.prepare('ALTER TABLE leads ADD COLUMN ip_address TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE leads ADD COLUMN unsubscribed_at TEXT').run().catch(() => {});
    await db.prepare('ALTER TABLE leads ADD COLUMN resend_scheduled_ids TEXT').run().catch(() => {});
  } catch {
    // Ignoruj jeśli tabela ma już docelową strukturę
  }
}

function buildEmailFooter(unsubscribeUrl: string): string {
  return `
    <p style="font-size: 11.5px; color: #867A72; text-align: center; margin-top: 24px; line-height: 1.5;">
      KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273 · REGON: 545782779<br/>
      Otrzymujesz tę wiadomość, ponieważ pobrałaś materiały edukacyjne na HappyBirth.pl.<br/>
      <a href="${unsubscribeUrl}" style="color: #867A72; text-decoration: underline;">Wypisz się jednym kliknięciem</a> · <a href="https://happybirth.pl/polityka-prywatnosci" style="color: #867A72; text-decoration: underline;">Polityka prywatności RODO</a>
    </p>
  `;
}

function buildFourEmailCrmSequence(params: {
  name: string;
  gestationalWeek: number | null;
  toolSource: 'plan-porodu' | 'kalkulator-wyprawki';
  unsubscribeUrl: string;
  nowMs?: number;
}): CrmSequenceEmail[] {
  const safeName = escapeHtml(params.name || 'Przyszła Mamo');
  const week = params.gestationalWeek || 20;
  const baseTime = params.nowMs ?? Date.now();

  let stageBadge = 'Poradnik Położnych Mama Gaja · Część 1 z 4';
  let stageHeadline = 'Twój mikro-poradnik: Komfort, bezpieczna wyprawka i świadomy poród';
  let stageBody =
    'W kursie HappyBirth nasze położne, fizjoterapeutki uroginekologiczne i doradczynie laktacyjne prowadzą Cię krok po kroku przez każdy trymestr, poród oraz pierwszy rok życia maluszka.';

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
      : 'Generator Planu Porodu PDF (zgodny ze Standardem Opieki Okołoporodowej 2026)';

  const mail1Html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 26px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #DA0271; font-weight: 700;">${stageBadge}</span>
      <h1 style="color: #1A1512; font-size: 22px; margin: 8px 0 12px 0;">Cześć ${safeName}! Twój dokument i wskazówki są gotowe</h1>
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
      ${buildEmailFooter(params.unsubscribeUrl)}
    </div>
  `;

  const mail2Html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 26px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #DA0271; font-weight: 700;">Poradnik Położnej · Część 2 z 4</span>
      <h1 style="color: #1A1512; font-size: 21px; margin: 8px 0 12px 0;">${safeName}, poznaj swoje 21 praw na porodówce (Nowy Standard MZ 2026)</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #544A44;">
        Od 7 maja 2026 r. w każdym szpitalu w Polsce wchodzi w życie nowy <strong>Standard Organizacyjny Opieki Okołoporodowej Ministra Zdrowia (Dz.U. 2025 poz. 1525)</strong>. Przygotowaliśmy dla Ciebie podsumowanie 3 zmian, o których warto wiedzieć przed porodem:
      </p>
      <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 14px; padding: 18px; margin: 18px 0; font-size: 13.5px; color: #544A44; line-height: 1.6;">
        <p style="margin-top: 0;"><strong>1. Gwarantowane 2 godziny kontaktu „skóra do skóry”:</strong> Nowe rozporządzenie wykreśla nieostre słowo „około” — masz pełne prawo do nieprzerwanego, 120-minutowego kontaktu z maluszkiem od razu po narodzinach.</p>
        <p><strong>2. Lekki posiłek w trakcie porodu:</strong> Koniec rutynowego zakazu jedzenia. Personel nie może zabronić Ci lekkostrawnych przekąsek w I fazie fizjologicznego porodu.</p>
        <p style="margin-bottom: 0;"><strong>3. Rola osoby towarzyszącej:</strong> W Lekcjach 26 i 31 pokazujemy dokładnie, jak partner może odciążyć Twój kręgosłup masażem kości krzyżowej i chustą Rebozo oraz zadbać o Twój Plan Porodu.</p>
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://happybirth.pl/dla-ciebie" style="background: #250A24; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
          Sprawdź wszystkie 21 praw w bazie /dla-ciebie &rarr;
        </a>
      </div>
      ${buildEmailFooter(params.unsubscribeUrl)}
    </div>
  `;

  const mail3Html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 26px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #DA0271; font-weight: 700;">Poradnik Położnej · Część 3 z 4</span>
      <h1 style="color: #1A1512; font-size: 21px; margin: 8px 0 12px 0;">Pierwsze 72 godziny w domu z noworodkiem — bez stresu o 3:00 w nocy</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #544A44;">
        Większość szkół rodzenia kończy się na porodzie, a prawdziwe pytania zaczynają się pierwszą nocą w domu. Właśnie dlatego w HappyBirth.pl dajemy Wam aż <strong>18 miesięcy (548 dni) dostępu od zakupu</strong>:
      </p>
      <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 14px; padding: 18px; margin: 18px 0; font-size: 13.5px; color: #544A44; line-height: 1.6;">
        <p style="margin-top: 0;"><strong>• Spokojny start laktacji (Lekcje 49–50):</strong> Asymetryczny chwyt brodawki, wygodna pozycja spod pachy po cięciu cesarskim i spokojne postępowanie w nawale pokarmowym w 3.–4. dobie.</p>
        <p><strong>• Pierwsza kąpiel krok po kroku (Lekcja 44):</strong> Temperatura 37°C, pewny chwyt na przedramieniu i sucha pielęgnacja pępka bez alkoholu.</p>
        <p style="margin-bottom: 0;"><strong>• Pierwsza pomoc i bezpieczny sen (Lekcje 42–43):</strong> Praktyczny instruktaż na fantomie i zasady spokojnej nocy dla obojga rodziców.</p>
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://happybirth.pl/program" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
          Zobacz pełny program 52 lekcji wideo &rarr;
        </a>
      </div>
      ${buildEmailFooter(params.unsubscribeUrl)}
    </div>
  `;

  const mail4Html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 26px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #DA0271; font-weight: 700;">Poradnik Położnej · Część 4 z 4</span>
      <h1 style="color: #1A1512; font-size: 21px; margin: 8px 0 12px 0;">${safeName}, przygotujcie się do narodzin we własnym tempie (18 miesięcy dostępu)</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #544A44;">
        Niezależnie od tego, na którym etapie ciąży jesteś dzisiaj, cały zespół położnych, fizjoterapeutek uroginekologicznych i doradczyń laktacyjnych ze szkoły <strong>Mama Gaja (od 2012 r.)</strong> jest gotowy towarzyszyć Wam przez kolejne 548 dni.
      </p>
      <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 14px; padding: 18px; margin: 18px 0; font-size: 13.5px; color: #544A44; line-height: 1.6;">
        <p style="margin-top: 0;"><strong>Co otrzymujecie od razu po dołączeniu?</strong></p>
        <ul style="padding-left: 18px; margin: 8px 0;">
          <li>Wszystkie <strong>52 praktyczne lekcje wideo 4K</strong> (8 modułów od ciąży przez poród naturalny i CC aż po 1. rok życia dziecka).</li>
          <li><strong>Dostęp dla dwojga na 18 miesięcy (548 dni)</strong> — oglądacie na telefonie, laptopie lub TV bez dojazdów.</li>
          <li><strong>Cyfrową Apteczkę SOS, Licznik Skurczów 5-1-1 i Strefę dla Taty</strong> oraz imienne Zaświadczenie ukończenia edukacji przedporodowej.</li>
        </ul>
        <div style="padding: 12px; background: #FAE3EB; border-radius: 10px; font-size: 13px; color: #541235; margin-top: 12px;">
          Jednorazowa inwestycja: <strong>489,00 zł brutto</strong> (możliwość płatności BLIK, Przelewy24, kartą lub Apple/Google Pay).
        </div>
      </div>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://happybirth.pl/#cena" style="background: #DA0271; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
          Odbierz 18 miesięcy dostępu do kursu (489,00 zł) &rarr;
        </a>
      </div>
      ${buildEmailFooter(params.unsubscribeUrl)}
    </div>
  `;

  return [
    {
      step: 1,
      subject: `${stageBadge}: Twój ${params.toolSource === 'kalkulator-wyprawki' ? 'Kalkulator Wyprawki PDF' : 'Plan Porodu PDF'} i wskazówki położnej`,
      html: mail1Html,
    },
    {
      step: 2,
      subject: `${params.name}, Twoje 21 praw na porodówce od 7 maja 2026 r. (Dz.U. 2025 poz. 1525)`,
      html: mail2Html,
      scheduledAt: new Date(baseTime + 48 * 3600 * 1000).toISOString(),
    },
    {
      step: 3,
      subject: 'Pierwsze 72 godziny w domu z noworodkiem — kąpiel 37°C, laktacja i spokój w nocy',
      html: mail3Html,
      scheduledAt: new Date(baseTime + 96 * 3600 * 1000).toISOString(),
    },
    {
      step: 4,
      subject: `${params.name}, spokojny plan na poród i pierwszy rok z maluszkiem (52 lekcje 4K)`,
      html: mail4Html,
      scheduledAt: new Date(baseTime + 168 * 3600 * 1000).toISOString(),
    },
  ];
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: buildEdgeCorsHeaders(context.request, 'POST, OPTIONS'),
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const corsHeaders = buildEdgeCorsHeaders(context.request, 'POST, OPTIONS');
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const {
      email,
      name,
      rodoConsent = false,
      toolSource = 'plan-porodu',
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Proszę podać poprawny adres e-mail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (rodoConsent !== true) {
      return new Response(
        JSON.stringify({ error: 'Wymagana jest wyraźna zgoda RODO na wygenerowanie i przesłanie materiałów edukacyjnych.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : 'Przyszła Mamo';
    const ipAddress = extractClientIp(request);

    const allowed = await checkRateLimitD1(env.DB, `leads:${ipAddress}`, 10, 15);
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Zbyt wiele zgłoszeń z jednego adresu w krótkim czasie. Spróbuj ponownie za kilkanaście minut.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const userId = crypto.randomUUID();
    let shouldScheduleCrmSequence = true;
    let leadRowId: number | null = null;

    if (env.DB) {
      await ensureLeadsSchema(env.DB);
      try {
        const existingEnrollment = await env.DB.prepare(
          `SELECT e.id FROM enrollments e
           JOIN users u ON u.id = e.user_id
           WHERE LOWER(u.email) = ? AND e.status = 'active' LIMIT 1`
        )
          .bind(cleanEmail)
          .first()
          .catch(() => null);
        const existingPaidOrder = await env.DB.prepare(
          `SELECT id FROM orders WHERE LOWER(customer_email) = ? AND status = 'paid' LIMIT 1`
        )
          .bind(cleanEmail)
          .first()
          .catch(() => null);
        const existingLead = await env.DB.prepare(
          `SELECT id, unsubscribed_at FROM leads WHERE LOWER(email) = ? ORDER BY id DESC LIMIT 1`
        )
          .bind(cleanEmail)
          .first()
          .catch(() => null);

        if (existingEnrollment?.id || existingPaidOrder?.id || existingLead?.id) {
          shouldScheduleCrmSequence = false;
        }

        const insertRes = await env.DB.prepare(
          `INSERT INTO leads (email, first_name, source, rodo_consent, marketing_consent, ip_address, resend_scheduled_ids)
           VALUES (?, ?, ?, 1, ?, ?, '[]')`
        )
          .bind(
            cleanEmail,
            cleanName,
            toolSource === 'kalkulator-wyprawki' ? 'kalkulator_wyprawki' : 'plan_porodu_pdf',
            existingLead?.unsubscribed_at ? 0 : 1,
            ipAddress
          )
          .run();
        if (insertRes?.meta?.last_row_id) {
          leadRowId = Number(insertRes.meta.last_row_id);
        }

        const existingUser = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1')
          .bind(cleanEmail)
          .first();
        if (!existingUser) {
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, rodo_consent, marketing_consent, role)
             VALUES (?, ?, ?, 1, ?, 'lead')`
          )
            .bind(userId, cleanEmail, cleanName, existingLead?.unsubscribed_at ? 0 : 1)
            .run();
        } else {
          shouldScheduleCrmSequence = false;
        }
      } catch (dbErr) {
        console.error('Błąd zapisu leada w D1:', dbErr);
      }
    }

    const sig = await signUnsubscribeToken(cleanEmail, env, request);
    const unsubscribeUrl = `https://happybirth.pl/api/unsubscribe?email=${encodeURIComponent(cleanEmail)}&sig=${sig}`;

    const sequence = buildFourEmailCrmSequence({
      name: cleanName,
      gestationalWeek: null,
      toolSource: toolSource === 'kalkulator-wyprawki' ? 'kalkulator-wyprawki' : 'plan-porodu',
      unsubscribeUrl,
    });

    const emailsToSchedule = shouldScheduleCrmSequence ? sequence : [sequence[0]];
    const scheduledIds: string[] = [];

    if (env.RESEND_API_KEY) {
      const fromAddress = env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>';
      const sendResults = await Promise.allSettled(
        emailsToSchedule.map(async (item) => {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [cleanEmail],
              subject: item.subject,
              html: item.html,
              ...(item.scheduledAt ? { scheduled_at: item.scheduledAt } : {}),
              headers: {
                'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:kontakt@happybirth.pl?subject=unsubscribe>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              },
            }),
          });
          const data: any = await res.json().catch(() => null);
          if (item.scheduledAt && data?.id) {
            scheduledIds.push(String(data.id));
          }
        })
      );
      void sendResults;

      if (env.DB && scheduledIds.length > 0 && leadRowId) {
        await env.DB.prepare('UPDATE leads SET resend_scheduled_ids = ? WHERE id = ?')
          .bind(JSON.stringify(scheduledIds), leadRowId)
          .run()
          .catch(() => {});
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        toolSource,
        scheduledSteps: emailsToSchedule.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Błąd rejestracji leada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
