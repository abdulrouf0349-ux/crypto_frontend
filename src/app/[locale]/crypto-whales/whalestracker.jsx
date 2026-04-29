'use client';

// app/[locale]/crypto-whales/WhaleTracker.jsx
import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiActivity, FiArrowRight,
  FiExternalLink, FiTrendingUp,
  FiDatabase, FiZap, FiLink
} from 'react-icons/fi';
import { fetchWhaleAlerts } from '../../../../apis/cryptowhales';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

// ── Alert type styling ──────────────────────────────────────────
const ALERT_STYLE = {
  Burn:    { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     badge: 'bg-red-100 text-red-600',         label: 'Burn',     icon: '🔥' },
  Mint:    { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-600', label: 'Mint',     icon: '🌱' },
  Alert:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   badge: 'bg-amber-100 text-amber-600',     label: 'Transfer', icon: '⚡' },
  default: { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-100',   badge: 'bg-slate-100 text-slate-600',     label: 'Event',    icon: '📡' },
};

const getAlertStyle = (type) => ALERT_STYLE[type] || ALERT_STYLE.default;

// ── Helpers ────────────────────────────────────────────────────
const isValid = (val) => val && val !== 'N/A' && val !== 'null' && val !== 'None';
const shortAddr = (addr) => {
  if (!isValid(addr)) return '—';
  if (addr.length > 16) return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  return addr;
};

// ── Sub-Components ─────────────────────────────────────────────
const IntensityBar = ({ emoticons }) => {
  if (!isValid(emoticons)) return null;
  const filled = Math.min(emoticons.split(',').length, 10);
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full flex-1 ${i < filled ? 'bg-indigo-500' : 'bg-slate-100'}`} />
      ))}
      <span className="text-[9px] font-black text-slate-400 ml-1">{filled}/10</span>
    </div>
  );
};

const WalletRow = ({ label, owner, address, addressUrl, amountCrypto, amountUsd }) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</span>
    <span className="text-[11px] font-bold text-slate-800 truncate">
      {isValid(owner) ? owner : 'Private Wallet'}
    </span>
    {isValid(address) && (
      <span className="text-[9px] text-slate-400 font-mono truncate">
        {isValid(addressUrl) ? (
          <a href={addressUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
            {shortAddr(address)}
          </a>
        ) : shortAddr(address)}
      </span>
    )}
    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
      {isValid(amountCrypto) && (
        <span className="text-[10px] font-black text-indigo-600">{amountCrypto}</span>
      )}
      {isValid(amountUsd) && (
        <span className="text-[9px] font-bold text-slate-400">≈ {amountUsd}</span>
      )}
    </div>
  </div>
);

const WhaleCard = ({ tx, locale, index }) => {
  const style = getAlertStyle(tx.alert_type);
  const sender = tx.sender || {};
  const receiver = tx.receiver || {};

  return (
    <article
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`px-4 py-3 flex items-center justify-between ${style.bg} border-b ${style.border}`}>
        <div className="flex items-center gap-2">
          {isValid(tx.icon_url) ? (
            <img 
              src={`https://whale-alert.io/${tx.icon_url}`} 
              alt={tx.blockchain} 
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiDatabase size={10} className="text-indigo-500" />
            </div>
          )}
          <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
            {tx.tx_card_title || 'Unknown'}
          </span>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${style.badge}`}>
          {style.icon} {isValid(tx.tx_card_title) ? tx.tx_card_title : style.label}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[13px] font-bold leading-snug text-slate-900 line-clamp-2 flex-1">
            {isValid(tx.amount_full) ? tx.amount_full : tx.summary}
          </h2>
          <time className="text-[9px] font-bold text-slate-400 shrink-0 text-right">
            {isValid(tx.alert_timestamp) ? tx.alert_timestamp : tx.timestamp_text}
          </time>
        </div>

        {isValid(tx.alert_text) && (
          <p className="text-[11px] text-slate-500 font-medium border-l-2 border-indigo-100 pl-2">
            {tx.alert_text}
          </p>
        )}

        <IntensityBar emoticons={tx.emoticons} />

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
          <WalletRow label="From" owner={sender.owner} address={sender.address} addressUrl={sender.address_url} amountCrypto={sender.amount} amountUsd={sender.amount_usd} />
          <div className="flex justify-center">
            <FiArrowRight className="text-indigo-300" size={12} />
          </div>
          <WalletRow label="To" owner={receiver.owner} address={receiver.address} addressUrl={receiver.address_url} amountCrypto={receiver.amount} amountUsd={receiver.amount_usd} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {isValid(tx.fee) && (
            <div className="text-[9px] font-bold text-slate-500 bg-slate-50 border px-2 py-1 rounded-lg">
              Fee: {tx.fee}
            </div>
          )}
          {isValid(tx.asset_price) && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
              <FiTrendingUp size={9} /> {tx.asset_price}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
        <span className="text-[9px] font-mono text-slate-300 truncate max-w-[100px]">
          {isValid(tx.transaction_hash) ? shortAddr(tx.transaction_hash) : '—'}
        </span>
        <div className="flex items-center gap-2">
          <Link href={locale === 'en' ? `/crypto-whales/${tx.hash}` : `/${locale}/crypto-whales/${tx.hash}`} className="text-indigo-600 font-black text-[10px] uppercase hover:underline">
            Details
          </Link>
          {isValid(tx.url) && (
            <a href={tx.url} target="_blank" rel="noopener noreferrer" className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">
              Verify <FiExternalLink size={9} className="inline ml-1" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

// ── Main Component ─────────────────────────────────────────────
const WhaleTracker = () => {
  const { dict, locale } = useLocale();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const getData = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setMoreLoading(true);
    try {
      const result = await fetchWhaleAlerts(pageNum, locale);
      const incomingData = result.data || result;
      const totalPages = result.metadata?.total_pages || 1;
      
      setTransfers(prev => pageNum === 1 ? incomingData : [...prev, ...incomingData]);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error('Whale API Error:', err);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    getData(1);
  }, [locale]);

  const handleMoreAlerts = () => {
    const n = page + 1;
    setPage(n);
    getData(n);
  };

  const filtered = transfers.filter(tx => {
    let tabMatch = true;
    if (activeTab === 'Burn') tabMatch = tx.alert_type === 'Burn';
    if (activeTab === 'Mint') tabMatch = tx.alert_type === 'Mint';
    if (activeTab === 'Transfer') tabMatch = tx.alert_type === 'Alert';
    
    let searchMatch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      searchMatch = tx.summary?.toLowerCase().includes(q) || tx.blockchain?.toLowerCase().includes(q);
    }
    return tabMatch && searchMatch;
  });

  if (loading && page === 1) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600" />
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
        {/* Breadcrumb */}
        <nav className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-xs text-slate-400">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600">Whale Tracker</span>
        </nav>

        {/* Header */}
        <header className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-10">
          <h1 className="text-3xl font-black mb-2">{dict?.whale_tracker?.title || "Crypto Whale Tracker"}</h1>
          <p className="text-slate-500 text-sm">{dict?.whale_tracker?.description || "Real-time large transaction monitor."}</p>
        </header>

        {/* Filters */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All Alerts', 'Burn', 'Mint', 'Transfer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeTab === tab ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <main className="max-w-[1400px] mx-auto px-4 lg:px-28 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm font-bold uppercase tracking-widest">
              No transactions found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((tx, idx) => (
                <WhaleCard key={tx.id || idx} tx={tx} locale={locale} index={idx} />
              ))}
            </div>
          )}

          {hasMore && !searchQuery && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleMoreAlerts}
                disabled={moreLoading}
                className="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {moreLoading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : (dict?.whale_tracker?.show_more || "Show More")}
              </button>
            </div>
          )}
        </main>
      </div>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
};

export default WhaleTracker;