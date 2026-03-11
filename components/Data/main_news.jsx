import Image from 'next/image';
import Link from 'next/link';
import Page_NewsData from '../../apis/page_news/page_newsData';
import MoreNews from './MoreNews';

export default async function MainNews({ locale, dict }) {
  // Initial data call (Page 1)
  const slider_Data = await Page_NewsData(1, locale);
  const initialNews = slider_Data?.results || [];

  return (
    <div className="space-y-1">
      {/* INITIAL NEWS LIST (Server Rendered) */}
      {initialNews.map((newsItem, index) => (
        <Link href={`/${locale}/${newsItem?.slug}`} key={index} className="group block">
          <div className="flex flex-row max-sm:flex-col gap-3 sm:gap-6 py-5 px-3 max-sm:px-4 transition-all duration-300 hover:bg-slate-50 border-b border-slate-100 rounded-xl">
            
            {/* Image */}
            <div className="relative flex-shrink-0 w-[160px] h-[122px] max-sm:w-full max-sm:h-[200px]">
              <Image
                src={newsItem?.image || newsItem?.image_main || "/images/bitcoin.jpg"}
                alt={newsItem?.title || "news"}
                className="rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
                fill
                sizes="(max-width: 640px) 100vw, 160px"
                unoptimized 
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between py-1">
              <div>
                <h2 className="text-lg leading-snug font-bold text-slate-600 group-hover:text-indigo-700 transition-colors duration-200 line-clamp-2">
                  {newsItem?.title}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {newsItem?.domain || "Crypto"}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {newsItem?.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      
      <MoreNews 
        total_pages={slider_Data?.total_pages} 
        locale={locale} 
        dict={dict} 
        serverData={initialNews}
      />
    </div>
  );
}