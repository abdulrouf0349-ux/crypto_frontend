import { useState } from "react";
import { mockWhales } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FILTER_KEYS: Record<string, string> = {
  ALL:      "whales.allAlerts",
  TRANSFER: "whales.transfer",
  MINT:     "whales.mint",
  BURN:     "whales.burn",
};

const FILTERS = ["ALL", "TRANSFER", "MINT", "BURN"];

export default function Whales() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredWhales = mockWhales.filter((tx) => {
    const matchesFilter = activeFilter === "ALL" || tx.type === activeFilter;
    const matchesSearch = tx.coin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCardColor = (type: string) => {
    switch (type) {
      case "TRANSFER": return "border-l-yellow-500 text-yellow-500 bg-yellow-500/10";
      case "MINT":     return "border-l-green-500 text-green-500 bg-green-500/10";
      case "BURN":     return "border-l-red-500 text-red-500 bg-red-500/10";
      default:         return "border-l-gray-500 text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredWhales.map((tx, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={tx.id}
            className={`bg-card border border-border border-l-4 rounded-lg overflow-hidden ${getCardColor(tx.type).split(" ")[0]}`}
          >
            <div
              className={`px-4 py-2 text-[10px] font-bold tracking-wider flex justify-between items-center ${getCardColor(tx.type).split(" ").slice(1).join(" ")}`}
            >
              <span>{t(FILTER_KEYS[tx.type] ?? tx.type)}</span>
              <span>{formatDistanceToNow(new Date(tx.timestamp))} ago</span>
            </div>

            <div className="p-4">
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
          </motion.div>
        ))}
      </div>

      {filteredWhales.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">{t("whales.noResults")}</div>
      )}
    </div>
  );
}
