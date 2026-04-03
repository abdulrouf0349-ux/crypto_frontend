'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Page_NewsData from '../../apis/page_news/page_newsData';

export default function MoreNews({ total_pages, serverData, locale, dict }) {
  const [extraNews, setExtraNews] = useState(serverData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleShowMore = async () => {
    setLoading(true);
    const nextPage = currentPage + 1;
    const newData = await Page_NewsData(nextPage, locale);
    if (newData?.results) {
      setExtraNews(prev => [...prev, ...newData.results]);
      setCurrentPage(nextPage);
    }
    setLoading(false);
  };

  return (
    <>
      {extraNews && extraNews.length > 0 ? (
        extraNews?.map((newsItem, index) => (
          <Link href={`/${locale}/${newsItem?.slug}`} key={`more-${index}`} className="group block">
            <div className="flex flex-row max-sm:flex-col gap-3 sm:gap-6 py-5 px-3 max-sm:px-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-gray-800 border-b border-slate-100 dark:border-gray-700 rounded-xl">
              <div className="relative flex-shrink-0 w-[160px] h-[122px] max-sm:w-full max-sm:h-[200px]">
                <Image
                  src={newsItem?.image || newsItem?.image_main || "/images/bitcoin.jpg"}
                  alt={newsItem?.title || "news"}
                  className="rounded-lg object-cover"
                  fill
                  unoptimized
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <h2 className="text-lg leading-snug font-bold !text-slate-600 dark:text-gray-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 line-clamp-2">
                  {newsItem?.title}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                    {newsItem?.domains || "cryptpnewstrend.com"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="py-40 text-center">
          <p className="text-slate-400 dark:text-gray-500 font-medium">No data available at the moment.</p>
        </div>
      )}

      {currentPage < total_pages && (
        <div className="mt-12 mb-5 flex justify-center">
          <button
            onClick={handleShowMore}
            disabled={loading}
            className="px-8 py-3 max-sm:w-[90%] border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : (dict?.on_page?.view_more || "View More")}
          </button>
        </div>
      )}
    </>
  );
}