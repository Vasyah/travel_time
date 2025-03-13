import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  // experimental: {
  //   // even if empty, pass an options object `{}` to the plugin
  //   swcPlugins: [["@effector/swc-plugin", {}]],
  // },
};

export default nextConfig;
