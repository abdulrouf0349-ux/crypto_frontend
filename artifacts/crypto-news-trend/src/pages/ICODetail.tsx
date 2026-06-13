"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Clock, Globe, Twitter, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIcos } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function ICODetail() {
  const params = useParams<{ slug: string }>();
  const ico = mockIcos.find((item) => item.slug === params.slug);

  if (!ico) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The ICO project you are looking for does not exist or has been removed.
        </p>
        <Link href="/ico">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ICO Launchpad
          </Button>
        </Link>
      </div>
    );
  }

  const statusColor =
    ico.status === "active"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : ico.status === "upcoming"
      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      {/* Back + Breadcrumb */}
      <div className="mb-6 flex flex-col gap-2">
        <Link href="/ico">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">
            News
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/ico" className="hover:text-foreground transition-colors">
            ICO Launchpad
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-purple-400">{ico.name}</span>
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
            <img
              src={ico.logo}
              alt={ico.name}
              className="w-20 h-20 rounded-2xl ring-4 ring-background shadow-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight">
                  {ico.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                  ${ico.ticker}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${statusColor}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {ico.timeLeft}
                </span>
                <Badge variant="outline" className="text-xs font-mono">
                  {ico.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  Rank #{ico.rank}
                </span>
              </div>
            </div>
          </motion.div>

          {/* About Project */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-500 rounded-full inline-block" />
              About Project
            </h2>
            <p className="text-muted-foreground leading-relaxed">{ico.about}</p>
          </motion.section>

          {/* Funding Rounds */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
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
                  {ico.fundingRounds.map((row, i) => (
                    <tr key={i} className="bg-card hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-semibold">{row.round}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono ${
                              row.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : row.status === "UPCOMING"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {row.status}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {row.date}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {row.tokens}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {row.platform}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground font-mono">
              Source: CoinList, Republic, and project official channels. Data is for informational purposes only.
            </p>
          </motion.section>
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
                <CardTitle className="text-base font-display">Investment Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total Raised", value: ico.investmentStats.totalRaised },
                  { label: "Pre-Valuation", value: ico.investmentStats.preValuation },
                  { label: "Rounds", value: String(ico.investmentStats.rounds) },
                  { label: "Last Updated", value: ico.investmentStats.lastUpdated },
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
                  { icon: Globe, label: "Website", href: ico.links.website },
                  { icon: Twitter, label: "Twitter / X", href: ico.links.twitter },
                  { icon: FileText, label: "Whitepaper", href: ico.links.whitepaper },
                  { icon: ExternalLink, label: "View on Source", href: ico.links.source },
                ].map(({ icon: Icon, label, href }) => (
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
            <a href={ico.links.website} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Join / Whitelist
              </Button>
            </a>
            <a href={ico.links.whitepaper} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full font-semibold gap-2">
                <FileText className="w-4 h-4" />
                Read Whitepaper
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
