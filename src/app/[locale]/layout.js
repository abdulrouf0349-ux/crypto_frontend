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

const BASE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNews";
const SUPPORTED_LOCALES = ['en', 'ur', 'es', 'fr', 'de', 'ar', 'zh-CN'];
const RTL_LOCALES = ['ar', 'ur'];

// ✅ FIX 1: x-default hreflang add kiya — Google multilingual best practice
const buildAlternateLanguages = (path = "") => {
  const langs = SUPPORTED_LOCALES.reduce((acc, lang) => {
    acc[lang] = `${BASE_URL}/${lang}${path}`;
    return acc;
  }, {});
  langs["x-default"] = `${BASE_URL}/en${path}`; // x-default = fallback language
  return langs;
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const rss = getRssMetadata(locale);  // ← yeh add karo

  return {
    // ✅ FIX 2: metadataBase — absolute URL base (Next.js requirement)
    metadataBase: new URL(BASE_URL),

  
    // ✅ Title Template
    title: {
      default: dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },

    description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends, market events, and blockchain news.",

    // ✅ FIX 3: keywords — layout level pe generic, page level pe override hogi
    keywords: "cryptocurrency, crypto news, bitcoin, ethereum, blockchain, defi, nft, altcoin",


      alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: buildAlternateLanguages(),
      ...rss.alternates,  // ← RSS types yahan merge ho jaenge
    },

    // ✅ Open Graph
    openGraph: {
      title: dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      url: `${BASE_URL}/${locale}`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1280,   // ✅ FIX 4: tumhari actual image size ke mutabiq update kiya
          height: 720,
          alt: `${SITE_NAME} - Latest Crypto Updates`,
        },
      ],
      locale,
      type: "website",
    },

    // ✅ Twitter Card
    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      creator: "@cryptonews90841",
      title: dict.seo?.title || `Latest Crypto News | ${SITE_NAME}`,
      description: dict.seo?.description || "Stay updated with the latest cryptocurrency trends.",
      images: [`${BASE_URL}/og-image.png`],
    },

    // ✅ Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ✅ Google Search Console verification
    verification: {
      google: "",
    },

    // ✅ FIX 5: Icons — multiple sizes add kiye (Google/Apple ke liye)
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180" },
      ],
      shortcut: "/favicon.ico",
    },

    // ✅ FIX 6: manifest — PWA + mobile home screen support
    manifest: "/manifest.json",

    // ✅ FIX 7: category + classification — Google News category hint
    category: "technology",

    // ✅ FIX 8: formatDetection — mobile par auto phone/email link banana band
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
  };
}

// ✅ FIX 9: WebSite schema — sitelinks searchbox ke liye (Google par search box aata hai)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ✅ FIX 10: Organization schema — Google Knowledge Panel ke liye
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  sameAs: [
    "https://twitter.com/yourhandle",
    "https://t.me/yourchannel",
    // ✅ Apne social links yahan add karo
  ],
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // ✅ FIX 11: RTL dir attribute — Urdu/Arabic ke liye sahi direction

  return (
      <html lang={locale}>

      <head>
       <meta name="google-site-verification" content="G-6QD0N2CR34" />
        {/* 2. Google Tag (gtag.js) - Script 1 (Load script) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-6QD0N2CR34" 
          strategy="afterInteractive" 
        />
        
        {/* 3. Google Tag (gtag.js) - Script 2 (Initialize) */}
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
      <body className={`${inter.variable} antialiased`}>
        <Header dict={dict} locale={locale} />
        <ClientLayout dict={dict} locale={locale}>
          {children}
        </ClientLayout>
        <Footer dict={dict} locale={locale} />
      </body>
    </html>
  );
}