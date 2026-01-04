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
        // Tanda ** berarti membolehkan semua subdomain railway (aman & fleksibel)
        protocol: 'https',
        hostname: '**.up.railway.app', 
        pathname: '/**',
      },
    ],
  },
  // Output standalone opsional di Vercel, tapi bagus untuk performa build
  output: 'standalone',
};

export default nextConfig;