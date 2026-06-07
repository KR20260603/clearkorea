import type { AppRole } from "@/lib/auth/roles";

type RoleQuery = PromiseLike<{
  data: { role: AppRole } | null;
  error: { message: string } | null;
}>;

export type AdminRoleClient = {
  auth: { getUser(): PromiseLike<{ data: { user: { id: string } | null } }> };
  from(table: "users"): {
    select(columns: "role"): {
      eq(column: "auth_user_id", value: string): {
        maybeSingle(): RoleQuery;
      };
    };
  };
};

export type CurrentAdmin = {
  readonly role: AppRole;
  readonly authUserId: string | null;
};

export async function resolveCurrentAdmin(
  client: AdminRoleClient | null,
): Promise<CurrentAdmin> {
  if (!client) {
    return { role: "user", authUserId: null };
  }
  const { data } = await client.auth.getUser();
  const authUserId = data.user?.id ?? null;
  if (!authUserId) {
    return { role: "user", authUserId: null };
  }
  const result = await client
    .from("users")
    .select("role")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  return { role: result.data?.role ?? "user", authUserId };
}
