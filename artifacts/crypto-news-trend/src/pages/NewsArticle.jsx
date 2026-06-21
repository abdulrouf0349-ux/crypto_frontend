// // src/pages/NewsArticle.jsx
// // ✅ FIX #3: Server component — only ShareButtons is client
// import Link from "next/link";
// import { format } from "date-fns";
// import { ArrowLeft, Clock, Tag, Share2, ChevronRight } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import ShareButtons from "@/components/ShareButtons";

// const SITE_URL = "https://cryptonewstrend.com";

// // ── Translated breadcrumb labels ──
// const BREADCRUMB_NEWS_LABEL = {
//   en: "News", ur: "خبریں", ar: "الأخبار",
//   es: "Noticias", fr: "Actualités", de: "Nachrichten",
//   ru: "Новости", zh: "新闻",
// };

// const BACK_LABEL = {
//   en: "Back to All News",
//   ur: "تمام خبروں پر واپس جائیں",
//   ar: "العودة إلى جميع الأخبار",
//   es: "Volver a todas las noticias",
//   fr: "Retour aux actualités",
//   de: "Zurück zu allen Nachrichten",
//   ru: "Назад ко всем новостям",
//   zh: "返回所有新闻",
// };

// const RELATED_LABEL = {
//   en: "Related Crypto Insights",
//   ur: "متعلقہ مضامین",
//   ar: "مقالات ذات صلة",
//   es: "Noticias Relacionadas",
//   fr: "Articles Connexes",
//   de: "Verwandte Artikel",
//   ru: "Похожие Статьи",
//   zh: "相关文章",
// };

// const UPDATED_LABEL = {
//   en: "Updated",
//   ur: "اپ ڈیٹ",
//   ar: "تم التحديث",
//   es: "Actualizado",
//   fr: "Mis à jour",
//   de: "Aktualisiert",
//   ru: "Обновлено",
//   zh: "更新于",
// };

// // ── Slugify helper for tag links ──
// // ✅ FIX #7: tag links for internal linking
// function slugify(str = "") {
//   return str
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .trim();
// }

// // ── Body renderer — server-safe, no framer-motion ──
// // ✅ FIX #4: removed framer-motion, CSS animation only
// // ── Body renderer — server-safe, reliable parsing ──
// function renderDynamicBody(bodyText) {
//   if (!bodyText) return null;

//   // HTML ٹیگز کو صاف کریں (اگر موجود ہوں)
//   const cleanText = bodyText.replace(/<\/?[^>]+(>|$)/g, "").trim();

//   // سنگل یا ڈبل نیو لائن دونوں کو ہینڈل کرنے کے لیے split کریں
//   const blocks = cleanText.split(/\n+/);

//   return blocks.map((block, i) => {
//     const trimmedBlock = block.trim();
//     if (!trimmedBlock) return null;

//     // اگر پورا بلاک ہی بولڈ ہے تو اسے ہیڈنگ (H2) بنا دیں
//     if (trimmedBlock.startsWith("**") && trimmedBlock.endsWith("**")) {
//       return (
//         <h2
//           key={i}
//           className="text-xl md:text-2xl font-display font-bold mt-8 mb-4 text-foreground"
//         >
//           {trimmedBlock.replace(/\*\*/g, "")}
//         </h2>
//       );
//     }

//     // پیراگراف کے اندر موجود **text** کو بولڈ کرنے کے لیے
//     const parts = trimmedBlock.split(/(\*\*[^*]+\*\*)/g);
//     return (
//       <p
//         key={i}
//         className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6"
//       >
//         {parts.map((p, j) =>
//           p.startsWith("**") && p.endsWith("**") ? (
//             <strong key={j} className="font-semibold text-foreground">
//               {p.replace(/\*\*/g, "")}
//             </strong>
//           ) : (
//             p
//           )
//         )}
//       </p>
//     );
//   });
// }

