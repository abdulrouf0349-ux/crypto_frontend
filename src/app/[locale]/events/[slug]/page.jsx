// app/[locale]/events/[slug]/page.js

import { fetchEventDetails } from "../../../../../apis/page_news/events";
import { fetchAllEvents }    from "../../../../../apis/page_news/events";
import EventDetailsPage      from "./EventDetailsPage";
import { notFound }          from "next/navigation";

export const revalidate    = 3600;
export const dynamicParams = true;

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];
const FALLBACK_DESC     = "Discover the latest crypto and blockchain events, conferences, and summits worldwide.";

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN",  "es": "es_ES",
};
// ✅ Specific helper for your backend format: 'Apr 11, 2026 | (UTC: +05:30)'
function formatBackendDate(dateStr) {
  if (!dateStr) return "";
  
  try {
    // 1. Agar pipe '|' hai, to sirf pehle wala part lo (Apr 11, 2026)
    const cleanDate = dateStr.includes('|') 
      ? dateStr.split('|')[0].trim() 
      : dateStr;

    const d = new Date(cleanDate);
    
    // 2. Check if valid date
    if (isNaN(d.getTime())) return ""; 

    // 3. Return YYYY-MM-DD
    return d.toISOString().split('T')[0];
  } catch (e) {
    return "";
  }
}
// ✅ Title — word boundary, max 50 chars
function buildSeoTitle(eventTitle) {
  if (!eventTitle) return "Crypto Blockchain Event";
  if (eventTitle.length <= 50) return eventTitle;
  const cut = eventTitle.slice(0, 50);
  return cut.slice(0, cut.lastIndexOf(" "));
}

// ✅ Description — word boundary, 120-160 chars, fallback sahi
function buildSeoDescription(rawDesc) {
  // ✅ FIX: pehle fallback check karo
  const clean = (rawDesc || "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // ✅ FIX: agar empty ya bohot chota toh fallback use karo
  if (!clean || clean.length < 50) return FALLBACK_DESC;

  // ✅ FIX: 160 se chhota toh as-is return karo
  if (clean.length <= 160) return clean;

  // ✅ FIX: word boundary pe cut karo — mid-word nahi
  const cut = clean.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace) + "...";
}

function getEventStatus(status) {
  switch (status?.toLowerCase()) {
    case "cancelled":   return "https://schema.org/EventCancelled";
    case "postponed":   return "https://schema.org/EventPostponed";
    case "rescheduled": return "https://schema.org/EventRescheduled";
    default:            return "https://schema.org/EventScheduled";
  }
}

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventDetails(slug, locale).catch(() => null);

  const title       = buildSeoTitle(event?.title);
  // ✅ FIX: dono jagah SAME function use karo — alag code nahi
  const description = buildSeoDescription(event?.description);
  const image       = event?.image_src || `${BASE_URL}/og-image-events.png`;
  const canonicalUrl = `${BASE_URL}/${locale}/events/${slug}`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[LOCALE_TO_HREFLANG[lang] || lang] = `${BASE_URL}/${lang}/events/${slug}`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/en/events/${slug}`;

  const keywords = [
    event?.title,
    event?.category,
    "crypto event",
    "blockchain conference",
    "crypto summit",
    "Web3 meetup",
  ].filter(Boolean).join(", ");

  return {
    title,
    description,      // ✅ meta description — word boundary
    keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    openGraph: {
      title:       `${title} | ${SITE_NAME}`,
      description, // ✅ SAME variable — alag nahi
      url:         canonicalUrl,
      siteName:    SITE_NAME,
      images: [{
        url:    image,
        width:  1200,
        height: 630,
        alt:    event?.title || "Crypto Blockchain Event",
      }],
      locale:          OG_LOCALE_MAP[locale] || "en_US",
      alternateLocale: SUPPORTED_LOCALES
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type: "article",
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841",
      title:       `${title} | ${SITE_NAME}`,
      description, // ✅ SAME variable — alag nahi
      images:      [image],
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

// ─────────────────────────────────────────────
// generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];
  for (const locale of SUPPORTED_LOCALES) {
    let page = 1;
    while (page <= 3) {
      try {
        const result  = await fetchAllEvents(page, locale);
        const items   = result?.data || [];
        items.forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });
        const hasNext = result?.metadata?.has_next || result?.has_next || false;
        if (!hasNext) break;
        page++;
      } catch { break; }
    }
  }
  console.log(`✅ Events Static Pages: ${params.length}`);
  return params;
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventDetails(slug, locale).catch(() => null);
  if (!event) return notFound();
console.log(event)
  const title        = buildSeoTitle(event?.title);
  // ✅ FIX: PAGE mein bhi SAME function
  const description  = buildSeoDescription(event?.description);
  const image        = event?.image_src || `${BASE_URL}/og-image-events.png`;
  const canonicalUrl = `${BASE_URL}/${locale}/events/${slug}`;
  const back_date=formatBackendDate(event.date_text)
  const eventSchema = {
    "@context":  "https://schema.org",
    "@type":     "Event",
    name:         event.title,
    description:  buildSeoDescription(event?.description),
    url:          canonicalUrl,
    image,
    startDate:    event.date_iso     || back_date || "",
    endDate:      event.end_date_iso || back_date  || event.date_text || "",
    inLanguage:   locale,
    eventStatus:  getEventStatus(event.status),
    eventAttendanceMode: event.is_online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name:    event.detail_location || event.location || "TBA",
      address: {
        "@type":         "PostalAddress",
        addressLocality: event.location || event.detail_location || "TBA",
      },
    },
    organizer: {
      "@type": "Organization",
      name:    event.organized_by || SITE_NAME,
      url:     event.website_link || BASE_URL,
    },
    ...(event.website_link && {
      offers: {
        "@type":       "Offer",
        url:            event.website_link,
        availability:  "https://schema.org/InStock",
        validFrom:      new Date().toISOString().split("T")[0],
        ...(event.price
          ? { price: event.price, priceCurrency: event.currency || "USD" }
          : { price: "0", priceCurrency: "USD" }
        ),
      },
    }),
    performer: {
      "@type": "Organization",
      name:    event.organized_by || event.speaker || SITE_NAME,
      url:     event.website_link || BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",   item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Events", item: `${BASE_URL}/${locale}/events` },
      { "@type": "ListItem", position: 3, name: event.title || "Event Details", item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    "@context":    "https://schema.org",
    "@type":       "WebPage",
    name:           title,
    description,
    url:            canonicalUrl,
    inLanguage:     locale,
    dateModified:   event.updated_at
      ? new Date(event.updated_at).toISOString()
      : new Date().toISOString(),
    datePublished:  event.created_at
      ? new Date(event.created_at).toISOString()
      : new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <EventDetailsPage initialData={event} />
    </>
  );
}