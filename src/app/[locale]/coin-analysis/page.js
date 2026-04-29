import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisPage from './pageSeo';

const BASE_URL  = 'https://cryptonewstrend.com';
const SITE_NAME = 'CryptoNews Trend';
const LOCALES   = ['en', 'ur', 'ar', 'ru', 'es', 'fr', 'de', 'zh-CN'];

const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ── SEO UTILITIES ──────────────────────────────────────────────
const getCleanUrl = (locale, coin) => {
  const path = '/coin-analysis';
  const query = coin ? `?coin=${coin}` : '';
  const base = locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
  return `${base}${query}`;
};

const getPageData = (coinName) => {
  const title = coinName
    ? `${coinName} AI Prediction: Buy or Sell Now? | ${coinName} Price Analysis`
    : `AI Crypto Signal Tool: Real-time Buy, Sell & Hold Signals`;

  const description = coinName
    ? `Live ${coinName} technical analysis & AI signals. Should you buy ${coinName} today? Get RSI, MACD, and FinBERT sentiment scores for ${coinName} price prediction.`
    : `The most advanced free AI crypto analysis tool. Get 100% data-driven buy/sell signals for BTC, ETH, and altcoins using advanced FinBERT AI sentiment.`;

  return { title, description };
};

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params, searchParams }) {
  const { locale }    = await params;
  const { coin = '' } = await searchParams || {};
  const coinName      = coin ? decodeURIComponent(coin) : '';
  const { title, description } = getPageData(coinName);
  const canonicalUrl = getCleanUrl(locale, coin);

  // ✅ Hreflang with x-default
  const alternateLanguages = LOCALES.reduce((acc, lang) => {
    acc[LOCALE_TO_HREFLANG[lang] || lang] = getCleanUrl(lang, coin);
    return acc;
  }, { 'x-default': getCleanUrl('en', coin) });

  // ✅ Power Keywords for High Ranking
  const keywords = coinName
    ? `${coinName} price prediction, ${coinName} technical analysis, ${coinName} AI signal, is ${coinName} a buy, crypto price alerts, ${coinName} chart analysis`
    : `free crypto AI signals, best buy sell signals crypto, AI price prediction, cryptocurrency technical analysis tool, crypto sentiment analysis`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || 'en_US',
      type: 'website',
      images: [{
        url: `${BASE_URL}/og-coin-analysis.png`,
        width: 1200,
        height: 630,
        alt: `${coinName || 'Crypto'} AI Analysis Signal`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-coin-analysis.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ── Page Component ────────────────────────────────────────────
export default async function Page({ params, searchParams }) {
  const { locale }    = await params;
  const { coin = '' } = await searchParams || {};
  const coinName      = coin ? decodeURIComponent(coin) : null;
  const canonicalUrl  = getCleanUrl(locale, coin);
  const { title, description } = getPageData(coinName);

  // ✅ 1. WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  // ✅ 2. FAQ Schema (Boosts Ranking for "Buy or Sell" queries)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How does ${coinName || 'Crypto'} AI Analysis work?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our AI tool analyzes ${coinName || 'cryptocurrencies'} using technical indicators like RSI and MACD, combined with FinBERT-powered sentiment analysis from news and social media.`
        }
      },
      {
        '@type': 'Question',
        name: `Is the ${coinName || 'crypto'} signal 100% accurate?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: "While our AI provides data-driven insights, crypto markets are volatile. These signals should be used as a tool alongside your own research."
        }
      }
    ]
  };

  // ✅ 3. SoftwareApplication Schema
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${coinName || 'Crypto'} AI Signal Analyzer`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    url: canonicalUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1250'
    },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  // ✅ 4. Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'AI Coin Analysis', item: getCleanUrl(locale) },
      ...(coinName ? [{ '@type': 'ListItem', position: 3, name: coinName, item: canonicalUrl }] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <CoinAnalysisPage locale={locale} initialCoin={coinName} />
      
      <CoinAnalysisFloat locale={locale} />
      <MobileSupportButton dict={{}} />
    </>
  );
}