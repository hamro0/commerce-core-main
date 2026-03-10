import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@tabler/icons-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7145'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      }
    ],
  },
};

export default nextConfig;