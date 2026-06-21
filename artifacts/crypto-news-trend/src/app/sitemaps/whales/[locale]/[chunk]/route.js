// app/sitemaps/whales/[locale]/[chunk]/route.js
// Serves: /sitemaps/whales/en/1.xml etc.

import { createChunkRoute } from "@/lib/sitemap/createChunkRoute";
import { REVALIDATE_WHALES } from "@/lib/sitemap/configer";

const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

async function fetchPage(locale, page) {
  try {
    const res = await fetch(
      `${BASE_API}/api/whales_alert/${locale}/?page=${page}`,
      { next: { revalidate: REVALIDATE_WHALES, tags: [`whales-${locale}`] } }
    );
    if (!res.ok) return [];
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

function mapItem(item) {
  // your getAlertDetailsByHash route is /crypto-whales/[hash]
  return {
    path: `/crypto-whales/${item.hash}`,
    lastModified: item.updated_at || item.created_at || item.timestamp,
    changeFrequency: "monthly", // whale alerts are historical once published
    priority: 0.5,
  };
}

export const { GET, revalidate } = createChunkRoute({
  fetchPage,
  mapItem,
  revalidate: REVALIDATE_WHALES,
});
