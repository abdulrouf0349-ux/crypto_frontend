'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAllEvents } from '../../../../apis/page_news/events';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

const EventsPage = () => {
  const { dict, locale } = useLocale();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // ✅ Optimized LoadData (Callback to prevent unnecessary re-renders)
  const loadData = useCallback(async (pageNum) => {
    try {
      const response = await fetchAllEvents(pageNum, locale);
      if (response && response.data) {
        setAllEvents(prev => pageNum === 1 ? response.data : [...prev, ...response.data]);
        
        if (response.metadata) {
          setHasMore(pageNum < response.metadata.total_pages);
        }
      }
    } catch (error) {
      console.error("SEO Error: Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Initial Load
  useEffect(() => {
    setPage(1);
    loadData(1);
  }, [locale, loadData]);

  const handleMoreEvents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  // ✅ Client Side Filtering
  useEffect(() => {
    let result = [...allEvents];
    if (activeStatus !== 'all') {
      result = result.filter(e => e.status?.toLowerCase() === activeStatus.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
      );
    }
    setFilteredEvents(result);
  }, [activeStatus, searchQuery, allEvents]);

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (s === 'ongoing') return { label: 'Ongoing', class: 'bg-emerald-500 text-white', btnText: 'Join Now' };
    if (s === 'ended') return { label: 'Ended', class: 'bg-slate-500 text-white', btnText: 'Closed' };
    return { label: 'Upcoming', class: 'bg-orange-400 text-white', btnText: 'Register' };
  };

  if (loading && page === 1) return (
    <div className="min-h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse">
      Loading Crypto Events...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Breadcrumb for SEO */}
      <nav className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-sm text-slate-500">
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">{dict.header.news}</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-bold">{dict.header.events}</span>
      </nav>

      <header className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
          {dict?.events?.title || "Crypto & Blockchain Events 2026"}
        </h1>
        <p className="text-slate-500 max-w-2xl">
          {dict?.events?.subtitle || "Global crypto conferences, summits, and NFT meetups."}
        </p>
      </header>

      {/* Filter Bar */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['all', 'ongoing', 'upcoming', 'ended'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                activeStatus === status ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-slate-200 text-slate-500 hover:border-indigo-400'
              }`}
            >
              {dict.filters[status]}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search city or event..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-28 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredEvents.map((event) => {
            const config = getStatusConfig(event.status);
            return (
              <Link 
                href={`/${locale}/events/${event.slug}`} 
                key={event.id}
                className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image 
                    src={event.image_src || '/placeholder.jpg'} 
                    alt={event.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized 
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.class}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="font-black text-lg mb-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {event.title}
                  </h2>
                  <div className="mt-auto space-y-2 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2"><FiMapPin className="text-indigo-500" /> {event.location}</div>
                    <div className="flex items-center gap-2"><FiCalendar className="text-indigo-500" /> {event.date_text}</div>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-indigo-600 font-black text-[11px] uppercase tracking-wider">View Details</span>
                    <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                      {config.btnText}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleMoreEvents}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              {dict.launchpad.show_more_coins}
            </button>
          </div>
        )}
      </main>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </div>
  );
};

export default EventsPage;