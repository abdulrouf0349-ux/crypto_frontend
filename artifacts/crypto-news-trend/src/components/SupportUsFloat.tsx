"use client";
import { useState } from "react";
import { Copy, Check, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export function SupportUsFloat() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 lg:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="w-72 rounded-2xl bg-[#161b22] border border-gray-700 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            <div className="p-5 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <h3 className="font-display font-bold text-base text-white">
                  {t("donate.title")}
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t("donate.description")}
              </p>
              <div className="bg-black/60 border border-gray-700 rounded-lg p-3 flex items-center gap-2">
                <span className="text-[11px] text-gray-300 font-mono truncate flex-1">
                  0x1234567890abcdef...12345678
                </span>
                <button
                  onClick={copyAddress}
                  className="shrink-0 text-gray-400 hover:text-white transition-colors"
                  aria-label="Copy address"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-green-400" />
                    : <Copy className="w-4 h-4" />
                  }
                </button>
              </div>
              {copied && (
                <p className="text-[11px] text-green-400 font-mono mt-2">
                  {t("donate.copied")}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-pink-400 transition-all"
        aria-label="Support Us"
      >
        <Heart className="w-4 h-4 fill-white" />
        {!open && <span>{t("donate.title")}</span>}
        {open && <X className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
