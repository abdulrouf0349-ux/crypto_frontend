// app/[locale]/about/page.jsx
// ── SERVER COMPONENT ─────────────────────────────────────────
import AboutPage from "./aboutPAge";

const SITE_NAME = 'CryptoWhales';
const BASE_URL  = 'https://cryptonewstrend.com'; // ✅ apna domain

// ── Locale-aware static meta ─────────────────────────────────
const META = {
  en: {
    title:       'About Us — CryptoWhales | Trusted Crypto News & Insights',
    description: 'Learn about CryptoWhales — your trusted source for real-time cryptocurrency news, blockchain insights, and market analysis in 12+ languages.',
    keywords:    'about cryptowhales, crypto news platform, blockchain news, cryptocurrency insights, crypto media',
  },
  ur: {
    title:       'ہمارے بارے میں — CryptoWhales | قابل اعتماد کرپٹو خبریں',
    description: 'CryptoWhales کے بارے میں جانیں — کریپٹو کرنسی خبروں، بلاک چین اور مارکیٹ تجزیے کا آپ کا قابل اعتماد ذریعہ۔',
    keywords:    'کرپٹو خبریں, بلاک چین, کریپٹو کرنسی',
  },
  ar: {
    title:       'من نحن — CryptoWhales | أخبار العملات المشفرة',
    description: 'تعرف على CryptoWhales — مصدرك الموثوق لأخبار العملات المشفرة وتحليلات السوق بأكثر من 12 لغة.',
    keywords:    'أخبار العملات المشفرة, بلوكتشين, تحليل السوق',
  },
  ru: {
    title:       'О нас — CryptoWhales | Криптовалютные новости',
    description: 'Узнайте о CryptoWhales — надёжном источнике новостей о криптовалютах и блокчейне на 12+ языках.',
    keywords:    'крипто новости, блокчейн, криптовалюта',
  },
  es: {
    title:       'Sobre Nosotros — CryptoWhales | Noticias Cripto',
    description: 'Conoce CryptoWhales — tu fuente confiable de noticias sobre criptomonedas y blockchain en más de 12 idiomas.',
    keywords:    'noticias cripto, blockchain, criptomonedas',
  },
  fr: {
    title:       'À Propos — CryptoWhales | Actualités Crypto',
    description: 'Découvrez CryptoWhales — votre source fiable d\'actualités crypto et d\'analyses blockchain en 12+ langues.',
    keywords:    'actualités crypto, blockchain, cryptomonnaie',
  },
  de: {
    title:       'Über Uns — CryptoWhales | Krypto-Nachrichten',
    description: 'Erfahren Sie mehr über CryptoWhales — Ihre vertrauenswürdige Quelle für Krypto-Nachrichten in 12+ Sprachen.',
    keywords:    'Krypto Nachrichten, Blockchain, Kryptowährung',
  },
  'zh-cn': {
  title:       '关于我们 — CryptoWhales | 加密货币新闻',
  description: '了解 CryptoWhales — 您值得信赖的加密货币新闻、区块链资讯和市场分析来源，支持12种以上语言。',
  keywords:    '加密货币新闻, 区块链, 比特币, 数字货币, 市场分析',
},
};

const getLocaleMeta = (locale) => META[locale] || META['en'];

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = `${BASE_URL}/${locale}/about-us`;

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'AboutPage',
    name:          meta.title,
    description:   meta.description,
    url:           pageUrl,
    inLanguage:    locale,
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${BASE_URL}/logo.png`,
      },
    },
  };

  return {
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        Object.keys(META).map((l) => [l, `${BASE_URL}/${l}/about-us`])
      ),
    },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         pageUrl,
      siteName:    SITE_NAME,
      locale,
      type:        'website',
      images: [
        {
          url:    `${BASE_URL}/og-image.png`, // ✅ apna OG image
          width:  1200,
          height: 630,
          alt:    `${SITE_NAME} About Us`,
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      title:       meta.title,
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
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function AboutServerPage({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = `${BASE_URL}/${locale}/about-us`;

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'AboutPage',
    name:          meta.title,
    description:   meta.description,
    url:           pageUrl,
    inLanguage:    locale,
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${BASE_URL}/logo.png`,
      },
    },
    // Stats structured data
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