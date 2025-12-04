import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable instrumentation for running migrations on startup
  experimental: {
    instrumentationHook: true,
  },
  // Allow external images from Steam and other CDNs
  images: {
    remotePatterns: [
      { hostname: "cdn.cloudflare.steamstatic.com" },
      { hostname: "cdn.akamai.steamstatic.com" },
      { hostname: "assets.nintendo.com" },
      { hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
