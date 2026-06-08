import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./project";
import { resolveCookieDomain } from "./cookie-domain";

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

  // Client-side token refreshes rewrite the auth cookies; scope them to the same
  // shared parent domain the server uses so the app/admin subdomains stay in
  // sync (host-only on localhost, where resolveCookieDomain returns undefined).
  const cookieDomain =
    typeof window !== "undefined"
      ? resolveCookieDomain(window.location.hostname)
      : undefined;

  return {
    status: "configured",
    client: createBrowserClient(config.projectUrl, config.publishableKey, {
      ...(cookieDomain ? { cookieOptions: { domain: cookieDomain } } : {}),
    }),
  };
}
