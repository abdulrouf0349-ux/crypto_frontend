import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { SupportUsFloat } from "@/components/SupportUsFloat";
import "../index.css";

export const metadata: Metadata = {
  title: {
    template: "%s | CryptoNewsTrend",
    default: "CryptoNewsTrend — Crypto News, Analysis & Market Trends",
  },
  description:
    "Your trusted source for crypto news, market analysis, whale tracking, ICO launches, and blockchain updates.",
  keywords: ["crypto", "bitcoin", "ethereum", "blockchain", "defi", "nft", "ico", "altcoin"],
  openGraph: {
    siteName: "CryptoNewsTrend",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cryptonewstrend",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <PriceTicker />
            <main className="flex-grow">{children}</main>
            <Footer />
            <SupportUsFloat />
          </div>
        </Providers>
      </body>
    </html>
  );
}
