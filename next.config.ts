import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-98437235b1ce4975939ba223285667c4.r2.dev',
      },
    ],
  },
};

export default nextConfig;
