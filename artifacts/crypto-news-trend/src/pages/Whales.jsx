"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Search, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fetchWhaleAlerts } from "@/lib/api/Crypto_whales";
import Link from "next/link";

const FILTER_KEYS = {
  ALL:      "whales.allAlerts",
  TRANSFER: "whales.transfer",
  MINT:     "whales.mint",
  BURN:     "whales.burn",
};

const FILTERS = ["ALL", "TRANSFER", "MINT", "BURN"];

export default function Whales({ initialData, initialTotalPages = 1, locale = "en" }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // 🔥 Load More States
  const [whalesList, setWhalesList] = useState(Array.isArray(initialData) ? initialData : []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  // 🔌 Live API Data normalization inside map mapper loop
  const liveWhales = whalesList.map((tx) => {
    let rawType = String(tx.tx_card_title || tx.alert_type || "TRANSFER").toUpperCase();
    if (rawType === "ALERT") rawType = "TRANSFER";

    const getCleanWallet = (walletAddress, fallbackText) => {
      if (!walletAddress || walletAddress === "N/A") return fallbackText || "Unknown";
      return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    };

    const finalAmount =
      tx.receiver?.amount !== "N/A"
        ? tx.receiver?.amount || "0"
        : tx.amount_full?.split(" ")[0] || "0";

    const finalUsdValue =
      tx.receiver?.amount_usd !== "N/A"
        ? tx.receiver?.amount_usd || "$0"
        : tx.sender?.amount_usd || "$0";

    let detectedCoin = String(tx.blockchain || "CRYPTO");
    if (tx.amount_full && tx.amount_full.includes("#")) {
      const parts = tx.amount_full.split("#");
      if (parts[1]) {
        detectedCoin = parts[1].split(" ")[0];
      }
    }

    return {
      id:               tx.id || tx.hash || tx.transaction_hash || Math.random().toString(),
      type:             rawType,
      coin:             detectedCoin.toUpperCase(),
      amount:           finalAmount,
      usdValue:         finalUsdValue,
      hash:             tx.hash || tx.transaction_hash || tx.id,
      text:             tx.alert_text || "",
      summary:          tx.summary || "",
      sender_name:      tx.sender?.owner || "Unknown Wallet",
      receiver_name:    tx.receiver?.owner || "Unknown Wallet",
      receiver_address: tx.receiver?.address || "N/A",
      sender_address:   tx.sender?.address || "N/A",
      fromWallet:       getCleanWallet(tx.sender?.address, tx.sender?.owner),
      toWallet:         getCleanWallet(tx.receiver?.address, tx.receiver?.owner),
      timestamp:        tx.timestamp_utc || tx.alert_timestamp || new Date().toISOString(),
    };
  });

  // Filtering Logic
  const filteredWhales = liveWhales.filter((tx) => {
    const matchesFilter = activeFilter === "ALL" || tx.type === activeFilter;
    const matchesSearch = tx.coin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 🔥 Handler for fetching next page
  const handleLoadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const result = await fetchWhaleAlerts(nextPage, locale);
      const incomingData = result?.data || result || [];
      const fetchedTotalPages = result?.metadata?.total_pages || 1;

      if (Array.isArray(incomingData)) {
        setWhalesList((prev) => [...prev, ...incomingData]);
        setPage(nextPage);
        setTotalPages(fetchedTotalPages);
      }
    } catch (error) {
      console.error("Error loading more whale alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case "TRANSFER": return "border-l-yellow-500 text-yellow-500 bg-yellow-500/10";
      case "MINT":     return "border-l-green-500 text-green-500 bg-green-500/10";
      case "BURN":     return "border-l-red-500 text-red-500 bg-red-500/10";
      default:         return "border-l-gray-500 text-gray-500 bg-gray-500/10";
    }
  };

  const getRelativeTime = (timeStr) => {
    try {
      return formatDistanceToNow(new Date(timeStr), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Header Grid Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/*
            FIX: Was <h1> — now <h2>.
            page.tsx (server component) no longer injects an sr-only H1.
            This visible heading is now the SOLE H1-level text on the page
            but rendered as h2 to avoid duplicate H1 with any layout-level H1.
            If your root layout has no H1, you can safely change this back to h1.
          */}
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            {t("whales.title")}
          </h1>
          <p className="text-muted-foreground text-lg">{t("whales.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono bg-secondary px-4 py-2 rounded-md">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Filter and Search Layout Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t(FILTER_KEYS[filter])}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("whales.searchPlaceholder")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Matrix Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredWhales.map((tx, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={tx.id}
            className={`bg-card border border-border border-l-4 rounded-lg overflow-hidden flex flex-col justify-between ${getCardColor(tx.type).split(" ")[0]}`}
          >
            {/* Card Top Header */}
            <div>
              <div
                className={`px-4 py-2 text-[10px] font-bold tracking-wider flex justify-between items-center ${getCardColor(tx.type).split(" ").slice(1).join(" ")}`}
              >
                <span>{t(FILTER_KEYS[tx.type] ?? tx.type)} ({tx.coin})</span>
                <span>{getRelativeTime(tx.timestamp)}</span>
              </div>

              {/* Card Main Content */}
              <div className="p-4 pb-2">
                <div className="mb-4">
                  <div className="text-2xl font-display font-bold text-foreground">{tx.amount}</div>
                  <div className="text-muted-foreground font-mono text-sm">{tx.usdValue}</div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono bg-secondary/50 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[9px] uppercase">{t("whales.from")}</span>
                    <span className="text-foreground">{tx.fromWallet}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mx-2" />
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground text-[9px] uppercase">{t("whales.to")}</span>
                    <span className="text-foreground">{tx.toWallet}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Action Button */}
            <div className="px-4 pb-4 pt-1">
              <Link
                href={
                  locale === "en"
                    ? `/crypto-whales/${tx.hash}`
                    : `/${locale}/crypto-whales/${tx.hash}`
                }
                className="w-full py-2 px-3 text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results Fallback */}
      {filteredWhales.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">{t("whales.noResults")}</div>
      )}

      {/* 🔥 Load More Action Trigger Wrapper */}
      {page < totalPages && filteredWhales.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Alerts"
            )}
          </button>
        </div>
      )}
    </div>
  );
}