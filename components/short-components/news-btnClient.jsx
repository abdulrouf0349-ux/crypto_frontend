'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function News_TypeButtonClient({ blockchainData, locale, dict }) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);

  return (
    <nav className="w-full bg-white  sticky top-0 z-50 shadow-sm">
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
      className={`inline-block px-4 py-2.5 text-[10px] sm:text-[12px] rounded-full font-medium uppercase tracking-wider transition-all duration-300 ${
        isSelected
          ? 'bg-[#4f39f6] text-white shadow-[0_8px_20px_-6px_rgba(79,57,246,0.45)] scale-105'
          : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 '
      }`}
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