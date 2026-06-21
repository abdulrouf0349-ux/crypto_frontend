import { notFound } from "next/navigation";
import { fetchEventBySlug } from "@/lib/api/FetchAllEvents";
import EventDetail from "@/pages/EventsDetails";
import Script from "next/script";
// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const LOCALE_TO_HREFLANG = {
  en: "en",
  ur: "ur",
  ar: "ar",
  de: "de",
  fr: "fr",
  ru: "ru",
  zh: "zh-Hans",
  es: "es",
};

const OG_LOCALE_MAP = {
  en: "en_US",
  ur: "ur_PK",
  ar: "ar_AR",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
  zh: "zh_CN",
  es: "es_ES",
};

// ─── SSG: generateStaticParams ────────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];

  for (const locale of VALID_LOCALES) {
    let page = 1;
    let totalPages = 1;

    do {
      try {
        // ✅ FIX: Wrapped fetch + res.json() in same try block
        // Previously `res` was declared outside try and could be undefined
        const response = await fetch(
          `https://crytponews.fun/api/get-events/${locale}/?page=${page}`,
          { next: { revalidate: 43200 } }
        );

        // ✅ FIX: Guard against non-OK responses before calling .json()
        if (!response.ok) {
          console.warn(`Non-OK response for locale ${locale} page ${page}: ${response.status}`);
          break;
        }

        // ✅ FIX: Guard against empty body before parsing JSON
        const text = await response.text();
        if (!text || text.trim() === "") {
          console.warn(`Empty response body for locale ${locale} page ${page}`);
          break;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error(`JSON parse error for locale ${locale} page ${page}:`, parseErr);
          break;
        }

        // ✅ FIX: Safe access with fallbacks — avoids undefined errors
        const events = data?.data ?? [];
        totalPages = data?.metadata?.total_pages ?? 1;

        for (const event of events) {
          if (!event || typeof event !== "object") continue;

          const localeKey = locale === "zh" ? "zh-cn" : locale;
          const slug =
            event[`slug_${localeKey}`] ||
            event.slug_en ||
            event.slug ||
            "";

          if (slug) {
            params.push({ locale, slug });
          }
        }
      } catch (err) {
        // ✅ FIX: Catch per-page errors so one failure doesn't abort all locales
        console.error(`generateStaticParams error for locale ${locale} page ${page}:`, err);
        break;
      }

      page++;
    } while (page <= totalPages);
  }

  return params;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLocalizedSlug(event, lang) {
  const key =
    lang === "zh"
      ? event["slug_zh-cn"] || event["slug_zh"]
      : event[`slug_${lang}`];
  return key || event.slug;
}

function buildCanonical(locale, slug) {
  return locale === "en"
    ? `${SITE_URL}/events/${slug}`
    : `${SITE_URL}/${locale}/events/${slug}`;
}

function buildDescription(raw, fallback) {
  const clean = (raw || fallback)
    .replace(/<[^>]*>/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= 160) return clean;
  const cut = clean.lastIndexOf(" ", 157);
  return (cut > 0 ? clean.slice(0, cut) : clean.slice(0, 157)) + "…";
}

