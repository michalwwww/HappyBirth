export async function onRequestGet(): Promise<Response> {
  return new Response(
    JSON.stringify({
      referralCode: 'MAMA-2026',
      shareUrl: 'https://happybirth.pl/?promo=MAMA-2026',
      friendDiscountPercent: 10,
      friendDiscountedPricePln: '440,10 zł',
      bonusUnlocked: false,
      referralsCount: 0,
      bonusPdfUrl: '/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html',
      bonusTitle: 'Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (E-book PDF)',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
