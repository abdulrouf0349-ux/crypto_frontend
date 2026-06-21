// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { formatDistanceToNow } from "date-fns";
// import { Copy, TrendingUp, Check, Loader2 } from "lucide-react"; 
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { NEWS_CATEGORIES } from "@/lib/mockData";
// import { motion } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import Image from "next/image";
// import Page_NewsData from "@/lib/api/Page_NewsData";

// const CAT_KEYS = {
//   ALL: "home.filterAll",
//   BITCOIN: "home.bitcoin",
//   ETHEREUM: "home.ethereum",
//   BLOCKCHAIN: "home.blockchain",
//   DEFI: "home.defi",
//   NFTS: "home.nfts",
//   CRYPTOCURRENCY: "home.cryptocurrency",
//   ALTCOIN: "home.altcoin",
//   STAKING: "home.staking",
//   DAO: "home.dao",
//   MINING: "home.mining",
// };

// export default function HomeClientView({ initialAllNews, featured, topStories, locale }) {
//   const { t } = useTranslation();
  
//   const sanitizeInitialNews = (newsArray) => {
//     if (!Array.isArray(newsArray)) return [];
//     return newsArray.map(item => ({
//       ...item,
//       category: String(item.category || "ALL").trim().toUpperCase()
//     }));
//   };

//   const [allNews, setAllNews] = useState(() => sanitizeInitialNews(initialAllNews));
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("ALL");
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [copied, setCopied] = useState(false);
// // ── LOCALE-BASED SLUG HELPER ──
// const getLocalizedSlug = (item) => {
//   if (!item) return "";

//   const localized = item[`slug_${locale}`];

//   if (localized && String(localized).trim()) {
//     return String(localized).trim();
//   }

//   return item.slug_en || item.slug || item.link || "";
// };

// const buildNewsUrl = (item) => {
//   const slug = getLocalizedSlug(item);

//   if (!locale || locale === "en") {
//     return `/news/${slug}`;
//   }

//   return `/${locale}/news/${slug}`;
// };


//   // Filter display listing
//   const filteredNews = allNews.filter((n) => {
//     const itemCategory = String(n.category || "").trim().toUpperCase();
//     const targetCategory = String(activeCategory).trim().toUpperCase();
//     return (targetCategory === "ALL" || itemCategory === targetCategory) && n.id !== featured?.id;
//   });

//   // ── 🔥 UPDATED FETCH ENGINE WITH DYNAMIC CATEGORY QUERY ──
//   const fetchNewsEngine = async (pageToFetch, targetCategory, shouldReset = false) => {
//     if (isLoading) return;
//     setIsLoading(true);

//     try {
//       // Pass both page and target category strictly to API
//       const apiResponse = await Page_NewsData(pageToFetch, locale, targetCategory);

//       let incomingResults = [];
//       if (apiResponse) {
//         if (apiResponse.results && Array.isArray(apiResponse.results)) {
//           incomingResults = apiResponse.results;
//         } else if (Array.isArray(apiResponse)) {
//           incomingResults = apiResponse;
//         } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
//           incomingResults = apiResponse.data;
//         }
//       }

//       if (incomingResults.length === 0) {
//         if (shouldReset) setAllNews([]); // Clear array if category is empty
//         setHasMore(false); 
//       } else {
//         const transformedNews = incomingResults.map((item, index) => {
//           const img = item.imageUrl || item.image || item.thumbnailUrl || item.thumb || "https://cryptonewstrend.com/media/crptonews-news/7bad29fe5d0bc0a5d12e0e0162a8bb56dc41b43c.jpg";
//           const dbCategory = String(item.category || item.tag || "ALL").trim().toUpperCase();

//           return {
//   ...item,                    // 🔥 saare slug_de, slug_ar preserve honge
//   id: item.id || item._id || `api-${targetCategory}-${pageToFetch}-${index}`,
//   title: item.title || item.heading || "No Title Available",
//   slug: item.slug || item.link || "",
//   imageUrl: img,
//   thumbnailUrl: img,
//   date: item.date || item.created_at || item.published_at || new Date().toISOString(),
//   category: dbCategory,
//   readTime: item.readTime || item.read_time || "3",
//   tag: dbCategory,
//   excerpt: item.excerpt || item.description || item.summary || ""
// };
//         });

//         setAllNews((prev) => {
//           if (shouldReset) return transformedNews; // Fresh category setup override
//           const existingIds = new Set(prev.map(n => n.id));
//           const uniques = transformedNews.filter(n => !existingIds.has(n.id));
//           return [...prev, ...uniques];
//         });
        
