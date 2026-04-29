import { getDictionary } from "../../../../i18n/getDictionary";
import EventsPage from "./eventpage";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const META = {
  en: {
    title: "Crypto Events 2026 – Global Blockchain Conferences & Summits",
    description: "Discover the latest global crypto and blockchain events, conferences, summits, and meetups in 2026. Filter by status, location, and date.",
    keywords: "crypto events 2026, blockchain conference, crypto summit, NFT events, DeFi meetup, Web3 conference",
  },
  ur: {
    title: "کرپٹو ایونٹس 2026 – کانفرنسز اور بلاک چین میٹ اپس",
    description: "2026 میں دنیا بھر کے کرپٹو اور بلاک چین ایونٹس، کانفرنسز اور میٹ اپس دریافت کریں۔",
    keywords: "کرپٹو ایونٹس, بلاک چین کانفرنس, ویب 3 میٹ اپ",
  },
  // ... (Other locales can be added here)
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const localeMeta = META[locale] || META['en'];
  const canonicalUrl = locale === 'en' ? `${BASE_URL}/events` : `${BASE_URL}/${locale}/events`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = lang === 'zh-CN' ? 'zh-Hans' : lang;
    acc[hreflang] = lang === 'en' ? `${BASE_URL}/events` : `${BASE_URL}/${lang}/events`;
    return acc;
  }, {});
  alternateLanguages['x-default'] = `${BASE_URL}/events`;

  return {
    title: localeMeta.title,
    description: localeMeta.description,
    keywords: localeMeta.keywords,
    alternates: { canonical: canonicalUrl, languages: alternateLanguages },
    openGraph: {
      title: localeMeta.title,
      description: localeMeta.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: `${BASE_URL}/og-image-events.png`, width: 1200, height: 630 }],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  const localeMeta = META[locale] || META['en'];
  const canonicalUrl = locale === 'en' ? `${BASE_URL}/events` : `${BASE_URL}/${locale}/events`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Events", "item": canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <EventsPage />
    </>
  );
}