import type { AuthProvider } from "./types";

export const kakaoProvider: AuthProvider = {
  id: "kakao",
  label: "Continue with Kakao",
  startPath: "/auth/kakao",
};

export function buildKakaoAuthorizationUrl(input: {
  readonly supabaseUrl: string;
  readonly redirectTo: string;
}): string {
  const authorize = new URL("/auth/v1/authorize", input.supabaseUrl);
  authorize.searchParams.set("provider", "kakao");
  authorize.searchParams.set("redirect_to", input.redirectTo);
  return authorize.toString();
}
