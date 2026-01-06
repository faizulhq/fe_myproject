import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.senbi.online', // ✅ TAMBAHKAN INI (Domain R2)
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.up.railway.app', 
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;