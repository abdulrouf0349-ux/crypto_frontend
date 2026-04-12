// app/[locale]/coin-analysis/page.js

import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisPage from './pageSeo';

const BASE_URL  = 'https://cryptonewstrend.com';
const SITE_NAME = 'CryptoNews Trend'; // ✅ FIX 2: "CryptoNewsTrend" → "CryptoNews Trend"
const LOCALES   = ['en', 'ur', 'ar', 'ru', 'es', 'fr', 'de', 'zh-CN'];

// ✅ FIX 4: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

// ✅ FIX 3: OG locale correct format
const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params, searchParams }) {
  const { locale }    = await params;
  const { coin = '' } = await searchParams || {};
  const coinName      = coin ? decodeURIComponent(coin) : '';

  // ✅ FIX 1: SITE_NAME mat lagao title mein — layout template auto lagaega
  const title = coinName
    ? `${coinName} Price Prediction & AI Buy/Sell Signal`
    : `AI Crypto Coin Analysis Buy/Sell/Hold Signal`;

  const description = coinName
    ? `Get real-time ${coinName} price analysis with AI-powered buy/sell signals, RSI, MACD, support/resistance levels, and FinBERT sentiment analysis. Is ${coinName} a buy or sell right now?`
    : `Free AI-powered cryptocurrency analysis tool. Get instant buy/sell/hold signals for Bitcoin, Ethereum, Solana and 1000+ coins using FinBERT AI, RSI, MACD, and volume analysis.`;

  const keywords = coinName
    ? `${coinName} price prediction, ${coinName} buy or sell, ${coinName} analysis today, ${coinName} RSI, ${coinName} price target, should I buy ${coinName}, ${coinName} AI analysis, ${coinName} signal`
    : `crypto AI analysis, buy sell signal crypto, bitcoin price prediction AI, ethereum buy or sell, crypto RSI analysis, crypto MACD signal, FinBERT crypto sentiment, best time to buy crypto, crypto technical analysis free`;

  const canonicalUrl = `${BASE_URL}/${locale}/coin-analysis${coinName ? `?coin=${coin}` : ''}`;

  // ✅ FIX 4+5: zh-Hans + x-default
  const alternateLanguages = LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/coin-analysis${coinName ? `?coin=${coin}` : ''}`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/en/coin-analysis${coinName ? `?coin=${coin}` : ''}`; // ✅ FIX 5

  return {
    title,       // ✅ layout template: "AI Crypto... | CryptoNews Trend" — ek baar
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans + x-default
    },

    openGraph: {
      title:       `${title} | ${SITE_NAME}`, // ✅ OG mein manually
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,                          // ✅ FIX 7: "CryptoNews Trend"
      locale:      OG_LOCALE_MAP[locale] || 'en_US',   // ✅ FIX 3: "en_US"
      alternateLocale: LOCALES                          // ✅ FIX 6
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        'website',
      images: [{
        url:    `${BASE_URL}/og-coin-analysis.png`,
        width:  1200,
        height: 630,
        alt:    `${coinName || 'Crypto'} AI Buy/Sell Signal`,
      }],
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841',
      creator:     '@cryptonews90841',
      title:       `${title} | ${SITE_NAME}`,
      description,
      images:      [`${BASE_URL}/og-coin-analysis.png`],
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

// ── Page Component ────────────────────────────────────────────
export default async function Page({ params, searchParams }) {
  const { locale }    = await params;
  const { coin = '' } = await searchParams || {};
  const coinName      = coin ? decodeURIComponent(coin) : null;
  const canonicalUrl  = `${BASE_URL}/${locale}/coin-analysis${coin ? `?coin=${coin}` : ''}`;

  const webPageSchema = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          coinName
      ? `${coinName} AI Price Analysis & Buy/Sell Signal`
      : 'AI Crypto Analysis Tool Buy/Sell/Hold Signals',
    description:   coinName
      ? `Real-time ${coinName} analysis with AI buy/sell signals, RSI, MACD, support/resistance levels`
      : 'Free AI-powered crypto analysis. Get buy/sell/hold signals for 1000+ coins using FinBERT, RSI, MACD.',
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME, // ✅ "CryptoNews Trend"
      url:     BASE_URL,
      logo:   { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  const appSchema = {
    '@context':          'https://schema.org',
    '@type':             'SoftwareApplication',
    name:                 'CryptoNews Trend AI Coin Analyzer', // ✅ fixed
    applicationCategory: 'FinanceApplication',
    operatingSystem:     'Web Browser',
    url:                  canonicalUrl,
    description:         'Free AI-powered cryptocurrency buy/sell signal tool using FinBERT sentiment analysis, RSI, MACD, and volume indicators.',
    offers: {
      '@type':        'Offer',
      price:          '0',
      priceCurrency:  'USD',
    },
    featureList: [
      'AI FinBERT Sentiment Analysis',
      'RSI Technical Indicator',
      'MACD Signal Detection',
      'Volume Analysis',
      'Buy/Sell/Hold Signal',
      'Price Target Levels',
      'Support & Resistance',
      'Stop Loss Calculation',
      'Exchange Listings',
      'Real-time Market Data',
    ],
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME,
      url:     BASE_URL,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name:    coinName
          ? `Should I buy ${coinName} right now?`
          : 'How does the AI crypto buy/sell signal work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    coinName
            ? `Our AI analyzes ${coinName} using FinBERT sentiment analysis, RSI, MACD, and volume indicators to generate a buy/sell/hold signal with a confidence score out of 100.`
            : 'The AI combines FinBERT financial sentiment analysis with RSI, MACD, and volume indicators to calculate a score from 0-100. Score above 65 = BUY, below 35 = SELL, between = HOLD.',
        },
      },
      {
        '@type': 'Question',
        name:    'Is this AI crypto analysis accurate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'The analysis uses multiple proven technical indicators and AI sentiment analysis. However, crypto markets are highly volatile. Always do your own research (DYOR) and never invest more than you can afford to lose.',
        },
      },
      {
        '@type': 'Question',
        name:    'What is RSI in crypto trading?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'RSI (Relative Strength Index) measures momentum. RSI below 30 means oversold (potential buy zone), above 70 means overbought (potential sell zone), 30-70 is neutral territory.',
        },
      },
      {
        '@type': 'Question',
        name:    'What does MACD signal mean for crypto?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'MACD (Moving Average Convergence Divergence) shows momentum direction. A bullish MACD suggests upward price momentum, while bearish MACD indicates downward pressure.',
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Coin Analysis', item: `${BASE_URL}/${locale}/coin-analysis` },
      ...(coinName ? [{ '@type': 'ListItem', position: 3, name: coinName, item: canonicalUrl }] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CoinAnalysisPage locale={locale} initialCoin={coinName} />
      
    </>
  );
}