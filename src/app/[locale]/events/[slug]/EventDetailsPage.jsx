'use client';
// app/[locale]/events/[slug]/EventDetailsPage.jsx  →  CLIENT COMPONENT (UI)
import React, { useState, useEffect } from 'react';
import {
  FiMapPin, FiCalendar, FiGlobe, FiShare2,
  FiClock, FiMail, FiExternalLink
} from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchEventDetails } from '../../../../../apis/page_news/events';
import { notFound } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../../components/Data/CoinAnalysisFloat';

const EventDetailsPage = ({initialData}) => {
    const {  dict } = useLocale();
  
  const params = useParams();
  const slug   = params?.slug;
  const locale = params?.locale || 'en';

  const [event, setEvent]   = useState(initialData);
 const [loading, setLoading] = useState(!initialData); // ✅ initialData hai toh false

  useEffect(() => {
    if (initialData) return; // ✅ server se data aa gaya — fetch skip
    const load = async () => {
      const data = await fetchEventDetails(slug, locale);
      setEvent(data);
      setLoading(false);
    };
    if (slug) load();
  }, [slug, locale]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-black text-indigo-600 animate-pulse">
      LOADING EVENT...
    </div>
  );

  if (!event) return notFound();


  return (
    <>
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-[13px] font-medium text-slate-500"
      >
        <Link href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-indigo-600">{dict.header.news}</Link>
        <span aria-hidden="true">›</span>
        <Link href={locale === 'en' ? '/events' : `/${locale}/events`} className="hover:text-indigo-600">{dict.header.events}</Link>
        <span aria-hidden="true">›</span>
        <span className="text-slate-400 truncate" aria-current="page">{event.detail_title || event.title}</span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:py-6 pb-20">

        {/* Top Info Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold rounded capitalize border border-orange-100">
                {event.category || 'Seminar'}
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold rounded capitalize border border-orange-100">
                {event.status || 'Upcoming'}
              </span>
            </div>

            {/* ✅ h1 — on-page SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {event.title}
            </h1>

            <address className="not-italic space-y-3 text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <FiMapPin size={16} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">{event.detail_location}</span>
                <FiExternalLink className="text-blue-500 cursor-pointer shrink-0" size={14} aria-hidden="true" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <FiCalendar size={16} aria-hidden="true" />
                </div>
                {/* ✅ <time> tag — Google date parsing */}
                <time dateTime={event.date_iso || event.date_text} className="text-sm font-semibold">
                  {event.date_text}
                </time>
              </div>

              {event.website_link && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FiGlobe size={16} aria-hidden="true" />
                  </div>
                  <a
                    href={event.website_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold hover:text-indigo-600 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </address>
          </div>

          <div className="flex gap-3 shrink-0">
            <button aria-label="Share this event" className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-blue-600">
              <FiShare2 size={20} />
            </button>
            <button aria-label="View website" className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-400">
              <FiGlobe size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: Banner & Description */}
          <div className="lg:col-span-2 space-y-8">

            {/* Registration Bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-black text-slate-900 text-base">Welcome! To join the event, please register</h2>
                <p className="text-slate-500 text-sm font-medium tracking-tight">Register and confirmation will be sent on your mail</p>
              </div>
              {event.website_link && (
                <a
                  href={event.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Register for ${event.title}`}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                >
                  Register
                </a>
              )}
            </div>

            {/* Event Poster */}
         <figure className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-100">
  <Image
    src={event.image_src || '/placeholder-event.jpg'}
    alt={`Official poster for ${event.title} crypto event`}
    fill
    priority // High priority for LCP
    className="object-cover transition-transform duration-500 hover:scale-105"
    unoptimized
  />
</figure>

            {/* Description */}
          <section className="prose prose-slate max-w-none">
    <h2 className="text-xl font-bold text-slate-900 mb-4">About this Event</h2>
    <div className="text-slate-600 leading-relaxed space-y-4">
        {event.description}
    </div>
</section>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="space-y-6" aria-label="Event details sidebar">

            {/* Countdown Card */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <FiCalendar size={20} aria-hidden="true" />
                </div>
                <span className="font-bold text-orange-700">Event Starts in</span>
              </div>
              <div className="flex justify-between items-center text-slate-900">
                {[
                  { value: '239', label: 'Days' },
                  { value: '20',  label: 'Hrs'  },
                  { value: '10',  label: 'Mins' },
                  { value: '45',  label: 'Secs', color: 'text-orange-600' },
                ].map(({ value, label, color }) => (
                  <div key={label} className="text-center">
                    <p className={`text-2xl font-black ${color || ''}`}>{value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organized By */}
            <div className="border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Organized By</h3>
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <Image src="/logo-icon.png" width={40} height={40} alt="Organizer logo" className="p-2" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {event.organized_by || 'CoinAlts'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Event Organiser, USA</p>
                  </div>
                </div>
                <span className="text-slate-300" aria-hidden="true">›</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Contact Details</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Host / Organizer Details</p>
              <div className="flex items-center gap-3 text-blue-600">
                <FiMail size={18} aria-hidden="true" />
                <a href="mailto:info@coinalts.xyz" className="text-sm font-semibold tracking-tight underline">
                  info@coinalts.xyz
                </a>
              </div>
              <button
                aria-label="Contact event host or organizer"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-black text-sm hover:bg-blue-700 transition-all shadow-md"
              >
                Contact Host/Organizer
              </button>
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 mb-3 tracking-tight">Tags</h3>
              <div className="flex flex-wrap gap-2" aria-label="Event tags">
                {['#Events','CryptoEvents', '#cryptohost', '#Crypto Finance'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded hover:bg-slate-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Location / Google Map */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Location</h3>
              <p className="text-[13px] font-medium text-slate-600 leading-snug">{event.location}</p>
              {event.maps_link && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    src={`${event.maps_link}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map location for ${event.title}`}
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute bottom-2 right-2">
                    <a
                      href={event.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-black flex items-center gap-1.5 hover:bg-slate-50"
                    >
                      <FiMapPin className="text-red-500" aria-hidden="true" /> View on Map
                    </a>
                  </div>
                </div>
              )}
            </div>

          </aside>
        </div>
      </main>
    </div>
   <MobileSupportButton dict={dict} />
                       <CoinAnalysisFloat locale={locale} />   
                       </>
  );
};

export default EventDetailsPage;