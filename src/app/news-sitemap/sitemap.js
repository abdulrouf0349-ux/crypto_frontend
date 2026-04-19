import Page_NewsData from '../../../apis/page_news/page_newsData';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.map(async (locale) => {
      try {
        const firstData = await Page_NewsData(1, locale);
        const totalPages = Math.min(firstData?.total_pages || 1, 50);

        // Sab pages parallel fetch karo
        const allPages = await Promise.allSettled(
          Array.from({ length: totalPages }, (_, i) =>
            Page_NewsData(i + 1, locale)
          )
        );

        allPages.forEach(result => {
          if (result.status === 'fulfilled') {
            (result.value?.results || []).forEach(item => {
              if (item.slug) {
                urls.push({
                  url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/${item.slug}`,
                  lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
                  changeFrequency: 'weekly',
                  priority: 0.8,
                });
              }
            });
          }
        });
      } catch(e) {
        console.error(`News sitemap error [${locale}]:`, e.message);
      }
    })
  );

  return urls;
}

export const revalidate = 3600;