"use client";
import React, { useState } from "react";
import { Heart, Copy, Check, Mail, Terminal, Wallet, Sparkles } from "lucide-react";

const WALLET_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const SUPPORT_EMAIL = "abdulrouf@cryptonews.com"; 

export default function DonateBanner({ dict, locale }) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(false);

  const copyToClipboard = async (text, setStatus) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(true);
      setTimeout(() => setStatus(false), 2000);
    } catch (err) { console.error("Copy failed"); }
  };

  // ✅ Mobile par HIDDEN — sirf desktop (md+) par dikhega
  return (
    <div className="hidden md:block w-full mt-6 mb-6 px-1 max-w-[500px] mx-auto">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-[1px] flex-1 bg-slate-100/50"></div>
        <h2 className="text-[10px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
          {dict?.banner?.support || "Support Us"}
        </h2>
        <div className="h-[1px] flex-1 bg-slate-100/50"></div>
      </div>

      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-6 md:p-5 text-white shadow-2xl border border-white/5">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/15 blur-[50px] rounded-full -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          {/* Top Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest">{dict?.banner?.help_badge || "Help"}</span>
            </div>
            <Heart className={`w-5 h-5 transition-all duration-500 ${copyFeedback || emailFeedback ? 'text-red-500 fill-red-500 scale-125 animate-pulse' : 'text-slate-700'}`} />
          </div>

          {/* Text Content */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-[20px] font-black !text-white mb-2 tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              {dict?.banner?.donate || "Donate"}
            </h3>
            <p className="text-[13px] md:text-[12px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              {dict?.banner?.donate_disc || "Support our community"}
            </p>
          </div>

          <div className="space-y-6 md:space-y-10">
            {/* Wallet Section */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet className="w-3 h-3" /> ERC20 Address
                </label>
                {copyFeedback && <span className="text-[10px] text-emerald-400 font-black uppercase animate-bounce">Copied!</span>}
              </div>
              <div 
                onClick={() => copyToClipboard(WALLET_ADDRESS, setCopyFeedback)}
                className="group/box flex flex-col gap-2 bg-white/[0.04] border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.07] transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-center">
                   <span className="text-[9px] text-slate-500 font-bold uppercase">{dict?.banner?.tap_to_copy}</span>
                   <Copy className="w-4 h-4 text-slate-500 group-hover/box:text-indigo-400" />
                </div>
                <code className="text-[11px] md:text-[10px] font-mono text-indigo-200 break-all leading-tight bg-black/20 p-2 rounded-lg">
                  {WALLET_ADDRESS}
                </code>
              </div>
            </div>

            {/* Email Section */}
            <div className="group">
              <div 
                onClick={() => copyToClipboard(SUPPORT_EMAIL, setEmailFeedback)}
                className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-blue-500/50 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/15 rounded-xl">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[13px] md:text-[11px] text-slate-200 font-bold">{SUPPORT_EMAIL}</span>
                </div>
                {emailFeedback ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <p className="text-[10px] md:text-[9px] italic mt-8 text-slate-500 text-center border-t border-white/5 pt-4 font-medium">
            "{dict?.banner?.thanks || "Thank you for your support!"}"
          </p>
        </div>
      </div>
    </div>
  );
}