export const NEWS_CATEGORIES = ['ALL', 'BITCOIN', 'ETHEREUM', 'BLOCKCHAIN', 'DEFI', 'NFTS', 'CRYPTOCURRENCY', 'ALTCOIN', 'STAKING', 'DAO', 'MINING'];

const ARTICLE_BODIES = [
  `Institutional investors are accelerating their accumulation of digital assets at a pace not seen since the bull market of 2021. According to on-chain data and exchange flow reports, wallets associated with large financial institutions have been consistently absorbing supply over the past 30 days.

The primary driver behind this trend appears to be improving regulatory clarity across major jurisdictions. In the United States, the SEC's recent approval of spot Bitcoin ETF products has opened the floodgates for pension funds, endowments, and corporate treasuries to gain exposure to digital assets within a familiar regulatory framework.

**Key Data Points**

Bitcoin's realized cap — a metric that measures the total value of all coins at the price they were last moved — has climbed to an all-time high, indicating that new capital is entering the ecosystem at unprecedented levels. Meanwhile, exchange balances have continued their multi-year decline, suggesting holders prefer self-custody or long-term structured products over active trading.

Industry analysts at leading research firms note that the current accumulation pattern closely mirrors the pre-breakout phases of 2020, when institutional interest first became visible on-chain before the subsequent rally to all-time highs.

**Market Implications**

With supply increasingly constrained by long-term holders and institutional vaults, even modest increases in demand can produce outsized price movements. Bitcoin's stock-to-flow dynamics, already tightened by the recent halving, are compounding this supply squeeze.

Traders watching the derivatives markets have noted a notable shift toward longer-dated call options, suggesting that sophisticated participants are positioning for a sustained rally rather than a short-term pop. Funding rates across perpetual futures markets remain in positive territory but well below levels that historically signal overheating.

**What This Means for Retail Investors**

For individual market participants, the institutional accumulation story represents both an opportunity and a caution signal. On one hand, institutional presence typically brings reduced volatility and deeper market structure over time. On the other hand, institutional price targets may be far below the speculative peaks retail investors sometimes chase.

The consensus among macro strategists is that the current cycle, while sharing characteristics with prior bull markets, is structurally different due to the mainstreaming of crypto as an asset class. Whether this translates into a more orderly or more dramatic price discovery phase remains an open question.`,

  `The Ethereum ecosystem continues to evolve at a rapid pace, with Layer 2 solutions seeing record transaction volumes and the mainnet benefiting from dramatically reduced issuance following the Merge.

Recent data from blockchain analytics platforms shows that combined transaction volume across Optimism, Arbitrum, Base, and zkSync Era has surpassed Ethereum mainnet itself for the first time. This milestone underscores the success of the rollup-centric roadmap championed by the Ethereum Foundation.

**DeFi Activity Reaches New Heights**

Total value locked across Ethereum-based DeFi protocols has climbed past $80 billion, approaching the all-time highs set in 2021. Lending protocols, decentralized exchanges, and liquid staking derivatives continue to dominate, with newer restaking primitives emerging as a significant growth area.

EigenLayer, the leading restaking protocol, has attracted over $15 billion in deposits as validators seek to maximize yield on their staked ETH. Critics have raised concerns about systemic risk concentration, but proponents argue that the modular security model represents a fundamental innovation in crypto-economic design.

**The Road to Pectra**

Ethereum's upcoming Pectra upgrade promises to deliver several quality-of-life improvements for both users and validators. Among the most anticipated features are increased blob capacity for Layer 2 data availability and account abstraction improvements that will enable more sophisticated smart contract wallets.

The development community has been active on testnets, with the upgrade expected to reach mainnet in the coming months. Ethereum core developers have emphasized a cautious approach to scheduling, prioritizing security and stability over speed of deployment.`,

  `Blockchain technology is rapidly expanding beyond its cryptocurrency origins, with enterprises across healthcare, supply chain, and financial services deploying production-grade distributed ledger solutions.

A new report from a leading management consultancy estimates that enterprise blockchain deployments will generate over $20 billion in business value by 2026, driven primarily by efficiency gains in trade finance, cross-border payments, and provenance tracking.

**Supply Chain Transformation**

Major consumer goods companies have deployed blockchain-based traceability solutions that allow end consumers to verify the origin and handling of products from farm to shelf. Early deployments in the food and pharmaceutical industries have demonstrated significant reductions in recall costs and counterfeit goods detection.

The adoption of standardized blockchain protocols for supply chain documentation is reducing the need for paper-based processes that have persisted for decades. Letters of credit, bills of lading, and customs documentation are increasingly being digitized and placed on shared ledgers accessible to all relevant parties.

**Healthcare Applications**

Patient data interoperability remains a significant challenge across healthcare systems globally. Blockchain-based solutions are being piloted to create patient-controlled health records that can be shared across providers without compromising privacy.

Clinical trial management is another area seeing blockchain adoption, with pharmaceutical companies using distributed ledgers to ensure data integrity and prevent manipulation of trial results. Regulatory bodies in several jurisdictions have begun acknowledging blockchain-verified data in approval submissions.`,
];

