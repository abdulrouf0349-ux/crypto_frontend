// app/sitemap.xml/route.js
//
// ⭐ THIS IS THE ONLY URL YOU SUBMIT TO GOOGLE SEARCH CONSOLE:
//      https://cryptonewstrend.com/sitemap.xml
//
// It is a REAL <sitemapindex> (unlike Next.js's built-in generateSitemaps,
// which only outputs flat numbered sitemaps with no master index — see
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).
//
// HOW IT AVOIDS REPEATED API CALLS:
// This route is cached for `revalidate` seconds (1 hour below). During that
// hour, no matter how many times Googlebot / Bingbot / GPTBot / ClaudeBot
// request /sitemap.xml, Next.js serves the cached HTML — your "count" API
// calls below run AT MOST once per hour, not once per crawl.
//
// It calls each API ONCE per locale, asking only for page=1 (which every
// one of your existing fetch functions already supports) and reads the
// pagination metadata to know the total item count. That single page=1
// call is itself cached/deduped by `next: { revalidate }`, matching the
// cache window your real pages already use — so this index doesn't add
// any new load beyond what your pages already generate.

import { VALID_LOCALES,REVALIDATE_STATIC,REVALIDATE_INDEX, REVALIDATE_NEWS,REVALIDATE_ICO,REVALIDATE_EVENTS,REVALIDATE_GLOSSARY,REVALIDATE_COIN_ANALYSIS,REVALIDATE_WHALES, SITE_URL, chunkCount } from "@/lib/sitemap/configer";
import { buildSitemapIndexXml, xmlResponse } from "@/lib/sitemap/xml";


const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

async function safeJson(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function readTotal(data, fallbackPerPage = 20) {
  if (!data) return 0;
  const meta = data.metadata || data;
  if (typeof meta.total_items === "number") return meta.total_items;
  if (typeof meta.count === "number") return meta.count;
  if (typeof meta.total_pages === "number") return meta.total_pages * fallbackPerPage;
  return 0;
}

async function countFor(type, locale) {
  const apiLocale = locale === "zh" ? "zh-cn" : locale;

  switch (type) {
    case "news": {
      const url =
        locale === "en"
          ? `${BASE_API}/api/getdata/?page=1`
          : `${BASE_API}/api/getdata/${apiLocale}/?page=1`;
      const data = await safeJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ news: "all" }),
        next: { revalidate: REVALIDATE_NEWS, tags: [`news-${locale}`] },
      });
      return readTotal(data);
    }
    case "whales": {
      const data = await safeJson(
        `${BASE_API}/api/whales_alert/${locale}/?page=1`,
        { next: { revalidate: REVALIDATE_WHALES, tags: [`whales-${locale}`] } }
      );
      return readTotal(data);
    }
    case "ico": {
      const data = await safeJson(
        `${BASE_API}/api/ico_data/${locale}/?status=Active&page=1`,
        { next: { revalidate: REVALIDATE_ICO, tags: [`ico-${locale}`] } }
      );
      return readTotal(data);
    }
    case "events": {
      const data = await safeJson(
        `${BASE_API}/api/get-events/${locale}/?page=1`,
        { next: { revalidate: REVALIDATE_EVENTS, tags: ["events", `${locale}-events`] } }
      );
      return readTotal(data);
    }
    case "coin-analysis": {
      const data = await safeJson(
        `${BASE_API}/api/coins?page=1&search=&type=all&locale=${locale}`,
        { next: { revalidate: REVALIDATE_COIN_ANALYSIS, tags: ["glossary", `${locale}-glossary-all`] } }
      );
      return readTotal(data);
    }
    default:
      return 0;
  }
}

const CONTENT_TYPES = ["news", "whales", "ico", "events", "coin-analysis"];

export async function GET() {
  const now = new Date();
  const entries = [
    // Static pages sitemap — always included, no API call needed
    { url: `${SITE_URL}/sitemaps/static.xml`, lastModified: now },
  ];

  // Fan out: for every (contentType x locale) pair, get the count, in parallel.
  // 5 types x 8 locales = 40 lightweight calls, ONCE PER HOUR (not per crawl),
  // each one reusing the exact same cached page=1 request your real pages use.
  const jobs = [];
  for (const type of CONTENT_TYPES) {
    for (const locale of VALID_LOCALES) {
      jobs.push(
        countFor(type, locale).then((total) => ({
          type,
          locale,
          chunks: chunkCount(total),
        }))
      );
    }
  }

  const results = await Promise.all(jobs);

  for (const { type, locale, chunks } of results) {
    for (let i = 1; i <= chunks; i++) {
      entries.push({
        url: `${SITE_URL}/sitemaps/${type}/${locale}/${i}.xml`,
        lastModified: now,
      });
    }
  }

  return xmlResponse(buildSitemapIndexXml(entries));
}
