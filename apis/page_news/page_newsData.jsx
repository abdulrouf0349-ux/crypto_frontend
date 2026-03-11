const Page_NewsData = async (page = 1,locale) => {
  const baseUrl = "http://46.62.244.169/api/getdata";

  const apiUrl =
    locale === "en"
      ? `${baseUrl}/?page=${page}`
      : `${baseUrl}/${locale}/?page=${page}`;

  const res = await fetch(apiUrl, {
    method: "POST", // Changed to POST
    headers: {
      "Content-Type": "application/json",
    },
    // Adding the body with the default 'bitcoin' or any news type you need
    body: JSON.stringify({ news: "all" }), 
    next: { revalidate: 300, },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default Page_NewsData;