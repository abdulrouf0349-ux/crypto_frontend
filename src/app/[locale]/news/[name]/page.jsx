// app/[locale]/news/[name]/page.js  →  SERVER COMPONENT
import NewsTypedata from "../../../../../components/news-type/news_type";
import NewstypeApi from "../../../../../apis/page_news/newstype";
import Page_NewsData from "../../../../../apis/page_news/page_newsData";
import { getDictionary } from "../../../../../i18n/getDictionary";
export const dynamicParams = false; // ✅ sirf in 10 categories ke pages — baaki 404
export const revalidate = 3600;
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews";
const DEFAULT_IMAGE     = `${BASE_URL}/og-image.png`;
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN"]; // ✅ zh → zh-CN

// ─────────────────────────────────────────────
// STATIC CATEGORY CONTENT (English base)
// ─────────────────────────────────────────────
const staticContent = {
  bitcoin: {
    title:         "Bitcoin News, Price Analysis & BTC Predictions",
    description:   "Get the latest Bitcoin news, BTC price predictions, on-chain analysis, and expert market insights. Stay ahead in the crypto market.",
    keywords:      "Bitcoin, BTC, Bitcoin price prediction, BTC analysis, Bitcoin news, cryptocurrency, blockchain",
    image:         `${BASE_URL}/images/categories/bitcoin.jpg`,
    datePublished: "2025-01-01",
  },
  ethereum: {
    title:         "Ethereum News, ETH Price Analysis & Updates",
    description:   "Stay informed with the latest Ethereum news, ETH price analysis, Ethereum 2.0 updates, and DeFi ecosystem developments.",
    keywords:      "Ethereum, ETH, Ethereum price prediction, ETH analysis, blockchain, cryptocurrency, Ethereum 2.0",
    image:         `${BASE_URL}/images/categories/ethereum.jpg`,
    datePublished: "2025-01-01",
  },
  blockchain: {
    title:         "Blockchain News, Trends & Technology Insights",
    description:   "Explore the latest blockchain technology news, decentralized applications, enterprise blockchain, and industry adoption trends.",
    keywords:      "blockchain, blockchain news, blockchain technology, decentralized, crypto blockchain, Web3",
    image:         `${BASE_URL}/images/categories/blockchain.jpg`,
    datePublished: "2025-01-01",
  },
  defi: {
    title:         "DeFi News – Decentralized Finance Updates & Prices",
    description:   "Explore decentralized finance with live DeFi prices, protocol updates, yield farming insights, and the latest DeFi project launches.",
    keywords:      "DeFi, decentralized finance, DeFi news, DeFi price prediction, yield farming, DeFi protocols",
    image:         `${BASE_URL}/images/categories/defi.jpg`,
    datePublished: "2025-01-01",
  },
  nfts: {
    title:         "NFT News – Non-Fungible Token Trends & Market Updates",
    description:   "Stay updated with the latest NFT news, top NFT collections, marketplace trends, and emerging digital artists in the NFT space.",
    keywords:      "NFTs, non-fungible tokens, NFT news, NFT marketplace, NFT collections, digital art",
    image:         `${BASE_URL}/images/categories/nfts.jpg`,
    datePublished: "2025-01-01",
  },
  cryptocurrency: {
    title:         "Cryptocurrency News – Latest Crypto Updates & Analysis",
    description:   "Stay up to date with the latest cryptocurrency news, altcoin analysis, price predictions, and market sentiment from global crypto experts.",
    keywords:      "cryptocurrency, crypto news, cryptocurrency analysis, price predictions, blockchain news, altcoin",
    image:         `${BASE_URL}/images/categories/cryptocurrency.jpg`,
    datePublished: "2025-01-01",
  },
  altcoin: {
    title:         "Altcoin News – Emerging Crypto Coins & Price Predictions",
    description:   "Get the latest altcoin news, price predictions, and in-depth analysis of emerging cryptocurrencies and small-cap gems.",
    keywords:      "altcoin, altcoin news, cryptocurrency, altcoin price prediction, market analysis, small-cap crypto",
    image:         `${BASE_URL}/images/categories/altcoin.jpg`,
    datePublished: "2025-01-01",
  },
  staking: {
    title:         "Crypto Staking News – Rewards, Yields & Opportunities",
    description:   "Discover the latest staking news, best staking rewards, validator updates, and liquid staking opportunities in the crypto ecosystem.",
    keywords:      "staking, crypto staking, staking rewards, liquid staking, DeFi staking, proof of stake",
    image:         `${BASE_URL}/images/categories/staking.jpg`,
    datePublished: "2025-01-01",
  },
  dao: {
    title:         "DAO News – Decentralized Autonomous Organizations & Governance",
    description:   "Explore the latest DAO news, on-chain governance proposals, treasury updates, and the evolving role of DAOs in Web3.",
    keywords:      "DAO, decentralized autonomous organizations, crypto governance, on-chain voting, DAO news, Web3",
    image:         `${BASE_URL}/images/categories/dao.jpg`,
    datePublished: "2025-01-01",
  },
  mining: {
    title:         "Crypto Mining News – Hardware, Pools & Mining Trends",
    description:   "Stay up to date with the latest cryptocurrency mining news, ASIC hardware reviews, mining pool rankings, and hashrate trends.",
    keywords:      "mining, cryptocurrency mining, crypto mining news, ASIC hardware, mining pools, hashrate",
    image:         `${BASE_URL}/images/categories/mining.jpg`,
    datePublished: "2025-01-01",
  },
};

