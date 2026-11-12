import { NextRequest, NextResponse } from 'next/server';
import { d1All, d1Run } from '@/lib/d1';
import { escapeHtml, verifyUnsubscribeTokenNode } from '@/lib/security';

export const runtime = 'nodejs';

async function processUnsubscribeNode(email: string): Promise<number> {
  let cancelledCount = 0;
  try {
    const rows = await d1All<{ id: number; resend_scheduled_ids?: string | null }>(
      'SELECT id, resend_scheduled_ids FROM leads WHERE LOWER(email) = ?',
      [email]
    ).catch(() => []);

    const allIds = new Set<string>();
    for (const r of rows) {
      if (r?.resend_scheduled_ids) {
        try {
          const parsed = JSON.parse(String(r.resend_scheduled_ids));
          if (Array.isArray(parsed)) parsed.forEach((id) => id && allIds.add(String(id)));
        } catch {}
      }
    }

    if (process.env.RESEND_API_KEY && allIds.size > 0) {
      const res = await Promise.allSettled(
        Array.from(allIds).map((id) =>
          fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}/cancel`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          })
        )
      );
      cancelledCount = res.filter((r) => r.status === 'fulfilled').length;
    }

    await d1Run(
      `UPDATE leads
       SET unsubscribed_at = COALESCE(unsubscribed_at, datetime('now')),
           marketing_consent = 0,
           resend_scheduled_ids = '[]'
       WHERE LOWER(email) = ?`,
      [email]
    ).catch(() => {});

    await d1Run('UPDATE users SET marketing_consent = 0 WHERE LOWER(email) = ?', [email]).catch(() => {});
  } catch (err) {
    console.error('Błąd wypisania z subskrypcji (Node):', err);
  }
  return cancelledCount;
}

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase();
  const sig = (req.nextUrl.searchParams.get('sig') || '').trim();
  if (!verifyUnsubscribeTokenNode(email, sig)) {
    return new NextResponse('Nieprawidłowy podpis linku wypisu.', { status: 400 });
  }
  await processUnsubscribeNode(email);
  const safeEmail = escapeHtml(email);
  const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"/><title>Wypisano — HappyBirth.pl</title></head><body style="font-family:sans-serif;background:#FBF8F4;padding:40px 16px;text-align:center;"><div style="max-width:500px;margin:0 auto;background:#fff;padding:30px;border-radius:20px;border:1px solid #EAE3DB;"><h1>Wypisano z listy wysyłkowej</h1><p>Adres <strong>${safeEmail}</strong> został wypisany z komunikatów edukacyjno-marketingowych HappyBirth.pl.</p><p><a href="/">Wróć na stronę główną</a></p></div></body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}

export async function POST(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase();
  const sig = (req.nextUrl.searchParams.get('sig') || '').trim();
  if (!verifyUnsubscribeTokenNode(email, sig)) {
    return NextResponse.json({ error: 'Invalid unsubscribe signature' }, { status: 400 });
  }
  const cancelledScheduledEmails = await processUnsubscribeNode(email);
  return NextResponse.json({ success: true, unsubscribed: true, email, cancelledScheduledEmails });
}
