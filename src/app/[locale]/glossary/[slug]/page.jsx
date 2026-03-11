// app/[locale]/coin-glossary/[slug]/page.jsx
// ── SERVER COMPONENT ─────────────────────────────────────────
import { fetchCoinDetail } from '../../../../../apis/cryptowhales';
import CoinSlugClient from './CoinSlugClient';
import { fetchCoins } from '../../../../../apis/cryptowhales';
export const dynamicParams = true;
export const revalidate = false;
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = 'https://cryptonewstrend.com';
const SITE_NAME         = 'CryptoNews';
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'fr', 'de', 'ar', 'zh-CN'];

// ─────────────────────────────────────────────
// HELPER — dono functions reuse karein ge
// ─────────────────────────────────────────────
function buildCoinMeta(coin, slug, locale) {
  const name        = coin?.name || 'Coin';
  const symbol      = coin?.symbol?.toUpperCase() || '';
  const description = coin?.description
    ? coin.description.slice(0, 155)
    : `Learn about ${name} (${symbol}) — explore its description, tags, official links, and blockchain details in our crypto glossary.`;
  const image       = coin?.icon_url || `${BASE_URL}/og-image-glossary.jpg`;
  const canonicalUrl = `${BASE_URL}/${locale}/glossary/${coin?.slug || coin?.uuid || slug}`;
  const keywords    = [
    name,
    symbol,
    ...(Array.isArray(coin?.tags) ? coin.tags : []),
    'cryptocurrency',
    'blockchain',
    'crypto glossary',
    'coin details',
  ].filter(Boolean).join(', ');

  return { name, symbol, description, image, canonicalUrl, keywords };
}

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  let coin = null;
  try {
    const response = await fetchCoinDetail(slug, locale);
    coin = response?.data || response;
  } catch (_) {}

  if (!coin) {
    return {
      title:       `Coin Not Found | ${SITE_NAME}`,
      description: 'This cryptocurrency could not be found in our glossary.',
      robots:      { index: false },
    };
  }

  const { name, symbol, description, image, canonicalUrl, keywords } =
    buildCoinMeta(coin, slug, locale);

  // ── hreflang ─────────────────────────────────────────────
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/glossary/${coin.slug || coin.uuid || slug}`;
    return acc;
  }, {});

  // ── JSON-LD in metadata.other ─────────────────────────────
  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'Thing',
    name,
    alternateName: symbol,
    description:   coin.description || description,
    image,
    url:           coin.website_url || coin.links?.website || '',
    identifier:    coin.uuid,
    sameAs: [
      coin.links?.website,
      coin.links?.twitter,
      coin.links?.github,
      coin.links?.reddit,
      coin.links?.telegram,
    ].filter(Boolean),
  };

  return {
    title:       `${name} (${symbol}) — Coin Glossary | ${SITE_NAME}`,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ hreflang
    },
    openGraph: {
      title:       `${name} (${symbol}) | Crypto Coin Glossary`,
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,
      locale,
      type:        'article',
      images: image ? [{
        url:    image,
        width:  1200,  // ✅ 200 → 1200
        height: 630,   // ✅ 200 → 630
        alt:    `${name} (${symbol}) logo`,
      }] : [],
    },
    twitter: {
      card:        'summary_large_image', // ✅ summary → summary_large_image
      site:        '@cryptonews90841',
      title:       `${name} (${symbol}) — Coin Glossary`,
      description,
      images:      image ? [image] : [],
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-snippet':       -1,
        'max-image-preview': 'large',
      },
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

export async function generateStaticParams() {
  const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];
  const params = [];

  for (const locale of LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const result = await fetchCoins(page, '', 'all', locale);

        const items = result?.data || [];

        items.forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });

        // Agle page nahi hai toh loop tod do
        const hasNext = result?.metadata?.has_next || false;
        if (!hasNext) break;

      } catch { break; }
    }
  }

  console.log(`✅ Coins Pre-built: ${params.length} pages`);
  return params;
}
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT — Structured Data + UI
// ─────────────────────────────────────────────
export default async function CoinSlugPage({ params }) {
  const { slug, locale } = await params;

  let initialCoin = null;
  try {
    const res   = await fetchCoinDetail(slug, locale);
    initialCoin = res?.data || res;
  } catch (_) {}

  const { name, symbol, description, image, canonicalUrl } =
    buildCoinMeta(initialCoin, slug, locale);

  // ── Schema 1: Thing (CryptoCurrency) ─────────────────────
  const coinSchema = initialCoin ? {
    '@context':    'https://schema.org',
    '@type':       'Thing',
    name,
    alternateName: symbol,
    description:   initialCoin.description || description,
    image,
    url:           initialCoin.website_url || initialCoin.links?.website || '',
    identifier:    initialCoin.uuid,
    sameAs: [
      initialCoin.links?.website,
      initialCoin.links?.twitter,
      initialCoin.links?.github,
      initialCoin.links?.reddit,
      initialCoin.links?.telegram,
    ].filter(Boolean),
  } : null;

  // ── Schema 2: WebPage ─────────────────────────────────────
  const webPageSchema = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          `${name} (${symbol}) — Coin Glossary`,
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
  };

  // ── Schema 3: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Coin Glossary', item: `${BASE_URL}/${locale}/glossary` },
      { '@type': 'ListItem', position: 3, name,                  item: canonicalUrl },
    ],
  };

  return (
    <>
      {coinSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(coinSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CoinSlugClient params={params} initialCoin={initialCoin} />
    </>
  );
}