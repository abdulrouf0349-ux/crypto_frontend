import { fetchAllEvents } from '../../../apis/page_news/events';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.map(async (locale) => {
      let page = 1, hasNext = true;
      while (hasNext) {
        try {
          const result = await fetchAllEvents(page, locale);
          (result?.data || []).forEach(item => {
            if (item.slug) {
              urls.push({
                url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/events/${item.slug}`,
                lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
              });
            }
          });
          hasNext = result?.metadata?.has_next || result?.has_next || false;
          page++;
          if (page > 30) break;
        } catch { break; }
      }
    })
  );

  return urls;
}

export const revalidate = 3600;