import { describe, expect, it } from "vitest";
import { resolveRoleForIdentity } from "./role-resolver";

const superEnv = {
  SUPER_ADMIN_PROVIDER_IDS: "kakao:1000001, custom:naver:2000002",
  ADMIN_PROVIDER_IDS: "kakao:3000003",
};

describe("role bootstrap from provider-qualified ids", () => {
  it("promotes a super admin when the provider-qualified id is allowlisted", () => {
    expect(
      resolveRoleForIdentity({ provider: "kakao", subject: "1000001" }, superEnv),
    ).toBe("super");
    expect(
      resolveRoleForIdentity(
        { provider: "custom:naver", subject: "2000002" },
        superEnv,
      ),
    ).toBe("super");
  });

  it("promotes an admin when only the admin allowlist matches", () => {
    expect(
      resolveRoleForIdentity({ provider: "kakao", subject: "3000003" }, superEnv),
    ).toBe("admin");
  });

  it("lets super outrank admin when an id appears in both lists", () => {
    expect(
      resolveRoleForIdentity(
        { provider: "custom:naver", subject: "9" },
        {
          SUPER_ADMIN_PROVIDER_IDS: "custom:naver:9",
          ADMIN_PROVIDER_IDS: "custom:naver:9",
        },
      ),
    ).toBe("super");
  });

  it("defaults to user and demotes when the id is removed from the env lists", () => {
    expect(
      resolveRoleForIdentity({ provider: "kakao", subject: "1000001" }, {
        SUPER_ADMIN_PROVIDER_IDS: "",
        ADMIN_PROVIDER_IDS: "",
      }),
    ).toBe("user");
    expect(
      resolveRoleForIdentity(
        { provider: "custom:naver", subject: "unlisted" },
        superEnv,
      ),
    ).toBe("user");
  });

  it("never promotes a bare email allowlist entry", () => {
    expect(
      resolveRoleForIdentity(
        { provider: "kakao", subject: "admin@example.com" },
        { SUPER_ADMIN_PROVIDER_IDS: "admin@example.com", ADMIN_PROVIDER_IDS: "" },
      ),
    ).toBe("user");
  });

  it("parses case-insensitive provider prefixes and tolerates whitespace", () => {
    expect(
      resolveRoleForIdentity(
        { provider: "kakao", subject: "777" },
        {
          SUPER_ADMIN_PROVIDER_IDS: "  Kakao:777 ,  CUSTOM:NAVER:888 ",
          ADMIN_PROVIDER_IDS: "",
        },
      ),
    ).toBe("super");
    expect(
      resolveRoleForIdentity(
        { provider: "custom:naver", subject: "888" },
        {
          SUPER_ADMIN_PROVIDER_IDS: "  Kakao:777 ,  CUSTOM:NAVER:888 ",
          ADMIN_PROVIDER_IDS: "",
        },
      ),
    ).toBe("super");
  });

  it("never elevates non-oauth providers such as dev guest fixtures", () => {
    expect(
      resolveRoleForIdentity({ provider: "dev_guest", subject: "1000001" }, {
        SUPER_ADMIN_PROVIDER_IDS: "dev_guest:1000001",
        ADMIN_PROVIDER_IDS: "",
      }),
    ).toBe("user");
  });

  it("does not promote a bare naver entry now that Naver is a custom provider", () => {
    expect(
      resolveRoleForIdentity(
        { provider: "naver", subject: "2000002" },
        { SUPER_ADMIN_PROVIDER_IDS: "naver:2000002", ADMIN_PROVIDER_IDS: "" },
      ),
    ).toBe("user");
  });
});
