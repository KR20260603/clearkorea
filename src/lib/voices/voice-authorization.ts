import type { AppSessionIdentity } from "../auth/app-entry";
import { isGuestParticipationAllowed } from "../auth/guest-policy";

type VoiceAuthEnv = Readonly<Record<string, string | undefined>>;

export type VoiceWriteAuthorization =
  | { readonly allowed: true; readonly mode: "member" | "dev-guest" }
  | { readonly allowed: false; readonly reason: string };

export function authorizeVoiceWrite(input: {
  readonly session: AppSessionIdentity | null;
  readonly env?: VoiceAuthEnv;
}): VoiceWriteAuthorization {
  if (input.session) {
    return { allowed: true, mode: "member" };
  }

  if (isGuestParticipationAllowed(input.env)) {
    return { allowed: true, mode: "dev-guest" };
  }

  return { allowed: false, reason: "A linked Kakao or Naver account is required." };
}
