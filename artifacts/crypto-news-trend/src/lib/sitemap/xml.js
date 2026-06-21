// lib/sitemap/xml.js
// Tiny, dependency-free XML builders. No need for an npm package —
// sitemap XML is simple enough that a package just adds weight and
// another thing that can break on a Next.js upgrade.

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds a <sitemapindex> XML document (the master file).
 * entries: [{ url: string, lastModified: Date|string }]
 */
export function buildSitemapIndexXml(entries) {
  const items = entries
    .map((e) => {
      const lastmod = e.lastModified
        ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`
        : "";
      return `  <sitemap>\n    <loc>${escapeXml(e.url)}</loc>\n    ${lastmod}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`;
}

/**
 * Builds a <urlset> XML document (a single child sitemap, e.g. news/en/3.xml).
 * entries: [{
 *   url, lastModified, changeFrequency, priority,
 *   alternates: { languages: { en: url, ur: url, ... } } // optional, for hreflang
 * }]
 */
export function buildUrlsetXml(entries) {
  const items = entries
    .map((e) => {
      const lastmod = e.lastModified
        ? `\n    <lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`
        : "";
      const freq = e.changeFrequency
        ? `\n    <changefreq>${e.changeFrequency}</changefreq>`
        : "";
      const priority =
        e.priority !== undefined ? `\n    <priority>${e.priority}</priority>` : "";

      let alternates = "";
      if (e.alternates?.languages) {
        alternates = Object.entries(e.alternates.languages)
          .map(
            ([hreflang, href]) =>
              `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(
                hreflang
              )}" href="${escapeXml(href)}" />`
          )
          .join("");
      }

      return `  <url>\n    <loc>${escapeXml(
        e.url
      )}</loc>${lastmod}${freq}${priority}${alternates}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${items}\n</urlset>`;
}

export function xmlResponse(xmlString) {
  return new Response(xmlString, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Browser/CDN cache as a safety net; real freshness control is the
      // Next.js `revalidate` export in each route, not this header.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
