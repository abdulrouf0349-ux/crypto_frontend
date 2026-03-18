'use client';
// src/app/[locale]/coin-analysis/chart.jsx — Full Tailwind CSS

export default function ChartModal({ coin, levels, onClose }) {
  if (!coin) return null;

  const s        = coin.symbol?.toUpperCase() || 'BTC';
  const tvSymbol = coin.tvSymbol || `BINANCE:${s}USDT`;
  const tvUrl    = `https://www.tradingview.com/widgetembed/?frameElementId=tv_chart&symbol=${tvSymbol}&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=0&theme=dark&style=1&timezone=Etc%2FUTC&studies=RSI%40tv-basicstudies%2CMACD%40tv-basicstudies&locale=en&allow_symbol_change=1&utm_source=cryptonewstrend.com&utm_medium=widget`;

  const fmtP = (v) => {
    if (!v) return '—';
    const n = parseFloat(v);
    if (isNaN(n)) return '—';
    if (n >= 1)     return `$${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    if (n >= 0.001) return `$${n.toFixed(4)}`;
    return `$${n.toFixed(6)}`;
  };

  const sigColor = coin.analysis?.signal==='BUY' ? 'text-emerald-400'
                 : coin.analysis?.signal==='SELL' ? 'text-red-400'
                 : 'text-amber-400';
  const sigBorder = coin.analysis?.signal==='BUY' ? 'border-emerald-500'
                  : coin.analysis?.signal==='SELL' ? 'border-red-500'
                  : 'border-amber-500';
  const sigBg = coin.analysis?.signal==='BUY' ? 'bg-emerald-950'
              : coin.analysis?.signal==='SELL' ? 'bg-red-950'
              : 'bg-amber-950';

  const LEVELS = [
    { label:'TARGET 3', value:levels?.target3,    cls:'text-emerald-400', sub:'+50%', current:false },
    { label:'TARGET 2', value:levels?.target2,    cls:'text-emerald-500', sub:'+28%', current:false },
    { label:'TARGET 1', value:levels?.target1,    cls:'text-emerald-700', sub:'+12%', current:false },
    { label:'RESIST.',  value:levels?.resistance, cls:'text-red-400',     sub:'+8%',  current:false },
    { label:'CURRENT',  value:coin.price,          cls:'text-blue-400',   sub:'NOW',  current:true  },
    { label:'SUPPORT',  value:levels?.support,    cls:'text-slate-400',   sub:'-8%',  current:false },
    { label:'STOP LOSS',value:levels?.stopLoss,   cls:'text-red-500',     sub:'-12%', current:false },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-[#0a0e1a] border-b border-[#1a2035] px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between flex-wrap gap-2">
        
        {/* Left: coin info */}
        <div className="flex items-center gap-2 flex-wrap">
          {coin.image && <img src={coin.image} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />}
          <span className="text-sm sm:text-base font-black text-white">{coin.name}</span>
          <span className="text-[9px] text-slate-600 bg-[#1a2035] px-1.5 py-0.5 rounded">
            {coin.tvSymbol || `${s}/USDT`}
          </span>
          <span className="text-sm sm:text-base font-bold text-white">{fmtP(coin.price)}</span>
          <span className={`text-xs font-bold ${parseFloat(coin.change24h)>0?'text-emerald-400':'text-red-400'}`}>
            {parseFloat(coin.change24h)>0?'▲':'▼'} {Math.abs(parseFloat(coin.change24h||0)).toFixed(2)}%
          </span>
        </div>

        {/* Right: signal + close */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`${sigBg} border ${sigBorder} px-3 py-1 rounded-lg`}>
            <span className={`text-sm font-black ${sigColor}`}>
              {coin.analysis?.signalEmoji} {coin.analysis?.signal}
            </span>
          </div>
          <button onClick={onClose}
            className="bg-[#1a2035] hover:bg-[#2a3050] border border-[#2a3050] rounded-lg px-3 py-1.5 text-slate-400 text-xs font-semibold cursor-pointer transition-colors">
            ✕ Close
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Chart — takes all available height */}
        <div className="flex-1 relative min-w-0 min-h-0">
          <iframe
            src={tvUrl}
            allowtransparency="true"
            allowFullScreen
            title="TradingView Chart"
            className="w-full h-full border-0 block"
          />
          <div className="absolute bottom-2 left-2 text-[9px] text-slate-700 bg-[#0a0e1a]/80 px-2 py-0.5 rounded pointer-events-none">
            Symbol not found? Use search bar ↑ inside chart
          </div>
        </div>

        {/* Desktop Levels Panel — hidden on mobile */}
        <div className="hidden sm:flex flex-col w-48 flex-shrink-0 bg-[#0a0e1a] border-l border-[#1a2035] overflow-y-auto">
          <div className="p-3">
            <div className="text-[8px] font-bold tracking-[2px] text-white mb-3">PRICE LEVELS</div>

            {LEVELS.map(({ label, value, cls, sub, current }) => (
              <div key={label}
                className={`flex justify-between items-center p-2 mb-1 rounded-lg border-l-2 ${current ? 'bg-[#0d1629] border-blue-500' : 'bg-[#060912] border-[#1a2035]'}`}>
                <div>
                  <div className="text-[7px] text-white tracking-wide">{label}</div>
                  <div className="text-[7px] text-red-400">{sub}</div>
                </div>
                <span className={`text-[10px] font-bold ${cls}`}>{fmtP(value)}</span>
              </div>
            ))}

            {/* Indicators */}
            <div className="mt-3 p-2.5 bg-[#060912] rounded-lg border border-[#1a2035]">
              <div className="text-[8px] text-white tracking-wider mb-2">INDICATORS</div>
              {[
                {k:'RSI',    v:`${coin.analysis?.indicators?.rsi} (${coin.analysis?.indicators?.rsiZone})`},
                {k:'MACD',   v:coin.analysis?.indicators?.macd},
                {k:'Volume', v:coin.analysis?.indicators?.volume},
                {k:'AI',     v:coin.analysis?.indicators?.sentiment},
              ].map(({k,v}) => (
                <div key={k} className="flex justify-between mb-1">
                  <span className="text-[9px] text-white">{k}</span>
                  <span className={`text-[9px] font-bold capitalize ${
                    (v||'').match(/bull|pos|over/i) ? 'text-emerald-400' :
                    (v||'').match(/bear|neg|sold/i) ? 'text-red-400' : 'text-slate-500'
                  }`}>{v||'—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Bar — shown only on mobile ── */}
      <div className="sm:hidden flex-shrink-0 bg-[#0a0e1a] border-t border-[#1a2035] px-3 py-2 flex gap-2 overflow-x-auto">
        
        {/* Signal */}
        <div className={`flex-shrink-0 ${sigBg} border ${sigBorder} px-3 py-1.5 rounded-lg text-center`}>
          <div className={`text-sm font-black ${sigColor}`}>
            {coin.analysis?.signalEmoji} {coin.analysis?.signal}
          </div>
          <div className="text-[8px] text-slate-600">{coin.analysis?.score}/100</div>
        </div>

        {/* Levels */}
        {LEVELS.map(({ label, value, cls }) => (
          <div key={label}
            className="flex-shrink-0 text-center px-2.5 py-1.5 bg-[#060912] rounded-lg border-t-2 border-[#1a2035]">
            <div className="text-[7px] text-slate-600 mb-1">{label}</div>
            <div className={`text-[10px] font-bold ${cls}`}>{fmtP(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}