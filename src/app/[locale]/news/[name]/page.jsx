import NewsTypedata from "../../../../../components/news-type/news_type";
import NewstypeApi from "../../../../../apis/page_news/newstype";
import Page_NewsData from "../../../../../apis/page_news/page_newsData";
import { getDictionary } from "../../../../../i18n/getDictionary";
import MobileSupportButton from "../../../../../components/Right_side/MobileSupportButton";
import CoinAnalysisFloat from "../../../../../components/Data/CoinAnalysisFloat";

export const dynamicParams = false;
export const revalidate = 900;

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNewsTrend";
const DEFAULT_IMAGE     = `${BASE_URL}/og-image.png`;
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const staticContent = {
  bitcoin: {
    title: "Bitcoin News, Price Analysis & BTC Predictions",
    description: "Get latest Bitcoin news, BTC price predictions, and expert market analysis. Stay updated with real-time Bitcoin trends, halving updates, and institutional news.",
    keywords: "Bitcoin news, BTC price prediction, Bitcoin market analysis, BTC trends, Bitcoin halving, crypto news, BTC news today",
    image: `${BASE_URL}/images/categories/bitcoin.png`,
  },
  ethereum: {
    title: "Ethereum News, ETH Price Analysis & DeFi Updates",
    description: "Stay informed with real-time Ethereum news, ETH price predictions, and technical analysis. Explore Ethereum 2.0 updates, gas fees, and DeFi ecosystem trends.",
    keywords: "Ethereum news, ETH price prediction, Ethereum analysis, ETH updates, DeFi news, Ethereum 2.0, smart contracts",
    image: `${BASE_URL}/images/categories/ethereum.png`,
  },
  blockchain: { 
    title: "Blockchain News, Web3 Trends & Technology Insights", 
    description: "Latest blockchain technology news, decentralized solutions, and enterprise adoption trends. Explore how Web3 and blockchain are transforming global industries.", 
    keywords: "blockchain news, blockchain technology, Web3 trends, decentralized ledger, enterprise blockchain, crypto technology", 
    image: `${BASE_URL}/images/categories/blockchain.png` 
  },
  defi: { 
    title: "DeFi News – Decentralized Finance & Yield Farming", 
    description: "Get the latest DeFi news, decentralized finance protocol updates, and yield farming insights. Stay updated with DEX trends, lending protocols, and DeFi prices.", 
    keywords: "DeFi news, decentralized finance, yield farming, crypto lending, DEX updates, DeFi protocols, crypto passive income", 
    image: `${BASE_URL}/images/categories/defi.png` 
  },
  nfts: { 
    title: "NFT News – Digital Art, Market Trends & Minting", 
    description: "Explore the latest NFT news, marketplace trends, and upcoming NFT drops. Stay informed about digital art, metaverse assets, and non-fungible token developments.", 
    keywords: "NFT news, NFT marketplace, digital art, NFT drops, metaverse news, non-fungible tokens, NFT trends", 
    image: `${BASE_URL}/images/categories/nfts.png` 
  },
  cryptocurrency: { 
    title: "Cryptocurrency News – Market Trends & Analysis", 
    description: "Daily cryptocurrency news, global market analysis, and breaking crypto updates. Stay ahead with expert insights on digital assets and blockchain regulations.", 
    keywords: "cryptocurrency news, crypto market analysis, breaking crypto news, digital assets, crypto regulation, blockchain news", 
    image: `${BASE_URL}/images/categories/cryptocurrency.png` 
  },
  altcoin: { 
    title: "Altcoin News – Price Predictions & Hidden Gems", 
    description: "Get deep-dive altcoin news, price predictions, and analysis of emerging cryptocurrencies. Discover high-potential altcoins and market sentiment analysis.", 
    keywords: "altcoin news, altcoin price prediction, crypto gems, altcoin analysis, cryptocurrency trends, small-cap crypto", 
    image: `${BASE_URL}/images/categories/altcoin.png` 
  },
  staking: { 
    title: "Crypto Staking News – Passive Income & Rewards", 
    description: "Latest crypto staking news, validator updates, and staking reward comparisons. Learn how to earn passive income with Proof-of-Stake (PoS) cryptocurrencies.", 
    keywords: "crypto staking news, staking rewards, passive income crypto, proof of stake, PoS rewards, liquid staking", 
    image: `${BASE_URL}/images/categories/staking.png` 
  },
  dao: { 
    title: "DAO News – Decentralized Governance & Web3", 
    description: "Explore DAO news, on-chain governance proposals, and decentralized organization trends. Stay updated with treasury management and Web3 voting mechanisms.", 
    keywords: "DAO news, decentralized autonomous organizations, crypto governance, Web3 governance, on-chain voting", 
    image: `${BASE_URL}/images/categories/dao.png` 
  },
  mining: { 
    title: "Crypto Mining News – ASIC, Hashrate & GPU Mining", 
    description: "Breaking crypto mining news, ASIC hardware reviews, and mining pool updates. Stay informed on global hashrate trends, energy efficiency, and mining profitability.", 
    keywords: "crypto mining news, ASIC mining, hashrate trends, mining profitability, GPU mining, Bitcoin mining, mining pools", 
    image: `${BASE_URL}/images/categories/mining.png` 
  },
};

