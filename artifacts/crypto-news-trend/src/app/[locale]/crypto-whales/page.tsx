// ============================================================
// page.tsx — Whale Tracker Page
// SEO: Google 2026 — Title, H1, Metadata, JSON-LD, Discover,
//       Breadcrumb, FAQ Schema, hreflang, Canonical, robots
// UI:  UNCHANGED — WhalesClientView renders identically
// FIXES:
//   1. Duplicate H1 removed (sr-only H1 removed; client H1 is canonical)
//   2. websiteSchema now rendered in JSON-LD scripts
//   3. hreflang fr fixed to /fr path
//   4. Breadcrumb home URL fixed for en locale
//   5. CollectionPage now has mainEntity linking to Dataset
//   6. Dataset now has @id
//   7. publishedTime removed from OpenGraph (unstable signal)
//   8. CollectionPage isPartOf now uses @id reference
// ============================================================

import type { Metadata } from "next";
import WhalesClientView from "@/pages/Whales";
import { fetchWhaleAlerts } from "@/lib/api/Crypto_whales";
import Script from "next/script";

// ─── Constants ──────────────────────────────────────────────
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cryptonewstrend.com";
const PAGE_PATH = "/whale-tracker";

// ─── Dynamic Metadata (locale-aware, Google 2026 compliant) ─
interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Crypto Whale Tracker — Live Whale Alerts & Large Transactions 2026",
    ur: "کریپٹو وہیل ٹریکر — لائیو وہیل الرٹس اور بڑی ٹرانزیکشنز",
    ar: "متتبع الحيتان — تنبيهات العملات المشفرة الكبيرة في الوقت الفعلي",
    es: "Rastreador de Ballenas Cripto — Alertas en Tiempo Real 2026",
    zh: "加密鲸鱼追踪器 — 实时大额交易预警 2026",
  };
  const descs: Record<string, string> = {
    en: "Monitor real-time crypto whale transactions. Track Bitcoin, Ethereum, and altcoin whale alerts, large wallet movements, and on-chain data — updated every 60 seconds. Best whale tracker 2026.",
    ur: "Bitcoin اور Ethereum کی بڑی ٹرانزیکشنز کو ریئل ٹائم میں ٹریک کریں۔ 2026 کا بہترین وہیل ٹریکر۔",
    ar: "تتبع معاملات الحيتان الكبيرة في العملات المشفرة في الوقت الفعلي. أفضل متتبع حيتان 2026.",
    es: "Rastreo de grandes transacciones cripto en tiempo real. El mejor rastreador de ballenas 2026.",
    zh: "实时追踪比特币、以太坊等大额加密货币鲸鱼交易，2026年最佳鲸鱼追踪器。",
  };

  const title       = titles[locale] ?? titles.en;
  const description = descs[locale]  ?? descs.en;

  // FIX 1: Canonical — en has no locale prefix
  const canonical =
    locale === "en"
      ? `${SITE_URL}${PAGE_PATH}`
      : `${SITE_URL}/${locale}${PAGE_PATH}`;

  return {
    title,
    description,

    alternates: {
      canonical,
      languages: {
        en:          `${SITE_URL}${PAGE_PATH}`,
        // FIX 2: fr now correctly points to /fr path (was pointing to en)
        fr:          `${SITE_URL}/fr${PAGE_PATH}`,
        ur:          `${SITE_URL}/ur${PAGE_PATH}`,
        ar:          `${SITE_URL}/ar${PAGE_PATH}`,
        es:          `${SITE_URL}/es${PAGE_PATH}`,
        zh:          `${SITE_URL}/zh${PAGE_PATH}`,
        "x-default": `${SITE_URL}${PAGE_PATH}`,
      },
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

    openGraph: {
      siteName: "CryptoNews Trend",
      type:     "website",
      url:      canonical,
      title,
      description,
      // FIX 3: publishedTime removed — it changed on every request, hurting Discover signals
      // modifiedTime: new Date().toISOString(),
      locale:
        locale === "ar" ? "ar_SA" : locale === "ur" ? "ur_PK" : "en_US",
      images: [
        {
          url:    `${SITE_URL}/og-whale-tracker.png`,
          width:  1200,
          height: 630,
          alt:    "Crypto Whale Tracker — Live Transaction Dashboard",
        },
      ],
    },

    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [`${SITE_URL}/og-whale-tracker.png`],
    },

    keywords: [
      "whale tracker",
      "crypto whale alerts",
      "large bitcoin transactions",
      "ethereum whale tracker",
      "on-chain whale monitoring",
      "blockchain large transfers 2026",
      "DeFi whale activity tracker",
      "real-time crypto tracker",
    ],
  };
}

