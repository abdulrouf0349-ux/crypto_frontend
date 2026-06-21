// "use client";
// import { useState } from "react";
// import { format } from "date-fns";
// import { MapPin, Calendar, Search, Loader2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { motion } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import { FetchAllEvents } from "@/lib/api/FetchAllEvents";
// import Image from "next/image";
// import Link from "next/link";

// const STATUS_KEYS = {
//   ALL:      "events.all",
//   ONGOING:  "events.ongoing",
//   UPCOMING: "events.upcoming",
//   ENDED:    "events.ended",
// };

// const STATUSES = ["ALL", "ONGOING", "UPCOMING", "ENDED"];
// // ── LOCALE-BASED SLUG HELPER ──
// const getLocalizedSlug = (item, locale) => {
//   if (!item) return "";
//   const localeKey = locale === "zh" ? "zh-cn" : locale;
//   const localized = item[`slug_${localeKey}`];
//   if (localized && String(localized).trim()) return String(localized).trim();
//   return item.slug_en || item.slug || "";
// };

// const buildEventUrl = (item, locale) => {
//   const slug = getLocalizedSlug(item, locale);
//   if (!locale || locale === "en") return `/events/${slug}`;
//   return `/${locale}/events/${slug}`;
// };
// // API data → UI shape
// function normalizeEvent(e) {
//   return {
//     ...e, 
//     id:       e.id,
//     name:     e.title || e.detail_title || "Untitled",
//     location: e.location || e.detail_location || "TBA",
//     date:     e.date_text || e.created_at || new Date().toISOString(),
//     status:   (e.status || "UPCOMING").toUpperCase(),
//     imageUrl: e.image_src || "https://cryptonewstrend.com/og-default.png",
//     slug:     e.slug || "",
//     full_url: e.full_url || "",
//   };
// }

// export default function EventsClient({ initialEvents, totalPages, locale }) {
//   const { t } = useTranslation();
//   const [activeStatus, setActiveStatus] = useState("ALL");
//   const [search, setSearch] = useState("");
//   const [events, setEvents] = useState(initialEvents.map(normalizeEvent));
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(totalPages > 1);

//   // Filter
//   const filteredEvents = events.filter((event) => {
//     const matchesStatus = activeStatus === "ALL" || event.status === activeStatus;
//     const matchesSearch =
//       event.name.toLowerCase().includes(search.toLowerCase()) ||
//       event.location.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   // Load more
//   const loadMore = async () => {
//     if (isLoading || !hasMore) return;
//     setIsLoading(true);
//     const nextPage = currentPage + 1;
//     try {
//       const data = await FetchAllEvents(nextPage, locale);
//       const newEvents = (data?.data || []).map(normalizeEvent);
//       if (newEvents.length === 0) {
//         setHasMore(false);
//       } else {
//         setEvents((prev) => {
//           const existingIds = new Set(prev.map(e => e.id));
//           return [...prev, ...newEvents.filter(e => !existingIds.has(e.id))];
//         });
//         setCurrentPage(nextPage);
//         setHasMore(nextPage < (data?.metadata?.total_pages || 1));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-10">
//         <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{t("events.title")}</h1>
//         <p className="text-muted-foreground text-lg">{t("events.subtitle")}</p>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
//         <div className="flex flex-wrap gap-2">
//           {STATUSES.map((status) => (
//             <button
//               key={status}
//               onClick={() => setActiveStatus(status)}
//               className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
//                 activeStatus === status
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
//               }`}
//             >
//               {t(STATUS_KEYS[status])}
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <Input
//             placeholder={t("events.searchPlaceholder")}
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Events Grid — UI bilkul same */}
//       {/* ✅ Grid same rakho — Link andar har card pe */}
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//   {filteredEvents.map((event, i) => (
//     <Link href={buildEventUrl(event, locale)} key={event.id}>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: i * 0.05 }}
//         className="group rounded-xl overflow-hidden bg-card border border-border hover:border-purple-500/50 transition-colors flex flex-col h-full"
//       >
//         <div className="relative aspect-video overflow-hidden">
//           <Image
//             src={event.imageUrl}
//             alt={event.name}        
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//           <div className="absolute top-3 right-3">
//             <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm shadow-sm ${
//               event.status === "ONGOING"
//                 ? "bg-green-500 text-white"
//                 : event.status === "UPCOMING"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-600 text-white"
//             }`}>
//               {t(STATUS_KEYS[event.status] ?? event.status)}
//             </span>
//           </div>
//         </div>

