'use client'; // Isse saare build errors khatam ho jayenge

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function News_TypeButtonClient({ dict, locale }) {
  const pathname = usePathname();

  const blockchainData = [
    { id: 1, key: 'all', name: 'All' },
    { id: 2, key: 'bitcoin', name: 'Bitcoin' },
    { id: 3, key: 'ethereum', name: 'Ethereum' },
    { id: 4, key: 'blockchain', name: 'Blockchain' },
    { id: 5, key: 'defi', name: 'DeFi' },
    { id: 6, key: 'nfts', name: 'NFTs' },
    { id: 7, key: 'cryptocurrency', name: 'Cryptocurrency' },
    { id: 8, key: 'altcoin', name: 'Altcoin' },
    { id: 9, key: 'staking', name: 'Staking' },
    { id: 10, key: 'dao', name: 'DAO' },
    { id: 11, key: 'mining', name: 'Mining' },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto">
        <ul className="flex items-center lg:justify-center justify-start gap-3 overflow-x-auto no-scrollbar py-4 px-4 lg:px-28 scroll-smooth font-sans">
          {blockchainData.map((item) => {
            const itemKey = item.key.toLowerCase();
            
            // Selection Logic: Client-side pathname se check karein
            // 'all' tab active hoga jab URL sirf /en ya /en/ ho
            const isSelected = itemKey === 'all' 
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname.includes(`/${itemKey}`);

            return (
              <li key={item.id} className="flex-shrink-0">
                <Link
                  href={itemKey === 'all' ? `/${locale}` : `/${locale}/news/${itemKey}`}
                  className={`inline-block px-4 py-2.5 text-[10px] sm:text-[12px] rounded-full font-medium uppercase tracking-wider transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[#4f39f6] !text-white shadow-[0_8px_20px_-6px_rgba(79,57,246,0.45)] scale-105' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {dict?.news?.[item.key] || item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
}