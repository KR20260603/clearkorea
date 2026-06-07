import { getSupabasePublicConfig } from "../supabase/project";
import { buildKakaoAuthorizationUrl } from "./providers/kakao";
import { buildNaverAuthorizationUrl } from "./providers/naver";
import type { ProviderId } from "./providers/types";

type AuthFlowEnv = Readonly<Record<string, string | undefined>>;

export type ProviderStartLocation =
  | { readonly kind: "redirect"; readonly url: string; readonly state?: string }
  | { readonly kind: "unconfigured"; readonly reason: string };

export function buildProviderStartLocation(input: {
  readonly provider: ProviderId;
  readonly origin: string;
  readonly state: string;
  readonly env?: AuthFlowEnv;
}): ProviderStartLocation {
  const env = input.env ?? process.env;

  if (input.provider === "kakao") {
    const config = getSupabasePublicConfig(env);
    if (config.kind === "unconfigured") {
      return { kind: "unconfigured", reason: "supabase" };
    }
    return {
      kind: "redirect",
      url: buildKakaoAuthorizationUrl({
        supabaseUrl: config.projectUrl,
        redirectTo: `${input.origin}/auth/callback`,
      }),
    };
  }

  const clientId = env.SUPABASE_AUTH_NAVER_CLIENT_ID;
  if (clientId === undefined || clientId.trim() === "") {
    return { kind: "unconfigured", reason: "naver" };
  }

  return {
    kind: "redirect",
    state: input.state,
    url: buildNaverAuthorizationUrl({
      clientId,
      redirectUri: `${input.origin}/auth/naver/callback`,
      state: input.state,
    }),
  };
}

export type CodeExchanger = {
  readonly auth: {
    exchangeCodeForSession(
      code: string,
    ): PromiseLike<{ error: { message: string } | null }>;
  };
};

export async function resolveCallbackRedirect(input: {
  readonly code: string | null;
  readonly exchanger: CodeExchanger | null;
}): Promise<string> {
  if (!input.code) {
    return "/?auth=error";
  }

  if (!input.exchanger) {
    return "/?auth=unavailable";
  }

  const { error } = await input.exchanger.auth.exchangeCodeForSession(input.code);
  return error ? "/?auth=error" : "/app";
}

export type NaverLinkOutcome = "linked" | "unavailable" | "failed";

export type NaverBridge = {
  link(input: {
    readonly code: string;
    readonly state: string;
  }): Promise<NaverLinkOutcome>;
};

// Naver is a custom OAuth bridge (not a Supabase built-in provider), so its code
// is never passed to Supabase exchangeCodeForSession. The callback rejects any
// request whose CSRF state does not match the cookie before linking.
export async function resolveNaverCallback(input: {
  readonly code: string | null;
  readonly state: string | null;
  readonly expectedState: string | null;
  readonly bridge: NaverBridge | null;
}): Promise<string> {
  if (
    !input.state ||
    !input.expectedState ||
    input.state !== input.expectedState
  ) {
    return "/?auth=error";
  }
  if (!input.code) {
    return "/?auth=error";
  }
  if (!input.bridge) {
    return "/?auth=unavailable";
  }
  const outcome = await input.bridge.link({ code: input.code, state: input.state });
  if (outcome === "linked") {
    return "/app";
  }
  if (outcome === "unavailable") {
    return "/?auth=unavailable";
  }
  return "/?auth=error";
}