//         <div className="p-5 flex flex-col flex-grow">
//           <h3 className="font-display font-semibold text-lg mb-3 line-clamp-2">
//             {event.name}            {/* ✅ event.title → event.name */}
//           </h3>
//           <div className="mt-auto space-y-2 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-orange-500" />
//               <span>{event.location}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4 text-purple-500" />
//               <span>{event.date}</span>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </Link>
//   ))}
// </div>

//       {/* No results */}
//       {filteredEvents.length === 0 && !isLoading && (
//         <div className="text-center py-20 text-muted-foreground">
//           {t("events.noResults")}
//         </div>
//       )}

//       {/* Load More */}
//       {hasMore && (
//         <div className="flex justify-center mt-10">
//           <button
//             onClick={loadMore}
//             disabled={isLoading}
//             className="px-8 py-3 rounded-full border-2 border-dashed border-border text-sm font-semibold uppercase tracking-wider hover:border-purple-500 transition-colors flex items-center gap-2"
//           >
//             {isLoading ? (
//               <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
//             ) : (
//               t("home.viewMore")
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FetchAllEvents } from "@/lib/api/FetchAllEvents";
import Image from "next/image";
import Link from "next/link";

const STATUS_KEYS = {
  ALL:      "events.all",
  ONGOING:  "events.ongoing",
  UPCOMING: "events.upcoming",
  ENDED:    "events.ended",
};

const STATUSES = ["ALL", "ONGOING", "UPCOMING", "ENDED"];

// ── LOCALE-BASED SLUG HELPER ──
const getLocalizedSlug = (item, locale) => {
  if (!item) return "";
  const localeKey = locale === "zh" ? "zh-cn" : locale;
  const localized = item[`slug_${localeKey}`];
  if (localized && String(localized).trim()) return String(localized).trim();
  return item.slug_en || item.slug || "";
};

const buildEventUrl = (item, locale) => {
  const slug = getLocalizedSlug(item, locale);
  if (!locale || locale === "en") return `/events/${slug}`;
  return `/${locale}/events/${slug}`;
};

// API data → UI shape
function normalizeEvent(e) {
  return {
    ...e,
    id:       e.id,
    name:     e.title || e.detail_title || "Untitled",
    location: e.location || e.detail_location || "TBA",
    date:     e.date_text || e.created_at || new Date().toISOString(),
    status:   (e.status || "UPCOMING").toUpperCase(),
    imageUrl: e.image_src || "https://cryptonewstrend.com/og-default.png",
    slug:     e.slug || "",
    full_url: e.full_url || "",
  };
}

export default function EventsClient({ initialEvents, totalPages, locale }) {
  const { t } = useTranslation();

  // ✅ FIX: prerender mein initialEvents undefined hota hai — null guard
  if (!initialEvents) return null;

  // ✅ FIX: safeInitialEvents — Array guarantee
  const safeInitialEvents = Array.isArray(initialEvents) ? initialEvents : [];

  const [activeStatus, setActiveStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState(() => safeInitialEvents.map(normalizeEvent));
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState((totalPages ?? 1) > 1);

  // Filter
  const filteredEvents = events.filter((event) => {
    const matchesStatus = activeStatus === "ALL" || event.status === activeStatus;
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Load more
  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = currentPage + 1;
    try {
      const data = await FetchAllEvents(nextPage, locale);
      const newEvents = (data?.data || []).map(normalizeEvent);
      if (newEvents.length === 0) {
        setHasMore(false);
      } else {
        setEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          return [...prev, ...newEvents.filter((e) => !existingIds.has(e.id))];
        });
        setCurrentPage(nextPage);
        setHasMore(nextPage < (data?.metadata?.total_pages || 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
          {t("events.title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("events.subtitle")}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t(STATUS_KEYS[status])}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("events.searchPlaceholder")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event, i) => (
          <Link href={buildEventUrl(event, locale)} key={event.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-card border border-border hover:border-purple-500/50 transition-colors flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm shadow-sm ${
                      event.status === "ONGOING"
                        ? "bg-green-500 text-white"
                        : event.status === "UPCOMING"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {t(STATUS_KEYS[event.status] ?? event.status)}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-display font-semibold text-lg mb-3 line-clamp-2">
                  {event.name}
                </h3>
                <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* No results */}
      {filteredEvents.length === 0 && !isLoading && (
        <div className="text-center py-20 text-muted-foreground">
          {t("events.noResults")}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-full border-2 border-dashed border-border text-sm font-semibold uppercase tracking-wider hover:border-purple-500 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </>
            ) : (
              t("home.viewMore")
            )}
          </button>
        </div>
      )}
    </div>
  );
}