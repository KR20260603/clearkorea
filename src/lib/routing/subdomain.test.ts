import { describe, expect, it } from "vitest";
import { adminOriginForHost, appOriginForHost, isAdminHost } from "./subdomain";

const noEnv = {} as Readonly<Record<string, string | undefined>>;

describe("isAdminHost", () => {
  it("matches only the admin subdomain", () => {
    expect(isAdminHost("admin.clearkorea.com")).toBe(true);
    expect(isAdminHost("admin.clearkorea.local:3000")).toBe(true);
    expect(isAdminHost("ADMIN.clearkorea.com")).toBe(true);
    expect(isAdminHost("app.clearkorea.com")).toBe(false);
    expect(isAdminHost("clearkorea.com")).toBe(false);
    expect(isAdminHost(null)).toBe(false);
    expect(isAdminHost(undefined)).toBe(false);
  });
});

describe("appOriginForHost / adminOriginForHost (derived)", () => {
  it("derives sibling origins from a production host", () => {
    expect(appOriginForHost("admin.clearkorea.com", noEnv)).toBe(
      "https://app.clearkorea.com",
    );
    expect(adminOriginForHost("app.clearkorea.com", noEnv)).toBe(
      "https://admin.clearkorea.com",
    );
    expect(adminOriginForHost("clearkorea.com", noEnv)).toBe(
      "https://admin.clearkorea.com",
    );
    expect(adminOriginForHost("www.clearkorea.com", noEnv)).toBe(
      "https://admin.clearkorea.com",
    );
  });

  it("keeps http and the port for local hosts", () => {
    expect(appOriginForHost("admin.clearkorea.local:3000", noEnv)).toBe(
      "http://app.clearkorea.local:3000",
    );
    expect(adminOriginForHost("app.clearkorea.local:3000", noEnv)).toBe(
      "http://admin.clearkorea.local:3000",
    );
  });
});

describe("appOriginForHost / adminOriginForHost (env override)", () => {
  it("prefers the explicit origin env and strips trailing slashes", () => {
    expect(
      appOriginForHost("admin.clearkorea.com", {
        NEXT_PUBLIC_APP_ORIGIN: "https://app.clearkorea.com/",
      }),
    ).toBe("https://app.clearkorea.com");
    expect(
      adminOriginForHost("anything", {
        NEXT_PUBLIC_ADMIN_ORIGIN: "https://admin.clearkorea.com",
      }),
    ).toBe("https://admin.clearkorea.com");
  });

  it("returns null when neither env nor host is available", () => {
    expect(appOriginForHost(null, noEnv)).toBeNull();
    expect(adminOriginForHost(undefined, noEnv)).toBeNull();
  });
});
