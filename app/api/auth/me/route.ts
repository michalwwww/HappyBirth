import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { d1First, d1Run } from '@/lib/d1';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // 1. Pobierz pełne dane użytkownika z Cloudflare D1 (w tym profil ciąży i dziecka)
  const user = await d1First<{
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: string;
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
    `SELECT id, email, full_name, avatar_url, role, 
            due_date, due_date_source, lmp_date, baby_name, baby_gender, partner_name, 
            parity, planned_birth_type, city, hospital 
     FROM users WHERE id = ? LIMIT 1`,
    [session.userId]
  );

  // 2. Pobierz dane o dostępie do kursu z tabeli enrollments
  const enrollment = await d1First<{ status: string; expires_at: string }>(
    'SELECT status, expires_at FROM enrollments WHERE user_id = ? AND status = ? LIMIT 1',
    [session.userId, 'active']
  );

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      fullName: user?.full_name || '',
      avatarUrl: user?.avatar_url || '',
      role: user?.role || session.role || 'student',
      hasActiveCourse: !!enrollment || session.role === 'student' || session.role === 'partner',
      expiresAt: enrollment?.expires_at,
      pregnancy: user?.due_date ? {
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
      } : null,
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
