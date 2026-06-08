import { describe, expect, it } from "vitest";
import { originFromRequest, resolveRequestOrigin } from "./request-origin";

describe("resolveRequestOrigin", () => {
  it("uses http for localhost and .local hosts", () => {
    expect(resolveRequestOrigin({ host: "localhost:3000" })).toBe(
      "http://localhost:3000",
    );
    expect(resolveRequestOrigin({ host: "app.clearkorea.local:3000" })).toBe(
      "http://app.clearkorea.local:3000",
    );
    expect(resolveRequestOrigin({ host: "app.localhost:3000" })).toBe(
      "http://app.localhost:3000",
    );
  });

  it("uses https for public hosts", () => {
    expect(resolveRequestOrigin({ host: "app.clearkorea.com" })).toBe(
      "https://app.clearkorea.com",
    );
    expect(resolveRequestOrigin({ host: "clearkorea.com" })).toBe(
      "https://clearkorea.com",
    );
  });

  it("prefers x-forwarded-host and x-forwarded-proto", () => {
    expect(
      resolveRequestOrigin({
        host: "internal.vercel.app",
        forwardedHost: "app.clearkorea.com",
        forwardedProto: "https",
      }),
    ).toBe("https://app.clearkorea.com");
  });

  it("takes the first value of comma-separated forwarded headers", () => {
    expect(
      resolveRequestOrigin({
        forwardedHost: "app.clearkorea.com, internal",
        forwardedProto: "https, http",
      }),
    ).toBe("https://app.clearkorea.com");
  });

  it("returns null when no host is available", () => {
    expect(resolveRequestOrigin({})).toBeNull();
    expect(resolveRequestOrigin({ host: null, forwardedHost: undefined })).toBeNull();
  });
});

describe("originFromRequest", () => {
  it("derives the origin from the request Host header", () => {
    const request = new Request("http://localhost:3000/auth/kakao", {
      headers: { host: "app.clearkorea.com" },
    });
    expect(originFromRequest(request)).toBe("https://app.clearkorea.com");
  });
});
