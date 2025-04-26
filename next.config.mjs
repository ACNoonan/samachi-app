// import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Add timestamp to CSS URLs in development to prevent caching
  webpack: (config, { dev }) => {
    if (dev) {
      config.output.devtoolModuleFilenameTemplate = (info) => {
        return `webpack:///${info.resourcePath}?t=${Date.now()}`;
      };
    }
    return config;
  },
};

export default nextConfig;
