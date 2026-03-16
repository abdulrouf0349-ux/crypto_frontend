import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ['de','ru','ar','zh-CN','en', 'es', 'fr', 'ur'];
let defaultLocale = 'en';

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // --- NAYA LOGIC YAHAN HAI ---
  // Agar locale hai, toh headers set karke next() karo
  if (pathnameHasLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', pathname); // URL ko header mein daal diya

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|images|assets|svg|sitemap.xml|robots.txt).|.*\\.[\\w]+$).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|rss|manifest.json|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)',
  ],
};