// export default function NewsArticle({ article, locale, related = [], readTime, authorUrl: authorUrlProp }) {
//   const currentLocale = locale || "en";
//   const isRtl = ["ur", "ar"].includes(currentLocale);

//   // ── Normalize fields ──
//   const imageUrl =
//     article.image ||
//     article.imageUrl ||
//     "https://cryptonewstrend.com/og-default.png";
//   const date = article.time || article.date || new Date().toISOString();
//   const body = article.description || article.excerpt || "";
//   const keywords = Array.isArray(article.keywords)
//     ? article.keywords
//     : ["Crypto", "Market"];

//   // ✅ FIX #14: use real readTime from page.jsx, fallback calc
//   const articleReadTime =
//     readTime || Math.max(1, Math.ceil(body.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).filter(Boolean).length / 200));

//   const author = {
//     name: article.author?.name || "CryptoNewsTrend Editorial Team",
//     role: article.author?.role || "Analyst",
//     avatar: article.author?.avatar || imageUrl,
//     // ✅ FIX #9: per-author URL passed from page.jsx
//     url: authorUrlProp || article.author?.url || `${SITE_URL}/team`,
//   };

//   const localizedSlug =
//     article[`slug_${currentLocale}`] || article.slug_en || article.slug;
//   const canonicalUrl =
//     currentLocale === "en"
//       ? `${SITE_URL}/news/${localizedSlug}`
//       : `${SITE_URL}/${currentLocale}/news/${localizedSlug}`;

//   const backHref = currentLocale === "en" ? "/" : `/${currentLocale}`;

//   // ✅ FIX #11: translated breadcrumb
//   const newsLabel = BREADCRUMB_NEWS_LABEL[currentLocale] || "News";

//   // ✅ FIX #12: related image with safe fallback
//   const buildRelatedUrl = (rel) => {
//     const relSlug =
//       rel[`slug_${currentLocale}`] || rel.slug_en || rel.slug;
//     return currentLocale === "en"
//       ? `/news/${relSlug}`
//       : `/${currentLocale}/news/${relSlug}`;
//   };

//   // ✅ FIX #18: show dateModified in UI when different from published
//   const dateModified = article.updated_at
//     ? new Date(article.updated_at).toISOString()
//     : null;
//   const showUpdated =
//     dateModified &&
//     dateModified.slice(0, 10) !== new Date(date).toISOString().slice(0, 10);

//   return (
//     <article
//       itemScope
//       itemType="https://schema.org/NewsArticle"
//       className="min-h-screen"
//     >
//       {/* Hero Image */}
//       <div className="relative w-full h-[28vh] md:h-[45vh] overflow-hidden">
//         <Image
//           src={imageUrl}
//           alt={article.title}
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
//       </div>

//       <div
//         className="container mx-auto px-4 -mt-20 relative z-10 pb-16"
//         dir={isRtl ? "rtl" : "ltr"}
//       >
//         <div className="max-w-4xl mx-auto">

//           {/* ✅ FIX #11: Translated breadcrumb nav */}
//           <nav
//             aria-label="Breadcrumb"
//             className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono"
//           >
//             <Link
//               href={backHref}
//               className="hover:text-foreground transition-colors"
//             >
//               {currentLocale === "ur"
//                 ? "ہوم"
//                 : currentLocale === "ar"
//                 ? "الرئيسية"
//                 : currentLocale === "es"
//                 ? "Inicio"
//                 : currentLocale === "fr"
//                 ? "Accueil"
//                 : currentLocale === "de"
//                 ? "Startseite"
//                 : currentLocale === "ru"
//                 ? "Главная"
//                 : currentLocale === "zh"
//                 ? "首页"
//                 : "Home"}
//             </Link>
//             <ChevronRight
//               className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`}
//             />
//             <Link
//               href={
//                 currentLocale === "en" ? "/news" : `/${currentLocale}/news`
//               }
//               className="hover:text-foreground transition-colors"
//             >
//               {newsLabel}
//             </Link>
//             <ChevronRight
//               className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`}
//             />
//             <span className="text-purple-500">{article.category}</span>
//             <ChevronRight
//               className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`}
//             />
//             <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-xs">
//               {article.title}
//             </span>
//           </nav>

