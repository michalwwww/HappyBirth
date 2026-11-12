import { getEdgeSession } from '../_shared/session';
import { generateMotherReferralCode } from '../../lib/brand-codes';

interface Env {
  DB?: any;
  SESSION_SECRET?: string;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const session = await getEdgeSession(request, env);

  let referralCode = 'MAMA-POLECA';
  let referralsCount = 0;
  let rewardUnlocked = false;

  if (session && env.DB) {
    try {
      const userRow = await env.DB.prepare('SELECT id, full_name, referral_code FROM users WHERE id = ? OR email = ? LIMIT 1')
        .bind(session.userId, session.email)
        .first();
      const effectiveUserId = userRow?.id || session.userId;

      if (userRow?.referral_code && !/^MAMA-[A-F0-9]{4}$/i.test(userRow.referral_code)) {
        referralCode = userRow.referral_code;
      } else {
        const baseMotherCode = generateMotherReferralCode(userRow?.full_name, session.email);
        const taken = await env.DB.prepare('SELECT id FROM users WHERE referral_code = ? AND email != ? LIMIT 1')
          .bind(baseMotherCode, session.email)
          .first()
          .catch(() => null);
        referralCode = taken?.id
          ? generateMotherReferralCode(userRow?.full_name, session.email, 10)
          : baseMotherCode;
        await env.DB.prepare('UPDATE users SET referral_code = ? WHERE id = ? OR email = ?')
          .bind(referralCode, effectiveUserId, session.email)
          .run();
      }

      const stats = await env.DB.prepare(
        `SELECT COUNT(*) as cnt
         FROM student_referrals
         WHERE (referrer_user_id = ? OR referrer_code = ?) AND reward_unlocked = 1`
      )
        .bind(effectiveUserId, referralCode)
        .first();

      referralsCount = Number(stats?.cnt || 0);
      rewardUnlocked = referralsCount > 0;
    } catch {
      // Fallback
    }
  }

  return new Response(
    JSON.stringify({
      referralCode,
      shareUrl: `https://happybirth.pl/?promo=${referralCode}`,
      friendDiscountPercent: 10,
      friendDiscountedPricePln: '440,10 zł',
      rewardUnlocked,
      bonusUnlocked: rewardUnlocked,
      referralsCount,
      bonusPdfUrl: rewardUnlocked
        ? '/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html'
        : '/materialy/podglad-obiady-15-min-happybirth.html',
      bonusTitle:
        'Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (E-book PDF)',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
