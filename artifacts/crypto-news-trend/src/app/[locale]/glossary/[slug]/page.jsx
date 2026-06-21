

export const dynamicParams = true;

import Script from "next/script";
import { fetchCoinDetail } from "../../../../lib/api/glosssary";
import GlossaryDetail from "./GlossartDetail";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";

const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const LOCALE_TO_HREFLANG = {
  en: "en",
  ur: "ur",
  ar: "ar",
  de: "de",
  fr: "fr",
  ru: "ru",
  "zh-CN": "zh-Hans",
  es: "es",
};

const OG_LOCALE_MAP = {
  en: "en_US",
  ur: "ur_PK",
  ar: "ar_AR",
  de: "de_DE",
  fr: "fr_FR",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
  es: "es_ES",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Canonical URL builder — English has no locale prefix */
function buildCanonical(locale, slug) {
  return locale === "en"
    ? `${BASE_URL}/glossary/${slug}`
    : `${BASE_URL}/${locale}/glossary/${slug}`;
}

/**
 * Produces a clean, ≤160-char meta description.
 * Priority: coin.description → coin.short_description → generated fallback
 */
function buildDescription(coin, name, symbol) {
  const raw =
    coin?.description ||
    coin?.short_description ||
    `${name} (${symbol}) crypto glossary — definition, use cases, technical overview and market data on CryptoNews Trend.`;

  const clean = raw.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;

  const cut = clean.lastIndexOf(" ", 157);
  return (cut > 0 ? clean.slice(0, cut) : clean.slice(0, 157)) + "…";
}

/**
 * Single source of truth for all meta fields derived from coin data.
 */
function buildCoinMeta(
  coin,
  slug,
  locale
) {
  const name = coin?.name || "Coin";
  const symbol = (coin?.symbol || "").toUpperCase();
  const description = buildDescription(coin, name, symbol);
  const image =
    coin?.icon_url ||
    coin?.image ||
    coin?.logo ||
    `${BASE_URL}/crypto-glossary.png`;
  const canonicalUrl = buildCanonical(locale, slug);
  const updatedAt = coin?.updated_at || new Date().toISOString();
  const publishedAt = coin?.created_at || coin?.published_at || updatedAt;
  const price = coin?.price || coin?.current_price || null;
  const marketCap = coin?.market_cap || null;
  const uuid = coin?.uuid || coin?.id || slug;

  return {
    name,
    symbol,
    description,
    image,
    canonicalUrl,
    updatedAt,
    publishedAt,
    price,
    marketCap,
    uuid,
  };
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
} )
{
  const { locale, slug } = await params;
  

  let coin= null;
  try {
    const res = await fetchCoinDetail(slug, locale);
    coin = res?.data || res || null;
  } catch (_) {}

  if (!coin) {
  return {
    metadataBase: new URL(BASE_URL),
    title: "Crypto Glossary | CryptoNews Trend",
    description: "Cryptocurrency glossary and blockchain definitions.",
  };
}

  const {
    name,
    symbol,
    description,
    image,
    canonicalUrl,
    updatedAt,
    publishedAt,
  } = buildCoinMeta(coin, slug, locale);

  // hreflang alternate links — every supported locale + x-default
  const alternateLanguages = SUPPORTED_LOCALES.reduce(
    (acc, lang) => {
      acc[LOCALE_TO_HREFLANG[lang] || lang] = buildCanonical(lang, slug);
      return acc;
    },
    {}
  );
  alternateLanguages["x-default"] = buildCanonical("en", slug);

  // Google 2026: title should be ≤60 chars, contain primary keyword near start
  const pageTitle = `${name} (${symbol}) – Crypto Glossary | ${SITE_NAME}`;

  return {
    // ── Core ────────────────────────────────────────────────────────────────
    title: pageTitle,
    description,
    keywords: [
      `${name} crypto`,
      `${symbol} cryptocurrency`,
      `what is ${name}`,
      `${name} definition`,
      `${symbol} glossary`,
      "crypto glossary",
      "cryptocurrency explained",
    ].join(", "),

    // ── Canonical & hreflang ────────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // ── Robots ──────────────────────────────────────────────────────────────
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

    // ── Open Graph ──────────────────────────────────────────────────────────
    openGraph: {
      title: `${name} (${symbol}) | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [`${BASE_URL}/about-us`],
      section: "Cryptocurrency Glossary",
      tags: [name, symbol, "crypto", "blockchain", "cryptocurrency"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${name} (${symbol}) cryptocurrency logo and overview`,
          type: "image/jpeg",
        },
      ],
    },

    // ── Twitter / X Card ────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: `${name} (${symbol}) – Crypto Glossary`,
      description,
      images: [
        {
          url: image,
          alt: `${name} cryptocurrency`,
        },
      ],
      site: "@cryptonews90841",   // ← apna handle daal dein
      creator: "@cryptonews90841",
    },

    // ── Verification (agar setup nahi to ye lines hata dein) ─────────────
    // verification: {
    //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
    //   yandex: "YOUR_YANDEX_TOKEN",
    // },
  };
}

