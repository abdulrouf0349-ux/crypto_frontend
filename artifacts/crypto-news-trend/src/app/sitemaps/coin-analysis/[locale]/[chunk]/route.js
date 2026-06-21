// app/sitemaps/coin-analysis/[locale]/[chunk]/route.js
// Serves: /sitemaps/coin-analysis/en/1.xml etc.
// Also covers your /glossary listing since it shares the fetchCoins endpoint.

import { createChunkRoute } from "@/lib/sitemap/createChunkRoute";
import { REVALIDATE_COIN_ANALYSIS } from "@/lib/sitemap/configer";

const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

async function fetchPage(locale, page) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      search: "",
      type: "all",
      locale,
    });
    const res = await fetch(`${BASE_API}/api/coins?${params.toString()}`, {
      next: { revalidate: REVALIDATE_COIN_ANALYSIS, tags: ["glossary", `${locale}-glossary-all`] },
    });
    if (!res.ok) return [];
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

function mapItem(item) {
  return {
    // your generateStaticParams comment implies /coin-analysis/[slug]
    path: `/coin-analysis/${item.slug}`,
    lastModified: item.updated_at || item.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  };
}

export const { GET, revalidate } = createChunkRoute({
  fetchPage,
  mapItem,
  revalidate: REVALIDATE_COIN_ANALYSIS,
});
