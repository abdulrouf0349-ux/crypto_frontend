// src/app/[locale]/layout.jsx
// ✅ Fix #3  — dateModified is now a static date (not new Date() on every request)
// ✅ Fix #4  — PriceTicker is dynamically imported (ssr:false) → improves LCP
// ✅ Fix #5  — BreadcrumbList added to @graph
// ✅ Fix #6  — OG image updated to 1600×900 for Google Discover
// ✅ Fix #7  — CollectionPage + BreadcrumbList in one clean @graph

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SupportUsFloat } from "@/components/SupportUsFloat";
import ClientTickerWrapper from '@/components/ClientTickerWrapper'
import Script from "next/script";


const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const TWITTER_HANDLE = "@cryptonews90841";

// ✅ Fix #3 — Static last-modified date. Update this when you do a site redesign
// or major content change. Never use new Date() here — it changes every request
// and confuses Google's crawl freshness signals.
const SITE_LAST_MODIFIED = "2026-06-16T00:00:00Z";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const RTL_LOCALES = ["ur", "ar"];

const OG_LOCALE_MAP = {
  en: "en_US",
  ur: "ur_PK",
  es: "es_ES",
  ru: "ru_RU",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_SA",
  zh: "zh_CN",
};

const LOCALE_META = {
  en: {
    title: "Crypto News Today, Bitcoin News, Ethereum News & Crypto Market Updates",
    description:
      "Latest crypto news today, Bitcoin news, Ethereum updates, crypto market analysis, whale tracking, blockchain trends, Web3 developments and breaking cryptocurrency news worldwide.",
  },
  ur: {
    title: "کرپٹو نیوز: بٹ کوائن، ایتھیریم اور مارکیٹ اپڈیٹ",
    description: "تازہ کرپٹو خبریں، بٹ کوائن قیمت، وہیل ٹریکنگ اور بلاک چین اپڈیٹس۔",
  },
  es: {
    title: "Noticias Crypto: Bitcoin, Ethereum y Mercado",
    description: "Últimas noticias de criptomonedas y análisis del mercado en tiempo real.",
  },
  ru: {
    title: "Крипто Новости: Биткоин, Эфириум и Рынок",
    description: "Последние новости криптовалют и анализ рынка в реальном времени.",
  },
  fr: {
    title: "Actualités Crypto: Bitcoin, Ethereum et Marché",
    description: "Dernières actualités crypto et analyses du marché en direct.",
  },
  de: {
    title: "Krypto Nachrichten: Bitcoin, Ethereum & Markt",
    description: "Aktuelle Krypto-News und Marktanalysen in Echtzeit.",
  },
  ar: {
    title: "أخبار العملات الرقمية: بيتكوين وإيثريوم والسوق",
    description: "أحدث أخبار العملات الرقمية وتحليل السوق المباشر.",
  },
  zh: {
    title: "加密货币新闻：比特币、以太坊与市场",
    description: "最新加密新闻与实时市场分析。",
  },
};

function buildUrl(locale, path = "") {
  const base = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
  return path ? `${base}/${path.replace(/^\/+/, "")}` : base;
}

function buildAlternates(path = "") {
  const langs = {};
  VALID_LOCALES.forEach((l) => {
    langs[l] = buildUrl(l, path);
  });
  langs["x-default"] = SITE_URL;
  return langs;
}

