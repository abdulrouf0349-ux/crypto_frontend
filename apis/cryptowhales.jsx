export const fetchWhaleAlerts = async (page = 1, locale = 'en') => {
    // URL matching your Django view: api/whales_alert/<locale>/?page=<page>
    const API_URL = `http://46.62.244.169/api/whales_alert/${locale}/?page=${page}`; 
    try {
const response = await fetch(API_URL, { 
  next: { revalidate: 3600 } // 1 hour
});        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        return result; // Pura result return karein (status + metadata + data)
    } catch (error) {
        console.error("Failed to fetch whale alerts:", error);
        return { status: "error", data: [], metadata: { total_pages: 0 } };
    }
}



async function fetchCoins(page = 1, search = '', type = 'all', locale = 'en') {
  try {

    const params = new URLSearchParams({
      page: page.toString(),
      search,
      type,
      locale,
    });

    const url = `http://46.62.244.169/api/coins?${params.toString()}`;

    const res = await fetch(url, {
      next: {
        revalidate: false,                          // ✅ PERMANENT — coin details change nahi hoti
        tags: [`${locale}-glossary-${type}`],          // ✅ exact page tag
      },
    });

if (res.status === 404) return { data: [], metadata: { total_pages: 1 } };
if (!res.ok) return { data: [], metadata: { total_pages: 1 } };
    const result = await res.json();
    return result;

  } catch (error) {
    console.error('Network Error:', error);
    return { data: [], metadata: { total_pages: 1 } };
  }
}



async function fetchCoinDetail(slug, locale = 'en') {
  try {

    const res = await fetch(
      `http://46.62.244.169/api/coins/${slug}/?locale=${locale}`,
      {
        next: {
          revalidate: false,                        // ✅ PERMANENT — coin details change nahi hoti
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    return result;

  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
}

export {fetchCoins,fetchCoinDetail}