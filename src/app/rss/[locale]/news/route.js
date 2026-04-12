import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import Page_NewsData from '../../../../../apis/page_news/page_newsData';

export const revalidate = 3600;

export async function GET(request, { params }) {
  const { locale } = await params;

  try {
    const allNews = [];
    const firstPage = await Page_NewsData(1, locale);
    const totalPages = Math.min(firstPage?.total_pages || 1, 5); // max 5 pages
    allNews.push(...(firstPage?.results || []));

    // baaki pages fetch karo
    for (let page = 2; page <= totalPages; page++) {
      const data = await Page_NewsData(page, locale);
      allNews.push(...(data?.results || []));
    }

    const items = allNews.slice(0, 50).map(item => ({
      title:       clean(item.title),
      // ✅ English ke liye /en hata diya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/${item.slug}`,
      description: clean(item.discription || item.discription_main || ''),
      pubDate:     item.created_time || item.created_at,
      image:       item.image || '',  
    }));

    return buildRss({
      title:       `CryptoNewsTrend — Latest News [${locale.toUpperCase()}]`,
      // ✅ Main feed link ko bhi clean kiya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}`,
      description: `Latest cryptocurrency news in ${locale.toUpperCase()}`,
      items,
    });

  } catch (e) {
    console.log('Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}