import { describe, expect, it } from "vitest";
import {
  GuestParticipationDeniedError,
  assertGuestAllowed,
  isGuestParticipationAllowed,
  shouldSetDevGuestGuc,
} from "./guest-policy";

const launchEnv = {
  NODE_ENV: "production",
  CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
};

const devBypassEnv = {
  NODE_ENV: "development",
  CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS: "true",
};

const devNoFlagEnv = {
  NODE_ENV: "development",
};

describe("auth launch guest policy", () => {
  it("denies guest participation in production launch mode even when the flag is set", () => {
    expect(isGuestParticipationAllowed(launchEnv)).toBe(false);
    expect(() => assertGuestAllowed(launchEnv)).toThrow(GuestParticipationDeniedError);
    expect(shouldSetDevGuestGuc(launchEnv)).toBe(false);
  });

  it("allows guest participation only in non-production with the explicit flag", () => {
    expect(isGuestParticipationAllowed(devBypassEnv)).toBe(true);
    expect(() => assertGuestAllowed(devBypassEnv)).not.toThrow();
    expect(shouldSetDevGuestGuc(devBypassEnv)).toBe(true);
  });

  it("denies guest participation in non-production when the flag is absent", () => {
    expect(isGuestParticipationAllowed(devNoFlagEnv)).toBe(false);
    expect(() => assertGuestAllowed(devNoFlagEnv)).toThrow(GuestParticipationDeniedError);
    expect(shouldSetDevGuestGuc(devNoFlagEnv)).toBe(false);
  });
});
