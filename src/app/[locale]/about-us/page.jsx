// app/[locale]/about-us/page.jsx
import AboutPage from "./aboutPAge";

const SITE_NAME = 'CryptoNews Trend'; // ✅ FIX 1
const BASE_URL  = 'https://cryptonewstrend.com';

const SUPPORTED_LOCALES = ['en', 'ur', 'ar', 'ru', 'es', 'fr', 'de', 'zh-CN'];

// ✅ FIX 4: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

// ✅ FIX 3: OG locale correct format
const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

// ✅ FIX 9: CryptoWhales → CryptoNews Trend
const META = {
  en: {
    title:       'About Us Trusted Crypto News & Insights',
    description: 'Learn about CryptoNews Trend your trusted source for real-time cryptocurrency news, blockchain insights, and market analysis in 8+ languages.',
    keywords:    'about CryptoNews Trend, crypto news platform, blockchain news, cryptocurrency insights, crypto media',
  },
  ur: {
    title:       'ہمارے بارے میں  قابل اعتماد کرپٹو خبریں',
    description: 'CryptoNews Trend کے بارے میں جانیں  کریپٹو کرنسی خبروں، بلاک چین اور مارکیٹ تجزیے کا آپ کا قابل اعتماد ذریعہ۔',
    keywords:    'کرپٹو خبریں, بلاک چین, کریپٹو کرنسی',
  },
  ar: {
    title:       'من نحن  أخبار العملات المشفرة الموثوقة',
    description: 'تعرف على CryptoNews Trend  مصدرك الموثوق لأخبار العملات المشفرة وتحليلات السوق.',
    keywords:    'أخبار العملات المشفرة, بلوكتشين, تحليل السوق',
  },
  ru: {
    title:       'О нас Криптовалютные новости',
    description: 'Узнайте о CryptoNews Trend надёжном источнике новостей о криптовалютах и блокчейне.',
    keywords:    'крипто новости, блокчейн, криптовалюта',
  },
  es: {
    title:       'Sobre Nosotros Noticias Cripto de Confianza',
    description: 'Conoce CryptoNews Trend tu fuente confiable de noticias sobre criptomonedas y blockchain.',
    keywords:    'noticias cripto, blockchain, criptomonedas',
  },
  fr: {
    title:       'À Propos Actualités Crypto de Confiance',
    description: 'Découvrez CryptoNews Trend votre source fiable d\'actualités crypto et d\'analyses blockchain.',
    keywords:    'actualités crypto, blockchain, cryptomonnaie',
  },
  de: {
    title:       'Über Uns Vertrauenswürdige Krypto-Nachrichten',
    description: 'Erfahren Sie mehr über CryptoNews Trend Ihre vertrauenswürdige Quelle für Krypto-Nachrichten.',
    keywords:    'Krypto Nachrichten, Blockchain, Kryptowährung',
  },
  'zh-CN': {
    title:       '关于我们 值得信赖的加密货币新闻',
    description: '了解 CryptoNews Trend 您值得信赖的加密货币新闻、区块链资讯和市场分析来源。',
    keywords:    '加密货币新闻, 区块链, 比特币, 数字货币, 市场分析',
  },
};

const getLocaleMeta = (locale) => META[locale] || META['en'];

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = `${BASE_URL}/${locale}/about-us`;

  // ✅ FIX 4+5: zh-Hans + x-default
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/about-us`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/en/about-us`; // ✅ FIX 5

  return {
    // ✅ FIX 2: SITE_NAME mat lagao  layout template auto lagaega
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,

    alternates: {
      canonical: pageUrl,
      languages: alternateLanguages, // ✅ zh-Hans + x-default
    },

    openGraph: {
      title:       `${meta.title} | ${SITE_NAME}`, // ✅ OG mein manually
      description: meta.description,
      url:         pageUrl,
      siteName:    SITE_NAME,                          // ✅ FIX 1
      locale:      OG_LOCALE_MAP[locale] || 'en_US',   // ✅ FIX 3
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 7
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        'website',
      images: [{
        url:    `${BASE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    `${SITE_NAME} About Us`,
      }],
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@cryptonews90841', // ✅ FIX 8
      creator:     '@cryptonews90841', // ✅ FIX 8
      title:       `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images:      [`${BASE_URL}/og-image.png`],
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-snippet':       -1,
        'max-image-preview': 'large',
      },
    },
    // ✅ FIX 6: other property hatao  schema script tag se handle hoga
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function AboutServerPage({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = `${BASE_URL}/${locale}/about-us`;

  // ✅ FIX 6: Schema sirf yahan script tag mein  "other" se nahi
  const jsonLd = {
    '@context':  'https://schema.org',
    '@type':     'AboutPage',
    name:         meta.title,
    description:  meta.description,
    url:          pageUrl,
    inLanguage:   locale,
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME, // ✅ "CryptoNews Trend"
      url:     BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${BASE_URL}/logo.png`,
      },
    },
    mainEntity: {
      '@type':       'Organization',
      name:           SITE_NAME,
      url:            BASE_URL,
      foundingDate:  '2023',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: '10' },
      areaServed:    'Worldwide',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage />
 
    </>
  );
}