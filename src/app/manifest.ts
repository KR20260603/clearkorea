import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClearKorea",
    short_name: "ClearKorea",
    description:
      "A civic-tech platform for lawful participation and election transparency.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/pwa-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
