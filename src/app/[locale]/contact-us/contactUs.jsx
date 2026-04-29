'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiMessageSquare, FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';
import MobileSupportButton from '../../../../components/Right_side/MobileSupportButton';
import CoinAnalysisFloat from '../../../../components/Data/CoinAnalysisFloat';

export default function ContactPage() {
  const { dict, locale } = useLocale();
  const t = dict?.contact_page || {};

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your API call here
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Breadcrumb */}
        <nav className="max-w-[1400px] mx-auto px-4 lg:px-28 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Link href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-indigo-600 transition-colors">{dict?.home || 'Home'}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">{dict?.contact || 'Contact'}</span>
        </nav>

        {/* Hero */}
        <header className="max-w-[1400px] mx-auto px-4 lg:px-28 py-12 md:py-20">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                {t.hero_badge || "Connect"}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
                {t.hero_title_1 || "Get in touch"}<br />
                <span className="text-indigo-400">{t.hero_title_2 || "with us."}</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                {t.hero_desc || "We are here to help you with any questions about Whale Tracking or Platform Support."}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none" />
          </div>
        </header>

        {/* Form Section */}
        <section className="max-w-[1400px] mx-auto px-4 lg:px-28 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-black mb-8 tracking-tight">{t.form_title || "Send us a message"}</h2>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center">
                <FiCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4" />
                <h3 className="text-emerald-900 font-black text-xl mb-2">Message Sent!</h3>
                <p className="text-emerald-700 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-emerald-600 font-bold text-sm underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="name" onChange={handleChange} placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm" />
                  <input required name="email" type="email" onChange={handleChange} placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm" />
                </div>
                <input required name="subject" onChange={handleChange} placeholder="Subject" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm" />
                <textarea required name="message" rows="5" onChange={handleChange} placeholder="Your Message..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm resize-none"></textarea>
                <button disabled={loading} className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {loading ? "Sending..." : <>{t.submit_btn || "Send Message"} <FiSend /></>}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <FiAlertCircle className="text-indigo-600 text-2xl mb-4" />
                <h3 className="font-black text-lg mb-2">{t.opt2_title || "Copyright & Takedowns"}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{t.opt2_desc || "Report content that violates your intellectual property."}</p>
                <a href="mailto:support@cryptonewstrend.com" className="text-indigo-600 font-black text-sm hover:underline">support@cryptonewstrend.com</a>
             </div>
             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <FiMessageSquare className="text-indigo-600 text-2xl mb-4" />
                <h3 className="font-black text-lg mb-2">{t.opt3_title || "Support & Bugs"}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{t.opt3_desc || "Technical issues or platform feedback."}</p>
                <span className="text-indigo-600 font-black text-sm">@cryptonewstrendhub (Telegram)</span>
             </div>
          </div>
        </section>
      </div>

      <MobileSupportButton dict={dict} />
      <CoinAnalysisFloat locale={locale} />
    </>
  );
}