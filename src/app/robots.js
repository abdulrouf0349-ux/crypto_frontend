// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: [
      'https://cryptonewstrend.com/sitemap.xml',
      'https://www.cryptonewstrend.com/sitemap.xml',
    ],
    host: 'https://cryptonewstrend.com',
  };
}