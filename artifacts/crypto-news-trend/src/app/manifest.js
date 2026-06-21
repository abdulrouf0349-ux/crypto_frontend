export default function manifest() {
  return {
    name: "CryptoNews",
    short_name: "CryptoNews",
    description:
      "Latest cryptocurrency news, ICOs, market analysis, whale alerts and blockchain updates.",
    start_url: "/",
    id: "/",
    display: "standalone",
    theme_color: "#0f172a",
    background_color: "#0f172a",
    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      }
    ],
  };
}