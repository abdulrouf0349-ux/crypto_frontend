"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, BookOpen, Tag, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GlossaryDetail({ coinResponse, locale }) {
  const currentLocale = locale || "en";
  const isRtl = ["ur", "ar"].includes(currentLocale);
  const backHref = currentLocale === "en" ? "/glossary" : `/${currentLocale}/glossary`;

  // Fail-safe payload parsing loops
  let coin = null;
  if (coinResponse) {
    if (coinResponse.data) {
      coin = coinResponse.data;
    } else if (Array.isArray(coinResponse) && coinResponse.length > 0) {
      coin = coinResponse[0];
    } else {
      coin = coinResponse;
    }
  }

  // Agar structural elements array/objects miss ho rahe hain tabhi offline screen trigger ho
  if (!coin || (!coin.name && !coin.title)) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Asset Definition Offline</h1>
        <p className="text-muted-foreground mb-8">
          The specific cryptographic coin node could not be pulled down from live server pipelines.
        </p>
        <Link href={backHref}>
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Return to List</Button>
        </Link>
      </div>
    );
  }

  // Fallback string values assignment logic
  const displayName = coin.name || coin.title || "Unknown Asset Node";
  const displayDescription = coin.description || coin.short_description || coin.content || "Detailed descriptive definition blocks for this coin entry are currently empty on server database indices.";

  return (
    <div className="container mx-auto px-4 py-8 pb-16" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-2">
        <Link href={backHref}>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            Back
          </button>
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Link href={currentLocale === "en" ? "/" : `/${currentLocale}`} className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={backHref} className="hover:text-foreground transition-colors">
            Glossary
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-purple-400">{displayName}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-5"
          >
            {coin.image || coin.logo ? (
           <Image
  src={coin.image || coin.logo}
  alt={displayName}
  width={80}
  height={80}
  className="w-20 h-20 rounded-2xl ring-4 ring-background shadow-lg shrink-0 object-cover bg-secondary"
/>
            ) : (
              <div className="w-20 h-20 rounded-2xl ring-4 ring-background shadow-lg shrink-0 bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BookOpen className="w-10 h-10" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className={`text-2xl md:text-4xl font-bold leading-tight ${isRtl ? "font-sans" : "font-display"}`}>
                  {displayName}
                </h1>
                {coin.symbol && (
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                    {coin.symbol}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border bg-purple-500/15 text-purple-400 border-purple-500/30">
                  <Tag className="w-3.5 h-3.5" />
                  {coin.type || "Cryptocurrency"}
                </span>
                {coin.network && <Badge variant="outline" className="text-xs font-mono">{coin.network}</Badge>}
              </div>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isRtl ? "font-sans" : "font-display"}`}>
              <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
              Comprehensive Overview
            </h2>
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <p className={`text-muted-foreground leading-relaxed text-base ${isRtl ? "text-right" : ""}`}>
                {displayDescription}
              </p>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 flex gap-3 text-sm text-muted-foreground"
          >
            <span className="w-1.5 h-5 bg-orange-500 rounded-full shrink-0 mt-0.5" />
            <p className="font-mono text-xs">
              Crypto terminology changes rapidly. Always cross-verify complex technical concepts across public standard whitepapers or network documentations.
            </p>
          </motion.div>
        </div>

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">On-Chain Data Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Asset Name", value: displayName },
                  { label: "Identifier", value: coin.slug || "—" },
                  { label: "API Index",  value: coin.id ? `#${coin.id}` : "Live Feed" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-mono font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {coin.website && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <a href={coin.website} target="_blank" rel="noreferrer">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2 font-mono text-xs font-bold">
                  <ExternalLink className="w-4 h-4" /> VISIT PROJECT CHAIN SINK
                </Button>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}