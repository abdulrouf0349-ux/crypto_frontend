import { FetchAllEvents } from "@/lib/api/FetchAllEvents";
import EventsClient from "@/pages/Events";
import Script from "next/script";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const LOCALE_TO_HREFLANG: Record<string, string> = {
  en: "en",
  ur: "ur",
  ar: "ar",
  de: "de",
  fr: "fr",
  ru: "ru",
  zh: "zh-Hans",
  es: "es",
};

const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  ur: "ur_PK",
  ar: "ar_AR",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
  zh: "zh_CN",
  es: "es_ES",
};

// ─── Locale-specific content ──────────────────────────────────────────────────
const META_TITLES: Record<string, string> = {
  en: "Crypto Events 2026 – Conferences, Meetups & Summits | CryptoNews Trend",
  ur: "کرپٹو ایونٹس 2026 – کانفرنسز اور میٹ اپس | CryptoNews Trend",
  ar: "فعاليات التشفير 2026 – مؤتمرات ولقاءات | CryptoNews Trend",
  de: "Krypto Events 2026 – Konferenzen & Meetups | CryptoNews Trend",
  es: "Eventos Crypto 2026 – Conferencias y Meetups | CryptoNews Trend",
  fr: "Événements Crypto 2026 – Conférences & Meetups | CryptoNews Trend",
  ru: "Крипто События 2026 – Конференции и Встречи | CryptoNews Trend",
  zh: "2026加密货币活动 – 会议与聚会 | CryptoNews Trend",
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: "Browse all upcoming crypto events in 2026 — blockchain conferences, DeFi summits, NFT meetups and Web3 hackathons. Stay ahead with CryptoNews Trend.",
  ur: "2026 کے تمام آنے والے کرپٹو ایونٹس دیکھیں — بلاک چین کانفرنسز، DeFi سمٹس، NFT میٹ اپس اور Web3 ہیکاتھون۔",
  ar: "تصفح جميع فعاليات العملات المشفرة القادمة لعام 2026 — مؤتمرات البلوك تشين وقمم DeFi ولقاءات NFT.",
  de: "Alle Krypto-Events 2026 auf einen Blick — Blockchain-Konferenzen, DeFi-Gipfel, NFT-Meetups und Web3-Hackathons.",
  es: "Explora todos los eventos crypto de 2026 — conferencias blockchain, cumbres DeFi, meetups NFT y hackathons Web3.",
  fr: "Parcourez tous les événements crypto de 2026 — conférences blockchain, sommets DeFi, meetups NFT et hackathons Web3.",
  ru: "Все крипто-события 2026 года — блокчейн-конференции, DeFi-саммиты, NFT-митапы и Web3-хакатоны.",
  zh: "浏览2026年所有即将举行的加密货币活动——区块链会议、DeFi峰会、NFT聚会和Web3黑客马拉松。",
};

const META_KEYWORDS: Record<string, string> = {
  en: "crypto events 2026, blockchain conference 2026, DeFi summit, NFT meetup, Web3 hackathon, cryptocurrency events, bitcoin conference",
  ur: "کرپٹو ایونٹس 2026, بلاک چین کانفرنس, DeFi سمٹ, NFT میٹ اپ",
  ar: "فعاليات التشفير 2026, مؤتمر البلوك تشين, قمة DeFi",
  de: "Krypto Events 2026, Blockchain Konferenz, DeFi Gipfel, NFT Meetup",
  es: "eventos crypto 2026, conferencia blockchain, cumbre DeFi",
  fr: "événements crypto 2026, conférence blockchain, sommet DeFi",
  ru: "крипто события 2026, конференция блокчейн, саммит DeFi",
  zh: "加密货币活动2026, 区块链会议, DeFi峰会",
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildEventsUrl(locale: string): string {
  return locale === "en"
    ? `${BASE_URL}/events`
    : `${BASE_URL}/${locale}/events`;
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  const canonicalUrl = buildEventsUrl(locale);

  // hreflang for all locales + x-default
  const alternateLanguages = VALID_LOCALES.reduce<Record<string, string>>(
    (acc, lang) => {
      acc[LOCALE_TO_HREFLANG[lang] || lang] = buildEventsUrl(lang);
      return acc;
    },
    {}
  );
  alternateLanguages["x-default"] = buildEventsUrl("en");

  const title = META_TITLES[locale] || META_TITLES.en;
  const description = META_DESCRIPTIONS[locale] || META_DESCRIPTIONS.en;
  const ogImage = `${BASE_URL}/og-events.png`;

  return {
    // ── Core ──────────────────────────────────────────────────────────────
    title,
    description,
    keywords: META_KEYWORDS[locale] || META_KEYWORDS.en,
category: "Cryptocurrency Events",
metadataBase: new URL(BASE_URL),
    // ── Canonical & hreflang ──────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // ── Robots ────────────────────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    // ── Open Graph ────────────────────────────────────────────────────────
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Crypto Events 2026 – CryptoNews Trend",
          type: "image/png",
        },
      ],
    },

    // ── Twitter / X Card ──────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: "Crypto Events 2026",
        },
      ],
      site: "@cryptonews90841",    // ← apna handle daalein
      creator: "@cryptonews90841",
    },
  };
}

