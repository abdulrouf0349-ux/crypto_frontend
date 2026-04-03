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
export const dynamicParams = true;
export const revalidate = false;
// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const TWITTER_HANDLE = "@cryptonews90841"; // ✅ FIX: Real handle
const SUPPORTED_LOCALES = ["en", "ur", "es", "fr", "de", "ar", "zh-CN"];

// ─────────────────────────────────────────────
// HELPER: Safe ISO date — Google News ke liye zaroori
// ─────────────────────────────────────────────
function toISODate(dateValue) {
  if (!dateValue) return new Date().toISOString();
  // Already ISO format
  if (typeof dateValue === 'string' && dateValue.includes('T')) return dateValue;
  // Try parsing
  const parsed = new Date(dateValue);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  // Fallback
  return new Date().toISOString();
}

// ─────────────────────────────────────────────
// 1. generateMetadata — Article-level SEO
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  const [articleResponse, dict] = await Promise.all([
    getNewsById(locale, slug),
    getDictionary(locale),
  ]);

  const article = articleResponse?.data;

  const title = article?.title || dict?.seo?.title || `${SITE_NAME} – Crypto News`;

  // ✅ FIX: meta = 160 chars, og = 200 chars
  const metaDescription = article?.description
    ? article.description.slice(0, 160).replace(/\n/g, ' ').trim()
    : dict?.seo?.description || "Stay updated with the latest cryptocurrency news and blockchain insights.";

  const ogDescription = article?.description
    ? article.description.slice(0, 200).replace(/\n/g, ' ').trim()
    : metaDescription;

  const image        = article?.image || `${BASE_URL}/og-image.png`;
  const canonicalUrl = `${BASE_URL}/${locale}/${slug}`;

  // ✅ FIX: Safe ISO date — "2 hours ago" Google reject karta hai
  const publishedTime = toISODate(article?.created_time ?? article?.publishedAt ?? article?.time);

