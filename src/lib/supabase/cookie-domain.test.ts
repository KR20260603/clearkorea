import { describe, expect, it } from "vitest";
import { resolveCookieDomain } from "./cookie-domain";

describe("resolveCookieDomain", () => {
  it("scopes production app and admin hosts to the shared parent domain", () => {
    expect(resolveCookieDomain("app.clearkorea.com")).toBe(".clearkorea.com");
    expect(resolveCookieDomain("admin.clearkorea.com")).toBe(".clearkorea.com");
    expect(resolveCookieDomain("clearkorea.com")).toBe(".clearkorea.com");
    expect(resolveCookieDomain("www.clearkorea.com")).toBe(".clearkorea.com");
  });

  it("scopes the local cross-subdomain hosts to the .local parent", () => {
    expect(resolveCookieDomain("app.clearkorea.local:3000")).toBe(
      ".clearkorea.local",
    );
    expect(resolveCookieDomain("admin.clearkorea.local:3000")).toBe(
      ".clearkorea.local",
    );
    expect(resolveCookieDomain("clearkorea.local")).toBe(".clearkorea.local");
  });

  it("ignores the port and is case-insensitive", () => {
    expect(resolveCookieDomain("APP.ClearKorea.com:443")).toBe(
      ".clearkorea.com",
    );
  });

  it("stays host-only for localhost, raw IPs, and unrelated hosts", () => {
    expect(resolveCookieDomain("localhost:3000")).toBeUndefined();
    expect(resolveCookieDomain("127.0.0.1:3000")).toBeUndefined();
    expect(resolveCookieDomain("example.com")).toBeUndefined();
    expect(resolveCookieDomain("notclearkorea.com")).toBeUndefined();
    expect(resolveCookieDomain(null)).toBeUndefined();
    expect(resolveCookieDomain(undefined)).toBeUndefined();
    expect(resolveCookieDomain("")).toBeUndefined();
  });

  it("does not match a look-alike suffix without a dot boundary", () => {
    expect(resolveCookieDomain("evilclearkorea.com")).toBeUndefined();
  });
});
