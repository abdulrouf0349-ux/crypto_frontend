import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Copy, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { mockNews, mockTopStories, NEWS_CATEGORIES } from "@/lib/mockData";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CAT_KEYS: Record<string, string> = {
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

export default function Home() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(6);
  const [copied, setCopied] = useState(false);

  const featured = mockNews.find((n) => n.isFeatured);
  const filteredNews = mockNews.filter(
    (n) => (activeCategory === "ALL" || n.category === activeCategory) && !n.isFeatured
  );

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Article */}
      {featured && (
        <Link href={`/news/${featured.slug}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12 group cursor-pointer"
          >
            <img
              src={featured.imageUrl}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
              <div className="flex gap-2 mb-4">
                <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">{featured.category}</Badge>
                {featured.isBreaking && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                    {t("home.breaking")}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                {featured.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                <span>{formatDistanceToNow(new Date(featured.date), { addSuffix: true })}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{featured.readTime} {t("home.minRead")}</span>
              </div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Categories */}
      <ScrollArea className="w-full whitespace-nowrap mb-8 pb-4">
        <div className="flex w-max space-x-2">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "bg-white text-black dark:bg-white dark:text-black"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#161b22] dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {t(CAT_KEYS[cat] ?? cat)}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main News List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {filteredNews.slice(0, visibleCount).map((news, i) => (
            <Link href={`/news/${news.slug}`} key={news.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row gap-4 group cursor-pointer p-4 -mx-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#161b22]/50 transition-colors"
              >
                <div className="w-full sm:w-[150px] h-[100px] shrink-0 overflow-hidden rounded-md">
                  <img
                    src={news.thumbnailUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center flex-grow">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {news.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>{formatDistanceToNow(new Date(news.date), { addSuffix: true })}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{news.readTime} {t("home.minRead")}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

          {visibleCount < filteredNews.length && (
            <Button
              variant="outline"
              className="w-full mt-4 border-dashed border-2 py-6 font-semibold tracking-wide uppercase text-sm"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              {t("home.viewMore")}
            </Button>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Top Stories */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                {t("home.topStories")}
              </h3>
              <div className="flex flex-col gap-6">
                {mockTopStories.map((story) => (
                  <Link href={`/news/${story.slug}`} key={story.id}>
                    <div className="flex gap-4 group cursor-pointer">
                      <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-[60px] h-[60px] rounded object-cover shrink-0 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-500 transition-colors mb-1">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <span className="text-orange-500">{story.category}</span>
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

          {/* Donate Widget */}
          <Card className="bg-[#161b22] border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardContent className="p-6 relative z-10">
              <h3 className="font-display font-bold text-lg mb-2 text-white">{t("donate.title")}</h3>
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
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-2 font-mono">{t("donate.copied")}</p>
              )}
            </CardContent>
          </Card>

          {/* Ad Placeholder */}
          <div className="w-full h-[250px] bg-gray-100 dark:bg-[#161b22] rounded-lg border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground text-sm font-mono">
            <span>ADVERTISEMENT</span>
            <span className="text-xs mt-1">300 x 250</span>
          </div>
        </div>
      </div>
    </div>
  );
}
