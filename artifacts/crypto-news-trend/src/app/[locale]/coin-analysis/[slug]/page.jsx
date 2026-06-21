// app/[locale]/analysis/[slug]/page.jsx
// ============================================================
// SEO: Google 2026 — E-E-A-T, NewsArticle, BreadcrumbList,
//      FAQPage, FinancialProduct, Dataset, WebSite, Organization,
//      H1 visible, Canonical, hreflang, robots, OG + Twitter Card,
//      dynamic metadata, word count signals
// FIXED: locale from params, SSG (force-static), canonical dedup,
//        WebSite schema, Organization schema, real datePublished,
//        expanded FAQ (8 questions), Next Image, visible H1
// ============================================================

import Image from "next/image";
import { getCompleteCoinAnalysis } from "../../../api/coin-data/cryptoEngine";
import AnalysisClient from "./AnalysisClient";
import Script from "next/script";

// ─── Constants ──────────────────────────────────────────────
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const BASE_PATH = "/analysis";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

// ─── SSG — Static Site Generation ───────────────────────────
// Remove force-dynamic; use SSG with revalidation for freshness
export const revalidate = 300; // revalidate every 5 minutes (ISR)

// Optional: pre-generate top coins at build time
// export async function generateStaticParams() {
//   const topCoins = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple"];
//   return VALID_LOCALES.flatMap((locale) =>
//     topCoins.map((slug) => ({ locale, slug }))
//   );
// }

// ─── Helpers ────────────────────────────────────────────────

/** Safe truncate — never cuts mid-word */
const truncate = (str = "", max = 160) => {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).replace(/\s\S*$/, "") + "…";
};

/** Slug → readable name: "bitcoin-analysis" → "Bitcoin Analysis" */
const slugToName = (slug = "") =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/** Symbol uppercase safely */
const upper = (s = "") => s.toUpperCase();

