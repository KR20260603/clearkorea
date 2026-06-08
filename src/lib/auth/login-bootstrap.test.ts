import { describe, expect, it, vi } from "vitest";
import { bootstrapUserOnLogin } from "./login-bootstrap";
import { createInMemoryUserProfileWriter } from "./profile-repository";
import { createInMemoryUserRoleRepository } from "./role-repository";
import type { ProviderIdentityDetails } from "./provider-identity";

const kakaoAdmin: ProviderIdentityDetails = {
  resolverProvider: "kakao",
  columnProvider: "kakao",
  subject: "1000001",
};

const naverMember: ProviderIdentityDetails = {
  resolverProvider: "custom:naver",
  columnProvider: "naver",
  subject: "naver-9",
};

describe("bootstrapUserOnLogin", () => {
  it("creates the profile and promotes an allowlisted admin on first login", async () => {
    const profiles = createInMemoryUserProfileWriter();
    const roles = createInMemoryUserRoleRepository();

    const result = await bootstrapUserOnLogin({
      authUserId: "auth-1",
      identity: kakaoAdmin,
      profiles,
      roles,
      env: { SUPER_ADMIN_PROVIDER_IDS: "", ADMIN_PROVIDER_IDS: "kakao:1000001" },
    });

    expect(result.created).toBe(true);
    expect(result.role).toMatchObject({ nextRole: "admin", changed: true });
    await expect(profiles.hasProfile("auth-1")).resolves.toBe(true);
    await expect(roles.getRole("auth-1")).resolves.toBe("admin");
  });

  it("does not recreate an existing profile but still reconciles the role", async () => {
    const profiles = createInMemoryUserProfileWriter(["auth-2"]);
    const roles = createInMemoryUserRoleRepository({ "auth-2": "admin" });
    const createProfile = vi.spyOn(profiles, "createProfile");

    const result = await bootstrapUserOnLogin({
      authUserId: "auth-2",
      identity: naverMember,
      profiles,
      roles,
      env: { SUPER_ADMIN_PROVIDER_IDS: "", ADMIN_PROVIDER_IDS: "" },
    });

    expect(createProfile).not.toHaveBeenCalled();
    expect(result.created).toBe(false);
    // The admin id was removed from the env, so the stale admin is demoted.
    expect(result.role).toMatchObject({ previousRole: "admin", nextRole: "user", changed: true });
    await expect(roles.getRole("auth-2")).resolves.toBe("user");
  });

  it("stores the normalized 'naver' column provider for a custom:naver identity", async () => {
    const profiles = createInMemoryUserProfileWriter();
    const createProfile = vi.spyOn(profiles, "createProfile");
    const roles = createInMemoryUserRoleRepository();

    await bootstrapUserOnLogin({
      authUserId: "auth-3",
      identity: naverMember,
      profiles,
      roles,
      nickname: "테스트별명12",
      env: { SUPER_ADMIN_PROVIDER_IDS: "custom:naver:naver-9", ADMIN_PROVIDER_IDS: "" },
    });

    expect(createProfile).toHaveBeenCalledWith({
      authUserId: "auth-3",
      nickname: "테스트별명12",
      oauthProvider: "naver",
      oauthSubject: "naver-9",
    });
    await expect(roles.getRole("auth-3")).resolves.toBe("super");
  });

  it("leaves a non-allowlisted member as a plain user", async () => {
    const profiles = createInMemoryUserProfileWriter();
    const roles = createInMemoryUserRoleRepository();

    const result = await bootstrapUserOnLogin({
      authUserId: "auth-4",
      identity: naverMember,
      profiles,
      roles,
      env: { SUPER_ADMIN_PROVIDER_IDS: "", ADMIN_PROVIDER_IDS: "" },
    });

    expect(result.role.nextRole).toBe("user");
    await expect(roles.getRole("auth-4")).resolves.toBe("user");
  });
});
