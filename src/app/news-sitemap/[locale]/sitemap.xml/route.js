const SITE_URL = 'https://cryptonewstrend.com';
const BASE_API = process.env.NEXT_PUBLIC_API_BASE || 'https://crytponews.fun';

const LOCALE_PREFIX = {
  'en': '', 'ur': '/ur', 'ar': '/ar', 'de': '/de',
  'fr': '/fr', 'ru': '/ru', 'zh-CN': '/zh-CN', 'es': '/es',
};

export const dynamic = 'force-dynamic';
const cleanSlug = (slug) => {
  return slug
    .replace(/^\/en\//, '')  // /en/ hata do
    .replace(/^en\//, '')    // en/ hata do
    .replace(/^\/en$/, '')   // /en hata do
    .replace(/^en$/, '');    // en hata do
};
export async function GET(request, { params }) {
  let { locale } = await params;
  if (locale === 'zh-cn') locale = 'zh-CN';
  const prefix = locale === 'en' ? '' : (LOCALE_PREFIX[locale] || `/${locale}`);
console.log('FINAL PREFIX:', prefix); // ← '' aana chahiye en ke liye

  try {
    const res = await fetch(
      `${BASE_API}/api/sitemap-slugs/${locale}/`,
      { cache: 'no-store' } // ✅ hamesha fresh
    );

    const data = await res.json();
    const slugs = data?.slugs || [];

    const now = new Date();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map(item => {
  // ✅ created_time parse karo safely
    const slug = cleanSlug(item.slug); // ✅ clean slug

  const createdAt = item.created_time ? new Date(item.created_time) : new Date();
  const isValidDate = !isNaN(createdAt.getTime());
  const lastmod = isValidDate ? createdAt.toISOString() : now.toISOString();

  // ✅ SEO Strategy — nai news ki priority zyada
  const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  
  let priority, changefreq;
  if (ageInDays <= 1) {
    priority = '1.0';
    changefreq = 'hourly';   // ✅ Last 24 hours — Google jaldi crawl kare
  } else if (ageInDays <= 7) {
    priority = '0.8';
    changefreq = 'daily';    // ✅ Last 7 din
  } else if (ageInDays <= 30) {
    priority = '0.6';
    changefreq = 'weekly';   // ✅ Last 1 month
  } else {
    priority = '0.4';
    changefreq = 'never';    // ✅ Purani news — stable, change nahi hoti
  }

  return `  <url>
    <loc>${SITE_URL}${prefix}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=600', // ✅ 10 min cache — nai news ke saath sync
      },
    });

  } catch(e) {
    console.error(`Sitemap error [${locale}]:`, e.message);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}