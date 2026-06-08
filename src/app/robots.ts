import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isAppHost } from "@/lib/routing/host-route";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");

  if (isAppHost(host)) {
    return {
      rules: { userAgent: "*", disallow: ["/"] },
      sitemap: "https://clearkorea.com/sitemap.xml",
    };
  }

  return {
    rules: { userAgent: "*", allow: ["/"], disallow: ["/app", "/admin"] },
    sitemap: "https://clearkorea.com/sitemap.xml",
  };
}
