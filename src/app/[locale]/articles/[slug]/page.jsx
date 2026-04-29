import { getDictionary } from "../../../../../i18n/getDictionary";
import ArticleSlugClient from "./ArticleSlugClient";
import { getArticleBySlug, fetchAllArticles } from "../../../../../apis/page_news/events";
import MobileSupportButton from "../../../../../components/Right_side/MobileSupportButton";
import CoinAnalysisFloat from "../../../../../components/Data/CoinAnalysisFloat";

export const dynamicParams = true;
export const revalidate = 43200; // 12 ghante baad refresh (Performance + Freshness)

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend";
const TWITTER_HANDLE    = "@cryptonews90841";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// ── UTILITY: SEO URLs ──────────────────────────────
const getCleanArticleUrl = (locale, slug) => {
  const path = `/articles/${slug}`;
  return locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
};

function toISODate(val) {
  if (!val) return new Date().toISOString();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale).catch(() => null);

  if (!article) {
    return {
      title: `Article Not Found | ${SITE_NAME}`,
      robots: { index: false },
    };
  }

  const title = `${article.title} | ${SITE_NAME}`;
  const description = article.meta_description 
    ? article.meta_description.slice(0, 160).trim() 
    : `${article.title}. Learn more about ${article.category || 'cryptocurrency'} insights and analysis at ${SITE_NAME}.`;

  const image = article.main_image || `${BASE_URL}/og-image.png`;
  const canonicalUrl = getCleanArticleUrl(locale, slug);
  const publishedTime = toISODate(article.created_at);

  // Multilingual SEO (Hreflang)
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[LOCALE_TO_HREFLANG[lang] || lang] = getCleanArticleUrl(lang, slug);
    return acc;
  }, { "x-default": getCleanArticleUrl('en', slug) });

  return {
    title,
    description,
    keywords: `${article.category || 'crypto'}, blockchain trends, ${article.title.split(' ').slice(0, 5).join(', ')}, ${SITE_NAME}`,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      locale: locale === 'ur' ? 'ur_PK' : (locale === 'en' ? 'en_US' : locale),
      type: "article",
      publishedTime,
      authors: [article.author || SITE_NAME],
      section: article.category || "Blockchain",
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ── generateStaticParams ────────────────────────────────────────
export async function generateStaticParams() {
  const params = [];
  // Basic locales ko build time pe handle karte hain optimization ke liye
  const subset = ["en", "ur"]; 
  for (const locale of subset) {
    try {
      const result = await fetchAllArticles(locale, 1);
      if (result?.success && result.data) {
        result.data.slice(0, 10).forEach(item => {
          if (item.slug) params.push({ locale, slug: item.slug });
        });
      }
    } catch (e) { console.error("Static Param Error", e); }
  }
  return params;
}

// ── Page Component ────────────────────────────────────────────
export default async function ArticleSlugPage({ params }) {
  const { slug, locale } = await params;

  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, locale),
    getDictionary(locale).catch(() => ({})),
  ]);

  if (!article) return <div className="text-center py-32 font-black text-2xl uppercase">Article not found.</div>;

  const canonicalUrl  = getCleanArticleUrl(locale, slug);
  const publishedTime = toISODate(article.created_at);
  const image         = article.main_image || `${BASE_URL}/og-image.png`;
  
  // ✅ 1. NewsArticle Schema (Google News ke liye BEST)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.meta_description || article.title,
    "image": [image],
    "datePublished": publishedTime,
    "dateModified": publishedTime, 
    "author": {
      "@type": "Person",
      "name": article.author || "Talha Ishtiaq",
      "url": `${BASE_URL}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // ✅ 2. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": locale === 'en' ? `${BASE_URL}/articles` : `${BASE_URL}/${locale}/articles` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ArticleSlugClient
        initialData={article}
        locale={locale}
        slug={slug}
        dict={dict}
        canonicalUrl={canonicalUrl}
        publishedTime={publishedTime}
      />
      
      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} /> 
    </>
  );
}