import Image from 'next/image';
import Link from 'next/link';
import Page_NewsData from '../../apis/page_news/page_newsData';
import MoreNews from './MoreNews';

export default async function MainNews({ locale, dict }) {
  const data = await Page_NewsData(1, locale);
  const initialNews = data?.results || [];

  const formatNewsTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return isNaN(date.getTime()) ? timeStr : date.toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {initialNews.map((newsItem, index) => {
        // Correct URL for English
        const newsUrl = locale === 'en' ? `/${newsItem?.slug}` : `/${locale}/${newsItem?.slug}`;
        
        return (
          <article key={index} className="group border-b border-slate-100 dark:border-gray-800 last:border-0">
            <Link href={newsUrl} className="flex flex-row max-sm:flex-col gap-4 sm:gap-6 py-5 px-3 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
              
              <div className="relative flex-shrink-0 w-[180px] h-[120px] max-sm:w-full max-sm:h-[210px] overflow-hidden rounded-xl">
                <Image
                  src={(newsItem?.image || newsItem?.image_main || "/images/placeholder.jpg").replace('cryptonews.fun', 'cryptonewstrend.com')}
                  alt={newsItem?.title || "Crypto News"}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  fill
                  sizes="(max-width: 640px) 100vw, 180px"
                  priority={index < 3} // SEO: Hero images should load fast
                />
              </div>

              <div className="flex flex-col flex-1 py-1">
                <h2 className="text-xl leading-tight font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {newsItem?.title}
                </h2>
                <div className="flex items-center gap-3 mt-auto pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                    {newsItem?.domains || "Market Update"}
                  </span>
                  <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={newsItem?.time}>
                    {formatNewsTime(newsItem?.time)}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        );
      })}

      <MoreNews 
        total_pages={data?.total_pages} 
        locale={locale} 
        dict={dict} 
      />
    </div>
  );
}