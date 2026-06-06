import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-06T00:00:00.000Z");

  return [
    {
      url: "https://clearkorea.com/",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://clearkorea.com/ko",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
