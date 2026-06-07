import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./project";

export type SupabaseClientResult =
  | { readonly status: "configured"; readonly client: SupabaseClient }
  | { readonly status: "unconfigured"; readonly client: null };

type SupabaseEnv = Readonly<Record<string, string | undefined>>;

export function createBrowserSupabaseClient(
  env: SupabaseEnv = process.env,
): SupabaseClientResult {
  const config = getSupabasePublicConfig(env);

  if (config.kind === "unconfigured") {
    return { status: "unconfigured", client: null };
  }

  return {
    status: "configured",
    client: createBrowserClient(config.projectUrl, config.publishableKey),
  };
}
