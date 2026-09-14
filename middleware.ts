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

  const isStrefaHost = hostname.startsWith('strefa.');
  const isDev = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isStrefaPath = url.pathname.startsWith('/strefa');
  const isStrefaParam = url.searchParams.get('site') === 'strefa';

  const isStrefa = isStrefaHost || isStrefaParam || isStrefaPath;

  if (isStrefa) {
    // -------------------------------------------------------------
    // STREFA KURSANTKI (strefa.happybirth.pl lub strefa.localhost)
    // -------------------------------------------------------------
    if (!url.pathname.startsWith('/strefa')) {
      url.pathname = `/strefa${url.pathname === '/' ? '' : url.pathname}`;
    }

    const response = NextResponse.rewrite(url);
    // Bezwzględna ochrona prywatności medycznej przed botami Meta Ads i Google Ads
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  } else {
    // -------------------------------------------------------------
    // DOMENA GŁÓWNA MARKETINGOWA (happybirth.pl lub localhost:3000)
    // -------------------------------------------------------------
    const studentRoutes = ['/lekcje', '/lekcja', '/apteczka', '/licznik', '/partner', '/login'];
    const isStudentRoute = studentRoutes.some((route) => url.pathname.startsWith(route));

    if (isStudentRoute) {
      if (!isDev) {
        // Na produkcji przekieruj ze strony marketingowej do właściwej subdomeny
        return NextResponse.redirect(`https://strefa.happybirth.pl${url.pathname}${url.search}`);
      } else {
        // W dev przepisz transparentnie do /strefa/...
        url.pathname = `/strefa${url.pathname}`;
        const response = NextResponse.rewrite(url);
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        return response;
      }
    }

    // Przepisz główną ścieżkę / na dedykowaną stronę marketingową
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/marketing';
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Dopasuj wszystkie ścieżki za wyjątkiem zasobów statycznych:
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
