// src/app/[locale]/page.jsx
// ✅ Fix #1  — wordCount now undefined (not fake excerpt count)
// ✅ Fix #2  — dateModified on CollectionPage uses featured article date, not new Date()
// ✅ Fix #3  — OG image is 1600×900 for Google Discover
// ✅ Fix #4  — React cache() in Page_NewsData prevents duplicate SSR fetches
// ✅ Fix #5  — No useEffect fetch in HomeClientView (pass data only, no re-fetch)

export const revalidate = 300;

import HomeClientView from "@/pages/HomeClientView";
import Page_NewsData from "@/lib/api/Page_NewsData";
import Script from "next/script";

const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const PAGE_META = {
  en: {
    title: "Crypto News Today: Bitcoin News, Ethereum News & Cryptocurrency Market Updates",
    description:
      "Latest crypto news today covering Bitcoin news, Ethereum updates, cryptocurrency market trends, whale alerts, blockchain developments, Web3 innovations, DeFi insights and breaking crypto news worldwide.",
  },
  ur: {
    title: "کرپٹو نیوز — بٹ کوائن، ایتھیریم اور مارکیٹ اپڈیٹ",
    description:
      "آج کی تازہ کرپٹو خبریں: بٹ کوائن قیمت، ایتھیریم اپڈیٹ، وہیل الرٹ اور ڈی فائی رجحانات۔ CryptoNewsTrend پر لائیو کوریج حاصل کریں۔",
  },
  es: {
    title: "Noticias Crypto Hoy — Bitcoin, Ethereum y Mercado",
    description:
      "Últimas noticias de criptomonedas: precio de Bitcoin, Ethereum, alertas de ballenas y tendencias DeFi. Cobertura en vivo por CryptoNewsTrend.",
  },
  ru: {
    title: "Крипто Новости — Биткоин, Эфириум и Рынок",
    description:
      "Актуальные крипто новости: цена Биткоина, Эфириум, кит-алерты и тренды DeFi. Живое освещение от CryptoNewsTrend каждый день.",
  },
  fr: {
    title: "Actualités Crypto — Bitcoin, Ethereum et Marché",
    description:
      "Dernières actualités crypto: prix du Bitcoin, Ethereum, alertes baleines et tendances DeFi. Couverture en direct par CryptoNewsTrend.",
  },
  de: {
    title: "Krypto Nachrichten — Bitcoin, Ethereum und Markt",
    description:
      "Aktuelle Krypto-Nachrichten: Bitcoin-Preis, Ethereum, Whale-Alerts und DeFi-Trends. Live-Berichterstattung von CryptoNewsTrend täglich.",
  },
  ar: {
    title: "أخبار كريبتو — بيتكوين وإيثريوم وتحديثات السوق",
    description:
      "أحدث أخبار العملات الرقمية: سعر بيتكوين، إيثريوم، تنبيهات الحيتان وتوجهات DeFi. تغطية مباشرة من CryptoNewsTrend يومياً.",
  },
  zh: {
    title: "加密货币新闻 — 比特币、以太坊与市场动态",
    description:
      "今日加密货币新闻：比特币价格、以太坊更新、鲸鱼预警和DeFi趋势。CryptoNewsTrend每日实时报道。",
  },
};

const SCHEMA_LANG_MAP = {
  en: "en", ur: "ur", es: "es", ru: "ru",
  fr: "fr", de: "de", ar: "ar", zh: "zh",
};

const OG_LOCALE_MAP = {
  en: "en_US", ur: "ur_PK", es: "es_ES", ru: "ru_RU",
  fr: "fr_FR", de: "de_DE", ar: "ar_SA", zh: "zh_CN",
};

function buildPageUrl(locale) {
  return locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
}

function buildAlternates() {
  const languages = {};
  for (const loc of VALID_LOCALES) {
    languages[loc] = buildPageUrl(loc);
  }
  languages["x-default"] = SITE_URL;
  return languages;
}

