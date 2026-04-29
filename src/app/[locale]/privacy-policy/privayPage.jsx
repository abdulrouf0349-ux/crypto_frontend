'use client';
// app/[locale]/privacy-policy/PrivacyPolicyPage.jsx  ← CLIENT COMPONENT
import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function PrivacyPolicyPage() {
  const { dict, locale } = useLocale();
  const t = dict?.privacy_page || {};
  const [activeSection, setActiveSection] = useState('information');

  const sections = [
    { id: 'information', title: t.s1_title,  content: t.s1_content  },
    { id: 'usage',       title: t.s2_title,  content: t.s2_content  },
    { id: 'cookies',     title: t.s3_title,  content: t.s3_content  },
    { id: 'thirdparty',  title: t.s4_title,  content: t.s4_content  },
    { id: 'copyright',   title: t.s5_title,  content: t.s5_content  },
    { id: 'rights',      title: t.s6_title,  content: t.s6_content  },
    { id: 'security',    title: t.s7_title,  content: t.s7_content  },
    { id: 'children',    title: t.s8_title,  content: t.s8_content  },
    { id: 'changes',     title: t.s9_title,  content: t.s9_content  },
    { id: 'contact',     title: t.s10_title, content: t.s10_content },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ── Breadcrumb ── */}
      <nav
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2"
        aria-label="Breadcrumb"
      >
        <Link href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-indigo-600 transition-colors">
          {dict?.home || 'Home'}
        </Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">
          {dict?.policies?.privacy_policy || 'Privacy Policy'}
        </span>
      </nav>

      {/* ── Hero ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-14 md:py-20 border-b border-slate-100"
        aria-labelledby="privacy-hero-heading"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-full mb-5">
              {t.hero_badge}
            </span>
            <h1
              id="privacy-hero-heading"
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
            >
              {t.hero_title}
            </h1>
            <p className="text-slate-500 max-w-xl leading-relaxed">{t.hero_desc}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 font-semibold">{t.last_updated_label}</p>
            <time className="text-slate-700 font-black">{t.last_updated_date}</time>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-28 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sticky TOC Sidebar */}
          <aside className="hidden lg:block" aria-label="Table of contents">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                {t.toc_label}
              </p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  aria-current={activeSection === s.id ? 'true' : undefined}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === s.id
                      ? 'bg-indigo-50 text-indigo-600 font-black'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {s.title?.replace(/^\d+\.\s/, '')}
                </button>
              ))}
            </nav>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-3 space-y-12" aria-label="Privacy policy content">

            {/* TL;DR */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-7" role="note">
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong className="text-indigo-700">TL;DR: </strong>
                {t.tldr}
              </p>
            </div>

            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`heading-${s.id}`}
                className="scroll-mt-24"
                onMouseEnter={() => setActiveSection(s.id)}
              >
                <h2
                  id={`heading-${s.id}`}
                  className="text-xl md:text-2xl font-black tracking-tight mb-5 flex items-center gap-3"
                >
                  <span className="w-1.5 h-7 bg-indigo-600 rounded-full inline-block" aria-hidden="true" />
                  {s.title}
                </h2>
                <div className="pl-5 border-l border-slate-100">
                  {s.content?.split('\n').map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    if (line.startsWith('•')) {
                      return (
                        <div key={i} className="flex items-start gap-3 mb-2">
                          <span className="text-indigo-500 font-black mt-0.5" aria-hidden="true">•</span>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {line.replace('•', '').trim()}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={i} className="text-slate-600 text-sm leading-relaxed mb-2">{line}</p>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Bottom CTA */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-black mb-3">{t.cta_title}</h3>
              <p className="text-slate-400 text-sm mb-6">{t.cta_desc}</p>
              <Link
                href={locale === 'en' ? '/contact-us' : `/${locale}/contact-us`}

                className="inline-block px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all"
              >
                {t.cta_btn}
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}