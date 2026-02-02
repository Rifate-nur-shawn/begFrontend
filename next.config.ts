import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all external images - use with caution in production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any HTTPS hostname
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Local dev server
      },
    ],
  },
};

export default nextConfig;
