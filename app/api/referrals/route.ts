import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1All, d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

/**
 * [C4] Boks Poleceń w Panelu Kursantki — Model „Prezent za Polecenie” (Przepisy na Obiad PDF)
 * Zero prowizji pieniężnej (0% tarcia podatkowego), natychmiastowe (0 dni czekania) odblokowanie prezentu PDF.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({
        referralCode: 'MAMA-2026',
        referralsCount: 0,
        rewardUnlocked: false,
        rewardTitle:
          'E-book PDF: „Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (Przepisy + Gotowe Listy Zakupów)”',
        rewardDownloadUrl: '/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html',
      });
    }

    const user = await d1First<{ id: string; referral_code: string | null }>(
      'SELECT id, referral_code FROM users WHERE id = ?',
      [session.userId]
    );

    let code = user?.referral_code;
    if (!code) {
      code = `MAMA-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      await d1Run('UPDATE users SET referral_code = ? WHERE id = ?', [code, session.userId]);
    }

    const referrals = await d1All<{ id: string; unlocked_at: string }>(
      'SELECT id, unlocked_at FROM student_referrals WHERE referrer_user_id = ? AND reward_unlocked = 1',
      [session.userId]
    );

    return NextResponse.json({
      referralCode: code,
      referralsCount: referrals.length,
      rewardUnlocked: referrals.length > 0,
      rewardTitle:
        'E-book PDF: „Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (Przepisy + Gotowe Listy Zakupów)”',
      rewardDownloadUrl: '/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html',
      shareMessage: `Z moim kodem ${code} masz 10% zniżki (440,10 zł zamiast 489,00 zł) na szkołę rodzenia online HappyBirth.pl, a ja otrzymam w prezencie e-booka z przepisami na szybkie obiady #współpraca https://happybirth.pl/?promo=${code}`,
    });
  } catch (err) {
    console.error('Błąd pobierania danych poleceń [C4]:', err);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
