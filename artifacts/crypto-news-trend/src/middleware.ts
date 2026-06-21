import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'ur', 'es', 'ru', 'fr', 'de', 'ar', 'zh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ FIX: sitemap/*.xml URLs explicitly skip karo
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/sitemap/') ||  // ← yeh already tha
    pathname.endsWith('.xml')            // ← yeh naya add karo
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

// ✅ FIX: Matcher mein bhi .xml exclude karo
export const config = {
  matcher: [
'/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|manifest\\.json|manifest\\.webmanifest|.*\\.xml$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'  ],
};