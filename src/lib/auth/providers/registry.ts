import { kakaoProvider } from "./kakao";
import { naverProvider } from "./naver";
import type { AuthProvider, ProviderId } from "./types";

export const authProviders: readonly AuthProvider[] = [kakaoProvider, naverProvider];

export function getAuthProvider(id: string): AuthProvider | undefined {
  return authProviders.find((provider) => provider.id === (id as ProviderId));
}
