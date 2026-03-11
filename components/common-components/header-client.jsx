'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Language_mobile_btn from "../short-components/language-btn-mobile";
import { Menu, X, Plus, Minus } from "lucide-react";
import Lang_Btn_list4 from "../short-components/language-button";
import Lang_Btn_mobile from "../short-components/language-btn-mobile";

export const HeaderClient = ({ dict, locale }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarket, setIsMarket] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMenuOpen]);

 const getActiveLink = (path) => {
    // Current path split karke parts check karte hain (e.g., /en/slug -> ['en', 'slug'])
    const pathParts = pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0]; // Ye 'en' ya 'ur' hoga
    const secondPart = pathParts[1]; // Ye 'slug' ya 'events' ya 'crypto-whales' hoga

    // 1. News / Home Logic
    if (path === "/") {
      // Case A: Exact Home (e.g., /en)
      const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
      
      // Case B: News Slug (e.g., /en/bitcoin-news-2026)
      // Agar second part exist karta hai par wo hamare baaki sections mein se nahi hai, 
      // toh iska matlab hai ye news article ka slug hai.
      const otherSections = ['events', 'crypto-whales', 'ico', 'market'];
      const isNewsSlug = secondPart && !otherSections.includes(secondPart);

      // Case C: Agar URL mein /news/ folder bhi ho (backup ke liye)
      const isNewsFolder = pathname.includes(`/${locale}/news/`);
      
      return (isHome || isNewsSlug || isNewsFolder)
        ? "text-white font-bold after:w-full" 
        : "text-slate-400 font-medium after:w-0";
    }

    // 2. Specific Sections (Events, Whales, etc.)
    const targetPath = `/${locale}${path}`;
    const isMatched = pathname === targetPath || pathname.startsWith(`${targetPath}/`);

    return isMatched
      ? "text-white font-bold after:w-full"
      : "text-slate-400 font-medium after:w-0";
  };

  const navLinks = [
    { href: "/", label: dict.header.news },
    { href: "/events", label: dict.header.events },
    { href: "/crypto-whales", label: dict.header.whales_tracking },
    { href: "/ico", label:dict.header.ico },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center gap-8 h-full">
        {navLinks.map((link) => {
          const activeClass = getActiveLink(link.href);
          const fullHref = link.href === "/" ? `/${locale}` : `/${locale}${link.href}`;
          
          return (
            <Link 
              key={link.href} 
              href={fullHref}
              className={`relative py-2 text-[14px] uppercase !text-white tracking-wider transition-all duration-300 hover:text-white group ${activeClass}`}
            >
              {link.label}
              {/* Blue Underline Animation */}
              <span className={`absolute bottom-0 left-0 h-[3px] bg-[#4f39f6] transition-all duration-300 group-hover:w-full ${activeClass.includes('after:w-full') ? 'w-full' : 'w-0'}`}></span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      {/* Mobile Menu Button - Edited */}
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
    <span className="text-[12px] text-slate-300 uppercase tracking-wider font-medium">
      {dict.header.select_language || "Select Language"}
    </span>
    
    {/* Button yahan aayega */}
    <Lang_Btn_mobile />
  </div>

  {navLinks.map((link) => {
    const activeClass = getActiveLink(link.href);
    const isActive = activeClass.includes('text-white');
    const fullHref = link.href === "/" ? `/${locale}` : `/${locale}${link.href}`;

    return (
      <div key={link.href} className="border-b border-white/5">
        <div className="flex items-center py-4">
          <Link 
            href={fullHref}
            onClick={() => setIsMenuOpen(false)}
            // 'relative' aur 'w-fit' zaroori hain line ko text ke size jitna rakhne ke liye
            className={`relative py-2 !text-slate-300 text-[10px] font-bold uppercase tracking-tight w-fit transition-all duration-300 ${
              isActive ? '!text-white' : 'text-slate-200'
            }`}
          >

            {link.label}
            
            {/* Desktop jaisi Blue Line */}
            <span 
              className={`absolute bottom-0 left-0 h-[3px] bg-[#4f39f6] transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0'
              }`}
            ></span>
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