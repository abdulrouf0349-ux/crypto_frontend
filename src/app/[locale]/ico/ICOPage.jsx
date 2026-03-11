'use client';
// app/[locale]/ico/ICOPage.jsx  →  CLIENT COMPONENT
import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchAllIcoProjects } from '../../../../apis/page_news/events';
import { useLocale } from '@/context/LocaleContext';

const ICOPage = () => {
  const [icoData, setIcoData]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [activeTab, setActiveTab]     = useState('Active');
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(false);
  const {  dict } = useLocale();

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

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2"
      >
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">{dict.header.news}</Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">{dict.launchpad.ico_title}</span>
      </nav>

      {/* Tab Nav */}
      <div className="border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
        <div
          className="max-w-[1400px] mx-auto px-6 max-sm:px-4 lg:px-28 flex gap-8 whitespace-nowrap"
          role="tablist"
          aria-label="Filter ICO projects by status"
        >
          {['Active', 'Upcoming', 'Ended'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab} Projects
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            {dict.launchpad.title}
          </h1>
          <p className="text-slate-500 text-sm">
            {dict.launchpad.description}{' '}
            <strong className="text-slate-700">{activeTab}</strong> stage.
          </p>
        </div>
        <button
          aria-label="Submit your ICO project"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 w-full md:w-auto"
        >
          Submit Project
        </button>
      </header>

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto" role="group" aria-label="Filter options">
          {['Category', 'Platform'].map(filter => (
            <button
              key={filter}
              aria-label={`Filter by ${filter}`}
              className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors"
            >
              {filter} <FiChevronDown aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <label htmlFor="ico-search" className="sr-only">Search ICO Projects</label>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="ico-search"
            type="search"
            placeholder="Search ICO Projects"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* ICO Grid */}
      <main className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {icoData.map((ico) => (
            <article
              key={ico.id}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              aria-label={`${ico.name} – ${ico.status} ICO`}
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={ico.main_img || '/placeholder-ico.jpg'}
                  alt={`${ico.name} – Crypto ICO Project`}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  {/* Status badge */}
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase shadow-sm ${
                    ico.status?.toLowerCase() === 'active'
                      ? 'bg-emerald-500 text-white'
                      : ico.status?.toLowerCase() === 'upcoming'
                      ? 'bg-orange-400 text-white'
                      : 'bg-slate-400 text-white'
                  }`}>
                    {ico.status_time || ico.status}
                  </span>
                  {/* Category badge */}
                  {ico.category_name && (
                    <span className="bg-white/90 backdrop-blur px-2.5 py-0.5 rounded text-[9px] font-bold text-slate-700 shadow-sm">
                      {ico.category_name}
                    </span>
                  )}
                </div>

                {/* Ticker badge top-right */}
                {ico.ticker && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                    {ico.ticker}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-md font-bold tracking-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {ico.name}
                </h2>

                {/* Project type */}
                {ico.project_type && (
                  <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">{ico.project_type}</p>
                )}

                <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 mb-4">
                  {ico.description}
                </p>

                {/* Raised / Valuation */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Raised</span>
                    <span className="text-[10px] font-black text-indigo-600">
                      {ico.raised_text && ico.raised_text !== '—' ? ico.raised_text : 'TBA'}
                    </span>
                  </div>

                  {/* Pre-valuation */}
                  {ico.pre_valuation && ico.pre_valuation !== '—' && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Valuation</span>
                      <span className="text-[10px] font-black text-slate-600">{ico.pre_valuation}</span>
                    </div>
                  )}

                  <div
                    className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label="Fundraising progress"
                  >
                    <div className="bg-indigo-600 h-full w-[45%]" />
                  </div>
                </div>

                {/* Round count */}
                {ico.rounds_count && (
                  <p className="text-[10px] text-slate-400 mb-4">{ico.rounds_count}</p>
                )}

                {/* Social links row */}
                <div className="flex gap-3 mb-4">
                  {ico.website && (
                    <a href={ico.website} target="_blank" rel="noopener noreferrer"
                       className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors"
                       aria-label={`${ico.name} website`}>
                      🌐 Web
                    </a>
                  )}
                  {ico.twitter && (
                    <a href={ico.twitter} target="_blank" rel="noopener noreferrer"
                       className="text-[10px] text-slate-400 hover:text-sky-500 transition-colors"
                       aria-label={`${ico.name} Twitter`}>
                      𝕏 Twitter
                    </a>
                  )}
                  {ico.discord && (
                    <a href={ico.discord} target="_blank" rel="noopener noreferrer"
                       className="text-[10px] text-slate-400 hover:text-indigo-500 transition-colors"
                       aria-label={`${ico.name} Discord`}>
                      💬 Discord
                    </a>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                  <Link
                    href={`/${locale}/ico/${ico.slug}`}
                    className="text-indigo-600 font-black text-[12px] hover:underline"
                    aria-label={`View details for ${ico.name}`}
                  >
                    Details
                  </Link>
                  <a
                    href={ico.detail_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-[12px] font-black hover:bg-indigo-700 shadow-sm transition-colors"
                    aria-label={`Whitelist for ${ico.name}`}
                  >
                    Whitelist
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Show More */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleShowMore}
              disabled={moreLoading}
              aria-label="Load more ICO projects"
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {moreLoading ? 'Loading...' : dict.launchpad.show_more_coins}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && icoData.length === 0 && (
          <div className="py-20 text-center opacity-40 font-black uppercase tracking-widest text-xs">
            No {activeTab} Projects Found
          </div>
        )}
      </main>
    </div>
  );
};

export default ICOPage;