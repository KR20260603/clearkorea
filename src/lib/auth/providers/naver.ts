import type { AuthProvider } from "./types";

export const naverProvider: AuthProvider = {
  id: "naver",
  label: "Continue with Naver",
  startPath: "/auth/naver",
};

// Naver is registered in Supabase as a Custom OAuth2 provider (slug "naver" ->
// provider "custom:naver"), so it flows through the same Supabase authorize +
// /auth/callback path as Kakao. The app never holds Naver credentials, never
// exchanges the code, and never mints the session itself — Supabase owns it.
export function buildNaverAuthorizationUrl(input: {
  readonly supabaseUrl: string;
  readonly redirectTo: string;
}): string {
  const authorize = new URL("/auth/v1/authorize", input.supabaseUrl);
  authorize.searchParams.set("provider", "custom:naver");
  authorize.searchParams.set("redirect_to", input.redirectTo);
  return authorize.toString();
}
