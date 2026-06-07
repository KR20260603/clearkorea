import { getLaunchMode } from "./launch-mode";

type GuestPolicyEnv = Readonly<Record<string, string | undefined>>;

export class GuestParticipationDeniedError extends Error {
  constructor(message = "Guest participation is disabled in launch mode.") {
    super(message);
    this.name = "GuestParticipationDeniedError";
  }
}

export function isGuestParticipationAllowed(
  env: GuestPolicyEnv = process.env,
): boolean {
  return getLaunchMode(env).guestBypassEnabled;
}

export function assertGuestAllowed(env: GuestPolicyEnv = process.env): void {
  if (!isGuestParticipationAllowed(env)) {
    throw new GuestParticipationDeniedError();
  }
}

export function shouldSetDevGuestGuc(env: GuestPolicyEnv = process.env): boolean {
  return isGuestParticipationAllowed(env);
}
