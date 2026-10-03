interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const { request, env } = context;
    const body: any = await request.json().catch(() => ({}));
    const { email, name, dueDate } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Proszę podać poprawny adres e-mail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : 'Przyszła Mamo';
    const cleanDueDate = typeof dueDate === 'string' ? dueDate.trim() : null;
    const userId = crypto.randomUUID();

    if (env.DB) {
      try {
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(cleanEmail).first();
        if (!existing) {
          await env.DB.prepare(
            `INSERT INTO users (id, email, full_name, due_date, role) VALUES (?, ?, ?, ?, 'lead')`
          ).bind(userId, cleanEmail, cleanName, cleanDueDate).run();
        } else if (cleanDueDate) {
          await env.DB.prepare('UPDATE users SET due_date = COALESCE(due_date, ?) WHERE id = ?')
            .bind(cleanDueDate, existing.id).run();
        }
      } catch (dbErr) {
        console.error('Błąd zapisu w D1:', dbErr);
      }
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Błąd rejestracji leada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
