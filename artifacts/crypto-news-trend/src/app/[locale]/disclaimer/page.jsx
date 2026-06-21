import Script from "next/script";

export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  const canonical =
    locale === "en"
      ? "https://cryptonewstrend.com/disclaimer"
      : `https://cryptonewstrend.com/${locale}/disclaimer`;

  return {
    title: "Disclaimer - CryptoNewsTrend",
    description:
      "Important financial disclaimer explaining that CryptoNewsTrend does not provide financial advice and cryptocurrency investments carry risk.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Disclaimer - CryptoNewsTrend",
      description:
        "CryptoNewsTrend financial and legal disclaimer for users.",
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
export default function DisclaimerPage() {
  return (
    <>
    <Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Financial Disclaimer",
      url: "https://cryptonewstrend.com/disclaimer",
      description:
        "CryptoNewsTrend financial disclaimer explaining investment risks and limitations of liability.",
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

        <h1>Financial Disclaimer</h1>

        <p>
          <strong>CryptoNewsTrend</strong> is an independent informational
          platform providing news, analysis, and educational content about
          cryptocurrency and blockchain technology.
        </p>

        {/* WARNING BOX */}
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 my-8">
          <p className="m-0 font-bold text-orange-500">
            We are NOT financial advisors.
          </p>
          <p className="m-0 text-sm mt-2">
            All content is strictly for informational and educational purposes.
            Nothing published on this website should be considered financial,
            investment, trading, or legal advice.
          </p>
        </div>

        <h2>1. Investment Risk</h2>
        <p>
          Cryptocurrency markets are highly volatile. Prices may rise or fall
          rapidly, and you may lose part or all of your investment.
        </p>

        <h2>2. No Guarantees</h2>
        <p>
          We do not guarantee the accuracy, completeness, or reliability of any
          information. Market data and news may change without notice.
        </p>

        <h2>3. Personal Responsibility</h2>
        <p>
          You are solely responsible for your financial decisions. Always
          conduct your own research (DYOR) and consult a certified financial
          advisor before investing.
        </p>

        <h2>4. External Links</h2>
        <p>
          Our website may contain links to third-party platforms, exchanges, or
          projects. We are not responsible for their content or practices.
        </p>

        <h2>5. Affiliate Disclosure</h2>
        <p>
          Some links may be affiliate links. This means we may earn a small
          commission at no extra cost to you.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          CryptoNewsTrend and its team are not liable for any financial loss,
          damages, or decisions made based on our content.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: June 2026
        </p>
      </div>
    </main>
     </>
  );
}