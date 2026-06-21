"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
// (TypeScript interfaces removed for JSX; type safety via PropTypes or TS migration)

// ─── Popular coins list ───────────────────────────────────────────────────────
const POPULAR_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) =>
  n?.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "—";
const fmtUSD = (n) =>
  n >= 1_000_000_000
    ? `$${(n / 1_000_000_000).toFixed(2)}B`
    : n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${fmt(n)}`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CoinAnalysisPage({ initialData = null }) {
  const [query, setQuery] = useState("");
  const [coinId, setCoinId] = useState("bitcoin");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = useCallback(async (id) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/coin-data?id=${id}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) analyze(coinId);
  }, [coinId, analyze, initialData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = POPULAR_COINS.find(
      (c) =>
        c.symbol.toLowerCase() === query.toLowerCase() ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setCoinId(found.id);
      setQuery("");
    } else if (query.trim()) {
      setCoinId(query.trim().toLowerCase());
      setQuery("");
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">CryptoOracle</span>
            <span className="logo-badge">AI Analysis</span>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Search coin (BTC, ETH, SOL…)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" type="submit">Analyze →</button>
          </form>
        </div>
      </header>

      {/* Quick select */}
      <nav className="quick-coins" aria-label="Popular coins">
        {POPULAR_COINS.slice(0, 8).map((c) => (
          <button
            key={c.id}
            className={`quick-btn ${coinId === c.id ? "active" : ""}`}
            onClick={() => setCoinId(c.id)}
            aria-label={`Analyze ${c.name}`}
          >
            {c.symbol}
          </button>
        ))}
      </nav>

      {/* SEO Intro paragraph — visible, crawlable */}
      <div className="seo-intro">
        <p>
          Get real-time AI-powered crypto coin analysis including RSI, MACD, Bollinger Bands,
          support &amp; resistance levels, and price predictions for Bitcoin, Ethereum, Solana,
          and 100+ altcoins — updated live in {new Date().getFullYear()}.
        </p>
        <nav className="internal-links" aria-label="Related pages">
          <Link href="/bitcoin-price-prediction">Bitcoin Price Prediction</Link>
          <Link href="/ethereum-price-prediction">Ethereum Price Prediction</Link>
          <Link href="/solana-price-prediction">Solana Price Prediction</Link>
          <Link href="/crypto-buy-sell-signals">Crypto Buy/Sell Signals</Link>
        </nav>
      </div>

      {/* Main */}
      <main className="main" id="main-content">
        {loading && <LoadingScreen />}
        {error && <ErrorBox msg={error} onRetry={() => analyze(coinId)} />}
        {data && !loading && (
          <>
            <CoinHero data={data} />
            {/* Tabs */}
            <div className="tabs" role="tablist" aria-label="Analysis sections">
              {["overview", "technical", "prediction", "history"].map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={activeTab === t}
                  className={`tab-btn ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t === "overview" ? "📊 Overview" : t === "technical" ? "📈 Technical" : t === "prediction" ? "🔮 Prediction" : "📅 7-Day History"}
                </button>
              ))}
            </div>

            {activeTab === "overview" && <OverviewTab data={data} />}
            {activeTab === "technical" && <TechnicalTab data={data} />}
            {activeTab === "prediction" && <PredictionTab data={data} />}
            {activeTab === "history" && <HistoryTab data={data} />}
          </>
        )}
      </main>

      <style>{STYLES}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingScreen() {
  const msgs = ["Fetching live prices…", "Calculating RSI & MACD…", "Running AI prediction…", "Building analysis…"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="loading-msg">{msgs[idx]}</p>
    </div>
  );
}

