'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';
import { fetchCoins } from '../../../../apis/cryptowhales';

const TYPES = ['all', 'coins', 'tokens'];

// ── SEO: Structured Data helper ──────────────────────────────
function CoinListingSchema({ coins, locale }) {
  if (!coins?.length) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cryptocurrency Coin Glossary',
    description:
      'A comprehensive glossary of cryptocurrencies, tokens, and blockchain projects with detailed information.',
    numberOfItems: coins.length,
    itemListElement: coins.map((coin, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: coin.name,
      url: `/${locale}/coin-glossary/${coin.slug || coin.uuid}`,
      image: coin.icon_url || '',
      description: coin.description || `${coin.name} (${coin.symbol}) cryptocurrency information`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function CoinsPage() {
  const { dict, locale } = useLocale();

  const [coins, setCoins]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [search, setSearch]           = useState('');
  const [activeType, setActiveType]   = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const loadCoins = async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);

    const res = await fetchCoins(pageNum, search, activeType, locale);

    if (reset || pageNum === 1) {
      setCoins(res.data || []);
    } else {
      setCoins(prev => [...prev, ...(res.data || [])]);
    }

    setHasMore(pageNum < (res.metadata?.total_pages || 1));
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    loadCoins(1, true);
  }, [search, activeType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleShowMore = () => {
    const next = page + 1;
    setPage(next);
    loadCoins(next);
  };

  // ── Tag badge color mapping ──────────────────────────────────
  const tagStyle = (tag) => {
    const map = {
      defi:            'bg-indigo-50 text-indigo-600',
      altcoin:         'bg-orange-50 text-orange-500',
      'erc-20':        'bg-purple-50 text-purple-600',
      'liquid-staking':'bg-cyan-50 text-cyan-600',
      inflationary:    'bg-red-50 text-red-500',
      coin:            'bg-indigo-50 text-indigo-600',
      token:           'bg-orange-50 text-orange-500',
    };
    return map[tag] || 'bg-slate-100 text-slate-500';
  };

  return (
    <>
      {/* ── SEO: Page-level Structured Data ── */}
      <CoinListingSchema coins={coins} locale={locale} />

      <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

        {/* ── Breadcrumb ── */}
        <nav
          className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">
            {dict?.home || 'Home'}
          </Link>
          <span aria-hidden="true">&rsaquo;</span>
          <span className="text-slate-400" aria-current="page">
            {dict?.coin_glossary || 'Coin Glossary'}
          </span>
        </nav>

        {/* ── Sub Nav ── */}
        <div className="border-b border-slate-100 mb-10">
          <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 flex gap-8">
            <button
              className="py-4 text-sm font-bold tracking-wide border-b-2 border-indigo-600 text-indigo-600"
              aria-current="page"
            >
              {dict?.coin_glossary || 'Coin Glossary'}
            </button>
          </div>
        </div>

        {/* ── Header ── */}
        <header className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
              <FiTrendingUp className="text-indigo-600" aria-hidden="true" />
              {dict?.coin_glossary || 'Coin Glossary'}
            </h1>
            <p className="text-slate-500 text-sm">
              Explore all cryptocurrencies, tokens, and blockchain projects.
            </p>
          </div>
        </header>

        {/* ── Filters ── */}
        <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            {/* Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="group" aria-label="Filter by type">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  aria-pressed={activeType === t}
                  className={`px-5 py-1.5 border rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                    activeType === t
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-500'
                  }`}
                >
                  {dict.launchpad[t]}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80" role="search">
              <label htmlFor="coin-search" className="sr-only">Search Coins</label>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="coin-search"
                type="search"
                placeholder="Search coins..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                autoComplete="off"
              />
            </form>
          </div>
        </div>

        {/* ── Grid ── */}
        <main className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 pb-20">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5" aria-busy="true" aria-label="Loading coins">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-44 animate-pulse" />
              ))}
            </div>
          ) : coins.length === 0 ? (
            <p className="text-center text-slate-400 py-20 text-sm" role="status">
              No coins found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {coins.map((coin) => {
                // ── Map new API fields ──────────────────────────────
                const logo        = coin.icon_url || coin.logo || null;
                const displayName = coin.name;
                const symbol      = coin.symbol;
                const rank        = coin.rank;
                const slug        = coin.slug || coin.uuid;
                // Primary tag: first tag from tags array, or fallback to coin type field
                const primaryTag  = Array.isArray(coin.tags) && coin.tags.length > 0
                  ? coin.tags[0]
                  : (coin.type || null);
                // Accent color from API (used as subtle left border)
                const accentColor = coin.color || null;
                // Short description preview (for SEO-friendly title attr)
                const descPreview = coin.description
                  ? coin.description.slice(0, 120)
                  : `${displayName} (${symbol}) on Coin Glossary`;

                return (
                  <Link
                    key={coin.uuid || coin.id}
                    href={`/${locale}/glossary/${slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 p-5 flex flex-col items-center text-center"
                    aria-label={`${displayName} (${symbol})${rank ? ` — Rank #${rank}` : ''}`}
                    title={descPreview}
                    // Subtle left-border accent using inline style from coin color
                    style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : {}}
                  >
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex-shrink-0">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`${displayName} logo`}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center font-black text-lg"
                          style={{ color: accentColor || '#94a3b8', background: accentColor ? `${accentColor}18` : undefined }}
                          aria-hidden="true"
                        >
                          {symbol?.slice(0, 2)}
                        </div>
                      )}
                    </div>

                    {/* Rank badge */}
                    {rank > 0 && (
                      <span className="text-[10px] font-black text-slate-400 mb-1" aria-label={`Rank ${rank}`}>
                        #{rank}
                      </span>
                    )}

                    {/* Name */}
                    <h2 className="font-black text-sm text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {displayName}
                    </h2>

                    {/* Symbol */}
                    <span className="text-xs font-bold text-slate-400 mb-3">
                      {symbol}
                    </span>

                    {/* Primary Tag badge (replaces old type badge) */}
                    {primaryTag && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${tagStyle(primaryTag)}`}>
                        {primaryTag}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Load More ── */}
          {hasMore && !loading && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleShowMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg w-full md:w-auto disabled:opacity-60"
                aria-label="Load more coins"
              >
                {loadingMore ? 'Loading...' : dict.launchpad.show_more_coins}
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}