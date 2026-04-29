import { fetchCoinDetail, fetchCoins } from '../../../../../apis/cryptowhales';
import CoinSlugClient from './CoinSlugClient';

export const dynamicParams = true;
export const revalidate = 3600;

const BASE_URL = 'https://cryptonewstrend.com';
const SITE_NAME = 'CryptoNews Trend';
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'ru', 'fr', 'de', 'ar', 'zh-CN'];

const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

function buildCoinMeta(coin, slug, locale) {
  const name = coin?.name || 'Coin';
  const symbol = coin?.symbol?.toUpperCase() || '';
  const rawDesc = coin?.description || `Technical details and market data for ${name} (${symbol}).`;
  const clean = rawDesc.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const description = clean.length <= 157 ? clean : clean.slice(0, clean.lastIndexOf(' ', 157)) + '...';

  const image = coin?.icon_url || `${BASE_URL}/og-image-glossary.jpg`;
  const canonicalUrl = locale === 'en' 
    ? `${BASE_URL}/glossary/${slug}` 
    : `${BASE_URL}/${locale}/glossary/${slug}`;

  return { name, symbol, description, image, canonicalUrl };
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let coin = null;
  try {
    const response = await fetchCoinDetail(slug, locale);
    coin = response?.data || response;
  } catch (_) {}

  if (!coin) return { title: 'Coin Not Found', robots: { index: false } };

  const { name, symbol, description, image, canonicalUrl } = buildCoinMeta(coin, slug, locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang] = lang === 'en' ? `${BASE_URL}/glossary/${slug}` : `${BASE_URL}/${lang}/glossary/${slug}`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/glossary/${slug}`;

  return {
    title: `${name} (${symbol}) Coin Glossary`,
    description,
    alternates: { canonical: canonicalUrl, languages: alternateLanguages },
    openGraph: {
      title: `${name} (${symbol}) | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || 'en_US',
      type: 'article',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: name, description, images: [image] },
  };
}

export default async function CoinSlugPage({ params }) {
  const { slug, locale } = await params;
  let initialCoin = null;
  try {
    const res = await fetchCoinDetail(slug, locale);
    initialCoin = res?.data || res;
  } catch (_) {}

  if (!initialCoin) return null;

  const { name, symbol, description, image, canonicalUrl } = buildCoinMeta(initialCoin, slug, locale);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${name} (${symbol}) Glossary`,
        "description": description,
        "inLanguage": locale,
        "dateModified": initialCoin?.updated_at || new Date().toISOString()
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}${locale === 'en' ? '' : `/${locale}`}` },
          { "@type": "ListItem", "position": 2, "name": "Glossary", "item": `${BASE_URL}${locale === 'en' ? '/glossary' : `/${locale}/glossary`}` },
          { "@type": "ListItem", "position": 3, "name": name, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Thing",
        "name": name,
        "alternateName": symbol,
        "description": description,
        "image": image,
        "identifier": initialCoin.uuid
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />
      <CoinSlugClient slug={slug} locale={locale} initialCoin={initialCoin} />
    </>
  );
}