import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** Каталог цього Next-проєкту (ігнорує батьківський `voxera-live/package-lock.json`). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.gstatic.com" },
    ],
  },
};

export default nextConfig;
