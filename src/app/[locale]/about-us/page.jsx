import AboutPage from "./aboutPAge";
import { getDictionary } from "../../../../i18n/getDictionary";

const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const HREFLANG_MAP = {
  en: "en", ur: "ur", ar: "ar", de: "de",
  fr: "fr", ru: "ru", "zh-CN": "zh-Hans", es: "es",
};

const getUrl = (locale, path = "/about") =>
  `${BASE_URL}${locale === "en" ? "" : `/${locale}`}${path}`;

// ─────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict?.about || {};

  const title       = `${t.title || "About Us"} | ${SITE_NAME}`;
  const description = t.description ||
    "Learn about CryptoNewsTrend — your premier multilingual source for blockchain insights, DeFi guides, and global crypto news.";
  const canonicalUrl = getUrl(locale);

  // hreflang for all supported languages
  const languages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[HREFLANG_MAP[lang] || lang] = getUrl(lang);
    return acc;
  }, {});
  languages["x-default"] = getUrl("en");

  return {
    title,
    description,
    keywords:
      "about cryptonewstrend, crypto news platform, blockchain news, DeFi news, multilingual crypto",

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE_URL}/og-about.png`,
          width: 1200,
          height: 630,
          alt: `About ${SITE_NAME}`,
        },
      ],
      locale,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-about.png`],
      site: "@cryptonews90841",
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

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { locale } = await params;
  const canonicalUrl = getUrl(locale);

  // ✅ Organization Schema — E-E-A-T ke liye zaroori
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "Global multilingual cryptocurrency news and intelligence platform covering Bitcoin, Ethereum, DeFi, NFTs and blockchain technology.",
    foundingDate: "2023",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@cryptonewstrend.com",
      availableLanguage: SUPPORTED_LOCALES,
    },
    sameAs: [
      "https://twitter.com/cryptonews90841",
      "https://t.me/cryptonewstrendhub",
    ],
  };

  // ✅ WebPage Schema — About page ke liye
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    url: canonicalUrl,
    description:
      "Learn about CryptoNewsTrend — a global multilingual crypto news platform.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    inLanguage: locale,
  };

  // ✅ BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutPage />
    </>
  );
}