function buildTitle(eventTitle, startDate) {
  const year = startDate
    ? new Date(startDate).getFullYear()
    : new Date().getFullYear();

  const hasYear = eventTitle.includes(String(year));
  const base = hasYear ? eventTitle : `${eventTitle} ${year}`;

  return `${base}: Speakers, Tickets & Event Details`;
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  let event = null;
  try {
    const res = await fetchEventBySlug(slug, locale);
    if (res?.success) event = res.data;
  } catch (_) {}

  if (!event) {
    return {
      title: `Event Not Found | ${SITE_NAME}`,
      description: "The requested crypto event could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalSlug = getLocalizedSlug(event, locale);
  const canonicalUrl = buildCanonical(locale, canonicalSlug);

  const title = buildTitle(event.title, event.start_date || event.date);

  const description = buildDescription(
    event.description || event.short_description,
    `${event.title}. View event schedule, speakers, venue details, registration information and ticket updates for this major blockchain and cryptocurrency event.`
  );

  const ogImage =
    event.image_src ||
    event.image ||
    event.banner ||
    `${SITE_URL}/og-events.png`;

  const alternateLanguages = VALID_LOCALES.reduce((acc, lang) => {
    const localSlug = getLocalizedSlug(event, lang);
    acc[LOCALE_TO_HREFLANG[lang] || lang] = buildCanonical(lang, localSlug);
    return acc;
  }, {});
  alternateLanguages["x-default"] = buildCanonical(
    "en",
    getLocalizedSlug(event, "en")
  );

  const eventYear =
    new Date(event.start_date || event.date || "").getFullYear() ||
    new Date().getFullYear();

  return {
    title,
    description,
    keywords: [
      event.title,
      `${event.title} tickets`,
      `${event.title} speakers`,
      `${event.title} location`,
      `${event.title} agenda`,
      `${event.title} registration`,
      "crypto event",
      "blockchain conference",
      event.location || "",
      String(eventYear),
      "cryptocurrency meetup",
      "DeFi summit",
      "Web3 event",
    ]
      .filter(Boolean)
      .join(", "),

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

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

    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      publishedTime: event.created_at || event.start_date || new Date().toISOString(),
      modifiedTime: event.updated_at || new Date().toISOString(),
      section: "Crypto Events",
      tags: ["crypto", "blockchain", "DeFi", "Web3", event.title],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${event.title} – crypto event banner`,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: `${event.title} crypto event`,
        },
      ],
      site: "@cryptonews90841",
      creator: "@cryptonews90841",
    },
  };
}

// ─── JSON-LD Schema Builder ───────────────────────────────────────────────────
function buildEventSchema(event, locale) {
  const canonicalSlug = getLocalizedSlug(event, locale);
  const canonicalUrl = buildCanonical(locale, canonicalSlug);
  const homeUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
  const eventsListUrl =
    locale === "en" ? `${SITE_URL}/events` : `${SITE_URL}/${locale}/events`;

  const ogImage =
    event.image_src ||
    event.image ||
    event.banner ||
    `${SITE_URL}/og-events.png`;

  const startDate = event.start_date || event.date || new Date().toISOString();
  const endDate = event.end_date || startDate;
  const updatedAt = event.updated_at || new Date().toISOString();
  const publishedAt = event.created_at || startDate;

  const description = buildDescription(
    event.description || event.short_description,
    `${event.title} – crypto event details.`
  );

  const isVirtual =
    event.is_virtual ||
    event.type === "online" ||
    event.format === "virtual" ||
    event.mode === "online";

  const attendanceMode = isVirtual
    ? "https://schema.org/OnlineEventAttendanceMode"
    : event.is_hybrid || event.format === "hybrid"
    ? "https://schema.org/MixedEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode";

  const physicalLocation = {
    "@type": "Place",
    name: event.venue || event.location || "TBA",
    ...(event.latitude && event.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: event.latitude,
            longitude: event.longitude,
          },
        }
      : {}),
    address: event.address
      ? {
          "@type": "PostalAddress",
          streetAddress: event.address?.street || event.address || "",
          addressLocality: event.city || event.address?.city || "",
          addressCountry: event.country || event.address?.country || "",
        }
      : {
          "@type": "PostalAddress",
          addressLocality: event.location || event.city || "TBA",
        },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: ["https://twitter.com/cryptonews90841"],
      },

      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: event.title,
        description,
        image: [ogImage],
        datePublished: publishedAt,
        dateModified: updatedAt,
        mainEntityOfPage: canonicalUrl,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        publisher: {
          "@id": `${SITE_URL}#organization`,
        },
      },

      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: event.title,
        description,
        mainEntity: { "@id": `${canonicalUrl}#event` },
        inLanguage: locale,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".event-summary"],
        },
        isPartOf: { "@id": `${SITE_URL}#website` },
        publisher: { "@id": `${SITE_URL}#organization` },
        datePublished: publishedAt,
        dateModified: updatedAt,
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: ogImage,
          width: 1200,
          height: 630,
        },
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Crypto Events",
            item: eventsListUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: event.title,
            item: canonicalUrl,
          },
        ],
      },

      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `When is ${event.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${event.title} starts on ${new Date(startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}${
                endDate && endDate !== startDate
                  ? ` and ends on ${new Date(endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`
                  : ""
              }.`,
            },
          },
          {
            "@type": "Question",
            name: `Where is ${event.title} held?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: isVirtual
                ? `${event.title} is an online/virtual event. You can attend from anywhere via ${
                    event.event_url || event.registration_url || "the registration link"
                  }.`
                : `${event.title} is held at ${
                    event.venue || event.location || "TBA"
                  }${event.city ? `, ${event.city}` : ""}${
                    event.country ? `, ${event.country}` : ""
                  }.`,
            },
          },
          ...(event.registration_url || event.ticket_url
            ? [
                {
                  "@type": "Question",
                  name: `How to register for ${event.title}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `You can register for ${event.title} at ${
                      event.registration_url || event.ticket_url
                    }. ${
                      event.price && event.price !== "0"
                        ? `Tickets are available starting at ${event.price} ${
                            event.currency || "USD"
                          }.`
                        : "Registration may be free — check the event website for details."
                    }`,
                  },
                },
              ]
            : []),
        ],
      },

      {
        "@type": "Event",
        "@id": `${canonicalUrl}#event`,
        name: event.title,
        description,
        startDate,
        endDate,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: attendanceMode,
        url: canonicalUrl,
        image: {
          "@type": "ImageObject",
          url: ogImage,
          width: 1200,
          height: 630,
          caption: `${event.title} event banner`,
        },
        location: isVirtual
          ? {
              "@type": "VirtualLocation",
              url: event.event_url || event.registration_url || canonicalUrl,
            }
          : physicalLocation,
        organizer: {
          "@type": "Organization",
          name: event.organizer || SITE_NAME,
          url: event.organizer_url || SITE_URL,
        },
        offers:
          event.registration_url || event.ticket_url
            ? {
                "@type": "Offer",
                url: event.registration_url || event.ticket_url,
                price: event.price || event.ticket_price || "0",
                priceCurrency: event.currency || "USD",
                availability: "https://schema.org/InStock",
                validFrom: publishedAt,
              }
            : {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                validFrom: publishedAt,
              },
        ...(event.speakers?.length
          ? {
              performer: event.speakers.map((s) => ({
                "@type": "Person",
                name: typeof s === "string" ? s : s.name,
                ...(s.url ? { url: s.url } : {}),
              })),
            }
          : {}),
        mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
        inLanguage: locale,
      },
    ],
  };
}

// ─── Page Server Component ────────────────────────────────────────────────────
export default async function EventDetailPage({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  const res = await fetchEventBySlug(slug, locale);
  if (!res?.success) notFound();

  const event = res.data;

  const localizedSlugs = VALID_LOCALES.reduce((acc, lang) => {
    acc[lang === "zh" ? "zh-cn" : lang] = getLocalizedSlug(event, lang);
    return acc;
  }, {});

  const schema = buildEventSchema(event, locale);

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div
        id="localized-slugs"
        data-slugs={JSON.stringify(localizedSlugs)}
        style={{ display: "none" }}
      />

      <EventDetail event={event} locale={locale} />
    </>
  );
}