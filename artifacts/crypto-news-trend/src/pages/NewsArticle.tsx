import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Clock, Tag, Share2, Twitter, Facebook, Link2, Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockNews } from "@/lib/mockData";
import { myArticles } from "@/lib/articles";
import { motion } from "framer-motion";
import { useState } from "react";

const SITE_URL = "https://cryptonewstrend.com";
const SITE_NAME = "CryptoNewsTrend";
const TWITTER_HANDLE = "@cryptonewstrend";

function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h2 key={i} className="text-xl md:text-2xl font-display font-bold mt-10 mb-4 text-foreground">
          {block.replace(/\*\*/g, "")}
        </h2>
      );
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-semibold text-foreground">{p.replace(/\*\*/g, "")}</strong>
          ) : p
        )}
      </p>
    );
  });
}

export default function NewsArticle() {
  const params = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const allArticles = [...myArticles, ...mockNews];
  const article = allArticles.find((n) => n.slug === params.slug);

  const copyLink = () => {
    navigator.clipboard.writeText(`${SITE_URL}/news/${params.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to News</Button>
        </Link>
      </div>
    );
  }

  const related = article.relatedIds
    .map((id) => allArticles.find((n) => n.id === id))
    .filter(Boolean) as typeof mockNews;

  const canonicalUrl = `${SITE_URL}/news/${article.slug}`;
  const publishedDate = new Date(article.date).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.imageUrl],
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    wordCount: article.body.split(" ").length,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 3, name: article.category, item: `${SITE_URL}/?cat=${article.category}` },
      { "@type": "ListItem", position: 4, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | {SITE_NAME}</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.keywords.join(", ")} />
        <meta name="author" content={article.author.name} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:modified_time" content={publishedDate} />
        <meta property="article:author" content={article.author.name} />
        <meta property="article:section" content={article.category} />
        {article.keywords.map((kw) => (
          <meta key={kw} property="article:tag" content={kw} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.imageUrl} />

        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="min-h-screen">
        {/* Hero Image */}
        <div className="relative w-full h-[28vh] md:h-[35vh] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/" className="hover:text-foreground transition-colors">News</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-purple-500">{article.category}</span>
            </nav>

            {/* Category + Breaking badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0 uppercase text-[10px] tracking-wider">
                {article.category}
              </Badge>
              {article.isBreaking && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 uppercase text-[10px] tracking-wider">
                  BREAKING
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {article.tag}
              </Badge>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6"
            >
              {article.title}
            </motion.h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-medium">
              {article.excerpt}
            </p>

            {/* Author + Meta row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-border mb-10">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full ring-2 ring-purple-500/30 object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{article.author.name}</p>
                  <p className="text-xs text-muted-foreground">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <span title={format(new Date(article.date), "PPP p")}>
                  {format(new Date(article.date), "MMM d, yyyy")}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min read
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />

                {/* Share buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(canonicalUrl)}&via=cryptonewstrend`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="hover:text-[#1DA1F2] transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="hover:text-[#1877F2] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <button
                    onClick={copyLink}
                    aria-label="Copy link"
                    className="hover:text-purple-400 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Article body */}
            <div className="prose-container max-w-none mb-14">
              {renderBody(article.body)}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-border mb-14">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {article.keywords.slice(0, 6).map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-purple-500/20 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  #{kw}
                </span>
              ))}
            </div>

            {/* Author bio card */}
            <Card className="mb-14 bg-card border-border">
              <CardContent className="p-6 flex gap-4 items-start">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full ring-2 ring-purple-500/30 object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-bold text-lg">{article.author.name}</p>
                    <Badge variant="outline" className="text-[10px]">{article.author.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.author.name} is a seasoned analyst covering digital assets, blockchain infrastructure, and macroeconomic trends impacting the crypto market. Their work has been featured across leading industry publications and research platforms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {related.length > 0 && (
              <section aria-label="Related Articles">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-orange-500" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((rel, i) => (
                    <motion.div
                      key={rel.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link href={`/news/${rel.slug}`} className="group block">
                        <div className="rounded-xl overflow-hidden border border-border hover:border-purple-500/50 transition-colors bg-card h-full flex flex-col">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={rel.thumbnailUrl}
                              alt={rel.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <Badge className="bg-purple-600/20 text-purple-400 border-0 text-[10px] mb-2 self-start uppercase">
                              {rel.category}
                            </Badge>
                            <h3 className="font-display font-semibold text-sm line-clamp-3 group-hover:text-purple-500 transition-colors mb-auto">
                              {rel.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground font-mono">
                              <Clock className="w-3 h-3" />
                              {rel.readTime} min read
                              <span className="ml-auto">{formatDistanceToNow(new Date(rel.date), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Back to news */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
