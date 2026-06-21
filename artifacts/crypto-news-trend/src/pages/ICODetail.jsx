"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ChevronRight, Clock, Globe,
  Twitter, FileText, ExternalLink,
} from "lucide-react";
import { Badge }                          from "@/components/ui/badge";
import { Button }                         from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion }                         from "framer-motion";

// ─── FAQ data — FIX #7: real FAQ content for Google rich results ──────────────
const FAQ_ITEMS = [
  {
    q: "What is an ICO (Initial Coin Offering)?",
    a: "An ICO is a fundraising method where a blockchain project sells its native tokens to early investors in exchange for cryptocurrency or fiat, before the token is listed on exchanges.",
  },
  {
    q: "How do I join an ICO whitelist?",
    a: "Click the 'Join / Whitelist' button above to visit the official project website. Most whitelists require an email signup and KYC verification.",
  },
  {
    q: "Is investing in an ICO risky?",
    a: "Yes. ICOs are high-risk investments. Always read the whitepaper, research the team, and never invest more than you can afford to lose.",
  },
  {
    q: "What is a token presale?",
    a: "A token presale (or private sale) happens before the public ICO. Early investors often receive tokens at a discounted price in exchange for higher risk.",
  },
];

export default function ICODetail({ ico, locale }) {
  const currentLocale = locale || "en";
  const isRtl         = ["ur", "ar"].includes(currentLocale);
  const backHref      = currentLocale === "en" ? "/ico" : `/${currentLocale}/ico`;

  if (!ico) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The ICO project you are looking for does not exist or has been removed.
        </p>
        <Link href={backHref}>
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to ICO Launchpad</Button>
        </Link>
      </div>
    );
  }

  // ── Normalize API fields ──────────────────────────────────────────────────
  const name        = ico.name         || "Unknown Project";
  const ticker      = ico.ticker       || "";
  const description = ico.description  || ico[`description_${currentLocale}`] || "";
  const status      = (ico.status      || "active").toLowerCase();
  const logoUrl     = ico.main_img     || ico.footer_img || "https://cryptonewstrend.com/ico-default.png";
  const raised      = ico.raised_text  || ico.overview_data?.total_raised  || "—";
  const preVal      = ico.pre_valuation || ico.overview_data?.pre_valuation || "—";
  const rounds      = ico.rounds_count || ico.overview_data?.rounds_count  || "—";
  const lastUpdated = ico.last_updated || ico.overview_data?.last_updated  || "—";
  const category    = ico.category_name || ico.project_type || "—";
  const statusTime  = ico.status_time  || "";
  const roundsData  = Array.isArray(ico.rounds_data) ? ico.rounds_data : [];
  const website     = ico.website      || "";
  const twitter     = ico.twitter      || "";
  const whitepaper  = ico.whitepaper   || "";
  const detailLink  = ico.detail_link  || "";
  // FIX #12: related ICOs (API may provide them, or fall back to empty)
  const relatedIcos = Array.isArray(ico.related_icos) ? ico.related_icos : [];

  const statusColor =
    status === "active"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : status === "upcoming"
      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <div
      className="container mx-auto px-4 py-8 pb-16"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Back + Breadcrumb */}
      <div className="mb-6 flex flex-col gap-2">
        <Link href={backHref}>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            Back
          </button>
        </Link>
        <nav
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono"
          aria-label="Breadcrumb"
        >
          <Link
            href={currentLocale === "en" ? "/" : `/${currentLocale}`}
            className="hover:text-foreground transition-colors"
          >
            News
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={backHref} className="hover:text-foreground transition-colors">
            ICO Launchpad
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-purple-400">{name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-5"
          >
            {logoUrl && (
              // FIX #8: remove priority — only homepage hero should use priority
              <Image
                src={logoUrl}
                alt={`${name} ICO Logo`}
                width={80}
                height={80}
                loading="eager"
                className="w-20 h-20 rounded-2xl ring-4 ring-background shadow-lg shrink-0 object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1
                  className={`text-2xl md:text-3xl font-bold leading-tight ${
                    isRtl ? "font-sans" : "font-display"
                  }`}
                >
                  {name}
                </h1>
                {ticker && (
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                    ${ticker}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {statusTime && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${statusColor}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {statusTime}
                  </span>
                )}
                {category && (
                  <Badge variant="outline" className="text-xs font-mono">
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* About Project */}
          {description && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  isRtl ? "font-sans" : "font-display"
                }`}
              >
                <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
                About Project
              </h2>
              {/* ico-description class used by speakable schema */}
              <p
                className={`ico-description text-muted-foreground leading-relaxed ${
                  isRtl ? "text-right" : ""
                }`}
              >
                {description}
              </p>
            </motion.section>
          )}

      
          {roundsData.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  isRtl ? "font-sans" : "font-display"
                }`}
              >
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                Funding Rounds
              </h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider font-mono">
                      <th className="text-left px-4 py-3">Round</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Status / Date</th>
                      <th className="text-right px-4 py-3">Tokens</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {roundsData.map((row, i) => (
                      <tr
                        key={i}
                        className="bg-card hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold">
                          {row.name || row.round || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.type || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono ${
                                (row.status || "").toUpperCase() === "ACTIVE"
                                  ? "bg-green-500/20 text-green-400"
                                  : (row.status || "").toUpperCase() === "UPCOMING"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-red-500/15 text-red-400"
                              }`}
                            >
                              {row.status || "—"}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {row.date || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {row.tokens || row.token_amount || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {row.platform_url ? (
                            <a
                              href={row.platform_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {row.platform || "View"}
                            </a>
                          ) : (
                            row.platform || "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                Source: CoinList, Republic, and project official channels. Data is
                for informational purposes only.
              </p>
            </motion.section>
          )}

          {/* FIX #7: Token Sale Details section — SEO keyword boost */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isRtl ? "font-sans" : "font-display"
              }`}
            >
              <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
              Token Sale Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Raised",  value: raised         },
                { label: "Pre-Valuation", value: preVal         },
                { label: "Rounds",        value: String(rounds) },
                { label: "Last Updated",  value: lastUpdated    },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-mono font-bold">{value}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Screenshots */}
          {Array.isArray(ico.screenshots) && ico.screenshots.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  isRtl ? "font-sans" : "font-display"
                }`}
              >
                <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
                Screenshots
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {ico.screenshots.map((shot, i) => (
                  // FIX #9: next/image with lazy loading instead of bare <img>
                  <Image
                    key={i}
                    src={shot.src || shot}
                    alt={shot.name || `${name} screenshot ${i + 1}`}
                    width={800}
                    height={450}
                    loading="lazy"
                    className="rounded-lg border border-border object-cover w-full aspect-video"
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* FIX #7: FAQ Section — real visible content for rich results */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isRtl ? "font-sans" : "font-display"
              }`}
            >
              <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="text-sm font-semibold mb-1">{q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* FIX #12: Related ICO Projects — internal linking boost */}
          {relatedIcos.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              <h2
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  isRtl ? "font-sans" : "font-display"
                }`}
              >
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                Related ICO Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedIcos.slice(0, 6).map((rel) => (
                  <Link
                    key={rel.slug}
                    href={
                      currentLocale === "en"
                        ? `/ico/${rel.slug}`
                        : `/${currentLocale}/ico/${rel.slug}`
                    }
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-secondary/40 transition-colors group"
                  >
                    {rel.main_img && (
                      <Image
                        src={rel.main_img}
                        alt={`${rel.name} ICO`}
                        width={36}
                        height={36}
                        loading="lazy"
                        className="rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-purple-400 transition-colors">
                        {rel.name}
                      </p>
                      {rel.ticker && (
                        <p className="text-xs text-muted-foreground font-mono">
                          ${rel.ticker}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">

          {/* Investment Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">
                  Investment Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total Raised",  value: raised         },
                  { label: "Pre-Valuation", value: preVal         },
                  { label: "Rounds",        value: String(rounds) },
                  { label: "Last Updated",  value: lastUpdated    },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-mono font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Globe,        label: "Website",        href: website    },
                  { icon: Twitter,      label: "Twitter / X",    href: twitter    },
                  { icon: FileText,     label: "Whitepaper",     href: whitepaper },
                  { icon: ExternalLink, label: "View on Source", href: detailLink },
                ]
                  .filter((l) => l.href)
                  .map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground group"
                    >
                      <Icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors shrink-0" />
                      {label}
                    </a>
                  ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Join / Whitelist
                </Button>
              </a>
            )}
            {whitepaper && (
              <a href={whitepaper} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full font-semibold gap-2">
                  <FileText className="w-4 h-4" />
                  Read Whitepaper
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}