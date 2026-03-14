import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin } from 'react-icons/fi';
import { fetchAllEvents } from '../../apis/page_news/events';

const EventNews = async ({ locale, dict }) => {
  // Component ke andar hi call
  const events_res = await fetchAllEvents(1, locale);
  const serverData = events_res?.data?.slice(0, 5) || [];

  return (
    <div className='w-full mt-6 space-y-2'>
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="h-5 w-1 bg-blue-600 rounded-full"></div>
        <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#37474f]">
          {dict?.on_page.market_events || "Market Events"}
        </h3>
      </div>

      {serverData.map((item, index) => (
        <Link href={`/${locale}/events/${item?.slug}`} key={index} className="group block">
          <div className='flex flex-row max-sm:flex-col gap-4 p-2 max-sm:px-4 transition-all duration-300 hover:bg-blue-50/50 rounded-xl'>
            <div className="relative flex-shrink-0 w-[100px] h-[72px] max-sm:w-full max-sm:h-[180px] overflow-hidden rounded-lg bg-gray-100 shadow-sm">
              <Image 
                src={item?.image_src || "/images/bitcoin.jpg"} 
                fill
                alt={item?.title} 
                unoptimized 
                className='object-cover transform group-hover:scale-110 transition-transform duration-700'
                sizes="(max-width: 640px) 100vw, 100px"
              />
            </div>

            <div className='flex flex-col justify-between py-0.5 flex-1'>
              <h4 className='line-clamp-2 text-[12px] max-sm:text-[14px] leading-[1.4] font-bold text-[#37474f] group-hover:text-blue-700 transition-colors duration-200'>
                {item?.title}
              </h4>
              <div className='flex flex-col gap-1.5 mt-2'>
                {item?.detail_location && (
                  <div className="flex items-start gap-2 text-slate-500 min-w-0">
                    <FiMapPin className="shrink-0 mt-1 text-indigo-500" size={14} />
                    <span className="text-[11px] md:text-xs font-medium leading-snug line-clamp-2 break-words">
                      {item.detail_location || "Global / Online"}
                    </span>
                  </div>
                )}
                <div className='flex items-center gap-3'>
                  <span className='text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded'>
                    {item?.category || "Event"}
                  </span>
                  <span className='text-[9px] text-slate-400 font-medium'>
                    {item?.created_at?.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventNews;