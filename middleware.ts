import { NextRequest, NextResponse } from 'next/server';
import { AFFILIATE_COOKIE_NAME, AFFILIATE_COOKIE_MAX_AGE_SECONDS } from '@/lib/affiliate';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

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
  const attachAffiliateCookie = (res: NextResponse) => {
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
  const isPartnerzyHost = hostname.startsWith('partnerzy.');
  if (isPartnerzyHost) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/partnerzy';
      return attachAffiliateCookie(NextResponse.rewrite(url));
    }
    return attachAffiliateCookie(NextResponse.next());
  }

  // -------------------------------------------------------------
  // A2. SUBDOMENA AFILIACJA (afiliacja.happybirth.pl -> /afiliacja)
  // -------------------------------------------------------------
  const isAfiliacjaHost = hostname.startsWith('afiliacja.');
  if (isAfiliacjaHost) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/afiliacja';
      return attachAffiliateCookie(NextResponse.rewrite(url));
    }
    return attachAffiliateCookie(NextResponse.next());
  }

  // -------------------------------------------------------------
  // B. STREFA KURSANTKI (strefa.happybirth.pl lub /strefa/*)
  // -------------------------------------------------------------
  const isStrefaHost = hostname.startsWith('strefa.');
  const isStrefaPath = url.pathname.startsWith('/strefa');
  const isStrefaParam = url.searchParams.get('site') === 'strefa';
  const isStrefa = isStrefaHost || isStrefaParam || isStrefaPath;

  if (isStrefa) {
    if (!url.pathname.startsWith('/strefa')) {
      url.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }

    const response = NextResponse.rewrite(url);
    // [E5] Bezwzględna ochrona prywatności medycznej przed botami Meta Ads i Google Ads
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // -------------------------------------------------------------
  // C. DOMENA GŁÓWNA (happybirth.pl / localhost:3000)
  //    Obsługuje bezpośrednio: /, /program, /o-nas, /partnerzy,
  //    /afiliacja, /odstap-od-umowy, /plan-porodu, /kalkulator-wyprawki
  // -------------------------------------------------------------
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentRoute = studentRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(`${route}/`)
  );

  if (isStudentRoute) {
    url.pathname = `/strefa${url.pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  return attachAffiliateCookie(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
