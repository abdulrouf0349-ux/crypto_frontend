import { toApiLocale } from "@/context/locales";

const NewstypeApi = async (news_type, page, locale) => {
  try {
                      const apiLocale = toApiLocale(locale);
    
    const response = await fetch(
      `http://46.62.244.169/api/get_news_type/${apiLocale}/?page=${page}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news: news_type }),
        next: { revalidate: 300, tags: [`${apiLocale}-news`, `${apiLocale}-news-${news_type}`] }, // ✅
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };

  } catch (error) {
    console.error('Error fetching news:', error);
    return { data: null, error: error.message };
  }
};

export default NewstypeApi;