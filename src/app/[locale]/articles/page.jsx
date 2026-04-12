// app/[locale]/articles/page.jsx
// ✅ STATIC — 12 hour revalidate, full SEO

import { fetchAllArticles } from '../../../../apis/page_news/events';
import { getDictionary } from '../../../../i18n/getDictionary';
import Link from 'next/link';
import Image from 'next/image';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
// app/[locale]/articles/page.jsx

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend"; // ✅ FIX 2
const TWITTER_HANDLE    = "@cryptonews90841";

// ✅ FIX 4: ru add kiya
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

// ✅ FIX 5: zh-Hans correct hreflang
const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

// ✅ FIX 3: OG locale correct format
const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale }   = await params;
  const canonicalUrl = `${BASE_URL}/${locale}/articles`;

  // ✅ FIX 1: SITE_NAME mat lagao title mein — layout template auto lagaega
  const title       = "Crypto Articles | Blockchain Insights";
  const description = "Read the latest crypto articles, blockchain analysis, DeFi guides and expert insights on CryptoNews Trend.";

  // ✅ FIX 5+6: zh-Hans + x-default + ru
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = LOCALE_TO_HREFLANG[lang] || lang;
    acc[hreflang]  = `${BASE_URL}/${lang}/articles`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${BASE_URL}/en/articles`; // ✅ FIX 6

  return {
    title,       // ✅ layout: "Crypto Articles | Blockchain Insights | CryptoNews Trend"
    description,
    keywords: "crypto articles, blockchain insights, defi guides, bitcoin analysis, ethereum news, crypto education",

    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages, // ✅ zh-Hans, ru, x-default
    },

    openGraph: {
      title:       `${title} | ${SITE_NAME}`, // ✅ OG mein manually
      description,
      url:         canonicalUrl,
      siteName:    SITE_NAME,                          // ✅ FIX 2
      locale:      OG_LOCALE_MAP[locale] || "en_US",   // ✅ FIX 3
      alternateLocale: SUPPORTED_LOCALES               // ✅ FIX 7
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type:        "website",
      images: [{
        url:    `${BASE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    `${SITE_NAME} Crypto Articles`,
      }],
    },

    twitter: {
      card:        "summary_large_image",
      site:        TWITTER_HANDLE,
      creator:     TWITTER_HANDLE,
      title:       `${title} | ${SITE_NAME}`,
      description,
      images:      [`${BASE_URL}/og-image.png`],
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
// ✅ PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function ArticlesPage({ params, searchParams }) {
  const { locale }   = await params;
  const { page = 1, category = null } = await searchParams || {};

  const [articlesRes, dict] = await Promise.all([
    fetchAllArticles(locale, Number(page), category),
    getDictionary(locale),
  ]);

  const articles  = articlesRes?.data || [];
  const hasNext   = articlesRes?.has_next || false;
  const canonicalUrl = `${BASE_URL}/${locale}/articles`;

  // ✅ CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Crypto Articles | ${SITE_NAME}`,
    description: "Latest crypto articles and blockchain insights",
    url: canonicalUrl,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    // ✅ ItemList — saare articles listed
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}/${locale}/articles/${article?.slug}`,
        name: article?.title,
      })),
    },
  };

  // ✅ BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Articles", item: canonicalUrl },
    ],
  };

  return (
    <>
      {/* ✅ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-white font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-16">

          {/* ── Header ── */}
          <header className="mb-10 md:mb-14">
            <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-6">
              <Link href={`/${locale}/`} className="opacity-60 hover:opacity-100">Home</Link>
              <span className="text-slate-200">/</span>
              <span className="bg-indigo-50 px-3 py-1 rounded-full">Articles</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
              Crypto Articles
            </h1>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl">
              In-depth blockchain insights, DeFi guides, and expert crypto analysis.
            </p>
          </header>

          {/* ── Articles Grid ── */}
          {articles.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
              No articles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article?.slug}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
            {Number(page) > 1 && (
              <Link
                href={`/${locale}/articles?page=${Number(page) - 1}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-slate-100"
              >
                ← Previous
              </Link>
            )}
            {hasNext && (
              <Link
                href={`/${locale}/articles?page=${Number(page) + 1}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all ml-auto shadow-lg shadow-indigo-200"
              >
                Next →
              </Link>
            )}
          </div>

        </div>
      </main>
       <MobileSupportButton dict={dict} />
                <CoinAnalysisFloat locale={locale} />  
    </>
  );
}

// ─────────────────────────────────────────────
// ✅ Article Card Component
// ─────────────────────────────────────────────
function ArticleCard({ article, locale }) {
  return (

    <>
    <Link
      href={`/${locale}/articles/${article?.slug}`}
      className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      {article?.main_image && (
        <figure className="relative aspect-[16/9] w-full overflow-hidden bg-slate-50">
          <Image
            src={article.main_image}
            alt={article?.title || "Article"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </figure>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 md:p-6 flex-1">

        {/* Category */}
        {article?.category && (
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
            {article.category}
          </span>
        )}

        {/* Title */}
        <h2 className="text-slate-900 font-black text-base md:text-lg leading-snug tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {article?.title}
        </h2>

        {/* Description */}
        {article?.description && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          {article?.date && (
            <time
              dateTime={article.date}
              className="text-[11px] text-slate-400 font-bold uppercase tracking-widest"
            >
              {article.date}
            </time>
          )}
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-1 transition-transform">
            Read →
          </span>
        </div>

      </div>
    </Link>
   
    </>
    
  );
}