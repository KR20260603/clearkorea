import type { ManagedRole } from "./roles";

export type ProviderIdentity = {
  readonly provider: string;
  readonly subject: string;
};

export type ResolvableRole = ManagedRole;

type RoleBootstrapEnv = Readonly<Record<string, string | undefined>>;

const oauthProviders = new Set(["kakao", "naver"]);

function parseProviderQualifiedIds(raw: string | undefined): ReadonlySet<string> {
  const ids = new Set<string>();
  if (raw === undefined) {
    return ids;
  }

  for (const part of raw.split(",")) {
    const entry = part.trim();
    const separatorIndex = entry.indexOf(":");
    if (separatorIndex <= 0 || separatorIndex === entry.length - 1) {
      continue;
    }

    const provider = entry.slice(0, separatorIndex).trim().toLowerCase();
    const subject = entry.slice(separatorIndex + 1).trim();
    if (!oauthProviders.has(provider) || subject === "") {
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
  if (!oauthProviders.has(provider)) {
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
