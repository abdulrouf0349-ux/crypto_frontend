"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Globe,
  ChevronRight,
  Share2,
  Twitter,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const SITE_URL = "https://cryptonewstrend.com";

// ── Countdown — same as before ──
function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setEnded(true); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (ended) return (
    <div className="text-center text-muted-foreground font-mono text-sm py-4">
      Event has started / ended
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        { label: "DAYS",  value: timeLeft.days    },
        { label: "HRS",   value: timeLeft.hours   },
        { label: "MINS",  value: timeLeft.minutes },
        { label: "SECS",  value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="bg-background rounded-lg px-2 py-3 border border-border">
          <div className="text-2xl font-mono font-bold text-foreground">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[9px] font-bold tracking-widest text-muted-foreground mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ──
export default function EventDetail({ event, locale }) {
  const currentLocale = locale || "en";
  const isRtl = ["ur", "ar"].includes(currentLocale);
  const backHref = currentLocale === "en" ? "/events" : `/${currentLocale}/events`;

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link href={backHref}>
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Events</Button>
        </Link>
      </div>
    );
  }

  // ── Normalize API fields ──
  const title       = event.title || event.detail_title || "Untitled Event";
  const description = event.description || "";
  const location    = event.location || event.detail_location || "TBA";
  const imageUrl    = event.image_src || "https://cryptonewstrend.com/og-default.png";
  const status      = (event.status || "UPCOMING").toUpperCase();
  const organizer   = event.organized_by || "Organizer";
  const dateText    = event.date_text || "";
  const mapsLink    = event.maps_link || "";
  const websiteLink = event.website_link || "";
  const shareUrl    = currentLocale === "en"
    ? `${SITE_URL}/events/${event.slug}`
    : `${SITE_URL}/${currentLocale}/events/${event.slug}`;

  const statusColor =
    status === "ONGOING"
      ? "bg-green-500 text-white"
      : status === "UPCOMING"
      ? "bg-blue-500 text-white"
      : "bg-gray-600 text-white";

  const isUpcoming = status === "UPCOMING" || status === "ONGOING";

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>

      {/* Hero banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
    src={imageUrl}
    alt={title}
    fill
    sizes="100vw"
    priority
    className="object-cover"
  />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono">
          <Link href={currentLocale === "en" ? "/" : `/${currentLocale}`} className="hover:text-foreground transition-colors">
            News
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={backHref} className="hover:text-foreground transition-colors">
            Events
          </Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-purple-400 line-clamp-1 max-w-[200px]">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left / Main column */}
          <div className="lg:col-span-2">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${statusColor} border-0 uppercase text-[10px] tracking-wider`}>
                {status}
              </Badge>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${isRtl ? "font-sans text-right" : "font-display"}`}
            >
              {title}
            </motion.h1>

            {/* Meta */}
            <div className="space-y-3 mb-8">
              {location && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    {location}
                    {mapsLink && (
                      <a
                        href={mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-0.5 text-purple-400 hover:text-purple-300 transition-colors text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </span>
                </div>
              )}

              {dateText && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{dateText}</span>
                </div>
              )}

              {websiteLink && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <a
                    href={websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            {/* Registration CTA */}
            {isUpcoming && event.full_url && (
              <Card className="mb-8 border-purple-500/30 bg-purple-500/5">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Welcome! To join the event, please register
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Register and confirmation will be sent to your mail
                    </p>
                  </div>
                  <a href={event.full_url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 px-8">
                      Register
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Event image */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden mb-8 border border-border">
                 <Image
      src={imageUrl}
      alt={title}
      width={1200}
      height={675}
      className="w-full h-auto object-cover"
      sizes="(max-width: 768px) 100vw, 768px"
    />
              </div>
            )}

            {/* About */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 ${isRtl ? "font-sans text-right" : "font-display"}`}>
                About this Event
              </h2>
              <p className={`text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-line ${isRtl ? "text-right" : ""}`}>
                {description}
              </p>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <span className="text-sm font-semibold text-muted-foreground">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>

            {/* Back button */}
            <div className="mt-10 pt-8 border-t border-border">
              <Link href={backHref}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                  Back to All Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Right / Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Countdown */}
            {isUpcoming && dateText && (
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h3 className="font-display font-bold text-orange-500">Event Starts in</h3>
                  </div>
                  <Countdown targetDate={dateText} />
                </CardContent>
              </Card>
            )}

            {/* Organizer */}
            {organizer && (
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm uppercase tracking-wide">
                        {organizer}
                      </p>
                      <p className="text-xs text-muted-foreground">EVENT ORGANISER</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {websiteLink && (
                      <a
                        href={websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                          Visit Organizer Website
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location map */}
            {(mapsLink || location) && (
              <Card className="border-border overflow-hidden">
                <div className="relative">
                  <div className="w-full h-[200px] bg-secondary flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Location
                    </p>
                    <p className="text-sm font-semibold">{location}</p>
                  </div>
                </div>
                <CardContent className="p-4 pt-3">
                  {mapsLink && (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                    >
                      View on Map <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}