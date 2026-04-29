import { FiArrowUpRight, FiClock, FiGlobe } from 'react-icons/fi';
import TopNews from '../../../../components/Right_side/top_news';
import DonateBanner from '../../../../components/Right_side/banner';
import Page_NewsData from '../../../../apis/page_news/page_newsData';
import getNewsById from '../../../../apis/page_news/news_by_id';
import ShareButton from '../../../../components/other-shorts/shared_button';
import { getDictionary } from "../../../../i18n/getDictionary";
import Image from 'next/image';
import IcoSidebar from '../../../../components/Right_side/ico_page';
import { fetchAllIcoProjects } from '../../../../apis/page_news/events';
import Link from 'next/link';
import { notFound } from 'next/navigation'
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

export const dynamicParams = true;
export const revalidate = 3600; // Update every hour for news freshness

// ─────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────
const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const TWITTER_HANDLE = "@cryptonews90841"; 
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN", "ru"];

const HREFLANG_MAP = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

const getCleanUrl = (locale, slug) => {
  return locale === 'en' ? `${BASE_URL}/${slug}` : `${BASE_URL}/${locale}/${slug}`;
};

function toISODate(dateValue) {
  if (!dateValue) return new Date().toISOString();
  const parsed = new Date(dateValue);
  return !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
}

// ─────────────────────────────────────────────
// 1. GENERATE METADATA
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const [articleResponse, dict] = await Promise.all([
    getNewsById(locale, slug),
    getDictionary(locale),
  ]);

  const article = articleResponse?.data;
  if (!article) return { title: "Article Not Found | CryptoNewsTrend" };

  const title = article.title || dict?.seo?.title || SITE_NAME;
  const description = article.description?.slice(0, 160).replace(/\n/g, ' ').trim() || "";
  const canonicalUrl = getCleanUrl(locale, slug);
  const image = article.image || `${BASE_URL}/og-image.png`;

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[HREFLANG_MAP[lang] || lang] = getCleanUrl(lang, slug);
    return acc;
  }, {});
  alternateLanguages['x-default'] = getCleanUrl('en', slug);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternateLanguages },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale,
      type: "article",
      publishedTime: toISODate(article.time),
      authors: [article.author || "CryptoNewsTrend Editorial"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

// ─────────────────────────────────────────────
// 2. PAGE COMPONENT
// ─────────────────────────────────────────────
export default async function DiscriptionPage({ params }) {
  const { slug, locale } = await params;
  const [articleResponse, newsdataResponse, dict] = await Promise.all([
    getNewsById(locale, slug),
    Page_NewsData(locale, 2),
    getDictionary(locale),
  ]);

  const article = articleResponse?.data;
  if (!article) return notFound();

  const icoDataResponse = await fetchAllIcoProjects(locale);
  const canonicalUrl = getCleanUrl(locale, slug);
  const publishedTime = toISODate(article.time);

  // Advanced NewsArticle Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "headline": article.title,
    "image": [article.image || `${BASE_URL}/og-image.png`],
    "datePublished": publishedTime,
    "dateModified": publishedTime,
    "author": { "@type": "Person", "name": article.author || "CryptoNewsTrend Editorial", "url": BASE_URL },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` }
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": article.title, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="min-h-screen bg-white dark:bg-slate-900 selection:bg-indigo-100">
        <header className="pt-10 md:pt-16 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
            <nav className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-6">
              <Link href={locale === 'en' ? '/' : `/${locale}/`} className="hover:underline">{dict.header.news}</Link>
              <span className="text-slate-300">/</span>
              <span className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                {article.domains || 'Market Update'}
              </span>
            </nav>

            <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl leading-tight font-black tracking-tight mb-8">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 py-4">
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Source</span>
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold text-sm">
                    <FiGlobe className="text-indigo-600" /> {SITE_NAME}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Published</span>
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold text-sm">
                    <FiClock className="text-indigo-600" />
                    <time dateTime={publishedTime}>{article.time}</time>
                  </div>
                </div>
              </div>
              <ShareButton title={article.title} url={canonicalUrl} image={article.image} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl mb-10">
                <Image 
                  src={article.image || "/images/placeholder.jpg"} 
                  alt={article.title} 
                  fill 
                  priority 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-300">
                {article.description?.split('\n').map((para, i) => (
                  para.trim() && (
                    <p key={i} className={`leading-relaxed mb-6 ${i === 0 ? "text-xl font-semibold text-slate-900 dark:text-white" : ""}`}>
                      {para}
                    </p>
                  )
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-10">
              <div className="sticky top-24 space-y-10">
                <DonateBanner locale={locale} dict={dict} />
                <TopNews serverData={newsdataResponse?.results || []} locale={locale} dict={dict} />
                <IcoSidebar icoData={icoDataResponse?.data} locale={locale} dict={dict} />
              </div>
            </aside>
          </div>
        </main>
      </article>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}