import { describe, expect, it } from "vitest";
import { extractProviderIdentity } from "./provider-identity";

describe("extractProviderIdentity", () => {
  it("maps a Kakao login to the kakao resolver/column provider", () => {
    const user = {
      id: "uuid-supabase",
      app_metadata: { provider: "kakao", providers: ["kakao"] },
      user_metadata: { sub: "kakao-should-not-win" },
      identities: [
        {
          provider: "kakao",
          id: "4109876543",
          identity_data: { sub: "4109876543", name: "테스터" },
        },
      ],
    };

    expect(extractProviderIdentity(user)).toEqual({
      resolverProvider: "kakao",
      columnProvider: "kakao",
      subject: "4109876543",
    });
  });

  it("maps a Naver custom-provider login to custom:naver resolver but 'naver' column", () => {
    const user = {
      id: "uuid-supabase",
      app_metadata: { provider: "custom:naver", providers: ["custom:naver"] },
      user_metadata: { sub: "naver-meta" },
      identities: [
        {
          provider: "custom:naver",
          id: "identity-row-id",
          identity_data: { sub: "abc123naver" },
        },
      ],
    };

    expect(extractProviderIdentity(user)).toEqual({
      resolverProvider: "custom:naver",
      columnProvider: "naver",
      subject: "abc123naver",
    });
  });

  it("uses the identity id when identity_data.sub is absent", () => {
    const fromIdentityId = extractProviderIdentity({
      app_metadata: { provider: "kakao" },
      identities: [{ provider: "kakao", id: "999", identity_data: {} }],
    });
    expect(fromIdentityId?.subject).toBe("999");
  });

  it("never derives the allowlist subject from user-editable user_metadata", () => {
    // user_metadata is attacker-controllable via auth.updateUser, so a missing
    // provider identity must not fall back to it (privilege-escalation guard).
    const forged = extractProviderIdentity({
      app_metadata: { provider: "kakao" },
      user_metadata: { sub: "1000001", provider_id: "1000001" },
      identities: [],
    } as Parameters<typeof extractProviderIdentity>[0]);
    expect(forged).toBeNull();
  });

  it("recovers the provider from identities when app_metadata.provider is missing", () => {
    const user = {
      app_metadata: {},
      identities: [
        { provider: "custom:naver", id: "naver-1", identity_data: { sub: "naver-1" } },
      ],
    };
    expect(extractProviderIdentity(user)).toMatchObject({
      resolverProvider: "custom:naver",
      columnProvider: "naver",
      subject: "naver-1",
    });
  });

  it("returns null for unsupported providers and empty input", () => {
    expect(
      extractProviderIdentity({
        app_metadata: { provider: "google" },
        identities: [{ provider: "google", id: "g1", identity_data: { sub: "g1" } }],
      }),
    ).toBeNull();
    expect(extractProviderIdentity(null)).toBeNull();
    expect(extractProviderIdentity(undefined)).toBeNull();
    expect(
      extractProviderIdentity({ app_metadata: { provider: "kakao" }, identities: [] }),
    ).toBeNull();
  });
});
