"use client";
import { Flame, Twitter, Send, Disc } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-[#0d1117] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-white">Crypto</span>
                <span className="text-orange-500">NewsTrend</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 font-display">{t("footer.news")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-purple-400 transition-colors">{t("footer.news")}</Link></li>
              <li><Link href="/" className="hover:text-purple-400 transition-colors">{t("home.marketUpdate")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 font-display">{t("footer.tools")}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/crypto-whales" className="hover:text-purple-400 transition-colors">{t("nav.whalesTracking")}</Link></li>
              <li><Link href="/coin-analysis" className="hover:text-purple-400 transition-colors">{t("nav.coinAnalysis")}</Link></li>
              <li><Link href="/ico" className="hover:text-purple-400 transition-colors">{t("nav.ico")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 font-display">{t("footer.community")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Disc className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-white">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
