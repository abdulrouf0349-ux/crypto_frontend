// app/[locale]/events/page.js  →  SERVER COMPONENT (SEO Layer)
import { getDictionary } from "../../../../i18n/getDictionary";
import EventsPage from "./eventpage";

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN"];

// ✅ FIX 1: Titles shortened to under 60 characters
const META = {
  en: {
    title:       "Crypto Events 2025 – Conferences & Blockchain Summits",
    description: "Discover the latest global crypto and blockchain events, conferences, summits, and meetups in 2025. Filter by status, location, and date.",
    keywords:    "crypto events 2025, blockchain conference, crypto summit, NFT events, DeFi meetup, Web3 conference",
  },
  ur: {
    title:       "کرپٹو ایونٹس 2025 – کانفرنسز اور بلاک چین میٹ اپس",
    description: "2025 میں دنیا بھر کے کرپٹو اور بلاک چین ایونٹس، کانفرنسز اور میٹ اپس دریافت کریں۔",
    keywords:    "کرپٹو ایونٹس, بلاک چین کانفرنس, ویب 3 میٹ اپ",
  },
  ar: {
    title:       "فعاليات التشفير 2025 – المؤتمرات والقمم",
    description: "اكتشف أحدث فعاليات العملات المشفرة والبلوكتشين العالمية ومؤتمراتها في 2025.",
    keywords:    "فعاليات التشفير, مؤتمر البلوكتشين, قمة العملات, ويب 3",
  },
  es: {
    title:       "Eventos Crypto 2025 – Conferencias Blockchain",
    description: "Descubre los últimos eventos globales de crypto y blockchain, conferencias, cumbres y meetups en 2025.",
    keywords:    "eventos crypto 2025, conferencia blockchain, cumbre crypto, meetup Web3",
  },
  fr: {
    title:       "Événements Crypto 2025 – Conférences Blockchain",
    description: "Découvrez les derniers événements mondiaux crypto et blockchain en 2025. Filtrez par statut, lieu et date.",
    keywords:    "événements crypto 2025, conférence blockchain, sommet crypto, meetup Web3",
  },
  de: {
    title:       "Krypto-Events 2025 – Blockchain-Konferenzen",
    description: "Entdecken Sie die neuesten globalen Krypto- und Blockchain-Events und Meetups 2025.",
    keywords:    "Krypto Events 2025, Blockchain Konferenz, Krypto Gipfel, Web3 Meetup",
  },
  'zh-CN': {
    title:       "加密货币活动 2025 – 会议与区块链峰会",
    description: "探索2025年全球最新加密货币和区块链活动、会议和峰会。按状态、地点和日期筛选。",
    keywords:    "加密货币活动, 区块链会议, Web3峰会, NFT活动",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict        = await getDictionary(locale).catch(() => ({}));
  const localeMeta  = META[locale] || META['en'];

  const title       = dict?.seo?.events_title       || localeMeta.title;
  const description = dict?.seo?.events_description || localeMeta.description;
  const keywords    = dict?.seo?.events_keywords     || localeMeta.keywords;

  const canonicalUrl = `${BASE_URL}/${locale}/events`;
  const pageImage    = `${BASE_URL}/og-image-events.png`;

  // ✅ FIX 2: x-default + self-reference hreflang dono add kiye
const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
  const hreflang = lang === 'zh-CN' ? 'zh-Hans' : lang;
  acc[hreflang] = `${BASE_URL}/${lang}/events`;
  return acc;
}, {});
alternateLanguages['x-default'] = `${BASE_URL}/en/events`; // ← x-default fix
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // self-reference already included via SUPPORTED_LOCALES
    },
    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: pageImage, width: 1200, height: 630, alt: "Crypto Events 2025" }],
      locale,
      type: "website",
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

export default async function Page({ params }) {
  const { locale }   = await params;
  const localeMeta   = META[locale] || META['en'];
  const canonicalUrl = `${BASE_URL}/${locale}/events`;

  const collectionPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    name:          localeMeta.title,
    description:   localeMeta.description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png`, width: 200, height: 60 },
    },
    image: { "@type": "ImageObject", url: `${BASE_URL}/og-image-events.png`, width: 1200, height: 630 },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",   item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Events", item: canonicalUrl },
    ],
  };

  // ✅ FIX 3: startDate + endDate add kiye — schema validation fix
  const eventSeriesSchema = {
    "@context":   "https://schema.org",
    "@type":      "EventSeries",
    name:          "Global Crypto & Blockchain Events 2025",
    description:   "A curated series of international cryptocurrency, DeFi, NFT, and blockchain events.",
    url:           canonicalUrl,
    startDate:     "2025-01-01",  // ← required
    endDate:       "2025-12-31",  // ← required
    inLanguage:    locale,
    organizer: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
    eventStatus:         "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: canonicalUrl },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What types of crypto events are listed?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "We list conferences, summits, hackathons, NFT drops, DeFi meetups, and Web3 community events from around the world.",
        },
      },
      {
        "@type": "Question",
        name:    "Are the crypto events updated in real-time?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, our events database is continuously updated to reflect the latest status, date changes, and new events as they are announced.",
        },
      },
      {
        "@type": "Question",
        name:    "Can I filter events by location or date?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, you can filter crypto events by status (upcoming, ongoing, past), location, and date range.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSeriesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EventsPage />
    </>
  );
}