function shapeNewsItem(item) {
  if (!item) return null;
  return {
    id: item.id || item._id || item.title,
    title: item.title || item.heading || "No Title",
    slug: item.slug || "",
    slug_en: item.slug_en || item.slug || "",
    slug_ar: item.slug_ar || "",
    slug_ur: item.slug_ur || "",
    slug_es: item.slug_es || "",
    slug_fr: item.slug_fr || "",
    slug_de: item.slug_de || "",
    slug_ru: item.slug_ru || "",
    slug_pt: item.slug_pt || "",
    slug_zh: item.slug_zh || "",
    imageUrl:
      item.imageUrl ||
      item.image ||
      "https://cryptonewstrend.com/og-default.png",
    thumbnailUrl:
      item.thumbnailUrl ||
      item.imageUrl ||
      item.image ||
      "https://cryptonewstrend.com/icons/icon-48.png",
    date: item.date || item.created_at || new Date().toISOString(),
    category: String(item.category || item.tag || "ALL").trim().toUpperCase(),
    readTime: item.readTime || "3",
    excerpt: item.excerpt || item.description || "",
  };
}

// ─────────────────────────────────────────────
// generateMetadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale: rawLocale } = await params;
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : "en";
  const meta = PAGE_META[locale] || PAGE_META.en;
  const pageUrl = buildPageUrl(locale);

  return {
    title: meta.title,
    description: meta.description,

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
      // ✅ Fix — canonical points to the correct locale URL, not just homepage
      canonical: pageUrl,
      languages: buildAlternates(),
    },

    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      url: pageUrl,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      alternateLocale: VALID_LOCALES
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE_MAP[l]),
      images: [
        {
          // ✅ Fix #3 — 1600×900 preferred by Google Discover (was 1200×630)
          url: `${SITE_URL}/og-image.png`,
          width: 1600,
          height: 900,
          alt: `${SITE_NAME} — ${meta.title}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@cryptonews90841",
      creator: "@cryptonews90841",
      title: meta.title,
      description: meta.description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default async function HomePage({ params }) {
  const resolvedParams = await params;
  const locale = VALID_LOCALES.includes(resolvedParams?.locale)
    ? resolvedParams.locale
    : "en";

  const pageUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;

  let initialAllNews = [];
  let featured = null;
  let topStories = [];

  try {
    // ✅ Fix #4 — Page_NewsData is wrapped in React cache(), so even if layout
    // or another component calls this, it only fires ONE real HTTP request
    const mainFeedResponse = await Page_NewsData(1, locale, "ALL");
    let rawResults = [];

    if (mainFeedResponse) {
      if (Array.isArray(mainFeedResponse.results)) rawResults = mainFeedResponse.results;
      else if (Array.isArray(mainFeedResponse)) rawResults = mainFeedResponse;
      else if (Array.isArray(mainFeedResponse.data)) rawResults = mainFeedResponse.data;
    }

    const cleanNews = rawResults.map(shapeNewsItem).filter(Boolean);
    if (cleanNews.length > 0) {
      featured = cleanNews[0];
      initialAllNews = cleanNews.slice(1);
    }
    topStories = cleanNews.slice(0, 5);
  } catch (error) {
    console.error("[HomePage Fetch Error]:", error);
  }

  // ✅ Fix #2 — Use featured article's actual publish date for dateModified
  // on the CollectionPage, not new Date() which changes every render
  const collectionDateModified = featured?.date || "2026-06-16T00:00:00Z";

  // ─────────────────────────────────────────────
  // JSON-LD — 2026 Google compliant @graph
  // ─────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. CollectionPage
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#homepage`,
        url: pageUrl,
        name: PAGE_META[locale].title,
        description: PAGE_META[locale].description,
        inLanguage: SCHEMA_LANG_MAP[locale] || "en",
        // ✅ Fix #2 — dateModified reflects actual content, not render time
        datePublished: featured?.date || collectionDateModified,
        dateModified: collectionDateModified,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: { "@id": `${pageUrl}#topstories` },
        about: { "@id": `${SITE_URL}/#topic` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1"],
        },
        isAccessibleForFree: true,
        image: {
          "@type": "ImageObject",
          // ✅ Fix #3 — 1600×900 for Google Discover
          url: `${SITE_URL}/og-image.png`,
          width: 1600,
          height: 900,
        },
      },

      // ── 2. ItemList — top stories for Google Discover carousel
      ...(topStories.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#topstories`,
              name: "Top Crypto Stories",
              url: pageUrl,
              numberOfItems: topStories.length,
              itemListElement: topStories.map((story, index) => {
                const slug = story[`slug_${locale}`] || story.slug_en || story.slug;
                const articleUrl =
                  locale === "en"
                    ? `${SITE_URL}/news/${slug}`
                    : `${SITE_URL}/${locale}/news/${slug}`;

                return {
                  "@type": "ListItem",
                  position: index + 1,
                  url: articleUrl,
                  name: story.title,
                  image: story.thumbnailUrl || story.imageUrl,
                };
              }),
            },
          ]
        : []),

      // ── 3. NewsArticle — featured article
      ...(featured
        ? (() => {
            const featuredSlug =
              featured[`slug_${locale}`] || featured.slug_en || featured.slug;
            const featuredUrl =
              locale === "en"
                ? `${SITE_URL}/news/${featuredSlug}`
                : `${SITE_URL}/${locale}/news/${featuredSlug}`;

            return [
              {
                "@type": "NewsArticle",
                "@id": `${featuredUrl}#article`,
                headline: featured.title,
                // ✅ Fix #1 — wordCount removed; excerpt count is fake (50-100 words)
                // Google expects the real article body word count.
                // Set to undefined so the field is omitted entirely from JSON-LD.
                // Once you have real body content available, replace with:
                // wordCount: realBodyText.split(" ").length
                wordCount: undefined,
                genre: ["Crypto News", "Blockchain", "Bitcoin"],
                about: [
                  {
                    "@type": "Thing",
                    name: featured.category || "Cryptocurrency",
                  },
                ],
                description: featured.excerpt
                  ? featured.excerpt.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160)
                  : PAGE_META[locale].description,
                url: featuredUrl,
                inLanguage: SCHEMA_LANG_MAP[locale] || "en",
                isPartOf: { "@id": `${pageUrl}#homepage` },
                image: {
                  "@type": "ImageObject",
                  url: featured.imageUrl || `${SITE_URL}/og-image.png`,
                  // ✅ Fix #3 — Use 1600×900 where possible
                  width: 1600,
                  height: 900,
                },
                datePublished: featured.date || collectionDateModified,
                // ✅ Fix #2 — Use article date instead of new Date()
                dateModified: featured.date || collectionDateModified,
                isAccessibleForFree: true,
                author: {
                  "@id": `${SITE_URL}/#editorial-team`,
                },
                publisher: {
                  "@id": `${SITE_URL}/#organization`,
                },
                keywords: [
                  "Bitcoin",
                  "Ethereum",
                  "Cryptocurrency",
                  "Blockchain",
                  "Web3",
                  "DeFi",
                ],
                articleSection: featured.category || "Cryptocurrency",
                thumbnailUrl:
                  featured.thumbnailUrl ||
                  featured.imageUrl ||
                  `${SITE_URL}/og-image.png`,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": featuredUrl,
                },
              },

              // ── 4. BreadcrumbList
              {
                "@type": "BreadcrumbList",
                "@id": `${pageUrl}#breadcrumb`,
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: pageUrl,
                  },
                ],
              },
            ];
          })()
        : []),
    ],
  };

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/*
        ✅ Fix #5 — HomeClientView receives all data from server.
        Make sure HomeClientView does NOT have a useEffect that calls an API on mount.
        It should only do: const [news, setNews] = useState(initialAllNews)
        Any category switching should filter the already-loaded data client-side,
        OR call Page_NewsData only on user interaction (not on mount).
      */}
      <HomeClientView
        initialAllNews={initialAllNews}
        featured={featured}
        topStories={topStories}
        locale={locale}
      />
    </>
  );
}

export function generateStaticParams() {
  return VALID_LOCALES.map((locale) => ({
 locale
}));
}