'use client';
// ─────────────────────────────────────────────────────────────
// app/[locale]/events/EventsPage.jsx  →  CLIENT COMPONENT (UI)
// Rename: EventsPage.jsx  (page.js server component import karta hai)
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import { fetchAllEvents } from '../../../../apis/page_news/events';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { dict, locale } = useLocale();

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async (pageNum = 1) => {
    const response = await fetchAllEvents(pageNum, locale);

    if (response && response.data) {
      if (pageNum === 1) {
        setAllEvents(response.data);
        setFilteredEvents(response.data);
      } else {
        setAllEvents(prev => [...prev, ...response.data]);
        setFilteredEvents(prev => [...prev, ...response.data]);
      }

      if (response.metadata) {
        setHasMore(pageNum < response.metadata.total_pages);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(1);
  }, [locale]);

  const handleMoreEvents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  useEffect(() => {
    let result = allEvents;
    if (activeStatus !== 'All') {
      result = result.filter(event => event.status?.toLowerCase() === activeStatus.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(event =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold animate-pulse">Loading events...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* --- Breadcrumb --- */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2"
      >
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">{dict.header.news}</Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">{dict.header.events}</span>
      </nav>

      {/* --- Sub Navigation --- */}
      <div className="border-b border-slate-100 mb-10">
        <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 flex gap-8">
          {['all_events'].map((tab, idx) => (
            <button
              key={tab}
              className={`py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${idx === 0 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              {dict.events[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* --- Header Section --- */}
      <header className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {/* ✅ h1 tag — on-page SEO ke liye zaroori */}
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            {dict?.events?.title || "Crypto & Blockchain Events 2025"}
          </h1>
          <p className="text-slate-500 text-sm">
            {dict?.events?.subtitle || 'Find the latest global conferences, summits, and blockchain meetups.'}
          </p>
        </div>
      </header>

      {/* --- Filter Section --- */}
      <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar" role="group" aria-label="Filter by status">
            {['all', 'ongoing', 'upcoming', 'ended'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                aria-pressed={activeStatus === status}
                className={`px-5 py-1.5 border rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeStatus === status
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-500'
                }`}
              >
                {dict.filters[status]}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="event-search" className="sr-only">Search Events</label>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="event-search"
              type="search"
              placeholder="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* --- Events Grid --- */}
      <main className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 pb-20">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-slate-400 py-20 text-sm">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const config = getStatusConfig(event.status);

              return (
                <Link
                  href={`/${locale}/events/${event.slug}`}
                  key={event.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  // ✅ aria-label — screen readers + accessibility SEO
                  aria-label={`${event.title} – ${config.label}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={event.image_src || '/placeholder-event.jpg'}
                      alt={`${event.title} – Crypto Event`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${config.class}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-md font-bold mb-4 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h2>
                    <div className="space-y-2 mb-6 text-slate-500 text-xs font-semibold">
                      <div className="flex items-center gap-2 truncate">
                        <FiMapPin className="text-indigo-500 flex-shrink-0" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-indigo-500 flex-shrink-0" aria-hidden="true" />
                        <time dateTime={event.date_iso || event.date_text}>{event.date_text}</time>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-indigo-600 font-black text-[12px] group-hover:underline">Details</span>
                      <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[11px] font-black">
                        {config.btnText}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ✅ Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleMoreEvents}
              aria-label="Load more crypto events"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg w-full md:w-auto"
            >
              {dict.launchpad.show_more_coins}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;