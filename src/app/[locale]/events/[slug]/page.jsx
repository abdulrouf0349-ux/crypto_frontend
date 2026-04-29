import { fetchEventDetails, fetchAllEvents } from "../../../../../apis/page_news/events";
import EventDetailsPage from "./EventDetailsPage";
import { notFound } from "next/navigation";

export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur-PK", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// --- Helper Functions ---
function buildSeoTitle(eventTitle) {
  if (!eventTitle) return "Crypto Blockchain Event";
  return eventTitle.length > 60 ? eventTitle.substring(0, 57) + "..." : eventTitle;
}

function buildSeoDescription(rawDesc) {
  const clean = (rawDesc || "").replace(/<[^>]*>?/gm, '').replace(/\s+/g, " ").trim();
  if (!clean || clean.length < 50) return "Discover the latest crypto and blockchain events, conferences, and summits worldwide.";
  return clean.length > 155 ? clean.substring(0, 152) + "..." : clean;
}

// --- generateMetadata ---
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventDetails(slug, locale).catch(() => null);

  if (!event) return { title: "Event Not Found" };

  const title = buildSeoTitle(event.title);
  const description = buildSeoDescription(event.description);
  const image = event.image_src || `${BASE_URL}/og-image-events.png`;
  
  const canonicalUrl = locale === 'en' 
    ? `${BASE_URL}/events/${slug}` 
    : `${BASE_URL}/${locale}/events/${slug}`;

  const languages = {};
  SUPPORTED_LOCALES.forEach(lang => {
    languages[LOCALE_TO_HREFLANG[lang] || lang] = lang === 'en' 
      ? `${BASE_URL}/events/${slug}` 
      : `${BASE_URL}/${lang}/events/${slug}`;
  });
  languages["x-default"] = `${BASE_URL}/events/${slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventDetails(slug, locale).catch(() => null);

  if (!event) return notFound();

  const canonicalUrl = locale === 'en' 
    ? `${BASE_URL}/events/${slug}` 
    : `${BASE_URL}/${locale}/events/${slug}`;

  // Structured Data (JSON-LD)
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": buildSeoDescription(event.description),
    "image": event.image_src,
    "startDate": event.date_iso || event.date_text,
    "endDate": event.end_date_iso || event.date_iso,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.is_online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "location": event.is_online ? { "@type": "VirtualLocation", "url": event.website_link } : {
      "@type": "Place",
      "name": event.detail_location || "Event Venue",
      "address": { "@type": "PostalAddress", "addressLocality": event.location || "Global" }
    },
    "organizer": { "@type": "Organization", "name": event.organized_by || SITE_NAME, "url": BASE_URL },
    "offers": {
      "@type": "Offer",
      "url": event.website_link,
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <EventDetailsPage initialData={event} />
    </>
  );
}