function ErrorBox({ msg, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <span>⚠️ {msg}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

function CoinHero({ data }) {
  const { coin, prediction } = data;
  const dir = prediction.direction;
  // FIX: H1 is now visible and keyword-rich (audit issue #3)
  return (
    <section className="hero" aria-label={`${coin.name} price analysis`}>
      <div className="hero-left">
        {/* FIX: Next.js Image for CLS + better alt text (audit issues) */}
        <Image
          src={coin.image}
          alt={`${coin.name} price prediction analysis chart`}
          width={56}
          height={56}
          className="coin-img"
          priority
        />
        <div>
          {/* FIX: Visible H1 with keyword-rich text (audit issue #3) */}
          <h1 className="coin-name">
            {coin.name} Price Prediction &amp; Analysis
          </h1>
          <span className="coin-symbol">{coin.symbol.toUpperCase()} / USD</span>
        </div>
      </div>
      <div className="hero-center">
        <div className="price-big">${fmt(coin.current_price, coin.current_price < 1 ? 6 : 2)}</div>
        <div className={`change-badge ${coin.price_change_percentage_24h >= 0 ? "pos" : "neg"}`}>
          {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
        </div>
      </div>
      <div className="hero-right">
        <div className={`signal-box ${dir === "UP" ? "bull" : dir === "DOWN" ? "bear" : "neutral"}`}>
          <div className="signal-icon" aria-hidden="true">{dir === "UP" ? "🚀" : dir === "DOWN" ? "📉" : "➡️"}</div>
          <div className="signal-label">{dir === "UP" ? "BULLISH" : dir === "DOWN" ? "BEARISH" : "NEUTRAL"}</div>
          <div className="signal-conf">{prediction.confidence}% Confidence</div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card" style={color ? { borderTop: `3px solid ${color}` } : {}}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function OverviewTab({ data }) {
  const { coin, orderBook, support, resistance, yesterdayPrice, weekAgoPrice } = data;
  const priceVsYesterday = ((coin.current_price - yesterdayPrice) / yesterdayPrice) * 100;
  const priceVsWeek = ((coin.current_price - weekAgoPrice) / weekAgoPrice) * 100;

  return (
    <div className="tab-content">
      {/* Price context */}
      <section className="section" aria-labelledby="price-context-heading">
        <h2 className="section-title" id="price-context-heading">💰 Price Context</h2>
        <div className="grid-4">
          <StatCard label="Current Price" value={`$${fmt(coin.current_price, coin.current_price < 1 ? 6 : 2)}`} color="#00d4ff" />
          <StatCard
            label="Yesterday's Price"
            value={`$${fmt(yesterdayPrice, yesterdayPrice < 1 ? 6 : 2)}`}
            sub={`${priceVsYesterday >= 0 ? "▲" : "▼"} ${Math.abs(priceVsYesterday).toFixed(2)}% change`}
            color={priceVsYesterday >= 0 ? "#00ff88" : "#ff4466"}
          />
          <StatCard
            label="7 Days Ago"
            value={`$${fmt(weekAgoPrice, weekAgoPrice < 1 ? 6 : 2)}`}
            sub={`${priceVsWeek >= 0 ? "▲" : "▼"} ${Math.abs(priceVsWeek).toFixed(2)}% change`}
            color={priceVsWeek >= 0 ? "#00ff88" : "#ff4466"}
          />
          <StatCard label="24h Range" value={`$${fmt(coin.low_24h)} – $${fmt(coin.high_24h)}`} color="#ffaa00" />
        </div>
      </section>

      {/* Market Data */}
      <section className="section" aria-labelledby="market-data-heading">
        <h2 className="section-title" id="market-data-heading">📊 Market Data</h2>
        <div className="grid-4">
          <StatCard label="Market Cap" value={fmtUSD(coin.market_cap)} />
          <StatCard label="24h Volume" value={fmtUSD(coin.total_volume)} />
          <StatCard label="Circulating Supply" value={`${(coin.circulating_supply / 1e6).toFixed(2)}M`} />
          <StatCard label="7d Change" value={`${coin.price_change_percentage_7d_in_currency >= 0 ? "+" : ""}${coin.price_change_percentage_7d_in_currency?.toFixed(2) ?? "—"}%`} color={coin.price_change_percentage_7d_in_currency >= 0 ? "#00ff88" : "#ff4466"} />
          <StatCard label="All-Time High" value={`$${fmt(coin.ath)}`} sub={`${(((coin.current_price - coin.ath) / coin.ath) * 100).toFixed(1)}% from ATH`} />
          <StatCard label="All-Time Low" value={`$${fmt(coin.atl, coin.atl < 1 ? 6 : 2)}`} sub={`${(((coin.current_price - coin.atl) / coin.atl) * 100).toFixed(0)}% from ATL`} />
        </div>
      </section>

      {/* Buy / Sell Pressure */}
      <section className="section" aria-labelledby="sentiment-heading">
        <h2 className="section-title" id="sentiment-heading">⚖️ Market Sentiment (Buy vs Sell Pressure)</h2>
        <div className="pressure-bar-wrap">
          <div className="pressure-labels">
            <span className="buy-label">🟢 Buyers {orderBook.buyPressure}%</span>
            <span className="sell-label">Sellers {orderBook.sellPressure}% 🔴</span>
          </div>
          <div className="pressure-bar" role="meter" aria-valuenow={orderBook.buyPressure} aria-valuemin={0} aria-valuemax={100} aria-label="Buy pressure">
            <div className="buy-fill" style={{ width: `${orderBook.buyPressure}%` }} />
          </div>
          <p className="pressure-verdict">{orderBook.trend}</p>
        </div>
      </section>

      {/* Support & Resistance */}
      <section className="section" aria-labelledby="sr-heading">
        <h2 className="section-title" id="sr-heading">🎯 Support &amp; Resistance Levels</h2>
        <div className="sr-grid">
          <div className="sr-col">
            <h3 className="sr-head support-head">🟢 Support Levels</h3>
            {support.map((s, i) => (
              <div key={i} className="sr-level support">
                <span>S{i + 1}</span>
                <span>${fmt(s, s < 1 ? 6 : 2)}</span>
                <span className="sr-pct">{(((s - data.coin.current_price) / data.coin.current_price) * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <div className="sr-col">
            <h3 className="sr-head resist-head">🔴 Resistance Levels</h3>
            {resistance.map((r, i) => (
              <div key={i} className="sr-level resist">
                <span>R{i + 1}</span>
                <span>${fmt(r, r < 1 ? 6 : 2)}</span>
                <span className="sr-pct">+{(((r - data.coin.current_price) / data.coin.current_price) * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GaugeBar({ label, value, min = 0, max = 100, low = 30, high = 70 }) {
  if (value === null) return <div className="gauge-wrap"><div className="gauge-label">{label}</div><div className="gauge-na">N/A</div></div>;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const color = value < low ? "#ff4466" : value > high ? "#00ff88" : "#ffaa00";
  return (
    <div className="gauge-wrap">
      <div className="gauge-header">
        <span className="gauge-label">{label}</span>
        <span className="gauge-value" style={{ color }}>{value.toFixed(2)}</span>
      </div>
      <div className="gauge-track" role="meter" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={label}>
        <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="gauge-tags">
        <span>{min}</span>
        <span style={{ color: "#ff4466" }}>Oversold {low}</span>
        <span style={{ color: "#00ff88" }}>Overbought {high}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function TechnicalTab({ data }) {
  const { technical, coin } = data;
  const rsiStatus = technical.rsi === null ? "N/A" : technical.rsi < 30 ? "Oversold 🟢" : technical.rsi > 70 ? "Overbought 🔴" : "Neutral ⚪";
  const macdStatus = technical.macd !== null && technical.macdSignal !== null ? (technical.macd > technical.macdSignal ? "Bullish Crossover 🟢" : "Bearish Crossover 🔴") : "N/A";
  const emaStatus = technical.ema20 !== null && technical.ema50 !== null ? (technical.ema20 > technical.ema50 ? "Bullish (EMA20 > EMA50) 🟢" : "Bearish (EMA20 < EMA50) 🔴") : "N/A";
  const bbStatus = technical.bbUpper !== null && technical.bbLower !== null ? (coin.current_price > technical.bbUpper ? "Above Upper Band 🔴" : coin.current_price < technical.bbLower ? "Below Lower Band 🟢" : "Inside Bands ⚪") : "N/A";

  return (
    <div className="tab-content">
      <section className="section" aria-labelledby="rsi-heading">
        <h2 className="section-title" id="rsi-heading">📉 RSI — Relative Strength Index</h2>
        <GaugeBar label="RSI (14)" value={technical.rsi} min={0} max={100} low={30} high={70} />
        <div className="indicator-verdict">Status: <strong>{rsiStatus}</strong></div>
        <p className="indicator-explain">RSI 30 se neeche = oversold (buy signal) | RSI 70 se upar = overbought (sell signal)</p>
      </section>

      <section className="section" aria-labelledby="macd-heading">
        <h2 className="section-title" id="macd-heading">📊 MACD</h2>
        <div className="grid-3">
          <StatCard label="MACD Line" value={technical.macd !== null ? technical.macd.toFixed(4) : "N/A"} color="#00d4ff" />
          <StatCard label="Signal Line" value={technical.macdSignal !== null ? technical.macdSignal.toFixed(4) : "N/A"} color="#ffaa00" />
          <StatCard label="Histogram" value={technical.macd !== null && technical.macdSignal !== null ? (technical.macd - technical.macdSignal).toFixed(4) : "N/A"} color={technical.macd !== null && technical.macdSignal !== null && technical.macd > technical.macdSignal ? "#00ff88" : "#ff4466"} />
        </div>
        <div className="indicator-verdict">Status: <strong>{macdStatus}</strong></div>
        <p className="indicator-explain">MACD Signal line cross karna = trend change. MACD Signal = bullish momentum.</p>
      </section>

      <section className="section" aria-labelledby="ema-heading">
        <h2 className="section-title" id="ema-heading">📈 Moving Averages (EMA)</h2>
        <div className="grid-3">
          <StatCard label="EMA 20" value={technical.ema20 !== null ? `$${fmt(technical.ema20, technical.ema20 < 1 ? 6 : 2)}` : "N/A"} color="#00ff88" />
          <StatCard label="EMA 50" value={technical.ema50 !== null ? `$${fmt(technical.ema50, technical.ema50 < 1 ? 6 : 2)}` : "N/A"} color="#ffaa00" />
          <StatCard label="Current vs EMA20" value={technical.ema20 !== null ? `${(((data.coin.current_price - technical.ema20) / technical.ema20) * 100).toFixed(2)}%` : "N/A"} color={technical.ema20 !== null && data.coin.current_price > technical.ema20 ? "#00ff88" : "#ff4466"} />
        </div>
        <div className="indicator-verdict">EMA Status: <strong>{emaStatus}</strong></div>
        <p className="indicator-explain">Price EMA ke upar = uptrend. EMA20 EMA50 se upar = golden cross (bullish).</p>
      </section>

      <section className="section" aria-labelledby="bb-heading">
        <h2 className="section-title" id="bb-heading">📏 Bollinger Bands</h2>
        <div className="grid-3">
          <StatCard label="Upper Band" value={technical.bbUpper !== null ? `$${fmt(technical.bbUpper, technical.bbUpper < 1 ? 6 : 2)}` : "N/A"} color="#ff4466" />
          <StatCard label="Current Price" value={`$${fmt(data.coin.current_price, data.coin.current_price < 1 ? 6 : 2)}`} color="#ffffff" />
          <StatCard label="Lower Band" value={technical.bbLower !== null ? `$${fmt(technical.bbLower, technical.bbLower < 1 ? 6 : 2)}` : "N/A"} color="#00ff88" />
        </div>
        <div className="indicator-verdict">BB Status: <strong>{bbStatus}</strong></div>
        <p className="indicator-explain">Price lower band touch kare = potential buy. Upper band touch kare = potential sell.</p>
      </section>

      {technical.stoch !== null && (
        <section className="section" aria-labelledby="stoch-heading">
          <h2 className="section-title" id="stoch-heading">⚡ Stochastic Oscillator</h2>
          <GaugeBar label="Stoch %K" value={technical.stoch} min={0} max={100} low={20} high={80} />
          <p className="indicator-explain">20 se neeche oversold, 80 se upar overbought.</p>
        </section>
      )}
    </div>
  );
}

function PredictionTab({ data }) {
  const { prediction, coin } = data;
  const totalScore = prediction.bullScore + prediction.bearScore;
  const bullPct = totalScore > 0 ? (prediction.bullScore / totalScore) * 100 : 50;
  const bearPct = 100 - bullPct;

  return (
    <div className="tab-content">
      {/* Main signal */}
      <section className="section" aria-labelledby="prediction-heading">
        <h2 className="section-title" id="prediction-heading">🔮 AI Prediction</h2>
        <div className={`big-signal ${prediction.direction === "UP" ? "bull" : prediction.direction === "DOWN" ? "bear" : "neutral"}`}>
          <div className="big-signal-icon" aria-hidden="true">{prediction.direction === "UP" ? "🚀" : prediction.direction === "DOWN" ? "📉" : "➡️"}</div>
          <div className="big-signal-dir">{prediction.direction === "UP" ? "BULLISH — PRICE UP JAYE GA" : prediction.direction === "DOWN" ? "BEARISH — PRICE DOWN JAYE GA" : "NEUTRAL — SIDEWAYS"}</div>
          <div className="big-signal-conf">Confidence: {prediction.confidence}%</div>
          <div className="conf-bar-wrap">
            <div className="conf-bar" style={{ width: `${prediction.confidence}%` }} />
          </div>
          <div className="big-signal-sentiment">{prediction.sentiment}</div>
        </div>
      </section>

      {/* Targets */}
      <section className="section" aria-labelledby="targets-heading">
        <h2 className="section-title" id="targets-heading">🎯 Price Targets</h2>
        <div className="grid-3">
          <StatCard label="Current Price" value={`$${fmt(coin.current_price, coin.current_price < 1 ? 6 : 2)}`} color="#00d4ff" />
          <StatCard
            label="Target Price"
            value={`$${fmt(prediction.targetPrice, prediction.targetPrice < 1 ? 6 : 2)}`}
            sub={`${prediction.direction === "UP" ? "+" : ""}${(((prediction.targetPrice - coin.current_price) / coin.current_price) * 100).toFixed(2)}%`}
            color={prediction.direction === "UP" ? "#00ff88" : "#ff4466"}
          />
          <StatCard
            label="Stop Loss"
            value={`$${fmt(prediction.stopLoss, prediction.stopLoss < 1 ? 6 : 2)}`}
            sub={`${(((prediction.stopLoss - coin.current_price) / coin.current_price) * 100).toFixed(2)}%`}
            color="#ff4466"
          />
        </div>
      </section>

      {/* Bull vs Bear */}
      <section className="section" aria-labelledby="bullbear-heading">
        <h2 className="section-title" id="bullbear-heading">🐂 vs 🐻 Score</h2>
        <div className="bull-bear-bar" role="meter" aria-label="Bull vs Bear score">
          <div className="bull-fill" style={{ width: `${bullPct}%` }}>
            {bullPct > 20 && <span>🐂 {bullPct.toFixed(0)}%</span>}
          </div>
          <div className="bear-fill" style={{ width: `${bearPct}%` }}>
            {bearPct > 20 && <span>{bearPct.toFixed(0)}% 🐻</span>}
          </div>
        </div>
        <div className="score-nums">
          <span>Bull Score: {prediction.bullScore}</span>
          <span>Bear Score: {prediction.bearScore}</span>
        </div>
      </section>

      {/* Reasons */}
      <section className="section" aria-labelledby="reasons-heading">
        <h2 className="section-title" id="reasons-heading">📋 Analysis Reasons</h2>
        <div className="reasons-list">
          {prediction.reasons.map((r, i) => (
            <div key={i} className={`reason-item ${r.startsWith("🟢") ? "reason-bull" : r.startsWith("🔴") ? "reason-bear" : "reason-neutral"}`}>
              {r}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="disclaimer" role="note">
        ⚠️ Ye analysis sirf educational purposes ke liye hai. Ye financial advice nahi hai. Invest karne se pehle apna research karein aur risk manage karein.
      </div>
    </div>
  );
}

function HistoryTab({ data }) {
  const { ohlc7d, coin } = data;
  if (!ohlc7d || ohlc7d.length === 0) return <div className="tab-content"><p className="no-data">Historical data not available</p></div>;

  const maxHigh = Math.max(...ohlc7d.map((d) => d.high));
  const minLow = Math.min(...ohlc7d.map((d) => d.low));
  const range = maxHigh - minLow;

  return (
    <div className="tab-content">
      <section className="section" aria-labelledby="history-heading">
        <h2 className="section-title" id="history-heading">📅 7-Day OHLC History</h2>
        <div className="ohlc-table-wrap">
          <table className="ohlc-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Open</th>
                <th scope="col">High</th>
                <th scope="col">Low</th>
                <th scope="col">Close</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {ohlc7d.slice().reverse().map((d, i) => {
                const change = ((d.close - d.open) / d.open) * 100;
                const dateStr = new Date(d.time).toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric" });
                return (
                  <tr key={i} className={change >= 0 ? "row-bull" : "row-bear"}>
                    <td>{dateStr}</td>
                    <td>${fmt(d.open, d.open < 1 ? 5 : 2)}</td>
                    <td className="high-cell">${fmt(d.high, d.high < 1 ? 5 : 2)}</td>
                    <td className="low-cell">${fmt(d.low, d.low < 1 ? 5 : 2)}</td>
                    <td><strong>${fmt(d.close, d.close < 1 ? 5 : 2)}</strong></td>
                    <td className={change >= 0 ? "pos" : "neg"}>{change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual chart */}
      <section className="section" aria-labelledby="chart-heading">
        <h2 className="section-title" id="chart-heading">📊 Price Range Visual</h2>
        <div className="chart-wrap" role="img" aria-label={`${coin.name} 7-day candlestick price chart`}>
          {ohlc7d.map((d, i) => {
            const highPct = ((d.high - minLow) / range) * 100;
            const lowPct = ((d.low - minLow) / range) * 100;
            const openPct = ((d.open - minLow) / range) * 100;
            const closePct = ((d.close - minLow) / range) * 100;
            const isBull = d.close >= d.open;
            const dateStr = new Date(d.time).toLocaleDateString("en-US", { weekday: "short" });
            return (
              <div key={i} className="candle-col">
                <div className="candle-wrap" title={`O:${d.open} H:${d.high} L:${d.low} C:${d.close}`}>
                  {/* Wick */}
                  <div className="wick" style={{ bottom: `${lowPct}%`, height: `${highPct - lowPct}%`, background: isBull ? "#00ff88" : "#ff4466" }} />
                  {/* Body */}
                  <div
                    className="candle-body"
                    style={{
                      bottom: `${Math.min(openPct, closePct)}%`,
                      height: `${Math.max(0.5, Math.abs(closePct - openPct))}%`,
                      background: isBull ? "#00ff88" : "#ff4466",
                      opacity: 0.9,
                    }}
                  />
                </div>
                <div className="candle-label">{dateStr}</div>
              </div>
            );
          })}
        </div>
        <div className="chart-legend" aria-hidden="true">
          <span style={{ color: "#00ff88" }}>▮ Bullish (Close &gt; Open)</span>
          <span style={{ color: "#ff4466" }}>▮ Bearish (Close &lt; Open)</span>
        </div>
      </section>

      <section className="section" aria-labelledby="summary-heading">
        <h2 className="section-title" id="summary-heading">📌 7-Day Summary</h2>
        <div className="grid-4">
          <StatCard label="7-Day High" value={`$${fmt(maxHigh, maxHigh < 1 ? 5 : 2)}`} color="#00ff88" />
          <StatCard label="7-Day Low" value={`$${fmt(minLow, minLow < 1 ? 5 : 2)}`} color="#ff4466" />
          <StatCard label="Avg Close" value={`$${fmt(ohlc7d.reduce((a, d) => a + d.close, 0) / ohlc7d.length, coin.current_price < 1 ? 5 : 2)}`} color="#00d4ff" />
          <StatCard label="Current vs Week High" value={`${(((coin.current_price - maxHigh) / maxHigh) * 100).toFixed(2)}%`} color="#ffaa00" />
        </div>
      </section>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .app {
    min-height: 100vh;
    background: #050a14;
    color: #e8f0fe;
    font-family: 'Space Grotesk', sans-serif;
  }

  /* Accessibility: sr-only kept for any existing usage */
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

  /* Header */
  .header { background: rgba(5,10,20,0.95); border-bottom: 1px solid #1a2640; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); }
  .header-inner { max-width: 1400px; margin: 0 auto; padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
  .logo { display: flex; align-items: center; gap: 0.5rem; }
  .logo-icon { font-size: 1.4rem; color: #00d4ff; }
  .logo-text { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.03em; }
  .logo-badge { background: linear-gradient(135deg, #00d4ff22, #7c3aed22); border: 1px solid #00d4ff44; color: #00d4ff; font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 600; letter-spacing: 0.05em; }
  .search-form { display: flex; gap: 0.5rem; flex: 1; max-width: 420px; }
  .search-input { flex: 1; background: #0d1829; border: 1px solid #1a2640; color: #e8f0fe; border-radius: 8px; padding: 0.5rem 0.9rem; font-size: 0.9rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: #00d4ff; }
  .search-btn { background: linear-gradient(135deg, #00d4ff, #0099ff); color: #000; border: none; border-radius: 8px; padding: 0.5rem 1rem; font-weight: 700; cursor: pointer; font-size: 0.85rem; white-space: nowrap; transition: opacity 0.2s; }
  .search-btn:hover { opacity: 0.85; }

  /* Quick coins */
  .quick-coins { display: flex; gap: 0.4rem; padding: 0.75rem 1.5rem; overflow-x: auto; max-width: 1400px; margin: 0 auto; }
  .quick-btn { background: #0d1829; border: 1px solid #1a2640; color: #8899aa; border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; font-family: 'Space Mono', monospace; white-space: nowrap; transition: all 0.2s; }
  .quick-btn:hover { border-color: #00d4ff; color: #e8f0fe; }
  .quick-btn.active { background: #00d4ff15; border-color: #00d4ff; color: #00d4ff; }

  /* SEO Intro */
  .seo-intro { max-width: 1400px; margin: 0 auto; padding: 0.75rem 1.5rem; }
  .seo-intro p { font-size: 0.9rem; color: #8899aa; line-height: 1.6; margin-bottom: 0.5rem; }
  .internal-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .internal-links a { font-size: 0.8rem; color: #00d4ff; text-decoration: none; padding: 0.2rem 0.6rem; border: 1px solid #00d4ff33; border-radius: 4px; transition: all 0.2s; }
  .internal-links a:hover { background: #00d4ff15; border-color: #00d4ff; }

  /* Main */
  .main { max-width: 1400px; margin: 0 auto; padding: 1.5rem; }

  /* Loading */
  .loading { text-align: center; padding: 5rem 2rem; }
  .spinner { width: 48px; height: 48px; border: 3px solid #1a2640; border-top-color: #00d4ff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg { color: #8899aa; font-size: 0.9rem; }

  /* Error */
  .error-box { background: #ff446618; border: 1px solid #ff4466; border-radius: 12px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; justify-content: space-between; }
  .error-box button { background: #ff4466; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; }

  /* Hero */
  .hero { background: linear-gradient(135deg, #0d1829, #0d1420); border: 1px solid #1a2640; border-radius: 16px; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .hero-left { display: flex; align-items: center; gap: 1rem; }
  .coin-img { border-radius: 50%; border: 2px solid #1a2640; }
  .coin-name { font-size: 1.4rem; font-weight: 700; line-height: 1.2; }
  .coin-symbol { font-size: 0.85rem; color: #8899aa; font-family: 'Space Mono', monospace; margin-top: 0.25rem; display: block; }
  .hero-center { flex: 1; text-align: center; }
  .price-big { font-size: 2.5rem; font-weight: 700; font-family: 'Space Mono', monospace; letter-spacing: -0.02em; color: #fff; }
  .change-badge { display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600; font-size: 0.9rem; }
  .change-badge.pos { background: #00ff8822; color: #00ff88; border: 1px solid #00ff8844; }
  .change-badge.neg { background: #ff446622; color: #ff4466; border: 1px solid #ff446644; }
  .hero-right { min-width: 160px; }
  .signal-box { text-align: center; padding: 1rem 1.5rem; border-radius: 12px; }
  .signal-box.bull { background: #00ff8815; border: 1px solid #00ff8844; }
  .signal-box.bear { background: #ff446615; border: 1px solid #ff446644; }
  .signal-box.neutral { background: #ffaa0015; border: 1px solid #ffaa0044; }
  .signal-icon { font-size: 1.8rem; }
  .signal-label { font-size: 1rem; font-weight: 700; margin: 0.25rem 0 0.15rem; }
  .signal-conf { font-size: 0.8rem; color: #8899aa; }

  /* Tabs */
  .tabs { display: flex; gap: 0.4rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .tab-btn { background: #0d1829; border: 1px solid #1a2640; color: #8899aa; border-radius: 8px; padding: 0.55rem 1rem; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .tab-btn:hover { border-color: #00d4ff44; color: #e8f0fe; }
  .tab-btn.active { background: #00d4ff15; border-color: #00d4ff; color: #00d4ff; font-weight: 600; }

  /* Section */
  .section { background: #0d1829; border: 1px solid #1a2640; border-radius: 14px; padding: 1.5rem; margin-bottom: 1rem; }
  .section-title { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: #c0d0e8; letter-spacing: -0.01em; }
  .tab-content { }

  /* Stat cards */
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.75rem; }
  .stat-card { background: #07101e; border: 1px solid #1a2640; border-radius: 10px; padding: 1rem; }
  .stat-label { font-size: 0.75rem; color: #8899aa; font-weight: 500; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .stat-value { font-size: 1.1rem; font-weight: 700; font-family: 'Space Mono', monospace; }
  .stat-sub { font-size: 0.75rem; color: #8899aa; margin-top: 0.25rem; }

  /* Pressure bar */
  .pressure-bar-wrap { }
  .pressure-labels { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
  .buy-label { color: #00ff88; }
  .sell-label { color: #ff4466; }
  .pressure-bar { height: 24px; background: #ff446633; border-radius: 999px; overflow: hidden; }
  .buy-fill { height: 100%; background: linear-gradient(90deg, #00ff88, #00d4ff); border-radius: 999px; transition: width 0.5s; }
  .pressure-verdict { margin-top: 0.75rem; color: #8899aa; font-size: 0.9rem; }

  /* S&R */
  .sr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .sr-head { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
  .support-head { color: #00ff88; }
  .resist-head { color: #ff4466; }
  .sr-level { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; border-radius: 8px; margin-bottom: 0.4rem; font-size: 0.85rem; font-family: 'Space Mono', monospace; }
  .sr-level.support { background: #00ff8810; border: 1px solid #00ff8830; }
  .sr-level.resist { background: #ff446610; border: 1px solid #ff446630; }
  .sr-pct { color: #8899aa; }

  /* Gauge */
  .gauge-wrap { margin-bottom: 1rem; }
  .gauge-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
  .gauge-label { font-size: 0.85rem; color: #c0d0e8; font-weight: 500; }
  .gauge-value { font-size: 1rem; font-weight: 700; font-family: 'Space Mono', monospace; }
  .gauge-track { height: 12px; background: #07101e; border-radius: 999px; border: 1px solid #1a2640; overflow: hidden; }
  .gauge-fill { height: 100%; border-radius: 999px; transition: width 0.5s; }
  .gauge-tags { display: flex; justify-content: space-between; font-size: 0.65rem; color: #8899aa; margin-top: 0.25rem; }
  .gauge-na { color: #8899aa; font-size: 0.85rem; padding: 0.5rem 0; }

  /* Indicator */
  .indicator-verdict { margin-top: 0.75rem; font-size: 0.9rem; color: #c0d0e8; }
  .indicator-explain { margin-top: 0.4rem; font-size: 0.8rem; color: #8899aa; line-height: 1.5; }

  /* Big signal */
  .big-signal { padding: 2rem; border-radius: 16px; text-align: center; margin-bottom: 0; }
  .big-signal.bull { background: radial-gradient(circle at center, #00ff8815, #07101e); border: 1px solid #00ff8844; }
  .big-signal.bear { background: radial-gradient(circle at center, #ff446615, #07101e); border: 1px solid #ff446644; }
  .big-signal.neutral { background: radial-gradient(circle at center, #ffaa0015, #07101e); border: 1px solid #ffaa0044; }
  .big-signal-icon { font-size: 3rem; }
  .big-signal-dir { font-size: 1.3rem; font-weight: 700; margin: 0.5rem 0 0.25rem; }
  .big-signal-conf { font-size: 0.9rem; color: #8899aa; margin-bottom: 0.75rem; }
  .conf-bar-wrap { height: 8px; background: #07101e; border-radius: 999px; overflow: hidden; max-width: 300px; margin: 0 auto 1rem; border: 1px solid #1a2640; }
  .conf-bar { height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 999px; transition: width 0.8s; }
  .big-signal-sentiment { font-size: 0.9rem; color: #c0d0e8; font-style: italic; }

  /* Bull/Bear bar */
  .bull-bear-bar { height: 40px; border-radius: 10px; overflow: hidden; display: flex; margin-bottom: 0.5rem; }
  .bull-fill { background: linear-gradient(90deg, #00ff88, #00cc66); display: flex; align-items: center; justify-content: flex-start; padding-left: 0.75rem; font-weight: 700; font-size: 0.85rem; color: #000; transition: width 0.5s; }
  .bear-fill { background: linear-gradient(90deg, #cc3355, #ff4466); display: flex; align-items: center; justify-content: flex-end; padding-right: 0.75rem; font-weight: 700; font-size: 0.85rem; color: #fff; transition: width 0.5s; }
  .score-nums { display: flex; justify-content: space-between; font-size: 0.8rem; color: #8899aa; margin-top: 0.25rem; }

  /* Reasons */
  .reasons-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .reason-item { padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; }
  .reason-bull { background: #00ff8810; border: 1px solid #00ff8830; }
  .reason-bear { background: #ff446610; border: 1px solid #ff446630; }
  .reason-neutral { background: #ffaa0010; border: 1px solid #ffaa0030; }

  /* Disclaimer */
  .disclaimer { margin-top: 1rem; background: #ffaa0010; border: 1px solid #ffaa0030; border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #ffaa00; line-height: 1.5; }

  /* OHLC Table */
  .ohlc-table-wrap { overflow-x: auto; }
  .ohlc-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; font-family: 'Space Mono', monospace; }
  .ohlc-table th { background: #07101e; color: #8899aa; padding: 0.6rem 0.75rem; text-align: right; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
  .ohlc-table th:first-child { text-align: left; }
  .ohlc-table td { padding: 0.55rem 0.75rem; text-align: right; border-bottom: 1px solid #1a2640; }
  .ohlc-table td:first-child { text-align: left; color: #c0d0e8; font-family: 'Space Grotesk', sans-serif; }
  .high-cell { color: #00ff88; }
  .low-cell { color: #ff4466; }
  .row-bull { background: #00ff8805; }
  .row-bear { background: #ff446605; }
  .pos { color: #00ff88; }
  .neg { color: #ff4466; }

  /* Candle chart */
  .chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding: 0 0.5rem 2rem; border-bottom: 1px solid #1a2640; position: relative; }
  .candle-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; position: relative; }
  .candle-wrap { flex: 1; width: 100%; position: relative; }
  .wick { position: absolute; left: 50%; transform: translateX(-50%); width: 2px; }
  .candle-body { position: absolute; left: 15%; right: 15%; min-height: 2px; }
  .candle-label { font-size: 0.65rem; color: #8899aa; margin-top: 0.25rem; font-family: 'Space Grotesk', sans-serif; text-align: center; }
  .chart-legend { display: flex; gap: 1.5rem; margin-top: 1rem; font-size: 0.8rem; }
  .no-data { color: #8899aa; padding: 2rem; text-align: center; }

  @media (max-width: 768px) {
    .hero { flex-direction: column; align-items: flex-start; }
    .hero-center { width: 100%; }
    .hero-right { width: 100%; }
    .sr-grid { grid-template-columns: 1fr; }
    .price-big { font-size: 1.8rem; }
    .header-inner { flex-direction: column; align-items: flex-start; }
    .search-form { width: 100%; max-width: 100%; }
    .internal-links { gap: 0.4rem; }
  }
`