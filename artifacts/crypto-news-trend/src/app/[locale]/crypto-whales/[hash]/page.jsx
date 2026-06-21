// app/[locale]/crypto-whales/[hash]/page.jsx
// ============================================================
// FIXES APPLIED (from SEO audit):
//  1. Render webPageSchema, organizationSchema, websiteSchema ✅
//  2. Heading hierarchy: Amount is now <h2> in WhaleDetail     ✅
//  3. Related internal links added in WhaleDetail              ✅
//  4. @type changed from NewsArticle → Article (correct type)  ✅
//  5. .whale-summary class added in WhaleDetail for Speakable  ✅
//  6. seoTitle fixed — no duplicate coin/blockchain keyword    ✅
//  7. Canonical correct                                        ✅
//  8. openGraph.article.modifiedTime already present           ✅
//  9. generateStaticParams added for SSG                       ✅
// 10. MonetaryAmount schema inside Article                     ✅
// 11. Thin content: sr-only rich paragraph added              ✅
// 12. getAlertDetailsByHash uses revalidate:false (permanent)  ✅
// ============================================================

import { notFound }  from "next/navigation";
import WhaleDetail   from "@/pages/WhaleDetail";
import Script from "next/script";

// ─── Constants ──────────────────────────────────────────────
const SITE_URL      = "https://cryptonewstrend.com";
const SITE_NAME     = "CryptoNewsTrend";
const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];
const BASE_URL      = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

// ─── Helpers ────────────────────────────────────────────────
const toApiLocale = (locale) => (locale === "zh" ? "zh-cn" : locale);

/** Canonical URL — English has no locale prefix */
const buildCanonical = (locale, hash) =>
  locale === "en"
    ? `${SITE_URL}/crypto-whales/${hash}`
    : `${SITE_URL}/${locale}/crypto-whales/${hash}`;

/** hreflang map for all supported locales */
const buildHreflang = (hash) =>
  Object.fromEntries([
    ...VALID_LOCALES.map((loc) => [
      loc === "zh" ? "zh-Hans" : loc,
      buildCanonical(loc, hash),
    ]),
    ["x-default", buildCanonical("en", hash)],
  ]);

/** Safe string truncation — avoids cutting mid-word */
const truncate = (str = "", max = 160) => {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).replace(/\s\S*$/, "") + "…";
};

/** Locale-aware OG locale string */
const ogLocale = (locale) => {
  const map = {
    en: "en_US", ur: "ur_PK", es: "es_ES",
    ru: "ru_RU", fr: "fr_FR", de: "de_DE",
    ar: "ar_SA", zh: "zh_CN",
  };
  return map[locale] ?? "en_US";
};

// ─── Data Fetcher ────────────────────────────────────────────
// FIX #12: revalidate:false — whale transactions are immutable,
// permanent cache is correct. Tags allow on-demand revalidation.
async function fetchWhaleByHash(hash, locale) {
  try {
    const apiLocale = toApiLocale(locale);
    const res = await fetch(
      `${BASE_URL}/api/get_whales_slug/${apiLocale}/${hash}/`,
      {
        next: {
          revalidate: false,                              // permanent — tx never changes
          tags: [`${apiLocale}-crypto-whales-${hash}`],  // on-demand revalidation tag
        },
      }
    );

    const result = await res.json();

    if (res.status === 404)  return { data: null, notFound: true };
    if (res.ok && result.status === "success") return result.data;

    console.error("[WhaleByHash] API Error:", result.message);
    return null;
  } catch (err) {
    console.error("[WhaleByHash Error]:", err);
    return null;
  }
}

