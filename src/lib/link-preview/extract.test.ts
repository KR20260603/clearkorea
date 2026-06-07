import { describe, expect, it } from "vitest";
import { extractLinkPreview } from "./extract";

const requestUrl = "https://news.example.com/articles/election-transparency";

describe("extractLinkPreview", () => {
  it("prefers OpenGraph metadata when present", () => {
    const html = `
      <html><head>
        <title>Fallback Title</title>
        <meta property="og:title" content="Election transparency explained" />
        <meta property="og:site_name" content="Example News" />
        <meta property="og:image" content="https://cdn.example.com/cover.jpg" />
        <meta name="description" content="A summary of the coverage." />
      </head><body>ignored</body></html>`;

    const preview = extractLinkPreview(html, requestUrl);

    expect(preview).not.toBeNull();
    expect(preview?.title).toBe("Election transparency explained");
    expect(preview?.siteName).toBe("Example News");
    expect(preview?.imageUrl).toBe("https://cdn.example.com/cover.jpg");
    expect(preview?.url).toBe(requestUrl);
  });

  it("falls back to the document title and host when OG tags are missing", () => {
    const html = `<html><head><title>Bare Title</title></head><body>x</body></html>`;

    const preview = extractLinkPreview(html, requestUrl);

    expect(preview?.title).toBe("Bare Title");
    expect(preview?.siteName).toBe("news.example.com");
    expect(preview?.imageUrl).toBeNull();
  });

  it("ignores non-public OG image URLs to avoid SSRF via thumbnails", () => {
    const html = `
      <html><head>
        <title>Risky</title>
        <meta property="og:image" content="http://169.254.169.254/secret.png" />
      </head><body>x</body></html>`;

    const preview = extractLinkPreview(html, requestUrl);

    expect(preview?.imageUrl).toBeNull();
  });

  it("returns null when there is no usable title", () => {
    const html = `<html><head></head><body>nothing</body></html>`;
    expect(extractLinkPreview(html, requestUrl)).toBeNull();
  });

  it("does not execute or return script content", () => {
    const html = `
      <html><head>
        <title>Safe</title>
        <script>window.__pwned = true;</script>
      </head><body><script>alert(1)</script></body></html>`;

    const preview = extractLinkPreview(html, requestUrl);

    expect(preview?.title).toBe("Safe");
    expect(JSON.stringify(preview)).not.toContain("__pwned");
    expect(JSON.stringify(preview)).not.toContain("alert(1)");
  });
});
