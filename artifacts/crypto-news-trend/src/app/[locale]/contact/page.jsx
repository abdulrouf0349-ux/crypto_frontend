import { Mail, MessageSquare, Send, MapPin } from "lucide-react";
import Script from "next/script";

const SITE_URL = "https://cryptonewstrend.com";
const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"];

export async function generateMetadata({ params }) {
  const { locale: raw } = await params;
  const locale = VALID_LOCALES.includes(raw) ? raw : "en";

  const canonical =
    locale === "en"
      ? `${SITE_URL}/contact`
      : `${SITE_URL}/${locale}/contact`;

  const languages = {};
  VALID_LOCALES.forEach((l) => {
    languages[l] =
      l === "en"
        ? `${SITE_URL}/contact`
        : `${SITE_URL}/${l}/contact`;
  });

  languages["x-default"] = `${SITE_URL}/contact`;

  return {
    title: "Contact Us - CryptoNewsTrend",
    description:
      "Contact the CryptoNewsTrend editorial team for news tips, corrections, partnerships, media inquiries and support.",

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical,
      languages,
    },

    openGraph: {
      type: "website",
      title: "Contact Us - CryptoNewsTrend",
      description:
        "Reach the CryptoNewsTrend editorial team.",
      url: canonical,
      siteName: "CryptoNewsTrend",
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Contact Us - CryptoNewsTrend",
      description:
        "Reach the CryptoNewsTrend editorial team.",
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale: raw } = await params;
  const locale = VALID_LOCALES.includes(raw) ? raw : "en";
  const isRtl = ["ur", "ar"].includes(locale);

  return (
    <>
    
    <Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact CryptoNewsTrend",
      url:
        locale === "en"
          ? `${SITE_URL}/contact`
          : `${SITE_URL}/${locale}/contact`,
      mainEntity: {
        "@type": "Organization",
        name: "CryptoNewsTrend",
        url: SITE_URL,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "editorial",
            email: "editor@cryptonewstrend.com"
          },
          {
            "@type": "ContactPoint",
            contactType: "advertising",
            email: "ads@cryptonewstrend.com"
          }
        ]
      }
    })
  }}
/>
    
    

    <main className="min-h-screen bg-[#0d1117] text-white py-20" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Get in Touch</h1>
        <p className="text-gray-400 text-center mb-12">Have a story, tip, or partnership proposal? We’d love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-8">
            <h3 className="font-bold mb-6 flex items-center gap-2"><Mail className="w-5 h-5 text-orange-500" /> Email</h3>
            <p className="text-gray-400 mb-2">Editorial: <span className="text-white">editor@cryptonewstrend.com</span></p>
            <p className="text-gray-400">Partnerships: <span className="text-white">ads@cryptonewstrend.com</span></p>
          </div>

          {/* Dummy Form UI (Client component use kar sakte ho) */}
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-8 flex flex-col justify-center items-center text-center">
            <MessageSquare className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="font-bold mb-2">Fast Response</h3>
            <p className="text-sm text-gray-400">Our team monitors all inboxes 24/7. Expect a response within 12-24 hours.</p>
          </div>
        </div>
      </div>
    </main>
        </>
  );
}