// app/[locale]/coin-analysis/page.jsx
// ============================================================
// SEO FIXES APPLIED (per audit report):
//  1. financialServiceSchema defined (was undefined — broke all schema)
//  2. Dynamic locale-aware canonical URL
//  3. Dynamic per-coin metadata via generateMetadata
//  4. websiteSchema + SearchAction added
//  5. organizationSchema linked correctly
//  6. SSR: initialData fetched server-side, passed as prop
//  7. H1 moved to visible hero (in data.jsx)
//  8. datePublished added for Google Discover
// ============================================================

import Script from "next/script";
import CoinAnalysisPage from "./data";

// ─── Constants ──────────────────────────────────────────────
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const PAGE_PATH = "/coin-analysis";
const YEAR      = new Date().getFullYear();

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

// Coin display names for dynamic metadata
const COIN_NAMES = {
  bitcoin:       "Bitcoin (BTC)",
  ethereum:      "Ethereum (ETH)",
  binancecoin:   "BNB",
  solana:        "Solana (SOL)",
  ripple:        "XRP",
  cardano:       "Cardano (ADA)",
  dogecoin:      "Dogecoin (DOGE)",
  "avalanche-2": "Avalanche (AVAX)",
  polkadot:      "Polkadot (DOT)",
  chainlink:     "Chainlink (LINK)",
  "matic-network": "Polygon (MATIC)",
  "shiba-inu":   "Shiba Inu (SHIB)",
  tron:          "TRON (TRX)",
  uniswap:       "Uniswap (UNI)",
  litecoin:      "Litecoin (LTC)",
};

