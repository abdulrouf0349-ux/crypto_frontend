import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import { fetchAllArticles } from '../../../../../apis/page_news/events';

export const revalidate = 3600;

export async function GET(request, { params }) {
  const { locale } = await params;

  try {
    const allArticles = [];

    for (let page = 1; page <= 5; page++) {
      const result   = await fetchAllArticles(locale, page);
      allArticles.push(...(result?.data || []));

      if (!result?.has_next || allArticles.length >= 50) break; 
    }

    const items = allArticles.slice(0, 50).map(item => ({
      title:       clean(item.title),
      // ✅ English ke liye locale path empty rakhein, baaki ke liye /locale
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/articles/${item.slug}`,
      description: clean(item.meta_description || item.content || '').slice(0, 300),
      pubDate:     item.created_at,
      author:      item.author || 'Admin',
      category:    item.category || '',
      image:       item.main_image || '', 
    }));

    return buildRss({
      title:       `CryptoNewsTrend — Articles [${locale.toUpperCase()}]`,
      // ✅ Main feed link ko bhi clean kiya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/articles`,
      description: `In-depth crypto articles in ${locale.toUpperCase()}`,
      items,
    });

  } catch (e) {
    console.log('Articles Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}