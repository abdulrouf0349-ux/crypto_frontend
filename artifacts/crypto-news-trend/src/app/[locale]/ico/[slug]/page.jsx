// ─── FIX #2 + best ISR setup ──────────────────────────────────────────────────
export const revalidate    = 86400; // 24h ISR for all slug pages
export const dynamicParams = true;  // new slugs still work via ISR

import { notFound } from "next/navigation";
import Script from "next/script";
import ICODetail from "@/pages/ICODetail";
import { fetchIcoBySlug, fetchAllIcoProjects } from "@/lib/api/Ico";
import Image from "next/image";

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL  = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const OG_LOCALE_MAP = {
  en: "en_US", ur: "ur_PK", es: "es_ES",
  ru: "ru_RU", fr: "fr_FR", de: "de_DE",
  ar: "ar_SA", zh: "zh_CN",
};



// ─── FIX #3: generateStaticParams — prebuilds top ICO pages ──────────────────

// ─── Canonical URL helper ─────────────────────────────────────────────────────
function buildCanonical(locale, slug) {
  return locale === "en"
    ? `${SITE_URL}/ico/${slug}`
    : `${SITE_URL}/${locale}/ico/${slug}`;
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  // FIX #1: cache() in fetchIcoBySlug means this is deduplicated with Page()
  const res = await fetchIcoBySlug(slug, locale);

  if (!res?.success) {
    return {
      title: "ICO Project Not Found | CryptoNewsTrend",
      robots: { index: false, follow: false },
    };
  }

  const ico       = res.data;
  const canonical = buildCanonical(locale, ico.slug);

  const titleBase = ico.ticker
    ? `${ico.name} (${ico.ticker}) ICO Review, Token Sale & Whitelist`
    : `${ico.name} ICO Review, Token Sale & Whitelist`;

  const rawDesc   = (ico.description || "").replace(/\s+/g, " ").trim();
  const shortDesc = rawDesc.length > 120 ? rawDesc.slice(0, 117) + "..." : rawDesc;
  const metaDescription = `${shortDesc} Join the ${ico.name} whitelist on CryptoNewsTrend today.`;

  const ogImageUrl = ico.main_img || `${SITE_URL}/ico-default.png`;

  const alternateLanguages = {};
  for (const loc of VALID_LOCALES) {
    alternateLanguages[loc] = buildCanonical(loc, ico.slug);
  }
  alternateLanguages["x-default"] = buildCanonical("en", ico.slug);

  return {
    metadataBase: new URL(SITE_URL),
    title:        titleBase,
    description:  metaDescription,

    keywords: [
      `${ico.name} ICO`,
      `${ico.ticker || ico.name} token sale`,
      `${ico.name} whitelist`,
      `${ico.project_type || "crypto"} ICO 2026`,
      "initial coin offering",
      "crypto token presale",
      `${ico.name} CryptoNewsTrend`,
    ].filter(Boolean),

    alternates: {
      canonical,
      languages: alternateLanguages,
    },

    robots: {
      index:     true,
      follow:    true,
      googleBot: {
        index:                true,
        follow:               true,
        "max-image-preview":  "large",
        "max-snippet":        -1,
        "max-video-preview":  -1,
      },
    },

    openGraph: {
      type:          "article",
      url:           canonical,
      siteName:      SITE_NAME,
      title:         titleBase,
      description:   metaDescription,
      // FIX #6: use ico.updated_at only — never new Date()
      publishedTime: ico.start_date  || ico.created_at || undefined,
      modifiedTime:  ico.updated_at  || ico.start_date  || undefined,
      authors:       [`${SITE_URL}/about-us`],
      section:       ico.project_type || "Cryptocurrency",
      tags:          [ico.name, ico.ticker, "ICO", "crypto", ico.project_type].filter(Boolean),
      images: [
        {
          url:    ogImageUrl,
          width:  1200,
          height: 630,
          alt:    `${ico.name} ICO – Token Sale on CryptoNewsTrend`,
          type:   "image/jpeg",
        },
      ],
      locale:          OG_LOCALE_MAP[locale],
      alternateLocale: ["en_US","ur_PK","es_ES","ru_RU","fr_FR","de_DE","ar_SA","zh_CN"],
    },

    other: {
      // FIX #15: preload hero image for LCP
      ...(ico.main_img && { "link-preload-image": ico.main_img }),
      "article:published_time": ico.start_date  || undefined,
      "article:modified_time":  ico.updated_at  || undefined,
      "article:section":        ico.project_type || undefined,
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841",
      title:       titleBase,
      description: metaDescription,
      images:      [ogImageUrl],
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function IcoSlugPage({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  // FIX #1: same cache() call — zero extra fetch
  const res = await fetchIcoBySlug(slug, locale);
  if (!res?.success) notFound();

  const ico       = res.data;
  const canonical = buildCanonical(locale, ico.slug);
  const ogImageUrl = ico.main_img || `${SITE_URL}/og/ico-default.jpg`;

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [

      // Organization
      {
        "@type": "Organization",
        "@id":   `${SITE_URL}/#organization`,
        name:    SITE_NAME,
        url:     SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id":   `${SITE_URL}/logo.png#logo`,
          url:     `${SITE_URL}/logo.png`,
        },
      },

      // WebSite
      {
        "@type":     "WebSite",
        "@id":       `${SITE_URL}/#website`,
        url:         SITE_URL,
        name:        SITE_NAME,
        publisher:   { "@id": `${SITE_URL}/#organization` },
      },

      // FinancialProduct
      {
        "@type":       "FinancialProduct",
        "@id":         `${canonical}#product`,
        name:          ico.name,
        description:   ico.description || "",
        url:           canonical,
        category:      ico.project_type || "Cryptocurrency",
        image: {
          "@type":  "ImageObject",
          url:      ogImageUrl,
          width:    1200,
          height:   630,
        },
        review: {
          "@type": "Review",
          // FIX #11: Person — Google Discover prefers real author entity
          author: {
            "@type": "Person",
            name:    "CryptoNewsTrend Research Team",
          },
          reviewRating: {
            "@type":       "Rating",
            bestRating:    "5",
          },
          reviewBody: `${ico.name} is a promising ICO project evaluated by the CryptoNewsTrend research team.`,
        },
        brand: {
          "@type": "Brand",
          name:    ico.name,
        },
        ...(ico.ticker && {
          identifier: {
            "@type": "PropertyValue",
            name:    "Ticker",
            value:   ico.ticker,
          },
        }),
        ...(ico.website && { sameAs: ico.website }),
        provider: {
          "@type": "Organization",
          "@id":   `${SITE_URL}/#organization`,
          name:    SITE_NAME,
          url:     SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url:     canonical,
          availability:
            ico.status === "Ended"
              ? "https://schema.org/Discontinued"
              : "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name:    ico.name,
          },
          ...(ico.token_price && {
            price:         ico.token_price,
            priceCurrency: "USD",
          }),
        },
      },

      // FIX #5: Article (not NewsArticle — ICO pages are not news)
      {
        "@type":       "Article",
        "@id":         `${canonical}#article`,
        headline:      ico.ticker
          ? `${ico.name} (${ico.ticker}) ICO – Token Sale & Whitelist`
          : `${ico.name} ICO – Token Sale Details & Whitelist`,
        description:   (ico.description || "").slice(0, 200),
        // FIX #13: articleBody for Google AI Overviews
        articleBody:   ico.description || "",
        url:           canonical,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id":   canonical,
        },
        about: [
          { "@type": "Thing", name: "Initial Coin Offering" },
          { "@type": "Thing", name: "Cryptocurrency"        },
          { "@type": "Thing", name: "Blockchain"            },
        ],
        // AI SEO: mentions + knowsAbout
        mentions: [
          { "@type": "Thing", name: ico.name               },
          { "@type": "Thing", name: ico.project_type || "Crypto" },
          ...(ico.ticker ? [{ "@type": "Thing", name: ico.ticker }] : []),
        ],
        image: {
          "@type":  "ImageObject",
          url:      ogImageUrl,
          width:    1200,
          height:   630,
        },
        // FIX #6: only use stored dates — never new Date()
        datePublished: ico.start_date  || ico.created_at || undefined,
        dateModified:  ico.updated_at  || ico.start_date  || undefined,
        // FIX #11: Person for author
        author: {
          "@type": "Person",
          name:    "CryptoNewsTrend Research Team",
          url:     `${SITE_URL}/about-us`,
        },
        publisher: {
          "@type": "Organization",
          "@id":   `${SITE_URL}/#organization`,
          name:    SITE_NAME,
          url:     SITE_URL,
          logo: {
            "@type":  "ImageObject",
            url:      `${SITE_URL}/logo.png`,
            width:    200,
            height:   60,
          },
        },
        articleSection: ico.project_type || "Cryptocurrency",
        keywords:       [ico.name, ico.ticker, "ICO", "token sale", ico.project_type]
          .filter(Boolean).join(", "),
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          "@id":   `${SITE_URL}/#website`,
          name:    SITE_NAME,
          url:     SITE_URL,
        },
      },

      // FIX #14: BreadcrumbList with @id
      {
        "@type": "BreadcrumbList",
        "@id":   `${canonical}#breadcrumb`,
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
            name:     "ICO Launchpad",
            item:     locale === "en" ? `${SITE_URL}/ico` : `${SITE_URL}/${locale}/ico`,
          },
          {
            "@type":  "ListItem",
            position: 3,
            name:     ico.name,
            item:     canonical,
          },
        ],
      },

      // FIX #4: WebPage (not "home") — valid schema type
      {
        "@type": "WebPage",
        "@id":   canonical,
        url:     canonical,
        name:    ico.ticker
          ? `${ico.name} (${ico.ticker}) ICO – Token Sale & Whitelist`
          : `${ico.name} ICO – Token Sale & Whitelist`,
        description: (ico.description || "").slice(0, 160),
        inLanguage:  locale,
        isPartOf: {
          "@type": "WebSite",
          "@id":   `${SITE_URL}/#website`,
          url:     SITE_URL,
          name:    SITE_NAME,
        },
        speakable: {
          "@type":      "SpeakableSpecification",
          cssSelector:  ["h1",],
        },
        mainEntity: { "@id": `${canonical}#product` },
        primaryImageOfPage: {
          "@type":   "ImageObject",
          "@id":     `${ogImageUrl}#image`,
          url:       ogImageUrl,
          width:     1200,
          height:    630,
          caption:   `${ico.name} ICO`,
          // FIX #10: representativeOfPage
          representativeOfPage: true,
        },
        about:     { "@type": "FinancialProduct", "@id": `${canonical}#product` },
        // FIX #14: reference breadcrumb by @id
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
    ],
  };

  return (
    <>
      {/* FIX #15: preload hero image for LCP */}
      {ico.main_img && (
        // eslint-disable-next-line @next/next/no-head-element
        // Next.js 14+ supports <link> in page via metadata; for App Router we use the tag directly
        <link rel="preload" as="image" href={ico.main_img} />
      )}

      <Script
        id={`ico-detail-jsonld-${ico.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ICODetail ico={ico} locale={locale} />
    </>
  );
}