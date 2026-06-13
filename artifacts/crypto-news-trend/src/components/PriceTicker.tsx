import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  icon: string;
}

const BASE_PRICES: CoinPrice[] = [
  { symbol: "BTC",  name: "Bitcoin",   price: 67420.50, change: 2.41,  icon: "₿" },
  { symbol: "ETH",  name: "Ethereum",  price: 3521.30,  change: -1.18, icon: "Ξ" },
  { symbol: "SOL",  name: "Solana",    price: 148.72,   change: 8.54,  icon: "◎" },
  { symbol: "BNB",  name: "BNB",       price: 612.40,   change: 1.33,  icon: "B" },
  { symbol: "XRP",  name: "XRP",       price: 0.5821,   change: -2.07, icon: "✕" },
  { symbol: "DOGE", name: "Dogecoin",  price: 0.1623,   change: 5.92,  icon: "Ð" },
  { symbol: "ADA",  name: "Cardano",   price: 0.4512,   change: -0.84, icon: "₳" },
  { symbol: "AVAX", name: "Avalanche", price: 38.21,    change: 3.17,  icon: "A" },
  { symbol: "LINK", name: "Chainlink", price: 14.87,    change: 1.65,  icon: "⬡" },
  { symbol: "DOT",  name: "Polkadot",  price: 7.43,     change: -1.42, icon: "●" },
  { symbol: "MATIC",name: "Polygon",   price: 0.8934,   change: 4.21,  icon: "M" },
  { symbol: "TON",  name: "Toncoin",   price: 5.82,     change: -0.63, icon: "◆" },
];

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1)    return `$${price.toFixed(4).replace(/0+$/, "").replace(/\.$/, ".00")}`;
  return `$${price.toFixed(4)}`;
}

function nudge(price: number): number {
  const pct = (Math.random() - 0.499) * 0.004;
  return Math.max(price * (1 + pct), 0.0001);
}

function nudgeChange(change: number): number {
  const delta = (Math.random() - 0.499) * 0.15;
  return Math.round((change + delta) * 100) / 100;
}

export function PriceTicker() {
  const [coins, setCoins] = useState<CoinPrice[]>(BASE_PRICES);
  const [flash, setFlash] = useState<Record<string, "up" | "down" | null>>({});
  const prevRef = useRef<Record<string, number>>({});

  // Update prices every 3 s
  useEffect(() => {
    const id = setInterval(() => {
      setCoins((prev) => {
        const next = prev.map((c) => ({
          ...c,
          price: nudge(c.price),
          change: nudgeChange(c.change),
        }));

        // Detect direction for flash
        const newFlash: Record<string, "up" | "down" | null> = {};
        next.forEach((c) => {
          const old = prevRef.current[c.symbol];
          if (old !== undefined) {
            newFlash[c.symbol] = c.price > old ? "up" : "down";
          }
          prevRef.current[c.symbol] = c.price;
        });
        setFlash(newFlash);
        setTimeout(() => setFlash({}), 600);

        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Duplicate items so the scroll looks seamless
  const items = [...coins, ...coins];

  return (
    <div className="w-full bg-[#0d1117] border-b border-gray-800/60 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Static label */}
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

                  {/* Change */}
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
