"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Flame, Moon, Sun, Menu, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next"; 
import i18n from "@/i18n";

const LOCALES = [
  { code: "en",    label: "EN", name: "English",    rtl: false },
  { code: "ur",    label: "UR", name: "اردو",       rtl: true  },
  { code: "es",    label: "ES", name: "Español",    rtl: false },
  { code: "ru",    label: "RU", name: "Русский",    rtl: false },
  { code: "fr",    label: "FR", name: "Français",   rtl: false },
  { code: "de",    label: "DE", name: "Deutsch",    rtl: false },
  { code: "ar",    label: "AR", name: "العربية",    rtl: true  },
  { code: "zh",    label: "ZH", name: "中文",       rtl: false },
];

const LOCALE_CODES = LOCALES.map((l) => l.code);

export function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState(LOCALES[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const pathParts = pathname.split("/");
    const currentLocaleCode = pathParts[1];
    
    const foundLocale = LOCALES.find((l) => l.code === currentLocaleCode) || LOCALES[0]; 
    
    setActiveLang(foundLocale);
    i18n.changeLanguage(foundLocale.code);
    document.documentElement.dir = foundLocale.rtl ? "rtl" : "ltr";
    document.documentElement.lang = foundLocale.code;
  }, [pathname]);

  // 🌍 SEO LANGUAGE ROUTER SWITCHER WITH DYNAMIC PATH RETENTION
 const handleLangChange = (targetLocale) => {
  const pathParts = pathname.split("/").filter(Boolean);

  // ✅ News aur Events dono handle karo
  if (pathname.includes("/news/") || pathname.includes("/events/")) {
    let targetSlug = pathParts[pathParts.length - 1];

    try {
      const el = document.getElementById("localized-slugs");
      if (el) {
        // ✅ data attribute se read karo (events page)
        const slugsData = el.dataset.slugs || el.textContent || "{}";
        const slugMap = JSON.parse(slugsData);
        const localeKey = targetLocale.code === "zh" ? "zh-cn" : targetLocale.code;
        targetSlug = slugMap[localeKey] || slugMap["en"] || targetSlug;
      }
    } catch (e) {
      console.error("Slug map error:", e);
    }

    // ✅ news ya events detect karo
    const pageType = pathname.includes("/news/") ? "news" : "events";

    const newPath = targetLocale.code === "en"
      ? `/${pageType}/${targetSlug}`
      : `/${targetLocale.code}/${pageType}/${targetSlug}`;

    router.push(newPath);
    return;
  }

  // Normal pages — same logic
  if (LOCALE_CODES.includes(pathParts[0])) {
    if (targetLocale.code === "en") {
      pathParts.shift();
    } else {
      pathParts[0] = targetLocale.code;
    }
  } else {
    if (targetLocale.code !== "en") {
      pathParts.unshift(targetLocale.code);
    }
  }

  router.push("/" + pathParts.join("/"));
};

  const getLocalizedPath = (path) => {
    if (activeLang.code === "en") return path;
    return `/${activeLang.code}${path === "/" ? "" : path}`;
  };

  const navLinks = [
    { key: "nav.news",           path: "/" },
    { key: "nav.events",        path: "/events" },
    { key: "nav.whalesTracking", path: "/crypto-whales" },
    { key: "nav.ico",            path: "/ico" },
    { key: "nav.coinAnalysis",   path: "/coin-analysis" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#0d1117] text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={getLocalizedPath("/")} className="flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><title xmlns="">call</title><g fill="none"><circle cx="16" cy="16" r="16" fill="#f97316"/><g fill="#FFF"><path d="M16.017 21.804a4.6 4.6 0 0 0 1.941-.336q.367-.131.695-.342a.18.18 0 0 1 .27.034l1.579 1.625c.113.118.109.156-.026.249a7.5 7.5 0 0 1-1.772.897a8.4 8.4 0 0 1-2.409.446a8.4 8.4 0 0 1-3.082-.421a7.6 7.6 0 0 1-2.345-1.318a8.7 8.7 0 0 1-1.642-1.802a7 7 0 0 1-.67-1.17a12 12 0 0 1-.379-.99a8.8 8.8 0 0 1-.353-1.89a5.7 5.7 0 0 1 .02-1.415q.075-.697.245-1.377a8.6 8.6 0 0 1 .817-1.983a8.1 8.1 0 0 1 3.217-3.1a8 8 0 0 1 1.604-.656a7 7 0 0 1 1.385-.27a5.4 5.4 0 0 1 1.09-.025q.098.006.194 0a6.8 6.8 0 0 1 1.756.278c.487.13.958.314 1.402.552q.705.349 1.318.842c.08.071.143.038.206-.03l.973-1.027l1.402-1.49c.164-.177.206-.182.383-.022c.54.487 1.04 1.018 1.49 1.588a11.8 11.8 0 0 1 1.453 2.307q.473 1.022.775 2.105c.169.594.223 1.2.354 1.794a.1.1 0 0 1 0 .034c0 .551.122 1.103.063 1.654c-.067.628-.101 1.264-.232 1.883q-.167.78-.42 1.536a11.8 11.8 0 0 1-1.832 3.47c-.122.16-.16.164-.3 0c-.462-.468-.925-.943-1.393-1.406c-.097-.097-.084-.173 0-.278a9.6 9.6 0 0 0 1.188-2.24c.265-.747.447-1.521.543-2.308q.086-.906.038-1.814a6.6 6.6 0 0 0-.123-1.024a9.5 9.5 0 0 0-1.642-3.84c-.088-.126-.198-.24-.278-.374c-.08-.135-.088-.097-.164-.021c-.446.45-.905.888-1.339 1.347c-.151.16-.324.286-.467.45s-.316.32-.476.48l-.488.489c-.076.076-.135.046-.186-.025a5.4 5.4 0 0 0-1.562-1.516a5.2 5.2 0 0 0-1.966-.758a6 6 0 0 0-1.65-.021a5.1 5.1 0 0 0-1.92.606a5.4 5.4 0 0 0-1.643 1.398a5.4 5.4 0 0 0-.888 1.646a6.5 6.5 0 0 0-.299 2.186a5.27 5.27 0 0 0 1.381 3.591a5.6 5.6 0 0 0 1.937 1.386c.7.308 1.463.451 2.227.416"/><path d="m25.037 23.711l-4.26-4.337c-.093-.097-.17-.1-.245 0a5.4 5.4 0 0 1-1.082 1.162c-.101.08-.101.143 0 .236c.383.383.762.775 1.141 1.158q.738.752 1.482 1.503c.088.088.084.13 0 .206c-.198.148-.392.3-.598.421a9.3 9.3 0 0 1-3.596 1.491a7 7 0 0 1-1.528.177h-.206q-.548.038-1.09-.034c-.422-.063-.818-.114-1.218-.202a9 9 0 0 1-1.482-.476a9.6 9.6 0 0 1-2.27-1.335a10 10 0 0 1-1.814-1.86a9.2 9.2 0 0 1-1.297-2.396a7.9 7.9 0 0 1-.573-2.64a2 2 0 0 1 0-.287v-.993a.8.8 0 0 1 0-.325c0-.08.034-.155.047-.235q.063-.56.198-1.108q.173-.736.459-1.436a9.7 9.7 0 0 1 4.362-4.859a9.3 9.3 0 0 1 3.79-1.14h.243a9.4 9.4 0 0 1 4.064.64l.362.151a10 10 0 0 1 1.579.88a.173.173 0 0 0 .256-.025c.447-.51.918-.994 1.386-1.482c.088-.093.092-.177 0-.253a12 12 0 0 0-5.217-2.156a13 13 0 0 0-1.634-.156a11.7 11.7 0 0 0-2.526.236a12 12 0 0 0-1.566.421c-.912.305-1.782.723-2.59 1.242c-.97.62-1.847 1.372-2.606 2.236a11.9 11.9 0 0 0-2.303 3.933q-.319.919-.501 1.874q-.14.837-.19 1.684a9 9 0 0 0 .084 1.814q.1.897.341 1.765c.114.391.228.783.375 1.162c.294.76.663 1.49 1.103 2.177a12.7 12.7 0 0 0 1.924 2.315q.71.655 1.516 1.188c.718.491 1.49.9 2.3 1.217c.806.32 1.647.548 2.504.682q.966.144 1.942.168c.42 0 .842-.067 1.237-.076q.45-.033.889-.134c.324-.055.644-.14.964-.224a11.4 11.4 0 0 0 3.368-1.499c.937-.6 1.787-1.325 2.527-2.155c.122-.14.118-.164-.05-.316z"/></g></g></svg>
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">Crypto</span>
            <span className="text-orange-500">NewsTrend</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
{navLinks.map((link) => {
  const localizedPath = getLocalizedPath(link.path);
  
  // Logic: 
  // 1. Agar root path ("/") hai, toh check karo exact match
  // 2. Agar koi aur link hai, toh check karo kya pathname us path se start ho raha hai
  const isActive = link.path === "/" 
    ? (pathname === "/" || LOCALE_CODES.some(c => pathname === `/${c}`))
    : pathname.startsWith(localizedPath); 

  return (
    <Link
      key={link.path}
      href={localizedPath}
      className={`text-xs font-medium uppercase tracking-wider transition-colors hover:text-white ${
        isActive
          ? "text-white border-b-2 border-purple-600 py-5"
          : "text-gray-400 py-5 border-b-2 border-transparent"
      }`}
    >
      {t(link.key)}
    </Link>
  );
})}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800 font-medium tracking-wider text-xs px-2"
              >
                {activeLang.label}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px] max-h-72 overflow-y-auto z-[9999]">
              {LOCALES.map((locale) => (
                <DropdownMenuItem
                  key={locale.code}
                  onClick={() => handleLangChange(locale)}
                  className={`flex items-center gap-3 cursor-pointer ${
                    activeLang.code === locale.code ? "text-purple-500 font-semibold bg-purple-500/10" : ""
                  }`}
                >
                  <span className="w-7 font-bold text-xs shrink-0">{locale.label}</span>
                  <span className="text-sm text-muted-foreground">{locale.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800 relative"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#21262d] bg-[#0d1117] px-4 py-4 flex flex-col gap-3">
       
{navLinks.map((link) => {
  const localizedPath = getLocalizedPath(link.path);
  const isActive = link.path === "/" 
    ? (pathname === "/" || LOCALE_CODES.some(c => pathname === `/${c}`))
    : pathname.startsWith(localizedPath);

  return (
    <Link
      key={link.path}
      href={localizedPath}
      onClick={() => setMobileOpen(false)}
      className={`text-sm uppercase tracking-wider py-2 border-b border-[#21262d] ${
        isActive ? "text-white font-semibold" : "text-gray-400"
      }`}
    >
      {t(link.key)}
    </Link>
  );
})}
          <div className="flex flex-wrap gap-2 pt-2">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => { handleLangChange(locale); setMobileOpen(false); }}
                className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                  activeLang.code === locale.code
                    ? "border-purple-500 text-purple-400 bg-purple-500/10"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {locale.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}