'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FooterInteractive({ dict, locale }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sections = [
    {
      title: dict.news.title,
      links: [
        { href: `/${locale}`, label: dict.news.latest_news },
        { href: `/${locale}/news/bitcoin`, label:  dict.news.bitcoin},
        { href: `/${locale}/news/defi`, label: dict.news.defi },
        { href: `/${locale}/news/nfts`, label: dict.news.nft },
        { href: `/${locale}/news/ethereum`, label: dict.news.ethereum },
      ],
    },
    {
      title: dict.market_data,
      links: [
        { href: `/${locale}/ico`, label: dict.ico_token},
        { href: `/${locale}/events`, label: dict.header.events},
        { href: `/${locale}/glossary`, label: dict.coin_glossary },
        { href: `/${locale}/crypto-whales`, label: dict.upcoming_tokens },
      ],
    },
    {
      title: dict.info_title,
      links: [
        { href: `/${locale}/about-us`, label: dict.about.title },
        { href: `/${locale}/contact-us`, label: dict.about.contact  },
        { href: `/${locale}/privacy-policy`, label: dict.policies.privacy_policy },
      ],
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-[2]">
      {sections.map((section) => (
        <div key={section.title}>
          {/* TITLE: Inline style to FORCE white color */}
          <h4 
            style={{ color: '#4f39f6', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            className="text-[12px]   font-black uppercase tracking-[0.2em] mb-6 pb-2"
          >
            {section.title}
          </h4>
          
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  // INLINE STYLE for Label: This will ignore any other CSS conflict
                  style={{ color: '#94a3b8', opacity: '0.9' }}
                  className="text-[14px] text-indigo-600  transition-all duration-200 flex items-center group hover:!text-blue-400"
                >
                  <span className="w-0 group-hover:w-2 h-[1px] bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}