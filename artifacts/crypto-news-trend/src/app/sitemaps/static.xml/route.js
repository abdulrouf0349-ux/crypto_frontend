// app/sitemaps/static.xml/route.js
//
// Serves: /sitemaps/static.xml
// Covers all of your fixed, non-API routes visible in your folder structure:
// about-us, contact, privacy-policy, editorial-policy, terms, disclaimer,
// plus the homepage. No fetches here at all — this is pure configer, so it's
// effectively free to regenerate.

import { VALID_LOCALES, buildAlternates, buildUrl, REVALIDATE_STATIC } from "@/lib/sitemap/configer";
import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap/xml";


// path: "" means homepage
const STATIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/editorial-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
  // Section index pages (the listing pages themselves, not individual items)
  { path: "/coin-analysis", priority: 0.7, changeFrequency: "daily" },
  { path: "/crypto-whales", priority: 0.7, changeFrequency: "daily" },
  { path: "/events", priority: 0.6, changeFrequency: "daily" },
  { path: "/glossary", priority: 0.6, changeFrequency: "weekly" },
];

export async function GET() {
  const now = new Date();
  const entries = [];

  for (const { path, priority, changeFrequency } of STATIC_PATHS) {
    for (const locale of VALID_LOCALES) {
      entries.push({
        url: buildUrl(locale, path),
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages: buildAlternates(path) },
      });
    }
  }

  return xmlResponse(buildUrlsetXml(entries));
}
