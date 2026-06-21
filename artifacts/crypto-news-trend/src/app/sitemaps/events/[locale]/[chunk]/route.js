// app/sitemaps/events/[locale]/[chunk]/route.js
// Serves: /sitemaps/events/en/1.xml etc.

import { createChunkRoute } from "@/lib/sitemap/createChunkRoute";
import { REVALIDATE_EVENTS, toApiLocale } from "@/lib/sitemap/configer";

const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

async function fetchPage(locale, page) {
  try {
    const res = await fetch(
      `${BASE_API}/api/get-events/${locale}/?page=${page}`,
      { next: { revalidate: REVALIDATE_EVENTS, tags: ["events", `${locale}-events`] } }
    );
    if (!res.ok) return [];
    const result = await res.json();
    return result?.data || [];
  } catch {
    return [];
  }
}

function mapItem(item) {
  return {
    // your fetchEventBySlug implies route /events/[slug]
    path: `/events/${item.slug}`,
    lastModified: item.updated_at || item.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  };
}

export const { GET, revalidate } = createChunkRoute({
  fetchPage,
  mapItem,
  revalidate: REVALIDATE_EVENTS,
});
