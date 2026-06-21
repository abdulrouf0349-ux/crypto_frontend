// app/[locale]/about/page.jsx

import Link from "next/link";
import { Flame, Users, Globe, Shield, TrendingUp, Zap, Eye, Award } from "lucide-react";
import Script from "next/script";

const SITE_URL = "https://cryptonewstrend.com";
const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

// ── Per-locale SEO ──────────────────────────────────────
const META = {
  en: {
    title: "About Us - CryptoNewsTrend | Crypto News & Market Intelligence",
    desc:  "CryptoNewsTrend delivers real-time Bitcoin news, Ethereum updates, whale tracking, ICO analysis, and blockchain events to a global audience in 8 languages.",
  },
  ur: {
    title: "ہمارے بارے میں - CryptoNewsTrend | کرپٹو خبریں",
    desc:  "CryptoNewsTrend دنیا بھر کے قارئین کے لیے کرپٹو کی تازہ ترین خبریں، وہیل ٹریکنگ اور ICO تجزیہ فراہم کرتا ہے۔",
  },
  ar: {
    title: "من نحن - CryptoNewsTrend | أخبار العملات الرقمية",
    desc:  "يقدم CryptoNewsTrend أخبار البيتكوين والعملات الرقمية في الوقت الفعلي وتتبع الحيتان وتحليل ICO لجمهور عالمي بـ 8 لغات.",
  },
  es: {
    title: "Sobre Nosotros - CryptoNewsTrend | Noticias Crypto",
    desc:  "CryptoNewsTrend ofrece noticias de Bitcoin en tiempo real, seguimiento de ballenas, análisis de ICO y eventos blockchain para audiencia global.",
  },
  fr: {
    title: "À Propos - CryptoNewsTrend | Actualités Crypto",
    desc:  "CryptoNewsTrend fournit des actualités Bitcoin en temps réel, le suivi des baleines, l'analyse ICO et les événements blockchain pour un public mondial.",
  },
  de: {
    title: "Über Uns - CryptoNewsTrend | Krypto-Nachrichten",
    desc:  "CryptoNewsTrend liefert Bitcoin-Nachrichten in Echtzeit, Whale-Tracking, ICO-Analysen und Blockchain-Events für ein globales Publikum.",
  },
  ru: {
    title: "О Нас - CryptoNewsTrend | Крипто Новости",
    desc:  "CryptoNewsTrend предоставляет новости Bitcoin в реальном времени, отслеживание китов, анализ ICO и события блокчейна для глобальной аудитории.",
  },
  zh: {
    title: "关于我们 - CryptoNewsTrend | 加密货币新闻",
    desc:  "CryptoNewsTrend 为全球受众提供实时比特币新闻、以太坊更新、巨鲸追踪、ICO 分析和区块链活动。",
  },
};

