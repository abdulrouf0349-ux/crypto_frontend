// app/[locale]/glossary/[slug]/page.jsx

import { fetchCoinDetail } from '../../../../../apis/cryptowhales';
import { fetchCoins }      from '../../../../../apis/cryptowhales';
import CoinSlugClient      from './CoinSlugClient';

export const dynamicParams = true;
export const revalidate    = 3600; // ✅ FIX 8: false → 3600

const BASE_URL          = 'https://cryptonewstrend.com';
const SITE_NAME         = 'CryptoNews Trend'; // ✅ FIX 2

// ✅ FIX 4: ru add kiya
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'ru', 'fr', 'de', 'ar', 'zh-CN'];

// ✅ FIX 5: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

// ✅ FIX 3: OG locale correct format
const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
function buildCoinMeta(coin, slug, locale) {
  const name   = coin?.name || 'Coin';
  const symbol = coin?.symbol?.toUpperCase() || '';

  // ✅ FIX 11: word boundary pe cut karo
  const rawDesc  = coin?.description || `Learn about ${name} (${symbol}) — explore its description, tags, official links, and blockchain details in our crypto glossary.`;
  const clean    = rawDesc.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const description = clean.length <= 160
    ? clean
    : clean.slice(0, clean.lastIndexOf(' ', 157)) + '...'; // ✅ word boundary

  const image        = coin?.icon_url || `${BASE_URL}/og-image-glossary.jpg`;
  const canonicalUrl = `${BASE_URL}/${locale}/glossary/${coin?.slug || coin?.uuid || slug}`;

  const keywords = [
    name,
    symbol,
    ...(Array.isArray(coin?.tags) ? coin.tags.slice(0, 5) : []), // max 5 tags
    'cryptocurrency',
    'blockchain',
    'crypto glossary',
    'coin details',
  ].filter(Boolean).join(', ');

  return { name, symbol, description, image, canonicalUrl, keywords };
}

// ─────────────────────────────────────────────
// generateMetadata
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
      title:       `Coin Not Found`,
      description: 'This cryptocurrency could not be found in our glossary.',
      robots:      { index: false },
    };
  }

  const { name, symbol, description, image, canonicalUrl, keywords } =
    buildCoinMeta(coin, slug, locale);

  // ✅ FIX 5+6: zh-Hans + x-default + ru
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/glossary/${coin.slug || coin.uuid || slug}`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/en/glossary/${coin.slug || coin.uuid || slug}`; // ✅ FIX 6

  return {
    // ✅ FIX 1: SITE_NAME mat lagao — layout template auto lagaega
    title:       `${name} (${symbol}) — Coin Glossary`,
    description, // ✅ word boundary
    keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans, ru, x-default
    },

    openGraph: {
      title:       `${name} (${symbol}) | Crypto Coin Glossary | ${SITE_NAME}`, // ✅ OG mein manually
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,                          // ✅ FIX 2
      locale:      OG_LOCALE_MAP[locale] || 'en_US',   // ✅ FIX 3
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 9
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        'article',
      images: image ? [{
        url:    image,
        width:  1200,
        height: 630,
        alt:    `${name} (${symbol}) logo`,
      }] : [],
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841',
      creator:     '@cryptonews90841', // ✅ FIX 10
      title:       `${name} (${symbol}) — Coin Glossary | ${SITE_NAME}`,
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
    // ✅ FIX 7: other property hatao — schema script tag se handle hoga
  };
}

// ─────────────────────────────────────────────
// generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const result  = await fetchCoins(page, '', 'all', locale);
        const items   = result?.data || [];
        items.forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });
        const hasNext = result?.metadata?.has_next || false;
        if (!hasNext) break;
      } catch { break; }
    }
  }

  console.log(`✅ Coins Pre-built: ${params.length} pages`);
  return params;
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
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

  // ✅ FIX 7: Schema ab script tag mein — "other" property se nahi
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

  const webPageSchema = {
    '@context':    'https://schema.org',
    '@type':       'WebPage',
    name:           `${name} (${symbol}) — Coin Glossary`,
    description,
    url:            canonicalUrl,
    inLanguage:     locale,
    // ✅ actual date use karo
    dateModified:   initialCoin?.updated_at
      ? new Date(initialCoin.updated_at).toISOString()
      : new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

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
      {/* ✅ FIX 7: Schema sahi jagah — script tags mein */}
      {coinSchema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(coinSchema) }}
        />
      )}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CoinSlugClient params={params} initialCoin={initialCoin} />
    </>
  );
}