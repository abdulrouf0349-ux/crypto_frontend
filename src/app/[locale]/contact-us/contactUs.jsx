'use client';
// app/[locale]/contact/ContactPage.jsx ← CLIENT COMPONENT
import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiMessageSquare, FiSend, FiAlertCircle } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';

export default function ContactPage() {
  const { dict, locale } = useLocale();
  const t = dict?.contact_page || {};

  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const contactOptions = [
    {
      icon:  <FiMail size={22} aria-hidden="true" />,
      title: t.opt1_title || 'General Inquiries',
      desc:  t.opt1_desc  || 'Questions about the platform, partnerships, or media requests.',
      value: 'cryptonews@support.com',
    },
    {
      icon:  <FiAlertCircle size={22} aria-hidden="true" />,
      title: t.opt2_title || 'Copyright & Takedowns',
      desc:  t.opt2_desc  || 'Report content that violates your copyright or intellectual property.',
      value: 'copyright@cryptonews.com',
    },
    {
      icon:  <FiMessageSquare size={22} aria-hidden="true" />,
      title: t.opt3_title || 'Support & Bugs',
      desc:  t.opt3_desc  || 'Found a bug or need help with the platform? Let us know.',
      value: 'support@cryptonews.com',
    },
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ── Breadcrumb ── */}
      <nav
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-sm text-slate-500 flex items-center gap-2"
        aria-label="Breadcrumb"
      >
        <Link href={`/${locale}`} className="hover:text-indigo-600 transition-colors">
          {dict?.home || 'Home'}
        </Link>
        <span aria-hidden="true">&rsaquo;</span>
        <span className="text-slate-400" aria-current="page">
          {dict?.contact || 'Contact'}
        </span>
      </nav>

      {/* ── Hero ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 py-16 md:py-20"
        aria-labelledby="contact-hero-heading"
      >
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-10 md:p-16 text-white">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-orange-500 rounded-full opacity-10 blur-2xl pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6">
              {t.hero_badge}
            </span>
            <h1
              id="contact-hero-heading"
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
            >
              {t.hero_title_1}<br />
              <span className="text-indigo-400">{t.hero_title_2}</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">{t.hero_desc}</p>
          </div>
        </div>
      </section>

      {/* ── Contact Options ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 mb-16"
        aria-labelledby="contact-options-heading"
      >
        <h2 id="contact-options-heading" className="sr-only">Contact Options</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 list-none p-0">
          {contactOptions.map((opt) => (
            <li
              key={opt.title}
              className="border border-slate-100 rounded-2xl p-7 hover:border-indigo-200 hover:shadow-lg transition-all group"
            >
              <div
                className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                aria-hidden="true"
              >
                {opt.icon}
              </div>
              <h3 className="font-black text-base mb-2">{opt.title}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{opt.desc}</p>
              <a
                href={`mailto:${opt.value}`}
                className="text-indigo-600 text-sm font-black hover:underline"
                aria-label={`Email ${opt.title}: ${opt.value}`}
              >
                {opt.value}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Contact Form ── */}
      <section
        className="max-w-[1400px] mx-auto px-4 lg:px-28 pb-24"
        aria-labelledby="contact-form-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="contact-form-heading"
              className="text-3xl font-black tracking-tight mb-3"
            >
              {t.form_title}
            </h2>
            <p className="text-slate-500 text-sm">{t.form_subtitle}</p>
          </div>

          {sent ? (
            <div
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center"
              role="alert"
              aria-live="polite"
            >
              <div className="text-5xl mb-4" aria-hidden="true">✅</div>
              <h3 className="text-xl font-black mb-2 text-emerald-700">{t.success_title}</h3>
              <p className="text-slate-500 text-sm">{t.success_desc}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-label="Contact form"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider"
                  >
                    {t.label_name}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.placeholder_name}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider"
                  >
                    {t.label_email}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t.placeholder_email}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider"
                >
                  {t.label_subject}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t.placeholder_subject}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-wider"
                >
                  {t.label_message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.placeholder_message}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={loading ? t.btn_sending : t.btn_send}
              >
                {loading ? (
                  <span className="animate-pulse">{t.btn_sending}</span>
                ) : (
                  <><FiSend size={16} aria-hidden="true" />{t.btn_send}</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}