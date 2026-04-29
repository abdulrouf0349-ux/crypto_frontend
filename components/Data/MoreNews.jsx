'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Page_NewsData from '../../apis/page_news/page_newsData';

export default function MoreNews({ total_pages,serverData, locale, dict }) {
const [extraNews, setExtraNews] = useState(serverData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const formatNewsTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return isNaN(date.getTime()) ? timeStr : date.toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

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
      <div className="space-y-4">
        {extraNews.map((newsItem, index) => {
          const newsUrl = locale === 'en' ? `/${newsItem?.slug}` : `/${locale}/${newsItem?.slug}`;
          return (
            <article key={`extra-${index}`} className="group border-b border-slate-100 dark:border-gray-800 last:border-0 animate-in fade-in slide-in-from-bottom-2">
              <Link href={newsUrl} className="flex flex-row max-sm:flex-col gap-4 sm:gap-6 py-5 px-3 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="relative flex-shrink-0 w-[180px] h-[120px] max-sm:w-full max-sm:h-[210px] overflow-hidden rounded-xl">
                  <Image
                    src={(newsItem?.image || newsItem?.image_main || "/images/placeholder.jpg").replace('cryptonews.fun', 'cryptonewstrend.com')}
                    alt={newsItem?.title || "Crypto News"}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                  />
                </div>
                <div className="flex flex-col flex-1 py-1">
                  <h2 className="text-xl leading-tight font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 line-clamp-2">
                    {newsItem?.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-auto pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {newsItem?.domains || "Market Update"}
                    </span>
                    <time className="text-xs text-slate-400">{formatNewsTime(newsItem?.time)}</time>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {currentPage < total_pages && (
        <div className="mt-12 mb-5 flex justify-center">
          <button
            onClick={handleShowMore}
            disabled={loading}
            className="px-10 py-4 w-full sm:w-auto border-2 border-indigo-600 text-indigo-600 font-extrabold rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Loading..." : (dict?.on_page?.view_more || "READ MORE NEWS")}
          </button>
        </div>
      )}
    </>
  );
}