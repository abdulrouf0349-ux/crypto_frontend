'use client';
// app/[locale]/coin-glossary/[slug]/CoinSlugClient.jsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FiGlobe, FiCode, FiExternalLink,
  FiTwitter, FiMessageCircle, FiBookOpen,
  FiSend, FiMessageSquare,
} from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';
import { fetchCoinDetail } from '../../../../../apis/cryptowhales';
import { notFound } from 'next/navigation';
import MobileSupportButton from '../../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../../components/Data/CoinAnalysisFloat';
const LINK_ICONS = {
  website:    <FiGlobe />,
  explorer:   <FiExternalLink />,
  twitter:    <FiTwitter />,
  github:     <FiCode />,
  telegram:   <FiSend />,
  discord:    <FiMessageSquare />,
  reddit:     <FiMessageCircle />,
  whitepaper: <FiBookOpen />,
};

const LINK_LABELS = {
  website:    'Website',
  explorer:   'Explorer',
  twitter:    'Twitter / X',
  github:     'Source Code',
  telegram:   'Telegram',
  discord:    'Discord',
  reddit:     'Reddit',
  whitepaper: 'Whitepaper',
};

export default function CoinSlugClient({ slug, locale, initialCoin }) {
  const {  dict } = useLocale();

  const [coin, setCoin]       = useState(initialCoin || null);
  const [loading, setLoading] = useState(false);

  // Pehli render track karne ke liye — server data use karo, locale change pe refetch
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!slug) return;

    // Pehli render: server ne initialCoin diya tha toh skip karo
    if (isFirstRender.current && initialCoin) {
      isFirstRender.current = false;
      setCoin(initialCoin);
      return;
    }
    isFirstRender.current = false;

    // Locale ya slug change hone pe fresh fetch
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
        if (isMounted) {
          console.error('Error fetching coin:', error);
          setLoading(false);
        }
      }
    };

    getCoinData();
    return () => { isMounted = false; };
  }, [slug, locale]); // ✅ locale change = fresh fetch

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold animate-pulse text-slate-400">Loading...</p>
    </div>
  );
  if (!coin) return notFound();

  if (!coin) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400">Coin not found.</p>
    </div>
  );

  const logo        = coin.icon_url || coin.logo || null;
  const accentColor = coin.color || null;

  const tags = Array.isArray(coin.tags)
    ? coin.tags
    : typeof coin.tags === 'string'
      ? coin.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

  const primaryType = tags.includes('coin')
    ? 'coin'
    : tags.includes('token') || tags.includes('erc-20') || tags.includes('bep-20')
      ? 'token'
      : tags[0] || null;

  const resolvedLinks = (() => {
    if (Array.isArray(coin.links_full) && coin.links_full.length > 0) {
      return coin.links_full
        .filter(l => l.url)
        .map(l => ({
          icon:  LINK_ICONS[l.type] || <FiExternalLink />,
          label: LINK_LABELS[l.type] || l.name || l.type,
          href:  l.url,
          type:  l.type,
        }));
    }
    const linksObj = coin.links || {};
    return [
      { type: 'website',    href: linksObj.website    || coin.website_url },
      { type: 'explorer',   href: linksObj.explorer },
      { type: 'twitter',    href: linksObj.twitter },
      { type: 'github',     href: linksObj.github },
      { type: 'telegram',   href: linksObj.telegram },
      { type: 'reddit',     href: linksObj.reddit },
      { type: 'whitepaper', href: linksObj.whitepaper },
    ]
      .filter(l => l.href)
      .map(l => ({
        icon:  LINK_ICONS[l.type] || <FiExternalLink />,
        label: LINK_LABELS[l.type] || l.type,
        href:  l.href,
        type:  l.type,
      }));
  })();

  const whitepaperLink =
    coin.links?.whitepaper ||
    resolvedLinks.find(l => l.type === 'whitepaper')?.href ||
    null;

  const detailRows = [
    { label: 'Symbol',       value: coin.symbol?.toUpperCase() },
    { label: 'Rank',         value: coin.rank ? `#${coin.rank}` : null },
    { label: 'Website',      value: coin.website_url || coin.links?.website || null },
    { label: 'Added',        value: coin.created_at ? coin.created_at.slice(0, 10) : null },
    { label: 'Last Updated', value: coin.updated_at ? coin.updated_at.slice(0, 10) : null },
  ].filter(r => r.value);

  const quickStats = [
    coin.rank          && { icon: '🏆', text: `Rank #${coin.rank}` },
    coin.website_url   && { icon: '🌐', text: 'Has Website' },
    coin.links?.github && { icon: '💻', text: 'Open Source' },
    tags.includes('liquid-staking') && { icon: '🔒', text: 'Liquid Staking' },
    tags.includes('defi')           && { icon: '⚡', text: 'DeFi' },
  ].filter(Boolean);

  return (
    <>
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      <nav
        className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2 flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">
          {dict?.home || 'Home'}
        </Link>
        <span aria-hidden="true">&rsaquo;</span>
        <Link href={`/${locale}/coin-glossary`} className="hover:text-indigo-600 transition-colors">
          {dict?.coin_glossary || 'Coin Glossary'}
        </Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">{coin.name}</span>
      </nav>

      <header
        className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-10 border-b border-slate-100"
        style={accentColor ? { borderBottomColor: `${accentColor}40` } : {}}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0"
            style={accentColor ? { borderColor: `${accentColor}50` } : {}}
          >
            {logo ? (
              <img
                src={logo}
                alt={`${coin.name} logo`}
                width={80}
                height={80}
                className="w-full h-full object-contain p-1"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-black text-2xl"
                style={{ color: accentColor || '#cbd5e1', background: accentColor ? `${accentColor}18` : undefined }}
                aria-hidden="true"
              >
                {coin.symbol?.slice(0, 2)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{coin.name}</h1>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-black rounded-full">
                {coin.symbol?.toUpperCase()}
              </span>
              {coin.rank > 0 && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-full">
                  Rank #{coin.rank}
                </span>
              )}
              {primaryType && (
                <span
                  className={`px-3 py-1 text-xs font-black rounded-full uppercase ${
                    primaryType === 'coin'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}
                  style={
                    !['coin', 'token'].includes(primaryType) && accentColor
                      ? { background: `${accentColor}18`, color: accentColor }
                      : {}
                  }
                >
                  {primaryType}
                </span>
              )}
            </div>
            {quickStats.length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-semibold">
                {quickStats.map((s, i) => (
                  <span key={i}>{s.icon} {s.text}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 max-sm:px-3 lg:px-28 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-10">
            {coin.description && (
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-xl font-black mb-4 flex items-center gap-3">
                  <span
                    className="w-1.5 h-6 rounded-full inline-block"
                    style={{ background: accentColor || '#4f46e5' }}
                    aria-hidden="true"
                  />
                  About {coin.name}
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm">{coin.description}</p>
              </section>
            )}

            {tags.length > 0 && (
              <section aria-labelledby="tags-heading">
                <h2 id="tags-heading" className="text-xl font-black mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange-400 rounded-full inline-block" aria-hidden="true" />
                  Tags &amp; Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {whitepaperLink && (
              <section aria-labelledby="whitepaper-heading">
                <h2 id="whitepaper-heading" className="text-xl font-black mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" aria-hidden="true" />
                  Whitepaper
                </h2>
                <a
                  href={whitepaperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-black text-sm rounded-xl hover:bg-indigo-600 transition-all"
                  aria-label={`Read ${coin.name} whitepaper (opens in new tab)`}
                >
                  <FiBookOpen aria-hidden="true" />
                  Read Whitepaper
                  <FiExternalLink size={12} aria-hidden="true" />
                </a>
              </section>
            )}
          </div>

          <aside aria-label="Coin details sidebar" className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-5">Details</h3>
              <dl className="space-y-4">
                {detailRows.map((row) => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <dt className="text-xs text-slate-500 font-semibold flex-shrink-0">{row.label}</dt>
                    <dd className="text-xs font-black text-slate-800 text-right break-all">
                      {row.label === 'Website' ? (
                        <a href={row.value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {row.value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      ) : row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {resolvedLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-5">Official Links</h3>
                <nav aria-label="Coin official links" className="space-y-2">
                  {resolvedLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-sm font-bold text-slate-700 hover:text-indigo-600"
                      aria-label={`${link.label} (opens in new tab)`}
                    >
                      <span className="text-indigo-500 group-hover:text-indigo-600" aria-hidden="true">{link.icon}</span>
                      {link.label}
                      <FiExternalLink size={11} className="ml-auto text-slate-300 group-hover:text-indigo-400" aria-hidden="true" />
                    </a>
                  ))}
                </nav>
              </div>
            )}

            <Link
              href={`/${locale}/coin-glossary`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              aria-label="Back to Coin Glossary"
            >
              ← Back to Glossary
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