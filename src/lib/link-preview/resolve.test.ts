import { describe, expect, it, vi } from "vitest";
import { resolveLinkPreview } from "./resolve";

function htmlResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

describe("resolveLinkPreview", () => {
  it("resolves a preview from safe public HTML", async () => {
    const fetchImpl = vi.fn(async () =>
      htmlResponse(
        `<html><head><title>T</title><meta property="og:title" content="Hello" /><meta property="og:image" content="https://cdn.example.com/i.jpg" /></head></html>`,
      ),
    );

    const result = await resolveLinkPreview({
      url: "https://example.com/post",
      fetchImpl,
    });

    expect(result.kind).toBe("resolved");
    if (result.kind === "resolved") {
      expect(result.preview.title).toBe("Hello");
      expect(result.preview.imageUrl).toBe("https://cdn.example.com/i.jpg");
    }
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("marks private/unsafe URLs as unsupported without fetching", async () => {
    const fetchImpl = vi.fn();

    const result = await resolveLinkPreview({
      url: "http://169.254.169.254/latest",
      fetchImpl,
    });

    expect(result.kind).toBe("unsupported");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("marks non-html responses as unsupported", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
    );

    const result = await resolveLinkPreview({
      url: "https://example.com/data.json",
      fetchImpl,
    });

    expect(result.kind).toBe("unsupported");
  });

  it("marks fetch failures as unsupported and never throws", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network down");
    });

    const result = await resolveLinkPreview({
      url: "https://example.com/post",
      fetchImpl,
    });

    expect(result.kind).toBe("unsupported");
  });

  it("marks oversized bodies as unsupported", async () => {
    const huge = "a".repeat(600_000);
    const fetchImpl = vi.fn(async () => htmlResponse(`<title>X</title>${huge}`));

    const result = await resolveLinkPreview({
      url: "https://example.com/post",
      fetchImpl,
      maxBytes: 512_000,
    });

    expect(result.kind).toBe("unsupported");
  });

  it("blocks redirects so a public URL cannot bounce to a private host (SSRF)", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(null, {
        status: 302,
        headers: { location: "http://169.254.169.254/latest" },
      }),
    );

    const result = await resolveLinkPreview({
      url: "https://example.com/post",
      fetchImpl,
    });

    expect(result.kind).toBe("unsupported");
  });

  it("rejects an oversized response declared by content-length without reading it", async () => {
    let read = false;
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      type: "default",
      headers: new Headers({
        "content-type": "text/html",
        "content-length": "5000000",
      }),
      text: async () => {
        read = true;
        return "<title>X</title>";
      },
      body: null,
    }) as unknown as Response);

    const result = await resolveLinkPreview({
      url: "https://example.com/post",
      fetchImpl,
      maxBytes: 512_000,
    });

    expect(result.kind).toBe("unsupported");
    expect(read).toBe(false);
  });

  it("requests the URL with redirects disabled", async () => {
    let manual = false;
    const fetchImpl = vi.fn(async (_url: string, init?: { redirect?: string }) => {
      manual = init?.redirect === "manual";
      return htmlResponse("<title>OK</title>");
    });

    await resolveLinkPreview({ url: "https://example.com/post", fetchImpl });
    expect(manual).toBe(true);
  });
});
