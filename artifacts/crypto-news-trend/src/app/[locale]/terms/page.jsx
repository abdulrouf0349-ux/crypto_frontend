import Script from "next/script";

export async function generateMetadata({ params }) {
  const locale = params?.locale || "en";

  const canonical =
    locale === "en"
      ? "https://cryptonewstrend.com/terms"
      : `https://cryptonewstrend.com/${locale}/terms`;

  return {
    title: "Terms & Conditions - CryptoNewsTrend",
    description:
      "Read the Terms and Conditions for using CryptoNewsTrend, including user responsibilities, content usage, and legal disclaimers.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Terms & Conditions - CryptoNewsTrend",
      description:
        "Terms of use for CryptoNewsTrend crypto news platform.",
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
export default function TermsPage() {
  return (
    <>
    <Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms & Conditions",
      url: "https://cryptonewstrend.com/terms",
      description:
        "Terms and Conditions for CryptoNewsTrend usage, content rights and legal disclaimers.",
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

        <h1>Terms & Conditions</h1>

        <p>
          Welcome to <strong>CryptoNewsTrend</strong>. By accessing or using
          our website, you agree to comply with the following Terms and
          Conditions. If you do not agree, please discontinue using our
          services.
        </p>

        {/* IMPORTANT NOTICE */}
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 my-8">
          <p className="m-0 font-bold text-orange-500">
            Use at your own risk
          </p>
          <p className="m-0 text-sm mt-2">
            All content is provided for informational and educational purposes
            only and should not be considered financial or investment advice.
          </p>
        </div>

        <h2>1. Use of Website</h2>
        <p>
          You agree to use CryptoNewsTrend only for lawful purposes. You must
          not misuse, copy, or distribute our content without permission.
        </p>

        <h2>2. Intellectual Property</h2>
        <p>
          All content, including articles, images, logos, and design, belongs
          to CryptoNewsTrend unless otherwise stated. Unauthorized use is
          strictly prohibited.
        </p>

        <h2>3. Content Accuracy</h2>
        <p>
          We strive to provide accurate and up-to-date information, but we do
          not guarantee completeness or reliability. Crypto markets are highly
          volatile and subject to change.
        </p>

        <h2>4. No Financial Advice</h2>
        <p>
          Nothing on this website constitutes financial, investment, or
          trading advice. You are responsible for your own decisions.
        </p>

        <h2>5. Third-Party Links</h2>
        <p>
          Our website may include links to third-party websites or services.
          We are not responsible for their content, policies, or practices.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          CryptoNewsTrend and its team are not liable for any losses, damages,
          or consequences arising from the use of our content or services.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We may update these Terms & Conditions at any time. Continued use of
          the website means you accept the updated terms.
        </p>

        <h2>8. Termination</h2>
        <p>
          We reserve the right to restrict or terminate access to our website
          if misuse or violation of terms is detected.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: June 2026
        </p>

      </div>
    </main>
    </>
  );
}