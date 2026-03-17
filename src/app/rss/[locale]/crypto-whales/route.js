// src/app/rss/[locale]/crypto-whales/route.js

import { buildRss, clean, SITE_URL } from '../../../../../utils/rss-helper';
import { fetchWhaleAlerts } from '../../../../../apis/cryptowhales';

export const revalidate = 1800;

export async function GET(request, { params }) {
  const { locale }       = await params;
  const { searchParams } = new URL(request.url);
  const chain            = searchParams.get('chain') || '';

  try {
    const allWhales = [];

    for (let page = 1; page <= 5; page++) {
      const result     = await fetchWhaleAlerts(page, locale);
      const data       = result?.data || result || [];
      const totalPages = result?.metadata?.total_pages || 1;

      allWhales.push(...data);

      if (page >= totalPages || allWhales.length >= 50) break;
    }

    let whales = allWhales;
    if (chain) {
      whales = whales.filter(w =>
        (w.blockchain || '').toLowerCase() === chain.toLowerCase()
      );
    }

    const items = whales.slice(0, 50).map(item => ({
      title:       `[${item.blockchain || ''}] ${clean(item.summary)}`,
      link:        `${SITE_URL}/${locale}/crypto-whales/${item.hash}`,
      description: [
        clean(item.summary),
        item.amount_full     ? `💎 ${item.amount_full}`           : '',
        item.sender_owner    ? `📤 From: ${item.sender_owner}`    : '',
        item.receiver_owner  ? `📥 To: ${item.receiver_owner}`    : '',
        item.alert_timestamp ? `🕐 ${item.alert_timestamp}`       : '',
      ].filter(Boolean).join(' | '),
      pubDate: item.created_at,
    }));

    const chainLabel = chain ? ` [${chain.toUpperCase()}]` : '';
    return buildRss({
      title:       `CryptoNewsTrend — Whale Alerts${chainLabel} [${locale.toUpperCase()}]`,
      link:        `${SITE_URL}/${locale}/crypto-whales`,
      description: `Large crypto transactions in ${locale.toUpperCase()}`,
      items,
    });

  } catch (e) {
    console.log('Whale Error:', e.message);
    return new Response('Feed error', { status: 500 });
  }
}