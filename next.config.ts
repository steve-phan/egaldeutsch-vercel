import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
  async rewrites() {
    // Only proxy during local development. 
    // In production, vercel.json handles routing /api/* to the single index.go serverless function.
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/account/:path*',
          destination: 'http://127.0.0.1:8080/api/account/:path*',
        },
        {
          source: '/api/quiz/:path*',
          destination: 'http://127.0.0.1:8080/api/quiz/:path*',
        },
        {
          source: '/api/admin/:path*',
          destination: 'http://127.0.0.1:8080/api/admin/:path*',
        },
        {
          source: '/api/dashboard/:path*',
          destination: 'http://127.0.0.1:8080/api/dashboard/:path*',
        },
        {
          source: '/api/user/:path*',
          destination: 'http://127.0.0.1:8080/api/user/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
