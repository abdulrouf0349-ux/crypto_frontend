// app/robots.js
// Next.js auto-generates /robots.txt from this file.
// Explicitly allowing the well-behaved AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) is the 2025/2026 best practice if you
// WANT your news content surfaced in AI answers/citations. Remove any
// of these blocks if you'd rather opt out of a specific one.

import { SITE_URL } from "@/lib/sitemap/configer";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicit allow rules for AI crawlers (harmless even if you don't
      // care about AI search — uncomment "disallow" lines instead if you
      // want to block any of them)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
