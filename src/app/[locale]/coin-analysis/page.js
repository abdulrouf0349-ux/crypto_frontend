
import CoinAnalysisPage from './pageSeo';

const BASE_URL  = 'https://cryptonewstrend.com';
const SITE_NAME = 'CryptoNewsTrend';
const LOCALES   = ['en','ur','ar','ru','es','fr','de','zh-CN'];

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params, searchParams }) {
  const { locale }   = await params;
  const { coin = '' } = await searchParams || {};

  const coinName = coin
    ? `${decodeURIComponent(coin)} Price Analysis`
    : 'AI Crypto Analysis';

  const title       = coin
    ? `${decodeURIComponent(coin)} Price Prediction & AI Buy/Sell Signal | ${SITE_NAME}`
    : `AI Crypto Coin Analysis — Buy/Sell/Hold Signal | ${SITE_NAME}`;

  const description = coin
    ? `Get real-time ${decodeURIComponent(coin)} price analysis with AI-powered buy/sell signals, RSI, MACD, support/resistance levels, and FinBERT sentiment analysis. Is ${decodeURIComponent(coin)} a buy or sell right now?`
    : `Free AI-powered cryptocurrency analysis tool. Get instant buy/sell/hold signals for Bitcoin, Ethereum, Solana and 1000+ coins using FinBERT AI, RSI, MACD, and volume analysis.`;

  const keywords = coin
    ? `${decodeURIComponent(coin)} price prediction, ${decodeURIComponent(coin)} buy or sell, ${decodeURIComponent(coin)} analysis today, ${decodeURIComponent(coin)} RSI, ${decodeURIComponent(coin)} price target, should I buy ${decodeURIComponent(coin)}, ${decodeURIComponent(coin)} AI analysis, ${decodeURIComponent(coin)} signal`
    : `crypto AI analysis, buy sell signal crypto, bitcoin price prediction AI, ethereum buy or sell, crypto RSI analysis, crypto MACD signal, FinBERT crypto sentiment, best time to buy crypto, crypto technical analysis free`;

  const canonicalUrl = `${BASE_URL}/${locale}/coin-analysis${coin ? `?coin=${coin}` : ''}`;

  const alternateLanguages = LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/coin-analysis${coin ? `?coin=${coin}` : ''}`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url:    `${BASE_URL}/og-coin-analysis.png`,
        width:  1200,
        height: 630,
        alt:    `${coinName} — AI Buy/Sell Signal`,
      }],
      locale,
      type: 'website',
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841',
      creator:     '@cryptonews90841',
      title,
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
  const { locale }   = await params;
  const { coin = '' } = await searchParams || {};

  const coinName    = coin ? decodeURIComponent(coin) : null;
  const canonicalUrl = `${BASE_URL}/${locale}/coin-analysis${coin ? `?coin=${coin}` : ''}`;

  // ── Schema 1: WebPage ─────────────────────────────────────
  const webPageSchema = {
    '@context':  'https://schema.org',
    '@type':     'WebPage',
    name:         coinName
      ? `${coinName} AI Price Analysis & Buy/Sell Signal`
      : 'AI Crypto Analysis Tool — Buy/Sell/Hold Signals',
    description:  coinName
      ? `Real-time ${coinName} analysis with AI buy/sell signals, RSI, MACD, support/resistance levels`
      : 'Free AI-powered crypto analysis. Get buy/sell/hold signals for 1000+ coins using FinBERT, RSI, MACD.',
    url:          canonicalUrl,
    inLanguage:   locale,
    dateModified: new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  // ── Schema 2: SoftwareApplication ────────────────────────
  const appSchema = {
    '@context':        'https://schema.org',
    '@type':           'SoftwareApplication',
    name:               'CryptoNewsTrend AI Coin Analyzer',
    applicationCategory: 'FinanceApplication',
    operatingSystem:   'Web Browser',
    url:                canonicalUrl,
    description:       'Free AI-powered cryptocurrency buy/sell signal tool using FinBERT sentiment analysis, RSI, MACD, and volume indicators.',
    offers: {
      '@type': 'Offer',
      price:   '0',
      priceCurrency: 'USD',
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
      name:     SITE_NAME,
      url:      BASE_URL,
    },
  };

  // ── Schema 3: FAQPage ─────────────────────────────────────
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

  // ── Schema 4: BreadcrumbList ──────────────────────────────
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
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema)  }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Client Component */}
      <CoinAnalysisPage locale={locale} initialCoin={coinName} />
    </>
  );
}