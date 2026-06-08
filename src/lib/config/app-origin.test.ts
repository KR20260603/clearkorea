import { describe, expect, it } from "vitest";
import { appAuthStartHref, resolveAppOrigin } from "./app-origin";

describe("app origin resolution", () => {
  it("is empty when NEXT_PUBLIC_APP_ORIGIN is unset", () => {
    expect(resolveAppOrigin({})).toBe("");
  });

  it("trims a configured app origin", () => {
    expect(
      resolveAppOrigin({ NEXT_PUBLIC_APP_ORIGIN: "  https://app.clearkorea.com  " }),
    ).toBe("https://app.clearkorea.com");
  });
});

describe("appAuthStartHref", () => {
  it("falls back to a relative path for single-host local dev", () => {
    expect(appAuthStartHref({})).toBe("/auth/start");
  });

  it("builds an absolute app-origin URL when configured", () => {
    expect(
      appAuthStartHref({ NEXT_PUBLIC_APP_ORIGIN: "https://app.clearkorea.com" }),
    ).toBe("https://app.clearkorea.com/auth/start");
  });
});
