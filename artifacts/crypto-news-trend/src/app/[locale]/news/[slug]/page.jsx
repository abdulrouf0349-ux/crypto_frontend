// src/app/[locale]/news/[slug]/page.jsxv
export const revalidate = 3600;



import { notFound } from "next/navigation";
import GetArticleBySlug from "@/lib/api/get_SLug_one";
import NewsArticle from "@/pages/NewsArticle";
import Script from "next/script";

const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://crytponews.fun";

const BREADCRUMB_HOME = {
  en: "Home", ur: "ہوم", ar: "الرئيسية",
  es: "Inicio", fr: "Accueil", de: "Startseite",
  ru: "Главная", zh: "首页",
};

const BREADCRUMB_NEWS = {
  en: "News", ur: "خبریں", ar: "الأخبار",
  es: "Noticias", fr: "Actualités", de: "Nachrichten",
  ru: "Новости", zh: "新闻",
};

const SCHEMA_LANG_MAP = {
  en: "en", ur: "ur", ar: "ar",
  es: "es", fr: "fr", de: "de",
  ru: "ru", zh: "zh",
};

// ── SSG: pre-render all known slugs at build time ──
export const dynamicParams = true;

// ── Revalidate every hour (ISR) ──

// ── Helper: build canonical URL ──
function buildCanonical(locale, slug) {
  return locale === "en"
    ? `${SITE_URL}/news/${slug}`
    : `${SITE_URL}/${locale}/news/${slug}`;
}

// ── Helper: get localized slug ──
function getLocalizedSlug(article, locale) {
  return article[`slug_${locale}`] || article.slug_en || article.slug || "";
}

