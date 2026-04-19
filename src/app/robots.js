export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: [
      'https://cryptonewstrend.com/sitemap.xml',
      'https://cryptonewstrend.com/news-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/events-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/articles-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/ico-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/whales-sitemap/sitemap.xml',
      'https://cryptonewstrend.com/glossary-sitemap/sitemap.xml',
    ],
    host: 'https://cryptonewstrend.com',
  };
}