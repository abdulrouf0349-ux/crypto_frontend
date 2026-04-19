import { fetchCoins } from '../../../apis/cryptowhales';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.map(async (locale) => {
      let page = 1, hasNext = true;
      while (hasNext) {
        try {
          const result = await fetchCoins(page, '', 'all', locale);
          (result?.data || []).forEach(item => {
            if (item.slug) {
              urls.push({
                url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/glossary/${item.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
              });
            }
          });
          hasNext = result?.metadata?.has_next || false;
          page++;
          if (page > 50) break;
        } catch { break; }
      }
    })
  );

  return urls;
}

export const revalidate = 3600;