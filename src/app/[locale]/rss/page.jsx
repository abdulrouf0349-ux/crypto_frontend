import { getAllRssFeeds } from "@/context/rss-links";

export const metadata = {
  title: "RSS Feeds",
  description: "Subscribe to CryptoNewsTrend RSS feeds",
};

export default async function RssPage({ params }) {
  const { locale } = await params;
  const rawFeeds = getAllRssFeeds(locale);

  // ✅ NAYA LOGIC: English ke liye URL se /en saaf kar do taaki Google aur Users ko clean URL mile
  const feeds = rawFeeds.map(feed => {
    const cleanUrl = locale === 'en' ? feed.url.replace('/en/', '/').replace('/en', '/') : feed.url;
    
    // Filters ke URLs ko bhi clean karo agar locale 'en' hai
    const cleanFilters = feed.filters?.map(f => ({
      ...f,
      url: locale === 'en' ? f.url.replace('/en/', '/').replace('/en', '/') : f.url
    }));

    return { ...feed, url: cleanUrl, filters: cleanFilters };
  });

  const icons = {
    master:   "📡",
    news:     "📰",
    articles: "✍️",
    events:   "📅",
    ico:      "🚀",
    whales:   "🐋",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
          📡 RSS Feeds
        </h1>
        <p style={{ color: "#888", fontSize: "15px" }}>
          Subscribe to stay updated with latest crypto news in your RSS reader.
        </p>
      </div>

      {/* Feed Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {feeds.map((feed) => (
          <div
            key={feed.type}
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "20px 24px",
              backgroundColor: "#111",
            }}
          >
            {/* Main Feed Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{icons[feed.type]}</span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>{feed.label}</div>
                  <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>{feed.url}</div>
                </div>
              </div>
              <a
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#f7931a",
                  color: "#000",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </a>
            </div>

            {/* Filters (ICO / Whales) */}
            {feed.filters && (
              <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {feed.filters.map((f) => (
                  <a
                    key={f.label}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      border: "1px solid #333",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      color: "#aaa",
                      textDecoration: "none",
                    }}
                  >
                    {f.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ marginTop: "32px", color: "#555", fontSize: "13px", textAlign: "center" }}>
        Copy any URL above and paste it in your RSS reader (Feedly, Inoreader, etc.)
      </p>
    </div>
  );
}