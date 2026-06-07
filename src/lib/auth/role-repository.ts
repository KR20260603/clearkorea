import type { AppRole, ManagedRole } from "./roles";

export interface UserRoleRepository {
  getRole(authUserId: string): Promise<AppRole | null>;
  setRole(authUserId: string, role: ManagedRole): Promise<AppRole>;
}

export function createInMemoryUserRoleRepository(
  seed: Readonly<Record<string, AppRole>> = {},
): UserRoleRepository {
  const store = new Map<string, AppRole>(Object.entries(seed));

  return {
    async getRole(authUserId) {
      return store.get(authUserId) ?? null;
    },
    async setRole(authUserId, role) {
      store.set(authUserId, role);
      return role;
    },
  };
}

type RoleQueryResult<T> = PromiseLike<{
  data: T | null;
  error: { message: string } | null;
}>;

export type ServiceRoleClient = {
  rpc(
    name: "sync_user_role",
    params: { p_auth_user_id: string; p_role: ManagedRole },
  ): RoleQueryResult<AppRole>;
  from(table: "users"): {
    select(columns: "role"): {
      eq(
        column: "auth_user_id",
        value: string,
      ): {
        maybeSingle(): RoleQueryResult<{ role: AppRole }>;
      };
    };
  };
};

export function createSupabaseUserRoleRepository(
  client: ServiceRoleClient,
): UserRoleRepository {
  return {
    async getRole(authUserId) {
      const { data, error } = await client
        .from("users")
        .select("role")
        .eq("auth_user_id", authUserId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return data?.role ?? null;
    },
    async setRole(authUserId, role) {
      const { data, error } = await client.rpc("sync_user_role", {
        p_auth_user_id: authUserId,
        p_role: role,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data ?? role;
    },
  };
}
