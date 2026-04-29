import { fetchAllArticles } from '../../../../apis/page_news/events';
import { getDictionary } from '../../../../i18n/getDictionary';
import Link from 'next/link';
import Image from 'next/image';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

const BASE_URL          = "https://cryptonewstrend.com";
const SITE_NAME         = "CryptoNews Trend";
const TWITTER_HANDLE    = "@cryptonews90841";
const SUPPORTED_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh-CN"];

const LOCALE_TO_HREFLANG = {
  "en": "en", "ur": "ur", "ar": "ar", "de": "de",
  "fr": "fr", "ru": "ru", "zh-CN": "zh-Hans", "es": "es",
};

const OG_LOCALE_MAP = {
  "en": "en_US", "ur": "ur_PK", "ar": "ar_AR", "de": "de_DE",
  "fr": "fr_FR", "ru": "ru_RU", "zh-CN": "zh_CN", "es": "es_ES",
};

// ── UTILITY: SEO Friendly URLs ──────────────────────────────
const getCleanUrl = (locale, page = 1) => {
  const path = '/articles';
  const query = page > 1 ? `?page=${page}` : '';
  const base = locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
  return `${base}${query}`;
};

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { page = 1 } = await searchParams || {};
  
  const title = `Latest Crypto Articles & Blockchain Insights (Page ${page}) | ${SITE_NAME}`;
  const description = "Explore expert blockchain analysis, DeFi guides, and market insights. Read the latest crypto education articles on CryptoNews Trend.";
  const canonicalUrl = getCleanUrl(locale, page);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[LOCALE_TO_HREFLANG[lang] || lang] = getCleanUrl(lang, page);
    return acc;
  }, { "x-default": getCleanUrl('en', page) });

  return {
    title,
    description,
    keywords: "crypto articles, blockchain insights, defi guides, bitcoin analysis, ethereum news, crypto education, altcoin market news",
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      type: "website",
      images: [{
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Articles Listing`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
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

// ── Page Component ───────────────────────────────────────────
export default async function ArticlesPage({ params, searchParams }) {
  const { locale } = await params;
  const { page = 1, category = null } = await searchParams || {};

  const [articlesRes, dict] = await Promise.all([
    fetchAllArticles(locale, Number(page), category),
    getDictionary(locale),
  ]);

  const articles = articlesRes?.data || [];
  const hasNext = articlesRes?.has_next || false;
  const canonicalUrl = getCleanUrl(locale, page);

  // ✅ Schema Markup
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": `Latest Crypto News and Articles - Page ${page}`,
    "description": "A collection of in-depth crypto analysis and blockchain guides.",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": articles.length,
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": locale === 'en' 
  ? `${BASE_URL}/articles/${article?.slug}` 
  : `${BASE_URL}/${locale}/articles/${article?.slug}`,
        "name": article?.title,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": getCleanUrl(locale) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-16">
          
          <header className="mb-12">
            <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-6" aria-label="Breadcrumb">
              <Link href={locale === 'en' ? '/' : `/${locale}/`} className="opacity-60 hover:opacity-100">Home</Link>
              <span className="text-slate-300">/</span>
              <span className="bg-indigo-50 px-3 py-1 rounded-full">Articles Listing</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
              Blockchain <span className="text-indigo-600">&</span> Analysis
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Deep dives into DeFi protocols, Bitcoin market trends, and educational guides for the modern investor.
            </p>
          </header>

          {articles.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-slate-400 font-black uppercase tracking-tighter text-2xl">No insights found yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article?.slug} article={article} locale={locale} />
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          <nav className="flex items-center justify-between mt-16 pt-10 border-t border-slate-100" aria-label="Pagination">
            {Number(page) > 1 && (
              <Link
                href={getCleanUrl(locale, Number(page) - 1).replace(BASE_URL, '')}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                rel="prev"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Previous Page
              </Link>
            )}
            {hasNext && (
              <Link
                href={getCleanUrl(locale, Number(page) + 1).replace(BASE_URL, '')}
                className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all ml-auto"
                rel="next"
              >
                Next Insights <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </nav>
        </div>
      </main>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}

function ArticleCard({ article, locale }) {
  const articleLink = locale === 'en' 
  ? `/articles/${article?.slug}` 
  : `/${locale}/articles/${article?.slug}`;
  
  return (
    <article className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:border-indigo-100 transition-all duration-500">
      <Link href={articleLink} className="absolute inset-0 z-10" aria-label={article?.title} />
      
      {article?.main_image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={article.main_image}
            alt={article?.title || "Blockchain Analysis"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="flex flex-col p-7 md:p-8 flex-1">
        <div className="flex items-center gap-3 mb-4">
           {article?.category && (
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg">
              {article.category}
            </span>
          )}
          <time className="text-[10px] text-slate-400 font-bold uppercase tracking-widest" dateTime={article?.date}>
            {article?.date}
          </time>
        </div>

        <h2 className="text-slate-900 font-black text-xl md:text-2xl leading-[1.1] mb-4 group-hover:text-indigo-600 transition-colors">
          {article?.title}
        </h2>
        
        <p className="text-slate-500 text-sm md:text-base line-clamp-3 font-medium leading-relaxed mb-6">
          {article?.description}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-widest">
          Full Analysis <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </article>
  );
}