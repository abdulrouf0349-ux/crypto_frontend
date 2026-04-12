'use client';
// src/app/[locale]/coin-analysis/page.jsx — Full Tailwind CSS

import { useState, useEffect } from 'react';
import ChartModal from './chart';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

const fmtPrice = (n) => {
  if (!n && n !== 0) return '—';
  const num = parseFloat(n);
  if (num >= 1)      return `$${num.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  if (num >= 0.01)   return `$${num.toFixed(4)}`;
  if (num >= 0.0001) return `$${num.toFixed(6)}`;
  return `$${num.toFixed(8)}`;
};
const fmtNum = (n) => {
  if (!n) return '—';
  if (n >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n/1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n/1e6).toFixed(2)}M`;
  return `$${Number(n).toLocaleString()}`;
};
const fmtSupply = (n, sym) => {
  if (!n) return '∞';
  const s = n >= 1e9 ? `${(n/1e9).toFixed(2)}B`
          : n >= 1e6 ? `${(n/1e6).toFixed(2)}M`
          : n >= 1e3 ? `${(n/1e3).toFixed(2)}K`
          : n.toLocaleString();
  return sym ? `${s} ${sym}` : s;
};

const Pct = ({ v }) => {
  const n = parseFloat(v);
  if (isNaN(n)) return <span className="text-slate-500">—</span>;
  return (
    <span className={`font-bold ${n > 0 ? 'text-emerald-400' : n < 0 ? 'text-red-400' : 'text-slate-500'}`}>
      {n > 0 ? '▲' : n < 0 ? '▼' : '–'} {Math.abs(n).toFixed(2)}%
    </span>
  );
};

const SIG_MAP = {
  BUY:  { ring:'ring-emerald-500', bg:'bg-emerald-950', text:'text-emerald-400', shadow:'shadow-emerald-500/20' },
  SELL: { ring:'ring-red-500',     bg:'bg-red-950',     text:'text-red-400',     shadow:'shadow-red-500/20'     },
  HOLD: { ring:'ring-amber-500',   bg:'bg-amber-950',   text:'text-amber-400',   shadow:'shadow-amber-500/20'   },
};

