const requiredPublicEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type RequiredPublicEnvKey = (typeof requiredPublicEnvKeys)[number];

type SupabaseEnv = Readonly<Record<string, string | undefined>>;

export const supabaseProjectRef = "ffranmygjhmbitmtlkiw";

export type SupabasePublicConfig =
  | {
      readonly kind: "configured";
      readonly projectUrl: string;
      readonly publishableKey: string;
    }
  | {
      readonly kind: "unconfigured";
      readonly missing: readonly RequiredPublicEnvKey[];
    };

export function getSupabasePublicConfig(
  env: SupabaseEnv = process.env,
): SupabasePublicConfig {
  const projectUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    projectUrl === undefined ||
    projectUrl.trim() === "" ||
    publishableKey === undefined ||
    publishableKey.trim() === ""
  ) {
    return {
      kind: "unconfigured",
      missing: requiredPublicEnvKeys.filter((key) => {
        const value = env[key];
        return value === undefined || value.trim() === "";
      }),
    };
  }

  return {
    kind: "configured",
    projectUrl: projectUrl.trim().replace(/\/$/, ""),
    publishableKey: publishableKey.trim(),
  };
}

export function isSupabaseConfigured(
  config: SupabasePublicConfig,
): config is Extract<SupabasePublicConfig, { readonly kind: "configured" }> {
  return config.kind === "configured";
}
