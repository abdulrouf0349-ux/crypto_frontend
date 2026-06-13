/**
 * ---------------------------------------------------------------
 *  YOUR ARTICLES — add your own here, they appear in the news feed
 * ---------------------------------------------------------------
 *
 *  HOW TO ADD A NEW ARTICLE:
 *  1. Copy one of the blocks below and paste it inside the array.
 *  2. Fill in every field (title, excerpt, body, etc.)
 *  3. Set `date` to today's date — the feed sorts newest-first.
 *  4. The `slug` must be unique, lowercase, hyphens only (no spaces).
 *  5. Save. The article appears instantly in the news feed with an
 *     "EDITORIAL" badge so readers know it's your own content.
 *
 *  BODY FORMATTING:
 *  - Separate paragraphs with a blank line (\n\n).
 *  - Wrap a heading with **double stars** on its own line, e.g.
 *      **Why This Matters**
 *  - Bold inline text also uses **double stars** inside a sentence.
 * ---------------------------------------------------------------
 */

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  date: string;
  tag: string;
  isFeatured: boolean;
  isBreaking: boolean;
  excerpt: string;
  body: string;
  author: { name: string; avatar: string; role: string };
  readTime: number;
  keywords: string[];
  relatedIds: string[];
  isEditorial: true;
}

// ----------------------------------------------------------------
// ADD YOUR ARTICLES BELOW
// ----------------------------------------------------------------
export const myArticles: Article[] = [
  // ── EXAMPLE ARTICLE (edit or delete this one) ────────────────
  {
    id: "editorial-1",
    slug: "why-bitcoin-is-the-future-of-money",
    title: "Why Bitcoin Is the Future of Money — My Personal Take",
    category: "BITCOIN",
    imageUrl: "https://picsum.photos/seed/editorial1/1200/630",
    thumbnailUrl: "https://picsum.photos/seed/editorial1/600/400",
    date: new Date().toISOString(),         // ← shows as "just now"
    tag: "EDITORIAL",
    isFeatured: false,
    isBreaking: false,
    excerpt:
      "After years of following the crypto space, I've come to one conclusion: Bitcoin is not just a speculative asset — it's the most credible challenger to the global monetary order in decades.",
    body: `After years of following the crypto space, I've come to one conclusion: Bitcoin is not just a speculative asset — it's the most credible challenger to the global monetary order in decades.

**The Scarcity Argument**

Unlike every fiat currency ever created, Bitcoin has a hard cap of 21 million coins — enforced not by any government or central bank, but by mathematics and global consensus. No politician can order a bailout that dilutes your Bitcoin holdings overnight.

This scarcity is already being recognized by institutional treasuries. Companies like MicroStrategy and nation-states like El Salvador have moved significant reserves into Bitcoin not as a trade, but as a long-term store of value.

**The Network Effect Is Real**

Bitcoin's true moat isn't its technology (Ethereum and others have surpassed it on that front) — it's the network. Over 50 million wallets, billions in daily liquidity, and deep integration with traditional finance mean that Bitcoin is now too big to ignore and arguably too big to kill.

**What I Believe**

I'm not here to tell you to buy Bitcoin. What I will say is that in a world of devaluing currencies, rising debt, and geopolitical uncertainty, understanding what Bitcoin represents — and why people are choosing it — is worth your time.

The future of money might not look exactly like Bitcoin. But Bitcoin has permanently changed how we think about money. And that, I'd argue, is already a revolution.`,
    author: {
      name: "You",                          // ← change to your name
      avatar: "https://picsum.photos/seed/me/60/60",
      role: "Editor & Founder",             // ← change to your role
    },
    readTime: 4,
    keywords: ["bitcoin", "money", "store of value", "crypto", "editorial"],
    relatedIds: [],
    isEditorial: true,
  },

  // ── PASTE MORE ARTICLES HERE ──────────────────────────────────
];
