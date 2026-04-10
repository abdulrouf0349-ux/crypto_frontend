// app/[locale]/contact/page.jsx
import ContactPage from "./contactUs";

const SITE_NAME = 'CryptoWhales';
const BASE_URL  = 'https://cryptonewstrend.com';

const META = {
  en: {
    title:       'Contact Us | CryptoWhales',
    description: 'Contact CryptoWhales for general inquiries, copyright issues, or technical support. We respond within 24 hours.',
    keywords:    'contact cryptowhales, crypto news support, copyright takedown, platform support',
  },
  ur: {
    title:       'ہم سے رابطہ کریں | CryptoWhales',
    description: 'CryptoWhales سے رابطہ کریں — عام سوالات، کاپی رائٹ مسائل یا تکنیکی مدد کے لیے۔ ہم 24 گھنٹوں میں جواب دیتے ہیں۔',
    keywords:    'رابطہ, کرپٹو سپورٹ, مدد',
  },
  ar: {
    title:       'اتصل بنا | CryptoWhales',
    description: 'تواصل مع CryptoWhales للاستفسارات العامة أو مشكلات حقوق النشر أو الدعم الفني. نرد خلال 24 ساعة.',
    keywords:    'اتصل بنا, دعم العملاء, أخبار العملات المشفرة',
  },
  ru: {
    title:       'Связаться с нами | CryptoWhales',
    description: 'Свяжитесь с CryptoWhales по общим вопросам, авторским правам или технической поддержке. Отвечаем в течение 24 часов.',
    keywords:    'связаться, поддержка, крипто новости',
  },
  es: {
    title:       'Contáctanos | CryptoWhales',
    description: 'Contacta con CryptoWhales para consultas generales, derechos de autor o soporte técnico. Respondemos en 24 horas.',
    keywords:    'contacto, soporte cripto, ayuda',
  },
  fr: {
    title:       'Contactez-nous | CryptoWhales',
    description: 'Contactez CryptoWhales pour des questions générales, des problèmes de droits d\'auteur ou un support technique. Réponse sous 24h.',
    keywords:    'contact, support crypto, aide',
  },
  de: {
    title:       'Kontakt | CryptoWhales',
    description: 'Kontaktieren Sie CryptoWhales für allgemeine Anfragen, Urheberrechtsprobleme oder technischen Support. Wir antworten innerhalb von 24 Stunden.',
    keywords:    'Kontakt, Krypto Support, Hilfe',
  },
  'zh-CN': {
    title:       '联系我们 | CryptoWhales',
    description: '联系 CryptoWhales，咨询一般问题、版权问题或技术支持。我们将在24小时内回复。',
    keywords:    '联系我们, 加密货币支持, 帮助',
  },
};

const getLocaleMeta = (locale) => META[locale] || META['en'];

// ── JSON-LD builder (ek jagah se) ───────────────────────────
function buildJsonLd(meta, pageUrl, locale) {
  return {
    '@context': 'https://schema.org',
    '@type':    'ContactPage',
    name:        meta.title,
    description: meta.description,
    url:         pageUrl,
    inLanguage:  locale,
    publisher: {
      '@type': 'Organization',
      name:     SITE_NAME,
      url:      BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${BASE_URL}/logo.png`,
      },
      contactPoint: [
        {
          '@type':            'ContactPoint',
          contactType:        'customer support',
          email:              'support@cryptonewstrend.com', // ✅ apna actual email
          availableLanguage:  Object.keys(META),
        },
        {
          '@type':      'ContactPoint',
          contactType:  'technical support',
          email:        'support@cryptonewstrend.com',
        },
      ],
    },
  };
}

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  // ✅ URL folder name se match karta hai
  const pageUrl    = `${BASE_URL}/${locale}/contact-us`;

  return {
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        Object.keys(META).map((l) => [l, `${BASE_URL}/${l}/contact-us`])
      ),
    },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         pageUrl,
      siteName:    SITE_NAME,
      locale,
      type:        'website',
      images: [
        {
          url:    `${BASE_URL}/og-image.png`,
          width:  1200,
          height: 630,
          alt:    `${SITE_NAME} Contact Us`,
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      title:       meta.title,
      description: meta.description,
      images:      [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-snippet':       -1,
        'max-image-preview': 'large',
      },
    },
    // ✅ 'other' mein JSON-LD NAHI — sirf page component mein script tag
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function ContactServerPage({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = `${BASE_URL}/${locale}/contact-us`;
  const jsonLd     = buildJsonLd(meta, pageUrl, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPage />
    </>
  );
}