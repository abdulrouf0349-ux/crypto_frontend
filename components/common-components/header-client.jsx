'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Lang_Btn_mobile from "../short-components/language-btn-mobile";

export const HeaderClient = ({ dict, locale }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMenuOpen]);

  const getActiveLink = (path) => {
    // Current path split karke parts nikaalte hain
    const pathParts = pathname.split('/').filter(Boolean);
    
    // Check karte hain ke kya pehla part koi locale hai (ur, ar, etc.) 
    // Agar English hai toh pehla part slug hoga, locale nahi.
    const hasLocaleInUrl = pathParts.length > 0 && pathParts[0].length === 2 && pathParts[0] !== 'en';
    const currentSlug = hasLocaleInUrl ? pathParts[1] : pathParts[0];

    // 1. News / Home Logic
    if (path === "/") {
      // Home tab tab active hoga jab:
      // - Path bilkul khali ho (/) 
      // - Path sirf locale ho (/ur)
      // - Ya path koi aisa slug ho jo baaki sections mein nahi hai (News article)
      const isExactHome = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
      
      const otherSections = ['events', 'crypto-whales', 'ico', 'market', 'coin-analysis', 'news', 'article'];
      const isNewsSlug = currentSlug && !otherSections.includes(currentSlug);
      const isNewsFolder = pathname.includes('/news/') || pathname.includes('/article/');

      return (isExactHome || isNewsSlug || isNewsFolder)
        ? "text-white font-bold after:w-full" 
        : "text-slate-400 font-medium after:w-0";
    }

    // 2. Specific Sections (Events, Whales, etc.)
    // Hum sirf slug match karenge taaki locale ka panga na ho
    const targetSlug = path.replace('/', '');
    const isMatched = currentSlug === targetSlug || pathname.includes(`/${targetSlug}`);

    return isMatched
      ? "text-white font-bold after:w-full"
      : "text-slate-400 font-medium after:w-0";
  };

  const navLinks = [
    { href: "/", label: dict.header.news },
    { href: "/events", label: dict.header.events },
    { href: "/crypto-whales", label: dict.header.whales_tracking },
    { href: "/ico", label: dict.header.ico },
    { href: "/coin-analysis", label: dict.coin_ai.coin_analysis },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center gap-8 h-full">
        {navLinks.map((link) => {
          const activeClass = getActiveLink(link.href);
          // ✅ Link generate karte waqt English ke liye /en nahi lagayenge
          const fullHref = link.href === "/" 
            ? (locale === 'en' ? "/" : `/${locale}`)
            : (locale === 'en' ? link.href : `/${locale}${link.href}`);
          
          return (
            <Link 
              key={link.href} 
              href={fullHref}
              className={`relative py-2 text-[14px] uppercase !text-white tracking-wider transition-all duration-300 hover:text-white group ${activeClass}`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-[3px] bg-[#4f39f6] transition-all duration-300 group-hover:w-full ${activeClass.includes('after:w-full') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-slate-300 ml-auto" 
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Full Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#0f172a] z-[9999] flex flex-col p-6 overflow-y-auto slide-in">
          <div className="flex justify-between items-center mb-10">
            <Image src="/images/logo.png" alt="Logo" width={140} height={28} unoptimized />
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="flex flex-row items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5"> 
              <span className="text-[12px] !text-white uppercase tracking-wider font-medium">
                {dict.header.select_language || "Select Language"}
              </span>
              <Lang_Btn_mobile />
            </div>

            {navLinks.map((link) => {
              const activeClass = getActiveLink(link.href);
              const isActive = activeClass.includes('text-white');
              // ✅ Mobile links ke liye bhi English fix
              const fullHref = link.href === "/" 
                ? (locale === 'en' ? "/" : `/${locale}`)
                : (locale === 'en' ? link.href : `/${locale}${link.href}`);

              return (
                <div key={link.href} className="border-b border-white/5">
                  <div className="flex items-center py-4">
                    <Link 
                      href={fullHref}
                      onClick={() => setIsMenuOpen(false)}
                      className={`relative py-2 text-[10px] font-bold uppercase tracking-tight w-fit transition-all duration-300 ${
                        isActive ? '!text-white' : '!text-white'
                      }`}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 h-[3px] bg-[#4f39f6] transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`}></span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .slide-in { animation: slideIn 0.3s ease-out; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
};