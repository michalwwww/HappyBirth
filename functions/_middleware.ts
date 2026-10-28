// Cloudflare Pages Functions - Native Edge Middleware
// Wymusza twardą separację subdomen (strefa.happybirth.pl, partnerzy.happybirth.pl, afiliacja.happybirth.pl),
// dodaje nagłówki bezpieczeństwa OWASP, blokuje boty reklamowe Meta/Google przed skanowaniem strefy medycznej
// i afiliacji ([E5] & Zero-Burn Guardrails) oraz obsługuje 30-dniowe ciasteczko afiliacyjne hb_aff_ref ([D2]).

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
const AD_BOT_REGEX = /Facebot|facebookexternalhit|Meta-ExternalAgent|AdsBot-Google|Mediapartners-Google|Bytespider|TikTok/i;

function withSecurityAndTrackingHeaders(
  response: Response,
  options: { refParam?: string | null; noIndex?: boolean }
): Response {
  const newHeaders = new Headers(response.headers);

  // Enterprise OWASP Security Headers
  newHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  if (options.noIndex) {
    newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  if (options.refParam && /^[a-zA-Z0-9_-]{2,40}$/.test(options.refParam)) {
    newHeaders.append(
      'Set-Cookie',
      `hb_aff_ref=${encodeURIComponent(options.refParam.trim())}; Max-Age=${AFFILIATE_COOKIE_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const host = (context.request.headers.get('host') || '').toLowerCase();
  const userAgent = context.request.headers.get('user-agent') || '';
  const refParam = url.searchParams.get('ref');
  const isAdBot = AD_BOT_REGEX.test(userAgent);

  // 1. Przepuść bez zmian pliki statyczne, arkusze PDF/HTML (/materialy/*), chunki JS, CSS, obrazy, favicon oraz endpointy API
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/materialy') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/favicon')
  ) {
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { noIndex: false });
  }

  // 2. SUBDOMENA B2B I AFILIACJI: partnerzy.happybirth.pl
  if (host.startsWith('partnerzy.')) {
    if (isAdBot) {
      return new Response('Access restricted for ad crawlers.', {
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    if (url.pathname === '/' || url.pathname === '') {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = '/partnerzy';
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
    }
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
  }

  // 3. SUBDOMENA AFILIACJI: afiliacja.happybirth.pl
  if (host.startsWith('afiliacja.')) {
    if (isAdBot) {
      return new Response('Access restricted for ad crawlers.', {
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    if (url.pathname === '/' || url.pathname === '') {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = '/afiliacja';
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
    }
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
  }

  // 4. SUBDOMENA KURSANTKI: strefa.happybirth.pl
  if (host.startsWith('strefa.')) {
    if (isAdBot) {
      return new Response('Medical student area restricted for ad crawlers.', {
        status: 403,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    let targetUrl = url;
    if (!url.pathname.startsWith('/strefa')) {
      targetUrl = new URL(url.toString());
      targetUrl.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }
    const response = await context.env.ASSETS.fetch(targetUrl);
    return withSecurityAndTrackingHeaders(response, { noIndex: true });
  }

  // 5. DOMENA GŁÓWNA PRODUKCYJNA (happybirth.pl / www.happybirth.pl):
  //    Twarda izolacja: przekierowania 301 ze ścieżek /strefa, /partnerzy, /afiliacja na dedykowane subdomeny
  const isMainProdHost = host === 'happybirth.pl' || host === 'www.happybirth.pl';
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentShortRoute = studentRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(`${route}/`)
  );
  const isStrefaPath = url.pathname === '/strefa' || url.pathname.startsWith('/strefa/');
  const isPartnerzyPath = url.pathname === '/partnerzy' || url.pathname.startsWith('/partnerzy/');
  const isAfiliacjaPath = url.pathname === '/afiliacja' || url.pathname.startsWith('/afiliacja/');

  if (isMainProdHost) {
    if (isStrefaPath || isStudentShortRoute) {
      if (isAdBot) {
        return new Response('Redirect restricted for ad crawlers.', {
          status: 403,
          headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
        });
      }
      const cleanSubpath = isStrefaPath
        ? url.pathname.replace(/^\/strefa/, '') || '/'
        : url.pathname;
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://strefa.happybirth.pl${cleanSubpath}${url.search}`,
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        },
      });
    }

    if (isPartnerzyPath) {
      if (isAdBot) {
        return new Response('Redirect restricted for ad crawlers.', {
          status: 403,
          headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
        });
      }
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://partnerzy.happybirth.pl/${url.search}`,
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        },
      });
    }

    if (isAfiliacjaPath) {
      if (isAdBot) {
        return new Response('Redirect restricted for ad crawlers.', {
          status: 403,
          headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
        });
      }
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://partnerzy.happybirth.pl/afiliacja${url.search}`,
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        },
      });
    }
  }

  // Fallback dla środowisk podglądowych (*.pages.dev / localhost)
  if (isStrefaPath || isStudentShortRoute || isPartnerzyPath || isAfiliacjaPath) {
    if (isStudentShortRoute) {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = `/strefa${url.pathname}`;
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { noIndex: true });
    }
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
  }

  const res = await context.next();
  return withSecurityAndTrackingHeaders(res, { refParam, noIndex: false });
}
