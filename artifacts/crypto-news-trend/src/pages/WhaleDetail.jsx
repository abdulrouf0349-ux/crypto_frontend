"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Activity,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

const SITE_URL = "https://cryptonewstrend.com";

const FILTER_KEYS = {
  TRANSFER: "whales.transfer",
  MINT:     "whales.mint",
  BURN:     "whales.burn",
  ALERT:    "whales.transfer",
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-white transition-colors ml-1">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function WhaleDetail({ tx, locale }) {
  const { t } = useTranslation();
  const currentLocale = locale || "en";
  const isRtl = ["ur", "ar"].includes(currentLocale);
  const backHref = currentLocale === "en" ? "/crypto-whales" : `/${currentLocale}/crypto-whales`;

  if (!tx) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Transaction Not Found</h2>
        <Link href={backHref}>
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Whale Tracker</Button>
        </Link>
      </div>
    );
  }

  // ── Normalize fields ──
  const rawType     = String(tx.tx_card_title || tx.alert_type || "TRANSFER").toUpperCase();
  const txType      = rawType === "ALERT" ? "TRANSFER" : rawType;
  const summary     = tx.translations?.[currentLocale === "zh" ? "zh-cn" : currentLocale]
                      || tx.translations?.en
                      || tx.summary
                      || tx.alert_text
                      || "";
  const blockchain  = tx.blockchain  || "Unknown";
  const amountFull  = tx.amount_full || "";
  const coin        = tx.symbol      || tx.coin   || blockchain;
  const timestamp   = tx.timestamp_utc || tx.alert_timestamp || tx.date_added || "";
  const hash        = tx.transaction_hash || tx.hash || "";
  const txUrl       = tx.transaction_hash_url || tx.url || "";
  const fee         = tx.fee     || "";
  const feeUsd      = tx.fee_usd || "";
  const fromEntity  = tx.sender?.owner  || tx.from_owner || tx.from || "Unknown Wallet";
  const toEntity    = tx.receiver?.owner || tx.to_owner   || tx.to   || "Unknown Wallet";

  // Social links parse
  let socialLinks = {};
  try {
    if (tx.social_links) {
      const cleaned = tx.social_links.replace(/'/g, '"');
      socialLinks = JSON.parse(cleaned);
    }
  } catch {}

  // Card color — same as Whales list
  const getCardColor = (type) => {
    switch (type) {
      case "TRANSFER": return { border: "border-l-yellow-500", badge: "bg-yellow-500/10 text-yellow-500" };
      case "MINT":     return { border: "border-l-green-500",  badge: "bg-green-500/10 text-green-500"  };
      case "BURN":     return { border: "border-l-red-500",    badge: "bg-red-500/10 text-red-500"      };
      default:         return { border: "border-l-gray-500",   badge: "bg-gray-500/10 text-gray-500"    };
    }
  };
  const colors = getCardColor(txType);

  const getRelativeTime = (timeStr) => {
    try { return formatDistanceToNow(new Date(timeStr), { addSuffix: true }); }
    catch { return "recently"; }
  };

  const shortHash = hash ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : "N/A";

  // Related whale links by blockchain
  const relatedLinks = [
    { label: "Latest Bitcoin Whale Alerts",  href: currentLocale === "en" ? "/crypto-whales?chain=BTC" : `/${currentLocale}/crypto-whales?chain=BTC`  },
    { label: "Latest Ethereum Whale Alerts", href: currentLocale === "en" ? "/crypto-whales?chain=ETH" : `/${currentLocale}/crypto-whales?chain=ETH` },
    { label: "Latest Solana Whale Alerts",   href: currentLocale === "en" ? "/crypto-whales?chain=SOL" : `/${currentLocale}/crypto-whales?chain=SOL`   },
  ];

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono">
          <Link href={currentLocale === "en" ? "/" : `/${currentLocale}`} className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={backHref} className="hover:text-foreground transition-colors">
            Whale Tracker
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-yellow-400 font-mono">{shortHash}</span>
        </nav>

        {/* Header Card — same style as list cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card border border-border border-l-4 ${colors.border} rounded-xl overflow-hidden mb-8`}
        >
          {/* Top bar */}
          <div className={`px-6 py-3 text-[11px] font-bold tracking-wider flex justify-between items-center ${colors.badge}`}>
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              {t(FILTER_KEYS[txType] ?? txType)} — {blockchain.toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(timestamp)}
            </span>
          </div>

          <div className="p-6">
            {/* Amount — FIX #2: was <div>, now <h2> for proper heading hierarchy */}
            <div className="mb-6">
              <h2 className="text-4xl font-display font-bold text-foreground mb-1">
                {tx.receiver?.amount || amountFull.split("(")[0]?.trim() || "N/A"}
              </h2>
              <div className="text-xl text-muted-foreground font-mono">
                ≈ {tx.receiver?.amount_usd || tx.sender?.amount_usd || "N/A"}
              </div>
            </div>

            {/* Summary — FIX #5: added whale-summary class for Speakable spec */}
            {summary && (
              <p className={`whale-summary text-base text-muted-foreground leading-relaxed mb-6 p-4 bg-secondary/30 rounded-lg border border-border ${isRtl ? "text-right" : ""}`}>
                {summary}
              </p>
            )}

            {/* From → To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Sender */}
              <Card className="bg-secondary/20 border-border">
                <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    From
                  </p>
                  <p className="font-semibold text-foreground mb-1">
                    {tx.sender?.owner || "Unknown Wallet"}
                  </p>
                  {tx.sender?.address && tx.sender.address !== "N/A" && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {`${tx.sender.address.slice(0, 8)}...${tx.sender.address.slice(-6)}`}
                      </span>
                      <CopyButton text={tx.sender.address} />
                      {tx.sender.address_url && (
                        <a href={tx.sender.address_url} target="_blank" rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors ml-1">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                  {tx.sender?.amount && (
                    <p className="text-xs text-muted-foreground mt-2 font-mono">{tx.sender.amount}</p>
                  )}
                </CardContent>
              </Card>

              {/* Receiver */}
              <Card className="bg-secondary/20 border-border">
                <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    To
                  </p>
                  <p className="font-semibold text-foreground mb-1">
                    {tx.receiver?.owner || "Unknown Wallet"}
                  </p>
                  {tx.receiver?.address && tx.receiver.address !== "N/A" && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {`${tx.receiver.address.slice(0, 8)}...${tx.receiver.address.slice(-6)}`}
                      </span>
                      <CopyButton text={tx.receiver.address} />
                      {tx.receiver.address_url && (
                        <a href={tx.receiver.address_url} target="_blank" rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors ml-1">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                  {tx.receiver?.amount && (
                    <p className="text-xs text-muted-foreground mt-2 font-mono">{tx.receiver.amount}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Arrow divider */}
            <div className="flex justify-center my-2 mb-6">
              <div className={`flex items-center gap-2 text-xs text-muted-foreground font-mono ${colors.badge} px-4 py-2 rounded-full`}>
                <span>{tx.sender?.owner || "Unknown"}</span>
                <ArrowRight className="w-4 h-4" />
                <span>{tx.receiver?.owner || "Unknown"}</span>
              </div>
            </div>

            {/* Transaction Details */}
            <Card className="bg-secondary/10 border-border mb-6">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Transaction Details
                </h3>
                <div className="space-y-3 text-sm font-mono">
                  {hash && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground shrink-0">Hash</span>
                      <div className="flex items-center gap-1 text-right">
                        <span className="text-foreground text-xs">{shortHash}</span>
                        <CopyButton text={hash} />
                        {txUrl && (
                          <a href={txUrl} target="_blank" rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span className="text-foreground">{blockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="text-foreground text-xs">{timestamp}</span>
                  </div>
                  {fee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="text-foreground">{fee} {feeUsd && `(${feeUsd})`}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge className={`${colors.badge} border-0 text-[10px] uppercase`}>{txType}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  View on
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors">
                      Twitter <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {socialLinks.telegram && (
                    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors">
                      Telegram <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {socialLinks.discord && (
                    <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors">
                      Discord <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {socialLinks.bluesky && (
                    <a href={socialLinks.bluesky} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors">
                      Bluesky <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {txUrl && (
                    <a href={txUrl} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center gap-1.5 transition-colors">
                      <Globe className="w-3 h-3" />
                      View on Explorer
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* FIX #3: Related Internal Links — topic cluster for crawl depth */}
            <div className="mb-6 pt-4 border-t border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Related Whale Alerts
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Back button */}
            <div className="pt-4 border-t border-border">
              <Link href={backHref}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                  Back to Whale Tracker
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}