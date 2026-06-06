import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/assets/"],
      disallow: ["/app", "/admin"],
    },
    sitemap: "https://clearkorea.com/sitemap.xml",
  };
}
