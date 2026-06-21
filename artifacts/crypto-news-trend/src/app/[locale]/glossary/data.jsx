"use client";

import { useState, useEffect, useCallback, useMemo } from "react";  // ✅ added useMemo
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookOpen, Search, SlidersHorizontal, ArrowRight, Loader2, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ✅ debounce moved OUTSIDE component — not recreated on every render
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function CoinGlossary({ initialData, initialTotalPages = 1, locale = "en" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("type") || "all");
  const [glossaryList, setGlossaryList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [clientPage, setClientPage] = useState(1);   // ✅ client-side load more page tracker

  const isRtl = ["ur", "ar"].includes(locale);

  // ✅ Sync server initialData into state
  useEffect(() => {
    if (!Array.isArray(initialData)) return;
    setTotalPages(initialTotalPages);
    setGlossaryList(initialData);
    setClientPage(1);
    setLoading(false);
  }, [initialData, initialTotalPages]);

  // ✅ URL updates only for filter/search changes (NOT for load more)
  const updateRouterState = useCallback((currentSearch, currentCategory) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    if (currentCategory && currentCategory !== "all") params.set("type", currentCategory);
    // ✅ page param intentionally excluded — load more is client-side only
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [router, pathname]);

  const handleFilterChange = useCallback((currentSearch, currentCategory) => {
    setLoading(true);
    setPage(1);
    setClientPage(1);
    updateRouterState(currentSearch, currentCategory);
  }, [updateRouterState]);

  // ✅ useMemo now works because useMemo is imported
  const debouncedFilter = useMemo(
    () => debounce(handleFilterChange, 400),
    [handleFilterChange]
  );

  // ✅ Load more is now CLIENT-SIDE ONLY — no router.push, no SSR reload
  const handleLoadMore = async () => {
    if (loading || clientPage >= totalPages) return;
    setLoading(true);

    const nextPage = clientPage + 1;

    try {
      const params = new URLSearchParams({
        page: nextPage.toString(),
        search,
        type: category,
        locale,
      });

      const res = await fetch(`/api/coins?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        const newItems = result.data || [];
        setGlossaryList((prev) => [...prev, ...newItems]);  // ✅ append, don't replace
        setClientPage(nextPage);
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isRtl ? "font-sans" : "font-display"}`}>
          Crypto Glossary
        </h1>
        <p className="text-muted-foreground">
          Real-time integrated definitions straight from our token analytics index system.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search active coins/terms..."
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              debouncedFilter(val, category);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-52">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <Select
            value={category}
            onValueChange={(val) => {
              setCategory(val);
              handleFilterChange(search, val);
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="basics">Basics</SelectItem>
              <SelectItem value="defi">DeFi</SelectItem>
              <SelectItem value="layer1">Layer 1</SelectItem>
              <SelectItem value="stablecoins">Stablecoins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && glossaryList.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : glossaryList.length > 0 ? (
          // ✅ Only the WRAPPER is animated — not every individual card
          <motion.div
            key="api-active-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {glossaryList.map((coin, i) => (
              // ✅ Plain div instead of motion.div per card — better performance at scale
              <div
                key={coin.id || coin.slug || i}
                className="bg-card border border-border rounded-xl p-6 hover:border-orange-500/50 transition-all flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-4">
                  {coin.image || coin.logo ? (
                    <Image
                      src={coin.image || coin.logo}
                      alt={`${coin.name} Definition`}
                      width={40}
                      height={40}
                      sizes="40px"           // ✅ added sizes
                      loading="lazy"         // ✅ added lazy loading
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-purple-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full font-mono uppercase">
                    {coin.type || "Coin Asset"}
                  </span>
                </div>

                <h3 className={`font-bold text-xl mb-2 group-hover:text-purple-400 transition-colors ${isRtl ? "font-sans" : "font-display"}`}>
                  {coin.name}{" "}
                  {coin.symbol && (
                    <span className="text-sm text-muted-foreground">({coin.symbol})</span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                  {coin.description || coin.short_description || "No description loaded for this asset item."}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50">
                  <Link
                    href={
                      locale === "en"
                        ? `/glossary/${coin.slug}`
                        : `/${locale}/glossary/${coin.slug}`
                    }
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-xs font-mono font-bold tracking-wide hover:bg-secondary"
                    >
                      <span>VIEW LIVE ANALYSIS</span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRtl ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No dictionary data found on servers.</p>
          </div>
        )}
      </AnimatePresence>

      {clientPage < totalPages && glossaryList.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all font-mono text-xs font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                LOADING RUNTIME DATA...
              </>
            ) : (
              "LOAD MORE DICTIONARY TERMS"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}