export const fetchWhaleAlerts = async (page = 1, locale = "en") => {
  const API_URL = `https://crytponews.fun/api/whales_alert/${locale}/?page=${page}`;

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 }, // 1 hour
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    return result; // Returns full object: { status, metadata, data }
  } catch (error) {
    console.error("Failed to fetch whale alerts:", error);
    return { status: "error", data: [], metadata: { total_pages: 0 } };
  }
};

export async function getAlertDetailsByHash(hash, locale = 'en') {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://crytponews.fun";
    
    const response = await fetch(
      `${BASE_URL}/api/get_whales_slug/${locale}/${hash}/`,
      {
        cache: 'force-cache', // ✅ Permanent SSG Cache: Production builds mein full pre-render ke liye behtareen hai
        next: {
          tags: [`${locale}-crypto-whales-${hash}`], // ✅ On-demand revalidation tag humne barkaraar rakha hai
        },
      }
    );

    // 1. Pehle status check karein, bina response parse kiye taaki JSON crash na ho
    if (response.status === 404) {
      return { data: null, notFound: true };
    }

    if (!response.ok) {
      console.error(`API Server Error: Status ${response.status}`);
      return null;
    }

    // 2. Ab safely JSON parse karein kyunki status code 200-299 OK hai
    const result = await response.json();

    if (result && result.status === "success") {
      return result.data;
    } else {
      console.error("API Logical Error:", result?.message || "Unknown error");
      return null;
    }

  } catch (error) {
    console.error("Fetch Error in getAlertDetailsByHash:", error);
    return null;
  }
}