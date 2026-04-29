'use client';
// app/[locale]/ico/[slug]/ICODetailsPage.jsx  →  CLIENT COMPONENT
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowLeft, FiGlobe, FiTwitter, FiFileText,
  FiMessageCircle, FiSend, FiExternalLink,
} from 'react-icons/fi';
import { fetchIcoBySlug } from '../../../../../apis/page_news/events';
import { notFound } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../../components/Data/CoinAnalysisFloat';

const ICODetailsPage = ({initialData}) => {
  const { locale, slug } = useParams();
    const {  dict } = useLocale();
  
  const router           = useRouter();
  const [project, setProject] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchIcoBySlug(slug, locale);
        if (res.success) setProject(res.data);
      } catch (err) {
        console.error('ICO detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug, locale]);
  if (!project) return notFound();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold animate-pulse text-indigo-600 uppercase tracking-widest">
        Loading Project...
      </p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400 font-bold">Project not found.</p>
    </div>
  );

  const p = project;

  /* screenshots are objects: { src, name, type } */
  const screenshotList = Array.isArray(p.screenshots)
    ? p.screenshots.filter(s => s?.src)
    : [];

  /* overview_data: { total_raised, pre_valuation, rounds_count, last_updated } */
  const ov = p.overview_data || {};

  return (
    <>
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── Sticky Top Bar ───────────────────────────────────────── */}
      <div className="border-b sticky top-0 bg-white z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors"
          >
            <FiArrowLeft /> Back
          </button>

          {/* Quick social links */}
          <div className="flex items-center gap-2">
            {p.website && (
              <a href={p.website} target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Website">
                <FiGlobe size={18} className="text-slate-500" />
              </a>
            )}
            {p.twitter && (
              <a href={p.twitter} target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Twitter">
                <FiTwitter size={18} className="text-sky-500" />
              </a>
            )}
            {p.discord && (
              <a href={p.discord} target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Discord">
                <FiMessageCircle size={18} className="text-indigo-500" />
              </a>
            )}
            {p.telegram && (
              <a href={p.telegram} target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Telegram">
                <FiSend size={18} className="text-sky-400" />
              </a>
            )}
            {p.whitepaper && (
              <a href={p.whitepaper} target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Whitepaper">
                <FiFileText size={18} className="text-slate-500" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-6xl mx-auto px-4 py-3 text-xs text-slate-400 flex items-center gap-2"
      >
        <Link href={`/${locale}`} className="hover:text-indigo-600">{dict.header.news}</Link>
        <span aria-hidden="true">&rsaquo;</span>
        <Link href={`/${locale}/ico`} className="hover:text-indigo-600">{dict.launchpad.ico_title}</Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-600" aria-current="page">{p.name}</span>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Project Header */}
            <div className="flex items-start gap-6">
              {p.main_img && (
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
  src={p.main_img}
  alt={`${p.name} (${p.ticker}) ICO Token Sale Details`} // Descriptive alt tag
  fill
  className="rounded-2xl shadow-lg object-contain"
  unoptimized
/>
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black">{p.name}</h1>
                  {p.ticker && (
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                      {p.ticker}
                    </span>
                  )}
                  {/* Status badge */}
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    p.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : p.status === 'upcoming'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {p.status_time || p.status}
                  </span>
                </div>
                {p.project_type && (
                  <p className="text-slate-400 text-sm mb-1">{p.project_type}</p>
                )}
                {p.category_name && (
                  <p className="text-indigo-600 font-semibold text-sm">{p.category_name}</p>
                )}
              </div>
            </div>

            {/* About */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-bold mb-4">{dict.launchpad.about}</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {p.description || 'No description available.'}
              </p>
            </section>

            {/* Screenshots */}
            {screenshotList.length > 0 && (
              <section aria-labelledby="screenshots-heading">
                <h2 id="screenshots-heading" className="text-xl font-bold mb-4">Screenshots</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {screenshotList.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0">
                      <img
                        src={img.src}
                        alt={img.name || `Screenshot ${idx + 1}`}
                        className="h-48 rounded-xl border border-slate-100 object-cover shadow-sm"
                      />
                      {img.name && (
                        <p className="text-[10px] text-slate-400 mt-1 text-center">{img.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rounds Table */}
            {p.rounds_data?.length > 0 && (
              <section aria-labelledby="rounds-heading">
                <h2 id="rounds-heading" className="text-xl font-bold mb-4">{dict.launchpad.funding}</h2>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3 font-bold text-slate-500">Round</th>
                        <th className="px-5 py-3 font-bold text-slate-500">Type</th>
                        <th className="px-5 py-3 font-bold text-slate-500">Status / Date</th>
                        <th className="px-5 py-3 font-bold text-slate-500">Tokens</th>
                        <th className="px-5 py-3 font-bold text-slate-500">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {p.rounds_data.map((round, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-semibold">{round.name || '—'}</td>
                          <td className="px-5 py-4 text-slate-500">{round.type || '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                              round.status?.toLowerCase() === 'active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : round.status?.toLowerCase() === 'upcoming'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {round.status}
                            </span>
                            {round.date && round.date !== 'N/A' && (
                              <p className="text-[10px] text-slate-400 mt-1">{round.date}</p>
                            )}
                            {round.days_left && round.days_left !== 'N/A' && (
                              <p className="text-[10px] text-indigo-500 font-bold">{round.days_left}</p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-slate-600 text-xs">
                            {round.tokens && round.tokens !== 'N/A' ? round.tokens : '—'}
                          </td>
                          <td className="px-5 py-4">
                            {round.platform && round.platform !== 'N/A' ? (
                              round.platform_url && round.platform_url !== 'N/A' ? (
                                <a
                                  href={round.platform_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline text-xs font-semibold flex items-center gap-1"
                                >
                                  {round.platform} <FiExternalLink size={10} />
                                </a>
                              ) : (
                                <span className="text-xs text-slate-500">{round.platform}</span>
                              )
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Round descriptions */}
                <div className="mt-6 space-y-4">
                  {p.rounds_data
                    .filter(r => r.description && r.description !== 'N/A')
                    .map((round, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-indigo-600 mb-1">{round.name}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{round.description}</p>
                        {round.source_url && round.source_url !== 'N/A' && (
                          <a
                            href={round.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-slate-400 hover:text-indigo-600 mt-2 inline-flex items-center gap-1"
                          >
                            Source <FiExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Investment Stats */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
               {dict.launchpad.stats}
              </h3>
              <div className="space-y-4">

                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Total Raised</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {ov.total_raised && ov.total_raised !== '—' ? ov.total_raised : 'TBA'}
                  </p>
                </div>

                {ov.pre_valuation && ov.pre_valuation !== '—' && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Pre-Valuation</p>
                    <p className="text-xl font-bold text-slate-700">{ov.pre_valuation}</p>
                  </div>
                )}

                {ov.rounds_count && ov.rounds_count !== 'N/A' && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Rounds</p>
                    <p className="text-sm font-semibold text-slate-600">{ov.rounds_count}</p>
                  </div>
                )}

                {ov.last_updated && (
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Last Updated</p>
                    <p className="text-xs text-slate-500">{ov.last_updated}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Links
              </h3>
              <div className="space-y-3">
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                    <FiGlobe size={15} className="flex-shrink-0" /> Website
                  </a>
                )}
                {p.twitter && (
                  <a href={p.twitter} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-500 transition-colors">
                    <FiTwitter size={15} className="flex-shrink-0" /> Twitter / X
                  </a>
                )}
                {p.discord && (
                  <a href={p.discord} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-500 transition-colors">
                    <FiMessageCircle size={15} className="flex-shrink-0" /> Discord
                  </a>
                )}
                {p.telegram && (
                  <a href={p.telegram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-sky-400 transition-colors">
                    <FiSend size={15} className="flex-shrink-0" /> Telegram
                  </a>
                )}
                {p.whitepaper && (
                  <a href={p.whitepaper} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    <FiFileText size={15} className="flex-shrink-0" /> Whitepaper
                  </a>
                )}
                {p.detail_link && (
                  <a href={p.detail_link} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    <FiExternalLink size={15} className="flex-shrink-0" /> View on Source
                  </a>
                )}
              </div>
            </div>

            {/* CTA Button */}
            {p.detail_link && (
              <a
                href={p.detail_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                Join / Whitelist
              </a>
            )}

            {p.whitepaper && p.whitepaper !== 'N/A' && (
              <a
                href={p.whitepaper}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 !text-white rounded-2xl font-black text-sm hover:bg-slate-700 transition-all active:scale-95"
              >
                <FiFileText /> Read Whitepaper
              </a>
            )}

          </aside>
        </div>
      </main>
    </div>
    <MobileSupportButton dict={dict} />
                        <CoinAnalysisFloat locale={locale} />  
                      </>
  );
};

export default ICODetailsPage;