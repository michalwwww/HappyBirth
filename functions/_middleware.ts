// Cloudflare Pages Functions - Native Edge Middleware
// Obsługuje routing subdomen, ochronę RODO /strefa/* oraz 30-dniowe ciasteczko afiliacyjne hb_aff_ref ([D2])

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: {
    ASSETS: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
  };
}

const AFFILIATE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 dni

function withAffiliateCookieIfPresent(response: Response, refParam: string | null): Response {
  if (!refParam || !/^[a-zA-Z0-9_-]{2,40}$/.test(refParam)) {
    return response;
  }
  const newHeaders = new Headers(response.headers);
  newHeaders.append(
    'Set-Cookie',
    `hb_aff_ref=${encodeURIComponent(refParam.trim())}; Max-Age=${AFFILIATE_COOKIE_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const host = context.request.headers.get('host') || '';
  const refParam = url.searchParams.get('ref');

  // 1. Przepuść bez zmian pliki statyczne, chunki JS, CSS, obrazy, favicon oraz endpointy API
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/favicon')
  ) {
    return context.next();
  }

  // 2. SUBDOMENA B2B: partnerzy.happybirth.pl
  if (host.startsWith('partnerzy.')) {
    if (!url.pathname.startsWith('/partnerzy')) {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = `/partnerzy${url.pathname === '/' ? '' : url.pathname}`;
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withAffiliateCookieIfPresent(res, refParam);
    }
    const res = await context.next();
    return withAffiliateCookieIfPresent(res, refParam);
  }

  // 3. SUBDOMENA KURSANTKI: strefa.happybirth.pl lub /strefa/*
  const isStrefaHost = host.startsWith('strefa.');
  const isStrefaParam = url.searchParams.get('site') === 'strefa';
  const isStrefaPath = url.pathname.startsWith('/strefa');

  if (isStrefaHost || isStrefaParam || isStrefaPath) {
    let targetUrl = url;
    if (!url.pathname.startsWith('/strefa')) {
      targetUrl = new URL(url.toString());
      targetUrl.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }

    const response = await context.env.ASSETS.fetch(targetUrl);
    const newHeaders = new Headers(response.headers);
    // [E5] Bezwzględna ochrona prywatności medycznej przed botami Meta i Google
    newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // 4. DOMENA GŁÓWNA: happybirth.pl (bezpośrednio obsługuje /partnerzy, /afiliacja, /odstap-od-umowy, /program, /o-nas)
  const isMainProdHost = host === 'happybirth.pl' || host === 'www.happybirth.pl';
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentRoute = studentRoutes.some((route) => url.pathname.startsWith(route));

  if (isMainProdHost && isStudentRoute) {
    const targetUrl = new URL(url.toString());
    targetUrl.pathname = `/strefa${url.pathname}`;
    const res = await context.env.ASSETS.fetch(targetUrl);
    const newHeaders = new Headers(res.headers);
    newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  }

  const res = await context.next();
  return withAffiliateCookieIfPresent(res, refParam);
}
