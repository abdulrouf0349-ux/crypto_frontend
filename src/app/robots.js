// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://cryptonewstrend.com/sitemap.xml',
  };
}