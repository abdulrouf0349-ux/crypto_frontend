// src/app/rss/[locale]/events/route.js

import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import { fetchAllEvents } from '../../../../../apis/page_news/events';

export const revalidate = 3600;

export async function GET(request, { params }) {
  const { locale } = await params;

  try {
    const allEvents = [];

    for (let page = 1; page <= 5; page++) {
      const result = await fetchAllEvents(page, locale);
      allEvents.push(...(result?.data || []));

      const hasNext = result?.metadata?.has_next || result?.has_next || false;
      if (!hasNext || allEvents.length >= 50) break;
    }

    const items = allEvents.slice(0, 50).map(item => ({
      title:       clean(item.detail_title || item.title),
      link:        `${SITE_URL}/${locale}/events/${item.slug}`,
      description: [
        item.location     ? `📍 ${clean(item.location)}`     : '',
        item.organized_by ? `🏢 ${clean(item.organized_by)}` : '',
        item.description  ? clean(item.description)           : '',
      ].filter(Boolean).join(' | '),
      pubDate: item.created_at,
      image:   item.image_src || '',
    }));

    return buildRss({
      title:       `CryptoNewsTrend — Crypto Events [${locale.toUpperCase()}]`,
      link:        `${SITE_URL}/${locale}/events`,
      description: `Upcoming crypto events in ${locale.toUpperCase()}`,
      items,
    });

  } catch (e) {
    console.log('Events Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}