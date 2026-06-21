import Script from "next/script";

export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  const canonical =
    locale === "en"
      ? "https://cryptonewstrend.com/editorial-policy"
      : `https://cryptonewstrend.com/${locale}/editorial-policy`;

  return {
    title: "Editorial Policy - CryptoNewsTrend",
    description:
      "Learn how CryptoNewsTrend ensures accurate, independent and transparent crypto journalism through strict editorial standards and verification processes.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: "Editorial Policy - CryptoNewsTrend",
      description:
        "Our editorial standards, accuracy policy, and independence guidelines.",
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
  };
}

export default function EditorialPolicyPage() {
  return (
    <>
    <Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Editorial Policy",
      url: "https://cryptonewstrend.com/editorial-policy",
      description:
        "CryptoNewsTrend editorial policy ensuring accuracy, independence, and transparency in crypto journalism.",
      publisher: {
        "@type": "Organization",
        name: "CryptoNewsTrend",
        url: "https://cryptonewstrend.com"
      }
    })
  }}
/>
    
    <main className="min-h-screen bg-[#0d1117] text-gray-300 py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-invert prose-orange">

        <h1>Editorial Policy</h1>

        <p>
          At <strong>CryptoNewsTrend</strong>, we are committed to delivering
          accurate, transparent, and independent crypto journalism. Our
          editorial standards ensure that readers receive trustworthy
          information in a fast-moving digital asset market.
        </p>

        {/* CORE PRINCIPLE */}
        <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 my-8">
          <p className="m-0 font-bold text-purple-400">
            Independence is our foundation
          </p>
          <p className="m-0 text-sm mt-2">
            Editorial decisions are never influenced by advertisers, sponsors,
            or external stakeholders.
          </p>
        </div>

        <h2>1. Accuracy & Fact Checking</h2>
        <p>
          Every article published on CryptoNewsTrend goes through a strict
          verification process. We cross-check information using:
        </p>
        <ul>
          <li>Official exchange announcements (Binance, Coinbase, etc.)</li>
          <li>On-chain blockchain data providers</li>
          <li>Verified project documentation and whitepapers</li>
          <li>Multiple independent news sources</li>
        </ul>

        <h2>2. Editorial Independence</h2>
        <p>
          Our newsroom operates independently from commercial influence. We do
          not accept payments for positive coverage, rankings, or biased
          reporting. Sponsored content is always clearly labeled.
        </p>

        <h2>3. Sources of Information</h2>
        <p>
          We rely on primary sources such as blockchain explorers, official
          statements, regulatory filings, and direct announcements from crypto
          projects and exchanges.
        </p>

        <h2>4. Corrections Policy</h2>
        <p>
          If an error is identified, we correct it promptly and transparently.
          Updates include a visible correction note describing what was changed
          and when.
        </p>

        <h2>5. Content Integrity</h2>
        <p>
          We do not publish misleading headlines, manipulated data, or false
          information. Clickbait or deceptive practices are strictly prohibited
          in our newsroom.
        </p>

        <h2>6. Sponsored Content</h2>
        <p>
          Any sponsored article, advertisement, or partnership content is
          clearly labeled as “Sponsored” or “Paid Partnership” to maintain full
          transparency with readers.
        </p>

        <h2>7. Editorial Updates</h2>
        <p>
          Our articles may be updated as new verified information becomes
          available. All updates are timestamped for transparency.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: June 2026
        </p>

      </div>
    </main>

    </>
  );
}