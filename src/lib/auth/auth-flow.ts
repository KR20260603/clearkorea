import { getSupabasePublicConfig } from "../supabase/project";
import { buildKakaoAuthorizationUrl } from "./providers/kakao";
import { buildNaverAuthorizationUrl } from "./providers/naver";
import type { ProviderId } from "./providers/types";

type AuthFlowEnv = Readonly<Record<string, string | undefined>>;

export type ProviderStartLocation =
  | { readonly kind: "redirect"; readonly url: string }
  | { readonly kind: "unconfigured"; readonly reason: string };

// Both Kakao (Supabase built-in) and Naver (Supabase custom:naver provider) run
// through the Supabase authorize endpoint and return to /auth/callback, so the
// app never holds provider credentials, never exchanges codes, and never mints
// sessions itself. Supabase owns the OAuth flow and session for both.
export function buildProviderStartLocation(input: {
  readonly provider: ProviderId;
  readonly origin: string;
  readonly env?: AuthFlowEnv;
}): ProviderStartLocation {
  const env = input.env ?? process.env;
  const config = getSupabasePublicConfig(env);
  if (config.kind === "unconfigured") {
    return { kind: "unconfigured", reason: "supabase" };
  }

  const redirectTo = `${input.origin}/auth/callback`;
  const url =
    input.provider === "kakao"
      ? buildKakaoAuthorizationUrl({ supabaseUrl: config.projectUrl, redirectTo })
      : buildNaverAuthorizationUrl({ supabaseUrl: config.projectUrl, redirectTo });

  return { kind: "redirect", url };
}

export type CodeExchanger = {
  readonly auth: {
    exchangeCodeForSession(
      code: string,
    ): PromiseLike<{ error: { message: string } | null }>;
  };
};

// Shared callback for both providers: Supabase returns a code to /auth/callback,
// which is exchanged for a cookie-backed session.
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
  return error ? "/?auth=error" : "/";
}
