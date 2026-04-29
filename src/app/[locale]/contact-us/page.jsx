import ContactPage from "./contactUs";

const SITE_NAME = 'CryptoNewsTrend';
const BASE_URL  = 'https://cryptonewstrend.com';

const HREFLANG_MAP = {
  'en': 'en', 'ur': 'ur', 'ar': 'ar', 'de': 'de',
  'fr': 'fr', 'ru': 'ru', 'zh-CN': 'zh-Hans', 'es': 'es',
};

const OG_LOCALE_MAP = {
  'en': 'en_US', 'ur': 'ur_PK', 'ar': 'ar_AR', 'de': 'de_DE',
  'fr': 'fr_FR', 'ru': 'ru_RU', 'zh-CN': 'zh_CN', 'es': 'es_ES',
};

const META = {
  en: {
    title:       'Contact Us | CryptoNewsTrend',
    description: 'Contact CryptoNewsTrend for general inquiries, copyright issues, or technical support. We respond within 24 hours.',
    keywords:    'contact cryptonewstrend, crypto news support, copyright takedown, platform support',
  },
  ur: {
    title:       'ہم سے رابطہ کریں | CryptoNewsTrend',
    description: 'CryptoNewsTrend سے رابطہ کریں عام سوالات، کاپی رائٹ مسائل یا تکنیکی مدد کے لیے۔ ہم 24 گھنٹوں میں جواب دیتے ہیں۔',
    keywords:    'رابطہ, کرپٹو سپورٹ, مدد',
  },
  ar: {
    title:       'اتصل بنا | CryptoNewsTrend',
    description: 'تواصل مع CryptoNewsTrend للاستفسارات العامة أو مشكلات حقوق النشر أو الدعم الفني. نرد خلال 24 ساعة.',
    keywords:    'اتصل بنا, دعم العملاء, أخبار العملات المشفرة',
  },
  ru: {
    title:       'Связаться с нами | CryptoNewsTrend',
    description: 'Свяжитесь с CryptoNewsTrend по общим вопросам, авторским правам или технической поддержке. Отвечаем в течение 24 часов.',
    keywords:    'связаться, поддержка, крипто новости',
  },
  es: {
    title:       'Contáctanos | CryptoNewsTrend',
    description: 'Contacta con CryptoNewsTrend para consultas generales, derechos de autor o soporte técnico. Respondemos en 24 horas.',
    keywords:    'contacto, soporte cripto, ayuda',
  },
  fr: {
    title:       'Contactez-nous | CryptoNewsTrend',
    description: "Contactez CryptoNewsTrend pour des questions générales, des problèmes de droits d'auteur ou un support technique. Réponse sous 24h.",
    keywords:    'contact, support crypto, aide',
  },
  de: {
    title:       'Kontakt | CryptoNewsTrend',
    description: 'Kontaktieren Sie CryptoNewsTrend für allgemeine Anfragen, Urheberrechtsprobleme oder technischen Support. Wir antworten innerhalb von 24 Stunden.',
    keywords:    'Kontakt, Krypto Support, Hilfe',
  },
  'zh-CN': {
    title:       '联系我们 | CryptoNewsTrend',
    description: '联系 CryptoNewsTrend，咨询一般问题、版权问题或技术支持。我们将在24小时内回复。',
    keywords:    '联系我们, 加密货币支持, 帮助',
  },
};

// ── UTILITY ──────────────────────────────────────────────────
const getCleanUrl = (locale) => {
  const path = '/contact-us';
  return locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
};

const getLocaleMeta = (locale) => META[locale] || META['en'];

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = getCleanUrl(locale);

  // ✅ zh-CN → zh-Hans hreflang fix
  const languages = Object.fromEntries([
    ...Object.keys(META).map((l) => [HREFLANG_MAP[l] || l, getCleanUrl(l)]),
    ['x-default', getCleanUrl('en')],
  ]);

  return {
    title:       meta.title,
    description: meta.description,
    keywords:    meta.keywords,
    alternates: {
      canonical: pageUrl,
      languages,
    },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         pageUrl,
      siteName:    SITE_NAME,
      locale:      OG_LOCALE_MAP[locale] || 'en_US',
      type:        'website',
      images: [{
        url:    `${BASE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    `Contact ${SITE_NAME}`,
      }],
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
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },
  };
}

// ── Page Component ────────────────────────────────────────────
export default async function ContactServerPage({ params }) {
  const { locale } = await params;
  const meta       = getLocaleMeta(locale);
  const pageUrl    = getCleanUrl(locale);

  // ✅ ContactPage + BreadcrumbList Schema
  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'ContactPage',
    name:          meta.title,
    description:   meta.description,
    url:           pageUrl,
    inLanguage:    locale,
    publisher: {
      '@type': 'Organization',
      name:    SITE_NAME,
      logo:    { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      {
        '@type':  'ListItem',
        position: 1,
        name:     'Home',
        item:     locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`,
      },
      {
        '@type':  'ListItem',
        position: 2,
        name:     'Contact Us',
        item:     pageUrl,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ContactPage />
    </>
  );
}