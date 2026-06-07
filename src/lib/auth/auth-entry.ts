import { isGuestParticipationAllowed } from "./guest-policy";
import { authProviders } from "./providers/registry";
import type { AuthProvider } from "./providers/types";

export const devGuestStartPath = "/auth/dev-guest";

export type DevGuestChoice = {
  readonly enabled: boolean;
  readonly path: string;
};

export type AuthEntryChoices = {
  readonly providers: readonly AuthProvider[];
  readonly devGuest: DevGuestChoice;
};

type AuthEntryEnv = Readonly<Record<string, string | undefined>>;

export function getAuthEntryChoices(
  env: AuthEntryEnv = process.env,
): AuthEntryChoices {
  return {
    providers: authProviders,
    devGuest: {
      enabled: isGuestParticipationAllowed(env),
      path: devGuestStartPath,
    },
  };
}
