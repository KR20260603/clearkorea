import { describe, expect, it } from "vitest";
import {
  appHostForRedirect,
  collapseSlashes,
  isAppHost,
  resolveAdminHostRoute,
  resolveHostRoute,
} from "./host-route";

describe("collapseSlashes", () => {
  it("collapses repeated slashes to a single slash", () => {
    expect(collapseSlashes("//auth/start")).toBe("/auth/start");
    expect(collapseSlashes("/app//today")).toBe("/app/today");
    expect(collapseSlashes("///")).toBe("/");
  });

  it("leaves already-normalized paths unchanged", () => {
    expect(collapseSlashes("/")).toBe("/");
    expect(collapseSlashes("/auth/start")).toBe("/auth/start");
    expect(collapseSlashes("/app/today")).toBe("/app/today");
  });
});

describe("isAppHost", () => {
  it("detects the app subdomain across environments", () => {
    expect(isAppHost("app.clearkorea.com")).toBe(true);
    expect(isAppHost("app.localhost:3000")).toBe(true);
    expect(isAppHost("app.clearkorea.local:3000")).toBe(true);
    expect(isAppHost("APP.CLEARKOREA.COM")).toBe(true);
  });

  it("is false for apex / other hosts and empty values", () => {
    expect(isAppHost("clearkorea.com")).toBe(false);
    expect(isAppHost("www.clearkorea.com")).toBe(false);
    expect(isAppHost("localhost:3000")).toBe(false);
    expect(isAppHost("clearkorea.local:3000")).toBe(false);
    expect(isAppHost("apple.com")).toBe(false);
    expect(isAppHost("")).toBe(false);
    expect(isAppHost(null)).toBe(false);
    expect(isAppHost(undefined)).toBe(false);
  });
});

describe("appHostForRedirect", () => {
  it("derives the app subdomain from apex / www hosts, preserving port", () => {
    expect(appHostForRedirect("clearkorea.com")).toBe("app.clearkorea.com");
    expect(appHostForRedirect("www.clearkorea.com")).toBe("app.clearkorea.com");
    expect(appHostForRedirect("clearkorea.local:3000")).toBe(
      "app.clearkorea.local:3000",
    );
    expect(appHostForRedirect("localhost:3000")).toBe("app.localhost:3000");
  });

  it("does not double-prefix an already-app host and is null for empty", () => {
    expect(appHostForRedirect("app.clearkorea.com")).toBe("app.clearkorea.com");
    expect(appHostForRedirect(null)).toBeNull();
    expect(appHostForRedirect(undefined)).toBeNull();
  });
});

describe("resolveHostRoute on the app host", () => {
  it("rewrites clean paths into the /app tree", () => {
    expect(resolveHostRoute({ host: "app.clearkorea.com", pathname: "/" })).toEqual({
      kind: "rewrite",
      to: "/app",
    });
    expect(
      resolveHostRoute({ host: "app.clearkorea.local:3000", pathname: "/today" }),
    ).toEqual({ kind: "rewrite", to: "/app/today" });
  });

  it("passes through excluded prefixes and static files", () => {
    for (const pathname of [
      "/api/auth/naver/userinfo",
      "/auth/start",
      "/app",
      "/app/today",
      "/admin",
      "/_next/static/chunk.js",
      "/favicon.ico",
      "/robots.txt",
    ]) {
      expect(resolveHostRoute({ host: "app.clearkorea.com", pathname })).toEqual({
        kind: "next",
      });
    }
  });
});

describe("resolveHostRoute on the apex / www host", () => {
  it("forces auth routes to the app subdomain", () => {
    for (const host of ["clearkorea.com", "www.clearkorea.com", "clearkorea.local:3000"]) {
      expect(resolveHostRoute({ host, pathname: "/auth/start" })).toEqual({
        kind: "redirect-to-app",
        path: "/auth/start",
      });
      expect(resolveHostRoute({ host, pathname: "/auth/callback" })).toEqual({
        kind: "redirect-to-app",
        path: "/auth/callback",
      });
    }
  });

  it("forces legacy /app paths to the app subdomain as clean URLs", () => {
    expect(resolveHostRoute({ host: "clearkorea.com", pathname: "/app" })).toEqual({
      kind: "redirect-to-app",
      path: "/",
    });
    expect(
      resolveHostRoute({ host: "clearkorea.com", pathname: "/app/today" }),
    ).toEqual({ kind: "redirect-to-app", path: "/today" });
  });

  it("serves landing and marketing routes normally", () => {
    for (const pathname of ["/", "/ko", "/today", "/stations"]) {
      expect(resolveHostRoute({ host: "clearkorea.com", pathname })).toEqual({
        kind: "next",
      });
    }
  });
});

describe("resolveAdminHostRoute", () => {
  const appLoginUrl = "https://app.clearkorea.com/auth/start";

  it("redirects an unauthenticated visitor to the app-subdomain login", () => {
    expect(
      resolveAdminHostRoute({
        pathname: "/",
        supabaseConfigured: true,
        hasSession: false,
        appLoginUrl,
      }),
    ).toEqual({ kind: "redirect", to: appLoginUrl });
  });

  it("rewrites the admin host root to the /admin tree for a session", () => {
    expect(
      resolveAdminHostRoute({
        pathname: "/",
        supabaseConfigured: true,
        hasSession: true,
        appLoginUrl,
      }),
    ).toEqual({ kind: "rewrite", to: "/admin" });
  });

  it("maps nested admin-host paths into the /admin tree", () => {
    expect(
      resolveAdminHostRoute({
        pathname: "/settings",
        supabaseConfigured: true,
        hasSession: true,
        appLoginUrl,
      }),
    ).toEqual({ kind: "rewrite", to: "/admin/settings" });
  });

  it("passes through paths already under /admin", () => {
    for (const pathname of ["/admin", "/admin/queues"]) {
      expect(
        resolveAdminHostRoute({
          pathname,
          supabaseConfigured: true,
          hasSession: true,
          appLoginUrl,
        }),
      ).toEqual({ kind: "next" });
    }
  });

  it("does not gate when Supabase is unconfigured (local/dev), it just rewrites", () => {
    expect(
      resolveAdminHostRoute({
        pathname: "/",
        supabaseConfigured: false,
        hasSession: false,
        appLoginUrl,
      }),
    ).toEqual({ kind: "rewrite", to: "/admin" });
  });

  it("falls back to a rewrite when the app login origin cannot be derived", () => {
    expect(
      resolveAdminHostRoute({
        pathname: "/",
        supabaseConfigured: true,
        hasSession: false,
        appLoginUrl: null,
      }),
    ).toEqual({ kind: "rewrite", to: "/admin" });
  });
});