// ✅ FIX: Suffix ko simple rakha taake double branding na ho
const LOCALE_SUFFIX = {
  en: `| ${SITE_NAME}`, 
  ur: `| کرپٹو نیوز ٹرینڈ`, 
  ar: `| كريبتو نيوز`, 
  es: `| CryptoNewsTrend`,
  fr: `| CryptoNewsTrend`, 
  de: `| CryptoNewsTrend`, 
  ru: `| CryptoNewsTrend`, 
  'zh-CN': `| 加密新闻趋势`,
};

function getCatMeta(news_name, locale) {
  const cat = staticContent[news_name];
  const suffix = LOCALE_SUFFIX[locale] || LOCALE_SUFFIX["en"];
  return {
    title: cat ? `${cat.title} ${suffix}` : `Latest ${news_name} News ${suffix}`,
    description: cat ? cat.description : `Latest ${news_name} analysis.`,
    keywords: cat ? cat.keywords : `${news_name}, crypto`,
    image: cat ? cat.image : DEFAULT_IMAGE,
  };
}

export async function generateStaticParams() {
  return Object.keys(staticContent).flatMap((name) =>
    SUPPORTED_LOCALES.map((locale) => ({ name, locale }))
  );
}

export async function generateMetadata({ params }) {
  const { name, locale } = await params;
  const news_name = name.toLowerCase();
  const { title, description, keywords, image } = getCatMeta(news_name, locale);

  const isEn = locale === 'en';
  const canonicalUrl = isEn ? `${BASE_URL}/news/${news_name}` : `${BASE_URL}/${locale}/news/${news_name}`;

  const languages = {};
  SUPPORTED_LOCALES.forEach((lang) => {
const hreflang = lang === "zh-CN" ? "zh-Hans" : lang;
    languages[hreflang] = lang === 'en' 
      ? `${BASE_URL}/news/${news_name}` 
      : `${BASE_URL}/${lang}/news/${news_name}`;
  });
  languages["x-default"] = `${BASE_URL}/news/${news_name}`;

  // Mapping locale to OG standard
  const ogLocaleMap = { en: 'en_US', ur: 'ur_PK', ar: 'ar_SA', es: 'es_ES' };
  const ogLocale = ogLocaleMap[locale] || 'en_US';

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: ogLocale, // ✅ Added Locale
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Main({ params }) {
  const { name, locale } = await params;
  const news_name = name.toLowerCase();
  const { title, description } = getCatMeta(news_name, locale);

  const [top_newsdata, Apidata, dict] = await Promise.all([
    Page_NewsData(1, locale),
    NewstypeApi(news_name, 1, locale),
    getDictionary(locale).catch(() => ({})),
  ]);

  // ✅ SEO: JSON-LD Structured Data
// ✅ SEO: JSON-LD Structured Data with Locale-Aware Links
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": locale === 'en' ? `${BASE_URL}/news/${news_name}` : `${BASE_URL}/${locale}/news/${news_name}`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (Apidata?.data?.results || []).slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        // ✅ Fix: Locale-specific news links for better ranking
        "url": locale === 'en' 
          ? `${BASE_URL}/${item.slug}` 
          : `${BASE_URL}/${locale}/${item.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* SEO TIP: NewsTypedata component ke andar check karein ke 
         wahan <h1>{pageTitle}</h1> hi use ho raha ho. 
         Ek page par sirf ek H1 hona chahiye ranking ke liye.
      */}
      
      <NewsTypedata
        locale={locale}
        dict={dict}
        news_name={news_name}
        topnews={top_newsdata?.results}
        serverData={Apidata?.data?.results || []}
        total_pages={Apidata?.data?.total_pages}
        current_page={Apidata?.data?.current_page}
        pageTitle={title}
      />
      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}