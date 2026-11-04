import { NextRequest, NextResponse } from 'next/server';
import { AFFILIATE_COOKIE_NAME, AFFILIATE_COOKIE_MAX_AGE_SECONDS } from '@/lib/affiliate';

const AD_BOT_REGEX = /Facebot|facebookexternalhit|Meta-ExternalAgent|AdsBot-Google|Mediapartners-Google|Bytespider|TikTok/i;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get('host') || '').toLowerCase();
  const userAgent = request.headers.get('user-agent') || '';
  const isAdBot = AD_BOT_REGEX.test(userAgent);

  const attachSecurityAndTracking = (res: NextResponse, noIndex = false) => {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

    if (noIndex) {
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    }

    const refParam = url.searchParams.get('ref');
    if (refParam && /^[a-zA-Z0-9_-]{2,40}$/.test(refParam)) {
      res.cookies.set(AFFILIATE_COOKIE_NAME, refParam.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
        path: '/',
      });
    }

    // [TECH-06] Automatyczna detekcja kraju klientki z nagłówków Edge (Cloudflare cf-ipcountry / x-vercel-ip-country)
    const ipCountry = (
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      ''
    )
      .trim()
      .toUpperCase();
    if (/^[A-Z]{2}$/.test(ipCountry) && ipCountry !== 'XX') {
      res.cookies.set('hb_geo_country', ipCountry, {
        httpOnly: false, // czytelne dla UI oraz /materialy/* (0ms latencji)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }
    return res;
  };

  const STATIC_ASSET_EXT_REGEX =
    /\.(css|js|mjs|map|png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf|eot|mp4|webm|pdf|xml|json|webmanifest)$/i;

  // 1. Bypass wyłącznie prawdziwych zasobów statycznych (CSS/JS/obrazy/fonty), arkuszy /materialy/*, SEO/GEO txt oraz API
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/materialy') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/llms.txt' ||
    url.pathname === '/llms-full.txt' ||
    STATIC_ASSET_EXT_REGEX.test(url.pathname)
  ) {
    return attachSecurityAndTracking(NextResponse.next(), false);
  }

  const cleanPath = (url.pathname.replace(/\.(html|txt)$/i, '') || '/').replace(/\/+$/, '') || '/';

  // -------------------------------------------------------------
  // A. SUBDOMENA PARTNERZY (partnerzy.happybirth.pl -> wyłącznie B2B na root '/')
  // -------------------------------------------------------------
  if (hostname.startsWith('partnerzy.')) {
    if (isAdBot) {
      return new NextResponse('Access restricted for ad crawlers.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (cleanPath === '/' || cleanPath === '/partnerzy') {
      url.pathname = '/partnerzy';
      return attachSecurityAndTracking(NextResponse.rewrite(url), true);
    }
    return new NextResponse('404 Not Found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
    });
  }

  // -------------------------------------------------------------
  // A2. SUBDOMENA AFILIACJA (afiliacja.happybirth.pl -> wyłącznie Afiliacja na root '/')
  // -------------------------------------------------------------
  if (hostname.startsWith('afiliacja.')) {
    if (isAdBot) {
      return new NextResponse('Access restricted for ad crawlers.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (cleanPath === '/' || cleanPath === '/afiliacja') {
      url.pathname = '/afiliacja';
      return attachSecurityAndTracking(NextResponse.rewrite(url), true);
    }
    return new NextResponse('404 Not Found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
    });
  }

  // -------------------------------------------------------------
  // B. SUBDOMENA STREFA KURSANTKI (strefa.happybirth.pl)
  // -------------------------------------------------------------
  if (hostname.startsWith('strefa.')) {
    if (isAdBot) {
      return new NextResponse('Medical student area restricted for ad crawlers.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (cleanPath.startsWith('/afiliacja') || cleanPath.startsWith('/partnerzy')) {
      return new NextResponse('404 Not Found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (!url.pathname.startsWith('/strefa')) {
      url.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }
    return attachSecurityAndTracking(NextResponse.rewrite(url), true);
  }

  // -------------------------------------------------------------
  // C. DOMENA GŁÓWNA PRODUKCYJNA (happybirth.pl / www.happybirth.pl)
  //    Twarda separacja: podstrony /afiliacja, /partnerzy, /marketing, /challenge są zablokowane (404 Not Found)
  // -------------------------------------------------------------
  const isMainProdHost = hostname === 'happybirth.pl' || hostname === 'www.happybirth.pl';
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
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
    return new NextResponse('404 Not Found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
    });
  }

  if (isMainProdHost) {
    if (isPartnerzyPath || isAfiliacjaPath) {
      return new NextResponse('404 Not Found', {
        status: 404,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (isStrefaPath || isStudentShortRoute) {
      if (isAdBot) {
        return new NextResponse('404 Not Found', {
          status: 404,
          headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
        });
      }
      const cleanSubpath = isStrefaPath
        ? cleanPath.replace(/^\/strefa/, '') || '/'
        : cleanPath;
      return NextResponse.redirect(`https://strefa.happybirth.pl${cleanSubpath}${url.search}`, 301);
    }
  }

  // Lokalny development (localhost:3000)
  if (isStudentShortRoute) {
    url.pathname = `/strefa${url.pathname}`;
    return attachSecurityAndTracking(NextResponse.rewrite(url), true);
  }
  if (isStrefaPath || isPartnerzyPath || isAfiliacjaPath) {
    return attachSecurityAndTracking(NextResponse.next(), true);
  }

  return attachSecurityAndTracking(NextResponse.next(), false);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
