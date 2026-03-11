// app/[locale]/article/[slug]/page.jsx  →  SERVER COMPONENT
import { getDictionary } from "../../../../../i18n/getDictionary";
import ArticleSlugClient from "./ArticleSlugClient";
import { getArticleBySlug } from "../../../../../apis/page_news/events";  
export const dynamicParams = true;
export const revalidate = false;
import { fetchAllArticles } from "../../../../../apis/page_news/events";
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const DJANGO_URL        = "http://46.62.244.169";
const SITE_NAME         = "CryptoNewsTrend";
const TWITTER_HANDLE    = "@cryptonews90841";
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-cn"];

// ─────────────────────────────────────────────
// API — Article fetch
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// HELPER — safe ISO date
// ─────────────────────────────────────────────
function toISODate(val) {
  if (!val) return new Date().toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// ─────────────────────────────────────────────
// 1. generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, locale),
    getDictionary(locale).catch(() => ({})),
  ]);

  if (!article) {
    return {
      title:       `Article Not Found | ${SITE_NAME}`,
      description: "This article could not be found.",
      robots:      { index: false },
    };
  }

  const title       = article.title;
  const description = article.meta_description
    ? article.meta_description.slice(0, 160).trim()
    : `Read ${article.title} on ${SITE_NAME} — your trusted source for crypto news and blockchain insights.`;

  const image        = article.main_image || `${BASE_URL}/og-image.png`;
  const canonicalUrl = `${BASE_URL}/${locale}/articles/${slug}`;
  const publishedTime = toISODate(article.created_at);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/articles/${slug}`;
    return acc;
  }, {});

  return {
    title,
    description,
    keywords: `${article.category}, cryptocurrency, blockchain, bitcoin, ethereum, crypto news, ${SITE_NAME}`,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url:           canonicalUrl,
      siteName:      SITE_NAME,
      images: [{
        url:    image,
        width:  1200,
        height: 630,
        alt:    title,
      }],
      locale,
      type:          "article",
      publishedTime,
      modifiedTime:  publishedTime,
      authors:       [article.author || "CryptoNewsTrend Editorial"],
      section:       article.category || "Cryptocurrency",
    },
    twitter: {
      card:        "summary_large_image",
      site:        TWITTER_HANDLE,
      creator:     TWITTER_HANDLE,
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
        "max-video-preview": -1,
      },
    },
  };
}


export async function generateStaticParams() {
  const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-cn', 'es'];
  const params = [];

  for (const locale of LOCALES) {
    let page = 1;

    for (page = 1; page <= 3; page++) {
      try {
        const result = await fetchAllArticles(locale, page);

        if (!result.success) break;

        result.data?.forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });

        // Agle page nahi hai toh loop tod do
        if (!result.has_next) break;

      } catch { break; }
    }
  }

  console.log(`✅ Articles Pre-built: ${params.length} pages`);
  return params;
}
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function ArticleSlugPage({ params }) {
  const { slug, locale } = await params;

  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, locale),
    getDictionary(locale).catch(() => ({})),
  ]);

  const canonicalUrl  = `${BASE_URL}/${locale}/articles/${slug}`;
  const publishedTime = toISODate(article?.created_at);
  const image         = article?.main_image || `${BASE_URL}/og-image.png`;
  const authorName    = article?.author || "CryptoNewsTrend Editorial";
  const wordCount     = article?.content
    ? article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    : 0;

  // ── Schema 1: Article ─────────────────────────────────────
  const articleSchema = article ? {
    "@context":   "https://schema.org",
    "@type":      "Article",
    headline:      article.title,
    description:   article.meta_description?.slice(0, 160) || "",
    image: {
      "@type": "ImageObject",
      url:      image,
      width:    1200,
      height:   630,
    },
    url:           canonicalUrl,
    datePublished: publishedTime,
    dateModified:  publishedTime,
    inLanguage:    locale,
    wordCount,
    articleSection: article.category || "Cryptocurrency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":    canonicalUrl,
    },
    author: {
      "@type": "Person",
      name:     authorName,
      url:      `${BASE_URL}/`,
    },
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: {
        "@type":  "ImageObject",
        url:      `${BASE_URL}/logo.png`,
        width:    200,
        height:   60,
      },
    },
    speakable: {
      "@type":      "SpeakableSpecification",
      cssSelector:  ["h1", "article p:first-of-type"],
    },
    keywords: `${article.category}, cryptocurrency, blockchain, bitcoin`,
  } : null;

  // ── Schema 2: BreadcrumbList ──────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${BASE_URL}/${locale}/article` },
      { "@type": "ListItem", position: 3, name: article?.title || slug, item: canonicalUrl },
    ],
  };

  // ── Schema 3: WebPage ─────────────────────────────────────
  const webPageSchema = {
    "@context":    "https://schema.org",
    "@type":       "WebPage",
    name:           article?.title || slug,
    description:    article?.meta_description?.slice(0, 160) || "",
    url:            canonicalUrl,
    inLanguage:     locale,
    datePublished:  publishedTime,
    dateModified:   publishedTime,
    publisher: {
      "@type": "Organization",
      name:     SITE_NAME,
      url:      BASE_URL,
    },
  };

  return (
    <>
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <ArticleSlugClient
        initialData={article}
        locale={locale}
        slug={slug}
        dict={dict}
        canonicalUrl={canonicalUrl}
        publishedTime={publishedTime}
      />
    </>
  );
}