import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Only proxy during local development. 
    // In production, vercel.json handles routing /api/* to the single index.go serverless function.
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8080/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
