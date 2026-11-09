// Cloudflare Pages Functions - Native Edge Middleware
// Wymusza twardą separację subdomen (strefa.happybirth.pl, partnerzy.happybirth.pl, afiliacja.happybirth.pl),
// chroni płatne lekcje wideo za Paywallem sesyjnym HMAC-SHA256,
// dodaje nagłówki bezpieczeństwa OWASP, blokuje boty reklamowe Meta/Google przed skanowaniem strefy medycznej
// i afiliacji ([E5] & Zero-Burn Guardrails) oraz obsługuje 30-dniowe ciasteczko afiliacyjne hb_aff_ref ([D2]).

import { getEdgeSession } from './_shared/session';

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: {
    SESSION_SECRET?: string;
    ASSETS: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
  };
}

const AFFILIATE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 dni
const AD_BOT_REGEX = /Facebot|facebookexternalhit|Meta-ExternalAgent|AdsBot-Google|Mediapartners-Google|Bytespider|TikTok/i;
const FREE_PREVIEW_LESSONS = new Set(['lekcja-01', 'lekcja-06', 'lekcja-26', 'lekcja-40']);

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

function isProtectedPaidLessonPath(pathname: string): boolean {
  // lekcja-01, lekcja-06, lekcja-26 i lekcja-40 są otwartymi lekcjami pokazowymi; pozostałe lekcje wymagają aktywnej sesji kursantki
  const clean = pathname.replace(/\.(html|txt)$/i, '');
  const m = clean.match(/^\/(?:strefa\/)?lekcja\/(lekcja-\d+)/);
  if (!m) return false;
  return !FREE_PREVIEW_LESSONS.has(m[1]);
}

const STATIC_ASSET_EXT_REGEX =
  /\.(css|js|mjs|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|otf|eot|vtt|mp4|webm|pdf|json|xml|webmanifest)$/i;

function notFoundResponse(): Response {
  return new Response('404 Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const host = (context.request.headers.get('host') || '').toLowerCase();
  const userAgent = context.request.headers.get('user-agent') || '';
  const refParam = url.searchParams.get('ref');
  const isAdBot = AD_BOT_REGEX.test(userAgent);

  // Znormalizowana ścieżka bez przyrostków eksportu statycznego Next.js (.html / .txt RSC)
  const cleanPath = (url.pathname.replace(/\.(html|txt)$/i, '') || '/').replace(/\/+$/, '') || '/';

  // 1. Przepuść bez zmian wyłącznie prawdziwe zasoby statyczne (CSS/JS/obrazy/fonty), arkusze /materialy/*, SEO/GEO txt oraz endpointy API
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/materialy') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/llms.txt' ||
    url.pathname === '/llms-full.txt' ||
    STATIC_ASSET_EXT_REGEX.test(url.pathname)
  ) {
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { noIndex: false });
  }

  // 2. SUBDOMENA B2B: partnerzy.happybirth.pl (wyłącznie strona B2B na root '/', zero podstron /afiliacja lub /strefa)
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
    if (cleanPath === '/' || cleanPath === '/partnerzy') {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = url.pathname.endsWith('.txt') ? '/partnerzy.txt' : '/partnerzy';
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
    }
    return notFoundResponse();
  }

  // 3. SUBDOMENA AFILIACJI: afiliacja.happybirth.pl (wyłącznie strona afiliacyjna na root '/', zero podstron /partnerzy lub /strefa)
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
    if (cleanPath === '/' || cleanPath === '/afiliacja' || cleanPath === '/panel' || cleanPath === '/kokpit' || cleanPath === '/login') {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = url.pathname.endsWith('.txt') ? '/afiliacja.txt' : '/afiliacja';
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true });
    }
    return notFoundResponse();
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

    if (cleanPath.startsWith('/afiliacja') || cleanPath.startsWith('/partnerzy')) {
      return notFoundResponse();
    }

    // Paywall na poziomie Edge dla płatnych lekcji wideo
    if (isProtectedPaidLessonPath(url.pathname)) {
      const session = await getEdgeSession(context.request, context.env);
      if (!session) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `https://strefa.happybirth.pl/login?redirect=${encodeURIComponent(cleanPath)}`,
            'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          },
        });
      }
    }

    let targetUrl = url;
    if (!url.pathname.startsWith('/strefa')) {
      targetUrl = new URL(url.toString());
      targetUrl.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }
    const response = await context.env.ASSETS.fetch(targetUrl);
    return withSecurityAndTrackingHeaders(response, { noIndex: true });
  }

  // 5. DOMENA GŁÓWNA PRODUKCYJNA (happybirth.pl / www.happybirth.pl / *.pages.dev):
  //    Twarda separacja: podstrony /afiliacja, /partnerzy, /marketing, /challenge NIE ISTNIEJĄ na domenie głównej (404 Not Found).
  const isMainProdHost = !host.includes('localhost') && !host.includes('127.0.0.1');
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny', '/wiedza'];
  const isStudentShortRoute = studentRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`)
  );
  const isStrefaPath = cleanPath === '/strefa' || cleanPath.startsWith('/strefa/');
  const isPartnerzyPath = cleanPath === '/partnerzy' || cleanPath.startsWith('/partnerzy/');
  const isAfiliacjaPath = cleanPath === '/afiliacja' || cleanPath.startsWith('/afiliacja/');
  const isLegacyInternalPath =
    cleanPath === '/marketing' ||
    cleanPath.startsWith('/marketing/') ||
    cleanPath === '/challenge';

  if (isLegacyInternalPath) {
    return notFoundResponse();
  }

  if (isMainProdHost) {
    // Całkowita blokada podstron /afiliacja i /partnerzy na domenie głównej happybirth.pl
    if (isAfiliacjaPath || isPartnerzyPath) {
      return notFoundResponse();
    }

    if (isStrefaPath || isStudentShortRoute) {
      if (isAdBot) {
        return notFoundResponse();
      }
      const cleanSubpath = isStrefaPath
        ? cleanPath.replace(/^\/strefa/, '') || '/'
        : cleanPath;
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://strefa.happybirth.pl${cleanSubpath}${url.search}`,
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        },
      });
    }
  }

  // Fallback wyłącznie dla lokalnego środowiska podglądowego (localhost)
  if (isStrefaPath || isStudentShortRoute || isPartnerzyPath || isAfiliacjaPath) {
    if (isAdBot) {
      return notFoundResponse();
    }
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
