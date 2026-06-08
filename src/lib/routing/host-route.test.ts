import { describe, expect, it } from "vitest";
import { isAppHost, resolveHostRoute } from "./host-route";

describe("isAppHost", () => {
  it("detects the app subdomain across environments", () => {
    expect(isAppHost("app.clearkorea.com")).toBe(true);
    expect(isAppHost("app.localhost:3000")).toBe(true);
    expect(isAppHost("app.clearkorea.local:3000")).toBe(true);
    expect(isAppHost("APP.CLEARKOREA.COM")).toBe(true);
  });

  it("is false for apex / other hosts and empty values", () => {
    expect(isAppHost("clearkorea.com")).toBe(false);
    expect(isAppHost("localhost:3000")).toBe(false);
    expect(isAppHost("clearkorea.local:3000")).toBe(false);
    expect(isAppHost("apple.com")).toBe(false);
    expect(isAppHost("")).toBe(false);
    expect(isAppHost(null)).toBe(false);
    expect(isAppHost(undefined)).toBe(false);
  });
});

describe("resolveHostRoute", () => {
  it("rewrites app-host clean paths into the /app tree", () => {
    expect(resolveHostRoute({ host: "app.clearkorea.com", pathname: "/" })).toEqual({
      kind: "rewrite",
      to: "/app",
    });
    expect(
      resolveHostRoute({ host: "app.clearkorea.local:3000", pathname: "/today" }),
    ).toEqual({ kind: "rewrite", to: "/app/today" });
    expect(
      resolveHostRoute({ host: "app.clearkorea.com", pathname: "/stations" }),
    ).toEqual({ kind: "rewrite", to: "/app/stations" });
  });

  it("passes through excluded prefixes on the app host", () => {
    for (const pathname of [
      "/api/auth/naver/userinfo",
      "/auth/start",
      "/auth/callback",
      "/app",
      "/app/today",
      "/admin",
      "/_next/static/chunk.js",
    ]) {
      expect(resolveHostRoute({ host: "app.clearkorea.com", pathname })).toEqual({
        kind: "next",
      });
    }
  });

  it("passes through static file requests (dotted last segment) on the app host", () => {
    for (const pathname of [
      "/favicon.ico",
      "/og.png",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.webmanifest",
    ]) {
      expect(resolveHostRoute({ host: "app.clearkorea.com", pathname })).toEqual({
        kind: "next",
      });
    }
  });

  it("never rewrites on the apex / non-app hosts", () => {
    for (const host of ["clearkorea.com", "localhost:3000", "clearkorea.local:3000"]) {
      expect(resolveHostRoute({ host, pathname: "/" })).toEqual({ kind: "next" });
      expect(resolveHostRoute({ host, pathname: "/today" })).toEqual({ kind: "next" });
      expect(resolveHostRoute({ host, pathname: "/app/today" })).toEqual({
        kind: "next",
      });
    }
  });
});
