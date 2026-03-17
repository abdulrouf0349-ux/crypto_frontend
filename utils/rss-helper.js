// src/utils/rss-helper.js
// ─────────────────────────────────────────────────────────────

export const SITE_URL = 'https://cryptonewstrend.com';
export const BASE_API = process.env.NEXT_PUBLIC_API_BASE || 'https://crytponews.fun';

// ── HTML clean karo ───────────────────────────────────────────
export function clean(text = '') {
  if (!text) return '';
  return text
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&amp;/g,  '&')   // double encoded
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── XML escape ────────────────────────────────────────────────
export function esc(text = '') {
  return String(text)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
}

// ── RSS XML banao ─────────────────────────────────────────────
export function buildRss({ title, link, description, items = [] }) {
  const itemsXml = items.map(item => `
    <item>
      <title>${esc(item.title || '')}</title>
      <link>${esc(item.link || '')}</link>
      <guid isPermaLink="true">${esc(item.link || '')}</guid>
      <description>${esc(item.description || '')}</description>
      ${item.pubDate   ? `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` : ''}
      ${item.author    ? `<author>${esc(item.author)}</author>`     : ''}
      ${item.category  ? `<category>${esc(item.category)}</category>` : ''}
      ${item.image     ? `<enclosure url="${esc(item.image)}" type="image/jpeg" length="0"/>` : ''}
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(link)}</link>
    <description>${esc(description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${esc(link)}" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
    },
  });
}