// app/[locale]/crypto-whales/[hash]/page.js  ←  SERVER COMPONENT
import { getAlertDetailsByHash } from "../../../../../apis/page_news/events";
import WhaleDetailsSlug from "./WhaleDetailsSlug";
export const dynamicParams = true;
export const revalidate = false;
import { fetchWhaleAlerts } from "../../../../../apis/cryptowhales";
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN"]; // ✅ zh → zh-CN

// ─────────────────────────────────────────────
// HELPER — ek jagah reusable meta builder
// ─────────────────────────────────────────────
function buildMeta(tx, hash, locale) {
  const shortHash = hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : hash;

  const title = tx
    ? `${tx.alert_type || "Whale"} ${tx.amount_full?.split("(")[0]?.trim() || ""} on ${tx.blockchain} | ${SITE_NAME}`
    : `Whale Transaction ${shortHash} | ${SITE_NAME}`;

  const description = tx?.summary
    ? `${tx.summary} ${tx.alert_text || ""}`.slice(0, 160).trim()
    : `View on-chain whale transaction details, sender, receiver, and verification data for hash ${shortHash}.`;

  const canonicalUrl = `${BASE_URL}/${locale}/crypto-whales/${hash}`;

  return { title, description, shortHash, canonicalUrl };
}

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { hash, locale } = await params;

  // ✅ Single fetch — catch karo, null return karo
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);
  const { title, description, canonicalUrl } = buildMeta(tx, hash, locale);

  const image = `${BASE_URL}/og-image-whales.jpg`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/crypto-whales/${hash}`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords: [
      tx?.blockchain,
      tx?.alert_type,
      tx?.sender_owner,
      tx?.receiver_owner,
      "whale transaction",
      "crypto whale alert",
      "on-chain analysis",
      "blockchain transaction tracker",
      hash?.slice(0, 16),
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
      images:   [{ url: image, width: 1200, height: 630, alt: title }],
      locale,
      type:     "article",
    },
    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
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
  const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];
  const params = [];

  for (const locale of LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const result = await fetchWhaleAlerts(page, locale);

        const items = result?.data || [];

        items.forEach(item => {
          if (item.hash) params.push({ locale, hash: item.hash });
        });

        // Agle page nahi hai toh loop tod do
        const hasNext = result?.metadata?.has_next || false;
        if (!hasNext) break;

      } catch { break; }
    }
  }

  console.log(`✅ Whales Pre-built: ${params.length} pages`);
  return params;
}
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function Page({ params }) {
  const { hash, locale } = await params;

  // ✅ Single fetch — generateMetadata wala alag tha, yeh Page ka apna
  // Next.js automatically deduplicate karta hai same request ko same render mein
  const tx = await getAlertDetailsByHash(hash, locale).catch(() => null);
  const { title, description, shortHash, canonicalUrl } = buildMeta(tx, hash, locale);

  const isValid = (v) => v && v !== "N/A" && v !== "null" && v !== "None";

  // ── Schema 1: TransferAction ──────────────────────────────
  const txSchema = tx ? {
    "@context": "https://schema.org",
    "@type":    "TransferAction",
    name:        tx.amount_full?.split("(")[0]?.trim() || tx.summary || `Whale Transaction ${shortHash}`,
    description: tx.summary || tx.alert_text || "",
    url:         canonicalUrl,
    startTime:   tx.timestamp_utc || tx.alert_timestamp,
    agent: {
      "@type": "Organization",
      name:     isValid(tx.sender_owner) ? tx.sender_owner : "Private Wallet",
      ...(isValid(tx.sender_address)     && { identifier: tx.sender_address }),
      ...(isValid(tx.sender_address_url) && { url: tx.sender_address_url }),
    },
    recipient: {
      "@type": "Organization",
      name:     isValid(tx.receiver_owner) ? tx.receiver_owner : "Private Wallet",
      ...(isValid(tx.receiver_address)     && { identifier: tx.receiver_address }),
      ...(isValid(tx.receiver_address_url) && { url: tx.receiver_address_url }),
    },
    instrument: {
      "@type":      "Thing",
      name:          tx.blockchain,
      identifier:    tx.transaction_hash,
      ...(isValid(tx.transaction_hash_url) && { url: tx.transaction_hash_url }),
    },
    provider: {
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
      { "@type": "ListItem", position: 1, name: "Home",          item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Whale Tracker", item: `${BASE_URL}/${locale}/crypto-whales` },
      { "@type": "ListItem", position: 3, name: tx?.amount_full?.split("(")[0]?.trim() || `Transaction ${shortHash}`, item: canonicalUrl },
    ],
  };

  // ── Schema 3: WebPage ─────────────────────────────────────
  const webPageSchema = {
    "@context":    "https://schema.org",
    "@type":       "WebPage",
    name:           title,
    description,
    url:            canonicalUrl,
    inLanguage:     locale,
    dateModified:   new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo:    { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(isValid(tx?.transaction_hash_url) && { sameAs: [tx.transaction_hash_url] }),
  };

  // ── Schema 4: FAQPage ─────────────────────────────────────
  const alertTypeAnswer = () => {
    if (tx?.alert_type === "Burn")
      return "A Burn transaction permanently removes tokens from circulation by sending them to an unspendable address, reducing the total supply of that cryptocurrency.";
    if (tx?.alert_type === "Mint")
      return "A Mint transaction creates new tokens and adds them to circulation, increasing the total supply of the cryptocurrency.";
    return "A Transfer alert indicates a large movement of cryptocurrency between wallets or exchanges, which may signal significant trading activity or market repositioning.";
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
          text:    "A crypto whale transaction is a large cryptocurrency movement — typically worth millions of dollars — made by addresses holding significant amounts. These are closely tracked as they can signal major market activity.",
        },
      },
      {
        "@type": "Question",
        name:    `What does a ${tx?.alert_type || "Transfer"} alert mean on the blockchain?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:    alertTypeAnswer(),
        },
      },
      {
        "@type": "Question",
        name:    "How is this whale transaction verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    `This transaction on the ${tx?.blockchain || "blockchain"} network is permanently recorded on-chain and can be independently verified on any public block explorer using the transaction hash.`,
        },
      },
    ],
  };

  return (
    <>
      {/* ✅ Structured Data */}
      {txSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(txSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ✅ Client component — initialData pass karo taake double fetch na ho */}
      <WhaleDetailsSlug initialData={tx} />
    </>
  );
}