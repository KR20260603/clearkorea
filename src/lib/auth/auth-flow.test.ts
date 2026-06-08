import { describe, expect, it, vi } from "vitest";
import {
  buildProviderStartLocation,
  resolveCallbackRedirect,
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
      env: supabaseEnv,
    });

    expect(location.kind).toBe("redirect");
    if (location.kind !== "redirect") return;
    const url = new URL(location.url);
    expect(url.origin + url.pathname).toBe(
      "https://example.supabase.co/auth/v1/authorize",
    );
    expect(url.searchParams.get("provider")).toBe("kakao");
    expect(url.searchParams.get("redirect_to")).toBe(
      "http://127.0.0.1:3000/auth/callback",
    );
  });

  it("reports Kakao as unconfigured when Supabase env is missing", () => {
    expect(
      buildProviderStartLocation({
        provider: "kakao",
        origin: "http://127.0.0.1:3000",
        env: {},
      }).kind,
    ).toBe("unconfigured");
  });

  it("redirects Naver through the Supabase custom:naver authorize endpoint", () => {
    const location = buildProviderStartLocation({
      provider: "naver",
      origin: "http://127.0.0.1:3000",
      env: supabaseEnv,
    });

    expect(location.kind).toBe("redirect");
    if (location.kind !== "redirect") return;
    const url = new URL(location.url);
    expect(url.origin + url.pathname).toBe(
      "https://example.supabase.co/auth/v1/authorize",
    );
    expect(url.searchParams.get("provider")).toBe("custom:naver");
    expect(url.searchParams.get("redirect_to")).toBe(
      "http://127.0.0.1:3000/auth/callback",
    );
  });

  it("reports Naver as unconfigured when Supabase env is missing", () => {
    expect(
      buildProviderStartLocation({
        provider: "naver",
        origin: "http://127.0.0.1:3000",
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
    ).resolves.toBe("/");
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
