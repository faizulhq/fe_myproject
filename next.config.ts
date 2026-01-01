import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'myproject-production-ee63.up.railway.app',
        pathname: '/**',
      },
    ],
  },
  // Untuk production build
  output: 'standalone',
};

export default nextConfig;