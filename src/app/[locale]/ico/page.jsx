import ICOPage from "./ICOPage";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend"; //

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
    title: "Crypto ICO Launchpad 2026 – Active, Upcoming & Ended Token Sales",
    description: "Discover the most promising blockchain startups and token sales. Track active ICOs, upcoming crypto launches, and ended token sales. Find the next 100x gem.",
    keywords: "ICO 2026, crypto launchpad, token sale, blockchain startup, active ICO, upcoming ICO, crypto presale, DeFi launch, NFT ICO, Web3 projects",
  },
  ur: {
    title: "کرپٹو آئی سی او لانچ پیڈ 2026 – فعال، آنے والے اور ختم ہونے والے ٹوکن سیلز",
    description: "سب سے زیادہ امید افزا بلاک چین اسٹارٹ اپس اور ٹوکن سیلز دریافت کریں۔ فعال آئی سی اوز اور آنے والے کرپٹو لانچز ٹریک کریں۔",
    keywords: "آئی سی او 2026, کرپٹو لانچ پیڈ, ٹوکن سیل, بلاک چین اسٹارٹ اپ, کرپٹو پری سیل",
  },
  // ... (Other languages follow the same structure)
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || "en";
  const meta = META[locale] || META["en"];
  
  const canonicalUrl = locale === 'en' ? `${BASE_URL}/ico` : `${BASE_URL}/${locale}/ico`;
  const pageImage = `${BASE_URL}/og-image-ico.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    // ✅ FIX: zh-CN folder mapped to zh-Hans standard
    const hreflang = lang === "zh-CN" ? "zh-Hans" : lang;
    acc[hreflang] = lang === 'en' ? `${BASE_URL}/ico` : `${BASE_URL}/${lang}/ico`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/ico`;

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
alternateLocale: SUPPORTED_LOCALES.filter(l => l !== locale).map(l => OG_LOCALE_MAP[l] || "en_US"),      type: "website",
      images: [{
        url: pageImage,
        width: 1200,
        height: 630,
        alt: `Latest Crypto ICOs and Token Sales 2026`, 
      }],
    },
    twitter: {
      card: "summary_large_image",
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
  const { locale } = await params;
  const meta = META[locale] || META["en"];
  const canonicalUrl = locale === 'en' ? `${BASE_URL}/ico` : `${BASE_URL}/${locale}/ico`;
const homeUrl = locale === 'en' ? `${BASE_URL}` : `${BASE_URL}/${locale}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}/#collection`,
        "url": canonicalUrl,
        "name": meta.title,
        "description": meta.description,
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "inLanguage": locale,
      },
     {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": homeUrl }, // ✅ Locale fixed
          { "@type": "ListItem", "position": 2, "name": "ICO Launchpad", "item": canonicalUrl },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": SITE_NAME,
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/logo.png`,
          "width": 200,
          "height": 60
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ICOPage />
    </>
  );
}