// ─── SSR: Fetch initial coin data server-side ─────────────────────────────────
// FIX: SSR data fetching so page renders with content, not empty shell
async function getInitialCoinData(coinId = "bitcoin") {
  try {
    const baseUrl = SITE_URL;
    const res = await fetch(`${baseUrl}/api/coin-data?id=${coinId}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── hreflang map ───────────────────────────────────────────
const buildHreflang = (locale = "en") => {
  // FIX: Each locale gets its OWN canonical, not always /en
  return Object.fromEntries([
    ...VALID_LOCALES.map((loc) => [
      loc === "zh" ? "zh-Hans" : loc,
      loc === "en"
        ? `${SITE_URL}${PAGE_PATH}`
        : `${SITE_URL}/${loc}${PAGE_PATH}`,
    ]),
    ["x-default", `${SITE_URL}${PAGE_PATH}`],
  ]);
};

// ─── FIX: Dynamic Metadata per coin + locale ──────────────────────────────────
// Replaces static `export const metadata = {}` so each coin gets unique title/desc
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = (await params) ?? {};
  const resolvedSearchParams = (await searchParams) ?? {};
  const locale = resolvedParams.locale ?? "en";
  const coinId = resolvedSearchParams.coin ?? "bitcoin";
  const coinName = COIN_NAMES[coinId] ?? (coinId.charAt(0).toUpperCase() + coinId.slice(1)); 



  // FIX: locale-aware canonical (audit issue #2)
  const canonical =
    locale === "en"
      ? `${SITE_URL}${PAGE_PATH}`
      : `${SITE_URL}/${locale}${PAGE_PATH}`;

  // FIX: Dynamic, coin-specific title + description (audit issue #4)
  const title = `${coinName} Price Prediction ${YEAR}, RSI, MACD & AI Analysis | ${SITE_NAME}`;
  const description = `Get AI-powered ${coinName} price prediction for ${YEAR}. Real-time RSI, MACD, Bollinger Bands, support & resistance levels, buy/sell signals and technical analysis updated live.`;

  return {
    title,
    description,
    keywords: [
      `${coinName} price prediction ${YEAR}`,
      `${coinName} technical analysis`,
      `${coinName} RSI MACD`,
      `${coinName} buy sell signal`,
      `${coinName} AI analysis`,
      `crypto coin analysis ${YEAR}`,
      "crypto buy sell signals",
      "crypto market sentiment",
      `best crypto to buy ${YEAR}`,
    ],

    alternates: {
      canonical,
      languages: buildHreflang(locale),
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        "max-image-preview": "large",
        "max-snippet":       -1,
      },
    },

    openGraph: {
      type:        "website",
      url:         canonical,
      siteName:    SITE_NAME,
      title,
      description,
      locale:      locale === "en" ? "en_US" : locale,
      images: [
        {
          url:    `${SITE_URL}/og-coin-analysis.png`,
          width:  1200,
          height: 630,
          alt:    `${coinName} Price Prediction ${YEAR} — AI Signals & Technical Analysis`,
        },
      ],
    },

    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [`${SITE_URL}/og-coin-analysis.png`],
    },

    // E-E-A-T signals
    authors:   [{ name: SITE_NAME, url: SITE_URL }],
    creator:   SITE_NAME,
    publisher: SITE_NAME,
    category:  "finance",
  };
}

// ─── Page Component ─────────────────────────────────────────
export default async function Page({ params, searchParams }) {
  const resolvedParams = (await params) ?? {};
  const resolvedSearchParams = (await searchParams) ?? {};
  const locale = resolvedParams.locale ?? "en";
  const coinId = resolvedSearchParams.coin ?? "bitcoin";
  const pageUrl = locale === "en"
    ? `${SITE_URL}${PAGE_PATH}`
    : `${SITE_URL}/${locale}${PAGE_PATH}`;

  // FIX: SSR fetch so page has real content for Google crawl (audit issue)
  const initialData = await getInitialCoinData(coinId);

  const now = new Date().toISOString();

  // ── JSON-LD 1: WebSite + SearchAction (FIX: was missing — audit issue) ──────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${SITE_URL}#website`,
    name:       SITE_NAME,
    url:        SITE_URL,
    potentialAction: {
      "@type":        "SearchAction",
      target:         `${SITE_URL}/search?q={search_term_string}`,
      "query-input":  "required name=search_term_string",
    },
  };

  // ── JSON-LD 2: Organization (FIX: properly linked via @id) ──────────────────
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${SITE_URL}#organization`,
    name:       SITE_NAME,
    url:        SITE_URL,
    logo: {
      "@type": "ImageObject",
      url:     `${SITE_URL}/logo.png`,
      width:   "200",
      height:  "60",
    },
  };

  // ── JSON-LD 3: CollectionPage ────────────────────────────────────────────────
  const collectionPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    "@id":        pageUrl,
    url:          pageUrl,
    name:         `Crypto Coin Analysis ${YEAR} — AI Price Predictions & Technical Signals | ${SITE_NAME}`,
    description:  `Explore AI-powered crypto coin analysis for Bitcoin, Ethereum & top altcoins. Get real-time technical indicators, RSI, MACD, market sentiment, and price predictions — updated live ${YEAR}.`,
    inLanguage:   locale,
    datePublished: "2024-01-01T00:00:00Z",   // FIX: added for Discover eligibility
    dateModified:  now,
    speakable: {
      "@type":      "SpeakableSpecification",
      cssSelector:  [".hero", ".big-signal"],
    },
    mentions: [
      { "@type": "Thing", name: "Bitcoin" },
      { "@type": "Thing", name: "Ethereum" },
      { "@type": "Thing", name: "Solana" },
    ],
    isPartOf: {
      "@type": "WebSite",
      "@id":   `${SITE_URL}#website`,   // FIX: linked via @id
    },
    about: {
      "@type": "Thing",
      name:    "Cryptocurrency Price Analysis",
    },
    publisher: {
      "@type": "Organization",
      "@id":   `${SITE_URL}#organization`,  // FIX: linked via @id
    },
  };

  // ── JSON-LD 4: BreadcrumbList ────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      {
        "@type":  "ListItem",
        position: 1,
        name:     "Home",
        item:     SITE_URL,
      },
      {
        "@type":  "ListItem",
        position: 2,
        name:     "Coin Analysis",
        item:     pageUrl,
      },
    ],
  };

  // ── JSON-LD 5: ItemList ──────────────────────────────────────────────────────
  const itemListSchema = {
    "@context":    "https://schema.org",
    "@type":       "ItemList",
    name:          `Top Crypto Coin Analysis ${YEAR}`,
    description:   `AI-powered analysis for the top cryptocurrencies in ${YEAR}`,
    url:           pageUrl,
    numberOfItems: 10,
    itemListElement: [
      { "@type": "ListItem", position: 1,  name: "Bitcoin (BTC) Analysis",     url: `${SITE_URL}${PAGE_PATH}/bitcoin?symbol=btc`   },
      { "@type": "ListItem", position: 2,  name: "Ethereum (ETH) Analysis",    url: `${SITE_URL}${PAGE_PATH}/ethereum?symbol=eth`  },
      { "@type": "ListItem", position: 3,  name: "BNB Analysis",               url: `${SITE_URL}${PAGE_PATH}/bnb?symbol=bnb`        },
      { "@type": "ListItem", position: 4,  name: "Solana (SOL) Analysis",      url: `${SITE_URL}${PAGE_PATH}/solana?symbol=sol`    },
      { "@type": "ListItem", position: 5,  name: "XRP Analysis",               url: `${SITE_URL}${PAGE_PATH}/xrp?symbol=xrp`       },
      { "@type": "ListItem", position: 6,  name: "Cardano (ADA) Analysis",     url: `${SITE_URL}${PAGE_PATH}/cardano?symbol=ada`   },
      { "@type": "ListItem", position: 7,  name: "Dogecoin (DOGE) Analysis",   url: `${SITE_URL}${PAGE_PATH}/dogecoin?symbol=doge` },
      { "@type": "ListItem", position: 8,  name: "Avalanche (AVAX) Analysis",  url: `${SITE_URL}${PAGE_PATH}/avalanche?symbol=avax`},
      { "@type": "ListItem", position: 9,  name: "Polkadot (DOT) Analysis",    url: `${SITE_URL}${PAGE_PATH}/polkadot?symbol=dot`  },
      { "@type": "ListItem", position: 10, name: "Chainlink (LINK) Analysis",  url: `${SITE_URL}${PAGE_PATH}/chainlink?symbol=link`},
    ],
  };

  // ── JSON-LD 6: FAQPage ───────────────────────────────────────────────────────
  // FIX: Entity-rich questions per audit AI SEO recommendations
  const faqSchema = {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is Bitcoin technical analysis?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `Bitcoin technical analysis uses indicators like RSI, MACD, EMA, and Bollinger Bands to identify BTC price trends and generate buy/sell signals. ${SITE_NAME} provides AI-powered Bitcoin technical analysis updated in real time for ${YEAR}.`,
        },
      },
      {
        "@type": "Question",
        name:    "How accurate is Ethereum price prediction?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `Ethereum price prediction accuracy depends on market conditions and the indicators used. ${SITE_NAME}'s AI model combines RSI, MACD, volume, and on-chain data to generate ETH predictions with a confidence score. No prediction is 100% guaranteed — always manage your risk.`,
        },
      },
      {
        "@type": "Question",
        name:    "Will Solana reach $500?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `Whether Solana reaches $500 depends on broader market trends, adoption, and technical momentum. Check ${SITE_NAME}'s live Solana analysis page for current RSI, MACD signals, and AI price targets updated in real time.`,
        },
      },
      {
        "@type": "Question",
        name:    "What are the best crypto buy/sell signals today?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `${SITE_NAME} tracks AI-powered buy/sell signals for Bitcoin, Ethereum, Solana, BNB, XRP, and 100+ altcoins. Signals are generated from RSI, MACD crossovers, Bollinger Band breakouts, and order book pressure — updated every 60 seconds in ${YEAR}.`,
        },
      },
      {
        "@type": "Question",
        name:    "How often is the coin analysis updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `${SITE_NAME} updates coin analysis data in real time — price signals refresh every 60 seconds, technical indicators update on each new candle close, and AI sentiment is recalculated continuously based on market conditions.`,
        },
      },
    ],
  };

  // ── JSON-LD 7: FinancialService (FIX: was undefined — caused schema crash) ───
  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type":    "FinancialService",
    "@id":      `${SITE_URL}#financialservice`,
    name:       SITE_NAME,
    url:        SITE_URL,
    description: `AI-powered cryptocurrency price analysis, technical indicators, and market signals for Bitcoin, Ethereum, and top altcoins — ${YEAR}.`,
    areaServed: "Worldwide",
    serviceType: "Cryptocurrency Analysis",
    provider: {
      "@type": "Organization",
      "@id":   `${SITE_URL}#organization`,
    },
  };

  return (
    <>
      {/* ── JSON-LD: WebSite + SearchAction ─────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ── JSON-LD: Organization ────────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* ── JSON-LD: CollectionPage ──────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      {/* ── JSON-LD: BreadcrumbList ──────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── JSON-LD: ItemList (top 10 coins) ────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* ── JSON-LD: FAQPage ─────────────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── JSON-LD: FinancialService (FIX: was undefined) ───── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />

      {/*
        H1 is now VISIBLE inside CoinHero component (data.jsx)
        as: "{CoinName} Price Prediction & Analysis"
        No sr-only H1 needed here anymore — audit issue #3 fixed.
      */}

      {/* ── Original component — UI completely UNCHANGED ─────── */}
      {/* FIX: initialData passed for SSR hydration (audit issue) */}
      <CoinAnalysisPage initialData={initialData} />
    </>
  );
}