// next.config.mjs
// Importing env.mjs here makes env validation run at BUILD time (fail fast).
import "./src/shared/config/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Whitelist remote hosts for next/image (CDN, avatars, uploads).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },

};

export default nextConfig;
