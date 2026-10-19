import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pandino/ai", "@pandino/export-html", "@pandino/export-wp", "@pandino/recipes", "@pandino/renderer", "@pandino/schema", "@pandino/theme"],
  outputFileTracingIncludes: {
    "/api/export": ["./app/site.css"],
  },
};

export default nextConfig;
