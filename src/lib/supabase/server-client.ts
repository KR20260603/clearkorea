import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./project";
import type { SupabaseClientResult } from "./browser-client";

type SupabaseEnv = Readonly<Record<string, string | undefined>>;

export type ServerCookie = {
  readonly name: string;
  readonly value: string;
  readonly options?: CookieOptions;
};

export type ServerCookieAdapter = {
  getAll(): { name: string; value: string }[];
  setAll(cookies: ServerCookie[]): void;
};

export function createServerSupabaseClient(
  cookies: ServerCookieAdapter,
  env: SupabaseEnv = process.env,
  // When set (e.g. ".clearkorea.com"), scopes the auth cookies to the shared
  // parent domain so the app and admin subdomains read the same session.
  cookieDomain?: string,
): SupabaseClientResult {
  const config = getSupabasePublicConfig(env);

  if (config.kind === "unconfigured") {
    return { status: "unconfigured", client: null };
  }

  return {
    status: "configured",
    client: createServerClient(config.projectUrl, config.publishableKey, {
      ...(cookieDomain ? { cookieOptions: { domain: cookieDomain } } : {}),
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (cookiesToSet) => cookies.setAll(cookiesToSet),
      },
    }),
  };
}
