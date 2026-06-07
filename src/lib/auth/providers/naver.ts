import type { AuthProvider, ProviderIdentity } from "./types";

export const naverProvider: AuthProvider = {
  id: "naver",
  label: "Continue with Naver",
  startPath: "/auth/naver",
};

export function buildNaverAuthorizationUrl(input: {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly state: string;
}): string {
  const authorize = new URL("https://nid.naver.com/oauth2.0/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", input.clientId);
  authorize.searchParams.set("redirect_uri", input.redirectUri);
  authorize.searchParams.set("state", input.state);
  return authorize.toString();
}

export type NaverAuthorizationResponse = {
  readonly code: string;
  readonly state: string;
};

export function parseNaverAuthorizationResponse(
  params: URLSearchParams,
  expectedState: string,
): NaverAuthorizationResponse {
  const error = params.get("error");
  if (error) {
    throw new Error(`Naver authorization failed: ${error}`);
  }

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    throw new Error("Naver authorization response is missing code or state.");
  }

  if (state !== expectedState) {
    throw new Error("Naver authorization state mismatch.");
  }

  return { code, state };
}

type NaverProfile = {
  readonly resultcode?: string;
  readonly response?: { readonly id?: unknown };
};

export function identityFromNaverProfile(profile: unknown): ProviderIdentity {
  const candidate = profile as NaverProfile;

  if (candidate.resultcode !== "00") {
    throw new Error("Naver profile lookup was not successful.");
  }

  const subject = candidate.response?.id;
  if (typeof subject !== "string" || subject.trim() === "") {
    throw new Error("Naver profile is missing a stable user id.");
  }

  return { provider: "naver", subject };
}

type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

export type NaverTokenResult =
  | { readonly kind: "unavailable" }
  | { readonly kind: "ok"; readonly accessToken: string }
  | { readonly kind: "failed" };

// Deferred boundary: with no client credentials this returns unavailable and never hits the network.
export async function exchangeNaverCode(input: {
  readonly code: string;
  readonly state: string;
  readonly clientId: string | undefined;
  readonly clientSecret: string | undefined;
  readonly fetchImpl?: FetchImpl;
}): Promise<NaverTokenResult> {
  if (!input.clientId || !input.clientSecret) {
    return { kind: "unavailable" };
  }
  try {
    const url = new URL("https://nid.naver.com/oauth2.0/token");
    url.searchParams.set("grant_type", "authorization_code");
    url.searchParams.set("client_id", input.clientId);
    url.searchParams.set("client_secret", input.clientSecret);
    url.searchParams.set("code", input.code);
    url.searchParams.set("state", input.state);
    const response = await (input.fetchImpl ?? fetch)(url.toString(), {
      method: "POST",
    });
    const data = (await response.json()) as { access_token?: string };
    return typeof data.access_token === "string" && data.access_token.length > 0
      ? { kind: "ok", accessToken: data.access_token }
      : { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}

export async function fetchNaverIdentity(input: {
  readonly accessToken: string;
  readonly fetchImpl?: FetchImpl;
}): Promise<ProviderIdentity | null> {
  try {
    const response = await (input.fetchImpl ?? fetch)(
      "https://openapi.naver.com/v1/nid/me",
      { headers: { authorization: `Bearer ${input.accessToken}` } },
    );
    return identityFromNaverProfile(await response.json());
  } catch {
    return null;
  }
}