// ─── SSG: generateStaticParams ───────────────────────────────
// FIX #9: Enables static generation at build time.
// Fetches recent whale hashes for all locales to pre-render.
// Pages not in this list are generated on-demand (ISR fallback).
export async function generateStaticParams() {
  try {
    // Fetch recent hashes from the listing API (en locale)
    const res = await fetch(
      `${BASE_URL}/api/get_whales/?locale=en&limit=50`,
      { next: { revalidate: 3600 } } // rebuild list hourly
    );
    const result = await res.json();
    if (!result?.data?.length) return [];

    const hashes = result.data.map((item) => item.transaction_hash || item.hash).filter(Boolean);

    // Generate params for all locales × all recent hashes
    const params = [];
    for (const locale of VALID_LOCALES) {
      for (const hash of hashes) {
        params.push({ locale, hash });
      }
    }
    return params;
  } catch {
    // If API fails at build time, return empty — pages generate on-demand
    return [];
  }
}

// ─── generateMetadata — Google 2026 compliant ───────────────
export async function generateMetadata({ params }) {
  const { locale: rawLocale, hash } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  const tx = await fetchWhaleByHash(hash, locale);

  // ── 404 fallback metadata ─────────────────────────────────
  if (!tx || tx.notFound) {
    return {
      title:       "Whale Transaction Not Found",
      description: "This crypto whale transaction could not be found. Browse live whale alerts on CryptoNewsTrend.",
      robots:      { index: false, follow: false },
    };
  }

  // ── Derived fields ────────────────────────────────────────
  const translation  = tx.translations?.[toApiLocale(locale)] ?? "";
  const rawSummary   = translation || tx.summary || tx.alert_text || "";
  const summary      = truncate(rawSummary, 160);
  const canonical    = buildCanonical(locale, hash);
  const blockchain   = tx.blockchain   || "Crypto";
  const amountFull   = tx.amount_full  || tx.amount || "";
  const coin         = tx.symbol       || tx.coin   || "";
  const fromEntity   = tx.from_owner   || tx.from   || "Unknown Wallet";
  const toEntity     = tx.to_owner     || tx.to     || "Unknown Wallet";
  const publishedAt  = tx.timestamp_utc || tx.date_added || new Date().toISOString();

  // FIX #6: seoTitle — avoid duplicate coin/blockchain keyword.
  // Old: `${blockchain} Whale Alert: ${amountFull} ${coin} Transfer`
  // If blockchain="BTC" and coin="BTC" → "BTC Whale Alert: 1000 BTC BTC Transfer" ❌
  // New: coin shown only when it differs from blockchain label
  const coinSuffix  = coin && coin.toUpperCase() !== blockchain.toUpperCase() ? ` ${coin}` : "";
  const seoTitle    = `${amountFull}${coinSuffix} ${blockchain} Whale Alert — ${new Date(publishedAt).getFullYear()}`;

  // ── OG image — use tx image or fallback OG ────────────────
  const ogImage = tx.image_url || `${SITE_URL}/og-whale-tracker.png`;

  return {
    title:       seoTitle,
    description: summary || `Track this ${blockchain} whale transaction of ${amountFull} from ${fromEntity} to ${toEntity}. Real-time on-chain data on CryptoNewsTrend.`,
    keywords: [
      `${coin || blockchain} whale alert`,
      `${blockchain} whale transaction`,
      `${amountFull} ${coin || blockchain} transfer`,
      "crypto whale tracker",
      "on-chain whale data",
      `${fromEntity} wallet`,
      `${toEntity} wallet`,
      "blockchain whale alert 2026",
    ],
    alternates: {
      canonical,
      languages: buildHreflang(hash),
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
      type:        "article",
      url:         canonical,
      title:       seoTitle,
      description: summary,
      locale:      ogLocale(locale),
      siteName:    SITE_NAME,
      images: [
        {
          url:    ogImage,
          width:  1200,
          height: 630,
          alt:    `${blockchain} Whale Alert: ${amountFull} Transfer`,
        },
      ],
      article: {
        publishedTime: publishedAt,
        modifiedTime:  publishedAt,
        section:       "Crypto Whale Alerts",
        tags:          [coin, blockchain, "whale alert", "on-chain"].filter(Boolean),
      },
    },
    twitter: {
      card:        "summary_large_image",
      title:       seoTitle,
      description: summary,
      images:      [ogImage],
    },
    authors:   [{ name: SITE_NAME, url: SITE_URL }],
    creator:   SITE_NAME,
    publisher: SITE_NAME,
    category:  "finance",
  };
}

