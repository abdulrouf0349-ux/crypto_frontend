import { cache } from "react";

export const fetchAllIcoProjects = cache(
  async (locale = "en", status = "Active", page = 1) => {
    const API_URL = `https://crytponews.fun/api/ico_data/${locale}/?status=${status}&page=${page}`;

    try {
      const response = await fetch(API_URL, {
        next: {
          revalidate: 43200,
          tags: ["ico", `${locale}-ico`,`${locale}-ico-${status.toLowerCase()}`],
        },
      });

      const result = await response.json();

      if (result.success === true) {
        return {
          success: true,
          data: result.data,
          total_pages: result.total_pages,
          has_next: result.has_next,
          count: result.count,
        };
      }
      return { success: false };
    } catch (error) {
      console.error("Fetch Error:", error);
      return { success: false };
    }
  }
);



const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";

// React cache() deduplicates — generateMetadata + Page share 1 fetch
export const fetchIcoBySlug = cache(async (slug, locale = "en") => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/get_slug_ico/${locale}/${slug}/`,
      {
        next: {
          revalidate: 86400,                        // FIX #2: 24h ISR, not false
          tags: [`${locale}-ico-${slug}`],
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        message: result.error || "Project not found.",
      };
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, message: "Server connection failed." };
  }
});

