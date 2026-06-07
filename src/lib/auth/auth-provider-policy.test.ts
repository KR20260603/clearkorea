import { describe, expect, it } from "vitest";
import { authProviders, getAuthProvider } from "./providers/registry";

describe("auth provider policy", () => {
  it("exposes exactly Kakao and Naver as production providers", () => {
    expect(authProviders.map((provider) => provider.id)).toEqual(["kakao", "naver"]);
  });

  it("never exposes Google or guest as a production provider", () => {
    const ids = authProviders.map((provider) => provider.id) as string[];

    expect(ids).not.toContain("google");
    expect(ids).not.toContain("guest");

    for (const provider of authProviders) {
      expect(provider.label.toLowerCase()).not.toContain("google");
      expect(provider.startPath).toBe(`/auth/${provider.id}`);
    }
  });

  it("resolves descriptors by id and rejects unknown providers", () => {
    expect(getAuthProvider("kakao")?.id).toBe("kakao");
    expect(getAuthProvider("naver")?.id).toBe("naver");
    expect(getAuthProvider("google")).toBeUndefined();
    expect(getAuthProvider("guest")).toBeUndefined();
  });
});