// ─── JSON-LD Schema Builder ───────────────────────────────────────────────────
function buildSchema(
  coin,
  meta,
  locale,
  slug
) {
  const {
    name,
    symbol,
    description,
    image,
    canonicalUrl,
    updatedAt,
    publishedAt,
    price,
    marketCap,
    uuid,
  } = meta;

  const glossaryListUrl =
    locale === "en"
      ? `${BASE_URL}/glossary`
      : `${BASE_URL}/${locale}/glossary`;

  const homeUrl =
    locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // ── WebPage ────────────────────────────────────────────────────────
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${name} (${symbol}) – Crypto Glossary`,
        description,
        inLanguage: locale,
        isPartOf: { "@id": `${BASE_URL}#website` },
        datePublished: publishedAt,
        dateModified: updatedAt,
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
        potentialAction: {
          "@type": "ReadAction",
          target: canonicalUrl,
        },
      },

      // ── Website ────────────────────────────────────────────────────────
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
        name: SITE_NAME,
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://twitter.com/cryptonews90841", // ← update karen
        ],
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
            name: "Crypto Glossary",
            item: glossaryListUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${name} (${symbol})`,
            item: canonicalUrl,
          },
        ],
      },

      // ── FinancialProduct (stronger than generic Thing for crypto) ──────
      {
        "@type": "FinancialProduct",
        "@id": `${canonicalUrl}#coin`,
        sameAs: coin.website
 ? [coin.website]
 : undefined,
        name,
        alternateName: symbol,
        description,
        image: {
          "@type": "ImageObject",
          url: image,
          width: 200,
          height: 200,
          caption: `${name} (${symbol}) logo`,
        },
        identifier: uuid,
        url: canonicalUrl,
        ...(price && {
          offers: {
            "@type": "Offer",
            price: String(price),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }),
        ...(marketCap && {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Market Cap (USD)",
            value: String(marketCap),
          },
        }),
        mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
        dateModified: updatedAt,
      },

      // ── Article (helps Google Discover) ────────────────────────────────
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: `What is ${name} (${symbol})? Complete Crypto Guide`,
        description,
        
        image: {
          "@type": "ImageObject",
          url: image,
          width: 1200,
          height: 630,
        },
        datePublished: publishedAt,
        dateModified: updatedAt,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
        },
        publisher: { "@id": `${BASE_URL}#organization` },
        mainEntityOfPage: { "@id": `${canonicalUrl}#coin` },
        articleSection: "Cryptocurrency Glossary",
        inLanguage: locale,
        keywords: `${name}, ${symbol}, cryptocurrency, crypto glossary, blockchain`,
...(coin.description && {
  wordCount: coin.description.split(/\s+/).length,
}),        isAccessibleForFree: true,
      },
    ],
  };
}

// ─── Page Server Component ────────────────────────────────────────────────────
export default async function GlossaryDetailPage({
  params,
})
 {
  const { slug, locale } = await params;

  let coinResponse = null;
  try {
    coinResponse = await fetchCoinDetail(slug, locale);
  } catch (error) {
    console.error("Server-side coin fetch error:", error);
  }

  const coin = coinResponse?.data || coinResponse || null;

  if (!coin) {
    return <GlossaryDetail coinResponse={null} locale={locale} />;
  }

  const meta = buildCoinMeta(coin, slug, locale);
  const schema = buildSchema(coin, meta, locale, slug);

  return (
    <>
    <Script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
  __html: JSON.stringify(schema).replace(
   /</g,
   "\\u003c"
  )
 }}
/>
      <GlossaryDetail coinResponse={coinResponse} locale={locale} />
    </>
  );
}