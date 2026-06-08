// Extract the provider-qualified identity from a verified Supabase user so the
// login bootstrap can (a) store the row in public.users (enum column accepts
// 'kakao' | 'naver') and (b) resolve the admin allowlist (which keys Naver as
// 'custom:naver' because Naver logs in through a Supabase Custom OAuth provider).

export type ProviderIdentityDetails = {
  /** Key used by the admin allowlist resolver: matches SUPER/ADMIN_PROVIDER_IDS. */
  readonly resolverProvider: "kakao" | "custom:naver";
  /** Value stored in public.users.oauth_provider (enum: 'kakao' | 'naver'). */
  readonly columnProvider: "kakao" | "naver";
  /** The provider's stable subject (OAuth user id), not the Supabase uuid. */
  readonly subject: string;
};

type RawIdentity = {
  readonly provider?: string | null;
  readonly id?: string | null;
  readonly identity_data?: Record<string, unknown> | null;
} | null;

type RawUser = {
  readonly app_metadata?: { readonly provider?: string | null } | null;
  readonly identities?: ReadonlyArray<RawIdentity> | null;
} | null | undefined;

const providerMap = {
  kakao: { resolver: "kakao", column: "kakao" },
  "custom:naver": { resolver: "custom:naver", column: "naver" },
} as const;

type ProviderKey = keyof typeof providerMap;

function normalizeProvider(raw: string | null | undefined): ProviderKey | null {
  const value = (raw ?? "").trim().toLowerCase();
  if (value === "kakao") {
    return "kakao";
  }
  // Supabase reports the custom provider as "custom:naver"; tolerate a bare
  // "naver" identity row defensively.
  if (value === "custom:naver" || value === "naver") {
    return "custom:naver";
  }
  return null;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function subjectFromIdentity(identity: RawIdentity): string | null {
  if (!identity) {
    return null;
  }
  const data = identity.identity_data ?? {};
  return (
    asNonEmptyString(data.sub) ??
    asNonEmptyString(data.provider_id) ??
    asNonEmptyString(data.id) ??
    asNonEmptyString(identity.id)
  );
}

export function extractProviderIdentity(
  user: RawUser,
): ProviderIdentityDetails | null {
  if (!user) {
    return null;
  }

  const identities = Array.isArray(user.identities)
    ? user.identities.filter((identity): identity is NonNullable<RawIdentity> =>
        Boolean(identity),
      )
    : [];

  const candidates: Array<{ key: ProviderKey; identity: RawIdentity }> = [];

  const appKey = normalizeProvider(user.app_metadata?.provider);
  if (appKey) {
    const match =
      identities.find(
        (identity) => normalizeProvider(identity.provider) === appKey,
      ) ?? null;
    candidates.push({ key: appKey, identity: match });
  }

  for (const identity of identities) {
    const key = normalizeProvider(identity.provider);
    if (key) {
      candidates.push({ key, identity });
    }
  }

  for (const candidate of candidates) {
    // The admin allowlist subject must come only from the provider-set identity
    // (server-trusted). user_metadata is editable by the user via updateUser and
    // must never be trusted for role resolution.
    const subject = subjectFromIdentity(candidate.identity);
    if (subject) {
      const mapping = providerMap[candidate.key];
      return {
        resolverProvider: mapping.resolver,
        columnProvider: mapping.column,
        subject,
      };
    }
  }

  return null;
}
