// app/sitemaps/ico/[locale]/[chunk]/route.js
// Serves: /sitemaps/ico/en/1.xml etc.

import { createChunkRoute } from "@/lib/sitemap/createChunkRoute";
import { REVALIDATE_ICO } from "@/lib/sitemap/configer";

const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

async function fetchPage(locale, page) {
  try {
    const res = await fetch(
      `${BASE_API}/api/ico_data/${locale}/?status=Active&page=${page}`,
      { next: { revalidate: REVALIDATE_ICO, tags: [`ico-${locale}`] } }
    );
    if (!res.ok) return [];
    const result = await res.json();
    return result?.success ? result.data || [] : [];
  } catch {
    return [];
  }
}

function mapItem(item) {
  return {
    // adjust to your real ICO detail route, e.g. /ico/[slug]
    path: `/ico/${item.slug}`,
    lastModified: item.updated_at || item.created_at,
    changeFrequency: "weekly",
    priority: 0.5,
  };
}

export const { GET, revalidate } = createChunkRoute({
  fetchPage,
  mapItem,
  revalidate: REVALIDATE_ICO,
});