//         setCurrentPage(pageToFetch);
//         setHasMore(incomingResults.length >= 6); // Agar items kam hain to hasMore false ho jaye
//       }
//     } catch (error) {
//       console.error("[Fetch Engine Failure]:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ── 🔄 CLICK EVENT RESET & FIRE FUNCTION ──
//   const handleCategoryChange = async (category) => {
//     const selectedCatUpper = String(category).trim().toUpperCase();
//     setActiveCategory(selectedCatUpper);
//     setVisibleCount(6);

//     // Agar user wapas 'ALL' daba raha hai, reset into initial properties
//     if (selectedCatUpper === "ALL") {
//       setAllNews(sanitizeInitialNews(initialAllNews));
//       setCurrentPage(1);
//       setHasMore(true);
//       return;
//     }

//     // Nayi category ke liye page count 1 se fresh request maro backend ko
//     setHasMore(true);
//     await fetchNewsEngine(1, selectedCatUpper, true);
//   };

//   const handleLoadMoreClick = () => {
//     if (visibleCount < filteredNews.length) {
//       setVisibleCount((prev) => prev + 6);
//     } else {
//       fetchNewsEngine(currentPage + 1, activeCategory, false);
//     }
//   };

//   const copyAddress = () => {
//     navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const stripHtml = (htmlString) => {
//     if (!htmlString) return "";
//     return htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim();
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Featured Banner */}
//       {featured && (
//         <>
//          <h1 className="sr-only">
//       {t("home.pageHeading") || "Latest Crypto News — Bitcoin, Ethereum & Blockchain"}
//     </h1>
//         <article>
//           <Link href={buildNewsUrl(featured)}>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] rounded-xl overflow-hidden mb-12 group cursor-pointer"
//             >
//               <Image
//                 src={featured.thumbnailUrl || featured.imageUrl || "/fallback-news.jpg"}
//                 alt={featured.title}
//                 fill
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
//                 className="object-cover transition-transform duration-700 group-hover:scale-105"
//                 priority 
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 md:via-[#0d1117]/80 to-transparent" />
//               <div className="absolute bottom-0 left-0 p-3 sm:p-5 md:p-8 lg:p-10 w-full md:w-3/4">
//                 <div className="flex gap-2 mb-2 md:mb-4">
//                   <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
//                     {String(featured.category).toUpperCase()}
//                   </Badge>
//                   {featured.isBreaking && (
//                     <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
//                       {t("home.breaking")}
//                     </Badge>
//                   )}
//                 </div>
//                 <h2
//   className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 md:mb-4 leading-tight group-hover:text-purple-300 transition-colors"
// >
//   {featured.title}
// </h2>
//                 <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4">
//                   {stripHtml(featured.excerpt || featured.description || "")}
//                 </p>
//                 <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
//                   <span>{formatDistanceToNow(new Date(featured.date), { addSuffix: true })}</span>
//                   <span className="w-1 h-1 rounded-full bg-gray-600" />
//                   <span>{featured.readTime} {t("home.minRead")}</span>
//                 </div>
//               </div>
//             </motion.div>
//           </Link>
//         </article>
//         </>
//       )}

//       {/* Selector Swiper List */}
//       <ScrollArea className="w-full whitespace-nowrap mb-8 pb-4">
//         <div className="flex w-max space-x-2">
//           {NEWS_CATEGORIES.map((cat) => {
//             const catUpper = String(cat).trim().toUpperCase();
//             const isActive = String(activeCategory).trim().toUpperCase() === catUpper;
            
//             return (
//               <button
//                 key={cat}
//                 onClick={() => handleCategoryChange(cat)}
//                 className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
//                   isActive
//                     ? "bg-white text-black dark:bg-white dark:text-black"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#161b22] dark:text-gray-400 dark:hover:bg-gray-800"
//                 }`}
//               >
//                 {t(CAT_KEYS[catUpper] ?? cat)}
//               </button>
//             );
//           })}
//         </div>
//         <ScrollBar orientation="horizontal" className="hidden" />
//       </ScrollArea>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Main Feed Container Stream */}
//         <section className="lg:col-span-8 flex flex-col gap-6">
//           {filteredNews.slice(0, visibleCount).map((news, i) => (
//             <article key={news.id}>
//               <Link href={buildNewsUrl(news)}>
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   className="flex flex-col sm:flex-row gap-4 group cursor-pointer p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#161b22]/50 transition-colors"
//                 >
//                   <div className="w-full sm:w-[150px] h-[100px] shrink-0 overflow-hidden rounded-md relative">
//                     <Image
//                       src={news.thumbnailUrl || "https://cryptonewstrend.com/media/crptonews-news/7bad29fe5d0bc0a5d12e0e0162a8bb56dc41b43c.jpg"}
//                       alt={news.title}
//                       fill
//                       sizes="150px"
//                       className="object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>
//                   <div className="flex flex-col justify-center flex-grow">
//                     <div className="mb-2 flex items-center gap-2">
//                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
//                         news.tag === "EDITORIAL"
//                           ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
//                           : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
//                       }`}>
//                         {news.category}
//                       </span>
                    
//                     </div>
//                     <h2 className="text-lg font-display font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
//                       {news.title}
//                     </h2>
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
//                       <span>{formatDistanceToNow(new Date(news.date), { addSuffix: true })}</span>
//                       <span className="w-1 h-1 rounded-full bg-border" />
//                       <span>{news.readTime} {t("home.minRead")}</span>
//                     </div>
//                   </div>
//                 </motion.div>
//               </Link>
//             </article>
//           ))}

//           {/* Fallback Display UI */}
//           {filteredNews.length === 0 && !isLoading && (
//             <div className="text-center py-12 text-muted-foreground font-mono text-sm border-2 border-dashed border-border rounded-xl">
//               No live database news found for "{activeCategory}".
//             </div>
//           )}

//           {/* LOAD MORE ACTION BUTTON */}
//           {hasMore && (
//             <Button
//               variant="outline"
//               disabled={isLoading}
//               className="w-full mt-4 b  py-6 font-semibold tracking-wide uppercase text-sm flex items-center justify-center gap-2"
//               onClick={handleLoadMoreClick}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Requesting Dynamic Category Grid...
//                 </>
//               ) : (
//                 t("home.viewMore")
//               )}
//             </Button>
//           )}
//         </section>

//         {/* Layout Right Column Sidebar */}
//         <aside className="lg:col-span-4 flex flex-col gap-8">
//           <Card className="bg-card border-border">
//             <CardContent className="p-6">
//               <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5 text-orange-500" />
//                 {t("home.topStories")}
//               </h3>
//               <div className="flex flex-col gap-6">
//                 {topStories.map((story) => (
//                   <Link href={buildNewsUrl(story)} key={story.id}>
//                     <div className="flex gap-4 group cursor-pointer">
//                       <div className="w-[60px] h-[60px] rounded overflow-hidden shrink-0 relative">
//                         <Image
//                           src={story.thumbnailUrl}
//                           alt={story.title}
//                           fill
//                           sizes="60px"
//                           className="object-cover transition-transform duration-300 group-hover:scale-105"
//                         />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-500 transition-colors mb-1">
//                           {story.title}
//                         </h4>
//                         <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
//                           <span className="text-orange-500">{String(story.category).toUpperCase()}</span>
//                           <span>•</span>
//                           <span>{formatDistanceToNow(new Date(story.date))}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-[#161b22] border-gray-800 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
//             <CardContent className="p-6 relative z-10">
//               <h3 className="font-display font-bold text-lg mb-2 text-white">{t("donate.title")}</h3>
//               <p className="text-sm text-gray-400 mb-4">{t("donate.description")}</p>
//               <div className="bg-black/50 border border-gray-800 rounded-md p-3 flex items-center justify-between">
//                 <span className="text-xs text-gray-300 font-mono truncate mr-2">
//                   0x1234567890abcdef1234567890abcdef12345678
//                 </span>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   className="h-8 w-8 text-gray-400 hover:text-white shrink-0"
//                   onClick={copyAddress}
//                 >
//                   {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
//                 </Button>
//               </div>
//               {copied && (
//                 <p className="text-xs text-green-400 mt-2 font-mono">{t("donate.copied")}</p>
//               )}
//             </CardContent>
//           </Card>

//           <div className="w-full h-[250px] bg-gray-100 dark:bg-[#161b22] rounded-lg border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground text-sm font-mono">
//             {/* <span>ADVERTISEMENT</span>
//             <span className="text-xs mt-1">300 x 250</span> */}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Copy, TrendingUp, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NEWS_CATEGORIES } from "@/lib/mockData";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Page_NewsData from "@/lib/api/Page_NewsData";

const CAT_KEYS = {
  ALL: "home.filterAll",
  BITCOIN: "home.bitcoin",
  ETHEREUM: "home.ethereum",
  BLOCKCHAIN: "home.blockchain",
  DEFI: "home.defi",
  NFTS: "home.nfts",
  CRYPTOCURRENCY: "home.cryptocurrency",
  ALTCOIN: "home.altcoin",
  STAKING: "home.staking",
  DAO: "home.dao",
  MINING: "home.mining",
};

export default function HomeClientView({ initialAllNews, featured, topStories, locale }) {
  const { t } = useTranslation();

  // ✅ FIX: Prerender mein sabhi props undefined ho sakte hain — null guards
  if (!initialAllNews && !featured && !topStories) return null;

  const sanitizeInitialNews = (newsArray) => {
    if (!Array.isArray(newsArray)) return [];
    return newsArray.map((item) => ({
      ...item,
      category: String(item.category || "ALL").trim().toUpperCase(),
    }));
  };

  const [allNews, setAllNews] = useState(() => sanitizeInitialNews(initialAllNews));
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(6);
  const [copied, setCopied] = useState(false);

  // ── LOCALE-BASED SLUG HELPER ──
  const getLocalizedSlug = (item) => {
    if (!item) return "";
    const localized = item[`slug_${locale}`];
    if (localized && String(localized).trim()) return String(localized).trim();
    return item.slug_en || item.slug || item.link || "";
  };

  const buildNewsUrl = (item) => {
    const slug = getLocalizedSlug(item);
    if (!locale || locale === "en") return `/news/${slug}`;
    return `/${locale}/news/${slug}`;
  };

  // Filter display listing
  const filteredNews = allNews.filter((n) => {
    const itemCategory = String(n.category || "").trim().toUpperCase();
    const targetCategory = String(activeCategory).trim().toUpperCase();
    return (
      (targetCategory === "ALL" || itemCategory === targetCategory) &&
      n.id !== featured?.id
    );
  });

  // ── FETCH ENGINE ──
  const fetchNewsEngine = async (pageToFetch, targetCategory, shouldReset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const apiResponse = await Page_NewsData(pageToFetch, locale, targetCategory);

      let incomingResults = [];
      if (apiResponse) {
        if (apiResponse.results && Array.isArray(apiResponse.results)) {
          incomingResults = apiResponse.results;
        } else if (Array.isArray(apiResponse)) {
          incomingResults = apiResponse;
        } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
          incomingResults = apiResponse.data;
        }
      }

      if (incomingResults.length === 0) {
        if (shouldReset) setAllNews([]);
        setHasMore(false);
      } else {
        const transformedNews = incomingResults.map((item, index) => {
          const img =
            item.imageUrl ||
            item.image ||
            item.thumbnailUrl ||
            item.thumb ||
            "https://cryptonewstrend.com/media/crptonews-news/7bad29fe5d0bc0a5d12e0e0162a8bb56dc41b43c.jpg";
          const dbCategory = String(item.category || item.tag || "ALL")
            .trim()
            .toUpperCase();

          return {
            ...item,
            id: item.id || item._id || `api-${targetCategory}-${pageToFetch}-${index}`,
            title: item.title || item.heading || "No Title Available",
            slug: item.slug || item.link || "",
            imageUrl: img,
            thumbnailUrl: img,
            date:
              item.date ||
              item.created_at ||
              item.published_at ||
              new Date().toISOString(),
            category: dbCategory,
            readTime: item.readTime || item.read_time || "3",
            tag: dbCategory,
            excerpt: item.excerpt || item.description || item.summary || "",
          };
        });

        setAllNews((prev) => {
          if (shouldReset) return transformedNews;
          const existingIds = new Set(prev.map((n) => n.id));
          const uniques = transformedNews.filter((n) => !existingIds.has(n.id));
          return [...prev, ...uniques];
        });

        setCurrentPage(pageToFetch);
        setHasMore(incomingResults.length >= 6);
      }
    } catch (error) {
      console.error("[Fetch Engine Failure]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ── CATEGORY CHANGE ──
  const handleCategoryChange = async (category) => {
    const selectedCatUpper = String(category).trim().toUpperCase();
    setActiveCategory(selectedCatUpper);
    setVisibleCount(6);

    if (selectedCatUpper === "ALL") {
      setAllNews(sanitizeInitialNews(initialAllNews));
      setCurrentPage(1);
      setHasMore(true);
      return;
    }

    setHasMore(true);
    await fetchNewsEngine(1, selectedCatUpper, true);
  };

  const handleLoadMoreClick = () => {
    if (visibleCount < filteredNews.length) {
      setVisibleCount((prev) => prev + 6);
    } else {
      fetchNewsEngine(currentPage + 1, activeCategory, false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stripHtml = (htmlString) => {
    if (!htmlString) return "";
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  // ✅ FIX: topStories undefined hone par empty array fallback
  const safeTopStories = Array.isArray(topStories) ? topStories : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Banner */}
      {featured && (
        <>
          <h1 className="sr-only">
            {t("home.pageHeading") || "Latest Crypto News — Bitcoin, Ethereum & Blockchain"}
          </h1>
          <article>
            <Link href={buildNewsUrl(featured)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] rounded-xl overflow-hidden mb-12 group cursor-pointer"
              >
                <Image
                  src={featured.thumbnailUrl || featured.imageUrl || "/fallback-news.jpg"}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 md:via-[#0d1117]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 sm:p-5 md:p-8 lg:p-10 w-full md:w-3/4">
                  <div className="flex gap-2 mb-2 md:mb-4">
                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                      {String(featured.category).toUpperCase()}
                    </Badge>
                    {featured.isBreaking && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                        {t("home.breaking")}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 md:mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4">
                    {stripHtml(featured.excerpt || featured.description || "")}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                    <span>{formatDistanceToNow(new Date(featured.date), { addSuffix: true })}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>
                      {featured.readTime} {t("home.minRead")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </article>
        </>
      )}

      {/* Category Selector */}
      <ScrollArea className="w-full whitespace-nowrap mb-8 pb-4">
        <div className="flex w-max space-x-2">
          {NEWS_CATEGORIES.map((cat) => {
            const catUpper = String(cat).trim().toUpperCase();
            const isActive = String(activeCategory).trim().toUpperCase() === catUpper;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-white text-black dark:bg-white dark:text-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#161b22] dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {t(CAT_KEYS[catUpper] ?? cat)}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {filteredNews.slice(0, visibleCount).map((news, i) => (
            <article key={news.id}>
              <Link href={buildNewsUrl(news)}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row gap-4 group cursor-pointer p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#161b22]/50 transition-colors"
                >
                  <div className="w-full sm:w-[150px] h-[100px] shrink-0 overflow-hidden rounded-md relative">
                    <Image
                      src={
                        news.thumbnailUrl ||
                        "https://cryptonewstrend.com/media/crptonews-news/7bad29fe5d0bc0a5d12e0e0162a8bb56dc41b43c.jpg"
                      }
                      alt={news.title}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-grow">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                          news.tag === "EDITORIAL"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {news.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-display font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {news.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span>{formatDistanceToNow(new Date(news.date), { addSuffix: true })}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>
                        {news.readTime} {t("home.minRead")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </article>
          ))}

          {filteredNews.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground font-mono text-sm border-2 border-dashed border-border rounded-xl">
              No live database news found for "{activeCategory}".
            </div>
          )}

          {hasMore && (
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full mt-4 py-6 font-semibold tracking-wide uppercase text-sm flex items-center justify-center gap-2"
              onClick={handleLoadMoreClick}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting Dynamic Category Grid...
                </>
              ) : (
                t("home.viewMore")
              )}
            </Button>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                {t("home.topStories")}
              </h3>
              <div className="flex flex-col gap-6">
                {/* ✅ FIX: safeTopStories use karo — undefined.map() crash nahi hoga */}
                {safeTopStories.map((story) => (
                  <Link href={buildNewsUrl(story)} key={story.id}>
                    <div className="flex gap-4 group cursor-pointer">
                      <div className="w-[60px] h-[60px] rounded overflow-hidden shrink-0 relative">
                        <Image
                          src={story.thumbnailUrl}
                          alt={story.title}
                          fill
                          sizes="60px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-500 transition-colors mb-1">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <span className="text-orange-500">
                            {String(story.category).toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(story.date))}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#161b22] border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardContent className="p-6 relative z-10">
              <h3 className="font-display font-bold text-lg mb-2 text-white">
                {t("donate.title")}
              </h3>
              <p className="text-sm text-gray-400 mb-4">{t("donate.description")}</p>
              <div className="bg-black/50 border border-gray-800 rounded-md p-3 flex items-center justify-between">
                <span className="text-xs text-gray-300 font-mono truncate mr-2">
                  0x1234567890abcdef1234567890abcdef12345678
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-white shrink-0"
                  onClick={copyAddress}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-2 font-mono">{t("donate.copied")}</p>
              )}
            </CardContent>
          </Card>

          <div className="w-full h-[250px] bg-gray-100 dark:bg-[#161b22] rounded-lg border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground text-sm font-mono" />
        </aside>
      </div>
    </div>
  );
}