// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

async rewrites() {
  return [
    {
      source: '/rss/:path*',
      destination: 'https://crytponews.fun/rss/:path*',
    },
  ];
},
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nativeapi.site",
      },
      {
        protocol: "https",
        hostname: "coindesk.com",
      },
     {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      // Agar aap 'localhost' bhi use karte hain to ye bhi add kar dein
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
