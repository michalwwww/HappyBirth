import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { d1Run } from '@/lib/d1';
import { getDefaultTier1Rate, AffiliateRoleCategory } from '@/lib/affiliate';

export const runtime = 'nodejs';

/**
 * [D4a-1] & [D4a-2] Endpoint zgłoszeniowy dla:
 * 1) Programu Afiliacyjnego (/afiliacja) — położne, fizjoterapeutki, doradczynie laktacyjne, twórczynie (model 2-Tier Capped CPA)
 * 2) Współpracy B2B (/partnerzy) — marki wyprawkowe, producenci, dystrybutorzy, kliniki i pracodawcy
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      channel = 'afiliacja', // 'afiliacja' lub 'partnerzy_b2b'
      fullName,
      companyOrBrand = '',
      email,
      phone = '',
      roleOrArea = '',
      roleCategory = 'midwife_physio',
      profileUrl = '',
      message = '',
      rodoConsent = true,
    } = body;

    if (!fullName || !email || !email.includes('@') || !rodoConsent) {
      return NextResponse.json(
        { error: 'Proszę uzupełnić imię i nazwisko, poprawny adres e-mail oraz zaznaczyć zgodę RODO.' },
        { status: 400 }
      );
    }

    const inquiryId = crypto.randomUUID();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();

    await d1Run(
      `INSERT INTO partnership_inquiries (
         id, channel, full_name, company_or_brand, email, phone,
         role_or_area, profile_url, message, rodo_consent
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        inquiryId,
        channel === 'partnerzy_b2b' ? 'partnerzy_b2b' : 'afiliacja',
        cleanName,
        String(companyOrBrand).trim(),
        cleanEmail,
        String(phone).trim(),
        String(roleOrArea).trim(),
        String(profileUrl).trim(),
        String(message).trim().slice(0, 1000),
      ]
    );

    // Jeśli to zgłoszenie do programu /afiliacja ([D4a-1]), zarejestruj wstępny profil afilianta z kodem -10%
    let generatedPromoCode: string | null = null;
    let generatedRefSlug: string | null = null;
    let assignedRate = 0.2;

    if (channel === 'afiliacja') {
      const cat: AffiliateRoleCategory =
        roleCategory === 'midwife_physio' || roleCategory === 'creator_publisher'
          ? roleCategory
          : 'standard';
      assignedRate = getDefaultTier1Rate(cat);
      const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
      const basePrefix = cleanName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 6)
        .toUpperCase() || 'PARTNER';

      generatedPromoCode = `${basePrefix}10`;
      generatedRefSlug = `${basePrefix.toLowerCase()}-${suffix.toLowerCase()}`;

      await d1Run(
        `INSERT INTO affiliates (
           id, email, full_name, role_category, specialization,
           profile_or_practice_url, promo_code, ref_slug, tier1_rate, status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
         ON CONFLICT(email) DO NOTHING`,
        [
          crypto.randomUUID(),
          cleanEmail,
          cleanName,
          cat,
          String(roleOrArea).trim(),
          String(profileUrl).trim(),
          `${basePrefix}-${suffix}10`,
          generatedRefSlug,
          assignedRate,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      channel,
      promoCode: generatedPromoCode,
      refSlug: generatedRefSlug,
      tier1RatePercent: Math.round(assignedRate * 100),
    });
  } catch (err: any) {
    console.error('Błąd zapisu zgłoszenia partnerskiego:', err);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania zgłoszenia.' },
      { status: 500 }
    );
  }
}
