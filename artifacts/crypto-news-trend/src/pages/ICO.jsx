"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICO_CATEGORIES } from "@/lib/mockData";
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
import { Rocket, Clock, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchAllIcoProjects } from "@/lib/api/Ico";

export default function ICO({ initialData, initialTotalPages = 1, locale = "en" }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [icoList, setIcoList] = useState(Array.isArray(initialData) ? initialData : []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const getApiStatus = (tabValue) => {
    if (tabValue === "upcoming") return "Upcoming";
    if (tabValue === "ended") return "Ended";
    return "Active";
  };

  const handleTabChange = async (newTab) => {
    setActiveTab(newTab);
    setLoading(true);
    setPage(1);

    try {
      const targetStatus = getApiStatus(newTab);
      const res = await fetchAllIcoProjects(locale,targetStatus,1)
      if (res?.success) {
        setIcoList(res.data || []);
        setTotalPages(res.total_pages || 1);
      } else {
        setIcoList([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Tab change fetch failure:", err);
      setIcoList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;
    const targetStatus = getApiStatus(activeTab);

    try {
      const res = await fetchAllIcoProjects(locale,targetStatus,nextPage)

      if (res?.success && Array.isArray(res.data)) {
        setIcoList((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setTotalPages(res.total_pages || 1);
      }
    } catch (err) {
      console.error("Load more fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredIcos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return icoList.filter((ico) => {
      const icoName = String(ico.name || "").toLowerCase();
      const icoCategory = String(ico.project_type || "General").toLowerCase();
      const matchesSearch = !q || icoName.includes(q);
      const matchesCategory =
        category === "all" || icoCategory === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [icoList, search, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
            <Rocket className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          {t("ico.title")}
        </h1>
        {/* ico-description class added here so speakable schema cssSelector works */}
        <p className="ico-description text-muted-foreground">{t("ico.subtitle")}</p>
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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="active"
              className="font-semibold tracking-wide px-6"
            >
              {t("ico.active")}
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="font-semibold tracking-wide px-6"
            >
              {t("ico.upcoming")}
            </TabsTrigger>
            <TabsTrigger
              value="ended"
              className="font-semibold tracking-wide px-6"
            >
              {t("ico.ended")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {loading && icoList.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : filteredIcos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIcos.map((ico, i) => (
                <div
                  key={ico.id || i}
                  className="bg-card border border-border rounded-xl p-6 hover:border-orange-500/50 transition-colors flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Image
                      src={ico.main_img || "/og-ico.png"}
                      alt={ico.name}
                      width={64}
                      height={64}
                      className="rounded-full ring-4 ring-background object-cover bg-secondary"
                    />
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-mono font-semibold">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span
                          className={
                            activeTab === "ended"
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }
                        >
                          {ico.status_time || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        {ico.project_type || "Crypto"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl mb-2">
                    {ico.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-grow">
                    {ico.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={activeTab === "ended"}
                    >
                      {t("ico.whitelist")}
                    </Button>
                    <Link href={`/${locale}/ico/${ico.slug}`}>
                      <Button variant="outline" className="w-full">
                        {t("ico.details")}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">
                {search || category !== "all"
                  ? t("ico.noResults")
                  : t("ico.noProjects")}
              </p>
              {(search || category !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-3 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                >
                  {t("ico.clearFilters")}
                </button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {page < totalPages && filteredIcos.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("ico.loading") || "Loading..."}
              </>
            ) : (
              t("ico.loadMore") || "Load More Projects"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}