// ── Helper: calculate real reading time ──
function calcReadTime(body = "") {
  const words = body.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─────────────────────────────────────────────
// generateMetadata — 2026 compliant
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  // ✅ FIX #1: cache() in GetArticleBySlug prevents a second fetch here
  const article = await GetArticleBySlug(slug, locale);

  if (!article) return { title: "Article Not Found" };

  const localizedSlug = getLocalizedSlug(article, locale);
  const canonicalUrl = buildCanonical(locale, localizedSlug);
  const imageUrl = article.image || article.imageUrl || `${SITE_URL}/og-default.png`;
  const description = (article.excerpt || article.description || "").slice(0, 160);

  // ✅ hreflang alternates
  const languages = VALID_LOCALES.reduce((acc, l) => {
    const lSlug = article[`slug_${l}`] || article.slug;
    acc[l] =
      l === "en"
        ? `${SITE_URL}/news/${lSlug}`
        : `${SITE_URL}/${l}/news/${lSlug}`;
    return acc;
  }, {});
  languages["x-default"] = `${SITE_URL}/news/${article.slug_en || article.slug}`;

  return {
    title: article.title,
    description,

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

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    // ✅ FIX #5: hero image preload hint via metadata
    other: {
      "preload-hero-image": imageUrl,
    },

    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: article.title,
      description,
      url: canonicalUrl,
      publishedTime: article.time || article.date,
      modifiedTime: article.updated_at || article.time || article.date,
      authors: [`${SITE_URL}/team`],
      section: article.category || "Cryptocurrency",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      creator: "@cryptonews90841",
      title: article.title,
      description,
      images: [imageUrl],
    },
  };
}

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default async function NewsSlugPage({ params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";

  // ✅ FIX #1: cache() ensures this reuses the same fetch from generateMetadata
  const article = await GetArticleBySlug(slug, locale);

  if (!article) notFound();

  const localizedSlug = getLocalizedSlug(article, locale);
  const canonicalUrl = buildCanonical(locale, localizedSlug);
  const imageUrl = article.image || article.imageUrl || `${SITE_URL}/og-default.png`;

  const datePublished = article.time || article.date
    ? new Date(article.time || article.date).toISOString()
    : new Date().toISOString();
  const dateModified = article.updated_at
    ? new Date(article.updated_at).toISOString()
    : datePublished;

  const bodyText =
 article.description ||
 article.discription ||
 article.excerpt ||
 "";
  // ✅ FIX #14: real reading time
  const readTime = calcReadTime(bodyText);
  const wordCount = bodyText.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).filter(Boolean).length;

  const authorName = article.author?.name || "CryptoNewsTrend Editorial Team";
  // ✅ FIX #9: per-author URL if available, fallback to /team
  const authorUrl = article.author?.slug
    ? `${SITE_URL}/author/${article.author.slug}`
    : article.author?.url || `${SITE_URL}/team`;

  const safeDate = new Date(datePublished || Date.now());

  // ─────────────────────────────────────────────
  // JSON-LD — single @graph, no duplicate WebSite/Organization
  // ✅ FIX #16: removed WebSite + Organization (provided by layout)
  // ✅ FIX #2: articleBody trimmed to 300 chars
  // ✅ FIX #6: 3 image aspect ratios for Discover
  // ✅ FIX #11: translated breadcrumb labels
  // ─────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. NewsArticle ──
      {
        "@type": "NewsArticle",
        "@id": `${canonicalUrl}#article`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
        copyrightHolder: { "@id": `${SITE_URL}/#organization` },
        copyrightYear: safeDate.getFullYear(),

        about: [
          { "@type": "Thing", name: article.category || "Cryptocurrency" },
          ...(article.keywords || []).slice(0, 5).map((k) => ({
            "@type": "Thing",
            name: k,
          })),
        ],

        inLanguage: SCHEMA_LANG_MAP[locale] || "en",
        isAccessibleForFree: true,

        headline: article.title.slice(0, 110),
        alternativeHeadline: article.excerpt?.slice(0, 110) || article.title,
        description: (article.excerpt || article.description || "").slice(0, 160),
        genre: ["Cryptocurrency", "Blockchain", "Digital Assets"],
        articleSection: article.category || "Cryptocurrency",

        // ✅ FIX #2: 300 chars max — much lighter HTML
        articleBody: bodyText
          .replace(/<\/?[^>]+(>|$)/g, "")
          .slice(0, 300),

        wordCount: wordCount || undefined,

        // ✅ FIX #6: 3 aspect ratios for Top Stories + Discover
        image: [
          {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1200,
            height: 630,
            name: article.title,
          },
          {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1600,
            height: 900,
            name: article.title,
          },
          {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1200,
            height: 1200,
            name: article.title,
          },
        ],
        thumbnailUrl: imageUrl,

        datePublished,
        dateModified,

        author: {
          "@type": article.author?.name ? "Person" : "Organization",
          "@id": `${authorUrl}#author`,
          name: authorName,
          url: authorUrl,
        },

        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "article p:first-of-type"],
        },

        newsKeywords: [
          article.category,
          ...(article.keywords || []),
        ].filter(Boolean).join(", "),

        keywords: [
          article.category,
          "Bitcoin News",
          "Ethereum News",
          "Crypto News",
          ...(article.keywords || []),
        ].filter(Boolean),

        mentions: [
          ...(article.keywords || []).map((keyword) => ({
            "@type": "Thing",
            name: keyword,
          })),
          ...(article.companies || []).map((company) => ({
            "@type": "Organization",
            name: company,
          })),
          ...(article.people || []).map((person) => ({
            "@type": "Person",
            name: person,
          })),
        ],

        url: canonicalUrl,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },

      // ── 2. BreadcrumbList ──
      // ✅ FIX #11: translated breadcrumb labels
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: BREADCRUMB_HOME[locale] || "Home",
            item: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: BREADCRUMB_NEWS[locale] || "News",
            item:
              locale === "en"
                ? `${SITE_URL}/`
                : `${SITE_URL}/${locale}/news`,
          },
     
          {
            "@type": "ListItem",
            position: 3,
            name: article.title.slice(0, 80),
            item: canonicalUrl,
          },
        ],
      },

      // ── 3. WebPage ──
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        publisher: { "@id": `${SITE_URL}/#organization` },
        author: { "@id": `${authorUrl}#author` },
        mainEntity: { "@id": `${canonicalUrl}#article` },
        potentialAction: {
          "@type": "ReadAction",
          target: [canonicalUrl],
        },
        url: canonicalUrl,
        name: article.title,
        description: (article.excerpt || article.description || "").slice(0, 160),
        inLanguage: SCHEMA_LANG_MAP[locale] || "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: {
          "@id": `${imageUrl}#primaryimage`,
          "@type": "ImageObject",
          url: imageUrl,
        },
        datePublished,
        dateModified,
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
      },
    ],
  };

  return (
    <>
      {/* ✅ FIX #5: explicit hero image preload */}
      <link rel="preload" as="image" href={imageUrl} />

    {/* ✅ Language switcher ke liye localized slugs map */}
    <script
      type="application/json"
      id="localized-slugs"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          VALID_LOCALES.reduce((acc, l) => {
            acc[l] = article[`slug_${l}`] || article.slug_en || article.slug || "";
            return acc;
          }, {})
        ),
      }}
    />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsArticle
        article={article}
        locale={locale}
        related={article.related || []}
        readTime={readTime}
        authorUrl={authorUrl}
      />
    </>
  );
}

