import { fetchAllIcoProjects, fetchIcoBySlug } from '../../../../../apis/page_news/events';
import ICODetailsPage from './IcoDetailsPage';
import { notFound } from 'next/navigation';

export const dynamicParams = true;
export const revalidate = 3600; 

const BASE_URL          = 'https://cryptonewstrend.com';
const SITE_NAME         = 'CryptoNews Trend';
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'ru', 'fr', 'de', 'ar', 'zh-CN'];

const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ─────────────────────────────────────────────
// HELPER: Build Meta Data
// ─────────────────────────────────────────────
function buildIcoMeta(project, slug, locale) {
  const p = project || {};
  const ov = p.overview_data || {};

  // SEO Optimized Title: Added Year and Status
  // BuildMeta function mein title ko mazeed behtar karein:
const title = p.name 
  ? `${p.name} (${p.ticker}) ICO Review & Token Sale – 2026 Details`
  : `Upcoming Crypto ICO Projects 2026`;

  // Clean Description with Word Boundary
  let rawDesc = p.description
    ? p.description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    : `Explore ${p.name || 'this'} ICO details, funding rounds${ov.total_raised && ov.total_raised !== '—' ? `, total raised ${ov.total_raised}` : ''}, and token sale information on ${SITE_NAME}.`;

  const description = rawDesc.length <= 160 
    ? rawDesc 
    : rawDesc.slice(0, rawDesc.lastIndexOf(' ', 157)) + '...';

  const image = p.main_img || `${BASE_URL}/og-image-ico.jpg`;
  
  // URL Logic: Root for English
  const canonicalUrl = locale === 'en' 
    ? `${BASE_URL}/ico/${slug}` 
    : `${BASE_URL}/${locale}/ico/${slug}`;

  const cleanCategory = p.category_name ? p.category_name.replace(/#\d+\s+in\s+/i, '').trim() : 'Crypto';

const keywords = [
  p.name, 
  p.ticker, 
  'Bitcoin price prediction 2026', // Long-tail keyword
  'FOMC data impact',             // Topic specific
  'BTC volatility',               // Niche specific
  'ICO 2026', 
  'token sale', 
  cleanCategory, 
  'crypto launchpad', 
  'blockchain funding'
].filter(Boolean).join(', ');
  return { title, description, image, canonicalUrl, keywords, cleanCategory };
}

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let project = null;
  try {
    const res = await fetchIcoBySlug(slug, locale);
    if (res?.success) project = res.data;
  } catch (_) {}

  if (!project) return { title: 'Project Not Found', robots: { index: false } };

  const { title, description, image, canonicalUrl, keywords } = buildIcoMeta(project, slug, locale);

  const alternateLanguages = {};
  SUPPORTED_LOCALES.forEach((lang) => {
const hreflang = lang === "zh-CN" ? "zh-Hans" : lang;
    alternateLanguages[hreflang] = lang === 'en' 
      ? `${BASE_URL}/ico/${slug}` 
      : `${BASE_URL}/${lang}/ico/${slug}`;
  });
alternateLanguages["x-default"] = `${BASE_URL}/ico/${slug}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl, languages: alternateLanguages },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || 'en_US',
alternateLocale: SUPPORTED_LOCALES.filter(l => l !== locale).map(l => OG_LOCALE_MAP[l] || "en_US"),
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${project.name} ICO Review` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

// ─────────────────────────────────────────────
// generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];
  // For Performance: Only pre-build top 20 English projects, others on-demand
  try {
    const result = await fetchAllIcoProjects('en', 'Active', 1);
    if (result.success) {
      result.data?.slice(0, 20).forEach(item => {
        if (item.slug) params.push({ locale: 'en', slug: item.slug });
      });
    }
  } catch (e) { console.error("Static Params Error", e); }
  return params;
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function ICODetailServerPage({ params }) {
  const { locale, slug } = await params;
  let project = null;
  try {
    const res = await fetchIcoBySlug(slug, locale);
    if (res?.success) project = res.data;
  } catch (_) {}

if (!project) return notFound();

  const p = project;
  const ov = p.overview_data || {};
  const { title, description, image, canonicalUrl } = buildIcoMeta(p, slug, locale);
const homeUrl = locale === 'en' ? `${BASE_URL}` : `${BASE_URL}/${locale}`;
const icoLaunchpadUrl = locale === 'en' ? `${BASE_URL}/ico` : `${BASE_URL}/${locale}/ico`;
  // Consolidated Schema Graph (Cleaner and Faster)
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': homeUrl },
          { '@type': 'ListItem', 'position': 2, 'name': 'ICO Launchpad', 'item': icoLaunchpadUrl },
          { '@type': 'ListItem', 'position': 3, 'name': p.name, 'item': canonicalUrl },
        ],
      },
      {
        '@type': 'FinancialProduct',
        'name': p.name,
        'description': description,
        'url': canonicalUrl,
        'image': image,
        'tickerSymbol': p.ticker || 'N/A',
        'provider': {
          '@type': 'Organization',
          'name': p.name,
          'url': p.website || BASE_URL,
        }
      },
      
  {
        '@type': 'WebPage',
        'name': `${p.name} ICO Details & Review`,
        'description': description,
        'url': canonicalUrl,
        'inLanguage': locale,
        'publisher': { '@type': 'Organization', 'name': SITE_NAME }
      }
    ]
  };

  // Add FAQ Schema if rounds exist
  const faqItems = (p.rounds_data || [])
    .filter(r => r.description && r.description !== 'N/A')
    .map(r => ({
      '@type': 'Question',
      'name': `What are the details of ${r.name} for ${p.name}?`,
      'acceptedAnswer': { '@type': 'Answer', 'text': r.description },
    }));

  if (faqItems.length > 0) {
    schemaGraph['@graph'].push({
      '@type': 'FAQPage',
      'mainEntity': faqItems
    });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <ICODetailsPage initialData={project} />
    </>
  );
}