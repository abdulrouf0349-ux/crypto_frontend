"use client";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

// CoinGecko IDs mapped to display info
const COIN_CONFIG = [
  { id: "bitcoin",          symbol: "BTC",   name: "Bitcoin",       icon: "₿" },
  { id: "ethereum",         symbol: "ETH",   name: "Ethereum",      icon: "Ξ" },
  { id: "solana",           symbol: "SOL",   name: "Solana",        icon: "◎" },
  { id: "binancecoin",      symbol: "BNB",   name: "BNB",           icon: "B" },
  { id: "ripple",           symbol: "XRP",   name: "XRP",           icon: "✕" },
  { id: "dogecoin",         symbol: "DOGE",  name: "Dogecoin",      icon: "Ð" },
  { id: "cardano",          symbol: "ADA",   name: "Cardano",       icon: "₳" },
  { id: "avalanche-2",      symbol: "AVAX",  name: "Avalanche",     icon: "A" },
  { id: "chainlink",        symbol: "LINK",  name: "Chainlink",     icon: "⬡" },
  { id: "polkadot",         symbol: "DOT",   name: "Polkadot",      icon: "●" },
  { id: "matic-network",    symbol: "POL",   name: "Polygon",       icon: "M" },
  { id: "toncoin",          symbol: "TON",   name: "Toncoin",       icon: "◆" },
  { id: "shiba-inu",        symbol: "SHIB",  name: "Shiba Inu",     icon: "🐕" },
  { id: "tron",             symbol: "TRX",   name: "TRON",          icon: "T" },
  { id: "sui",              symbol: "SUI",   name: "Sui",           icon: "S" },
  { id: "pepe",             symbol: "PEPE",  name: "Pepe",          icon: "🐸" },
  { id: "uniswap",          symbol: "UNI",   name: "Uniswap",       icon: "🦄" },
  { id: "litecoin",         symbol: "LTC",   name: "Litecoin",      icon: "Ł" },
  { id: "near",             symbol: "NEAR",  name: "NEAR",          icon: "N" },
  { id: "aptos",            symbol: "APT",   name: "Aptos",         icon: "A" },
];

const COIN_IDS = COIN_CONFIG.map((c) => c.id).join(",");

function formatPrice(price) {
  if (!price) return "$0.00";
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1)
    return `$${price.toFixed(4).replace(/0+$/, "").replace(/\.$/, ".00")}`;
  if (price < 0.0001)
    return `$${price.toFixed(8)}`;
  return `$${price.toFixed(4)}`;
}

export default function PriceTicker() {
  const [coins, setCoins] = useState([]);
  const [flash, setFlash] = useState({});
  const [loading, setLoading] = useState(true);
  const prevRef = useRef({});

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await res.json();

      const updated = COIN_CONFIG.map((coin) => ({
        ...coin,
        price: data[coin.id]?.usd ?? 0,
        change: data[coin.id]?.usd_24h_change ?? 0,
      })).filter((c) => c.price > 0);

      // Flash detection
      const newFlash = {};
      updated.forEach((c) => {
        const old = prevRef.current[c.symbol];
        if (old !== undefined) {
          newFlash[c.symbol] = c.price > old ? "up" : "down";
        }
        prevRef.current[c.symbol] = c.price;
      });

      setCoins(updated);
      setFlash(newFlash);
      setTimeout(() => setFlash({}), 600);
      setLoading(false);
    } catch (err) {
      console.error("CoinGecko fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPrices();
    // CoinGecko free tier — refresh every 60 seconds
    const id = setInterval(fetchPrices, 60000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#0d1117] border-b border-gray-800/60 h-9 flex items-center px-4">
        <span className="text-gray-500 text-xs animate-pulse">Loading prices...</span>
      </div>
    );
  }

  const items = [...coins, ...coins];

  return (
    <div className="w-full bg-[#0d1117] border-b border-gray-800/60 overflow-hidden select-none">
      <div className="flex items-center">
        {/* LIVE label */}
        <div className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-[11px] font-bold uppercase tracking-widest z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </div>

        {/* Scrolling track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {items.map((coin, i) => {
              const isUp = coin.change >= 0;
              const flashDir = flash[coin.symbol];
              return (
                <span
                  key={`${coin.symbol}-${i}`}
                  className={`inline-flex items-center gap-2 px-5 py-2 border-r border-gray-800/40 text-xs font-mono transition-colors duration-300 ${
                    flashDir === "up"
                      ? "bg-green-500/10"
                      : flashDir === "down"
                      ? "bg-red-500/10"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <span className="text-gray-400 text-[10px] font-bold w-3 text-center">
                    {coin.icon}
                  </span>

                  {/* Symbol */}
                  <span className="font-semibold text-white tracking-wide">
                    {coin.symbol}
                  </span>

                  {/* Price */}
                  <span
                    className={`transition-colors duration-300 ${
                      flashDir === "up"
                        ? "text-green-400"
                        : flashDir === "down"
                        ? "text-red-400"
                        : "text-gray-200"
                    }`}
                  >
                    {formatPrice(coin.price)}
                  </span>

                  {/* 24h Change */}
                  <span
                    className={`flex items-center gap-0.5 font-semibold ${
                      isUp ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {isUp ? "+" : ""}
                    {coin.change.toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}