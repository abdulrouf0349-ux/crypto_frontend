// app/[locale]/crypto-whales/page.js  — SERVER COMPONENT
import WhaleTracker from "./whalestracker";

const BASE_URL  = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-cn"];

// ✅ META top-level — dono functions use kar saktay hain
const META = {
  en: {
    title:       "Crypto Whale Tracker – Live Large Transaction Monitor 2025",
    description: "Track real-time crypto whale movements across Bitcoin, Ethereum, and 50+ blockchains. Monitor large transfers, burns, mints, and exchange flows live.",
    keywords:    "crypto whale tracker, whale alert, large bitcoin transfer, ethereum whale, on-chain analysis, blockchain transaction monitor",
  },
  ur: {
    title:       "کرپٹو وہیل ٹریکر – لائیو بڑی ٹرانزیکشن مانیٹر 2025",
    description: "بٹ کوائن، ایتھیریم اور 50+ بلاک چینز پر وہیل کی نقل و حرکت ریئل ٹائم میں ٹریک کریں۔ بڑی ٹرانسفرز، برنز اور ایکسچینج فلوز مانیٹر کریں۔",
    keywords:    "کرپٹو وہیل ٹریکر, وہیل الرٹ, بٹ کوائن ٹرانسفر, بلاک چین مانیٹر",
  },
  ar: {
    title:       "متتبع حيتان التشفير – مراقبة المعاملات الكبيرة مباشرة 2025",
    description: "تتبع تحركات حيتان العملات المشفرة في الوقت الفعلي عبر بيتكوين وإيثريوم وأكثر من 50 بلوكتشين. راقب التحويلات الكبيرة والحرق والسك.",
    keywords:    "متتبع حيتان, تنبيه الحيتان, تحويل بيتكوين كبير, تحليل على السلسلة",
  },
  es: {
    title:       "Rastreador de Ballenas Crypto – Monitor de Transacciones en Vivo 2025",
    description: "Rastrea movimientos de ballenas crypto en tiempo real en Bitcoin, Ethereum y más de 50 blockchains. Monitorea transferencias grandes, quemas y flujos de exchanges.",
    keywords:    "rastreador ballenas crypto, whale alert, transferencia bitcoin, análisis on-chain",
  },
  fr: {
    title:       "Tracker de Baleines Crypto – Surveillance des Grosses Transactions 2025",
    description: "Suivez les mouvements des baleines crypto en temps réel sur Bitcoin, Ethereum et plus de 50 blockchains. Surveillez les grands transferts, burns et flux d'exchanges.",
    keywords:    "tracker baleines crypto, whale alert, transfert bitcoin, analyse on-chain",
  },
  de: {
    title:       "Krypto Wal Tracker – Live-Überwachung großer Transaktionen 2025",
    description: "Verfolgen Sie Krypto-Wal-Bewegungen in Echtzeit über Bitcoin, Ethereum und 50+ Blockchains. Überwachen Sie große Transfers, Burns und Exchange-Flows.",
    keywords:    "Krypto Wal Tracker, Whale Alert, Bitcoin Transfer, On-Chain Analyse",
  },
  'zh-cn': {
    title:       "加密鲸鱼追踪器 – 大额交易实时监控 2025",
    description: "实时追踪比特币、以太坊及50多个区块链上的加密鲸鱼动向。监控大额转账、销毁、铸造和交易所资金流动。",
    keywords:    "加密鲸鱼追踪, 鲸鱼预警, 比特币大额转账, 链上分析",
  },
};

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const { title, description, keywords } = META[locale] || META['en']; // ✅ locale-aware
  const canonicalUrl = `${BASE_URL}/${locale}/crypto-whales`;
  const pageImage    = `${BASE_URL}/og-image-whales.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/crypto-whales`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords, // ✅ hard-coded nahi, locale ka apna keywords
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      locale,
      type:     "website",
      images: [{ url: pageImage, width: 1200, height: 630, alt: "Crypto Whale Tracker" }],
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      title,
      description,
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

// ── Page Component ────────────────────────────────────────────
export default async function Page({ params }) {
  const { locale }              = await params;
  const { title, description }  = META[locale] || META['en']; // ✅ schemas mein use
  const canonicalUrl            = `${BASE_URL}/${locale}/crypto-whales`;

  const webPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    name:          title,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: `${BASE_URL}/${locale}` },
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
          text:    "Yes, the real-time whale transaction tracker on CryptoNewsTrend is completely free to use.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <WhaleTracker />
    </>
  );
}