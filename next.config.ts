import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.jamendo.com",
      },
      {
        protocol: "https",
        hostname: "**.dzcdn.net",
      },
    ],
  },
};

export default nextConfig;