//           {/* Badges */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0 uppercase text-[10px] tracking-wider">
//               {article.category}
//             </Badge>
//             {article.tag && article.tag !== article.category && (
//               <Badge
//                 variant="outline"
//                 className="text-[10px] uppercase tracking-wider"
//               >
//                 {article.tag}
//               </Badge>
//             )}
//           </div>

//           {/* ✅ FIX #4: CSS fade-in instead of framer-motion */}
//           <h1
//             id="article-title"
//             itemProp="headline"
//             style={{ animation: "fadeInUp 0.4s ease both" }}
//             className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
//               isRtl ? "font-sans text-right" : "font-display"
//             }`}
//           >
//             {article.title}
//           </h1>

//           {/* ✅ FIX #18: visible dateModified for Google */}
//           {showUpdated && (
//             <p className="text-xs text-muted-foreground mb-4 font-mono">
//               <span className="text-purple-400">{UPDATED_LABEL[currentLocale] || "Updated"}:</span>{" "}
//               <time dateTime={dateModified} suppressHydrationWarning>
//                 {format(new Date(dateModified), "MMM d, yyyy")}
//               </time>
//             </p>
//           )}

//           {/* Author + Meta + Share */}
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-border mb-10">
//             <div className="flex items-center gap-3">
//               <Image
//                 src={author.avatar}
//                 alt={author.name}
//                 width={40}
//                 height={40}
//                 className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 object-cover"
//               />
//               <div>
//                 {/* ✅ FIX #9: links to author-specific URL */}
//                 <Link
//                   href={author.url}
//                   className="font-semibold text-sm hover:text-purple-500 transition-colors"
//                   rel="author"
//                   itemProp="author"
//                 >
//                   {author.name}
//                 </Link>
//                 <p className="text-xs text-muted-foreground">{author.role}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono flex-wrap">
//               {/* ✅ machine-readable datePublished */}
//               <time
//                 dateTime={new Date(date).toISOString()}
//                 itemProp="datePublished"
//                 suppressHydrationWarning
//               >
//                 {format(new Date(date), "MMM d, yyyy")}
//               </time>
//               <span className="w-1 h-1 rounded-full bg-border" />
//               <span className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 {/* ✅ FIX #14: real read time */}
//                 {articleReadTime} min read
//               </span>
//               <span className="w-1 h-1 rounded-full bg-border" />
//               {/* ✅ FIX #3: only share buttons are client-side */}
//               <ShareButtons canonicalUrl={canonicalUrl} title={article.title} />
//             </div>
//           </div>

//           {/* ✅ Article body */}
//           <section
//             className={`prose-container max-w-none mb-14 text-foreground ${
//               isRtl ? "text-right" : "text-left"
//             }`}
//             itemProp="articleBody"
//           >
//             {renderDynamicBody(body)}
//           </section>

//           {/* ✅ FIX #7: keyword tags as internal links */}
//           <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-border mb-14">
//             <Tag className="w-4 h-4 text-muted-foreground" />
//             {keywords.map((kw) => (
//               <Link
//                 key={kw}
//                 href={
//                   currentLocale === "en"
//                     ? `/tag/${slugify(kw)}`
//                     : `/${currentLocale}/tag/${slugify(kw)}`
//                 }
//                 className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-purple-600 hover:text-white transition-colors"
//                 rel="tag"
//               >
//                 #{kw}
//               </Link>
//             ))}
//           </div>

