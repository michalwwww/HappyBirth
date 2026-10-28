interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const orderNumber = String(body.orderNumber || '').trim();
    const scope = body.scope === 'order_bump_only' ? 'order_bump_only' : 'full_order';
    const reason = String(body.reason || '').trim() || null;

    if (!fullName || !email || !email.includes('@') || !orderNumber) {
      return new Response(
        JSON.stringify({
          error: 'Proszę wypełnić imię i nazwisko, adres e-mail użyty przy zakupie oraz numer zamówienia.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isOrderBumpOnly = scope === 'order_bump_only';
    const nowIso = new Date().toISOString();
    let orderId: string | null = null;
    let contentAccessed = true;

    if (env.DB) {
      try {
        const orderRow = await env.DB.prepare(
          `SELECT id, first_content_accessed_at, waiver_art38_accepted
           FROM orders
           WHERE order_number = ? OR customer_email = ?
           ORDER BY created_at DESC LIMIT 1`
        )
          .bind(orderNumber, email)
          .first();

        if (orderRow) {
          orderId = orderRow.id;
          contentAccessed = Boolean(orderRow.first_content_accessed_at || orderRow.waiver_art38_accepted);
        }
      } catch {
        // Fallback
      }
    }

    const autoRejected = !isOrderBumpOnly && contentAccessed;
    const decisionStatus = isOrderBumpOnly
      ? 'approved_for_refund'
      : autoRejected
      ? 'auto_rejected_art38'
      : 'approved_for_refund';

    const message = isOrderBumpOnly
      ? 'Przyjęliśmy Twoje oświadczenie o częściowym odstąpieniu od umowy w zakresie pakietu dodatkowego (Order Bump +49,00 zł). Zwrot kwoty 49,00 zł zostanie przekazany w terminie do 14 dni, a dostęp do kursu głównego pozostaje aktywny.'
      : autoRejected
      ? 'Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Ponieważ przed zakupem wyrażono zgodę na natychmiastowe dostarczenie treści cyfrowych przed upływem 14 dni i rozpoczęto korzystanie z kursu, prawo do odstąpienia od umowy wygasło na mocy art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.'
      : 'Potwierdzamy wpływ Twojego oświadczenia o odstąpieniu od umowy. Ponieważ kurs nie został jeszcze uruchomiony, zwrot środków nastąpi w terminie do 14 dni.';

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO withdrawal_requests (
             id, order_id, full_name, email, order_number, scope, reason,
             status, auto_rejected_due_to_art38, decision_explanation, confirmation_email_sent_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(
            crypto.randomUUID(),
            orderId,
            fullName,
            email,
            orderNumber,
            scope,
            reason,
            decisionStatus,
            autoRejected ? 1 : 0,
            message
          )
          .run();
      } catch (e) {
        console.error('Błąd zapisu withdrawal_requests w D1:', e);
      }
    }

    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || 'Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>',
          to: [email],
          subject: `Potwierdzenie złożenia oświadczenia o odstąpieniu od umowy (${orderNumber})`,
          html: `
            <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1A1512; background: #FBF8F4; border: 1px solid #EAE3DB; border-radius: 16px;">
              <h2 style="margin-top: 0; color: #20071E;">Potwierdzenie otrzymania oświadczenia (Trwały Nośnik)</h2>
              <p style="font-size: 13.5px; color: #544A44;"><strong>Imię i nazwisko:</strong> ${fullName}<br/><strong>Zamówienie:</strong> ${orderNumber}<br/><strong>Data i godzina złożenia:</strong> ${nowIso}</p>
              <div style="background: #ffffff; border: 1px solid #EAE3DB; border-radius: 12px; padding: 14px; font-size: 13px; color: #1A1512; line-height: 1.6;">
                ${message}
              </div>
              <p style="font-size: 11px; color: #867A72; margin-top: 18px;">KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań · KRS: 0001268396 · NIP: 7812118273</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: nowIso,
        status: decisionStatus,
        auto_rejected_due_to_art38: autoRejected,
        message,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(JSON.stringify({ error: 'Błąd przetwarzania formularza.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
