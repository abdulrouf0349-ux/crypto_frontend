// app/[locale]/events/[slug]/page.js  →  SERVER COMPONENT (SEO Only)
import { fetchEventDetails } from "../../../../../apis/page_news/events";
import EventDetailsPage from "./EventDetailsPage";
import { notFound } from 'next/navigation'
export const dynamicParams = true;
export const revalidate = false;
import { fetchAllEvents } from "../../../../../apis/page_news/events";
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-cn"]; // ✅ zh → zh-cn

// ─────────────────────────────────────────────
// HELPER — meta dono functions mein reuse hoga
// ─────────────────────────────────────────────
function buildEventMeta(event, slug, locale) {
  const title = event?.title
    ? `${event.title} – Crypto Event | ${SITE_NAME}`
    : `Crypto Event Details | ${SITE_NAME}`;

  const description = event?.description
    ? event.description.slice(0, 160).replace(/\n/g, " ").trim()
    : "Discover the latest crypto and blockchain events, conferences, and summits worldwide.";

  const image        = event?.image_src || `${BASE_URL}/og-image-events`;
  const canonicalUrl = `${BASE_URL}/${locale}/events/${slug}`;

  return { title, description, image, canonicalUrl };
}

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  const event = await fetchEventDetails(slug, locale).catch(() => null); // ✅ locale pass
  const { title, description, image, canonicalUrl } = buildEventMeta(event, slug, locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/events/${slug}`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords: [
      event?.title,
      event?.category,
      event?.detail_location,
      "crypto event",
      "blockchain conference",
      "crypto summit",
      "Web3 meetup",
      event?.date_text,
    ].filter(Boolean).join(", "),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url:      canonicalUrl,
      siteName: SITE_NAME,
      images:   [{ url: image, width: 1200, height: 630, alt: event?.title || "Crypto Event" }],
      locale,
      type:     "article",
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841", // ✅ @yourhandle fix
      title,
      description,
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


export async function generateStaticParams() {
  const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-cn', 'es'];
  const params = [];

  for (const locale of LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const result = await fetchAllEvents(page, locale);

        const items = result?.data || [];

        items.forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });

        // Agle page nahi hai toh loop tod do
        const hasNext = result?.metadata?.has_next || result?.has_next || false;
        if (!hasNext) break;

      } catch { break; }
    }
  }

  console.log(`✅ Events Pre-built: ${params.length} pages`);
  return params;
}
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT — Structured Data + UI
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { slug, locale } = await params;

  // ✅ Single fetch — Next.js same render mein deduplicate karta hai
  const event = await fetchEventDetails(slug, locale).catch(() => null);
  const { title, description, image, canonicalUrl } = buildEventMeta(event, slug, locale);
  if (!event) return notFound();

  // ── Schema 1: Event ───────────────────────────────────────
  const eventSchema = event ? {
    "@context": "https://schema.org",
    "@type":    "Event",
    name:        event.title,
    description: event.description?.slice(0, 300) || "",
    url:         canonicalUrl,
    image:       image,
    startDate:   event.date_iso   || event.date_text,
    endDate:     event.end_date_iso || event.date_iso || event.date_text,
    inLanguage:  locale,
    eventStatus:
      event.status?.toLowerCase() === "ended"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: event.is_online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name:     event.detail_location || event.location || "TBA",
      address: {
        "@type":           "PostalAddress",
        addressLocality:    event.location || event.detail_location || "TBA",
      },
    },
    organizer: {
      "@type": "Organization",
      name:     event.organized_by || SITE_NAME,
      url:      event.website_link || BASE_URL,
    },
    ...(event.website_link && {
      offers: {
        "@type":        "Offer",
        url:             event.website_link,
        price:           "0",
        priceCurrency:   "USD",
        availability:    "https://schema.org/InStock",
        validFrom:       new Date().toISOString().split("T")[0],
      },
    }),
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  } : null;

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",           item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Events",         item: `${BASE_URL}/${locale}/events` },
      { "@type": "ListItem", position: 3, name: event?.title || "Event Details", item: canonicalUrl },
    ],
  };

  // ── Schema 3: WebPage ─────────────────────────────────────
  const webPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    name:          title,
    description,
    url:           canonicalUrl,
    inLanguage:    locale,
    dateModified:  new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };

  return (
    <>
      {eventSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* ✅ initialData pass — client double fetch nahi karega */}
      <EventDetailsPage initialData={event} />
    </>
  );
}