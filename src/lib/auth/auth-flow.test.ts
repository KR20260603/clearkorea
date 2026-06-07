import { describe, expect, it, vi } from "vitest";
import {
  buildProviderStartLocation,
  resolveCallbackRedirect,
  resolveNaverCallback,
} from "./auth-flow";

const supabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

describe("buildProviderStartLocation", () => {
  it("redirects Kakao through the Supabase built-in authorize endpoint", () => {
    const location = buildProviderStartLocation({
      provider: "kakao",
      origin: "http://127.0.0.1:3000",
      state: "unused",
      env: supabaseEnv,
    });

    expect(location.kind).toBe("redirect");
    if (location.kind !== "redirect") return;
    const url = new URL(location.url);
    expect(url.origin + url.pathname).toBe("https://example.supabase.co/auth/v1/authorize");
    expect(url.searchParams.get("provider")).toBe("kakao");
    expect(url.searchParams.get("redirect_to")).toBe("http://127.0.0.1:3000/auth/callback");
  });

  it("reports Kakao as unconfigured when Supabase env is missing", () => {
    expect(
      buildProviderStartLocation({
        provider: "kakao",
        origin: "http://127.0.0.1:3000",
        state: "unused",
        env: {},
      }).kind,
    ).toBe("unconfigured");
  });

  it("redirects Naver to its custom authorize endpoint with state", () => {
    const location = buildProviderStartLocation({
      provider: "naver",
      origin: "http://127.0.0.1:3000",
      state: "state-123",
      env: { SUPABASE_AUTH_NAVER_CLIENT_ID: "naver-public-id" },
    });

    expect(location.kind).toBe("redirect");
    if (location.kind !== "redirect") return;
    expect(location.state).toBe("state-123");
    const url = new URL(location.url);
    expect(url.origin + url.pathname).toBe("https://nid.naver.com/oauth2.0/authorize");
    expect(url.searchParams.get("state")).toBe("state-123");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://127.0.0.1:3000/auth/naver/callback",
    );
  });

  it("reports Naver as unconfigured when its client id is missing", () => {
    expect(
      buildProviderStartLocation({
        provider: "naver",
        origin: "http://127.0.0.1:3000",
        state: "state-123",
        env: {},
      }).kind,
    ).toBe("unconfigured");
  });
});

describe("resolveCallbackRedirect", () => {
  it("sends the user to the app after a successful code exchange", async () => {
    const exchanger = {
      auth: { exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }) },
    };

    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger }),
    ).resolves.toBe("/app");
    expect(exchanger.auth.exchangeCodeForSession).toHaveBeenCalledWith("auth-code");
  });

  it("redirects to a safe error when there is no code", async () => {
    await expect(
      resolveCallbackRedirect({ code: null, exchanger: null }),
    ).resolves.toBe("/?auth=error");
  });

  it("redirects to a safe notice when Supabase is unconfigured", async () => {
    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger: null }),
    ).resolves.toBe("/?auth=unavailable");
  });

  it("redirects to a safe error when the exchange fails", async () => {
    const exchanger = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: { message: "bad" } }),
      },
    };

    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger }),
    ).resolves.toBe("/?auth=error");
  });
});

describe("resolveNaverCallback", () => {
  it("rejects a missing or mismatched state to block CSRF", async () => {
    const bridge = { link: vi.fn() };
    await expect(
      resolveNaverCallback({ code: "c", state: "a", expectedState: "b", bridge }),
    ).resolves.toBe("/?auth=error");
    await expect(
      resolveNaverCallback({ code: "c", state: null, expectedState: "b", bridge }),
    ).resolves.toBe("/?auth=error");
    await expect(
      resolveNaverCallback({ code: "c", state: "a", expectedState: null, bridge }),
    ).resolves.toBe("/?auth=error");
    expect(bridge.link).not.toHaveBeenCalled();
  });

  it("links the account when the bridge succeeds and state matches", async () => {
    const bridge = { link: vi.fn().mockResolvedValue("linked" as const) };
    await expect(
      resolveNaverCallback({ code: "c", state: "x", expectedState: "x", bridge }),
    ).resolves.toBe("/app");
  });

  it("shows a safe notice when the bridge is unconfigured or unavailable", async () => {
    await expect(
      resolveNaverCallback({ code: "c", state: "x", expectedState: "x", bridge: null }),
    ).resolves.toBe("/?auth=unavailable");
    const unavailable = { link: vi.fn().mockResolvedValue("unavailable" as const) };
    await expect(
      resolveNaverCallback({ code: "c", state: "x", expectedState: "x", bridge: unavailable }),
    ).resolves.toBe("/?auth=unavailable");
  });

  it("returns a safe error when the bridge fails", async () => {
    const bridge = { link: vi.fn().mockResolvedValue("failed" as const) };
    await expect(
      resolveNaverCallback({ code: "c", state: "x", expectedState: "x", bridge }),
    ).resolves.toBe("/?auth=error");
  });
});
