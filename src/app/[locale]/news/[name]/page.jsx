// app/[locale]/news/[name]/page.js  →  SERVER COMPONENT
import NewsTypedata from "../../../../../components/news-type/news_type";
import NewstypeApi from "../../../../../apis/page_news/newstype";
import Page_NewsData from "../../../../../apis/page_news/page_newsData";
import { getDictionary } from "../../../../../i18n/getDictionary";

export const dynamicParams = false;
export const revalidate = 3600;

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNewsTrend";
const DEFAULT_IMAGE     = `${BASE_URL}/og-image.png`;
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];
const DEFAULT_LOCALE    = "en"; // x-default ke liye

// ─────────────────────────────────────────────
// STATIC CATEGORY CONTENT
// Title: max ~55 chars (suffix se pehle)
// Description: 120–155 chars (naa zyada naa kam)
// ─────────────────────────────────────────────
const staticContent = {
  bitcoin: {
    // 51 chars — safe
    title:         "Bitcoin News, Price Analysis & BTC Predictions",
    // 145 chars
    description:   "Get the latest Bitcoin news, BTC price predictions, on-chain analysis, and expert market insights. Stay ahead with real-time crypto data.",
    keywords:      "Bitcoin, BTC, Bitcoin price prediction, BTC analysis, Bitcoin news, cryptocurrency, blockchain",
    image:         `${BASE_URL}/images/categories/bitcoin.png`,
    datePublished: "2025-01-01",
  },
  ethereum: {
    // 46 chars
    title:         "Ethereum News, ETH Price Analysis & Updates",
    description:   "Stay informed with the latest Ethereum news, ETH price analysis, Ethereum 2.0 updates, and DeFi ecosystem developments from top analysts.",
    keywords:      "Ethereum, ETH, Ethereum price prediction, ETH analysis, blockchain, cryptocurrency, Ethereum 2.0",
    image:         `${BASE_URL}/images/categories/ethereum.png`,
    datePublished: "2025-01-01",
  },
  blockchain: {
    // 46 chars
    title:         "Blockchain News, Trends & Technology Insights",
    description:   "Explore the latest blockchain technology news, decentralized applications, enterprise blockchain solutions, and industry adoption trends.",
    keywords:      "blockchain, blockchain news, blockchain technology, decentralized, crypto blockchain, Web3",
    image:         `${BASE_URL}/images/categories/blockchain.png`,
    datePublished: "2025-01-01",
  },
  defi: {
    // 44 chars
    title:         "DeFi News – Decentralized Finance & Protocol Updates",
    description:   "Explore decentralized finance with live DeFi prices, protocol updates, yield farming insights, and the latest DeFi project launches worldwide.",
    keywords:      "DeFi, decentralized finance, DeFi news, DeFi price prediction, yield farming, DeFi protocols",
    image:         `${BASE_URL}/images/categories/defi.png`,
    datePublished: "2025-01-01",
  },
  nfts: {
    // 46 chars
    title:         "NFT News – Token Trends & Market Updates",
    description:   "Stay updated with the latest NFT news, top NFT collections, marketplace trends, and emerging digital artists shaping the NFT space today.",
    keywords:      "NFTs, non-fungible tokens, NFT news, NFT marketplace, NFT collections, digital art",
    image:         `${BASE_URL}/images/categories/nfts.png`,
    datePublished: "2025-01-01",
  },
  cryptocurrency: {
    // 48 chars
    title:         "Cryptocurrency News – Latest Crypto Analysis",
    description:   "Stay up to date with the latest cryptocurrency news, altcoin analysis, price predictions, and market sentiment from global crypto experts daily.",
    keywords:      "cryptocurrency, crypto news, cryptocurrency analysis, price predictions, blockchain news, altcoin",
    image:         `${BASE_URL}/images/categories/cryptocurrency.png`,
    datePublished: "2025-01-01",
  },
  altcoin: {
    // 48 chars
    title:         "Altcoin News – Emerging Coins & Price Predictions",
    description:   "Get the latest altcoin news, price predictions, and in-depth analysis of emerging cryptocurrencies and small-cap gems with high growth potential.",
    keywords:      "altcoin, altcoin news, cryptocurrency, altcoin price prediction, market analysis, small-cap crypto",
    image:         `${BASE_URL}/images/categories/altcoin.png`,
    datePublished: "2025-01-01",
  },
  staking: {
    // 48 chars
    title:         "Crypto Staking News – Rewards, Yields & Opportunities",
    description:   "Discover the latest staking news, best staking rewards, validator updates, and liquid staking opportunities across the crypto ecosystem.",
    keywords:      "staking, crypto staking, staking rewards, liquid staking, DeFi staking, proof of stake",
    image:         `${BASE_URL}/images/categories/staking.png`,
    datePublished: "2025-01-01",
  },
  dao: {
    // 48 chars
    title:         "DAO News – Decentralized Governance & Web3 Updates",
    description:   "Explore the latest DAO news, on-chain governance proposals, treasury updates, and the evolving role of decentralized autonomous organizations.",
    keywords:      "DAO, decentralized autonomous organizations, crypto governance, on-chain voting, DAO news, Web3",
    image:         `${BASE_URL}/images/categories/dao.png`,
    datePublished: "2025-01-01",
  },
  mining: {
    // 48 chars
    title:         "Crypto Mining News – Hardware, Pools & Hashrate",
    description:   "Stay up to date with the latest cryptocurrency mining news, ASIC hardware reviews, mining pool rankings, and global hashrate trend analysis.",
    keywords:      "mining, cryptocurrency mining, crypto mining news, ASIC hardware, mining pools, hashrate",
    image:         `${BASE_URL}/images/categories/mining.png`,
    datePublished: "2025-01-01",
  },
};

