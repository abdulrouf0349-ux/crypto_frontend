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
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'fr', 'de', 'ar', 'zh-CN'];

// ✅ 1. PAGE-LEVEL METADATA (layout.js wali override karegi yahan se)
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const alternateLanguages = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}`;
    return acc;
  }, {});

  return {
    // layout.js ke title template se milkar banega: "Latest Crypto News | CryptoNews"
    title: dict.seo?.title || "Latest Crypto News | Global Updates",
    description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends, blockchain updates, and market events from around the world.",

    // ✅ Hreflang — Google ko batata hai ke ye page kaun si languages mein available hai
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: alternateLanguages,
    },

    // ✅ Open Graph — Homepage ke liye specific
    openGraph: {
      title: dict.seo?.title || "Latest Crypto News | Global Updates",
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends and market events.",
      url: `${BASE_URL}/${locale}`,
      siteName: "CryptoNews",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "CryptoNews Homepage",
        },
      ],
      locale: locale,
      type: "website",
    },

    // ✅ Twitter Card
    twitter: {
      card: "summary_large_image",
      title: dict.seo?.title || "Latest Crypto News",
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

// ✅ 2. MAIN PAGE COMPONENT
export default async function Page({ params }) {
  const { locale = 'en' } = await params;
  const dict = await getDictionary(locale);

  // ✅ Schema 1: NewsMediaOrganization — Google News mein rank karne ke liye
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "CryptoNews",
    "url": `${BASE_URL}/${locale}`,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 200,
      "height": 60,
    },
    "sameAs": [
      "https://twitter.com/cryptonewstrend",
      "https://facebook.com/cryptonewstrend",
      "https://t.me/cryptonewstrend",
    ],
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@cryptonewstrend.com",
    },
  };

  // ✅ Schema 2: WebSite — Google Sitelinks Search Box ke liye
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CryptoNews",
    "url": `${BASE_URL}/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ✅ Schema 3: BreadcrumbList — Homepage breadcrumb


  return (
    <>
      {/* ✅ Structured Data Scripts — Google rich results ke liye */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <Banner />
      <News_TypeButtonServer dict={dict} locale={locale} />

      <div className="sm:px-6 lg:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<Loading />}>
              <SliderSection locale={locale} />
            </Suspense>
            <Suspense fallback={<div className="animate-pulse h-80 bg-slate-100 rounded-xl" />}>
              <MainNews locale={locale} dict={dict} />
            </Suspense>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            <DonateBanner locale={locale} dict={dict} />
            <div className="max-sm:hidden mb-20">
              <Suspense fallback={<div className="animate-pulse h-40 bg-slate-100 rounded-xl" />}>
                <TopNews locale={locale} dict={dict} />
              </Suspense>
            </div>
            <Suspense fallback={<div className="animate-pulse h-40 bg-slate-100 rounded-xl" />}>
              <EventNews locale={locale} dict={dict} />
            </Suspense>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <Suspense fallback={<div className="animate-pulse h-60 bg-slate-50 rounded-3xl mt-10" />}>
          <ArticlefirstPage locale={locale} dict={dict}/>
        </Suspense>
      </div>
      <MobileSupportButton dict={dict} />
<CoinAnalysisFloat locale={locale} />
    </>
  );
}