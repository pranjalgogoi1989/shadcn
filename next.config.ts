import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.in",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
