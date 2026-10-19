import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pandino/ai", "@pandino/recipes", "@pandino/renderer", "@pandino/schema", "@pandino/theme"],
};

export default nextConfig;
