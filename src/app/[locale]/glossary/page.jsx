// app/[locale]/glossary/page.jsx

import CoinsPage from "./glosary";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend"; // ✅ FIX 1

// ✅ FIX 3: ru add kiya
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

// ✅ FIX 4: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// ✅ FIX 2: OG locale correct format
const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ✅ FIX 9: 2025 → 2026, ru add kiya
const META = {
  en: {
    title:       "Crypto Coin Glossary – All Cryptocurrencies & Tokens 2026",
    description: "Explore our complete cryptocurrency glossary. Browse Bitcoin, Ethereum, and 10,000+ coins and tokens with descriptions, tags, and blockchain details.",
    keywords:    "crypto coin glossary, cryptocurrency list, all crypto tokens, bitcoin info, ethereum tokens, blockchain coins, DeFi tokens, crypto dictionary",
  },
  ur: {
    title:       "کرپٹو کوائن گلاسری – تمام کریپٹو کرنسیز اور ٹوکنز 2026",
    description: "ہماری مکمل کریپٹو کرنسی گلاسری دیکھیں۔ بٹ کوائن، ایتھیریم اور 10,000+ کوائنز اور ٹوکنز تفصیل کے ساتھ براؤز کریں۔",
    keywords:    "کرپٹو گلاسری, کریپٹو کرنسی لسٹ, بٹ کوائن, ایتھیریم, بلاک چین",
  },
  // ✅ FIX 3: ru add kiya
  ru: {
    title:       "Глоссарий криптовалют – Все криптовалюты и токены 2026",
    description: "Изучите наш полный глоссарий криптовалют. Просматривайте Биткоин, Эфириум и более 10 000 монет и токенов с описаниями и деталями блокчейна.",
    keywords:    "глоссарий криптовалют, список криптовалют, биткоин, эфириум, токены блокчейна",
  },
  ar: {
    title:       "قاموس العملات المشفرة – جميع العملات والرموز 2026",
    description: "استكشف قاموسنا الشامل للعملات المشفرة. تصفح بيتكوين وإيثريوم وأكثر من 10,000 عملة ورمز مع الأوصاف والتفاصيل.",
    keywords:    "قاموس العملات المشفرة, قائمة العملات, بيتكوين, إيثريوم, رموز بلوكتشين",
  },
  es: {
    title:       "Glosario de Criptomonedas – Todas las Monedas y Tokens 2026",
    description: "Explora nuestro glosario completo de criptomonedas. Navega por Bitcoin, Ethereum y más de 10,000 monedas y tokens con descripciones y detalles.",
    keywords:    "glosario cripto, lista criptomonedas, bitcoin, ethereum, tokens blockchain, DeFi",
  },
  fr: {
    title:       "Glossaire Crypto – Toutes les Cryptomonnaies et Tokens 2026",
    description: "Explorez notre glossaire complet des cryptomonnaies. Parcourez Bitcoin, Ethereum et plus de 10 000 coins et tokens avec descriptions et détails.",
    keywords:    "glossaire crypto, liste cryptomonnaies, bitcoin, ethereum, tokens blockchain",
  },
  de: {
    title:       "Krypto-Glossar – Alle Kryptowährungen und Token 2026",
    description: "Entdecken Sie unser vollständiges Kryptowährungs-Glossar. Durchsuchen Sie Bitcoin, Ethereum und über 10.000 Coins und Token mit Beschreibungen.",
    keywords:    "Krypto Glossar, Kryptowährungsliste, Bitcoin, Ethereum, Blockchain Token",
  },
  "zh-CN": {
    title:       "加密货币词汇表 – 所有加密货币和代币 2026",
    description: "探索我们完整的加密货币词汇表。浏览比特币、以太坊及10,000多种加密货币和代币，包含详细描述和区块链信息。",
    keywords:    "加密货币词汇表, 加密货币列表, 比特币, 以太坊, 区块链代币, DeFi",
  },
};

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META["en"];
  const canonicalUrl = `${BASE_URL}/${locale}/glossary`;
  const pageImage    = `${BASE_URL}/og-image-glossary.jpg`; // ✅ FIX 6: .jpg add

  // ✅ FIX 4+5: zh-Hans + x-default + ru
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/glossary`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/en/glossary`; // ✅ FIX 5

  return {
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans, ru, x-default
    },

    openGraph: {
      title:       `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,                          // ✅ FIX 1
      locale:      OG_LOCALE_MAP[locale] || "en_US",   // ✅ FIX 2
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 7
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        "website",
      images: [{
        url:    pageImage,   // ✅ FIX 6: sahi URL
        width:  1200,
        height: 630,
        alt:    "Crypto Coin Glossary",
      }],
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841", // ✅ FIX 8
      title:       `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images:      [pageImage],        // ✅ FIX 6
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
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META["en"];
  const canonicalUrl = `${BASE_URL}/${locale}/glossary`;

  const collectionPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    name:          meta.title,
    description:   meta.description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME, // ✅ FIX 1
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png`, width: 200, height: 60 },
    },
    image: {
      "@type": "ImageObject",
      url:     `${BASE_URL}/og-image-glossary.jpg`, // ✅ FIX 6
      width:   1200,
      height:  630,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",          item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Coin Glossary", item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is a crypto coin glossary?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "A crypto coin glossary is a comprehensive directory of all cryptocurrencies and tokens, including their descriptions, blockchain details, tags, and official links.",
        },
      },
      {
        "@type": "Question",
        name:    "What is the difference between a coin and a token?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "A coin operates on its own native blockchain (like Bitcoin or Ethereum), while a token is built on top of an existing blockchain (like ERC-20 tokens on Ethereum).",
        },
      },
      {
        "@type": "Question",
        name:    "How many cryptocurrencies are listed in the glossary?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Our glossary contains over 10,000 cryptocurrencies and tokens across all major blockchains, continuously updated with new projects.",
        },
      },
      {
        "@type": "Question",
        name:    "Can I search for a specific coin or token?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, you can search by name or symbol and filter by type (coin or token) to quickly find any cryptocurrency in our glossary.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CoinsPage />
    </>
  );
}