export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  const canonical =
    locale === "en"
      ? "https://cryptonewstrend.com/privacy-policy"
      : `https://cryptonewstrend.com/${locale}/privacy-policy`;

  return {
    title: "Privacy Policy - CryptoNewsTrend",
    description:
      "Learn how CryptoNewsTrend collects, uses, stores and protects user data, cookies, analytics information and privacy rights.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Privacy Policy - CryptoNewsTrend",
      description:
        "Learn how CryptoNewsTrend protects user privacy and handles data.",
      url: canonical,
      siteName: "CryptoNewsTrend",
      images: [
        {
          url: "https://cryptonewstrend.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - CryptoNewsTrend",
      description:
        "Learn how CryptoNewsTrend protects user privacy and handles data.",
      images: ["https://cryptonewstrend.com/og-image.png"],
    },
  };
}
const FEATURES = [
  { icon: TrendingUp, title: "Market News",     desc: "Breaking BTC price moves, ETF flows, institutional activity and macro crypto events — covered first.",  color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Zap,        title: "Whale Tracker",   desc: "Real-time alerts on large on-chain transfers across Ethereum, Solana, Bitcoin and 20+ blockchains.",       color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Globe,      title: "ICO Launchpad",   desc: "Curated ICO and token sale projects with funding rounds, tokenomics, valuation and investor summaries.", color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { icon: Award,      title: "Crypto Events",   desc: "Global blockchain conferences, developer summits, meetups and hackathons — all in one calendar.",          color: "text-green-400",  bg: "bg-green-500/10"  },
  { icon: Eye,        title: "Coin Analysis",   desc: "In-depth technical and fundamental analysis of Bitcoin, Ethereum, Solana and emerging altcoins.",           color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Shield,     title: "Editorial Trust", desc: "Independent reporting. No paid placements. No undisclosed conflicts. Every article is clearly attributed.", color: "text-red-400",    bg: "bg-red-500/10"    },
];

const LANGS = [
  { code: "EN", name: "English"  },
  { code: "UR", name: "اردو"     },
  { code: "AR", name: "العربية"  },
  { code: "ES", name: "Español"  },
  { code: "FR", name: "Français" },
  { code: "DE", name: "Deutsch"  },
  { code: "RU", name: "Русский"  },
  { code: "ZH", name: "中文"     },
];

export default async function AboutPage({ params }) {
  const { locale: raw } = await params;
  const locale = VALID_LOCALES.includes(raw) ? raw : "en";
  const isRtl  = ["ur", "ar"].includes(locale);
  const prefix = locale === "en" ? "" : `/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "CryptoNewsTrend",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: META.en.desc,
    sameAs: ["https://twitter.com/cryptonewstrend", "https://t.me/cryptonewstrend"],
    foundingDate: "2024",
    areaServed: "Worldwide",
    inLanguage: ["en", "ur", "ar", "es", "fr", "de", "ru", "zh"],
  };

  return (
    <>
      <Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      url: "https://cryptonewstrend.com/privacy-policy",
      description:
        "Privacy Policy of CryptoNewsTrend explaining data collection, cookies, analytics and user rights.",
      publisher: {
        "@type": "Organization",
        name: "CryptoNewsTrend",
        url: "https://cryptonewstrend.com"
      }
    })
  }}
/>

      <main
        className="min-h-screen "
        dir={isRtl ? "rtl" : "ltr"}
        lang={locale}
      >
        {/* ── Hero ── */}
        <section className="border-b border-[#21262d] py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full mb-8">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                Crypto Intelligence Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-none tracking-tight">
              <span className="text-white">Crypto</span>
              <span className="text-orange-500">NewsTrend</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Fast, accurate, and unbiased crypto intelligence — delivered to a global audience across 8 languages, 24 hours a day.
            </p>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-16 border-b border-[#21262d]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 bg-purple-500 rounded-full" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
              CryptoNewsTrend was built with one goal: give every investor, trader, and crypto enthusiast — regardless of language or geography — access to the same high-quality market intelligence previously reserved for institutional players. In a market where a 10-minute information delay can cost thousands, speed and accuracy are not optional.
            </p>
          </div>
        </section>

        {/* ── What we cover ── */}
        <section className="py-16 border-b border-[#21262d]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1 h-7 bg-orange-500 rounded-full" />
              <h2 className="text-2xl font-bold">What We Cover</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 hover:border-purple-500/40 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2 text-white">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Editorial Independence ── */}
        <section className="py-16 border-b border-[#21262d]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold">Editorial Independence</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our editorial team operates independently of all commercial relationships. No cryptocurrency project, exchange, or investor can pay to appear in our news feed. Whale alerts and market data are sourced exclusively from verified on-chain providers and major exchanges.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When we make mistakes, we correct them with a visible notice — we never silently delete or alter published articles. Our corrections policy and editorial standards are published on our{" "}
                <Link href={`${prefix}/editorial-policy`} className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                  Editorial Policy
                </Link>{" "}
                page.
              </p>
            </div>
          </div>
        </section>

        {/* ── Multilingual ── */}
        <section className="py-16 border-b border-[#21262d]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 bg-blue-500 rounded-full" />
              <h2 className="text-2xl font-bold">Global & Multilingual</h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">
              Crypto is a global phenomenon. CryptoNewsTrend publishes in 8 languages so that every reader — from Karachi to São Paulo, from Cairo to Shanghai — can follow the market in their native language.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LANGS.map(({ code, name }) => (
                <div key={code} className="bg-[#161b22] border border-[#21262d] rounded-lg px-4 py-3 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-400 shrink-0">{code}</span>
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 border-b border-[#21262d]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "8",    label: "Languages"          },
                { value: "24/7", label: "News Coverage"      },
                { value: "20+",  label: "Blockchains Tracked"},
                { value: "100%", label: "Editorially Free"   },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-widest font-mono">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-4">Have a News Tip or Question?</h2>
            <p className="text-gray-400 mb-8">
              Reach our editorial team at any time. We read every message.
            </p>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}