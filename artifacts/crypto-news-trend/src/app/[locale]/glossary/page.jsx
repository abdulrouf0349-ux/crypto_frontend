// app/[locale]/glossary/page.jsx
import Script from "next/script";
import { fetchCoins } from "../../../lib/api/glosssary";
import CoinGlossary from "./data";

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

const OG_LOCALE_MAP = {
  en: "en_US", ur: "ur_PK", es: "es_ES",
  ru: "ru_RU", fr: "fr_FR", de: "de_DE",
  ar: "ar_SA", zh: "zh_CN",
};

const PAGE_COPY = {
  en: {
    title: "Crypto Glossary: 500+ Blockchain, Bitcoin & DeFi Terms Explained",
    description:
      "Learn 500+ cryptocurrency, blockchain, Bitcoin, Ethereum, NFT, Web3 and DeFi terms with beginner-friendly explanations, examples and definitions.",
    keywords: [
      "crypto glossary",
      "bitcoin glossary",
      "blockchain dictionary",
      "defi terms",
      "web3 glossary",
      "nft glossary",
      "cryptocurrency definitions",
    ],
  },
  ur: {
    title: "کرپٹو گلوساری – 500+ بلاک چین اور ڈی فائی اصطلاحات",
    description:
      "500+ کرپٹو کرنسی، بلاک چین، بٹ کوائن، ایتھیریم، این ایف ٹی اور ڈی فائی اصطلاحات آسان زبان میں سیکھیں۔",
    keywords: ["کرپٹو گلوساری", "بلاک چین اصطلاحات", "ڈی فائی ڈکشنری"],
  },
  es: {
    title: "Glosario Cripto: 500+ Términos de Blockchain y DeFi Explicados",
    description:
      "Aprende más de 500 términos de criptomonedas, blockchain, Bitcoin, Ethereum, NFT, Web3 y DeFi con explicaciones claras y ejemplos.",
    keywords: ["glosario cripto", "términos blockchain", "diccionario defi"],
  },
  ar: {
    title: "قاموس العملات الرقمية: 500+ مصطلح بلوكشين ودي فاي",
    description:
      "تعلم أكثر من 500 مصطلح للعملات الرقمية والبلوكشين وبيتكوين وإيثيريوم والـ NFT والـ Web3 وDeFi بشرح مبسط.",
    keywords: ["قاموس العملات الرقمية", "مصطلحات البلوكشين", "ديفاي"],
  },
};

function getCopy(locale) {
  return PAGE_COPY[locale] || PAGE_COPY.en;
}

function buildCanonical(locale) {
  return locale === "en"
    ? `${SITE_URL}/glossary`
    : `${SITE_URL}/${locale}/glossary`;
}

// ─── Static Params (SSG for all locales) ─────────────────────────────────────
export function generateStaticParams() {
  return VALID_LOCALES.map((locale) => ({ locale }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params, searchParams }) {
  const locale = VALID_LOCALES.includes(params.locale) ? params.locale : "en";
  const canonical = buildCanonical(locale);
  const { title, description, keywords } = getCopy(locale);
  const ogImage = `${SITE_URL}/crypto-glossary.png`;

  const alternateLanguages = { "x-default": buildCanonical("en") };
  VALID_LOCALES.forEach((loc) => {
    alternateLanguages[loc] = buildCanonical(loc);
  });

  // ✅ Noindex dynamic search/filter URLs to prevent duplicate content
  const hasSearchParam = !!searchParams?.search;
  const hasTypeParam = searchParams?.type && searchParams.type !== "all";
  const hasPageParam = Number(searchParams?.page) > 1;
  const isDynamic = hasSearchParam || hasTypeParam || hasPageParam;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,

    alternates: {
      canonical,
      languages: alternateLanguages,
    },

    robots: {
      index: !isDynamic,   // ✅ noindex for ?search= / ?type= / ?page= URLs
      follow: true,
    },

    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALE_MAP[locale] || "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@CryptoNewsTrend",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function GlossaryPage({ params, searchParams }) {
  const locale = VALID_LOCALES.includes(params.locale) ? params.locale : "en";

  // Safer slug helper
  const getSlug = (coin) =>
    coin.slug || coin.id || encodeURIComponent(coin.name || "asset");

  const search = searchParams?.search || "";
  const type = searchParams?.type || "all";
  const page = Number(searchParams?.page) || 1;

  let initialData = [];
  let initialTotalPages = 1;
  let totalItems = 0;

  try {
    const result = await fetchCoins(page, search, type, locale);

    if (result) {
      initialData = result.data || [];
      initialTotalPages = result.metadata?.total_pages || 1;
      totalItems = result.metadata?.total_items || 0;
    }
  } catch (e) {
    console.error("Glossary fetch error:", e);
  }

  const canonical = buildCanonical(locale);
  const { title, description } = getCopy(locale);

  // ─── JSON-LD Structured Data ─────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        sameAs: [
          "https://twitter.com/CryptoNewsTrend",
          "https://t.me/CryptoNewsTrendhub",
        ],
      },

      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        // ✅ SearchAction for sitelinks searchbox
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },

      {
        "@type": "DefinedTermSet",
        "@id": `${canonical}#glossary`,
        name: "Crypto Glossary",
        url: canonical,
        numberOfTerms: totalItems || initialData.length,
        inLanguage: locale,
        keywords: "crypto, blockchain, defi, nft, web3 glossary",
        about: [
          { "@type": "Thing", name: "Cryptocurrency" },
          { "@type": "Thing", name: "Blockchain" },
          { "@type": "Thing", name: "Web3" },
          { "@type": "Thing", name: "Decentralized Finance" },
        ],
        hasPart: initialData.slice(0, 15).map((coin) => {
          const slug = getSlug(coin) || "unknown";
          return {
            "@type": "DefinedTerm",
            "@id": `${SITE_URL}/${locale}/glossary/${slug}#term`,
            name: coin.name,
            termCode: coin.symbol || "",
            description: (coin.description || "").slice(0, 180),
            url: `${SITE_URL}/${locale}/glossary/${slug}`,
            inDefinedTermSet: {
              "@id": `${canonical}#glossary`,
            },
          };
        }),
      },

      {
        "@type": "ItemList",
        "@id": `${canonical}#list`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: initialData.length,
        inLanguage: locale,   // ✅ Added inLanguage
        itemListElement: initialData.slice(0, 10).map((coin, i) => {
          const slug = getSlug(coin);
          return {
            "@type": "ListItem",
            position: i + 1,
            name: coin.name,
            url: `${SITE_URL}/${locale}/glossary/${slug}`,
          };
        }),
      },

      {
        "@type": "WebPage",
        "@id": canonical,
        url: canonical,
        name: title,
        description,
        mainEntity: {
          "@id": `${canonical}#glossary`,
        },
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Glossary",
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="glossary-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <CoinGlossary
        initialData={initialData}
        initialTotalPages={initialTotalPages}
        locale={locale}
      />
    </>
  );
}