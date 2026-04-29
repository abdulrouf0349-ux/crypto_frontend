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
  'en': 'en',
  'ur': 'ur',
  'ar': 'ar',
  'de': 'de',
  'fr': 'fr',
  'ru': 'ru',
  'zh-CN': 'zh-Hans',
  'es': 'es',
};

const OG_LOCALE_MAP = {
  'en': 'en_US',
  'ur': 'ur_PK',
  'ar': 'ar_AR',
  'de': 'de_DE',
  'fr': 'fr_FR',
  'ru': 'ru_RU',
  'zh-CN': 'zh_CN',
  'es': 'es_ES',
};

const buildAlternateLanguages = (path = "") => {
  const finalPath = path && !path.startsWith('/') ? `/${path}` : path;
  const langs = SUPPORTED_LOCALES.reduce((acc, locale) => {
    const hreflang = LOCALE_TO_HREFLANG[locale] || locale;
    if (locale === 'en') {
      acc[hreflang] = `${BASE_URL}${finalPath}`;
    } else {
      acc[hreflang] = `${BASE_URL}/${locale}${finalPath}`;
    }
    return acc;
  }, {});

  langs["x-default"] = `${BASE_URL}${finalPath}`;
  return langs;
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const rss = getRssMetadata(locale);
  const currentPath = "";

  const canonicalURL = locale === 'en' ? `${BASE_URL}${currentPath}` : `${BASE_URL}/${locale}${currentPath}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `Latest Crypto News | ${SITE_NAME}`,
      template: `%s`, 
    },
    description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends, Bitcoin updates, and market analysis.",
    keywords: dict.seo?.keywords || "cryptocurrency news, bitcoin price, blockchain technology, crypto market trends",
    // SEO Addition: Robots tag
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalURL,
      languages: buildAlternateLanguages(currentPath),
      ...rss.alternates,
    },
    openGraph: {
      title: dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      url: canonicalURL,
      siteName: SITE_NAME,
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1280, height: 720, alt: SITE_NAME }],
      locale: OG_LOCALE_MAP[locale] || 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      title: dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
        {/* Favicon optimization - explicit links for better indexing */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6QD0N2CR34"
          strategy="afterInteractive"
        />
        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="sCppueE/dYI+MsZvOgZmFg" 
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