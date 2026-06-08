type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

export type NaverUserinfoResult =
  | { readonly kind: "ok"; readonly profile: Record<string, unknown> }
  | { readonly kind: "unauthorized" }
  | { readonly kind: "failed" };

// Supabase custom OAuth2 reads standard top-level userinfo claims (sub, email),
// but Naver's /v1/nid/me nests them under `response`. This proxy forwards the
// bearer token to Naver, exposes Naver's id as the standard `sub` claim, and
// passes `email` through at top level. The token is never logged or returned.
export async function resolveNaverUserinfo(input: {
  readonly authorization: string | null;
  readonly fetchImpl?: FetchImpl;
}): Promise<NaverUserinfoResult> {
  if (!input.authorization) {
    return { kind: "unauthorized" };
  }

  try {
    const response = await (input.fetchImpl ?? fetch)(
      "https://openapi.naver.com/v1/nid/me",
      { headers: { authorization: input.authorization } },
    );

    if (!response.ok) {
      return { kind: "failed" };
    }

    const data = (await response.json()) as {
      readonly resultcode?: string;
      readonly response?: Record<string, unknown>;
    };

    const profile = data.response;
    if (
      data.resultcode !== "00" ||
      profile === undefined ||
      typeof profile.id !== "string" ||
      profile.id.trim() === ""
    ) {
      return { kind: "failed" };
    }

    return { kind: "ok", profile: { ...profile, sub: profile.id } };
  } catch {
    return { kind: "failed" };
  }
}
