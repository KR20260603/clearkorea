export const POSTHOG_KEY_ENV = "NEXT_PUBLIC_POSTHOG_KEY";
export const POSTHOG_HOST_ENV = "NEXT_PUBLIC_POSTHOG_HOST";

export type PostHogConfig =
  | { readonly enabled: false }
  | { readonly enabled: true; readonly key: string; readonly host: string };

export function getPostHogConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
): PostHogConfig {
  const key = env[POSTHOG_KEY_ENV];
  const host = env[POSTHOG_HOST_ENV];
  if (!key || !host) {
    return { enabled: false };
  }
  return { enabled: true, key, host };
}

// Session replay never captures raw inputs or voice body text. Sensitive
// surfaces opt in with `data-ph-mask`; all inputs and textareas are masked.
export const postHogClientOptions = {
  autocapture: false,
  capture_pageview: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "[data-ph-mask], textarea",
  },
} as const;
