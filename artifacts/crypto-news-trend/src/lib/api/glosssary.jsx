import { cache } from "react";

/**
 * 1. Fetch Coins List (Cached for 24 hours + Request Deduplication)
 * Best for: Glossary listing pages, pagination, and type filters.
 */
export const fetchCoins = cache(async function fetchCoinsRaw(page = 1, search = '', type = 'all', locale = 'en') {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      search,
      type,
      locale,
    });

    const url = `https://crytponews.fun/api/coins?${params.toString()}`;

    // ISR: Cache for 24 Hours (86400 seconds)
    const res = await fetch(url, {
      next: {
        revalidate: 86400, 
        tags: ['glossary', `${locale}-glossary-${type}`],
      },
    });

    if (res.status === 404 || !res.ok) {
      return { data: [], metadata: { total_pages: 1, total_items: 0 } };
    }

    const result = await res.json();
    return result;

  } catch (error) {
    console.error('Network Error in fetchCoins:', error);
    return { data: [], metadata: { total_pages: 1, total_items: 0 } };
  }
});


/**
 * 2. Fetch Single Coin Details (Permanent SSG Cache + Request Deduplication)
 * Best for: generateStaticParams(), generateMetadata(), and specific coin dynamic slug pages.
 */
async function fetchCoinDetailRaw(slug, locale = "en") {
  try {
    const url = `https://crytponews.fun/api/coins/${slug}/?locale=${locale}`;

    // PERMANENT CACHE: Force cache rules for dynamic params to ensure SSG compilation
    const res = await fetch(url, {
      cache: 'force-cache', 
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Network Error in fetchCoinDetail:", error);
    return null;
  }
}

// React Cache wrappers ensure that multi-pass layouts don't trigger redundant API hits
export const fetchCoinDetail = cache(fetchCoinDetailRaw);