import Page_NewsData from '../../../apis/page_news/page_newsData';
const SITE_URL = 'https://cryptonewstrend.com';

async function fetchNews(locale, urlPrefix) {
  const urls = [];
  try {
    const firstData = await Page_NewsData(1, locale);
    const totalPages = Math.min(firstData?.total_pages || 1, 20);

    for (let batch = 1; batch <= totalPages; batch += 5) {
      const batchSize = Math.min(5, totalPages - batch + 1);
      const results = await Promise.allSettled(
        Array.from({ length: batchSize }, (_, i) => Page_NewsData(batch + i, locale))
      );
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          (r.value?.results || []).forEach(item => {
            if (item.slug) urls.push({
              url: `${SITE_URL}${urlPrefix}/${item.slug}`,
              lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          });
        }
      });
    }
  } catch(e) { console.error(`[${locale}] error:`, e.message); }
  return urls;
}

export default async function sitemap() {
  return fetchNews('de', '/de'); // ✅ en ke liye prefix nahi
}
export const revalidate = 3600;