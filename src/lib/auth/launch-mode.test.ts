import { describe, expect, it } from "vitest";
import { getLaunchMode } from "./launch-mode";

describe("launch mode single source of truth", () => {
  it("treats production as launch mode and never enables guest bypass there", () => {
    const result = getLaunchMode({
      NODE_ENV: "production",
      CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
    });

    expect(result.mode).toBe("production-launch");
    expect(result.guestBypassEnabled).toBe(false);
  });

  it("enables guest bypass only in non-production when the flag is exactly true", () => {
    const enabled = getLaunchMode({
      NODE_ENV: "development",
      CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
    });

    expect(enabled.mode).toBe("non-production");
    expect(enabled.guestBypassEnabled).toBe(true);
  });

  it("keeps guest bypass disabled in non-production when the flag is missing or not true", () => {
    expect(
      getLaunchMode({ NODE_ENV: "development" }).guestBypassEnabled,
    ).toBe(false);

    expect(
      getLaunchMode({
        NODE_ENV: "test",
        CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "false",
      }).guestBypassEnabled,
    ).toBe(false);

    expect(
      getLaunchMode({
        NODE_ENV: "development",
        CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "TRUE",
      }).guestBypassEnabled,
    ).toBe(false);
  });
});
