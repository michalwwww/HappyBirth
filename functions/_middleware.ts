// Cloudflare Pages Functions - Native Edge Middleware
// Wymusza twardą separację subdomen (strefa.happybirth.pl, partnerzy.happybirth.pl, afiliacja.happybirth.pl),
// chroni całą Strefę Kursantki oraz płatne materiały PDF/VOD za Paywallem sesyjnym HMAC-SHA256 + D1,
// blokuje indeksację i boty reklamowe Meta/Google przed skanowaniem strefy medycznej i afiliacji.

import {
  getEdgeSession,
  hasActiveCourseEntitlementD1,
  isTeamWhitelistedEmail,
} from './_shared/session';

interface PagesContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: {
    DB?: any;
    SESSION_SECRET?: string;
    ASSETS: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
  };
}

const AFFILIATE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 dni
const AD_BOT_REGEX =
  /Facebot|facebookexternalhit|Meta-ExternalAgent|AdsBot-Google|Mediapartners-Google|Bytespider|TikTok/i;
const FREE_PREVIEW_LESSONS = new Set(['lekcja-01', 'lekcja-06', 'lekcja-26', 'lekcja-40']);

function withSecurityAndTrackingHeaders(
  response: Response,
  options: { refParam?: string | null; noIndex?: boolean; allowAffiliateCookie?: boolean }
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

  if (
    options.allowAffiliateCookie !== false &&
    options.refParam &&
    /^[a-zA-Z0-9_-]{2,40}$/.test(options.refParam)
  ) {
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

function redirectToStrefaLogin(redirectTarget: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://strefa.happybirth.pl/login?redirect=${encodeURIComponent(redirectTarget)}`,
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'Cache-Control': 'no-store',
    },
  });
}

