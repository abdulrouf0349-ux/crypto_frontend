const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://46.62.244.169";

const getNewsById = async (locale = 'en', Title) => {
  try {

    const response = await fetch(
      `${BASE_URL}/api/getnews/${locale}/${Title}/`,  // ✅ GET — slug URL mein
      {
        next: {
  revalidate: false,  // ← INFINITE cache — kabhi revalidate nahi
  tags: [`${Title}`,`${locale}-${Title}`], // ← sirf manual purge se hi update hoga
}
      }
    );
if (response.status === 404) {
      return { data: null, notFound: true };
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };

  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return { data: null, error: error.message };
  }
};

export default getNewsById;