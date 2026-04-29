import PrivacyPolicyPage from "./privayPage";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend"; 
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de","ru", "ar", "zh-CN"];
const LAST_MODIFIED     = "2025-01-15"; 

const META = {
  en: {
    title:       "Privacy Policy", 
    description: "Read CryptoNews Trend's Privacy Policy to understand how we collect, use, and protect your personal data.",
    keywords:    "privacy policy, data protection, crypto news privacy, GDPR",
  },
  ur: {
    title:       "پرائیویسی پالیسی", 
    description: "CryptoNews Trend کی پرائیویسی پالیسی پڑھیں تاکہ آپ سمجھ سکیں کہ ہم آپ کا ڈیٹا کیسے محفوظ کرتے ہیں۔",
    keywords:    "پرائیویسی پالیسی, ڈیٹا پروٹیکشن, کرپٹو نیوز",
  },
  ar: {
    title:       "سياسة الخصوصية",
    description: "اقرأ سياسة الخصوصية الخاصة بـ CryptoNews Trend لفهم كيفية جمع بياناتك الشخصية وحمايتها.",
    keywords:    "سياسة الخصوصية, حماية البيانات, GDPR",
  },
  es: {
    title:       "Política de Privacidad",
    description: "Lea la Política de Privacidad de CryptoNews Trend para entender cómo protegemos sus datos personales.",
    keywords:    "política de privacidad, protección de datos",
  },
  fr: {
    title:       "Politique de Confidentialité",
    description: "Lisez la Politique de Confidentialité de CryptoNews Trend.",
    keywords:    "politique de confidentialité, données personnelles",
  },
  de: {
    title:       "Datenschutzrichtlinie",
    description: "Lesen Sie die Datenschutzrichtlinie von CryptoNews Trend.",
    keywords:    "Datenschutzrichtlinie, DSGVO",
  },
  'zh-CN': {
    title:       "隐私政策",
    description: "阅读 CryptoNews Trend 的隐私政策，了解我们如何保护您的个人数据。",
    keywords:    "隐私政策, 数据保护",
  },
};

// 1. Metadata Generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en'; // Fallback to 'en' if undefined
  const meta = META[locale] || META['en'];
  
  // Logical Fix: English page should be at root (no /en/)
  const isEn = locale === 'en';
  const canonicalUrl = isEn ? `${BASE_URL}/privacy-policy` : `${BASE_URL}/${locale}/privacy-policy`;
  const pageImage = `${BASE_URL}/og-image.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    // Map zh-CN to zh-Hans for Google's hreflang standard
    const hreflang = lang === 'zh-CN' ? 'zh-Hans' : lang;
    acc[hreflang] = lang === 'en' ? `${BASE_URL}/privacy-policy` : `${BASE_URL}/${lang}/privacy-policy`;
    return acc;
  }, {});

  alternateLanguages["x-default"] = `${BASE_URL}/privacy-policy`;

  return {
    title: `${meta.title} | ${SITE_NAME}`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
    openGraph: {
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: pageImage, width: 1200, height: 630, alt: "Privacy Policy" }],
      locale: isEn ? 'en_US' : locale,
      type: "website",
    },
    referrer: 'origin-when-cross-origin',
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images: [pageImage],
    },
  };
}

// 2. Page Component
export default async function Page({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en'; 
  const meta = META[locale] || META['en'];
  
  const isEn = locale === 'en';
  const canonicalUrl = isEn ? `${BASE_URL}/privacy-policy` : `${BASE_URL}/${locale}/privacy-policy`;
  const homeUrl = isEn ? `${BASE_URL}` : `${BASE_URL}/${locale}`;

  // Schema.org Structured Data
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${meta.title} | ${SITE_NAME}`,
    description: meta.description,
    url: canonicalUrl,
    inLanguage: locale,
    dateModified: LAST_MODIFIED,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: meta.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} 
      />
      {/* Client component jahan aapka actual design hai */}
      <PrivacyPolicyPage locale={locale} />
    </>
  );
}