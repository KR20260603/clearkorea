export type LaunchModeName = "production-launch" | "non-production";

export type LaunchMode = {
  readonly mode: LaunchModeName;
  readonly guestBypassEnabled: boolean;
};

type LaunchModeEnv = Readonly<Record<string, string | undefined>>;

export function getLaunchMode(env: LaunchModeEnv = process.env): LaunchMode {
  const isProduction = env.NODE_ENV === "production";

  return {
    mode: isProduction ? "production-launch" : "non-production",
    guestBypassEnabled:
      !isProduction && env.CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS === "true",
  };
}
