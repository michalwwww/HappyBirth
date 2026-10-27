export async function onRequestPost(context: { request: Request }): Promise<Response> {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const { fullName, email, orderNumber, scope = 'full_order' } = body;

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

    const message = isOrderBumpOnly
      ? 'Przyjęliśmy Twoje oświadczenie o częściowym odstąpieniu od umowy w zakresie pakietu dodatkowego (Order Bump +49,00 zł). Zwrot kwoty 49,00 zł zostanie przekazany w terminie do 14 dni, a dostęp do kursu głównego pozostaje aktywny.'
      : 'Potwierdzamy wpływ Twojego zgłoszenia na trwałym nośniku. Jeżeli dla zamówienia wyrażono zgodę na natychmiastowe dostarczenie treści cyfrowych przed upływem 14 dni i rozpoczęto korzystanie z kursu (first_content_accessed_at IS NOT NULL), prawo do odstąpienia od umowy wygasło na mocy art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta. Jeżeli kurs nie został jeszcze uruchomiony, zwrot środków nastąpi w terminie do 14 dni.';

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: nowIso,
        status: isOrderBumpOnly ? 'approved_for_refund' : 'auto_rejected_art38',
        auto_rejected_due_to_art38: !isOrderBumpOnly,
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
