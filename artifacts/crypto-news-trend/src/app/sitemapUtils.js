// ─────────────────────────────────────────
// 📦 Shared Sitemap Utilities
// Har sitemap route (news, ico, static, news-sitemap, image-sitemap) inhi
// helpers ko use karta hai — taake URL building / XML format ek jagah se control ho.
// ─────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cryptonews.fun";

// "en" is NOT in this list on purpose — it's emitted separately (alongside
// x-default) so the canonical English URL doesn't get duplicated as both
// hreflang="en" and hreflang="x-default" pointing at the same place via a
// generic loop. See buildHreflangLinks() below.
export const LOCALES = ["ar", "de", "es", "fr", "it", "ja", "ko", "pt", "ru", "tr", "zh"];

// Max URLs per sitemap file — Google's hard limit is 50,000, but 2k–10k
// per file is the practical sweet spot. Keep this in one place so the
// index (sitemap.xml) and every section route agree on the same number.
export const CHUNK_SIZE = 5000;

// ─────────────────────────────────────────
// URL builders
// ─────────────────────────────────────────

/**
 * Canonical (English, no locale prefix) URL.
 * sectionPath="" => homepage. slug omitted => section landing page.
 */
export function buildCanonicalUrl(sectionPath, slug) {
  if (!sectionPath) return BASE_URL;
  return slug ? `${BASE_URL}/${sectionPath}/${slug}` : `${BASE_URL}/${sectionPath}`;
}

/**
 * Locale-prefixed URL (used inside hreflang alternates).
 */
export function buildLocaleUrl(locale, sectionPath, slug) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  if (!sectionPath) return `${BASE_URL}${prefix}` || BASE_URL;
  return slug ? `${BASE_URL}${prefix}/${sectionPath}/${slug}` : `${BASE_URL}${prefix}/${sectionPath}`;
}

/**
 * Build the full <xhtml:link> block for one URL: explicit hreflang="en",
 * hreflang="x-default" (both pointing at the canonical English URL), plus
 * one link per entry in LOCALES.
 */
export function buildHreflangLinks(sectionPath, slug) {
  const canonicalUrl = buildCanonicalUrl(sectionPath, slug);
  const enLink = `    <xhtml:link rel="alternate" hreflang="en" href="${canonicalUrl}" />`;
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`;
  const otherLinks = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${buildLocaleUrl(locale, sectionPath, slug)}" />`
  ).join("\n");
  return `${enLink}\n${xDefault}\n${otherLinks}`;
}

/**
 * Split an array into CHUNK_SIZE-sized pages.
 */
export function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

// ─────────────────────────────────────────
// XML generators
// ─────────────────────────────────────────

/**
 * Standard hreflang sitemap for one chunk of a section.
 *
 * items: [{ slug, lastmod, changefreq?, priority? }]
 *
 * IMPORTANT: `lastmod` must come from real data (article.updated_at /
 * publish_date etc). Never default this to `new Date()` — that makes
 * every single URL look "changed today" on every crawl, which actively
 * hurts crawl-budget trust with Google.
 */
export function generateSectionXml(items, sectionPath, { changefreq = "daily", priority = "0.7" } = {}) {
  const urlEntries = items
    .map(({ slug, lastmod, changefreq: itemFreq, priority: itemPriority }) => {
      const canonicalUrl = buildCanonicalUrl(sectionPath, slug);
      const hreflangBlock = buildHreflangLinks(sectionPath, slug);

      // No fallback to new Date() here on purpose: if lastmod is missing
      // (DB bug, field not selected, etc) we'd rather omit the tag than
      // tell Google the URL changed today when it didn't.
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";

      // changefreq/priority are largely ignored by Google these days, but
      // cost nothing to include for the other search engines that still read them.
      return `
  <url>
    <loc>${canonicalUrl}</loc>${lastmodTag}
    <changefreq>${itemFreq || changefreq}</changefreq>
    <priority>${itemPriority || priority}</priority>
${hreflangBlock}
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

/**
 * Google News sitemap. No hreflang here — News sitemaps are a different
 * protocol and Google ignores extra namespaces it doesn't expect.
 *
 * items: [{ slug, title, publishedAt, language? }]
 * `language` is per-item so a multilingual newsroom can mix locales in one
 * feed; falls back to `language` passed in options (default "en") if a
 * given article doesn't set one.
 * Caller is responsible for filtering to the last 48h and capping at 1000 items
 * (see app/news-sitemap.xml/route.js).
 */
export function generateNewsXml(items, sectionPath, { publicationName = "CryptoNews", language: defaultLanguage = "en" } = {}) {
  const urlEntries = items
    .map(({ slug, title, publishedAt, language }) => {
      const loc = buildCanonicalUrl(sectionPath, slug);
      return `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>${language || defaultLanguage}</news:language>
      </news:publication>
      <news:publication_date>${publishedAt}</news:publication_date>
      <news:title>${escapeXml(title || "")}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Image sitemap. Only pages that actually have an image are included.
 *
 * items: [{ slug, sectionPath, image, title? }]
 * (sectionPath lives per-item here, not as a single shared argument, because
 * an image sitemap usually mixes pages from several sections — news + coin-analysis etc.)
 *
 * Both <image:title> and <image:caption> are emitted from the same `title`
 * field — harmless duplication, and Discover occasionally surfaces the title.
 */
export function generateImageXml(items) {
  const urlEntries = items
    .filter((item) => item.image)
    .map(({ slug, sectionPath, image, title }) => {
      const loc = buildCanonicalUrl(sectionPath, slug);
      const titleTag = title ? `\n      <image:title>${escapeXml(title)}</image:title>` : "";
      const captionTag = title ? `\n      <image:caption>${escapeXml(title)}</image:caption>` : "";
      return `
  <url>
    <loc>${loc}</loc>
    <image:image>
      <image:loc>${image}</image:loc>${titleTag}${captionTag}
    </image:image>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
}

/**
 * Build the Response with correct headers for any of the XML strings above.
 */
export function xmlResponse(xml, maxAge = 3600) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}