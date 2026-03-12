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
        <div
          className="
            prose prose-slate max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50 prose-blockquote:rounded-xl prose-blockquote:py-1
            prose-strong:text-slate-900
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-slate-700
            prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded prose-code:text-sm
          "
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />

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
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <FiArrowLeft size={16} aria-hidden="true" />
            Back to Articles
          </Link>
        </div>

      </main>
    </article>
  );
}