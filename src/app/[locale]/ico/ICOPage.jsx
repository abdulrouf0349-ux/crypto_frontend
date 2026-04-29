'use client';
import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchAllIcoProjects } from '../../../../apis/page_news/events';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

const ICOPage = () => {
  const [icoData, setIcoData]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [activeTab, setActiveTab]     = useState('Active');
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const { dict } = useLocale();

  const params = useParams();
  const locale = params.locale;

  const getData = async (pageNum = 1, currentStatus = activeTab) => {
    if (pageNum === 1) setLoading(true);
    else setMoreLoading(true);

    try {
      const result = await fetchAllIcoProjects(locale, currentStatus.toLowerCase(), pageNum);
      if (result.success === true) {
        const incoming = result.data || [];
        if (pageNum === 1) setIcoData(incoming);
        else setIcoData(prev => [...prev, ...incoming]);
        setHasMore(result.has_next);
      }
    } catch (err) {
      console.error('ICO fetch error:', err);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    getData(1, activeTab);
  }, [locale, activeTab]);

  const handleShowMore = () => {
    const next = page + 1;
    setPage(next);
    getData(next, activeTab);
  };

  if (loading && page === 1) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold animate-pulse text-indigo-600 uppercase tracking-widest">
        Loading Launchpad...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* SEMANTIC MAIN START */}
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-indigo-600 transition-colors">{dict.header.news}</Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-slate-400" aria-current="page">{dict.launchpad.ico_title}</span>
        </nav>

        {/* Tab Nav */}
        <div className="border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-28 flex gap-8 whitespace-nowrap" role="tablist">
            {['Active', 'Upcoming', 'Ended'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                  activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
                }`}
              >
                {tab} Projects
              </button>
            ))}
          </div>
        </div>

        {/* Header - H1 Hierarchy */}
        <header className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              {dict.launchpad.title}
            </h1>
            <p className="text-slate-500 text-sm">
              {dict.launchpad.description} <strong className="text-slate-700">{activeTab}</strong> stage.
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95">
            Submit Project
          </button>
        </header>

        {/* ICO Grid - H2 Titles */}
        <section className="max-w-[1400px] mx-auto px-4 lg:px-28 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {icoData.map((ico) => (
              <article key={ico.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden">
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image src={ico.main_img || '/placeholder.jpg'} alt={`${ico.name} logo`} fill className="object-contain p-4" unoptimized />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                      {ico.status_time || ico.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-md font-bold tracking-tight mb-1 group-hover:text-indigo-600 line-clamp-1">
                    {ico.name}
                  </h2>
                  <p className="text-slate-500 text-[12px] line-clamp-2 mb-4">{ico.description}</p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <Link href={locale === 'en' ? `/ico/${ico.slug}` : `/${locale}/ico/${ico.slug}`} className="text-indigo-600 font-black text-[12px]">Details</Link>
                    <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[11px] font-black">Whitelist</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button onClick={handleShowMore} disabled={moreLoading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 disabled:opacity-50">
                {moreLoading ? 'Loading...' : dict.launchpad.show_more_coins}
              </button>
            </div>
          )}
        </section>
      </main>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </div>
  );
};

export default ICOPage;