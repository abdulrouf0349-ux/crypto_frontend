import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Flame, Moon, Sun, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ur", label: "UR", name: "اردو" },
  { code: "es", label: "ES", name: "Español" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "zh-CN", label: "ZH", name: "中文" },
];

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [activeLang, setActiveLang] = useState(LOCALES[0]);

  const navLinks = [
    { label: "NEWS", path: "/" },
    { label: "EVENTS", path: "/events" },
    { label: "WHALES TRACKING", path: "/crypto-whales" },
    { label: "ICO", path: "/ico" },
    { label: "COIN ANALYSIS", path: "/coin-analysis" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-[#0d1117] text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">Crypto</span>
            <span className="text-orange-500">NewsTrend</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-white ${
                  isActive ? "text-white border-b-2 border-purple-600 py-5" : "text-gray-400 py-5 border-b-2 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800 font-medium tracking-wider">
                {activeLang.label}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px] max-h-72 overflow-y-auto z-[9999]">
              {LOCALES.map((locale) => (
                <DropdownMenuItem
                  key={locale.code}
                  onClick={() => setActiveLang(locale)}
                  className={`flex items-center gap-2 cursor-pointer ${activeLang.code === locale.code ? "text-purple-500 font-semibold" : ""}`}
                >
                  <span className="w-7 font-bold text-xs">{locale.label}</span>
                  <span className="text-sm text-muted-foreground">{locale.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