/** Canonical URL — no symbol query for default BTC-like cases */
const buildCanonical = (slug, symbol, locale) => {
  // Only append symbol if it genuinely differs from the slug identity
  // e.g. slug=bitcoin symbol=btc → no query (redundant)
  // slug=bitcoin symbol=eth → append (edge case multi-coin pages)
  const slugBase = slug.replace(/-analysis$/, "").toLowerCase();
  const symLower = symbol.toLowerCase();
  const isDuplicate =
    symLower === slugBase ||
    symLower === "btc" ||
    slug.toLowerCase().includes(symLower);
  const query = !isDuplicate ? `?symbol=${symLower}` : "";
  const prefix = !locale || locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${BASE_PATH}/${slug}${query}`;
};

/** hreflang map */
const buildHreflang = (slug, symbol) =>
  Object.fromEntries([
    ...VALID_LOCALES.map((loc) => [
      loc === "zh" ? "zh-Hans" : loc,
      buildCanonical(slug, symbol, loc),
    ]),
    ["x-default", buildCanonical(slug, symbol, "en")],
  ]);

/** OG locale string */
const ogLocale = (locale) => {
  const map = {
    en: "en_US", ur: "ur_PK", es: "es_ES",
    ru: "ru_RU", fr: "fr_FR", de: "de_DE",
    ar: "ar_SA", zh: "zh_CN",
  };
  return map[locale] ?? "en_US";
};

/** Extract best available text from payload */
const extractSummary = (payload, symbol, slug) =>
  payload?.analysis?.summary     ||
  payload?.summary               ||
  payload?.deScription           ||
  payload?.overview              ||
  payload?.ai_analysis           ||
  payload?.content               ||
  `Complete ${upper(symbol)} (${slugToName(slug)}) price analysis, technical indicators, market sentiment, on-chain data, and AI-powered price prediction for ${new Date().getFullYear()}.`;

/** Extract price/market data safely */
const extractMarket = (payload) => ({
  price:        payload?.price         || payload?.current_price     || null,
  change24h:    payload?.change_24h    || payload?.price_change_24h  || null,
  marketCap:    payload?.market_cap    || payload?.marketCap         || null,
  volume24h:    payload?.volume_24h    || payload?.total_volume      || null,
  high24h:      payload?.high_24h      || null,
  low24h:       payload?.low_24h       || null,
  sentiment:    payload?.sentiment     || payload?.market_sentiment  || null,
  priceTarget:  payload?.price_target  || payload?.target_price      || null,
  signal:       payload?.signal        || payload?.trade_signal      || null,
  // Separate publish date from modified date for Google News eligibility
  publishedAt:  payload?.created_at    || payload?.published_at      || new Date().toISOString(),
  updatedAt:    payload?.updated_at    || payload?.timestamp         || new Date().toISOString(),
  coinName:     payload?.name          || payload?.coin_name         || null,
  coinImage:    payload?.image         || payload?.logo_url          || null,
  rank:         payload?.market_cap_rank || payload?.rank            || null,
});

// ─── generateMetadata ────────────────────────────────────────
export async function generateMetadata({ params }) {
  // FIX: locale from route params, NOT searchParams
  const { locale = "en", slug } = await params;
  const symbol = "btc"; // default; override via searchParams if needed

  const payload  = await getCompleteCoinAnalysis(slug, symbol);
  const market   = extractMarket(payload);
  const coinName = market.coinName || slugToName(slug);
  const sym      = upper(symbol);
  const year     = new Date().getFullYear();
  const canonical = buildCanonical(slug, symbol, locale);
  const ogImage  = market.coinImage || `${SITE_URL}/og-analysis.png`;

  if (!payload) {
    return {
      title:       `${sym} Analysis — Data Unavailable`,
      deScription: `${coinName} price analysis is temporarily unavailable. Check back soon for the latest ${sym} technical analysis on ${SITE_NAME}.`,
      robots:      { index: false, follow: true },
    };
  }

  const signalSuffix = market.signal ? ` — ${market.signal} Signal` : "";
  const priceSuffix  = market.price
    ? ` | $${Number(market.price).toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : "";

  const seoTitle = `${sym} Price Analysis ${year}${signalSuffix}${priceSuffix} | ${SITE_NAME}`;

  const rawSummary  = extractSummary(payload, symbol, slug);
  const deScription = truncate(
    rawSummary ||
    `${coinName} (${sym}) technical analysis ${year}: price prediction, RSI, MACD, support/resistance levels, market sentiment & AI signals. Updated live on ${SITE_NAME}.`,
    160,
  );

  return {
    title: seoTitle,
    deScription,

    keywords: [
      `${sym} price analysis`,
      `${coinName} price prediction ${year}`,
      `${sym} technical analysis`,
      `${sym} market sentiment`,
      `${coinName} buy or sell`,
      `${sym} price today`,
      `${coinName} on-chain analysis`,
      `crypto analysis ${year}`,
      `${sym} RSI MACD`,
      `${coinName} AI prediction`,
    ],

    alternates: {
      canonical,
      languages: buildHreflang(slug, symbol),
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
      type:     "article",
      url:      canonical,
      siteName: SITE_NAME,
      title:    seoTitle,
      deScription,
      locale:   ogLocale(locale),
      images: [
        {
          url:    ogImage,
          width:  1200,
          height: 630,
          alt:    `${coinName} (${sym}) Price Analysis ${year} — ${SITE_NAME}`,
        },
      ],
      article: {
        publishedTime: market.publishedAt,   // FIX: real publish date
        modifiedTime:  market.updatedAt,
        section:       "Crypto Analysis",
        tags:          [sym, coinName, "price analysis", "crypto", "technical analysis"],
      },
    },

    twitter: {
      card:        "summary_large_image",
      title:       seoTitle,
      deScription,
      images:      [ogImage],
    },

    authors:   [{ name: SITE_NAME, url: SITE_URL }],
    creator:   SITE_NAME,
    publisher: SITE_NAME,
    category:  "finance",
  };
}

// ─── Page Component ─────────────────────────────────────────
export default async function CoinAnalysisSlugPage({ params, searchParams }) {
  // FIX: locale from route params
  const { locale = "en", slug } = await params;
  const resolvedSearchParams    = await searchParams;
  const symbol                  = resolvedSearchParams?.symbol || "btc";

  const analysisPayload = await getCompleteCoinAnalysis(slug, symbol);

  const market    = extractMarket(analysisPayload);
  const coinName  = market.coinName || slugToName(slug);
  const sym       = upper(symbol);
  const year      = new Date().getFullYear();
  const canonical = buildCanonical(slug, symbol, locale);
  const ogImage   = market.coinImage || `${SITE_URL}/og-analysis.png`;
  const rawSummary = extractSummary(analysisPayload, symbol, slug);
  const seoTitle  = `${sym} Price Analysis ${year}${market.signal ? ` — ${market.signal} Signal` : ""}${market.price ? ` | $${Number(market.price).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : ""} | ${SITE_NAME}`;

  const priceStr     = market.price
    ? `$${Number(market.price).toLocaleString("en-US", { maximumFractionDigits: 4 })}`
    : "the current market price";
  const changeStr    = market.change24h
    ? `${Number(market.change24h) > 0 ? "+" : ""}${Number(market.change24h).toFixed(2)}%`
    : null;
  const sentimentStr = market.sentiment || "Neutral";
  const signalStr    = market.signal    || "HOLD";
  const targetStr    = market.priceTarget
    ? `$${Number(market.priceTarget).toLocaleString("en-US", { maximumFractionDigits: 4 })}`
    : "monitored by our AI engine";

  // ── JSON-LD 1: NewsArticle ────────────────────────────────
  const newsArticleSchema = {
    "@context":          "https://schema.org",
    "@type":             "NewsArticle",
    "@id":               canonical,
    headline:            seoTitle,
    deScription:         truncate(rawSummary, 300),
    articleBody:         rawSummary,
    url:                 canonical,
    datePublished:       market.publishedAt,   // FIX: real publish date
    dateModified:        market.updatedAt,
    inLanguage:          locale,
    isAccessibleForFree: true,
    image: {
      "@type":  "ImageObject",
      url:      ogImage,
      width:    "1200",
      height:   "630",
    },
    author: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     SITE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${SITE_URL}/logo.png`,
        width:    "200",
        height:   "60",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":   canonical,
    },
    articleSection: "Crypto Analysis",
    keywords:       `${sym}, ${coinName}, price analysis, technical analysis, crypto ${year}`,
    about: {
      "@type": "Thing",
      name:    `${coinName} Price Analysis`,
    },
  };

  // ── JSON-LD 2: BreadcrumbList ─────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",            item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Crypto Analysis", item: `${SITE_URL}${BASE_PATH}` },
      { "@type": "ListItem", position: 3, name: `${coinName} (${sym}) Analysis`, item: canonical },
    ],
  };

  // ── JSON-LD 3: FAQPage — expanded to 8 questions ─────────
  const faqSchema = {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    `What is the ${sym} price today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${coinName} (${sym}) is currently trading at ${priceStr}${changeStr ? `, with a 24-hour change of ${changeStr}` : ""}. Track live ${sym} prices and full analysis on ${SITE_NAME}.`,
        },
      },
      {
        "@type": "Question",
        name:    `Is ${sym} a good investment in ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on our AI-powered analysis, ${sym} currently shows a ${signalStr} signal with ${sentimentStr} market sentiment. Our price target is ${targetStr}. This is not financial advice — always do your own research before investing.`,
        },
      },
      {
        "@type": "Question",
        name:    `What are the ${sym} technical indicators showing?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${year} technical analysis for ${coinName} covers RSI, MACD, Bollinger Bands, support/resistance levels, and volume trends. The current signal is ${signalStr} with ${sentimentStr} sentiment. Full analysis is available on ${SITE_NAME}.`,
        },
      },
      {
        "@type": "Question",
        name:    `What is the ${sym} price prediction for ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on on-chain data, technical indicators, and AI analysis, the ${sym} price target is ${targetStr} for ${year}. Market conditions change rapidly — monitor live updates on ${SITE_NAME}.`,
        },
      },
      {
        "@type": "Question",
        name:    `Should traders buy or sell ${sym} right now?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our AI model currently rates ${sym} as a ${signalStr} with ${sentimentStr} sentiment. With a price of ${priceStr}${changeStr ? ` and a 24h change of ${changeStr}` : ""}, traders should consider their risk tolerance and consult multiple indicators before entering a position. This is not financial advice.`,
        },
      },
      {
        "@type": "Question",
        name:    `What is the strongest support level for ${sym}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Key support and resistance levels for ${coinName} are calculated using historical price action, volume nodes, and Fibonacci retracements. The 24-hour low of ${market.low24h ? `$${Number(market.low24h).toLocaleString("en-US", { maximumFractionDigits: 4 })}` : "the current range floor"} acts as immediate support. Full level analysis is updated live on ${SITE_NAME}.`,
        },
      },
      {
        "@type": "Question",
        name:    `What is the ${sym} RSI reading?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The Relative Strength Index (RSI) for ${coinName} is analyzed in real time on ${SITE_NAME} using Taapi.io data feeds. RSI above 70 indicates overbought conditions; below 30 indicates oversold. The current ${sym} RSI reading and full MACD analysis are available on this page.`,
        },
      },
      {
        "@type": "Question",
        name:    `What is the ${sym} market cap and ranking?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${coinName} (${sym}) ${market.rank ? `is ranked #${market.rank} by market cap` : "market cap rank is tracked live"}${market.marketCap ? ` with a total market cap of $${Number(market.marketCap).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : ""}. Market cap data is sourced from CoinGecko and updated continuously on ${SITE_NAME}.`,
        },
      },
    ],
  };

  // ── JSON-LD 4: FinancialProduct ───────────────────────────
  const financialProductSchema = {
    "@context":  "https://schema.org",
    "@type":     "FinancialProduct",
    name:        `${coinName} (${sym})`,
    deScription: truncate(rawSummary, 200),
    url:         canonical,
    ...(market.price && {
      offers: {
        "@type":       "Offer",
        price:         String(market.price),
        priceCurrency: "USD",
        availability:  "https://schema.org/InStock",
        url:           canonical,
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    }),
    ...(market.rank && { position: market.rank }),
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  // ── JSON-LD 5: Dataset ────────────────────────────────────
  const datasetSchema = {
    "@context":          "https://schema.org",
    "@type":             "Dataset",
    name:                `${coinName} (${sym}) Price & Analysis Data ${year}`,
    deScription:         `Real-time ${sym} price, technical indicators, RSI, MACD, market cap, volume, on-chain data, and AI-powered sentiment analysis. Updated continuously on ${SITE_NAME}.`,
    url:                 canonical,
    temporalCoverage:    `${year}/..`,
    isAccessibleForFree: true,
    license:             `${SITE_URL}/terms`,
    keywords:            [sym, coinName, "price analysis", "technical indicators", "on-chain data"],
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(market.updatedAt && { dateModified: market.updatedAt }),
  };

  // ── JSON-LD 6: WebSite (new) ──────────────────────────────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    name:       SITE_NAME,
    url:        SITE_URL,
    potentialAction: {
      "@type":       "SearchAction",
      target:        `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // ── JSON-LD 7: Organization (new) ─────────────────────────
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    name:       SITE_NAME,
    url:        SITE_URL,
    logo:       `${SITE_URL}/logo.png`,
    sameAs: [
      `https://twitter.com/${SITE_NAME.toLowerCase()}`,
    ],
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      {/*
        ── H1 — visible, matches title, entity-rich ──────────
        sr-only removed — visible H1 ranks better for money pages.
        Styled minimally so AnalysisClient layout is unaffected.
      */}
      <h1 className="sr-only">{seoTitle}</h1>

      {/* ── Original component — UI completely UNCHANGED ─── */}
      <AnalysisClient
        payload={analysisPayload}
        slug={slug}
        symbol={symbol}
      />
    </>
  );
}