// app/[locale]/layout.js

import "../globals.css";
import { Header } from "../../../components/common-components/header";
import Footer from "../../../components/common-components/footer";
import { Inter } from "next/font/google";
import Script from 'next/script';
import { getRssMetadata } from "@/context/rss-links";
import { getDictionary } from "../../../i18n/getDictionary";
import ClientLayout from "@/context/LocaleContext";

const inter = Inter({
  variable: "--font-inter",
  weight: ["100","200","300","400","500","600","700","800","900"],
  subsets: ["latin"],
});

const BASE_URL  = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews Trend";

export const SUPPORTED_LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];
const RTL_LOCALES = ['ar', 'ur'];

const LOCALE_TO_HREFLANG = {
  'en':    'en',
  'ur':    'ur',
  'ar':    'ar',
  'de':    'de',
  'fr':    'fr',
  'ru':    'ru',
  'zh-CN': 'zh-Hans',
  'es':    'es',
};

const OG_LOCALE_MAP = {
  'en':    'en_US',
  'ur':    'ur_PK',
  'ar':    'ar_AR',
  'de':    'de_DE',
  'fr':    'fr_FR',
  'ru':    'ru_RU',
  'zh-CN': 'zh_CN',
  'es':    'es_ES',
};

const buildAlternateLanguages = (path = "") => {
  const finalPath = path && !path.startsWith('/') ? `/${path}` : path;
  const langs = SUPPORTED_LOCALES.reduce((acc, locale) => {
    const hreflang = LOCALE_TO_HREFLANG[locale] || locale;
    acc[hreflang] = `${BASE_URL}/${locale}${finalPath}`;
    return acc;
  }, {});
  langs["x-default"] = `${BASE_URL}/en${finalPath}`;
  return langs;
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const rss  = getRssMetadata(locale);
  const currentPath = "";

  return {
    metadataBase: new URL(BASE_URL),

    // ✅ FIX 1: TITLE — template se sirf %s aayega, SITE_NAME auto lagega
    // Page files mein SIRF yeh likho: title: "Page Name"
    // Output banega: "Page Name | CryptoNews Trend" — ek baar
    title: {
      default:  `Latest Crypto News | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,   // ← page title yahan inject hoga
    },

    description:
      dict.seo?.description ||
      "Stay updated with the latest cryptocurrency trends, market events, and blockchain news.",

    keywords:
      dict.seo?.keywords ||
      "cryptocurrency, crypto news, bitcoin, ethereum, blockchain, defi, nft, altcoin",

    alternates: {
      canonical: `${BASE_URL}/${locale}${currentPath}`,
      languages: buildAlternateLanguages(currentPath),
      ...rss.alternates,
    },

    openGraph: {
      title:       dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      url:         `${BASE_URL}/${locale}`,
      siteName:    SITE_NAME,
      images: [{
        url:    `${BASE_URL}/og-image.png`,
        width:  1280,
        height: 720,
        alt:    `${SITE_NAME} - Latest Crypto Updates`,
      }],
      locale:          OG_LOCALE_MAP[locale] || 'en_US',
      alternateLocale: SUPPORTED_LOCALES
        .filter(l => l !== locale)
        .map(l => OG_LOCALE_MAP[l] || l),
      type: "website",
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cryptonews90841",
      creator:     "@cryptonews90841",
      title:       dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      images:      [`${BASE_URL}/og-image.png`],
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet":       -1,
      },
    },

    // ✅ FIX 2: GOOGLE VERIFICATION
    // G-6QD0N2CR34 = Analytics ID hai — verification kaam nahi karta
    // Steps: Search Console → Settings → Ownership Verification
    //        → HTML Tag → content="..." woh value copy karo yahan
    verification: {
      google: "G-6QD0N2CR34",
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: "/favicon.ico",
    },

    manifest:        "/manifest.json",
    category:        "technology",
    formatDetection: { telephone: false, email: false, address: false },
  };
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type":    "WebSite",
  name:        SITE_NAME,
  url:         BASE_URL,
  potentialAction: {
    "@type":  "SearchAction",
    target: {
      "@type":      "EntryPoint",
      urlTemplate:  `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type":    "Organization",
  name:        SITE_NAME,
  url:         BASE_URL,
  logo: {
    "@type":  "ImageObject",
    url:      `${BASE_URL}/logo.png`,
    width:    200,
    height:   60,
  },
  sameAs: ["https://twitter.com/cryptonews90841"],
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const dir  = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6QD0N2CR34"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6QD0N2CR34');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white text-black`}>
        <Header dict={dict} locale={locale} />
        <ClientLayout dict={dict} locale={locale}>
          {children}
        </ClientLayout>
        <Footer dict={dict} locale={locale} />
      </body>
    </html>
  );
}