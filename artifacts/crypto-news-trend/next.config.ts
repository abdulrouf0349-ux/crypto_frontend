import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.pike.replit.dev", "*.replit.dev"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // 1️⃣ API Domain
      { 
        protocol: "https", 
        hostname: "crytponews.fun",
        pathname: "/**",
      },
      // 🔥 2️⃣ FIX: Aapki apni domain jahan se actually images aa rahi hain
      { 
        protocol: "https", 
        hostname: "cryptonewstrend.com",
        pathname: "/**",
      },
      { 
        protocol: "https", 
        hostname: "image.coinpedia.org",
        pathname: "/**",
      },
       { 
        protocol: "https", 
        hostname: "icodrops.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;