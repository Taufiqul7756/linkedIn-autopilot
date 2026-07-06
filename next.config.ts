import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Add image domains as needed
    ],
  },
};

export default nextConfig;
