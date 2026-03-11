import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAllEvents } from '../../apis/page_news/events';

const ArticlefirstPage = async ({ locale,dict }) => {
  // Component ke andar hi call (Professional way)
const articlesData = await fetchAllEvents(locale,1);
const articles = articlesData?.success ? articlesData.data : [];
const intelArticles = articles.slice(0, 8);
  return (
    <div className="mt-4 pt-10 border-t mb-5 border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-6">
        {intelArticles.map((art, i) => (
          <Link 
            href={`/${locale}/${art.slug}`} 
            key={art.id || i} 
            className="group block flex flex-col max-sm:px-4 py-5 md:p-5 md:bg-slate-50 md:rounded-[2rem] border-b border-slate-100 md:border-transparent md:hover:border-indigo-100 md:hover:bg-white transition-all md:shadow-sm md:hover:shadow-xl last:border-0"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 max-sm:h-[200px] w-full">
              <Image 
                src={art.main_image} 
                alt={art.title}
                fill 
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                priority={i < 4} 
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-2 py-0.5 rounded">
                {art.category}
              </span>
              <h4 className="text-lg md:text-md font-bold text-slate-800 md:text-slate-900 mt-3 line-clamp-2 leading-snug group-hover:text-indigo-700 transition-colors">
                {art.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlefirstPage;