import type { ManagedRole } from "./roles";

export type ProviderIdentity = {
  readonly provider: string;
  readonly subject: string;
};

export type ResolvableRole = ManagedRole;

type RoleBootstrapEnv = Readonly<Record<string, string | undefined>>;

// Kakao logs in through Supabase's built-in provider, so its identity provider
// string is "kakao". Naver logs in through a Supabase Custom OAuth provider, so
// Supabase reports its identity provider as "custom:naver" (with the subject from
// the "sub" claim). Allowlist entries are therefore "kakao:<subject>" or
// "custom:naver:<subject>". Provider prefixes can contain a colon, so we match by
// known prefix rather than splitting on the first colon.
const oauthProviders = ["kakao", "custom:naver"] as const;

type OAuthProvider = (typeof oauthProviders)[number];

function isOAuthProvider(value: string): value is OAuthProvider {
  return (oauthProviders as readonly string[]).includes(value);
}

function matchProviderPrefix(entryLower: string): OAuthProvider | undefined {
  return oauthProviders.find((provider) => entryLower.startsWith(`${provider}:`));
}

function parseProviderQualifiedIds(raw: string | undefined): ReadonlySet<string> {
  const ids = new Set<string>();
  if (raw === undefined) {
    return ids;
  }

  for (const part of raw.split(",")) {
    const entry = part.trim();
    const provider = matchProviderPrefix(entry.toLowerCase());
    if (provider === undefined) {
      continue;
    }

    const subject = entry.slice(provider.length + 1).trim();
    if (subject === "") {
      continue;
    }

    ids.add(`${provider}:${subject}`);
  }

  return ids;
}

export function resolveRoleForIdentity(
  identity: ProviderIdentity,
  env: RoleBootstrapEnv = process.env,
): ResolvableRole {
  const provider = identity.provider.toLowerCase();
  if (!isOAuthProvider(provider)) {
    return "user";
  }

  const key = `${provider}:${identity.subject}`;

  if (parseProviderQualifiedIds(env.SUPER_ADMIN_PROVIDER_IDS).has(key)) {
    return "super";
  }

  if (parseProviderQualifiedIds(env.ADMIN_PROVIDER_IDS).has(key)) {
    return "admin";
  }

  return "user";
}
