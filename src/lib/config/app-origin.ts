type AppOriginEnv = Readonly<Record<string, string | undefined>>;

export function resolveAppOrigin(env: AppOriginEnv = process.env): string {
  return env.NEXT_PUBLIC_APP_ORIGIN?.trim() ?? "";
}

export function appAuthStartHref(env: AppOriginEnv = process.env): string {
  return `${resolveAppOrigin(env)}/auth/start`;
}
