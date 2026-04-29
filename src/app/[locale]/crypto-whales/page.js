// app/[locale]/crypto-whales/page.js

import WhaleTracker from "./whalestracker";

const BASE_URL  = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend"; // ✅ FIX 4

// ✅ FIX 1: ru add kiya
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

// ✅ FIX 2: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// ✅ FIX 3: OG locale correct format
const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ✅ FIX 5: 2025 → 2026, ru add kiya
const META = {
  en: {
    title:       "Crypto Whale Tracker – Live Large Transaction Monitor 2026",
    description: "Track real-time crypto whale movements across Bitcoin, Ethereum, and 50+ blockchains. Monitor large transfers, burns, mints, and exchange flows live.",
    keywords:    "crypto whale tracker, whale alert, large bitcoin transfer, ethereum whale, on-chain analysis, blockchain transaction monitor",
  },
  ur: {
    title:       "کرپٹو وہیل ٹریکر – لائیو بڑی ٹرانزیکشن مانیٹر 2026",
    description: "بٹ کوائن، ایتھیریم اور 50+ بلاک چینز پر وہیل کی نقل و حرکت ریئل ٹائم میں ٹریک کریں۔",
    keywords:    "کرپٹو وہیل ٹریکر, وہیل الرٹ, بٹ کوائن ٹرانسفر, بلاک چین مانیٹر",
  },
  // ✅ FIX 7: ru add kiya
  ru: {
    title:       "Трекер криптовалютных китов – Мониторинг крупных транзакций 2026",
    description: "Отслеживайте движения криптовалютных китов в реальном времени через Bitcoin, Ethereum и 50+ блокчейнов. Мониторинг крупных переводов.",
    keywords:    "трекер криптокитов, whale alert, крупный перевод биткоина, анализ блокчейна",
  },
  ar: {
    title:       "متتبع حيتان التشفير – مراقبة المعاملات الكبيرة مباشرة 2026",
    description: "تتبع تحركات حيتان العملات المشفرة في الوقت الفعلي عبر بيتكوين وإيثريوم وأكثر من 50 بلوكتشين.",
    keywords:    "متتبع حيتان, تنبيه الحيتان, تحويل بيتكوين كبير, تحليل على السلسلة",
  },
  es: {
    title:       "Rastreador de Ballenas Crypto – Monitor de Transacciones en Vivo 2026",
    description: "Rastrea movimientos de ballenas crypto en tiempo real en Bitcoin, Ethereum y más de 50 blockchains.",
    keywords:    "rastreador ballenas crypto, whale alert, transferencia bitcoin, análisis on-chain",
  },
  fr: {
    title:       "Tracker de Baleines Crypto – Surveillance des Grosses Transactions 2026",
    description: "Suivez les mouvements des baleines crypto en temps réel sur Bitcoin, Ethereum et plus de 50 blockchains.",
    keywords:    "tracker baleines crypto, whale alert, transfert bitcoin, analyse on-chain",
  },
  de: {
    title:       "Krypto Wal Tracker – Live-Überwachung großer Transaktionen 2026",
    description: "Verfolgen Sie Krypto-Wal-Bewegungen in Echtzeit über Bitcoin, Ethereum und 50+ Blockchains.",
    keywords:    "Krypto Wal Tracker, Whale Alert, Bitcoin Transfer, On-Chain Analyse",
  },
  "zh-CN": {
    title:       "加密鲸鱼追踪器 – 大额交易实时监控 2026",
    description: "实时追踪比特币、以太坊及50多个区块链上的加密鲸鱼动向。监控大额转账、销毁、铸造和交易所资金流动。",
    keywords:    "加密鲸鱼追踪, 鲸鱼预警, 比特币大额转账, 链上分析",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const currentMeta = META[locale] || META["en"];
  const path = "/crypto-whales";
  const canonicalUrl = locale === "en" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;

  const languages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const langPath = lang === "en" ? path : `/${lang}${path}`;
    acc[LOCALE_TO_HREFLANG[lang] || lang] = `${BASE_URL}${langPath}`;
    return acc;
  }, {});

  languages["x-default"] = `${BASE_URL}${path}`;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      title: `${currentMeta.title} | ${SITE_NAME}`,
      description: currentMeta.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      alternateLocale: SUPPORTED_LOCALES.filter(l => l !== locale).map(l => OG_LOCALE_MAP[l] || l),
      type: "website",
      images: [{ url: `${BASE_URL}/og-image-whales.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      title: `${currentMeta.title} | ${SITE_NAME}`,
      description: currentMeta.description,
      images: [`${BASE_URL}/og-image-whales.jpg`],
    },
  };
}

// ── Page Component ────────────────────────────────────────────
export default async function Page({ params }) {
  const { locale }             = await params;
  const { title, description } = META[locale] || META["en"];
  const canonicalUrl = locale === 'en' 
  ? `${BASE_URL}/crypto-whales` 
  : `${BASE_URL}/${locale}/crypto-whales`;

  const webPageSchema = {
    "@context":  "https://schema.org",
    "@type":     "WebPage",
    name:         title,
    description,
    url:          canonicalUrl,
    inLanguage:   locale,
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME, // ✅ CryptoNews Trend
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Crypto Whales", item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is a crypto whale?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "A crypto whale is an individual or entity that holds a large amount of cryptocurrency, typically enough to influence market prices when they buy or sell.",
        },
      },
      {
        "@type": "Question",
        name:    "How does the whale tracker work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Our whale tracker monitors on-chain data in real-time across Bitcoin, Ethereum, and 50+ blockchain networks to detect large transfers, burns, mints, and exchange movements.",
        },
      },
      {
        "@type": "Question",
        name:    "Which blockchains does the tracker support?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "The tracker supports Bitcoin, Ethereum, BNB Chain, Solana, Tron, and 50+ other major blockchain networks.",
        },
      },
      {
        "@type": "Question",
        name:    "Is the crypto whale tracker free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, the real-time whale transaction tracker on CryptoNews Trend is completely free to use.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <WhaleTracker />
    </>
  );
}