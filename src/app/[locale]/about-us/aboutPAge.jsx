'use client';
// app/[locale]/about/AboutPage.jsx  ← CLIENT COMPONENT
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

export default function AboutPage() {
  const { dict, locale } = useLocale();
  const t = dict?.about_page || {};

  const stats = [
    { value: '50K+',  label: t.stat_readers   || 'Daily Readers' },
    { value: '12+',   label: t.stat_languages || 'Languages' },
    { value: '200+',  label: t.stat_news      || 'News Daily' },
    { value: '99.9%', label: t.stat_uptime    || 'Uptime' },
  ];

  const values = [
    { icon: '⚡', title: t.val1_title, desc: t.val1_desc },
    { icon: '🌐', title: t.val2_title, desc: t.val2_desc },
    { icon: '🎓', title: t.val3_title, desc: t.val3_desc },
    { icon: '🔒', title: t.val4_title, desc: t.val4_desc },
  ];

  return (
    <>
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
          {dict?.about?.title || 'About Us'}
        </span>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative max-w-[1400px] mx-auto px-4 lg:px-28 py-20 md:py-28 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full blur-2xl opacity-50 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-6">
            {t.hero_badge}
          </span>
          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6"
          >
            {t.hero_title_1}<br />
            <span className="text-indigo-600">{t.hero_title_2}</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">{t.hero_desc}</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-slate-900 py-14" aria-label="Platform statistics">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-28">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-slate-400 text-sm font-semibold uppercase tracking-widest order-last mt-2">
                  {s.label}
                </dt>
                <dd className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Mission ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-20 md:py-28"
        aria-labelledby="mission-heading"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-500 text-xs font-black uppercase tracking-widest rounded-full mb-6">
              {t.mission_badge}
            </span>
            <h2
              id="mission-heading"
              className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight"
            >
              {t.mission_title}
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">{t.mission_desc1}</p>
            <p className="text-slate-500 leading-relaxed">{t.mission_desc2}</p>
          </div>
          <div className="relative">
            <figure className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-200">
              <blockquote>
                <p className="text-2xl font-black leading-snug mb-6">{t.quote}</p>
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl" aria-hidden="true">
                  👨‍💻
                </div>
                <div>
                  <p className="font-black">{t.quote_author}</p>
                  <p className="text-indigo-200 text-sm">{t.quote_role}</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="bg-slate-50 py-20"
        aria-labelledby="values-heading"
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-28">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-4">
              {t.values_badge}
            </span>
            <h2
              id="values-heading"
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              {t.values_title}
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
            {values.map((v) => (
              <li
                key={v.title}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all group"
              >
                <div className="text-4xl mb-5" aria-hidden="true">{v.icon}</div>
                <h3 className="font-black text-lg mb-3 group-hover:text-indigo-600 transition-colors">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-20 text-center"
        aria-labelledby="cta-heading"
      >
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl font-black tracking-tight mb-4"
        >
          {t.cta_title}
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">{t.cta_desc}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={locale === 'en' ? '/contact-us' : `/${locale}/contact-us`}
            className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            {t.cta_btn1}
          </Link>
          <Link
            href={locale === 'en' ? '/' : `/${locale}`}
            className="px-8 py-3.5 bg-slate-100 text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all"
          >
            {t.cta_btn2}
          </Link>
        </div>
      </section>

    </div>
        <MobileSupportButton dict={dict} />
            <CoinAnalysisFloat locale={locale} />  
    </>
  
  );
}