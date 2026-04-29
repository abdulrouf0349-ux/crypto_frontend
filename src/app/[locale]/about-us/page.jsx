import AboutPage from "./aboutPAge";
import { getDictionary } from "../../../../i18n/getDictionary";

const BASE_URL = "https://cryptonewstrend.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict?.about || {};

  const title = `${t.title || "About Us"} | CryptoNews Trend`;
  const description = t.description || "Learn about CryptoNews Trend, your premier source for blockchain insights, DeFi guides, and global crypto news in multiple languages.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${locale === 'en' ? '' : `/${locale}`}/about`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/about`,
      siteName: "CryptoNews Trend",
      images: [{ url: `${BASE_URL}/og-about.png`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  
  // Organization Schema for E-E-A-T
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CryptoNews Trend",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": "Global cryptocurrency news and intelligence platform.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@cryptonewstrend.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <AboutPage />
    </>
  );
}