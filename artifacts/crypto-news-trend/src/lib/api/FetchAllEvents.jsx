
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";


export const FetchAllEvents = async (page = 1, locale) => {
  try {

    const response = await fetch(
      `https://crytponews.fun/api/get-events/${locale}/?page=${page}`,
      {
     next: { 
  revalidate: 43200, // ✅ 12 hours
  tags: ['events', `${locale}-events`]
}
      }
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result;
    }

    return result;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    return null;
  }
};


export const fetchEventBySlug = async (slug, locale = 'en') => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";
    const apiLocale = locale === "zh" ? "zh-cn" : locale;

    const response = await fetch(
      `${BASE_URL}/api/get_slug_event/${apiLocale}/${slug}/`,
      {
        next: {
          revalidate: 43200,
          tags: [`${apiLocale}-event-${slug}`],
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.error || "Event not found" };

  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, message: "Server se connection nahi ho saka." };
  }
};