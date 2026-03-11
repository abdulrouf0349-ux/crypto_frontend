'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function News_TypeButtonClient({ blockchainData, locale, dict }) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto">
        <ul className="flex items-center lg:justify-center justify-start gap-3 overflow-x-auto no-scrollbar py-4 px-4 lg:px-28 scroll-smooth font-sans">
          {blockchainData.map((item) => {
            const itemKey = item.key.toLowerCase();
            
            let isSelected = false;
            if (itemKey === 'all') {
              isSelected = !pathParts.includes('news');
            } else {
              isSelected = pathParts.includes(itemKey);
            }

            const label = dict.news[item.key] || item.name;

            return (
              <li key={item.id} className="flex-shrink-0">
                <Link
                  href={itemKey === 'all' ? `/${locale}` : `/${locale}/news/${itemKey}`}
                  style={{
                    backgroundColor: isSelected ? '#4f39f6' : '',
                    color: isSelected ? '#ffffff' : ''
                  }}
                  className={`
                    inline-block px-4 py-2.5 text-[8px] sm:text-[12px] border-slate-200 rounded-full font-medium text-slate-600  uppercase tracking-wider transition-all duration-300 
                    ${isSelected 
                      ? 'shadow-[0_8px_20px_-6px_rgba(79,57,246,0.45)] scale-105' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                    }
                  `}
                >
                  {label}
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