const AUTHORS = [
  { name: "Marcus Chen", avatar: `https://picsum.photos/seed/author1/60/60`, role: "Senior Crypto Analyst" },
  { name: "Sarah Mitchell", avatar: `https://picsum.photos/seed/author2/60/60`, role: "Blockchain Correspondent" },
  { name: "James Patel", avatar: `https://picsum.photos/seed/author3/60/60`, role: "DeFi Research Lead" },
  { name: "Leila Osei", avatar: `https://picsum.photos/seed/author4/60/60`, role: "Market Strategist" },
  { name: "Ryan Torres", avatar: `https://picsum.photos/seed/author5/60/60`, role: "Technology Editor" },
];

const TITLES = [
  "Bitcoin Surges Past Key Resistance Level as Institutional Inflows Hit Record Highs",
  "Ethereum Layer 2 Ecosystem Explodes — Daily Transactions Surpass Mainnet for the First Time",
  "Enterprise Blockchain Adoption Accelerates: $20B Business Value Expected by 2026",
  "DeFi TVL Rebounds to $80 Billion as Restaking Protocols Attract Institutional Capital",
  "NFT Market Shows Signs of Recovery with Blue-Chip Collections Leading the Charge",
  "Crypto Regulation Clarity: How New Frameworks Are Reshaping the Industry",
  "Altcoin Season Signals: On-Chain Data Points to Broader Market Rally",
  "Staking Yields Hit Multi-Year Highs as Validators Compete for Network Security",
  "DAO Governance Evolves: New Voting Mechanisms Tackle Participation and Plutocracy",
  "Bitcoin Mining Difficulty Reaches ATH as Hash Rate Continues Relentless Climb",
  "Solana Ecosystem Sees Explosive Growth in DePIN and Consumer Applications",
  "Cross-Chain Bridges Process Record Volume as Multi-Chain DeFi Matures",
  "Central Bank Digital Currencies: Progress, Setbacks, and the Road Ahead",
  "Crypto Venture Funding Returns with $2.5B Deployed in Q1 2025",
  "Zero-Knowledge Proofs Go Mainstream: Privacy at Scale Arrives for Blockchain",
  "Tokenized Real-World Assets Surge Past $10B as TradFi Giants Enter the Space",
  "On-Chain Analytics: What Whale Movements Are Telling Us About the Next Move",
  "Layer 3 Blockchains Emerge as Application-Specific Chains Gain Developer Traction",
  "Crypto Derivatives Market Sets New Open Interest Record Ahead of Key Macro Events",
  "The Merge Anniversary: How Ethereum's Transition to PoS Reshaped the Ecosystem",
  "Decentralized Identity Solutions Gain Momentum as Web3 Adoption Grows",
  "Bitcoin ETF Inflows Break Weekly Record — $1.5B in Net New Assets",
  "GameFi 2.0: How Play-to-Earn Is Being Rebuilt With Better Economics",
  "Institutional Crypto Custody: The Race to Secure Digital Asset Infrastructure",
];

