import { describe, expect, it } from "vitest";
import { nicknamePattern } from "../nickname/nickname-contract";
import { resolveAppEntry, shouldGateAppRequest } from "./app-entry";

const launchEnv = { NODE_ENV: "production" };
const devBypassEnv = {
  NODE_ENV: "development",
  CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
};

describe("resolveAppEntry", () => {
  it("renders the local preview when Supabase is unconfigured", () => {
    expect(
      resolveAppEntry({ supabaseConfigured: false, session: null, env: launchEnv }),
    ).toEqual({ kind: "preview" });
  });

  it("issues an immutable Korean nickname for a linked member", () => {
    const first = resolveAppEntry({
      supabaseConfigured: true,
      session: { authUserId: "auth-member-1" },
      env: launchEnv,
    });
    const again = resolveAppEntry({
      supabaseConfigured: true,
      session: { authUserId: "auth-member-1" },
      env: launchEnv,
    });

    expect(first.kind).toBe("member");
    if (first.kind !== "member" || again.kind !== "member") return;
    expect(nicknamePattern.test(first.nickname)).toBe(true);
    expect(first.nickname).toBe(again.nickname);
  });

  it("issues a dev guest nickname only in non-production with the flag", () => {
    const decision = resolveAppEntry({
      supabaseConfigured: true,
      session: null,
      env: devBypassEnv,
      guestKey: "dev_guest:qa-1",
    });

    expect(decision.kind).toBe("dev-guest");
    if (decision.kind !== "dev-guest") return;
    expect(nicknamePattern.test(decision.nickname)).toBe(true);
  });

  it("redirects an unauthenticated visitor to the login surface in launch mode", () => {
    expect(
      resolveAppEntry({ supabaseConfigured: true, session: null, env: launchEnv }),
    ).toEqual({ kind: "redirect", to: "/auth/start" });
  });
});

describe("shouldGateAppRequest", () => {
  it("never gates when Supabase is unconfigured so local preview stays open", () => {
    expect(
      shouldGateAppRequest({ supabaseConfigured: false, hasSession: false, env: launchEnv }),
    ).toBe(false);
  });

  it("allows authenticated members through", () => {
    expect(
      shouldGateAppRequest({ supabaseConfigured: true, hasSession: true, env: launchEnv }),
    ).toBe(false);
  });

  it("redirects unauthenticated visitors in production launch mode", () => {
    expect(
      shouldGateAppRequest({ supabaseConfigured: true, hasSession: false, env: launchEnv }),
    ).toBe(true);
  });

  it("allows the dev guest bypass in non-production with the flag", () => {
    expect(
      shouldGateAppRequest({ supabaseConfigured: true, hasSession: false, env: devBypassEnv }),
    ).toBe(false);
  });
});
