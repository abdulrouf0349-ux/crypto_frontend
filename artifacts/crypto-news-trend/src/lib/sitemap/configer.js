// lib/sitemap/config.js
// Central config so every sitemap file agrees on locales, chunk size, and URL shape.

export const SITE_URL = "https://cryptonewstrend.com";

// "en" has no prefix in your URLs (cryptonewstrend.com/news/slug)
// every other locale is prefixed (cryptonewstrend.com/ur/news/slug)
export const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];
export const DEFAULT_LOCALE = "en";

// Hard Google limit is 50,000 / file. We use 1,000 per chunk
export const URLS_PER_CHUNK = 1000;

// ── Next.js Friendly ISR Revalidate Windows ──
// We export these as flat, primitive variables to avoid "Unsupported node type MemberExpression" errors during 'next build'
export const REVALIDATE_NEWS = 300;          // 5 min
export const REVALIDATE_COIN_ANALYSIS = 86400; // 24h
export const REVALIDATE_WHALES = 3600;       // 1h
export const REVALIDATE_ICO = 43200;         // 12h
export const REVALIDATE_EVENTS = 43200;      // 12h
export const REVALIDATE_GLOSSARY = 86400;    // 24h
export const REVALIDATE_STATIC = 86400;      // 24h
export const REVALIDATE_INDEX = 3600;        // 1h

// Fallback configuration object for any backward compatibility in helper functions
export const REVALIDATE = {
  news: REVALIDATE_NEWS,
  coinAnalysis: REVALIDATE_COIN_ANALYSIS,
  whales: REVALIDATE_WHALES,
  ico: REVALIDATE_ICO,
  events: REVALIDATE_EVENTS,
  glossary: REVALIDATE_GLOSSARY,
  static: REVALIDATE_STATIC,
  index: REVALIDATE_INDEX,
};

// API locale mapping quirk you already have (zh -> zh-cn on your backend)
export function toApiLocale(locale) {
  return locale === "zh" ? "zh-cn" : locale;
}

// Builds a public-facing URL respecting the "en has no prefix" rule
export function buildUrl(locale, path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return `${SITE_URL}${cleanPath}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

// Builds the hreflang alternate map for a given path, across all locales
export function buildAlternates(path) {
  const languages = {};
  for (const locale of VALID_LOCALES) {
    languages[locale] = buildUrl(locale, path);
  }
  languages["x-default"] = buildUrl(DEFAULT_LOCALE, path);
  return languages;
}

// Splits an item count into number of chunks, given URLS_PER_CHUNK
export function chunkCount(totalItems) {
  return Math.max(1, Math.ceil(totalItems / URLS_PER_CHUNK));
}