// ─── Page Component ─────────────────────────────────────────
export default async function WhaleDetailPage({ params }) {
  const { locale: rawLocale, hash } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  const tx = await fetchWhaleByHash(hash, locale);
  if (!tx || tx.notFound) notFound();

  // ── Derived fields for JSON-LD ────────────────────────────
  const translation  = tx.translations?.[toApiLocale(locale)] ?? "";
  const rawSummary   = translation || tx.summary || tx.alert_text || "";
  const blockchain   = tx.blockchain  || "Crypto";
  const amountFull   = tx.amount_full || tx.amount || "";
  const coin         = tx.symbol      || tx.coin   || "";
  const fromEntity   = tx.sender?.owner  || tx.from_owner || tx.from || "Unknown Wallet";
  const toEntity     = tx.receiver?.owner || tx.to_owner  || tx.to  || "Unknown Wallet";
  const publishedAt  = tx.timestamp_utc || tx.date_added || new Date().toISOString();
  const canonical    = buildCanonical(locale, hash);
  const ogImage      = tx.image_url || `${SITE_URL}/og-whale-tracker.png`;
  const amountUsd    = tx.receiver?.amount_usd || tx.sender?.amount_usd || "";

  // FIX #6: same dedup logic as generateMetadata
  const coinSuffix   = coin && coin.toUpperCase() !== blockchain.toUpperCase() ? ` ${coin}` : "";
  const seoTitle     = `${amountFull}${coinSuffix} ${blockchain} Whale Alert — ${new Date(publishedAt).getFullYear()}`;

  // ── FIX #1 + #4: WebPage schema (was created but never rendered) ─
  const webPageSchema = {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    "@id":        `${canonical}#webpage`,
    url:          canonical,
    name:         seoTitle,
    description:  truncate(rawSummary, 300),
    inLanguage:   locale,
    datePublished: publishedAt,
    dateModified:  publishedAt,
    isPartOf: { "@id": `${SITE_URL}#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url:     ogImage,
    },
  };

  // ── FIX #1: Organization schema (was created but never rendered) ─
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${SITE_URL}#organization`,
    name:       SITE_NAME,
    url:        SITE_URL,
    logo: {
      "@type": "ImageObject",
      url:     `${SITE_URL}/logo.png`,
    },
  };

  // ── FIX #1: WebSite schema (was created but never rendered) ─
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${SITE_URL}#website`,
    url:        SITE_URL,
    name:       SITE_NAME,
    speakable: {
      "@type":      "SpeakableSpecification",
      cssSelector:  [".whale-summary"],   // FIX #5: WhaleDetail now has this class
    },
  };

  // ── FIX #4: Article (not NewsArticle — tx is data, not editorial) ──
  // Article is more appropriate; NewsArticle requires editorial content.
  // Added MonetaryAmount (FIX #10) in the about field.
  const articleSchema = {
    "@context":          "https://schema.org",
    "@type":             "Article",
    "@id":               `${canonical}#article`,
    headline:            seoTitle,
    description:         truncate(rawSummary, 300),
    articleBody:         rawSummary,
    url:                 canonical,
    datePublished:       publishedAt,
    dateModified:        publishedAt,
    inLanguage:          locale,
    isAccessibleForFree: true,
    image: {
      "@type":  "ImageObject",
      url:      ogImage,
      width:    "1200",
      height:   "630",
    },
    author: {
      "@type": "Organization",
      "@id":   `${SITE_URL}#organization`,
      name:    SITE_NAME,
      url:     SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id":   `${SITE_URL}#organization`,
      name:    SITE_NAME,
      url:     SITE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${SITE_URL}/logo.png`,
        width:    "200",
        height:   "60",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":   `${canonical}#webpage`,
    },
    keywords:       `${coin || blockchain}, ${blockchain}, whale alert, crypto transaction, on-chain data`,
    articleSection: "Crypto Whale Alerts",
    // FIX #10: MonetaryAmount entity for better entity understanding
    about: [
      {
        "@type": "Thing",
        name:    `${blockchain} Whale Transaction`,
      },
      ...(amountUsd
        ? [{
            "@type":    "MonetaryAmount",
            currency:   "USD",
            value:      amountUsd.replace(/[^0-9.]/g, ""),
            name:       `${amountFull} transfer value`,
          }]
        : []),
    ],
  };

  // ── BreadcrumbList ───────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      {
        "@type":  "ListItem",
        position: 1,
        name:     "Home",
        item:     locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
      },
      {
        "@type":  "ListItem",
        position: 2,
        name:     "Crypto Whale Tracker",
        item:     locale === "en"
          ? `${SITE_URL}/crypto-whales`
          : `${SITE_URL}/${locale}/crypto-whales`,
      },
      {
        "@type":  "ListItem",
        position: 3,
        name:     `${blockchain} Whale Alert: ${amountFull}`,
        item:     canonical,
      },
    ],
  };

  // ── FAQPage ───────────────────────────────────────────────
  const faqSchema = {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:    `What is this ${blockchain} whale transaction?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:    rawSummary ||
            `A large ${blockchain} transfer of ${amountFull} ${coin} was detected from ${fromEntity} to ${toEntity}. Track all crypto whale movements on CryptoNewsTrend.`,
        },
      },
      {
        "@type": "Question",
        name:    `Who sent this ${coin || blockchain} whale transaction?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:    `This whale transaction was sent from ${fromEntity} to ${toEntity} on the ${blockchain} blockchain. Large transfers like this are tracked in real time on CryptoNewsTrend.`,
        },
      },
      {
        "@type": "Question",
        name:    `How do I track ${coin || blockchain} whale movements?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:    `CryptoNewsTrend tracks all major ${blockchain} whale transactions in real time. Visit our Whale Tracker page for live on-chain alerts updated every 60 seconds.`,
        },
      },
    ],
  };

  return (
    <>
      {/* ── FIX #1: WebPage schema — now rendered ────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* ── FIX #1: Organization schema — now rendered ───────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* ── FIX #1: WebSite schema — now rendered ────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ── FIX #4: Article schema (was NewsArticle) ─────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── BreadcrumbList ───────────────────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── FAQPage ──────────────────────────────────────────────── */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/*
        ── H1: one per page, sr-only, matches <title> tag ──────────
        FIX #2: WhaleDetail's amount div is now <h2> so heading
        hierarchy is correct: H1 (hidden, SEO) → H2 (visible amount).
        Tailwind sr-only: position:absolute; width:1px; height:1px;
        padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0);
        white-space:nowrap; border-width:0;
      */}
      <h1 className="sr-only">{seoTitle}</h1>

      {/*
        ── FIX #11: Rich server-rendered paragraph for thin content ─
        Hidden from UI but fully crawlable by Google.
        Adds 60–80 words of unique, entity-rich text per page.
        This is the single highest-impact long-tail indexing fix.
      */}
      <div className="sr-only" aria-hidden="true">
        A whale transaction involving {amountFull}{coinSuffix} was detected on the{" "}
        {blockchain} blockchain. Funds moved from {fromEntity} to {toEntity} at{" "}
        {publishedAt}. {amountUsd && `The estimated value of this transfer is ${amountUsd}.`}{" "}
        {rawSummary && rawSummary}{" "}
        This large on-chain transfer is monitored by CryptoNewsTrend&apos;s real-time whale
        tracking system. Track all {blockchain} whale alerts and large crypto transactions
        at CryptoNewsTrend.
      </div>

      {/* ── Original client component — UI UNCHANGED ─────────────── */}
      <WhaleDetail tx={tx} locale={locale} />
    </>
  );
}