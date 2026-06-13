import { useState, useMemo } from "react";
import { Link } from "wouter";
import { mockIcos, ICO_CATEGORIES } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rocket, Clock, Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ICO() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredIcos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockIcos.filter((ico) => {
      const matchesStatus = ico.status === activeTab;
      const matchesSearch = !q || ico.name.toLowerCase().includes(q);
      const matchesCategory =
        category === "all" ||
        ico.category.toLowerCase() === category.toLowerCase();
      return matchesStatus && matchesSearch && matchesCategory;
    });
  }, [activeTab, search, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
            <Rocket className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{t("ico.title")}</h1>
        <p className="text-muted-foreground">{t("ico.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t("ico.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-52">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={t("ico.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ico.allCategories")}</SelectItem>
              {ICO_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-secondary">
            <TabsTrigger value="active"   className="font-semibold tracking-wide px-6">{t("ico.active")}</TabsTrigger>
            <TabsTrigger value="upcoming" className="font-semibold tracking-wide px-6">{t("ico.upcoming")}</TabsTrigger>
            <TabsTrigger value="ended"    className="font-semibold tracking-wide px-6">{t("ico.ended")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <AnimatePresence mode="wait">
            {filteredIcos.length > 0 ? (
              <motion.div
                key={`${activeTab}-${search}-${category}-results`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredIcos.map((ico, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    key={ico.id}
                    className="bg-card border border-border rounded-xl p-6 hover:border-orange-500/50 transition-colors flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <img
                        src={ico.logo}
                        alt={ico.name}
                        className="w-16 h-16 rounded-full ring-4 ring-background"
                      />
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-mono font-semibold">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span className={ico.status === "ended" ? "text-muted-foreground" : "text-foreground"}>
                            {ico.timeLeft}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          {ico.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl mb-2">{ico.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-grow">{ico.description}</p>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={ico.status === "ended"}
                      >
                        {t("ico.whitelist")}
                      </Button>
                      <Link href={`/ico/${ico.slug}`}>
                        <Button variant="outline" className="w-full">{t("ico.details")}</Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`${activeTab}-${search}-${category}-empty`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  {search || category !== "all" ? t("ico.noResults") : t("ico.noProjects")}
                </p>
                {(search || category !== "all") && (
                  <button
                    onClick={() => { setSearch(""); setCategory("all"); }}
                    className="mt-3 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                  >
                    {t("ico.clearFilters")}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
