// import { NextResponse } from "next/server";
// import { match } from "@formatjs/intl-localematcher";
// import Negotiator from "negotiator";

// let locales = ['de','ru','ar','zh-CN','en', 'es', 'fr', 'ur'];
// let defaultLocale = 'en';

// function getLocale(request) {
//   const negotiatorHeaders = {};
//   request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
//   const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
//   return match(languages, locales, defaultLocale);
// }

// export function proxy(request) {
//   const { pathname } = request.nextUrl;

//   // 1. Check if the pathname already has a locale
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   // --- NAYA LOGIC YAHAN HAI ---
//   // Agar locale hai, toh headers set karke next() karo
//   if (pathnameHasLocale) {
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('x-url', pathname); // URL ko header mein daal diya

//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   }

//   // 2. Redirect if there is no locale
//   const locale = getLocale(request);
//   request.nextUrl.pathname = `/${locale}${pathname}`;
  
//   return NextResponse.redirect(request.nextUrl,301);
// }

// export const config = {
//   matcher: [
//     // '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|images|assets|svg|sitemap.xml|robots.txt).|.*\\.[\\w]+$).*)',
//     '/((?!api|_next/static|_next/image|favicon.ico|rss|manifest.json|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)',
//   ],
// };


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

  // 1. Files aur Ahrefs ko bypass karein
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/ahrefs_') ||
    pathname.includes('.') // images, robots.txt, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Check karein ke URL mein pehle se locale hai ya nahi
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // AGAR koi manually /en/about par jaye, toh usse root /about par bhej do (SEO cleanup)
    if (pathname.startsWith('/en/') || pathname === '/en') {
      const strippedPath = pathname.replace('/en', '') || '/';
      return NextResponse.redirect(new URL(strippedPath, request.url), 301);
    }
    
    // Baaki languages (ur, ar, etc.) ke liye request aage jane dein
    return NextResponse.next();
  }

  // 3. Default Locale (English) Handling
  const locale = getLocale(request);

  // Agar browser language English hai ya koi locale nahi mila
  if (locale === 'en') {
    // REWRITE: URL wahi rahega (/), lekin content [locale]/en wala load hoga
    return NextResponse.rewrite(new URL(`/en${pathname}`, request.url));
  }

  // 4. Baaki languages ke liye Redirect karein (e.g. /ur)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url), 301);
}

export const config = {
  matcher: [
    // Sab kuch match karo siwaye in files ke
    '/((?!api|_next/static|_next/image|favicon.ico|rss|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};