//           {/* Related Articles */}
//           {related.length > 0 && (
//             <section aria-label="Related Crypto News Articles">
//               <h2
//                 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
//                   isRtl ? "font-sans text-right" : "font-display"
//                 }`}
//               >
//                 <Share2 className="w-5 h-5 text-orange-500" />
//                 {RELATED_LABEL[currentLocale] || "Related Crypto Insights"}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {related.map((rel, i) => (
//                   // ✅ FIX #4: CSS animation instead of framer-motion
//                   <div
//                     key={rel.id}
//                     style={{
//                       animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
//                     }}
//                   >
//                     <Link href={buildRelatedUrl(rel)} className="group block">
//                       <div className="rounded-xl overflow-hidden border border-border hover:border-purple-500/50 transition-colors bg-card h-full flex flex-col">
//                         <div className="aspect-video overflow-hidden relative">
//                           {/* ✅ FIX #12: safe image fallback */}
//                           <Image
//                             src={
//                               rel.thumbnailUrl ||
//                               rel.imageUrl ||
//                               "/fallback.jpg"
//                             }
//                             alt={`${rel.title} — ${rel.category || "Crypto"}`}
//                             fill
//                             sizes="(max-width:768px) 100vw, 33vw"
//                             className="object-cover transition-transform duration-500 group-hover:scale-105"
//                           />
//                         </div>
//                         <div className="p-4 flex flex-col flex-grow">
//                           <Badge className="bg-purple-600/20 text-purple-400 border-0 text-[10px] mb-2 self-start uppercase">
//                             {rel.category}
//                           </Badge>
//                           {/* ✅ FIX #8: h3 wraps Link, not the other way */}
//                           <h3
//                             className={`font-semibold text-sm mb-auto ${
//                               isRtl ? "text-right" : ""
//                             }`}
//                           >
//                             <span className="line-clamp-3 group-hover:text-purple-500 transition-colors">
//                               {rel.title}
//                             </span>
//                           </h3>
//                           <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground font-mono">
//                             <Clock className="w-3 h-3" />
//                             {rel.readTime} min read
//                             <span
//                               className="ml-auto"
//                               suppressHydrationWarning
//                             >
//                               {/* ✅ FIX #13: absolute date avoids hydration mismatch */}
//                               {rel.date
//                                 ? format(new Date(rel.date), "MMM d, yyyy")
//                                 : ""}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Back Button */}
//           <div className="mt-12 pt-8 border-t border-border">
//             <Link href={backHref}>
//               <Button variant="outline" className="gap-2">
//                 <ArrowLeft
//                   className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
//                 />
//                 {BACK_LABEL[currentLocale] || "Back to All News"}
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* ✅ FIX #4: CSS animations replacing framer-motion — zero extra JS */}
//       <style>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           * { animation: none !important; }
//         }
//       `}</style>
//     </article>
//   );
// }


// src/pages/NewsArticle.jsx
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, Tag, Share2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ShareButtons from "@/components/ShareButtons";

const SITE_URL = "https://cryptonewstrend.com";

const BREADCRUMB_NEWS_LABEL = {
  en: "News", ur: "خبریں", ar: "الأخبار",
  es: "Noticias", fr: "Actualités", de: "Nachrichten",
  ru: "Новости", zh: "新闻",
};

const BACK_LABEL = {
  en: "Back to All News",
  ur: "تمام خبروں پر واپس جائیں",
  ar: "العودة إلى جميع الأخبار",
  es: "Volver a todas las noticias",
  fr: "Retour aux actualités",
  de: "Zurück zu allen Nachrichten",
  ru: "Назад ко всем новостям",
  zh: "返回所有新闻",
};

const RELATED_LABEL = {
  en: "Related Crypto Insights",
  ur: "متعلقہ مضامین",
  ar: "مقالات ذات صلة",
  es: "Noticias Relacionadas",
  fr: "Articles Connexes",
  de: "Verwandte Artikel",
  ru: "Похожие Статьи",
  zh: "相关文章",
};

