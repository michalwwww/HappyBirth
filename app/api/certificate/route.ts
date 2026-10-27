import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1Run } from '@/lib/d1';
import { OPERATOR_LEGAL_DATA } from '@/lib/legal-shield';

export const runtime = 'nodejs';

/**
 * [C3] Endpoint generujący Imienny Certyfikat Ukończenia Szkoły Rodzenia Online HappyBirth.pl
 * Wymaga zaliczenia testu końcowego (10 pytań jednokrotnego wyboru) na poziomie min. 80% (min. 8/10).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const { fullName, correctAnswers = 0, totalQuestions = 10 } = body;

    const cleanName = String(fullName || '').trim();
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: 'Proszę podać imię i nazwisko na certyfikat.' },
        { status: 400 }
      );
    }

    const total = Number(totalQuestions) > 0 ? Number(totalQuestions) : 10;
    const correct = Math.max(0, Math.min(total, Number(correctAnswers) || 0));
    const scorePercent = Math.round((correct / total) * 100);

    // Próg zaliczenia min. 80%
    if (scorePercent < 80) {
      return NextResponse.json(
        {
          error: `Aby wygenerować certyfikat, wymagany jest wynik minimum 80% (8/10 poprawnych odpowiedzi). Twój wynik: ${scorePercent}%.`,
          passed: false,
          scorePercent,
        },
        { status: 400 }
      );
    }

    const certId = crypto.randomUUID();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
    const certificateNumber = `HB-CERT-${datePart}-${randomPart}`;
    const issuedAt = new Date().toISOString();

    await d1Run(
      `INSERT INTO certificates (id, certificate_number, user_id, full_name, email, quiz_score, correct_answers, issued_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        certId,
        certificateNumber,
        session?.userId || null,
        cleanName,
        session?.email || null,
        scorePercent,
        correct,
        issuedAt,
      ]
    );

    return NextResponse.json({
      success: true,
      passed: true,
      certificate: {
        id: certId,
        certificateNumber,
        fullName: cleanName,
        scorePercent,
        correctAnswers: correct,
        totalQuestions: total,
        issuedAt,
        issuedDateFormatted: new Date(issuedAt).toLocaleDateString('pl-PL'),
        courseTitle: 'Szkoła Rodzenia Online HappyBirth.pl (52 lekcje 4K w 8 modułach · 288 min)',
        academicPartner: 'Szkoła Rodzenia Mama Gaja w Poznaniu (od 2012 r.)',
        operator: OPERATOR_LEGAL_DATA,
      },
    });
  } catch (err: any) {
    console.error('Błąd generowania certyfikatu:', err);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania certyfikatu.' },
      { status: 500 }
    );
  }
}
