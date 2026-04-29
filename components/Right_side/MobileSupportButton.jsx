"use client";
import React, { useState } from "react";
import { Heart, Copy, Check, Send, Wallet, X, Sparkles } from "lucide-react";

const WALLET_ADDRESS = "0x6aA99810cF60580621954F61108de33ad5422593";
const SUPPORT_EMAIL = "@cryptonewstrendhub";

export default function MobileSupportButton({ dict }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyWallet, setCopyWallet] = useState(false);
  const [copyEmail, setCopyEmail] = useState(false);

  const copyToClipboard = async (text, setStatus) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(true);
      setTimeout(() => setStatus(false), 2000);
    } catch (err) {
      console.error("Copy failed");
    }
  };

  return (
    <>
      {/* ✅ Floating Button — sirf mobile par dikhega (md:hidden) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl border border-white/10 active:scale-95 transition-all md:hidden"
        style={{ boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
      >
        <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
          {dict?.banner?.support || "Support"}
        </span>
      </button>

      {/* ✅ Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-end justify-center md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Card — click propagation rok */}
          <div
            className="w-full max-w-md bg-slate-900 rounded-t-[2rem] p-6 pb-10 border border-white/10 relative overflow-hidden"
            style={{
              animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
              boxShadow: "0 -20px 60px rgba(99,102,241,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none" />

            {/* Drag Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-all"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xl font-black !text-white tracking-tight">
                  {dict?.banner?.donate || "Please Support Us"}
                </h3>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed max-w-[260px] mx-auto">
                {dict?.banner?.donate_disc || "Your support keeps us going. Thank you! 🙏"}
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Wallet Copy */}
              <div>
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5 mb-2 px-1">
                  <Wallet className="w-3 h-3" /> ERC20 Address
                </label>
                <div
                  onClick={() => copyToClipboard(WALLET_ADDRESS, setCopyWallet)}
                  className="flex flex-col gap-2 bg-white/[0.04] border border-white/10 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
                  style={{ borderColor: copyWallet ? "rgba(99,102,241,0.6)" : undefined }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-blue-500 font-bold uppercase">
                      {dict?.banner?.tap_to_copy || "Tap to copy"}
                    </span>
                    {copyWallet ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <code className="text-[10px] font-mono text-indigo-200 break-all leading-tight bg-black/20 p-2 rounded-lg">
                    {WALLET_ADDRESS}
                  </code>
                  {copyWallet && (
                    <span className="text-[10px] text-emerald-400 font-black uppercase text-center animate-bounce">
                      ✓ Copied!
                    </span>
                  )}
                </div>
                    <label className="text-[10px] mt-5 md:text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                  <Send className="w-3 h-3" /> Telegram
                                </label>
              </div>

              {/* Email Copy */}
              <div
                onClick={() => copyToClipboard(SUPPORT_EMAIL, setCopyEmail)}
                className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
                style={{ borderColor: copyEmail ? "rgba(59,130,246,0.6)" : undefined }}
              >
            
                              
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/15 rounded-xl">
                    <Send className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[12px] !text-blue-500  font-bold">{SUPPORT_EMAIL}</span>
                  
                </div>
                {copyEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-3 rounded-2xl border border-white/10 text-slate-400 text-[12px] font-black uppercase tracking-widest active:scale-[0.98] transition-all bg-white/[0.03] relative z-10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}