async function resolveD1UserId(db: any, userId: string, email: string): Promise<string> {
  if (!db) return userId;
  try {
    const row = await db
      .prepare('SELECT id FROM users WHERE id = ? OR LOWER(email) = ? LIMIT 1')
      .bind(userId || '__NONE__', email || '__NONE__')
      .first();
    return row?.id ? String(row.id) : userId;
  } catch {
    return userId;
  }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const host = (context.request.headers.get('host') || '').toLowerCase();
  const userAgent = context.request.headers.get('user-agent') || '';
  const cookieHeader = context.request.headers.get('cookie') || '';
  const allowAffiliateCookie = !/(?:^|;\s*)hb_cookie_consent=essential(?:;|$)/.test(cookieHeader);
  const refParam =
    url.searchParams.get('ref') ||
    url.searchParams.get('poleca') ||
    url.searchParams.get('kod') ||
    url.searchParams.get('promo');
  const isAdBot = AD_BOT_REGEX.test(userAgent);

  // Znormalizowana ścieżka bez przyrostków eksportu statycznego Next.js (.html / .txt RSC)
  const cleanPath = (url.pathname.replace(/\.(html|txt)$/i, '') || '/').replace(/\/+$/, '') || '/';

  // 0a. Blokada indeksacji subdomen (strefa., partnerzy., afiliacja.) w robots.txt
  if (
    url.pathname === '/robots.txt' &&
    (host.startsWith('strefa.') || host.startsWith('partnerzy.') || host.startsWith('afiliacja.'))
  ) {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  // 0b. DRM Gate dla płatnych materiałów HTML w /materialy/* (ZANIM zadziała passthrough!)
  if (url.pathname.startsWith('/materialy/')) {
    if (isAdBot) {
      return notFoundResponse();
    }

    const lowerMatPath = url.pathname.toLowerCase();
    if (lowerMatPath === '/materialy/pakiet-kart-sytuacyjnych-dla-taty-happybirth.html') {
      const session = await getEdgeSession(context.request, context.env);
      if (!session?.email) {
        return redirectToStrefaLogin(url.pathname + url.search);
      }

      const cleanEmail = session.email.trim().toLowerCase();
      let authorized = isTeamWhitelistedEmail(cleanEmail);
      if (!authorized && context.env.DB) {
        try {
          const effUserId = await resolveD1UserId(context.env.DB, session.userId, cleanEmail);
          const enr = await context.env.DB.prepare(
            `SELECT 1 AS ok FROM enrollments WHERE user_id = ? AND status = 'active' AND order_bump_included = 1 LIMIT 1`
          )
            .bind(effUserId)
            .first();
          const ord = await context.env.DB.prepare(
            `SELECT 1 AS ok FROM orders WHERE (user_id = ? OR LOWER(customer_email) = ?) AND status IN ('paid', 'partially_refunded') AND order_bump_included = 1 LIMIT 1`
          )
            .bind(effUserId, cleanEmail)
            .first();
          authorized = Boolean(enr?.ok || ord?.ok);
        } catch {
          authorized = false;
        }
      }

      if (!authorized) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: 'https://strefa.happybirth.pl/?upsell=order_bump',
            'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          },
        });
      }
    } else if (lowerMatPath === '/materialy/szybkie-i-odzywcze-obiady-15-min-happybirth.html') {
      const session = await getEdgeSession(context.request, context.env);
      if (!session?.email) {
        return redirectToStrefaLogin(url.pathname + url.search);
      }

      const cleanEmail = session.email.trim().toLowerCase();
      let authorized = isTeamWhitelistedEmail(cleanEmail);
      if (!authorized && context.env.DB) {
        try {
          const effUserId = await resolveD1UserId(context.env.DB, session.userId, cleanEmail);
          const rewardRow = await context.env.DB.prepare(
            `SELECT 1 AS ok FROM student_referrals WHERE referrer_user_id = ? AND reward_unlocked = 1 LIMIT 1`
          )
            .bind(effUserId)
            .first();
          authorized = Boolean(rewardRow?.ok);
        } catch {
          authorized = false;
        }
      }

      if (!authorized) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: 'https://strefa.happybirth.pl/',
            'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
          },
        });
      }
    }

    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { noIndex: true });
  }

  // 1. Przepuść bez zmian wyłącznie prawdziwe zasoby statyczne (CSS/JS/obrazy/fonty), SEO/GEO txt na głównej oraz endpointy API
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/llms.txt' ||
    url.pathname === '/llms-full.txt' ||
    STATIC_ASSET_EXT_REGEX.test(url.pathname)
  ) {
    const res = await context.next();
    return withSecurityAndTrackingHeaders(res, { noIndex: false });
  }

  // 2. SUBDOMENA B2B: partnerzy.happybirth.pl
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
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true, allowAffiliateCookie });
    }
    return notFoundResponse();
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
    if (cleanPath === '/' || cleanPath === '/afiliacja') {
      const targetUrl = new URL(url.toString());
      targetUrl.pathname = url.pathname.endsWith('.txt') ? '/afiliacja.txt' : '/afiliacja';
      const res = await context.env.ASSETS.fetch(targetUrl);
      return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true, allowAffiliateCookie });
    }
    return notFoundResponse();
  }

  // 4. SUBDOMENA KURSANTKI: strefa.happybirth.pl (TWARDY PAYWALL CAŁEJ STREFY)
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

    const subPath = cleanPath.replace(/^\/strefa/, '') || '/';
    const isLoginRoute = subPath === '/login';
    const isFreeLessonRoute =
      /^\/lekcja\/(lekcja-\d+)$/.test(subPath) && FREE_PREVIEW_LESSONS.has(subPath.split('/')[2]);
    const rawStripeSessionId = (url.searchParams.get('session_id') || '').trim();
    const isPostStripeReturn = subPath === '/' && rawStripeSessionId.startsWith('cs_');

    if (!isLoginRoute && !isFreeLessonRoute && !isPostStripeReturn) {
      const session = await getEdgeSession(context.request, context.env);
      const entitled = session
        ? await hasActiveCourseEntitlementD1(context.env.DB, session.userId, session.email)
        : false;

      if (!session || !entitled) {
        return redirectToStrefaLogin(`${subPath}${url.search}`);
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

  // 5. DOMENA GŁÓWNA PRODUKCYJNA (happybirth.pl / www.happybirth.pl / *.pages.dev)
  const vanityMatch = cleanPath.match(/^\/(?:poleca|kod)\/([a-zA-Z0-9_-]{2,40})$/i);
  if (vanityMatch) {
    const rawToken = vanityMatch[1];
    const upperCode = rawToken.toUpperCase();
    const lowerSlug = rawToken.toLowerCase();
    const redirectRes = new Response(null, {
      status: 302,
      headers: {
        Location: `${url.origin}/?promo=${encodeURIComponent(upperCode)}&kod=${encodeURIComponent(upperCode)}&poleca=${encodeURIComponent(lowerSlug)}#cena`,
      },
    });
    return withSecurityAndTrackingHeaders(redirectRes, {
      refParam: lowerSlug,
      noIndex: true,
      allowAffiliateCookie,
    });
  }

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
    return withSecurityAndTrackingHeaders(res, { refParam, noIndex: true, allowAffiliateCookie });
  }

  const res = await context.next();
  return withSecurityAndTrackingHeaders(res, { refParam, noIndex: false, allowAffiliateCookie });
}