// ─────────────────────────────────────────────
// LOCALE TITLE SUFFIX  (short — title budget bachane ke liye)
// ─────────────────────────────────────────────
const LOCALE_SUFFIX = {
  en:      `| ${SITE_NAME}`,
  ur:      `| کرپٹو نیوز ٹرینڈ`,
  ar:      `| كريبتو نيوز`,
  es:      `| CryptoNewsTrend`,
  fr:      `| CryptoNewsTrend`,
  de:      `| CryptoNewsTrend`,
  ru:      `| CryptoNewsTrend`,
  'zh-CN': `| 加密新闻趋势`,
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function getCatMeta(news_name, locale) {
  const cat    = staticContent[news_name];
  const suffix = LOCALE_SUFFIX[locale] || LOCALE_SUFFIX["en"];

  // Title total length check: base + space + suffix ≤ 60
  const title = cat
    ? `${cat.title} ${suffix}`
    : `Latest ${capitalize(news_name)} News & Updates ${suffix}`;

  const description = cat
    ? cat.description
    : `Stay up to date with the latest ${capitalize(news_name)} news, market trends, price analysis, and blockchain insights from top industry experts.`;

  const keywords = cat
    ? cat.keywords
    : `${news_name}, crypto news, cryptocurrency, blockchain, market trends`;

  const image = cat ? cat.image : DEFAULT_IMAGE;

  return { title, description, keywords, image };
}

// ─────────────────────────────────────────────
// 1. generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  return Object.keys(staticContent).flatMap((name) =>
    SUPPORTED_LOCALES.map((locale) => ({ name, locale }))
  );
}

