import { NextRequest, NextResponse } from 'next/server';
import { AFFILIATE_COOKIE_NAME, AFFILIATE_COOKIE_MAX_AGE_SECONDS } from '@/lib/affiliate';

const AD_BOT_REGEX = /Facebot|facebookexternalhit|Meta-ExternalAgent|AdsBot-Google|Mediapartners-Google|Bytespider|TikTok/i;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get('host') || '').toLowerCase();
  const userAgent = request.headers.get('user-agent') || '';
  const isAdBot = AD_BOT_REGEX.test(userAgent);

  // 1. Bypass statycznych zasobów, obrazów, fontów i API
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // [D2] Obsługa 30-dniowego ciasteczka atrybucji afiliacyjnej First-Party (?ref=)
  const refParam = url.searchParams.get('ref');
  const attachHeaders = (res: NextResponse, noIndex = false) => {
    if (noIndex) {
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    }
    if (refParam && /^[a-zA-Z0-9_-]{2,40}$/.test(refParam)) {
      res.cookies.set(AFFILIATE_COOKIE_NAME, refParam.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
        path: '/',
      });
    }
    return res;
  };

  // -------------------------------------------------------------
  // A. SUBDOMENA PARTNERZY (partnerzy.happybirth.pl -> /partnerzy)
  // -------------------------------------------------------------
  if (hostname.startsWith('partnerzy.')) {
    if (isAdBot) {
      return new NextResponse('Access restricted for ad crawlers.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/partnerzy';
      return attachHeaders(NextResponse.rewrite(url), true);
    }
    return attachHeaders(NextResponse.next(), true);
  }

  // -------------------------------------------------------------
  // A2. SUBDOMENA AFILIACJA (afiliacja.happybirth.pl -> /afiliacja)
  // -------------------------------------------------------------
  if (hostname.startsWith('afiliacja.')) {
    if (isAdBot) {
      return new NextResponse('Access restricted for ad crawlers.', {
        status: 403,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet' },
      });
    }
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/afiliacja';
      return attachHeaders(NextResponse.rewrite(url), true);
    }
    return attachHeaders(NextResponse.next(), true);
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
    if (!url.pathname.startsWith('/strefa')) {
      url.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }
    return attachHeaders(NextResponse.rewrite(url), true);
  }

  // -------------------------------------------------------------
  // C. DOMENA GŁÓWNA PRODUKCYJNA (happybirth.pl / www.happybirth.pl)
  //    Twarda separacja subdomen (301 Redirect)
  // -------------------------------------------------------------
  const isMainProdHost = hostname === 'happybirth.pl' || hostname === 'www.happybirth.pl';
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentShortRoute = studentRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(`${route}/`)
  );
  const isStrefaPath = url.pathname === '/strefa' || url.pathname.startsWith('/strefa/');
  const isPartnerzyPath = url.pathname === '/partnerzy' || url.pathname.startsWith('/partnerzy/');
  const isAfiliacjaPath = url.pathname === '/afiliacja' || url.pathname.startsWith('/afiliacja/');

  if (isMainProdHost) {
    if (isStrefaPath || isStudentShortRoute) {
      const cleanSubpath = isStrefaPath
        ? url.pathname.replace(/^\/strefa/, '') || '/'
        : url.pathname;
      return NextResponse.redirect(`https://strefa.happybirth.pl${cleanSubpath}${url.search}`, 301);
    }
    if (isPartnerzyPath) {
      return NextResponse.redirect(`https://partnerzy.happybirth.pl/${url.search}`, 301);
    }
    if (isAfiliacjaPath) {
      return NextResponse.redirect(`https://partnerzy.happybirth.pl/afiliacja${url.search}`, 301);
    }
  }

  // Lokalny development (localhost:3000)
  if (isStudentShortRoute) {
    url.pathname = `/strefa${url.pathname}`;
    return attachHeaders(NextResponse.rewrite(url), true);
  }
  if (isStrefaPath || isPartnerzyPath || isAfiliacjaPath) {
    return attachHeaders(NextResponse.next(), true);
  }

  return attachHeaders(NextResponse.next(), false);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
