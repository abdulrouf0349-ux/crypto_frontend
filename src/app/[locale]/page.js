import React, { Suspense } from "react";
import Banner from "../../../components/short-components/banner";
import News_TypeButtonServer from "../../../components/short-components/news_btn";
import Loading from "../../../components/Data/loading";
import DonateBanner from "../../../components/Right_side/banner";
import TopNews from "../../../components/Right_side/top_news";
import EventNews from "../../../components/Right_side/event_news";
import { getDictionary } from "../../../i18n/getDictionary";
import SliderSection from "../../../components/Data/slider_server";
import MainNews from "../../../components/Data/main_news";
import ArticlefirstPage from "../../../components/Data/article_firstPage";
import MobileSupportButton from "../../../components/Right_side/MobileSupportButton";
import CoinAnalysisFloat from "../../../components/Data/CoinAnalysisFloat";

const BASE_URL = "https://cryptonewstrend.com";
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'fr', 'de', 'ar', 'ru', 'zh-CN'];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    const hreflang = lang === 'zh-CN' ? 'zh-Hans' : lang;
    // English is root, others are /lang
    acc[hreflang] = lang === 'en' ? `${BASE_URL}` : `${BASE_URL}/${lang}`;
    return acc;
  }, {});

  alternateLanguages["x-default"] = `${BASE_URL}`;
  const canonicalURL = locale === 'en' ? `${BASE_URL}` : `${BASE_URL}/${locale}`;
const pageTitle = dict.seo?.page_title || "Crypto News Today Real-Time Bitcoin, Altcoin & Market Analysis";
const pageDescription = dict.seo?.description || "Stay updated with CryptoNews Trend. Get real-time cryptocurrency news, Bitcoin price analysis, blockchain trends, and live market updates from the world's leading crypto source.";

return {
  title: pageTitle,
  description: pageDescription,
    alternates: {
      canonical: canonicalURL,
      languages: alternateLanguages,
    },
    other: {
      "googlebot-news": "index, follow",
      "rating": "General",
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${dict.seo?.title || pageTitle}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      url: canonicalURL,
      siteName: "CryptoNews Trend",
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: "CryptoNews Trend" }],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo?.title || "Latest Crypto News",
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function Page({ params }) {
  const { locale = 'en' } = await params;
  const dict = await getDictionary(locale);

  const currentUrl = locale === 'en' ? `${BASE_URL}` : `${BASE_URL}/${locale}`;
  const searchUrl = locale === 'en' ? `${BASE_URL}/search` : `${BASE_URL}/${locale}/search`;

  // Combined Schema for Performance
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "CryptoNews Trend",
      "url": currentUrl,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` },
      "sameAs": [
        "https://twitter.com/cryptonews90841",
        "https://facebook.com/cryptonewstrend",
        "https://t.me/cryptonewstrend"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "CryptoNews Trend",
      "url": currentUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${searchUrl}?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} 
      />
      
      {/* Visual H1 for SEO, hidden from UI but readable by Google */}
      <h1 className="sr-only">{dict.seo?.title || "Latest Cryptocurrency News and Trends"}</h1>
      
      <Banner />
      <News_TypeButtonServer dict={dict} locale={locale} />

      <main className="sm:px-6 lg:px-28 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<Loading />}>
              <SliderSection locale={locale} />
            </Suspense>
            <Suspense fallback={<div className="animate-pulse h-80 bg-slate-100 rounded-xl" />}>
              <MainNews locale={locale} dict={dict} />
            </Suspense>
          </div>

          <aside className="space-y-8">
            <DonateBanner locale={locale} dict={dict} />
            <div className="max-sm:hidden">
              <Suspense fallback={<div className="animate-pulse h-40 bg-slate-100 rounded-xl" />}>
                <TopNews locale={locale} dict={dict} />
              </Suspense>
            </div>
            <Suspense fallback={<div className="animate-pulse h-40 bg-slate-100 rounded-xl" />}>
              <EventNews locale={locale} dict={dict} />
            </Suspense>
          </aside>
        </div>

        <section className="mt-10">
          <Suspense fallback={<div className="animate-pulse h-60 bg-slate-50 rounded-3xl" />}>
            <ArticlefirstPage locale={locale} dict={dict}/>
          </Suspense>
        </section>
      </main>
      
      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}