// lib/sitemap/createChunkRoute.js
//
// Factory for "simple" sitemap chunk routes (whales, ico, events, coin-analysis).
// News has its own route (app/sitemaps/news/[locale]/[chunk]/route.js) because
// it needs the backend-page-merging logic. These four content types follow
// an identical pattern, so we generate the GET handler once and reuse it —
// less code to maintain, and if you fix a bug here it's fixed everywhere.

import { notFound } from "next/navigation";
import { VALID_LOCALES, URLS_PER_CHUNK, buildUrl } from "@/lib/sitemap/configer";
import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap/xml";

const BACKEND_PAGE_SIZE = 20;
const BACKEND_PAGES_PER_CHUNK = Math.ceil(URLS_PER_CHUNK / BACKEND_PAGE_SIZE);

/**
 * @param {Object} opts
 * @param {(locale: string, page: number) => Promise<any[]>} opts.fetchPage
 *   Given a locale + backend page number, return an array of raw items.
 * @param {(item: any, locale: string) => Object} opts.mapItem
 *   Given one raw item, return { path, lastModified, changeFrequency, priority }
 * @param {number} opts.revalidate
 */
export function createChunkRoute({ fetchPage, mapItem, revalidate }) {
  async function GET(request, { params }) {
    const { locale, chunk } = await params;

    if (!VALID_LOCALES.includes(locale)) return notFound();
    const chunkNum = parseInt(chunk, 10);
    if (!chunkNum || chunkNum < 1) return notFound();

    const startPage = (chunkNum - 1) * BACKEND_PAGES_PER_CHUNK + 1;
    const endPage = startPage + BACKEND_PAGES_PER_CHUNK - 1;

    const pagePromises = [];
    for (let p = startPage; p <= endPage; p++) {
      pagePromises.push(fetchPage(locale, p));
    }
    const pages = await Promise.all(pagePromises);
    const allItems = pages.flat();

    if (allItems.length === 0) return notFound();

    const entries = allItems.map((item) => {
      const mapped = mapItem(item, locale);
      return {
        url: buildUrl(locale, mapped.path),
        lastModified: mapped.lastModified || new Date(),
        changeFrequency: mapped.changeFrequency || "weekly",
        priority: mapped.priority ?? 0.6,
      };
    });

    return xmlResponse(buildUrlsetXml(entries));
  }

  return { GET, revalidate };
}
