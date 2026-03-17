// src/context/rss-links.js  ← YEH FILE UPDATE KARO
// ─────────────────────────────────────────────────────────────

const SITE_URL = 'https://cryptonewstrend.com';

export function getRssMetadata(locale = 'en') {
  return {
    alternates: {
      types: {
        'application/rss+xml': [
          { url: `${SITE_URL}/rss/${locale}/feed/`,          title: `All Updates [${locale.toUpperCase()}]`  },
          { url: `${SITE_URL}/rss/${locale}/news/`,          title: `Latest News [${locale.toUpperCase()}]`  },
          { url: `${SITE_URL}/rss/${locale}/articles/`,      title: `Articles [${locale.toUpperCase()}]`     },
          { url: `${SITE_URL}/rss/${locale}/events/`,        title: `Events [${locale.toUpperCase()}]`       },
          { url: `${SITE_URL}/rss/${locale}/ico/`,           title: `ICO Projects [${locale.toUpperCase()}]` },
          { url: `${SITE_URL}/rss/${locale}/crypto-whales/`, title: `Whale Alerts [${locale.toUpperCase()}]` },
        ],
      },
    },
  };
}

export function getAllRssFeeds(locale = 'en') {
  return [
    {
      type:  'master',
      label: 'All Updates',
      url:   `${SITE_URL}/rss/${locale}/feed/`,
    },
    {
      type:  'news',
      label: 'Latest News',
      url:   `${SITE_URL}/rss/${locale}/news/`,
    },
    {
      type:  'articles',
      label: 'Articles',
      url:   `${SITE_URL}/rss/${locale}/articles/`,
    },
    {
      type:  'events',
      label: 'Crypto Events',
      url:   `${SITE_URL}/rss/${locale}/events/`,
    },
    {
      type:  'ico',
      label: 'ICO / IDO Projects',
      url:   `${SITE_URL}/rss/${locale}/ico/`,
      filters: [
        { label: 'Active ICOs',   url: `${SITE_URL}/rss/${locale}/ico/?status=active`   },
        { label: 'Upcoming ICOs', url: `${SITE_URL}/rss/${locale}/ico/?status=upcoming` },
        { label: 'Ended ICOs',    url: `${SITE_URL}/rss/${locale}/ico/?status=ended`    },
      ],
    },
    {
      type:  'whales',
      label: 'Whale Alerts',
      url:   `${SITE_URL}/rss/${locale}/crypto-whales/`,
      filters: [
        { label: 'Ethereum Whales', url: `${SITE_URL}/rss/${locale}/crypto-whales/?chain=ethereum` },
        { label: 'Bitcoin Whales',  url: `${SITE_URL}/rss/${locale}/crypto-whales/?chain=bitcoin`  },
        { label: 'Tron Whales',     url: `${SITE_URL}/rss/${locale}/crypto-whales/?chain=tron`     },
      ],
    },
  ];
}

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