// ─── Page Component ─────────────────────────────────────────
export default async function WhaleTrackerPage({ params }: PageProps) {
  const { locale } = await params;

  const result        = await fetchWhaleAlerts(1, locale);
  const initialWhales = result?.data || result || [];
  const totalPages    = result?.metadata?.total_pages || 1;

  const pageUrl =
    locale === "en"
      ? `${SITE_URL}${PAGE_PATH}`
      : `${SITE_URL}/${locale}${PAGE_PATH}`;

  // ── JSON-LD: Organization ─────────────────────────────────
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${SITE_URL}#organization`,
    name:       "CryptoNews Trend",
    url:        SITE_URL,
    logo: {
      "@type": "ImageObject",
      url:     `${SITE_URL}/logo.png`,
    },
  };

  // ── JSON-LD: WebSite ──────────────────────────────────────
  // FIX 4: websiteSchema now actually rendered below (was defined but never injected)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${SITE_URL}#website`,
    url:        SITE_URL,
    name:       "CryptoNews Trend",
  };

  // ── JSON-LD: Dataset ──────────────────────────────────────
  // FIX 5: Dataset now has @id so CollectionPage can reference it
  const datasetSchema = {
    "@context":          "https://schema.org",
    "@type":             "Dataset",
    // FIX 5a: Added @id
    "@id":               `${pageUrl}#dataset`,
    name:                "Real-Time Crypto Whale Transactions",
    description:
      "Live feed of large cryptocurrency transactions (whale alerts) across Bitcoin, Ethereum, and major altcoins. Data refreshes every 60 seconds.",
    url:                 pageUrl,
    temporalCoverage:    `${new Date().getFullYear()}/..`,
    license:             `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    keywords: [
      "crypto whale transactions",
      "bitcoin large transfers",
      "ethereum on-chain data",
      "blockchain whale alerts",
    ],
    creator: {
      "@type": "Organization",
      name:    "CryptoNews Trend",
      url:     SITE_URL,
    },
  };

  // ── JSON-LD: WebPage (CollectionPage) ─────────────────────
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type":    "CollectionPage",
    "@id":      pageUrl,
    url:        pageUrl,
    name:       "Crypto Whale Tracker — Live Whale Alerts & Large Transactions 2026",
    description:
      "Monitor real-time crypto whale transactions. Track Bitcoin, Ethereum, and altcoin whale alerts, large wallet movements, and on-chain data — updated every 60 seconds.",
    inLanguage: locale,
    // FIX 6: isPartOf now uses @id reference to WebSite node
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    // FIX 7: mainEntity linking CollectionPage → Dataset
    mainEntity: {
      "@type": "Dataset",
      "@id":   `${pageUrl}#dataset`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type":    "ListItem",
          position:   1,
          name:       "Home",
          // FIX 8: en locale home should be SITE_URL, not SITE_URL/en
          item:       locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
        },
        {
          "@type":    "ListItem",
          position:   2,
          name:       "Whale Tracker",
          item:       pageUrl,
        },
      ],
    },
    dateModified: new Date().toISOString(),
  };

  // ── JSON-LD: FAQ ──────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    "What is a crypto whale?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A crypto whale is an individual or entity that holds a very large amount of cryptocurrency — typically enough to influence market prices. Whale Tracker monitors these large wallets in real time.",
        },
      },
      {
        "@type": "Question",
        name:    "How often does Whale Tracker update?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Whale Tracker refreshes whale alert data every 60 seconds, giving you near real-time visibility into large crypto transactions on Bitcoin, Ethereum, and major altcoins.",
        },
      },
      {
        "@type": "Question",
        name:    "Which blockchains does Whale Tracker support?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Whale Tracker currently supports Bitcoin (BTC), Ethereum (ETH), BNB Chain, Solana, and all major ERC-20 tokens. Coverage is continuously expanding in 2026.",
        },
      },
    ],
  };

  return (
    <>
      {/* ── JSON-LD Structured Data ── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* FIX 4: websiteSchema is now rendered */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/*
        ── H1 NOTE ──────────────────────────────────────────
        FIX 1: sr-only H1 removed from here.
        The client component (WhalesClientView) already renders
        its own visible H1 via t("whales.title"). Two H1s on one
        page hurt SEO. The visible H1 in the client view is the
        canonical heading Google will read.
      */}

      {/* ── Client View — UI UNCHANGED ─────────────────── */}
      <WhalesClientView
        initialData={initialWhales}
        initialTotalPages={totalPages}
        locale={locale}
      />
    </>
  );
}