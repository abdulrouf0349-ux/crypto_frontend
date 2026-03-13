'use client';
// app/[locale]/article/[slug]/ArticleSlugClient.jsx  →  CLIENT COMPONENT
import { FiClock, FiUser, FiShare2, FiTag, FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// ─────────────────────────────────────────────
// CATEGORY BADGE COLORS
// ─────────────────────────────────────────────
const CATEGORY_STYLE = {
  news:       'bg-blue-50 text-blue-600 border-blue-100',
  analysis:   'bg-purple-50 text-purple-600 border-purple-100',
  prediction: 'bg-orange-50 text-orange-600 border-orange-100',
  guide:      'bg-green-50 text-green-600 border-green-100',
  bitcoin:    'bg-yellow-50 text-yellow-600 border-yellow-100',
  ethereum:   'bg-indigo-50 text-indigo-600 border-indigo-100',
  defi:       'bg-cyan-50 text-cyan-600 border-cyan-100',
  nft:        'bg-pink-50 text-pink-600 border-pink-100',
  default:    'bg-slate-50 text-slate-600 border-slate-100',
};

function getCategoryStyle(cat) {
  return CATEGORY_STYLE[cat?.toLowerCase()] || CATEGORY_STYLE.default;
}

// ─────────────────────────────────────────────
// SHARE BUTTON
// ─────────────────────────────────────────────
function ShareBtn({ title, url }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert('Link copied!');
    }
  };
  return (
    <button
      onClick={handleShare}
      aria-label="Share this article"
      className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
    >
      <FiShare2 size={15} aria-hidden="true" />
      Share
    </button>
  );
}

