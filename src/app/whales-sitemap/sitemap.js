import { fetchWhaleAlerts } from '../../../apis/cryptowhales';

const SITE_URL = 'https://cryptonewstrend.com';
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

export default async function sitemap() {
  const urls = [];

  await Promise.allSettled(
    LOCALES.map(async (locale) => {
      let page = 1, hasNext = true;
      while (hasNext) {
        try {
          const result = await fetchWhaleAlerts(page, locale);
          (result?.data || []).forEach(item => {
            if (item.hash) {
              urls.push({
                url: `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/crypto-whales/${item.hash}`,
                lastModified: item.created_at ? new Date(item.created_at) : new Date(),
                changeFrequency: 'never',
                priority: 0.6,
              });
            }
          });
          hasNext = result?.metadata?.has_next || false;
          page++;
          if (page > 20) break;
        } catch { break; }
      }
    })
  );

  return urls;
}

export const revalidate = 3600;