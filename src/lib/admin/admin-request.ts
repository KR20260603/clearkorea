import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { resolveCurrentAdmin, type AdminRoleClient, type CurrentAdmin } from "./current-role";

export type AdminContext = {
  readonly client: unknown;
  readonly admin: CurrentAdmin;
};

export async function readAdminContext(): Promise<AdminContext> {
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });
  const admin = await resolveCurrentAdmin(
    (client as unknown as AdminRoleClient | null) ?? null,
  );
  return { client, admin };
}
