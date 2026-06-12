import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  { code: "zh-CN", label: "ZH", name: "中文",        rtl: false },
];

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState(LOCALES[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLangChange = (locale: typeof LOCALES[0]) => {
    setActiveLang(locale);
    i18n.changeLanguage(locale.code);
    document.documentElement.dir = locale.rtl ? "rtl" : "ltr";
    document.documentElement.lang = locale.code;
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }, []);

  const navLinks = [
    { key: "nav.news",          path: "/" },
    { key: "nav.events",        path: "/events" },
    { key: "nav.whalesTracking",path: "/crypto-whales" },
    { key: "nav.ico",           path: "/ico" },
    { key: "nav.coinAnalysis",  path: "/coin-analysis" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#0d1117] text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Flame className="w-6 h-6 text-orange-500" />
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">Crypto</span>
            <span className="text-orange-500">NewsTrend</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
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

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language picker */}
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

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800 relative"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#21262d] bg-[#0d1117] px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm uppercase tracking-wider py-2 border-b border-[#21262d] ${
                location === link.path ? "text-white font-semibold" : "text-gray-400"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
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