// ─── JSON-LD Schema Builder ───────────────────────────────────────────────────
function buildEventsSchema(
  locale: string,
  events: Record<string, any>[]
) {
  const canonicalUrl = buildEventsUrl(locale);
  const homeUrl = locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;
  const now = new Date().toISOString();

  // Build Event items for ItemList (max first 10 for schema)
  const eventItems = events.slice(0, 10).map((event, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Event",
      name: event?.title || event?.name || `Crypto Event ${index + 1}`,
      startDate: event?.start_date || event?.date || now,
      endDate: event?.end_date || event?.start_date || now,
      description: event?.description || event?.short_description || "",
      url: event?.url || event?.link || canonicalUrl,
      location: event?.location
        ? {
            "@type": "Place",
            name: event.location,
          }
        : {
            "@type": "VirtualLocation",
            url: event?.url || canonicalUrl,
          },
      organizer: {
        "@type": "Organization",
        name: event?.organizer || SITE_NAME,
        url: event?.organizer_url || BASE_URL,
      },
      image: event?.image || event?.banner || `${BASE_URL}/og-events-2026.jpg`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode:
        event?.is_virtual || event?.type === "online"
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [


      // ── WebSite ────────────────────────────────────────────────────────
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}#website`,
        url: BASE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${BASE_URL}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // ── Organization ───────────────────────────────────────────────────
    {
  "@type": "Organization",
  "@id": `${BASE_URL}#organization`,
  "name": SITE_NAME,
  "url": BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${BASE_URL}/logo.png`
  },
  "sameAs": [
    "https://twitter.com/cryptonews90841"
  ],
  "publishingPrinciples": "https://cryptonewstrend.com/editorial-policy"
},

      // ── CollectionPage ─────────────────────────────────────────────────
     {
  "@type": "CollectionPage",
  "@id": `${canonicalUrl}#webpage`,
  mainEntity: {
  "@id": `${canonicalUrl}#eventlist`
},
 speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: [".h1"]
},
about: {
  "@type": "Thing",
  "name": "Cryptocurrency Events"
},
datePublished:
events?.[0]?.created_at || now,

dateModified:
events?.[0]?.updated_at || now,
  url: canonicalUrl,
  name: META_TITLES[locale] || META_TITLES.en,
  description: META_DESCRIPTIONS[locale] || META_DESCRIPTIONS.en,
  inLanguage: locale,
  isPartOf: { "@id": `${BASE_URL}#website` },
  publisher: { "@id": `${BASE_URL}#organization` },
  // events.[0].updated_at ||
  // events?.[0]?.created_at ||
  now,
  breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },

},

      // ── BreadcrumbList ─────────────────────────────────────────────────
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Crypto Events 2026",
            item: canonicalUrl,
          },
        ],
      },

      // ── ItemList of Events (Google Discover + rich results) ────────────
      ...(eventItems.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${canonicalUrl}#eventlist`,
              name: "Upcoming Crypto Events 2026",
              description:
                "Complete list of blockchain conferences, DeFi summits and crypto meetups in 2026.",
              url: canonicalUrl,
              numberOfItems: events.length,
              itemListElement: eventItems,
            },
          ]
        : []),
    ],
  };
}

// ─── Page Server Component ────────────────────────────────────────────────────
export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  // Server-side fetch
  const data = await FetchAllEvents(1, locale);
  const initialEvents: Record<string, any>[] = data?.data || [];
  const totalPages: number = data?.metadata?.total_pages || 1;

  const schema = buildEventsSchema(locale, initialEvents);

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <EventsClient
        initialEvents={initialEvents}
        totalPages={totalPages}
        locale={locale}
      />
    </>
  );
}