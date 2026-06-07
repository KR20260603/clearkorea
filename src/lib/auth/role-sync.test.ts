import { describe, expect, it, vi } from "vitest";
import { createInMemoryUserRoleRepository } from "./role-repository";
import { syncRoleOnLogin } from "./role-sync";

const adminEnv = {
  SUPER_ADMIN_PROVIDER_IDS: "",
  ADMIN_PROVIDER_IDS: "kakao:admin-1",
};

describe("syncRoleOnLogin", () => {
  it("promotes a newly allowlisted admin and persists the change", async () => {
    const repository = createInMemoryUserRoleRepository({ "auth-1": "user" });

    const result = await syncRoleOnLogin({
      authUserId: "auth-1",
      identity: { provider: "kakao", subject: "admin-1" },
      repository,
      env: adminEnv,
    });

    expect(result).toMatchObject({ previousRole: "user", nextRole: "admin", changed: true });
    await expect(repository.getRole("auth-1")).resolves.toBe("admin");
  });

  it("demotes a removed admin on the next login", async () => {
    const repository = createInMemoryUserRoleRepository({ "auth-2": "admin" });

    const result = await syncRoleOnLogin({
      authUserId: "auth-2",
      identity: { provider: "kakao", subject: "no-longer-admin" },
      repository,
      env: adminEnv,
    });

    expect(result).toMatchObject({ previousRole: "admin", nextRole: "user", changed: true });
    await expect(repository.getRole("auth-2")).resolves.toBe("user");
  });

  it("is a no-op when the resolved role already matches", async () => {
    const repository = createInMemoryUserRoleRepository({ "auth-3": "user" });
    const setRole = vi.spyOn(repository, "setRole");

    const result = await syncRoleOnLogin({
      authUserId: "auth-3",
      identity: { provider: "kakao", subject: "regular" },
      repository,
      env: adminEnv,
    });

    expect(result.changed).toBe(false);
    expect(setRole).not.toHaveBeenCalled();
  });

  it("never promotes a bare email allowlist entry", async () => {
    const repository = createInMemoryUserRoleRepository({ "auth-4": "user" });

    const result = await syncRoleOnLogin({
      authUserId: "auth-4",
      identity: { provider: "kakao", subject: "person@example.com" },
      repository,
      env: { SUPER_ADMIN_PROVIDER_IDS: "person@example.com", ADMIN_PROVIDER_IDS: "" },
    });

    expect(result.nextRole).toBe("user");
    expect(result.changed).toBe(false);
  });
});
