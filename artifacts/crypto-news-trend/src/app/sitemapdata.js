// ─────────────────────────────────────────────────────────────────────────
// 📥 Data Fetchers — apne actual DB/API calls se replace karein
// ─────────────────────────────────────────────────────────────────────────
// Har "full" fetcher ab { offset, limit } accept karta hai, taake har
// sitemap page apne hisse ka data fetch kare — pura section table kabhi
// load na ho, dataset chahe 1,000 rows ho ya 500,000.
//
//   getNewsItems({ offset: 0, limit: 5000 })       -> page 1
//   getNewsItems({ offset: 5000, limit: 5000 })    -> page 2
//
// Return shape (same as before):
//   {
//     slug: string,
//     lastmod: string,        // REQUIRED — real updated_at / publish_date (ISO string)
//     title?: string,         // Google News + Image sitemap ke liye chahiye
//     publishedAt?: string,   // Google News sitemap ke liye chahiye (ISO string)
//     language?: string,      // optional — multilingual newsroom hai to per-article locale (e.g. "ar"), warna default "en" use hoga
//     image?: string,         // absolute image URL — image sitemap ke liye chahiye
//   }
//
// "Count" fetchers neeche alag se diye gaye hain — sitemap index
// (/sitemap.xml) aur paginated section routes (/sitemaps/news-N.xml) dono
// inhi ko use karte hain taake kabhi bhi pura table fetch na ho, sirf
// `SELECT COUNT(*) ...` chale.

export async function getNewsItems({ offset = 0, limit } = {}) {
  // Example:
  // const res = await fetch(
  //   `${process.env.API_URL}/news?fields=slug,updated_at,title,published_at,featured_image,language&offset=${offset}&limit=${limit}`,
  //   { next: { revalidate: 1800 } }
  // );
  // const data = await res.json();
  // return data.articles.map((a) => ({
  //   slug: a.slug,
  //   lastmod: a.updated_at,
  //   title: a.title,
  //   publishedAt: a.published_at,
  //   language: a.language, // omit/undefined if you only publish in English
  //   image: a.featured_image,
  // }));
  //
  // SQL equivalent: SELECT ... FROM news ORDER BY id LIMIT ${limit} OFFSET ${offset}
  return [];
}

export async function getIcoItems({ offset = 0, limit } = {}) {
  // return data.map((i) => ({ slug: i.slug, lastmod: i.updated_at }));
  return [];
}

export async function getEventItems({ offset = 0, limit } = {}) {
  // return data.map((e) => ({ slug: e.slug, lastmod: e.updated_at }));
  return [];
}

export async function getWhaleItems({ offset = 0, limit } = {}) {
  // Whale transaction pages rarely change once published.
  // return data.map((w) => ({ slug: w.hash, lastmod: w.created_at }));
  return [];
}

export async function getGlossaryItems({ offset = 0, limit } = {}) {
  // return data.map((g) => ({ slug: g.slug, lastmod: g.updated_at }));
  return [];
}

export async function getCoinAnalysisItems({ offset = 0, limit } = {}) {
  // return data.map((c) => ({
  //   slug: c.slug,
  //   lastmod: c.updated_at,
  //   title: c.title,
  //   image: c.chart_image_url,
  // }));
  return [];
}

// ─────────────────────────────────────────────────────────────────────────
// 🔢 Count-only fetchers
// ─────────────────────────────────────────────────────────────────────────
// Used by app/sitemap.xml/route.js (to compute how many child sitemaps to
// list) AND by app/sitemaps/[newsSitemap]/route.js (to validate a requested
// page number before fetching that page's slice). Should hit a cheap COUNT
// query, never the full fetchers above.
//
// Example:
//   export async function getNewsCount() {
//     const res = await fetch(`${process.env.API_URL}/news/count`, { next: { revalidate: 1800 } });
//     const { count } = await res.json();
//     return count;
//   }

export async function getNewsCount() {
  return 0;
}

export async function getIcoCount() {
  return 0;
}

export async function getEventCount() {
  return 0;
}

export async function getWhaleCount() {
  return 0;
}

export async function getGlossaryCount() {
  return 0;
}

export async function getCoinAnalysisCount() {
  return 0;
}