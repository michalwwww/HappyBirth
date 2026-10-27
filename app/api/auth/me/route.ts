import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1First, d1Run } from '@/lib/d1';
import { ACCESS_DURATION_DAYS } from '@/lib/promo';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // 1. Pobierz dane użytkownika z Cloudflare D1 (wraz z kodem polecającym [C4])
  const user = await d1First<{
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: string;
    referral_code: string;
    due_date: string;
    due_date_source: string;
    lmp_date: string;
    baby_name: string;
    baby_gender: string;
    partner_name: string;
    parity: string;
    planned_birth_type: string;
    city: string;
    hospital: string;
  }>(
    `SELECT id, email, full_name, avatar_url, role, referral_code,
            due_date, due_date_source, lmp_date, baby_name, baby_gender, partner_name,
            parity, planned_birth_type, city, hospital
     FROM users WHERE id = ? LIMIT 1`,
    [session.userId]
  );

  // Jeśli użytkowniczka nie ma jeszcze wygenerowanego kodu MAMA-XXXX ([C4]), wygeneruj go
  let referralCode = user?.referral_code;
  if (!referralCode && user?.id) {
    referralCode = `MAMA-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    await d1Run('UPDATE users SET referral_code = ? WHERE id = ?', [referralCode, user.id]);
  }

  // 2. [C1] Strażnik 18 miesięcy (Access Guard: CurrentDate <= PurchaseDate + 548 dni)
  const enrollment = await d1First<{
    status: string;
    granted_at: string;
    expires_at: string;
    first_content_accessed_at: string | null;
  }>(
    'SELECT status, granted_at, expires_at, first_content_accessed_at FROM enrollments WHERE user_id = ? AND status = ? LIMIT 1',
    [session.userId, 'active']
  );

  const defaultExpiresAt = new Date(Date.now() + ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const expiresAtIso = enrollment?.expires_at || defaultExpiresAt;
  const expiresTime = new Date(expiresAtIso).getTime();
  const isNotExpired = isNaN(expiresTime) || expiresTime >= Date.now();
  const daysRemaining = isNaN(expiresTime)
    ? ACCESS_DURATION_DAYS
    : Math.max(0, Math.ceil((expiresTime - Date.now()) / (24 * 60 * 60 * 1000)));

  // 3. [C4] Sprawdź czy odblokowano już Prezent za Polecenie (Przepisy na Obiad PDF)
  const referralReward = await d1First<{ id: string; unlocked_at: string }>(
    'SELECT id, unlocked_at FROM student_referrals WHERE referrer_user_id = ? AND reward_unlocked = 1 LIMIT 1',
    [session.userId]
  );

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      fullName: user?.full_name || '',
      avatarUrl: user?.avatar_url || '',
      role: user?.role || session.role || 'student',
      hasActiveCourse: (!!enrollment || session.role === 'student' || session.role === 'partner') && isNotExpired,
      expiresAt: expiresAtIso,
      daysRemaining,
      firstContentAccessedAt: enrollment?.first_content_accessed_at || null,
      referralCode: referralCode || 'MAMA-2026',
      referralBonusUnlocked: Boolean(referralReward),
      pregnancy: user?.due_date
        ? {
            dueDate: user.due_date,
            dueDateSource: user.due_date_source || 'usg',
            lmpDate: user.lmp_date || undefined,
            babyName: user.baby_name || undefined,
            babyGender: user.baby_gender || 'surprise',
            partnerName: user.partner_name || undefined,
            parity: user.parity || 'first_baby',
            plannedBirthType: user.planned_birth_type || 'natural',
            city: user.city || undefined,
            hospital: user.hospital || undefined,
          }
        : null,
    },
  });
}

// Aktualizacja profilu ciąży w Cloudflare D1
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      dueDate,
      dueDateSource,
      lmpDate,
      babyName,
      babyGender,
      partnerName,
      parity,
      plannedBirthType,
      city,
      hospital,
    } = body;

    await d1Run(
      `UPDATE users SET 
        due_date = ?,
        due_date_source = ?,
        lmp_date = ?,
        baby_name = ?,
        baby_gender = ?,
        partner_name = ?,
        parity = ?,
        planned_birth_type = ?,
        city = ?,
        hospital = ?,
        updated_at = datetime('now')
       WHERE id = ?`,
      [
        dueDate || null,
        dueDateSource || 'usg',
        lmpDate || null,
        babyName || null,
        babyGender || 'surprise',
        partnerName || null,
        parity || 'first_baby',
        plannedBirthType || 'natural',
        city || null,
        hospital || null,
        session.userId,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Błąd aktualizacji profilu w D1:', err);
    return NextResponse.json({ error: 'Nie udało się zaktualizować profilu' }, { status: 500 });
  }
}
