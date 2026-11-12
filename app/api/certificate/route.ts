import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { d1First, d1Run } from '@/lib/d1';
import { OPERATOR_LEGAL_DATA } from '@/lib/legal-shield';

export const runtime = 'nodejs';

const QUIZ_ANSWER_KEY: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 1,
  '4': 0,
  '5': 1,
  '6': 0,
  '7': 0,
  '8': 1,
  '9': 0,
  '10': 1,
};

const TEAM_WHITELIST_EMAILS = new Set([
  'mwspace@gmail.com',
  'kontakt@happybirth.pl',
  'pomoc@happybirth.pl',
  'partner@happybirth.pl',
  'admin@happybirth.pl',
  'michal@happybirth.pl',
  'maciej@happybirth.pl',
]);

/**
 * [C3] Endpoint generujący Imienny Certyfikat Ukończenia Szkoły Rodzenia Online HappyBirth.pl
 * Wymaga zaliczenia testu końcowego (10 pytań jednokrotnego wyboru) na poziomie min. 80% (min. 8/10).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId || !session?.email) {
      return NextResponse.json(
        { passed: false, error: 'Zaloguj się do Strefy Kursantki, aby wygenerować imienny certyfikat.' },
        { status: 401 }
      );
    }

    const cleanEmail = session.email.trim().toLowerCase();
    const isTeam = TEAM_WHITELIST_EMAILS.has(cleanEmail);

    if (!isTeam) {
      const activeEnroll = await d1First<any>(
        `SELECT id FROM enrollments
         WHERE user_id = ?
           AND status = 'active'
           AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
         LIMIT 1`,
        [session.userId]
      );
      if (!activeEnroll?.id) {
        return NextResponse.json(
          {
            passed: false,
            error: 'Certyfikat ukończenia jest dostępny wyłącznie dla kursantek z aktywnym dostępem do kursu.',
          },
          { status: 403 }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const { fullName, answers } = body;

    const cleanName = String(fullName || '')
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 120);
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { passed: false, error: 'Proszę podać imię i nazwisko na certyfikat.' },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json(
        { passed: false, error: 'Brak odpowiedzi z testu końcowego do weryfikacji.' },
        { status: 400 }
      );
    }

    const total = 10;
    let correct = 0;
    for (const [qId, expectedIdx] of Object.entries(QUIZ_ANSWER_KEY)) {
      if (Number(answers[qId]) === expectedIdx) {
        correct += 1;
      }
    }
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
        session.userId,
        cleanName,
        cleanEmail,
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
