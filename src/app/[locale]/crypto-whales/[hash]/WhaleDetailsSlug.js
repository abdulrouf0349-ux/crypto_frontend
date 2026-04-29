'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft, FiCopy, FiExternalLink, FiClock,
  FiShield, FiArrowRight, FiDatabase, FiInfo,
  FiActivity, FiLayers, FiCheckCircle, FiZap,
  FiTrendingUp, FiTwitter, FiSend
} from 'react-icons/fi';
import Link from 'next/link';
import { getAlertDetailsByHash } from '../../../../../apis/page_news/events';
import { useLocale } from '@/context/LocaleContext';
import { notFound } from 'next/navigation'
import MobileSupportButton from '../../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../../components/Data/CoinAnalysisFloat';
// ── Alert type config ──────────────────────────────────────────────────────
const ALERT_STYLE = {
  Burn:    { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100',     label: '🔥 Burn'     },
  Mint:    { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: '🌱 Mint'     },
  Alert:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   label: '⚡ Transfer' },
  default: { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-100',   label: '📡 Event'    },
};
const getAlertStyle = (type) => ALERT_STYLE[type] || ALERT_STYLE.default;

// ── Intensity bar ──────────────────────────────────────────────────────────
const IntensityBar = ({ emoticons }) => {
  if (!emoticons || emoticons === 'N/A') return null;
  const count = Math.min(emoticons.split(',').length, 10);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Severity</span>
        <span className="text-[9px] font-black text-indigo-600">{count}/10</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full flex-1 ${i < count ? 'bg-indigo-500' : 'bg-slate-100'}`} />
        ))}
      </div>
    </div>
  );
};

// ── Copy button ────────────────────────────────────────────────────────────
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
      {copied ? <FiCheckCircle className="text-emerald-500" size={15} /> : <FiCopy size={15} />}
    </button>
  );
};

// ── Short address ──────────────────────────────────────────────────────────
const shortAddr = (addr) => {
  if (!addr || addr === 'N/A') return '—';
  if (addr.length > 20) return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  return addr;
};

// ── Info row ──────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon, mono = false, href = null }) => {
  if (!value || value === 'N/A') return null;
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0 gap-4">
      <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 shrink-0">
        {icon} {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[11px] font-bold text-indigo-600 hover:underline text-right break-all ${mono ? 'font-mono' : ''}`}
        >
          {value} <FiExternalLink className="inline" size={10} />
        </a>
      ) : (
        <span className={`text-[12px] font-black text-slate-800 text-right break-all ${mono ? 'font-mono text-[10px]' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const WhaleDetailsSlug = ({initialData}) => {
  const { hash } = useParams();
  const { dict, locale } = useLocale();
  const [tx, setTx] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (hash) {
        const data = await getAlertDetailsByHash(hash, locale);
        setTx(data);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [hash]);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Fetching Transaction...</p>
      </div>
    </div>
  );
  if (!tx) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-black text-2xl text-slate-200 mb-4">404</p>
        <p className="font-black text-sm uppercase tracking-widest text-slate-400">Transaction not found</p>
        <Link href={locale === 'en' ? '/crypto-whales' : `/${locale}/crypto-whales`} className="mt-6 inline-block text-indigo-600 font-black text-xs uppercase hover:underline">
          ← Back to Tracker
        </Link>
      </div>
    </div>
  );

  const style = getAlertStyle(tx.alert_type);

  // Parse social links if stored as string
  let socialLinks = {};
  try {
    if (tx.social_links && tx.social_links !== 'N/A') {
      socialLinks = JSON.parse(tx.social_links.replace(/'/g, '"'));
    }
  } catch (_) {}

  return (
    <>
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 overflow-x-hidden">

      {/* Breadcrumb */}
      <nav className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-6 flex items-center gap-4">
        <Link
          href={`/${locale}/crypto-whales`}
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{dict.whale_tracker.back_to_tracker}
        </Link>
        <span className="text-slate-200">/</span>
        <span className="text-xs font-black uppercase tracking-widest text-slate-900 truncate max-w-[200px]">
{tx.transaction_hash 
  ? shortAddr(tx.transaction_hash) 
  : dict.whale_tracker.back_to_tracker // Extra {} hata diye
}        </span>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28">

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} uppercase tracking-widest`}>
                  {style.label}
                </span>
                {tx.tx_card_title && tx.tx_card_title !== 'N/A' && (
                  <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {tx.tx_card_title}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  <FiShield size={11} /> Verified on {tx.blockchain}
                </span>
              </div>

              {/* Title from amount_full */}
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                {tx.amount_full && tx.amount_full !== 'N/A'
                  ? tx.amount_full.split('(')[0].trim()
                  : tx.summary?.split('(')[0]?.trim()}
              </h1>

              {/* Alert text */}
              <p className="text-slate-500 font-medium text-lg italic border-l-4 border-indigo-600 pl-4 max-w-2xl">
                {tx.alert_text && tx.alert_text !== 'N/A'
                  ? tx.alert_text
                  : tx.summary?.split('(')[1]?.replace(')', '') || 'Whale transaction detected on mainnet'}
              </p>
            </div>

            {/* Hash card */}
            <div className="shrink-0">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-w-[280px]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest"> {dict.whale_tracker.tx_hash}</p>
                <div className="flex items-center gap-3 bg-blue px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <code className="text-[11px] font-bold !text-black truncate w-40 md:w-64 font-mono">
                    {tx.transaction_hash}
                  </code>
                  <CopyBtn text={tx.transaction_hash} />
                </div>
                {/* Timestamp */}
                {tx.alert_timestamp && tx.alert_timestamp !== 'N/A' && (
                  <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1">
                    <FiClock size={10} /> {tx.alert_timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Main Content ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Sender → Receiver Flow Card */}
            <div className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100 relative overflow-hidden">
              <h5 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <FiActivity className="text-indigo-600" /> {dict.whale_tracker.tx_flow}
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Arrow in center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex w-14 h-14 bg-white border border-slate-200 rounded-full items-center justify-center text-indigo-600 shadow-xl z-10">
                  <FiArrowRight size={24} />
                </div>

                {/* Sender */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Source</div>
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-4">
                    <FiActivity size={18} />
                  </div>
                  <h4 className="font-black text-lg text-slate-900 mb-1 truncate">
                    {tx.sender_owner && tx.sender_owner !== 'N/A' ? tx.sender_owner : 'Unknown Entity'}
                  </h4>
                  {tx.sender_address && tx.sender_address !== 'N/A' && (
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {shortAddr(tx.sender_address)}
                      </p>
                      <CopyBtn text={tx.sender_address} />
                    </div>
                  )}
                  <div className="text-xl font-black text-slate-900">
                    {tx.sender_amount_crypto && tx.sender_amount_crypto !== 'N/A' ? tx.sender_amount_crypto : '—'}
                  </div>
                </div>

                {/* Receiver */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Destination</div>
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
                    <FiZap size={18} />
                  </div>
                  <h4 className="font-black text-lg text-slate-900 mb-1 truncate">
                    {tx.receiver_owner && tx.receiver_owner !== 'N/A' ? tx.receiver_owner : 'Secure Wallet'}
                  </h4>
                  {tx.receiver_address && tx.receiver_address !== 'N/A' && (
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {shortAddr(tx.receiver_address)}
                      </p>
                      <CopyBtn text={tx.receiver_address} />
                    </div>
                  )}
                  <div className="text-xl font-black text-indigo-600">
                    {tx.receiver_amount_crypto && tx.receiver_amount_crypto !== 'N/A' ? tx.receiver_amount_crypto : '—'}
                  </div>
                </div>
              </div>

              {/* Mobile arrow */}
              <div className="flex md:hidden justify-center my-2">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-indigo-600 shadow">
                  <FiArrowRight className="rotate-90" size={18} />
                </div>
              </div>
            </div>

            {/* Technical details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* TX Parameters */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h5 className="font-black text-[11px] uppercase tracking-widest text-slate-900 mb-5 flex items-center gap-2">
                  <FiLayers className="text-indigo-600" /> TX Parameters
                </h5>
                <div>
                  <InfoRow label="Network"    value={tx.blockchain}     icon={<FiDatabase size={11}/>} />
                  <InfoRow label="Timestamp"  value={tx.timestamp_text} icon={<FiClock size={11}/>} />
                  <InfoRow label="UTC Time"   value={tx.timestamp_utc}  icon={<FiClock size={11}/>} />
                  <InfoRow label="Fee"        value={tx.fee && tx.fee !== 'N/A' ? `${tx.fee}${tx.fee_usd && tx.fee_usd !== 'N/A' ? ` (${tx.fee_usd})` : ''}` : null} icon={<FiZap size={11}/>} />
                  <InfoRow label="Asset Price" value={tx.asset_price}   icon={<FiTrendingUp size={11}/>} />
                  <InfoRow label="Type"       value={tx.tx_card_title}  icon={<FiActivity size={11}/>} />
                </div>

                {/* Severity bar */}
                {tx.emoticons && tx.emoticons !== 'N/A' && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <IntensityBar emoticons={tx.emoticons} />
                  </div>
                )}
              </div>

              {/* Verification card */}
              <div className="flex flex-col gap-4">
                <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-base mb-2 italic">On-Chain Verification</h5>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                      This transaction has been recorded on the blockchain ledger and validated by network nodes.
                    </p>
                    {tx.transaction_hash_url && tx.transaction_hash_url !== 'N/A' && (
                      <div className="mt-3 flex items-center gap-2 bg-indigo-500/30 px-3 py-2 rounded-xl">
                        <code className="text-[10px] font-mono text-indigo-200 truncate flex-1">
                          {shortAddr(tx.transaction_hash)}
                        </code>
                        <CopyBtn text={tx.transaction_hash} />
                      </div>
                    )}
                  </div>
                  <a
                    href={tx.transaction_hash_url && tx.transaction_hash_url !== 'N/A' ? tx.transaction_hash_url : tx.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 bg-black text-indigo-600 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest text-center hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    View in Explorer <FiExternalLink size={12} />
                  </a>
                </div>

                {/* Whale Alert source link */}
                {tx.url && (
                  <a
                    href={tx.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900 !text-white py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest text-center hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    View on Whale Alert <FiExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Social share links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h5 className="font-black text-[11px] uppercase tracking-widest text-slate-400 mb-4">
                  Shared On
                </h5>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-slate-700 transition-all">
                      <FiTwitter size={13} /> X (Twitter)
                    </a>
                  )}
                  {socialLinks.telegram && (
                    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-sky-600 transition-all">
                      <FiSend size={13} /> Telegram
                    </a>
                  )}
                  {socialLinks.discord && (
                    <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all">
                      <FiActivity size={13} /> Discord
                    </a>
                  )}
                  {socialLinks.bluesky && (
                    <a href={socialLinks.bluesky} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-blue-600 transition-all">
                      <FiActivity size={13} /> Bluesky
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Crypto icon + alert type */}
            <div className={`rounded-2xl p-5 border ${style.bg} ${style.border}`}>
              <div className="flex items-center gap-4">
                {tx.icon_url && tx.icon_url !== 'N/A' ? (
                  <img
                    src={`https://whale-alert.io/${tx.icon_url}`}
                    alt={tx.blockchain}
                    className="w-14 h-14 rounded-full object-cover shadow-md"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                    <FiDatabase size={24} className="text-slate-400" />
                  </div>
                )}
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
                    {style.label}
                  </p>
                  <p className="font-black text-xl text-slate-900">{tx.blockchain}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{tx.alert_timestamp}</p>
                </div>
              </div>
            </div>

            {/* Detection info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <FiInfo size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dict.whale_tracker.detection_info}</p>
                  <p className="font-black text-sm text-slate-900">{dict.whale_tracker.node_scan}</p>
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed mb-5">
               {dict.whale_tracker.engine_desc}
              </p>

              {/* Summary (translated if available) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Summary</p>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{tx.summary}</p>
              </div>
            </div>

            {/* Monitor wallet CTA */}
            <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl flex flex-col items-center gap-2">
              <FiShield size={18} className="mb-1" />
             {dict.whale_tracker.monitor_wallet}
            </button>

            {/* Back button */}
            <Link
              href={`/${locale}/crypto-whales`}
              className="w-full border border-slate-200 text-slate-600 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              <FiArrowLeft size={14} /> All Whale Alerts
            </Link>
          </div>
        </div>
      </main>
    </div>

    <MobileSupportButton dict={dict} />
                        <CoinAnalysisFloat locale={locale} />  
                        </>
  );
};

export default WhaleDetailsSlug;