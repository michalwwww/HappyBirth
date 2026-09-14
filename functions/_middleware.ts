// Cloudflare Pages Functions - Native Edge Middleware
// Obsługuje automatyczny routing subdomen na 300+ węzłach Cloudflare CDN

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: {
    ASSETS: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
  };
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const host = context.request.headers.get('host') || '';

  // 1. Przepuść bez zmian pliki statyczne, chunki JS, CSS, obrazy i favicon
  if (
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
      return context.env.ASSETS.fetch(targetUrl);
    }
    return context.next();
  }

  // 3. SUBDOMENA KURSANTKI: strefa.happybirth.pl
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
    // Bezwzględna ochrona prywatności medycznej przed botami Meta i Google
    newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // 4. DOMENA GŁÓWNA MARKETINGOWA: happybirth.pl
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentRoute = studentRoutes.some((route) => url.pathname.startsWith(route));

  // Przekieruj ścieżki kursantki z domeny głównej do strefy
  if (isStudentRoute) {
    return Response.redirect(`https://strefa.happybirth.pl${url.pathname}${url.search}`, 302);
  }

  // Przekieruj /partnerzy na dedykowaną subdomenę
  if (url.pathname.startsWith('/partnerzy')) {
    return Response.redirect(`https://partnerzy.happybirth.pl${url.pathname.replace(/^\/partnerzy/, '') || '/'}`, 302);
  }

  // Przepisz stronę główną / na stronę lifestylowo-marketingową /marketing
  if (url.pathname === '/' || url.pathname === '') {
    const targetUrl = new URL(url.toString());
    targetUrl.pathname = '/marketing';
    return context.env.ASSETS.fetch(targetUrl);
  }

  return context.next();
}
