// app/[locale]/crypto-whales/[hash]/page.js

import { getAlertDetailsByHash } from "../../../../../apis/page_news/events";
import { fetchWhaleAlerts }      from "../../../../../apis/cryptowhales";
import WhaleDetailsSlug          from "./WhaleDetailsSlug";

export const dynamicParams = true;
export const revalidate    = 3600; // ✅ FIX: false → 3600

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend"; // ✅ FIX: "CryptoNews" → "CryptoNews Trend"
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"]; // ✅ ru add

// ✅ hreflang Google standard
const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// ✅ OG locale standard
const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ─────────────────────────────────────────────
// HELPER — buildMeta
// ─────────────────────────────────────────────
function buildMeta(tx, hash, locale) {
  const shortHash = hash
    ? `${hash.slice(0, 10)}...${hash.slice(-8)}`
    : "Unknown";

  // ✅ FIX: alert_type empty hone pe "Whale Transfer" use karo
  const alertType = tx?.alert_type?.trim() || "Whale Transfer";
  const amount    = tx?.amount_full?.split("(")[0]?.trim() || "";
  const chain     = tx?.blockchain || "Blockchain";

  // ✅ FIX: title — SITE_NAME mat lagao, layout template lagaega
  const title = tx
    ? `${alertType}${amount ? " " + amount : ""} on ${chain}`
    : `Whale Transaction ${shortHash}`;

  // ✅ FIX: description — word boundary pe cut
  const rawDesc = tx?.summary
    ? `${tx.summary} ${tx.alert_text || ""}`.trim()
    : `View on-chain whale transaction details for hash ${shortHash} on ${chain}.`;

  const clean = rawDesc.replace(/\s+/g, " ").trim();
  const description = clean.length <= 160
    ? clean
    : clean.slice(0, clean.lastIndexOf(" ", 157)) + "..."; // ✅ word boundary

  const canonicalUrl = `${BASE_URL}/${locale}/crypto-whales/${hash}`;

  return { title, description, shortHash, canonicalUrl, alertType, chain };
}

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { hash, locale } = await params;
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);
  const { title, description, canonicalUrl } = buildMeta(tx, hash, locale);
  const image = `${BASE_URL}/og-image-whales.jpg`;

  // ✅ FIX: zh-Hans + ru + x-default
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/crypto-whales/${hash}`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/en/crypto-whales/${hash}`; // ✅

  const keywords = [
    tx?.blockchain,
    tx?.alert_type,
    tx?.sender_owner,
    tx?.receiver_owner,
    "whale transaction",
    "crypto whale alert",
    "on-chain analysis",
    "blockchain transaction tracker",
    hash?.slice(0, 16),
  ].filter(Boolean).join(", ");

  return {
    title,             // ✅ layout template: "Transfer 25K ETH on Ethereum | CryptoNews Trend"
    description,       // ✅ word boundary cut
    keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans, ru, x-default
    },

    openGraph: {
      title:       `${title} | ${SITE_NAME}`, // ✅ OG mein manually
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,                         // ✅ "CryptoNews Trend"
      locale:      OG_LOCALE_MAP[locale] || "en_US",  // ✅ "en_US" format
      alternateLocale: SUPPORTED_LOCALES               // ✅ alternateLocale
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        "article",
      images: [{
        url:    image,
        width:  1200,
        height: 630,
        alt:    title,
      }],
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841", // ✅ add kiya
      title:       `${title} | ${SITE_NAME}`,
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

// ─────────────────────────────────────────────
// generateStaticParams
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const result  = await fetchWhaleAlerts(page, locale);
        const items   = result?.data || [];
        items.forEach(item => {
          if (item.hash) params.push({ locale, hash: item.hash });
        });
        const hasNext = result?.metadata?.has_next || false;
        if (!hasNext) break;
      } catch { break; }
    }
  }

  console.log(`✅ Whales Pre-built: ${params.length} pages`);
  return params;
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { hash, locale } = await params;
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);
  const { title, description, shortHash, canonicalUrl } = buildMeta(tx, hash, locale);

  const isValid = (v) => v && v !== "N/A" && v !== "null" && v !== "None";

  // ✅ TransferAction Schema
  const txSchema = tx ? {
    "@context": "https://schema.org",
    "@type":    "TransferAction",
    name:        tx.amount_full?.split("(")[0]?.trim() || `Whale Transaction ${shortHash}`,
    description,
    url:         canonicalUrl,
    startTime:   tx.timestamp_utc || tx.alert_timestamp,
    agent: {
      "@type": "Organization",
      name:    isValid(tx.sender_owner) ? tx.sender_owner : "Private Wallet",
      ...(isValid(tx.sender_address)     && { identifier: tx.sender_address }),
      ...(isValid(tx.sender_address_url) && { url: tx.sender_address_url }),
    },
    recipient: {
      "@type": "Organization",
      name:    isValid(tx.receiver_owner) ? tx.receiver_owner : "Private Wallet",
      ...(isValid(tx.receiver_address)     && { identifier: tx.receiver_address }),
      ...(isValid(tx.receiver_address_url) && { url: tx.receiver_address_url }),
    },
    instrument: {
      "@type":    "Thing",
      name:        tx.blockchain,
      identifier:  tx.transaction_hash,
      ...(isValid(tx.transaction_hash_url) && { url: tx.transaction_hash_url }),
    },
    provider: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  } : null;

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",          item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Crypto Whales", item: `${BASE_URL}/${locale}/crypto-whales` },
      { "@type": "ListItem", position: 3, name: title,           item: canonicalUrl },
    ],
  };

  // ✅ WebPage Schema
  const webPageSchema = {
    "@context":    "https://schema.org",
    "@type":       "WebPage",
    name:           title,
    description,
    url:            canonicalUrl,
    inLanguage:     locale,
    dateModified:   tx?.timestamp_utc
      ? new Date(tx.timestamp_utc).toISOString()
      : new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name:    SITE_NAME,
      url:     BASE_URL,
      logo:   { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(isValid(tx?.transaction_hash_url) && { sameAs: [tx.transaction_hash_url] }),
  };

  // ✅ FAQ Schema
  const alertTypeAnswer = () => {
    if (tx?.alert_type === "Burn")
      return "A Burn transaction permanently removes tokens from circulation by sending them to an unspendable address, reducing total supply.";
    if (tx?.alert_type === "Mint")
      return "A Mint transaction creates new tokens, increasing total supply of the cryptocurrency.";
    return "A Transfer alert indicates a large movement of cryptocurrency between wallets or exchanges, signaling significant trading activity.";
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is a crypto whale transaction?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "A crypto whale transaction is a large cryptocurrency movement worth millions of dollars by addresses holding significant amounts. These are tracked as they can signal major market activity.",
        },
      },
      {
        "@type": "Question",
        name:    `What does a ${tx?.alert_type || "Transfer"} alert mean?`,
        acceptedAnswer: { "@type": "Answer", text: alertTypeAnswer() },
      },
      {
        "@type": "Question",
        name:    "How is this whale transaction verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `This transaction on ${tx?.blockchain || "blockchain"} is permanently recorded on-chain and can be verified on any public block explorer using the transaction hash.`,
        },
      },
    ],
  };

  return (
    <>
      {txSchema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(txSchema) }}
        />
      )}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <WhaleDetailsSlug initialData={tx} />
    </>
  );
}