const modifiedTime = toISODate(
  article?.updatedAt ?? article?.updated_time ?? article?.created_time ?? article?.time
);

  // ✅ Hreflang — sabhi locales ke liye
  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}/${slug}`;
    return acc;
  }, {});

  // ✅ Author name — URL nahi, actual name
  const authorName = article?.author || "CryptoNewsTrend Editorial";

  return {
    title,
    description: metaDescription,

    // ✅ Clean keywords
    keywords: `cryptocurrency, blockchain, bitcoin, ethereum, ${article?.domain || 'cryptonewstrend'}, crypto news, ${article?.category || 'digital assets'}`,

    // ✅ Canonical + Hreflang
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // ✅ Open Graph — Article type
    openGraph: {
      title,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: "article",
      publishedTime,
      modifiedTime,

      // ✅ FIX: authors = name string, not URL
      authors: [authorName],
      section: article?.category || "Cryptocurrency",

      article: {
        publishedTime,
        modifiedTime,
        authors: [authorName],
        tags: [
          "cryptocurrency",
          "blockchain",
          "bitcoin",
          "crypto news",
          article?.domains || "www.cryptonewstrend.com",
        ].filter(Boolean),
      },
    },

    // ✅ FIX: Real Twitter handle
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description: metaDescription,
      images: [image],
    },

    // ✅ Robots — full indexing with Google News flags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}


// app/[locale]/[slug]/page.jsx



export async function generateStaticParams() {
  const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];
  const params = [];

  for (const locale of LOCALES) {
    for (let page = 1; page <= 3; page++) {
      try {
        const res = await fetch(
          `https://crytponews.fun/api/getdata${locale === 'en' ? '' : '/' + locale}/?page=${page}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ news: 'all' }),
            cache: 'no-store', // ✅ build time pe fresh data
          }
        );
        const data = await res.json();

        // ✅ DEBUG — ek baar build karo, structure dekho
        if (locale === 'en' && page === 1) {
          console.log('🔍 Keys:', Object.keys(data));
          console.log('🔍 Sample:', JSON.stringify(data).slice(0, 400));
        }

        // ✅ Saare possible keys try karo
        const items = data?.data || data?.results || data?.news || data?.articles || [];

        items.forEach(item => {
          const slug = item?.slug || item?.title || item?.id;
          if (slug) params.push({ locale, slug: String(slug) });
        });

        const hasNext = data?.metadata?.has_next ?? data?.has_next ?? false;
        if (!hasNext) break;

      } catch(e) { 
        console.log('❌ Error:', e.message);
        break; 
      }
    }
  }

  console.log(`✅ Pre-built: ${params.length} pages`);
  return params;
}
// generateMetadata aur Page component same rehenge
// ─────────────────────────────────────────────
// 2. PAGE COMPONENT — Structured Data + UI
// ─────────────────────────────────────────────
export default async function DiscriptionPage({ params }) {
  const { slug, locale } = await params;

  const [articleResponse, newsdataResponse, dict] = await Promise.all([
    getNewsById(locale, slug),
    Page_NewsData(locale, 2),
    getDictionary(locale),
  ]);

  const icoData     = await fetchAllIcoProjects(locale);
  const icoData1    = icoData?.data;
  const article     = articleResponse?.data;
  const topNewsData = newsdataResponse?.results || [];

 if (!article) return notFound();

  const canonicalUrl   = `${BASE_URL}/${locale}/${slug}`;
  const authorName     = article?.author || "CryptoNewsTrend Editorial";

  // ✅ FIX: Safe ISO dates
  const publishedTime  = toISODate(article?.isoDate || article?.publishedAt || article?.time);
  const modifiedTime   = article?.updatedAt && article.updatedAt !== article?.time
    ? toISODate(article.updatedAt)
    : publishedTime;

  const description160 = article?.description
    ? article.description.slice(0, 160).replace(/\n/g, ' ').trim()
    : "";

  // ✅ wordCount for schema
  const wordCount = article?.description
    ? article.description.split(/\s+/).filter(Boolean).length
    : 0;

  // ─────────────────────────────────────────────
  // Schema 1: NewsArticle — Google News optimized
  // ─────────────────────────────────────────────
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article?.title,
    description: description160,
    image: {
      "@type": "ImageObject",
      url: article?.image || `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    inLanguage: locale,

    // ✅ FIX: Person type with real name
    author: {
      "@type": "Person",
      name: authorName,
      url: `${BASE_URL}/about`,
    },

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

    // ✅ NEW: articleSection — Google News category
    articleSection: article?.category || "Cryptocurrency",

    // ✅ NEW: wordCount — content quality signal
    wordCount,

    // ✅ NEW: speakable — Google News / voice search
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"],
    },

    // ✅ keywords
    keywords: `cryptocurrency, blockchain, bitcoin, ${article?.domain || 'crypto'}`,

    // ✅ isBasedOn — source credit
    ...(article?.link && {
      isBasedOn: {
        "@type": "NewsArticle",
        url: article.link,
        publisher: {
          "@type": "Organization",
          name: article?.domain || "Source",
        },
      },
    }),
  };

  // ─────────────────────────────────────────────
  // Schema 2: BreadcrumbList
  // ─────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
    
      {
        "@type": "ListItem",
        position: 2,
        name: article?.title,
        item: canonicalUrl,
      },
    ],
  };

  // ─────────────────────────────────────────────
  // Schema 3: WebPage
  // ─────────────────────────────────────────────
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: article?.title,
    description: description160,
    url: canonicalUrl,
    inLanguage: locale,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    breadcrumb: {
      "@id": `${canonicalUrl}#breadcrumb`,
    },
  };

  // ─────────────────────────────────────────────
  // Schema 4: Organization (site-level — Google Knowledge Panel)
  // ─────────────────────────────────────────────
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      `https://twitter.com/CryptoNewsTrend`,
      // Add more social links here
    ],
  };

  return (
    <>
      {/* ✅ All Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* ── UI — bilkul same, zero change ─────────────────────── */}
      <article className="min-h-screen bg-white font-sans selection:bg-indigo-100 overflow-x-hidden">

        {/* Premium Header */}
        <header className="bg-white pt-10 md:pt-16 pb-6 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 md:mb-8"
            >
              <Link href={`/${locale}/`} className="opacity-60 hover:cursor-pointer">{dict.header.news}</Link>
              <span className="text-slate-200">/</span>
              <span className="bg-indigo-50 px-3 py-1 rounded-full">{article?.domains || 'cryptonewstrend.com'}</span>
            </nav>

            <h1 className="text-slate-900 text-2xl md:text-5xl leading-tight md:leading-[1.1] font-black tracking-tight max-w-5xl mb-8 md:mb-10">
              {article?.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">{dict?.news_slug?.source}</span>
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <FiGlobe className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-bold">cryptonewstrend.com</span>
                  </div>
                </div>
                <div className="h-6 w-[1px] bg-slate-200" />
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">{dict?.news_slug?.published}</span>
                  <div className="flex items-center gap-1.5 text-slate-900">
                    <FiClock className="text-indigo-600 w-3 h-3 md:w-4 md:h-4" />
                    {/* ✅ <time> tag with ISO dateTime — Google date parsing */}
                    <time dateTime={publishedTime} className="text-xs md:text-sm font-bold">
                      {article?.time}
                    </time>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShareButton
                  title={article?.title}
                  url={canonicalUrl}
                  image={article?.image || "/images/bitcoin.jpg"}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* LEFT: Article Content */}
            <div className="lg:col-span-8 flex flex-col min-w-0">

              {/* Featured Image */}
              <figure className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl shadow-indigo-100/50 mb-8 md:mb-16 border border-slate-100">
                <Image
                  src={article?.image || "/images/bitcoin.jpg"}
                  alt={article?.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  unoptimized
                />
              </figure>

              {/* Article Body */}
              <div className="max-w-none">
                <div className="text-slate-800 text-[18px] md:text-[21px] leading-relaxed md:leading-[1.9] font-medium tracking-tight space-y-8 md:space-y-10">
                  {article?.description?.split('\n').map((para, index) => (
                    para.trim() && (
                      <p key={index} className="first-letter:text-4xl md:first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-2 md:first-letter:mr-3 first-letter:float-left">
                        {para}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Source Card */}
              {/* <div className="mt-10 group bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                  <div className="space-y-2">
                    <h3 className="text-slate-900 font-black text-lg md:text-xl tracking-tight">
                      {dict?.news_slug?.read_original}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium opacity-70 break-all md:truncate max-w-full md:max-w-md italic">
                      {article?.link}
                    </p>
                  </div>
                  <a
                    href={article?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-4 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4f39f6] transition-all shadow-lg active:scale-95"
                  >
                    {dict?.news_slug?.visit_source}
                    <FiArrowUpRight className="text-xl" />
                  </a>
                </div>
              </div> */}

            </div>

            {/* RIGHT: Sidebar */}
            <aside className="lg:col-span-4 mt-10 lg:mt-0" aria-label="Sidebar">
              <div className="lg:sticky lg:top-32 space-y-10">
                <DonateBanner locale={locale} dict={dict} />
                <div className="bg-slate-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-6 border border-slate-100 shadow-sm">
                  <TopNews serverData={topNewsData} locale={locale} dict={dict} />
                  <IcoSidebar icoData={icoData1} />
                </div>
              </div>
            </aside>

          </div>
        </main>
      </article>
    </>
  );
}