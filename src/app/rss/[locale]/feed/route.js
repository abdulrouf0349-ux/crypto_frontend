import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import Page_NewsData from '../../../../../apis/page_news/page_newsData';
import { fetchAllArticles } from '../../../../../apis/page_news/events';

export const revalidate = 3600;

export async function GET(request, { params }) {
  const { locale } = await params;

  try {
    // News + Articles parallel fetch
    const [firstPage, articlesResult] = await Promise.all([
      Page_NewsData(1, locale),
      fetchAllArticles(locale, 1),
    ]);

    const news     = firstPage?.results     || [];
    const articles = articlesResult?.data   || [];

    // ✅ News Items: English ke liye /en hata diya
    const newsItems = news.slice(0, 30).map(item => ({
      title:       clean(item.title),
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/${item.slug}`,
      description: clean(item.discription || item.discription_main || item.title),
      pubDate:     item.created_time || item.created_at,
      image:       item.image || '',
      _date:       new Date(item.created_time || item.created_at || 0),
    }));

    // ✅ Article Items: English ke liye /en hata diya
    const articleItems = articles.slice(0, 30).map(item => ({
      title:       clean(item.title),
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/article/${item.slug}`,
      description: clean(item.meta_description || item.content || '').slice(0, 300),
      pubDate:     item.created_at,
      author:      item.author || 'Admin',
      category:    item.category || '',
      _date:       new Date(item.created_at || 0),
    }));

    const merged = [...newsItems, ...articleItems]
      .sort((a, b) => b._date - a._date)
      .map(({ _date, ...item }) => item)  
      .slice(0, 60);

    return buildRss({
      title:       `CryptoNewsTrend — All Updates [${locale.toUpperCase()}]`,
      // ✅ Main site link ko bhi clean kiya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}`,
      description: `All crypto news and articles in ${locale.toUpperCase()}`,
      items:       merged,
    });

  } catch (e) {
    console.log('Feed Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}