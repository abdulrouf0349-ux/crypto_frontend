import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import { fetchAllIcoProjects } from '../../../../../apis/page_news/events';

export const revalidate = 3600;

export async function GET(request, { params }) {
  const { locale }       = await params;
  const { searchParams } = new URL(request.url);
  const status           = searchParams.get('status') || 'active'; // ← lowercase

  try {
    const allProjects = [];
    let page = 1;

    while (true) {
      const result = await fetchAllIcoProjects(locale, status.toLowerCase(), page);
      if (!result?.success) break;

      allProjects.push(...(result?.data || []));
      if (!result?.has_next || allProjects.length >= 50) break;
      page++;
    }

    const items = allProjects.slice(0, 50).map(item => ({
      title:       `${clean(item.name)}${item.ticker ? ` (${item.ticker})` : ''}`,
      // ✅ English ke liye /en hata diya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/ico/${item.slug}`,
      description: [
        item.project_type ? `📂 ${clean(item.project_type)}`      : '',
        item.status_time  ? `⏱ ${item.status_time}`               : '',
        item.raised_text  ? `💰 Raised: ${item.raised_text}`      : '',
        item.description  ? clean(item.description).slice(0, 200) : '',
      ].filter(Boolean).join(' | '),
      pubDate: item.created_at,
      image:   item.main_img || '',
    }));

    return buildRss({
      title:       `CryptoNewsTrend — ICO Projects [${status.toUpperCase()}] [${locale.toUpperCase()}]`,
      // ✅ Main link ko bhi clean kiya
      link:        `${SITE_URL}${locale === 'en' ? '' : '/' + locale}/ico`,
      description: `Latest ICO and token sale projects in ${locale.toUpperCase()}`,
      items,
    });

  } catch (e) {
    console.log('ICO Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}