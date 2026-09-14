import { NextRequest, NextResponse } from 'next/server';

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

  const isDev = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // -------------------------------------------------------------
  // A. STREFA PARTNERA / AFILIACJA B2B (partnerzy.happybirth.pl)
  // -------------------------------------------------------------
  const isPartnerzyHost = hostname.startsWith('partnerzy.');
  if (isPartnerzyHost) {
    if (!url.pathname.startsWith('/partnerzy')) {
      url.pathname = `/partnerzy${url.pathname === '/' ? '' : url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // -------------------------------------------------------------
  // B. STREFA KURSANTKI (strefa.happybirth.pl lub strefa.localhost)
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
    // Bezwzględna ochrona prywatności medycznej przed botami Meta Ads i Google Ads
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // -------------------------------------------------------------
  // C. DOMENA GŁÓWNA MARKETINGOWA (happybirth.pl lub localhost:3000)
  // -------------------------------------------------------------
  // Jeśli użytkownik wpisze ścieżkę kursantki na domenie głównej:
  const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login', '/standard-medyczny'];
  const isStudentRoute = studentRoutes.some((route) => url.pathname.startsWith(route));

  if (isStudentRoute) {
    if (!isDev) {
      return NextResponse.redirect(`https://strefa.happybirth.pl${url.pathname}${url.search}`);
    } else {
      url.pathname = `/strefa${url.pathname}`;
      const response = NextResponse.rewrite(url);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return response;
    }
  }

  // Jeśli użytkownik wchodzi na /partnerzy na produkcji
  if (!isDev && url.pathname.startsWith('/partnerzy')) {
    return NextResponse.redirect(`https://partnerzy.happybirth.pl${url.pathname.replace(/^\/partnerzy/, '') || '/'}`);
  }

  // Przepisz główną ścieżkę / na dedykowaną stronę marketingową
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = '/marketing';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
