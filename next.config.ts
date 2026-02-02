import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.susercontent.com', // Shopee/Lazada images
      },
      {
        protocol: 'https',
        hostname: 'down-my.img.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com', // R2 storage
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // S3
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary
      },
    ],
  },
};

export default nextConfig;
