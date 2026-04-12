// app/[locale]/ico/[slug]/page.js

import { fetchAllIcoProjects, fetchIcoBySlug } from '../../../../../apis/page_news/events';
import ICODetailsPage from './IcoDetailsPage';

export const dynamicParams = true;
export const revalidate    = 3600; // ✅ FIX 6: false → 3600

const BASE_URL          = 'https://cryptonewstrend.com';
const SITE_NAME         = 'CryptoNews Trend';

// ✅ FIX 3: ru add kiya
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'ru', 'fr', 'de', 'ar', 'zh-CN'];

// ✅ FIX 4: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

// ✅ FIX 2: OG locale correct format
const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
function buildIcoMeta(project, slug, locale) {
  const p  = project || {};
  const ov = p.overview_data || {};

  // ✅ FIX 1: SITE_NAME mat lagao — layout template auto lagaega
  const title = p.name
    ? `${p.name}${p.ticker ? ` (${p.ticker})` : ''} ICO ${p.status_time || p.status || 'Details'}`
    : `ICO Project Details`;

  // ✅ FIX 10: word boundary pe cut karo
  const rawDesc = p.description
    ? p.description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    : `Explore ${p.name || 'this'} ICO details, funding rounds${ov.total_raised && ov.total_raised !== '—' ? `, total raised ${ov.total_raised}` : ''}, and token sale information on ${SITE_NAME}.`;

  const description = rawDesc.length <= 160
    ? rawDesc
    : rawDesc.slice(0, rawDesc.lastIndexOf(' ', 157)) + '...'; // ✅ word boundary

  const image        = p.main_img || `${BASE_URL}/og-image-ico.jpg`;
  const canonicalUrl = `${BASE_URL}/${locale}/ico/${slug}`;

  // ✅ FIX 9: category_name clean karo — "#103 in Blockchain" → "Blockchain"
  const cleanCategory = p.category_name
    ? p.category_name.replace(/#\d+\s+in\s+/i, '').trim()
    : null;

  const keywords = [
    p.name,
    p.ticker,
    'ICO',
    'token sale',
    cleanCategory,       // ✅ clean category
    p.project_type,
    'crypto launchpad',
    'blockchain funding',
  ].filter(Boolean).join(', ');

  return { title, description, image, canonicalUrl, keywords };
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

  if (!project) {
    return {
      title:       `ICO Project Details`,
      description: 'Explore ICO projects, funding rounds, and token sale details on CryptoNews Trend.',
      robots:      { index: false },
    };
  }

  const { title, description, image, canonicalUrl, keywords } =
    buildIcoMeta(project, slug, locale);

  // ✅ FIX 4+5: zh-Hans + x-default + ru
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/ico/${slug}`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/en/ico/${slug}`; // ✅ FIX 5

  return {
    title,        // ✅ layout template: "pod ICO — 17d left | CryptoNews Trend" — ek baar
    description,  // ✅ word boundary cut
    keywords,     // ✅ clean category

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans, ru, x-default
    },

    openGraph: {
      title:       `${title} | ${SITE_NAME}`, // ✅ OG mein manually
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,
      locale:      OG_LOCALE_MAP[locale] || 'en_US',  // ✅ FIX 2
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 7
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        'article',
      images: [{
        url:    image,
        width:  1200,
        height: 630,
        alt:    `${project.name} ICO`,
      }],
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841',
      creator:     '@cryptonews90841', // ✅ FIX 8
      title:       `${title} | ${SITE_NAME}`,
      description,
      images:      [image],
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },
  };
}

// ─────────────────────────────────────────────
// generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const STATUSES = ['Active', 'Upcoming', 'Ended'];
  const params   = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const status of STATUSES) {
      for (let page = 1; page <= 3; page++) {
        try {
          const result = await fetchAllIcoProjects(locale, status, page);
          if (!result.success) break;
          result.data?.forEach(item => {
            if (item.slug) params.push({ locale, slug: item.slug });
          });
          if (!result.has_next) break;
        } catch { break; }
      }
    }
  }

  console.log(`✅ ICO Pre-built: ${params.length} pages`);
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

  const p  = project || {};
  const ov = p.overview_data || {};
  const { title, description, image, canonicalUrl } =
    buildIcoMeta(project, slug, locale);

  // ✅ FinancialProduct Schema
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
      name:    p.name,
      ...(p.website  && { url:  p.website }),
      ...(p.main_img && { logo: p.main_img }),
    },
  } : null;

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'ICO Launchpad', item: `${BASE_URL}/${locale}/ico` },
      { '@type': 'ListItem', position: 3, name: p.name || slug,  item: canonicalUrl },
    ],
  };

  // ✅ WebPage Schema
  const webPageSchema = project ? {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          `${p.name} ICO Details`,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    // ✅ actual date use karo
    dateModified:  p.updated_at
      ? new Date(p.updated_at).toISOString()
      : new Date().toISOString(),
    datePublished: p.created_at
      ? new Date(p.created_at).toISOString()
      : new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    isPartOf: {
      '@type': 'WebSite',
      name:    SITE_NAME,
      url:     `${BASE_URL}/${locale}`,
    },
    ...(p.main_img && {
      primaryImageOfPage: { '@type': 'ImageObject', url: p.main_img },
    }),
  } : null;

  // ✅ FAQ Schema — rounds se dynamic
  const faqItems = (p.rounds_data || [])
    .filter(r => r.description && r.description !== 'N/A' && r.name)
    .map(r => ({
      '@type': 'Question',
      name:    `What is the ${r.name} round for ${p.name}?`,
      acceptedAnswer: { '@type': 'Answer', text: r.description },
    }));

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity:  faqItems,
  } : null;

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {webPageSchema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      {financialProductSchema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
        />
      )}
      {faqSchema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ICODetailsPage initialData={project} />
    </>
  );
}