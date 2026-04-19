export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: [
      'https://cryptonewstrend.com/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-en/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-ur/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-ar/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-de/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-fr/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-ru/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-zh/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap-es/sitemap.xml',
      'https://cryptonewstrend.com/events-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/articles-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/ico-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/whales-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/glossary-sitemap/sitemap.xml',
    ],
    host: 'https://cryptonewstrend.com',
  };
}