import { describe, expect, it } from "vitest";
import manifest from "./manifest";
import { metadata } from "./layout";
import robots from "./robots";
import sitemap from "./sitemap";

describe("public SEO shell", () => {
  it("publishes bilingual landing metadata with OG image and hreflang", () => {
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        images: ["/og.png"],
        siteName: "ClearKorea",
      }),
    );
    expect(metadata.alternates).toEqual(
      expect.objectContaining({
        canonical: "/",
        languages: {
          en: "/",
          ko: "/ko",
        },
      }),
    );
  });

  it("serves robots rules that keep private app routes out of search", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/app", "/admin"],
      },
      sitemap: "https://clearkorea.com/sitemap.xml",
    });
  });

  it("serves public-only sitemap entries", () => {
    expect(sitemap()).toEqual([
      {
        url: "https://clearkorea.com/",
        lastModified: expect.any(Date),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: "https://clearkorea.com/ko",
        lastModified: expect.any(Date),
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ]);
  });

  it("serves the required ClearKorea PWA manifest", () => {
    expect(manifest()).toEqual(
      expect.objectContaining({
        name: "ClearKorea",
        short_name: "ClearKorea",
        theme_color: "#0A0A0A",
        background_color: "#0A0A0A",
        icons: expect.arrayContaining([
          expect.objectContaining({
            src: "/pwa-icon.png",
          }),
        ]),
      }),
    );
  });
});
