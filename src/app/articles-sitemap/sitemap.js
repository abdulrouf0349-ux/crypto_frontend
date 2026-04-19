import { fetchAllArticles } from '../../../apis/page_news/events';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.map(async (locale) => {
      let page = 1, hasNext = true;
      while (hasNext) {
        try {
          const result = await fetchAllArticles(locale, page);
          (result?.data || []).forEach(item => {
            if (item.slug) {
              urls.push({
                url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/articles/${item.slug}`,
                lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
              });
            }
          });
          hasNext = result?.has_next || false;
          page++;
          if (page > 30) break;
        } catch { break; }
      }
    })
  );

  return urls;
}

export const revalidate = 3600;