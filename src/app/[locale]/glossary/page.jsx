import CoinsPage from "./glosary";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend";

// ✅ Supporting all locales
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

const META = {
  en: {
    title: "Crypto Coin Glossary – All Cryptocurrencies & Tokens 2026",
    description: "Explore our complete cryptocurrency glossary. Browse Bitcoin, Ethereum, and 10,000+ coins and tokens with descriptions, tags, and blockchain details.",
    keywords: "crypto coin glossary, cryptocurrency list, all crypto tokens, bitcoin info, ethereum tokens, blockchain coins, DeFi tokens, crypto dictionary",
  },
  ur: {
    title: "کرپٹو کوائن گلاسری – تمام کریپٹو کرنسیز اور ٹوکنز 2026",
    description: "ہماری مکمل کریپٹو کرنسی گلاسری دیکھیں۔ بٹ کوائن، ایتھیریم اور 10,000+ کوائنز اور ٹوکنز تفصیل کے ساتھ براؤز کریں۔",
    keywords: "کرپٹو گلاسری, کریپٹو کرنسی لسٹ, بٹ کوائن, ایتھیریم, بلاک چین",
  },
  ru: {
    title: "Глоссарий криптовалют – Все криптовалюты и токены 2026",
    description: "Изучите наш полный глоссарий криптовалют. Просматривайте Биткоин, Эфириум и более 10 000 монет и токенов с описаниями и деталями блокчейна.",
    keywords: "глоссарий криптовалют, список криптовалют, биткоин, эфириум, токены блокчейна",
  },
  ar: {
    title: "قاموس العملات المشفرة – جميع العملات والرموز 2026",
    description: "استكشف قاموسنا الشامل للعملات المشفرة. تصفح بيتكوين وإيثريوم وأكثر من 10,000 عملة ورمز مع الأوصاف والتفاصيل.",
    keywords: "قاموس العملات المشفرة, قائمة العملات, بيتكوين, إيثريوم, رموز بلوكتشين",
  },
  es: {
    title: "Glosario de Criptomonedas – Todas las Monedas y Tokens 2026",
    description: "Explora nuestro glosario completo de criptomonedas. Navega por Bitcoin, Ethereum y más de 10,000 monedas y tokens con descripciones y detalles.",
    keywords: "glosario cripto, lista criptomonedas, bitcoin, ethereum, tokens blockchain, DeFi",
  },
  fr: {
    title: "Glossaire Crypto – Toutes les Cryptomonnaies et Tokens 2026",
    description: "Explorez notre glossaire complet des cryptomonnaies. Parcourez Bitcoin, Ethereum et plus de 10 000 coins et tokens avec descriptions et détails.",
    keywords: "glossaire crypto, liste cryptomonnaies, bitcoin, ethereum, tokens blockchain",
  },
  de: {
    title: "Krypto-Glossar – Alle Kryptowährungen und Token 2026",
    description: "Entdecken Sie unser vollständiges Kryptowährungs-Glossar. Durchsuchen Sie Bitcoin, Ethereum und über 10.000 Coins und Token mit Beschreibungen.",
    keywords: "Krypto Glossar, Kryptowährungsliste, Bitcoin, Ethereum, Blockchain Token",
  },
  "zh-CN": {
    title: "加密货币词汇表 – 所有加密货币和代币 2026",
    description: "探索我们完整的加密货币词汇表。浏览比特币、以太坊及10,000多种加密货币和代币，包含详细描述和区块链信息。",
    keywords: "加密货币词汇表, 加密货币列表, 比特币, 以太坊, 区块链代币, DeFi",
  },
};

const getCanonical = (locale) => (locale === 'en' ? `${BASE_URL}/glossary` : `${BASE_URL}/${locale}/glossary`);

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = META[locale] || META["en"];
  const canonicalUrl = getCanonical(locale);
  const pageImage = `${BASE_URL}/og-image-glossary.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang] = getCanonical(lang);
    return acc;
  }, {});
  alternateLanguages["x-default"] = getCanonical('en');

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      alternateLocale: SUPPORTED_LOCALES.filter(l => l !== locale).map(l => OG_LOCALE_MAP[l] || l),
      type: "website",
      images: [{ url: pageImage, width: 1200, height: 630, alt: "Complete Crypto Coin Directory 2026" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images: [pageImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META["en"];
  const canonicalUrl = getCanonical(locale);
  const homeUrl      = locale === 'en' ? `${BASE_URL}` : `${BASE_URL}/${locale}`;

  // ✅ Consolidated Schema Graph (One script tag is better for performance)
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": meta.title,
        "description": meta.description,
        "inLanguage": locale,
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` }
        },
        "dateModified": new Date().toISOString()
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": homeUrl },
          { "@type": "ListItem", "position": 2, "name": "Coin Glossary", "item": canonicalUrl },
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": locale === 'ur' ? "کرپٹو کوائن گلاسری کیا ہے؟" : "What is a crypto coin glossary?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'ur' ? "یہ تمام کرپٹو کرنسیوں اور ٹوکنز کی ایک جامع فہرست ہے جس میں تفصیلات اور بلاک چین کی معلومات شامل ہیں۔" : "A crypto coin glossary is a comprehensive directory of all cryptocurrencies and tokens, including descriptions and blockchain details."
            }
          },
          {
            "@type": "Question",
            "name": locale === 'ur' ? "کتنی کرپٹو کرنسیز درج ہیں؟" : "How many cryptocurrencies are listed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'ur' ? "ہماری گلاسری میں 10,000 سے زیادہ کرپٹو کرنسیز اور ٹوکنز شامل ہیں۔" : "Our glossary contains over 10,000 cryptocurrencies and tokens, updated in real-time."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} 
      />
      <CoinsPage />
    </>
  );
}