const ScoreRing = ({ score }) => {
  const color = score >= 65 ? '#00d395' : score <= 35 ? '#ff4d4d' : '#f59e0b';
  const r = 36, circ = 2 * Math.PI * r;
  return (
    <div className="relative w-20 h-20 flex-shrink-0 sm:w-24 sm:h-24">
      <svg width="100%" height="100%" viewBox="0 0 80 80" style={{transform:'rotate(-90deg)'}}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1a2035" strokeWidth="7"/>
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${(score/100)*circ} ${circ}`}
          strokeLinecap="round"
          style={{transition:'stroke-dasharray 0.8s ease', filter:`drop-shadow(0 0 5px ${color})`}}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold sm:text-lg" style={{color}}>{score}</span>
        <span className="text-[8px] text-slate-600 tracking-wide">/100</span>
      </div>
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#0a0e1a] border border-[#1a2035] rounded-2xl p-4 sm:p-5 mb-3 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="text-[9px] font-bold tracking-[2px] text-white mb-3 uppercase">{children}</div>
);

const DataRow = ({ label, value, valueClass = 'text-slate-300' }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-[#0d1120]">
    <span className="text-[10px] text-slate-600">{label}</span>
    <span className={`text-[10px] font-bold ${valueClass}`}>{value}</span>
  </div>
);

export default function CoinAnalysisPage() {
  const [query,     setQuery]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [coin,      setCoin]      = useState(null);
  const [error,     setError]     = useState('');
  const [showChart, setShowChart] = useState(false);
  const { dict, locale } = useLocale();

  const QUICK = ['Bitcoin','Ethereum','Solana','BNB','XRP','DOGE','Cardano','Avalanche','Chainlink','TON'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const coinParam = params.get('coin');
    if (coinParam) { setQuery(coinParam); analyze(coinParam); }
  }, []);

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
    } catch { setError('Connection error. Try again.'); }
    finally  { setLoading(false); }
  };

  const sig = coin ? (SIG_MAP[coin.analysis?.signal] || SIG_MAP.HOLD) : null;

  return (

    <>
    
      <div className="min-h-screen bg-[#060912] text-slate-300">

      {/* ── HEADER ── */}
      <div className="bg-[#08091a] border-b border-[#0f1628] px-4 py-8 sm:py-12 text-center">
        <p className="text-[9px] sm:text-[10px] tracking-[4px] sm:tracking-[5px] text-blue-500 font-semibold mb-2">
          {dict.coin_ai.terminal_title}
        </p>
        <h1 className="text-3xl sm:text-5xl font-black !text-white mb-2 tracking-tight leading-none">
          {dict.coin_ai.coin_analysis}
        </h1>
        <p className="text-[10px] text-white mb-6 tracking-widest">
          FINBERT AI · RSI · MACD · VOLUME
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="Search any coin..."
            className="w-full py-3.5 pl-4 pr-14 bg-[#0a0e1a] border border-[#1a2035] rounded-xl text-slate-200 text-sm placeholder-slate-700 focus:border-blue-600 focus:outline-none transition-colors"
          />
          <button
            onClick={() => analyze()}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold px-3 py-2 rounded-lg text-sm transition-colors"
          >
            {loading ? <span className="inline-block animate-spin">◈</span> : '↵'}
          </button>
        </div>

        {/* Quick coins */}
        <div className="max-w-lg mx-auto mt-3 flex flex-wrap gap-1.5 justify-center">
          {QUICK.map(c => (
            <button key={c}
              onClick={() => { setQuery(c); analyze(c); }}
              className="px-3 py-1 bg-[#0a0e1a] border border-[#1a2035] rounded-full text-slate-600 text-[10px] font-semibold cursor-pointer hover:border-blue-500 hover:text-blue-300 transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-5 pb-20">

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-900 rounded-xl p-3 text-red-400 text-xs mb-4">⚠ {error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl text-blue-500 animate-spin inline-block mb-3">◈</div>
            <p className="text-slate-700 text-[11px] tracking-[3px]">ANALYZING...</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {coin && !loading && sig && (
          <div className="animate-fadeIn">

            {/* Coin Header */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {coin.image && <img src={coin.image} alt={coin.name} className="w-11 h-11 rounded-full border-2 border-[#1a2035] flex-shrink-0" />}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-black !text-white">{coin.name}</span>
                      <span className="text-[10px] text-slate-600 bg-[#1a2035] px-2 py-0.5 rounded">{coin.symbol}</span>
                      {coin.rank && <span className="text-[10px] text-blue-400 bg-[#0d1629] border border-[#1a3060] px-2 py-0.5 rounded">#{coin.rank}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-white">{fmtPrice(coin.price)}</span>
                      <Pct v={coin.change24h} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChart(true)}
                  className="flex items-center gap-2 bg-[#0d1629] border border-[#1a2a4a] hover:border-blue-500 hover:bg-[#1a2f55] text-blue-400 font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap self-start sm:self-center"
                >
                  📈 View Chart + Levels
                </button>
              </div>
            </Card>

            {/* Signal Box */}
            <div className={`${sig.bg} ring-1 ${sig.ring} rounded-2xl p-4 sm:p-5 mb-3 shadow-2xl ${sig.shadow}`}>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <ScoreRing score={coin.analysis.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-2xl sm:text-3xl font-black tracking-tight ${sig.text}`}>
                      {coin.analysis.signalEmoji} {coin.analysis.signal}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-[#0a0e1a] px-2.5 py-1 rounded-full border border-[#1a2035]">
                      Confidence: {coin.analysis.score}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{coin.analysis.summary}</p>
                </div>
              </div>

              {/* Pressure Bar */}
              {(() => {
                const buy = Math.max(0, Math.min(100, coin.analysis.score));
                const sell = 100 - buy;
                return (
                  <div>
                    <div className="flex rounded-lg overflow-hidden h-7 mb-1.5">
                      <div style={{width:`${buy}%`}} className="bg-gradient-to-r from-emerald-900 to-emerald-400 flex items-center justify-center text-[9px] font-bold text-white transition-all duration-700">
                        {buy > 15 && `BUY ${buy}%`}
                      </div>
                      <div style={{width:`${sell}%`}} className="bg-gradient-to-r from-red-500 to-red-900 flex items-center justify-center text-[9px] font-bold text-white transition-all duration-700">
                        {sell > 15 && `SELL ${sell}%`}
                      </div>
                    </div>
                    <p className="text-[8px] text-white tracking-wider">FINBERT AI · RSI · MACD · VOLUME MOMENTUM</p>
                  </div>
                );
              })()}

              {/* RSI Bar */}
              {(() => {
                const val = parseFloat(coin.analysis.indicators.rsi) || 50;
                const color = val < 30 ? '#00d395' : val > 70 ? '#ff4d4d' : '#f59e0b';
                return (
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-[8px] text-emerald-500 tracking-wider">OVERSOLD &lt;30</span>
                      <span className="text-[10px] font-bold" style={{color}}>RSI {coin.analysis.indicators.rsi} — {coin.analysis.indicators.rsiZone}</span>
                      <span className="text-[8px] text-red-500 tracking-wider">&gt;70 OVERBOUGHT</span>
                    </div>
                    <div className="relative h-1.5 rounded-full" style={{background:'linear-gradient(to right,#00d395 0%,#00d395 30%,#f59e0b 30%,#f59e0b 70%,#ff4d4d 70%)'}}>
                      <div className="absolute -top-1.5 w-4 h-4 rounded-full border-2 border-[#0a0e1a] transition-all duration-500"
                        style={{left:`calc(${Math.min(98,Math.max(2,val))}% - 8px)`, background:color, boxShadow:`0 0 8px ${color}`}}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {[
                {label:'MACD',    value:coin.analysis.indicators.macd,
                  cls: coin.analysis.indicators.macd==='bullish'?'text-emerald-400':'text-red-400'},
                {label:'VOLUME',  value:coin.analysis.indicators.volume,
                  cls: coin.analysis.indicators.volume==='HIGH'?'text-emerald-400':coin.analysis.indicators.volume==='MEDIUM'?'text-amber-400':'text-red-400'},
                {label:'AI SENTIMENT', value:coin.analysis.indicators.sentiment,
                  cls: coin.analysis.indicators.sentiment==='positive'?'text-emerald-400':coin.analysis.indicators.sentiment==='negative'?'text-red-400':'text-amber-400'},
                {label:'VOL/MCAP', value:`${coin.analysis.indicators.volumeRatio}%`, cls:'text-slate-300'},
              ].map(({label,value,cls}) => (
                <Card key={label} className="!mb-0">
                  <div className="text-[8px] tracking-[2px] text-white mb-1.5">{label}</div>
                  <div className={`text-sm font-bold capitalize ${cls}`}>{value}</div>
                </Card>
              ))}
            </div>

            {/* Analysis Breakdown */}
            <Card>
              <SectionTitle>◈ Analysis Breakdown</SectionTitle>
              <div className="space-y-1.5">
                {coin.analysis.reasons.map((r,i) => (
                  <div key={i} className={`px-3 py-2 bg-[#060912] rounded-lg text-[11px] text-slate-500 leading-relaxed border-l-2 ${r.startsWith('✅')?'border-emerald-500':r.startsWith('⚠')?'border-red-500':'border-slate-700'}`}>
                    {r}
                  </div>
                ))}
              </div>
            </Card>

            {/* Price Levels */}
            <Card>
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <SectionTitle>◈ Key Price Levels</SectionTitle>
                <button onClick={() => setShowChart(true)}
                  className="text-[10px] text-blue-400 bg-[#0d1629] border border-[#1a2a4a] hover:border-blue-500 px-2.5 py-1 rounded-lg cursor-pointer transition-all">
                  View on Chart →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {label:'TARGET 3 (+50%)', value:coin.analysis.levels.target3,   cls:'text-emerald-400'},
                  {label:'TARGET 2 (+28%)', value:coin.analysis.levels.target2,   cls:'text-emerald-500'},
                  {label:'TARGET 1 (+12%)', value:coin.analysis.levels.target1,   cls:'text-emerald-700'},
                  {label:'RESISTANCE +8%', value:coin.analysis.levels.resistance, cls:'text-red-400'},
                  {label:'SUPPORT -8%',    value:coin.analysis.levels.support,    cls:'text-slate-400'},
                  {label:'STOP LOSS -12%', value:coin.analysis.levels.stopLoss,   cls:'text-red-500'},
                ].map(({label,value,cls}) => (
                  <div key={label} className={`flex justify-between items-center px-3 py-2 bg-[#060912] rounded-lg border-l-2 ${cls.includes('emerald')?'border-emerald-700':cls.includes('red')?'border-red-700':'border-slate-700'}`}>
                    <span className="text-[9px] text-slate-600">{label}</span>
                    <span className={`text-[11px] font-bold ${cls}`}>{fmtPrice(value)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Price Performance */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                {label:'1H',  value:coin.change1h  },
                {label:'24H', value:coin.change24h },
                {label:'7D',  value:coin.change7d  },
                {label:'30D', value:coin.change30d },
              ].map(({label,value}) => (
                <div key={label} className="bg-[#0a0e1a] border border-[#1a2035] rounded-xl p-3 text-center">
                  <div className="text-[8px] tracking-widest text-slate-600 mb-1.5">{label}</div>
                  <div className="text-sm"><Pct v={value}/></div>
                </div>
              ))}
            </div>

            {/* Market + Supply */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Card className="!mb-0">
                <SectionTitle>◈ Market Data</SectionTitle>
                <DataRow label="Market Cap"  value={fmtNum(coin.marketCap)}  />
                <DataRow label="24h Volume"  value={fmtNum(coin.volume24h)}  />
                <DataRow label="ATH"         value={fmtPrice(coin.ath)}     valueClass="text-amber-400" />
                <DataRow label="ATH Drop"    value={`${coin.athChange}%`}   valueClass="text-red-400" />
                <DataRow label="ATL"         value={fmtPrice(coin.atl)}     />
              </Card>
              <Card className="!mb-0">
                <SectionTitle>◈ Token Supply</SectionTitle>
                <DataRow label="Circulating" value={fmtSupply(coin.supply?.circulating, coin.symbol)} />
                <DataRow label="Total"       value={fmtSupply(coin.supply?.total, coin.symbol)}       />
                <DataRow label="Max"         value={fmtSupply(coin.supply?.max, coin.symbol)}         />
                {coin.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {coin.categories.map(c => (
                      <span key={c} className="text-[9px] text-blue-400 bg-[#0d1629] border border-[#1a2a4a] px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Exchanges */}
            {coin.exchanges?.length > 0 && (
              <Card>
                <SectionTitle>◈ Listed On</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {coin.exchanges.map((ex,i) => (
                    <a key={i} href={ex.url} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#060912] border border-[#1a2035] hover:border-blue-500 rounded-lg text-slate-500 hover:text-blue-300 text-[10px] font-semibold no-underline transition-all">
                      {ex.name} <span className="text-slate-700">{ex.pair}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Links */}
            <Card>
              <SectionTitle>◈ Official Links</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {[
                  {label:'Website',   url:coin.links?.website,   icon:'🌐'},
                  {label:'Whitepaper',url:coin.links?.whitepaper,icon:'📄'},
                  {label:'Twitter',   url:coin.links?.twitter,   icon:'𝕏'},
                  {label:'Reddit',    url:coin.links?.reddit,    icon:'💬'},
                  {label:'GitHub',    url:coin.links?.github,    icon:'💻'},
                  {label:'Telegram',  url:coin.links?.telegram,  icon:'✈️'},
                  {label:'Explorer',  url:coin.links?.explorer,  icon:'🔍'},
                  {label:'CoinGecko', url:coin.links?.coingecko, icon:'📊'},
                ].filter(l => l.url).map(({label,url,icon}) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#060912] border border-[#1a2035] hover:border-blue-500 hover:text-blue-300 rounded-lg text-slate-500 text-[10px] font-semibold no-underline transition-all">
                    {icon} {label}
                  </a>
                ))}
              </div>
            </Card>

            {/* About */}
            {coin.description && (
              <Card>
                <SectionTitle>◈ About {coin.symbol}</SectionTitle>
                <p className="text-[11px] text-slate-600 leading-relaxed">{coin.description}</p>
              </Card>
            )}

            {/* Disclaimer */}
            <p className="text-center text-[9px] text-slate-800 tracking-wider py-4">
              NOT FINANCIAL ADVICE · DYOR · CRYPTO IS HIGH RISK
            </p>
          </div>
        )}
      </div>

      {/* Chart Modal */}
      {showChart && coin && (
        <ChartModal coin={coin} levels={coin.analysis?.levels} onClose={() => setShowChart(false)} />
      )}
    </div>
 <MobileSupportButton dict={dict} />
    </>
  
  );
}