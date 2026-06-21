import Link from "next/link";
import Script from "next/script";

const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";

const VALID_LOCALES = ["en", "ur", "es", "ru", "fr", "de", "ar", "zh"] 

const SCHEMA_LANGUAGE = {
  en: "en-US", ur: "ur-PK", es: "es-ES", ru: "ru-RU",
  fr: "fr-FR", de: "de-DE", ar: "ar-SA", zh: "zh-CN"
};

// Clean parameter routing handling for dynamic localized alternate paths
function buildUrl(locale, path = "privacy-policy") {
  const base = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
  return `${base}/${path}`;
}

export async function generateMetadata({
  params,
}) {
  const currentLocale = VALID_LOCALES.includes(params.locale) ? params.locale : "en";
  const canonicalUrl = buildUrl(currentLocale);

  const languages = {};
  VALID_LOCALES.forEach((l) => {
    languages[l] = buildUrl(l);
  });
  languages["x-default"] = `${SITE_URL}/privacy-policy`;

  return {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Read the ${SITE_NAME} Privacy Policy. Learn how we securely collect, manage, and process user data under GDPR and CCPA frameworks while serving global crypto market insights.`,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function PrivacyPolicyPage({ params }) {
  const currentLocale = VALID_LOCALES.includes(params.locale ) ? (params.locale ) : "en";
  const currentLangCode = SCHEMA_LANGUAGE[currentLocale];
  const pageUrl = buildUrl(currentLocale);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `Privacy Policy - ${SITE_NAME}`,
        description: `Privacy policy guidelines, compliance data protocols, and legal rights explanations for visitors of ${SITE_NAME}.`,
        inLanguage: currentLangCode,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        datePublished: "2025-01-01T00:00:00Z",
        dateModified: "2026-06-16T00:00:00Z",
        breadcrumb: {
          "@id": `${pageUrl}/#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
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
            name: "Privacy Policy",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Core Header Elements */}
        <div className="border-b border-gray-800 pb-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last Updated: <span className="text-gray-200 font-semibold">June 16, 2026</span>
          </p>
        </div>

        {/* Informational Intro Container */}
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6 leading-relaxed">
          <p className="text-lg text-gray-200">
            <strong>{SITE_NAME}</strong> is deeply committed to safeguarding your private data and establishing absolute clarity regarding how we monitor, securely capture, and safely process user analytics. This legal framework addresses records stored while you interact with our real-time cryptocurrency news updates, token indices, deep Web3 analysis, and technical market insights across all localized domains.
          </p>

          <hr className="border-gray-800 my-8" />

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              We prioritize minimalist telemetry architecture. The small datasets we register include:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-2">
              <li><strong>Log Metrics:</strong> Automated delivery of visitor browser footprints, device system variants, internet protocol (IP addresses), page paths, and duration tracking.</li>
              <li><strong>Voluntary Form Elements:</strong> Communication coordinates such as your public name or email handles provided voluntarily when signing up for market updates or dispatch newsletters.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">2. Purpose of Data Processing</h2>
            <p>
              Your data remains completely isolated and is accessed exclusively to optimize edge-delivery speeds and map global content localization accurately. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-2">
              <li>Serve real-time data panels synchronized with your specific regional locale parameters.</li>
              <li>Filter malicious behavioral scripts, defending our API networks from spam and security attacks.</li>
              <li>Analyze aggregate trends to optimize our layouts, reporting speeds, and crawl efficiency.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">3. Cookies & Automated Tracking Assets</h2>
            <p>
              Our ecosystem uses tracking cookies and session configurations to map user state preferences. These files help retain layout preferences (e.g., local currency toggles, display settings) and provide safe anonymous traffic attribution through trusted tracking networks like Google Analytics. You can adjust your browser settings to completely reject incoming cookie payloads at any time.
            </p>
          </section>

          {/* Section 4 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">4. Third-Party Links & Network Exchanges</h2>
            <p>
              Our dynamic crypto news reporting embeds redirect paths pointing out to external DeFi protocols, smart contracts, decentralized exchanges (DEXs), and standard trading channels. We hold zero governance or execution oversight over external entities. We highly encourage reading the privacy terms of any third-party asset frameworks you choose to visit.
            </p>
          </section>

          {/* Section 5 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">5. Strategic Data Security Standards</h2>
            <p>
              We implement comprehensive cloud firewall rules, strict SSL transmission protocols, and strict database isolation profiles to securely protect user logs against unexpected leakage, data loss, or unauthorized breach attempts. Please note, however, that no digital asset network transmission or database storage mechanism is ever 100% immune to failure.
            </p>
          </section>

          {/* Section 6 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">6. International Regulations: GDPR & CCPA Compliance</h2>
            <p>
              Depending on your location, you have strong structural data rights under frameworks like the European Union GDPR or California Consumer Privacy Act (CCPA). These rights include:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-2">
              <li>The absolute right to request the deletion of your personal data records from our systems.</li>
              <li>The right to export or review the specific informational logs we hold on your profile.</li>
              <li>The right to opt out of third-party behavioral advertising profiles.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">7. Protection of Children's Privacy</h2>
            <p>
              Our content matrices do not target and are not intentionally designed for individuals under the age of 13. If you believe a minor has accidentally registered data coordinates within our databases, contact us immediately so we can promptly erase those database logs.
            </p>
          </section>

          {/* Section 8 */}
          <section className="pt-4">
            <h2 className="text-2xl font-bold text-white mb-3">8. Adjustments to This Privacy Framework</h2>
            <p>
              We reserve full administrative rights to adjust or update this policy document as needed to reflect infrastructure adjustments or regulatory changes. Any edits automatically go live as soon as they are pushed to this URL.
            </p>
          </section>

          {/* Section 9 */}
          <section className="pt-4 pb-6">
            <h2 className="text-2xl font-bold text-white mb-3">9. Direct Contact Operations</h2>
            <p>
              For data access requests, deletion requests, or legal inquiries, reach our compliance team directly via email:
            </p>
            <div className="mt-3 p-4 bg-[#161b22] border border-gray-800 rounded-lg inline-block">
              Email:{" "}
              <a
                href="mailto:privacy@cryptonewstrend.com"
                className="text-orange-400 font-medium hover:text-orange-300 transition-colors"
              >
                privacy@cryptonewstrend.com
              </a>
            </div>
          </section>
        </div>

        {/* Absolute Mandatory Trust Link Infrastructure Area */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Corporate & Compliance Resources</h3>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
            <Link href="/about" className="hover:text-orange-400 transition-colors">
              About Our Company
            </Link>
            <Link href="/contact" className="hover:text-orange-400 transition-colors">
              Contact Editorial Desk
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-orange-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/editorial-policy" className="hover:text-orange-400 transition-colors">
              Editorial Guidelines
            </Link>
            <Link href="/corrections-policy" className="hover:text-orange-400 transition-colors">
              Corrections Matrix
            </Link>
          </nav>
        </div>

      </div>

      {/* Structured SEO Injection Output Node */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </main>
  );
}