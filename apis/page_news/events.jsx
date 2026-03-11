
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";


export const fetchAllEvents = async (page = 1, locale) => {
  try {
    const response = await fetch(
      `http://46.62.244.169/api/get-events/${locale}/?page=${page}`,
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

/**
 * Simple Callable Function to fetch all ICO data
 * Isay aap apne kisi bhi component ya action mein call kar sakte hain.
 */
export const fetchAllIcoProjects = async (locale = 'en', status = 'Active', page = 1) => {
  const API_URL = `http://46.62.244.169/api/ico_data/${locale}/?status=${status}&page=${page}`;

  try {
    const response = await fetch(API_URL, {
      next: {
        revalidate: 43200, // ✅ 12 hours — ICO list jaldi nahi badlti
        tags: ['ico', `${locale}-ico`] // ✅ status ke hisaab se tag
      }
    });

    const result = await response.json();

    if (result.success === true) {
      return {
        success:     true,
        data:        result.data,
        total_pages: result.total_pages,
        has_next:    result.has_next,
        count:       result.count
      };
    }
    return { success: false };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false };
  }
};


export const fetchIcoBySlug = async (slug, locale = 'en') => {
  try {
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

    const response = await fetch(
      `${BASE_URL}/api/get_slug_ico/${locale}/${slug}/`,  // ✅ GET — slug URL mein
      {
        next: {
          revalidate: false,                              // ✅ PERMANENT — ICO slug data change nahi hota
          tags: [`${locale}-ico-${slug}`],               // ✅ exact page tag
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || "Project dhoondne mein masla hua.",
      };
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      success: false,
      message: "Server se connection nahi ho saka.",
    };
  }
};


async function fetchEventDetails(eventSlug, locale) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

    const response = await fetch(
      `http://46.62.244.169/api/get_slug_event/${locale}/${eventSlug}/`,
      {
        next: {
          revalidate: false,
          tags: [`${locale}-events-${eventSlug}`],
        },
      }
    );

    // ✅ 404 → null return karo, object nahi
    if (response.status === 404) return null;
    if (!response.ok) return null;

    const result = await response.json();

    if (result.status === "success") return result.data; // ✅ sirf data
    return null;

  } catch (error) {
    console.error("Network or Logic Error:", error);
    return null;
  }
}



async function getAlertDetailsByHash(hash, locale = 'en') {
  try {
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

    const response = await fetch(
      `${BASE_URL}/api/get_whales_slug/${locale}/${hash}/`,  // ✅ GET — URL mein
      {
        next: {
          revalidate: false,                                  // ✅ PERMANENT — whale tx change nahi hoti
          tags: [`${locale}-crypto-whales-${hash}`],                 // ✅ exact page tag
        },
      }
    );

    const result = await response.json();
if (response.status === 404) {
      return { data: null, notFound: true };
    }
    if (response.ok && result.status === "success") {
      return result.data;
    } else {
      console.error("API Error:", result.message);
      return null;
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}


export async function fetchAllArticles(locale = 'en', page = 1, category = null) {
  try {

    const params = new URLSearchParams({ page: String(page) });
    if (category) params.append('category', category);
    const BASE_API = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

    const url = `${BASE_API}/api/get_all_articles/${locale}?${params.toString()}`;

    const response = await fetch(url, {
     
        next: {
          revalidate: 43200,
          tags: [`${locale}-articles`, `${locale}-articles-${page}`],

        },
      
    });
    

    if (!response.ok) {
      console.error(`[fetchAllArticles] HTTP Error: ${response.status}`);
      return { success: false, data: [], metadata: {}, has_next: false };
    }

    const result = await response.json();

    if (result.status === 'success') {
      return {
        success:  true,
        data:     result.data              || [],
        metadata: result.metadata          || {},
        has_next: result.metadata?.has_next || false,
      };
    }

    console.error('[fetchAllArticles] API Error:', result.message);
    return { success: false, data: [], metadata: {}, has_next: false };

  } catch (error) {
    console.error('[fetchAllArticles] Fetch Error:', error);
    return { success: false, data: [], metadata: {}, has_next: false };
  }
}


async function getArticleBySlug(slug, locale) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

    const response = await fetch(
      `${BASE_URL}/api/get_article_by_slug/${locale}/${slug}/`, // ✅ locale nahi
      {
        next: {
          revalidate: false,
          tags: [`${locale}-articles-${slug}`],
        },
      }
    );

    if (response.status === 404) return null; // ✅ null return karo
    if (!response.ok) return null;

    const result = await response.json();

    if (result.status === "success") return result.data;
    return null;

  } catch (error) {
    console.error("Terminal Fetch Error:", error);
    return null;
  }
}

export {fetchEventDetails,getAlertDetailsByHash,fetchAllArticles,getArticleBySlug}
