import { cache } from "react";

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://crytponews.fun";

const GetArticleBySlug = cache(async (slug, locale = "en") => {
  try {
    const apiLocale = locale === "zh" ? "zh-cn" : locale;

    const url =
      locale === "en"
        ? `${BASE_API}/api/news_one_Slug/${slug}/`
        : `${BASE_API}/api/news_one_Slug/${apiLocale}/${slug}/`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    return data.result || null;
  } catch (err) {
    console.error("[GetArticleBySlug Error]:", err);
    return null;
  }
});

export default GetArticleBySlug;