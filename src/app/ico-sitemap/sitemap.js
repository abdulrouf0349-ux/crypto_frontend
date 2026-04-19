import { fetchAllIcoProjects } from '../../../apis/page_news/events';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];
const STATUSES = ['Active', 'Upcoming', 'Ended'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.flatMap(locale =>
      STATUSES.map(async (status) => {
        let page = 1, hasNext = true;
        while (hasNext) {
          try {
            const result = await fetchAllIcoProjects(locale, status, page);
            (result?.data || []).forEach(item => {
              if (item.slug) {
                urls.push({
                  url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/ico/${item.slug}`,
                  lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
                  changeFrequency: 'weekly',
                  priority: 0.7,
                });
              }
            });
            hasNext = result?.has_next || false;
            page++;
            if (page > 20) break;
          } catch { break; }
        }
      })
    )
  );

  return urls;
}

export const revalidate = 3600;