// ─────────────────────────────────────────────
// MAIN CLIENT COMPONENT
// ─────────────────────────────────────────────
export default function ArticleSlugClient({
  initialData,
  locale,
  slug,
  dict,
  canonicalUrl,
  publishedTime,
}) {
  const article = initialData;
 if (!article) return notFound();

  const image      = article.main_image || '/og-image.png';
  const authorName = article.author || "CryptoNewsTrend Editorial";

  // ── Format date display ───────────────────────────────────
  const displayDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <article className="min-h-screen bg-white font-sans selection:bg-indigo-100 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-white pt-10 md:pt-16 pb-6 md:pb-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6"
          >
            <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">
              {dict?.home || 'Home'}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/articles`} className="hover:text-indigo-600 transition-colors">
              Articles
            </Link>
            <span aria-hidden="true">/</span>
            <span className={`px-3 py-1 rounded-full border text-[10px] ${getCategoryStyle(article.category)}`}>
              {article.category || 'Article'}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-slate-900 text-2xl md:text-4xl lg:text-5xl leading-tight font-black tracking-tight mb-8">
            {article.title}
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100">
            <div className="flex items-center gap-6 flex-wrap">

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUser size={14} className="text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Author</p>
                  <p className="text-xs font-bold text-slate-900">{authorName}</p>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

              {/* Date */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiClock size={14} className="text-indigo-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Published</p>
                  <time dateTime={publishedTime} className="text-xs font-bold text-slate-900">
                    {displayDate}
                  </time>
                </div>
              </div>

            </div>

            {/* Share */}
            <ShareBtn title={article.title} url={canonicalUrl} />
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">

        {/* Featured Image */}
        <figure className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl shadow-indigo-100/40 mb-10 md:mb-16 border border-slate-100">
          <Image
            src={image}
            alt={article.title}
            fill
            priority
            className="object-cover hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        </figure>

        {/* Article Body — HTML from Django RichText */}
   <div className="article-content-area max-w-none w-full">
  <style jsx global>{`
    /* 1. Base Text, Paragraphs & Spacing */
    .article-content-area p {
      line-height: 2.2 !important;
      font-size: 18px !important;
      color: #334155 !important;
      margin-bottom: 28px !important;
    }

    /* 2. Headings (H1 - H4) */
    .article-content-area h1, .article-content-area h2 {
      font-size: 2.4rem !important;
      font-weight: 900 !important;
      color: #0f172a !important;
      margin-top: 55px !important;
      margin-bottom: 10px !important;
      line-height: 1.3 !important;
      letter-spacing: -0.02em !important;
    }
      .article-content-area p:empty {
  display: none !important;
}
  /* 1. Tamam faltu <br> tags ko hide karne ke liye */
.article-content-area br {
  display: none !important;
}

/* 2. Khali paragraphs jo space le rahe hain unhain khatam karein */
.article-content-area p:empty {
  display: none !important;
}

/* 3. Agar <p> ke andar sirf space ho to usay bhi control karein */
.article-content-area p {
  margin-top: 0 !important;
  margin-bottom: 20px !important; /* Sirf nichli side par space rakhein */
}
    .article-content-area h3 {
      font-size: 1.8rem !important;
      font-weight: 800 !important;
      margin-top: 40px !important;
      margin-bottom: 18px !important;
    }
.article-content-area mark {
      background-color: #fef08a !important; /* Soft Yellow Highlight */
      color: #1e1b4b !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
    }
    
    .article-content-area code {
      background-color: #f1f5f9 !important;
      color: #e11d48 !important; /* Rose color for code */
      padding: 3px 8px !important;
      border-radius: 6px !important;
      font-family: 'Courier New', monospace !important;
      font-size: 16px !important;
    }

    .article-content-area time {
      color: #64748b !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
    }

    /* 3. Interactive Tags (FAQs ke liye best) */
    .article-content-area details {
      background: #f8fafc !important;
      padding: 15px !important;
      border-radius: 12px !important;
      border: 1px solid #e2e8f0 !important;
      margin-bottom: 20px !important;
    }
    .article-content-area summary {
      font-weight: 800 !important;
      cursor: pointer !important;
      color: #4f46e5 !important;
      outline: none !important;
    }

    /* 4. Formatting Extras */
    .article-content-area del {
      color: #94a3b8 !important;
      text-decoration: line-through !important;
    }
    
    .article-content-area ins {
      color: #059669 !important;
      text-decoration: underline !important;
      background: #ecfdf5 !important;
    }

    /* 5. Subscript & Superscript (H2O ya 1st ke liye) */
    .article-content-area sub, .article-content-area sup {
      font-size: 12px !important;
      color: #4f46e5 !important;
    }

    /* 6. Figure & Captions (Images ke sath text) */
    .article-content-area figure {
      margin: 10px 0 !important;
      text-align: center !important;
    }
    .article-content-area figcaption {
      font-size: 14px !important;
      color: #64748b !important;
      margin-top: 10px !important;
      font-style: italic !important;
    }
    /* 3. Links (<a> Tag) - Super VIP Style */
    .article-content-area a {
      color: #4f46e5 !important; /* Indigo color */
      text-decoration: none !important;
      font-weight: 700 !important;
      border-bottom: 2px solid #e0e7ff !important;
      transition: all 0.2s ease !important;
    }
    .article-content-area a:hover {
      background-color: #f5f3ff !important;
      border-bottom-color: #4f46e5 !important;
    }

    /* 4. Images & Captions */
    .article-content-area img {
      width: 100% !important;
      height: auto !important;
      border-radius: 20px !important;
      margin: 40px 0 !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
    }

    /* 5. Lists (ul, ol, li) */
    .article-content-area ul, .article-content-area ol {
      margin-bottom: 30px !important;
      padding-left: 28px !important;
    }
    .article-content-area li {
      line-height: 2 !important;
      font-size: 18px !important;
      color: #334155 !important;
      margin-bottom: 12px !important;
    }

    /* 6. Tables (Market Rates) */
    .article-content-area table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      margin: 3px 0 !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }
    .article-content-area th {
      background-color: #f8fafc !important;
      padding: 16px !important;
      font-weight: 800 !important;
      border-bottom: 2px solid #e2e8f0 !important;
    }
    .article-content-area td {
      padding: 16px !important;
      border-bottom: 1px solid #f1f5f9 !important;
    }

    /* 7. Blockquotes & Horizontal Lines */
    .article-content-area blockquote {
      border-left: 6px solid #4f46e5 !important;
      background: #f8fafc !important;
      padding: 25px 30px !important;
      margin: 40px 0 !important;
      font-style: italic !important;
      border-radius: 0 15px 15px 0 !important;
    }
    .article-content-area hr {
      border: 0 !important;
      border-top: 2px solid #f1f5f9 !important;
      margin: 50px 0 !important;
    }

    /* 8. Bold / Strong Fix */
    .article-content-area strong {
      font-weight: 900 !important;
      color: #1e1b4b !important;
    }
  `}</style>

  <div
    dangerouslySetInnerHTML={{ 
      __html: article.content 
        ? article.content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/&nbsp;/g, ' ') 
        : '' 
    }} 
  />
</div>

        {/* ── Category + Share Footer ── */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiTag size={16} className="text-slate-400" aria-hidden="true" />
            <span className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase ${getCategoryStyle(article.category)}`}>
              {article.category || 'Article'}
            </span>
          </div>
          <ShareBtn title={article.title} url={canonicalUrl} />
        </div>

        {/* ── Back to Articles ── */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`/${locale}/article`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 !text-white font-black rounded-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <FiArrowLeft size={16} aria-hidden="true" />
            Back to Articles
          </Link>
        </div>

      </main>
    </article>
  );
}