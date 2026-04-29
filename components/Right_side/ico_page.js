import Image from 'next/image';
import Link from 'next/link';
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const IcoSidebar = ({ icoData, locale, dict }) => {
    
  const visibleItems = 6; 

  return (
    /* mt-50 ko kam kar ke mt-8 ya 10 karein agar zyada gap hai */
    <div className='w-full mt-8 space-y-2'>
      {/* Section Header */}
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="h-5 w-1 bg-green-500 rounded-full"></div>
        <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#37474f]">
          {dict?.news_slug.trending_icos || "Trending ICOs"}
        </h3>
      </div>

      {icoData?.slice(0, visibleItems).map((item, index) => {
        return (
          <Link href={locale === 'en' ? `/ico/${item?.slug}` : `/${locale}/ico/${item?.slug}`} key={index} className="group block">
            {/* Change 1: max-sm:flex-col aur padding fix */}
            <div className='flex flex-row max-sm:flex-col gap-4 p-2 max-sm:px-4 transition-all duration-300 hover:bg-green-50/50 rounded-xl'>
              
              {/* Image Container */}
              {/* Change 2: Mobile par Full Width aur Height 180px */}
              <div className="relative flex-shrink-0 w-[100px] h-[72px] max-sm:w-full max-sm:h-[180px] overflow-hidden rounded-lg bg-gray-100 shadow-sm border border-slate-50">
                <Image 
                  src={item?.main_img || "/images/placeholder.jpg"} 
                  fill
                  alt={item?.name} 
                  unoptimized 
                  className='object-cover transform group-hover:scale-110 transition-transform duration-700'
                  sizes="(max-width: 640px) 100vw, 100px"
                />
              </div>

              {/* Content Section */}
              <div className='flex flex-col justify-between py-0.5 flex-1'>
                {/* Change 3: Mobile par Title size barha diya */}
                <h4 className='line-clamp-2 text-[12px] max-sm:text-[15px] leading-[1.4] font-bold text-[#37474f] group-hover:text-green-600 transition-colors duration-200'>
                  {item?.name}
                </h4>
                
                <div className='flex flex-col gap-1.5 mt-2'>
                  {/* Raised Amount */}
                  <div className="flex items-center gap-1 text-[10px] max-sm:text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                    <FiDollarSign className="text-green-600" size={14} />
                    <span className="truncate">{item?.overview_data?.total_raised || "TBA"} Raised</span>
                  </div>

                  {/* Bottom Meta */}
                  <div className='flex items-center gap-3'>
                    <span className='text-[9px] max-sm:text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded'>
                      {item?.category_name || "ICO"}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] max-sm:text-[10px] text-slate-400 font-medium">
                       <FiTrendingUp size={12} className="text-blue-400" />
                       <span>{item?.overview_data?.twitter_performance || "Stable"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  );
};

export default IcoSidebar;