const UPDATED_LABEL = {
  en: "Updated",
  ur: "اپ ڈیٹ",
  ar: "تم التحديث",
  es: "Actualizado",
  fr: "Mis à jour",
  de: "Aktualisiert",
  ru: "Обновлено",
  zh: "更新于",
};

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function renderDynamicBody(bodyText) {
  if (!bodyText) return null;

  const cleanText = bodyText.replace(/<\/?[^>]+(>|$)/g, "").trim();
  const blocks = cleanText.split(/\n+/);

  return blocks.map((block, i) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return null;

    if (trimmedBlock.startsWith("**") && trimmedBlock.endsWith("**")) {
      return (
        <h2
          key={i}
          className="text-xl md:text-2xl font-display font-bold mt-8 mb-4 text-foreground"
        >
          {trimmedBlock.replace(/\*\*/g, "")}
        </h2>
      );
    }

    const parts = trimmedBlock.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p
        key={i}
        className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6"
      >
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-semibold text-foreground">
              {p.replace(/\*\*/g, "")}
            </strong>
          ) : (
            p
          )
        )}
      </p>
    );
  });
}

// ✅ FIX: article undefined hone par null return — prerender crash rokta hai
export default function NewsArticle({ article, locale, related = [], readTime, authorUrl: authorUrlProp }) {
  if (!article) return null;

  const currentLocale = locale || "en";
  const isRtl = ["ur", "ar"].includes(currentLocale);

  const imageUrl =
    article.image ||
    article.imageUrl ||
    "https://cryptonewstrend.com/og-default.png";
  const date = article.time || article.date || new Date().toISOString();
  const body = article.description || article.excerpt || "";
  const keywords = Array.isArray(article.keywords)
    ? article.keywords
    : ["Crypto", "Market"];

  const articleReadTime =
    readTime || Math.max(1, Math.ceil(body.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).filter(Boolean).length / 200));

  const author = {
    name: article.author?.name || "CryptoNewsTrend Editorial Team",
    role: article.author?.role || "Analyst",
    avatar: article.author?.avatar || imageUrl,
    url: authorUrlProp || article.author?.url || `${SITE_URL}/team`,
  };

  const localizedSlug =
    article[`slug_${currentLocale}`] || article.slug_en || article.slug;
  const canonicalUrl =
    currentLocale === "en"
      ? `${SITE_URL}/news/${localizedSlug}`
      : `${SITE_URL}/${currentLocale}/news/${localizedSlug}`;

  const backHref = currentLocale === "en" ? "/" : `/${currentLocale}`;
  const newsLabel = BREADCRUMB_NEWS_LABEL[currentLocale] || "News";

  const buildRelatedUrl = (rel) => {
    const relSlug = rel[`slug_${currentLocale}`] || rel.slug_en || rel.slug;
    return currentLocale === "en"
      ? `/news/${relSlug}`
      : `/${currentLocale}/news/${relSlug}`;
  };

  const dateModified = article.updated_at
    ? new Date(article.updated_at).toISOString()
    : null;
  const showUpdated =
    dateModified &&
    dateModified.slice(0, 10) !== new Date(date).toISOString().slice(0, 10);

  return (
    <article
      itemScope
      itemType="https://schema.org/NewsArticle"
      className="min-h-screen"
    >
      {/* Hero Image */}
      <div className="relative w-full h-[28vh] md:h-[45vh] overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div
        className="container mx-auto px-4 -mt-20 relative z-10 pb-16"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono"
          >
            <Link href={backHref} className="hover:text-foreground transition-colors">
              {currentLocale === "ur" ? "ہوم"
                : currentLocale === "ar" ? "الرئيسية"
                : currentLocale === "es" ? "Inicio"
                : currentLocale === "fr" ? "Accueil"
                : currentLocale === "de" ? "Startseite"
                : currentLocale === "ru" ? "Главная"
                : currentLocale === "zh" ? "首页"
                : "Home"}
            </Link>
            <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
            <Link
              href={currentLocale === "en" ? "/news" : `/${currentLocale}/news`}
              className="hover:text-foreground transition-colors"
            >
              {newsLabel}
            </Link>
            <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
            <span className="text-purple-500">{article.category}</span>
            <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
            <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0 uppercase text-[10px] tracking-wider">
              {article.category}
            </Badge>
            {article.tag && article.tag !== article.category && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {article.tag}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1
            id="article-title"
            itemProp="headline"
            style={{ animation: "fadeInUp 0.4s ease both" }}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${
              isRtl ? "font-sans text-right" : "font-display"
            }`}
          >
            {article.title}
          </h1>

          {/* Updated date */}
          {showUpdated && (
            <p className="text-xs text-muted-foreground mb-4 font-mono">
              <span className="text-purple-400">{UPDATED_LABEL[currentLocale] || "Updated"}:</span>{" "}
              <time dateTime={dateModified} suppressHydrationWarning>
                {format(new Date(dateModified), "MMM d, yyyy")}
              </time>
            </p>
          )}

          {/* Author + Meta + Share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-border mb-10">
            <div className="flex items-center gap-3">
              <Image
                src={author.avatar}
                alt={author.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 object-cover"
              />
              <div>
                <Link
                  href={author.url}
                  className="font-semibold text-sm hover:text-purple-500 transition-colors"
                  rel="author"
                  itemProp="author"
                >
                  {author.name}
                </Link>
                <p className="text-xs text-muted-foreground">{author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono flex-wrap">
              <time
                dateTime={new Date(date).toISOString()}
                itemProp="datePublished"
                suppressHydrationWarning
              >
                {format(new Date(date), "MMM d, yyyy")}
              </time>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {articleReadTime} min read
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <ShareButtons canonicalUrl={canonicalUrl} title={article.title} />
            </div>
          </div>

          {/* Article Body */}
          <section
            className={`prose-container max-w-none mb-14 text-foreground ${
              isRtl ? "text-right" : "text-left"
            }`}
            itemProp="articleBody"
          >
            {renderDynamicBody(body)}
          </section>

          {/* Keyword Tags */}
          <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-border mb-14">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {keywords.map((kw) => (
              <Link
                key={kw}
                href={
                  currentLocale === "en"
                    ? `/tag/${slugify(kw)}`
                    : `/${currentLocale}/tag/${slugify(kw)}`
                }
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-purple-600 hover:text-white transition-colors"
                rel="tag"
              >
                #{kw}
              </Link>
            ))}
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section aria-label="Related Crypto News Articles">
              <h2
                className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                  isRtl ? "font-sans text-right" : "font-display"
                }`}
              >
                <Share2 className="w-5 h-5 text-orange-500" />
                {RELATED_LABEL[currentLocale] || "Related Crypto Insights"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel, i) => (
                  <div
                    key={rel.id}
                    style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}
                  >
                    <Link href={buildRelatedUrl(rel)} className="group block">
                      <div className="rounded-xl overflow-hidden border border-border hover:border-purple-500/50 transition-colors bg-card h-full flex flex-col">
                        <div className="aspect-video overflow-hidden relative">
                          <Image
                            src={rel.thumbnailUrl || rel.imageUrl || "/fallback.jpg"}
                            alt={`${rel.title} — ${rel.category || "Crypto"}`}
                            fill
                            sizes="(max-width:768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <Badge className="bg-purple-600/20 text-purple-400 border-0 text-[10px] mb-2 self-start uppercase">
                            {rel.category}
                          </Badge>
                          <h3 className={`font-semibold text-sm mb-auto ${isRtl ? "text-right" : ""}`}>
                            <span className="line-clamp-3 group-hover:text-purple-500 transition-colors">
                              {rel.title}
                            </span>
                          </h3>
                          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground font-mono">
                            <Clock className="w-3 h-3" />
                            {rel.readTime} min read
                            <span className="ml-auto" suppressHydrationWarning>
                              {rel.date ? format(new Date(rel.date), "MMM d, yyyy") : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back Button */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link href={backHref}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                {BACK_LABEL[currentLocale] || "Back to All News"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </article>
  );
}