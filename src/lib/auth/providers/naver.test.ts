import { describe, expect, it } from "vitest";
import { buildNaverAuthorizationUrl, naverProvider } from "./naver";

describe("naver custom provider", () => {
  it("exposes provider metadata", () => {
    expect(naverProvider).toEqual({
      id: "naver",
      label: "Continue with Naver",
      startPath: "/auth/naver",
    });
  });

  it("builds the Supabase authorize URL for the custom:naver provider", () => {
    const url = new URL(
      buildNaverAuthorizationUrl({
        supabaseUrl: "https://example.supabase.co",
        redirectTo: "http://127.0.0.1:3000/auth/callback",
      }),
    );

    expect(url.origin + url.pathname).toBe(
      "https://example.supabase.co/auth/v1/authorize",
    );
    expect(url.searchParams.get("provider")).toBe("custom:naver");
    expect(url.searchParams.get("redirect_to")).toBe(
      "http://127.0.0.1:3000/auth/callback",
    );
  });
});
