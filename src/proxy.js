import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ['de', 'ru', 'ar', 'zh-CN', 'en', 'es', 'fr', 'ur'];
let defaultLocale = 'en';

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Files aur Static Assets ko bypass karein (For Performance)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // images, sitemap.xml, robots.txt
  ) {
    return NextResponse.next();
  }

  // 2. Check karein ke URL mein pehle se locale hai ya nahi
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // --- LOGIC: Agar URL mein /en/ hai to usay Clean karein ---
  if (pathnameHasLocale) {
    if (pathname.startsWith('/en/') || pathname === '/en') {
      const strippedPath = pathname.replace(/^\/en/, '') || '/';
      // URL clean kar do: /en/about-us -> /about-us
      return NextResponse.redirect(new URL(strippedPath, request.url), 301);
    }
    // Baaki locales (ur, ar, etc.) ke liye seedha jane dein
    return NextResponse.next();
  }

  // 3. AGAR locale nahi hai (e.g., direct /about-us ya /privacy-policy)
  const locale = getLocale(request);

  // --- LOGIC: English users ke liye REWRITE ---
  if (locale === 'en') {
    // Ye line sabse zaroori hai: 
    // Browser URL: /privacy-policy (Clean)
    // Server Load: /en/privacy-policy (Internal)
    return NextResponse.rewrite(new URL(`/en${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
  }

  // 4. Non-English users ke liye Redirect (e.g., /ur/about-us)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url), 301);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|rss|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};