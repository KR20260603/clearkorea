export type CodeExchanger = {
  readonly auth: {
    exchangeCodeForSession(
      code: string,
    ): PromiseLike<{ error: { message: string } | null }>;
  };
};

// Shared callback for both providers: Supabase returns a PKCE code to
// /auth/callback, which is exchanged for a cookie-backed session. The OAuth
// start routes initiate the flow via supabase.auth.signInWithOAuth, which sets
// the PKCE code-verifier cookie that exchangeCodeForSession requires.
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
