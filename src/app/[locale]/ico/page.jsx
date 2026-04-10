// app/[locale]/ico/page.js

import ICOPage from "./ICOPage";

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

// ✅ FIX 7: 2025 → 2026, ru add kiya
const META = {
  en: {
    title:       "Crypto ICO Launchpad 2026 – Active, Upcoming & Ended Token Sales",
    description: "Discover the most promising blockchain startups and token sales. Track active ICOs, upcoming crypto launches, and ended token sales. Find the next 100x gem.",
    keywords:    "ICO 2026, crypto launchpad, token sale, blockchain startup, active ICO, upcoming ICO, crypto presale, DeFi launch, NFT ICO, Web3 projects",
  },
  ur: {
    title:       "کرپٹو آئی سی او لانچ پیڈ 2026 – فعال، آنے والے اور ختم ہونے والے ٹوکن سیلز",
    description: "سب سے زیادہ امید افزا بلاک چین اسٹارٹ اپس اور ٹوکن سیلز دریافت کریں۔ فعال آئی سی اوز اور آنے والے کرپٹو لانچز ٹریک کریں۔",
    keywords:    "آئی سی او 2026, کرپٹو لانچ پیڈ, ٹوکن سیل, بلاک چین اسٹارٹ اپ, کرپٹو پری سیل",
  },
  // ✅ FIX 3: ru add kiya
  ru: {
    title:       "Крипто ICO Launchpad 2026 – Активные, Предстоящие и Завершённые Продажи Токенов",
    description: "Откройте для себя самые перспективные блокчейн-стартапы и продажи токенов. Отслеживайте активные ICO, предстоящие запуски и завершённые продажи.",
    keywords:    "ICO 2026, крипто лаунчпад, продажа токенов, блокчейн стартап, крипто предпродажа, DeFi, Web3",
  },
  ar: {
    title:       "منصة إطلاق العملات المشفرة ICO 2026 – مبيعات الرموز النشطة والقادمة",
    description: "اكتشف أكثر مشاريع البلوكتشين الواعدة وعمليات بيع الرموز. تتبع عمليات ICO النشطة والإطلاقات القادمة وعمليات البيع المنتهية.",
    keywords:    "ICO 2026, منصة إطلاق العملات, بيع الرموز, مشاريع بلوكتشين, ما قبل البيع",
  },
  es: {
    title:       "Plataforma ICO Crypto 2026 – Ventas de Tokens Activas y Próximas",
    description: "Descubre las startups blockchain más prometedoras y ventas de tokens. Rastrea ICOs activas, próximos lanzamientos cripto y ventas finalizadas.",
    keywords:    "ICO 2026, launchpad cripto, venta de tokens, startup blockchain, preventa cripto, DeFi, Web3",
  },
  fr: {
    title:       "Plateforme ICO Crypto 2026 – Ventes de Tokens Actives et À Venir",
    description: "Découvrez les startups blockchain les plus prometteuses et les ventes de tokens. Suivez les ICOs actives, les lancements crypto à venir et les ventes terminées.",
    keywords:    "ICO 2026, launchpad crypto, vente de tokens, startup blockchain, prévente crypto, DeFi, Web3",
  },
  de: {
    title:       "Krypto ICO Launchpad 2026 – Aktive, Bevorstehende & Beendete Token-Verkäufe",
    description: "Entdecken Sie die vielversprechendsten Blockchain-Startups und Token-Verkäufe. Verfolgen Sie aktive ICOs, bevorstehende Krypto-Starts und beendete Token-Verkäufe.",
    keywords:    "ICO 2026, Krypto Launchpad, Token Verkauf, Blockchain Startup, Krypto Vorverkauf, DeFi, Web3",
  },
  "zh-CN": {
    title:       "加密货币ICO发射台 2026 – 活跃、即将到来和已结束的代币销售",
    description: "发现最具潜力的区块链初创项目和代币销售。追踪活跃ICO、即将推出的加密货币项目和已结束的代币销售。",
    keywords:    "ICO 2026, 加密货币发射台, 代币销售, 区块链初创, 加密货币预售, DeFi, Web3",
  },
};

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META["en"];
  const canonicalUrl = `${BASE_URL}/${locale}/ico`;
  const pageImage    = `${BASE_URL}/og-image-ico.jpg`;

  // ✅ FIX 4+5: zh-Hans + x-default + ru
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/ico`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/en/ico`; // ✅ FIX 5

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
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 6
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        "website",
      images: [{
        url:    pageImage,
        width:  1200,
        height: 630,
        alt:    "Crypto ICO Launchpad 2026 – Token Sales & Blockchain Startups",
      }],
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841", // ✅ FIX 8
      title:       `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images:      [pageImage],
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
  const canonicalUrl = `${BASE_URL}/${locale}/ico`;

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
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png`, width: 200, height: 60 },
    },
    image: {
      "@type": "ImageObject",
      url:     `${BASE_URL}/og-image-ico.jpg`,
      width:   1200,
      height:  630,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",          item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "ICO Launchpad", item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is an ICO in crypto?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "An ICO (Initial Coin Offering) is a fundraising method where blockchain startups sell tokens to early investors in exchange for capital, similar to an IPO in traditional finance.",
        },
      },
      {
        "@type": "Question",
        name:    "How do I participate in an ICO?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "To participate in an ICO, you need a crypto wallet, purchase the required base currency (usually ETH or BNB), and whitelist your wallet on the project's official website before the sale begins.",
        },
      },
      {
        "@type": "Question",
        name:    "What is the difference between ICO, IDO, and IEO?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "An ICO is a direct token sale by the project team. An IDO launches on a decentralized exchange. An IEO is conducted on a centralized exchange like Binance or KuCoin, which vets the project first.",
        },
      },
      {
        "@type": "Question",
        name:    "Are ICO investments risky?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, ICO investments carry significant risk including project failure, scams, and regulatory uncertainty. Always do thorough research (DYOR), review the whitepaper, team background, and tokenomics before investing.",
        },
      },
    ],
  };

  const webPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    name:          meta.title,
    description:   meta.description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    about: {
      "@type":       "Thing",
      name:          "Initial Coin Offering",
      description:   "ICO (Initial Coin Offering) is a blockchain-based fundraising mechanism for crypto startups.",
    },
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
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <ICOPage />
    </>
  );
}