const EXCERPTS = [
  "Institutional investors are accelerating their accumulation of digital assets as regulatory clarity improves across major jurisdictions. Analysts predict this trend will continue through the quarter.",
  "Layer 2 solutions on Ethereum have crossed a historic milestone, with daily transaction volume eclipsing the mainnet for the first time since the blockchain's launch.",
  "Enterprise adoption of distributed ledger technology is transitioning from pilot programs to full production deployments, with measurable ROI across multiple industries.",
  "Total value locked in DeFi protocols has surpassed $80 billion, driven by innovative restaking primitives and improving yields across major lending and liquidity platforms.",
  "Blue-chip NFT collections are experiencing renewed demand as collectors and institutions distinguish quality assets from the broader market noise.",
  "New legislative frameworks in key jurisdictions are providing the clarity that institutional players have long demanded before committing significant capital to the crypto space.",
  "On-chain indicators traditionally associated with altcoin season are lighting up, suggesting capital rotation from Bitcoin into higher-beta assets may be underway.",
  "Proof-of-stake validators are earning their highest yields in years as network activity grows and staking participation reaches new saturation levels.",
  "Decentralized autonomous organizations are experimenting with hybrid governance models that aim to balance token holder influence with contribution-based participation.",
  "Bitcoin's mining difficulty has adjusted upward to a new all-time high, reflecting continued investment in hash rate infrastructure despite margin pressures.",
];

const TAGS = ['MARKET UPDATE', 'ANALYSIS', 'TECHNOLOGY', 'REGULATION', 'DEFI', 'ON-CHAIN'];
const KEYWORDS_MAP: Record<string, string[]> = {
  BITCOIN: ['bitcoin', 'btc', 'digital gold', 'halving', 'mining'],
  ETHEREUM: ['ethereum', 'eth', 'smart contracts', 'layer 2', 'defi'],
  BLOCKCHAIN: ['blockchain', 'distributed ledger', 'web3', 'decentralization'],
  DEFI: ['defi', 'yield', 'liquidity', 'amm', 'lending'],
  NFTS: ['nft', 'digital art', 'collectibles', 'opensea', 'metaverse'],
  CRYPTOCURRENCY: ['crypto', 'altcoin', 'token', 'market cap', 'trading'],
  ALTCOIN: ['altcoin', 'solana', 'cardano', 'avalanche', 'polkadot'],
  STAKING: ['staking', 'validator', 'proof of stake', 'yield', 'rewards'],
  DAO: ['dao', 'governance', 'voting', 'decentralized', 'treasury'],
  MINING: ['mining', 'hash rate', 'asic', 'energy', 'difficulty'],
};

export const mockNews = Array.from({ length: 24 }).map((_, i) => {
  const category = NEWS_CATEGORIES[(i % (NEWS_CATEGORIES.length - 1)) + 1];
  const title = TITLES[i] ?? `Crypto Market Update: Major Token Movement Analysis #${i}`;
  const excerpt = EXCERPTS[i % EXCERPTS.length];
  const author = AUTHORS[i % AUTHORS.length];
  const body = ARTICLE_BODIES[i % ARTICLE_BODIES.length];
  const readTime = Math.floor(body.split(' ').length / 200) + 3;
  return {
    id: `news-${i}`,
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    title,
    category,
    imageUrl: `https://picsum.photos/seed/${i + 100}/1200/630`,
    thumbnailUrl: `https://picsum.photos/seed/${i + 100}/600/400`,
    date: new Date(Date.now() - i * 3600000 * 3).toISOString(),
    tag: TAGS[i % TAGS.length],
    isFeatured: i === 0,
    isBreaking: i === 0,
    excerpt,
    body,
    author,
    readTime,
    keywords: ['crypto news', 'cryptocurrency', ...(KEYWORDS_MAP[category] ?? [])],
    relatedIds: [
      `news-${(i + 1) % 24}`,
      `news-${(i + 2) % 24}`,
      `news-${(i + 3) % 24}`,
    ],
  };
});

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
    description: "Join industry leaders and innovators to discuss the next wave of decentralised technologies.",
  };
});

