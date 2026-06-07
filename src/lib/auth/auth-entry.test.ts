import { describe, expect, it } from "vitest";
import { devGuestStartPath, getAuthEntryChoices } from "./auth-entry";

describe("getAuthEntryChoices", () => {
  it("always offers exactly Kakao and Naver and never Google", () => {
    const choices = getAuthEntryChoices({ NODE_ENV: "production" });

    expect(choices.providers.map((provider) => provider.id)).toEqual(["kakao", "naver"]);
    expect(choices.providers.map((provider) => provider.id)).not.toContain("google");
  });

  it("hides the dev guest entry in production launch mode even with the flag", () => {
    const choices = getAuthEntryChoices({
      NODE_ENV: "production",
      CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
    });

    expect(choices.devGuest.enabled).toBe(false);
    expect(choices.devGuest.path).toBe(devGuestStartPath);
  });

  it("exposes the dev guest entry only in non-production with the explicit flag", () => {
    expect(
      getAuthEntryChoices({
        NODE_ENV: "development",
        CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
      }).devGuest.enabled,
    ).toBe(true);

    expect(
      getAuthEntryChoices({ NODE_ENV: "development" }).devGuest.enabled,
    ).toBe(false);
  });
});
