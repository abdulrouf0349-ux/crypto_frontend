// rss-links.js  — Next.js RSS <link> tags helper
// ──────────────────────────────────────────────────────────────
// URL format:  /rss/<lang>/<feed-type>/
// Example:     /rss/en/news/   /rss/ur/articles/
// ──────────────────────────────────────────────────────────────

const API_BASE = 'https://crytponews.fun';

// ── 1. Get RSS metadata for layout.js (generateMetadata) ─────
export function getRssMetadata(locale = 'en') {
  const lang = locale;

  return {
    alternates: {
      types: {
        'application/rss+xml': [
          { url: `${API_BASE}/rss/${lang}/feed/`,          title: `All Updates [${lang.toUpperCase()}]` },
          { url: `${API_BASE}/rss/${lang}/news/`,          title: `Latest News [${lang.toUpperCase()}]` },
          { url: `${API_BASE}/rss/${lang}/articles/`,      title: `Articles [${lang.toUpperCase()}]` },
          { url: `${API_BASE}/rss/${lang}/events/`,        title: `Events [${lang.toUpperCase()}]` },
          { url: `${API_BASE}/rss/${lang}/ico/`,           title: `ICO Projects [${lang.toUpperCase()}]` },
          { url: `${API_BASE}/rss/${lang}/crypto-whales/`, title: `Whale Alerts [${lang.toUpperCase()}]` },
        ],
      },
    },
  };
}


// ── 2. All RSS feed URLs (for footer, RSS page, etc.) ────────
export function getAllRssFeeds(locale = 'en') {
  return [
    {
      type:  'master',
      label: 'All Updates',
      url:   `${API_BASE}/rss/${locale}/feed/`,
    },
    {
      type:  'news',
      label: 'Latest News',
      url:   `${API_BASE}/rss/${locale}/news/`,
    },
    {
      type:  'articles',
      label: 'Articles',
      url:   `${API_BASE}/rss/${locale}/articles/`,
    },
    {
      type:  'events',
      label: 'Crypto Events',
      url:   `${API_BASE}/rss/${locale}/events/`,
    },
    {
      type:  'ico',
      label: 'ICO / IDO Projects',
      url:   `${API_BASE}/rss/${locale}/ico/`,
      filters: [
        { label: 'Active ICOs',   url: `${API_BASE}/rss/${locale}/ico/?status=active`   },
        { label: 'Upcoming ICOs', url: `${API_BASE}/rss/${locale}/ico/?status=upcoming` },
        { label: 'Ended ICOs',    url: `${API_BASE}/rss/${locale}/ico/?status=ended`    },
      ],
    },
    {
      type:  'whales',
      label: 'Whale Alerts',
      url:   `${API_BASE}/rss/${locale}/crypto-whales/`,
      filters: [
        { label: 'Ethereum Whales', url: `${API_BASE}/rss/${locale}/crypto-whales/?chain=ethereum` },
        { label: 'Bitcoin Whales',  url: `${API_BASE}/rss/${locale}/crypto-whales/?chain=bitcoin`  },
        { label: 'Tron Whales',     url: `${API_BASE}/rss/${locale}/crypto-whales/?chain=tron`     },
      ],
    },
  ];
}


// ── 3. RssLinkTags component (put in <head> via layout) ───────
// Usage in app/[locale]/layout.js:
//
//   import { RssLinkTags } from '@/utils/rss-links';
//   ...
//   <head>
//     <RssLinkTags locale={locale} />
//   </head>

export function RssLinkTags({ locale = 'en' }) {
  const feeds = getAllRssFeeds(locale);
  return (
    <>
      {feeds.map(feed => (
        <link
          key={feed.type}
          rel="alternate"
          type="application/rss+xml"
          title={`CryptoNewsTrend — ${feed.label} [${locale.toUpperCase()}]`}
          href={feed.url}
        />
      ))}
    </>
  );
}

