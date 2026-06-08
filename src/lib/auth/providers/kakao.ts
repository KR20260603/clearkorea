import type { AuthProvider } from "./types";

export const kakaoProvider: AuthProvider = {
  id: "kakao",
  label: "Continue with Kakao",
  startPath: "/auth/kakao",
};
