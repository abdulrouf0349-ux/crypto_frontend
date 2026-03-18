'use client';
// src/components/CoinAnalysisFloat.jsx — Tailwind CSS version

import { useState, useRef } from 'react';
import Link from 'next/link';

const fmtPrice = (n) => {
  if (!n && n !== 0) return '—';
  const num = parseFloat(n);
  if (num >= 1)    return `$${num.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  if (num >= 0.01) return `$${num.toFixed(4)}`;
  return `$${num.toFixed(6)}`;
};

const SIG = {
  BUY:  { border:'border-emerald-500', bg:'bg-emerald-950', text:'text-emerald-400', glow:'shadow-emerald-500/20' },
  SELL: { border:'border-red-500',     bg:'bg-red-950',     text:'text-red-400',     glow:'shadow-red-500/20'     },
  HOLD: { border:'border-amber-500',   bg:'bg-amber-950',   text:'text-amber-400',   glow:'shadow-amber-500/20'   },
};

export default function CoinAnalysisFloat({ locale = 'en' }) {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [coin,    setCoin]    = useState(null);
  const [error,   setError]   = useState('');
  const inputRef = useRef();

  const QUICK = ['BTC','ETH','SOL','BNB','XRP','DOGE'];

  const analyze = async (q) => {
    const term = (q || query).trim();
    if (!term) return;
    setLoading(true); setError(''); setCoin(null);
    try {
      const res  = await fetch(`${window.location.origin}/api/coin-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setCoin(data);
    } catch { setError('Error. Try again.'); }
    finally  { setLoading(false); }
  };

  const toggle = () => {
    setOpen(o => !o);
    if (!open) {
      setCoin(null); setQuery(''); setError('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const sig = coin ? (SIG[coin.analysis?.signal] || SIG.HOLD) : null;

  return (
    <>
      {/* ── FAB Button ── */}
      <button
        onClick={toggle}
        title="AI Coin Analysis"
        className={`
          fixed bottom-20 right-4 z-[800]
          w-13 h-13 rounded-full border-none cursor-pointer
          flex items-center justify-center text-xl
          transition-all duration-300
          sm:bottom-20 sm:right-5 sm:w-14 sm:h-14
          ${open
            ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
            : 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-400/50 animate-pulse'
          }
        `}
        style={{width:'52px',height:'52px'}}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* ── POPUP ── */}
      {open && (
        <div className={`
          fixed z-[801]
          flex flex-col overflow-hidden
          bg-[#08091a] border border-[#1a2035]
          shadow-2xl
          font-mono

          /* Mobile — full width bottom sheet */
          bottom-0 left-0 right-0 w-full
          max-h-[82vh]
          rounded-t-2xl rounded-b-none

          /* Desktop — floating popup */
          sm:bottom-36 sm:right-4 sm:left-auto
          sm:w-[340px] sm:max-h-[80vh]
          sm:rounded-2xl
        `}>

          {/* Drag handle — mobile only */}
          <div className="sm:hidden mx-auto mt-2.5 w-9 h-1 bg-[#1a2035] rounded-full flex-shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between px-4 pt-3 pb-2.5 bg-[#0a0e1a] border-b border-[#1a2035] flex-shrink-0">
            <div>
              <div className="text-[8px] tracking-[3px] text-blue-500 mb-0.5">◈ AI CRYPTO TERMINAL</div>
              <div className="text-[15px] font-extrabold text-white" style={{fontFamily:'Syne,sans-serif'}}>
                Coin Analysis
              </div>
              <div className="text-[8px] text-[#2a3a5e] mt-0.5 tracking-wider">FINBERT · RSI · MACD · VOLUME</div>
            </div>
            <button
              onClick={toggle}
              className="bg-[#1a2035] border border-[#2a3050] rounded-lg px-2.5 py-1.5 text-[#8892a4] text-[11px] font-semibold cursor-pointer hover:bg-[#2a3050] transition-colors mt-0.5"
            >
              ✕ Close
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-3">

            {/* Search */}
            <div className="relative mb-2">
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                placeholder="Bitcoin, ETH, Solana..."
                className="w-full py-2.5 pl-3 pr-11 bg-[#0d1120] border border-[#1a2035] rounded-xl text-[#c8d0e0] text-xs placeholder-[#2a3450] focus:border-blue-600 focus:outline-none transition-colors"
              />
              <button
                onClick={() => analyze()}
                disabled={loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors"
              >
                {loading ? '⟳' : '↵'}
              </button>
            </div>

            {/* Quick Coins */}
            <div className="flex flex-wrap gap-1 mb-3">
              {QUICK.map(c => (
                <button key={c}
                  onClick={() => { setQuery(c); analyze(c); }}
                  className="px-2.5 py-1 bg-[#0d1120] border border-[#1a2035] rounded-xl text-[#3d4f6e] text-[10px] font-semibold cursor-pointer hover:border-blue-500 hover:text-blue-300 hover:bg-[#0d1629] transition-all"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-950 border border-red-900 rounded-xl p-2.5 text-red-400 text-[11px] mb-2">
                ⚠ {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-8 text-[#2a3a5e] text-[11px] tracking-widest">
                <div className="text-2xl text-blue-500 mb-2 inline-block animate-spin">◈</div>
                <div>ANALYZING...</div>
              </div>
            )}

            {/* Result */}
            {coin && !loading && sig && (
              <div>
                {/* Identity */}
                <div className="flex items-center gap-2.5 mb-2.5 p-2.5 bg-[#0d1120] rounded-xl">
                  {coin.image && <img src={coin.image} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-extrabold text-white" style={{fontFamily:'Syne,sans-serif'}}>{coin.name}</span>
                      <span className="text-[9px] text-[#3d4f6e] bg-[#1a2035] px-1.5 py-0.5 rounded">{coin.symbol}</span>
                      {coin.rank && <span className="text-[9px] text-blue-400">#{coin.rank}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] font-bold text-white">{fmtPrice(coin.price)}</span>
                      <span className={`text-[10px] font-bold ${parseFloat(coin.change24h)>0?'text-emerald-400':'text-red-400'}`}>
                        {parseFloat(coin.change24h)>0?'▲':'▼'} {Math.abs(parseFloat(coin.change24h||0)).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signal Box */}
                <div className={`${sig.bg} border ${sig.border} rounded-xl p-3 mb-2 shadow-lg ${sig.glow}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xl font-extrabold ${sig.text}`} style={{fontFamily:'Syne,sans-serif'}}>
                      {coin.analysis.signalEmoji} {coin.analysis.signal}
                    </span>
                    <span className="text-[9px] text-[#3d4f6e]">{coin.analysis.score}/100</span>
                  </div>

                  {/* Pressure Bar */}
                  {(() => {
                    const buy = Math.max(0, Math.min(100, coin.analysis.score));
                    const sell = 100 - buy;
                    return (
                      <div className="flex rounded overflow-hidden h-5 mb-2">
                        <div style={{width:`${buy}%`}} className="bg-gradient-to-r from-emerald-900 to-emerald-400 flex items-center justify-center text-[8px] font-bold text-white">
                          {buy > 20 && `BUY ${buy}%`}
                        </div>
                        <div style={{width:`${sell}%`}} className="bg-gradient-to-r from-red-500 to-red-900 flex items-center justify-center text-[8px] font-bold text-white">
                          {sell > 20 && `SELL ${sell}%`}
                        </div>
                      </div>
                    );
                  })()}

                  <p className="text-[10px] text-[#6b7280] leading-relaxed m-0">
                    {coin.analysis.summary}
                  </p>
                </div>

                {/* Indicators */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {[
                    { k:'RSI',    v:`${coin.analysis.indicators.rsi} (${coin.analysis.indicators.rsiZone})`,
                      c: parseFloat(coin.analysis.indicators.rsi)<30?'text-emerald-400':parseFloat(coin.analysis.indicators.rsi)>70?'text-red-400':'text-amber-400' },
                    { k:'MACD',   v:coin.analysis.indicators.macd,
                      c: coin.analysis.indicators.macd==='bullish'?'text-emerald-400':'text-red-400' },
                    { k:'Volume', v:coin.analysis.indicators.volume,
                      c: coin.analysis.indicators.volume==='HIGH'?'text-emerald-400':coin.analysis.indicators.volume==='MEDIUM'?'text-amber-400':'text-red-400' },
                    { k:'AI',     v:coin.analysis.indicators.sentiment,
                      c: coin.analysis.indicators.sentiment==='positive'?'text-emerald-400':coin.analysis.indicators.sentiment==='negative'?'text-red-400':'text-amber-400' },
                  ].map(({k,v,c}) => (
                    <div key={k} className="bg-[#0d1120] rounded-lg p-2">
                      <div className="text-[7px] text-[#3d4f6e] tracking-wider mb-1">{k}</div>
                      <div className={`text-[10px] font-bold capitalize ${c}`}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Key Levels */}
                <div className="bg-[#0d1120] rounded-xl p-2.5 mb-3">
                  <div className="text-[7px] text-[#3d4f6e] tracking-widest mb-2">KEY LEVELS</div>
                  {[
                    { l:'🎯 Target 1',   v:coin.analysis.levels.target1,    c:'text-emerald-400' },
                    { l:'⚡ Resistance',  v:coin.analysis.levels.resistance, c:'text-red-400'     },
                    { l:'⚪ Support',     v:coin.analysis.levels.support,    c:'text-slate-400'   },
                    { l:'🛑 Stop Loss',  v:coin.analysis.levels.stopLoss,   c:'text-red-500'     },
                  ].map(({l,v,c}) => (
                    <div key={l} className="flex justify-between py-1 border-b border-[#1a2035]">
                      <span className="text-[9px] text-[#3d4f6e]">{l}</span>
                      <span className={`text-[10px] font-bold ${c}`}>{fmtPrice(v)}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/${locale}/coin-analysis?coin=${encodeURIComponent(coin.name)}`}
                  onClick={() => setOpen(false)}
                  className="block text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white font-bold text-[13px] no-underline hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
                  style={{fontFamily:'Syne,sans-serif'}}
                >
                  📊 Full Analysis + Chart →
                </Link>
              </div>
            )}

            {/* Empty */}
            {!coin && !loading && !error && (
              <div className="text-center py-6 text-[#1a2a4a] text-[11px] tracking-wider">
                <div className="text-3xl mb-2">🤖</div>
                Search any coin to get<br/>AI buy/sell signal
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}