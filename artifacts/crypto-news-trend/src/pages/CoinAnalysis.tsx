import { useState } from "react";
import { mockCoinAnalysis } from "@/lib/mockData";
import { Search, BrainCircuit, Activity, BarChart2, TrendingUp, TrendingDown, Check, X, Circle, LineChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function CoinAnalysis() {
  const [search, setSearch] = useState("");
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState("BTC");

  const coins = mockCoinAnalysis;
  const selectedCoin = coins.find(c => c.symbol === selectedCoinSymbol) || coins[0];

  const filteredPills = coins.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] forced-dark dark selection:bg-purple-500/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-purple-500" />
            Coin Analysis
          </h1>
          <p className="text-[#8b949e] font-mono text-sm tracking-widest uppercase">
            FINBERT AI · RSI · MACD · VOLUME
          </p>
        </div>

        {/* Quick Select & Search */}
        <div className="flex flex-col gap-4 mb-8 bg-[#161b22] border border-[#21262d] rounded-lg p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
            <Input 
              placeholder="Search coin..." 
              className="pl-9 bg-[#0d1117] border-[#21262d] text-white focus-visible:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredPills.map(coin => (
              <button
                key={coin.symbol}
                onClick={() => setSelectedCoinSymbol(coin.symbol)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  selectedCoinSymbol === coin.symbol 
                    ? "bg-purple-600 text-white" 
                    : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white"
                }`}
              >
                {coin.symbol}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCoin.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Main Header & Signal */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-3xl font-display font-bold">{selectedCoin.name}</h2>
                      <span className="text-[#8b949e] font-mono text-xl">{selectedCoin.symbol}</span>
                    </div>
                    <Badge variant="outline" className="bg-[#21262d] text-[#8b949e] border-[#30363d] text-[10px]">
                      RANK #{selectedCoin.rank}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="text-4xl font-mono font-bold tracking-tight mb-2">
                    {selectedCoin.price}
                  </div>
                  <div className={`flex items-center gap-1 font-mono font-bold ${selectedCoin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedCoin.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(selectedCoin.change24h)}%
                  </div>
                </div>

                <div className="border-t border-[#21262d] pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">AI Signal</div>
                    <div className={`text-3xl font-display font-bold ${
                      selectedCoin.signal === 'BUY' ? 'text-green-500' :
                      selectedCoin.signal === 'SELL' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {selectedCoin.signal}
                    </div>
                  </div>
                  
                  {/* Gauge representation */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#21262d" strokeWidth="8" fill="none" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        stroke={selectedCoin.signal === 'BUY' ? '#22c55e' : selectedCoin.signal === 'SELL' ? '#ef4444' : '#eab308'} 
                        strokeWidth="8" fill="none" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * selectedCoin.confidence) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-lg font-bold font-mono">{selectedCoin.confidence}%</span>
                      <span className="text-[8px] text-[#8b949e] uppercase">Conf</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg gap-2">
                <LineChart className="w-5 h-5" />
                View Full Chart
              </Button>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "RSI (14)", value: selectedCoin.rsi.value, sub: selectedCoin.rsi.signal, icon: Activity },
                  { label: "MACD", value: selectedCoin.macd.signal, sub: "Trend", icon: TrendingUp },
                  { label: "Sentiment", value: selectedCoin.sentiment.score, sub: selectedCoin.sentiment.label, icon: BrainCircuit },
                  { label: "Vol/Mcap", value: `${selectedCoin.volMcapPct}%`, sub: "24h Ratio", icon: BarChart2 },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#161b22] border border-[#21262d] rounded-lg p-4">
                    <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <stat.icon className="w-3.5 h-3.5" />
                      {stat.label}
                    </div>
                    <div className="font-mono font-bold text-lg mb-1">{stat.value}</div>
                    <div className="text-xs text-[#8b949e]">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
                  <h3 className="font-display font-bold text-lg mb-4 border-b border-[#21262d] pb-2">Analysis Breakdown</h3>
                  <div className="space-y-3">
                    {selectedCoin.bullishPoints.map((p, i) => (
                      <div key={`bull-${i}`} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-[#e6edf3]">{p}</span>
                      </div>
                    ))}
                    {selectedCoin.bearishPoints.map((p, i) => (
                      <div key={`bear-${i}`} className="flex items-start gap-2 text-sm">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-[#e6edf3]">{p}</span>
                      </div>
                    ))}
                    {selectedCoin.neutralPoints.map((p, i) => (
                      <div key={`neu-${i}`} className="flex items-start gap-2 text-sm">
                        <Circle className="w-3 h-3 text-[#8b949e] shrink-0 mt-1" />
                        <span className="text-[#8b949e]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Levels */}
                <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
                  <h3 className="font-display font-bold text-lg mb-4 border-b border-[#21262d] pb-2">Key Price Levels</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-[#21262d]/50">
                      <span className="text-green-400">Target 3</span>
                      <span className="font-bold">{selectedCoin.targets[2]}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#21262d]/50">
                      <span className="text-green-500">Target 2</span>
                      <span className="font-bold">{selectedCoin.targets[1]}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#21262d]/50">
                      <span className="text-green-600">Target 1</span>
                      <span className="font-bold">{selectedCoin.targets[0]}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-[#21262d]/30 px-2 rounded mt-2">
                      <span className="text-[#8b949e]">Current Price</span>
                      <span className="font-bold">{selectedCoin.price}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#21262d]/50 mt-2">
                      <span className="text-[#8b949e]">Resistance</span>
                      <span className="font-bold">{selectedCoin.resistance}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#21262d]/50">
                      <span className="text-[#8b949e]">Support</span>
                      <span className="font-bold">{selectedCoin.support}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-red-500">Stop Loss</span>
                      <span className="font-bold">{selectedCoin.stopLoss}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
