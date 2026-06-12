export const NEWS_CATEGORIES = ['ALL', 'BITCOIN', 'ETHEREUM', 'BLOCKCHAIN', 'DEFI', 'NFTS', 'CRYPTOCURRENCY', 'ALTCOIN', 'STAKING', 'DAO', 'MINING'];

export const mockNews = Array.from({ length: 24 }).map((_, i) => ({
  id: `news-${i}`,
  slug: `news-article-${i}`,
  title: i === 0 ? "Bitcoin Surges Past Key Resistance Level as Institutional Inflows Hit Record Highs" : `Crypto Market Update: Analysis of Major Token Movements ${i}`,
  category: NEWS_CATEGORIES[(i % (NEWS_CATEGORIES.length - 1)) + 1],
  imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`,
  date: new Date(Date.now() - i * 3600000).toISOString(),
  tag: i % 4 === 0 ? 'MARKET UPDATE' : 'ANALYSIS',
  isFeatured: i === 0,
  isBreaking: i === 0,
  excerpt: "Institutional investors are accelerating their accumulation of digital assets as regulatory clarity improves across major jurisdictions. Analysts predict this trend will continue through the quarter."
}));

export const mockTopStories = mockNews.slice(1, 6);

export const EVENT_STATUSES = ['ALL', 'ONGOING', 'UPCOMING', 'ENDED'];

export const mockEvents = Array.from({ length: 12 }).map((_, i) => {
  let status = 'UPCOMING';
  if (i < 2) status = 'ONGOING';
  else if (i > 8) status = 'ENDED';
  
  return {
    id: `event-${i}`,
    name: `Web3 Summit ${2024 + (i % 2)}: The Future of Finance`,
    location: ["Dubai, UAE", "Singapore", "New York, USA", "London, UK", "Virtual"][i % 5],
    date: new Date(Date.now() + (i - 5) * 86400000 * 5).toISOString(),
    status,
    imageUrl: `https://picsum.photos/seed/event${i}/600/300`,
    description: "Join industry leaders and innovators to discuss the next wave of decentralised technologies."
  };
});

export const mockWhales = Array.from({ length: 20 }).map((_, i) => {
  const type = ['TRANSFER', 'MINT', 'BURN'][i % 3] as 'TRANSFER'|'MINT'|'BURN';
  const coin = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL'][i % 5];
  const amountStr = (Math.random() * 10000).toFixed(2);
  const usdValue = `$${(Number(amountStr) * (coin === 'BTC' ? 65000 : coin === 'ETH' ? 3500 : coin === 'SOL' ? 150 : 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  
  return {
    id: `whale-${i}`,
    type,
    coin,
    amount: `${amountStr} ${coin}`,
    usdValue,
    fromWallet: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    toWallet: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    timestamp: new Date(Date.now() - i * 600000).toISOString(),
  };
});

export const mockIcos = Array.from({ length: 9 }).map((_, i) => {
  const status = i < 3 ? 'active' : i < 6 ? 'upcoming' : 'ended';
  return {
    id: `ico-${i}`,
    name: `Project ${String.fromCharCode(65 + i)} Protocol`,
    logo: `https://picsum.photos/seed/ico${i}/100/100`,
    description: "A revolutionary Layer 2 scaling solution aiming to provide infinite throughput with zero knowledge proofs.",
    status,
    timeLeft: status === 'active' ? `${Math.floor(Math.random() * 48) + 1}H LEFT` : status === 'upcoming' ? `FROM Q${(i % 4) + 1} 2025` : "ENDED",
    startDate: new Date(Date.now() + (i - 4) * 86400000 * 10).toISOString(),
  };
});

export const mockCoinAnalysis = [
  { name: 'Bitcoin', symbol: 'BTC', rank: 1, price: '$65,420.00', change24h: 2.4, signal: 'BUY' as const, confidence: 85, rsi: { value: 62, signal: 'Neutral' }, macd: { signal: 'Bullish' }, sentiment: { score: 78, label: 'Positive' }, volMcapPct: 4.2, bullishPoints: ['Strong institutional inflow', 'Golden cross on daily chart', 'Hashrate at ATH'], bearishPoints: ['Miner selling pressure'], neutralPoints: ['Funding rates stable'], targets: ['$68k', '$72k', '$75k'], resistance: '$67,500', support: '$62,000', stopLoss: '$60,500' },
  { name: 'Ethereum', symbol: 'ETH', rank: 2, price: '$3,450.20', change24h: -1.2, signal: 'HOLD' as const, confidence: 55, rsi: { value: 45, signal: 'Neutral' }, macd: { signal: 'Bearish' }, sentiment: { score: 50, label: 'Neutral' }, volMcapPct: 3.8, bullishPoints: ['Defi TVL growing'], bearishPoints: ['Gas fees hitting low activity', 'L2 extraction'], neutralPoints: ['Staking ratio steady'], targets: ['$3.8k', '$4.2k', '$4.5k'], resistance: '$3,600', support: '$3,200', stopLoss: '$3,100' },
  { name: 'Solana', symbol: 'SOL', rank: 5, price: '$145.60', change24h: 8.5, signal: 'BUY' as const, confidence: 92, rsi: { value: 72, signal: 'Overbought' }, macd: { signal: 'Bullish' }, sentiment: { score: 88, label: 'Positive' }, volMcapPct: 8.5, bullishPoints: ['DEX volume ATH', 'Meme coin season return'], bearishPoints: [], neutralPoints: ['Network reliability stable'], targets: ['$160', '$180', '$200'], resistance: '$150', support: '$130', stopLoss: '$120' },
  // Adding more dummy ones
].concat(Array.from({ length: 7 }).map((_, i) => ({
  name: ['BNB', 'XRP', 'DOGE', 'Cardano', 'Avalanche', 'Chainlink', 'TON'][i],
  symbol: ['BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'TON'][i],
  rank: i + 6,
  price: `$${(Math.random() * 100).toFixed(2)}`,
  change24h: Number((Math.random() * 20 - 10).toFixed(2)),
  signal: ['BUY', 'HOLD', 'SELL'][i % 3] as 'BUY'|'HOLD'|'SELL',
  confidence: Math.floor(Math.random() * 100),
  rsi: { value: Math.floor(Math.random() * 100), signal: ['Oversold', 'Neutral', 'Overbought'][i % 3] },
  macd: { signal: ['Bullish', 'Bearish', 'Neutral'][i % 3] },
  sentiment: { score: Math.floor(Math.random() * 100), label: ['Positive', 'Negative', 'Neutral'][i % 3] },
  volMcapPct: Number((Math.random() * 10).toFixed(2)),
  bullishPoints: ['Volume increase', 'Partnership announced'],
  bearishPoints: ['Whale distribution'],
  neutralPoints: ['Price consolidating'],
  targets: ['$10', '$12', '$15'],
  resistance: '$9',
  support: '$7',
  stopLoss: '$6'
})));
