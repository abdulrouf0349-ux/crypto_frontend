import { getAlertDetailsByHash } from "../../../../../apis/page_news/events";
import { fetchWhaleAlerts } from "../../../../../apis/cryptowhales";
import WhaleDetailsSlug from "./WhaleDetailsSlug";
import { notFound } from "next/navigation";

// ✅ Maximize performance for real-time data
export const dynamicParams = true;
export const revalidate = 3600; // Cache for 1 hour

const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ── Helpers ─────────────────────────────────────────────
const getCleanUrl = (locale, hash) => {
  const path = `/crypto-whales/${hash}`;
  return locale === "en" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
};

const isValid = (v) => v && v !== "N/A" && v !== "null" && v !== "None";

function buildMeta(tx, hash, locale) {
  const shortHash = hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : "Unknown";
  const alertType = tx?.alert_type?.trim() || "Whale Transfer";
  const amount = tx?.amount_full?.split("(")[0]?.trim() || "";
  const chain = tx?.blockchain || "Blockchain";

  const title = tx 
    ? `${alertType}${amount ? " " + amount : ""} on ${chain} | Live Tracker` 
    : `Whale Transaction ${shortHash}`;

  const rawDesc = tx?.summary 
    ? `${tx.summary} Check transaction hash ${hash} for real-time on-chain details.`.trim() 
    : `Detailed on-chain analysis for crypto whale transaction ${shortHash} on ${chain}.`;

  const description = rawDesc.length <= 155 ? rawDesc : rawDesc.slice(0, 152) + "...";
  const canonicalUrl = getCleanUrl(locale, hash);

  return { title, description, shortHash, canonicalUrl, alertType, chain };
}

// ── Metadata ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { hash, locale } = await params;
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);
  
  const { title, description, canonicalUrl } = buildMeta(tx, hash, locale);
  const image = `${BASE_URL}/og-image-whales.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[LOCALE_TO_HREFLANG[lang] || lang] = getCleanUrl(lang, hash);
    return acc;
  }, {});
  
  alternateLanguages["x-default"] = getCleanUrl("en", hash);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternateLanguages },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      type: "article",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

// ── Static Params ─────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];
  // Generating params for the first 15 alerts per locale to speed up build
  for (const locale of SUPPORTED_LOCALES) {
    try {
      const result = await fetchWhaleAlerts(1, locale);
      (result?.data || []).slice(0, 15).forEach(item => {
        if (item.hash) params.push({ locale, hash: item.hash });
      });
    } catch { continue; }
  }
  return params;
}

// ── Page Component ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { hash, locale } = await params;
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);

  if (!tx) return notFound();

  const { title, description, shortHash, canonicalUrl } = buildMeta(tx, hash, locale);

  const txSchema = {
    "@context": "https://schema.org",
    "@type": "TransferAction",
    "name": title,
    "description": description,
    "identifier": hash,
    "url": canonicalUrl,
    "startTime": tx.timestamp_utc || tx.alert_timestamp,
    "agent": {
      "@type": "Organization",
      "name": isValid(tx.sender?.owner) ? tx.sender.owner : "Private Wallet",
    },
    "recipient": {
      "@type": "Organization",
      "name": isValid(tx.receiver?.owner) ? tx.receiver.owner : "Private Wallet",
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": locale === "en" ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Crypto Whales", "item": locale === "en" ? `${BASE_URL}/crypto-whales` : `${BASE_URL}/${locale}/crypto-whales` },
      { "@type": "ListItem", "position": 3, "name": "Transaction Detail", "item": canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(txSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WhaleDetailsSlug initialData={tx} />
    </>
  );
}