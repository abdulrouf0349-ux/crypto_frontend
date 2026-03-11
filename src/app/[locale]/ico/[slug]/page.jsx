// app/[locale]/ico/[slug]/page.js  →  SERVER COMPONENT
import { fetchAllIcoProjects, fetchIcoBySlug } from '../../../../../apis/page_news/events';
import ICODetailsPage from './IcoDetailsPage';
export const dynamicParams = true;
export const revalidate = false;
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = 'https://cryptonewstrend.com';
const SITE_NAME         = 'CryptoNews Trend';
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'fr', 'de', 'ar', 'zh-cn']; // ✅ zh → zh-cn

// ─────────────────────────────────────────────
// HELPER — dono functions reuse karein ge
// ─────────────────────────────────────────────
function buildIcoMeta(project, slug, locale) {
  const p  = project || {};
  const ov = p.overview_data || {};

  const title = p.name
    ? `${p.name}${p.ticker ? ` (${p.ticker})` : ''} ICO — ${p.status_time || p.status || 'Details'} | ${SITE_NAME}`
    : `ICO Project | ${SITE_NAME}`;

  const description = p.description
    ? p.description.slice(0, 155).trim() + (p.description.length > 155 ? '...' : '')
    : `Explore ${p.name || 'this'} ICO details, funding rounds${ov.total_raised && ov.total_raised !== '—' ? `, total raised ${ov.total_raised}` : ''}, and token sale information on ${SITE_NAME}.`;

  const image        = p.main_img || `${BASE_URL}/og-image-ico.jpg`;
  const canonicalUrl = `${BASE_URL}/${locale}/ico/${slug}`;

  const keywords = [
    p.name,
    p.ticker,
    'ICO',
    'token sale',
    p.category_name,
    p.project_type,
    'crypto launchpad',
    'blockchain funding',
  ].filter(Boolean).join(', ');

  return { title, description, image, canonicalUrl, keywords };
}

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  let project = null;
  try {
    const res = await fetchIcoBySlug(slug, locale);
    if (res?.success) project = res.data;
  } catch (_) {}

  if (!project) {
    return {
      title:       `ICO Project | ${SITE_NAME}`,
      description: 'Explore ICO projects, funding rounds, and token sale details on CryptoNews Trend.',
      robots:      { index: false }, // ✅ not found pages index nahi honge
    };
  }

  const { title, description, image, canonicalUrl, keywords } =
    buildIcoMeta(project, slug, locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/ico/${slug}`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ hreflang
    },
    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      images:   [{ url: image, width: 1200, height: 630, alt: `${project.name} ICO` }],
      locale,
      type:     'article',
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841', // ✅ missing tha
      title,
      description,
      images:      [image],
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-image-preview': 'large', // ✅ missing tha
        'max-snippet':       -1,      // ✅ missing tha
      },
    },
  };
}


export async function generateStaticParams() {
  const LOCALES   = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-cn', 'es'];
  const STATUSES  = ['Active', 'Upcoming', 'Ended']; // ✅ teeno status ke slugs
  const params    = [];

  for (const locale of LOCALES) {
    for (const status of STATUSES) {
      for (let page = 1; page <= 3; page++) {
        try {
          const result = await fetchAllIcoProjects(locale, status, page);

          if (!result.success) break;

          result.data?.forEach(item => {
            if (item.slug) params.push({ locale, slug: item.slug });
          });

          // Agle page nahi hai toh loop tod do
          if (!result.has_next) break;

        } catch { break; }
      }
    }
  }

  console.log(`✅ ICO Pre-built: ${params.length} pages`);
  return params;
}
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT — Structured Data + UI
// ─────────────────────────────────────────────
export default async function ICODetailServerPage({ params }) {
  const { locale, slug } = await params;

  // ✅ Single fetch — Next.js deduplicate karta hai same render mein
  let project = null;
  try {
    const res = await fetchIcoBySlug(slug, locale);
    if (res?.success) project = res.data;
  } catch (_) {}

  const p  = project || {};
  const ov = p.overview_data || {};
  const { title, description, image, canonicalUrl } = buildIcoMeta(project, slug, locale);

  // ── Schema 1: FinancialProduct ────────────────────────────
  const financialProductSchema = project ? {
    '@context': 'https://schema.org',
    '@type':    'FinancialProduct',
    name:        p.name,
    description: p.description || '',
    url:         canonicalUrl,
    image,
    ...(p.ticker && { tickerSymbol: p.ticker }),
    ...(ov.total_raised && ov.total_raised !== '—' && {
      amount: { '@type': 'MonetaryAmount', value: ov.total_raised },
    }),
    provider: {
      '@type': 'Organization',
      name:     p.name,
      ...(p.website   && { url:  p.website }),
      ...(p.main_img  && { logo: p.main_img }),
    },
  } : null;

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'ICO Launchpad', item: `${BASE_URL}/${locale}/ico` },
      { '@type': 'ListItem', position: 3, name: p.name || slug,  item: canonicalUrl },
    ],
  };

  // ── Schema 3: WebPage ─────────────────────────────────────
  const webPageSchema = project ? {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          `${p.name} ICO Details`,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    isPartOf: {
      '@type': 'WebSite',
      name:     SITE_NAME,
      url:      `${BASE_URL}/${locale}`,
    },
    ...(p.main_img && {
      primaryImageOfPage: { '@type': 'ImageObject', url: p.main_img },
    }),
  } : null;

  // ── Schema 4: FAQPage — rounds se dynamic ─────────────────
  const faqItems = (p.rounds_data || [])
    .filter(r => r.description && r.description !== 'N/A' && r.name)
    .map(r => ({
      '@type': 'Question',
      name:    `What is the ${r.name} round for ${p.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    r.description,
      },
    }));

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity:  faqItems,
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {webPageSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      )}
      {financialProductSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ✅ initialData pass — client double fetch nahi karega */}
      <ICODetailsPage initialData={project} />
    </>
  );
}