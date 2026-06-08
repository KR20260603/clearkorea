import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./project";

type SupabaseEnv = Readonly<Record<string, string | undefined>>;

export type ServiceRoleClientResult =
  | { readonly status: "configured"; readonly client: SupabaseClient }
  | { readonly status: "unconfigured"; readonly client: null };

// Server-only Supabase client backed by the service-role key. It bypasses RLS,
// so it must never be exposed to the browser or used to act on behalf of an
// unauthenticated request. It is used only by trusted server flows (login
// bootstrap: ensure the public.users row + sync the managed role via the
// security-definer rpc).
export function createServiceRoleSupabaseClient(
  env: SupabaseEnv = process.env,
): ServiceRoleClientResult {
  const config = getSupabasePublicConfig(env);
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    config.kind === "unconfigured" ||
    serviceRoleKey === undefined ||
    serviceRoleKey.trim() === ""
  ) {
    return { status: "unconfigured", client: null };
  }

  return {
    status: "configured",
    client: createClient(config.projectUrl, serviceRoleKey.trim(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }),
  };
}
