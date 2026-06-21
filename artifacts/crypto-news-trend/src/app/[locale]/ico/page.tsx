import type { Metadata } from "next";
import Script from "next/script";
import ICOClientView from "@/pages/ICO";
import { fetchAllIcoProjects } from "@/lib/api/Ico";
import Image from "next/image";
const SITE_URL = "https://cryptonewstrend.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// ─── Full locale metadata map (fixes Issue #6) ──────────────────────────────
const ICO_META: Record<string, { title: string; description: string }> = {
  en: {
    title: "ICO Launchpad – Top Crypto Projects & Token Sales 2026",
    description:
      "Discover active, upcoming, and ended ICO projects. Browse token sales by category, join whitelists, and invest in the best crypto launches of 2026.",
  },
  ur: {
    title: "ICO لانچ پیڈ | بہترین کرپٹو پروجیکٹس 2026",
    description:
      "فعال، آنے والے اور ختم ہوئے ICO پروجیکٹس دریافت کریں۔ وائٹ لسٹ کریں اور ابھی سرمایہ کاری کریں۔",
  },
  es: {
    title: "ICO Launchpad – Mejores Proyectos Cripto y Ventas de Tokens 2026",
    description:
      "Descubre proyectos ICO activos, próximos y finalizados. Navega por ventas de tokens, únete a listas blancas e invierte en los mejores lanzamientos cripto de 2026.",
  },
  fr: {
    title: "ICO Launchpad – Meilleurs Projets Crypto & Ventes de Tokens 2026",
    description:
      "Découvrez les projets ICO actifs, à venir et terminés. Parcourez les ventes de tokens par catégorie et investissez dans les meilleurs lancements crypto de 2026.",
  },
  de: {
    title: "ICO Launchpad – Top Krypto-Projekte & Token-Verkäufe 2026",
    description:
      "Entdecke aktive, bevorstehende und beendete ICO-Projekte. Durchsuche Token-Verkäufe nach Kategorie und investiere in die besten Krypto-Launches 2026.",
  },
  ru: {
    title: "ICO Launchpad – Лучшие крипто-проекты и продажи токенов 2026",
    description:
      "Откройте для себя активные, предстоящие и завершённые ICO-проекты. Просматривайте продажи токенов по категориям и инвестируйте в лучшие крипто-запуски 2026 года.",
  },
  ar: {
    title: "ICO لانش باد – أفضل مشاريع العملات المشفرة وبيع الرموز 2026",
    description:
      "اكتشف مشاريع ICO النشطة والقادمة والمنتهية. تصفح مبيعات الرموز حسب الفئة وانضم إلى القوائم البيضاء واستثمر في أفضل إطلاقات العملات المشفرة لعام 2026.",
  },
  zh: {
    title: "ICO 发射台 – 2026年顶级加密项目与代币销售",
    description:
      "探索活跃、即将推出和已结束的ICO项目。按类别浏览代币销售，加入白名单，投资2026年最佳加密发行项目。",
  },
};

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  ur: "ur_PK",
  es: "es_ES",
  ru: "ru_RU",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_AR",
  zh: "zh_CN",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = ICO_META[locale] ?? ICO_META["en"];
  const { title, description } = meta;
  const ogLocale = OG_LOCALE[locale] ?? "en_US";
  const canonicalUrl = `${SITE_URL}/${locale}/ico`;
  const ogImage = `${SITE_URL}/og/ico-launchpad.jpg`;

  return {
    title: {
      default: title,
      template: `%s | ICO Launchpad`,
    },
    description,
    keywords: [
      "ICO launchpad 2026",
      "crypto token sale",
      "initial coin offering",
      "DeFi ICO projects",
      "upcoming crypto ICO",
      "whitelist crypto",
      "best ICO 2026",
    ],
    other: {
      "article:publisher": "https://facebook.com/cryptonewstrend",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/ico`,
        ur: `${SITE_URL}/ur/ico`,
        es: `${SITE_URL}/es/ico`,
        ru: `${SITE_URL}/ru/ico`,
        fr: `${SITE_URL}/fr/ico`,
        de: `${SITE_URL}/de/ico`,
        ar: `${SITE_URL}/ar/ico`,
        zh: `${SITE_URL}/zh/ico`,
        "x-default": `${SITE_URL}/en/ico`,
      },
    },
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
    openGraph: {
      type: "website",
      locale: ogLocale,
      // Fix Issue #13 — add alternateLocale for all other locales
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== ogLocale),
      url: canonicalUrl,
      siteName: "CryptoNewsTrend",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "ICO Launchpad – Crypto Token Sales 2026",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/ico-launchpad.png`],
      creator: "@cryptonews90841",
      site: "@cryptonews90841",
    },
    metadataBase: new URL(SITE_URL),
    authors: [{ name: "CryptoNewsTrend", url: SITE_URL }],
    creator: "CryptoNewsTrend",
    publisher: "CryptoNewsTrend",
  };
}

