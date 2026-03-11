// app/[locale]/privacy-policy/page.jsx  →  SERVER COMPONENT (SEO Layer)
import PrivacyPolicyPage from "./privayPage";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN"];

// ─────────────────────────────────────────────
// LOCALE-AWARE META
// ─────────────────────────────────────────────
const META = {
  en: {
    title:       `Privacy Policy | ${SITE_NAME}`,
    description: "Read CryptoNews Trend's Privacy Policy to understand how we collect, use, and protect your personal data. Your privacy is our priority.",
    keywords:    "privacy policy, data protection, personal data, cookies policy, GDPR, CryptoNews privacy",
  },
  ur: {
    title:       `پرائیویسی پالیسی | ${SITE_NAME}`,
    description: "CryptoNews Trend کی پرائیویسی پالیسی پڑھیں تاکہ آپ سمجھ سکیں کہ ہم آپ کا ذاتی ڈیٹا کیسے جمع، استعمال اور محفوظ کرتے ہیں۔",
    keywords:    "پرائیویسی پالیسی, ڈیٹا پروٹیکشن, کوکیز, ذاتی معلومات",
  },
  ar: {
    title:       `سياسة الخصوصية | ${SITE_NAME}`,
    description: "اقرأ سياسة الخصوصية الخاصة بـ CryptoNews Trend لفهم كيفية جمع بياناتك الشخصية واستخدامها وحمايتها.",
    keywords:    "سياسة الخصوصية, حماية البيانات, ملفات تعريف الارتباط, GDPR",
  },
  es: {
    title:       `Política de Privacidad | ${SITE_NAME}`,
    description: "Lea la Política de Privacidad de CryptoNews Trend para entender cómo recopilamos, usamos y protegemos sus datos personales.",
    keywords:    "política de privacidad, protección de datos, cookies, GDPR, privacidad cripto",
  },
  fr: {
    title:       `Politique de Confidentialité | ${SITE_NAME}`,
    description: "Lisez la Politique de Confidentialité de CryptoNews Trend pour comprendre comment nous collectons, utilisons et protégeons vos données personnelles.",
    keywords:    "politique de confidentialité, protection des données, cookies, RGPD",
  },
  de: {
    title:       `Datenschutzrichtlinie | ${SITE_NAME}`,
    description: "Lesen Sie die Datenschutzrichtlinie von CryptoNews Trend, um zu verstehen, wie wir Ihre persönlichen Daten erfassen, verwenden und schützen.",
    keywords:    "Datenschutzrichtlinie, Datenschutz, Cookies, DSGVO, Krypto Datenschutz",
  },
  'zh-CN': {
    title:       `隐私政策 | ${SITE_NAME}`,
    description: "阅读 CryptoNews Trend 的隐私政策，了解我们如何收集、使用和保护您的个人数据。您的隐私是我们的首要任务。",
    keywords:    "隐私政策, 数据保护, Cookie政策, GDPR, 个人数据",
  },
};

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META['en'];
  const canonicalUrl = `${BASE_URL}/${locale}/privacy-policy`;
  const pageImage    = `${BASE_URL}/og-image.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/privacy-policy`;
    return acc;
  }, {});

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          meta.title,
    description:   meta.description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  return {
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,
      images: [{
        url:    pageImage,
        width:  1200,
        height: 630,
        alt:    `${SITE_NAME} Privacy Policy`,
      }],
      locale,
      type: "website",
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      title:       meta.title,
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
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

// ─────────────────────────────────────────────
// 2. PAGE COMPONENT — Structured Data + UI
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { locale }   = await params;
  const meta         = META[locale] || META['en'];
  const canonicalUrl = `${BASE_URL}/${locale}/privacy-policy`;

  // ── Schema 1: WebPage ─────────────────────────────────────
  const webPageSchema = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:          meta.title,
    description:   meta.description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',           item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: canonicalUrl },
    ],
  };

  // ── Schema 3: FAQPage ─────────────────────────────────────
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name:    'What personal data does CryptoNews collect?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'CryptoNews collects basic usage data such as browser type, IP address, and pages visited to improve user experience. We do not sell personal data to third parties.',
        },
      },
      {
        '@type': 'Question',
        name:    'Does CryptoNews use cookies?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'Yes, we use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.',
        },
      },
      {
        '@type': 'Question',
        name:    'How can I request deletion of my data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'You can request deletion of your personal data by contacting us through our Contact page. We will process your request within 30 days in compliance with applicable privacy laws.',
        },
      },
      {
        '@type': 'Question',
        name:    'Is CryptoNews GDPR compliant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:    'Yes, CryptoNews Trend complies with GDPR and other applicable data protection regulations. We are committed to protecting the privacy rights of all our users.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PrivacyPolicyPage />
    </>
  );
}