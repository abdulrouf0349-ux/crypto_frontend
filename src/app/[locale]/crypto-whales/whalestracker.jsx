'use client';
// app/[locale]/crypto-whales/WhaleTracker.jsx  — CLIENT COMPONENT
import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiActivity, FiArrowRight,
  FiExternalLink, FiTrendingUp,
  FiDatabase, FiZap, FiLink
} from 'react-icons/fi';
import { fetchWhaleAlerts } from '../../../../apis/cryptowhales';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

// ── Alert type config ──────────────────────────────────────────
const ALERT_STYLE = {
  Burn:    { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     badge: 'bg-red-100 text-red-600',        label: 'Burn',     icon: '🔥' },
  Mint:    { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-600', label: 'Mint',     icon: '🌱' },
  Alert:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   badge: 'bg-amber-100 text-amber-600',    label: 'Transfer', icon: '⚡' },
  default: { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-100',   badge: 'bg-slate-100 text-slate-600',    label: 'Event',    icon: '📡' },
};
const getAlertStyle = (type) => ALERT_STYLE[type] || ALERT_STYLE.default;

// ── Helpers ────────────────────────────────────────────────────
const isValid = (val) => val && val !== 'N/A' && val !== 'null' && val !== 'None';
const shortAddr = (addr) => {
  if (!isValid(addr)) return '—';
  if (addr.length > 16) return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  return addr;
};

// ── Intensity Bar ──────────────────────────────────────────────
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

// ── Wallet Row (From / To) ─────────────────────────────────────
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

// ── Whale Card ─────────────────────────────────────────────────
const WhaleCard = ({ tx, locale, index }) => {
  const style    = getAlertStyle(tx.alert_type);
  const sender   = tx.sender   || {};
  const receiver = tx.receiver || {};

  return (
    <article
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`${tx.alert_type || 'Whale'} transaction on ${tx.blockchain}`}
    >
      {/* ── Header ── */}
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

      {/* ── Body ── */}
      <div className="p-5 flex-1 flex flex-col gap-3">

        {/* Amount + timestamp */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[13px] font-bold leading-snug text-slate-900 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
            {isValid(tx.amount_full) ? tx.amount_full : tx.summary}
          </h2>
          <time
            dateTime={tx.timestamp_utc || undefined}
            className="text-[9px] font-bold text-slate-400 shrink-0 text-right leading-tight mt-0.5"
          >
            {isValid(tx.alert_timestamp) ? tx.alert_timestamp : tx.timestamp_text}
          </time>
        </div>

        {/* Alert text */}
        {isValid(tx.alert_text) && (
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed border-l-2 border-indigo-100 pl-2">
            {tx.alert_text}
          </p>
        )}

        {/* UTC timestamp */}
        {isValid(tx.timestamp_utc) && (
          <p className="text-[9px] text-slate-300 font-mono">{tx.timestamp_utc}</p>
        )}

        {/* Intensity */}
        <IntensityBar emoticons={tx.emoticons} />

        {/* From → To */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
          <WalletRow
            label="From"
            owner={sender.owner}
            address={sender.address}
            addressUrl={sender.address_url}
            amountCrypto={sender.amount}
            amountUsd={sender.amount_usd}
          />
          <div className="flex justify-center">
            <div className="bg-indigo-100 rounded-full p-1">
              <FiArrowRight className="text-indigo-500" size={10} />
            </div>
          </div>
          <WalletRow
            label="To"
            owner={receiver.owner}
            address={receiver.address}
            addressUrl={receiver.address_url}
            amountCrypto={receiver.amount}
            amountUsd={receiver.amount_usd}
          />
        </div>

        {/* Fee + Price */}
        <div className="flex gap-2 flex-wrap">
          {isValid(tx.fee) && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
              <span className="text-slate-400">Fee:</span> {tx.fee}
              {isValid(tx.fee_usd) && <span className="text-slate-300">({tx.fee_usd})</span>}
            </div>
          )}
          {isValid(tx.asset_price) && (
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
              <FiTrendingUp size={9} /> {tx.asset_price}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between mt-auto bg-slate-50/50">
        <span className="text-[9px] font-mono text-slate-300 truncate max-w-[110px]">
          {isValid(tx.transaction_hash_url) ? (
            <a href={tx.transaction_hash_url} target="_blank" rel="noopener noreferrer"
               className="hover:text-indigo-500 flex items-center gap-1 transition-colors">
              <FiLink size={8} /> {shortAddr(tx.transaction_hash)}
            </a>
          ) : (
            isValid(tx.transaction_hash) ? shortAddr(tx.transaction_hash) : '—'
          )}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/crypto-whales/${tx.hash}`}
            className="text-indigo-600 font-black text-[10px] uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            Details <FiArrowRight size={10} />
          </Link>
          {isValid(tx.url) && (
            <a href={tx.url} target="_blank" rel="noopener noreferrer"
               className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-indigo-600 transition-all flex items-center gap-1.5">
              Verify <FiExternalLink size={9} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

// ── Main WhaleTracker ──────────────────────────────────────────
const WhaleTracker = () => {
  const { dict, locale } = useLocale();
  const [transfers, setTransfers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [activeTab, setActiveTab]   = useState('All Alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(false);

  const getData = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setMoreLoading(true);
    try {
      const result = await fetchWhaleAlerts(pageNum, locale);
      const incomingData = result.data || result;
      const totalPages   = result.metadata?.total_pages || 1;
      if (pageNum === 1) setTransfers(incomingData);
      else setTransfers(prev => [...prev, ...incomingData]);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      console.error('Whale API Error:', err);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => { setPage(1); getData(1); }, [locale]);

  const handleMoreAlerts = () => { const n = page + 1; setPage(n); getData(n); };

  // ── Filter ─────────────────────────────────────────────────────
  const filtered = transfers.filter(tx => {
    let tabMatch = true;
    if (activeTab === 'Burn')      tabMatch = tx.alert_type === 'Burn';
    if (activeTab === 'Mint')      tabMatch = tx.alert_type === 'Mint';
    if (activeTab === 'Transfer')  tabMatch = tx.alert_type === 'Alert';
    if (activeTab === 'Exchanges') {
      const s = tx.sender?.owner?.toLowerCase()   || '';
      const r = tx.receiver?.owner?.toLowerCase() || '';
      tabMatch = ['binance','coinbase','kraken','okx','bybit','huobi','kucoin'].some(ex => s.includes(ex) || r.includes(ex));
    }
    if (activeTab === 'Wallets') {
      const s = tx.sender?.owner;
      const r = tx.receiver?.owner;
      tabMatch = !isValid(s) || s === 'Private Wallet' || !isValid(r) || r === 'Private Wallet';
    }
    let searchMatch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      searchMatch = (
        tx.transaction_hash?.toLowerCase().includes(q) ||
        tx.summary?.toLowerCase().includes(q)           ||
        tx.blockchain?.toLowerCase().includes(q)        ||
        tx.sender?.owner?.toLowerCase().includes(q)     ||
        tx.receiver?.owner?.toLowerCase().includes(q)   ||
        tx.sender?.address?.toLowerCase().includes(q)   ||
        tx.receiver?.address?.toLowerCase().includes(q)
      );
    }
    return tabMatch && searchMatch;
  });

  const totalBurn  = transfers.filter(t => t.alert_type === 'Burn').length;
  const totalMint  = transfers.filter(t => t.alert_type === 'Mint').length;
  const totalAlert = transfers.filter(t => t.alert_type === 'Alert').length;

  const TABS = [
    { key: 'All Alerts', label: 'All Alerts' },
    { key: 'Burn',       label: `🔥 Burns (${totalBurn})` },
    { key: 'Mint',       label: `🌱 Mints (${totalMint})` },
    { key: 'Transfer',   label: `⚡ Transfers (${totalAlert})` },
    { key: 'Exchanges',  label: 'Exchanges' },
    { key: 'Wallets',    label: 'Wallets' },
  ];

  if (loading && page === 1) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent" />
          <FiZap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning Blockchain...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">{dict.header.news}</Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">{dict.header.whales_tracking}</span>
      </nav>

      {/* Tabs */}
      <div className="border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 flex gap-6 whitespace-nowrap" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            {dict?.whale_tracker?.title || "Crypto Whale Tracker"}
          </h1>
          <p className="text-slate-500 text-sm">
            {dict?.whale_tracker?.description || 'Real-time large transaction monitor across Bitcoin, Ethereum & 50+ blockchains.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Burns', value: totalBurn,  bg: 'bg-red-50 border-red-100',         text: 'text-red-600'     },
            { label: 'Mints', value: totalMint,  bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' },
            { label: 'Moves', value: totalAlert, bg: 'bg-amber-50 border-amber-100',     text: 'text-amber-600'   },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-3 py-2 text-center min-w-[60px]`}>
              <div className={`text-[9px] font-black uppercase ${s.text}`}>{s.label}</div>
              <div className="text-lg font-black text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Filter + Search */}
      <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar" role="group" aria-label="Filter by type">
            {[
              { key: 'All Alerts', label: 'All'          },
              { key: 'Burn',       label: '🔥 Burn'      },
              { key: 'Mint',       label: '🌱 Mint'      },
              { key: 'Transfer',   label: '⚡ Transfer'  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                aria-pressed={activeTab === key}
                className={`px-5 py-1.5 border rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === key
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="whale-search" className="sr-only">Search whale transactions</label>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="whale-search"
              type="search"
              placeholder="Search hash, wallet, chain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 text-xs font-black">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiActivity size={40} className="mx-auto mb-4 text-slate-200" aria-hidden="true" />
            <p className="font-black text-sm uppercase tracking-widest text-slate-400">No alerts found</p>
            <p className="text-xs text-slate-300 mt-1">Try adjusting your filter or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((tx, index) => (
              <WhaleCard key={tx.id || index} tx={tx} locale={locale} index={index} />
            ))}
          </div>
        )}

        {hasMore && !searchQuery && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleMoreAlerts}
              disabled={moreLoading}
              aria-label="Load more whale alerts"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg w-full md:w-auto disabled:opacity-50 flex items-center justify-center gap-2"
            >
             {moreLoading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-transparent" /> 
      Loading...
    </>
  ) : (
    dict.whale_tracker.show_more // Curly braces hataye aur key match ki
  )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WhaleTracker;