'use client';

import Image from "next/image";
import Link from "next/link";
import News_TypeButtonServer from "../short-components/news_btn";
import { useState, useEffect, Suspense } from "react";
import NewstypeApi from "../../apis/page_news/newstype";
import Page_NewsData from "../../apis/page_news/page_newsData";
import TopNews from "../Right_side/top_news";
import Api_call_data from "../Data/MoreNews";
import Loading from "../Data/loading";
import { fetchAllArticles } from "../../apis/page_news/events";

const NewsTypedata = ({ serverData, total_pages,topnews, news_name, current_page, visibleItems, locale, dict }) => {
  const [data, setData] = useState(serverData);
  const [articlesData, setArticlesData] = useState();
  const [currentPage, setCurrentPage] = useState(current_page);
  const [topData, setTopData] = useState([]); 
const intelArticles = Array.isArray(articlesData) ? articlesData.slice(0, 8) : [];
  useEffect(() => {
    const fetchTopNews = async () => {
      try {
        const topnewsdata = await Page_NewsData(locale, 1);
        setTopData(topnewsdata.results);
      } catch (error) {
        console.error('Error fetching top news:', error);
      }
    };
    fetchTopNews();
  }, [locale]);

  useEffect(() => {
    const fetchToparticle = async () => {
      try {
        const articlesData1 = await fetchAllArticles(locale,1);
        const articles = articlesData1?.success ? articlesData1.data : [];

        setArticlesData(articles);
        console.log('articles,',articlesData1)
      } catch (error) {
        console.error('Error fetching top news:', error);
      }
    };
    fetchToparticle();
  }, [locale]);

  const handleShowMore = async () => {
    try {
      const Apidata = await NewstypeApi(locale, news_name, currentPage + 1);
      setData((prevData) => [...prevData, ...Apidata.data.results]);
      setCurrentPage(Apidata.data.current_page);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };

  return (
    <div className="overflow-x-hidden !bg-white">
      <div className="!bg-[#eee9e9] w-full h-[100px] md:h-[150px]"></div>
      
      <News_TypeButtonServer locale={locale} dict={dict}/>
<h1 className="sr-only">
  {news_name.charAt(0).toUpperCase() + news_name.slice(1)} News, Price Analysis & Predictions
</h1>
      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto  lg:px-28 md:px-6 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* Left Column: News Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<Loading />}>
              <Api_call_data
                serverData={data} // Use local 'data' state here to show more items
                total_pages={total_pages}
                current_page={currentPage}
                dict={dict}
                locale={locale}
              />
            </Suspense>

       
          </div>

          {/* Right Column: Sidebar */}
          <div className="mb-5">
            <TopNews serverData={topData} locale={locale} dict={dict}/>
          </div>
        </div>
      </div>

      {/* Intel Articles Section - FIXED MARGINS FOR MOBILE */}
      <div className="mt-12 pt-10 border-t border-slate-100  pb-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-28">
          <h3 className="text-xl md:text-2xl font-black uppercase  tracking-tighter mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Read Articles
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {intelArticles?.map((art, i) => (
              <a 
                href={`/${locale}/articles/${art.slug}`} 
                key={i} 
                className="group !bg-white p-4 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all shadow-sm hover:shadow-xl flex flex-col"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img 
                    src={art.main_image} 
                    alt={art.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{art.category}</span>
                <h2 className="text-sm md:text-md font-bold text-slate-900 mt-2 line-clamp-2 leading-snug group-hover:text-indigo-700">
                  {art.title}
                </h2>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTypedata;