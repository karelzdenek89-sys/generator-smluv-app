import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: '/uk', destination: '/ua', permanent: true },
      { source: '/uk/:path*', destination: '/ua/:path*', permanent: true },
      { source: '/vn', destination: '/en', permanent: true },
      { source: '/vn/:path*', destination: '/en/:path*', permanent: true },
      { source: '/vi', destination: '/en', permanent: true },
      { source: '/vi/:path*', destination: '/en/:path*', permanent: true },
      { source: '/ru', destination: '/en', permanent: true },
      { source: '/ru/:path*', destination: '/en/:path*', permanent: true },
      { source: '/de', destination: '/en', permanent: true },
      { source: '/de/:path*', destination: '/en/:path*', permanent: true },
    ];
  },
};

export default nextConfig;