export const NEWS_CATEGORIES = ['ALL', 'BITCOIN', 'ETHEREUM', 'BLOCKCHAIN', 'DEFI', 'NFTS', 'CRYPTOCURRENCY', 'ALTCOIN', 'STAKING', 'DAO', 'MINING'];



export const TAGS = ['MARKET UPDATE', 'ANALYSIS', 'TECHNOLOGY', 'REGULATION', 'DEFI', 'ON-CHAIN'];
export const KEYWORDS_MAP = {
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


export const ICO_CATEGORIES = ['Layer 2', 'DeFi', 'ZK Rollup', 'DAO', 'Infrastructure', 'Bridges', 'Mesh Network', 'Vaults', 'Oracle'];
const ICO_ABOUT = [
  'BitFi Protocol is a next-generation Layer 2 scaling solution that leverages zero-knowledge proofs to deliver near-infinite transaction throughput while preserving Ethereum-level security. Built by a team of cryptography researchers and infrastructure veterans, BitFi targets institutional DeFi use cases requiring sub-second finality and predictable gas costs.',
  'NovaSpark is a permissionless DeFi platform enabling cross-chain yield aggregation with a single-click interface. Its novel liquidity routing algorithm consistently finds the best APY across 14+ chains without requiring manual bridging. The protocol is governed by NOVA token holders through an on-chain DAO.',
  'ZeroLayer introduces a universal ZK rollup settlement layer that any application chain can plug into. By batching proofs from multiple rollups into a single Ethereum transaction, ZeroLayer reduces settlement costs by up to 95% while maintaining full data availability.',
  'AetherDAO is a community-first protocol enabling decentralized decision-making for on-chain treasuries. AETH holders vote on grant allocations, protocol upgrades, and partnership initiatives. The platform features quadratic voting and time-locked execution for added security.',
  'ChainForge provides an open-source toolkit for building and deploying application-specific blockchains. Using a modular architecture inspired by the Cosmos SDK, teams can launch a sovereign chain with EVM compatibility in under 24 hours — no core blockchain expertise required.',
  'QuantumBridge is a trustless cross-chain messaging protocol backed by a network of decentralized relayers. Transactions are secured by a novel optimistic verification system with a 2-hour fraud proof window, making it one of the most capital-efficient bridges in the ecosystem.',
  'StellarMesh is a decentralized wireless infrastructure network that rewards node operators with STLR tokens for providing connectivity. The protocol aggregates coverage from thousands of IoT devices to build a censorship-resistant data layer for Web3 applications.',
  'OmegaVault is an institutional-grade on-chain asset custody protocol featuring multi-signature security, time-locks, and insurance integrations. It targets DAOs and treasuries managing over $10M in assets who require enterprise controls without sacrificing self-custody.',
  'PulseNet is a decentralized oracle network specializing in real-time sports, weather, and financial data feeds. Its reputation-based data aggregation model slashes manipulation risk while delivering sub-100ms latency — fast enough for on-chain prediction markets and perpetuals.',
];