export const mockWhales = Array.from({ length: 20 }).map((_, i) => {
  const type = ['TRANSFER', 'MINT', 'BURN'][i % 3] as 'TRANSFER' | 'MINT' | 'BURN';
  const coin = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL'][i % 5];
  const amountNum = (Math.random() * 10000 + 100);
  const amountStr = amountNum.toFixed(2);
  const usdValue = `$${(amountNum * (coin === 'BTC' ? 65000 : coin === 'ETH' ? 3500 : coin === 'SOL' ? 150 : 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return {
    id: `whale-${i}`,
    type,
    coin,
    amount: `${amountStr} ${coin}`,
    usdValue,
    fromWallet: `0x${(i * 13579 + 1234).toString(16).padStart(8, '0')}...${(i * 97 + 42).toString(16).padStart(4, '0')}`,
    toWallet: `0x${(i * 24680 + 5678).toString(16).padStart(8, '0')}...${(i * 53 + 99).toString(16).padStart(4, '0')}`,
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
    timeLeft: status === 'active' ? `${(i + 1) * 12}H LEFT` : status === 'upcoming' ? `FROM Q${(i % 4) + 1} 2025` : "ENDED",
    startDate: new Date(Date.now() + (i - 4) * 86400000 * 10).toISOString(),
  };
});

export const mockCoinAnalysis = [
  { name: 'Bitcoin', symbol: 'BTC', rank: 1, price: '$65,420.00', change24h: 2.4, signal: 'BUY' as const, confidence: 85, rsi: { value: 62, signal: 'Neutral' }, macd: { signal: 'Bullish' }, sentiment: { score: 78, label: 'Positive' }, volMcapPct: 4.2, bullishPoints: ['Strong institutional inflow', 'Golden cross on daily chart', 'Hashrate at ATH'], bearishPoints: ['Miner selling pressure'], neutralPoints: ['Funding rates stable'], targets: ['$68k', '$72k', '$75k'], resistance: '$67,500', support: '$62,000', stopLoss: '$60,500' },
  { name: 'Ethereum', symbol: 'ETH', rank: 2, price: '$3,450.20', change24h: -1.2, signal: 'HOLD' as const, confidence: 55, rsi: { value: 45, signal: 'Neutral' }, macd: { signal: 'Bearish' }, sentiment: { score: 50, label: 'Neutral' }, volMcapPct: 3.8, bullishPoints: ['DeFi TVL growing'], bearishPoints: ['Gas fees hitting low activity', 'L2 extraction'], neutralPoints: ['Staking ratio steady'], targets: ['$3.8k', '$4.2k', '$4.5k'], resistance: '$3,600', support: '$3,200', stopLoss: '$3,100' },
  { name: 'Solana', symbol: 'SOL', rank: 5, price: '$145.60', change24h: 8.5, signal: 'BUY' as const, confidence: 92, rsi: { value: 72, signal: 'Overbought' }, macd: { signal: 'Bullish' }, sentiment: { score: 88, label: 'Positive' }, volMcapPct: 8.5, bullishPoints: ['DEX volume ATH', 'Meme coin season return'], bearishPoints: [], neutralPoints: ['Network reliability stable'], targets: ['$160', '$180', '$200'], resistance: '$150', support: '$130', stopLoss: '$120' },
].concat(Array.from({ length: 7 }).map((_, i) => ({
  name: ['BNB', 'XRP', 'DOGE', 'Cardano', 'Avalanche', 'Chainlink', 'TON'][i],
  symbol: ['BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'TON'][i],
  rank: i + 6,
  price: `$${(10 + i * 17.5).toFixed(2)}`,
  change24h: Number(((i % 2 === 0 ? 1 : -1) * (i + 1) * 1.5).toFixed(2)),
  signal: ['BUY', 'HOLD', 'SELL'][i % 3] as 'BUY' | 'HOLD' | 'SELL',
  confidence: 40 + i * 8,
  rsi: { value: 30 + i * 6, signal: ['Oversold', 'Neutral', 'Overbought'][i % 3] },
  macd: { signal: ['Bullish', 'Bearish', 'Neutral'][i % 3] },
  sentiment: { score: 35 + i * 9, label: ['Positive', 'Negative', 'Neutral'][i % 3] as 'Positive' | 'Negative' | 'Neutral' },
  volMcapPct: Number((1.5 + i * 0.8).toFixed(2)),
  bullishPoints: ['Volume increase', 'Partnership announced'],
  bearishPoints: ['Whale distribution'],
  neutralPoints: ['Price consolidating'],
  targets: [`$${(12 + i * 2)}`, `$${(15 + i * 2)}`, `$${(18 + i * 2)}`],
  resistance: `$${(11 + i * 2)}`,
  support: `$${(9 + i * 2)}`,
  stopLoss: `$${(8 + i * 2)}`,
})));
