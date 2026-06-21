// lib/api/Page_NewsData.js
// ✅ Fix #1 — React cache() prevents duplicate fetches during SSR render pass
// ✅ Fix #2 — Cache tags for granular revalidation per locale + category
import { cache } from "react";

function cleanApiLocale(locale) {
  if (!locale) return "en";
  return locale === "zh-CN" ? "zh-cn" : locale;
}

const Page_NewsData = cache(async (page = 1, locale = "en", category = "ALL") => {
  const baseUrl = "https://crytponews.fun/api/getdata";
  const apiLocale = cleanApiLocale(locale);

  const apiUrl =
    !locale || locale === "en"
      ? `${baseUrl}/?page=${page}`
      : `${baseUrl}/${apiLocale}/?page=${page}`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ news: category === "ALL" ? "all" : category.toLowerCase() }),
      next: {
        revalidate: 300,
        // ✅ Fix #2 — targeted cache tags so you can revalidateTag("news-en")
        // from a webhook without busting every locale
        tags: [`news-${locale}`, `category-${category.toLowerCase()}`],
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[Fetch Execution Error]:", err.message);
    return [];
  }
});

export default Page_NewsData;