import { describe, expect, it } from "vitest";
import { authorizeVoiceWrite } from "./voice-authorization";

describe("authorizeVoiceWrite", () => {
  it("allows a linked Kakao/Naver member to write", () => {
    expect(
      authorizeVoiceWrite({
        session: { authUserId: "auth-1" },
        env: { NODE_ENV: "production" },
      }),
    ).toEqual({ allowed: true, mode: "member" });
  });

  it("denies an unauthenticated visitor in production launch mode", () => {
    const result = authorizeVoiceWrite({
      session: null,
      env: { NODE_ENV: "production", CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true" },
    });

    expect(result.allowed).toBe(false);
    if (result.allowed) return;
    expect(result.reason).toMatch(/Kakao or Naver/);
  });

  it("allows the dev/test guest bypass only in non-production with the flag", () => {
    expect(
      authorizeVoiceWrite({
        session: null,
        env: { NODE_ENV: "development", CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true" },
      }),
    ).toEqual({ allowed: true, mode: "dev-guest" });

    expect(
      authorizeVoiceWrite({ session: null, env: { NODE_ENV: "development" } }).allowed,
    ).toBe(false);
  });
});
