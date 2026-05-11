import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voxera.live",
    short_name: "Voxera",
    description: "The world, as it happens.",
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/vercel.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
  };
}