// ─────────────────────────────────────────────
// LOCALE TITLE SUFFIX — hreflang ke liye
// ─────────────────────────────────────────────
const LOCALE_SUFFIX = {
  en:      `| ${SITE_NAME}`,
  ur:      `| کرپٹو نیوز`,
  ar:      `| أخبار العملات`,
  es:      `| CryptoNoticias`,
  fr:      `| CryptoActualités`,
  de:      `| KryptoNachrichten`,
  'zh-CN': `| 加密新闻`,
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function getCatMeta(news_name, locale) {
  const cat    = staticContent[news_name];
  const suffix = LOCALE_SUFFIX[locale] || LOCALE_SUFFIX['en'];

  const title = cat
    ? `${cat.title} ${suffix}`
    : `Latest ${capitalize(news_name)} News & Updates ${suffix}`;

  const description = cat
    ? cat.description
    : `Stay up to date with the latest ${capitalize(news_name)} news, market trends, and blockchain insights.`;

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
// 2. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { name, locale } = await params;
  const news_name        = name.toLowerCase();
  const canonicalUrl     = `${BASE_URL}/${locale}/news/${news_name}`;

  const { title, description, keywords, image } = getCatMeta(news_name, locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/news/${news_name}`;
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
      images:   [{ url: image, width: 1200, height: 630, alt: title }],
      locale,
      type:     "website",
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841", // ✅ @yourhandle fix
      title,
      description,
      images:      [image],
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
    getDictionary(locale).catch(() => ({})), // ✅ crash nahi hoga
  ]);

  const filteredArticles = Apidata?.data?.results  || [];
  const current_page     = Apidata?.data?.current_page;
  const total_pages      = Apidata?.data?.total_pages;

  // ── Schema 1: CollectionPage ──────────────────────────────
  const collectionPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    name:          title,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    ...(cat?.datePublished && { datePublished: cat.datePublished }),
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
    image: {
      "@type":  "ImageObject",
      url:      image,
      width:    1200,
      height:   630,
    },
  };

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",              item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "News",              item: `${BASE_URL}/${locale}/news` },
      { "@type": "ListItem", position: 3, name: capitalize(news_name), item: canonicalUrl },
    ],
  };

  // ── Schema 3: ItemList — Google News rich results ─────────
  const itemListSchema = filteredArticles.length > 0 ? {
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
  } : null;

  // ── Schema 4: WebSite (sitelinks searchbox) ───────────────
  const webPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    name:          title,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <NewsTypedata
        locale={locale}
        dict={dict}
        news_name={news_name}
        topnews={top_newsdata?.results}
        serverData={filteredArticles}
        total_pages={total_pages}
        current_page={current_page}
      />
    </>
  );
}