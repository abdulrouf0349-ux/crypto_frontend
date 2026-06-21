// app/sitemaps/news/[locale]/[chunk]/route.js
//
// Serves: /sitemaps/news/en/1.xml, /sitemaps/news/ur/3.xml, etc.
//
// KEY IDEA: this route ONLY fetches the news data it needs for THIS chunk
// (e.g. chunk 1 = items 1-1000), not your whole news table. And because
// `revalidate` is set, repeated crawls of the SAME chunk within the window
// reuse the cached render — no new API hit.
//
// hreflang: for every article we ALSO ask "does this slug exist in other
// locales" — but instead of N extra API calls, we rely on the simplest
// safe approach: link to the *translated slug if your API returns one on
// the news item* (commonly `translations: { ur: 'slug-here', ... }`).
// If your API does NOT return cross-locale slugs on the news object, set
// `alternates` to null below (see comment) and Google will treat each
// locale's article as a fully separate piece of content rather than a
// translation — which is acceptable but not optimal. Tell me if your
// /api/getdata response includes translation slugs and I'll wire it in.

import { VALID_LOCALES, URLS_PER_CHUNK, REVALIDATE_NEWS, buildUrl, toApiLocale } from "@/lib/sitemap/configer";
import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap/xml";
import { notFound } from "next/navigation";


const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

// Your real API paginates by its own page size (looks like 20/page based on
// your code). We need URLS_PER_CHUNK (1000) news items per sitemap chunk,
// so we map 1 sitemap chunk -> several backend pages and merge them.
const BACKEND_PAGE_SIZE = 20;
const BACKEND_PAGES_PER_CHUNK = Math.ceil(URLS_PER_CHUNK / BACKEND_PAGE_SIZE);

async function fetchNewsPage(locale, page) {
  const apiLocale = toApiLocale(locale);
  const url =
    locale === "en"
      ? `${BASE_API}/api/getdata/?page=${page}`
      : `${BASE_API}/api/getdata/${apiLocale}/?page=${page}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ news: "all" }),
      next: { revalidate: REVALIDATE_NEWS, tags: [`news-${locale}`] },
    });
    if (!res.ok) return { items: [] };
    const data = await res.json();
    // Adjust this line if your real response shape differs
    // (you showed `Page_NewsData` returning the raw `data` object directly)
    const items = data?.data || data?.results || [];
    return { items };
  } catch {
    return { items: [] };
  }
}

export async function GET(request, { params }) {
  const { locale, chunk } = await params;

  if (!VALID_LOCALES.includes(locale)) return notFound();
  const chunkNum = parseInt(chunk, 10);
  if (!chunkNum || chunkNum < 1) return notFound();

  // chunk 1 -> backend pages 1..N, chunk 2 -> next N pages, etc.
  const startPage = (chunkNum - 1) * BACKEND_PAGES_PER_CHUNK + 1;
  const endPage = startPage + BACKEND_PAGES_PER_CHUNK - 1;

  const pageFetches = [];
  for (let p = startPage; p <= endPage; p++) {
    pageFetches.push(fetchNewsPage(locale, p));
  }
  const pageResults = await Promise.all(pageFetches);
  const allItems = pageResults.flatMap((r) => r.items);

  if (allItems.length === 0) return notFound();

  const entries = allItems.map((article) => {
    const slug = article.slug;
    const path = `/news/${slug}`;

    // If your API returns translation slugs per article, e.g.
    //   article.translations = { en: 'foo', ur: 'foo-ur', es: 'foo-es' }
    // build real hreflang alternates. Otherwise we self-link (safe default).
    let languages = null;
    if (article.translations) {
      languages = {};
      for (const loc of VALID_LOCALES) {
        const translatedSlug = article.translations[loc];
        if (translatedSlug) {
          languages[loc] = buildUrl(loc, `/news/${translatedSlug}`);
        }
      }
      languages["x-default"] = languages.en || buildUrl("en", path);
    }

    return {
      url: buildUrl(locale, path),
      lastModified: article.updated_at || article.published_at || article.created_at || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: languages ? { languages } : undefined,
    };
  });

  return xmlResponse(buildUrlsetXml(entries));
}
