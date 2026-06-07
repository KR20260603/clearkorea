import { generateNickname } from "../nickname/generate-nickname";
import { isGuestParticipationAllowed } from "./guest-policy";

type AppEntryEnv = Readonly<Record<string, string | undefined>>;

export const authEntryPath = "/auth/start";

export type AppSessionIdentity = {
  readonly authUserId: string;
};

export type AppEntryDecision =
  | { readonly kind: "preview" }
  | { readonly kind: "member"; readonly nickname: string }
  | { readonly kind: "dev-guest"; readonly nickname: string }
  | { readonly kind: "redirect"; readonly to: string };

export function resolveAppEntry(input: {
  readonly supabaseConfigured: boolean;
  readonly session: AppSessionIdentity | null;
  readonly env?: AppEntryEnv;
  readonly guestKey?: string;
}): AppEntryDecision {
  if (!input.supabaseConfigured) {
    return { kind: "preview" };
  }

  if (input.session) {
    return { kind: "member", nickname: generateNickname(input.session.authUserId) };
  }

  if (isGuestParticipationAllowed(input.env)) {
    return {
      kind: "dev-guest",
      nickname: generateNickname(input.guestKey ?? "dev_guest:local"),
    };
  }

  return { kind: "redirect", to: authEntryPath };
}

export function shouldGateAppRequest(input: {
  readonly supabaseConfigured: boolean;
  readonly hasSession: boolean;
  readonly env?: AppEntryEnv;
}): boolean {
  if (!input.supabaseConfigured || input.hasSession) {
    return false;
  }

  return !isGuestParticipationAllowed(input.env);
}
