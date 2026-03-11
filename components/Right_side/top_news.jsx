'use client'
import Image from 'next/image';
import Link from 'next/link';
import Page_NewsData from '../../apis/page_news/page_newsData';
import { useEffect, useState } from 'react';

const TopNews =  ({ locale, dict }) => {
  const [slider_Data,setServerData]=useState([])
  const [loading,setLoading]=useState(false)

  // // Component ke andar hi call
  useEffect(() => {
    const loadTopNews = async () => {
      try {
        setLoading(true);
        // API call
        const slider_Data = await Page_NewsData(1,locale); 
        console.log(slider_Data,'kkkkkkkkkkkkkkkkk')
        // 5 se 11 index tak ka data slice kar rahe hain
        const slicedData = slider_Data?.results?.slice(5, 11) || [];
        console.log(slicedData,'lllllllllllllllllllllllll')
        setServerData(slicedData);
      } catch (error) {
        console.error("Top News Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopNews();
  }, [locale]);

  return (
    <div className='w-full mt-10 space-y-2'>
      <div className="flex items-center gap-2 px-2 max-sm:px-4 mb-5">
        <div className="h-5 w-1 bg-blue-600 rounded-full"></div>
        <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#37474f]">
          {dict?.on_page.top_stories || "Top Stories"}
        </h3>
      </div>

      {slider_Data?.map((item, index) => (
        <Link href={`/${locale}/${item?.slug}`} key={index} className="group block">
          <div className='flex flex-row max-sm:flex-col gap-4 p-2 max-sm:px-4 transition-all duration-300 hover:bg-blue-50/50 rounded-xl border-b border-slate-50 max-sm:pb-6'>
            <div className="relative flex-shrink-0 w-[100px] h-[72px] max-sm:w-full max-sm:h-[200px] overflow-hidden rounded-lg bg-gray-100 shadow-sm">
              <Image 
                src={item?.image || "/images/bitcoin.jpg"} 
                fill
                alt={item?.title} 
                unoptimized 
                className='object-cover transform group-hover:scale-110 transition-transform duration-700'
                sizes="(max-width: 640px) 100vw, 100px"
              />
            </div>

            <div className='flex flex-col justify-between py-0.5 flex-1'>
              <h4 className='line-clamp-2 text-[13px] max-sm:text-[16px] leading-[1.4] font-bold text-[#37474f] group-hover:text-blue-700 transition-colors duration-200'>
                {item?.title}
              </h4>
              <div className='flex items-center gap-3 mt-2 md:mt-1.5'>
                <span className='text-[10px] max-sm:text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded'>
                  {item?.domain}
                </span>
                <span className='text-[10px] max-sm:text-[11px] text-slate-400 font-medium'>
                  {item?.time}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopNews;