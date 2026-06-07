import { describe, expect, it, vi } from "vitest";
import {
  createInMemoryUserRoleRepository,
  createSupabaseUserRoleRepository,
} from "./role-repository";

describe("in-memory user role repository", () => {
  it("returns null for an unknown auth user", async () => {
    const repo = createInMemoryUserRoleRepository();
    await expect(repo.getRole("auth-unknown")).resolves.toBeNull();
  });

  it("persists and reads back a role and is idempotent", async () => {
    const repo = createInMemoryUserRoleRepository({ "auth-1": "user" });

    await expect(repo.setRole("auth-1", "admin")).resolves.toBe("admin");
    await expect(repo.getRole("auth-1")).resolves.toBe("admin");
    await expect(repo.setRole("auth-1", "admin")).resolves.toBe("admin");
    await expect(repo.getRole("auth-1")).resolves.toBe("admin");
  });

  it("persists demotion back to user", async () => {
    const repo = createInMemoryUserRoleRepository({ "auth-2": "super" });

    await expect(repo.setRole("auth-2", "user")).resolves.toBe("user");
    await expect(repo.getRole("auth-2")).resolves.toBe("user");
  });
});

describe("supabase-backed user role repository", () => {
  it("writes the role through the security definer rpc", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: "admin", error: null });
    const client = {
      rpc,
      from: vi.fn(),
    };

    const repo = createSupabaseUserRoleRepository(client);
    await expect(repo.setRole("auth-9", "admin")).resolves.toBe("admin");

    expect(rpc).toHaveBeenCalledWith("sync_user_role", {
      p_auth_user_id: "auth-9",
      p_role: "admin",
    });
  });

  it("reads the current role through a scoped users query", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { role: "super" }, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const client = {
      rpc: vi.fn(),
      from: vi.fn().mockReturnValue({ select }),
    };

    const repo = createSupabaseUserRoleRepository(client);

    await expect(repo.getRole("auth-9")).resolves.toBe("super");
    expect(client.from).toHaveBeenCalledWith("users");
    expect(select).toHaveBeenCalledWith("role");
    expect(eq).toHaveBeenCalledWith("auth_user_id", "auth-9");
  });

  it("throws when the rpc returns an error", async () => {
    const client = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "denied" } }),
      from: vi.fn(),
    };

    const repo = createSupabaseUserRoleRepository(client);
    await expect(repo.setRole("auth-9", "admin")).rejects.toThrow("denied");
  });
});
