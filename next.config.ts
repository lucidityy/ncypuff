import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  /** Prevents Next from picking a parent lockfile as the tracing root. */
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com"
      }
    ],
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