export default async function IcoLaunchpadPage({ params }: PageProps) {
  const { locale } = await params;
  const ogImage = `${SITE_URL}/og/ico-launchpad.png`;

  const result = await fetchAllIcoProjects(locale, "Active", 1);
  const initialData = result?.success ? result.data : [];
  const totalPages = result?.success ? result.total_pages : 1;
  // Fix Issue #4 — use last_updated from API, not new Date()
  const dateModified = result?.success
    ? (result as any).last_updated ?? undefined
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": `${ogImage}#primaryimage`,
        url: ogImage,
        width: 1200,
        height: 630,
      },
      // Fix Issue #5 — WebSite and Organization schemas REMOVED (already in layout)
      // Only WebPage, BreadcrumbList, ItemList, FAQPage remain here
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${locale}/ico#webpage`,
        url: `${SITE_URL}/${locale}/ico`,
        // Fix Issue #4 — only set dateModified if the API provides it
        ...(dateModified ? { dateModified } : {}),
        headline:
          "ICO Launchpad – Top Crypto Projects & Token Sales 2026",
        speakable: {
          "@type": "SpeakableSpecification",
          // Fix Issue #18 — "h1" is real; "ico-description" now exists on the <p> in ICOClientView
          cssSelector: ["h1", ".ico-description"],
        },
        // Fix Issue #15 — richer about[] entities
        about: [
          { "@type": "Thing", name: "Initial Coin Offering" },
          { "@type": "Thing", name: "Token Sale" },
          { "@type": "Thing", name: "Web3 Fundraising" },
          { "@type": "Thing", name: "Crypto Launchpad" },
          { "@type": "Thing", name: "Blockchain Startup" },
        ],
        mentions: [
          { "@type": "Thing", name: "ICO" },
          { "@type": "Thing", name: "Token Sale" },
          { "@type": "Thing", name: "Web3" },
          { "@type": "Thing", name: "DeFi" },
        ],
        potentialAction: {
          "@type": "ReadAction",
          target: [`${SITE_URL}/${locale}/ico`],
        },
        name: "ICO Launchpad – Top Crypto Projects & Token Sales 2026",
        keywords:
          "ICO, Crypto Launchpad, Initial Coin Offering, Token Sale, DeFi, Web3",
        description:
          "Discover active, upcoming, and ended ICO projects. Browse by category, join whitelists, and invest in the best crypto token sales of 2026.",
        inLanguage: locale,
        mainEntity: { "@id": `${SITE_URL}/${locale}/ico#itemlist` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          "@id": `${ogImage}#primaryimage`,
          url: ogImage,
          width: 1200,
          height: 630,
        },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${SITE_URL}/${locale}/ico#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/${locale}/ico#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ICO Launchpad",
            item: `${SITE_URL}/${locale}/ico`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/${locale}/ico#itemlist`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        name: "Active ICO Projects 2026",
        description:
          "Currently active Initial Coin Offering (ICO) projects available for whitelist registration.",
        url: `${SITE_URL}/${locale}/ico`,
        numberOfItems: Math.min(initialData.length, 10),
        itemListElement: initialData.slice(0, 10).map((ico: any, index: number) => ({
          "@type": "ListItem",
          inLanguage: locale,
          "@id": `${SITE_URL}/${locale}/ico/${ico.slug}#listitem`,
          // Fix Issue #8 — richer item type instead of bare ListItem
          item: {
            "@type": "SoftwareApplication",
            name: ico.name,
            description: ico.description || "",
            url: `${SITE_URL}/${locale}/ico/${ico.slug}`,
            image: ico.main_img || `${SITE_URL}/placeholder-token.png`,
            applicationCategory: "FinanceApplication",
          },
          position: index + 1,
          name: ico.name,
          url: `${SITE_URL}/${locale}/ico/${ico.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is an ICO (Initial Coin Offering)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An ICO (Initial Coin Offering) is a fundraising method used by crypto projects to raise capital by selling new tokens to early investors before the project launches publicly.",
            },
          },
          {
            "@type": "Question",
            name: "How do I join an ICO whitelist?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To join an ICO whitelist, browse active projects on our launchpad, click the Whitelist button on a project card, and complete the registration form before the whitelist closes.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between active, upcoming, and ended ICOs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Active ICOs are currently open for investment. Upcoming ICOs are scheduled to launch soon and may accept whitelist registrations. Ended ICOs have completed their token sale period.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="ico-page-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ICOClientView
        initialData={initialData}
        initialTotalPages={totalPages}
        locale={locale}
      />
    </>
  );
}