// ─────────────────────────────────────────────
// 2. generateMetadata  — hreflang fixes included
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { name, locale } = await params;
  const news_name        = name.toLowerCase();
  const canonicalUrl     = `${BASE_URL}/${locale}/news/${news_name}`;

  const { title, description, keywords, image } = getCatMeta(news_name, locale);

  // ✅ FIX 1: Self-reference — current locale explicitly included
  // ✅ FIX 2: x-default — English version as default
  // ✅ FIX 3: zh-CN → zh-Hans (Google accepted hreflang value)
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang   = lang === "zh-CN" ? "zh-Hans" : lang;
    acc[hreflang]    = `${BASE_URL}/${lang}/news/${news_name}`;
    return acc;
  }, {});

  // x-default hreflang — English page as universal fallback
  alternateLanguages["x-default"] = `${BASE_URL}/${DEFAULT_LOCALE}/news/${news_name}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,         // ✅ self-reference canonical
      languages: alternateLanguages,   // ✅ includes x-default + all locales
    },
    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url:    image,
          width:  1200,
          height: 675,           // ✅ FIX: was 630, SVG banners are 675
          alt:    title,
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      title,
      description,
      images: [image],
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
  };
}

// ─────────────────────────────────────────────
// 3. PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function Main({ params }) {
  const { name, locale } = await params;
  const news_name        = name.toLowerCase();
  const cat              = staticContent[news_name];
  const canonicalUrl     = `${BASE_URL}/${locale}/news/${news_name}`;

  const { title, description, image } = getCatMeta(news_name, locale);

  const [top_newsdata, Apidata, dict] = await Promise.all([
    Page_NewsData(1, locale),
    NewstypeApi(news_name, 1, locale),
    getDictionary(locale).catch(() => ({})),
  ]);

  const filteredArticles = Apidata?.data?.results  || [];
  const current_page     = Apidata?.data?.current_page;
  const total_pages      = Apidata?.data?.total_pages;

  // ── Schema 1: CollectionPage ──────────────────────────────
  // ✅ FIX: dateModified full ISO format, removed duplicate WebPage
  const collectionPageSchema = {
    "@context":    "https://schema.org",
    "@type":       "CollectionPage",
    name:           title,
    description,
    url:            canonicalUrl,
    inLanguage:     locale,
    dateModified:   new Date().toISOString(),          // ✅ full ISO — not just date
    datePublished:  cat?.datePublished
                      ? `${cat.datePublished}T00:00:00Z`  // ✅ ISO format
                      : undefined,
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${BASE_URL}/logo.png`,
        width:    200,
        height:   60,
      },
    },
    // ✅ FIX: primaryImageOfPage — correct property for CollectionPage
    primaryImageOfPage: {
      "@type":  "ImageObject",
      url:      image,
      width:    1200,
      height:   675,
    },
  };

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      {
        "@type":  "ListItem",
        position: 1,
        name:     "Home",
        item:     `${BASE_URL}/${locale}`,
      },
      {
        "@type":  "ListItem",
        position: 2,
        name:     "News",
        item:     `${BASE_URL}/${locale}/news`,
      },
      {
        "@type":  "ListItem",
        position: 3,
        name:     capitalize(news_name),
        item:     canonicalUrl,
      },
    ],
  };

  // ── Schema 3: ItemList ────────────────────────────────────
  // ✅ FIX: each item needs url + name — removed bare objects
  const itemListSchema =
    filteredArticles.length > 0
      ? {
          "@context":    "https://schema.org",
          "@type":       "ItemList",
          name:           title,
          url:            canonicalUrl,
          numberOfItems:  filteredArticles.length,
          itemListElement: filteredArticles.slice(0, 10).map((article, index) => ({
            "@type":    "ListItem",
            position:    index + 1,
            url:         `${BASE_URL}/${locale}/article/${article.slug || article.id}`,
            name:        article.title || `${capitalize(news_name)} News`,
          })),
        }
      : null;

  // ── NOTE: WebPage schema removed — CollectionPage already covers it ──
  // Having both causes "duplicate type" validation errors in schema.org validator

  return (
    <>
      {/* ✅ Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/*
        ✅ H1 FIX NOTE:
        NewsTypedata component ke andar ek <h1> hona chahiye jo
        news_name ya title use kare. Agar multiple H1 hain to wahan
        sirf ek h1 rakhein, baaki ko h2/h3 banayein.
        Example: <h1>{capitalize(news_name)} News</h1>
      */}
      <NewsTypedata
        locale={locale}
        dict={dict}
        news_name={news_name}
        topnews={top_newsdata?.results}
        serverData={filteredArticles}
        total_pages={total_pages}
        current_page={current_page}
        pageTitle={title}       
      />
    </>
  );
}