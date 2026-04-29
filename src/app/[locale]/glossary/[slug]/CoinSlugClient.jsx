'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { fetchCoinDetail } from '../../../../../apis/cryptowhales';
import MobileSupportButton from '../../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../../components/Data/CoinAnalysisFloat';

export default function CoinSlugClient({ slug, locale, initialCoin }) {
  const { dict } = useLocale();
  const [coin, setCoin] = useState(initialCoin || null);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!slug) return;
    // Pre-rendered data agar mojud hai to dubara fetch na karein (Performance Optimization)
    if (isFirstRender.current && initialCoin) {
      isFirstRender.current = false;
      setCoin(initialCoin);
      return;
    }
    isFirstRender.current = false;
    setLoading(true);
    let isMounted = true;

    const getCoinData = async () => {
      try {
        const res = await fetchCoinDetail(slug, locale);
        if (isMounted) {
          setCoin(res?.data || res);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };
    getCoinData();
    return () => { isMounted = false; };
  }, [slug, locale, initialCoin]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-slate-400">Syncing Data...</p>
      </div>
    </div>
  );

  if (!coin) return notFound();

  const logo = coin.icon_url || coin.logo || null;
  const accentColor = coin.color || '#4f46e5';
  const tags = Array.isArray(coin.tags) ? coin.tags : (typeof coin.tags === 'string' ? coin.tags.split(',') : []);

  const detailRows = [
    { label: 'Official Symbol', value: coin.symbol?.toUpperCase() },
    { label: 'Market Rank', value: coin.rank ? `#${coin.rank}` : 'N/A' },
    { label: 'Official Site', value: coin.website_url || coin.links?.website },
    { label: 'Created At', value: coin.created_at?.slice(0, 10) },
  ].filter(r => r.value);

  return (
    <>
      <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
        
        {/* ✅ Navigation (Accessibility Optimized) */}
        <nav className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors font-medium">
            Home
          </Link>
          <span className="text-slate-300" aria-hidden="true">›</span>
          <Link href={`/${locale}/glossary`} className="hover:text-indigo-600 transition-colors font-medium">
            Coin Glossary
          </Link>
          <span className="text-slate-300" aria-hidden="true">›</span>
          <span className="text-slate-400 truncate" aria-current="page">
            {coin.name} Detail
          </span>
        </nav>

        {/* ✅ Header Section */}
        <header className="max-w-[1400px] mx-auto px-4 lg:px-28 py-10 border-b border-slate-100" style={{ borderBottomColor: `${accentColor}20` }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0 flex items-center justify-center" style={{ borderColor: `${accentColor}30` }}>
              {logo ? (
                <img src={logo} alt={`${coin.name} (${coin.symbol}) token icon`} width={80} height={80} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-2xl font-bold text-slate-300">{coin.symbol?.slice(0, 2)}</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {coin.name} <span className="text-slate-400 font-bold uppercase text-2xl">({coin.symbol})</span>
                </h1>
                <span className="px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {tags.includes('coin') ? 'Verified Coin' : 'Digital Token'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-semibold">
                {coin.website_url && <span className="flex items-center gap-1">🌐 Web Verified</span>}
                {coin.links?.github && <span className="flex items-center gap-1">💻 Open Ledger</span>}
                <span className="flex items-center gap-1">🛡️ SSL Secured</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-28 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* ✅ Main Content Area */}
            <article className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800">
                  <span className="w-1.5 h-8 rounded-full inline-block" style={{ background: accentColor }} />
                  About {coin.name} Project
                </h2>
                <div className="text-slate-600 leading-relaxed text-lg text-justify bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  {coin.description || `Analyze the latest technical specifications, market ranking, and blockchain utility of ${coin.name} (${coin.symbol}). Stay updated with our comprehensive crypto glossary.`}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800">
                  <span className="w-1.5 h-8 bg-orange-400 rounded-full inline-block" />
                  Ecosystem Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tags.length > 0 ? tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm">
                      #{tag.trim()}
                    </span>
                  )) : <span className="text-slate-400 italic text-sm">No tags available for this asset.</span>}
                </div>
              </section>
            </article>

            {/* ✅ Sidebar Area */}
            <aside className="space-y-6">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200 pb-3">Technical Overview</h3>
                <dl className="space-y-5">
                  {detailRows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-1">
                      <dt className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{row.label}</dt>
                      <dd className="text-sm font-bold text-slate-800 break-all">
                        {row.label.includes('Site') ? (
                          <a href={row.value} target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                            {row.value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        ) : row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Link 
                href={`/${locale}/glossary`} 
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
              >
                ← Return to Glossary
              </Link>
            </aside>

          </div>
        </div>
      </div>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}