// ─────────────────────────────────────────────
// SEO METADATA GENERATOR
export async function generateMetadata({ params }) {
  const { locale } = await params;

  const localedata = VALID_LOCALES.includes(locale) ? locale : "en";

  const meta = LOCALE_META[localedata];
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: meta.description,
    applicationName: SITE_NAME,

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
      canonical: buildUrl(localedata),
      languages: buildAlternates(),
    },

    openGraph: {
      type: "website",
      url: buildUrl(localedata),
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      locale: OG_LOCALE_MAP[localedata],
      alternateLocale: VALID_LOCALES.filter((l) => l !== locale).map(
        (l) => OG_LOCALE_MAP[l]
      ),
      images: [
        {
          // ✅ Fix #6 — 1600×900 is the recommended size for Google Discover
          url: `${SITE_URL}/og-image.png`,
          width: 1600,
          height: 900,
          alt: `${SITE_NAME} — ${meta.title}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: meta.title,
      description: meta.description,
      images: [`${SITE_URL}/og-image.png`],
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SITE_NAME,
    },
  };
}

// ─────────────────────────────────────────────
// LOCALIZED STRUCTURED DATA
// ─────────────────────────────────────────────
function getStructuredData(locale) {
  const meta = LOCALE_META[locale];
  const dynamicLocalizedUrl = buildUrl(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. WebSite
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: locale,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // ── 2. NewsMediaOrganization
      {
        "@type": "NewsMediaOrganization",
        "@id": `${SITE_URL}/#organization`,
        description:
          "Global cryptocurrency news platform covering Bitcoin, Ethereum, altcoins, blockchain technology, Web3, DeFi and crypto market analysis.",
        name: SITE_NAME,
        founder: {
          "@id": `${SITE_URL}/#editorial-team`,
        },
        url: SITE_URL,
        foundingDate: "2025",
        award: "Trusted Cryptocurrency News Coverage",
        address: {
          "@type": "PostalAddress",
          addressCountry: "PK",
        },
        publishingPrinciples: `${SITE_URL}/editorial-policy`,
        correctionsPolicy: `${SITE_URL}/editorial-policy`,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Crypto Journalism",
        },
        ethicsPolicy: `${SITE_URL}/editorial-policy`,
        areaServed: "Worldwide",
        keywords: [
          "Bitcoin",
          "Ethereum",
          "Crypto News",
          "Blockchain",
          "Altcoins",
          "Web3",
          "DeFi",
        ],
        knowsAbout: [
          "Bitcoin",
          "Ethereum",
          "Cryptocurrency",
          "Blockchain Technology",
          "DeFi",
          "Crypto Market Analysis",
          "Web3",
        ],
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          width: 200,
          height: 60,
          caption: SITE_NAME,
        },
        image: {
          "@id": `${SITE_URL}/#logo`,
        },
        sameAs: [`https://x.com/cryptonewstrend`],
        contactPoint: {
          "@type": "ContactPoint",
          url: `${SITE_URL}/contact`,
          contactType: "editorial",
          availableLanguage: [
            "English",
            "Urdu",
            "Arabic",
            "Spanish",
            "French",
            "German",
            "Russian",
            "Chinese",
          ],
        },
      },

      // ── 3. Topic entity
      {
        "@type": "Thing",
        "@id": `${SITE_URL}/#topic`,
        name: "Cryptocurrency News",
        description: "Global cryptocurrency news coverage and market analysis",
      },

      // ── 4. Editorial team person
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#editorial-team`,
        name: "CryptoNewsTrend Editorial Team",
        url: `${SITE_URL}/about`,
        worksFor: {
          "@id": `${SITE_URL}/#organization`,
        },
      },

      // ── 5. CollectionPage
      {
        "@type": "CollectionPage",
        "@id": `${dynamicLocalizedUrl}/#webpage`,
        url: dynamicLocalizedUrl,
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/#organization`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".article-title"],
        },
        about: {
          "@id": `${SITE_URL}/#topic`,
        },
        // ✅ Fix #3 — Static date; not new Date() on every request
        dateModified: SITE_LAST_MODIFIED,
      },

      // ── 6. ✅ Fix #5 — BreadcrumbList for homepage
      {
        "@type": "BreadcrumbList",
        "@id": `${dynamicLocalizedUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: dynamicLocalizedUrl,
          },
        ],
      },
    ],
  };
}

// ─────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  const localedata = VALID_LOCALES.includes(locale) ? locale : "en";
  const isRtl = RTL_LOCALES.includes(localedata);

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d1117" />

        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredData(localedata)),
          }}
        />
      </head>

      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <header>
          {/* The crypto ticker is safely isolated here. 
            It won't block SSR/SSG compilation of your core news content!
          */}
          <ClientTickerWrapper />
        </header>
          <main className="flex-grow">{children}</main>
          <Footer />
          <SupportUsFloat />
        </div>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return VALID_LOCALES.map((locale) => ({ locale }));
}